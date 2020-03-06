<!--呈报任务-入口页面-->
<template>
  <div class="custom-tabs">
    <a-tabs v-model="key" type="card" :tabBarGutter="10">
      <a-tab-pane tab="我填报的任务" key="1">
        <!--<edit-task/>-->
      </a-tab-pane>
      <a-tab-pane tab="我审核的任务" key="2">
        <!--<approve-task :refreshKey="refreshKey"/>-->
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import EditTask from './editTask'
  import ApproveTask from './approveTask'
  export default {
    name: 'index',
    components: { ApproveTask, EditTask },
    data () {
      return {
        key: '1', // Tab key
        refreshKey: 0 // 更新记录key
      }
    },
    // 路由卫士，用于审批及提交成功后刷新列表
    beforeRouteEnter (to, from, next) {
      const { name } = from
      const { params: { refresh } } = to
      next(vm => {
        // 通过 `vm` 访问组件实例
        if ((name === '审核任务' || name === '新建任务' || name === '填报数据') && refresh) {
          vm.refreshKey = new Date().getTime()
        }
      })
    }
  }
</script>

<style lang='less' scoped>
  .custom-tabs {
    /deep/ .custom_date {
      .prefix_style {
        float: left;
        color: #C0C7D1;
        line-height: 30px;
        text-align: center;
        border: 1px solid #d9d9d9;
        border-right: none;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      .date_picker_style {
        display: block;
        margin-left: 69px;
        & /deep/ .ant-calendar-picker-input {
          border-top-left-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
        }
      }
    }
    /deep/ .action_text {
      color: #0084FF;
      cursor: pointer;
      margin-right: 12px;
      white-space: nowrap;
    }
  }
</style>
