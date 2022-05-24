<template>
  <div>
    <a-table v-bind="tableOptions"></a-table>
    <SG-FooterPagination
      v-if="tableOptions.dataSource.length"
      v-bind="pageObj"
      @change="changePage"
    />
  </div>
</template>

<script>
export default {
  // 附属配套
  name: "AncillaryPackage",
  props: {
    assetId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      pageObj: {
        pageLength: 10,
        pageNo: 1,
        totalCount: 0,
        noPageTools: false,
      },
      tableOptions: {
        rowKey: "matchingName",
        scroll: { x: "100%", y: 600 },
        dataSource: [],
        columns: [
          { title: "名称", dataIndex: "matchingName" },
          { title: "编号", dataIndex: "matchingCode" },
          { title: "类型", dataIndex: "matchingTypeName" },
          { title: "规格型号", dataIndex: "specificationType" },
          { title: "登记日期", dataIndex: "createTime" },
          { title: "价值(元)", dataIndex: "value" },
          { title: "数量", dataIndex: "number" },
          { title: "计量单位", dataIndex: "unitOfMeasurementName" },
          { title: "使用情况", dataIndex: "statusName" },
          { title: "是否接管前配套&配套", dataIndex: "isBeforeName" },
          { title: "备注", dataIndex: "remark" },
        ],
        pagination: false,
      },
    };
  },
  methods: {
    changePage({ pageNo, pageLength }) {
      this.pageObj.pageNo = pageNo;
      this.pageObj.pageLength = pageLength;
      this.getMatchingListByAssetId();
    },
    getMatchingListByAssetId() {
      const { pageNo, pageLength } = this.pageObj;
      const req = {
        assetId: this.assetId,
        pageNum: pageNo,
        pageSize: pageLength,
      };
      this.$api.assets
        .getMatchingListByAssetIdPage(req)
        .then(({ data: { code, message, data } }) => {
          if (code === "0") {
            const resData = data || {};
            this.pageObj.totalCount = resData.count || 0;
            this.tableOptions.dataSource = resData.data || [];
          } else {
            this.$message.error(message);
          }
        });
    },
  },
  mounted() {
    this.getMatchingListByAssetId();
  },
};
</script>

<style scoped></style>
