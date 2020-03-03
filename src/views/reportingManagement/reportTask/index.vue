<!--呈报任务-入口页面-->
<template>
  <div class="custom-tabs">
    <a-tabs v-model="key" type="card" :tabBarGutter="10">
      <a-tab-pane tab="我填报的任务" key="1">
        <edit-task/>
      </a-tab-pane>
      <a-tab-pane tab="我审核的任务" key="2">
        <approve-task :refreshKey="refreshKey"/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import ApproveTask from './approveTask'
  import EditTask from './editTask'
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
        if ((name === '价值登记新增' || name === '价值登记审批' || name === '价值登记编辑') && refresh) {
          vm.refreshKey = new Date().getTime()
        }
      })
    }
  }
</script>
