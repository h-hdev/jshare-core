import Utils from "../utils";
import DOM from "../utils/DOM";


/**
 * Gutter Type, includes Horizontal and Vertical
 * 
 */
export enum GutterType {
	'Horizontal' = 'horizontal',
	'Vertical' = 'vertical'
};

/**
 * Gutter Options
 */
export interface GutterOptions {
	type: GutterType,  // type
	position: number,  //  positions
	styles: { [key: string]: string | null } // styles
};


interface Point {
	x: number,
	y: number
}

class Gutter {

	private root: HTMLElement;
	private options: GutterOptions;
	private callback: Function;

	private el: HTMLElement;

	private property: string = '';
	private isVertical: boolean = false;

	private isDragging: boolean = false;

	constructor(root: HTMLElement, options: GutterOptions, callback: Function) {
		this.root = root;

		this.options = Utils.extend({
			type: GutterType.Horizontal,
			position: 0,
			styles: {}
		}, options);

		this.isVertical = this.options.type === GutterType.Vertical;

		this.callback = callback;

		this.init();
	}

	private init() {

		this.el = DOM.append(this.root, 'div');

		this.setOptions();


		let mouseStart: Point;

		DOM.addEvent(this.el, 'mousedown', (e: MouseEvent) => {
			mouseStart = {
				x: e.clientX,
				y: e.clientY
			};
			this.onDragStart();
		});

		DOM.addEvent(document.body, 'mousemove', (e: MouseEvent) => {
			if (mouseStart) {
				this.onDragging({
					x: e.clientX - mouseStart.x,
					y: e.clientY - mouseStart.y
				});

				mouseStart = {
					x: e.clientX,
					y: e.clientY
				}

				this.isDragging = true;
				return DOM.nodefault(e);
			}
			
		});


		DOM.addEvent(document.body, 'mouseup', (e: MouseEvent) => {
			if (mouseStart) {
				mouseStart = undefined;
				this.isDragging = false;
				this.onDroped(e);
			}
		});
	}

	public setOptions(options?: GutterOptions) {
		if (options) {
			this.options = Utils.extend(this.options, options);
		}

		this.isVertical = this.options.type === GutterType.Vertical;
		this.property = this.isVertical ? 'top' : 'left';
		this.el.className = 'gutter gutter-' + this.options.type.toString() + (this.isDragging ? ' active' : '');

		this.options.styles[this.property] = this.options.position + '%';

		// reset styles
		['left', 'top', 'width', 'height'].forEach(key => {
			if (!this.options.styles[key]) {
				this.options.styles[key] = null;
			}
		});

		DOM.setStyles(this.el, this.options.styles);
	}

	private onDragStart() {
		document.body.classList.add(this.isVertical ? 'ns-dragging' : 'ew-dragging');
	}

	private onDragging(changed: Point) {

		let total = 0,
			change = 0;

		if (this.isVertical) {
			total = this.root.clientHeight;
			change = changed.y;

		} else {
			total = this.root.clientWidth
			change = changed.x;
		}
		this.callback(this.options, change / total * 100);
	}

	private onDroped(e: MouseEvent) {
		this.el.classList.remove('active');
		document.body.classList.remove(this.isVertical ? 'ns-dragging' : 'ew-dragging');
	}

}

export default Gutter;