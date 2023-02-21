import { PanelKey } from "../JShare";

export type Row = [PanelKey, number] | PanelKey;


export interface Column {
	width: number,
	rows: Row[]
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
				width: 50,
				rows: [
					['javascript', 70],
					['html', 30]
				],
			},
			{
				width: 50,
				rows: [
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
				width: 50,
				rows: [
					['javascript', 40],
					['html', 30],
					['css', 30]
				],
			},
			{
				width: 50,
				rows: [
					['result', 100],
				]
			}
		]
}, {
	name: '横向',
	class: 'columns',
	options:
		[
			{
				width: 25,
				rows: [
					'javascript'
				]
			},
			{
				width: 25,
				rows: [
					'html'
				]
			},
			{
				width: 25,
				rows: [
					'css'
				]
			},
			{
				width: 25,
				rows: [
					'result'
				]
			}
		]
}];


const LayoutNameArr = [],
	Layouts : LayoutOption[] = [];


	layouts.forEach(l => {
		LayoutNameArr.push({
			name: l.name,
			class: l.class
		});

		Layouts.push(l.options);
	});


export  { Layouts, LayoutNameArr};