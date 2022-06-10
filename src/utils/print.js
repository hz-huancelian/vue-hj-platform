// 打印类属性、方法定义
/* eslint-disable */
const Print =function(dom, options) {
  if (!(this instanceof Print)) return new Print(dom, options);

  this.options = this.extend({
    'noPrint': '.no-print'
  }, options);

  if ((typeof dom) === "string") {
    this.dom = document.querySelector(dom);
  } else {
    this.dom = dom;
  }

  this.init();
};
Print.prototype = {
  init: function () {
    let content = this.getStyle() + this.getHtml();
    this.writeIframe(content);
  },
  extend: function (obj, obj2) {
    for (let k in obj2) {
      obj[k] = obj2[k];
    }
    return obj;
  },

  getStyle: function () {
    let str = "",
      styles = document.querySelectorAll('style,link');
    for (let i = 0; i < styles.length; i++) {
      str += styles[i].outerHTML;
    }
    str += "<style>" + (this.options.noPrint ? this.options.noPrint : '.no-print') + "{display:none;}</style>";

    return str;
  },

  getHtml: function () {
    let inputs = document.querySelectorAll('input');
    let textareas = document.querySelectorAll('textarea');
    let selects = document.querySelectorAll('select');

    for (let k in inputs) {
      if (inputs[k].type == "checkbox" || inputs[k].type == "radio") {
        if (inputs[k].checked == true) {
          inputs[k].setAttribute('checked', "checked")
        } else {
          inputs[k].removeAttribute('checked')
        }
      } else if (inputs[k].type == "text") {
        inputs[k].setAttribute('value', inputs[k].value)
      }
    }

    for (let k2 in textareas) {
      if (textareas[k2].type == 'textarea') {
        textareas[k2].innerHTML = textareas[k2].value
      }
    }

    for (let k3 in selects) {
      if (selects[k3].type == 'select-one') {
        let child = selects[k3].children;
        for (let i in child) {
          if (child[i].tagName == 'OPTION') {
            if (child[i].selected == true) {
              child[i].setAttribute('selected', "selected")
            } else {
              child[i].removeAttribute('selected')
            }
          }
        }
      }
    }
    return this.dom.outerHTML;
  },

  writeIframe: function (content) {

    let w, doc, iframe = document.createElement('iframe'),
      f = document.body.appendChild(iframe);
    iframe.id = "myIframe";
    iframe.style = "position:absolute;width:0;height:0;top:-10px;left:-10px;";


    w = f.contentWindow || f.contentDocument;
    doc = f.contentDocument || f.contentWindow.document;
    doc.open();
    /*let style = '<style type="text/css">\n' +
      '    @media print{\n' +
      '      body, h1, h2, h3, h4, h5, h6, hr, p, blockquote, dl, dt, dd, ul, ol, li, pre, form, fieldset, legend, button, input, textarea, th, td { margin:0; padding:0; }\n' +
      '      body, button, input, select, textarea { font:12px/1.5 arial,"黑体", \\5b8b\\4f53; }\n' +
      '      h1, h2, h3, h4, h5, h6{ font-size:100%; }\n' +
      '      address, cite, dfn, em, var { font-style:normal; }\n' +
      '      code, kbd, pre, samp { font-family:couriernew, courier, monospace; }\n' +
      '      small{ font-size:12px; }\n' +
      '      ul, ol { list-style:none; }\n' +
      '      a { text-decoration:none; }\n' +
      '      a:hover { text-decoration:underline; }\n' +
      '      sup { vertical-align:text-top; }\n' +
      '      sub{ vertical-align:text-bottom; }\n' +
      '      legend { color:#000; }\n' +
      '      fieldset, img { border:0; }\n' +
      '      button, input, select, textarea { font-size:100%; }\n' +
      '      table { border-collapse:collapse; border-spacing:0; }\n' +
      '      .no-print{\n' +
      '        display:none;\n' +
      '      }\n' +
      '    }\n' +
      '  </style>'
    doc.write(style);*/
    doc.write(content);
    doc.close();
    this.toPrint(w);

    setTimeout(function () {
      document.body.removeChild(iframe)
    }, 100)
  },

  toPrint: function (frameWindow) {
    try {
      setTimeout(function () {
        frameWindow.focus();
        try {
          if (!frameWindow.document.execCommand('print', false, null)) {
            frameWindow.print();
          }
        } catch (e) {
          frameWindow.print();
        }
        frameWindow.close();
      }, 10);
    } catch (err) {
    }
  }
};
const MyPlugin = {}
MyPlugin.install = function (Vue, options) {
  // 4. 添加实例方法
  Vue.prototype.$print = Print
}
export default MyPlugin
