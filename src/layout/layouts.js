export default {
   "0": {
      // j|r,60_h/c
      icon: "defult",
      deg: 0,
      sort: 0,
      content: [{
         type: 'row',
         content: [{
            type: 'column',
            content: [{
               type: 'component',
               id: 'javascript',
               componentName: 'editor',
               title: 'JavaScript',
               componentState: {
                  name: 'javascript'
               }
            }]
         }, {
            type: 'column',
            content: [{
               type: 'component',
               componentName: 'editor',
               title: 'Result',
               height: 60,
               id: 'result',
               componentState: {
                  name: 'result'
               }
            }, {
               type: 'stack',
               content: [{
                  type: 'component',
                  title: 'HTML',
                  id: 'html',
                  componentName: 'editor',
                  componentState: {
                     name: 'html'
                  }
               }, {
                  type: 'component',
                  componentName: 'editor',
                  title: 'CSS',
                  id: 'css',
                  componentState: {
                     name: 'css'
                  }
               }]
            }]
         }]
      }]
   },
   "7": {
      // j,75_h|r,75_c
      icon: "equ-revert",
      deg: 0,
      sort: 1,
      content: [{
         type: 'row',
         content: [{
            type: 'column',

            content: [{
               type: 'component',
               title: 'JavaScript',
               componentName: 'editor',
               height: 75,
               componentState: {
                  name: 'javascript'
               }
            }, {
               type: 'component',
               componentName: 'editor',
               title: 'HTML',

               componentState: {
                  name: 'html'
               }
            }]
         }, {
            type: 'column',
            content: [{
               type: 'component',
               componentName: 'editor',
               title: 'Result',
               height: 75,
               componentState: {
                  name: 'result'
               }
            }, {
               type: 'component',
               componentName: 'editor',
               title: 'CSS',
               componentState: {
                  name: 'css'
               }
            }]
         }]
      }]
   },
   "3": {
      // h,25_j|c,25_r
      icon: "equ",
      deg: 0,
      sort: 2,
      content: [{
         type: 'row',
         content: [{
            type: 'column',

            content: [{
               type: 'component',
               title: 'HTML',
               componentName: 'editor',
               componentState: {
                  name: 'html'
               }
            }, {
               type: 'component',
               componentName: 'editor',
               title: 'JavaScript',
               height: 75,
               componentState: {
                  name: 'javascript'
               }
            }]
         }, {
            type: 'column',
            content: [{
               type: 'component',
               componentName: 'editor',
               title: 'CSS',
               componentState: {
                  name: 'css'
               }
            }, {
               type: 'component',
               componentName: 'editor',
               title: 'Result',
               height: 75,
               componentState: {
                  name: 'result'
               }
            }]
         }]
      }]
   },
   "2": {
      // icon: "h;j;c|r,50",
      icon: "base",
      deg: -90,
      sort: 3,
      content: [{
         type: 'row',
         content: [{
            type: 'column',
            height: 50,
            content: [{
               type: 'component',
               title: 'HTML',
               componentName: 'editor',
               componentState: {
                  name: 'html'
               }
            }, {
               type: 'component',
               componentName: 'editor',
               title: 'JavaScript',
               componentState: {
                  name: 'javascript'
               }

            }, {
               type: 'component',
               componentName: 'editor',
               title: 'CSS',
               componentState: {
                  name: 'css'
               }
            }]
         }, {
            type: 'row',
            content: [{
               type: 'component',
               componentName: 'editor',
               title: 'Result',
               componentState: {
                  name: 'result'
               }
            }]
         }]
      }]
   },
   "1": {
      // icon: "h;j;c_r,50",
      icon: "base",
      deg: 0,
      sort: 4,
      content: [{
         "type": "column",
         "width": 100,
         "content": [{
            "type": "row",
            "height": 50,
            "content": [{
               "type": "stack",
               "width": 33.33,
               "height": 50,
               "content": [{
                  "type": "component",
                  "componentName": "editor",
                  "title": "JavaScript",
                  "componentState": {
                     "name": "javascript"
                  },
                  "height": 75
               }]
            }, {
               "type": "stack",
               "width": 33.33,
               "content": [{
                  "type": "component",
                  "title": "HTML",
                  "componentName": "editor",
                  "componentState": {
                     "name": "html"
                  }
               }]
            }, {
               "type": "stack",
               "width": 33.33,
               "content": [{
                  "type": "component",
                  "componentName": "editor",
                  "title": "CSS",
                  "componentState": {
                     "name": "css"
                  }
               }]
            }]
         }, {
            "type": "stack",
            "height": 50,
            "content": [{
               "type": "component",
               "componentName": "editor",
               "title": "Result",
               "height": 70,
               "componentState": {
                  "name": "result"
               }
            }]
         }]
      }]

   },
   "8": {
      // icon: "h;j;c|r,50",
      icon: "base",
      deg: 90,
      sort: 4,
      content: [{
         type: 'row',
         content: [{
            type: 'row',
            content: [{
               type: 'component',
               componentName: 'editor',
               title: 'Result',
               componentState: {
                  name: 'result'
               }
            }]
         }, {
            type: 'column',
            height: 50,
            content: [{
               type: 'component',
               componentName: 'editor',
               title: 'JavaScript',
               componentState: {
                  name: 'javascript'
               }

            }, {
               type: 'component',
               title: 'HTML',
               componentName: 'editor',
               componentState: {
                  name: 'html'
               }
            }, {
               type: 'component',
               componentName: 'editor',
               title: 'CSS',
               componentState: {
                  name: 'css'
               }
            }]
         }]
      }]
   },


   "6": {
      // icon: "hjc_r",
      icon: "base",
      deg: 180,
      sort: 6,
      content: [{
         "type": "column",
         "width": 100,
         "content": [{
            "type": "stack",
            "height": 50,
            "content": [{
               "type": "component",
               "componentName": "editor",
               "title": "Result",
               "height": 70,
               "componentState": {
                  "name": "result"
               }
            }]
         }, {
            "type": "row",
            "height": 50,
            "content": [{
               "type": "stack",
               "width": 33.33,
               "height": 50,
               "content": [{
                  "type": "component",
                  "componentName": "editor",
                  "title": "JavaScript",
                  "componentState": {
                     "name": "javascript"
                  },
                  "height": 75
               }]
            }, {
               "type": "stack",
               "width": 33.33,
               "content": [{
                  "type": "component",
                  "title": "HTML",
                  "componentName": "editor",
                  "componentState": {
                     "name": "html"
                  }
               }]
            }, {
               "type": "stack",
               "width": 33.33,
               "content": [{
                  "type": "component",
                  "componentName": "editor",
                  "title": "CSS",
                  "componentState": {
                     "name": "css"
                  }
               }]
            }]
         }]
      }]

   },

   "4": {
      //
      icon: "split",
      deg: 0,
      sort: 7,
      content: [{
         type: 'row',
         content: [{
            type: 'stack',
            height: 50,
            content: [{
               type: 'component',
               title: 'HTML',
               componentName: 'editor',
               componentState: {
                  name: 'html'
               }
            }, {
               type: 'component',
               componentName: 'editor',
               title: 'JavaScript',
               componentState: {
                  name: 'javascript'
               }
            }, {
               type: 'component',
               componentName: 'editor',
               title: 'CSS',
               componentState: {
                  name: 'css'
               }
            }]
         }, {
            type: 'column',
            content: [{
               type: 'component',
               componentName: 'editor',
               title: 'Result',
               componentState: {
                  name: 'result'
               }
            }]
         }]
      }]
   },

   "5": {
      icon: "full",
      deg: 0,
      sort: 8,
      content: [{
         type: 'row',
         content: [{
            type: 'stack',
            height: 50,
            content: [{
               type: 'component',
               title: 'HTML',
               componentName: 'editor',
               componentState: {
                  name: 'html'
               }
            }, {
               type: 'component',
               componentName: 'editor',
               title: 'JavaScript',
               componentState: {
                  name: 'javascript'
               }

            }, {
               type: 'component',
               componentName: 'editor',
               title: 'CSS',
               componentState: {
                  name: 'css'
               }
            }, {
               type: 'component',
               componentName: 'editor',
               title: 'Result',
               componentState: {
                  name: 'result'
               }
            }]
         }]
      }]
   }
};
