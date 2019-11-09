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
        <div>
          <!-- <a-table
            :loading="loading"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
            <template slot="operation" slot-scope="text, record">
            </template>
          </a-table> -->
        </div>
      </div>
    </div>
    <AssetBundlePopover ref="assetBundlePopover" @status="status"></AssetBundlePopover>
  </div>
</template>

<script>
import AssetBundlePopover from '../../common/assetBundlePopover'
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
const tableData = []
const columns = []
export default {
  components: {AssetBundlePopover},
  props: {},
  data () {
    return {
      show: false,
      columns: [],
      tableData: [...tableData],
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
  methods: {
    status (data) {
      console.log(data, '拿到的数据')
      this.$refs.assetBundlePopover.show = false
    },
    // 添加资产
    addTheAsset () {
      this.$refs.assetBundlePopover.show = true
    },
    changeTypeChange () {
      console.log('变动单')
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
  },
  created () {
    this.organIdData = JSON.parse(this.$route.query.record)
  },
  mounted () {
    this.form.setFieldsValue({
      organId: this.organIdData[0].value
    })
  }
}
</script>
<style lang="less" scoped>
.newEditSingle {
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
      .buytton-nav {
        float: right;
      }
    }
  }
}
</style>
