<!--
  清理单的操作，包括新增，编辑，审核，详情
-->
<template>
  <div class="handle-clear-form">
    <a-form :form="form" @submit="handleSubmit">
      <div class="edit-box">
        <div class="edit-box-title"><i></i><span>基础信息</span></div>
        <div class="edit-box-content">
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">清理单编号<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入清理单编号"
                :style="allStyle"
                :max="30"
                v-if="editable"
                v-decorator="['cleaningOrderCode',
                {rules: [{required: true, max: 30, whitespace: true, message: '请输入清理单编号(不超过30字符)'}], initialValue: cleaningOrderCode}
              ]"/>
              <span class="label-value" v-else>{{cleaningOrderCode || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">资产项目<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请选择资产项目"
                optionFilterProp="children"
                :style="allStyle"
                :options="projectIdOptions"
                :filterOption="filterOption"
                v-decorator="['projectId',
                {rules: [{required: true,  message: '请选择资产项目'}], initialValue: projectId}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{projectName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">资产类型<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请选择资产类型"
                optionFilterProp="children"
                :style="allStyle"
                :options="assetTypeOptions"
                :filterOption="filterOption"
                v-decorator="['assetType',
                {rules: [{required: true,  message: '请选择资产类型'}], initialValue: assetType}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{assetTypeName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">清理原因<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请选择清理原因"
                mode="multiple"
                :tokenSeparators="[',']"
                :maxTagCount="1"
                optionFilterProp="children"
                :style="allStyle"
                :options="cleanupTypeOptions"
                :filterOption="filterOption"
                v-decorator="['cleanupType',
                {rules: [{required: true,  message: '请选择清理原因'}], initialValue: cleanupType}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{cleanupTypeName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">所属机构<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input :style="allStyle" v-model="organName" type="text" disabled v-if="editable"></a-input>
              <span class="label-value" v-else>{{organName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">创建人<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{createByName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">创建时间<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{createTime || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">备注<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{remark || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width" v-show="editable">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">备注<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <a-textarea
                placeholder="请输入描述（最多200字）"
                :rows="3"
                v-decorator="['remark',
                {rules: [{validator: validateRemark}], initialValue: remark}]"></a-textarea>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">附件<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <SG-UploadFile
                type="all"
                :show="!editable"
                v-decorator="['files',
                {rules: [], initialValue: files}]"  />
              <span class="file-null" v-if="!editable && files.length === 0">--</span>
            </a-form-item>
          </div>
        </div>
      </div>
      <div class="edit-box">
        <div class="edit-box-title"><i></i><span>资产明细</span></div>
        <div class="edit-box-content">
          <div class="table-header-btn" v-show="editable">
            <SG-Button type="primary" weaken @click="addAsset">添加资产</SG-Button>
          </div>
          <a-table
            :columns="columns"
            :dataSource="dataSource"
            class="custom-table"
            :pagination="false"
          >
            <template slot="operation" slot-scope="text, record">
              <a class="operation-btn" @click="deleteFn(record)">删除</a>
            </template>
          </a-table>
        </div>
      </div>
      <div class="edit-box" v-show="pageType === 'audit'">
        <div class="edit-box-title"><i></i><span>审核信息</span></div>
        <div class="edit-box-content">
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">审核人</span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{auditor || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">审核时间</span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{auditTime || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name">审核意见</span><span>：</span></div>
            <a-form-item class="label-value">
              <a-textarea
                placeholder="请输入审核意见"
                :rows="3"
                v-model="auditOpinion"
              ></a-textarea>
            </a-form-item>
          </div>
        </div>
      </div>
    </a-form>
    <form-footer v-show="pageType === 'new' || pageType === 'edit'" leftButtonName="提交审核" rightButtonName="取消" @save="handleSubmit" @cancel="cancel"></form-footer>
    <form-footer v-show="pageType === 'audit'" leftButtonName="审核通过" rightButtonName="驳回" rightButtonType="danger" @save="approveAudit" @cancel="rejectAudit"></form-footer>
    <!-- 选择资产 -->
    <AssetBundlePopover ref="assetBundlePopover" @status="status"></AssetBundlePopover>
  </div>
</template>

<script>
import FormFooter from '@/components/FormFooter'
import AssetBundlePopover from '../../common/assetBundlePopover'
const defaultColumns = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: '160'
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: '160'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: '160'
  },
  {
    title: '资产项目名称',
    dataIndex: 'projectName',
    width: '160'
  },
  {
    title: '所在位置',
    dataIndex: 'position',
    width: '160'
  },
  {
    title: '面积(㎡)',
    dataIndex: 'assetArea',
    width: '160'
  },
  {
    title: '规格',
    dataIndex: 'specification',
    width: '160'
  },
  {
    title: '资产状态',
    dataIndex: 'assetStatus',
    width: '160'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }]
export default {
  components: {
    FormFooter, AssetBundlePopover
  },
  data () {
    return {
      pageType: 'new',
      editable: false,
      form: this.$form.createForm(this),
      allStyle: 'width: 160px;',
      organId: '',
      organName: '',
      cleaningOrderId: '',
      cleaningOrderCode: '',
      projectId: undefined,
      projectName: '',
      projectIdOptions: [
        {label: '公建2019', value: '1'},
        {label: '廉租房2018', value: '2'}
      ],
      assetType: undefined,
      assetTypeName: '',
      assetTypeOptions: [
        {label: '房屋', value: '1'},
        {label: '构筑物', value: '2'},
        {label: '设备', value: '3'}
      ],
      cleanupType: undefined,
      cleanupTypeName: '',
      cleanupTypeOptions: [
        {label: '资产转让', value: '1'},
        {label: '资产报废', value: '2'},
        {label: '资产销售', value: '3'}
      ],
      createByName: '',
      createTime: '',
      remark: '',
      files: [],
      columns: [...defaultColumns],
      dataSource: [],
      checkedData: [],
      auditor: '',
      auditTime: '',
      auditOpinion: ''
    }
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 添加资产
    addAsset () {
      this.$refs.assetBundlePopover.redactCheckedDataFn(this.checkedData)
      this.$refs.assetBundlePopover.show = true
    },
    // 资产变动时
    status (val, data) {
      console.log(val)
      console.log(data)
      this.checkedData = [...val]
      data.forEach((item, index) => {
        item.key = item.assetCode
      })
      this.dataSource = data
      this.$refs.assetBundlePopover.show = false
    },
    // 删除
    deleteFn (record) {
      this.dataSource.forEach((item, index) => {
        if (item.assetCode === record.assetCode) {
          this.dataSource.splice(index, 1)
        }
      })
      this.checkedData.forEach((item, index) => {
        if (record.assetCode === item) {
          this.checkedData.splice(index, 1)
        }
      })
    },
    // 校验备注
    validateRemark (rule, value, callback) {
      if (value.length > 200) {
        callback('备注长度不能超过200个字')
      } else {
        callback()
      }
    },
    // 提交表单
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log('Received values of form: ', values)
        }
      })
    },
    // 提交审核
    submitAudit () {
    },
    // 取消
    cancel () {},
    // 审核通过
    approveAudit () {},
    // 驳回
    rejectAudit () {
      if (!this.auditOpinion) {
        this.$message.warning('驳回时审核意见不能为空')
        return
      }
    }
  },
  mounted () {
    this.pageType = this.$route.query.pageType
    this.editable = this.pageType === 'new' || this.pageType === 'edit'
    this.organId = this.$route.query.organId
    this.organName = this.$route.query.organName
    if (this.pageType !== 'new') {
      this.cleaningOrderId = this.$route.query.cleaningOrderId
    }
    if (!this.editable) {
      this.columns = this.columns.slice(0, this.columns.length - 1)
    }
  }
}
</script>

<style lang="less" scoped>
  .handle-clear-form {
    padding: 40px 105px 0 95px;
    .edit-box {
      text-align: left;
      color: #49505E;
      margin-bottom: 40px;
      .edit-box-title {
        height: 14px;
        font-size: 14px;
        font-weight:bold;
        i {
          display: block;
          height: 14px;
          width: 5px;
          margin-right: 10px;
          background: #0084FF;
          float: left;
        }
        span {
          display: block;
          float: left;
          height: 14px;
          line-height: 14px;
          font-family: PingFang-SC-Heavy;
        }
      }
      .edit-box-content {
        margin: 30px 40px 0 40px;
        position: relative;
        display: inline-block;
        width: 100%;
        .edit-box-content-item {
          width: 33%;
          float: left;
          font-size: 12px;
          .label-name-box {
            float: left;
            line-height: 34px;
            .label-name {
              height: 34px;
              font-family: PingFang-SC-Regular;
              color: #282D5B;
              margin-right: 3px;
              float: left;
              span {
                float: left;
              }
            }
            .label-space-between {
              width: 65px;
              text-align: justify;
              margin-left: 10px;
              i {
                display: inline-block;
                width: 100%;
              }
            }
          }
          .label-name-box.required {
            position: relative;
            &:before {
              position: absolute;
              left: 0px;
              width: 6px;
              content: '*';
              color: #f5222d;
              line-height: 36px;
              font-family: SimSun;
            }
          }
          /deep/ .ant-form-item-control {
            line-height: 34px;
          }
          /deep/ .ant-form-explain {
            margin-left: 90px;
          }
          /deep/ .ant-form-item-with-help {
            margin-bottom: 6px;
          }
        }
        .edit-box-content-item.total-width {
          width: 100%;
          .label-value {
            float: left;
            width: calc(100% - 90px);
          }
        }
        .table-header-btn {
          position: absolute;
          right: 0;
          top: -44px;
        }
      }
    }
  }
</style>