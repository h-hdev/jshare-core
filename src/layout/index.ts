import Utils from "../utils";
import DOM from "../utils/DOM";
import  { LayoutOption, Layouts } from "./layouts";
import Panel from "./Panel";
import Gutter, { GutterType } from "./Gutter";

import { PanelKey, PanelOptions } from '../JShare';


export interface LayoutOptions {
	index: number,
	layout?: LayoutOption, // 
	panels?: PanelOptions
};

class Layout {

	el: HTMLElement;
	root: HTMLElement;
	resizeContainer: HTMLElement;

	options: LayoutOptions = { index: 0 };

	panels: { [key in PanelKey]: Panel } | {} = {};

	resizers: Gutter[] | undefined = undefined;

	resizerCount: number = 0;

	constructor(el: HTMLElement, options: LayoutOptions) {
		this.el = el;
		this.init();

		this.setOptions(options);
	}

	init() {
		this.root = DOM.append(this.el, 'div', 'layout');
	}

	/**
	 * 
	 * @param {*} resizerOptions 
	 * @param {*} value 
	 */
	panelResize(resizerOptions: any, value: any): boolean {

		let key = resizerOptions.key,
			target,
			nextTarget,
			targetValue,
			nextTargetvalue,
			limit = 20;//resizerOptions.type === 'v' ? 20 : 10;

		for (let i = 0; i < key.length - 1; i++) {
			if (!target) {

				if (i === key.length - 2) {
					nextTarget = this.options.layout[key[i] + 1];
				}
				target = this.options.layout[key[i]];
			} else {
				if (i === key.length - 2) {
					nextTarget = target[key[i] + 1]
				}
				target = target[key[i]]
			}
		}
		// target[key[key.length - 1]] += value;
		// nextTarget[key[key.length - 1]] -= value;

		targetValue = target[key[key.length - 1]] + value;
		nextTargetvalue = nextTarget[key[key.length - 1]] - value;


		if (targetValue < limit || nextTargetvalue < limit) {
			return false;
		}

		target[key[key.length - 1]] = targetValue;
		nextTarget[key[key.length - 1]] = nextTargetvalue;


		this.render();

		return true;
	}


	render() {

		let left = 0,
			width: number,
			height: number,
			top: number,
			panel: string,
			panelOrder = 0,
			isFirstRender = false;

		if (!this.resizers) {
			this.resizers = [];
			isFirstRender = true;
		}


		this.resizerCount = 0;

		this.options.layout.forEach((column, i) => {


			top = 0;
			width = column.width;
			column.rows.forEach((row, j) => {

				if (typeof row === 'object') {
					panel = row[0];
					height = row[1];
				} else {
					panel = row;
					height = 100 / column.rows.length;
				}

				this.renderPanel({
					key: panel,
					name: this.options.panels[panel].name,
					styles: {
						width: width,
						height: height,
						left: left,
						top: top,
						order: panelOrder
					}
				}, isFirstRender);


				// flex 布局排列顺序
				panelOrder++;


				top += height

				if (j !== column.rows.length - 1) {
					this.renderGutter({
						type: GutterType.Vertical,
						position: top,
						key: [i, 'rows', j, 1],
						styles: {
							left: left + '%',
							width: width + '%'
						},
					}, isFirstRender);

				}
			});


			left += width;


			if (i !== this.options.layout.length - 1) {
				this.renderGutter({
					type: GutterType.Horizontal,
					key: [i, 'width'],
					position: left,
					styles: {}
				}, isFirstRender);
			}
		});



		// TODO: Stack 模式下 resizer 数据会减少，需要删除多余的
		//console.log(this.resizerCount, this.resizers.length);
		// if (this.resizerCount < this.resizers.length) {

		// }
	}

	renderPanel(panelOptions, isFirstRender) {
		let panel = panelOptions.key;
		if (isFirstRender) {
			this.panels[panel] = new Panel(this.root, panelOptions);
			this.options.panels[panel].container = this.panels[panel].container;
		} else {
			this.panels[panel].setOptions(panelOptions);
		}
	}

	renderGutter(resizerOptions, isFirstRender) {
		if (isFirstRender || this.resizers.length <= this.resizerCount) {
			this.resizers.push(
				new Gutter(this.root, resizerOptions, (rOptions, value) => {
					this.panelResize(rOptions, value)
				})
			)
		} else {
			this.resizers[this.resizerCount].setOptions(resizerOptions);
		}
		this.resizerCount++;
	}

	update(index: number) {
		this.setOptions({
			index: index
		})
	}

	setOptions(options: LayoutOptions) {
		this.options = Utils.extend(this.options, options);
		this.options.layout = Layouts[this.options.index];
		this.render();
	}

	setOption(key: string, value: any): boolean {
		if (key === 'index') {
			if (value >= 0 && value <= Layouts.length - 1) {
				this.update(value);
				return true;
			}
		}
		return false;
	}

	/**
	 * Layout String parse to object
	 * @param {*} str 
	 */
	parse(str: string) {
		console.log(this.options.layout);
	}

	/**
	 * Layout options object to string
	 * 
	 */
	minify(): string {
		let str = '';
		let columnCount = this.options.layout.length - 1,
			rowCount = 0;

		this.options.layout.forEach((column, i) => {
			rowCount = column.rows.length - 1;
			column.rows.forEach((row, j) => {
				str += (typeof row === 'object' ? row[0][0] + row[1] : row) + (j === rowCount ? '' : ',')
			});
			if (i < columnCount) {
				str += ';';
			}
		});
		return str;
	}

	fullPage(name: string) {
		this.panels[name].toggleMax();
	}

}

export default Layout;