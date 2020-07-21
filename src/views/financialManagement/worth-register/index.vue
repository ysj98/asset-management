<!--账务管理业务--价值登记入口页面-->
<template>
  <div class="custom-tabs">
    <asset-worth-register :refreshKey="refreshKey"/>
    <!--将原先的价值登记拆分三个独立的菜单：价值登记、资产估值记录、资产价值一览表-->
    <!--<a-tabs v-model="key" type="card" :tabBarGutter="10">-->
      <!--<a-tab-pane tab="资产价值登记" key="1">-->
        <!--<asset-worth-register :refreshKey="refreshKey"/>-->
      <!--</a-tab-pane>-->
      <!--<a-tab-pane tab="价值登记记录" key="2">-->
        <!--<worth-register-record/>-->
      <!--</a-tab-pane>-->
      <!--<a-tab-pane tab="资产价值一览表" key="3">-->
        <!--<asset-worth-list/>-->
      <!--</a-tab-pane>-->
    <!--</a-tabs>-->
  </div>
</template>

<script>
  // import AssetWorthList from './asset-worth-list'
  import AssetWorthRegister from './asset-worth-register'
  // import WorthRegisterRecord from './components/WorthRegisterRecord'
  export default {
    name: 'index',
    // components: { WorthRegisterRecord, AssetWorthList, AssetWorthRegister },
    components: { AssetWorthRegister },
    data () {
      return {
        // key: '1', // Tab key
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

<style lang='less' scoped>

</style>
