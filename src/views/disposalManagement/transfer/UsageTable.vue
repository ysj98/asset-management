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
  name: "UsageTable",
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
            title: "使用状况",
            dataIndex: "busiStatus",
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
