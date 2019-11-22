<!--
  资产分类设置编辑页或详情页
-->
<template>
  <div class="handle-class-set">
    <a-form :form="form" @submit="handleSubmit">
      <div class="edit-box">
        <div class="edit-box-title"><i></i><span>基础信息</span></div>
        <div class="edit-box-content">
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">所属组织机构<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.organName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">资产类型<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.assetTypeName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">分类名称<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.professionName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">计量单位<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                allowClear
                placeholder="请选择计量单位"
                :style="allStyle"
                :options="unitOptions"
                v-decorator="['unit',
                {rules: [{required: true, message: '请选择计量单位'}], initialValue: detail.unit}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.unitName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">折旧方法<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                allowClear
                placeholder="请选择折旧方法"
                :style="allStyle"
                :options="depreciationMethodOptions"
                v-decorator="['depreciationMethod',
                {rules: [{required: true, message: '请选择折旧方法'}], initialValue: detail.depreciationMethod}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.depreciationMethodName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">净残值率(%)<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input-number
                placeholder="请输入净残值率(%)"
                :style="allStyle"
                step="1"
                v-if="editable"
                v-decorator="['netSalvageRate',
                {rules: [validateRate], initialValue: detail.netSalvageRate}
              ]"/>
              <span class="label-value" v-else>{{detail.netSalvageRate || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width" v-show="editable">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">备注<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <a-textarea
                placeholder="请输入备注信息（最多200字）"
                :rows="3"
                v-decorator="['remark',
                {rules: [{validator: validateRemark}], initialValue: detail.remark}]"></a-textarea>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">创建人<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.createByName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">创建时间<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.createTime || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">状态<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.statusName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">备注<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.remark || '--'}}</span>
            </a-form-item>
          </div>
        </div>
        <div class="edit-box">
          <div class="edit-box-title"><i></i><span>基础信息</span></div>
          <div class="edit-box-content">
            <div class="edit-box-content-item long-label">
              <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">资产编码前缀<i></i></span><span>：</span></div>
              <a-form-item class="label-value">
                <a-input
                  placeholder="请输入资产编码前缀"
                  :style="allStyle"
                  v-if="editable"
                  v-decorator="['assetCodePrx',
                {rules: [validateAssetCodePrx], initialValue: detail.assetCodePrx}
              ]"/>
                <span class="label-value" v-else>{{detail.assetCodePrx || '--'}}</span>
              </a-form-item>
            </div>
            <div class="edit-box-content-item long-label">
              <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">资产编码长度<i></i></span><span>：</span></div>
              <a-form-item>
                <a-input-number
                  placeholder="请输入资产编码长度"
                  :style="allStyle"
                  step="1"
                  v-if="editable"
                  v-decorator="['assetCodeLen',
                {rules: [validateAssetCodeLen], initialValue: detail.assetCodeLen}
              ]"/>
                <span class="label-value" v-else>{{detail.assetCodeLen || '--'}}</span>
              </a-form-item>
            </div>
            <div class="edit-box-content-item">
              <div class="label-name-box"><span class="label-name">预览<i></i></span><span>：</span></div>
              <a-form-item>
                <span class="label-value">{{assetCodePreview || '--'}}</span>
              </a-form-item>
            </div>
            <div class="edit-box-content-item long-label">
              <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">资产卡片编码前缀<i></i></span><span>：</span></div>
              <a-form-item>
                <a-input
                  placeholder="请输入资产卡片编码前缀"
                  :style="allStyle"
                  v-if="editable"
                  v-decorator="['assetCardCodePrx',
                {rules: [validateAssetCardCodePrx], initialValue: detail.assetCardCodePrx}
              ]"/>
                <span class="label-value" v-else>{{detail.assetCardCodePrx || '--'}}</span>
              </a-form-item>
            </div>
            <div class="edit-box-content-item long-label">
              <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">资产卡片编码长度<i></i></span><span>：</span></div>
              <a-form-item>
                <a-input-number
                  placeholder="请输入资产卡片编码长度"
                  :style="allStyle"
                  step="1"
                  v-if="editable"
                  v-decorator="['assetCardCodeLen',
                {rules: [validateAssetCardCodeLen], initialValue: detail.assetCardCodeLen}
              ]"/>
                <span class="label-value" v-else>{{detail.assetCardCodeLen || '--'}}</span>
              </a-form-item>
            </div>
            <div class="edit-box-content-item">
              <div class="label-name-box"><span class="label-name">预览<i></i></span><span>：</span></div>
              <a-form-item>
                <span class="label-value">{{assetCardCodePreview || '--'}}</span>
              </a-form-item>
            </div>
          </div>
        </div>
        <div class="edit-box">
          <div class="edit-box-title"><i></i><span>费用科目设置</span></div>
          <div class="edit-box-content">
            <a-table
              :columns="columns"
              :dataSource="dataSource"
              class="custom-table"
              :pagination="false"
            >
              <template slot="disposalCostSubject">
                <a @click="openSubjectModal('cost')" v-if="editable">处置成本费用科目</a>
                <span v-else>处置成本费用科目</span>
              </template>
              <template slot="disposalIncomeSubject">
                <a @click="openSubjectModal('income')" v-if="editable">处置收入费用科目</a>
                <span v-else>处置收入费用科目</span>
              </template>
              <template slot="disposalCostSubject" slot-scope="text, record">
                <a-select
                  style="width: 80%"
                  v-model="record.disposalCostSubject"
                  :options="billConfigOptions"
                  v-if="editable"
                ></a-select>
                <span v-else>{{record.disposalCostSubjectName}}</span>
              </template>
              <template slot="disposalIncomeSubject" slot-scope="text, record">
                <a-select
                  style="width: 80%"
                  v-model="record.disposalIncomeSubject"
                  :options="billConfigOptions"
                  v-if="editable"
                ></a-select>
                <span v-else>{{record.disposalIncomeSubjectName}}</span>
              </template>
            </a-table>
          </div>
        </div>
      </div>
    </a-form>
    <a-modal
      title="批量设置"
      v-model="showSubjectSetModal"
      @ok="handleMultiSetSubject"
      @cancel="showSubjectSetModal = false">
      <div class="multi-set-modal">
        <span>{{subjectSetType === 'cost' ? '处置成本费用科目' : '处置收入费用科目'}}</span>
        <a-select
          style="width: 180px"
          placeholder="请选择"
          v-model="multiSetSubject"
          :options="billConfigOptions"
        ></a-select>
      </div>
    </a-modal>
    <form-footer v-show="editable" leftButtonName="提交" rightButtonName="取消" @save="handleSubmit" @cancel="cancel"></form-footer>
  </div>
