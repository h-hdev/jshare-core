import Utils from "../utils";
import DOM, { DOMStyles } from "../utils/DOM";


interface PanelOptions {
	name: string,
	styles: DOMStyles
};

class Panel {

	root: HTMLElement;

	options: PanelOptions;

	el: HTMLElement;

	container: HTMLElement | undefined;

	isMax: boolean = false;


	controls: HTMLElement;

	maximise: HTMLElement;

	constructor(root: HTMLElement, options: PanelOptions) {

		this.root = root;

		this.options = options;

		this.init();

		this.setOptions();
	}

	init() {


		this.el = DOM.append(this.root, 'div', 'panel panel-' + this.options.name, undefined,
			undefined, this.options.styles);

		let panelHeader = DOM.append(this.el, 'div', 'panel-header', '<h3>' + this.options.name + '</h3>');

		this.controls = DOM.append(panelHeader, 'ul', 'controls');

		this.maximise = DOM.append(this.controls, 'li', 'maximise');

		this.updateMaxState();

		this.container = DOM.append(this.el, 'div', 'panel-container');

		DOM.addEvent(this.controls, 'click', () => {
			this.toggleMax();
		});
	}

	toggleMax() {
		this.isMax = !this.isMax;
		this.updateMaxState();
	}

	updateMaxState() {
		this.el.classList[this.isMax ? 'add' : 'remove']('full');
		this.maximise.setAttribute('title', this.isMax ? '恢复大小': '最大化');
	}

	setOptions(options?: PanelOptions) {
		if (options) {
			this.options = Utils.extend(this.options, options);
		}
		for (let key in this.options.styles) {
			if (key === 'order') {
				continue;
			}
			this.options.styles[key] += '%';
		}
		DOM.setStyles(this.el, this.options.styles);

	}
}

export default Panel;