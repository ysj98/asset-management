<!--
 * @Author: LW
 * @Date: 2020-07-10 17:32:58
 * @LastEditTime: 2020-07-28 11:27:10
 * @Description: 基本下载
-->
<template>
  <div class="basicDownload">
    <SG-Modal
      width="500px"
      v-model="modalShow"
      okText="下载模板"
      title="下载模板"
      @ok="commonFn"
    >
      <DownLoadTemplate
        :key="checkboxAssetType"
        :scope.sync="scope"
        :positionIds.sync="positionIds"
        :organ-id="organId"
        :checkbox-asset-type="checkboxAssetType"
      ></DownLoadTemplate>
    </SG-Modal>
  </div>
</template>

<script>
import DownLoadTemplate from "@/views/assetInformationManagement/assetRegister/common/DownLoadTemplate";
import { handleAssetTypeField } from './share'
export default {
  components: {
    DownLoadTemplate
  },
  props: {},
  data() {
    return {
      checkboxAssetType: "",
      scope: ["1", "2"],
      organId: "",
      modalShow: false,
      positionIds: []
    };
  },
  computed: {
    ASSET_TYPE_CODE() {
      return this.$store.state.ASSET_TYPE_CODE;
    }
  },
  methods: {
    // 类型查询
    typesQueries(id, type) {
      this.organId = id;
      if (type !== this.checkboxAssetType) {
        this.checkboxAssetType = type;
        this.positionIds = [];
        this.scope = ["1", "2"];
      }
    },
    // 下载模板确认
    commonFn() {
      // 房屋
      if (this.checkboxAssetType === this.ASSET_TYPE_CODE.HOUSE) {
        if (!this.positionIds || this.positionIds.length === 0) {
          this.$message.info("请选择楼栋名称");
          return;
        }
        if (this.scope.length < 0) {
          this.$message.info("请选择数据范围");
          return;
        }
        if (this.scope.includes("1")) {
          this.checkBuildsObjectTypeFn(this.ASSET_TYPE_CODE.HOUSE);
        } else {
          this.confirmDownloadTemplate();
        }
      } else if (this.checkboxAssetType === this.ASSET_TYPE_CODE.LAND) {
        if (!this.positionIds || this.positionIds.length === 0) {
          this.$message.info("请选择土地名称");
          return null;
        } else {
          this.checkBuildsObjectTypeFn(this.ASSET_TYPE_CODE.LAND);
        }
      } else if (this.checkboxAssetType === this.ASSET_TYPE_CODE.YARD) {
        if (!this.positionIds || this.positionIds.length === 0) {
          this.$message.info("请选择车场名称");
          return null;
        }
        if (this.scope.length < 0) {
          this.$message.info("请选择数据范围");
          return null;
        }
        if (this.scope.includes("1")) {
          this.checkBuildsObjectTypeFn("1");
        } else {
          this.confirmDownloadTemplate();
        }
      } else if (this.checkboxAssetType === this.ASSET_TYPE_CODE.EQUIPMENT) {
        debugger;
      }
    },
    // 下载模板
    downloadTemplate() {
      this.modalShow = true;
    },
    // 资产登记-导出数据校验
    checkBuildsObjectTypeFn(val) {
      let ASSET_TYPE_IDS = handleAssetTypeField(val,'ids')
      let obj = {
        [ASSET_TYPE_IDS]: this.positionIds
      };
      this.$api.assets.checkBuildsObjectType(obj).then(res => {
        if (res.data.code === "0") {
          this.confirmDownloadTemplate();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 模板下载
    confirmDownloadTemplate() {
      let ASSET_TYPE_IDS = handleAssetTypeField(this.checkboxAssetType,'ids')
      let obj = {
        assetType: this.checkboxAssetType, // 资产类型, 1房屋、2土地、3设备
        scope: this.checkboxAssetType === this.ASSET_TYPE_CODE.HOUSE ? this.scope.join(",") : "", // 1楼栋 2房屋（房屋时必填）
        organId: this.organId,
        [ASSET_TYPE_IDS]: this.positionIds,
      };
      this.$api.assets.downloadTemplate(obj).then(res => {
        let blob = new Blob([res.data]);
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = "资产登记模板.xls";
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
        this.modalShow = false;
      });
    }
  }
};
</script>
<style lang="less" scoped>
.modal-nav {
  line-height: 60px;
}
</style>
