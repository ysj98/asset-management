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
      @cancel="()=>{modalShow=false}"
    >
      <DownLoadTemplate
        :key="checkboxAssetType"
        :scope.sync="scope"
        :positionIds.sync="positionIds"
        :organ-id="organId"
        :checkbox-asset-type="checkboxAssetType"
        @changeOrganId="changeOrganId"
      ></DownLoadTemplate>
    </SG-Modal>
  </div>
</template>

<script>
import DownLoadTemplate from "@/views/assetInformationManagement/assetRegister/common/DownLoadTemplate";
import {
  commonFn,
  checkBuildsObjectTypeFn, confirmDownloadTemplate
} from "./share";
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
      positionIds: [],
      userSelectedOrganId: ""
    };
  },
  computed: {
    ASSET_TYPE_CODE() {
      return this.$store.state.ASSET_TYPE_CODE;
    }
  },
  methods: {
    changeOrganId(userSelectedOrganId) {
      this.userSelectedOrganId = userSelectedOrganId;
      this.positionIds = [];
    },
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
      commonFn.call(this);
    },
    // 下载模板
    downloadTemplate() {
      this.modalShow = true;
    },
    // 资产登记-导出数据校验
    checkBuildsObjectTypeFn(val) {
      checkBuildsObjectTypeFn.call(this,val);
    },
    // 模板下载
    confirmDownloadTemplate() {
      confirmDownloadTemplate.call(this,this.$api.assets.downloadTemplate)
    }
  }
};
</script>
<style lang="less" scoped>
.modal-nav {
  line-height: 60px;
}
</style>
