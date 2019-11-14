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
            <a-form-item label="标题" v-bind="formItemLayout">
              <a-input placeholder="请输入标题"
              :style="allWidth"
              :max="10"
              v-decorator="['title',
                {rules: [{required: true, max: 50, whitespace: true, message: '请输入标题(不超过50字符)'}], initialValue: newEditSingleData.title}
              ]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item label="所属机构：" v-bind="formItemLayout">
              <a-select
                :disabled="true"
                showSearch
                :style="allWidth"
                placeholder="请选择所属机构"
                v-decorator="['organId',{
                    rules: [{required: true, message: '请选择所属机构'}],
                    initialValue: newEditSingleData.organId
                  }]"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到所属机构"
                >
                <a-select-option
                  v-for="(item) in organIdData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item label="变动类型：" v-bind="formItemLayout">
              <a-select
                :disabled="setType === 'edit'"
                showSearch
                :style="allWidth"
                placeholder="请选择变动类型"
                v-decorator="['changeType',{
                    rules: [{required: true, message: '请选择变动类型'}],
                    initialValue: newEditSingleData.changeType
                  }]"
                @change="changeTypeChange"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到变动类型"
                >
                <a-select-option
                  v-for="(item) in changeTypeData"
                  :key="item.value"
                  :value='item.value'>
                  {{item.name}}
                </a-select-option>
              </a-select>
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
            <a-form-item label="交付单位：" v-bind="formItemLayout">
              <a-input placeholder="请输入交付单位"
              :style="allWidth"
              :max="10"
              v-decorator="['deliveryCompany',
                {rules: [{required: false, max: 50, whitespace: true, message: '请输入交付单位(不超过50字符)'}], initialValue: newEditSingleData.deliveryCompany}
              ]"/>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item label="变动日期：" v-bind="formItemLayout">
              <a-date-picker
              :style="allWidth"
              placeholder="请选择变动日期"
              v-decorator="['changeDate',
                {rules: [{required: true, message: '请选择变动日期'}]}
              ]"
              />
              </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item label="截止日期：" v-bind="formItemLayout">
              <a-date-picker
              :style="allWidth"
              placeholder="请选择截止日期："
              v-decorator="['expiryDate',
                {rules: [{required: false, message: '请选择截止日期：'}]}
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
        <span class="section-title blue">资产列表</span>
        <div class="button-box"><SG-Button class="buytton-nav" type="primary" weaken @click="addTheAsset">添加资产</SG-Button></div>
        <div class="table-layout-fixed table-border">
          <a-table
            :scroll="{y: 450}"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
            <!-- 交付物业 -->
            <template v-if="changeType === 'jfwy'" slot="transferArea" slot-scope="text, record">
              <a-input-number size="small" :min="1" :step="1.00" v-model="record.transferArea"/>
            </template>
            <!-- 交付运营 -->
            <template v-if="changeType === 'jfyy'" slot="transferOperationArea" slot-scope="text, record">
              <a-input-number size="small" :min="1" :step="1.00" v-model="record.transferOperationArea"/>
            </template>
            <!-- 使用方向变动 -->
            <template v-if="changeType === 'fxbd'" slot="operationArea" slot-scope="text, record">
              <a-input-number size="small" :min="1" :step="1.00" v-model="record.operationArea"/>
            </template>
            <template v-if="changeType === 'fxbd'" slot="selfUserArea" slot-scope="text, record">
              <a-input-number size="small" :min="1" :step="1.00" v-model="record.selfUserArea"/>
            </template>
            <template v-if="changeType === 'fxbd'" slot="idleArea" slot-scope="text, record">
              <a-input-number size="small" :min="1" :step="1.00" v-model="record.idleArea"/>
            </template>
            <template v-if="changeType === 'fxbd'" slot="occupationArea" slot-scope="text, record">
              <a-input-number size="small" :min="1" :step="1.00" v-model="record.occupationArea"/>
            </template>
            <template v-if="changeType === 'fxbd'" slot="otherArea" slot-scope="text, record">
              <a-input-number size="small" :min="1" :step="1.00" v-model="record.otherArea"/>
            </template>
            <!-- 原值变动 -->
            <template v-if="changeType === 'fxbd'" slot="originalValue" slot-scope="text, record">
              <a-input-number size="small" :min="1" :step="1.00" v-model="record.originalValue"/>
            </template>
            <!-- 位置变动 -->
            <template v-if="changeType === 'fxbd'" slot="address" slot-scope="text, record">
              <a-input-number size="small" :min="1" :step="1.00" v-model="record.address"/>
            </template>
            <!-- 资产项目变动 -->
            <template v-if="changeType === 'xmbd'" slot="changeProjectId" slot-scope="text, record">
              <a-select :defaultValue="record.changeProjectId === '' ? undefined : record.changeProjectId" v-model="record.changeProjectId === '' ? record.changeProjectId = undefined : record.changeProjectId" :allowClear="false"
                :filterOption="filterOption" :placeholder="'请选择服务类型'" style="width: 120px">
                <a-select-option v-for="(opt) in projectIdData" :key="opt.value" :value='opt.value'>
                  {{opt.name}}
                </a-select-option>
              </a-select>
            </template>
            <template slot="operation" slot-scope="text, record">
              <span class="postAssignment-icon" @click="deleteFn(record)">删除</span>
            </template>
          </a-table>
        </div>
      </div>
    </div>
    <!-- 选择资产 -->
    <AssetBundlePopover ref="assetBundlePopover" @status="status"></AssetBundlePopover>
    <FormFooter>
      <a-button type="primary" @click="save('save')">提交</a-button>
      <a-button style="margin-left: 10px" type="primary" @click="save('draft')">保存草稿</a-button>
      <a-button @click="cancel">取消</a-button>
    </FormFooter>
  </div>
