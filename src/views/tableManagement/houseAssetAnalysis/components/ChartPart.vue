<!--报表管理-房屋资产统计分析入口页面--汇总分析Part-->
<template>
  <a-spin :spinning="loading" class="chart_part">
    <SG-Title title="汇总分析"/>
    <div style="margin-left: 45px" v-if="isHasData">
      <a-row :gutter="16">
        <a-col :span="8">
          <div class="chart_title">建筑面积统计</div>
          <div id="area_statistics"></div>
        </a-col>
        <a-col :span="8">
          <div class="chart_title">使用方向统计</div>
          <div id="direct_statistics"></div>
        </a-col>
        <a-col :span="8">
          <div class="chart_title">资产价值统计</div>
          <div id="asset_statistics"></div>
        </a-col>
      </a-row>
    </div>
    <div v-else style="text-align: center; color: #00000073">暂无汇总数据</div>
  </a-spin>
</template>

<script>
  import { Column, Pie } from '@antv/g2plot'
  export default {
    name: 'ChartPart',
    props: ['queryInfo'],
    data () {
      return {
        loading: false, // 页面loading
        isHasData: false, // 是否有图表数据，用于判断显示缺省文字
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
            this.isHasData = true
            let list = arr.length || area || percentage ? [
              ...arr, { useTypeName: '其他', area: Number(area.toFixed(2)), percentage: Number(percentage.toFixed(2)) }
            ] : []
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
      renderPieChart (containerId, colorField, data = []) {
        let pieInstance = this.chartInstance[containerId]
        if (!data.length) {
          // 实例存在且数据为空，销毁图表实例
          pieInstance && pieInstance.destroy()
          this.chartInstance[containerId] = null
          document.getElementById(containerId).innerHTML = '<div style="text-align: center; color: #00000073">暂无数据</div>'
          return false
        }
        // 更新图表
        if (pieInstance) {
          return pieInstance.changeData(data)
        }
        // 新建图表实例
        const piePlot = new Pie(document.getElementById(containerId), {
          data,
          colorField,
          radius: 0.8,
          height: 280,
          angleField: 'area',
          tooltip: { visible: false },
          legend: { position: 'bottom-center' },
          label: { visible: true, type: 'spider' }
        })
        piePlot.render()
        this.chartInstance[containerId] = piePlot
      },

      // 绘制柱状图
      renderRectChart (obj = {}) {
        let { chartInstance: { asset_statistics } } = this
        if (!Object.keys(obj).length) {
          // 实例存在且数据为空，销毁图表实例
          asset_statistics && asset_statistics.destroy()
          this.chartInstance['asset_statistics'] = null
          document.getElementById('asset_statistics').innerHTML = '<div style="text-align: center; color: #00000073">暂无数据</div>'
          return false
        }
        let data = [
          { typeName: '资产原值', key: 'originalValue', typeValue: 0 },
          { typeName: '首次评估原值', key: 'firstOriginalValue', typeValue: 0 },
          { typeName: '首次评估市值', key: 'firstMarketValue', typeValue: 0 },
          { typeName: '最新估值', key: 'latestValuationValue', typeValue: 0 }
        ].map(m => {
          let typeValue = obj[m.key] ? Number(obj[m.key]) : 0
          return { ...m, typeValue }
        })
        // 更新图表
        if (asset_statistics) {
          return asset_statistics.changeData(data)
        }
        // 新建图表实例
        const columnPlot = new Column(document.getElementById('asset_statistics'), {
          data,
          height: 335,
          xField: 'typeName',
          yField: 'typeValue',
          padding: 'auto',
          label: { visible: true },
          colorField: 'typeName',
          tooltip: { visible: false },
          xAxis: { label: { visible: false } },
          yAxis: { label: { visible: false }, line: { visible: true } },
          meta: { typeName: { alias: ' ' }, typeValue: { alias: `单位:(${obj.unitName})` } },
          legend: { visible: true, position: 'right-center' }
        })
        columnPlot.render()
        this.chartInstance['asset_statistics'] = columnPlot
      }
    }
  }
</script>

<style lang='less' scoped>
  .chart_part {
    margin-bottom: -20px;
    .chart_title {
      color: #49505e;
      font-size: 14px;
      font-weight: bold;
      text-align: center;
      padding-bottom: 15px;
    }
    /*#area_statistics, #direct_statistics {*/
      /*position: relative;*/
      /*!*遮挡label,解决label全部点击取消后不能复原bug*!*/
      /*&:after {*/
        /*content: '';*/
        /*display: block;*/
        /*position: absolute;*/
        /*bottom: 0;*/
        /*width: 50%;*/
        /*height: 25px;*/
        /*background-color: transparent;*/
      /*}*/
    /*}*/
  }
</style>
