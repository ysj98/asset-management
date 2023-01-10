<!--
  呈报表单新建
-->
<template>
  <div class="newPlan">
		<a-form :form="form" @submit="handleSubmit">
    <div class="newPlan-nav">
      <span class="section-title blue">基本信息</span>
      <div class="newPlan-obj">
        <a-row class="playground-row">
            <a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="计划名称：">
                <a-input placeholder="请输入计划名称"
                :style="allWidth"
                :max-Length="30"
                v-decorator="['planName', {rules: [{required: true, max: 30, whitespace: true, message: '请输入计划名称(不超过30字符)'}], initialValue: newCardData.planName}]"/>
              </a-form-item>
            </a-col>
						<a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="计划编号：">
                <a-input placeholder="请输入计划编号"
                :style="allWidth"
                :max-Length="30"
                v-decorator="['planCode', {rules: [{required: false, max: 30}], initialValue: newCardData.planCode}]"/>
              </a-form-item>
            </a-col>
						<a-col class="playground-col" :span="8">
							<a-form-item v-bind="formItemLayout" label="所属机构：">
								<a-select
									:disabled="true"
									showSearch
									:style="allWidth"
									placeholder="请选择所属机构"
									v-decorator="['organId',{
											rules: [{required: false, message: '请选择所属机构'}],
											initialValue: newCardData.organId
										}]"
									:allowClear="false"
									:filterOption="filterOption"
									notFoundContent="没有查询到所属机构"
									>
									<a-select-option
                    :title="item.name"
										v-for="(item) in organIdData"
										:key="item.value"
										:value='item.value'>
										{{item.name}}
									</a-select-option>
								</a-select>
							</a-form-item>
						</a-col>
						<a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="计划执行日期：">
                <SG-DatePicker :style="allWidth"  pickerType="RangePicker"
                :allowClear="false"
                 v-decorator="['defaultValue', {rules: [{type: 'array', required: true, whitespace: true, message: '请计划执行日期'}], initialValue: newCardData.defaultValue}]"
                 format="YYYY-MM-DD"></SG-DatePicker>
              </a-form-item>
            </a-col>
						<a-col class="playground-col" :span="24">
              <a-form-item v-bind="formItemTextarea" label="备注：">
                <a-textarea placeholder="请输入备注"
                  :style="widthBox"
                  :autoSize="{ minRows: 3, maxRows: 3 }"
                  :max-Length="200"
                  v-decorator="['remark',
                  {rules: [{required: false, max: 200, message: '请输入备注(不超过200字符)'}], initialValue: newCardData.remark}
                  ]"
                  />
              </a-form-item>
            </a-col>
						<a-col class="playground-col" :span="24">
              <a-form-item :colon="false" v-bind="formItemTextarea">
                <label slot="label">上传附件：</label>
                <UploadFile
                  v-model="newCardData.files"
                  type="all"
                />
              </a-form-item>
            </a-col>
        </a-row>
      </div>
    </div>
    <div class="newPlan-nav">
      <span class="section-title blue">呈报表单设置</span>
      <div class="newPlan-obj">
				<div class="form-choice">
					<div class="form-right">
						<a-select
										showSearch
										placeholder="请选择呈报表单"
										style="width: 200px"
										v-model="reportBillId"
										:options="$addTitle(reportBillData)"
										:filterOption="filterOption"
                    @change="reportBillChange"
									>
									</a-select>
						</div>
						</div>
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columns"
            :dataSource="dataSourceReportBill"
            class="custom-table td-pd10"
            :pagination="false"
            >
            <template v-for="(item, index) in columns" :slot="item.dataIndex" slot-scope="text, record, index">
              <div v-if="item.dataIndex === 'ieldNames'"></div>
              <a-checkbox v-else :disabled="record[item.dataIndex + 'disabled']" :checked="record[item.dataIndex]" @change="checkboxFn(record, index, item.dataIndex)"></a-checkbox>
            </template>
          </a-table>
          <no-data-tips v-show="dataSourceReportBill.length === 0"></no-data-tips>
        </div>
      </div>
    </div>
		<div class="newPlan-nav tab-mar">
      <span class="section-title blue">任务执行设置</span>
      <div class="newPlan-obj">
				<a-row class="playground-row">
					<a-col class="playground-col" :span="8">
						<a-form-item v-bind="formItemLayout" label="实施频次">
								<a-select showSearch placeholder="请选择实施频次"
                v-decorator="['exePre', { rules: [{required: true, message: '请选择实施频次'}], initialValue: newCardData.exePre}]"
                optionFilterProp="children"
								@change="exePreSelectChange"
                :style="allWidth"
                :options="$addTitle(exePreData)"
                notFoundContent="没有查询到数据"
              />
						</a-form-item>
					</a-col>
					<a-col class="playground-col" :span="8" v-if="showBeginMonth">
						<a-form-item v-bind="formItemLayout" label="任务开始时间">
              <a-select showSearch placeholder="月"
                v-if="showBeginDay"
								v-decorator="[ 'beginMonth',{ rules: [{required: true, message: '请选择任务开始时间'}], initialValue: undefined}]"
									optionFilterProp="children"
									:style="{ width: '120px', marginRight: '10px' }"
									class="mr10"
									:options="$addTitle(beginMonthOpt)"
									notFoundContent="没有查询到数据"
								/>
              <a-select showSearch placeholder="日"
                v-decorator="['beginDay',{rules: [{required: true}], initialValue: '1'}]"
                optionFilterProp="children"
                :style="{ width: '70px'}"
                :options="$addTitle(beginDayOpt)"
                notFoundContent="没有查询到数据"
              />
            </a-form-item>
					</a-col>
					<a-col class="playground-col" :span="8">
						<a-form-item v-bind="formItemLayout" label="任务执行期限">
              <a-input-number :max="99" :min="0" :precision="0" :style="{width: '95px', marginRight: '10px'}" placeholder="数值"
                v-decorator="[ 'deadline',{ rules: [{ required: true, message: '请输入任务执行期限'}], initialValue: deadline}]"
              />
              <a-select showSearch placeholder="单位"
                v-decorator="[ 'dayData',{ rules: [{required: true, message: '请输入任务执行期限'}], initialValue: dayData}]"
                optionFilterProp="children"
                :style="{width: '95px'}"
                :options="$addTitle(dayOpt)"
                notFoundContent="没有查询到数据"
              />
						</a-form-item>
					</a-col>
					<a-col class="playground-col" :span="8">
						<a-form-item v-bind="formItemLayouts" label="提前生成任务时间">
              <a-input-number :max="99" :min="0" :precision="0" :style="{width: '95px', marginRight: '10px'}" placeholder="数值"
                v-decorator="[ 'preNum',{ rules: [{ required: true, message: '请输入提前生成任务时间'}], initialValue: preNum}]"
              />
              <a-select showSearch placeholder="单位"
                v-decorator="[ 'preUnit',{ rules: [{required: true, message: '请输入提前生成任务时间'}],initialValue: preUnit}]"
                optionFilterProp="children"
                :style="{width: '95px'}"
                :options="$addTitle(preUnitOpt)"
                notFoundContent="没有查询到数据"
              />
						</a-form-item>
					</a-col>
				</a-row>
        <div class="table-layout-fixed table-border">
					<div class="button-box"><SG-Button class="buytton-nav" type="primary" weaken @click="addTheAsset">添加资产项目</SG-Button></div>
					<div class="table-layout-fixed table-border-lr">
						<a-table
							:loading="table.loading"
							:columns="table.previewColumns"
							:dataSource="table.tableData"
							class="custom-table td-pd10"
							:pagination="false"
							>
              <!-- 填报人表头 -->
            <template slot="informant">
              <a class="icon-red" @click="openSubjectModal('informant')">填报人</a>
            </template>
							<template slot="informant" slot-scope="text, record, index">
								<a-select
									placeholder="请选择填报人"
									:open="false"
									:style="{width: '100%'}"
                  :options="record.informantOpt"
                  @dropdownVisibleChange="tabSelectPerson(record, index, 'informant')"
									v-model="record.informant"
								>
									<div slot="dropdownRender" slot-scope="menu"></div>
									<a-icon slot="suffixIcon" type="plus-circle" />
								</a-select>
							</template>
              <!-- 审核人表头 -->
              <template slot="auditor">
                <a class="icon-red" @click="openSubjectModal('auditor')">审核人</a>
              </template>
							<template slot="auditor" slot-scope="text, record, index">
								<a-select
									placeholder="请选择审核人"
									:open="false"
									:style="{width: '100%'}"
									:options="$addTitle(record.auditorOpt)"
									@dropdownVisibleChange="tabSelectPerson(record, index, 'auditor')"
									v-model="record.auditor"
								>
									<div slot="dropdownRender" slot-scope="menu"></div>
									<a-icon slot="suffixIcon" type="plus-circle" />
								</a-select>
							</template>
							<template slot="operation" slot-scope="text, record">
								<span class="postAssignment-icon" weaken @click="deleteFn(record)">删除</span>
							</template>
						</a-table>
            <no-data-tips v-show="table.tableData.length === 0"></no-data-tips>
					</div>
        </div>
      </div>
    </div>
		</a-form>
    <FormFooter style="border:none;" location="fixed">
      <div>
        <SG-Button type="primary" @click="save('save')">提交</SG-Button>
        <SG-Button style="margin-left: 12px" type="primary" weaken @click="save('draft')">保存草稿</SG-Button>
        <SG-Button @click="cancel">取消</SG-Button>
      </div>
    </FormFooter>
		<div>
      <!-- 选人 -->
      <selectStaffOrPost ref="selectStaffOrPost" :allOrganId="organIdData" :selectType="selectType" @change="changeSelectStaffOrPost" :selectOptList="selectOptList"/>
    </div>
		<!-- 选资产 -->
		<projectModal ref="projectModal" :selectNumber="100" :allOrganId="organIdData" :judgeInstitutions="false" @assetChange="assetChange"></projectModal>
  </div>
