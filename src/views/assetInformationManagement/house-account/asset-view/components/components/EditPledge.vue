<!--资产视图业务-资产视图列表页面-编辑列表表头组件-->
<template>
  <div class="table_header">
    <a-radio-group :options="options" v-model="checked" @change="change" />
  </div>
</template>

<script>
export default {
  name: 'EditTableHeader',
  props: ['columns', 'options'],
  data() {
    return {
      // checkedList: [], // 选中项,
      checked: 0,
    };
  },
  mounted() {},
  methods: {
    change(val) {
      this.checked = val.target.value;
    },
  },
};
</script>

<style lang="less" scoped>
.table_header {
  .check_all {
    margin-bottom: 10px;
    padding-bottom: 10px;
    border-bottom: 1px solid #e9e9e9;
  }
  & /deep/ .ant-checkbox-group {
    width: 100%;
    .ant-checkbox-group-item {
      width: 23%;
      padding: 5px 0;
    }
    // & :nth-child(6) {
    //   width: 258px;
    // }
  }
}
</style>
