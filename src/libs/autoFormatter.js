// CodeMirror 代码格式化插件，见：http://stackoverflow.com/questions/25109809/codemirror-auto-format-after-setvalue
export default CodeMirror => {
   CodeMirror.defineExtension('autoFormatRange', function (from, to) {
      var cm = this;
      var outer = cm.getMode(),
         text = cm.getRange(from, to).split('\n');
      var state = CodeMirror.copyState(outer, cm.getTokenAt(from).state);
      var tabSize = cm.getOption('tabSize');
      var out = '',
         lines = 0,
         atSol = from.ch === 0,
         textLength = text.length - 1;

      function newline() {
         out += '\n';
         atSol = true;
         ++lines;
      }

      for (var i = 0; i < text.length; ++i) {
         var stream = new CodeMirror.StringStream(text[i], tabSize);
         while (!stream.eol()) {
            var inner = CodeMirror.innerMode(outer, state);
            var style = outer.token(stream, state),
               cur = stream.current();
            stream.start = stream.pos;
            if (!atSol || /\S/.test(cur)) {
               out += cur;
               atSol = false;
            }
            if (!atSol && inner.mode.newlineAfterToken &&
               inner.mode.newlineAfterToken(style, cur, stream.string.slice(stream.pos) || text[i + 1] || '', inner.state)) {

               newline();
            }
         }
         if (!stream.pos && outer.blankLine) {
            outer.blankLine(state);
         }
         if (!atSol && i !== textLength) {
            newline();
         }
      }

      cm.operation(function () {
         cm.replaceRange(out, from, to);
         for (var cur = from.line + 1, end = from.line + lines; cur <= end; ++cur) {
            cm.indentLine(cur, 'smart');
         }
      });
   });

   // Applies automatic mode-aware indentation to the specified range
   CodeMirror.defineExtension('autoIndentRange', function (from, to) {
      var cmInstance = this;
      this.operation(function () {
         for (var i = from.line; i <= to.line; i++) {
            cmInstance.indentLine(i, 'smart');
         }
      });
   });

}