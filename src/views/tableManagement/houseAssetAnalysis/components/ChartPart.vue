<!--报表管理-房屋资产统计分析入口页面--汇总分析Part-->
<template>
  <a-spin :spinning="loading" class="chart_part">
    <SG-Title title="汇总分析"/>
    <div style="margin-left: 45px" v-if="isHasData">
      <a-row :gutter="16">
        <a-col :span="8" v-for="(val, name) in divObj" :key="name">
          <div class="chart_title">{{val}}</div>
          <div :id="name"></div>
        </a-col>
      </a-row>
    </div>
    <div v-else style="text-align: center; color: #00000073">暂无汇总数据</div>
  </a-spin>
</template>

<script>
  // 引入 ECharts 模块
  import echarts from 'echarts/lib/echarts'
  import 'echarts/lib/chart/pie'
  import 'echarts/lib/chart/bar'
  import 'echarts/lib/component/legend'
  import 'echarts/lib/component/tooltip'
  import 'echarts/lib/component/legendScroll'
  export default {
    name: 'ChartPart',
    props: ['queryInfo'],
    data () {
      return {
        loading: false, // 页面loading
        isHasData: false, // 是否有图表数据，用于判断显示缺省文字
        divObj: {
          area_statistics: '建筑面积统计',
          direct_statistics: '使用方向统计',
          asset_statistics: '资产价值统计'
        }, // 图表寄存的div集合
        chartInstance: {area_statistics: null, direct_statistics: null, asset_statistics: null}// 图表实例，用于重绘
      }
    },

    mounted () {
      this.queryData(this.queryInfo)
    },

    watch: {
      queryInfo: function () {
        this.queryData(this.queryInfo)
      }
    },

    methods: {
      // 查询汇总数据
      queryData (form) {
        if (!form.organId) { return false }
        this.loading = true
        this.$api.tableManage.queryAssetHouseTotal(form).then(r => {
          this.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.isHasData = true
            let { buildAreaList, usedList, assetValue } = res.data
            let arr = []
            let area = 0
            let percentage = 0
            let buildArea = buildAreaList || []
            buildArea.forEach(m => {
              if (!m.useTypeName) {
                area += m.area ? Number(m.area) : 0
                percentage += m.percentage ? Number(m.percentage) : 0
              } else {
                arr.push(m)
              }
            })
            let list = area || percentage ? [
              ...arr, { useTypeName: '其他', area: Number(area.toFixed(2)), percentage: Number(percentage.toFixed(2)) }
            ] : arr
            let usedArr = ((usedList || []).filter(v => Number(v.area))).length ? usedList : []
            // 加载完DOM渲染图表
            return this.$nextTick(function () {
              this.renderPieChart('area_statistics', 'useTypeName', list)
              this.renderPieChart('direct_statistics', 'usedName', usedArr)
              this.renderRectChart(assetValue)
            })
          }
          throw res.message
        }).catch(err => {
          this.isHasData = false
          this.loading = false
          this.$message.error(err || '查询汇总数据出错')
        })
      },

      // 绘制饼状图
      renderPieChart (containerId, key, list = []) {
        let pieInstance = this.chartInstance[containerId]
        let domNode = document.getElementById(containerId)
        if (!list.length) {
          // 实例存在且数据为空，销毁图表实例
          pieInstance && pieInstance.dispose()
          this.chartInstance[containerId] = null
          domNode.innerHTML = '<div style="text-align: center; color: #00000073">暂无数据</div>'
          return false
        }
        // 初始化echarts实例
        let myChart = pieInstance
        if (!pieInstance) {
          domNode.innerHTML = ''
          myChart = echarts.init(domNode)
          this.chartInstance[containerId] = myChart
        }
        let data = list.map(m => ({ name: m[key], value: m.area }))
        // 绘制或刷新图表
        myChart.setOption({
          tooltip: { trigger: 'item', formatter: '{b} : {c} ({d}%)'}, // 自定义提示格式
          legend: { type: 'scroll', bottom: 0, itemWidth: 10, itemHeight: 10 }, // 图例样式
          grid: { containLabel: true, top: 10, right: 10, left: 10, bottom: 40 },  // 距父元素边框距离
          series: [{ data, type: 'pie', radius: '55%', label: { show: true, formatter: '{c}'}, hoverOffset: 3 }],
          color: ['#5b8ff9', '#5ad8a6', '#5d7092', '#f6bd16', '#657798', '#e96c5b', '#6395f9', '#d48265', '#ca8622', '#bda29a', '#6e7074', '#c4ccd3'] // 自定义调色盘
        })
      },

      // 绘制柱状图
      renderRectChart (obj = {}) {
        let { chartInstance: { asset_statistics } } = this
        let domNode = document.getElementById('asset_statistics')
        if (!Object.keys(obj).length) {
          // 实例存在且数据为空，销毁图表实例
          asset_statistics && asset_statistics.dispose()
          this.chartInstance['asset_statistics'] = null
          domNode.innerHTML = '<div style="text-align: center; color: #00000073">暂无数据</div>'
          return false
        }
        // 初始化echarts实例
        let myChart = asset_statistics
        if (!asset_statistics) {
          domNode.innerHTML = ''
          myChart = echarts.init(domNode)
          this.chartInstance['asset_statistics'] = myChart
        }
        // 绘制或刷新图表
        myChart.setOption({
          yAxis: { type: 'value' },
          xAxis: { type: 'category', show: false }, // 隐藏X轴
          legend: { itemWidth: 10, itemHeight: 10, bottom: 0 }, // 图例样式
          color: ['#5b8ff9', '#5ad8a6', '#5d7092', '#f6bd16'], // 自定义调色盘
          grid: { containLabel: true, top: 10, right: 10, left: 10, bottom: 40 }, // 距父元素边框距离
          series: [
            { name: '资产原值', key: 'originalValue' },
            { name: '首次评估原值', key: 'firstOriginalValue' },
            { name: '首次评估市值', key: 'firstMarketValue' },
            { name: '最新估值', key: 'latestValuationValue' }
          ].map(m => {
            return {
              type: 'bar',  // 图表类型
              name: m.name, // 用于生成legend
              label: { show: true, position: 'top' }, // 显示标签
              data: [obj[m.key] ? Number(obj[m.key]) : 0] // 展示数据
            }
          })
        })
      }
    }
  }
</script>

<style lang='less' scoped>
  .chart_part {
    .chart_title {
      color: #49505e;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      padding-bottom: 15px;
    }
    #asset_statistics, #area_statistics, #direct_statistics {
      height: 250px;
      width: 100%;
    }
  }
</style>