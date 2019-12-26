<!--
 * @Author: LW
 * @Date: 2019-12-26 10:40:03
 * @LastEditTime : 2019-12-26 17:22:42
 * @LastEditors  : Please set LastEditors
 * @Description: 登记盘点结果
 * @FilePath: \asset-management\src\views\inventoryManagement\inventoryPerform\inventoryResultRegistration.vue
 -->
<template>
  <div class="wrapper">
    <SG-Modal
    class="inventoryResultRegistration"
    width="880px"
    v-model="show"
    :noPadding="true"
    :title="newData === 'new' ? '登记盘点结果' : '编辑盘点结果'"
    @ok="statusFn"
    @cancel="handleCancel"
  >
  <div class="inventoryResultRegistration">
    <div class="inventoryResultRegistration-nav">
      <span class="section-title blue">资产信息</span>
        <a-row class="playground-row">
          <a-col class="playground-col" :span="12">资产编号：{{particularsData.assetCode || '--'}}</a-col>
          <a-col class="playground-col" :span="12">资产名称：{{particularsData.assetName || '--'}}</a-col>
          <a-col class="playground-col" :span="12">所属组织：{{particularsData.organName || '--'}}</a-col>
          <a-col class="playground-col" :span="12">资产类型：{{particularsData.assetTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="12">资产分类：{{particularsData.objectTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="12">资产状态：{{particularsData.statusName || '--'}}</a-col>
          <a-col class="playground-col" :span="12">资产项目：{{particularsData.projectName || '--'}}</a-col>
          <a-col class="playground-col" :span="12">资产位置：{{particularsData.location || '--'}}</a-col>
        </a-row>
    </div>
    <div class="inventoryResultRegistration-nav">
      <span class="section-title blue">盘点结果</span>
        <a-row class="playground-row">
          <a-form :form="form" @submit="handleSubmit">
            <a-col class="playground-col" :span="24">
              <a-form-item v-bind="formItemLayout" label="盘点结果：">
                <a-radio-group 
                  v-decorator="['checkResult',
                    {rules: [{required: true}], initialValue: newCardData.checkResult}
                  ]"
                  @change="radioChange"
                >
                  <a-radio v-for="(item, index) in radioData" :key="index" :value="item.value">{{item.name}}</a-radio>
                </a-radio-group>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="24">
              <a-form-item v-bind="formItemTextarea" label="异常说明：" :class="{'icon-color': requiredShow}">
                <a-textarea placeholder="请输入异常说明"
                  :style="widthBox"
                  :autosize="{ minRows: 3, maxRows: 3 }"
                  :maxLength="200"
                  v-decorator="['remark',
                  {rules: [{required: false, max: 200, message: '请输入异常说明(不超过200字符)'}], initialValue: newCardData.remark}
                  ]"
                  />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="24">
            <a-form-item v-bind="formItemTextarea" label="上传图片：">
              <SG-UploadFile
                v-model="newCardData.files"
              />
            </a-form-item>
          </a-col>
          </a-form>
        </a-row>
    </div>
  </div>
  </SG-Modal>  
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      resultId: '',
      checkId: '',   // 盘点单id
      taskId: '',     // 任务id
      assetId: '',   // 资产id
      requiredShow: false,
      radioData:[
        {
          value: '1',
          name: '正常'
        },
        {
          value: '0',
          name: '盘亏'
        },
        {
          value: '2',
          name: '信息有误'
        }
      ],
      show: false,
      newData: '',
      particularsData: '',
      formItemTextarea: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 }
        }
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 21 }
        }
      },
      form: this.$form.createForm(this),
      widthBox: 'width: 86%',
      newCardData: {
        remark: '',
        checkResult: '1',
        files: []
      }
    }
  },
  computed: {
  },
  methods: {
    radioChange (val) {
      if (+val.target.value === 1) {
        this.requiredShow = false
      } else {
        this.requiredShow = true
      }
    },
    // 关闭弹窗
    handleCancel (str) {
      if (str === 'success') {
        this.$emit('successQuery')
      }
      this.show = false
      this.$emit('showFn', this.show)
    },
    handleSubmit (e) {
      e.preventDefault()
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        } else {
          // console.log('Received values of form: ', values)
        }
      })
    },
    // 提交
    statusFn () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (+values.checkResult !== 1 && !values.remark) {
            this.$message.info('请输入异常说明')
            return
          }
          let files = []
          if (this.newCardData.files.length > 0) {
            this.newCardData.files.forEach(list => {
              files.push({
                attachmentPath: list.url,
                oldAttachmentName: list.name
              })
            })
          }
          let obj = {
            checkId: this.checkId,                 // 盘点单id
            taskId: this.taskId,                  // 任务id
            assetId: this.assetId,                 // 资产id
            checkResult: values.checkResult,             // 盘点结果(0盘亏 1正常 2信息有误 3盘盈)
            remark: values.remark,                  // 备注(异常说明)
            assetName: '',               // 资产名称(非盘盈利为空)
            assetType: '',               // 资产类型(非盘盈利为空)
            objectType: '',              // 资产分类(非盘盈利为空)
            assetAddress: '',            // 资产位置(非盘盈利为空)
            attachmentList: files        // 附件
          }
          let loadingName = this.SG_Loding('保存中...')
          this.$api.inventoryManagementApi.assetCheckInstCheckResult(obj).then(res => {
            if (Number(res.data.code) === 0) {
              let _this = this
              this.DE_Loding(loadingName).then(() => {
                this.$SG_Message.success('提交成功')
                _this.handleCancel('success')
              })
            } else {
              this.DE_Loding(loadingName).then(() => {
                this.$message.error(res.data.message)
              })
            }
          })
        }
      })
    },
    // 查询详情
    query (str, resultId, checkId, taskId, assetId) {
      this.newData = str
      this.resultId = resultId
      this.checkId = checkId   // 盘点单id
      this.taskId = taskId     // 任务id
      this.assetId = assetId   // 资产id
      let obj = {
        resultId: this.resultId  // 盘点id
      }
      this.$api.inventoryManagementApi.assetCheckInstFailDetail(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.particularsData = data
          if (this.newData !== 'new') {
            this.form.setFieldsValue({
              remark: this.particularsData.remark,
              checkResult: String(this.particularsData.checkResult)
            })
            if (+this.particularsData.checkResult === 1) {
              this.requiredShow = false
            } else {
              this.requiredShow = true
            }
            let files = []
            if (data.amsAttachmentList && data.amsAttachmentList.length > 0) {
              data.amsAttachmentList.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.oldAttachmentName
              })
            })
          }
          this.newCardData.files = files
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created () {
  },
  mounted () {
  }
}
</script>
<style lang="less" scoped>
.inventoryResultRegistration {
  height: 500px;
  overflow-y: scroll;
  padding-bottom: 70px;
  .inventoryResultRegistration-nav {
    padding: 40px 70px 0 70px;
    .tab-nav {
      margin: 24px 20px;
    }
  }
  .playground-row {
    margin: 23px 0 0 26px;
    .playground-col {
      line-height: 40px;
      font-size: 12px;
    }
    .files-style {
      margin-bottom: 70px;
    }
  }
}
</style>

<style lang="less">
.icon-color {
  .ant-form-item-label {
    label:before {
      display: inline-block;
      margin-right: 4px;
      content: '*';
      font-family: SimSun;
      line-height: 1;
      font-size: 12px;
      color: #f5222d;
    }
  }
}
</style>

