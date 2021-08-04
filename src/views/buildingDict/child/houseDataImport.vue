<!--
 * @Date: 2019-11-07 17:14:17
 * @Author: chen han
 * @Description: 房间资料导入
 -->
<template>
<SG-Modal
    @cancel="hiddeModal"
    title="导入数据"
    v-model="visible"
    :width="543"
    @ok="handleSave"
    okText="导入"
    :maskClosable="false"
    :noPadding="true"
    :bodyStyle="{ 'overflow-y': 'auto',padding: '0 0px'}"
  >
    <div class="export-box">
      <!-- 导入头部 -->
       <div class="export-head">
         <div>
           <SG-Button @click="downHouseSource" type="primary" weaken>下载房屋资料模板</SG-Button>
           <SG-Button @click="handleUpload" class="right-btn" type="primary" weaken>上传文件</SG-Button>
         </div>
         <div :style="inputStyple">
           <!-- 公司 -->
           <treeSelect
             :default="false"
             :defaultOrganName="defaultOrganName"
             :value="organId"
             @changeTree="changeTree"
             placeholder='请选择公司'
             :allowClear="false"
             :style="inputStyple"
           >
           </treeSelect>
         </div>
       </div>
       <!-- 中间内容 -->
       <div class="data-box">
           <div class="not_data" v-if="!fileName">
             <div class="not_data_img">
              </div>
              <div class="tip">
                暂无数据
              </div>
           </div>
           <div class="data-item" v-else>
             <span>{{fileName}}</span>
             <a-icon type="close" class="delete-icon" @click="deleteFile"/>
           </div>
       </div>
      <input ref="fileUpload" @change="change($event.target.files, $event)" type="file" style="display:none">
    </div>
    <downErrorFile ref="downErrorFile">
      <div>{{upErrorInfo}}</div>
    </downErrorFile>
</SG-Modal>
</template>
<script>
import downErrorFile from '@/views/common/downErrorFile'
import TreeSelect from "@/views/common/treeSelect";
// let getUuid = ((uuid = 1) => () => ++uuid)()
export default {
  props: {
    organIdCopy: {
      default: ''
    },
    defaultOrganName:{
      type: String,
      default: ''
    }
  },
  components: {
    downErrorFile,
    TreeSelect
  },
  created () {
    if (this.organIdCopy) {
      this.organId = this.organIdCopy
    }
  },
  data () {
    return {
      // uuid: getUuid(),
      visible: false,
      organId: '',
      upErrorInfo: '',
      inputStyple: {width: '165px'},
      fileName: '',
      formData: null,
      fileMaxSize: 10240,
      fileType: ['xls', 'xlsx'],
      tipText: ''
    }
  },
  watch: {
    visible (nv) {
      if (!nv) {
       this.hiddeModal()
      }
    },
    organIdCopy (nv) {
      console.log('2', nv)
      if (nv) {
        this.organId = nv
      }
    },
  },
  methods: {
    hiddeModal () {
      this.upErrorInfo = ''
      this.fileName = ''
      this.formData = null
      this.$refs.fileUpload.value = ''
    },
    // orangId改变
    changeTree (value) {
      this.organId = value
    },
    handleSave () {
      if (this.formData === null) {
        return this.$message.error('请先上传文件!')
      }
      let loadingName = this.SG_Loding('导入中...')
      this.$api.building.importExcel(this.organId, this.formData).then(res => {
        if (res.data.code === '0') {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.success('导入成功！')
            this.visible = false
            this.$emit('success')
          })
        } else {
          this.DE_Loding(loadingName).then(() => {
            this.$refs.downErrorFile.visible = true
            this.upErrorInfo = res.data.message
          })
        }
      }, () => {
        this.DE_Loding(loadingName).then(res => {
          this.$SG_Message.error('导入失败！')
        })
      })
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
    change (files, e) {
      if (!files.length) {
        return
      }
      let fileData = new FormData()
      fileData.append('file', files[0])
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
      this.formData = fileData
    },
    // 上传文件
    handleUpload () {
      this.$refs.fileUpload.click()
    },
    // 下载文件
    downHouseSource () {
      if (!this.organId) {
        return this.$message.error('请选择公司!')
      }
      let loadingName = this.$SG_Message.loading({content: '下载中...'})
      this.$api.building.downLoadExcel({organId: this.organId}).then(res => {
            this.$SG_Message.destroy(loadingName)
            let blob = new Blob([res.data])
            let a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = `房间资料模板.xls`
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            a.remove()
      }, () => {
        this.$SG_Message.destroy(loadingName)
        this.$SG_Message.error('导出房间模板失败!')
      })
    },
    cancel () {
      this.hiddeModal()
      this.$emit('cancel')
    },
    deleteFile () {
      this.fileName = ''
      this.formData = null
      this.$refs.fileUpload.value = ''
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  }
}
</script>
<style lang="less" scopes>
.export-box{
  padding: 0px 22px 0 30px;
}
.footer{
  margin: 20px;
  text-align: center;
}
.export-head{
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 70px;
  border-bottom: 1px dashed rgba(237,240,244,1);
}
.right-btn{
  margin-left: 10px;
}
.data-box{
  color: #0084FF;
  font-size: 12px;
  min-height: 185px;
  .data-item{
    padding: 10px;
    color: #0084FF;
    font-size: 12px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .delete-icon{
      color: #FD7474;
      display: none;
    }
    &:hover{
      background: rgba(240,248,255,1);
      .delete-icon{
        display: block;
        cursor: pointer;
      }
    }
  }
  .not_data{
    width:125px;
    margin: auto;
    padding-top: 30px;
    .not_data_img{
      height: 103px;
      background-image: url('../../../assets/image/house_no_data.png');
      background-size: 100% 100%;
    }
    .tip{
      text-align: center;
      color: #C4CBD4;
    }
  }
}
</style>
