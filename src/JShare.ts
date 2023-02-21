import Utils from "./utils";
import Layout from "./layout";
import Editor from "./editor/Editor";
import Document from './editor/document';

import { EditorOptions, EditorFontSize } from './editor/Editor';
import { CodeEditor } from "./editor/CodeEditor";

import { LayoutNameArr } from "./layout/layouts";


export type PanelKey = 'css' | 'javascript' | 'html' | 'result'


export function isResultPanel(panelKey: PanelKey) {
	return panelKey === 'result';
}

export interface Panel {
	key: string;
	name: string;
	mode: string;
	container?: HTMLElement,
	editor?: CodeEditor,
	data?: string,
	readOnly?: boolean
}

export type PanelOptions = {
	[key in PanelKey]: Panel;
};


export interface EditorData {
	html: string,
	javascript: string,
	css: string
}

interface HTMLData extends EditorData {
	js?: string,
	jsLibs: string,
	cssLibs: string,
};



interface JShareOptions {
	document: {
		doctype: number,
		// Meta 信息
		meta: string,
		// 自动格式化代码
		autoFormt: boolean
	},
	editor: EditorOptions,
	layout: {
		// 布局
		index: number,
		// 保存布局信息
		saveLayout: boolean,
	},
};

class JShare {

	static Layouts = LayoutNameArr;

	private el: HTMLElement;
	private data: HTMLData;
	private options: JShareOptions = {
		// HTML 文档模式
		document: {
			doctype: 0,
			// Meta 信息
			meta: '',
			// 自动格式化代码
			autoFormt: true
		},
		editor: {
			// 显示行号
			lineNumbers: true,
			// 缩进
			tabSize: 4,
			// 自动换行
			lineWrapping: false,
			// 字体
			fontSize: EditorFontSize["14px"]
		},
		layout: {
			// 布局
			index: 0,
			// 保存布局信息
			saveLayout: false,
		},

	};
	private layout: Layout;
	private editor: Editor | undefined;
	private panels: PanelOptions = {
		css: {
			key: 'css',
			mode: 'text/css',
			name: 'CSS'
		},
		javascript: {
			key: 'javascript',
			mode: 'text/javascript',
			name: 'Javascript'
		},
		html: {
			key: 'html',
			mode: 'text/html',
			name: 'HTML'
		},
		result: {
			key: 'result',
			mode: 'result',
			name: 'Result'
		}
	};
	private iframe: string;

	/**
	 * 
	 * @param {String | DOM} el 
	 * @param {Object} data 
	 * @param {Object} options 
	 */
	constructor(el: string | HTMLElement, data: HTMLData, options: JShareOptions) {
		this.el = typeof el === 'string' ? document.getElementById(el) : el;
		if (!this.el) {
			throw new Error('Error#1');
		}

		this.data = Utils.extend({
			cssLibs: '',
			css: '',
			javascript: '',
			jsLibs: '',
			html: '',
		}, data);

		// js is javascript alice
		if (data.js) {
			this.data.javascript = data.js;
		}


		for (let key in options) {
			if (this.options[key]) {
				Utils.extend(this.options[key], options[key]);
			}
		}
		this.init();

	}

	private init() {


		this.iframe = `<iframe id="ifr" sandbox="allow-forms allow-popups allow-scripts allow-same-origin${Utils.isWebkit ? ' allow-modals allow-downloads' : ''}"></iframe>`;



		// set data
		(Object.keys(this.panels) as PanelKey[]).forEach((key: PanelKey) => {
			if (key !== 'result') {
				this.panels[key].data = this.data[key] || '';
			}
		});

		// init Layout
		this.layout = new Layout(this.el, {
			index: this.options.layout.index,
			panels: this.panels
		});


		// init Editor
		this.editor = new Editor(this.panels, this.options.editor, (event: string, params: any) => {
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


	public run() {
		let html = this.generateHTML();
		if (!html) {
			return false;
		}

		let container = this.panels.result.container as HTMLElement;

		container.innerHTML = this.iframe as string;
		var previewFrame = container.childNodes[0] as HTMLIFrameElement,
			preview = (previewFrame.contentDocument || previewFrame.contentWindow?.document) as Document,
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

	private generateHTML(autoFormt?: boolean) {
		let result: EditorData = (this.editor as Editor).getValue(autoFormt);
		if (result.html === '' && result.css === '' && result.javascript === '') {
			return false;
		}
		return Document.getHTML(result, this.options.document);
	}

	public setData(data: EditorData) {
		this.editor.setValue(data);
	}

	public getData() : EditorData{
		return this.editor.getValue();
	}

	public setOption(key: string, value: string): boolean {
		for (let k in this.options) {
			if (this.options[k][key] !== undefined) {

				let isVerify = false;

				switch (k) {
					case 'document':
						isVerify = Document.setOption(key, value);
						if (isVerify) {
							this.run();
						}
						break;
					case 'layout':
						isVerify = this.layout.setOption(key, value);
						break;
					case 'editor':
						isVerify = this.editor.setOption(key, value);
						break;
				}


				if (isVerify) {
					this.options[k][key] = value;
				}
				return isVerify;
			}
		}

		return false;

		// for(let k in this.options) {
		// 	console.log(k);
		// }
		// let keys: string[] = key.split('.');

		// if (keys.length < 2) {
		// 	return false;
		// }


		// switch (keys[0]) {
		// 	case 'document':
		// 		this.options.document[keys[1]] = value;
		// 		this.run();
		// 		break;
		// 	case 'layout':
		// 		this.options.layout[keys[1]] = value;
		// 		this.layout.setOptions(this.options.layout);
		// 		break;
		// 	case 'editor':
		// 		this.options.editor[keys[1]] = value;
		// 		this.editor.setOption(keys[1], value);
		// 		break;
		// }

		return true;
	}

	public fullPage(name: string) {
		this.layout.fullPage(name);
	}

}

export default JShare;