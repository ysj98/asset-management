<!--
 * @Author: LW
 * @Date: 2019-12-26 15:37:38
 * @LastEditTime : 2020-01-03 17:19:39
 * @LastEditors  : Please set LastEditors
 * @Description: 登记盘盈资产
 * @FilePath: \asset-management\src\views\inventoryManagement\inventoryPerform\assetsInventorySurplus.vue
 -->
<template>
  <div class="wrapper">
    <SG-Modal
    class="inventoryResultRegistration"
    width="880px"
    v-model="show"
    :noPadding="true"
    :title="newData === 'new' ? '登记盘盈资产' : '编辑盘盈资产'"
    @ok="statusFn"
    @cancel="handleCancel"
  >
  <div class="inventoryResultRegistration">
    <div class="inventoryResultRegistration-nav">
      <span class="section-title blue">资产信息</span>
        <a-row class="playground-row">
          <a-form :form="form" @submit="handleSubmit">
            <a-col class="playground-col" :span="12">
              <a-form-item v-bind="formItemLayout" label="资产名称：">
                <a-input placeholder="请输入资产名称"
                :style="allWidth"
                :maxLength="30"
                v-decorator="['assetName', {rules: [{required: true, max: 30, whitespace: true, message: '请输入资产名称(不超过30字符)'}], initialValue: newCardData.assetName}]"/>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="12">
              <a-form-item v-bind="formItemLayout" label="资产类型：">
                <a-select :style="allWidth" placeholder="请选择资产类型" v-model="newCardData.assetType" @change="assetTypeFn">
                  <a-select-option v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
           <a-col class="playground-col" :span="12">
              <a-form-item v-bind="formItemLayout" label="资产分类">
                  <a-select :style="allWidth" placeholder="请选择资产分类" v-model="newCardData.assetClassify">
                    <a-select-option v-for="(item, index) in assetClassifyData" :key="index" :value="item.value">{{item.name}}</a-select-option>
                  </a-select>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="24">
              <a-form-item v-bind="formItemTextarea" label="资产位置：">
                <a-textarea placeholder="请输入资产位置"
                  :style="widthBox"
                  :autosize="{ minRows: 3, maxRows: 3 }"
                  :maxLength="100"
                  v-decorator="['assetAddress',
                  {rules: [{required: false, max: 100, message: '请输入资产位置(不超过100字符)'}], initialValue: newCardData.assetAddress}
                  ]"
                  />
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="24">
              <a-form-item v-bind="formItemTextarea" label="备注：">
                <a-textarea placeholder="请输入备注"
                  :style="widthBox"
                  :autosize="{ minRows: 3, maxRows: 3 }"
                  :maxLength="200"
                  v-decorator="['remark',
                  {rules: [{required: false, max: 200, message: '请输入备注(不超过200字符)'}], initialValue: newCardData.remark}
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
      organId: '',
      resultId: '',
      checkId: '',   // 盘点单id
      taskId: '',     // 任务id
      assetId: '',   // 资产id
      assetTypeData: [],      // 资产类型
      assetClassifyData: [],  // 资产分类
      checkResult: '',     // 盘点结果
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
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 }
        }
      },
      form: this.$form.createForm(this),
      allWidth: 'width: 214px',
      widthBox: 'width: 86%',
      newCardData: {
        assetType: '',
        assetClassify: '',
        assetAddress: '',
        assetName: '',
        remark: '',
        files: []
      }
    }
  },
  computed: {
  },
  methods: {
    // 资产类型选择
    assetTypeFn (val) {
      this.newCardData.assetType = val
      this.getListFn()
    },
    // 平台字典获取变动类型
    platformDictFn (str) {
      let obj = {
        code: str
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          if (str === 'asset_type') {
            this.assetTypeData = [...data]
            this.getListFn()
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产分类列表
    getListFn () {
      let obj = {
        organId: this.organId,
        assetType: this.newCardData.assetType
      }
      this.$api.assets.getList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.professionName,
              value: item.professionCode
            })
          })
          this.assetClassifyData = arr
        }
      })
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
            resultId: this.resultId,  // 盘点id
            checkId: this.checkId,                 // 盘点单id
            taskId: this.taskId,                  // 任务id
            assetId: this.assetId,                 // 资产id
            checkResult: this.newData === 'new' ? '3' : this.checkResult,             // 盘点结果(0盘亏 1正常 2信息有误 3盘盈)
            remark: values.remark,                  // 备注(异常说明)
            assetName: values.assetName,               // 资产名称(非盘盈利为空)
            assetType: this.newCardData.assetType,               // 资产类型(非盘盈利为空)
            objectType: this.newCardData.assetClassify,              // 资产分类(非盘盈利为空)
            assetAddress: values.assetAddress,            // 资产位置(非盘盈利为空)
            attachmentList: files        // 附件
          }
          console.log(obj, '-=-=-=-=')
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
    newFn (str, resultId, checkId, taskId, organId) {
      this.newData = str
      this.resultId = resultId
      this.checkId = checkId   // 盘点单id
      this.taskId = taskId     // 任务id
      this.organId = organId
    },
    // 查询详情
    query (str, resultId, checkId, taskId, assetId, organId) {
      this.newData = str
      this.resultId = resultId
      this.checkId = checkId   // 盘点单id
      this.taskId = taskId     // 任务id
      this.assetId = assetId   // 资产id
      this.organId = organId
      let obj = {
        resultId: this.resultId  // 盘点id
      }
      this.$api.inventoryManagementApi.assetCheckInstFailDetail(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.particularsData = data
          if (this.newData === 'set') {
            this.form.setFieldsValue({
              remark: this.particularsData.remark,
              assetName: this.particularsData.assetName,
              assetAddress: this.particularsData.location
            })
            this.newCardData.assetType = String(this.particularsData.assetType) || ''             // 资产类型
            this.newCardData.assetClassify = String(this.particularsData.objectType) || ''             // 资产分类
            this.checkResult = this.particularsData.checkResult
            let files = []
            if (data.attachmentList && data.attachmentList.length > 0) {
              data.attachmentList.forEach(item => {
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
    this.platformDictFn('asset_type')
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
