import Utils from "../utils";
import DOM from "../utils/DOM";
import { LayoutOption, Layouts } from "./layouts";
import Panel from "./Panel";
import Gutter, { GutterType } from "./Gutter";

import { PanelKey, PanelOptions } from '../JShare';


export interface LayoutOptions {
	index: number,
	layout?: LayoutOption, // 
	panels?: PanelOptions
};



type PanelStyleKeys = 'left' | 'top' | 'width' | 'height' | 'order';

type PanelStyle = {
	[key in PanelStyleKeys]: number
};

type PanelStyleProperies = PanelStyleKeys[];


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
	panelResize(resizerOptions: any, value: any): false | number[] {


		let key = resizerOptions.key,
			target,
			nextTarget,
			targetValue,
			nextTargetvalue,
			limit = 20;

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

		targetValue = target[key[key.length - 1]] + value;
		nextTargetvalue = nextTarget[key[key.length - 1]] - value;


		if (targetValue < limit || nextTargetvalue < limit) {
			return false;
		}

		target[key[key.length - 1]] = targetValue;
		nextTarget[key[key.length - 1]] = nextTargetvalue;


		this.render();

		return [target, nextTargetvalue];
	}


	render() {

		let styles: PanelStyle = {
			left: 0,
			top: 0,
			width: 0,
			height: 0,
			order: 0
		},
			panel: string,
			panelOrder = 0,
			isFirstRender = false,
			isStack = false,

			isRow = this.options.layout[0].isRow,
			properties: PanelStyleProperies = isRow ?
				['left', 'top', 'width', 'height'] :
				['top', 'left', 'height', 'width'];



		if (!this.resizers) {
			this.resizers = [];
			isFirstRender = true;
		}


		this.resizerCount = 0;

		this.options.layout.forEach((column, i) => {


			isStack = column.stack;

			// if (isRow) {
			// 	styles.left = 0;
			// 	styles.height = column.size;
			// } else {
			// 	styles.width = column.size;
			// 	styles.top = 0;
			// }
			styles[properties[0]] = 0;
			styles[properties[3]] = column.size;


			column.items.forEach((row, j) => {

				panel = typeof row === 'object' ? row[0] : row;

				// styles[isRow ? 'width' : 'height'] = typeof row === 'object' ? row[1] : 100 / column.items.length;
				styles[properties[2]] = isStack ? 100 : (typeof row === 'object' ? row[1] : 100 / column.items.length);

				styles.order = panelOrder;
				this.renderPanel({
					key: panel,
					name: this.options.panels[panel].name,
					styles: styles,
					stack: isStack ? {
						active: j === column.active,
						group: i,
						index: j
					} : undefined,

				}, isFirstRender);


				// flex 布局排列顺序
				panelOrder++;


				// if (isRow) {
				// 	styles.left += styles.width;
				// } else {
				// 	styles.top += styles.height;
				// }
				if (!isStack) {
					styles[properties[0]] += styles[properties[2]];
				}

				if (!isStack && j !== column.items.length - 1) {

					this.renderGutter({
						type: isRow ? GutterType.Horizontal : GutterType.Vertical,
						// position: isRow ? styles.left : styles.top,
						position: styles[properties[0]],
						key: [i, 'items', j, 1],
						styles: {
							[properties[1]]: styles[properties[1]],
							[properties[3]]: styles[properties[3]]
						},
						// styles: isRow ? {
						// 	top: styles.top + '%',
						// 	height: styles.height + '%'
						// } : {
						// 	left: styles.left + '%',
						// 	width: styles.width + '%'
						// }

					}, isFirstRender);

				}
			});


			// if (isRow) {
			// 	styles.top += styles.height;
			// } else {
			// 	styles.left += styles.width;
			// }
			styles[properties[1]] += styles[properties[3]];

			if (i !== this.options.layout.length - 1) {

				this.renderGutter({
					type: isRow ? GutterType.Vertical : GutterType.Horizontal,
					key: [i, 'size'],
					// position: isRow ? styles.top : styles.left,
					position: styles[properties[1]],
					styles: {}
				}, isFirstRender);
			}
		});


		this.root.className = 'layout layout-' + (isRow ? GutterType.Horizontal : GutterType.Vertical)

		// TODO: Stack 模式下 resizer 数据会减少，需要删除多余的
		//console.log(this.resizerCount, this.resizers.length);
		let mius = this.resizers.length - this.resizerCount;
		while (mius > 0) {
			this.resizers[this.resizers.length - 1] = this.resizers[this.resizers.length - 1].destory();
			this.resizers.length -= 1;
			mius--;
		}
	}

	renderPanel(panelOptions, isFirstRender) {
		let panel = panelOptions.key;
		if (isFirstRender) {
			this.panels[panel] = new Panel(this.root, panelOptions, (event: string, target: any) => {
				if (event === 'stackActive') {
					this.options.layout[target.stack.group].active = target.stack.index;
				}
				for (let key in this.panels) {
					this.panels[key].syncState(event, target);
				}
			});
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
		let options = [],
			panelKeyMap = {
				r: 'result',
				c: 'css',
				h: 'html',
				j: 'javascript'
			};
		str.split(';').forEach(r => {
			let row = {
				size: 50,
				items: []
			};
			r.split(',').forEach(c => {
				if (c.length === 1) {
					row.items.push(panelKeyMap[c])
				} else {
					row.items.push([
						panelKeyMap[c[0]],
						parseFloat(c.substring(1))
					]);
				}
			});
			options.push(row);
		});

		return options;
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
			rowCount = column.items.length - 1;
			column.items.forEach((row, j) => {
				str += (typeof row === 'object' ? row[0][0] + row[1] : row[0]) + (j === rowCount ? '' : ',')
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