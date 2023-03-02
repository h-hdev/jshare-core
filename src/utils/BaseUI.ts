

class BaseUI {

	protected root: HTMLElement;
	protected el: HTMLElement;
	protected events: Function[] = [];

	constructor(root) {
		this.root = root;
	}



	destory() {
		this.events.forEach(e => {
			e();
		});

		this.events = null;
		this.root.removeChild(this.el);

		return null;
	}
}

export default BaseUI;