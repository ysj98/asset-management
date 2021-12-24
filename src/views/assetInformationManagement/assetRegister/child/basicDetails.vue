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
      <div style="display: flex;margin-top: 10px;">
        <SG-UploadFile
          @input="handleChangeFile"
          v-model="filepaths"
          :max="10"
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
import uploadAndDownLoadFIle from "@/mixins/uploadAndDownLoadFIle";
export default {
  components: {},
  props: {
    registerOrderId: [String, Number]
  },
  mixins:[uploadAndDownLoadFIle],
  data () {
    return {
      filepaths:[],
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
    handleChangeFile(files){
      // TODO: 登记xx,附件变动
      clearTimeout(this.timer)
      this.timer = setTimeout(()=>{
        const req = {
          objectType:2,
          objectId:this.Detail.registerOrderId,
          attachment: files.map(ele=>({attachmentPath:ele.url,oldAttachmentName:ele.name}))
        }
        this.$api.assets.updateAttachment(req).then(({data:{code,message,data}})=>{
          if (code === '0'){
            console.log('data',data)
            this.$SG_Message.success('更新成功')
          }else {
            this.$SG_Message.error(message)
          }
        })
      },1600)
    },
    editFn () {
      let obj = {
        registerOrderId: this.registerOrderId     // 资产登记单ID
      }
      this.$api.assets.getRegisterOrderById(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.Detail = data
          this.filepaths = data.attachment.map(ele=>({url: ele.attachmentPath,name:ele.oldAttachmentName}))
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