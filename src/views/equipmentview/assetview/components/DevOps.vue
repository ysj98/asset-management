<template>
  <div class="devOps">
    <a-tabs v-model="activeKey">
      <a-tab-pane v-for="(item, key) in otherTabOptions" :key="key" :tab="item.tab">
        <div class="search">
          <a-date-picker
            v-model="startValue"
            :disabled-date="disabledStartDate"
            format="YYYY-MM-DD"
            placeholder="开始时间"
            @openChange="handleStartOpenChange"
          />
          <a-date-picker
            style="margin-left: 15px"
            v-model="endValue"
            :disabled-date="disabledEndDate"
            format="YYYY-MM-DD"
            placeholder="结束时间"
            :open="endOpen"
            @openChange="handleEndOpenChange"
          />
          <a-button icon="search" class="searchBtn" @click="search"> 查询 </a-button>
        </div>
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          bordered
          :pagination="pagination"
          size="small"
          @change="paginationChange"
          :scroll="scrollOptions"
        >
          <span slot="action" slot-scope="text, record">
            <a-button type="primary" @click="checkLook(record.equipmentDtInstId)"> 检查项查看 </a-button>
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <a-modal title="检查项列表" :visible="modelVisible" :footer="null" @cancel="modelVisible = false">
      <a-table :columns="checkColumns" :data-source="checkData" size="small" bordered :scroll="{ x: 400, y: 500 }"> </a-table>
    </a-modal>
  </div>
</template>
<script>
import { Inspection, guarantee, checkColumns } from "./DevOpsColumns.js";
import moment from "moment";
export default {
  name: "devOps",
  props: {
    assetId: {
      type: [String, Number],
      required: true,
    },
    assetEquipmentId: {
      type: [String, Number],
      required: true,
    },
    organId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      activeKey: "Inspection", // tabs默认展示 第一项，巡检记录
      otherTabOptions: {
        Inspection: {
          tab: "巡检记录",
        },
        maintain: {
          tab: "保养记录",
        },
        guarantee: {
          tab: "保障记录",
        },
      },
      loading: false,
      columns: Inspection,
      dataSource: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
      },
      startValue: moment().subtract(6, "M"),
      endValue: moment(),
      endOpen: false,
      triggerMode: { 1: "手动触发", 2: "自动触发" }, // 触发方式
      snapCheckStatus: { 0: "未抽查", 1: "已抽查" }, // 抽查状态
      statusName: { 0: "未执行", 1: "执行中", 2: "已完成", 3: "超时关闭" }, // 执行状态
      modelVisible: false,
      checkColumns: checkColumns,
      checkData: [],
      scrollOptions: { x: 1800, y: 400 },
    };
  },
  watch: {
    activeKey(value) {
      if (value === "guarantee") {
        this.columns = guarantee;
        (this.scrollOptions = { y: 400 }), this.getEquipmentInstRecordOrder();
      } else {
        this.columns = Inspection;
        (this.scrollOptions = { x: 1800, y: 400 }), this.getEquipmentRecordTask();
      }
    },
  },
  mounted() {
    this.getEquipmentRecordTask();
  },
  methods: {
    moment,
    disabledStartDate(startValue) {
      const endValue = this.endValue;
      if (!startValue || !endValue) {
        return false;
      }
      return startValue.valueOf() > endValue.valueOf();
    },
    disabledEndDate(endValue) {
      const startValue = this.startValue;
      if (!endValue || !startValue) {
        return false;
      }
      return startValue.valueOf() >= endValue.valueOf();
    },
    handleStartOpenChange(open) {
      if (!open) {
        this.endOpen = true;
      }
    },
    handleEndOpenChange(open) {
      this.endOpen = open;
    },
    search(type) {
      if (type !== "pagination") {
        this.$set(this.pagination, "current", 1);
        this.$set(this.pagination, "total", 0);
      }
      if (this.activeKey === "guarantee") {
        this.getEquipmentInstRecordOrder();
      } else {
        this.getEquipmentRecordTask();
      }
    },
    paginationChange(pagination) {
      this.$set(this.pagination, "current", pagination.current);
      this.search("pagination");
    },

    // 获取参数
    GetParameter() {
      let parameter = {
        pageNo: this.pagination.current,
        pageLength: this.pagination.pageSize,
        organId: this.organId,
        equipmentInstId: this.assetEquipmentId,
        beginTime: this.startValue.format("YYYYMMDD"),
        endTime: this.endValue.format("YYYYMMDD"),
      };
      // let parameter = {
      //   pageNo: this.pagination.current,
      //   pageLength: this.pagination.pageSize,
      //   organId: "671024",
      //   equipmentInstId: "5283",
      //   beginTime: "20220101",
      //   endTime: "20221123",
      // };
      if (this.activeKey !== "guarantee") {
        parameter.dtType = this.activeKey === "Inspection" ? "1000" : "2000"; // 1000：巡检  2000：保养
      }
      return parameter;
    },

    // 获取 tableData
    getEquipmentRecordTask() {
      this.loading = true;
      this.dataSource = [];
      this.$api.equipmentview.getEquipmentRecordTask(this.GetParameter()).then((res) => {
        this.loading = false;
        const { code, data, message } = res.data;
        if (code === 0) {
          this.pagination.total = data.paginator.totalCount;
          this.dataSource = data.resultList.map((item, index) => {
            return {
              ...item,
              key: index,
              triggerMode: this.triggerMode[item.triggerMode],
              snapCheckStatus: this.snapCheckStatus[item.snapCheckStatus],
            };
          });
        } else {
          this.$message.error(message || "数据加载失败");
        }
      });
    },

    // 获取 tableData
    getEquipmentInstRecordOrder() {
      this.loading = true;
      this.dataSource = [];
      this.$api.equipmentview.getEquipmentInstRecordOrder(this.GetParameter()).then((res) => {
        this.loading = false;
        const { code, data, message } = res.data;
        if (code === 0) {
          this.pagination.total = data.paginator.totalCount;
          this.dataSource = data.resultList.map((item, index) => {
            return {
              key: index,
              ...item,
            };
          });
        } else {
          this.$message.error(message || "数据加载失败");
        }
      });
    },

    // 检查项查看
    checkLook(equipmentDtInstId) {
      this.modelVisible = true;
      this.checkData = [];
      const parameter = {
        equipmentDtInstId,
        pageNo: 1,
        pageLength: 1000,
        organId: this.organId,
      };
      this.$api.equipmentview.pageEquipmentDtInstAttr(parameter).then((res) => {
        const { code, data, message } = res.data;
        if (code === 0) {
          this.checkData = data.resultList.map((item, index) => {
            return {
              key: index,
              ...item,
            };
          });
        } else {
          this.$message.error(message || "数据加载失败");
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.search {
  margin-bottom: 16px;
}
.searchBtn {
  vertical-align: bottom;
  margin-left: 20px;
}
/deep/ .ant-table-wrapper {
  padding-bottom: 0px !important;
}
</style>
