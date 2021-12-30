<template>
  <div class="add-and-edit-operation">
    <SG-Title title="基本信息" />
    <BaseFormEdit :assetType.sync="assetType" :organ-info="organInfo" />
    <SG-Title title="资产列表" />
    <div class="table-data-action">
      <SG-Button @click="btnAddAsset" type="primary">添加资产</SG-Button>
      <SG-Button @click="clearTableData" class="right-btn">清空列表</SG-Button>
      <SG-Button @click="btnImport" type="primary" class="right-btn">
        批量导入
      </SG-Button>
    </div>
    <TableAsset :dataSource="importedData" :assetType="assetType" />
    <div class="footer-action">
      <SG-Button type="primary">暂存草稿</SG-Button>
      <SG-Button type="primary" class="right-btn">提交</SG-Button>
      <SG-Button class="right-btn" @click="goBack">取消</SG-Button>
    </div>
    <SelectAssetExportModal
      v-show="modalList.SelectAssetExportModal.show"
      v-bind="modalList.SelectAssetExportModal"
      @doClosePop="doClosePop"
    />
    <input v-show="false" type="file" ref="importRef" @change="handleImport" />
  </div>
</template>

<script>
import SelectAssetExportModal from "@/views/assetOperating/SelectAssetExportModal";
import BaseFormEdit from "@/views/assetOperating/BaseFormEdit";
import TableAsset from "@/views/assetOperating/TableAsset";
export default {
  /*
   * 新增和编辑页面
   * */
  name: "addAndEditOperation",
  components: {
    BaseFormEdit,
    TableAsset,
    SelectAssetExportModal,
  },
  provide() {
    const _this = this;
    return {
      sonData: {
        assetType() {
          return _this.assetTypeCom;
        },
        organInfo() {
          return _this.organInfoCom;
        },
      },
    };
  },
  data() {
    return {
      // 被导入的表格数据
      importedData: [],
      modalList: {
        SelectAssetExportModal: {
          show: false,
          title: "选择资产",
          modalName: "SelectAssetExportModal",
          payload: {},
        },
      },
      organInfo: {},
      assetType: "",
    };
  },
  watch: {
    assetType() {
      this.clearTableData();
    },
  },
  computed: {
    assetTypeCom() {
      return this.assetType;
    },
    organInfoCom() {
      return this.organInfo;
    },
  },
  methods: {
    async handleImport(event) {
      const file = event.target.files[0];
      const req = new FormData();
      req.append("organId", this.organInfoCom.organId);
      req.append("file", file);
      const {
        code,
        message,
        data: { data },
      } = await this.$api.toOperation.importData(req);
      event.target.value = null;
      this.importedData = data
      // if (code === "0") {
      //   console.log("data", data);
      // } else {
      //   this.$SG_Message.error(message);
      // }
    },
    goBack() {
      this.$router.back();
    },
    // 清空列表
    clearTableData() {
      this.importedData = [];
    },
    btnAddAsset() {
      if (["", undefined, null].includes(this.assetType)) {
        this.$message.error("请先选择资产类型");
        return null;
      }
      this.doOpenPop("SelectAssetExportModal");
    },
    btnImport() {
      this.$refs.importRef.click();
    },
    doOpenPop(modal) {
      this.modalList[modal].show = true;
    },
    doClosePop(modal) {
      this.modalList[modal].show = false;
    },
    changeAssetType(value) {
      this.assetType = value;
    },
    initRouteQuery() {
      const data = this.$route.query;
      this.organInfo = {
        organId: data.organId,
        organName: data.organName,
      };
    },
  },
  created() {
    this.initRouteQuery();
  },
};
</script>

<style scoped lang="less">
.add-and-edit-operation {
  padding: 10px 20px;
  position: relative;
  .table-data-action {
    text-align: right;
    margin-bottom: 10px;
  }
  .footer-action {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    background-color: transparent;
  }
  .right-btn {
    margin-left: 20px;
  }
}
</style>
