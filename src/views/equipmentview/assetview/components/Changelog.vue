<template>
  <div>
    <a-table v-bind="tableOptions"></a-table>
  </div>
</template>

<script>
export default {
  // 变动记录
  name: "Changelog",
  props: {
    assetId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      tableOptions: {
        rowKey: "changeOrderDetailId",
        scroll: { x: "100%", y: 600 },
        dataSource: [],
        columns: [
          { title: "变动编号", dataIndex: "changeOrderDetailId" },
          { title: "变动类型", dataIndex: "changeTypeName" },
          { title: "变动前信息", dataIndex: "oldChangeInfo" },
          { title: "变动后信息", dataIndex: "changeInfo" },
          { title: "变动时间", dataIndex: "changeDate" },
          { title: "变动人", dataIndex: "createByName" },
        ],
        pagination: false,
      },
    };
  },
  methods: {
    queryChangeDetail() {
      const req = {
        assetId: this.assetId,
      };
      this.$api.assets
        .queryAssetViewChangeDetail(req)
        .then(({ data: { code, message, data } }) => {
          if (code === "0") {
            this.tableOptions.dataSource = data || [];
          } else {
            this.$message.error(message);
          }
        });
    },
  },
  mounted() {
    this.queryChangeDetail();
  },
};
</script>

<style scoped></style>
