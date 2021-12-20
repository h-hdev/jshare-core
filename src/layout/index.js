import GoldenLayout from 'golden-layout';
import Utils from '../utils';
import layouts from './layouts';
import 'golden-layout/src/css/goldenlayout-base.css';
import 'golden-layout/src/css/goldenlayout-light-theme.css';
import '../css/layout.scss';

class Layout {
   constructor(el, options, panels) {
      this.el = el;

      // default Layout
      this.options = Utils.extend({
         index: 0,
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

      this.init();
   }

   init() {


      this.options.content = this.options.content ?
         GoldenLayout.unminifyConfig(this.options.content) :
         layouts[this.options.index].content;


      this.layout = new GoldenLayout(this.options, this.el);

      this.layout.registerComponent('editor', function (container, state) {
         if (state.name) {
            this.panels[state.name].container = container.getElement();
         }
      });

      this.layout.init();

   }
}

export default Layout;