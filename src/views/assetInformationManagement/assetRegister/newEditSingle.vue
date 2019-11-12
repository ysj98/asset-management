<!--
  新增: new
  编辑: edit
-->
<template>
  <div class="newEditSingle">
    <div class="newEditSingle-nav">
      <span class="section-title blue">基础信息</span>
      <a-row class="playground-row">
        <a-form :form="form" @submit="handleSubmit">
          <a-col class="playground-col" :span="8">
            <a-form-item label="登记单编号" v-bind="formItemLayout">
              <a-input placeholder="请输入登记单编号"
              :style="allWidth"
              :max="10"
              v-decorator="['saveRegisterOrder',
                {rules: [{required: true, max: 50, whitespace: true, message: '请输入登记单编号(不超过50字符)'}], initialValue: newEditSingleData.title}
              ]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item label="资产项目：" v-bind="formItemLayout">
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产项目"
                v-decorator="['projectId',{
                    rules: [{required: true, message: '请选择资产项目'}],
                    initialValue: newEditSingleData.projectId
                  }]"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到资产项目"
                >
                <a-select-option
                  v-for="(item) in projectIdData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item label="资产类型：" v-bind="formItemLayout">
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产类型"
                v-decorator="['assetType',{
                    rules: [{required: true, message: '请选择资产类型'}],
                    initialValue: newEditSingleData.assetType
                  }]"
                @change="assetTypeChange"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到资产类型"
                >
                <a-select-option
                  v-for="(item) in assetTypeData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item label="接管日期：" v-bind="formItemLayout">
              <a-date-picker
              :style="allWidth"
              placeholder="请选择接管日期"
              v-decorator="['createTime',
                {rules: [{required: true, message: '请选择接管日期'}]}
              ]"
              />
              </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item label="备注" v-bind="formItemTextarea">
              <a-textarea placeholder="请输入备注"
                :style="widthBox"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-decorator="['remark',
                {rules: [{required: false, max: 200, message: '请输入问题备注(不超过200字符)'}], initialValue: newEditSingleData.remark}
                ]"
                />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
              <a-form-item label="上传附件：" v-bind="formItemTextarea">
                <SG-UploadFile
                  v-model="newEditSingleData.files"
                  type="all"
                />
              </a-form-item>
            </a-col>
        </a-form>
      </a-row>
      <div class="tab-nav">
        <span class="section-title blue">资产明细</span>
        <div class="button-box">
          <div class="buytton-nav">
            <SG-Button type="primary" weaken @click="addTheAsset">下载模板</SG-Button>
            <SG-Button class="choice" type="primary" weaken @click="addTheAsset">导入资产清单</SG-Button>
            <SG-Button type="primary" weaken @click="addTheAsset">清空列表</SG-Button>
          </div>
        </div>
        <!-- table-layout-fixed -->
        <div class="table-border">
          <a-table
            :scroll="{y: 450, x: 2600}"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
            <template slot="operation" slot-scope="text, record">
              <span class="postAssignment-icon" @click="deleteFn(record)">删除</span>
            </template>
          </a-table>
        </div>
      </div>
    </div>
    <FormFooter>
      <a-button type="primary" @click="save">提交</a-button>
      <a-button @click="cancel">取消</a-button>
    </FormFooter>
  </div>
</template>

