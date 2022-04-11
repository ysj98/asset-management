<template>
  <div class="add-and-edit-operation">
    <SG-Title title="基本信息" />
    <BaseFormEdit
      ref="BaseFormEditRef"
      :assetType.sync="assetType"
      :projectId.sync="projectId"
      :organ-info="organInfo"
      :isBpm="isBpm"
      :flowKey="flowKey"
    />
    <SG-Title title="资产列表" />
    <div class="table-data-action">
      <SG-Button v-if="false" @click="handleAddDataToTable" class="right-btn">
        手动添加已选资产
      </SG-Button>
      <SG-Button @click="btnAddAsset" type="primary">添加资产</SG-Button>
      <SG-Button @click="clearTableData" class="right-btn">清空列表</SG-Button>
      <SG-Button @click="btnImport" type="primary" class="right-btn">
        批量导入
      </SG-Button>
    </div>
    <TableAsset
      ref="TableAssetRef"
      :dataSource="importedData"
      :assetType="assetType"
      :customParams="customParams"
    />
    <div class="footer-action">
      <SG-Button @click="handleSave('stash')" type="primary">
        暂存草稿
      </SG-Button>
      <SG-Button @click="handleSave('submit')" type="primary" class="right-btn">
        提交
      </SG-Button>
      <SG-Button class="right-btn" @click="goBack">取消</SG-Button>
    </div>
    <SelectAssetExportModal
      ref="SelectAssetExportModalRef"
      :key="uid"
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
import {
  flatTableDataSource,
  getBaseInfo,
  getColumns,
  getOperationDetailListPage,
} from "@/views/assetOperating/share";
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
        customParams() {
          return _this.customParamsCom;
        },
        projectId() {
          return _this.projectId;
        },
      },
    };
  },
  data() {
    return {
      flowKey:'',
      isBpm: false,
      type: "",
      customParams: [],
      uid: 0,
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
      projectId: "",
      assetType: "",
      assetOperationRegisterId: "",
    };
  },
  watch: {
    assetType(newValue) {
      this.clearTableData();
      if (!["", undefined, null].includes(newValue)) {
        this.getColumns({
          organId: this.organInfoCom.organId,
          assetType: newValue,
        });
      }
      this.uid = this.uid + 1;
    },
    projectId() {
      this.clearTableData();
      this.uid = this.uid + 1;
    },
  },
  computed: {
    assetTypeCom() {
      return this.assetType;
    },
    organInfoCom() {
      return this.organInfo;
    },
    customParamsCom() {
      return this.customParams;
    },
  },
  methods: {
    // 获取审批流程(取第一个)
    async queryProcByType(){
      const {data:{data:{userId}}} = await this.$api.auth.getUserData()
      const req = {
        // 硬编码
        typeKey:'x_ams_zczyy',
        userId: userId
      }
      console.log({req})
      this.$api.bpm.queryProcByType(req).then(({data:{value,state,message}})=>{
        if (state === true){
          console.log({value})
          if (value && value.length){
            this.flowKey = value[0].defKey
          }else {
            this.$message.error(`BPM未查询到流程分类`)
          }
        }else {
          this.$message.error(`BPM根据流程分类查询流程失败  ${message}`)
        }
      })
    },
    // 获取审批配置 设置 isBpm
    async getApproveConfig(){
      let { data:{ code,data } } = await this.$api.paramsConfig.queryParamsConfigDetail({
        // 参考 serviceTypeAll.js 文件
        serviceType: 1002,
        organId: this.organInfoCom.organId,
      })
      if (code === "0"){
        const {isValid, paramKey} = data
        if( isValid === 1 && paramKey === '1' ){
          this.isBpm = true
        }
      }
    },
    getColumns({ organId, assetType }) {
      getColumns(
        {
          organId,
          assetType,
        },
        (ele) => ({ ...ele })
      ).then(
        (columns) => {
          this.customParams = columns;
        },
        (reason) => {
          console.error(reason);
        }
      );
    },
    /*
     * type stash-草稿  submit-提交
     * */
    async handleSave(type) {
      let saveType = 0;
      let approvalStatus = null;
      if (type === "stash") {
        approvalStatus = 0;
      }
      if (type === "submit") {
        approvalStatus = 2;
        saveType = 1;
      }
      let baseInfo;
      try {
        baseInfo = this.$refs.BaseFormEditRef.sendData();
      } catch (error) {
        console.error(error);
      }
      if (!baseInfo) {
        console.error(baseInfo);
        return null;
      }

      const error = await this.$refs.TableAssetRef.handleValidate();
      if (error) {
        this.$message.error(error);
        return null;
      }
      const dataSource = this.$refs.TableAssetRef.getReq(this.type);
      const req = {
        ...baseInfo,
        organId: this.organInfoCom.organId,
        approvalStatus,
        saveType,
        assetOperationDetailList: dataSource.map((ele) => {
          return {
            projectId: baseInfo.projectId,
            organId: this.organInfoCom.organId,
            assetType: this.assetTypeCom,
            assetId: ele.assetId,
            paramList: ele.paramList,
          };
        }),
      };
      if (this.type === "edit") {
        req.assetOperationRegisterId = this.assetOperationRegisterId;
      }
      const {
        data: { code, message },
      } = await this.$api.toOperation.submitTransferOperation(req);
      if (code === "0") {
        this.$SG_Message.success("操作成功");
        this.goBack();
        console.log("code", code);
      } else {
        this.$SG_Message.error(message);
      }
      console.log("req", req);
    },
    async handleImport(event) {
      const file = event.target.files[0];
      const req = new FormData();
      req.append("organId", this.organInfoCom.organId);
      req.append("multipartFile", file);
      req.append("assetType", this.assetType);
      const {
        data: { code, message, data },
      } = await this.$api.toOperation.readExcelModelV3(req);
      if (code === "0") {
        event.target.value = null;
        this.importedData = flatTableDataSource(
          {
            dataSource: data || [],
          },
          "operationAttrList"
        );
      } else {
        this.$SG_Message.error(message);
      }
    },
    goBack() {
      this.$router.go(-1);
    },
    // 清空列表
    clearTableData() {
      this.importedData = [];
    },
    btnAddAsset() {
      let error = this.handleValidatePre();
      if (error) {
        this.$SG_Message.error(error);
        return null;
      }
      this.doOpenPop("SelectAssetExportModal");
    },
    handleAddDataToTable() {
      this.importedData = this.$refs.SelectAssetExportModalRef.getSelectData();
    },
    handleValidatePre() {
      if (!this.projectId) {
        return "请选择资产项目";
      }
      if (["", undefined, null].includes(this.assetType)) {
        return "请先选择资产类型";
      }
    },
    btnImport() {
      let error = this.handleValidatePre();
      if (error) {
        this.$SG_Message.error(error);
        return null;
      }
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
      this.type = data.type;
      this.assetOperationRegisterId = data.assetOperationRegisterId;
    },
    async init(){
      await this.getApproveConfig()
      if (this.isBpm){
        try {
          await this.$store.dispatch('bpm/getToken')
        }catch (error){
          console.error(error)
        }
        this.queryProcByType()
      }
    },
    initEditData() {
      getBaseInfo({
        assetOperationRegisterId: this.assetOperationRegisterId,
      }).then((data) => {
        console.log("data", data);
        const { projectId, title, assetType, remark, attachment } = data;
        this.$refs.BaseFormEditRef.initData({
          projectId,
          title,
          assetType,
          remark,
          attachment,
        });
        this.$nextTick(() => {
          getOperationDetailListPage({
            pageNum: 1,
            pageSize: 9999,
            assetOperationRegisterId: this.assetOperationRegisterId,
          }).then((data) => {
            this.importedData = flatTableDataSource({
              dataSource: data ? data.data : [],
            });
          });
        });
      });
    },
  },
  created() {
    this.initRouteQuery();
    if (this.type === "edit") {
      this.initEditData();
    }
    this.init()
  },
};
</script>

<style scoped lang="less">
.add-and-edit-operation {
  padding: 10px 20px;
  position: relative;
  .table-data-action {
    text-align: right;
    margin-bottom: 20px;
    padding-right: 20px;
  }
  .footer-action {
    display: flex;
    justify-content: center;
    margin-top: 20px;

    background-color: transparent;
    position: fixed;
    bottom: 10px;
    width: 100%;
  }
  .right-btn {
    margin-left: 20px;
  }
}
</style>
