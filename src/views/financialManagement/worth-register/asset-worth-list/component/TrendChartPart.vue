<template>
  <a-spin :spinning="spinning">
    <div class="trend_chart">
      <div id="chart_zone" style="width: 100%; height:300px"></div>
      <div class="tip_style">
        <span>资产原值：<span style="font-weight: bold">{{originalValue || '--'}}</span>元</span>
        <span><i style="background-color: #F49000"></i>评估原值</span>
        <span><i style="background-color: #45A2FF"></i>评估市值</span>
      </div>
    </div>
  </a-spin>
</template>

<script>
  // 引入 ECharts 主模块
  import echarts from 'echarts/lib/echarts'
  // 按需引入柱状图，减少打包体积
  import 'echarts/lib/chart/bar'
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
      // 渲染图表
      renderChart (data) {
        if (!data || !data.length) { return false }
        // 基于准备好的dom，初始化echarts实例
        let myChart = echarts.init(document.getElementById('chart_zone'))
        // 绘制图表
        myChart.setOption({
          color: ['#F49000', '#45A2FF'],
          tooltip: {},
          xAxis: {
            axisTick: { alignWithLabel: true }, // X 标签居中
            data: []
            // data: ['衬衫', '羊毛衫', '雪纺衫', '裤子', '高跟鞋', '袜子']
          },
          yAxis: {},
          series: []
          // series: [{  name: '销量', type: 'bar', data: [5, 20, 36, 10, 10, 20] }]
        })
      },

      // 查询趋势图数据
      queryTrendInfo () {
        this.spinning = true
        this.$api.worthRegister.queryAssetValueTrend({assetId: this.assetId}).then(r => {
          this.spinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.trendInfo = res.data.data || []
            return this.renderChart(res.data.data || [])
          }
          throw res.message || '资产价值一览表接口出错'
        }).catch(err => {
          this.spinning = false
          this.$message.error(err || '资产价值一览表接口出错')
        })
      }
    },
    
    mounted () {
      this.queryTrendInfo()
    }
  }
</script>

<style lang='less' scoped>
  .trend_chart {
    .tip_style {
      text-align: center;
      i {
        width: 8px;
        height: 8px;
        margin-left: 40px;
        margin-right: 5px;
        border-radius: 50%;
        display: inline-block;
      }
    }
  }
</style>
