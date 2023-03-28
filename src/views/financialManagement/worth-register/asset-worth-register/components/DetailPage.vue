<!--价值登记页面--资产价值登记详情页面-->
<template>
  <div class="detail_page">
    <a-spin :spinning="spinning" style="padding-bottom: 75px">
      <!--基础信息-->
      <base-info-part ref="baseInfo" v-if="type" :type="type" :details="details" @setData="setListTableData" />
      <!--资产价值清单-->
      <worth-list-part
        v-if="type"
        :type="type"
        :dynamicData="dynamicData"
        :organId="details.organId"
        :registerId="registerId"
        @backAssetList="getAssetList"
        @validateProject="validateProject"
      />
      <!--审批轨迹及审批意见-->
      <approval-flow-part
        v-if="type === 'approval' || type === 'detail'"
        :type="type"
        :fromBpmApprove="fromBpmApprove"
        :advice.sync="advice"
        :stepList="stepList"
      />
    </a-spin>
    <!--底部按钮-->
    <form-footer
      v-if="type === 'add' || type === 'edit' || (type === 'approval' && !fromBpmApprove)"
      v-bind="footerObj[type]"
      @save="handleFooterBtn('left')"
      @cancel="handleFooterBtn('right')"
    />
  </div>
</template>

<script>
import FormFooter from 'src/components/FormFooter';
import BaseInfoPart from './components/BaseInfoPart';
import WorthListPart from './components/WorthListPart';
import ApprovalFlowPart from './components/ApprovalFlowPart';
import moment from 'moment';
export default {
  name: 'DetailPage',
  components: { ApprovalFlowPart, WorthListPart, BaseInfoPart, FormFooter },
  data() {
    return {
      advice: '',
      apprId: '',
      isOld: false,
      fromBpmApprove: false,
      registerId: '', // 登记Id
      stepList: [], // 审批轨迹
      details: {}, // 基础信息数据
      spinning: false, // 加载状态
      assetList: [], // 关联资产对象提交数据
      type: '', // 页面状态 edit编辑 approval审批 detail详情 add新增，控制页面是否可编辑
      footerObj: {
        add: { leftButtonName: '提交审批', rightButtonName: '取消' },
        edit: { leftButtonName: '提交审批', rightButtonName: '取消' },
        approval: { leftButtonName: '审批通过', rightButtonName: '驳回' },
      }, // 页面底部操作按钮
      dynamicData: {}, // 资产价值清单联动数据
    };
  },

  methods: {
    // 校验基础信息组件资产项目数据
    validateProject() {
      this.$refs['baseInfo'].validateProject();
    },

    // 获取资产关联对象数据
    getAssetList(list) {
      this.assetList = list;
    },

    // 提交
    handleSubmit() {
      const { type, registerId, assetList } = this;
      // 编辑或新增时保存
      new Promise((resolve, reject) => {
        this.$refs['baseInfo'].handleSubmit(resolve, reject);
      })
        .then((data) => {
          // 校验关联资产
          if (!assetList.length) {
            return this.$message.warn('请选择关联资产数据');
          } else if (this.validateAssetList(assetList)) {
            return this.$message.warn('资产价值清单本次估值数据为必填');
          }
          let api = { add: 'insertRegister', edit: 'updateRegister' };
          let tip = type === 'add' ? '新增' : '保存';
          this.spinning = true;
          let registerValueRelList = [];
          assetList.forEach((m) => {
            const { assetId, assessmentValue, upRate } = m;
            registerValueRelList.push({ assetId, assessmentValue, upRate: upRate === '--' ? 0 : upRate });
          });
          let form = type === 'edit' ? { ...data, registerValueRelList, registerId, approvalStatus: 2 } : { ...data, registerValueRelList };
          this.$api.worthRegister[api[type]](form)
            .then((r) => {
              this.spinning = false;
              let res = r.data;
              if (res && String(res.code) === '0') {
                this.$message.success(`${tip}成功`);
                // 跳回列表路由
                return this.$router.push({ name: '价值登记', params: { refresh: true } });
              }
              throw res.message || `${tip}失败`;
            })
            .catch((err) => {
              this.spinning = false;
              this.$message.error(err || `${tip}失败`);
            });
        })
        .catch(() => {
          this.spinning = false;
        });
    },

    // 查询详情
    queryDetailById(registerId) {
      this.spinning = true;
      const { details } = this;
      this.$api.worthRegister
        .queryDetail({ registerId })
        .then((r) => {
          this.spinning = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            const { ...others } = res.data;
            // 初始化，用于资产价值清单组件
            this.dynamicData = {
              assetType: others.assetType,
              assessmenBaseDate: others.assessmenBaseDate,
              assessmentOrganName: others.assessmentOrganName,
              assessmentMethodName: others.assessmentMethodName,
              projectId: others.projectId,
            };
            return Object.assign(this, { details: { ...details, ...others } });
          }
          throw res.message || '查询价值登记详情出错';
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err || '查询价值登记详情出错');
        });
    },

    // 处理底部按钮事件
    handleFooterBtn(sign) {
      const { type } = this;
      if (sign === 'left') {
        type === 'approval' ? this.handleApprove('left') : this.handleSubmit();
      } else {
        type === 'approval' ? this.handleApprove() : this.$router.go(-1);
      }
    },

    // 审批驳回、通过
    handleApprove(sign) {
      if (sign !== 'left' && !this.advice) {
        this.$message.error('驳回时意见必填');
        return null;
      }
      this.spinning = true;
      const { registerId } = this;
      let tip = sign === 'left' ? '审批' : '驳回';
      let approvalStatus = sign === 'left' ? '1' : '3';
      const operResult = sign === 'left' ? 1 : 0;
      let req = {
        apprId: this.apprId,
        operResult,
        operOpinion: this.advice,
      };
      let apiFn = this.$api.approve.uniformSubmit;
      if (this.isOld) {
        req = { approvalStatus, registerId };
        apiFn = this.$api.worthRegister.updateStatus;
      }
      apiFn(req)
        .then((r) => {
          this.spinning = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            this.$message.success(`${tip}成功`);
            // 跳回列表路由
            return this.$router.push({ name: '价值登记', params: { refresh: true } });
          }
          throw res.message || `${tip}失败`;
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err || `${tip}失败`);
        });
    },

    // 联动更新资产价值清单Table中评估基准日、评估方法、评估机构的值
    setListTableData(obj) {
      this.dynamicData = Object.assign({}, this.dynamicData, obj);
    },

    // 校验资产价值清单本次估值项非空
    validateAssetList(list) {
      let arr = list.filter((m) => m.assessmentValue === '' || m.assessmentValue === null || m.assessmentValue === undefined);
      return arr.length;
    },
    queryApprovalRecordByBus() {
      const { relatedOrganId, registerId } = this.$route.params;
      const req = { busType: 1005, busId: registerId, organId: relatedOrganId };
      this.$api.approve.queryApprovalRecordByBus(req).then(({ data: { code, message, data } }) => {
        if (code === '0') {
          // 旧数据不存在审批单，但是 code 为“0”
          if (message === '审批单不存在') {
            this.isOld = true;
          } else {
            this.isOld = false;
            this.apprId = data.amsApprovalResDto.apprId;
            this.stepList = (data.approvalRecordResDtos || []).map((ele) => {
              return {
                date: ele.operDateStr ? moment(ele.operDateStr) : moment(),
                title: ele.operOpinion,
                desc: ele.taskName, // 审批节点
                isDone: false,
                operation: [],
              };
            });
            this.stepList.length && (this.stepList[0].isDone = true);
            if (this.type === 'approval') {
              // 从系统中的审批进入，但是审批单为 bpm 审批单
              this.fromBpmApprove = data.amsApprovalResDto.isAbRole !== 1;
            }
          }
        } else {
          this.$message.error(message);
        }
      });
    },
  },

  created() {
    const {
      params: { type, organId, organName, registerId, relatedOrganId },
    } = this.$route;
    Object.assign(this, { type, registerId }, { details: { organId, organName } });
    registerId && this.queryDetailById(registerId);
    console.log('this.type', this.type);
    if (['detail', 'approval'].includes(this.type)) {
      this.queryApprovalRecordByBus();
    }
    if (['add'].includes(this.type)) {
      this.$textReplace();
    } else {
      this.$textReplace(relatedOrganId);
    }
  },
  beforeRouteEnter(to, from, next) {
    to.meta.noShowProBreadNav = from.path === '/approve';
    next((vm) => {
      const {
        params: { fromBpmApprove },
      } = from;
      vm.fromBpmApprove = fromBpmApprove || false;
    });
  },
};
</script>

<style lang="less" scoped>
.detail_page {
  padding-left: 70px;
  padding-right: 10px;
}
</style>
