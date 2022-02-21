<!--资产视图业务-资产视图列表页面-编辑列表表头组件-->
<template>
  <div class="table_header">
    <a-checkbox-group :options="options" v-model="checkedList" @change="change"/>
  </div>
</template>

<script>
  export default {
    name: 'EditTableHeader',
    props: ['columns', 'checkedArr', 'options'],
    data () {
      return {
        checkedList: [], // 选中项,
        labelName: []
      }
    },
    mounted (){
    },
    methods: {
      change(){
        this.labelName = this.checkedList.map(item => {
          return this.options.find(sub => sub.value == item).title
        })
      }
    }
  }
</script>

<style lang='less' scoped>
  .table_header {
    .check_all {
      margin-bottom: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #E9E9E9;
    }
    & /deep/ .ant-checkbox-group {
      width: 100%;
      .ant-checkbox-group-item {
        width: 23%;
        padding: 5px 0;
      }
      & :nth-child(6) {
        width: 258px;
      }
    }
  }
</style>
