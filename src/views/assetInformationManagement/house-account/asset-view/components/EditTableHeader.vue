<!--资产视图业务-资产视图列表页面-编辑列表表头组件-->
<template>
  <div class="table_header">
    <div class="check_all">
      <a-checkbox :indeterminate="indeterminate" @change="handleCheckAll" :checked="checkAll">
        全选
      </a-checkbox>
    </div>
    <a-checkbox-group :options="options" v-model="checkedList"/>
  </div>
</template>

<script>
  export default {
    name: 'EditTableHeader',
    props: ['columns', 'checkedArr'],
    data () {
      return {
        checkAll: false, // 全选
        checkedList: [], // 选中项,
        indeterminate: false // 全选按钮是否与checkGroup联动
      }
    },

    methods: {
      // 处理全选操作
      handleCheckAll(e) {
        Object.assign(this, {
          indeterminate: false,
          checkAll: e.target.checked,
          checkedList: e.target.checked ? this.options.map(n => n.value) : []
        })
      },
    },
    
    watch: {
      // 处理单项选择
      checkedList (list) {
        // 至少保留一个被选中
        // if (!list.length) {
        //   this.$message.info('请留一个活口吧o(╥﹏╥)o')
        //   return this.checkedList = pre
        // }
        this.checkAll = list.length === this.options.length;
        this.indeterminate = !!list.length && list.length < this.options.length;
      },
    },
    
    computed: {
      options: function () {
        return this.columns.map(item => ({label: item.title, value: item.dataIndex})).filter(m => m.value !== 'action')
      }
    },
    
    mounted () {
      // 初始化值
      const {checkedArr, columns} = this
      Object.assign(this, {
        checkedList: checkedArr,
        checkAll: checkedArr.length === columns.length - 1,
        indeterminate: !!checkedArr.length && checkedArr.length < columns.length
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
