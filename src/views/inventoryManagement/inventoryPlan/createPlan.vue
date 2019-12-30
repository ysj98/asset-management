<!--
 * @Date: 2019-12-23 10:15:35
 * @Description: 新增 编辑 盘点计划
 -->
<template>
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
                :disabled="true"
                :style="allStyle"
                v-decorator="[
                  'organName',
                  {
                    initialValue: organName
                  }
                ]"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                计划名称
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-input
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
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                实施频次
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-select
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
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                计划生效时间
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-date-picker
                :style="allStyle"
                format="YYYY-MM-DD HH:mm:ss"
                :disabledDate="disabledStartDate"
                showTime
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
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                计划失效时间
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-date-picker
                :style="allStyle"
                format="YYYY-MM-DD HH:mm:ss"
                @change="expDateChange"
                :disabledDate="disabledEndDate"
                showTime
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
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-if="showBeginMonth">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                任务开始时间
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-select
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
                :style="oneInputStyle"
                class="mr10"
                :options="beginMonthOpt"
                notFoundContent="没有查询到数据"
              />
              <a-select
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
                    initialValue: undefined
                  }
                ]"
                optionFilterProp="children"
                :style="twoInputStyle"
                :options="beginDayOpt"
                notFoundContent="没有查询到数据"
              />
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                提前生成任务时间
                <i></i>
              </span>
              <span>：</span>
            </div>
            <a-form-item>
              <a-input-number
               :max="99"
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
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box">
              <span class="label-name label-space-between">备注<i></i></span
              ><span>：</span>
            </div>
            <a-form-item class="label-value">
              <a-textarea
                placeholder="请输入备注（最多200字）"
                :rows="3"
                :maxLength="200"
                v-decorator="['remark', { initialValue: '' }]"
              ></a-textarea>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box">
              <span class="label-name label-space-between">附件<i></i></span
              ><span>：</span>
            </div>
            <a-form-item class="label-value">
              <SG-UploadFile type="all" :maxSize="5120" v-model="filepaths" />
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
          <span v-if="pageType === 'detail'">{{ record.taskName }}</span>
          <div v-else>
            <a-input placeholder="请输入任务名称" :maxLength="200" v-model="record.taskName" />
          </div>
        </template>
        <template slot="checkRange" slot-scope="text, record">
          <span v-if="pageType === 'detail'">{{ record.checkRange }}</span>
          <div v-else>
            <a-input placeholder="请输入范围描述" :maxLength="200" v-model="record.checkRange" />
          </div>
        </template>
        <template slot="chargePersonList" slot-scope="text, record, index">
          <span v-if="pageType === 'detail'">{{
            record.chargePersonList
          }}</span>
          <div v-else>
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
        </template>
        <template slot="deadline" slot-scope="text, record">
          <span v-if="pageType === 'detail'">{{ record.deadline }}</span>
          <div v-else>
            <a-input-number :style="{width: '100%'}" placeholder="请输入任务期限" :maxLength="200" v-model="record.deadline" />
          </div>
        </template>
        <template slot="operation" slot-scope="text, record, index">
          <span class="btn-delete" @click="deleteTableLine(record, index)"
            >删除</span
          >
        </template>
      </a-table>
    </div>
    <div class="mt15 tc ml40">
      <a-button icon="plus" type="dashed" block @click="pushTableLine"
        >新建</a-button
      >
    </div>
    <!-- 执行记录 -->
    <div v-if="['detail'].includes(pageType)">
      <div class="mb30 mt30"><SG-Title noMargin title="执行记录" /></div>
      <div class="ml40"><implementTable /></div>
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
      <SG-Button class="mr2" @click="handleSaveDraft" type="primary"
        >保存草稿</SG-Button
      >
      <SG-Button @click="handleSaveApp">提交审批</SG-Button>
    </FormFooter>
    <FormFooter
      v-else
      style="border:none;"
      location="fixed"
    >
      <SG-Button class="mr2" @click="handleAdopt" type="primary"
        >审批通过</SG-Button
      >
      <SG-Button type="danger" @click="handleReject">驳回</SG-Button>
    </FormFooter>
    <div>
       <selectStaffOrPost ref="selectStaffOrPost" :selectType="selectType" @change="changeSelectStaffOrPost" :selectOptList="selectOptList"/>
    </div>
  </div>
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
  {label: '单次', key: 'cccc1'},
  {label: '每月', key: 'cccc2'},
  {label: '每季度', key: 'cccc3'},
  {label: '每半年', key: 'cccc4'},
  {label: '每年', key: 'cccc5'},
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
let columns = [
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
    dataIndex: "chargePersonList",
    scopedSlots: { customRender: "chargePersonList" },
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

export default {
  components: {
    implementTable,
    FormFooter,
    selectStaffOrPost
  },
  data() {
    return {
      allStyle,
      oneInputStyle,
      twoInputStyle,
      selectType: 'staff', // staff选人 post选岗位
      selectOptList: [],
      organIdopt: [],
      exePreOpt: [],
      filepaths: [],
      beginDayOpt: [],
      beginMonthOpt: [],
      oneMonth,
      oneQuarter,
      preUnitOpt,
      halfYear,
      oneHasYear,
      form: this.$form.createForm(this),
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0,
        activeRowIndex: ''
      },
      pageType: "",
      organId: '',
      organName: '',
      startTimeValue: '',
      endTimeValue: '',
      showBeginMonth: true
    }
  },
  created() {
    this.pageType = this.$route.query.type || ""
    this.organId = this.$route.query.organId || ''
    this.organName = this.$route.query.organName || ''
    if (this.pageType === "create") {
      this.createInit()
    } else {
      this.popTableColumn()
    }
  },
  methods: {
    // 新建初始化
    createInit() {
      this.pushTableLine()
      this.platformDictFn('AMS_EXE_PRE')
    },
    // 编辑初始化
    editInit () {
    },
    // 去除表格操作列
    popTableColumn () {
      this.table.columns.pop()
    },
    // 在表格压入一条数据
    pushTableLine() {
      let o = {
        key: getUuid(),
        order: this.table.dataSource.length + 1,
        taskName: "",
        checkRange: "",
        chargePersonList: "",
        deadline: "",
        operation: "",
        chargePerson: '',
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
      this.table.dataSource.splice(index, 1)
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
    validateFrom () {
      if (values.effDate.valueOf > values.expDate.valueOf) {
        this.$message.error('提示-失效时间必须大于生效时间!')
        return false
      }
    },
    getSaveparam(values) {
      let data = {}
      // 处理时间
      utils.each(values, (value, key) => {
        if (['effDate', 'expDate'].includes(key)) {
          values[key] = values[key].format('YYYY-MM-DD HH:mm:ss')
        }
        if ([null, undefined].includes(values[key])) {
          values[key] = ''
        }
      })
      // 处理附件
      data = {...values}
      data.filepaths = this.filepaths.map(item => item.url).join(',')
      return data
    },
    // 保存草稿
    handleSaveDraft() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.validateFrom()) {
            return
          }
          let data = this.getSaveparam()
          data.approvalStatus = '0'
          console.log('获得参数草稿', data)
        }
      })
    },
    // 提交审批
    handleSaveApp() {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (!this.validateFrom()) {
            return
          }
          let data = this.getSaveparam()
          data.approvalStatus = '1'
          console.log('获得参数审批', data)
        }
      })
    },
    // 审批通过
    handleAdopt () {},
    // 驳回
    handleReject () {},
    // 频次变化 () 
    exePreSelectChange (e) {
      console.log('2222222', e)
      this.showBeginMonth = e === 'cccc1'? false : true
      switch (e){
        case 'cccc1':
          this.beginMonthOpt = []
          break;
        case 'cccc2':
          this.beginMonthOpt = oneMonth
          break;
        case 'cccc3':
          this.beginMonthOpt = oneQuarter
          break;
        case 'cccc4':
          this.beginMonthOpt = halfYear
          break;
        case 'cccc5':
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
          // 测试数据
          if (!result.length) {
            result = result.concat(exePreOptTest)
          }
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
          line-height: 34px;
          .label-name {
            height: 34px;
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
</style>
