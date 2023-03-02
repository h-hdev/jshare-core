
const Cookie = {

	getCookie: (name: string) : string | null => {
		let cookies = document.cookie ? document.cookie.split('; ') : [];
		if (!cookies.length) {
			return null
		}

		let parts = null;
		for (let i = 0; i < cookies.length; i++) {
			parts = cookies[i].split('=');
			if (parts[0] === name) {
				return decodeURIComponent(parts[1])
			}
		}
		return null;
	},

	setCookie: (name, value, expireDays) => {
		document.cookie = name + '=' + value + (expireDays ? ';expires=' + (new Date(Date.now() + expireDays * 864e5).toUTCString()) : '');
	}
};

export default Cookie;