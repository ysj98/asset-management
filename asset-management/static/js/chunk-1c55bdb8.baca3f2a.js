(window.webpackJsonp=window.webpackJsonp||[]).push([["chunk-1c55bdb8"],{"0150":function(e,t,a){"use strict";var n=a("9745");a.n(n).a},"19bd":function(e,t,a){"use strict";a("efce"),a("4634"),a("ed8b");var n=a("97a3"),r=a("dea4");function o(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}a("7cfd"),a("8f42");var i={components:{},props:{default:{type:Boolean,default:!0},allowClear:{type:Boolean,default:!0},placeholder:{type:String,default:"请选择组织机构树"},typeFilter:{type:String,default:""},value:{type:[String,Number],default:""},disabled:{type:Boolean,default:!1},showSearch:{type:Boolean,default:!1},multiple:{type:Boolean,default:!1},treeCheckable:{type:Boolean,default:!1},treeDefaultExpandAll:{type:Boolean,default:!1},dropdownStyle:{type:Object,default:function(){return{maxHeight:"400px",overflow:"auto"}}}},data:function(){return{organId:"",treeData:[]}},computed:{},methods:{initDepartment:function(){var e=this;this.$api.assets.queryAsynOrganByUserId({parentOrganId:"",typeFilter:this.typeFilter}).then((function(t){0===Number(t.data.code)&&(e.treeData=e.mapTreeNodes(t.data.data),e.default&&(e.organId=e.treeData[0].organId,e.organName=e.treeData[0].name,e.$emit("changeTree",e.organId,e.organName)))}))},onLoadData:function(e){var t=this;return new Promise((function(a){t.$api.assets.queryAsynOrganByUserId({parentOrganId:e.value,typeFilter:t.typeFilter}).then((function(n){if(0===Number(n.data.code)){var o=t.mapTreeNodes(n.data.data);t.setTree(e.value,t.treeData,o),t.treeData=Object(r.a)(t.treeData),a()}}))}))},setTree:function(e,t,a){for(var n=0;n<t.length;n++){if(Number(t[n].key)===Number(e))return void(t[n].children=Object(r.a)(a));t[n].children&&0<t[n].children.length&&this.setTree(e,t[n].children,a)}},mapTreeNodes:function(e){return e.map((function(e){var t=e.organId,a=e.name;return e.title=a,e.key=t,e.value=e.organId,function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?o(a,!0).forEach((function(t){Object(n.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):o(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({},e)}))},changeTree:function(e,t){this.multiple?(this.$emit("changeTree",e,t),this.organName=t):(this.$emit("changeTree",e,t[0]),this.organName=t[0]),this.organId=e}},created:function(){},mounted:function(){this.organId=this.value,this.initDepartment()}},l=a("6691"),s=Object(l.a)(i,(function(){var e=this,t=e.$createElement;return(e._self._c||t)("a-tree-select",{attrs:{multiple:e.multiple,showSearch:e.showSearch,dropdownStyle:e.dropdownStyle,treeData:e.treeData,placeholder:e.placeholder,allowClear:e.allowClear,loadData:e.onLoadData,disabled:e.disabled,treeCheckable:e.treeCheckable,treeDefaultExpandAll:e.treeDefaultExpandAll},on:{change:e.changeTree},model:{value:e.organId,callback:function(t){e.organId=t},expression:"organId"}})}),[],!1,null,"276f30da",null);t.a=s.exports},"3de6":function(e,t,a){},4786:function(e,t,a){"use strict";var n=a("3de6");a.n(n).a},"4cf2":function(e,t,a){"use strict";var n=a("fc6b");a.n(n).a},5714:function(e,t,a){"use strict";var n={name:"OverviewNumber",props:["numList"]},r=(a("0150"),a("6691")),o=Object(r.a)(n,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return e.numList.length?a("div",{staticClass:"overview_num"},e._l(e.numList,(function(t){return a("div",{key:t.title,staticClass:"view_item",style:{"background-color":t.bgColor||"",width:(100/e.numList.length).toFixed(3)+"%"}},[a("p",{style:{"font-size":"12px",color:t.fontColor||"#fff"}},[e._v(e._s(t.title))]),a("p",{style:{"font-size":"16px",color:t.fontColor||"#fff","font-weight":"bold"}},[e._v(e._s(t.value))])])})),0):e._e()}),[],!1,null,"5363a602",null);t.a=o.exports},"61df":function(e,t,a){"use strict";a("efce"),a("4634"),a("ed8b");var n=a("97a3");function r(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}var o={name:"OrganProjectBuilding",components:{TreeSelect:a("19bd").a},props:{isShowBuilding:{type:Boolean,default:function(){return!0}},value:{type:Object,default:function(){return{}}},showSearch:{type:Boolean,default:function(){return!0}},allowClear:{type:Boolean,default:function(){return!0}},size:{type:String,default:function(){return"default"}},mode:{type:String,default:function(){return"default"}}},data:function(){return{loading:!1,organId:"",organName:"",projectId:void 0,projectOptions:[],buildingId:void 0,buildingOptions:[{name:"11",id:2},{name:"101",id:20}],properties:{}}},methods:{changeTree:function(e,t){this.organName=t,this.organId=e},queryProjectData:function(){var e=this;this.loading=!0,new Promise.reject({}).then((function(e){if(e&&"0"===String(e.code))return e.data;throw e.message||"查询资产项目接口出错"})).catch((function(t){e.$message.error(t||"查询资产项目接口出错")}))},queryBuildingData:function(){this.loading=!0}},mounted:function(){var e=this.allowClear,t=this.size,a=this.showSearch,o=this.value,i=this.mode,l={allowClear:e,size:t,showSearch:a,mode:i};"multiple"===i&&(l.maxTagCount=1),this.properties=l,Object.assign(this,function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?r(a,!0).forEach((function(t){Object(n.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):r(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({},o))},watch:{organId:function(e){Object.assign(this,{projectId:void 0,buildingId:void 0}),this.$emit("input",{organId:e,projectId:void 0,buildingId:void 0}),this.queryProjectData()},projectId:function(e){var t=this.organId;this.buildingId="",this.$emit("input",{organId:t,projectId:e,buildingId:void 0}),this.queryBuildingData()},buildingId:function(e){var t=this.organId,a=this.projectId;this.$emit("input",{organId:t,projectId:a,buildingId:e})}}},i=(a("4786"),a("6691")),l=Object(i.a)(o,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",{staticClass:"choose_area"},[a("a-row",{attrs:{gutter:8}},[a("a-col",{attrs:{span:8}},[a("tree-select",{staticClass:"organ_style",on:{changeTree:e.changeTree}})],1),a("a-col",{attrs:{span:8}},[a("a-select",e._b({staticClass:"project_style",attrs:{placeholder:"请选择资产项目",loading:e.loading&&!e.projectOptions.length},model:{value:e.projectId,callback:function(t){e.projectId=t},expression:"projectId"}},"a-select",e.properties,!1),e._l(e.projectOptions,(function(t){var n=t.name,r=t.id;return a("a-select-option",{key:r},[e._v(e._s(n+"("+r+")"))])})),1)],1),a("a-col",{attrs:{span:8}},[e.isShowBuilding?a("a-select",e._b({staticClass:"building_style",attrs:{placeholder:"请选择楼栋",loading:e.loading&&!e.buildingOptions.length},model:{value:e.buildingId,callback:function(t){e.buildingId=t},expression:"buildingId"}},"a-select",e.properties,!1),e._l(e.buildingOptions,(function(t){var n=t.name,r=t.id;return a("a-select-option",{key:r},[e._v(e._s(n))])})),1):e._e()],1)],1)],1)}),[],!1,null,"2a3d77d3",null);t.a=l.exports},"757f":function(e,t,a){"use strict";a.r(t),a("efce"),a("4634"),a("ed8b");var n=a("97a3"),r=a("5714"),o=a("61df");function i(e,t){var a=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),a.push.apply(a,n)}return a}var l={name:"index",components:{OverviewNumber:r.a,OrganProjectBuilding:o.a},data:function(){return{overviewNumSpinning:!1,exportBtnLoading:!1,organProjectBuildingValue:{},numList:[{title:"所有资产(㎡)",key:"totalArea",value:0,fontColor:"#324057"},{title:"运营(㎡)",key:"totalOperationArea",value:0,bgColor:"#4BD288"},{title:"闲置(㎡)",key:"totalIdleArea",value:0,bgColor:"#1890FF"},{title:"自用(㎡)",key:"totalSelfUserArea",value:0,bgColor:"#DD81E6"},{title:"占用(㎡)",key:"totalOccupationArea",value:0,bgColor:"#FD7474"},{title:"其他(㎡)",key:"totalOtherArea",value:0,bgColor:"#BBC8D6"}],tableObj:{dataSource:[],loading:!1,scroll:{x:!0},rowKey:"assetHouseId",columns:[{title:"楼栋名称",dataIndex:"assetName",key:"assetName",fixed:"left"},{title:"楼栋编号",dataIndex:"assetCode",key:"assetCode"},{title:"资产项目名称",dataIndex:"projectName",key:"projectName"},{title:"丘地号",dataIndex:"addressNo",key:"addressNo"},{title:"建筑年代",dataIndex:"years",key:"years"},{title:"建筑面积(㎡)",dataIndex:"area",key:"area",align:"right"},{title:"楼高",dataIndex:"buildHeight",key:"buildHeight"},{title:"层数",dataIndex:"floorNum",key:"floorNum"},{title:"地上层数",dataIndex:"upFloorNum",key:"upFloorNum"},{title:"地下层数",dataIndex:"downFloorNum",key:"downFloorNum"},{title:"资产数量",dataIndex:"assetNum",key:"assetNum",scopedSlots:{customRender:"assetNum"}},{title:"运营(㎡)",dataIndex:"transferOperationArea",key:"transferOperationArea"},{title:"自用(㎡)",dataIndex:"selfUserArea",key:"selfUserArea"},{title:"闲置(㎡)",dataIndex:"idleArea",key:"idleArea"},{title:"占用(㎡)",dataIndex:"occupationArea",key:"occupationArea"},{title:"其它(㎡)",dataIndex:"otherArea",key:"otherArea"},{title:"资产原值(元)",dataIndex:"originalValue",key:"originalValue"},{title:"最新估值(元)",dataIndex:"assetValuation",key:"assetValuation"},{title:"操作",key:"action",scopedSlots:{customRender:"action"},fixed:"right"}]},paginationObj:{pageNo:0,totalCount:0,pageLength:10,location:"absolute"}}},methods:{handleViewDetail:function(e){var t=e.projectId,a=e.assetHouseId;a&&this.$router.push({name:"楼栋视图详情",params:{organId:1111,projectId:t,assetHouseId:a}})},queryTableData:function(e){var t=this,a=e.pageNo,n=void 0===a?1:a,r=e.pageLength,o=void 0===r?10:r,i=e.type,l=this.organProjectBuildingValue,s=l.organId,u=l.projectId,c=l.buildingId;this.tableObj.loading=!0,this.$api.assets.queryBuildingViewPage({organId:s,houseIdList:c,projectIdList:u,pageSize:o,pageNum:n}).then((function(e){t.tableObj.loading=!1;var a=e.data;if(a&&"0"===String(a.code)){var r=a.data,l=r.count,s=r.data;return t.tableObj.dataSource=s,Object.assign(t.paginationObj,{totalCount:l,pageNo:n,pageLength:o}),"search"===i&&t.queryAreaInfo(),!1}throw a.message||"查询资产项目接口出错"})).catch((function(e){t.tableObj.loading=!1,t.$message.error(e||"查询资产项目接口出错")}))},queryAreaInfo:function(){var e=this,t=this.organProjectBuildingValue,a=t.organId,r=t.projectId,o=t.buildingId,l=this.numList;this.overviewNumSpinning=!0,this.$api.assets.queryBuildingViewFloorArea({organId:a,houseIdList:o,projectIdList:r}).then((function(t){e.overviewNumSpinning=!1;var a=t.data;if(a&&"0"===String(a.code))return e.numList=l.map((function(e){return function(e){for(var t=1;t<arguments.length;t++){var a=null!=arguments[t]?arguments[t]:{};t%2?i(a,!0).forEach((function(t){Object(n.a)(e,t,a[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(a)):i(a).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(a,t))}))}return e}({},e,{value:a.data[e.key]})}));throw a.message||"查询楼栋视图面积使用统计出错"})).catch((function(t){e.overviewNumSpinning=!1,e.$message.error(t||"查询楼栋视图面积使用统计出错")}))},handleExport:function(){var e=this;this.exportBtnLoading=!0;var t=this.organProjectBuildingValue,a=t.organId,n=t.projectId,r=t.buildingId;this.$api.assets.exportBuildingViewExcel({organId:a,houseIdList:r,projectIdList:n}).then((function(t){if(e.exportBtnLoading=!1,t&&"0"===String(t.code))return!1;throw t.message||"导出楼栋视图失败"})).catch((function(t){e.exportBtnLoading=!1,e.$message.error(t||"导出楼栋视图失败")}))}},mounted:function(){},watch:{"organProjectBuildingValue.buildingId":function(e){e&&this.queryTableData({type:"search"})}}},s=(a("4cf2"),a("6691")),u=Object(s.a)(l,(function(){var e=this,t=e.$createElement,a=e._self._c||t;return a("div",[a("div",{staticStyle:{padding:"19px 30px"}},[a("a-row",{attrs:{gutter:10}},[a("a-col",{attrs:{span:8}},[a("SG-Button",{attrs:{icon:"import",type:"primary",loading:e.exportBtnLoading,disabled:!e.tableObj.dataSource.length,title:e.tableObj.dataSource.length?"":"无可导出数据"},on:{click:e.handleExport}},[e._v("导出楼栋视图")])],1),a("a-col",{attrs:{span:13}},[a("organ-project-building",{attrs:{mode:"multiple"},model:{value:e.organProjectBuildingValue,callback:function(t){e.organProjectBuildingValue=t},expression:"organProjectBuildingValue"}})],1),a("a-col",{staticStyle:{"text-align":"right"},attrs:{span:3}},[a("SG-Button",{attrs:{icon:"search",type:"primary",disabled:!e.organProjectBuildingValue.organId,title:e.organProjectBuildingValue.projectId?"":"请先选择资产项目"},on:{click:function(t){return e.queryTableData({type:"search"})}}},[e._v("查询")])],1)],1)],1),a("a-spin",{attrs:{spinning:e.overviewNumSpinning}},[a("overview-number",{attrs:{numList:e.numList}})],1),a("a-table",e._b({staticClass:"custom-table td-pd10",scopedSlots:e._u([{key:"assetNum",fn:function(t){return a("span",{},[a("span",{staticStyle:{color:"#0084FF",cursor:"pointer"}},[e._v(e._s(t))])])}},{key:"action",fn:function(t,n){return a("span",{},[a("span",{staticStyle:{color:"#0084FF",cursor:"pointer"},on:{click:function(t){return e.handleViewDetail(n)}}},[e._v("详情")])])}}])},"a-table",e.tableObj,!1)),a("SG-FooterPagination",e._b({on:{change:function(t){var a=t.pageNo,n=t.pageLength;return e.queryTableData({pageNo:a,pageLength:n})}}},"SG-FooterPagination",e.paginationObj,!1))],1)}),[],!1,null,"440e428c",null);t.default=u.exports},"7cfd":function(e,t,a){var n=a("d3d8").f,r=Function.prototype,o=/^\s*function ([^ (]*)/;"name"in r||a("f9a5")&&n(r,"name",{configurable:!0,get:function(){try{return(""+this).match(o)[1]}catch(e){return""}}})},9745:function(e,t,a){},fc6b:function(e,t,a){}}]);