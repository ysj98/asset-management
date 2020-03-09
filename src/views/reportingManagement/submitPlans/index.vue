<!--
 * @Author: LW
 * @Date: 2019-12-20 10:17:52
 * @LastEditTime: 2020-03-09 10:24:21
 * @LastEditors: Please set LastEditors
 * @Description: 呈报计划
 * @FilePath: \asset-management\src\views\reportingManagement\submitForm\index.vue
 -->
<template>
  <div class="countingTask pb70">
    <Cephalosome :rightCol="18" :leftCol="6">
			<div slot="col-l">
				<div class="nav">
					<SG-Button icon="plus" type="primary" style="margin-right: 10px;" v-power="ASSET_MANAGEMENT.zcgl_submit_plans_new" @click="goPage('new')">新建呈报计划</SG-Button>			  
					<!-- <SG-Button type="primary" @click="downloadFn"><segiIcon type="#icon-ziyuan10" class="icon-right"/>导出</SG-Button> -->
				</div>
			</div>
      <div slot="col-r">
        <div class="nav">
					<treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
					<a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部呈报表单" :tokenSeparators="[',']"  @select="reportBillIdFn"  v-model="queryCondition.reportBillId">
            <a-select-option v-for="(item, index) in reportBillData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
					<a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="taskStatusFn"  v-model="queryCondition.taskStatus">
            <a-select-option v-for="(item, index) in taskStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search :style="allStyle" v-model="queryCondition.planName" placeholder="呈报计划名称/编码" maxlength="30" @search="onSearch" />
          <SG-Button type="primary" @click="query">查询</SG-Button>
        </div>
      </div>
    </Cephalosome>
		<a-spin :spinning="table.loading">
      <overview-number :numList="numList"/>
    </a-spin>
    <div>
      <div class="table-layout-fixed table-border">
        <a-table
          class="custom-table td-pd10"
          :loading="table.loading"
          :pagination="false"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{emptyText: '暂无数据'}"
        >
          <template slot="operation" slot-scope="text, record">
            <div class="tab-opt">
              <span @click="goPage('detail', record)">详情</span>
              <span @click="goPage('edit', record)" v-power="ASSET_MANAGEMENT.zcgl_submit_plans_edit" v-show="+record.approvalStatus === 0 || +record.approvalStatus === 3">编辑</span>
              <span @click="goPage('delete', record)" v-power="ASSET_MANAGEMENT.zcgl_submit_plans_delete" v-show="+record.approvalStatus === 0 || +record.approvalStatus === 3">删除</span>
              <!-- <span v-if="+record.approvalStatus === 2">审核</span> -->
            </div>
          </template>
        </a-table>
      </div>
      <no-data-tips v-show="table.dataSource.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="table.totalCount"
        location="absolute"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
  </div>
</template>

<script>
import TreeSelect from '../../common/treeSelect'
import Cephalosome from '@/components/Cephalosome'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import noDataTips from "@/components/noDataTips"
import segiIcon from '@/components/segiIcon.vue'
import OverviewNumber from 'src/views/common/OverviewNumber'
// 页面跳转
const operationTypes = {
  detail: '/reportingManagement/submitPlans/details',
  new: '/reportingManagement/submitPlans/newPlan',
  edit: '/reportingManagement/submitPlans/editPlan'
}
let getUuid = ((uuid = 1) => () => ++uuid)();
const queryCondition = {
  planName: '',
  taskStatus: '',
  reportBillId: '',
  pageSize: 10,
  pageNum: 1
}
const taskStatusData = [
  {
    name: '全部状态',
    value: ''
  },
  {
    name: '草稿',
    value: '0'
  },
  {
    name: '待审批',
    value: '2'
  },
  {
    name: '已驳回',
    value: '3'
  },
  {
    name: '已审批',
    value: '1'
  },
  {
    name: '已取消',
    value: '4'
  }
]

