<!--
 * @Date: 2019-12-23 10:15:35
 * @Description: 新增 编辑 盘点计划
 -->
<template>
<a-spin :spinning="spinning">
  <div class="inventoryPlan-create">
    <!-- 表单部分 -->
    <a-form :form="form">
      <div class="edit-box">
        <div>
          <SG-Title noMargin title="基本信息" />
        </div>
        <div class="edit-box-content">
          <div class="edit-box-content-item">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                所属组织机构
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-input
                v-if="editable"
                :disabled="true"
                :style="allStyle"
                v-decorator="[
                  'organName',
                  {
                    initialValue: organName
                  }
                ]"
              />
              <span class="label-value" v-else>{{organName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="[editable&&'required']">
              <span class="label-name label-space-between">
                计划名称
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-input
                v-if="editable"
                placeholder="请输入计划名称"
                :style="allStyle"
                :maxLength="30"
                v-decorator="[
                  'planName',
                  {
                    rules: [
                      {
                        required: true,
                        max: 30,
                        whitespace: true,
                        message: '请输入计划名称(不超过30字符)'
                      }
                    ],
                    initialValue: ''
                  }
                ]"
              />
              <span class="label-value" v-else>{{detail.planName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="[editable&&'required']">
              <span class="label-name label-space-between">
                实施频次
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-select
                v-if="editable"
                showSearch
                placeholder="请选择实施频次"
                @change="exePreSelectChange"
                v-decorator="[
                  'exePre',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择实施频次'
                      }
                    ],
                    initialValue: undefined
                  }
                ]"
                optionFilterProp="children"
                :style="allStyle"
                :options="exePreOpt"
                notFoundContent="没有查询到数据"
              />
              <span class="label-value" v-else>{{detail.exePreName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="[editable&&'required']">
              <span class="label-name label-space-between">
                计划生效时间
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-date-picker
              v-if="editable"
                :style="allStyle"
                format="YYYY-MM-DD"
                :disabledDate="disabledStartDate"
                @change="effDateChange"
                v-decorator="[
                  'effDate',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择生效时间'
                      }
                    ],
                    initialValue: null
                  }
                ]"
              />
              <span class="label-value" v-else>{{detail.effDate || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="[editable&&'required']">
              <span class="label-name label-space-between">
                计划失效时间
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-date-picker
                v-if="editable"
                :style="allStyle"
                format="YYYY-MM-DD"
                @change="expDateChange"
                :disabledDate="disabledEndDate"
                v-decorator="[
                  'expDate',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择失效时间'
                      }
                    ],
                    initialValue: null
                  }
                ]"
              />
              <span class="label-value" v-else>{{detail.expDate || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-if="showBeginMonth">
            <div class="label-name-box" :class="[editable&&'required']">
              <span class="label-name label-space-between">
                任务开始时间
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-select
               v-if="editable"
                showSearch
                placeholder="月"
                v-decorator="[
                  'beginMonth',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请选择任务开始时间'
                      }
                    ],
                    initialValue: undefined
                  }
                ]"
                optionFilterProp="children"
                :style="{ width: '120px', marginRight: '10px' }"
                class="mr10"
                :options="beginMonthOpt"
                notFoundContent="没有查询到数据"
              />
              <a-select
              v-if="editable"
                showSearch
                placeholder="日"
                v-decorator="[
                  'beginDay',
                  {
                    rules: [
                      {
                        required: true
                      }
                    ],
                    initialValue: '1'
                  }
                ]"
                optionFilterProp="children"
                :style="{ width: '70px'}"
                :options="beginDayOpt"
                notFoundContent="没有查询到数据"
              />
              <span class="label-value" v-else>{{detail.beginMonthbeginDay || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-if="!editable">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                创建人
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <span class="label-value">{{detail.createByName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-if="!editable">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                创建时间
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <span class="label-value">{{detail.createTime || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-if="!editable">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                计划状态
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <span class="label-value">{{detail.planStatusName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="[editable&&'required']">
              <span class="label-name label-space-between">
                提前生成任务时间
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-input-number
              v-if="editable"
               :max="99"
               :min="0"
                :style="oneInputStyle"
                placeholder="数值"
                v-decorator="[
                  'preNum',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入提前生成任务时间'
                      }
                    ],
                    initialValue: '3'
                  }
                ]"
              />
              <a-select
                v-if="editable"
                showSearch
                placeholder="单位"
                v-decorator="[
                  'preUnit',
                  {
                    rules: [
                      {
                        required: true,
                        message: '请输入提前生成任务时间'
                      }
                    ],
                    initialValue: '1'
                  }
                ]"
                optionFilterProp="children"
                :style="twoInputStyle"
                :options="preUnitOpt"
                notFoundContent="没有查询到数据"
              />
              <span class="label-value" v-else>{{detail.preNumpreUnit || '--'}}</span>
            </a-form-item>
          </div>
          
          <div class="edit-box-content-item total-width">
            <div class="label-name-box">
              <span class="label-name label-space-between">备注<i></i></span
              ><span>：</span>
            </div>
            <a-form-item class="label-value">
              <a-textarea
                v-if="editable"
                placeholder="请输入备注（最多200字）"
                :rows="3"
                :maxLength="200"
                v-decorator="['remark', { initialValue: '' }]"
              ></a-textarea>
              <span class="label-value" v-else>{{detail.remark || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box">
              <span class="label-name label-space-between">附件<i></i></span
              ><span>：</span>
            </div>
            <a-form-item class="label-value">
              <SG-UploadFile :show="!editable" type="all" :maxSize="5120" v-model="filepaths" />
            </a-form-item>
          </div>
        </div>
      </div>
    </a-form>
    <!-- 表格部分 -->
    <div class="mb30 mt30"><SG-Title noMargin title="计划明细" /></div>
    <div class="table-layout-fixed detail-table ml40">
      <a-table
        class="custom-table td-pd10"
        :loading="table.loading"
        :pagination="false"
        :columns="table.columns"
        :dataSource="table.dataSource"
      >
        <template slot="taskName" slot-scope="text, record">
          <div v-if="editable">
            <a-input placeholder="请输入任务名称" :maxLength="30" v-model="record.taskName" />
          </div>
          <span v-else>{{ record.taskName }}</span>
        </template>
        <template slot="checkRange" slot-scope="text, record">
          <div v-if="editable">
            <a-input placeholder="请输入范围描述" :maxLength="100" v-model="record.checkRange" />
          </div>
          <span v-else>{{ record.checkRange }}</span>
        </template>
        <template slot="chargePersonNameList" slot-scope="text, record, index">
          <div v-if="editable">
            <a-select
                placeholder="请选择负责人"
                :open="false"
                :style="{width: '100%'}"
                :options="record.chargePersonOpt"
                @dropdownVisibleChange="selectPerson(record,index)"
                v-model="record.chargePerson"
              >
                <div slot="dropdownRender" slot-scope="menu"></div>
                <a-icon slot="suffixIcon" type="plus-circle" />
              </a-select>
          </div>
          <span v-else>{{
            record.chargePersonNameList
          }}</span>
        </template>
        <template slot="deadline" slot-scope="text, record">
          <div v-if="editable">
            <a-input-number :min="1" :style="{width: '100%'}" :precision="0" placeholder="请输入任务期限" :max="99"  v-model="record.deadline" />
          </div>
          <span v-else>{{ record.deadline }}</span>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <span class="btn-delete" @click="deleteTableLine(record, index)"
            >删除</span
          >
        </template>
      </a-table>
    </div>
    <div class="mt15 tc ml40" v-if="editable">
      <a-button icon="plus" type="dashed" block @click="pushTableLine"
        >新建</a-button
      >
    </div>
    <!-- 执行记录 -->
    <div v-if="['detail'].includes(pageType)">
      <div class="mb30 mt30"><SG-Title noMargin title="执行记录" /></div>
      <div class="ml40"><implementTable ref="implementTable"/></div>
    </div>
    <!-- 审批轨迹 -->
    <div v-if="['detail', 'approval'].includes(pageType)">
      <div class="mb30 mt30"><SG-Title noMargin title="审批轨迹" /></div>
    </div>
    <!--审批意见-->
    <div v-if="['approval'].includes(pageType)">
      <div class="mb30 mt30"><SG-Title noMargin title="审批意见" /></div>
      <div class="ml40">
        <a-textarea placeholder="请输入审批意见"></a-textarea>
      </div>
    </div>
    <FormFooter
      v-if="['create', 'edit'].includes(pageType)"
      style="border:none;"
      location="fixed"
    >
      <SG-Button class="mr2" @click="handleSaveApp('0')" type="primary"
        >保存草稿</SG-Button
      >
      <SG-Button @click="handleSaveApp('1')">提交审批</SG-Button>
    </FormFooter>
    <FormFooter
      v-if="['approval'].includes(pageType)"
      style="border:none;"
      location="fixed"
    >
      <SG-Button class="mr2" @click="handleAdopt('1')" type="primary"
        >审批通过</SG-Button
      >
      <SG-Button type="danger" @click="handleAdopt('3')">驳回</SG-Button>
    </FormFooter>
    <div>
       <selectStaffOrPost ref="selectStaffOrPost" :selectType="selectType" @change="changeSelectStaffOrPost" :selectOptList="selectOptList"/>
    </div>
  </div>
 </a-spin> 
</template>
<script>
import moment from "moment"
import implementTable from "./child/implementTable.vue"
import FormFooter from "@/components/FormFooter.vue"
import selectStaffOrPost from '@/views/common/selectStaffOrPost'
import {utils} from '@/utils/utils'
let getUuid = ((uuid = 1) => () => ++uuid)()
const allStyle = { width: "200px" }
const oneInputStyle = { width: "95px", marginRight: "10px" }
const twoInputStyle = { width: "95px" }
const operationTypes = {
  detail: "/inventoryPlan/detail",
  create: "/inventoryPlan/create",
  edit: "/inventoryPlan/edit"
}
let exePreOptTest = [
  {label: '单次', key: '1'},
  {label: '每月', key: '2'},
  {label: '每季度', key: '3'},
  {label: '每半年', key: '4'},
  {label: '每年', key: '5'},
]
let preUnitOpt = [
  {label: '天', key: '1'},
  {label: '时', key: '2'}
]
// 每月
let oneMonth = [
  {label: '每月', key: '1'},
]
// 每季度
let oneQuarter = [
  {label: '每季度第1个月', key: '1'},
  {label: '每季度第2个月', key: '2'},
  {label: '每季度第3个月', key: '3'},
]
// 每半年
let halfYear = [
  {label: '每半年第1个月', key: '1'},
  {label: '每半年第2个月', key: '2'},
  {label: '每半年第3个月', key: '3'},
  {label: '每半年第4个月', key: '4'},
  {label: '每半年第5个月', key: '5'},
  {label: '每半年第6个月', key: '6'},
]
// 每年
let oneHasYear = [
  {label: '每年第1个月', key: '1'},
  {label: '每年第2个月', key: '2'},
  {label: '每年第3个月', key: '3'},
  {label: '每年第4个月', key: '4'},
  {label: '每年第5个月', key: '5'},
  {label: '每年第6个月', key: '6'},
  {label: '每年第7个月', key: '7'},
  {label: '每年第8个月', key: '8'},
  {label: '每年第9个月', key: '9'},
  {label: '每年第10个月', key: '10'},
  {label: '每年第11个月', key: '11'},
  {label: '每年第12个月', key: '12'},
]
// 表格数据
const columns = [
  {
    title: "编号",
    dataIndex: "order",
    width: "7%"
  },
  {
    title: "盘点任务名称",
    dataIndex: "taskName",
    scopedSlots: { customRender: "taskName" },
    width: "15%"
  },
  {
    title: "盘点范围描述",
    dataIndex: "checkRange",
    scopedSlots: { customRender: "checkRange" },
    width: "20%"
  },
  {
    title: "盘点负责人",
    dataIndex: "chargePersonNameList",
    scopedSlots: { customRender: "chargePersonNameList" },
    width: "30%"
  },
  {
    title: "任务期限(天)",
    dataIndex: "deadline",
    scopedSlots: { customRender: "deadline" },
    width: "20%"
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: "8%"
  }
]
// 'beginMonth', 'beginDay'
let fileds = ['planName', 'exePre', 'preNum', 'preUnit', 'remark']
export default {
  components: {
    implementTable,
    FormFooter,
    selectStaffOrPost
  },
  data() {
    return {
      spinning: false,
      allStyle,
      oneInputStyle,
      twoInputStyle,
      selectType: 'staff', // staff选人 post选岗位
      selectOptList: [],
      organIdopt: [],
      exePreOpt: [],
      filepaths: [],
      beginDayOpt: Array.from({length:31}).map((v,i) => ({label: `${i+1}日`, value: `${i+1}`, key: `${i+1}`})),
      beginMonthOpt: [],
      oneMonth,
      oneQuarter,
      preUnitOpt,
      halfYear,
      oneHasYear,
      form: this.$form.createForm(this),
      table: {
        columns: utils.deepClone(columns),
        dataSource: [],
        loading: false,
        totalCount: 0,
        activeRowIndex: ''
      },
      pageType: "",
      organId: '',
      organName: '',
      planId: '',
      approvalStatusName: '',
      startTimeValue: '',
      endTimeValue: '',
      showBeginMonth: true,
      editable: true,
      detail: {}
    }
  },
  watch: {
    '$route' () {
      if (this.$route.path === '/inventoryPlan/detail' && this.$route.query.refresh) {
        this.init()
        this.$refs.implementTable.init()
      }
    }
  },
  created() {
    this.init()
  },
  methods: {
    init () {
      this.pageType = this.$route.query.type || ""
      this.organId = this.$route.query.organId || ''
      this.organName = this.$route.query.organName || ''
      this.planId = this.$route.query.planId || ''
      this.approvalStatusName = this.$route.query.approvalStatusName || ''
      if (!['create', 'edit'].includes(this.pageType)) {
        this.editable = false
      }
      if (this.pageType === "create") {
        this.pushTableLine()
        this.platformDictFn('AMS_EXE_PRE')
      }
      if (this.pageType === 'edit') {
        this.platformDictFn('AMS_EXE_PRE')
        this.inventoryDetail()
      }
      if (this.pageType === 'detail') {
        this.popTableColumn()
        this.inventoryDetail()
      }
      if (this.pageType === 'approval') {
        this.popTableColumn()
        this.inventoryDetail()
      }
    },
    // 获取详情
    inventoryDetail () {
      this.spinning = true
      this.$api.building.inventoryDetail({planId: this.planId}).then(res => {
       if (res.data.code === '0') {
         this.setFormData(res.data.data)
       } else {
         this.$message.error(res.data.message)
       }
      }).finally(() => {
        this.spinning = false
      })
    },
    // 填入表格数据
    setFormData (obj) {
      let o = {}
      // 处理时间
      o.effDate = moment(obj.effDate, 'YYYY-MM-DD')
      o.expDate = moment(obj.expDate, 'YYYY-MM-DD')
      // 遍历字段
      fileds.forEach(item => {
        o[item] = obj[item]
      })
      // 处理任务开始时间显示
      this.exePreSelectChange(obj.exePre)
      if (obj.exePre !== '1') {
        o.beginMonth = obj.beginMonth
        o.beginDay = obj.beginDay
      }
      // 处理表格数据
      this.table.dataSource = []
      if (obj.taskTempList && obj.taskTempList.length) {
        obj.taskTempList.forEach(item => {
          let chargePersonNameList = item.chargePersonList.map(v => v.userName).join(',')
          let chargePerson = item.chargePersonList.map(v => v.userId).join(',')
          let o = {
            // ...item,
            planId: item.planId,
            key: getUuid(),
            order: this.table.dataSource.length + 1,
            taskName: item.taskName,
            checkRange: item.checkRange,
            chargePersonNameList,
            deadline: item.deadline,
            operation: "",
            chargePerson,
            chargePersonOpt: [{label: chargePersonNameList, key: chargePerson}],
            chargePersonArr: item.chargePersonList.map(v => {
              return {...v, label: v.userName, key: v.userId, id: v.userId, name: v.userName}
            }) 
          }
          console.log('ssssss', o)
          this.table.dataSource.push(o)
        })
      }
      // 处理附件
      if (obj.attachmentList && obj.attachmentList.length) {
        this.filepaths = obj.attachmentList.map(item => {
          return {url: item.attachmentPath, name: item.oldAttachmentName}
        })
      } else {
        this.filepaths = []
      }
      if (this.pageType === 'edit') {
        this.form.setFieldsValue(o)
      } else {
       let beginMonthName = this.beginMonthOpt.filter(v => {
         return v.key === obj.beginMonth
       })[0]
       beginMonthName = beginMonthName ? beginMonthName.label : ''
       let beginDayName = this.beginDayOpt.filter(v => {
         return v.key === obj.beginDay
       })[0]
       beginDayName = beginDayName ? beginDayName.label : ''
       this.detail = obj
       this.detail.beginMonthbeginDay = beginMonthName + beginDayName
       this.detail.preNumpreUnit = obj.preNum + (obj.preUnit === '1' ? '天' : '时')
       this.detail.planStatusName = this.approvalStatusName
      }
    },
    // 去除表格操作列
    popTableColumn () {
      let arr = []
      arr = utils.deepClone(columns)
      arr.pop()
      this.table.columns = arr
    },
    // 在表格压入一条数据
    pushTableLine() {
      let o = {
        key: getUuid(),
        order: this.table.dataSource.length + 1,
        taskName: "",
        checkRange: "",
        chargePersonNameList: "",
        deadline: "7",
        operation: "",
        chargePerson: undefined,
        chargePersonOpt: [],
        chargePersonArr: []
      }
      this.table.dataSource.push(o)
    },
    deleteTableLine(record, index) {
      console.log("删除", record, index)
      if (this.table.dataSource.length === 1) {
        this.$message.error("请至少保留一行数据!")
        return
      }
      this.$SG_Modal.confirm({
        title: `确认要删除吗？?`,
        okText: '确定',
        cancelText: '再想想',
        onOk: () => {
          this.table.dataSource.splice(index, 1)
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
      console.log('选择人物=>', selectOptList, opt, obj)
      this.$set(row, 'chargePerson', obj.key)
      this.$set(row, 'chargePersonArr', opt)
      this.$set(row, 'chargePersonOpt', [obj])
    },
    // 选人
    selectPerson (record, index) {
      console.log('进入单项=>', record)
      this.table.activeRowIndex = index
      this.$refs.selectStaffOrPost.visible = true
      this.selectOptList = this.table.dataSource[index]['chargePersonArr']
    },
    disabledStartDate(startTimeValue) {
      const endTimeValue = this.endTimeValue;
      if (!startTimeValue || !endTimeValue) {
        return false;
      }
      console.log('oooo', startTimeValue.valueOf())
      return startTimeValue.valueOf() > endTimeValue.valueOf();
    },
    disabledEndDate(endTimeValue) {
      const startTimeValue = this.startTimeValue;
      if (!endTimeValue || !startTimeValue) {
        return false;
      }
      return startTimeValue.valueOf() >= endTimeValue.valueOf();
    },
    // 生效时间改变
    effDateChange (date, str) {
      console.log('生效时间=>', date, str)
      this.startTimeValue = date
    },
    // 失效效时间改变
    expDateChange (date, str) {
      console.log('失效效时间改变=>', date, str)
      this.endTimeValue = date
    },
    range(start, end) {
      const result = [];
      for (let i = start; i < end; i++) {
        result.push(i);
      }
      return result;
    },
    validateFrom (values ) {
      // 验证表单数据
      if (values.effDate.valueOf > values.expDate.valueOf) {
        this.$message.error('提示-失效时间必须大于生效时间!')
        return false
      }
      // 验证表格数据
      let flag = true
      utils.each(this.table.dataSource, (item, i) => {
        if (!item.taskName) {
          this.$message.error(`请填写计划明细第${item.order}行，任务名称!`)
          flag = false
          return false
        }
        if (!item.checkRange) {
          this.$message.error(`请填写计划明细第${item.order}, 范围描述!`)
          flag = false
          return false
        }
        if (!item.chargePerson) {
          this.$message.error(`请选择计划明细第${item.order}, 负责人!`)
          flag = false
          return false
        }
        if (!item.deadline) {
          this.$message.error(`请填写计划明细第${item.order}, 任务期限!`)
          flag = false
          return false
        }
      })
      return flag
    },
    getSaveparam(values) {
      let data = {}
      let taskTempList = []
      // 处理时间
      utils.each(values, (value, key) => {
        if (['effDate', 'expDate'].includes(key)) {
          values[key] = values[key].format('YYYY-MM-DD')
        }
        if ([null, undefined].includes(values[key])) {
          values[key] = ''
        }
      })
      // 处理附件
      data = {...values}
      data.attachmentList = this.filepaths.map(item => {
        return {attachmentPath: item.url, oldAttachmentName: item.name}
      })
      // 拿到表格数据
      utils.each(this.table.dataSource, (item) => {
        let {taskName, checkRange, deadline, chargePerson, planId} = item
        taskTempList.push({taskName, checkRange, deadline, chargePersonId: chargePerson, planId: planId || ''})
      })
      data.taskTempList = taskTempList
      return data
    },
    // 保存草稿 提交审批
    handleSaveApp(approvalStatus) {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.validateFrom(values )) {
            return
          }
          let data = this.getSaveparam(values )
          data.organId = this.organId
          data.approvalStatus = approvalStatus
          // 如果不是新增
          if (this.pageType !== 'create') {
            data.planId = this.planId
          }
          let msg = `${approvalStatus === '0' ? '保存草稿' : '提交审批'}`
          let loadingName = this.SG_Loding(msg + '中...')
          let Api = this.pageType === 'create' ? 'createInventoryPlan' : 'editInventoryPlan'
          this.$api.building[Api](data).then(res => {
            this.DE_Loding(loadingName).then(() => {
                if (res.data.code === '0') {
                  this.$SG_Message.success(msg + '成功!')
                  this.$router.push({ path: '/inventoryPlan', query: {refresh: true} });
                } else {
                  this.$message.error(res.data.message)
                }
              })
          }).catch(() => {
            this.DE_Loding(loadingName).then(res => {
              this.$SG_Message.error(msg + '失败！')
            })
          })
        }
      })
    },
    // 审批通过与驳回
    handleAdopt (approvalStatus) {
      let label = approvalStatus === '1' ? '通过' : '驳回'
      let loadingName = this.SG_Loding(label + '中...')
      this.$api.building.updateCheckPlanStatus({approvalStatus, planId: this.planId}).then(res => {
        this.DE_Loding(loadingName).then(() => {
          if (res.data.code === '0') {
            this.$SG_Message.success(label + '成功!')
            this.$router.push({ path: '/inventoryPlan', query: {refresh: true} });
          } else {
            this.$message.error(res.data.message)
          }
        })
      }).catch(() => {
        this.DE_Loding(loadingName).then(res => {
          this.$SG_Message.error(label + '失败！')
        })
      })
    },
    // 频次变化 () 
    exePreSelectChange (e) {
      console.log('2222222', e)
      this.showBeginMonth = e === '1'? false : true
      switch (e){
        case '1':
          this.beginMonthOpt = []
          break;
        case '2':
          this.beginMonthOpt = oneMonth
          break;
        case '3':
          this.beginMonthOpt = oneQuarter
          break;
        case '4':
          this.beginMonthOpt = halfYear
          break;
        case '5':
          this.beginMonthOpt = oneHasYear
          break;      
      }
    },
    // 取平台字典表
    platformDictFn (str) {
      // AMS_EXE_PRE 实施频次
      let obj = {
        code: str
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let result = data.map(item => {
            return {...item, label: item.name, key: item.value}
          })
          if (str === 'AMS_EXE_PRE') {
            this.exePreOpt = result
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.inventoryPlan-create {
  padding: 40px 100px 110px 95px;
  position: relative;
  .edit-box {
    text-align: left;
    color: #49505e;
    margin-bottom: 16px;
    .edit-box-content {
      padding: 30px 0px 0 40px;
      position: relative;
      display: inline-block;
      width: 100%;
      .edit-box-content-item {
        width: 33%;
        float: left;
        font-size: 12px;
        &.total-width {
          width: 100%;
          .label-value {
            float: left;
            width: calc(100% - 125px);
          }
        }
        .label-name-box {
          float: left;
          line-height: 39px;
          .label-name {
            height: 39px;
            font-family: PingFang-SC-Regular;
            color: #282d5b;
            margin-right: 3px;
            float: left;
            span {
              float: left;
            }
          }
          .label-space-between {
            width: 100px;
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
            content: "*";
            color: #f5222d;
            line-height: 36px;
            font-family: SimSun;
          }
        }
      }
    }
  }
}
.detail-table {
  position: relative;
  border-left: 1px solid rgba(238, 242, 245, 1);
  border-right: 1px solid rgba(238, 242, 245, 1);
}
.btn-delete {
  color: #f5222d;
  cursor: pointer;
}
.label-value{
}
</style>
