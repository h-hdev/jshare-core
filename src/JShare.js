import Utils from "./utils";
import Layout from "./layout";


class JShare {

   /**
    * 
    * @param {String | DOM} el 
    * @param {Object} data 
    * @param {Object} options 
    */
   constructor(el, data, options) {
      this.el = typeof el === 'string' ? document.getElementById(el) : el;

      this.data = data;

      this.options = Utils.extend({
         // HTML 文档模式
         doctype: 0,
         // Meta 信息
         meta: '',
         // 显示行号
         lineNumber: true,
         // 缩进
         space: 4,
         // 自动换行
         lineWrapper: false,
         // 字体
         fontSize: '12px',
         // 布局
         layout: 0,
         // 保存布局信息
         saveLayout: false,
         // 自动格式化代码
         autoFormt: true
      }, options);

      this.panels = {
         css: {

         },.
      };

      this.init();
   }

   init() {
      this.layout = new Layout(this.el, this.data && this.data.layout, this.panels);
   }

   initLayout() {

   }

   setData(data) {

   }

   setOptions(options) {

   }


}

export default JShare;