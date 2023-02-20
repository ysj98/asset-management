<template>
  <div>
    <a-table v-bind="tableOptions"></a-table>
    <SG-FooterPagination
      v-if="false"
      :pageLength="pageInfo.pageSize"
      :totalCount="tableTotal"
      :noPageTools="true"
      v-model="pageInfo.pageNum"
      @change="changePage"
    />
  </div>
</template>

<script>
export default {
  name: "LeaseTable",
  props: {
    dataSource: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  watch: {
    dataSource: {
      handler(newValue) {
        if (newValue.length) {
          this.tableOptions.dataSource = newValue.map((ele) => ({
            ...ele,
            _key: Math.random(),
          }));
        }
      },
      immediate: true,
    },
  },
  data() {
    return {
      tableTotal: 0,
      pageInfo: {
        pageNum: 1,
        pageLength: 10,
      },
      tableOptions: {
        scroll: { y: 500, x: 600 },
        dataSource: [],
        columns: [
          {
            title: "序号",
            customRender: (text, record, index) => {
              return (this.pageInfo.pageNum - 1) * 10 + 1 + index;
            },
          },
          {
            title: "房间",
            dataIndex: "resName",
          },
          {
            title: "历史承租人",
            dataIndex: "secondName",
          },
          {
            title: "承租时间",
            width: 200,
            key: "startAndEndDateFormat",
            customRender(text, record) {
              if (record.startDateFormat && record.endDateFormat) {
                return `${record.startDateFormat} 至 ${record.endDateFormat}`;
              } else {
                return "";
              }
            },
          },
          {
            title: "承租金额（元）",
            dataIndex: "allRent",
          },
          {
            title: "承租单价（元）",
            dataIndex: "rentAveragePrice",
          },
        ],
        rowKey: "_key",
        pagination: false,
      },
    };
  },
  methods: {
    changePage({ pageNo, pageLength }) {
      this.pageInfo.pageNum = pageNo;
      this.pageInfo.pageSize = pageLength;
    },
  },
};
</script>

<style scoped></style>
