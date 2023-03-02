const Utils = {

	extend: (a: any, b: any) => {
		if (!a) {
			a = {};
		}

		if (!b) {
			return a;
		}

		for (let key in b) {
			a[key] = b[key];
		}
		return a;
	},

	JSONCopy(a: any) {
		return JSON.parse(JSON.stringify(a));
	},

	arrayCopy: function(target, src) {
		if(!target) {
			target = [];
		}
		src.forEach((s, i) => {
			if(i >= target.length) {
				target.push(Utils.simpleMerge(undefined, s))
			} else {
				target[i] = Utils.simpleMerge(undefined, s);
			}
		});
		return target;
	},


	simpleMerge: (a: any, b: any) => {

		// basic type
		if(typeof b !== 'object') {
			a = b;
			return a;
		}

		if (!a) {
			a = {};
		}

		if (!b) {
			return a;
		}

		for (let key in b) {
			if(b[key] === undefined) {
				a[key] = undefined;
				continue;
			}
			if(b[key].constructor.toString().includes('Array')) {
				a[key] = Utils.arrayCopy(a[key], b[key]);
			} else if (typeof b[key] === 'object') {
				a[key] = Utils.simpleMerge(a[key], Utils.JSONCopy( b[key]));
			} else {
				a[key] = b[key]
			}
		}

		return a;

	},

	dateformat: (timestamp?: number) => {
		var date = timestamp ? new Date(timestamp) : new Date(),
			year = date.getFullYear(),
			month = date.getMonth() + 1,
			day = date.getDate(),
			hours = date.getHours(),
			minutes = date.getMinutes(),
			seconds = date.getSeconds();
		return year + '-' + (month < 10 ? '0' + month : month) + '-' + (day < 10 ? '0' + day : day) + ' ' +
			(hours < 10 ? '0' + hours : hours) + ':' + (minutes < 10 ? '0' + minutes : minutes) + ':' + (seconds < 10 ? '0' + seconds : seconds);
	},

	isWebkit: navigator.userAgent.indexOf(' AppleWebKit/') > -1
};

export default Utils;