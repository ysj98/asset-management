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
                v-decorator="['planName', {rules: [{required: true, max: 30, whitespace: true, message: '请输入计划名称(不超过30字符)'}], initialValue: newCardData.planName}]"/>
              </a-form-item>
            </a-col>
						<a-col class="playground-col" :span="8">
              <a-form-item v-bind="formItemLayout" label="计划编号：">
                <a-input placeholder="请输入计划编号"
                :style="allWidth"
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
                  :autosize="{ minRows: 3, maxRows: 3 }"
                  :maxLength="200"
                  v-decorator="['remark',
                  {rules: [{required: false, max: 200, message: '请输入备注(不超过200字符)'}], initialValue: newCardData.remark}
                  ]"
                  />
              </a-form-item>
            </a-col>
						<a-col class="playground-col" :span="24">
              <a-form-item :colon="false" v-bind="formItemTextarea">
                <label slot="label">上传附件：</label>
                <SG-UploadFile
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
										:defaultValue="undefined"
										:options="chargePersonOpt"
										:filterOption="filterOption"
									>
									</a-select>
						</div>
						</div>
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columns"
            :dataSource="[]"
            class="custom-table td-pd10"
            :pagination="false"
            >
          </a-table>
        </div>
      </div>
    </div>
		<div class="newPlan-nav">
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
                :options="exePreData"
                notFoundContent="没有查询到数据"
              />
						</a-form-item>
					</a-col>
					<a-col class="playground-col" :span="8" v-if="showBeginMonth">
						<a-form-item v-bind="formItemLayout" label="任务开始时间">
              <a-select showSearch placeholder="月"
								v-decorator="[ 'beginMonth',{ rules: [{required: true, message: '请选择任务开始时间'}], initialValue: undefined}]"
									optionFilterProp="children"
									:style="{ width: '120px', marginRight: '10px' }"
									class="mr10"
									:options="beginMonthOpt"
									notFoundContent="没有查询到数据"
								/>
              <a-select showSearch placeholder="日"
							  v-if="showBeginDay"
                v-decorator="['beginDay',{rules: [{required: true}], initialValue: '1'}]"
                optionFilterProp="children"
                :style="{ width: '70px'}"
                :options="beginDayOpt"
                notFoundContent="没有查询到数据"
              />
            </a-form-item>
					</a-col>
					<a-col class="playground-col" :span="8">
						<a-form-item v-bind="formItemLayout" label="任务执行期限">
              <a-input-number :max="99" :min="0" :style="{width: '95px', marginRight: '10px'}" placeholder="数值"
                v-decorator="[ 'preNum',{ rules: [{ required: true, message: '请输入任务执行期限'}], initialValue: '3'}]"
              />
              <a-select showSearch placeholder="单位"
                v-decorator="[ 'preUnit',{ rules: [{required: true, message: '请输入任务执行期限'}],initialValue: '1'}]"
                optionFilterProp="children"
                :style="{width: '95px'}"
                :options="preUnitOpt"
                notFoundContent="没有查询到数据"
              />
						</a-form-item>
					</a-col>
					<a-col class="playground-col" :span="8">
						<a-form-item v-bind="formItemLayout" label="提前生成任务时间">
              <a-input-number :max="99" :min="0" :style="{width: '95px', marginRight: '10px'}" placeholder="数值"
                v-decorator="[ 'preNum',{ rules: [{ required: true, message: '请输入提前生成任务时间'}], initialValue: '1'}]"
              />
              <a-select showSearch placeholder="单位"
                v-decorator="[ 'preUnit',{ rules: [{required: true, message: '请输入提前生成任务时间'}],initialValue: '1'}]"
                optionFilterProp="children"
                :style="{width: '95px'}"
                :options="preUnitOpt"
                notFoundContent="没有查询到数据"
              />
						</a-form-item>
					</a-col>
				</a-row>
        <div class="table-layout-fixed table-border">
					<div class="button-box"><SG-Button class="buytton-nav" type="primary" weaken @click="addTheAsset">添加资产</SG-Button></div>
					<div class="table-layout-fixed table-border-lr">
						<a-table
							:loading="table.loading"
							:columns="table.previewColumns"
							:dataSource="table.tableData"
							class="custom-table td-pd10"
							:pagination="false"
							>
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
							<template slot="operation" slot-scope="text, record">
								<span class="postAssignment-icon" weaken @click="deleteFn(record)">删除</span>
							</template>
						</a-table>
					</div>
        </div>
      </div>
    </div>
		</a-form>
		<div>
      <!-- 选人 -->
      <selectStaffOrPost ref="selectStaffOrPost" :selectType="selectType" @change="changeSelectStaffOrPost" :selectOptList="selectOptList"/>
    </div>
		<!-- 选资产 -->
		<associateAssetModal ref="associateAssetModal" organId="" queryType="1" :judgeInstitutions="false" @assetChange="assetChange"></associateAssetModal>
  </div>
</template>

