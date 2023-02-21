import { CodeEditor } from "./CodeEditor";

import { autocompletion, closeBrackets, closeBracketsKeymap, completionKeymap } from '@codemirror/autocomplete'
import { defaultKeymap, history, historyKeymap } from '@codemirror/commands'

import { bracketMatching, defaultHighlightStyle, foldGutter, foldKeymap, indentOnInput, syntaxHighlighting } from '@codemirror/language'
import { lintKeymap } from '@codemirror/lint'
import { highlightSelectionMatches, searchKeymap } from '@codemirror/search'
import { EditorState } from '@codemirror/state'
import { 
	crosshairCursor, 
	drawSelection, 
	dropCursor, 
	EditorView, 
	// highlightActiveLine, 
	highlightActiveLineGutter, 
	highlightSpecialChars, 
	keymap, 
	lineNumbers, 
	rectangularSelection 
} from '@codemirror/view'
import { javascript } from '@codemirror/lang-javascript';
import { css } from '@codemirror/lang-css';
import { html } from '@codemirror/lang-html';


const modelMap = {
	javascript: javascript,
	html: html,
	css: css
};


class CodeMirror extends CodeEditor {

	private editor;

	init() {
		console.log(this.panel.name);


		this.editor = new EditorView({
			state: EditorState.create({
				doc: this.panel.data,
				tabSize: 2,
				readOnly: true,
				extensions: [
					lineNumbers(),
					highlightActiveLineGutter(),
					highlightSpecialChars(),
					history(),
					foldGutter(),
					drawSelection(),
					dropCursor(),
					EditorState.allowMultipleSelections.of(true),
					indentOnInput(),
					syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
					bracketMatching(),
					closeBrackets(),
					autocompletion(),
					// rectangularSelection(),
					crosshairCursor(),
					// highlightActiveLine(),
					highlightSelectionMatches(),
					keymap.of([
						...closeBracketsKeymap,
						...defaultKeymap,
						...searchKeymap,
						...historyKeymap,
						...foldKeymap,
						...completionKeymap,
						...lintKeymap,
					]),
					modelMap[this.panel.name.toLowerCase()]()
				],
			}),
			parent: this.container
		})
	}

	public getValue(autoFormt?: boolean): string {
		return this.editor;
	}

	public setValue(value: string): void {

	}
}

export default CodeMirror;