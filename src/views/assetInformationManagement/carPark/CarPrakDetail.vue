<template>
  <div class="building_detail">
    <!--<SG-Button icon="rollback" style="position: absolute; top: 10px; right: 30px; z-index: 999" @click="$router.back()">-->
      <!--返回-->
    <!--</SG-Button>-->
    <!--基本信息-->
    <base-info-part v-if="buildId" :buildId="buildId" :baseInfoKeys="baseInfoKeys"/>
    <!--资产使用方向-->
    <asset-direct-part v-if="buildId" :buildId="buildId" :organId="organId" :organ-name="organName" />
    <!--其它信息-->
    <!-- <other-info-part v-if="buildId" :buildId="buildId" :assetIds="assetIds" style="margin-bottom: 35px"/> -->
  </div>
</template>

<script>
  import BaseInfoPart from './components/BaseInfoPart'
  import OtherInfoPart from './components/OtherInfoPart'
  import AssetDirectPart from './components/AssetDirectPart'
  export default {
    name: 'BuildingDetailPage',
    components: { AssetDirectPart, BaseInfoPart, OtherInfoPart },
    data () {
      return {
        organName:'',
        organId: '', // 组织机构id
        buildId: '', // 房间id
        assetIds: [], // 资产id
        baseInfoKeys: [
          [
            {title: '主图', key: 'picturePath'},
          ], // 列1
          [
            {title: '车场名称', key: 'buildName'}, {title: '车场面积(㎡)', key: 'area'}, {title: '运营项目', key: 'buildCode'}, 
            {title: '交付时间', key: 'roomNum'}, {title: '车场位置', key: 'buildCode'}, {title: '备注', key: 'buildCode'}, 
          ], // 列2
          [
            {title: '车场编码', key: 'years'},{title: '车场类型', key: 'buildCode'},  {title: '车位数量', key: 'addressNo'}
          ], // 列3
        ],
      }
    },

    methods: {},

    created () {
      const { organId, assetIds, buildId, organName } = this.$route.query
      Object.assign(this, {
        organId, assetIds, buildId, organName
      })
    }
  }
</script>

<style lang='less' scoped>
  .building_detail {
    position: relative;
    padding: 42px 70px 0;
    /*抽离子组件的公共样式*/
    & /deep/ .title_div {
      margin-left: 40px;
    }
    & /deep/ .sg-FooterPagination {
      margin-left: 40px;
      width: calc(100% - 40px);
    }
  }
</style>