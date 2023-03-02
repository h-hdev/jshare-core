import { CodeEditor } from "./CodeEditor";

import CM from "codemirror";
// mode 
import 'codemirror/mode/htmlmixed/htmlmixed';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/css/css';
import 'codemirror/mode/xml/xml';

// Fold
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/xml-fold';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/scroll/simplescrollbars';

// 
import 'codemirror/addon/selection/active-line';
import 'codemirror/addon/edit/trailingspace';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/edit/matchtags';
import 'codemirror/addon/edit/matchbrackets';
import 'codemirror/keymap/sublime';
import 'codemirror/addon/comment/comment';
import 'codemirror/addon/comment/continuecomment';

import emmet from '@emmetio/codemirror-plugin';
emmet(CM);

import autoFormatter from '../libs/autoFormatter';
autoFormatter(CM);



import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/monokai.css';
import 'codemirror/addon/fold/foldgutter.css';
import 'codemirror/addon/scroll/simplescrollbars.css';
import '../css/codemirror.scss';


import DOM from "../utils/DOM";


export default class CodeMirror extends CodeEditor {


	init() {

		let textarea: HTMLFormElement = DOM.append(this.container, 'textarea') as HTMLFormElement;
		textarea.innerHTML = this.panel.data || '';

		let _this = this;
		let extraKeys: { [key: string]: string | Function } = {
			'Ctrl-Enter': function (e) { // 运行操作
				_this.eventCallback('run', undefined);
				return false;
			},
			"Ctrl-Q": function (cm) { // 折叠代码操作
				cm.foldCode(cm.getCursor());
			},
			'F11': function (cm) { // 最大化当前编辑器
				_this.eventCallback('fullpage', _this.panel.key);
				return false;
			},
			'Ctrl-J': 'toMatchingTag',
			'Ctrl-H': function (cm) { // 格式化代码
				_this.format();
			},
			'Cmd-/': 'toggleComment',
			'Ctrl-/': 'toggleComment'
		}


		if (this.panel.key === 'html') {
			extraKeys['Tab'] = 'emmetExpandAbbreviation';
			extraKeys['Esc'] = 'emmetResetAbbreviation';
			extraKeys['Enter'] = 'emmetInsertLineBreak';
		}

		this.instance = CM.fromTextArea(textarea, {
			// mode: this.panel.mode === 'text/javascript' ? {
			// 	name: 'javascript',
			// 	// json: true
			// } : this.panel.mode,
			mode: this.panel.mode,
			lineNumbers: this.options.lineNumbers,
			lineWrapping: this.options.lineWrapping,
			styleActiveLine: true,
			autoCloseBrackets: true,
			showCursorWhenSelecting: true,
			matchBrackets: true,
			indentUnit: this.options.tabSize,
			tabSize: this.options.tabSize,
			indentWithTabs: true,
			matchTags: { bothTags: false },
			readOnly: this.panel.readOnly,
			autoCloseTags: true,
			scrollbarStyle: 'overlay',
			// keyMap: 'sublime',
			continueComments: true,
			// lint: true,
			gutters: ['CodeMirror-lint-markers', 'CodeMirror-linenumbers', 'CodeMirror-foldgutter'],
			foldGutter: true,
			extraKeys: extraKeys
		});

		this.format();
	}

	format() {
		let totalLine = this.instance.lineCount();

		if (totalLine > this.MaxFormatLine) {
			return false;
		}

		let state = null;
		if (this.instance.hasFocus()) {
			state = this.instance.getCursor();
		}

		this.instance.autoFormatRange({ line: 0, ch: 0 }, { line: totalLine });

		if (state) {
			this.instance.setCursor(state);
			this.instance.focus();
		}

		this.instance.markClean();

		return true;
	}


	setOption(key: string, value: any): boolean {
		this.instance.setOption(key, value);
		return true;
	}


	setValue(value: string) {
		this.instance.setValue(value);
		this.format();
	}

	public getValue(autoFormt?: boolean): string {
		if (autoFormt) {
			this.format();
		}
		return this.instance.getValue();
	}

};