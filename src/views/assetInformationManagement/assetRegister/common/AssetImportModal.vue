<!-- 添加资产导入 -->
<template>
  <div class="basicDownload">
    <SG-Modal
      width="900px"
      :visible="modalData.flag"
      :title="modalData.title"
      @cancel="doClose"
    >
      <div class="container">
        <div class="modal-left">
          <noDataTips v-if="!fileList.length" />
          <div class="excel-block" v-else>
            <div class="excel"></div>
            <div style="height: 20px;"></div>
            <div class="text" v-for="item in fileList" :key="item.uid">
              {{ item.name }}
            </div>
          </div>
          <a-upload
            :class="{ 'modal-left-active': !fileList.length }"
            class="ml20"
            :file-list="fileList"
            :remove="handleRemove"
            :before-upload="beforeUpload"
            :showUploadList="false"
          >
            <SG-Button class="ml20" type="primary" weaken>
              上传文件
            </SG-Button>
          </a-upload>
        </div>
        <div class="modal-right">
          <DownLoadTemplate
            :organ-id="organId"
            :checkbox-asset-type="checkboxAssetType"
            :positionIds.sync="positionIds"
            :scope.sync="scope"
          />
          <div class="model-right-footer">
            <SG-Button weaken @click="commonFn">
              下载导入模板
            </SG-Button>
          </div>
        </div>
      </div>
      <template #footer class="footer">
        <SG-Button
          :disabled="!fileList.length"
          class="ml20"
          type="primary"
          weaken
          @click="handleImport"
        >
          导入
        </SG-Button>
        <SG-Button class="ml20" type="cancel" weaken @click="doClose">
          取消
        </SG-Button>
      </template>
    </SG-Modal>
  </div>
</template>

<script>
import DownLoadTemplate from "@/views/assetInformationManagement/assetRegister/common/DownLoadTemplate";
import { handleAssetTypeField } from './share'
import { looseEqual } from "@/utils/utils";
import noDataTips from "components/noDataTips";
const checkboxData = [
  {
    value: "1",
    name: "房屋"
  },
  {
    value: "4",
    name: "土地"
  }
];
const scopeData = [
  {
    value: "1",
    name: "楼栋"
  },
  {
    value: "2",
    name: "房屋"
  }
];
export default {
  components: { noDataTips, DownLoadTemplate },
  props: {
    modalData: {
      type: Object,
      default() {
        return {};
      }
    }
  },
  data() {
    return {
      fileList: [],
      fileData: null,
      checkboxData,
      scopeData,
      checkboxAssetType: "",
      scope: ["1", "2"],
      organId: "",
      modalShow: false,
      positionIds: []
    };
  },
  computed: {
    modalDataCom() {
      return JSON.parse(JSON.stringify(this.modalData));
    },
    ASSET_TYPE_CODE() {
      return this.$store.state.ASSET_TYPE_CODE;
    },
  },
  created() {},
  watch: {
    modalDataCom: {
      handler: function(newValue, oldValue) {
        if (newValue && newValue.flag === true) {
          if (!looseEqual(newValue.params, oldValue.params)) {
            this.typesQueries(
              newValue.params.organId,
              String(newValue.params.type)
            );
          }
        }
      },
      deep: true
    }
  },
  mounted() {},
  methods: {
    /*
     * 弹窗 导入
     * */
    handleImport() {
      this.$emit("handleAdditionAsset", this.fileList);
    },
    /*
     * 简单校验文件格式
     * @param fileName 文件名
     *
     * */
    handleValidate(fileName, typeArr = ["xls", "xlsx", "xlsm"]) {
      if (!fileName) throw new Error("入参不对");
      let res = fileName.split(".");
      if (res.length && typeArr.includes(res[res.length - 1])) return true;
    },
    beforeUpload(file) {
      if (!this.handleValidate(file.name)) {
        this.$SG_Message.error("请上传xls,xlsx,xlsm格式文件");
        return false;
      }
      // 只能添加一个
      this.fileList = [file];
      return false;
    },
    handleRemove(file) {
      const index = this.fileList.indexOf(file);
      const newFileList = this.fileList.slice();
      newFileList.splice(index, 1);
      this.fileList = newFileList;
    },
    /*
     * 关闭弹窗
     * */
    doClose() {
      this.$emit("doClosePop", "add");
    },
    // 类型查询
    typesQueries(id, type) {
      console.log("执行了");
      this.organId = id;
      if (type !== this.checkboxAssetType) {
        this.checkboxAssetType = type
        this.positionIds = [];
        // 所有 资产类型 枚举值
        let tempARr = Object.entries(this.ASSET_TYPE_CODE).map(ele=>ele[1])
        if (tempARr.includes(type)){
          this.checkboxAssetType = type;
          this.positionIds = [];
        }
      }
    },
    scopeChange(value) {
      this.scope = value;
    },
    // 下载模板确认
    commonFn() {
      // 房屋
      if (this.checkboxAssetType === "1") {
        if (!this.positionIds || this.positionIds.length === 0) {
          this.$message.info("请选择楼栋名称");
          return;
        }
        if (this.scope.length < 0) {
          this.$message.info("请选择数据范围");
          return;
        }
        if (this.scope.includes("1")) {
          this.checkBuildsObjectTypeFn("1");
        } else {
          this.confirmDownloadTemplate();
        }
      } else if (this.checkboxAssetType === "4") {
        if (!this.positionIds || this.positionIds.length === 0) {
          this.$message.info("请选择土地名称");
          return;
        } else {
          this.checkBuildsObjectTypeFn("4");
        }
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
        registerOrderId: this.modalData.params.registerOrderId, // 资产登记ID，修改时必填
        assetType: this.checkboxAssetType, // 资产类型, 1房屋、2土地、3设备
        scope: this.checkboxAssetType === "1" ? this.scope.join(",") : "", // 1楼栋 2房屋（房屋时必填）
        organId: this.organId,
        [ASSET_TYPE_IDS]: this.positionIds
      };
      this.$api.assets.downloadTemplateV2(obj).then(res => {
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
.container {
  display: flex;
}
.modal-left {
  flex-basis: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  .modal-left-active {
    width: 100%;
  }
}
.modal-right {
  //border-left: 1px solid #cccccc;
  padding-left: 40px;
  //margin-left: 40px;
  flex: 1;
}
.modal-nav {
  width: 60%;
  line-height: 60px;
}
.footer {
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .no-data-tips {
  padding: 0;
}
.model-right-footer {
  margin-top: 20px;
}
.excel-block {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}
.excel {
  height: 72px;
  width: 72px;
  background: url("../../../../assets/image/excel.png") 72px 72px;
}
</style>
