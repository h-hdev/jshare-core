
interface DOMAttributes {
	[key: string]: string
}

export interface DOMStyles {
	[key: string]: string | null
};



const DOM = {

	append: function (
		parent: HTMLElement,
		tagName: string,
		classNames?: string | undefined | string[],
		innerHtml?: string | undefined,
		attributes?: DOMAttributes | undefined,
		styles?: DOMStyles | undefined
	) {
		let el: HTMLElement = document.createElement(tagName);
		if (classNames) {
			if (typeof classNames === 'object') {
				el.className = classNames.join(' ')
			} else {
				el.className = classNames;
			}
		}
		if (innerHtml) {
			el.innerHTML = innerHtml;
		}

		if (attributes) {
			Object.keys(attributes).forEach(key => {
				el.setAttribute(key, attributes[key]);
			});
		}

		DOM.setStyles(el, styles);

		parent.appendChild(el);

		return el;
	},

	addClass: function(el: HTMLElement, className: string | string[]) {
		el.className = typeof className === 'string' ? className : className.join(' ')

	},

	setStyles: function (el: HTMLElement, styles: DOMStyles | undefined) {
		if (styles) {
			Object.keys(styles).forEach(key => {
				if(styles[key] === null) {
					el.style.removeProperty(key);
				} else {
				el.style.setProperty(key, styles[key]);
				}
			});
		}
	},

	addEvent: function (el: HTMLElement, eventName: string, callback: EventListenerOrEventListenerObject) {
		el.addEventListener(eventName, callback, false)
		return () => {
			el.removeEventListener(eventName, callback, false)
		}
	},

	nodefault: function (e: MouseEvent) {
		e.stopPropagation();
		e.preventDefault();
		return false;
	}
};

export default DOM;