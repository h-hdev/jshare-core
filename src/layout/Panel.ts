import Utils from "../utils";
import DOM, { DOMStyles } from "../utils/DOM";


interface PanelOptions {
	key: string,
	name: string,
	styles: DOMStyles,
	stack: {
		active: boolean,
		group: number,
		index: number
	} | undefined
};



class Panel {

	root: HTMLElement;

	options: PanelOptions;

	el: HTMLElement;

	header: HTMLElement;

	container: HTMLElement | undefined;

	title: HTMLElement;

	isMax: boolean = false;

	controls: HTMLElement;

	maximise: HTMLElement;

	stack: boolean | undefined = undefined;


	callback: Function;

	constructor(root: HTMLElement, options: PanelOptions, callback) {

		this.root = root;

		this.options = Utils.JSONCopy(options);

		this.callback = callback;

		this.init();

		this.setOptions();
	}

	init() {


		this.el = DOM.append(this.root, 'div');

		this.header = DOM.append(this.el, 'div', 'panel-header');

		this.title = DOM.append(this.header, 'h3', undefined, this.options.name);

		this.controls = DOM.append(this.header, 'ul', 'controls');

		this.maximise = DOM.append(this.controls, 'li', 'maximise');

		this.updateMaxState();

		this.container = DOM.append(this.el, 'div', 'panel-container');


		// TODO: 同步状态
		DOM.addEvent(this.header, 'click', (e: MouseEvent) => {
			let target: HTMLElement = e.target as HTMLElement;
			if (this.options.stack) {
				if (target.tagName === 'H3') {
					// TODO: 同步状态
					this.callback('stackActive', this.options);
				} else if (target.tagName === 'LI') {
					this.callback('max', {
						isMax: !this.isMax,
						group: this.options.stack.group,
						index: this.options.stack.index
					});
				}
			} else if (target.tagName === 'LI') {
				this.toggleMax();
			}
		});
	}

	syncState(type, target) {
		if (type === 'max') {
			if (this.options.stack && this.options.stack.group === target.group) {
				this.toggleMax();
			}
		} else if (type === 'stackActive') {
			if (this.options.stack) {
				if (this.options.key === target.key) {
					this.options.stack.active = true;
					this.el.classList.add('active');
				} else[
					this.el.classList.remove('active')
				]
			}
		}
		return false;
	}



	toggleMax() {
		this.isMax = !this.isMax;
		this.updateMaxState();
	}

	updateMaxState() {
		this.el.classList[this.isMax ? 'add' : 'remove']('full');
		this.maximise.setAttribute('title', this.isMax ? '恢复大小' : '最大化');
	}


	setOptions(options?: PanelOptions) {
		if (options) {
			this.options = Utils.simpleMerge(this.options, options);
		}

		DOM.setStyles(this.title, {
			'--index': this.options.styles.order
		});

		let panelClass = ['panel'];
		if (this.options.stack) {
			panelClass.push('stacking');
			if (this.options.stack.active) {
				panelClass.push('active');
			}
		}
		DOM.addClass(this.el, panelClass);
		DOM.setStyles(this.el, this.options.styles);

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