const Utils = {

   extend: (a, b) => {
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

   dateformat: (timestamp) => {
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