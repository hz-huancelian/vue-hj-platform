(window["webpackJsonp"]=window["webpackJsonp"]||[]).push([["chunk-8333dcf4"],{"47bc":function(t,e,a){"use strict";a.d(e,"k",(function(){return n})),a.d(e,"p",(function(){return o})),a.d(e,"x",(function(){return s})),a.d(e,"r",(function(){return l})),a.d(e,"n",(function(){return i})),a.d(e,"g",(function(){return c})),a.d(e,"b",(function(){return u})),a.d(e,"h",(function(){return m})),a.d(e,"c",(function(){return d})),a.d(e,"u",(function(){return p})),a.d(e,"j",(function(){return f})),a.d(e,"m",(function(){return h})),a.d(e,"v",(function(){return b})),a.d(e,"i",(function(){return g})),a.d(e,"l",(function(){return S})),a.d(e,"s",(function(){return y})),a.d(e,"t",(function(){return k})),a.d(e,"q",(function(){return I})),a.d(e,"o",(function(){return v})),a.d(e,"D",(function(){return w})),a.d(e,"B",(function(){return F})),a.d(e,"w",(function(){return _})),a.d(e,"z",(function(){return C})),a.d(e,"G",(function(){return x})),a.d(e,"f",(function(){return T})),a.d(e,"e",(function(){return j})),a.d(e,"a",(function(){return O})),a.d(e,"A",(function(){return D})),a.d(e,"F",(function(){return B})),a.d(e,"y",(function(){return L}));var r=a("b775");function n(t){return Object(r["a"])({url:"/sampTask/findByCondition",method:"get",params:t})}function o(t){return Object(r["a"])({url:"/sampTask/findHistoryByCondition",method:"get",params:t})}function s(t){return Object(r["a"])({url:"/sampTask/getOfferFactorsByTaskId/".concat(t),method:"get"})}function l(t){return Object(r["a"])({url:"/sampItem/findByCondition",method:"get",params:t})}function i(t){return Object(r["a"])({url:"/sampItem/findHistoryByCondition",method:"get",params:t})}function c(t){return Object(r["a"])({url:"/sampItem/doAuditSampItemForLeader",method:"post",data:t})}function u(t){return Object(r["a"])({url:"/sampItem/batchDoAuditSampItemForLeader",method:"post",data:t})}function m(t){return Object(r["a"])({url:"/sampItem/doAuditSampItemForManager",method:"post",data:t})}function d(t){return Object(r["a"])({url:"/sampItem/batchDoAuditSampItemForManager",method:"post",data:t})}function p(t){return Object(r["a"])({url:"/sampItem/findSampTaskForManagerByCondition",method:"get",params:t})}function f(t){return Object(r["a"])({url:"/sampItem/findAuditSampItemForManageByCondition",method:"get",params:t})}function h(t){return Object(r["a"])({url:"/sampItem/findHisAuditSampItemForManageByCondition",method:"get",params:t})}function b(t){return Object(r["a"])({url:"/sampItem/findSampleTaskForLeaderByCondition",method:"get",params:t})}function g(t){return Object(r["a"])({url:"/sampItem/findAuditSampItemForLeaderByCondition",method:"get",params:t})}function S(t){return Object(r["a"])({url:"/sampItem/findHisAuditSampItemForLeaderByCondition",method:"get",params:t})}function y(t){return Object(r["a"])({url:"/sampTask/findSampTaskByCondition",method:"get",params:t})}function k(t){return Object(r["a"])({url:"/sampTask/findSampTaskDetailByCondition",method:"get",params:t})}function I(t){return Object(r["a"])({url:"/sampTask/findByCondition",method:"get",params:t})}function v(t){return Object(r["a"])({url:"/sampTask/findHistoryByCondition",method:"get",params:t})}function w(t){return Object(r["a"])({url:"/sampTask/getZjJobFactorsByJobId",method:"get",params:t})}function F(t){return Object(r["a"])({url:"/sampTask/getWbJobFactorsByJobId",method:"get",params:t})}function _(t){return Object(r["a"])({url:"/sampTask/getJobFactorsByJobId/".concat(t),method:"get"})}function C(t){return Object(r["a"])({url:"/sampTask/getSampleListByCondition",method:"get",params:t})}function x(t){return Object(r["a"])({url:"/sampTask/saveSampleList",headers:{"Content-Type":"application/json"},method:"post",data:t})}function T(t){return Object(r["a"])({url:"/sampTask/deleteSampleListById/".concat(t),method:"delete"})}function j(t){return Object(r["a"])({url:"/sampTask/confirmSampleList",method:"post",data:t})}function O(t){return Object(r["a"])({url:"/sampTask/assignFactorPoint",method:"post",data:t})}function D(t){return Object(r["a"])({url:"/sampTask/getSampleTaskPointBySampTaskId/".concat(t),method:"get"})}function B(t){return Object(r["a"])({url:"/sampTask/saveCombinedRemark",method:"post",data:t})}function L(t){return Object(r["a"])({url:"/sampTask/getSampleItemBySampTaskId",method:"get",params:t})}},"48cd":function(t,e,a){},"6c40":function(t,e,a){"use strict";a.r(e);var r=function(){var t=this,e=t.$createElement,a=t._self._c||e;return a("div",{staticClass:"app-container"},[a("el-form",{attrs:{model:t.searchForm,inline:!0}},[a("el-row",[a("el-col",{attrs:{span:19}},[a("el-form-item",{attrs:{label:"样品编号:"}},[a("el-input",{staticStyle:{width:"165px"},attrs:{placeholder:"样品编号"},model:{value:t.searchForm.sampleNo,callback:function(e){t.$set(t.searchForm,"sampleNo",e)},expression:"searchForm.sampleNo"}})],1),a("el-form-item",{attrs:{label:"样品状态:"}},[a("el-select",{staticStyle:{width:"165px"},attrs:{clearable:"",filterable:"",placeholder:"请选择状态"},model:{value:t.searchForm.sampStatus,callback:function(e){t.$set(t.searchForm,"sampStatus",e)},expression:"searchForm.sampStatus"}},t._l(Object.keys(t.SAMPLE_STATUS),(function(e){return a("el-option",{key:e,attrs:{label:t.SAMPLE_STATUS[e],value:e}})})),1)],1),a("el-form-item",[a("el-button",{staticClass:"iconfont icon-chaxun1",attrs:{type:"primary"},on:{click:t.handleSearch}},[t._v(" 查询")]),a("el-button",{staticClass:"iconfont icon-fanhui",attrs:{type:"primary"},on:{click:t.goBack}},[t._v(" 返回")])],1)],1),a("el-col",{staticClass:"search-right",attrs:{span:5}},[a("el-button",{attrs:{type:"text",icon:"el-icon-plus"},on:{click:t.handleAddRecords}},[t._v("采样记录单导出")]),a("el-button",{attrs:{type:"text",icon:"el-icon-refresh"},on:{click:t.handleSearch}},[t._v("刷新")])],1)],1)],1),a("div",[a("el-table",{staticStyle:{width:"100%"},attrs:{stripe:"",border:"",data:t.sampleData,"highlight-current-row":"","header-cell-style":{background:"#ECF3FC"}}},[a("template",{slot:"empty"},[a("div",{staticClass:"table_empty"},[a("div",{staticClass:"empty_tips"},[a("span",[t._v("\n              暂无采样样品信息\n            ")])])])]),a("el-table-column",{attrs:{type:"index",width:"50",label:"序号",fixed:"left",align:"center"}}),a("el-table-column",{attrs:{prop:"sampleNo",label:"样品编号",fixed:"left",width:"150px",align:"center"}}),a("el-table-column",{attrs:{prop:"inspectionName",label:"受检单位",align:"center"}}),a("el-table-column",{attrs:{prop:"factorPoint",label:"采样点位",align:"center"}}),a("el-table-column",{attrs:{prop:"secdClassName",label:"检测类别",sortable:"",width:"130px",align:"center"}}),a("el-table-column",{attrs:{prop:"collectTime",label:"采样时间",align:"center",width:"190px"},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.row;return[t._v("\n          "+t._s(a.collectTime&&a.collectTime.length>0?a.collectDate+" "+a.collectTime:a.collectDate)+"\n        ")]}}])}),a("el-table-column",{attrs:{prop:"sampTaskStatus",label:"状态",width:"120px",align:"center"},scopedSlots:t._u([{key:"default",fn:function(e){var r=e.row;return[a("el-tag",{attrs:{effect:"dark",type:t._f("statusQualityFilter")(r.smapStatus)}},[t._v("\n            "+t._s(t.SAMPLE_STATUS[r.smapStatus])+"\n          ")])]}}])}),a("el-table-column",{attrs:{prop:"collectUser",label:"采样人",width:"160",align:"center"}}),a("el-table-column",{attrs:{prop:"storeTime",label:"入库时间",width:"160",align:"center"}}),a("el-table-column",{attrs:{fixed:"right",align:"center",width:"80",label:"操作"},scopedSlots:t._u([{key:"default",fn:function(e){return[e.row.smapStatus>1?a("el-button",{attrs:{type:"text"},on:{click:function(a){return t.handleDetail(e.row)}}},[t._v(" 查看")]):t._e()]}}])})],2)],1),a("div",{staticStyle:{float:"right"}},[a("pagination",{directives:[{name:"show",rawName:"v-show",value:t.total>0,expression:"total>0"}],attrs:{total:t.total,page:t.searchForm.pageNumber,limit:t.searchForm.pageSize},on:{"update:page":function(e){return t.$set(t.searchForm,"pageNumber",e)},"update:limit":function(e){return t.$set(t.searchForm,"pageSize",e)},pagination:t.handleSearch}})],1),a("el-dialog",{attrs:{title:t.currentSample+"-详情",visible:t.sampleVisible,width:"85%",center:"",top:"5vh"},on:{"update:visible":function(e){t.sampleVisible=e}}},[a("el-form",{attrs:{model:t.sampleDetailForm,"label-width":"180px","label-position":"right"}},[a("el-card",{staticStyle:{"margin-top":"5px","padding-bottom":"20px"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("div",{staticStyle:{width:"3px",margin:"auto 3px",height:"20px","background-color":"steelblue"}}),a("span",[t._v("基础信息")])]),a("el-col",{staticStyle:{height:"32px"},attrs:{span:16}},[a("el-form-item",{attrs:{"label-width":"100",label:"检测因子:"}},[a("span",{staticClass:"showTile"},[t._v(t._s(t.sampleDetailForm.factorName))])])],1),a("el-col",{staticStyle:{height:"32px"},attrs:{span:8}},[a("el-form-item",{attrs:{"label-width":"100",label:"点位:"}},[a("span",{staticClass:"showTile"},[t._v(t._s(t.sampleDetailForm.factorPoint))])])],1)],1),t._l(t.sampleSecInfo,(function(e){return a("el-card",{key:e.groupKey,staticStyle:{"margin-top":"5px","padding-bottom":"20px"}},[e.groupName&&""!=e.groupName?a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("div",{staticStyle:{width:"3px",margin:"auto 3px",height:"20px","background-color":"steelblue"}}),a("span",[t._v(t._s(e.groupName))])]):t._e(),t._l(e.params,(function(e,r){return a("el-col",{key:r,staticStyle:{height:"32px"},attrs:{span:8}},[a("el-form-item",{attrs:{"label-width":"100"}},[a("span",{attrs:{slot:"label"},slot:"label"},[t._v(t._s(e.name)+":")]),a("span",{staticClass:"showTile"},[t._v(t._s(e.value?e.value.toString():""))])])],1)}))],2)})),t.sampleDataInfo&&t.sampleDataInfo.length>0?a("el-card",{staticStyle:{"margin-top":"5px"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("div",{staticStyle:{width:"3px",margin:"auto 3px",height:"20px","background-color":"steelblue"}}),a("span",[t._v("现场检测因子信息")])]),a("el-table",{attrs:{border:"",data:t.sampleDataInfo,stripe:""}},[a("el-table-column",{attrs:{prop:"factorName",label:"检测因子项目"}}),a("el-table-column",{attrs:{label:"因子结果集"},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.row;return[a.measuredForm?[t._v("\n                "+t._s("第一值: "+a.measuredForm.firstVal+" 第二值: "+a.measuredForm.secondVal+" 均值: "+a.measuredForm.avgVal)+"\n              ")]:[t._v("\n                "+t._s(a.factorData?a.factorData:"")+"\n              ")]]}}],null,!1,3613769334)}),a("el-table-column",{attrs:{prop:"checkEquipment",label:"检测设备"},scopedSlots:t._u([{key:"default",fn:function(e){var a=e.row;return[t._v("\n              "+t._s(a.checkEquipment&&a.checkEquipment.length>0?a.checkEquipment.replaceAll("^_^"," "):"")+"\n            ")]}}],null,!1,2289891611)}),a("el-table-column",{attrs:{prop:"theoreticalVal",label:"理论值"}}),a("el-table-column",{attrs:{prop:"groundConditions",label:"测定值"}})],1)],1):t._e(),a("el-card",{staticStyle:{"margin-top":"5px"}},[a("div",{staticClass:"clearfix",attrs:{slot:"header"},slot:"header"},[a("div",{staticStyle:{width:"3px",margin:"auto 3px",height:"20px","background-color":"steelblue"}}),a("span",[t._v("现场信息")])]),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{"label-width":"100",label:"采样地址:"}},[a("span",{staticClass:"showTile"},[t._v(t._s(t.sampleDetailForm.sampleDataVo.collectLocation))])])],1),a("el-col",{attrs:{span:12}},[a("el-form-item",{attrs:{"label-width":"100",label:"采样日期:"}},[a("span",{staticClass:"showTile"},[t._v(t._s(t.sampleDetailForm.sampleDataVo.collectDate))])])],1),a("el-col",{attrs:{span:24}},[a("el-form-item",{attrs:{"label-width":"100",label:"现场图片:"}},[t.sampleImageList&&t.sampleImageList.length>0?a("div",{staticClass:"demo-image__lazy"},t._l(t.sampleImageList,(function(e,r){return a("el-image",{key:r,staticStyle:{width:"100px",height:"100px","margin-left":"10px"},attrs:{src:e,"preview-src-list":t.sampleImageList}})})),1):t._e()])],1)],1)],2),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-button",{on:{click:function(e){t.sampleVisible=!1}}},[t._v("关 闭")])],1)],1),a("el-dialog",{attrs:{title:"现场采样记录单下载",visible:t.downVisible,width:"400px",center:""},on:{"update:visible":function(e){t.downVisible=e}}},[a("div",{staticStyle:{width:"500px",margin:"0 auto"}},[a("el-form",{attrs:{model:t.recordForm,"label-width":"90px"}},[a("el-form-item",{attrs:{label:"检测对象:"}},[a("el-select",{staticStyle:{width:"240px"},attrs:{clearable:"",filterable:"",placeholder:"检测对象"},on:{change:t.findSecClass},model:{value:t.recordForm.classId,callback:function(e){t.$set(t.recordForm,"classId",e)},expression:"recordForm.classId"}},t._l(t.classArray,(function(t){return a("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})})),1)],1),a("el-form-item",{attrs:{label:"检测类别:"}},[a("el-select",{staticStyle:{width:"240px"},attrs:{clearable:"",filterable:"",placeholder:"检测类别"},model:{value:t.recordForm.secClassId,callback:function(e){t.$set(t.recordForm,"secClassId",e)},expression:"recordForm.secClassId"}},t._l(t.secClassArray,(function(t){return a("el-option",{key:t.id,attrs:{label:t.name,value:t.id}})})),1)],1)],1)],1),a("div",{staticClass:"dialog-footer",attrs:{slot:"footer"},slot:"footer"},[a("el-row",[a("el-col",{staticStyle:{"text-align":"left"},attrs:{span:8}},[a("el-button",{attrs:{type:"primary",size:"small"},on:{click:t.allDownload}},[t._v("全部下载")])],1),a("el-col",{staticStyle:{"text-align":"right"},attrs:{span:16}},[a("el-button",{attrs:{size:"small"},on:{click:function(e){t.downVisible=!1}}},[t._v("取消")]),a("el-button",{attrs:{type:"primary",size:"small"},on:{click:t.confirmDownload}},[t._v("确认")])],1)],1)],1)])],1)},n=[],o=a("47bc"),s=a("d43b"),l=a("b705"),i=a("333d"),c={0:"待采样",1:"已采样",2:"组长待审核",3:"负责人待审核",4:"审核通过",5:"审核失败",6:"已入库",7:"部分出库",8:"已出库",9:"入库中",10:"待复核"},u={components:{Pagination:i["a"]},filters:{statusQualityFilter:function(t){return"0"===t||"5"===t?"":"9"===t?"danger":t<4?"warning":t<9?"success":"danger"}},data:function(){return{SAMPLE_STATUS:c,sampleData:[],searchForm:{sampTaskId:"",sampleNo:"",sampStatus:"",pageNumber:1,pageSize:10},total:0,currentSample:"",sampleDetailForm:{factorName:"",factorPoint:"",secdClassName:"",factorDataVos:[],sampleDataVo:{collectDate:"",collectLocation:"",imageList:[],sampleData:[],specialNote:""},sampleJobVo:{projectName:"",jobRemark:""}},sampleImage:"",sampleVisible:!1,sampleImageList:[],downVisible:!1,recordForm:{taskId:"",classId:"",secClassId:"",sampleDate:""},classArray:[],secClassArray:[],sampleDetails:[],sampleDataInfo:[],sampleSecInfo:[]}},created:function(){this.getClassList(),this.$route.params.sampTaskId&&(this.searchForm.sampTaskId=this.$route.params.sampTaskId,this.handleSearch())},methods:{handleSearch:function(){var t=this;this.searchForm.sampTaskId&&o["t"](this.searchForm).then((function(e){200===e.code&&(t.sampleData=e.result.records,t.total=e.result.total)}))},handleDetail:function(t){var e=this;this.currentSample=t.sampleNo,this.sampleImageList=[],this.sampleDataInfo=[],this.sampleSecInfo=[],this.sampleImage="";var a=this.$store.getters.sysBaseUrl+"/cyImg/";s["g"](t.sampItemId).then((function(t){200===t.code&&t.result&&(e.sampleDetailForm=t.result||{},e.$nextTick((function(){e.sampleImageList=t.result.sampleDataVo.imageList.map((function(t){return a+t})),e.sampleSecInfo=t.result.sampleDataVo.sampleData||[];var r=t.result.factorDataVos.filter((function(t){return"1"===t.dataEntryStep&&-1===t.checkStandardId.indexOf("100004-")}))||[];e.sampleDataInfo=r.map((function(t){return t.measuredFormVal&&t.measuredFormVal.length>0&&e.$set(t,"measuredForm",JSON.parse(t.measuredFormVal)),t}))})),e.sampleVisible=!0)}))},getClassList:function(){var t=this;l["a"]().then((function(e){t.classArray=e.result||[]}))},findSecClass:function(t){var e=this;this.recordForm.secClassId="",l["d"](t).then((function(t){e.secClassArray=t.result||[]}))},handleAddRecords:function(){this.recordForm.taskId=this.$route.params.sampTaskId,this.recordForm.classId="",this.recordForm.secClassId="",this.recordForm.sampleDate="",this.downVisible=!0},allDownload:function(){var t="/api/word/downBlankSampleRecordByTaskId?taskId="+this.recordForm.taskId;window.open(t)},confirmDownload:function(){if(this.recordForm.taskId&&this.recordForm.secClassId){var t="/api/word/downSampleRecordByTaskIdAndSecdClassId?taskId="+this.recordForm.taskId+"&secdClassId="+this.recordForm.secClassId;window.open(t)}else this.$message.warning("检测类别不能为空")},goBack:function(){this.$router.go(-1)}}},m=u,d=(a("85be"),a("e744"),a("2877")),p=Object(d["a"])(m,r,n,!1,null,"1d88e46e",null);e["default"]=p.exports},"85be":function(t,e,a){"use strict";a("48cd")},b705:function(t,e,a){"use strict";a.d(e,"g",(function(){return n})),a.d(e,"c",(function(){return o})),a.d(e,"b",(function(){return s})),a.d(e,"f",(function(){return l})),a.d(e,"a",(function(){return i})),a.d(e,"d",(function(){return c})),a.d(e,"e",(function(){return u})),a.d(e,"h",(function(){return m})),a.d(e,"i",(function(){return d}));var r=a("b775");function n(t){return Object(r["a"])({url:"/common/findDictMap/".concat(t),method:"get"})}function o(){return Object(r["a"])({url:"/common/findSampLeaders",method:"get"})}function s(){return Object(r["a"])({url:"/common/findMonitorFreq",method:"get"})}function l(){return Object(r["a"])({url:"/judge/organ/findValidList",method:"get"})}function i(){return Object(r["a"])({url:"/platform/factor/findFstClasses",method:"get"})}function c(t){return Object(r["a"])({url:"/platform/factor/findSecdClassByClassId/".concat(t),method:"get"})}function u(){return Object(r["a"])({url:"/platform/factor/findClassTrees",method:"get"})}function m(){return Object(r["a"])({url:"/sysRegion/getFirstLevel",method:"get"})}function d(t){return Object(r["a"])({url:"/sysRegion/getSubRegionByRegionCode/".concat(t),method:"get"})}},d1cb:function(t,e,a){},d43b:function(t,e,a){"use strict";a.d(e,"d",(function(){return n})),a.d(e,"i",(function(){return o})),a.d(e,"g",(function(){return s})),a.d(e,"h",(function(){return l})),a.d(e,"f",(function(){return i})),a.d(e,"e",(function(){return c})),a.d(e,"c",(function(){return u})),a.d(e,"b",(function(){return m})),a.d(e,"a",(function(){return d}));var r=a("b775");function n(t){return Object(r["a"])({url:"/sample/findByCondition",method:"get",params:t})}function o(t){return Object(r["a"])({url:"/sample/getSamplesBySampTaskId",method:"get",params:t})}function s(t){return Object(r["a"])({url:"/sample/getSampleDataBySampItemId/".concat(t),method:"get"})}function l(t){return Object(r["a"])({url:"/sample/getSampleDetailBySampItemId/".concat(t),method:"get"})}function i(t){return Object(r["a"])({url:"/sample/getSampStoreApplyList",method:"get",params:t})}function c(t){return Object(r["a"])({url:"/sample/getSampDrawApplyList",method:"get",params:t})}function u(t){return Object(r["a"])({url:"/sample/doStoreSample",method:"post",data:t})}function m(t){return Object(r["a"])({url:"/sample/doDrawSample",method:"post",data:t})}function d(t){return Object(r["a"])({url:"/sample/batchDoStoreSample",method:"post",data:t})}},e744:function(t,e,a){"use strict";a("d1cb")}}]);