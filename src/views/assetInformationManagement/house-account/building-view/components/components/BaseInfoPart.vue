<!--楼栋视图业务-楼栋视图详情页面-基础信息组件-->
<template>
  <div class="base_info">
    <a-spin :spinning="spinning"></a-spin>
    <SG-Title title="基础信息" noMargin/>
    <div class="title_div" style="margin-top: 20px">
      <a-row :gutter="16">
        <a-col v-for="(item, i) in baseInfoKeys" :span="8" :key="i">
          <div v-for="{title, key} in item" :key="key" class="item_detail">
            <div v-if="key==='picturePath'" style="text-align: center">
              <img :src="baseInfoData['picturePath']" style="height: 115px"/>
            </div>
            <div v-else>
              <span style="color: #282D5B">{{title ? `${title}:` : ''}}</span>
              <span style="margin-left:4px; color: #49505E">{{baseInfoData[key] || '无'}}</span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'BaseInfoPart',
    props: ['houseId'],
    data () {
      return {
        spinning: false, // 页面加载状态
        baseInfoKeys: [
          [
            {title: '主图', key: 'picturePath'}, {title: '地理位置', key: 'totalAddress'}, {title: '地上层数', key: 'upFloorNum'},
            {title: '权属状态', key: ''}, {title: '最新估值', key: 'assetValuation'}
          ], // 列1
          [
            {title: '楼栋名称', key: 'assetName'}, {title: '楼栋编码', key: 'assetCode'}, {title: '建筑面积', key: 'area'},
            {title: '房屋数量', key: 'assetNum'}, {title: '地下层数', key: 'downFloorNum'}, {title: '建筑结构', key: 'structure'}
          ], // 列2
          [
            {title: '建筑年代', key: 'years'}, {title: '丘地号', key: 'addressNo'}, {title: '楼高', key: 'buildHeight'},
            {title: '总层数', key: 'floorNum'}, {title: '权属形式', key: 'ownText'}, {title: '资产原值', key: 'originalValue'}
          ] // 列3
        ],
        baseInfoData: {}
      }
    },

    methods: {
      // 查询基本信息
      queryHouseInfo () {
        this.spinning = true
        this.$api.assets.queryAssetViewBaseInfo({assetHouseId: this.houseId}).then(r => {
          this.spinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            let temp = res.data
            temp.structure = '未知'
            temp.ownText = Number(temp.type) === 1 ? '房屋' : '楼栋'
            return this.baseInfoData = temp
          }
          throw res.message || '查询资产基本信息出错'
        }).catch(err => {
          this.spinning = false
          this.$message.error(err || '查询资产基本信息出错')
        })
      }
    },

    mounted () {
      // 从vuex中获取数据
      // this.baseInfoData = this.$store.state.asset.buildingView || {}
      this.queryHouseInfo()
    }
  }
</script>

<style lang='less' scoped>
  .base_info {
    .item_detail {
      margin-bottom: 30px;
    }
  }
</style>
