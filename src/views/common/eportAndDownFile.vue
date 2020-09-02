<!--
 * @Date: 2019-11-15 11:19:49
 * @Author: chen han
 * @Description: 没有选择框时 下载文件模板，上传文件
 -->
<template>
    <SG-Modal
        @cancel="hideModal"
        :title="title"
        v-model="visible"
        :width="width ? width : showDown ? '745px' : '450px'"
        @ok="handleSave"
        :maskClosable="false"
        okText="导入"
        :noPadding="true"
      >
      <div class="upLoad-main">
        <div class="upLoad-left">
          <div class="left-title">选择待导入文件：</div>
          <div class="left-file">
            <div class="file-name">
              {{fileName}}
            </div>
            <div class="file-btn pointer" @click="handleUpload">
              选择
            </div>
          </div>
        </div>
        <!-- <div class="upLoad-right" v-if="showDown"> -->
        <slot name="upLoadModule" v-if="showDown && this.$slots.upLoadModule"></slot>
        <div class="upLoad-right" v-if="showDown && !this.$slots.upLoadModule">
          <div class="left-title">下载模板文件：</div>
          <div>
            <i class="file-background"></i>
            <span @click="handleDown" class="down_btn" style="margin-left: 17px;">下载</span>
          </div>
          <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
        </div>
        <!-- </div> -->
      </div>
    </SG-Modal>
</template>
<script>
export default {
  /*
  event
  $emit('down') 下载事件
  $emit(''upload') 上传事件
  */
  props: {
    // 标题
    title: {
      type: String,
      default: '模态框头部'
    },
    // 是否显示下载模板按钮部分
    showDown: {
      default: true,
    },
    upLoad: {
      default: () => {}
    },
    downLoad: {
      default: () => {}
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
    }
  },
  data () {
    return {
      visible: false,
      fileName: '',
      formData: null,
    }
  },
  watch: {
    visible (nv) {
      if (!nv) {
        this.hideModal()
      }
    }
  },
  methods: {
    // 选择文件
    handleUpload () {
      this.$refs.fileUpload.click()
    },
    // 下载文件
    handleDown () {
      this.$emit('down')
    },
    change (files, e) {
      if (!files.length) {
        return
      }
      // let fileData = new FormData()
      // fileData.append(this.uploadKey, files[0])
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
    checkFile (fileName, fileSize) {
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
    hideModal () {
      this.visible = false
      this.resetData()
    },
    // 重置数据
    resetData () {
      this.fileName = ''
      this.formData = null
      this.$refs.fileUpload.value = ''
    },
    // 确认
    handleSave () {
      if (this.formData === null) {
        return this.$message.error('请先上传文件!')
      }
      this.$emit('upload', this.formData)
    },
  },
  mounted () {
    console.log(this.$slots.upLoadModule)
  }
}
</script>
<style lang="less" scoped>
  .upLoad-main{
    color: #959DAB;
    display: flex;
    min-height: 200px;
    padding: 20px 60px;
    .upLoad-left{
      flex: 0 0 380px;
      padding: 20px 0;
      .left-file{
        width: 331px;
        height: 32px;
        line-height: 32px;
        border:1px solid rgba(192,199,209,1);
        border-radius:4px;
        display: flex;
        .file-name{
          flex: 0 0 283px;
          padding: 0 10px;
        }
        .file-btn{
          text-align: center;
          flex: 1;
          border-left: 1px solid rgba(192,199,209,1);
        }
      }
    }
    .upLoad-right{
       padding: 20px 50px;
       border-left: 1px solid rgba(192,199,209,1);
       .file-background{
         display: inline-block;
         width: 49px;
         height: 56px;
         background-image: url('../../assets/image/undertake/exl.png');
         background-size: 100% 100%;
       }
    }
    .left-title{
      margin-bottom: 15px;
    }
  }
</style>
