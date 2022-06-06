<template>
  <div>
    <a-tabs  @change="tabClick">
      <template v-for="item in tabs">
        <a-tab-pane :tab="item.title" :key="item.tagTitle">
          <!-- {{ item.title }} -->
        </a-tab-pane>
      </template>
    </a-tabs>
    <component :is="componentTag"></component>
  </div>
</template>

<script>
import AssetInsurancePolicy from './AssetInsurancePolicy.vue'
import AssetInsuranceSchedule from './AssetInsuranceSchedule.vue'
import ExpiringInsurance from './ExpiringInsurance.vue'
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
          tagTitle: 'AssetInsuranceSchedule'
        },
        {
          key:'3',
          title: '即将到期保险',
          tagTitle: 'ExpiringInsurance'
        },
      ]
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