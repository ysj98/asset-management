<template>
  <div>
    <a-tabs  @change="tabClick" :activeKey="componentTag">
      <template v-for="item in tabs">
        <a-tab-pane :tab="item.title" :key="item.tagTitle">
        </a-tab-pane>
      </template>
    </a-tabs>
    <component :is="componentTag"></component>
  </div>
</template>

<script>
import AssetInsurancePolicy from './assetInsurancePolicy/index.vue'
import AssetInsuranceSchedule from './assetInsuranceSchedule/index.vue'
import ExpiringInsurance from './expiringInsurance/index.vue'
export default {
  components: { AssetInsurancePolicy, AssetInsuranceSchedule, ExpiringInsurance },
  data(){
    return{
      componentTag: 'AssetInsurancePolicy',
      tabs: [
        {
          key:'1',
          title: '资产保险单',
          tagTitle: 'AssetInsurancePolicy'
        },
        {
          key:'2',
          title: '即将到期保险',
          tagTitle: 'ExpiringInsurance'
        },
        {
          key:'3',
          title: '资产保险一览表',
          tagTitle: 'AssetInsuranceSchedule'
        },
      ]
    }
  },
  created (){
    if(this.$route.meta && this.$route.meta.comname){
      this.componentTag = this.$route.meta.comname
      console.log(this.componentTag)
    }
  },
  methods: {
    tabClick (tagTitle) {
      this.componentTag = tagTitle
    }
  }
}
</script>

<style>

</style>