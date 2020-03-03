<!--呈报任务-我审批的任务列表页面-->
<template>
  <div class="approve_task">
    到此一游
    <!--搜索条件-->
    <!--<a-row>-->
      <!--<a-col :span="6">-->
        <!--<SG-Button icon="export" :loading="exportBtnLoading" style="margin-left: 10px">导出</SG-Button>-->
      <!--</a-col>-->
      <!--<a-col :span="6">-->
        <!--<a-select-->
          <!--placeholder="审核状态"-->
          <!--v-model="approveStatus"-->
          <!--:options="statusOptions"-->
          <!--:filterOption="filterOption"-->
        <!--/>-->
      <!--</a-col>-->
    <!--</a-row>-->
  </div>
</template>

<script>
  export default {
    name: 'index',
    data () {
      return {
        exportBtnLoading: false, // 导出按钮loading
        approveStatus: 'all', // 审核状态
        statusOptions: [
          { title: '全部审核状态', key: 'all' }
        ], // 资产项目选项
      }
    },

    methods: {
      // Select 组件查询过滤
      filterOption (input, option) {
        return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      }
    }
  }
</script>

<style lang='less' scoped>

</style>
