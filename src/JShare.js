import Utils from "./utils";
import Layout from "./layout";
import Editor from "./module/Editor";
import Document from './module/document';


class JShare {

   /**
    * 
    * @param {String | DOM} el 
    * @param {Object} data 
    * @param {Object} options 
    */
   constructor(el, data, options) {
      this.el = typeof el === 'string' ? document.getElementById(el) : el;

      this.data = Utils.extend({
         cssLibs: '',
         css: '',
         javascript: '',
         jsLibs: '',
         html: '',
      }, data);

      if (data.js) {
         this.data.javascript = data.js;
      }

      if (this.data.html) {
         this.data.html = this.data.html.replace(/\</g, '&lt;')
      }


      this.options = Utils.extend({
         // HTML 文档模式
         doctype: 0,
         // Meta 信息
         meta: '',
         // 显示行号
         lineNumbers: true,
         // 缩进
         tabSize: 4,
         // 自动换行
         lineWrapping: false,
         // 字体
         fontSize: '12px',
         // 布局
         layout: 0,
         // 保存布局信息
         saveLayout: false,
         // 自动格式化代码
         autoFormt: true
      }, options);

      this.editorOptions = {};

      [
         'lineNumbers',
         'lineWrapping',
         'tabSize',
         'fontSize'
      ].forEach(key => {
         this.editorOptions[key] = this.options[key];
      });

      this.documentOptions = ['doctype', 'meta']


      this.panels = {
         css: {
            mode: 'text/css'
         },
         javascript: {
            mode: 'text/javascript'
         },
         html: {
            mode: 'text/html'
         },
         result: {
            isResult: true
         }
      };

      this.init();
   }

   init() {
      this.layout = new Layout(this.el, this.data && this.data.layout, this.panels, (event, needCheck) => {
         if (this.editors) {
            if (this.layoutChangeTimer) {
               clearTimeout(this.layoutChangeTimer);
            }
            this.layoutChangeTimer = setTimeout(() => {
               if (needCheck) {
                  let iframe = this.panels.result.container.childNodes[0]
                  if (!iframe) {
                     return false;
                  }
                  let innerHTML = iframe.contentDocument.documentElement.innerHTML;
                  if (innerHTML.length > 26 || innerHTML !== '<head></head><body></body>') {
                     return false;
                  }
               }
               this.run();
            }, 200);
         }
      });


      for (let key in this.panels) {
         if (!this.panels[key].isResult) {
            let textarea = document.createElement('textarea');
            textarea.innerHTML = this.data[key] || '';
            this.panels[key].textarea = textarea;
            this.panels[key].container.appendChild(textarea);
         } else {
            this.iframe = `<iframe id="ifr" sandbox="allow-forms allow-popups allow-scripts allow-same-origin${Utils.isWebkit ? ' allow-modals allow-downloads' : ''}"></iframe>`;
         }
      }

      this.editors = new Editor(this.panels, this.editorOptions, (event, params) => {
         console.log(event, params);
         switch (event) {
            case 'run':
               this.run();
               break;
            case 'fullpage':
               this.fullPage(params);
               break;
         }
      });

      this.run();
   }

   run() {
      let html = this.generateHTML();
      if (!html) {
         return false;
      }


      this.panels.result.container.innerHTML = this.iframe;
      var previewFrame = this.panels.result.container.childNodes[0],
         preview = previewFrame.contentDocument || previewFrame.contentWindow.document,
         win = previewFrame.contentWindow;
      // TODO: Console
      // https://github.com/jsbin/jsbin/blob/master/public/js/runner/runner.js
      // see proxy-console.js
      // win.console = proxyConsole;
      preview.open();
      preview.write(html);
      preview.close();

      return false;

   }

   generateHTML(autoFormt) {
      let result = this.editors.getValue(autoFormt);
      if (result.html === '' && result.css === '' && result.javascript === '') {
         return false;
      }
      return Document.getHTML(result, this.options);
   }

   setData(data) {

   }

   setOption(key, value) {
      if (value === undefined) {
         return;
      }

      // Editor Options
      if (this.editorOptions[key] !== undefined) {
         this.editorOptions[key] = value;
         this.editors.setOption(key, value);
      } else {
         this.options[key] = value;
         if (this.documentOptions.includes(key)) {
            this.run();
         }
      }
   }

   fullPage(name) {
      this.layout.fullPage(name, this.editors);
   }

}

export default JShare;