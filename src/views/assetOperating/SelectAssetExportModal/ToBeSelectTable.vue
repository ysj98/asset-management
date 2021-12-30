<template>
  <div>
    <a-table
      class="custom-table"
      v-bind="tableOptions"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    ></a-table>
    <SG-FooterPagination
      v-model="pageForm.pageNum"
      :pageLength="pageForm.pageSize"
      :totalCount="totalCount"
      :noPageTools="true"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { columns } from "@/views/assetOperating/SelectAssetExportModal/share";
import { quickSort } from "utils/utils";

export default {
  name: "ToBeSelectTable",
  inject: ["sonData"],
  props: {
    selectTableData: {
      type: Array,
    },
  },
  data() {
    return {
      pageForm: {
        pageSize: 10,
        pageNum: 1,
      },
      totalCount: 0,
      tableOptions: {
        rowKey: function (record) {
          return record.assetId;
        },
        scroll: { x: 560, y: 600 },
        columns: columns,
        dataSource: [],
        pagination: false,
      },
      selectedRowKeys: [],
    };
  },
  watch: {
    selectTableData: {
      handler(newValue) {
        this.initSelectedRowKeys(newValue);
      },
    },
    // selectedRowKeys: {
    //   handler(newValue, oldValue) {
    //     console.log("newValue-selectedRowKeys", newValue);
    //     const a = [...newValue];
    //     const b = [...oldValue];
    //     quickSort(a);
    //     quickSort(b);
    //     if (
    //       a &&
    //       b &&
    //       a.length === b.length &&
    //       a.every((ele, index) => ele === b[index])
    //     ) {
    //       return null;
    //     }
    //     // const arr = [...this.tableOptions.dataSource, ...this.selectTableData];
    //     // const res = arr.filter((ele) => newValue.includes(ele.assetId));
    //     // TODO: 编辑情况下,待选资产列表不存在之前已经保存的数据
    //     const res = this.tableOptions.dataSource.filter((ele) => {
    //       return newValue.includes(ele.assetId);
    //     });
    //     this.$emit("update:selectTableData", [...this.selectTableData, ...res]);
    //   },
    // },
  },
  computed: {
    assetType() {
      return this.sonData.assetType();
    },
    organInfo() {
      return this.sonData.organInfo();
    },
  },
  methods: {
    initSelectedRowKeys(selectTableData) {
      this.selectedRowKeys = selectTableData.map((ele) => ele.assetId);
      console.log("this.selectedRowKeys", this.selectedRowKeys);
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      const arr = [...this.selectTableData, ...selectedRows];
      // TODO: 可优化
      const result = [];
      arr.forEach((ele) => {
        if (result.findIndex((item) => item.assetId === ele.assetId) === -1) {
          result.push(ele);
        }
      });
      this.$emit("update:selectTableData", result);
    },
    handleChange({ pageNo, pageLength }) {
      this.pageForm = {
        pageSize: pageLength,
        pageNum: pageNo,
      };
      this.getTableData();
    },
    async getTableData() {
      const req = {
        ...this.pageForm,
        assetType: this.assetType,
        organId: this.organInfo.organId,
        isTransferOperation: 0,
        queryType: 8,
      };
      const {
        data: { data, code, message },
      } = await this.$api.assets.assetListPage(req);
      if (code === "0") {
        this.tableOptions.dataSource = data ? data.data : [];
        this.totalCount = data.count;
      } else {
        this.$message.error(message);
      }
    },
  },
  mounted() {
    this.getTableData();
  },
};
</script>

<style scoped></style>
