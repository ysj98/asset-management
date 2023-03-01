<template>
  <div>
    <a-table v-bind="tableOptions"></a-table>
    <SG-FooterPagination v-if="tableOptions.dataSource.length" v-bind="pageObj" @change="changePage" />
  </div>
</template>

<script>
export default {
  // 相关费用
  name: 'RelatedCosts',
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
        rowKey: '_key',
        scroll: { x: '100%', y: 600 },
        dataSource: [],
        columns: [
          { title: '类别', dataIndex: 'reportBillIdName' },
          { title: '费用/收入类型', dataIndex: 'incomeType' },
          { title: '费用/收入名称', dataIndex: 'incomeName' },
          { title: '所属月份', dataIndex: 'month' },
          { title: '金额(元)', dataIndex: 'amount' },
          { title: '单价', dataIndex: 'unitPrice' },
          { title: '读数', dataIndex: 'readNumber' },
          { title: '用量', dataIndex: 'useLevel' },
          { title: '是否结清', dataIndex: 'settleUpName' },
          { title: '备注', dataIndex: 'remark' },
        ],
        pagination: false,
      },
    };
  },
  methods: {
    changePage({ pageNo, pageLength }) {
      this.pageObj.pageNo = pageNo;
      this.pageObj.pageLength = pageLength;
      this.assetExpenseInfo();
    },
    assetExpenseInfo() {
      const { pageNo, pageLength } = this.pageObj;
      const req = {
        assetId: this.assetId,
        pageNum: pageNo,
        pageSize: pageLength,
        // 固定3
        sourceType: 3,
      };
      this.$api.assets.assetExpenseInfo(req).then(({ data: { code, message, data } }) => {
        if (code === '0') {
          const resData = data || {};
          this.pageObj.totalCount = resData.count || 0;
          this.tableOptions.dataSource = (resData.data || []).map((ele) => {
            return {
              ...ele,
              _key: Math.random(),
            };
          });
        } else {
          this.$message.error(message);
        }
      });
    },
  },
  mounted() {
    this.assetExpenseInfo();
  },
};
</script>

<style scoped></style>
