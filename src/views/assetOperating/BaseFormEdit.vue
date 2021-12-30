<template>
  <div class="base-form-edit">
    <a-form :labelCol="{ span: 1 }" :wrapperCol="{ span: 4 }">
      <a-form-item label="转运营单名称">
        <a-input
          v-model="formData.title"
          placeholer="请输入变动单名称"
        ></a-input>
      </a-form-item>
      <a-form-item label="所属机构">
        <span>{{ this.organInfo.organName }}</span>
      </a-form-item>
      <a-form-item label="资产项目">
        <a-select
          v-model="formData.projectId"
          :options="projectListOptions"
        ></a-select>
      </a-form-item>
      <div>
        <a-form-item label="资产类型">
          <a-select
            v-model="formData.assetType"
            :options="assetTypeOptions"
            @select="handleSelectAssetType"
          ></a-select>
        </a-form-item>
      </div>
      <div>
        <a-form-item label="备注">
          <a-textarea
            v-model="formData.remark"
            placeholder="请输入备注信息"
          ></a-textarea>
        </a-form-item>
      </div>
      <div style="display: flex; margin-top: 10px">
        <SG-UploadFile
          v-model="attachmentList"
          :max="5"
          :maxSize="5120"
          :customDownload="
            (value) => {
              return customDownload(value, $api.ownership.downLoadAnnex);
            }
          "
          :customUpload="
            (value) => {
              return customUpload(value, $api.ownership.uploadAnnex);
            }
          "
        />
      </div>
    </a-form>
  </div>
</template>

<script>
import { getObjectKeyValueByOrganId } from "@/utils/share";
import uploadAndDownLoadFIle from "@/mixins/uploadAndDownLoadFIle";
export default {
  name: "baseFormEdit",
  props: {
    organInfo: {
      type: Object,
      validator(value) {
        return value.organId && value.organName;
      },
    },
    assetType: {
      required: true,
    },
  },
  mixins: [uploadAndDownLoadFIle],
  data() {
    return {
      formStyle: {
        width: "200px",
      },
      projectListOptions: [],
      attachmentList: [],
      formData: {
        projectId: "",
        title: "",
        assetType: "",
        remark: "",
      },
    };
  },
  computed: {
    assetTypeOptions() {
      return this.$store.state.ASSET_TYPE_OPTIONS.map((ele) => ({
        title: ele.name,
        value: ele.value,
        label: ele.name,
      }));
    },
  },
  methods: {
    handleSelectAssetType(value) {
      console.log("value", value);
      this.$emit("update:assetType", value);
    },
    async getProjectListOptions({ organId }) {
      this.projectListOptions = await getObjectKeyValueByOrganId(
        {
          organId,
        },
        (ele) => ({
          title: ele.projectName,
          label: ele.projectName,
          value: ele.projectId,
        })
      );
    },
    initFormData({ projectId, title, assetType, remark }) {
      this.formData = {
        projectId,
        title,
        assetType,
        remark: remark || "",
      };
    },
    initAttachmentList(attachmentList) {
      // TODO:处理附件
      this.attachmentList = attachmentList;
    },
    initData(data) {
      const { projectId, title, assetType, remark, attachmentList } = data;
      this.initFormData({ projectId, title, assetType, remark });
      this.initAttachmentList(attachmentList);
    },
    handleValidate() {},
    sendData() {
      const error = this.handleValidate();
      if (error) {
        this.$message.error(error);
        return null;
      }
    },
  },
  mounted() {
    this.getProjectListOptions({ organId: this.organInfo.organId });
    // 编辑情况  this.initData();
  },
};
</script>

<style scoped lang="less">
.base-form-edit {
}
</style>
