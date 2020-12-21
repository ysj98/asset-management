// 承租人
<template>
  <SG-Modal
    v-model="show"
    :width="960"
    wrapClassName="newMember"
    :noPadding="true"
    :maskClosable="false"
    :footer="null"
  >
    <template #title>
      <div style="font-size: 16px">选择客户</div>
    </template>
    <div class="content">
      <!-- 输入框 -->
      <div class="search_box">
        <a-input
          placeholder="请输入客户名称"
          v-model="custName"
          style="width: 150px; margin-left: 500px"
          @pressEnter="onPressEnter()"
        />
        <a-input
          placeholder="请输入联系电话"
          v-model="custPhone"
          style="width: 150px; margin-left: 20px"
          @pressEnter="onPressEnter()"
        />
        <SG-Button
          @click="search"
          type="primary"
          icon="search"
          style="margin-left: 20px"
          >查询</SG-Button
        >
      </div>
      <!-- 表格 -->
      <a-table :columns="columns" :data-source="tableData" align="center">
        <template slot="operation"
          ><!--  slot-scope="text, record" -->
          <a>选择</a>
        </template>
      </a-table>
    </div>
  </SG-Modal>
</template>

<script>
const columns = [
  {
    title: "客户名称",
    dataIndex: "custName",
  },
  {
    title: "客户类型",
    dataIndex: "custPubTypeName",
  },
  {
    title: "联系电话",
    dataIndex: "custPhone",
  },
  {
    title: "证件类型",
    dataIndex: "certlTypeName",
  },
  {
    title: "证件号码",
    dataIndex: "certlNbr",
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
  },
];
export default {
  data() {
    return {
      columns,
      show: true,
      searchVal: "",
      custPhone: "",
      custName: "",
      tableData: [],
    };
  },
  methods: {
    // 按钮搜索
    search() {},
    // 回车搜索
    onPressEnter() {
      console.log("名称", this.custName, "电话", this.custPhone);
    },
  },
};
</script>

<style lang="less" scoped>
.newMember {
  .content {
    padding: 0 15px;
    .search_box {
      display: flex;
      height: 60px;
      background-color: gray;
      align-items: center;
    }
  }
}
</style>
