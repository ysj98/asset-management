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
import {
  checkBuildsObjectTypeFn,
  commonFn,
  confirmDownloadTemplate,
  handleAssetTypeField
} from "./share";
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
    }
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
      this.organId = id;
      if (type !== this.checkboxAssetType) {
        this.checkboxAssetType = type;
        this.positionIds = [];
        // 所有 资产类型 枚举值
        let tempARr = Object.entries(this.ASSET_TYPE_CODE).map(ele => ele[1]);
        if (tempARr.includes(type)) {
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
      commonFn.call(this);
    },
    // 下载模板
    downloadTemplate() {
      this.modalShow = true;
    },
    // 资产登记-导出数据校验
    checkBuildsObjectTypeFn(val) {
      checkBuildsObjectTypeFn.call(this, val);
    },
    // 模板下载
    confirmDownloadTemplate() {
      confirmDownloadTemplate.call(this, this.$api.assets.downloadTemplateV2, {
        registerOrderId: this.modalData.params.registerOrderId // 资产登记ID，修改时必填
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
