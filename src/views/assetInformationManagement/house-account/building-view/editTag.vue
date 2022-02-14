<!--资产视图业务-资产视图列表页面-编辑列表表头组件-->
<template>
  <div class="table_header">
    <a-checkbox-group :options="options" v-model="checkedList"/>
  </div>
</template>

<script>
  export default {
    name: 'EditTableHeader',
    props: ['columns', 'checkedArr', 'options'],
    data () {
      return {
        // checkAll: false, // 全选
        checkedList: [], // 选中项,
        // indeterminate: false, // 全选按钮是否与checkGroup联动
        // disabledHeader: ['organName', 'warrantNbr'] // 不可选的列头
        // options: []
      }
    },
    // computed: {
    //   options: function () {
    //     return this.columns.map(item => {
    //       let bool = this.disabledHeader.includes(item.dataIndex)
    //       return {
    //         label: item.title,
    //         value: item.dataIndex,
    //         checked: bool,
    //         disabled: bool
    //       }
    //     }).filter(m => m.value !== 'action')
    //   }
    // },
    mounted (){
      // this.getAssetLabel('110111101')
    },
    methods: {
      
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
