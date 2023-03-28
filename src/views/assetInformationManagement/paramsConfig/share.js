import ProvinceCity from './components/ProvinceCity';
import SelectApproval from '@/views/assetInformationManagement/paramsConfig/components/SelectApproval';
// import SelectSwitch from "./components/SelectSwitch";
import SelectSwitchTwo from './components/SelectSwitchTwo';
import tip from './components/tip.vue';
/*
 * 每个组件中 都要有 sendData 方法
 * */
import * as apiParamsConfig from '@/api/paramsConfig';
/*
 * 前端维护一份 对应的数据
 * serviceTypeText 业务分类名称
 * component 参数值列组件
 * needValidate 是否需要校验参数列
 * */
export const serviceTypeAll = {
  1001: {
    serviceTypeText: '资产地图默认城市',
    component: ProvinceCity,
    needValidate: true,
  },
  1002: {
    serviceTypeText: '资产入库单审批',
    component: SelectApproval,
    needValidate: true,
  },
  1003: {
    serviceTypeText: '资产出库单审批',
    component: SelectApproval,
    needValidate: true,
  },
  1004: {
    serviceTypeText: '资产变更审批',
    component: SelectApproval,
    needValidate: true,
  },
  1005: {
    serviceTypeText: '资产转运营审批',
    component: SelectApproval,
    needValidate: true,
  },
  1006: {
    serviceTypeText: '价值登记审批',
    component: SelectApproval,
    needValidate: true,
  },
  1007: {
    serviceTypeText: '资产处置登记审批',
    component: SelectApproval,
    needValidate: true,
  },
  1008: {
    serviceTypeText: '资产转让审批',
    component: SelectApproval,
    needValidate: true,
  },
  1009: {
    serviceTypeText: '资产登记校验权证号和面积',
    component: tip,
    needValidate: false,
  },
  1010: {
    serviceTypeText: '是否过滤部门节点',
    component: null,
    needValidate: false,
  },
  1011: {
    serviceTypeText: '资产处置关联资产转让单',
    component: null,
    needValidate: false,
  },
  1012: {
    serviceTypeText: '资产登记自动入库',
    component: null,
    needValidate: false,
  },
  1013: {
    serviceTypeText: '资产处置自动入出库',
    component: null,
    needValidate: false,
  },
  1014: {
    serviceTypeText: '权属人管理是否展示APPId,秘钥字段',
    component: null,
    needValidate: false,
  },
  1015: {
    serviceTypeText: '权属登记审批',
    component: SelectSwitchTwo,
    needValidate: true,
  },
  1016: {
    serviceTypeText: '权证管理审批',
    component: SelectSwitchTwo,
    needValidate: true,
  },
  1017: {
    serviceTypeText: '过滤经营项目',
    component: null,
    needValidate: false,
  },
  1018: {
    serviceTypeText: '资产转让关联资产转让立项单',
    component: null,
    needValidate: false,
  },
  1019: {
    serviceTypeText: '资产调拨审批',
    component: SelectApproval,
    needValidate: true,
  },
};
export const columns = [
  {
    key: 'index',
    title: '序号',
    width: 100,
    scopedSlots: { customRender: 'index' },
  },
  {
    key: 'serviceTypeText',
    title: '业务分类',
    scopedSlots: { customRender: 'serviceTypeText' },
    width: 250,
  },
  {
    key: 'isValid',
    title: '个性化设置',
    scopedSlots: { customRender: 'isValid' },
    width: 150,
  },
  {
    key: 'value',
    title: '参数值',
    scopedSlots: { customRender: 'value' },
  },
];

export function queryBpmData() {
  return new Promise((resolve, reject) => {
    const req = {
      url: '/eip-portal/sys/sysType/v1/getTypesByKey',
      param: 'typeKey=FLOW_TYPE',
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
