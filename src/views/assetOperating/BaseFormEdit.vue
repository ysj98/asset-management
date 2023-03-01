<template>
  <div class="base-form-edit">
    <div style="width: 100%">
      <a-form-model ref="ruleForm" :model="formData" :rules="rules" layout="inline">
        <a-row>
          <a-col :span="8">
            <a-form-model-item :style="formItemStyle" label="转运营单名称" prop="title" v-bind="formItemLayout">
              <a-input v-model="formData.title" placeholer="请输入变动单名称"></a-input>
            </a-form-model-item>
          </a-col>

          <a-col :span="8">
            <a-form-model-item :style="formItemStyle" label="所属机构" v-bind="formItemLayout">
              <span>{{ this.organInfo.organName }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item :style="formItemStyle" label="资产项目" prop="projectId" v-bind="formItemLayout">
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
          <a-form-model-item :style="formItemStyle" label="资产类型" prop="assetType" v-bind="formItemLayoutTwo">
            <a-select style="width: 200px" v-model="formData.assetType" :options="assetTypeOptions"></a-select>
          </a-form-model-item>
        </a-row>
        <a-row style="margin-top: 20px">
          <a-form-model-item :style="formItemStyle" label="备注" v-bind="formItemLayoutTwo">
            <a-textarea style="width: 600px" v-model="formData.remark" placeholder="请输入备注信息"></a-textarea>
          </a-form-model-item>
        </a-row>
        <a-row style="display: flex; margin-top: 20px">
          <a-form-model-item :style="formItemStyle" label="附件" v-bind="formItemLayoutTwo">
            <UploadFile
              :baseImgURL="configBase.hostImg1"
              type="all"
              v-model="attachmentList"
              :max="5"
              :maxSize="5120"
              :customDownload="
                (value) => {
                  return customDownload(value, $api.ownership.downLoadAnnex);
                }
              "
              :customUpload="uploadFileFn"
            />
          </a-form-model-item>
        </a-row>
      </a-form-model>
    </div>
  </div>
</template>

<script>
import configBase from '@/config/config.base';
import SGUploadFilePlus from '@/components/SGUploadFilePlus';
import { getObjectKeyValueByOrganId } from '@/utils/share';
import uploadAndDownLoadFIle from '@/mixins/uploadAndDownLoadFIle';

export default {
  name: 'baseFormEdit',
  components: {
    SGUploadFilePlus,
  },
  props: {
    flowKey: {
      type: String,
      required: true,
    },
    isBpm: {
      type: Boolean,
      default: false,
    },
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
      configBase,
      formItemStyle: {
        width: '100%',
      },
      formItemLayoutTwo: {
        labelCol: {
          xs: { span: 8 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      rules: {
        title: [
          {
            required: true,
            message: '请输入变更单名称',
            trigger: 'blur',
          },
        ],
        projectId: [
          {
            required: true,
            message: '请选择资产项目',
            trigger: 'change',
          },
        ],
        assetType: [{ required: true, message: '请选择资产类型', trigger: 'change' }],
      },
      formStyle: {
        width: '200px',
      },
      projectListOptions: [],
      attachmentList: [],
      bpmFileList: [],
      formData: {
        projectId: '',
        title: '',
        assetType: '',
        remark: '',
      },
    };
  },
  watch: {
    'formData.assetType': {
      handler(newValue) {
        this.$emit('update:assetType', newValue);
      },
    },
  },
  computed: {
    assetTypeOptions() {
      // 过滤掉 车场和设备设施 3 or 5
      const { EQUIPMENT, YARD } = this.$store.state.ASSET_TYPE_CODE;
      return this.$store.state.ASSET_TYPE_OPTIONS.filter((ele) => ![EQUIPMENT, YARD].includes(String(ele.value))).map((ele) => ({
        title: ele.name,
        value: ele.value,
        label: ele.name,
      }));
    },
  },
  methods: {
    bpmUploadFile({ fileArr }) {
      fileArr.forEach((ele) => {
        const req = new FormData();
        req.append('file', ele);
        const params = {
          flowKey: this.flowKey,
        };
        this.$api.bpm.bpmFileUpload(req, { params }).then(
          ({ data }) => {
            this.bpmFileList.push({ ...data, _key: ele._key });
          },
          (reason) => {
            console.error(reason);
          }
        );
      });
    },
    uploadFileFn(value) {
      value.forEach((ele) => (ele._key = Math.random()));
      if (this.isBpm) {
        this.bpmUploadFile({ fileArr: value });
      }
      return this.customUpload(value, this.$api.ownership.uploadAnnex);
    },
    handleChangeProject(value) {
      this.$emit('update:projectId', value);
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
        remark: remark || '',
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
      // 手动处罚 change 事件
      this.handleChangeProject(projectId);
      console.log('data', data);
      console.log('attachment', data.attachment);
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
        throw new Error('校验未通过');
      }
      const attachmentList = this.attachmentList.map((ele) => {
        const bpmFileRes = this.bpmFileList.find((item) => ele._key === item._key);
        let bpmFileId = '';
        if (ele.bpmFileId) {
          bpmFileId = ele.bpmFileId;
        } else {
          bpmFileId = bpmFileRes ? bpmFileRes.fileId : '';
        }
        return {
          attachmentPath: ele.url,
          oldAttachmentName: ele.name,
          originName: ele.name,
          bpmFileId,
        };
      });
      return {
        ...this.formData,
        attachmentList,
      };
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
