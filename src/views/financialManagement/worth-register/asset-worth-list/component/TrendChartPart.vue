<!--价值登记页面--资产价值一览表趋势图组件-->
<template>
  <a-spin :spinning="spinning">
    <div class="trend_chart">
      <div id="chart_zone" style="width: 100%; height:300px">
        <img v-if="!trendInfo.length" :src="defaultImg" class="default_img">
      </div>
      <div class="tip_style">
        <span>资产原值：<span style="font-weight: bold">{{originalValue || '--'}}</span>元</span>
        <span v-for="m in tips" :key="m.title">
          <i :style="{backgroundColor: m.color}"></i>{{m.title}}
        </span>
      </div>
    </div>
  </a-spin>
</template>

<script>
  // 引入 ECharts 主模块
  import echarts from 'echarts/lib/echarts'
  // 按需引入折线图，减少打包体积
  import 'echarts/lib/chart/line'
  // 引入提示框和标题组件
  import 'echarts/lib/component/tooltip'
  import defaultImg from 'src/assets/image/no_data_tips_img.png'
  export default {
    name: 'TrendChartPart',
    props: ['assetId', 'originalValue'],
    data () {
      return {
        defaultImg,
        spinning: false, //加载状态
        trendInfo: [], // 趋势图数据
        tips: [
          {title: '成本法估值', color: '#F49000', method: '1'},
          {title: '市场法估值', color: '#0000ff', method: '2'},
          {title: '收益法估值', color: '#33cc66', method: '3'}
        ] // 图示说明文字及颜色
      }
    },

    methods: {
      // 渲染图表
      renderChart (dataSource) {
        if (!dataSource || !dataSource.length) { return false }
        let categoryList = []
        let {tips} = this
        let data = dataSource.map(m => {
          const { assessmenBaseDate, assessmentOrganName, assessmentValue, assessmentMethod, assessmentMethodName } = m
          categoryList.push(assessmenBaseDate)
          // let key = String(assessmentMethod) === '1' ? '评估原值：' : '评估市值：'
          return {
            value: assessmentValue,
            itemStyle: { color: (tips[Number(assessmentMethod) - 1] || {}).color || '' },  // 后期获取接口数据，需要优化
            tooltip: {
              padding: [10, 15],
              formatter: `评估价值：${assessmentValue}元<br/>评估方法：${assessmentMethodName || ''}<br/>评估机构：${assessmentOrganName}<br/>评估时间：${assessmenBaseDate}`
            }
          }
        })
        // 初始化echarts实例
        let myChart = echarts.init(document.getElementById('chart_zone'))
        // 绘制图表
        myChart.setOption({
          grid: { containLabel: true, top: 30, right: 20, left: 20, bottom: 30 },  // 距父元素边框距离
          yAxis: {
            axisLabel: { formatter: '{value} 元' }
          },
          lineStyle: {
            width: 4, // 折线宽度,
            color: '#45A2FF' // 折线颜色
          },
          tooltip: { trigger: 'item' },
          xAxis: {
            data: categoryList, // X轴标签,
            axisTick: { alignWithLabel: true }, // X轴标签居中
          },
          series: [{
            data, // 展示数据,
            type: 'line',  // 图表类型
            symbol: 'circle', // 节点形状
            symbolSize: 14 // 节点大小
          }]
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
    .default_img {
      transform: translate(340px, 50px);
    }
  }
</style>
