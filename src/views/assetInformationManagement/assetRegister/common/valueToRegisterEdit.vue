<!--
 * @Author: LW
 * @Date: 2020-07-15 11:46:50
 * @LastEditTime: 2020-09-22 18:35:39
 * @Description: 价值登记编辑
--> 
<template>
  <div class="basicDownload">
    <SG-Modal
      :centered="true"
      width="800px"
      v-model="modalShow"
      okText="提交"
      title="编辑价值信息"
      @cancel="handleCancel"
      @ok="handleSubmit"
    >
    <div class="valueToRegisterEdit">
      <span class="section-title blue">资产信息</span>
        <a-row class="playground-row">
          <a-col :span="12" class="playground-col">资产名称：{{examine.assetName || '--'}}</a-col>
          <a-col :span="12" class="playground-col">资产编码：{{examine.assetCode || '--'}}</a-col>
          <a-col :span="12" class="playground-col">资产分类：{{examine.assetCategoryName || '--'}}</a-col>
          <a-col :span="12" class="playground-col">资产位置：{{examine.pasitionString || '--'}}</a-col>
        </a-row>
      <span class="section-title blue">价值信息</span>
      <div class="mt30 mb30">
        <a-row>
          <a-form :form="form" @submit="handleSubmit">
            <a-col :span="12" class="h-65">
              <a-form-item label="资产原值" v-bind="formItemLayout">
                <a-input-number placeholder="资产原值"
                :style="allWidth"
                :min="0"
                :max="99999999.99"
                :precision="2"
                v-decorator="['originalValue',
                  {rules: [{required: true, message: '资产原值(支持两位小数)'}], initialValue: subData.originalValue}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="使用期限(月)" v-bind="formItemLayout">
                <a-input-number placeholder="使用期限"
                :style="allWidth"
                :min="0"
                :precision="0"
                :max="999"
                v-decorator="['validPeriod',
                  {rules: [{ required: false, message: '使用期限'}], initialValue: subData.validPeriod}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="开始使用日期" v-bind="formItemLayout">
                <a-date-picker
                :style="allWidth"
                placeholder="开始使用日期"
                v-decorator="['startDate',
                  {rules: [{ required: false, message: '开始使用日期'}]}
                ]"
                />
                </a-form-item>
             </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="已使用期限" v-bind="formItemLayout">
                <a-input-number placeholder="已使用期限"
                :style="allWidth"
                :min="0"
                :max="999"
                :precision="0"
                v-decorator="['usedDate',
                  {rules: [{ required: false, message: '已使用期限'}], initialValue: subData.usedDate}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="累计折旧金额(元)" v-bind="formItemLayout">
                <a-input-number placeholder="累计折旧金额"
                :style="allWidth"
                :min="0"
                :precision="2"
                :max="99999999.99"
                v-decorator="['depreciationAmount',
                  {rules: [{ required: false, message: '累计折旧金额(支持两位小数)'}], initialValue: subData.depreciationAmount}
                ]"/>
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
import moment from 'moment'
const conditionalJudgment = [undefined, null, '']
export default {
  components: {},
  props: {},
  data () {
    return {
      organId: '',
      form: this.$form.createForm(this),
      modalShow: false,
      examine: {},
      subData: {
        assetId: '',
        registerOrderId: '',            // 登记单id
        originalValue: '',              // 资产原值
        validPeriod: '',                // 使用期限
        startDate: '',                  // 开始使用日期
        usedDate: '',                   // 已使用期数/月
        depreciationAmount: ''          // 累计折旧金额(元)：
      },
      assetName: '',
      allWidth: {width: '200px'},
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 14 }
        }
      }
    }
  },
  computed: {
  },
  created () {
  },
  watch: {
    modalShow (nv) {
      if (!nv) {
        this.handleCancel()
      }
    }
  },
  mounted () {
  },
  methods: {
    moment,
    // 编辑查询
    getValueDetail (record) {
      this.examine = record
      this.subData.registerOrderId = record.registerOrderId
      this.subData.assetType = record.assetType
      this.subData.assetId = record.assetId
      // 处理表单数据
      let o = {
        originalValue: Number(record.originalValue),              // 资产原值
        validPeriod: record.validPeriod,                  // 使用期限
        startDate: record.startDate ? moment(record.startDate, 'YYYY-MM-DD') : undefined,                      // 开始使用日期
        usedDate: record.usedDate,                        // 已使用期数/月
        depreciationAmount: record.depreciationAmount     // 累计折旧金额(元)
      }
      console.log(o)
      this.$nextTick(() => {
        this.form.setFieldsValue(o)
      })
    },
    // 提交
    updateAssetValue (values) {
      let obj = {
        registerOrderId: this.subData.registerOrderId,   // 登记单id
        assetType: this.subData.assetType,               // 资产类型
        assetId: this.subData.assetId,
        originalValue: conditionalJudgment.includes(values.originalValue) ? '' : values.originalValue,             // 资产原值
        validPeriod: conditionalJudgment.includes(values.validPeriod) ? '' : values.validPeriod,                 // 使用期限 单位月
        startDate: conditionalJudgment.includes(values.startDate) ? '' : `${values.startDate.format('YYYY-MM-DD')}`,  // 开始使用日期
        usedDate: conditionalJudgment.includes(values.usedDate) ? '' : values.usedDate,                       // 已使用期数/月
        depreciationAmount: conditionalJudgment.includes(values.depreciationAmount) ? '' : values.depreciationAmount    // 累计折旧金额(元)
      }
      let loadingName = this.SG_Loding('保存中...')
      this.$api.assets.updateAssetValue(obj).then(res => {
        if (Number(res.data.code) === 0) {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.success('提交成功')
            this.$emit('allQuery')
            this.handleCancel()
          })
        } else {
          this.DE_Loding(loadingName).then(() => {
            this.$message.error(res.data.message)
          })
        }
      })
    },
    commonFn () {
      this.handleSubmit()
    },
    // 取消
    handleCancel () {
      this.show = false
      this.$emit('cancel')
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          this.updateAssetValue(values)
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.modal-nav {
  line-height: 60px;
}
.playground-row {
  margin: 20px;
  .playground-col {
    line-height: 40px;
    font-size: 12px;
  }
}
.valueToRegisterEdit {
  max-height: 550px;
  overflow: auto;
  padding: 32px 18px;
  .h-65 {
    height: 65px;
  }
}
</style>