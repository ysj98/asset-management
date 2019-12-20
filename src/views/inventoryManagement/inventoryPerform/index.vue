<!--
 * @Author: LW
 * @Date: 2019-12-20 10:19:43
 * @LastEditTime : 2019-12-20 14:54:58
 * @LastEditors  : Please set LastEditors
 * @Description: 盘点执行
 * @FilePath: \asset-management\src\views\inventoryManagement\inventoryPerform\index.vue
 -->
<template>
  <div class="countingTask pb70">
    <Cephalosome :rightCol="22" :leftCol="2">
      <div slot="col-r">
        <div class="box">
          <SG-DatePicker label="盘点日期" style="width: 200px;"  pickerType="RangePicker" v-model="defaultValue" format="YYYY-MM-DD"></SG-DatePicker>
        </div>
        <div class="nav">
          <a-select :maxTagCount="1" style="width: 160px; margin-right: 10px;" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="approvalStatusFn"  v-model="queryCondition.approvalStatus">
            <a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input-search style="width: 170px; margin-right: 10px;" v-model="queryCondition.assetName" placeholder="盘点单名称/编号" maxlength="60" @search="onSearch" />
        </div>
      </div>
    </Cephalosome>
    <div>
      <a-table
        class="custom-table td-pd10"
        :loading="table.loading"
        :pagination="false"
        :columns="table.columns"
        :dataSource="table.dataSource"
        :locale="{emptyText: '暂无数据'}"
      >
        <template slot="tranProgress" slot-scope="text, record">
          <div style="padding-right: 10px;">
              <a-progress :percent="Number(record.tranProgress) || 0" />
            </div>
        </template>
        <template slot="operation" slot-scope="text, record">
          <span @click="goPage('detail', record)" class="btn_click mr15">详情</span>
          <span v-power="ASSET_MANAGEMENT.ASSET_PROOWNERSHIP_SET" @click="goPage('set', record)" class="btn_click">权属设置</span>
        </template>
      </a-table>
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
import Cephalosome from '@/components/Cephalosome'
import { utils } from "@/utils/utils"
import moment from 'moment'
import {ASSET_MANAGEMENT} from '@/config/config.power'
import noDataTips from "@/components/noDataTips"
import {getNMonthsAgoFirst, getNowMonthDate} from 'utils/formatTime'
// 页面跳转
const operationTypes = {
  detail: "/ownershipSurvey/projectDetail",
  set: "/ownershipSurvey/projectSet"
}
let getUuid = ((uuid = 1) => () => ++uuid)();
const queryCondition = {
  assetName: '',
  approvalStatus: '',
  pageSize: 10,
  pageNum: 1
}
const approvalStatusData = [
  {
    name: '全部状态',
    value: ''
  },
  {
    name: '进行中',
    value: '0'
  },
  {
    name: '已完成',
    value: '1'
  }
]
let columns = [
  {
    title: "盘点单号",
    dataIndex: "organName",
    width: 150
  },
  {
    title: "盘点单名称",
    dataIndex: "projectCode",
    width: 120
  },
  {
    title: "盘点人",
    dataIndex: "sourceTypeName",
    width: 100
  },
  {
    title: "盘点进度",
    dataIndex: "tranProgress",
    scopedSlots: { customRender: "tranProgress" },
    width: 200
  },
  {
    title: "计划执行时间",
    dataIndex: "ownershipCount",
    width: 100
  },
  {
    title: "实际完成时间",
    dataIndex: "noOwnershipCount",
    width: 100
  },
    {
    title: "状态",
    dataIndex: "waitOwnershipCount",
    width: 100
  },
  {
    title: "盘点资产总数",
    dataIndex: "waitOwnershipCount",
    width: 100
  },
    {
    title: "盘盈",
    dataIndex: "waitOwnershipCount",
    width: 100
  },
  {
    title: "盘亏",
    dataIndex: "waitOwnershipCount",
    width: 100
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 120
  }
];
export default {
  components: {
    Cephalosome,
    noDataTips
  },
  data() {
    return {
      ASSET_MANAGEMENT,
      queryCondition: {...queryCondition},
      approvalStatusData,
      defaultValue: [moment(getNMonthsAgoFirst(2)), moment(getNowMonthDate())],
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
      if (this.$route.path === '/countingTask' && this.$route.query.refresh) {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
        this.query()
      }
    }
  },
  mounted () {
    console.log(getNMonthsAgoFirst(2), getNowMonthDate())
  },
  methods: {
    // 状态发生变化
    approvalStatusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatus = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatus, this.approvalStatusData)
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
    // 搜索
    onSearch () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    query() {
      let data = {
        ...this.queryCondition,
      }
      this.table.loading = true;
      this.$api.basics.ownerShipList(data).then(
        res => {
          this.table.loading = false;
          if (res.data.code === "0") {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map(item => {
              item.sourceTypeName = item.sourceTypeName || "--";
              item.souceChannelType = item.souceChannelType || "--";
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
      this.query();
    },
    // 页面跳转
    goPage(type, record) {
      let query = {
        type,
        projectId: record.projectId
      };
      this.$router.push({ path: operationTypes[type], query });
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
