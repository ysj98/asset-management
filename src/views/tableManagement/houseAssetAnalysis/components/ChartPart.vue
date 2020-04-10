<!--报表管理-房屋资产统计分析入口页面--汇总分析Part-->
<template>
  <a-spin :spinning="loading" class="chart_part">
    <SG-Title title="汇总分析"/>
    <div style="margin-left: 45px" v-if="Object.keys(queryInfo).length">
      <a-row :gutter="16">
        <a-col :span="8">
          <div class="chart_title">建筑面积统计</div>
          <div id="area_statistics"></div>
          <div v-if="!dataObj.buildArea" style="text-align: center; color: #00000073">暂无数据</div>
        </a-col>
        <a-col :span="8">
          <div class="chart_title">使用方向统计</div>
          <div id="direct_statistics"></div>
          <div v-if="!dataObj.used" style="text-align: center; color: #00000073">暂无数据</div>
        </a-col>
        <a-col :span="8">
          <div class="chart_title">资产价值统计</div>
          <div id="asset_statistics"></div>
          <div v-if="!dataObj.assetValue" style="text-align: center; color: #00000073">暂无数据</div>
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
        dataObj: {} // 判断是否展示图表的标志
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
        this.$api.tableManage.queryAssetHouseTotal(form).then(r => {
          this.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { buildAreaList, usedList, assetValue } = res.data
            this.dataObj = {
              buildArea: (buildAreaList || []).length,
              used: (usedList || []).length,
              assetValue: Object.keys(assetValue || {}).length
            }
            this.renderThetaChart('area_statistics', 'useTypeName', buildAreaList)
            this.renderThetaChart('direct_statistics', 'usedName', usedList)
            this.renderRectChart(assetValue)
            return false
          }
          throw res.message
        }).catch(err => {
          this.loading = false
          this.$message.error(err || '查询汇总数据出错')
        })
      },
      // 绘制饼状图
      renderThetaChart (containerId, colorName, data = []) {
        if (!data.length) {
          document.getElementById(containerId).innerHTML = '<div style="text-align: center; color: #00000073">暂无汇总数据</div>'
          return false
        }
        const chart = new Chart({
          container: containerId, // 指定图表容器 ID
          height: 250, // 指定图表高度
          autoFit: true
        })
        chart.coordinate('theta', { radius: 0.6 }) // 饼图大小
        chart.data(data)
        chart.interval().position('area').color(colorName).label('area', {
          content: data => `${data.area} (${data.percentage ? `${data.percentage}%` : '-'})`
        }).adjust('stack')
        chart.tooltip(false).render()
      },

      // 绘制柱状图
      renderRectChart (obj = {}) {
        const chart = new Chart({
          container: 'asset_statistics',
          height: 250,
          autoFit: true
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
  }
</style>
