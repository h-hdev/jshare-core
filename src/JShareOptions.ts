import Document from './editor/document';

import { LayoutNameArr } from "./layout/layouts";

interface Option {
	key: string,
	value: any,
	name: string,
	type: 'list' | 'boolean' | 'string' | 'layout',
	items?: string[] | number[] | object[],
	placeholder?: string,
	indexValue?: boolean
};

interface OptionGroup {
	name: string,
	items: Option[]
}

interface Options {
	[key: string]: OptionGroup
}


const JShareMetaData: Options = {
	document: {
		name: '',
		items: [{
			key: 'doctype',
			value: 0,
			name: 'HTML 文档模式',
			type: 'list',
			indexValue: true,
			items: Document.getDoctypeNames()
		}, {
			key: 'meta',
			name: 'Meta 标签',
			type: 'string',
			placeholder: "eg. <meta> <link> <script>",
			value: ''
		}]
	},
	editor: {
		name: '编辑器',
		items: [{
			key: 'lineNumbers',
			type: 'boolean',
			value: true,
			name: '显示行号'
		}, {
			key: 'fontSize',
			items: ['12px', '13px', '14px', '16px'],
			value: '12px',
			name: '字号',
			type: 'list'
		}, {
			key: 'lineWrapping',
			type: 'boolean',
			name: '自动换行',
			value: false
		}, {
			key: 'tabSize',
			name: '缩进',
			items: [2, 3, 4],
			value: 4,
			type: 'list'
		}]
	},
	layout: {
		name: '布局',
		items: [{
			type: 'layout',
			key: 'index',
			value: 0,
			name: '',
			items: LayoutNameArr
		}]
	}
};


let defaultOptions: any = {};
for (let key in JShareMetaData) {
	defaultOptions[key] = {};
	JShareMetaData[key].items.forEach(item => {
		defaultOptions[key][item.key] = item.value;
	});
}


export { defaultOptions }

export { JShareMetaData }
