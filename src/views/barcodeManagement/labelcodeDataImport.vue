<template>
  <SG-Modal
    title="导入数据"
    okText="导入"
    v-model="visible"
    @ok="handleSave"
    @cancel="cancel"
    :width="543"
    :maskClosable="false"
    :noPadding="true"
    :bodyStyle="{ 'overflow-y': 'auto', padding: '0 0px' }"
  >
    <div class="export-box">
      <!-- 导入头部 -->
      <div class="export-head">
        <div>
          <SG-Button @click="downSource" type="primary" weaken>下载模板</SG-Button>
          <SG-Button @click="handleUpload" class="right-btn" type="primary" weaken>上传文件</SG-Button>
          <a-select
            style="width: 170px; margin-left: 140px"
            :allowClear="true"
            placeholder="全部资产项目"
            v-model="projectId"
            :showSearch="true"
            :filterOption="filterOption"
          >
            <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
        </div>
      </div>
      <!-- 中间内容 -->
      <div class="data-box">
        <div class="not_data" v-if="!fileName">
          <div class="not_data_img"></div>
          <div class="tip">暂无数据</div>
        </div>
        <div class="data-item" v-else>
          <span>{{ fileName }}</span>
          <a-icon type="close" class="delete-icon" @click="deleteFile" />
        </div>
      </div>
      <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display: none" />
    </div>
    <downErrorFile ref="downErrorFile">
      <div>{{ upErrorInfo }}</div>
    </downErrorFile>
  </SG-Modal>
</template>
<script>
import downErrorFile from '@/views/common/downErrorFile';
export default {
  props: {
    projectData: {
      type: Array,
    },
    labelTemp: {
      default: {},
    },
  },
  components: {
    downErrorFile,
  },
  data() {
    return {
      // uuid: getUuid(),
      visible: false,
      upErrorInfo: '',
      fileName: '',
      formData: null,
      fileMaxSize: 10240,
      fileType: ['xls', 'xlsx'],
      tipText: '',
      projectId: undefined, // 资产项目Id
    };
  },
  watch: {
    visible(nv) {
      if (!nv) {
        this.hiddeModal();
      }
    },
  },
  methods: {
    hiddeModal() {
      this.upErrorInfo = '';
      this.fileName = '';
      this.formData = null;
      this.$refs.fileUpload.value = '';
    },
    handleSave() {
      if (this.formData === null) {
        return this.$message.error('请先上传文件!');
      }
      let loadingName = this.SG_Loding('导入中...');
      this.formData.append('organId', this.labelTemp.organId);
      this.$api.barCode.readExcelModel(this.formData).then(
        (res) => {
          if (res.data.code === '0') {
            this.DE_Loding(loadingName).then(() => {
              this.$SG_Message.success('导入成功！');
              this.visible = false;
              this.projectId = undefined;
              this.$emit('success');
            });
          } else {
            this.DE_Loding(loadingName).then(() => {
              this.$refs.downErrorFile.visible = true;
              this.upErrorInfo = res.data.message;
            });
          }
        },
        () => {
          this.DE_Loding(loadingName).then((res) => {
            this.$SG_Message.error('导入失败！');
          });
        }
      );
    },
    checkFile(fileName, fileSize) {
      // 检查文件类型
      let myFileType = false;
      if (this.fileType.length) {
        const FileType = fileName.split('.').pop().toLowerCase();
        myFileType = this.fileType.some((item) => item.toLowerCase() === FileType);
      }
      // 检查文件大小
      let mfileSize = true;
      if (fileSize) {
        mfileSize = fileSize <= this.fileMaxSize * 1024;
      }
      return {
        size: mfileSize,
        type: myFileType,
      };
    },
    change(files, e) {
      if (!files.length) {
        return;
      }
      let fileData = new FormData();
      fileData.append('file', files[0]);
      console.log('files[0]', files[0]);
      let validObj = this.checkFile(files[0].name, files[0].size);
      if (!validObj.type) {
        this.$message.error('上传文件类型错误!');
        return;
      }
      if (!validObj.size) {
        this.$message.error(`文件大小超过${this.fileMaxSize}Kb`);
        return;
      }
      this.fileName = files[0].name;
      this.formData = fileData;
    },
    // 上传文件
    handleUpload() {
      this.$refs.fileUpload.click();
    },
    // 下载文件
    downSource() {
      if (!this.projectId) {
        this.$SG_Message.error('请选择资产项目');
      } else {
        let projectIdList = [];
        projectIdList.push(this.projectId);
        this.labelTemp.projectIdList = projectIdList;
        let loadingName = this.$SG_Message.loading({ content: '下载中...' });
        this.$api.barCode.exportLabelData(this.labelTemp).then(
          (res) => {
            this.$SG_Message.destroy(loadingName);
            let blob = new Blob([res.data]);
            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = `标签编码模板.xls`;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
          },
          () => {
            this.$SG_Message.destroy(loadingName);
            this.$SG_Message.error('导出标签编码模板失败!');
          }
        );
      }
    },
    cancel() {
      this.projectId = undefined;
      this.hiddeModal();
      this.$emit('hiddeModal');
    },
    deleteFile() {
      this.fileName = '';
      this.formData = null;
      this.$refs.fileUpload.value = '';
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  },
};
</script>
<style lang="less" scopes>
.export-box {
  padding: 0px 22px 0 30px;
}
.footer {
  margin: 20px;
  text-align: center;
}
.export-head {
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  border-bottom: 1px dashed rgba(237, 240, 244, 1);
}
.right-btn {
  margin-left: 10px;
}
.data-box {
  color: #0084ff;
  font-size: 12px;
  min-height: 185px;
  .data-item {
    padding: 10px;
    color: #0084ff;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .delete-icon {
      color: #fd7474;
      display: none;
    }
    &:hover {
      background: rgba(240, 248, 255, 1);
      .delete-icon {
        display: block;
        cursor: pointer;
      }
    }
  }
  .not_data {
    width: 125px;
    margin: auto;
    padding-top: 30px;
    .not_data_img {
      height: 103px;
      // background-image: url('../../../assets/image/house_no_data.png');
      background-size: 100% 100%;
    }
    .tip {
      text-align: center;
      color: #c4cbd4;
    }
  }
}
</style>