</template>

<script>
import AssetBundlePopover from '../../common/assetBundlePopover'
import {deliveryProperty, deliveryOperation, changeDirectionUse, variationOriginalValue, positionChange, projectChange} from './basics'
import FormFooter from '@/components/FormFooter'
import moment from 'moment'
const newEditSingleData = {
  title: '',   // 验收单名称
  changeType: '',     // 变动类型
  projectId: '',     // 资产项目
  deliveryCompany: '',    // 交付单位
  changeDate: {},       // 变动日期
  expiryDate: {},        // 截止日期
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
      changeType: '',          // 用来判断对象变动类型
      checkedData: [],
      show: false,
      columns: [],
      tableData: [],
      organIdData: [],
      changeTypeData: [
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
  watch: {
    'changeType' (val) {
      this.checkedData = []
      this.tableData = []
      if (val === 'jfwy') {
        this.columns = deliveryProperty
      } else if (val === 'jfyy') {
        this.columns = deliveryOperation
      } else if (val === 'fxbd') {
        this.columns = changeDirectionUse
      } else if (val === 'yzbd') {
        this.columns = variationOriginalValue
      } else if (val === 'wzbd') {
        this.columns = positionChange
      } else if (val === 'xmbd') {
        this.columns = projectChange
      }
    }
  },
  methods: {
    // 确定拿到数据
    status (val, data) {
      this.checkedData = [...val]
      data.forEach((item, index) => {
        item.key = item.assetCode
      })
      this.tableData = data
      this.$refs.assetBundlePopover.show = false
    },
    // 添加资产
    addTheAsset () {
      this.$refs.assetBundlePopover.redactCheckedDataFn(this.checkedData)
      this.$refs.assetBundlePopover.show = true
    },
    // 变动类型
    changeTypeChange (val) {
      this.changeType = val
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
    // 交付物业
    handleChange(value, event, str) {
      const newData = [...this.tableData]
      const target = newData.filter(item => value.key === item.key)[0]
      if (target) {
        target[str] = event
        this.tableData = newData
      }
    },
    // 提交
    save (str) {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.tableData.length <= 0) {
            this.$message.info('请选择变动资产')
            return
          }
          let obj = {
            saveType: str === 'saveType' ? 0 : 1,
            changeOrderId: '',                // 资产变动单Id（新增为空）
            title: values.title,                // 标题
            projectId: title.projectId,                // 资产项目Id
            changeType: values.changeType,                // 变动类型Id
            deliveryCompany: values.deliveryCompany,                // 交付单位
            remark: values.remark,                // 备注
            organId: values.organId,                // 组织机构id
            changeDate: `${values.changeDate.format('YYYY-MM-DD')}`,                // 变动日期
            expiryDate: `${values.expiryDate.format('YYYY-MM-DD')}`,                // 截止日期
            assetDetailList: []
          }
          console.log(obj)
          this.$api.assets.submitChange(obj).then(res => {
            if (Number(res.data.code) === 0) {
              console.log('提交成功')
            }
          })
        }
      })
    },
    // 取消
    cancel () {
      this.$router.push({path: '/asset-management/#/assetChange'})
    },
    // 编辑获取接口
    editFn () {
      let obj = {
        changeOrderId: this.changeOrderId
      }
      this.$api.assets.getChangeInfo(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          console.log(data, '拿到是')
          this.form.setFieldsValue({
            organId: this.organIdData[0].value,
            projectId: data.projectId,
            title: data.title,
            changeType: String(data.changeType),
            deliveryCompany: data.deliveryCompany,
            changeDate: moment(data.changeDate, 'YYYY-MM-DD'),
            expiryDate: moment(data.expiryDate, 'YYYY-MM-DD'),
            remark: data.remark
          })
          this.changeType = data.changeType
          data.assetDetailList.forEach(item => {
            item.key = item.assetCode
          })
          this.$nextTick(() => {
            this.tableData = data.assetDetailList
          })
          console.log(this.tableData, '拿到的数据')
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
    } else {
      this.form.setFieldsValue({
        organId: this.organIdData[0].value
      })
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
