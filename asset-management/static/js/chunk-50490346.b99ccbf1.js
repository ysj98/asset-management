(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-50490346"],{"0630":function(e,a,t){"use strict";var s=t("4a1e");t.n(s).a},"4a1e":function(e,a,t){},"5f43":function(e,a,t){"use strict";var s=t("eb11");t.n(s).a},b85b:function(e,a,t){"use strict";var s={name:"FormFooter",components:{AButton:t("4e72").Button},props:{rightButtonName:{type:String,default:"取消"},leftButtonName:{type:String,default:"提交"},showSave:{type:Boolean,default:!0},showCancel:{type:Boolean,default:!0},rightButtonType:{type:String,default:"default"}},data:function(){return{}}},i=(t("5f43"),t("6691")),l=Object(i.a)(s,(function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"form-footer"},[e._t("default",[e.showSave?t("a-button",{attrs:{type:"primary"},on:{click:function(a){return e.$emit("save")}}},[e._v(e._s(e.leftButtonName))]):e._e(),e.showCancel?t("a-button",{attrs:{type:e.rightButtonType},on:{click:function(a){return e.$emit("cancel")}}},[e._v(e._s(e.rightButtonName))]):e._e()])],2)}),[],!1,null,"7f311a34",null);a.a=l.exports},cd3c:function(e,a,t){"use strict";t("cc1d"),t("4634");var s=t("b85b"),i=[{title:"编号",dataIndex:"billConfId",width:"160"},{title:"处置类型",dataIndex:"disposalTypeName",width:"160"},{slots:{title:"disposalCostSubject"},dataIndex:"disposalCostSubject",width:"160",scopedSlots:{customRender:"disposalCostSubject"}},{slots:{title:"disposalIncomeSubject"},dataIndex:"disposalIncomeSubject",width:"160",scopedSlots:{customRender:"disposalIncomeSubject"}}],l={components:{FormFooter:s.a},data:function(){return{pageType:"edit",editable:!0,form:this.$form.createForm(this),allStyle:"width: 160px;",detail:{organName:"",assetTypeName:"",professionName:"",unit:void 0,unitName:"",depreciationMethod:void 0,depreciationMethodName:"",netSalvageRate:"",remark:"",createByName:"",createTime:"",statusName:"",assetCodePrx:"",assetCodeLen:7,assetCardCodePrx:"",assetCardCodeLen:5},unitOptions:[{label:"平方米",value:"1"},{label:"米",value:"2"},{label:"亩",value:"3"}],depreciationMethodOptions:[{label:"平均年限法（基于入账原值）",value:"1"},{label:"平均年限法（基于入账净值）",value:"2"}],assetCodePreview:"",assetCodePrxOK:!1,assetCodeLenOK:!0,assetCardCodePreview:"",assetCardCodePrxOK:!1,assetCardCodeLenOK:!0,columns:i,dataSource:[],billConfigOptions:[{label:"科目001",value:"1"},{label:"科目002",value:"2"},{label:"科目003",value:"3"}],showSubjectSetModal:!1,subjectSetType:"",multiSetSubject:""}},methods:{validateRemark:function(e,a,t){200<a.length?t("备注长度不能超过200个字"):t()},validateAssetCodePrx:function(e,a,t){this.assetCodePrxOK=!1,(this.detail.assetCodePrx=a)?3!==a.length?t("编码前缀必须为3位字符"):/^[A-Za-z0-9]*$/.test(a)?(this.assetCodePrxOK=!0,t()):t("编码前缀格式不正确"):t("请输入资产编码前缀")},validateAssetCardCodePrx:function(e,a,t){this.assetCardCodePrxOK=!1,(this.detail.assetCardCodePrx=a)?3!==a.length?t("编码前缀必须为3位字符"):/^[A-Za-z0-9]*$/.test(a)?(this.assetCardCodePrxOK=!0,t()):t("编码前缀格式不正确"):t("请输入资产编码前缀")},validateAssetCodeLen:function(e,a,t){this.detail.assetCodeLen=a,this.assetCodeLenOK=!1,a?a<5||10<a?t("资产编码长度取值范围为5-10"):(this.assetCodeLenOK=!0,t()):t("请输入资产编码长度")},validateAssetCardCodeLen:function(e,a,t){this.detail.assetCardCodeLen=a,this.assetCardCodeLenOK=!1,a?a<4||10<a?t("资产卡片编码长度取值范围为4-10"):(this.assetCardCodeLenOK=!0,t()):t("请输入资产卡片编码长度")},createCode:function(e,a){for(var t=e,s=0;s<a-1;s++)t+="0";return t+"1"},openSubjectModal:function(e){this.showSubjectSetModal=!0,this.subjectSetType=e},handleMultiSetSubject:function(){var e=this,a={cost:"disposalCostSubject",income:"disposalIncomeSubject"};this.dataSource.forEach((function(t){t[a[e.subjectSetType]]=e.multiSetSubject})),this.multiSetSubject="",this.showSubjectSetModal=!1},handleSubmit:function(){this.form.validateFields((function(e,a){}))},cancel:function(){},getDetail:function(){var e=this,a={categoryConfId:this.categoryConfId};this.$api.assets.getDetail(a).then((function(a){if("0"===a.data.code){var t=a.data.data;e.detail=t,e.assetCodePrxOK=!0,e.assetCardCodePrxOK=!0,e.detail.billCfgList.forEach((function(e,a){e.key=a.toString()})),e.dataSource=e.detail.billCfgList}}))}},mounted:function(){this.pageType=this.$route.query.pageType,this.categoryConfId=this.$route.query.categoryConfId,this.editable="edit"===this.pageType,this.getDetail()},watch:{"detail.assetCodePrx":function(){this.assetCodePrxOK&&this.assetCodeLenOK?this.assetCodePreview=this.createCode(this.detail.assetCodePrx,this.detail.assetCodeLen):this.assetCodePreview=""},"detail.assetCodeLen":function(){this.assetCodePrxOK&&this.assetCodeLenOK?this.assetCodePreview=this.createCode(this.detail.assetCodePrx,this.detail.assetCodeLen):this.assetCodePreview=""},"detail.assetCardCodePrx":function(){this.assetCardCodePrxOK&&this.assetCardCodeLenOK?this.assetCardCodePreview=this.createCode(this.detail.assetCardCodePrx,this.detail.assetCardCodeLen):this.assetCardCodePreview=""},"detail.assetCardCodeLen":function(){this.assetCardCodePrxOK&&this.assetCardCodeLenOK?this.assetCardCodePreview=this.createCode(this.detail.assetCardCodePrx,this.detail.assetCardCodeLen):this.assetCardCodePreview=""}}},o=(t("0630"),t("6691")),d=Object(o.a)(l,(function(){var e=this,a=e.$createElement,t=e._self._c||a;return t("div",{staticClass:"handle-class-set"},[t("a-form",{attrs:{form:e.form},on:{submit:e.handleSubmit}},[t("div",{staticClass:"edit-box"},[t("div",{staticClass:"edit-box-title"},[t("i"),t("span",[e._v("基础信息")])]),t("div",{staticClass:"edit-box-content"},[t("div",{staticClass:"edit-box-content-item"},[t("div",{staticClass:"label-name-box"},[t("span",{staticClass:"label-name"},[e._v("所属组织机构"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.organName||"--"))])])],1),t("div",{staticClass:"edit-box-content-item"},[t("div",{staticClass:"label-name-box"},[t("span",{staticClass:"label-name"},[e._v("资产类型"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.assetTypeName||"--"))])])],1),t("div",{staticClass:"edit-box-content-item"},[t("div",{staticClass:"label-name-box"},[t("span",{staticClass:"label-name"},[e._v("分类名称"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.professionName||"--"))])])],1),t("div",{staticClass:"edit-box-content-item"},[t("div",{staticClass:"label-name-box"},[t("span",{staticClass:"label-name",class:{"label-space-between":e.editable}},[e._v("计量单位"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[e.editable?t("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["unit",{rules:[],initialValue:e.detail.unit}],expression:"['unit',\n              {rules: [], initialValue: detail.unit}]"}],style:e.allStyle,attrs:{allowClear:"",placeholder:"请选择计量单位",options:e.unitOptions}}):t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.unitName||"--"))])],1)],1),t("div",{staticClass:"edit-box-content-item"},[t("div",{staticClass:"label-name-box",class:{required:e.editable}},[t("span",{staticClass:"label-name",class:{"label-space-between":e.editable}},[e._v("折旧方法"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[e.editable?t("a-select",{directives:[{name:"decorator",rawName:"v-decorator",value:["depreciationMethod",{rules:[{required:!0,message:"请选择折旧方法"}],initialValue:e.detail.depreciationMethod}],expression:"['depreciationMethod',\n              {rules: [{required: true, message: '请选择折旧方法'}], initialValue: detail.depreciationMethod}]"}],style:e.allStyle,attrs:{allowClear:"",placeholder:"请选择折旧方法",options:e.depreciationMethodOptions}}):t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.depreciationMethodName||"--"))])],1)],1),t("div",{staticClass:"edit-box-content-item"},[t("div",{staticClass:"label-name-box",class:{required:e.editable}},[t("span",{staticClass:"label-name",class:{"label-space-between":e.editable}},[e._v("净残值率(%)"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[e.editable?t("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["netSalvageRate",{rules:[{required:!0,message:"请输入净残值率(%)"}],initialValue:e.detail.netSalvageRate}],expression:"['netSalvageRate',\n              {rules: [{required: true, message: '请输入净残值率(%)'}], initialValue: detail.netSalvageRate}\n            ]"}],style:e.allStyle,attrs:{placeholder:"请输入净残值率(%)",min:0,max:100,step:"1"}}):t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.netSalvageRate||"--"))])],1)],1),t("div",{directives:[{name:"show",rawName:"v-show",value:e.editable,expression:"editable"}],staticClass:"edit-box-content-item total-width"},[t("div",{staticClass:"label-name-box"},[t("span",{staticClass:"label-name",class:{"label-space-between":e.editable}},[e._v("备注"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",{staticClass:"label-value"},[t("a-textarea",{directives:[{name:"decorator",rawName:"v-decorator",value:["remark",{rules:[{validator:e.validateRemark}],initialValue:e.detail.remark}],expression:"['remark',\n              {rules: [{validator: validateRemark}], initialValue: detail.remark}]"}],attrs:{placeholder:"请输入备注信息（最多200字）",rows:3}})],1)],1),t("div",{directives:[{name:"show",rawName:"v-show",value:!e.editable,expression:"!editable"}],staticClass:"edit-box-content-item"},[t("div",{staticClass:"label-name-box"},[t("span",{staticClass:"label-name"},[e._v("创建人"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.createByName||"--"))])])],1),t("div",{directives:[{name:"show",rawName:"v-show",value:!e.editable,expression:"!editable"}],staticClass:"edit-box-content-item"},[t("div",{staticClass:"label-name-box"},[t("span",{staticClass:"label-name"},[e._v("创建时间"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.createTime||"--"))])])],1),t("div",{directives:[{name:"show",rawName:"v-show",value:!e.editable,expression:"!editable"}],staticClass:"edit-box-content-item"},[t("div",{staticClass:"label-name-box"},[t("span",{staticClass:"label-name"},[e._v("状态"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.statusName||"--"))])])],1),t("div",{directives:[{name:"show",rawName:"v-show",value:!e.editable,expression:"!editable"}],staticClass:"edit-box-content-item"},[t("div",{staticClass:"label-name-box"},[t("span",{staticClass:"label-name"},[e._v("备注"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.remark||"--"))])])],1)]),t("div",{staticClass:"edit-box"},[t("div",{staticClass:"edit-box-title"},[t("i"),t("span",[e._v("基础信息")])]),t("div",{staticClass:"edit-box-content"},[t("div",{staticClass:"edit-box-content-item long-label"},[t("div",{staticClass:"label-name-box",class:{required:e.editable}},[t("span",{staticClass:"label-name",class:{"label-space-between":e.editable}},[e._v("资产编码前缀"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",{staticClass:"label-value"},[e.editable?t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["assetCodePrx",{rules:[e.validateAssetCodePrx],initialValue:e.detail.assetCodePrx}],expression:"['assetCodePrx',\n              {rules: [validateAssetCodePrx], initialValue: detail.assetCodePrx}\n            ]"}],style:e.allStyle,attrs:{placeholder:"请输入资产编码前缀"}}):t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.assetCodePrx||"--"))])],1)],1),t("div",{staticClass:"edit-box-content-item long-label"},[t("div",{staticClass:"label-name-box",class:{required:e.editable}},[t("span",{staticClass:"label-name",class:{"label-space-between":e.editable}},[e._v("资产编码长度"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[e.editable?t("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["assetCodeLen",{rules:[e.validateAssetCodeLen],initialValue:e.detail.assetCodeLen}],expression:"['assetCodeLen',\n              {rules: [validateAssetCodeLen], initialValue: detail.assetCodeLen}\n            ]"}],style:e.allStyle,attrs:{placeholder:"请输入资产编码长度",step:"1"}}):t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.assetCodeLen||"--"))])],1)],1),t("div",{staticClass:"edit-box-content-item"},[t("div",{staticClass:"label-name-box"},[t("span",{staticClass:"label-name"},[e._v("预览"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[t("span",{staticClass:"label-value"},[e._v(e._s(e.assetCodePreview||"--"))])])],1),t("div",{staticClass:"edit-box-content-item long-label"},[t("div",{staticClass:"label-name-box",class:{required:e.editable}},[t("span",{staticClass:"label-name",class:{"label-space-between":e.editable}},[e._v("资产卡片编码前缀"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[e.editable?t("a-input",{directives:[{name:"decorator",rawName:"v-decorator",value:["assetCardCodePrx",{rules:[{required:!0,message:"请输入资产卡片编码前缀"},e.validateAssetCardCodePrx],initialValue:e.detail.assetCardCodePrx}],expression:"['assetCardCodePrx',\n              {rules: [{required: true, message: '请输入资产卡片编码前缀'}, validateAssetCardCodePrx], initialValue: detail.assetCardCodePrx}\n            ]"}],style:e.allStyle,attrs:{placeholder:"请输入资产卡片编码前缀"}}):t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.assetCardCodePrx||"--"))])],1)],1),t("div",{staticClass:"edit-box-content-item long-label"},[t("div",{staticClass:"label-name-box",class:{required:e.editable}},[t("span",{staticClass:"label-name",class:{"label-space-between":e.editable}},[e._v("资产卡片编码长度"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[e.editable?t("a-input-number",{directives:[{name:"decorator",rawName:"v-decorator",value:["assetCardCodeLen",{rules:[{required:!0,message:"请输入资产卡片编码长度"},e.validateAssetCardCodeLen],initialValue:e.detail.assetCardCodeLen}],expression:"['assetCardCodeLen',\n              {rules: [{required: true, message: '请输入资产卡片编码长度'}, validateAssetCardCodeLen], initialValue: detail.assetCardCodeLen}\n            ]"}],style:e.allStyle,attrs:{placeholder:"请输入资产卡片编码长度",step:"1"}}):t("span",{staticClass:"label-value"},[e._v(e._s(e.detail.assetCardCodeLen||"--"))])],1)],1),t("div",{staticClass:"edit-box-content-item"},[t("div",{staticClass:"label-name-box"},[t("span",{staticClass:"label-name"},[e._v("预览"),t("i")]),t("span",[e._v("：")])]),t("a-form-item",[t("span",{staticClass:"label-value"},[e._v(e._s(e.assetCardCodePreview||"--"))])])],1)])]),t("div",{staticClass:"edit-box"},[t("div",{staticClass:"edit-box-title"},[t("i"),t("span",[e._v("费用科目设置")])]),t("div",{staticClass:"edit-box-content"},[t("a-table",{staticClass:"custom-table",attrs:{columns:e.columns,dataSource:e.dataSource,pagination:!1},scopedSlots:e._u([{key:"disposalCostSubject",fn:function(a,s){return[e.editable?t("a-select",{staticStyle:{width:"80%"},attrs:{options:e.billConfigOptions},model:{value:s.disposalCostSubject,callback:function(a){e.$set(s,"disposalCostSubject",a)},expression:"record.disposalCostSubject"}}):t("span",[e._v(e._s(s.disposalCostSubjectName))])]}},{key:"disposalIncomeSubject",fn:function(a,s){return[e.editable?t("a-select",{staticStyle:{width:"80%"},attrs:{options:e.billConfigOptions},model:{value:s.disposalIncomeSubject,callback:function(a){e.$set(s,"disposalIncomeSubject",a)},expression:"record.disposalIncomeSubject"}}):t("span",[e._v(e._s(s.disposalIncomeSubjectName))])]}}])},[t("template",{slot:"disposalCostSubject"},[e.editable?t("a",{on:{click:function(a){return e.openSubjectModal("cost")}}},[e._v("处置成本费用科目")]):t("span",[e._v("处置成本费用科目")])]),t("template",{slot:"disposalIncomeSubject"},[e.editable?t("a",{on:{click:function(a){return e.openSubjectModal("income")}}},[e._v("处置收入费用科目")]):t("span",[e._v("处置收入费用科目")])])],2)],1)])])]),t("a-modal",{attrs:{title:"批量设置"},on:{ok:e.handleMultiSetSubject,cancel:function(a){e.showSubjectSetModal=!1}},model:{value:e.showSubjectSetModal,callback:function(a){e.showSubjectSetModal=a},expression:"showSubjectSetModal"}},[t("div",{staticClass:"multi-set-modal"},[t("span",[e._v(e._s("cost"===e.subjectSetType?"处置成本费用科目":"处置收入费用科目"))]),t("a-select",{staticStyle:{width:"180px"},attrs:{placeholder:"请选择",options:e.billConfigOptions},model:{value:e.multiSetSubject,callback:function(a){e.multiSetSubject=a},expression:"multiSetSubject"}})],1)]),t("form-footer",{directives:[{name:"show",rawName:"v-show",value:e.editable,expression:"editable"}],attrs:{leftButtonName:"提交",rightButtonName:"取消"},on:{save:e.handleSubmit,cancel:e.cancel}})],1)}),[],!1,null,"3128b596",null);a.a=d.exports},eb11:function(e,a,t){}}]);