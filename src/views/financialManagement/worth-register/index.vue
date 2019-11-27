<!--账务管理业务--价值登记入口页面-->
<template>
  <div class="custom-tabs">
    <a-tabs v-model="key" type="card" :tabBarGutter="10">
      <a-tab-pane tab="资产价值登记" key="1">
        <asset-worth-register/>
      </a-tab-pane>
      <a-tab-pane tab="价值登记记录" key="2">
        <worth-register-record/>
      </a-tab-pane>
      <a-tab-pane tab="资产价值一览表" key="3">
        <asset-worth-list/>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
  import AssetWorthList from './asset-worth-list'
  import AssetWorthRegister from './asset-worth-register'
  import WorthRegisterRecord from './worth-register-record'
  export default {
    name: 'index',
    components: { WorthRegisterRecord, AssetWorthList, AssetWorthRegister },
    data () {
      return {
        key: '1'
      }
    }
  }
</script>

<style lang='less' scoped>

</style>
