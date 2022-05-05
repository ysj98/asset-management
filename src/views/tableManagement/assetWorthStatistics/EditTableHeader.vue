<!--资产视图业务-资产视图列表页面-编辑列表表头组件-->
<template>
  <div class="table_header">
    <!--<div class="check_all">-->
      <!--<a-checkbox :indeterminate="indeterminate" @change="handleCheckAll" :checked="checkAll">-->
        <!--全选-->
      <!--</a-checkbox>-->
    <!--</div>-->
    <a-checkbox-group :options="$addTitle(options)" v-model="checkedList"/>
  </div>
</template>

<script>
  export default {
    name: 'EditTableHeader',
    props: ['columns', 'checkedArr', 'disabledHeader'],
    data () {
      return {
        // checkAll: false, // 全选
        checkedList: ['projectName', 'businessUnit', 'organName'], // 选中项,
        // indeterminate: false, // 全选按钮是否与checkGroup联动
        // disabledHeader: ['projectName', 'businessUnit', 'organName'] // 不可选的列头
      }
    },
    computed: {
      options: function () {
        return this.columns.map(item => {
          let bool = this.disabledHeader.includes(item.dataIndex)
          return {
            label: item.title,
            value: item.dataIndex,
            checked: bool,
            disabled: bool
          }
        }).filter(m => m.value !== 'action')
      }
    },

    mounted () {
      // 初始化值
      const {checkedArr} = this
      Object.assign(this, {
        checkedList: checkedArr,
        // checkAll: checkedArr.length === columns.length - 1,
        // indeterminate: !!checkedArr.length && checkedArr.length < columns.length
      })
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
    }
  }
</style>
