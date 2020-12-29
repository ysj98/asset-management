<!--出租收益-->
<template>
  <SG-Modal
    v-model="show"
    :width="800"
    wrapClassName="gainsDetail"
    :noPadding="true"
  >
    <template #title>
      <div style="font-size: 16px">出租收益详情</div>
    </template>
  </SG-Modal>
</template>

<script>
export default {
  data() {
    return {
      show: false,
      incomeId: "",
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
        this.$api.assetRent
          .getIncome({ incomeId: this.incomeId })
          .then((res) => {
            if (+res.data.code === 0) {
              this.incomeInfo = res.data.data;
            } else {
              this.$error({
                title: "提示",
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
      this.$api.basics
        .attachment({ objectId: id, objectType: 21 })
        .then((res) => {
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
              title: "提示",
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
}
</style>