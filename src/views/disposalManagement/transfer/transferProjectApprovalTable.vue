<template>
  <SG-Modal
    v-model="status"
    title="
关联资产转让立项单"
    @ok="confirm"
    :isRoll="false"
    @cancel="cancel"
  >
    <a-table v-bind="tableOptions" :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"> </a-table>
    <SG-FooterPagination
      location="static"
      size="small"
      :pageLength="pageInfo.pageSize"
      :totalCount="tableTotal"
      :noPageTools="true"
      v-model="pageInfo.pageNum"
      @change="changePage"
    />
  </SG-Modal>
</template>

<script>
// import moment from "moment";
export default {
  // 资产转让立项
  name: 'transferProjectApprovalTable',
  props: {
    organId: {
      type: [String, Number],
      require: true,
    },
    projectId: {
      type: [String, Number],
      require: true,
    },
    value: {
      type: String,
    },
  },
  data() {
    return {
      selectedRowKeys: [],
      status: true,
      tableTotal: 0,
      pageInfo: {
        pageSize: 10,
        pageNum: 1,
      },
      tableOptions: {
        rowKey: 'applyId',
        loading: false,
        size: 'middle',
        scroll: { y: 300 },
        columns: [
          {
            title: '立项单ID',
            dataIndex: 'applyId',
          },
          {
            title: '所属机构',
            dataIndex: 'organName',
          },
          {
            title: '资产转让立项单名称',
            dataIndex: 'name',
          },
          {
            title: '资产项目',
            dataIndex: 'projectName',
          },
          {
            title: '预估转让价格(元)',
            dataIndex: 'listingPrice',
          },
          {
            title: '提交人',
            dataIndex: 'create',
          },
        ],
        dataSource: [],
        pagination: false,
      },
    };
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys.slice(selectedRowKeys.length - 1);
    },
    confirm() {
      if (this.selectedRowKeys.length === 0) {
        this.$message.error('请选择一个资产转让立项单');
        return;
      }
      this.$emit('input', this.selectedRowKeys.toString());
      this.$emit('cancel');
    },
    cancel() {
      this.$emit('cancel');
    },
    changePage({ pageNo, pageLength }) {
      this.pageInfo.pageNum = pageNo;
      this.pageInfo.pageSize = pageLength;
      this.getTableDataSource();
    },
    async getTableDataSource() {
      this.$set(this.tableOptions, 'loading', true);
      let req = this.handleSearchReq();
      const mockData = await this.$api.transfer.getList(req);
      const {
        data: { code, message, data },
      } = mockData;
      this.$set(this.tableOptions, 'loading', false);
      if (code === '0') {
        this.tableTotal = data.count;
        this.tableOptions.dataSource = data ? data.data : [];
      } else {
        this.$message.error(message);
      }
    },

    handleSearchReq() {
      return {
        type: 2,
        organId: this.organId,
        name: '',
        projectIds: this.projectId ? this.projectId.toString().split(',') : [],
        apprStatus: [],
        startTime: '',
        endTime: '',
        pageNum: this.pageInfo.pageNum,
        pageSize: this.pageInfo.pageSize,
      };
    },
  },
  mounted() {
    if (this.organId) {
      this.getTableDataSource();
    }
  },
};
</script>

<style scoped>
.contentForm {
  display: flex;
}
.contentForm-main {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex: 1;
  flex-wrap: wrap;
}
.contentForm-btn {
  flex-basis: 100px;
}
</style>
