<template>
  <a-spin :spinning="spinning">
    <div>
      {{originalValue}}
      <br>
      {{trendInfo}}
    </div>
  </a-spin>
</template>

<script>
  export default {
    name: 'TrendChartPart',
    props: ['assetId', 'originalValue'],
    data () {
      return {
        spinning: false, //加载状态
        trendInfo: [] // 趋势图数据
      }
    },

    methods: {
      // 查询趋势图数据
      queryTrendInfo () {
        this.spinning = true
        this.$api.worthRegister.queryAssetValueTrend({assetId: this.assetId}).then(r => {
          this.spinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.trendInfo = res.data.data || []
            return false
          }
          throw res.message || '资产价值一览表接口出错'
        }).catch(err => {
          this.spinning = false
          this.$message.error(err || '资产价值一览表接口出错')
        })
      }
    },
    
    created () {
      this.queryTrendInfo()
    }
  }
</script>

<style lang='less' scoped>

</style>
