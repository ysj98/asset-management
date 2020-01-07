<!--
 * @Author: LW
 * @Date: 2019-12-27 11:37:37
 * @LastEditTime : 2020-01-07 18:08:31
 * @LastEditors  : Please set LastEditors
 * @Description: 任务新增编辑
 * @FilePath: \asset-management\src\views\inventoryManagement\countingTask\newEditor.vue
 -->
<template>
  <div class="newEditor">
    <div class="newEditor-nav">
      <span class="section-title blue">任务基础信息</span>
      <div class="newEditor-obj">
        <a-row class="playground-row">
          <a-form :form="form" @submit="handleSubmit">
            <a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="任务单号：">
                <a-input placeholder="请输入任务单号"
                :style="allWidth"
                :disabled="true"
                v-decorator="['taskId', {rules: [], initialValue: newCardData.taskId}]"/>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="任务名称：">
                <a-input placeholder="请输入任务名称"
                :style="allWidth"
                :maxLength="50"
                v-decorator="['taskName', {rules: [{required: true, max: 50, whitespace: true, message: '请输入任务名称(不超过50字符)'}], initialValue: newCardData.taskName}]"/>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="所属计划：">
                <a-input placeholder="请输入所属计划"
                :disabled="true"
                :style="allWidth"
                v-decorator="['planName', {rules: [], initialValue: newCardData.planName}]"/>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="负责人：">
                <a-select
                  placeholder="请选择负责人"
                  :open="false"
                  :style="allWidth"
                  :options="chargePersonOpt"
                  @dropdownVisibleChange="selectPerson"
                  v-decorator="['chargePerson', {rules: [{required: true, whitespace: true, message: '请选择负责人'}], initialValue: newCardData.chargePerson}]"
                >
                  <div slot="dropdownRender" slot-scope="menu"></div>
                  <a-icon slot="suffixIcon" type="plus-circle" />
                </a-select>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="执行时间：">
                <SG-DatePicker style="width: 200px;"  pickerType="RangePicker"
                @change="defaultValueFn"
                :allowClear="false"
                 v-decorator="['defaultValue', {rules: [{type: 'array', required: true, whitespace: true, message: '请选择执行时间'}], initialValue: newCardData.defaultValue}]"
                 format="YYYY-MM-DD"></SG-DatePicker>
              </a-form-item>
            </a-col>
            <a-col class="playground-col" :span="24">
              <a-form-item v-bind="formItemTextarea" label="资产盘点范围：">
                <a-input placeholder="请输入资产盘点范围"
                :disabled="true"
                :style="allWidth"
                v-decorator="['checkRange', {rules: [], initialValue: newCardData.checkRange}]"/>
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
          </a-form>
        </a-row>
      </div>
    </div>
    <div class="newEditor-nav">
      <span class="section-title blue">盘点单列表 (资产总数：{{inventoryAssetCount || 0}})</span>
      <div class="newEditor-obj">
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="table.loading"
            :columns="table.columns"
            :dataSource="table.dataSource"
            class="custom-table td-pd10"
            :pagination="false"
            >
          <!-- 盘点单名称 -->
          <template slot="checkName" slot-scope="text, record">
            <span v-if="record.IsEdit">{{record.checkName}}</span>
            <a-input v-else placeholder="请输入盘点单名称" :maxLength="60" v-model="record.checkName"/>
          </template>
          <!-- 盘点人 -->
          <template slot="chargePerson" slot-scope="text, record, index">
            <span v-if="record.IsEdit">{{record.userNames}}</span>
            <a-select
              v-else
              placeholder="请选择负责人"
              :open="false"
              :style="{width: '100%'}"
              :options="record.chargePersonOpt"
              @dropdownVisibleChange="tabSelectPerson(record,index)"
              v-model="record.chargePerson"
            >
              <div slot="dropdownRender" slot-scope="menu"></div>
              <a-icon slot="suffixIcon" type="plus-circle" />
            </a-select>
          </template>
          <!-- 开始时间 -->
          <template slot="beginDate" slot-scope="text, record, index">
            <span v-if="record.IsEdit">{{ record.beginDate === undefined ? '' : moment(record.beginDate).format('YYYY-MM-DD')}}</span>
            <a-date-picker :allowClear="false" @change="chanheFn(record.beginDate, index, 'beginDate')" v-else v-model="record.beginDate"/>
          </template>
          <!-- 结束时间 -->
          <template slot="endDate" slot-scope="text, record, index">
            <span v-if="record.IsEdit">{{ record.endDate === undefined ? '' : moment(record.endDate).format('YYYY-MM-DD')}}</span>
            <a-date-picker :allowClear="false" @change="chanheFn(record.endDate, index, 'endDate')" v-else v-model="record.endDate"/>
          </template>
          <template slot="operation" slot-scope="text, record, index">
            <span class="btn_click mr15" v-if="record.IsEdit" @click="operationFn(record, 'edit', index)">编辑</span>
            <span class="btn_click mr15" v-if="!record.IsEdit"  @click="operationFn(record, 'set', index)">保存</span>
            <span class="btn_click mr15" v-if="!record.IsEdit"  @click="operationFn(record, 'cancel', index)">取消</span>
            <span class="btn_click mr15" @click="operationFn(record, 'delete', index)">删除</span>
            <span class="btn_click" v-if="!record.IsEdit" @click="operationFn(record, 'particulars', index)">资产明细</span>
          </template>
          </a-table>
        </div>
        <div class="add-information" @click="newMortgageInformation"><a-icon type="plus" class="item-tab-icon"/>新建盘点单</div>
      </div>
    </div>
    <FormFooter style="border:none;" location="fixed">
      <div>
        <SG-Button type="primary" @click="save('save')">提交</SG-Button>
        <!-- <SG-Button style="margin-left: 12px" type="primary" weaken @click="save('draft')">保存草稿</SG-Button> -->
        <SG-Button @click="cancel">取消</SG-Button>
      </div>
    </FormFooter>
    <div>
      <!-- 选人 -->
      <selectStaffOrPost ref="selectStaffOrPost" :selectType="selectType" @change="changeSelectStaffOrPost" :selectOptList="selectOptList"/>
    </div>
    <div>
      <!-- 选资产 -->
      <associateAssetModal ref="associateAssetModal" organId="" queryType="1" :judgeInstitutions="false" @assetChange="assetChange"></associateAssetModal>
    </div>
  </div>
