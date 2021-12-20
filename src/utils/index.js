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
   }
};

export default Utils;