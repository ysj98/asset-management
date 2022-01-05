<template>
  <div class="base-form-edit">
    <div style="width: 70%">
      <a-form-model
        ref="ruleForm"
        :model="formData"
        :rules="rules"
        layout="inline"
      >
        <a-row>
          <a-col :span="8">
            <a-form-model-item label="转运营单名称" prop="title">
              <a-input
                v-model="formData.title"
                placeholer="请输入变动单名称"
              ></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item label="所属机构">
              <span>{{ this.organInfo.organName }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item label="资产项目" prop="projectId">
              <a-select
                optionFilterProp="children"
                showSearch
                style="width: 200px"
                v-model="formData.projectId"
                :options="projectListOptions"
                @change="handleChangeProject"
              ></a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row style="margin-top: 20px">
          <a-form-model-item label="资产类型" prop="assetType">
            <a-select
              style="width: 200px"
              v-model="formData.assetType"
              :options="assetTypeOptions"
            ></a-select>
          </a-form-model-item>
        </a-row>
        <a-row style="margin-top: 20px">
          <a-form-model-item label="备注">
            <a-textarea
              style="width: 600px"
              v-model="formData.remark"
              placeholder="请输入备注信息"
            ></a-textarea>
          </a-form-model-item>
        </a-row>
        <a-row style="display: flex; margin-top: 20px">
          <a-form-model-item label="附件">
            <SG-UploadFile
              type="all"
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
          </a-form-model-item>
        </a-row>
      </a-form-model>
    </div>
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
    projectId: {
      type: [Number, String],
    },
  },
  mixins: [uploadAndDownLoadFIle],
  data() {
    return {
      rules: {
        title: [
          {
            required: true,
            message: "请输入变更单名称",
            trigger: "blur",
          },
        ],
        projectId: [
          {
            required: true,
            message: "请选择资产项目",
            trigger: "change",
          },
        ],
        assetType: [
          { required: true, message: "请选择资产类型", trigger: "change" },
        ],
      },
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
  watch: {
    "formData.assetType": {
      handler(newValue) {
        this.$emit("update:assetType", newValue);
      },
    },
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
    handleChangeProject(value) {
      this.$emit("update:projectId", value);
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
    initAttachmentList(attachment) {
      this.attachmentList = attachment.map((ele) => {
        return {
          url: ele.attachmentPath,
          name: ele.oldAttachmentName,
          attachmentId: ele.attachmentId,
        };
      });
    },
    initData(data) {
      const { projectId, title, assetType, remark, attachment } = data;
      this.initFormData({
        projectId,
        title,
        assetType: String(assetType),
        remark,
      });
      console.log("data", data);
      console.log("attachment", data.attachment);
      this.initAttachmentList(attachment || []);
    },
    handleValidate() {
      let res = true;
      this.$refs.ruleForm.validate((valid) => {
        res = valid;
      });
      return res;
    },
    sendData() {
      const validateRes = this.handleValidate();
      if (!validateRes) {
        throw new Error("校验未通过");
      }
      const result = {
        ...this.formData,
        attachmentList: this.attachmentList.map((ele) => {
          return {
            attachmentPath: ele.url,
            oldAttachmentName: ele.name,
            originName: ele.name,
          };
        }),
      };
      return result;
    },
  },
  mounted() {
    this.getProjectListOptions({ organId: this.organInfo.organId });
  },
};
</script>

<style scoped lang="less">
.base-form-edit {
}
::v-deep .sg-uploadFile > .preview {
  overflow: auto;
}
</style>