</template>

<script>
import FormFooter from '@/components/FormFooter'
import {dateToString} from 'utils/formatTime'
const columns = [
    {
      title: '编号',
      dataIndex: 'billConfId',
      width: '160'
    },
    {
      title: '处置类型',
      dataIndex: 'disposalTypeName',
      width: '160'
    },
    {
      slots: {title: 'disposalCostSubject'},
      // title: '处置成本费用科目',
      dataIndex: 'disposalCostSubject',
      width: '160',
      scopedSlots: { customRender: 'disposalCostSubject' }
    },
    {
      slots: {title: 'disposalIncomeSubject'},
      // title: '处置收入费用科目',
      dataIndex: 'disposalIncomeSubject',
      width: '160',
      scopedSlots: { customRender: 'disposalIncomeSubject' }
    }]
export default {
  components: {
    FormFooter
  },
  data () {
    return {
      pageType: 'edit', // 页面类型
      editable: true, // 是否可编辑
      form: this.$form.createForm(this),
      allStyle: 'width: 160px;',
      detail: {
        organName: '',
        assetTypeName: '',
        professionName: '',
        unit: undefined,
        unitName: '',
        depreciationMethod: undefined,
        depreciationMethodName: '',
        netSalvageRate: '',
        remark: '',
        createByName: '',
        createTime: '',
        statusName: '',
        assetCodePrx: '',
        assetCodeLen: 7,
        assetCardCodePrx: '',
        assetCardCodeLen: 5,
      },
      unitOptions: [],
      depreciationMethodOptions: [],
      assetCodePreview: '', // 资产编码预览
      assetCodePrxOK: false, // 资产编码前缀是否通过校验
      assetCodeLenOK: true, // 资产编码长度是否通过校验
      assetCardCodePreview: '',
      assetCardCodePrxOK: false,
      assetCardCodeLenOK: true,
      columns,
      dataSource: [],
      billConfigOptions: [],
      showSubjectSetModal: false, // 是否展示费用科目设置弹窗
      subjectSetType: '', // 费用科目设置弹窗类型
      multiSetSubject: ''
    }
  },
  methods: {
    validateRate (rule, value, callback) {
      if (!value) {
        callback('请输入净残值率(%)')
      } else if (value < 0 || value > 100) {
        callback('净残值率取值范围为0-100')
      }
      callback()
    },
    // 校验备注
    validateRemark (rule, value, callback) {
      if (value.length > 200) {
        callback('备注长度不能超过200个字')
      } else {
        callback()
      }
    },
    // 校验资产编码前缀
    validateAssetCodePrx (rule, value, callback) {
      let reg =  /^[A-Za-z0-9]*$/
      this.assetCodePrxOK = false
      this.detail.assetCodePrx = value
      if (!value) {
        callback('请输入资产编码前缀')
      } else if (value.length !== 3){
        callback('编码前缀必须为3位字符')
      } else if (!reg.test(value)) {
        callback('编码前缀格式不正确')
      } else {
        this.assetCodePrxOK = true
        callback()
      }
    },
    // 校验资产卡片编码前缀
    validateAssetCardCodePrx (rule, value, callback) {
      let reg =  /^[A-Za-z0-9]*$/
      this.assetCardCodePrxOK = false
      this.detail.assetCardCodePrx = value
      if (!value) {
        callback('请输入资产卡片编码前缀')
      } else if (value.length !== 3){
        callback('编码前缀必须为3位字符')
      } else if (!reg.test(value)) {
        callback('编码前缀格式不正确')
      } else {
        this.assetCardCodePrxOK = true
        callback()
      }
    },
    // 校验资产编码长度
    validateAssetCodeLen (rule, value, callback) {
      this.detail.assetCodeLen = value
      this.assetCodeLenOK = false
      let reg =  /^[0-9]*[1-9][0-9]*$/
      if (!value) {
        callback('请输入资产编码长度')
      } else if (value < 5 || value > 10) {
        callback('资产编码长度取值范围为5-10')
      } else if (!reg.test(value)) {
        callback('资产编码长度必须为正整数')
      } else {
        this.assetCodeLenOK = true
        callback()
      }
    },
    // 校验资产卡片编码长度
    validateAssetCardCodeLen (rule, value, callback) {
      this.detail.assetCardCodeLen = value
      this.assetCardCodeLenOK = false
      let reg =  /^[0-9]*[1-9][0-9]*$/
      if (!value) {
        callback('请输入资产卡片编码长度')
      } else if (value < 4 || value > 10) {
        callback('资产卡片编码长度取值范围为4-10')
      } else if (!reg.test(value)) {
        callback('资产卡片编码长度必须为正整数')
      } else {
        this.assetCardCodeLenOK = true
        callback()
      }
    },
    // 生成对应长度的预览编码
    createCode (prx, len) {
      console.log(typeof prx)
      if (!prx) {
        return ''
      }
      let str = prx
      for (let i = 0; i < len - 1; i++) {
        str += '0'
      }
      str += '1'
      return str
    },
    // 打开批量设置费用科目弹窗
    openSubjectModal (type) {
      this.showSubjectSetModal = true
      this.subjectSetType = type
    },
    // 提交批量设置费用科目
    handleMultiSetSubject () {
      let obj = {
        cost: 'disposalCostSubject',
        income: 'disposalIncomeSubject'
      }
      this.dataSource.forEach(item => {
        item[obj[this.subjectSetType]] = this.multiSetSubject
      })
      this.multiSetSubject = ''
      this.showSubjectSetModal = false
    },
    // 提交表单
    handleSubmit () {
      console.log('提交表单')
      this.form.validateFields((err, values) => {
        console.log(err)
        console.log(values)
        if (!err) {
          console.log('Received values of form: ', values)
          let form = values
          form.categoryConfId = this.categoryConfId
          form.organId = this.organId
          form.assetType = this.assetType
          form.professionCode = this.professionCode
          let arr = []
          this.dataSource.forEach(item => {
            let obj = {
              billConfId: item.billConfId,
              disposalType: item.disposalType,
              disposalCostSubject: item.disposalCostSubject,
              disposalIncomeSubject: item.disposalIncomeSubject
            }
            arr.push(obj)
          })
          form.billCfgList = arr
          this.$api.assets.update(form).then(res => {
            if (res.data.code === '0') {
              this.$message.success('修改成功')
              this.$router.push({path: '/assetClassSet', query: {refresh: true}})
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      }, err => {
        console.log(err)
      })
    },
    // 取消
    cancel () {
      this.$router.push({path: '/assetClassSet'})
    },
    getUnitOptions () {
      // let form = {
      //   dictCode: 'MEASURE_UNIT',
      //   groupId: this.organId
      // }
      let form = {
        code: 'MEASURE_UNIT',
        organId: this.organId
      }
      this.$api.basics.organDict(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.name,
              value: item.value
            }
            arr.push(obj)
          })
          this.unitOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getDepreciationMethodOptions () {
      let form = {
        code: 'DEPRECIATION_METHOD'
      }
      this.$api.basics.platformDict(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.name,
              value: item.value
            }
            arr.push(obj)
          })
          this.depreciationMethodOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getFeeTypeList () {
      let form = {
        organId: this.organId
      }
      this.$api.assets.getFeeTypeList(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.feeTypeName,
              value: item.feeTypeId
            }
            arr.push(obj)
          })
          this.billConfigOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getDetail () {
      let form = {}
      if (this.categoryConfId !== null) {
        form = {
          categoryConfId: this.categoryConfId
        }
      } else {
        form = {
          organId: this.organId,
          professionCode: this.professionCode,
          assetType: this.assetType
        }
      }
      this.$api.assets.getDetail(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data
          this.detail = data
          if (this.detail.createTime) {
            this.detail.createTime = dateToString(new Date(this.detail.createTime))
          }
          for (let item in this.detail) {
            if (this.detail[item] === null) {
              this.detail[item] = ''
              if (item === 'unit' || item === 'depreciationMethod') {
                this.detail[item] = undefined
              }
              if (item === 'assetCodeLen') {
                this.detail[item] = 7
              }
              if (item === 'assetCardCodeLen') {
                this.detail[item] = 5
              }
            }
          }
          this.assetCodePrxOK = true
          this.assetCardCodePrxOK = true
          this.detail.billCfgList.forEach((item, index) => {
            item.key = index.toString()
          })
          this.dataSource = this.detail.billCfgList
        }
      })
    }
  },
  mounted () {
    this.pageType = this.$route.query.pageType
    this.organId = this.$route.query.organId
    this.categoryConfId = this.$route.query.categoryConfId
    this.professionCode = this.$route.query.professionCode
    this.assetType = this.$route.query.assetType
    this.editable = this.pageType === 'edit'
    if (this.editable) {
      this.getUnitOptions()
      this.getDepreciationMethodOptions()
      this.getFeeTypeList()
    }
    this.getDetail()
  },
  watch: {
    'detail.assetCodePrx' () {
      if (this.assetCodePrxOK && this.assetCodeLenOK) {
        this.assetCodePreview = this.createCode(this.detail.assetCodePrx, this.detail.assetCodeLen)
      } else {
        this.assetCodePreview = ''
      }
    },
    'detail.assetCodeLen' () {
      if (this.assetCodePrxOK && this.assetCodeLenOK) {
        this.assetCodePreview = this.createCode(this.detail.assetCodePrx, this.detail.assetCodeLen)
      } else {
        this.assetCodePreview = ''
      }
    },
    'detail.assetCardCodePrx' () {
      if (this.assetCardCodePrxOK && this.assetCardCodeLenOK) {
        this.assetCardCodePreview = this.createCode(this.detail.assetCardCodePrx, this.detail.assetCardCodeLen)
      } else {
        this.assetCardCodePreview = ''
      }
    },
    'detail.assetCardCodeLen' () {
      if (this.assetCardCodePrxOK && this.assetCardCodeLenOK) {
        this.assetCardCodePreview = this.createCode(this.detail.assetCardCodePrx, this.detail.assetCardCodeLen)
      } else {
        this.assetCardCodePreview = ''
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .handle-class-set {
    padding: 40px 105px 60px 95px;
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
              margin-left: 10px;
              float: left;
              span {
                float: left;
              }
            }
            .label-space-between {
              width: 70px;
              text-align: justify;
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
            margin-left: 95px;
          }
          /deep/ .ant-form-item-with-help {
            margin-bottom: 6px;
          }
        }
        .edit-box-content-item.total-width {
          width: 100%;
          .label-value {
            float: left;
            width: calc(100% - 95px);
          }
        }
        .edit-box-content-item.long-label {
          .label-space-between {
            width: 100px;
          }
          /deep/ .ant-form-explain {
            margin-left: 125px;
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
  .multi-set-modal {
    width: 300px;
    margin: auto;
    span {
      margin-right: 10px;
    }
  }
</style>