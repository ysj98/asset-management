import ProvinceCity from "./components/ProvinceCity";
import SelectApproval from "@/views/assetInformationManagement/paramsConfig/components/SelectApproval";
import SelectSwitch from "./components/SelectSwitch";
/*
* 每个组件中 都要有 sendData 方法
* */
import * as apiParamsConfig from "@/api/paramsConfig";
/*
 * 前端维护一份 对应的数据
 * key: serviceType
 * */
export const serviceTypeAll = {
  1001: {
    serviceTypeText: "资产地图默认城市",
    component: ProvinceCity,
    needValidate: false,
  },
  1002: {
    serviceTypeText: "资产入库单审批",
    component: SelectApproval,
    needValidate: false,
  },
  1003: {
    serviceTypeText: "资产出库单审批",
    component: SelectApproval,
    needValidate: false,
  },
  1004: {
    serviceTypeText: "资产变更审批",
    component: SelectApproval,
    needValidate: false,
  },
  1005: {
    serviceTypeText: "资产转运营审批",
    component: SelectApproval,
    needValidate: false,
  },
  1006: {
    serviceTypeText: "价值登记审批",
    component: SelectApproval,
    needValidate: false,
  },
  1007: {
    serviceTypeText: "资产处置登记审批",
    component: SelectApproval,
    needValidate: false,
  },
  1008: {
    serviceTypeText: "资产转让审批",
    component: SelectApproval,
    needValidate: false,
  },
  1009: {
    serviceTypeText: "资产登记校验权证号",
    component: SelectSwitch,
    needValidate: false,
  },
  1010: {
    serviceTypeText: "是否过滤部门节点",
    component: SelectSwitch,
    needValidate: false,
  },
};
export const columns = [
  {
    key: "index",
    title: "序号",
    width: 100,
    scopedSlots: { customRender: "index" },
  },
  {
    key: "serviceTypeText",
    title: "业务分类",
    scopedSlots: { customRender: "serviceTypeText" },
    width: 250,
  },
  {
    key: "isValid",
    title: "个性化设置",
    scopedSlots: { customRender: "isValid" },
    width: 150,
  },
  {
    key: "value",
    title: "参数值",
    scopedSlots: { customRender: "value" },
  },
];

export function queryBpmData() {
  return new Promise((resolve, reject) => {
    const req = {
      url: "/eip-portal/sys/sysType/v1/getTypesByKey",
      param: "typeKey=FLOW_TYPE",
      isPost: false,
    };
    apiParamsConfig.getDataFromBpmWorkFlow(req).then(
      (value) => {
        resolve(value);
      },
      (reason) => {
        reject(reason);
      }
    );
  });
}
