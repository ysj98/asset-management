<!-- 添加资产导入 -->
<template>
  <div class="basicDownload">
    <SG-Modal
      width="900px"
      :visible="modalData.flag"
      :title="modalData.title"
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
          <div class="modal-nav">
            <a-radio-group v-model="checkboxAssetType">
              资产类型：<a-radio
                v-for="(item, index) in checkboxData"
                :key="index"
                disabled
                :value="item.value"
                >{{ item.name }}</a-radio
              >
            </a-radio-group>
          </div>
          {{ title }}：<a-select
            style="width: 300px"
            mode="multiple"
            :maxTagCount="4"
            showSearch
            :placeholder="`请选择${title}`"
            v-model="positionIds"
            @search="handleSearch"
            optionFilterProp="children"
            :options="$addTitle(positionNameData)"
            :allowClear="true"
            :filterOption="false"
            notFoundContent="没有查询到数据"
          />
          <div class="modal-nav" v-if="checkboxAssetType === '1'">
            <a-checkbox-group v-model="scope">
              数据范围：<a-checkbox
                v-for="(item, index) in scopeData"
                :key="index"
                :value="item.value"
                >{{ item.name }}</a-checkbox
              >
            </a-checkbox-group>
          </div>
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
import { debounce, looseEqual } from "@/utils/utils";
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
  components: { noDataTips },
  props: {
    modalData: {
      type: Object,
      default() {
        return {};
      }
    },
    test: {
      type: String,
      default: "默认"
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
      positionNameData: [],
      organId: "",
      modalShow: false,
      positionIds: [],
      searchBuildName: "",
      title: ""
    };
  },
  computed: {
    modalDataCom() {
      return JSON.parse(JSON.stringify(this.modalData));
    }
  },
  created() {},
  watch: {
    checkboxAssetType(val) {
      this.title = val === "1" ? "楼栋名称" : "土地名称";
    },
    modalDataCom: {
      handler: function(newValue, oldValue) {
        if (newValue && newValue.flag === true) {
          if (!looseEqual(newValue.params, oldValue.params)) {
            this.typesQueries(newValue.params.organId, String(newValue.params.type));
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
        if (type === "1") {
          this.checkboxAssetType = "1";
          this.positionIds = [];
          this.positionApiList(id);
        } else {
          this.checkboxAssetType = "4";
          this.positionIds = [];
          this.positionApiList(id);
        }
      }
    },
    // 搜索
    handleSearch(value) {
      this.searchBuildName = value;
      this.debounceMothed();
    },
    // 防抖函数后台请求楼栋数据
    debounceMothed: debounce(function() {
      this.positionApiList(this.organId, this.searchBuildName || "");
    }, 200),
    // 请求列表默认20条
    positionApiList(organId, aliasName) {
      this.$api.basics
        .positionApiList({
          organId,
          aliasName: aliasName || "",
          positionType: this.checkboxAssetType,
          subPositionType: ""
        })
        .then(res => {
          if (res.data.code === "0") {
            let result = res.data.data || [];
            this.positionNameData = result.map(item => {
              return {
                name: item.aliasName,
                value: item.positionId,
                label: item.aliasName
              };
            });
          }
        });
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
      let obj = {
        buildIds: val === "1" ? this.positionIds : [],
        landIds: val === "4" ? this.positionIds : []
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
      let obj = {
        registerOrderId: this.modalData.params.registerOrderId, // 资产登记ID，修改时必填
        assetType: this.checkboxAssetType, // 资产类型, 1房屋、2土地、3设备
        buildIds: this.checkboxAssetType === "1" ? this.positionIds : [], // 楼栋id列表（房屋时必填）
        scope: this.checkboxAssetType === "1" ? this.scope.join(",") : "", // 1楼栋 2房屋（房屋时必填）
        organId: this.organId,
        blankIdList: this.checkboxAssetType === "4" ? this.positionIds : [] // 土地Id列表（土地时必填）
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
