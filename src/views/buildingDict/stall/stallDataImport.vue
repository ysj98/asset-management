<template>
  <SG-Modal
    @cancel="hiddeModal"
    title="导入数据"
    v-model="visible"
    :width="903"
    @ok="handleSave"
    okText="导入"
    :maskClosable="false"
    :noPadding="true"
    :bodyStyle="{ 'overflow-y': 'auto', padding: '0 0px' }"
  >
    <div class="export-box">
      <!-- 导入头部 -->
      <div class="export-head">
        <div>
          <SG-Button @click="downHouseSource" type="primary" weaken>下载车位资料模板</SG-Button>
          <SG-Button @click="handleUpload" class="right-btn" type="primary" weaken>上传文件</SG-Button>
        </div>
        <div :style="inputStyple">
          <!-- 公司 -->
          <treeSelect
            :default="true"
            :value="formInfo.organId"
            @changeTree="changeTree"
            placeholder="请选择组织机构"
            :allowClear="false"
            :style="inputStyple"
          >
          </treeSelect>
          <a-select
            show-search
            :style="allWidth"
            @search="handleSearch"
            @change="handleParkChange"
            placeholder="请选择车场名称"
            :options="$addTitle(placeArr)"
            :default-active-first-option="false"
            v-model="formInfo.importPlaceId"
          />
          <a-select
            :style="allWidth"
            :options="$addTitle(placeAreaArr)"
            placeholder="请选择区域名称"
            :default-active-first-option="false"
            v-model="formInfo.importArea"
          />
          <dict-select
            :style="allWidth"
            placeholder="请选择车位用途"
            @change="handleCarStallUsage"
            :dict-options="parkingUsageOption"
            v-model="formInfo.parkingUsage"
          />
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
      <div>
        详情错误原因：<a @click="downloadParkingTemplate(failPath)">{{ failPath }}</a>
      </div>
    </downErrorFile>
  </SG-Modal>
