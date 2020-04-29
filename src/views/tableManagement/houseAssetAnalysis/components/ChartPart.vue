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
  import { Chart } from '@antv/g2'
  export default {
    name: 'ChartPart',
    props: ['queryInfo'],
    data () {
      return {
        loading: false, // 页面loading
        isHasData: false // 是否有图表数据，用于判断显示缺省文字
      }
    },
    
    mounted () {
      this.queryData(this.queryInfo)
    },

    methods: {
      // 查询汇总数据
      queryData (form) {
        if (!form.organId) { return false }
        this.loading = true
        this.isHasData = false
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
              this.renderThetaChart('area_statistics', 'useTypeName', list)
              this.renderThetaChart('direct_statistics', 'usedName', usedArr)
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
      renderThetaChart (containerId, colorName, data = []) {
        if (!data.length) {
          document.getElementById(containerId).innerHTML = '<div style="text-align: center; color: #00000073">暂无数据</div>'
          return false
        }
        const chart = new Chart({
          container: containerId, // 指定图表容器 ID
          autoFit: true,
          height: 250 // 指定图表高度
        })
        chart.coordinate('theta', { radius: 0.6 }) // 饼图大小
        chart.data(data)
        chart.interval().position('area').color(colorName).label('area', {
          // layout: { type: 'overlap' },
          // offset: 0,
          content: data => `${data.area} (${data.percentage ? `${data.percentage}%` : '-'})`
        }).adjust('stack')
        chart.tooltip({
          showTitle: false,
          showMarkers: false
        }).render()
      },

      // 绘制柱状图
      renderRectChart (obj = {}) {
        if (!Object.keys(obj).length) {
          document.getElementById('asset_statistics').innerHTML = '<div style="text-align: center; color: #00000073">暂无数据</div>'
          return false
        }
        const chart = new Chart({
          container: 'asset_statistics',
          autoFit: true,
          height: 250
        })
        let max = 0
        let arr = [
          { title: '资产原值', key: 'originalValue', value: 0 },
          { title: '首次评估原值', key: 'firstOriginalValue', value: 0 },
          { title: '首次评估市值', key: 'firstMarketValue', value: 0 },
          { title: '最新估值', key: 'latestValuationValue', value: 0 }
        ].map(m => {
          let value = obj[m.key] ? Number(obj[m.key]) : 0
          max = max > value ? max : value
          return { ...m, value }
        })
        chart.data(arr)
        chart.axis('title', false).interval().position('title*value').label('value').color('title')
        chart.scale('value', {
          type: 'quantize',
          nice: true,
          min: 0,
          max: max || 10, // 防止max = 0 时渲染报错
          alias: `单位：${obj.unitName}`
        }).axis('value', {
          title: {},
        }).legend({
          position: 'right',
        }).tooltip(false).render()
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
    #area_statistics, #direct_statistics {
      position: relative;
      /*遮挡label,解决label全部点击取消后不能复原bug*/
      &:after {
        content: '';
        display: block;
        position: absolute;
        bottom: 0;
        width: 50%;
        height: 25px;
        background-color: transparent;
      }
    }
  }
</style>
