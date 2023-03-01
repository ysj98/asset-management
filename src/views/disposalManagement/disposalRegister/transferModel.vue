<template>
  <SG-Modal
    v-model="show"
    width="800px"
    title="资产转让清单"
    okText="确定"
    @ok="quickFn"
    @cancel="
      () => {
        show = false;
      }
    "
  >
    <a-table
      :columns="tableInfo.columns"
      :dataSource="tableInfo.data"
      :pagination="false"
      :scroll="tableInfo.scroll"
      :rowKey="(record) => record.id"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
      }"
    >
    </a-table>
    <SG-FooterPagination
      :pageLength="searchData.pageSize"
      :totalCount="tableInfo.total"
      :noPageTools="false"
      v-model="searchData.pageNum"
      @change="changePage"
    />
  </SG-Modal>
</template>
<script>
const column = [
  {
    title: '申请单ID',
    dataIndex: 'applyId',
  },
  {
    title: '所属机构',
    dataIndex: 'organName',
  },
  {
    title: '申请单名称',
    dataIndex: 'name',
  },
  {
    title: '资产项目',
    dataIndex: 'projectName',
  },
  {
    title: '挂牌价格(元)',
    dataIndex: 'listingPrice',
  },
  {
    title: '提交人',
    dataIndex: 'create',
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
  },
];
export default {
  props: {
    organId: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      selectedRows: [],
      selectedRowKeys: [],
      tableInfo: {
        data: [],
        columns: column,
        scroll: {},
        total: 0,
      },
      searchData: {
        pageNum: 1,
        pageSize: 10,
      },
      show: false,
    };
  },
  methods: {
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      this.selectedRows = selectedRows;
    },
    changePage({ pageNo, pageLength }) {
      this.searchData.pageNum = pageNo;
      this.searchData.pageSize = pageLength;
      this.getTemList();
    },
    getTableList() {
      const params = {
        organId: this.organId,
        apprStatus: ['1'],
        ...this.searchData,
      };
      this.$api.disposalManagement.getTransferList(params).then((res) => {
        if (res.data.code === '0') {
          let data = res.data.data.data;
          console.log(data);
          this.tableInfo.data = data;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    quickFn() {
      this.$emit('transferlist', this.selectedRows);
      this.show = false;
      this.selectedRows = [];
      this.selectedRowKeys = [];
    },
  },
  watch: {
    show(val) {
      if (val) {
        this.getTableList();
      }
    },
  },
};
</script>
