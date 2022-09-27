 <!--
 * @Author: LW
 * @Date: 2020-07-10 16:13:27
 * @LastEditTime: 2020-07-22 10:33:36
 * @Description: 新增信息
--> 
<template>
  <div class="basicDetails">
    <div class="newInformation-nav">
      <span class="section-title blue">基础信息</span>
      <a-row class="playground-row">
        <a-col class="playground-col" :span="8" v-for="(item, index) in basicDetails" :key="index">
          {{item.text}}：{{Detail[item.value] || '--'}}
        </a-col>
      </a-row>
      <div style="display: flex;margin-top: 10px;" class="playground-row">
        <label slot="label" style="padding-top: 5px;">图&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;片：</label>
        <UploadFile
          :baseImgURL="configBase.hostImg1"
          @update="(value)=>{
            handleChangeFile(value,1,'img')
          }"
          @delete="(value)=>{
            handleChangeFile(value,0,'img')
          }"
          v-model="imgFiles"
          :max="5"
          :maxSize="20480"
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
      <div style="display: flex;margin-top: 10px;" class="playground-row">
        <label slot="label" style="padding-top: 5px;">附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;件：</label>
        <UploadFile
          :baseImgURL="configBase.hostImg1"
          @update="(value)=>{
            handleChangeFile(value,1)
          }"
          @delete="(value)=>{
            handleChangeFile(value,0)
          }"
          v-model="filepaths"
          type="all"
          :max="5"
          :maxSize="20480"
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
    </div>
  </div>
</template>

<script>
import configBase from "@/config/config.base";
import uploadAndDownLoadFIle from "@/mixins/uploadAndDownLoadFIle";
export default {
  components: {},
  props: {
    registerOrderId: [String, Number]
  },
  mixins:[uploadAndDownLoadFIle],
  data () {
    return {
      configBase,
      filepaths:[],
      imgFiles:[],
      basicDetails: [
        { text: '登记单编号', value: 'registerOrderId' },
        { text: '登记单名称', value: 'registerOrderName' },
        { text: '所属机构', value: 'organName' },
        { text: '资产项目名称', value: 'projectName' },
        { text: '资产类型', value: 'assetTypeName' },
        { text: '创建人', value: 'createByName' },
        { text: '创建日期', value: 'createTime' },
        { text: '备注', value: 'remark' }
      ],
      Detail: {},
      timer: null
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.editFn()
  },
  methods: {
    /*
    * type 0删除  1新增
    * */
    handleChangeFile(value,type,fileType){
      let filesArr = []
      if (type===0){
        if(fileType === 'img'){
          filesArr = this.imgFiles.filter(ele=>ele.url !== value.url)
          filesArr = filesArr.concat(this.filepaths)
        }else{
          filesArr = this.filepaths.filter(ele=>ele.url !== value.url)
          filesArr = filesArr.concat(this.imgFiles)
        }
      }else {
        const newUrlArr = value.map(ele=>ele.url)
        if(fileType === 'img'){
          let reg = /^((?!png|jpg|jpeg|bmp).)*$/
          let flag = this.imgFiles.some(item => {
            let str = item.name.split('.')
            return str[str.length-1] !== 'png' && str[str.length-1] !== 'jpg' && str[str.length-1] !== 'jpeg' && str[str.length-1] !== 'bmp'
          })
          if(flag){
            this.imgFiles = this.imgFiles.filter(item => !reg.test(item.name))
            this.$message.error('请上传图片')
            return
          }
          filesArr = [...this.imgFiles.filter(ele=> !newUrlArr.includes(ele.url)),...value]
          filesArr = filesArr.concat(this.filepaths)
        }else{
          filesArr = [...this.filepaths.filter(ele=> !newUrlArr.includes(ele.url)),...value]
          filesArr = filesArr.concat(this.imgFiles)
        }
      }
      clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        let attachment = filesArr.map(ele=>({attachmentPath:ele.url,oldAttachmentName:ele.name,attachmentSuffix: '.'+ele.name.split('.')[ele.name.split('.').length-1]}))
        const req = {
          objectType:2,
          objectId:this.Detail.registerOrderId,
          attachment
        }
        this.$api.assets.updateAttachment(req).then(({data:{code,message,data}})=>{
          if (code === '0'){
            this.$SG_Message.success('更新成功')
          }else {
            this.$SG_Message.error(message)
          }
        })
      },0)
    },
    editFn () {
      let obj = {
        registerOrderId: this.registerOrderId     // 资产登记单ID
      }
      this.$api.assets.getRegisterOrderById(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.Detail = data
          // this.filepaths = data.attachment.map(ele=>({url: ele.attachmentPath,name:ele.oldAttachmentName,attachmentId:ele.attachmentId}))
          this.filepaths = data.otherAttachment.map(ele=>({url: ele.attachmentPath,name:ele.oldAttachmentName,attachmentId:ele.attachmentId}))
          this.imgFiles = data.imageAttachment.map(ele=>({url: ele.attachmentPath,name:ele.oldAttachmentName,attachmentId:ele.attachmentId}))
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.basicDetails {
  margin-bottom: 30px;
  .playground-row {
    margin: 28px 20px 0 20px;
    .playground-col {
      line-height: 40px;
      font-size: 12px;
    }
  }
}
</style>