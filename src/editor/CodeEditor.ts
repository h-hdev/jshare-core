


import { EditorOptions, EventCallback } from './Editor';
import {Panel} from '../JShare';




/**
 * CodeEditor base class
 */
export class CodeEditor {

	protected container: HTMLElement;
	protected panel: Panel;
	protected options: EditorOptions;

	protected MaxFormatLine: number = 500;

	protected eventCallback: EventCallback;

	protected instance: any

	/**
	 * 
	 * @param container 
	 * @param panel string 
	 * @param options 
	 */
	constructor(container: HTMLElement, panel: Panel, options: EditorOptions, eventCallback: EventCallback) {
		this.container = container;
		this.panel = panel;
		this.options = options;
		this.eventCallback = eventCallback;
		this.init();
	}

	protected init() {

	}

	public setValue(value: string) {

	}

	public getValue(autoFormt?: boolean): string {
		return '';
	}
}