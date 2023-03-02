import Utils from "./utils";
import Layout from "./layout";
import Editor from "./editor/Editor";
import Document from './editor/document';

import { EditorOptions } from './editor/Editor';
import { CodeEditor } from "./editor/CodeEditor";

import { defaultOptions, JShareMetaData } from './JShareOptions';

import Cookie from './libs/cookie';


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

	// static config = JShareMetaData;


	private el: HTMLElement;
	private data: HTMLData;


	private options: JShareOptions = defaultOptions;
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

	private optionsStoreName: string = 'jshare_options';

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

		// restore options from cookie
		this.restoreOptions();

		// set user's options
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

	public getData(): EditorData {
		return this.editor.getValue();
	}

	public setOption(key: string, value: string): boolean {

		let keys = key.split('.');
		if (keys.length !== 2) {
			return false;
		}

		let isVerify = false;

		switch (keys[0]) {
			case 'document':
				isVerify = Document.setOption(keys[1], value);
				break;
			case 'layout':
				isVerify = this.layout.setOption(keys[1], value);
				break;
			case 'editor':
				isVerify = this.editor.setOption(keys[1], value);
				break;
		}


		if (isVerify) {
			this.options[keys[0]][keys[1]] = value;
			if (keys[0] !== 'document') {
				this.storeOptions({
					[keys[0]]: {
						[keys[1]]: value
					}
				})
			} else {
				this.run();
			}
		}

		return isVerify;
	}


	private getStore(): object {
		let cookieStr: string = Cookie.getCookie(this.optionsStoreName);
		if (!cookieStr) {
			return null;
		}

		try {
			let cookie: object = JSON.parse(cookieStr);
			return cookie;
		} catch (err) {

		}
		return null;
	}

	private storeOptions(value: object): void {
		let cookie = this.getStore() || {};
		for (let key in value) {
			if (cookie[key] === undefined) {
				cookie[key] = value[key];
			} else {
				Utils.extend(cookie[key], value[key]);
			}
		}
		Cookie.setCookie(this.optionsStoreName, JSON.stringify(cookie), 365);
	}

	private restoreOptions() {
		let cookie = this.getStore();
		if (cookie) {
			for (let key in this.options) {
				if (cookie[key]) {
					Utils.extend(this.options[key], cookie[key]);
				}
			}
		}
	}

	public fullPage(name: string) {
		this.layout.fullPage(name);
	}

	public getConfig(): any {
		for (let key in JShareMetaData) {
			JShareMetaData[key].items.forEach(item => {
				item.value = this.options[key][item.key]
			});
		}

		return JShareMetaData;
	}
}

export default JShare;