</template>

<script>
import {utils} from '@/utils/utils.js'
import selectStaffOrPost from '@/views/common/selectStaffOrPost'
import FormFooter from '@/components/FormFooter'
import associateAssetModal from '../../financialManagement/assetEntry/associateAssetModal'
import moment from 'moment'
const columns = [
  {
    title: "编号",
    dataIndex: "indexKey",
    width: '10%'
  }, {
    title: "盘点单名称",
    dataIndex: "checkName",
    scopedSlots: { customRender: "checkName" },
    width: '15%'
  }, {
    title: "盘点人",
    dataIndex: "chargePerson",
    scopedSlots: { customRender: "chargePerson" },
    width: '20%'
  }, {
    title: "开始时间",
    dataIndex: "beginDate",
    scopedSlots: { customRender: "beginDate" },
    width: '15%'
  }, {
    title: "结束时间",
    dataIndex: "endDate",
    scopedSlots: { customRender: "endDate" },
    width: '15%'
  }, {
    title: "资产总数",
    dataIndex: "checkCount",
    width: '10%'
  }, {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: '20%'
  }
]
export default {
  components: {selectStaffOrPost, FormFooter, associateAssetModal},
  props: {},
  data () {
    return {
      organId: '',
      taskId: '',
      cancelData: [],          // 取消还原数据
      inventoryAssetCount: 0,  // 资产总数
      type: '',                 // 判断是新增还是编辑
      assetIdIndex: '',         // 选择表格那个资产
      tabType: '',              // 判断是详情上面选人还是表格下面选人 详情：details  表格：tab
      chargePersonArrOpt: [],   // 详情上面选人每次存一份数据作为编辑给回去
      selectOptList: [],
      selectType: 'staff', // staff选人 post选岗位
      chargePersonOpt: [],     // 详情选人
      widthBox: 'width: 85%',
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
      },
      form: this.$form.createForm(this),
      allWidth: 'width: 214px',
      changeType: '',
      changeOrderId: '',
      particularsData: {},
      files: [],
      inventoryReportData: [],    // 盘点报告表格数据
      location: '',
      noPageTools: false,
      newCardData: {
        taskId: '',             // 任务id
        taskName: '',           // 任务名称
        planName: '',           // 计划名称
        defaultValue: [],       // 执行时间
        chargePerson: undefined,   // 负责人
        checkRange: ''          // 盘点范围
      },
      table: {
        columns: [...columns],
        dataSource: [],         // 资产列表表格数据
        loading: false,
        activeRowIndex: ''
      },
      checkedData: []
    }
  },
  computed: {
  },
  methods: {
    moment,
    // 盘点单列表开始时间监听
    chanheFn (val, index, str) {
      let beginDateNew = moment(this.form.getFieldValue('defaultValue')[0]).format('YYYY-MM-DD')
      let endDateNew = moment(this.form.getFieldValue('defaultValue')[1]).format('YYYY-MM-DD')
      let valDate = valDate = moment(val).format('YYYY-MM-DD')
      if (beginDateNew > valDate || valDate > endDateNew) {
        str === 'beginDate' ? this.table.dataSource[index].beginDate = this.form.getFieldValue('defaultValue')[0] : this.table.dataSource[index].endDate = this.form.getFieldValue('defaultValue')[1] 
        this.$message.info(`${str === 'beginDate' ? '开始' : '结束'}时间在执行时间范围内`)
      }
    },
    // 执行时间监听
    defaultValueFn (val) {
      let data = utils.deepClone(this.table.dataSource)
      let datas = utils.deepClone(this.table.dataSource)
      // 开始时间最小的
      data.sort((a, b) => {
        return new Date(a.beginDate).getTime() - new Date(b.beginDate).getTime()
      })
      // 结束时间最大的
      datas.sort((a, b) => {
        return new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      })
      let min = moment(val[0]).format('YYYY-MM-DD')
      let max = moment(val[1]).format('YYYY-MM-DD')
      let dataMin = moment(data[0].beginDate).format('YYYY-MM-DD')
      let dataMax = moment(datas[0].endDate).format('YYYY-MM-DD')
      console.log(min, max, dataMin, dataMax)
      // 执行时间必须在资产列表最小开始时间和最大开始时间外
      if (min > dataMin && max < dataMax) {
        this.$message.info('执行时间应为盘点单列表最小开始时间和最大结束日期范围外')
        this.$nextTick(() => {
          this.form.setFieldsValue({
            defaultValue: [data[0].beginDate, datas[0].endDate]
          })
        })
      }
    },
    // 提交详情
    save (str) {
      this.form.validateFields((err, values) => {
        if (!err) {
          let tableArr = this.table.dataSource
          for (let i = 0; i < tableArr.length; i++) {
            if (!tableArr[i].IsEdit) {
              this.$message.info('请先保存盘点表列表')
              return
            }
          }
          let obj = {
            taskStatus: '3',             // 进行中
            taskId: this.taskId,         // 主键
            taskName: values.taskName,                // 任务名称
            chargePersonId: values.chargePerson,          // 负责人ID 多个逗号隔开
            beginDate: values.defaultValue[0].format('YYYY-MM-DD'),               // 开始时间
            endDate: values.defaultValue[1].format('YYYY-MM-DD'),                 // 结束时间
            remark: values.remark                   // 备注
          }
          let loadingName = this.SG_Loding('保存中...')
          this.$api.inventoryManagementApi.updateCheckTask(obj).then(res => {
            if (Number(res.data.code) === 0) {
              this.DE_Loding(loadingName).then(() => {
                this.$SG_Message.success('提交成功')
                this.$router.push({path: '/inventoryManagement/countingTask', query: {refresh: true}})
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
    // 取消
    cancel () {
      this.$router.push({path: '/inventoryManagement/countingTask'})
    },
    // 操作
    operationFn (record, str, index) {
      // 删除
      if (str === 'delete') {
        this.deleteFn(record, index)
      }
      // 取消
      if (str === 'cancel') {
        // console.log(this.table.dataSource[index])
        // console.log(this.cancelData[index])
        this.table.dataSource[index].IsEdit = this.cancelData[index].IsEdit
        this.table.dataSource[index].assetId = this.cancelData[index].assetId
        this.table.dataSource[index].beginDate = this.cancelData[index].beginDate
        this.table.dataSource[index].endDate = this.cancelData[index].endDate
        this.table.dataSource[index].chargePerson = this.cancelData[index].chargePerson
        this.table.dataSource[index].chargePersonArr = this.cancelData[index].chargePersonArr
        this.table.dataSource[index].chargePersonOpt = this.cancelData[index].chargePersonOpt
        this.table.dataSource[index].checkCount = this.cancelData[index].checkCount
        this.table.dataSource[index].checkName = this.cancelData[index].checkName
        this.table.dataSource[index].userIds = this.cancelData[index].userIds
        this.table.dataSource[index].userNames = this.cancelData[index].userNames
        this.table.dataSource[index].IsEdit = true
      }
      // 编辑
      if (str === 'edit') {
        this.table.dataSource[index].IsEdit = false
      }
      // 保存
      if (str === 'set') {
        if (!record.checkName) {
          this.$message.info('请输入盘点单名称')
          return
        }
        if (!record.chargePerson) {
          this.$message.info('请选择负责人')
          return
        }
        if (!record.beginDate) {
          this.$message.info('请选择开始时间')
          return
        }
        if (!record.endDate) {
          this.$message.info('请选择结束时间')
          return
        }
        if (record.beginDate > record.endDate) {
          this.$message.info('结束时间不能大于开始时间')
          return
        }
        if (record.assetId.length === 0 && !record.checkId) {
          this.$message.info('请选择资产明细')
          return
        }
        let obj = {
          taskId: this.taskId,
          checkId: record.checkId,                // 盘点单ID
          checkName: record.checkName,            // 盘点单名称
          organId: this.organId,                // 组织机构ID
          chargePersonId: record.chargePerson,    // 负责人 多个逗号隔开
          beginDate: moment(record.beginDate).format('YYYY-MM-DD'),            // 开始时间
          endDate:moment(record.endDate).format('YYYY-MM-DD'),                // 结束时间
          assetId: record.assetId.length > 0 ? record.assetId.join(',') : ''               // 资产ID 多个逗号隔开
        }
        let loadingName = this.SG_Loding('保存中...')
        this.$api.inventoryManagementApi.updateCheckInst(obj).then(res => {
          if (Number(res.data.code) === 0) {
            // console.log(this.table.dataSource, index)
            this.DE_Loding(loadingName).then(() => {
              this.$SG_Message.success('提交成功')
              this.table.dataSource[index].checkId = res.data.data
              this.table.dataSource[index].checkCount = record.assetId.length
              this.table.dataSource[index].IsEdit = true
              this.inventoryAssetCountFn()   // 计算资产总和
              this.cancelData = utils.deepClone(this.table.dataSource)           // 用于取消回显
            })
          } else {
            this.DE_Loding(loadingName).then(() => {
              this.$message.error(res.data.message)
            })
          }
        })
      }
      // 资产明细
      if (str === 'particulars') {
        // console.log(record, index, '拿到的数据')
        this.assetIdIndex = index
        this.$refs.associateAssetModal.show = true
        // 资产为空且盘点单不为空时调取接口数据 反之 直接拿数组的数据
        if (record.checkId) {
            let obj = {
              checkId: record.checkId
            }
            this.$api.inventoryManagementApi.queryAssetByChcekId(obj).then(res => {
              if (Number(res.data.code) === 0) {
                let data = res.data.data || []
                let arr = []
                data.forEach((item, index) => {
                  key: index
                  arr.push(item.assetId)
                })
                this.$refs.associateAssetModal.redactCheckedDataFn(arr, '', data)
              } else {
                this.$message.error(res.data.message)
              }
            })
        } else {
          this.$refs.associateAssetModal.redactCheckedDataFn(record.assetId, '', record.rowsData)
        }
      }
    },
    deleteFn (record, index) {
      let _this = this
      this.$confirm({
        title: '提示',
        content: '确认要删除该盘点单吗？',
        onOk() {
          if (record.checkId) {
            // 有盘点id
            let obj = {
              checkId: record.checkId
            }
            let loadingName = _this.SG_Loding('删除中...')
            _this.$api.inventoryManagementApi.deleteCheckInst(obj).then(res => {
              if (Number(res.data.code) === 0) {
                _this.DE_Loding(loadingName).then(() => {
                  _this.$SG_Message.success('删除成功')
                  _this.table.dataSource.splice(index, 1)
                  _this.inventoryAssetCountFn()   // 计算资产总和
                })
              } else {
                _this.$message.error(res.data.message)
              }
            })
          } else {
            // 没有盘点id
            _this.table.dataSource.splice(index, 1)
          }
          _this.cancelData = utils.deepClone(_this.table.dataSource)           // 用于取消回显
        }
      })
    },
    // 详情选人
    selectPerson () {
      this.tabType = 'details'
      this.$refs.selectStaffOrPost.visible = true
      // 编辑给回去的数据
      // console.log(this.chargePersonArrOpt, '给回去的')
      this.selectOptList = this.chargePersonArrOpt
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
    // 监听选人弹窗改变事件
    changeSelectStaffOrPost (selectOptList = []) {
      let opt = selectOptList.map(item => {
        return {...item, key: item.userId, label: item.name}
      })
      let row = this.table.dataSource[this.table.activeRowIndex]
      let obj = opt.reduce((pre, next) => {
         pre.label = pre.label + (pre.label ?',' : '') + next.label
         pre.key = pre.key + (pre.key ?',' : '') + next.key
         return pre
      }, {label: '', key: ''})
      // 详情的
      if (this.tabType === 'details') {
        this.chargePersonOpt = [obj]        // 下拉框的数据
        this.$nextTick(() => {
          this.form.setFieldsValue({
            chargePerson: obj.key
          })
        })                                  // 表单插入的数据
        this.chargePersonArrOpt = opt       // 编辑给回去的数据 
      }
      // 表格的
      if (this.tabType === 'tab') {
        this.$set(row, 'chargePerson', obj.key)
        this.$set(row, 'userNames', obj.label)
        this.$set(row, 'chargePersonArr', opt)
        this.$set(row, 'chargePersonOpt', [obj])
      }
    },
    // 查询详情
    query () {
      let obj = {
        taskId: this.taskId
      }
      this.$api.inventoryManagementApi.queryCheckTaskDetail(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.organId = data.organId
          let labelData = []
          let keyData = []
          // 获取名称
          if (data.chargePersonList.length > 0) {
            data.chargePersonList.forEach(item => {
              item.name = item.userName
              item.label = item.userName
              item.key = item.userId
              item.id = item.userId
              labelData.push(item.userName)
              keyData.push(item.userId)
            })
          }
          // 编辑回填
          this.chargePersonOpt = [{label: labelData.length > 0 ? labelData.join(',') : '', key: keyData.length > 0 ? keyData.join(',') : ''}]
          this.chargePersonArrOpt = data.chargePersonList
          // 信息回填
          this.form.setFieldsValue({
            taskId: this.taskId,
            taskName: data.taskName,
            planName: data.planName,
            chargePerson: keyData.length > 0 ? keyData.join(',') : '',
            checkRange: data.checkRange,
            remark: this.type === 'set' ? '' : data.remark,
            defaultValue: [moment(data.beginDate), moment(data.endDate)]
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 盘点单列表
    queryListByTaskIdFn () {
      this.table.loading = true
      let obj = {
        taskId: this.taskId
      }
      this.$api.inventoryManagementApi.queryListByTaskId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          data.forEach((item, index) => {
            item.IsEdit = true
            item.key = index
            item.indexKey = index + 1
            item.beginDate = moment(item.beginDate, 'YYYY-MM-DD')
            item.endDate = moment(item.endDate, 'YYYY-MM-DD')
            item.chargePerson = item.userIds,
            item.chargePersonOpt = [{label: item.userNames, key: item.userIds}]
            item.assetId = item.assetId ? item.assetId.split(',') : ''
            this.inventoryAssetCount = this.inventoryAssetCount + Number(item.checkCount)               // 资产总数
            let chargePersonArrData = []
            // 遍历回去负责人
            if (item.userIds) {
              let ctr = item.userNames.split(',')
              let ctl = item.userIds.split(',')
              ctr.forEach((items, index) => {
                ctl.forEach((list, indexs) => {
                  if (index === indexs) {
                    chargePersonArrData.push({
                      name: items,
                      userId: list,
                      key: list,
                      id: list,
                      label: list
                    })
                  }
                })
              })
            }
            item.chargePersonArr = chargePersonArrData
          })
          this.table.dataSource = data
          this.cancelData = utils.deepClone(this.table.dataSource)           // 用于取消回显
          this.table.loading = false
        } else {
          this.$message.error(res.data.message)
          this.table.loading = false
        }
      })
    },
    // 表格选人
    tabSelectPerson (record, index) {
      this.tabType = 'tab'
      // console.log('进入单项=>', record)
      this.table.activeRowIndex = index
      this.$refs.selectStaffOrPost.visible = true
      this.selectOptList = this.table.dataSource[index]['chargePersonArr']
    },
    // 新建盘点单
    newMortgageInformation () {
      let beginDateNew = this.form.getFieldValue('defaultValue')[0] || undefined
      let endDateNew = this.form.getFieldValue('defaultValue')[1] || undefined
      let atr = [{ checkId: '', checkName: '', chargePerson: undefined, IsEdit: false, beginDate: beginDateNew, endDate: endDateNew, checkCount: '', chargePersonArr: [], rowsData: [], assetId: []}]
      let arr = [...this.table.dataSource, ...atr]
      // console.log(arr)
      arr.forEach((item, index) => {
        item.key = index
        item.indexKey = index + 1
      })
      this.table.dataSource = arr
      this.cancelData = utils.deepClone(this.table.dataSource)           // 用于取消回显
    },
    // 资产选择变动
    assetChange (checkedData, checkedNames, rowsData, extraData) {
      this.table.dataSource[this.assetIdIndex].assetId = checkedData  // 选择的id
      this.table.dataSource[this.assetIdIndex].rowsData = rowsData  // 选的总的
      this.table.dataSource[this.assetIdIndex].checkCount = checkedData.length
      this.$refs.associateAssetModal.show = false
    },
    // 计算资产总数
    inventoryAssetCountFn () {
      let num = 0
      this.table.dataSource.forEach(item => {
        if (item.checkId) {
          num = num + Number(item.checkCount)
        }
      })
      this.inventoryAssetCount = num
    }
  },
  created () {
  },
  mounted () {
    this.particularsData = JSON.parse(this.$route.query.quersData)
    this.taskId = this.particularsData[0].taskId
    this.type = this.particularsData[0].type
    this.query()
    this.queryListByTaskIdFn()
  }
}
</script>
<style lang="less" scoped>
.newEditor {
  padding-bottom: 70px;
  .newEditor-nav{
      padding: 42px 126px 20px 70px;
      .newEditor-obj {
        padding: 20px 0 20px 40px;
        .playground-row {
          .playground-col {
            line-height: 40px;
            font-size: 12px;
          }
        }
      }
      .correspondingTask {
        margin:35px 40px 0 40px;
        border: 1px solid #F0F2F5;
      }
  }
  .nav-box {
    padding-bottom: 100px;
  }
  .file {
    margin: 20px 0 0 40px;
  }
  .add-information {
    cursor: pointer;
    line-height: 32px;
    text-align: center;
    border:1px dashed #EBF2FF;
    margin-top: 10px;
    .item-tab-icon {
      padding-right: 4px;
    }
  }
  .add-information:hover {
    border:1px dashed #0084FF;
    color: #0084FF;
  }
}
</style>
