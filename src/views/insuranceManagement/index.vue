<template>
  <div>
    <a-tabs  @change="tabClick" :activeKey="componentTag">
      <template v-for="item in tabs">
        <a-tab-pane :tab="item.title" :key="item.tagTitle" v-power="ASSET_MANAGEMENT[item.isPower]">
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
import {ASSET_MANAGEMENT} from '@/config/config.power'
export default {
  components: { AssetInsurancePolicy, AssetInsuranceSchedule, ExpiringInsurance },
  data(){
    return{
      ASSET_MANAGEMENT,
      componentTag: 'AssetInsurancePolicy',
      tabs: [
        {
          key:'1',
          title: '资产保险单',
          tagTitle: 'AssetInsurancePolicy',
          isPower: 'insurance_asset_insurance_policy'
        },
        {
          key:'2',
          title: '即将到期保险',
          tagTitle: 'ExpiringInsurance',
          isPower: 'insurance_expiring_insurance'
        },
        {
          key:'3',
          title: '资产保险一览表',
          tagTitle: 'AssetInsuranceSchedule',
          isPower: 'insurance_asset_insurance_schedule'
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