import GoldenLayout from 'golden-layout';
import Utils from '../utils';
import layouts from './layouts';
import 'golden-layout/src/css/goldenlayout-base.css';
import 'golden-layout/src/css/goldenlayout-light-theme.css';
import '../css/layout.scss';

class Layout {
   constructor(el, options, panels, callback) {
      this.el = el;

      // default Layout
      this.options = Utils.extend({
         index: 7,
         settings: {
            showPopoutIcon: false,
            popoutWholeStack: false,
            showCloseIcon: false
         },
         dimensions: {
            headerHeight: 24,
            borderWidth: 1,
            minItemHeight: 100,
            minItemWidth: 300,
            dragProxyWidth: 300,
            dragProxyHeight: 200
         },
         labels: {
            maximise: '最大化',
            minimise: '恢复大小'
         }
      }, options);

      this.panels = panels;

      this.callback = callback;

      this.init();

      
   }

   init() {


      this.options.content = this.options.content ?
         GoldenLayout.unminifyConfig(this.options.content) :
         layouts[this.options.index].content;

      this.layout = new GoldenLayout(this.options, this.el);

      let _this = this;
      this.layout.registerComponent('editor', function (container, state) {
         if (state.name) {
            _this.panels[state.name].container = container.getElement()[0];
         }

         container.on('tab', () => {
            console.log(state);
            _this.callback('run', true);
         });
      });


      this.layout.on('stackCreated', function (stack) {
         stack.on('activeContentItemChanged', function (contentItem) {
            let name = contentItem.config.componentState.name;
            if (name === 'result') {
               _this.callback('run', true);
            } else {
               _this.panels[name].editor && _this.panels[name].editor.focus();
            }
         });

         stack.on('maximised', function () {
            var maxItem = _this.layout._maximisedItem;
            if (maxItem.config.content[0].title === 'Result') {
               _this.callback('run');
            }
         });

         stack.on('minimised', function () {
            var minItem = stack.getActiveContentItem();
            if (minItem.config.title === 'Result') {
               _this.callback('run');
            }
         });
      })

      this.layout.init();
   }

   setLayout() {

   }

   getOptions() {
      return JSON.stringify(GoldenLayout.minifyConfig(this.layout.toConfig()));
   }

   reflow() {
      this.layout.updateSize();
   }

   fullPage(name, editors) {
      var rootItems = this.layout.root.contentItems[0],
         maxCi = null,
         ci = rootItems.getItemsByFilter(function (item) {
            if (item.isMaximised) {
               maxCi = item;
            }
            return item.type === 'component' && item.config.componentState.name === name;
         });


      if (maxCi && maxCi.length > 0 && maxCi[0].isComponent) {
         maxCi[0].toggleMaximise();
         return false;
      }

      if (ci.length > 0) {
         if (name === 'result') {
            ci[0].parent.toggleMaximise();
            return false;
         }

         editors.saveState(name, () => {
            ci[0].parent.toggleMaximise();
         })
      }
   }


}

export default Layout;