</template>
<script>
const allWidth = { width: '100%', marginLeft: '10px' };
import downErrorFile from '@/views/common/downErrorFile';
import TreeSelect from '@/views/common/treeSelect';
import DictSelect from '../../common/DictSelect';
import { carTypeMenu, parkingUsageOption, parkTypeOpt } from './dict';
// let getUuid = ((uuid = 1) => () => ++uuid)()
export default {
  props: {
    organIdCopy: {
      default: '',
    },
    defaultOrganName: {
      type: String,
      default: '',
    },
  },
  components: {
    downErrorFile,
    TreeSelect,
    DictSelect,
  },
  created() {
    // if (this.organIdCopy) {
    //   this.formInfo.organId = this.organIdCopy
    // }
  },
  data() {
    return {
      // uuid: getUuid(),
      failPath: '',
      organName: '',
      parkingUsageOption,
      allWidth,
      formInfo: {
        organId: undefined,
        importPlaceId: undefined,
        importArea: undefined,
        contractFile: '',
        parkingUsage: undefined,
      },
      visible: false,
      organId: '',
      upErrorInfo: '',
      inputStyple: { width: '605px', display: 'flex' },
      fileName: '',
      formData: null,
      fileMaxSize: 10240,
      fileType: ['xls', 'xlsx'],
      tipText: '',
      placeArr: [],
      placeAreaArr: [],
    };
  },
  watch: {
    defaultOrganName(val) {
      this.organName = val;
      console.log(val);
    },
    visible(nv) {
      if (!nv) {
        (this.formInfo = {
          organId: undefined,
          importPlaceId: undefined,
          importArea: undefined,
          contractFile: '',
          parkingUsage: undefined,
        }),
          this.hiddeModal();
      }
    },
    organIdCopy(nv) {
      console.log('2', nv);
      if (nv) {
        this.formInfo.organId = nv;
      }
    },
    'formInfo.organId'(val) {
      this.parkApiList();
    },
  },
  methods: {
    // 查询 区域
    async parkAreaApiList(data) {
      const { data: res } = await this.$api.building.parkApiDetail(data);
      if (String(res.code) === '0') {
        this.placeAreaArr = (res.data.areaArray || []).map((item) => ({
          value: item.parkingAreaId,
          label: item.areaName,
        }));
      } else {
        this.$message.error(res.message);
      }
    },
    // 车场 变化查询区域
    handleParkChange(ev) {
      const params = {
        placeId: ev,
        organId: this.formInfo.organId,
      };
      this.formInfo.parkingAreaId = undefined;
      this.placeAreaArr = [];
      this.parkAreaApiList(params);
    },
    // 查询 车场列表
    async parkApiList() {
      if (!this.formInfo.organId) {
        this.$message.error('请选择所属机构');
        return;
      }
      this.placeArr = [];
      const params = {
        onlyCurrentNode: 1,
        organId: this.formInfo.organId,
        pageNo: 1,
        pageLength: 999,
      };
      const { data: res } = await this.$api.building.parkApiList(params);
      if (String(res.code) === '0') {
        let result = res.data.resultList || [];
        this.placeArr = result.map((item) => ({
          value: item.placeId,
          label: item.placeName,
        }));
      } else {
        this.$message.error(res.data.message);
      }
    },
    hiddeModal() {
      this.visible = false;
      this.upErrorInfo = '';
      this.failPath = '';
      this.fileName = '';
      this.formData = null;
      this.$refs.fileUpload.value = '';
      this.$emit('close');
    },
    // orangId改变
    changeTree(value, organName) {
      this.organName = organName;
      this.formInfo.organId = value;
      this.parkApiList({ organId: value });
    },
    handleSave() {
      if (!this.formInfo.contractFile) {
        return this.$message.error('请先上传文件!');
      }
      if (!this.formInfo.organId) {
        return this.$message.error('请选择组织机构!');
      }
      if (!this.formInfo.importPlaceId) {
        return this.$message.error('请选择车场!');
      }
      if (!this.formInfo.importArea) {
        return this.$message.error('请选择区域!');
      }
      if (!this.formInfo.parkingUsage) {
        return this.$message.error('请选择车场用途!');
      }
      let formData = new FormData();
      formData.append('contractFile', this.formInfo.contractFile);
      formData.append('organId', this.formInfo.organId);
      formData.append('importPlaceId', this.formInfo.importPlaceId);
      formData.append('importArea', this.formInfo.importArea);
      formData.append('parkingUsage', this.formInfo.parkingUsage);
      let loadingName = this.SG_Loding('导入中...');
      this.$api.building.saveParkingImport(formData).then(
        (res) => {
          if (res.data.code === '0') {
            this.DE_Loding(loadingName).then(() => {
              this.$SG_Message.success('导入成功！');
              this.visible = false;
              this.$emit('success');
            });
          } else {
            this.DE_Loding(loadingName).then(() => {
              this.$refs.downErrorFile.visible = true;
              this.upErrorInfo = res.data.message;
              this.failPath = res.data.data;
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
      fileData.append('contractFile', files[0]);
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
      this.formInfo.contractFile = files[0];
      //this.formData = fileData
    },
    // 上传文件
    handleUpload() {
      this.$refs.fileUpload.click();
    },
    // 下载模板
    downloadParkingTemplate(data) {
      this.$api.building.downloadParkingTemplate(data).then((r) => {
        console.log(r.data);
        let blob = new Blob([r.data]);
        console.log(blob);
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = data;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    },
    // 下载文件
    downHouseSource() {
      if (!this.formInfo.organId) {
        return this.$message.error('请选择组织机构!');
      }
      let loadingName = this.$SG_Message.loading({ content: '下载中...' });
      this.$api.building
        .downloadParkingTemplateByCommunityId({ organId: this.formInfo.organId, organName: this.organName, systemCode: 'asset' })
        .then(
          (res) => {
            this.$SG_Message.destroy(loadingName);
            this.downloadParkingTemplate(res.data.data);
          },
          (err) => {
            console.log(err);
            this.$SG_Message.destroy(loadingName);
            this.$SG_Message.error('导出房间模板失败!');
          }
        );
    },
    cancel() {
      this.hiddeModal();
      this.$emit('cancel');
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
      background-image: url('../../../assets/image/house_no_data.png');
      background-size: 100% 100%;
    }
    .tip {
      text-align: center;
      color: #c4cbd4;
    }
  }
}
</style>
