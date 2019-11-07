<!--
 * @Date: 2019-11-07 17:14:17
 * @Author: chen han
 * @Description: 房间批量更新
 -->

<template>
  <a-modal
  @cancel="closeModal"
      :title="modal.title"
      v-model="modal.show"
      :width="450"
      :keyboard="false"
      :maskClosable="false"
      :footer="null"
      :bodyStyle="{ 'overflow-y': 'auto',padding: '0 0px'}"
  >
  <div class="import-box">
    <div class="import-item">
      <a-button @click="changeInput" type="primary">上传文件</a-button>
      <span class="import-detail">请确认房间导入模板已按照模板说明来填充</span>
      <input class="import-input" type="file" ref="importFile" @change="change($event)" />
    </div>
    <div class="import-item">{{fileName}}</div>
    <div class="clearfix">
      <a-button class="fr" @click="importHouse" type="primary">导入</a-button>
    </div>
  </div>
  </a-modal>
</template>
<script>
import {Modal, Button} from 'ant-design-vue'
import * as api from '@/api/basicInfo.js'
export default {
  components: {
    AModal: Modal,
    AButton: Button
  },
  props: {
    show: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      modal: {
        title: '下载房间信息',
        show: false
      },
      fileName: '',
      fileData: ''
    }
  },
  watch: {
    show (newVal) {
      this.modal.show = this.show
    }
  },
  methods: {
    changeInput () {
      this.$refs.importFile.click()
    },
    change (e) {
      let file = e.target.files[0]
      if (!file) return
      if (!/\.(xlsx?|xls)(\?.*)?$/.test(file.name)) {
        e.target.value = ''
        this.fileName = ''
        this.fileData = ''
        this.$message.error('上传文件类型错误')
        return
      }
      let fromData = new FormData()
      this.fileName = file.name
      fromData.append('acctHouseCodeFile', file)
      this.fileData = fromData
    },
    importHouse () {
      if (!this.fileData) return
      api.acctHouseCodeImport(this.fileData).then(res => {
        if (+res.data.code === 0) {
          this.$message.success(res.data.message)
          this.closeModal()
          this.$emit('success')
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    closeModal () {
      this.fileName = ''
      this.fileData = ''
      this.$emit('close')
    }
  }
}
</script>

<style lang="less" scoped>
.import-input{
  display: none;
}
.import-box{
  padding: 20px;
}
.import-item{
  margin-bottom: 20px;
  .import-detail{
    vertical-align: middle;
    margin-bottom:10px;
  }
}
</style>