<script>
import selectStaffOrPost from '@/views/common/selectStaffOrPost'
import associateAssetModal from '../../financialManagement/assetEntry/associateAssetModal'
const colu = [
  {
    title: "编号",
    dataIndex: "index"
  },
  {
    title: "字段名称",
    dataIndex: "index1"
  },
  {
    title: "字段编码",
    dataIndex: "index2"
  },
  {
    title: "字段类型",
    dataIndex: "index3"
  },
  {
    title: "字段格式",
    dataIndex: "index4"
  },
  {
    title: "字段长度",
    dataIndex: "index5"
  },
  {
    title: "字段值",
    dataIndex: "index6"
  },
  {
    title: "必填字段",
    dataIndex: "index7"
  }
]
const previewColumns = [
  {
    title: "编号",
		dataIndex: "indexs",
		width: '10%'
  },
  {
    title: "资产项目",
		dataIndex: "assetName",
		width: '10%'
  },
  {
    title: "填报人",
		dataIndex: "informant",
		scopedSlots: { customRender: "informant" },
		width: '30%'
  },
  {
    title: "审核人",
		dataIndex: "auditor",
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
export default {
  components: {associateAssetModal, selectStaffOrPost},
  props: {},
  data () {
    return {
			tabType: '',
			selectType: 'staff', // staff选人 post选岗位
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
			organIdData: [],    // 所属机构
			form: this.$form.createForm(this),
			allWidth: 'width: 214px',
			chargePersonOpt: [
				{
					value: '',
					label: '测试'
				}
			],
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
			beginDayOpt: Array.from({length:31}).map((v,i) => ({label: `${i+1}日`, value: `${i+1}`, key: `${i+1}`})),
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
      newPlanData: {},
      files: [],
			columns: colu,
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
		// 频次变化
    exePreSelectChange (e) {
			if (e === '1' || e === '2') {
				this.showBeginMonth = false
			} else {
				this.showBeginMonth = true
			}
			this.showBeginDay = e === '3' ? false : true
      switch (e){
        case '1':
					this.beginMonthOpt = []
          break;
        case '2':
					this.beginMonthOpt = []
          break;
        case '3':
          this.beginMonthOpt = onweek
          break;
        case '4':
          this.beginMonthOpt = oneMonth
          break;
        case '5':
          this.beginMonthOpt = oneQuarter
					break; 
			  case '6':
          this.beginMonthOpt = halfYear
					break;
				case '7':
          this.beginMonthOpt = oneHasYear
          break;     
      }
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
			this.$refs.associateAssetModal.show = true
			this.$refs.associateAssetModal.redactCheckedDataFn(this.checkedData, '', this.table.tableData)
		},
		// 资产选择变动
    assetChange (checkedData, checkedNames, rowsData, extraData) {
			this.checkedData = checkedData
			console.log(checkedData)
			console.log(checkedNames)
			console.log(rowsData)
			rowsData.forEach((item, index) => {
				item.informantOptArr = []
				item.auditor = ''
				item.indexs = index + 1
			})
			this.table.tableData = rowsData
			console.log(extraData)
      this.$refs.associateAssetModal.show = false
		},
		// 删除
    deleteFn (record) {
      this.table.tableData.forEach((item, index) => {
        if (item.assetId === record.assetId) {
          this.table.tableData.splice(index, 1)
        }
      })
      this.checkedData.forEach((item, index) => {
        if (record.assetId === item) {
          this.checkedData.splice(index, 1)
        }
      })
		},
		// 表格选人
    tabSelectPerson (record, index, type) {
			console.log(record, index, type)
			this.$refs.selectStaffOrPost.visible = true
			this.tabType = type
			this.table.activeRowIndex = index
			if (this.tabType === 'informant') {
				this.selectOptList = this.table.tableData[index]['informantOptArr']
				
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
      // 填报人
      if (this.tabType === 'informant') {
				this.$set(row, 'informant', obj.key)
				this.$set(row, 'informantOpt', [obj])
				this.$set(row, 'informantOptArr', opt)
				// this.table.tableData[this.table.activeRowIndex].informant = obj.key  // 选择的id
        // this.table.tableData[this.table.activeRowIndex].informantOpt = [obj]  // 选的总的
				console.log(this.table.tableData)
      }
      // 审核人的
      if (this.tabType === 'auditor') {
        this.$set(row, 'chargePerson', obj.key)
        this.$set(row, 'chargePersonArr', opt)
        this.$set(row, 'chargePersonOpt', [obj])
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
          console.log(res)
          let data = res.data.data
          this.newPlanData = data
          data.amsOwnershipRegisterDetailList.forEach((item, index) => {
            item.key = index
            item.address = item.location
            item.assetArea = item.area
          })
          this.tableData = data.amsOwnershipRegisterDetailList
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created () {
  },
  mounted () {
		let arr = JSON.parse(this.$route.query.quersData)
		this.type = arr[0].type
		this.organIdData = [{
			name: arr[0].organName,
			value: arr[0].organId
		}]
		this.newCardData.organId = arr[0].organId
    // this.query()
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
}
</style>
