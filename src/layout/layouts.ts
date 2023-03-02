import { PanelKey } from "../JShare";

export type LayoutItem = [PanelKey, number] | PanelKey;


export interface Column {
	size: number,
	isRow?: boolean,
	items: LayoutItem[],
	stack?: boolean,
	active?: number
};

export type LayoutOption = Column[];

export interface layout {
	name: string,
	class: string,
	options?: LayoutOption
};


const layouts: layout[] = [{
	name: '经典',
	class: 'classic',
	options:
		[
			{
				size: 50,
				items: [
					['javascript', 70],
					['html', 30]
				],
			},
			{
				size: 50,
				items: [
					['result', 70],
					['css', 30]
				]
			}
		]
}, {
	name: '左右',
	class: 'lr',
	options:
		[
			{
				size: 50,
				items: [
					['javascript', 40],
					['html', 30],
					['css', 30]
				],
			},
			{
				size: 50,
				items: [
					['result', 100],
				]
			}
		]
}, {
	name: '上下',
	class: 'tb',
	options: [
		{
			isRow: true,
			size: 50,
			items: [
				['javascript', 33.3],
				['css', 33.3],
				['html', 33.3]
			]
		}, {
			isRow: true,
			size: 50,
			items: [
				'result'
			]
		}
	]
}, {
	name: '左右 Tab',
	class: 'lr-stack',
	options: [
		{
			size: 50,
			stack: true,
			active: 0,
			items: [
				'javascript',
				'css',
				'html'
			]
		}, {
			size: 50,
			items: [
				'result'
			]
		}
	]
}, {
	name: '上下 Tab',
	class: 'tb-stack',
	options: [
		{
			size: 50,
			stack: true,
			active: 0,
			isRow: true,
			items: [
				'javascript',
				'css',
				'html'
			]
		}, {
			isRow: true,
			size: 50,
			items: [
				'result'
			]
		}
	]
}, {
	name: '横向',
	class: 'columns',
	options:
		[
			{
				size: 25,
				items: [
					'javascript'
				]
			},
			{
				size: 25,
				items: [
					'html'
				]
			},
			{
				size: 25,
				items: [
					'css'
				]
			},
			{
				size: 25,
				items: [
					'result'
				]
			}
		]
}, {
	name: '纵向',
	class: 'rows',
	options:
		[
			{
				size: 25,
				isRow: true,
				items: [
					'javascript'
				]
			},
			{
				isRow: true,
				size: 25,
				items: [
					'html'
				]
			},
			{
				isRow: true,
				size: 25,
				items: [
					'css'
				]
			},
			{
				isRow: true,
				size: 25,
				items: [
					'result'
				]
			}
		]
}];

const LayoutNameArr: { name: string, class: string }[] = [],
	Layouts: LayoutOption[] = [];


layouts.forEach(l => {
	LayoutNameArr.push({
		name: l.name,
		class: l.class
	});

	Layouts.push(l.options);
});


export { Layouts, LayoutNameArr };