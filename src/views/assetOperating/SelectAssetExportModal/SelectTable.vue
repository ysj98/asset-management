<template>
  <div>
    <div style="margin-bottom: 10px">
      <SG-Button type="primary" @click="handleExport"> 导出 </SG-Button>
    </div>
    <a-table class="custom-table" v-bind="tableOptions">
      <template #action="text, reocrd">
        <a style="color: red" @click="handleDel(reocrd)">删除</a>
      </template>
    </a-table>
  </div>
</template>

<script>
import { columns } from "./share.js";
import { handleDownloadFile } from "utils/utils";
export default {
  name: "SelectTable",
  inject: ["sonData"],
  props: {
    selectTableData: {
      type: Array,
    },
  },
  data() {
    return {
      tableOptions: {
        rowKey: function (record) {
          return record.assetId;
        },
        scroll: { x: 560, y: 600 },
        columns: [
          ...columns,
          {
            title: "操作",
            scopedSlots: {
              customRender: "action",
            },
          },
        ],
        dataSource: [],
        pagination: false,
      },
    };
  },
  computed: {
    assetType() {
      return this.sonData.assetType();
    },
    organInfo() {
      return this.sonData.organInfo();
    },
  },
  watch: {
    selectTableData: {
      handler(newValue) {
        this.intiTableData(newValue);
      },
      immediate: true,
    },
  },
  methods: {
    async handleExport() {
      const assetIdList = this.selectTableData.map((ele) => ele.assetId);
      //TODO:入参待完善
      const req = {
        organId: this.organInfo.organId,
        assetType: this.assetType,
        queryType: 8,
        assetIdList,
      };
      const responseData = await this.$api.toOperation.exportAsset(req);
      if (
        Object.prototype.toString.call(responseData.data) === "[object Blob]"
      ) {
        handleDownloadFile({
          data: responseData.data,
          fileName: "资产转运营模板.xls",
        });
      } else {
        this.$SG_Message.error(responseData.data.message);
      }
    },
    handleDel(record) {
      const selectTableData = this.selectTableData.filter(
        (ele) => ele.assetId !== record.assetId
      );
      this.$emit("update:selectTableData", selectTableData);
    },
    intiTableData() {
      this.tableOptions.dataSource = this.selectTableData;
    },
  },
};
</script>

<style scoped></style>
