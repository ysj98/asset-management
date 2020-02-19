<!--
 * @Author: LW
 * @Date: 2019-12-20 10:17:52
 * @LastEditTime : 2020-01-10 14:13:17
 * @LastEditors  : Please set LastEditors
 * @Description: 呈报计划
 * @FilePath: \asset-management\src\views\reportingManagement\submitForm\index.vue
 -->
<template>
  <div class="countingTask pb70">
    <Cephalosome :rightCol="18" :leftCol="6">
			<div slot="col-l">
				<div class="nav">
					<SG-Button icon="plus" type="primary" style="margin-right: 10px;" @click="newChangeSheetFn">新建呈报计划</SG-Button>			  
					<SG-Button type="primary" @click="downloadFn"><segiIcon type="#icon-ziyuan10" class="icon-right"/>导出</SG-Button>
				</div>
			</div>
      <div slot="col-r">
        <div class="nav">
					<treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
					<a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部呈报表单" :tokenSeparators="[',']"  @select="taskStatusFn"  v-model="queryCondition.taskStatus">
            <a-select-option v-for="(item, index) in taskStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
					<a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="taskStatusFn"  v-model="queryCondition.taskStatus">
            <a-select-option v-for="(item, index) in taskStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search :style="allStyle" v-model="queryCondition.taskName" placeholder="呈报计划名称/编码" maxlength="30" @search="onSearch" />
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
          <template slot="progress" slot-scope="text, record">
            <div style="padding-right: 10px;">
                <!-- <a-progress :percent="Number(record.progress) || 0" /> -->
                <a-switch :disabled="true" checkedChildren="启用" unCheckedChildren="停用" v-model="defaultChecked" />
              </div>
          </template>
          <template slot="operation" slot-scope="text, record">
            <span @click="goPage('detail', record)" class="btn_click mr15">详情</span>
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
  set: '/inventoryManagement/countingTask/newEditor',
  edit: '/inventoryManagement/countingTask/newEditor'
}
let getUuid = ((uuid = 1) => () => ++uuid)();
const queryCondition = {
  taskName: '',
  taskStatus: '',
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
    dataIndex: "taskId"
  },
  {
    title: "所属机构",
    dataIndex: "taskName"
  },
  {
    title: "计划名称",
    dataIndex: "chargePersonName"
  },
  {
    title: "计划编码",
    dataIndex: "progress"
  },
  {
    title: "呈报表单",
    dataIndex: "beginDateEndDate1"
	},
	{
    title: "生效时间",
    dataIndex: "taskName1"
  },
  {
    title: "失效时间",
    dataIndex: "chargePersonName1"
  },
  {
    title: "执行频次",
    dataIndex: "progress1"
  },
  {
    title: "状态",
    dataIndex: "beginDateEndDate"
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
				{title: '全部', key: 'totalArea', value: 0, fontColor: '#324057'}, {title: '草稿', key: 'totalOperationArea', value: 0, bgColor: '#4BD288'},
				{title: '待审批', key: 'totalIdleArea', value: 0, bgColor: '#1890FF'}, {title: '已驳回', key: 'totalSelfUserArea', value: 0, bgColor: '#DD81E6'},
				{title: '已审批', key: 'totalOccupationArea', value: 0, bgColor: '#FD7474'}, {title: '已取消', key: 'totalOtherArea', value: 0, bgColor: '#BBC8D6'}
			], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      defaultChecked: false,
			ASSET_MANAGEMENT,
			allStyle: 'width: 160px; margin-right: 10px;',
      queryCondition: {...queryCondition},
      taskStatusData,
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
  },
  methods: {
		// 状态发生变化
    taskStatusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.taskStatus = this.handleMultipleSelectValue(value, this.queryCondition.taskStatus, this.taskStatusData)
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
    query() {
      let data = {
        taskName: this.queryCondition.taskName,
        taskStatus: '',
        pageSize: this.queryCondition.pageSize,
        pageNum: this.queryCondition.pageNum,
        beginDate:  '',
        endDate: ''
      }
      this.table.loading = true;
      this.$api.inventoryManagementApi.queryCheckTaskPageList(data).then(
        res => {
          this.table.loading = false;
          if (res.data.code === "0") {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map(item => {
              item.beginDateEndDate = `${item.beginDate} - ${item.endDate}`
              let arr = []
              item.chargePersonList.forEach(item => {
                arr.push(item.userName)
              })
              item.chargePersonName = arr.length === 0 ? '' : arr.join(',')
              item.completeDate = item.completeDate ? item.completeDate : '--'
              return {
                key: getUuid(),
                ...item
              };
            });
            this.table.totalCount = res.data.data.count || "";
          } else {
            this.$message.error(res.data.message);
          }
        },
        () => {
          this.table.loading = false;
        }
      );
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query()
    },
    // 页面跳转
    goPage(type, record) {
      let querys = JSON.stringify([{
        type,
        projectId: record.projectId,
        taskId: record.taskId,
        detail: true
      }])
      this.$router.push({ path: operationTypes[type], query: {quersData: querys}})
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
  }
</style>
