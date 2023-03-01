<!--
 * @Author: LW
 * @Date: 2019-12-20 10:17:52
 * @LastEditTime : 2020-01-10 14:13:17
 * @LastEditors  : Please set LastEditors
 * @Description: 呈报表单
 * @FilePath: \asset-management\src\views\reportingManagement\submitForm\index.vue
 -->
<template>
  <div class="countingTask pb70">
    <Cephalosome :rightCol="18" :leftCol="6">
      <div slot="col-l">
        <div class="nav">
          <SG-Button icon="plus" type="primary" style="margin-right: 10px" @click="newChangeSheetFn">新建呈报表单</SG-Button>
          <SG-Button type="primary" @click="downloadFn"><segiIcon type="#icon-ziyuan10" class="icon-right" />导出</SG-Button>
        </div>
      </div>
      <div slot="col-r">
        <div class="nav">
          <a-select style="width: 160px; margin-right: 10px" placeholder="全部状态" v-model="queryCondition.taskStatus">
            <a-select-option :title="item.name" v-for="(item, index) in taskStatusData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <a-input-search
            style="width: 170px; margin-right: 10px"
            v-model="queryCondition.taskName"
            placeholder="表单名称/编码"
            :maxLength="30"
            @search="onSearch"
          />
          <SG-Button type="primary" @click="query">查询</SG-Button>
        </div>
      </div>
    </Cephalosome>
    <div>
      <div class="table-layout-fixed table-border">
        <a-table
          size="middle"
          :loading="table.loading"
          :pagination="false"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{ emptyText: '暂无数据' }"
        >
          <template slot="progress" slot-scope="text, record">
            <div style="padding-right: 10px">
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
import Cephalosome from '@/components/Cephalosome';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import noDataTips from '@/components/noDataTips';
import segiIcon from '@/components/segiIcon.vue';
// 页面跳转
const operationTypes = {
  detail: '/reportingManagement/submitForm/details',
  set: '/inventoryManagement/countingTask/newEditor',
  edit: '/inventoryManagement/countingTask/newEditor',
};
let getUuid = (
  (uuid = 1) =>
  () =>
    ++uuid
)();
const queryCondition = {
  taskName: '',
  taskStatus: '',
  pageSize: 10,
  pageNum: 1,
};
const taskStatusData = [
  {
    name: '全部状态',
    value: '',
  },
  {
    name: '启用',
    value: '0',
  },
  {
    name: '停用',
    value: '1',
  },
];

let columns = [
  {
    title: '表单ID',
    dataIndex: 'taskId',
  },
  {
    title: '表单名称',
    dataIndex: 'taskName',
  },
  {
    title: '表单编码',
    dataIndex: 'chargePersonName',
  },
  {
    title: '状态',
    dataIndex: 'progress',
    scopedSlots: { customRender: 'progress' },
  },
  {
    title: '备注',
    dataIndex: 'beginDateEndDate',
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    width: 160,
  },
];
export default {
  components: {
    Cephalosome,
    noDataTips,
    segiIcon,
  },
  data() {
    return {
      defaultChecked: false,
      ASSET_MANAGEMENT,
      queryCondition: { ...queryCondition },
      taskStatusData,
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0,
      },
    };
  },
  watch: {
    $route() {
      if (this.$route.path === '/inventoryManagement/countingTask' && this.$route.query.refresh) {
        this.queryCondition.pageNum = 1;
        this.queryCondition.pageSize = 10;
        this.query();
      }
    },
  },
  mounted() {
    this.query();
  },
  methods: {
    // 新增表单
    newChangeSheetFn() {},
    // 导出
    downloadFn() {},
    // 搜索
    onSearch() {
      this.queryCondition.pageNum = 1;
      this.query();
    },
    query() {
      let data = {
        taskName: this.queryCondition.taskName,
        taskStatus: '',
        pageSize: this.queryCondition.pageSize,
        pageNum: this.queryCondition.pageNum,
        beginDate: '',
        endDate: '',
      };
      this.table.loading = true;
      this.$api.inventoryManagementApi.queryCheckTaskPageList(data).then(
        (res) => {
          this.table.loading = false;
          if (res.data.code === '0') {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map((item) => {
              item.beginDateEndDate = `${item.beginDate} - ${item.endDate}`;
              let arr = [];
              item.chargePersonList.forEach((item) => {
                arr.push(item.userName);
              });
              item.chargePersonName = arr.length === 0 ? '' : arr.join(',');
              item.completeDate = item.completeDate ? item.completeDate : '--';
              return {
                key: getUuid(),
                ...item,
              };
            });
            this.table.totalCount = res.data.data.count || '';
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
      this.query();
    },
    // 页面跳转
    goPage(type, record) {
      let querys = JSON.stringify([
        {
          type,
          projectId: record.projectId,
          taskId: record.taskId,
          detail: true,
        },
      ]);
      this.$router.push({ path: operationTypes[type], query: { quersData: querys } });
    },
  },
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
