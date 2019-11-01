<template>
<div>
   <a-modal
        @cancel="closeModal"
        :title="title"
        v-model="modal.show"
        class="entering-modal"
        :width="449"
        :keyboard="false"
        :maskClosable="false"
        :bodyStyle="{height: '212px', 'overflow-y': 'auto'}"
        >
        <div slot="footer" style="text-align: center;">
          <a-button  type="primary" class="plr30" @click="filePost">
            导入
          </a-button>
          <a-button  class="btn-gray" @click="closeModal">
            取消
          </a-button>
        </div>
        <div  class="upload-box">
          <div class="text-down">
            <span class="text-label">模板下载:</span>
            <span>查验分项与标准文档.xls</span>
            <span class="down-line"></span>
            <span class="btn-text btn-blue down" @click="downloadImportSubitemAndStandard">下载</span>
            <span class="text-down-line"></span>
          </div>
          <div class="text-upload">
            <span class="text-label">文件上传:</span>
            <span class="text-name">{{filename}}</span>
            <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
            <a-button type="primary" @click="handleUpload()" class="btn-bg-blur" ghost>上传</a-button>
          </div>
        </div>
      </a-modal>
</div>      
</template>
<script>
import {Button, Modal} from 'ant-design-vue'
import {downloadImportSubitemAndStandard, ImportSubitemAndStandard} from '@/api/basics.js'
let getUuid = (() => {
  let uuid = 1
  return () => {
    return ++uuid
  }
})()
export default {
  components: {
    AButton: Button,
    AModal: Modal
  },
  props: {
    show: {
      type: Boolean,
      default: false
    },
    title: {
      type: String,
      default: '导入查验分项与标准弹窗'
    },
    organData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      keyUuid: getUuid(),
      modal: {
        title: '',
        show: false
      },
      filename: '',
      formData: null
    }
  },
  watch: {
    show () {
      this.modal.show = this.show
      this.keyUuid = getUuid()
    }
  },
  methods: {
    closeModal () {
      this.filename = ''
      this.formData = null
      this.$refs.fileUpload.value = ''
      this.$emit('close')
    },
    change (files) {
      if (!files.length) {
        return
      }
      let fileData = new FormData()
      fileData.append('file', files[0])
      fileData.append('groupId', this.organData.organId)
      this.filename = files[0].name
      this.formData = fileData
    },
    handleUpload () {
      this.$refs.fileUpload.click()
    },
    filePost () {
      if (this.formData === null) {
        return this.$message.error('请先上传文件!')
      }
      ImportSubitemAndStandard(this.formData).then(res => {
        if (res.data.code === '0') {
          this.$message.success('导入成功!')
          this.$router.push({path: '/undertake/checkObjectManage'})
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    downloadImportSubitemAndStandard () {
      let data = {
        groupId: this.organData.organId
      }
      downloadImportSubitemAndStandard(data).then(res => {
        let blob = new Blob([res.data], {type: 'application/octet-stream'})
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '查验分项与标准文档.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      }, () => {
        this.$SG_Message.error()
      })
    }
  }
}
</script>
<style lang="less" scoped>
.upload-box{
  font-size: 12px;
  padding-left: 34px;
  padding-top: 30px; 
  color: #282D5B;
}
.text-down,.text-upload{
  &::before {
    display: inline-block;
    width: 23px;
    height: 23px;
    line-height: 20px;
    background: #ffffff;
    border: 1px solid #0084FF;
    border-radius: 50%;
    color: #0084FF;
    text-align: center;
  }
  .text-label{
    margin-left:14px;
    margin-right: 17px;
  }
  .down-line{
    display: inline-block;
    height: 12px;
    width: 1px;
    background: #e6eaef;
    margin-left: 12px;
    margin-right: 7px;
  }
  .text-name{
    display: inline-block;
    vertical-align: top;
    width: 160px;
    height: 32px;
    background: #ffffff;
    border: 1px solid #c0c7d1;
    border-radius: 4px;
    margin-right: 5px;
    line-height: 30px;
    padding-left: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .down{
    vertical-align: unset;
  }
}
.text-down{
  margin-bottom: 38px;
  position: relative;
  .text-down-line{
    position: absolute;
    top: 23px;
    height: 43px;
    width: 1px;
    left: 11px;
    background: #e6eaef;
  }
  &::before{
    content: '1'
  }
}
.text-upload{
  &::before{
    content: '2'
  }
}
</style>
