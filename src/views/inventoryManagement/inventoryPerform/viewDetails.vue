<!--
 * @Author: LW
 * @Date: 2019-12-26 18:08:25
 * @LastEditTime: 2020-11-19 17:13:30
 * @LastEditors: Please set LastEditors
 * @Description: 盘点结果
 * @FilePath: \asset-management\src\views\inventoryManagement\inventoryPerform\viewDetails.vue
 -->
<template>
  <div class="wrapper">
    <SG-Modal class="inventoryResultRegistration" width="1080px" v-model="show" :noPadding="true" :title="'盘点结果'" :footer="null">
      <div class="inventoryResultRegistration">
        <div class="inventoryResultRegistration-nav">
          <span class="section-title blue">资产信息</span>
          <a-row class="playground-row">
            <a-col class="playground-col" :span="12">资产编号：{{ particularsData.assetCode || '--' }}</a-col>
            <a-col class="playground-col" :span="12">资产名称：{{ particularsData.assetName || '--' }}</a-col>
            <a-col class="playground-col" :span="12">所属组织：{{ particularsData.organName || '--' }}</a-col>
            <a-col class="playground-col" :span="12">资产类型：{{ particularsData.assetTypeName || '--' }}</a-col>
            <a-col class="playground-col" :span="12">资产分类：{{ particularsData.objectTypeName || '--' }}</a-col>
            <a-col class="playground-col" :span="12">资产状态：{{ particularsData.statusName || '--' }}</a-col>
            <a-col class="playground-col" :span="12">资产项目：{{ particularsData.projectName || '--' }}</a-col>
            <a-col class="playground-col" :span="12">资产位置：{{ particularsData.location || '--' }}</a-col>
          </a-row>
        </div>
        <div class="inventoryResultRegistration-nav">
          <span class="section-title blue">盘点结果</span>
          <a-row class="playground-row">
            <a-col class="playground-col" :span="12">盘点人：{{ particularsData.userNames || '--' }}</a-col>
            <a-col class="playground-col" :span="12">盘点时间：{{ particularsData.checkTime || '--' }}</a-col>
            <a-col class="playground-col" :span="12">盘点结果：{{ particularsData.checkResultName || '--' }}</a-col>
            <a-col class="playground-col" :span="24">异常说明：{{ particularsData.remark || '--' }}</a-col>
            <a-col class="playground-col" :span="24">处理建议：{{ particularsData.handleTip || '--' }}</a-col>
            <a-col class="playground-col" :class="{ 'files-style': files.length > 0 }" :span="24"
              >图片： <span v-if="files.length === 0">无</span>
              <div class="umImg" v-if="files.length > 0">
                <UploadFile v-model="files" type="all" :show="true" />
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </SG-Modal>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data() {
    return {
      requiredShow: false,
      show: false,
      particularsData: '',
      files: [],
    };
  },
  computed: {},
  methods: {
    // 关闭弹窗
    handleCancel(str) {
      this.show = false;
    },
    // 查询详情
    query(resultId, checkId, taskId, assetId) {
      this.resultId = resultId;
      this.checkId = checkId; // 盘点单id
      this.taskId = taskId; // 任务id
      this.assetId = assetId; // 资产id
      let obj = {
        resultId: this.resultId, // 盘点id
      };
      this.$api.inventoryManagementApi.assetCheckInstFailDetail(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          this.particularsData = data;
          let files = [];
          if (data.attachmentList && data.attachmentList.length > 0) {
            data.attachmentList.forEach((item) => {
              files.push({
                url: item.attachmentPath,
                name: item.oldAttachmentName,
              });
            });
          }
          this.files = files;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.inventoryResultRegistration {
  height: 500px;
  overflow-y: scroll;
  padding-bottom: 70px;
  .inventoryResultRegistration-nav {
    padding: 40px 70px 0 70px;
    .tab-nav {
      margin: 24px 20px;
    }
  }
  .playground-row {
    margin: 23px 0 0 26px;
    .playground-col {
      line-height: 40px;
      font-size: 12px;
    }
    .files-style {
      margin-bottom: 70px;
    }
  }
}
</style>
