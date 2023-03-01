// 承租人
<template>
  <SG-Modal v-model="show" :width="960" wrapClassName="tenantModal" :noPadding="true" :maskClosable="false" :footer="null">
    <template #title>
      <div style="font-size: 16px">选择客户</div>
    </template>
    <div class="content">
      <!-- 输入框 -->
      <div class="search_box">
        <treeSelect @changeTree="changeTree" placeholder="请选择组织机构" :allowClear="false" style="width: 150px; margin-left: 330px"></treeSelect>
        <a-input placeholder="请输入客户名称" v-model="custName" style="width: 150px; margin-left: 20px" @pressEnter="onPressEnter()" />
        <a-input placeholder="请输入联系电话" v-model="custPhone" style="width: 150px; margin-left: 20px" @pressEnter="onPressEnter()" />
        <SG-Button @click="search" type="primary" icon="search" style="margin-left: 20px">查询</SG-Button>
      </div>
      <!-- 表格 -->
      <a-table :columns="columns" :data-source="tableData" :pagination="false" :bordered="true" size="small">
        <template slot="operation" slot-scope="text, record">
          <a @click="chose(record)">选择</a>
        </template>
      </a-table>
      <SG-FooterPagination
        :pageLength="pagination.pageLength"
        :totalCount="pagination.totalCount"
        location="absolute"
        :noPageTools="true"
        v-model="pagination.pageNo"
        @change="handleChange"
      />
    </div>
  </SG-Modal>
</template>

<script>
const columns = [
  {
    title: '客户名称',
    dataIndex: 'custName',
    align: 'center',
  },
  {
    title: '客户类型',
    dataIndex: 'custPubTypeName',
    align: 'center',
    width: 150,
  },
  {
    title: '联系电话',
    dataIndex: 'custPhone',
    align: 'center',
    width: 190,
  },
  {
    title: '证件类型',
    dataIndex: 'certiTypeName',
    align: 'center',
    width: 150,
  },
  {
    title: '证件号码',
    dataIndex: 'certiNbr',
    align: 'center',
    width: 220,
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
    align: 'center',
    width: 75,
  },
];
import TreeSelect from '../../common/treeSelect';
export default {
  data() {
    return {
      columns,
      show: false,
      searchVal: '',
      custPhone: '',
      custName: '',
      tableData: [],
      custObj: {
        organId: '',
        custName: '',
        custPhone: '',
        custState: 1,
        pageNum: 1,
        pageSize: 10,
      },
      pagination: {
        pageLength: 10,
        totalCount: 0,
        pageNo: '1',
      },
    };
  },
  components: { TreeSelect },

  watch: {
    /*     organID: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.custObj.organId = val;
          this.query();
          // console.log('子组件organId',val);
        }
      },
    }, */
    show(newVal) {
      if (newVal === false) {
        this.$emit('input', newVal);
      }
    },
  },
  /*   props: {
    organID: {
      type: Number,
      default: 1,
    },
  }, */
  methods: {
    // 客户列表
    query() {
      this.$api.assetRent.queryCustUserInPageList(this.custObj).then((res) => {
        // console.log("客户列表", res);
        res.data.data.data.forEach((item, index) => {
          item.key = index;
        });
        this.tableData = res.data.data.data;
        this.pagination.totalCount = res.data.data.count;
      });
    },
    // 机构树选择
    changeTree(value, label) {
      // console.log(value, label);
      this.custName = '';
      this.custPhone = '';
      this.pagination.pageNo = '1';
      this.custObj = {
        organId: value,
        custName: '',
        custPhone: '',
        custState: 1,
        pageNum: 1,
        pageSize: 10,
      };
      this.query();
    },
    // 按钮搜索
    search() {
      this.onPressEnter();
    },
    // 回车搜索
    onPressEnter() {
      this.custObj.pageNum = 1;
      this.pagination.pageNo = '1';
      this.custObj.custName = this.custName;
      this.custObj.custPhone = this.custPhone;
      this.query();
    },
    // 页码改变
    handleChange(page) {
      // console.log(page);
      this.custObj.pageNum = page.pageNo;
      this.query();
    },
    // 选择承租人
    chose(val) {
      // 返回一个用户对象 调用组件时需要用getTenantList方法接收
      this.$emit('getTenantList', val);
      this.show = false;
    },
  },
};
</script>

<style lang="less" scoped>
.tenantModal {
  .content {
    padding: 0 15px;
    padding-bottom: 55px;
    .search_box {
      display: flex;
      height: 60px;
      align-items: center;
    }
  }
}
/deep/.ant-table-thead {
  th div {
    text-align: center;
  }
}
</style>
