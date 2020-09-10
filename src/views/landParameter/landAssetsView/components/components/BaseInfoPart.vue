<!--资产视图业务-资产视图详情页面-'基本信息、空间位置、资产使用方向'组件-->
<template>
  <a-spin :spinning="spinning">
    <!--基本信息-->
    <SG-Title title="基本信息" noMargin/>
    <a-row class="title_div" style="margin-top: 6px; margin-bottom: 15px">
      <a-col v-for="{title, key, span} in baseInfoKeys" :span="span || 8" :key="key">
        <span style="color: #282D5B">{{title}}:</span>
        <span style="margin-left: 9px; color: #49505E">{{infoData[key] || '无'}}</span>
      </a-col>
    </a-row>
    <!--空间位置-->
    <SG-Title title="空间位置" noMargin/>
    <a-row class="title_div" style="margin-top: 6px; margin-bottom: 15px">
      <a-col v-for="{title, key, span} in spaceInfoKeys" :span="span || 8" :key="key">
        <span style="color: #282D5B">{{title}}:</span>
        <span style="margin:0 15px 0 4px; color: #49505E">{{infoData[key] || '无'}}</span>
      </a-col>
    </a-row>
    <!--资产使用方向-->
    <SG-Title title="资产使用方向" noMargin/>
    <overview-number :numList="numList" class="title_div" style="margin-top: 21px"/>
  </a-spin>
</template>

<script>
  import EditAssetDetail from './EditLandDetail'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  export default {
    name: 'BaseInfoPart',
    components: { EditAssetDetail, OverviewNumber },
    props: ['assetHouseId', 'assetLandId'],
    data () {
      return {
        spinning: false,
        baseInfoKeys: [
          {title: '资产名称', key: 'assetName'}, {title: '资产编码', key: 'assetCode'}, {title: '资产类型', key: 'assetType'},
          {title: '资产分类', key: 'objectType'}, {title: '土地面积', key: 'landArea'}, {title: '宗地号', key: 'theNo'},
          {title: '批准日期', key: 'takeOverDate'}, {title: '计容面积(㎡)', key: 'buildStruct'}, {title: '资产用途', key: 'landuse'},
          {title: '容积率', key: 'area'}, {title: '资产状态', key: 'completionDate'}, {title: '使用年限', key: 'repair'},
          {title: '有限期限', key: 'statusName'}, {title: '土地性质', key: 'desc', span: 16}
        ], // 基本信息字段
        spaceInfoKeys: [
          {title: '运营项目', key: 'projectName'}, {title: '土地位置', key: 'buildName'}, {title: '用地红线图', key: 'unitName'},
          {title: '土地备注', key: 'floor'}
        ], // 空间位置字段
        infoData: {}, // 信息数据
        details: {}, // 编辑基本信息数据
        modalObj: { title: '编辑资产信息', status: false, okText: '保存', cancelText: '取消', width: 550, loading: false },
        numList: [
          {title: '运营(㎡)', key: 'transferOperationArea', value: 0, bgColor: '#4BD288'},
          {title: '闲置(㎡)', key: 'idleArea', value: 0, bgColor: '#1890FF'},
          {title: '自用(㎡)', key: 'selfUserArea', value: 0, bgColor: '#DD81E6'},
          {title: '其他(㎡)', key: 'otherArea', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数据,如是格式，title 标题，value 数值，color 背景色
      }
    },

    methods: {
      // 查询详情
      queryDetailInfo () {
        this.spinning = true
        this.$api.land.assetViewDetail({assetLandId: this.assetLandId + ''}).then(r => {
          this.spinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            let temp = res.data
            let {transferOperationTime, transferOperationArea} = temp
            this.$emit('updateTransfer', {transferOperationTime, transferOperationArea})
            this.numList = this.numList.map(m => {
              return { ...m, value: `${temp[m.key] ? temp[m.key].toFixed(2) : 0}` }
            })
            return this.infoData = temp
          }
          throw res.message || '查询接口出错'
        }).catch(err => {
          this.spinning = false
          this.$message.error(err || '查询接口出错')
        })
      }
    },

    created () {
      this.queryDetailInfo()
    }
  }
</script>

<style lang='less' scoped>

</style>
