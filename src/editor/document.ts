import Utils from '../utils/index';

const DocTypes = [
	'<!DOCTYPE HTML>',
	'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01//EN" "http://www.w3.org/TR/html4/strict.dtd">',
	'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">',
	'<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Frameset//EN" "http://www.w3.org/TR/html4/frameset.dtd">',
	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">',
	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">',
	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Frameset//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-frameset.dtd">',
	'<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.1//EN" "http://www.w3.org/TR/xhtml11/DTD/xhtml11.dtd">'
];

const Document = {

	setOption: (key, value): boolean => {

		if(key === 'doctype') {
			if(value >=0 && value <= DocTypes.length -1) {
				return true;
			}
		} else if(key === 'meta' || key === 'autoFormt') {
			return true;
		}

		return false;
	},
	getDoctype: (index: number = 0) => {
		return DocTypes[index];
	},

	getMeta: (meta: string = '') => {
		return `<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="x-ua-compatible" content="ie=edge">
${meta}
<link rel="icon" href="https://static.jianshukeji.com/hcode/images/favicon.ico"></link>`
	},

	getCopyright() {
		return '<!--\n*************************************************************************\n' +
			'   Generated by JShare at ' + Utils.dateformat() + '\n' +
			'   From: ' + window.location.href + '\n' +
			'*************************************************************************\n -->\n';
	},

	getHTML: (data, options) => {
		return `${Document.getDoctype(options.doctype)}<html>
<head>
<meta charset="utf-8">
${Document.getMeta()}
<style>
${data.css}
</style>
</head>
<body>
${Document.getCopyright()}
${data.html}
<script>${data.javascript}</script>
</body>
</html>`
	}
};

export default Document;