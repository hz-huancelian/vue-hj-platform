(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-7152c718"],{"15d4":function(e,t,a){"use strict";a.d(t,"e",(function(){return l})),a.d(t,"l",(function(){return o})),a.d(t,"n",(function(){return n})),a.d(t,"p",(function(){return s})),a.d(t,"a",(function(){return c})),a.d(t,"o",(function(){return i})),a.d(t,"f",(function(){return u})),a.d(t,"k",(function(){return p})),a.d(t,"m",(function(){return m})),a.d(t,"r",(function(){return d})),a.d(t,"s",(function(){return f})),a.d(t,"b",(function(){return h})),a.d(t,"q",(function(){return b})),a.d(t,"c",(function(){return g})),a.d(t,"g",(function(){return y})),a.d(t,"i",(function(){return v})),a.d(t,"j",(function(){return k})),a.d(t,"d",(function(){return F}));var r=a("b775");function l(e){return Object(r["a"])({url:"/checkTask/findByCondition",method:"get",params:e})}function o(e){return Object(r["a"])({url:"/checkTask/findHistoryByCondition",method:"get",params:e})}function n(e){return Object(r["a"])({url:"/checkTask/getCheckFactorInfos",method:"get",params:e})}function s(e){return Object(r["a"])({url:"/checkTask/getOfferFactorsByTaskId/".concat(e),method:"get"})}function c(e){return Object(r["a"])({url:"/checkTask/assignmentsFactor",method:"post",data:e})}function i(){return Object(r["a"])({url:"/checkTask/getCheckUsers",method:"get"})}function u(e){return Object(r["a"])({url:"/checkFactor/findAuditCheckFactorByCondition",method:"get",params:e})}function p(e){return Object(r["a"])({url:"/checkFactor/findHistoryByCondition",method:"get",params:e})}function m(e){return Object(r["a"])({url:"/checkFactor/findSubFactorByCheckStandId/".concat(e),method:"get"})}function d(e){return Object(r["a"])({url:"/checkFactor/saveCheckFactorData",method:"post",data:e})}function f(e){return Object(r["a"])({url:"/checkFactor/submitCheckFactor",method:"get",params:e})}function h(e){return Object(r["a"])({url:"/checkFactor/auditCheckFactor",method:"post",data:e})}function b(e){return Object(r["a"])({url:"/checkFactor/sampDrawApply",method:"post",data:e})}function g(e){return Object(r["a"])({url:"/checkFactor/batchAuditCheckFactor",method:"post",data:e})}function y(e){return Object(r["a"])({url:"/checkTask/findCheckTaskByCondition",method:"get",params:e})}function v(e){return Object(r["a"])({url:"/checkTask/findCheckTaskDetailByCondition0",method:"get",params:e})}function k(e){return Object(r["a"])({url:"/checkTask/findCheckTaskDetailByCondition1",method:"get",params:e})}function F(e){return Object(r["a"])({url:"/checkFactor/batchSampDrawApply",method:"post",data:e})}},4127:function(e,t,a){"use strict";var r=a("d233"),l=a("b313"),o={brackets:function(e){return e+"[]"},indices:function(e,t){return e+"["+t+"]"},repeat:function(e){return e}},n=Date.prototype.toISOString,s={delimiter:"&",encode:!0,encoder:r.encode,encodeValuesOnly:!1,serializeDate:function(e){return n.call(e)},skipNulls:!1,strictNullHandling:!1},c=function e(t,a,l,o,n,c,i,u,p,m,d,f){var h=t;if("function"===typeof i)h=i(a,h);else if(h instanceof Date)h=m(h);else if(null===h){if(o)return c&&!f?c(a,s.encoder):a;h=""}if("string"===typeof h||"number"===typeof h||"boolean"===typeof h||r.isBuffer(h)){if(c){var b=f?a:c(a,s.encoder);return[d(b)+"="+d(c(h,s.encoder))]}return[d(a)+"="+d(String(h))]}var g,y=[];if("undefined"===typeof h)return y;if(Array.isArray(i))g=i;else{var v=Object.keys(h);g=u?v.sort(u):v}for(var k=0;k<g.length;++k){var F=g[k];n&&null===h[F]||(y=Array.isArray(h)?y.concat(e(h[F],l(a,F),l,o,n,c,i,u,p,m,d,f)):y.concat(e(h[F],a+(p?"."+F:"["+F+"]"),l,o,n,c,i,u,p,m,d,f)))}return y};e.exports=function(e,t){var a=e,n=t?r.assign({},t):{};if(null!==n.encoder&&void 0!==n.encoder&&"function"!==typeof n.encoder)throw new TypeError("Encoder has to be a function.");var i="undefined"===typeof n.delimiter?s.delimiter:n.delimiter,u="boolean"===typeof n.strictNullHandling?n.strictNullHandling:s.strictNullHandling,p="boolean"===typeof n.skipNulls?n.skipNulls:s.skipNulls,m="boolean"===typeof n.encode?n.encode:s.encode,d="function"===typeof n.encoder?n.encoder:s.encoder,f="function"===typeof n.sort?n.sort:null,h="undefined"!==typeof n.allowDots&&n.allowDots,b="function"===typeof n.serializeDate?n.serializeDate:s.serializeDate,g="boolean"===typeof n.encodeValuesOnly?n.encodeValuesOnly:s.encodeValuesOnly;if("undefined"===typeof n.format)n.format=l["default"];else if(!Object.prototype.hasOwnProperty.call(l.formatters,n.format))throw new TypeError("Unknown format option provided.");var y,v,k=l.formatters[n.format];"function"===typeof n.filter?(v=n.filter,a=v("",a)):Array.isArray(n.filter)&&(v=n.filter,y=v);var F,_=[];if("object"!==typeof a||null===a)return"";F=n.arrayFormat in o?n.arrayFormat:"indices"in n?n.indices?"indices":"repeat":"indices";var S=o[F];y||(y=Object.keys(a)),f&&y.sort(f);for(var w=0;w<y.length;++w){var x=y[w];p&&null===a[x]||(_=_.concat(c(a[x],x,S,u,p,m?d:null,v,f,h,b,k,g)))}var I=_.join(i),O=!0===n.addQueryPrefix?"?":"";return I.length>0?O+I:""}},4328:function(e,t,a){"use strict";var r=a("4127"),l=a("9e6a"),o=a("b313");e.exports={formats:o,parse:l,stringify:r}},"9e6a":function(e,t,a){"use strict";var r=a("d233"),l=Object.prototype.hasOwnProperty,o={allowDots:!1,allowPrototypes:!1,arrayLimit:20,decoder:r.decode,delimiter:"&",depth:5,parameterLimit:1e3,plainObjects:!1,strictNullHandling:!1},n=function(e,t){for(var a={},r=t.ignoreQueryPrefix?e.replace(/^\?/,""):e,n=t.parameterLimit===1/0?void 0:t.parameterLimit,s=r.split(t.delimiter,n),c=0;c<s.length;++c){var i,u,p=s[c],m=p.indexOf("]="),d=-1===m?p.indexOf("="):m+1;-1===d?(i=t.decoder(p,o.decoder),u=t.strictNullHandling?null:""):(i=t.decoder(p.slice(0,d),o.decoder),u=t.decoder(p.slice(d+1),o.decoder)),l.call(a,i)?a[i]=[].concat(a[i]).concat(u):a[i]=u}return a},s=function(e,t,a){for(var r=t,l=e.length-1;l>=0;--l){var o,n=e[l];if("[]"===n)o=[],o=o.concat(r);else{o=a.plainObjects?Object.create(null):{};var s="["===n.charAt(0)&&"]"===n.charAt(n.length-1)?n.slice(1,-1):n,c=parseInt(s,10);!isNaN(c)&&n!==s&&String(c)===s&&c>=0&&a.parseArrays&&c<=a.arrayLimit?(o=[],o[c]=r):o[s]=r}r=o}return r},c=function(e,t,a){if(e){var r=a.allowDots?e.replace(/\.([^.[]+)/g,"[$1]"):e,o=/(\[[^[\]]*])/,n=/(\[[^[\]]*])/g,c=o.exec(r),i=c?r.slice(0,c.index):r,u=[];if(i){if(!a.plainObjects&&l.call(Object.prototype,i)&&!a.allowPrototypes)return;u.push(i)}var p=0;while(null!==(c=n.exec(r))&&p<a.depth){if(p+=1,!a.plainObjects&&l.call(Object.prototype,c[1].slice(1,-1))&&!a.allowPrototypes)return;u.push(c[1])}return c&&u.push("["+r.slice(c.index)+"]"),s(u,t,a)}};e.exports=function(e,t){var a=t?r.assign({},t):{};if(null!==a.decoder&&void 0!==a.decoder&&"function"!==typeof a.decoder)throw new TypeError("Decoder has to be a function.");if(a.ignoreQueryPrefix=!0===a.ignoreQueryPrefix,a.delimiter="string"===typeof a.delimiter||r.isRegExp(a.delimiter)?a.delimiter:o.delimiter,a.depth="number"===typeof a.depth?a.depth:o.depth,a.arrayLimit="number"===typeof a.arrayLimit?a.arrayLimit:o.arrayLimit,a.parseArrays=!1!==a.parseArrays,a.decoder="function"===typeof a.decoder?a.decoder:o.decoder,a.allowDots="boolean"===typeof a.allowDots?a.allowDots:o.allowDots,a.plainObjects="boolean"===typeof a.plainObjects?a.plainObjects:o.plainObjects,a.allowPrototypes="boolean"===typeof a.allowPrototypes?a.allowPrototypes:o.allowPrototypes,a.parameterLimit="number"===typeof a.parameterLimit?a.parameterLimit:o.parameterLimit,a.strictNullHandling="boolean"===typeof a.strictNullHandling?a.strictNullHandling:o.strictNullHandling,""===e||null===e||"undefined"===typeof e)return a.plainObjects?Object.create(null):{};for(var l="string"===typeof e?n(e,a):e,s=a.plainObjects?Object.create(null):{},i=Object.keys(l),u=0;u<i.length;++u){var p=i[u],m=c(p,l[p],a);s=r.merge(s,m,a)}return r.compact(s)}},b313:function(e,t,a){"use strict";var r=String.prototype.replace,l=/%20/g;e.exports={default:"RFC3986",formatters:{RFC1738:function(e){return r.call(e,l,"+")},RFC3986:function(e){return e}},RFC1738:"RFC1738",RFC3986:"RFC3986"}},c2c3:function(e,t,a){},d233:function(e,t,a){"use strict";var r=Object.prototype.hasOwnProperty,l=function(){for(var e=[],t=0;t<256;++t)e.push("%"+((t<16?"0":"")+t.toString(16)).toUpperCase());return e}(),o=function(e){var t;while(e.length){var a=e.pop();if(t=a.obj[a.prop],Array.isArray(t)){for(var r=[],l=0;l<t.length;++l)"undefined"!==typeof t[l]&&r.push(t[l]);a.obj[a.prop]=r}}return t},n=function(e,t){for(var a=t&&t.plainObjects?Object.create(null):{},r=0;r<e.length;++r)"undefined"!==typeof e[r]&&(a[r]=e[r]);return a},s=function e(t,a,l){if(!a)return t;if("object"!==typeof a){if(Array.isArray(t))t.push(a);else{if("object"!==typeof t)return[t,a];(l.plainObjects||l.allowPrototypes||!r.call(Object.prototype,a))&&(t[a]=!0)}return t}if("object"!==typeof t)return[t].concat(a);var o=t;return Array.isArray(t)&&!Array.isArray(a)&&(o=n(t,l)),Array.isArray(t)&&Array.isArray(a)?(a.forEach((function(a,o){r.call(t,o)?t[o]&&"object"===typeof t[o]?t[o]=e(t[o],a,l):t.push(a):t[o]=a})),t):Object.keys(a).reduce((function(t,o){var n=a[o];return r.call(t,o)?t[o]=e(t[o],n,l):t[o]=n,t}),o)},c=function(e,t){return Object.keys(t).reduce((function(e,a){return e[a]=t[a],e}),e)},i=function(e){try{return decodeURIComponent(e.replace(/\+/g," "))}catch(t){return e}},u=function(e){if(0===e.length)return e;for(var t="string"===typeof e?e:String(e),a="",r=0;r<t.length;++r){var o=t.charCodeAt(r);45===o||46===o||95===o||126===o||o>=48&&o<=57||o>=65&&o<=90||o>=97&&o<=122?a+=t.charAt(r):o<128?a+=l[o]:o<2048?a+=l[192|o>>6]+l[128|63&o]:o<55296||o>=57344?a+=l[224|o>>12]+l[128|o>>6&63]+l[128|63&o]:(r+=1,o=65536+((1023&o)<<10|1023&t.charCodeAt(r)),a+=l[240|o>>18]+l[128|o>>12&63]+l[128|o>>6&63]+l[128|63&o])}return a},p=function(e){for(var t=[{obj:{o:e},prop:"o"}],a=[],r=0;r<t.length;++r)for(var l=t[r],n=l.obj[l.prop],s=Object.keys(n),c=0;c<s.length;++c){var i=s[c],u=n[i];"object"===typeof u&&null!==u&&-1===a.indexOf(u)&&(t.push({obj:n,prop:i}),a.push(u))}return o(t)},m=function(e){return"[object RegExp]"===Object.prototype.toString.call(e)},d=function(e){return null!==e&&"undefined"!==typeof e&&!!(e.constructor&&e.constructor.isBuffer&&e.constructor.isBuffer(e))};e.exports={arrayToObject:n,assign:c,compact:p,decode:i,encode:u,isBuffer:d,isRegExp:m,merge:s}},d43b:function(e,t,a){"use strict";a.d(t,"d",(function(){return l})),a.d(t,"i",(function(){return o})),a.d(t,"g",(function(){return n})),a.d(t,"h",(function(){return s})),a.d(t,"f",(function(){return c})),a.d(t,"e",(function(){return i})),a.d(t,"c",(function(){return u})),a.d(t,"b",(function(){return p})),a.d(t,"a",(function(){return m}));var r=a("b775");function l(e){return Object(r["a"])({url:"/sample/findByCondition",method:"get",params:e})}function o(e){return Object(r["a"])({url:"/sample/getSamplesBySampTaskId",method:"get",params:e})}function n(e){return Object(r["a"])({url:"/sample/getSampleDataBySampItemId/".concat(e),method:"get"})}function s(e){return Object(r["a"])({url:"/sample/getSampleDetailBySampItemId/".concat(e),method:"get"})}function c(e){return Object(r["a"])({url:"/sample/getSampStoreApplyList",method:"get",params:e})}function i(e){return Object(r["a"])({url:"/sample/getSampDrawApplyList",method:"get",params:e})}function u(e){return Object(r["a"])({url:"/sample/doStoreSample",method:"post",data:e})}function p(e){return Object(r["a"])({url:"/sample/doDrawSample",method:"post",data:e})}function m(e){return Object(r["a"])({url:"/sample/batchDoStoreSample",method:"post",data:e})}},d471:function(e,t,a){"use strict";a("c2c3")},fce3:function(e,t,a){"use strict";a.r(t);var r=function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"app-container"},[a("el-form",{attrs:{model:e.searchForm,inline:!0}},[a("el-row",[a("el-col",{attrs:{span:20}},[a("el-form-item",{attrs:{label:"样品编号:"}},[a("el-input",{staticStyle:{width:"165px"},attrs:{placeholder:"样品编号"},model:{value:e.searchForm.smapItemId,callback:function(t){e.$set(e.searchForm,"smapItemId",t)},expression:"searchForm.smapItemId"}})],1),a("el-form-item",{attrs:{label:"检测因子:"}},[a("el-input",{staticStyle:{width:"165px"},attrs:{placeholder:"因子名称"},model:{value:e.searchForm.factorName,callback:function(t){e.$set(e.searchForm,"factorName",t)},expression:"searchForm.factorName"}})],1),a("el-form-item",{attrs:{label:"检测状态:"}},[a("el-select",{staticStyle:{width:"165px"},attrs:{clearable:"",filterable:"",placeholder:"检测状态"},model:{value:e.searchForm.checkStatus,callback:function(t){e.$set(e.searchForm,"checkStatus",t)},expression:"searchForm.checkStatus"}},e._l(Object.keys(e.CHECK_STATUS),(function(t){return a("el-option",{key:t,attrs:{label:e.CHECK_STATUS[t],value:t}})})),1)],1),a("el-form-item",[a("el-button",{staticClass:"iconfont icon-chaxun1",attrs:{type:"primary"},on:{click:e.handleSearch}},[e._v(" 查询")]),a("el-button",{staticClass:"iconfont icon-fanhui",attrs:{type:"primary"},on:{click:e.goBack}},[e._v(" 返回")])],1)],1),a("el-col",{staticClass:"search-right",attrs:{span:4}},[a("el-button",{attrs:{type:"text",icon:"el-icon-refresh"},on:{click:e.handleSearch}},[e._v("刷新")])],1)],1)],1),a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.checkData,stripe:"","highlight-current-row":"","header-cell-style":{background:"#ECF3FC"}}},[a("template",{slot:"empty"},[a("div",{staticClass:"table_empty"},[a("div",{staticClass:"empty_tips"},[a("span",[e._v("\n            暂无信息\n          ")])])])]),a("el-table-column",{attrs:{type:"index",width:"50",align:"center",label:"序号"}}),a("el-table-column",{attrs:{prop:"factorName",label:"检测因子",width:"140px",align:"center"}}),a("el-table-column",{attrs:{prop:"sampleNo",label:"样品编号",width:"160px",align:"center"}}),a("el-table-column",{attrs:{prop:"factorPoint",label:"采样点位",width:"110px",align:"center"}}),a("el-table-column",{attrs:{prop:"dayAndCount",label:"频次(次/天)",width:"120px",align:"center"}}),a("el-table-column",{attrs:{prop:"standardName",label:"检测标准",width:"200px",align:"center"}}),a("el-table-column",{attrs:{prop:"checkRes",label:"检测结果","min-width":"150px",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return[r.checkRes&&r.checkRes.length>0?[e._v("\n          "+e._s(r.masterRes)+"\n          "),""!==r.exponRes&&0!==r.exponRes?[e._v("×10"),a("sup",[e._v(e._s(r.exponRes))])]:e._e(),e._v("\n          "+e._s(r.unitName&&"无量纲"!==r.unitName?" "+r.unitName:"")+"\n        ")]:void 0]}}])}),a("el-table-column",{attrs:{prop:"assignUser",label:"分析员",align:"center"}}),a("el-table-column",{attrs:{prop:"collectTime",label:"采样时间",width:"160",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[e._v("\n        "+e._s(a.collectTime&&a.collectTime.length>0?a.collectTime:a.collectDate)+"\n      ")]}}])}),a("el-table-column",{attrs:{prop:"storeTime",label:"入库时间",width:"160",align:"center"}}),a("el-table-column",{attrs:{prop:"endDate",label:"任务截止时间",width:"120px",align:"center"}}),a("el-table-column",{attrs:{prop:"dataEntryStep",label:"样品归类",width:"120",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return[a("el-tag",{attrs:{type:"1"===r.sampleType?"danger":""}},[e._v("\n          "+e._s("1"===r.sampleType?"样品分包":"样品自检")+"\n        ")])]}}])}),a("el-table-column",{attrs:{prop:"checkStatus",label:"检测状态",width:"120px",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return[a("el-tag",{attrs:{type:e._f("statusQualityFilter")(r.checkStatus)}},[e._v("\n          "+e._s(e.CHECK_STATUS[r.checkStatus])+"\n        ")])]}}])}),a("el-table-column",{attrs:{label:"操作",fixed:"right",width:"190",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return[r.checkStatus>2?a("el-button",{attrs:{type:"text"},on:{click:function(t){return e.handleDetail(r)}}},[e._v("查看")]):e._e(),r.checkStatus>2?a("div",{staticClass:"erc-divider-vertical"}):e._e(),a("el-button",{attrs:{type:"text"},on:{click:function(t){return e.handleLocalDetail(r)}}},[e._v("采样记录")]),r.assignUserId===e.userId&&"0"===r.checkStatus?a("div",{staticClass:"erc-divider-vertical"}):e._e(),r.assignUserId===e.userId&&"0"===r.checkStatus&&"噪声"!==r.secdClassName?a("el-button",{attrs:{type:"text"},on:{click:function(t){return e.handleApply(r)}}},[e._v("申请领样")]):e._e(),r.assignUserId!==e.userId||"2"!==r.checkStatus&&"6"!==r.checkStatus?e._e():a("div",{staticClass:"erc-divider-vertical"}),r.assignUserId!==e.userId||"2"!==r.checkStatus&&"6"!==r.checkStatus?e._e():a("el-button",{attrs:{type:"text"},on:{click:function(t){return e.handleSetResult(r)}}},[e._v("结果录入")]),r.assignUserId===e.userId&&"3"===r.checkStatus?a("div",{staticClass:"erc-divider-vertical"}):e._e(),r.assignUserId===e.userId&&"3"===r.checkStatus?a("el-button",{attrs:{type:"text"},on:{click:function(t){return e.handleApprove(r.checkFactorId)}}},[e._v("提交审核")]):e._e()]}}])})],2),a("div",{staticStyle:{float:"right"}},[a("pagination",{directives:[{name:"show",rawName:"v-show",value:e.total>0,expression:"total>0"}],attrs:{total:e.total,page:e.searchForm.pageNumber,limit:e.searchForm.pageSize},on:{"update:page":function(t){return e.$set(e.searchForm,"pageNumber",t)},"update:limit":function(t){return e.$set(e.searchForm,"pageSize",t)},pagination:e.handleSearch}})],1),a("el-dialog",{attrs:{title:"检测详情",visible:e.detailVisible,width:"70%",center:"",top:"5vh"},on:{"update:visible":function(t){e.detailVisible=t}}},[a("div",{staticStyle:{width:"700px",margin:"0 auto"}},[a("el-form",{attrs:{"label-width":"100px","label-position":"left"}},[a("el-form-item",{attrs:{label:"样品编号:"}},[e._v(e._s(e.sampleForm.smapItemId))]),a("el-form-item",{attrs:{label:"检测因子:"}},[e._v(e._s(e.sampleForm.factorName))]),a("el-form-item",{attrs:{label:"检测标准:"}},[e._v(e._s(e.sampleForm.standardName))]),a("el-form-item",{attrs:{label:"备注:"}},[e._v(e._s(e.sampleForm.remark))]),a("el-form-item",{attrs:{label:"检测结果:"}},[e.sampleForm.checkRes&&e.sampleForm.checkRes.length>0?[e._v("\n            "+e._s(e.sampleForm.factorInfo&&e.sampleForm.factorInfo.v1?e.sampleForm.factorInfo.v1:0)+"\n            "),e.sampleForm.factorInfo&&""!==e.sampleForm.factorInfo.v2&&0!==e.sampleForm.factorInfo.v2?[e._v("\n              ×10"),a("sup",[e._v(e._s(e.sampleForm.factorInfo.v2?Number(e.sampleForm.factorInfo.v2):0))])]:e._e(),e._v("\n            "+e._s(e.sampleForm.unitName&&"无量纲"!==e.sampleForm.unitName?" "+e.sampleForm.unitName:"")+"\n          ")]:[e._v("暂无检测结果")]],2)],1),e.sampleForm.subFactors&&e.sampleForm.subFactors.length>0?a("div",[a("el-table",{staticStyle:{width:"100%"},attrs:{data:e.sampleForm.subFactors,border:"","header-cell-style":{background:"#ECF3FC"}}},[a("el-table-column",{attrs:{prop:"name",label:"检测因子",width:"130",align:"center"}}),a("el-table-column",{attrs:{prop:"name",label:"检测结果",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return[r.v1?[e._v("\n                "+e._s(r.v1?r.v1:0)+"×10"),a("sup",[e._v(e._s(r.v2?Number(r.v2):0))]),e._v(e._s(e.sampleForm.unitName)+"\n              ")]:e._e()]}}],null,!1,1464253952)})],1)],1):e._e()],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.detailVisible=!1}}},[e._v("关 闭")])],1)]),a("el-dialog",{attrs:{title:"样品结果录入",visible:e.testResultVisible,width:"70%",center:"",top:"5vh"},on:{"update:visible":function(t){e.testResultVisible=t}}},[a("div",{staticStyle:{width:"650px",margin:"0 auto"}},[a("el-form",{attrs:{"label-width":"100px","label-position":"left"}},[a("el-form-item",{attrs:{label:"样品编号:"}},[e._v(e._s(e.testResultForm.smapItemId))]),a("el-form-item",{attrs:{label:"检测因子:"}},[e._v(e._s(e.testResultForm.factorName))]),a("el-form-item",{attrs:{label:"检测标准:"}},[e._v(e._s(e.testResultForm.standardName))]),a("el-form-item",{attrs:{label:"检测结果:"}},[a("el-row",[a("el-col",{attrs:{span:12}},[a("el-input",{attrs:{placeholder:"结果值",oninput:"value=value.replace(/[^\\d\\.]/g,'')"},model:{value:e.testResultForm.masterRes,callback:function(t){e.$set(e.testResultForm,"masterRes",t)},expression:"testResultForm.masterRes"}},[a("template",{slot:"append"},[e._v("E")])],2)],1),a("el-col",{attrs:{span:12}},[a("el-input",{attrs:{placeholder:"幂数",oninput:"value=value.replace(/[^\\d\\-]/g, '')"},model:{value:e.testResultForm.subRes,callback:function(t){e.$set(e.testResultForm,"subRes",t)},expression:"testResultForm.subRes"}},[a("template",{slot:"append"},[e._v(e._s(e.testResultForm.unitName))])],2)],1)],1),a("el-row",[a("el-col",{staticStyle:{height:"24px","font-size":"14px"},attrs:{span:24}},[a("span",{staticStyle:{color:"red"}},[e._v("例:3.45E2=3.45×10²  ;  234E0=234 ; 1.62E-3=1.62×10⁻³")])])],1),a("el-row",[a("el-col",{staticStyle:{height:"24px","font-size":"14px"},attrs:{span:24}},[a("span",{staticStyle:{color:"red"}},[e._v("无子因子的：输入0代表未检出")])])],1),a("el-row",[a("el-col",{staticStyle:{height:"24px","font-size":"14px"},attrs:{span:24}},[a("span",{staticStyle:{color:"red"}},[e._v("有子因子的：输入0代表未检出，不填代表未检查此项")])])],1)],1),a("el-form-item",{attrs:{label:"备注:"}},[a("el-input",{attrs:{type:"textarea",maxlength:"50","show-word-limit":"",placeholder:"备注信息",rows:3},model:{value:e.testResultForm.remark,callback:function(t){e.$set(e.testResultForm,"remark",t)},expression:"testResultForm.remark"}})],1)],1),e.subFactorData&&e.subFactorData.length>0?a("div",[a("el-table",{attrs:{data:e.subFactorData,border:"","highlight-current-row":"","header-cell-style":{background:"#ECF3FC"}}},[a("el-table-column",{attrs:{prop:"name",label:"检测因子",width:"130",align:"center"}}),a("el-table-column",{attrs:{label:"检测结果",align:"center"},scopedSlots:e._u([{key:"default",fn:function(t){var r=t.row;return[a("el-row",[a("el-col",{attrs:{span:12}},[a("el-input",{attrs:{placeholder:"结果值",oninput:"value=value.replace(/[^\\d\\.]/g,'')"},model:{value:r.v1,callback:function(t){e.$set(r,"v1",t)},expression:"row.v1"}},[a("template",{slot:"append"},[e._v("E")])],2)],1),a("el-col",{attrs:{span:12}},[a("el-input",{attrs:{placeholder:"幂数",oninput:"value=value.replace(/[^\\d\\-]/g,'')"},model:{value:r.v2,callback:function(t){e.$set(r,"v2",t)},expression:"row.v2"}},[a("template",{slot:"append"},[e._v(e._s(e.testResultForm.unitName))])],2)],1)],1)]}}],null,!1,2990782521)})],1)],1):e._e()],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{attrs:{type:"primary"},on:{click:function(t){e.testResultVisible=!1}}},[e._v("取消")]),a("el-button",{attrs:{type:"primary"},on:{click:e.confirmChecks}},[e._v("保存")])],1)]),a("el-dialog",{attrs:{title:e.currentSample+"-详情",visible:e.sampleVisible,width:"85%",center:"",top:"5vh"},on:{"update:visible":function(t){e.sampleVisible=t}}},[a("el-form",{attrs:{model:e.sampleDetailForm,"label-width":"180px","label-position":"right"}},[a("el-card",{staticStyle:{"margin-top":"5px","padding-bottom":"20px"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("div",{staticStyle:{width:"3px",margin:"auto 3px",height:"20px","background-color":"steelblue"}}),a("span",[e._v("基础信息")])]),a("el-col",{staticStyle:{height:"32px"},attrs:{span:16}},[a("el-form-item",{attrs:{"label-width":"100",label:"检测因子:"}},[a("span",{staticClass:"showTile"},[e._v(e._s(e.sampleDetailForm.factorName))])])],1),a("el-col",{staticStyle:{height:"32px"},attrs:{span:8}},[a("el-form-item",{attrs:{"label-width":"100",label:"点位:"}},[a("span",{staticClass:"showTile"},[e._v(e._s(e.sampleDetailForm.factorPoint))])])],1)],1),e._l(e.sampleSecInfo,(function(t){return a("el-card",{key:t.groupKey,staticStyle:{"margin-top":"5px","padding-bottom":"20px"}},[t.groupName&&""!=t.groupName?a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("div",{staticStyle:{width:"3px",margin:"auto 3px",height:"20px","background-color":"steelblue"}}),a("span",[e._v(e._s(t.groupName))])]):e._e(),e._l(t.params,(function(t,r){return a("el-col",{key:r,staticStyle:{height:"32px"},attrs:{span:8}},[a("el-form-item",{attrs:{"label-width":"100"}},[a("span",{attrs:{slot:"label"},slot:"label"},[e._v(e._s(t.name)+":")]),a("span",{staticClass:"showTile"},[e._v(e._s(t.value?t.value.toString():""))])])],1)}))],2)})),e.sampleDataInfo&&e.sampleDataInfo.length>0?a("el-card",{staticStyle:{"margin-top":"5px"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("div",{staticStyle:{width:"3px",margin:"auto 3px",height:"20px","background-color":"steelblue"}}),a("span",[e._v("现场检测因子信息")])]),a("el-table",{attrs:{data:e.sampleDataInfo,stripe:""}},[a("el-table-column",{attrs:{prop:"factorName",label:"检测因子项目"}}),a("el-table-column",{attrs:{label:"因子结果集"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[a.measuredForm?[e._v("\n                "+e._s("第一值: "+a.measuredForm.firstVal+" 第二值: "+a.measuredForm.secondVal+" 均值: "+a.measuredForm.avgVal)+"\n              ")]:[e._v("\n                "+e._s(a.factorData?a.factorData:"")+"\n              ")]]}}],null,!1,3613769334)}),a("el-table-column",{attrs:{prop:"checkEquipment",label:"检测设备"},scopedSlots:e._u([{key:"default",fn:function(t){var a=t.row;return[e._v("\n              "+e._s(a.checkEquipment&&a.checkEquipment.length>0?a.checkEquipment.replaceAll("^_^"," "):"")+"\n            ")]}}],null,!1,2289891611)}),a("el-table-column",{attrs:{prop:"theoreticalVal",label:"理论值"}}),a("el-table-column",{attrs:{prop:"groundConditions",label:"测定值"}})],1)],1):e._e(),a("el-card",{staticStyle:{"margin-top":"5px"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("div",{staticStyle:{width:"3px",margin:"auto 3px",height:"20px","background-color":"steelblue"}}),a("span",[e._v("现场信息")])]),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{"label-width":"100",label:"采样地址:"}},[a("span",{staticClass:"showTile"},[e._v(e._s(e.sampleDetailForm.sampleDataVo.collectLocation))])])],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{"label-width":"100",label:"采样日期:"}},[a("span",{staticClass:"showTile"},[e._v(e._s(e.sampleDetailForm.sampleDataVo.collectDate))])])],1),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{"label-width":"100",label:"现场图片:"}},[e.sampleImageList&&e.sampleImageList.length>0?a("div",{staticClass:"demo-image__lazy"},e._l(e.sampleImageList,(function(t,r){return a("el-image",{key:r,staticStyle:{width:"100px",height:"100px","margin-left":"10px"},attrs:{src:t,"preview-src-list":e.sampleImageList}})})),1):e._e()])],1)],1)],2),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(t){e.sampleVisible=!1}}},[e._v("关 闭")])],1)],1)],1)},l=[],o=a("db72"),n=a("2f62"),s=a("d43b"),c=a("15d4"),i=a("333d"),u=a("4328"),p=a.n(u),m={0:"待领样",1:"领样已申请",2:"待检测",3:"已录入",4:"待审核",5:"审核通过",6:"审核失败"},d={components:{Pagination:i["a"]},filters:{statusQualityFilter:function(e){return"0"===e?"info":"2"===e||"1"===e||"4"===e?"":"3"===e||"5"===e?"success":"danger"}},data:function(){return{CHECK_STATUS:m,checkData:[],searchForm:{smapItemId:"",factorName:"",checkStatus:"",pageNumber:1,pageSize:10},total:0,detailVisible:!1,sampleForm:{factorInfo:{},subFactors:{}},subSampleData:[],testResultVisible:!1,testResultForm:{checkFactorId:"",checkRes:"",checkSubRes:"",remark:""},subFactorData:[],sampleVisible:!1,sampleDetails:[],sampleDetailForm:{factorName:"",factorPoint:"",secdClassName:"",factorDataVos:[],sampleDataVo:{collectDate:"",collectLocation:"",imageList:[],sampleData:[],specialNote:""},sampleJobVo:{projectName:"",jobRemark:""}},currentSample:"",sampleImageList:[],sampleImage:"",sampleDataInfo:[],sampleSecInfo:[]}},computed:Object(o["a"])({},Object(n["b"])(["userId"])),created:function(){this.$route.params.checkTaskId&&(this.searchForm.checkTaskId=this.$route.params.checkTaskId,this.handleSearch())},methods:{handleSearch:function(){var e=this;this.searchForm.checkTaskId&&c["findCheckTaskDetailByCondition"](this.searchForm).then((function(t){200===t.code&&(e.checkData=t.result.records.map((function(t){if(t.checkRes&&""!==t.checkRes){var a=JSON.parse(t.checkRes);e.$set(t,"masterRes",a.v1?a.v1:""),e.$set(t,"exponRes",a.v2?a.v2:"")}else e.$set(t,"masterRes",""),e.$set(t,"exponRes","");return t}))||[],e.total=t.result.total)}))},handleDetail:function(e){if(this.sampleForm=Object(o["a"])({},e),e.checkSubRes&&e.checkSubRes.length>0){var t=JSON.parse(e.checkSubRes);this.$set(this.sampleForm,"subFactors",t)}if(e.checkRes&&e.checkRes.length>0){var a=JSON.parse(e.checkRes);this.$set(this.sampleForm,"factorInfo",a)}this.detailVisible=!0},handleLocalDetail:function(e){var t=this;this.currentSample=e.sampleNo,this.sampleImageList=[],this.sampleDataInfo=[],this.sampleSecInfo=[],this.sampleImage="";var a=this.$store.getters.sysBaseUrl+"/cyImg/";s["g"](e.smapItemId).then((function(e){200===e.code&&e.result&&(t.sampleDetailForm=e.result||{},t.$nextTick((function(){t.sampleImageList=e.result.sampleDataVo.imageList.map((function(e){return a+e})),t.sampleSecInfo=e.result.sampleDataVo.sampleData||[];var r=e.result.factorDataVos.filter((function(e){return"1"===e.dataEntryStep&&!e.checkStandardId.indexOf("100004-")>-1}))||[];t.sampleDataInfo=r.map((function(e){return e.measuredFormVal&&e.measuredFormVal.length>0&&t.$set(e,"measuredForm",JSON.parse(e.measuredFormVal)),e}))})),t.sampleVisible=!0)}))},handleApply:function(e){var t=this;this.$confirm("确定申请领样?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){c["q"](p.a.stringify({checkFactorId:e.checkFactorId})).then((function(e){200===e.code?(t.$notify({title:"成功",message:e.message,type:"success"}),t.handleSearch()):t.$notify({title:"失败",message:e.message,type:"error"})}))})).catch((function(){}))},handleSetResult:function(e){var t=this;this.testResultForm=Object(o["a"])({},e),c["m"](e.checkStandardId).then((function(e){t.subFactorData=[],200===e.code&&e.result&&(t.subFactorData=e.result.map((function(e){return{name:e,v1:"",v2:""}}))||[]),t.testResultVisible=!0}))},handleApprove:function(e){var t=this;this.$confirm("确认提交审核?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){c["s"]({checkFactorId:e}).then((function(e){200===e.code?(t.$notify({title:"成功",message:e.message,type:"success"}),t.handleSearch()):t.$notify({title:"失败",message:e.message,type:"error"})}))}))},confirmChecks:function(){var e=this;this.$confirm("确认提交?","提示",{confirmButtonText:"确定",cancelButtonText:"取消",type:"warning"}).then((function(){var t;t=e.subFactorData&&e.subFactorData.length>0?{checkFactorId:e.testResultForm.checkFactorId,checkRes:JSON.stringify({v1:e.testResultForm.masterRes,v2:e.testResultForm.subRes}),checkSubRes:JSON.stringify(e.subFactorData),remark:e.testResultForm.remark}:{checkFactorId:e.testResultForm.checkFactorId,checkRes:JSON.stringify({v1:e.testResultForm.masterRes,v2:e.testResultForm.subRes}),remark:e.testResultForm.remark},c["r"](t).then((function(t){200===t.code?(e.$notify({title:"成功",message:t.message,type:"success"}),e.testResultVisible=!1,e.handleSearch()):e.$notify({title:"失败",message:t.message,type:"error"})}))}))},goBack:function(){this.$router.back()}}},f=d,h=(a("d471"),a("2877")),b=Object(h["a"])(f,r,l,!1,null,"5a1b7b12",null);t["default"]=b.exports}}]);