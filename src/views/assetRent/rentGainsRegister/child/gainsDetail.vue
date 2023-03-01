<!--出租收益详情-->
<template>
  <SG-Modal v-model="show" :width="800" wrapClassName="gainsDetail" :footer="null">
    <template #title>
      <div style="font-size: 16px">出租收益详情</div>
    </template>
    <a-row class="a_row" style="margin-top: 20px">
      <a-col :span="9" :offset="3">
        <div>收益编号： {{ incomeInfo.incomeId }}</div>
      </a-col>
      <a-col :span="10" :offset="2">
        <div>收益名称： {{ incomeInfo.incomeName }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="9" :offset="3">
        <div>所属组织机构： {{ incomeInfo.organName }}</div>
      </a-col>
      <a-col :span="10" :offset="2">
        <div>状态： {{ incomeInfo.statusName }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="9" :offset="3">
        <div>资产项目： {{ incomeInfo.projectName }}</div>
      </a-col>
      <a-col :span="10" :offset="2">
        <div>资产类型： {{ incomeInfo.assetTypeName }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="9" :offset="3">
        <div>客户名称： {{ incomeInfo.customerName }}</div>
      </a-col>
      <a-col :span="10" :offset="2">
        <div>收益账期： {{ incomeInfo.accountingPeriod }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="9" :offset="3">
        <div>所属出租单： {{ incomeInfo.orderName }}</div>
      </a-col>
      <a-col :span="10" :offset="2">
        <div>费用科目： {{ incomeInfo.feeSubjectName }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="21" :offset="3">
        <div>收益金额（元）： {{ incomeInfo.amount }}元</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="9" :offset="3">
        <div>创建人： {{ incomeInfo.createByName }}</div>
      </a-col>
      <a-col :span="10" :offset="2">
        <div>创建时间： {{ incomeInfo.createTime }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="21" :offset="3">
        <div>备注： {{ incomeInfo.remark }}</div>
      </a-col>
    </a-row>
    <a-row class="a_row">
      <a-col :span="21" :offset="3">
        <div>附件：</div>
        <div v-if="uploadList.length === 0" class="mt20">无</div>
        <UploadFile type="all" v-model="uploadList" :show="true" class="mt20" />
      </a-col>
    </a-row>
  </SG-Modal>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      incomeId: '',
      uploadList: [], // 附件列表
      incomeInfo: {}, // 收益明细
    };
  },
  watch: {
    show(newVal) {
      if (newVal === true) {
        console.log(this.incomeId);
        this.getAttachmentList(this.incomeId);
        this.getIncome();
      }
    },
  },
  methods: {
    // 查询收益
    getIncome() {
      if (this.incomeId) {
        this.$api.assetRent.getIncome({ incomeId: this.incomeId }).then((res) => {
          if (+res.data.code === 0) {
            this.incomeInfo = res.data.data;
          } else {
            this.$error({
              title: '提示',
              content: res.data.message,
            });
          }
        });
      }
    },
    // 查询附件列表
    getAttachmentList(id) {
      if (!id) {
        return false;
      }
      this.uploadList = [];
      this.$api.basics.attachment({ objectId: id, objectType: 21 }).then((res) => {
        console.log(res);
        if (+res.data.code === 0) {
          let attachment = [];
          res.data.data.forEach((item) => {
            let obj = {
              url: item.attachmentPath,
              name: item.oldAttachmentName,
            };
            attachment.push(obj);
            this.uploadList = attachment;
          });
        } else {
          this.$error({
            title: '提示',
            content: res.data.message,
          });
        }
      });
    },
  },
};
</script>

<style lang="less" scoped>
.gainsDetail {
  .a_row {
    margin-bottom: 22px;
  }
}
</style>