</template>

<script>
import selectStaffOrPost from '@/views/common/selectStaffOrPost'
import noDataTips from "@/components/noDataTips"
import projectModal from '../../common/projectModal'
import FormFooter from '@/components/FormFooter'
import {utils} from '@/utils/utils.js'
import moment from 'moment'
const previewColumns = [
  {
    title: "编号",
		dataIndex: "indexs",
		width: '10%'
  },
  {
    title: "资产项目",
		dataIndex: "projectName",
		width: '10%'
  },
  {
    slots: {title: 'informant'},
		dataIndex: "informant",
		scopedSlots: { customRender: "informant" },
		width: '30%'
  },
  {
    slots: {title: 'auditor'},
    dataIndex: "auditor",
    scopedSlots: { customRender: "auditor" },
		width: '30%'
  },
  {
		title: "操作",
		dataIndex: "operation",
		scopedSlots: { customRender: "operation" },
		width: '10%'
  }
]
let preUnitOpt = [
  {label: '天', key: '1'},
  {label: '时', key: '2'}
]
let dayOpt = [
  {label: '天', key: '1'}
]
let exePreData = [
  {label: '单次', key: '1'},
	{label: '每天', key: '2'},
	{label: '每周', key: '3'},
	{label: '每月', key: '4'},
  {label: '每季度', key: '5'},
  {label: '每半年', key: '6'},
  {label: '每年', key: '7'},
]
//每周
let onweek = [
	{label: '周一', key: '1'},
	{label: '周二', key: '2'},
	{label: '周三', key: '3'},
	{label: '周四', key: '4'},
	{label: '周五', key: '5'},
	{label: '周六', key: '6'},
	{label: '周日', key: '7'},
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
const beginDayOpt = Array.from({length:31}).map((v,i) => ({label: `${i+1}日`, value: `${i+1}`, key: `${i+1}`}))
export default {
  components: {projectModal, selectStaffOrPost, FormFooter, noDataTips},
  props: {},
  data () {
    return {
      formData: [],
      batch: '',               // 批量设置
      reportBillId: undefined,        // 呈报表单id
      backupsReportBillId: '',        // 呈报表单备份！用于编辑时选择表单时的判断
      deadline: '3',           // 任务执行期限
      dayData: '1',            // 任务执行期限单位
      preNum: '1',             // 提前生成任务时间
      preUnit: '1',            // 提前生成任务时间单位
      reportPlanId: '',        // 计划id
			tabType: '',
			selectType: 'staff',     // staff选人 post选岗位
			selectOptList: [],
			checkedData: [],         // 资产id
			showBeginMonth: true,
			showBeginDay: true,
			oneMonth,
			onweek,
			oneQuarter,
			halfYear,
			oneHasYear,
      preUnitOpt,
      dayOpt,
			organIdData: [],    // 所属机构
			form: this.$form.createForm(this),
      allWidth: 'width: 214px',
      reportBillData: [],
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
      formItemLayouts: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 8 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 13 }
        }
			},
			beginDayOpt: beginDayOpt,
			beginMonthOpt: [],
			newCardData: {
				planName: '',      // 计划名称
				planCode: '',      // 计划编号
				organId: '',       // 所属机构
				defaultValue: [],  // 计划执行日期
				remark: '',        // 备注
				files: [],          // 附件
				exePre: undefined,        // 实施频次
			},
			exePreData: exePreData,    // 实施频次
      changeType: '',
      registerId: '',
      columns: [],
      dataSourceReportBill: [],
			loading: false,
			table: {
				tableData: [],
				loading: false,
				previewColumns: [...previewColumns],
				activeRowIndex: ''
			},
      location: '',
      noPageTools: false,
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
        count: ''
      }
    }
  },
  computed: {
  },
  methods: {
    moment,
    // 表头选择
    openSubjectModal (val) {
      if (this.table.tableData.length === 0) {
        this.$message.info('请先选择资产项目')
        return
      }
      this.batch = val            // 用于判断批量设置
      this.$refs.selectStaffOrPost.visible = true
      this.selectOptList = []
    },
    // 选择是否查看当前机构变动单
    checkboxFn (record, index, dataIndex) {
      this.dataSourceReportBill[index][dataIndex] = !this.dataSourceReportBill[index][dataIndex]
    },
    // 呈报表单监听
    reportBillChange (value) {
      this.reportBillId = value
      // 选择之前编辑的就用计划id查！切换别的就不穿计划id
      if (this.backupsReportBillId === value) {
        this.queryReportBillColumn(value, 'edit')
      } else {
        this.queryReportBillColumn(value, 'change')
      }
    },
    // 查询呈报表单字段
    // 编辑时接口拿头部 加disabled是用来判断是否可以编辑
    queryReportBillColumn (value, str) {
      let obj = {
        reportBillId: value,
        reportPlanId: ''
      }
      this.$api.reportManage.queryReportBillColumn(obj).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || []
          let arr = []
          let columnNeed = {}  // 是否必填 0-非必填 1-必填
          let columnDisplay = {}  // Number  必有字段  备注：是否展示 0-非展示 1-展示
          result.forEach(item => {
            arr.push({
              title: item.columnDesc,
              dataIndex: item.columnName,
              scopedSlots: { customRender: item.columnName }
            })
            columnNeed[item.columnName] = !!item.columnNeed
            columnNeed[item.columnName + 'disabled'] = !!item.columnNeed
            columnDisplay[item.columnName] = !!item.columnDisplay
            columnDisplay[item.columnName + 'disabled'] = !!item.columnDisplay
          })
          this.columns = [{title: '字段名称', dataIndex: 'ieldNames'}, ...arr]
          // 编辑时候那查询详情的接口回填
          if (this.type === 'edit' && str === 'edit') {
            let arrData = [{ieldNames: '必填字段', key: '0',  ...columnNeed}, {ieldNames: '展示字段', key: '1', ... columnDisplay}]
            this.formData.forEach(vv => {
              arrData[0][vv.columnName] = !!vv.columnNeed
              arrData[1][vv.columnName] = !!vv.columnDisplay
            })
            this.dataSourceReportBill = arrData
          } else {
            this.dataSourceReportBill = [{ieldNames: '必填字段', key: '0',  ...columnNeed}, {ieldNames: '展示字段', key: '1', ... columnDisplay}]
          }
          this.reportBillColumnList = result    // 总的数据
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 查询全部呈报表单列表
    queryAllReportBill () {
      this.$api.reportManage.queryAllReportBill({}).then(res => {
          if (res.data.code === "0") {
            let result = res.data.data || []
            let arr = []
            result.forEach(item => {
              arr.push({
                value: item.reportBillId,
                label: item.billName
              })
            })
            this.reportBillData = [...arr]
          } else {
            this.$message.error(res.data.message);
          }
      })
    },
		// 频次变化
    exePreSelectChange (e, str) {
			if (e === '1' || e === '2') {
				this.showBeginMonth = false
			} else {
				this.showBeginMonth = true
			}
      this.showBeginDay = e === '3' ? false : true
      switch (e) {
        case '1':
					this.beginMonthOpt = []
          break;
        case '2':
					this.beginMonthOpt = []
          break;
        case '3':
          this.beginDayOpt = onweek
          break;
        case '4':
          this.beginMonthOpt = oneMonth
          this.beginDayOpt = beginDayOpt
          break;
        case '5':
          this.beginMonthOpt = oneQuarter
          this.beginDayOpt = beginDayOpt
					break;
			  case '6':
          this.beginMonthOpt = halfYear
          this.beginDayOpt = beginDayOpt
					break;
				case '7':
          this.beginMonthOpt = oneHasYear
          this.beginDayOpt = beginDayOpt
          break;
      }
      this.$nextTick(() => {
        if (str !== 'edit') {
          if (this.showBeginMonth && this.showBeginDay) {
              this.form.setFieldsValue({
              beginMonth: '1'
            })
          }
          if (this.showBeginMonth) {
              this.form.setFieldsValue({
              beginDay: '1'
            })
          }
        }
      })
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
		// 添加资产
    addTheAsset () {
			this.$refs.projectModal.show = true
			this.$refs.projectModal.redactCheckedDataFn(this.checkedData, this.table.tableData)
		},
		// 资产选择变动
    assetChange (checkedData, checkedNames, rowsData) {
			this.checkedData = checkedData
			rowsData.forEach((item, index) => {
				item.indexs = index + 1
			})
			this.table.tableData = rowsData
      this.$refs.projectModal.show = false
    },
    // 删除
    deleteFn (record) {
      let _this = this
      this.$confirm({
        title: '提示',
        content: '确认要删除吗？',
        onOk() {
          _this.table.tableData.forEach((item, index) => {
            if (item.projectId === record.projectId) {
              _this.table.tableData.splice(index, 1)
            }
          })
          _this.checkedData.forEach((item, index) => {
            if (record.projectId === item) {
              _this.checkedData.splice(index, 1)
            }
          })
        }
      })
    },
		// 表格选人
    tabSelectPerson (record, index, type) {
			console.log(record, index, type)
			this.$refs.selectStaffOrPost.visible = true
			this.tabType = type
      this.table.activeRowIndex = index
      this.batch = ''
			if (this.tabType === 'informant') {
				this.selectOptList = this.table.tableData[index]['informantOptArr']
			} else if (this.tabType === 'auditor') {
        this.selectOptList = this.table.tableData[index]['auditorOptArr']
      }
		},
		// 监听选人弹窗改变事件
    changeSelectStaffOrPost (selectOptList = []) {
      let opt = selectOptList.map(item => {
        return {...item, key: item.userId, label: item.name}
      })
      let row = this.table.tableData[this.table.activeRowIndex]
      let obj = opt.reduce((pre, next) => {
         pre.label = pre.label + (pre.label ?',' : '') + next.label
         pre.key = pre.key + (pre.key ?',' : '') + next.key
         return pre
      }, {label: '', key: ''})
      // 批量设置
      if (this.batch) {
        if (this.batch === 'informant') {
          this.table.tableData.forEach(list => {
            list.informant = obj.key
            list.informantOpt = [obj]
            list.informantOptArr = opt
          })
        } else if (this.batch === 'auditor') {
          this.table.tableData.forEach(list => {
            list.auditor = obj.key
            list.auditorOpt = [obj]
            list.auditorOptArr = opt
          })
        }
      } else {
        // 单个设置
        // 填报人
        if (this.tabType === 'informant') {
          this.$set(row, 'informant', obj.key)
          this.$set(row, 'informantOpt', [obj])
          this.$set(row, 'informantOptArr', opt)
        }
        // 审核人的
        if (this.tabType === 'auditor') {
          this.$set(row, 'auditor', obj.key)
          this.$set(row, 'auditorOpt', [obj])
          this.$set(row, 'auditorOptArr', opt)
        }
      }
			this.$refs.selectStaffOrPost.visible = false
    },
		filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    // 查询详情
    query () {
      let obj = {
        reportPlanId: this.reportPlanId
      }
      this.$api.reportManage.queryReportPlanDetail(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.formData = data.reportBillColumnList   // 编辑给回来的表单
          this.exePreSelectChange(data.exePre, 'edit')
          this.reportBillId = Number(data.reportBillId)
          this.backupsReportBillId = utils.deepClone(this.reportBillId)
          this.queryReportBillColumn(this.reportBillId, 'edit')
          // 插入编辑数据
          this.form.setFieldsValue({
            remark: data.remark,                                   // 备注
            planName: data.planName,                              // 计划名称
            planCode: data.planCode,
            // organId: this.newCardData.organId,                  // 组织机构
            exePre: data.exePre,                                   // 实施频次
            beginDay: data.beginDay,                               // 任务开始天数
            beginMonth: data.beginMonth,                           // 任务开始月份
            preUnit: data.preUnit,                                 // 提前生成单位1-天 2-时
            preNum: data.preNum,                                   // 提前生成单位数量
            deadline: data.deadline,                               // 任务执行期限
            defaultValue: [moment(data.effDate), moment(data.expDate)]
          })
          let files = []
          if (data.attachmentList && data.attachmentList.length > 0) {
              data.attachmentList.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.newAttachmentName
              })
            })
          }
          this.newCardData.files = files
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 查询任务列表
    queryReportTaskTempPageListFn () {
      let obj = {
        reportPlanId: this.reportPlanId,
        pageNum: '',
        pageSize: ''
      }
      this.$api.reportManage.queryReportTaskTempPageList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          let checkedData = []
          data.forEach((item, index) => {
            item.projectId = Number(item.projectId)
            checkedData.push(Number(item.projectId))
            item.key = index
            item.indexs = index + 1
            item.informant = []          // 提交人
            item.informantOpt = []
            item.informantSet = []
            item.informantName = []
            item.informantOptArr = []
            item.auditorSet = []
            item.auditorName = []
            item.auditor = []             // 审核人
            item.auditorOpt = []
            item.auditorOptArr = []
            item.userList.forEach(v => {
              // 1 填报人  2 审核人
              if (+v.type === 1) {
                item.informantOptArr.push({
                  userId: v.userId,
                  name: v.userName,
                  id: v.userId
                })
                item.informantSet.push(v.userId)
                item.informantName.push(v.userName)
              } else if (+v.type === 2) {
                item.auditorOptArr.push({
                  userId: v.userId,
                  name: v.userName,
                  id: v.userId
                })
                item.auditorSet.push(v.userId)
                item.auditorName.push(v.userName)
              }
            })
            item.informant = item.informantSet.join(',')
            item.auditor = item.auditorSet.join(',')
            item.informantOpt = [{label: item.informantName.join(','), key: item.informant}]
            item.auditorOpt = [{label: item.auditorName.join(','), key: item.auditor}]
          })
          this.table.tableData = data
          this.checkedData = checkedData
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 取消
    cancel () {
      this.$router.push({path: '/reportingManagement/submitPlans'})
    },
    // 提交详情
    save (str) {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values, 'tijiao')
          let files = []
          if (this.newCardData.files.length > 0) {
            this.newCardData.files.forEach(list => {
              files.push({
                attachmentPath: list.url,
                oldAttachmentName: list.name
              })
            })
          }
          if (this.table.tableData.length === 0) {
            this.$message.info('请填写任务执行设置')
            return
          } else {
            for (let i = 0; i < this.table.tableData.length; i++) {
              if (!this.table.tableData[i].informant) {
                this.$message.info('请选择填报人')
                return
              } else if (!this.table.tableData[i].auditor) {
                this.$message.info('请选择审核人')
                return
              }
            }
          }
          if (!this.reportBillId) {
            this.$message.info('请选择呈报表单设置')
            return
          }
          // 呈报表单数据
          console.log(this.reportBillColumnList, '旧的')
          let report = utils.deepClone(this.reportBillColumnList)
          report.forEach(opt => {
            opt.columnNeed = Number(this.dataSourceReportBill[0][opt.columnName])
            opt.columnDisplay = Number(this.dataSourceReportBill[1][opt.columnName])
          })
          console.log(report, '新的')
          let taskTempList = []
          let data = utils.deepClone(this.table.tableData)
          data.forEach(item => {
            let userList = []
            item.informantOptArr.forEach(v => {
              userList.push({
                userId: v.userId,
                userName: v.name,
                type: '1'
              })
            })
            item.auditorOptArr.forEach(t => {
              userList.push({
                userId: t.userId,
                userName: t.name,
                type: '2'
              })
            })
            taskTempList.push({
              projectId: item.projectId,     // 项目id
              userList: userList
            })
          })
          let obj = {
            planCode: values.planCode,
            reportBillId: this.reportBillId,
            remark: values.remark,                                   // 备注
            reportPlanId: this.reportPlanId,                         // 无是新增 有是更新
            planName: values.planName,                               // 计划名称
            organId: this.newCardData.organId,                       // 组织机构
            exePre: values.exePre,                                   // 实施频次
            effDate: values.defaultValue[0].format('YYYY-MM-DD'),    // 计划生效时间
            expDate: values.defaultValue[1].format('YYYY-MM-DD'),    // 计划失效时间
            beginDay: values.beginDay,                               // 任务开始天数或星期几
            beginMonth: values.beginMonth,                           // 任务开始月份
            preUnit: values.preUnit,                                 // 提前生成单位1-天 2-时
            preNum: values.preNum,                                   // 提前生成单位数量
            approvalStatus: str === 'save' ? '1' : '0',                                      // 审批状态 0草稿 2待审批、已驳回3、已审批1 已取消4
            deadline: values.deadline,                               // 任务执行期限
            taskTempList: taskTempList,    // 计划明细
            attachmentList: files,             // 附件
            reportBillColumnList: report
        }
        let loadingName = this.SG_Loding('保存中...')
        this.$api.reportManage.saveReportPlan(obj).then(res => {
          if (res.data.code === "0") {
            this.DE_Loding(loadingName).then(() => {
              this.$SG_Message.success('提交成功')
              this.$router.push({path: '/reportingManagement/submitPlans', query: {refresh: true}})
            })
          } else {
            this.DE_Loding(loadingName).then(() => {
              this.$message.error(res.data.message)
            })
          }
      })
      }
    })
  }
},
  created () {
  },
  mounted () {
    this.queryAllReportBill()
		let arr = JSON.parse(this.$route.query.quersData)
		this.type = arr[0].type
		this.organIdData = [{
			name: arr[0].organName,
			value: arr[0].organId
    }]
    this.reportPlanId = arr[0].reportPlanId || ''
    this.newCardData.organId = arr[0].organId
    // 编辑
    if (this.type === 'edit') {
      this.query()
      this.queryReportTaskTempPageListFn()
    }
  }
}
</script>
<style lang="less" scoped>
.newPlan {
  .newPlan-nav{
      padding: 42px 126px 20px 70px;
      .newPlan-obj {
				padding: 20px 0 20px 40px;
				.form-choice {
					overflow: hidden;
					margin: 10px 0;
					.form-right {
						float: right;
					}
				}
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
	.button-box {
		overflow: hidden;
		margin-bottom: 10px;
		.buytton-nav {
			float: right;
		}
	}
  .file {
    margin: 20px 0 0 40px;
	}
	.postAssignment-icon {
    cursor: pointer;
    color: #0084FF;
    // font-size: 18px;
  }
  .postAssignment-icon:hover {
    color: red;
  }
  .tab-mar {
    padding-bottom: 90px
  }
}
</style>