<script>
import AssetBundlePopover from '../../common/assetBundlePopover'
import FormFooter from '@/components/FormFooter'
import moment from 'moment'
import {columnsData} from './registerBasics'
const newEditSingleData = {
  saveRegisterOrder: '',   // 验收单名称
  assetType: '',     // 资产类型
  projectId: '',     // 资产项目
  createTime: {},       // 接管日期
  remark: '',          // 备注
  files: [],
  organId: ''
}
export default {
  components: {AssetBundlePopover, FormFooter},
  props: {},
  data () {
    return {
      enitData: '',
      checkedData: [],
      show: false,
      columns: [...columnsData],
      tableData: [],
      organIdData: [],
      assetTypeData: [
        {
          name: '交付运营',
          value: 'jfyy'
        },
        {
          name: '交付物业',
          value: 'jfwy'
        },
        {
          name: '原值变动',
          value: 'yzbd'
        },
        {
          name: '使用方向变动',
          value: 'fxbd'
        },
        {
          name: '位置变动',
          value: 'wzbd'
        },
        {
          name: '资产项目变动',
          value: 'xmbd'
        }
      ],
      projectIdData: [
        {
          name: '资产项目',
          value: '1'
        }
      ],
      newEditSingleData: {...newEditSingleData},
      form: this.$form.createForm(this),
      allWidth: 'width: 160px',
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
  methods: {
    // 添加资产
    addTheAsset () {
    },
    // 资产类型
    assetTypeChange (val) {
      this.assetType = val
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
    // 删除
    deleteFn (record) {
      this.tableData.forEach((item, index) => {
        if (item.assetCode === record.assetCode) {
          this.tableData.splice(index, 1)
        }
      })
      this.checkedData.forEach((item, index) => {
        if (record.assetCode === item) {
          this.checkedData.splice(index, 1)
        }
      })
    },
    // 提交
    save () {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.tableData.length <= 0) {
            this.$message.info('请选择资产明细')
            return
          }
          let obj = {
            registerOrderId: '',                // 资产变动单Id（新增为空）
            saveRegisterOrder: values.saveRegisterOrder,                // 登记单编号
            projectId: values.projectId,                // 资产项目Id
            assetType: values.assetType,                // 资产类型Id
            remark: values.remark,                // 备注
            organId: values.organId,                // 组织机构id
            createTime: `${values.createTime.format('YYYY-MM-DD')}`,                // 接管日期
            assetHouseList: []
          }
          console.log(obj)
          // 编辑
          if (this.setType === 'edit') {
            this.$api.assets.updateRegisterOrder(obj).then(res => {
              if (Number(res.data.code) === 0) {
                console.log('提交成功')
              }
            }) 
          } else {
          // 新增
            this.$api.assets.saveRegisterOrder(obj).then(res => {
              if (Number(res.data.code) === 0) {
                console.log('编辑成功')
              }
            }) 
          }
        }
      })
    },
    // 取消
    cancel () {
      this.$router.push({path: '/asset-management/#/assetRegister'})
    },
    // 编辑获取接口
    editFn () {
      let obj = {
        registerOrderId: this.registerOrderId
      }
      this.$api.assets.getRegisterOrderById(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.form.setFieldsValue({
            projectId: data.projectId,
            registerOrderCode: data.registerOrderCode,
            assetType: String(data.assetType),
            createTime: moment(data.createTime, 'YYYY-MM-DD'),
            remark: data.remark
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getRegisterOrderDetailsByIdFn () {
      let obj = {
        registerOrderId: this.registerOrderId
      }
      this.$api.assets.getRegisterOrderDetailsById(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          data.forEach((item, index) => {
            item.key = index
          })
          this.$nextTick(() => {
            this.tableData = data
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created () {
    this.organIdData = JSON.parse(this.$route.query.record)
    this.setType = this.$route.query.setType
  },
  mounted () {
    if (this.setType === 'edit') {
      this.enitData = JSON.parse(this.$route.query.enitData)
      this.editFn()
      this.getRegisterOrderDetailsByIdFn()
    }
  }
}
</script>
<style lang="less" scoped>
.newEditSingle {
  padding-bottom: 70px;
  .newEditSingle-nav {
    padding: 42px 106px 70px 94px;
  }
  .playground-row {
    margin-top: 28px;
  }
  .tab-nav {
    margin-top: 40px;
    .button-box {
      overflow: hidden;
      margin-bottom: 10px;
      .buytton-nav {
        float: right;
        .choice {
          margin: 0 10px;
        }
      }
    }
  }
  .postAssignment-icon {
    cursor: pointer;
    color: #0084FF;
    // font-size: 18px;
  }
  .postAssignment-icon:hover {
    color: red;
  }
}
</style>