let columns = [
  {
    title: "计划编号",
    dataIndex: "reportPlanId"
  },
  {
    title: "所属机构",
    dataIndex: "organName"
  },
  {
    title: "计划名称",
    dataIndex: "planName"
  },
  {
    title: "计划编码",
    dataIndex: "planCode"
  },
  {
    title: "呈报表单",
    dataIndex: "billName"
	},
	{
    title: "生效时间",
    dataIndex: "effDate"
  },
  {
    title: "失效时间",
    dataIndex: "expDate"
  },
  {
    title: "执行频次",
    dataIndex: "exePreName"
  },
  {
    title: "状态",
    dataIndex: "approvalStatusName"
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 160
  }
];
export default {
  components: {
    Cephalosome,
		noDataTips,
		segiIcon,
		TreeSelect,
		OverviewNumber
  },
  data() {
    return {
			numList: [
				{title: '全部', key: 'all', value: 0, fontColor: '#324057'}, {title: '草稿', key: 'draft', value: 0, bgColor: '#4BD288'},
				{title: '待审批', key: 'await', value: 0, bgColor: '#1890FF'}, {title: '已驳回', key: 'reject', value: 0, bgColor: '#DD81E6'},
				{title: '已审批', key: 'complete', value: 0, bgColor: '#FD7474'}, {title: '已取消', key: 'cancel', value: 0, bgColor: '#BBC8D6'}
			], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      defaultChecked: false,
			ASSET_MANAGEMENT,
			allStyle: 'width: 160px; margin-right: 10px;',
      queryCondition: {...queryCondition},
      taskStatusData,
      reportBillData: [],
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
    };
  },
  watch: {
    '$route' () {
      if (this.$route.path === '/inventoryManagement/countingTask' && this.$route.query.refresh) {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
        this.query()
      }
    }
  },
  mounted () {
    this.query()
    this.queryAllReportBill()
  },
  methods: {
		// 状态发生变化
    taskStatusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.taskStatus = this.handleMultipleSelectValue(value, this.queryCondition.taskStatus, this.taskStatusData)
      })
    },
    // 呈报表单
    reportBillIdFn (value) {
      this.$nextTick(function () {
        this.queryCondition.reportBillId = this.handleMultipleSelectValue(value, this.queryCondition.reportBillId, this.reportBillData)
      })
    },
    // 处理多选下拉框有全选时的数组
    handleMultipleSelectValue (value, data, dataOptions) {
      // 如果选的是全部
      if (value === '') {
        data = ['']
      } else {
        let totalIndex = data.indexOf('')
        if (totalIndex > -1) {
          data.splice(totalIndex, 1)
        } else {
          // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
          if (data.length === dataOptions.length - 1) {
            data = ['']
          }
        }
      }
      return data
    },
		// 机构选择
		changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.query()
    },
    // 新增计划
    newChangeSheetFn () {},
    // 导出
    downloadFn () {},
    // 搜索
    onSearch () {
      this.queryCondition.pageNum = 1
      this.query()
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
                name: item.billName
              })
            })
            this.reportBillData = [{ name: '全部呈报表单', value: ''}, ...arr]
          } else {
            this.$message.error(res.data.message);
          }
      })
    },
    query () {
      let data = {
        pageSize: this.queryCondition.pageSize,
        pageNum: this.queryCondition.pageNum,
        organId: this.queryCondition.organId,
        approvalStatus: this.queryCondition.taskStatus.length > 0 ? this.queryCondition.taskStatus.join(',') : '',   // 状态
        planName: this.queryCondition.planName,
        billType: this.queryCondition.reportBillId.length > 0 ? this.queryCondition.reportBillId.join(',') : ''
      }
      this.table.loading = true
      this.$api.reportManage.queryReportPlanPageList(data).then(
        res => {
          this.table.loading = false;
          if (res.data.code === "0") {
            let result = res.data.data.data || []
            this.table.dataSource = result.map(item => {
              return {
                key: getUuid(),
                ...item
              };
            });
            this.table.totalCount = res.data.data.count || ""
          } else {
            this.$message.error(res.data.message)
          }
        },
        () => {
          this.table.loading = false
        }
      )
      this.queryReportPlanNum()
    },
    // 统计查询
    queryReportPlanNum () {
      let data = {
        organId: this.queryCondition.organId,
        approvalStatus: this.queryCondition.taskStatus.length > 0 ? this.queryCondition.taskStatus.join(',') : '',   // 状态
        planName: this.queryCondition.planName,
        billType: this.queryCondition.reportBillId.length > 0 ? this.queryCondition.reportBillId.join(',') : ''
      }
      this.$api.reportManage.queryReportPlanNum(data).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || []
          this.numList = this.numList.map(m => {
            return { ...m, value: result[m.key] }
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query()
    },
    deleteFn (id) {
      let _this = this
      this.$confirm({
        title: '提示',
        content: '确认要删除该呈报计划吗',
        onOk() {
          let obj = {
            reportPlanId: id,
            approvalStatus: '4'
          }
          _this.$api.reportManage.updateReportPlanStatus(obj).then(res => {
            if (Number(res.data.code) === 0) {
              _this.$message.info('删除成功')
              _this.query()
            } else {
              _this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    // 页面跳转
    goPage(type, record) {
      if (type === 'delete') {
        this.deleteFn(record.reportPlanId)
        return
      }
      let querys = []
      if (type === 'new') {
        querys = [{
          type,
          organId: this.queryCondition.organId,
          organName: this.organName
        }]
      } else {
        querys = [{
          type,
          reportPlanId: record.reportPlanId,
          organId: record.organId,
          organName: record.organName,
          detail: true
        }]
      }
      this.$router.push({ path: operationTypes[type], query: {quersData: JSON.stringify(querys)}})
    }
  }
};
</script>
 <style lang="less" scoped>
  .countingTask {
    .box {
      display: inline-block;
      vertical-align: middle;
      margin-right: 10px;
    }
    .nav {
      display: inline-block;
      vertical-align: middle;
    }
    .tab-opt {
      span {
        padding-right: 10px;
        color: #0084FF;
        cursor: pointer;
      }
    }
  }
</style>
