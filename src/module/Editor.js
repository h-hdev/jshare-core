
import CodeMirror from "codemirror";
// mode 
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';

// Fold
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/scroll/simplescrollbars';

// 
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/trailingspace';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/comment/continuecomment';

import autoFormatter from '../libs/autoFormatter';
autoFormatter(CodeMirror);

import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/scroll/simplescrollbars.css';
import '../css/codemirror.scss';

class Editor {
   constructor(panels, options, evenCallback) {
      this.panels = panels;
      this.options = options;
      this.evenCallback = evenCallback;

      this.MaxFormatLine = 500;

      this.init();
   }

   init() {
      let _this = this;
      for (let key in this.panels) {
         let panel = this.panels[key];

         if (!panel.isResult) {
            panel.editor = CodeMirror.fromTextArea(panel.textarea, {
               lineNumbers: true,
               mode: panel.mode === 'text/javascript' ? {
                  name: 'javascript',
                  json: true
               } : panel.mode,
               lineNumbers: this.options.lineNumbers,
               lineWrapping: this.options.lineWrapping,
               styleActiveLine: true,
               autoCloseBrackets: true,
               showCursorWhenSelecting: true,
               matchBrackets: true,
               indentUnit: this.options.tabSize,
               tabSize: this.options.tabSize,
               indentWithTabs: true,
               matchTags: { bothTags: false },
               readOnly: panel.readOnly,
               autoCloseTags: true,
               scrollbarStyle: 'overlay',
               keyMap: 'sublime',
               continueComments: true,
               // lint: true,
               gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
               foldGutter: true,
               extraKeys: {
                  'Ctrl-Enter': function (e) { // 运行操作
                     // _this.run();
                     _this.evenCallback('run');
                     return false;
                  },
                  "Ctrl-Q": function (cm) { // 折叠代码操作
                     cm.foldCode(cm.getCursor());
                  },
                  'F11': function (cm) { // 最大化当前编辑器
                     // _this.fullPage(cm.name);
                     _this.evenCallback('fullpage', cm.name);
                     return false;
                  },
                  'Ctrl-J': 'toMatchingTag',
                  'Ctrl-H': function (cm) { // 格式化代码
                     _this.format(cm);
                  }
               }
            });

            // HTML 代码支持 Emmet 特性
            //  if (name === 'html') {
            //    emmetCodeMirror(plane.obj);
            //  }
            panel.editor.name = key;
         }
      }

      this.setFontSize();

   }

   /**
    * 
    * @public
    * @param {*} key 
    * @param {*} value 
    */
   setOption(key, value) {
      this.options[key] = value;
      if (key === 'fontSize') {
         this.setFontSize();
      } else {
         let isTabSize = key === 'tabSize';
         for (let key in this.panels) {
            if (this.panels[key].editor) {
               if (isTabSize) {
                  this.panels[key].editor.setOption('tabSize', value)
                  this.panels[key].editor.setOption('indentUnit', value)
                  this.panels[key].editor.autoFormatRange(
                     { line: 0, ch: 0 },
                     { line: this.panels[key].editor.lineCount() }
                  );
               } else {
                  this.panels[key].editor.setOption(key, value);
               }
            }
         }
      }
   }

   setFontSize() {
      document.querySelectorAll('.CodeMirror').forEach(el => {
         el.style['font-size'] = this.options.fontSize;
      });
   }


   /**
    * 
    * @public
    * @param {*} data 
    */
   setValue(data) {
      for (let key in this.panels) {
         let panel = this.panels[key];
         if (panel.editor && data[key] !== undefined) {
            panel.editor.setValue(data[key]);
         }
      }
   }

   /**
    * 
    * @public
    * @param {*} autoFormt 
    * @returns 
    */
   getValue(autoFormt) {
      let result = {};
      for (let key in this.panels) {
         if (this.panels[key].editor) {

            if (autoFormt) {
               this.format(this.panels[key].editor)
            }
            result[key] = this.panels[key].editor.getValue()
         }
      }
      return result;
   }

   markClean() {
      for (let key in this.panels) {
         let panel = this.panels[key];
         if (panel.editor && !panel.readOnly) {
            panel.editor.markClean();
         }
      }
   }

   isClean() {
      for (let key in this.panels) {
         let panel = this.panels[key];
         if (panel.editor && !panel.readOnly) {
            if (!panel.editor.isClean()) {
               return false;
            }
         }
      }
      return true;
   }

   isFocused() {
      for (let key in this.panels) {
         let panel = this.panels[key];
         if (panel.editor && !panel.readOnly) {
            if (panel.editor.hasFocus()) {
               return true
            }
         }
      }
      return false;
   }

   format(editor) {
      let totalLine = editor.lineCount();

      
      if(totalLine > this.MaxFormatLine) {
         return false;
      }
      this.saveState(editor, () => {
         editor.autoFormatRange({ line: 0, ch: 0 }, { line: editor.lineCount() });
      });
      editor.markClean();
   }

   getCurrentEditor(editor) {
      this.currentEditor = {
         obj: editor,
         cursor: editor.getCursor(),
         focus: editor.hasFocus()
      };
   }

   saveState(editor, callback) {
      if(typeof editor === 'string') {
         editor = this.panels[editor].editor;
      }
      this.getCurrentEditor(editor);
      callback();
      this.updateCurrentEditor();
   }

   updateCurrentEditor() {
      if (this.currentEditor && this.currentEditor.focus) {
         this.currentEditor.obj.setCursor(this.currentEditor.cursor);
         if (!this.currentEditor.obj.hasFocus()) {
            this.currentEditor.obj.focus();
         }
      }
   }
}

export default Editor;