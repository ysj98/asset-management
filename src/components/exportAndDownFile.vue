<!--
 * @Description: 展示当选嵌套机构树 下载文件模板，上传文件
  /*
  event
  $emit('down') 下载事件
  $emit(''upload') 上传事件
  $emit('changeTreeFile') 选择机构
  */
 -->
<template>
  <SG-Modal @cancel="hideModal" :title="title" v-model="visible" :width="width ? width : showDown ? '745px' : '450px'"
    @ok="handleSave" :maskClosable="false" okText="导入" :noPadding="true">
    <div class="upLoad-main">
      <div class="upLoad-left">
        <div class="r-nav">
          <div class="r-title">第一步</div>
          <div class="r-color mb15">选择导入位置</div>
          <div class="process">1</div>
          <treeSelect class="treeSelect-file" width="350" size="medium" @changeTree="changeTree" :showSearch="true">
          </treeSelect>
        </div>
        <div class="r-nav mt30">
          <div class="r-title">第二步</div>
          <div class="r-color mb15">下载模板文件<span v-if="prompt" class="pl10 sg-eport-red">{{ prompt }}</span></div>
          <div class="process">2</div>
        </div>
        <div class="left-file">
          <div class="file-name">{{ templateName }}</div>
          <div class="file-btn pointer" @click="handleDown">
            <SG-Icon type="icon-ic_xiazai" color="#0084FF" style="padding-right: 6px; line-height: 30px;"></SG-Icon>
            <span class="file-btn-b">下载</span>
          </div>
        </div>
      </div>
      <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
      <slot name="upLoadModule" v-if="showDown && this.$slots.upLoadModule"></slot>
      <div class="upLoad-right" v-if="showDown && !this.$slots.upLoadModule">
        <div class="r-nav">
          <div class="r-title">第三步</div>
          <div class="r-color mb15">选择已填内容的文件</div>
          <div class="process">3</div>
        </div>
        <div class="pl15">
          <div class="file-background" :class="{ blackBhite: !fileName }"></div>
          <div class="mb20">{{ fileName ? fileName : '请选择文件' }}</div>
          <SG-Button @click="handleUpload" type="secondary">选择文件</SG-Button>
        </div>
      </div>
    </div>
  </SG-Modal>
</template>
<script>
import treeSelect from '@/views/common/treeSelect'
export default {
  components: {
    treeSelect,
  },
  props: {
    // 标题
    title: {
      type: String,
      default: '导入'
    },
    // 模板名称
    templateName: {
      type: String,
      default: '模板名称.xlsx'
    },
    // 是否显示下载模板按钮部分
    showDown: {
      default: true,
    },
    upLoad: {
      default: () => { }
    },
    downLoad: {
      default: () => { }
    },
    // 导入文件类型
    fileType: {
      default: () => ['xls', 'xlsx']
    },
    // 导入文件大小
    fileMaxSize: {
      default: 10240
    },
    // 后台接收文件流的 key值
    uploadKey: {
      default: 'file'
    },
    width: {
      type: String,
      default: ''
    },
    // 模板提示
    prompt: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      visible: true,
      fileName: '',
      formData: null,
    }
  },
  methods: {
    // 选择文件
    handleUpload() {
      this.$refs.fileUpload.click()
    },
    // 下载文件
    handleDown() {
      this.$emit('down')
    },
    // 机构id
    changeTree(organId) {
      this.$emit('changeTreeFile', organId)
    },
    change(files) {
      if (!files.length) {
        return
      }
      let validObj = this.checkFile(files[0].name, files[0].size)
      if (!validObj.type) {
        this.$message.error('上传文件类型错误!')
        return
      }
      if (!validObj.size) {
        this.$message.error(`文件大小超过${this.fileMaxSize}Kb`)
        return
      }
      this.fileName = files[0].name
      this.formData = files[0]
    },
    checkFile(fileName, fileSize) {
      // 检查文件类型
      let myFileType = false
      if (this.fileType.length) {
        const FileType = fileName.split('.').pop().toLowerCase()
        myFileType = this.fileType.some(item => item.toLowerCase() === FileType)
      }
      // 检查文件大小
      let mfileSize = true
      if (fileSize) {
        mfileSize = fileSize <= (this.fileMaxSize * 1024)
      }
      return {
        size: mfileSize,
        type: myFileType
      }
    },
    // 隐藏弹窗
    hideModal() {
      this.resetData()
      this.$emit('cancelFn')
    },
    // 重置数据
    resetData() {
      this.fileName = ''
      this.formData = null
      this.$refs.fileUpload.value = ''
    },
    // 确认
    handleSave() {
      if (this.formData === null) {
        return this.$message.error('请先上传文件!')
      }
      this.$emit('upload', this.formData)
    },
  },
  mounted() {
    // console.log(this.$slots.upLoadModule)
  }
}
</script>
<style lang="less" scoped>
.upLoad-main {
  color: #959DAB;
  display: flex;
  min-height: 306px;
  padding: 20px 60px;

  .upLoad-left {
    flex: 0 0 380px;
    padding: 20px 0;

    .left-file {
      width: 360px;
      height: 40px;
      line-height: 40px;
      border: 1px solid #DCE1E6;
      border-radius: 4px;
      display: flex;

      .file-name {
        flex: 0 0 283px;
        padding: 0 10px;
        color: #49505E;
      }

      .file-btn {
        text-align: center;
        flex: 1;
        border-left: 1px solid #DCE1E6;
      }

      .file-btn-b {
        font-size: 14px;
        color: #0084FF;
        line-height: 32px;
        text-decoration: underline;
      }
    }
  }

  .upLoad-right {
    padding: 40px 0 0 65px;
    border-left: 1px solid rgba(192, 199, 209, 1);

    .file-background {
      width: 72px;
      height: 72px;
      margin-bottom: 4px;
      background-image: url('../assets/image/undertake/xls72px.png');
      background-size: 100% 100%;
    }

    .blackBhite {
      -webkit-filter: grayscale(100%);
      -moz-filter: grayscale(100%);
      -ms-filter: grayscale(100%);
      -o-filter: grayscale(100%);
      filter: grayscale(100%);
      filter: gray;
    }
  }

  .r-nav {
    position: relative;

    .r-title {
      width: 45px;
      font-size: 15px;
      font-weight: bold;
      color: #49505E;
      line-height: 20px;
    }

    .r-color {
      color: #6D7585;
      font-size: 13px;

      .sg-eport-red {
        color: red;
      }
    }

    .process {
      position: absolute;
      left: -40px;
      top: 2px;
      width: 32px;
      line-height: 30px;
      text-align: center;
      background: #FFFFFF;
      border: 1px solid #DCE1E6;
      border-radius: 50%;
      color: #49505E;
      font-weight: bold;
    }
  }
}
</style>


<style lang="less">
.treeSelect-file {
  .el-select {
    width: 356px;
  }

  .ant-input {
    border-radius: 4px !important;
  }
}
</style>
