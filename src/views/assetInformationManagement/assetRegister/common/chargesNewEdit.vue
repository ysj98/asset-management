<!--
 * @Author: LW
 * @Date: 2020-07-16 13:57:58
 * @LastEditTime: 2020-07-30 14:26:35
 * @Description: 新增相关费用
--> 
<template>
  <div class="basicDownload">
    <SG-Modal
      :centered="true"
      width="900px"
      v-model="modalShow"
      okText="提交"
      :title="type === 'new' ? '新增相关费用' : '编辑相关费用'"
      @cancel="handleCancel"
      @ok="handleSubmit"
    >
    <div class="chargesNewEdit">
      <span class="section-title blue">资产信息</span>
      <div class="mt15 mb15">
        <a-row class="playground-row">
          <a-form :form="form" @submit="handleSubmit" v-if="type === 'new'">
            <a-col :span="12" :class="type === 'new' ? 'h-65' :'h-40'">
              <a-form-item label="名称" v-bind="formItemLayout">
                <a-select
                  :placeholder="'请选择资产名称'" :style="allWidth"
                  showSearch
                  :options="examine.projectIdData"
                  :allowClear="true"
                  @change="assetFn"
                  optionFilterProp="children"
                  @search="handleSearch"
                  :filterOption="false"
                  v-decorator="['assetId',
                      {rules: [{required: true, message: '请选择类型'}], initialValue: subData.assetId}
                    ]"
                  notFoundContent="没有查询到数据"
                  />
              </a-form-item>
            </a-col>
          </a-form>
          <a-col v-if="type === 'edit'" :span="12" :class="type === 'new' ? 'h-65' :'h-40'"><a-form-item label="资产名称：" v-bind="formItemLayout">{{examine.assetName || '--'}}</a-form-item></a-col>
          <a-col :span="12" :class="type === 'new' ? 'h-65' :'h-40'"><a-form-item label="资产编码：" v-bind="formItemLayout">{{examine.assetCode || '--'}}</a-form-item></a-col>
          <a-col :span="12" :class="type === 'new' ? 'h-65' :'h-40'"><a-form-item label="资产分类：" v-bind="formItemLayout">{{examine.objectTypeName || '--'}}</a-form-item></a-col>
          <a-col :span="12" :class="type === 'new' ? 'h-65' :'h-40'"><a-form-item label="资产位置：" v-bind="formItemLayout">{{examine.pasitionString || '--'}}</a-form-item></a-col>
        </a-row>
      </div>
      <span class="section-title blue">相关费用信息</span>
      <div class="mt30 mb30">
        <a-row class="playground-row">
          <a-form :form="form" @submit="handleSubmit">
            <a-col :span="12" class="h-65">
              <a-form-item label="类别" v-bind="formItemLayout">
                <a-select
                  :placeholder="'请选择类别'" :style="allWidth"
                  showSearch
                  :options="categoryData"
                  :allowClear="true"
                  :filterOption="filterOption"
                  v-decorator="['category',
                    {rules: [{required: true, message: '请选择类别'}], initialValue: subData.category}
                  ]"
                  notFoundContent="没有查询到数据"
                  />
              </a-form-item>
            </a-col>
             <a-col :span="12" class="h-65">
              <a-form-item label="费用/收入类型" v-bind="formItemLayout">
                <a-input placeholder="请输入费用/收入类型"
                :style="allWidth"
                :max="30"
                v-decorator="['categoryType',
                  {rules: [{required: true, max: 30, message: '请输入名称(不超过30字符)'}], initialValue: subData.categoryType}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="费用/收入名称" v-bind="formItemLayout">
                <a-input placeholder="请输入费用/收入名称"
                :style="allWidth"
                :max="30"
                v-decorator="['categoryName',
                  {rules: [{required: true, max: 30, message: '请输入费用/收入名称(不超过30字符)'}], initialValue: subData.categoryName}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
                <a-form-item label="客户名称" v-bind="formItemLayout">
                <a-input placeholder="请输入客户名称"
                :style="allWidth"
                :max="30"
                v-decorator="['custName',
                  {rules: [{required: false, max: 30, message: '请输入客户名称(不超过30字符)'}], initialValue: subData.custName}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="所属月份" v-bind="formItemLayout">
                <a-month-picker
                :style="allWidth"
                placeholder="所属月份"
                v-decorator="['belongMonth',
                  {rules: [{ required: true, message: '所属月份'}]}
                ]"
                />
                </a-form-item>
             </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="金额(元)" v-bind="formItemLayout">
                <a-input-number placeholder="金额(元)"
                :style="allWidth"
                :min="0"
                :precision="2"
                :max="9999999.99"
                v-decorator="['amount',
                  {rules: [{required: true, message: '请输入金额(元)'}], initialValue: subData.amount}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="12" class="h-65">
              <a-form-item label="读数" v-bind="formItemLayout">
                <a-input-number placeholder="读数"
                :style="allWidth"
                :min="0"
                :precision="2"
                :max="9999999.99"
                v-decorator="['readNum',
                  {rules: [{required: false, message: '请输入读数'}], initialValue: subData.readNum}
                ]"/>
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="备注：" v-bind="formItemTextarea">
                <a-textarea placeholder="请输入备注"
                  :style="widthBox"
                  :autosize="{ minRows: 2, maxRows: 4 }"
                  v-decorator="['remark',
                  {rules: [{required: false, max: 200, message: '请输入问题备注(不超过200字符)'}], initialValue: subData.remark}
                  ]"
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
import {debounce} from '@/utils/utils'
import moment from 'moment'
export default {
  components: {},
  props: {},
  data () {
    return {
      type: '',                   // 新增编辑
      organId: '',
      form: this.$form.createForm(this),
      modalShow: false,
      categoryData: [             // 类型
        { label: '费用', key: '1' },
        { label: '收入', key: '2' }
      ],
      unitOfMeasurementOpt: [],   // 计量单位
      examine: {
        projectIdData: [],                        // 资产名称
      },
      subData: {
        registerOrderId: '',
        correlationExpenseId: '', // 相关费用ID
        assetId: undefined,              // 资产ID
        category: undefined,             // 类别
        categoryType: '',         // 费用/收入类型
        categoryName: '',         // 费用/收入名称
        custName: '',             // 客户名称
        belongMonth: '',          // 所属月份
        amount: '',               // 金额
        readNum: '',              // 读数
        remark: ''                // 备注
      },
      assetName: '',
      allWidth: {width: '200px'},
      widthBox: 'width: 80%',
      formItemTextarea: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 }
        }
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
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
    allMounted (str, obj) {
      this.subData.registerOrderId = obj.registerOrderId
      this.organId = obj.organId
      this.subData.assetType = obj.assetType
      this.type = str
      if (str === 'edit') {
        this.subData.correlationExpenseId = obj.correlationExpenseId
        this.correlationExpenseDetail()
      } else {
        this.findAssetListByRgId(this.subData.registerOrderId, '')
      }
    },
    // 编辑查询
    correlationExpenseDetail () {
      let data = {
        correlationExpenseId: this.subData.correlationExpenseId
      }
      this.$api.assets.correlationExpenseDetail(data).then(res => {
        if (res.data.code === "0") {
          let obj = res.data.data || {}
          this.examine = obj
          this.examine.pasitionString = obj.assetAddress
          this.subData.correlationExpenseId = obj.correlationExpenseId
          this.subData.assetId = obj.assetId
          // 处理表单数据
          let o = {
            category: String(obj.category),             // 类别
            categoryType: obj.categoryType,     // 费用/收入类型
            categoryName: obj.categoryName,     // 费用/收入名称
            custName: obj.custName,             // 客户名称
            belongMonth: obj.belongMonth ? moment(obj.belongMonth, 'YYYY-MM') : '',       // 转运营时间
            amount: obj.amount,                 // 金额
            readNum: obj.readNum,               // 读数
            remark: obj.remark                  // 备注
          }
          this.form.setFieldsValue(o)
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    // 提交
    correlationExpenseUpdate (values) {
      let obj = {
       registerOrderId: this.subData.registerOrderId,
       correlationExpenseId: this.subData.correlationExpenseId,   // 相关费用ID
       assetId: this.subData.assetId,                // 资产ID
       category: values.category,               // 类别
       categoryType: values.categoryType,           // 费用/收入类型
       categoryName: values.categoryName,           // 费用/收入名称
       custName: values.custName,               // 客户名称
       belongMonth: values.belongMonth === undefined ? '' : `${values.belongMonth.format('YYYY-MM')}`,            // 转运营时间
       amount: values.amount,                 // 金额
       readNum: values.readNum,                // 读数
       remark: values.remark                 // 备注
      }
      let loadingName = this.SG_Loding('保存中...')
      this.$api.assets.correlationExpenseUpdate(obj).then(res => {
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
    // 搜索
    handleSearch (value) {
      this.assetName = value
      this.debounceMothed()
    },
    // 防抖函数后台请求楼栋数据
    debounceMothed: debounce(function () {
      this.findAssetListByRgId(this.subData.registerOrderId, this.assetName || '')
    }, 200),
    findAssetListByRgId (registerOrderId, assetName) {
      let obj = {
        registerOrderId: registerOrderId,    // 资产登记单Id
        assetName: assetName           // 资产名称，支持模糊查询
      }
      this.$api.assets.findAssetListByRgId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          if (data && data.length !== 0) {
            data.forEach(item => {
              arr.push({label: item.assetName, value: item.assetId, ...item})
            })
            this.examine.projectIdData = arr
          } else {
            this.examine.projectIdData = []
            this.examine.assetName = data[0].assetName
            this.examine.assetCode = ''
            this.examine.objectTypeName = ''
            this.examine.pasitionString = ''
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    assetFn (val) {
      this.subData.assetId = val
      this.examine.projectIdData.forEach(item => {
        if (item.assetId === val) {
          this.examine.assetName = item.assetName
          this.examine.assetCode = item.assetCode
          this.examine.objectTypeName = item.objectTypeName
          this.examine.pasitionString = item.pasitionString
        }
      })
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    handleChange (e) {
     this.subData.isBefore = e.target.checked
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
          this.correlationExpenseUpdate(values)
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
.chargesNewEdit {
  // max-height: 550px;
  // overflow: auto;
  padding: 32px 18px;
  .h-65 {
    height: 65px;
  }
  .h-40 {
    height: 40px;
    line-height: 40px;
  }
}
</style>