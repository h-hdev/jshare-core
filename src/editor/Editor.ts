

import { PanelKey, PanelOptions, isResultPanel } from '../JShare';
import CodeMirror from './CodeMirror';

export type EventCallback = (event: string, param: any) => void;


enum EditorTabSize {
	small = 2,
	middle = 3,
	larg = 4
}

// export type EditorFontSize = 
// 	'12px',
// 	'14px',
// 	'16px'
// };

// export type FontSize = '12px' | '14px' | '16px';

// const FontSize = ['12px', '13px', '14px', '16px'];

// export FontSize;

export interface EditorOptions {

	// 显示行号
	lineNumbers: boolean,
	// 缩进
	tabSize: EditorTabSize,
	// 自动换行
	lineWrapping: boolean,
	// 字体
	fontSize: string,
};

import {EditorData} from '../JShare';

class Editor {

	panels: PanelOptions;
	options: EditorOptions;
	eventCallback: EventCallback;
	MaxFormatLine: number = 500;

	constructor(panels: PanelOptions, options: EditorOptions, eventCallback: EventCallback) {
		this.panels = panels;
		this.options = options;
		this.eventCallback = eventCallback;
		this.init();
	}

	init() {
		(Object.keys(this.panels) as PanelKey[]).forEach(key => {
			let panel = this.panels[key];
			if (!isResultPanel(key)) {
				panel.editor = new CodeMirror(panel.container as HTMLElement, panel, this.options, this.eventCallback)
			}
		})

		this.setFontSize();
	}

	/**
	 * 
	 * @public
	 * @param {*} key 
	 * @param {*} value 
	 */
	setOption(key: string, value: any): boolean {

		if(this.options[key] === undefined) {
			return false;
		}
		this.options[key] = value;
		if (key === 'fontSize') {
			this.setFontSize();
		} else {
			let isTabSize = key === 'tabSize';
			for (let p in this.panels) {
				if (this.panels[p].editor) {
					if (isTabSize) {
						this.panels[p].editor.setOption('tabSize', value)
						this.panels[p].editor.setOption('indentUnit', value)
						// this.panels[p].editor.autoFormatRange(
						// 	{ line: 0, ch: 0 },
						// 	{ line: this.panels[p].editor.lineCount() }
						// );
					} else {
						this.panels[p].editor.setOption(key, value);
					}
				}
			}
		}
		return true;
	}



	setFontSize() {
		document.querySelectorAll('.CodeMirror').forEach((el: HTMLElement) => {
			el.style['font-size'] = this.options.fontSize;
		});
	}


	/**
	 * 
	 * @public
	 * @param {*} data 
	 */
	setValue(data: EditorData) {
		(Object.keys(this.panels) as PanelKey[]).forEach(key => {
			if(key != 'result' && data[key] !== undefined) {
				this.panels[key].editor.setValue(data[key]);
			}
		});
	}



	/**
	 * 
	 * @public
	 * @param {*} autoFormt 
	 * @returns 
	 */
	getValue(autoFormt?: boolean) : EditorData {
		let result: EditorData = {
			html: '',
			javascript: '',
			css: ''
		};


		(Object.keys(this.panels) as PanelKey[]).forEach(key => {
			if(key !== 'result') {
				result[key] = this.panels[key].editor.getValue() || '';
			}
		});
	
		return result;
	}

	
}

export default Editor;