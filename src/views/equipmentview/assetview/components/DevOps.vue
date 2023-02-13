<template>
  <div class="devOps">
    <a-tabs>
      <a-tab-pane v-for="(item, key) in otherTabOptions" :key="key" :tab="item.tab" v-model="activeKey">
        <div class="search">
          <a-range-picker v-model="RangePicker" @change="RangePickerOnChange" />
          <a-button icon="search" class="searchBtn"> 查询 </a-button>
        </div>
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          bordered
          :pagination="pagination"
          size="middle"
          @change="paginationChange"
        >
          <span slot="action" slot-scope="text, record">
            <a-button type="primary" @click="checkLook(record.equipmentDtInstId)"> 检查项查看 </a-button>
          </span>
        </a-table>
      </a-tab-pane>
    </a-tabs>

    <a-modal title="检查项列表" :visible="modelVisible" :footer="null" @cancel="modelVisible = false">
      <a-table :columns="checkColumns" :data-source="checkData" size="small" :scroll="{ x: 400, y: 500 }"> </a-table>
    </a-modal>
  </div>
</template>
<script>
import { Inspection, guarantee, checkColumns } from "./DevOps.js";
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
      RangePicker: [moment(), moment()],
      triggerMode: { 1: "手动触发", 2: "自动触发" }, // 触发方式
      snapCheckStatus: { 1: "已抽查" }, // 抽查状态
      statusName: { 0: "未执行", 1: "执行中", 2: "已完成", 3: "超时关闭" }, // 执行状态
      modelVisible: false,
      checkColumns: checkColumns,
      checkData: [],
    };
  },
  watch: {
    activeKey(value) {
      if (value === "guarantee") {
        this.columns = guarantee;
      } else {
        this.columns = Inspection;
        this.getEquipmentRecordTask();
      }
    },
  },
  mounted() {
    this.getEquipmentRecordTask();
  },
  methods: {
    moment,
    RangePickerOnChange(date, dateString) {
      console.log(date, dateString);
    },
    paginationChange() {},

    // 获取参数
    GetParameter() {
      let parameter = {
        pageNo: this.pagination.current,
        pageLength: this.pagination.pageLength,
        organId: this.organId,
        equipmentInstId: this.assetEquipmentId,
        beginTime: this.RangePicker[0].format("YYYYMMDD"),
        endTime: this.RangePicker[1].format("YYYYMMDD"),
      };
      if (this.activeKey !== "guarantee") {
        parameter.dtType = this.activeKey === "Inspection" ? "1000" : "2000"; // 1000：巡检  2000：保养
      }
      return parameter;
    },

    // 获取 tableData
    getEquipmentRecordTask() {
      this.loading = true;
      this.$api.equipmentview.getEquipmentRecordTask(this.GetParameter()).then((res) => {
        this.loading = false;
        const { code, data, message } = res.data;
        if (code === "0") {
          this.pagination.total = data.paginator.totalCount;
          this.dataSource = data.resultList.map((item) => {
            return {
              ...item,
              triggerMode: this.triggerMode[item.triggerMode],
              snapCheckStatus: this.snapCheckStatus[item.snapCheckStatus],
              statusName: this.statusName[item.statusName],
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
      this.$api.equipmentview.getEquipmentInstRecordOrder(this.GetParameter()).then((res) => {
        this.loading = false;
        const { code, data, message } = res.data;
        if (code === "0") {
          this.pagination.total = data.paginator.totalCount;
          this.dataSource = data.resultList.map((item) => {
            return {
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
      const parameter = {
        equipmentDtInstId,
        pageNo: 1,
        pageLength: 1000,
        organId: this.organId,
      };
      this.$api.equipmentview.pageEquipmentDtInstAttr(parameter).then((res) => {
        const { code, data, message } = res.data;
        if (code === "0") {
          this.dataSource = data.resultList.map((item) => {
            return {
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
</style>
