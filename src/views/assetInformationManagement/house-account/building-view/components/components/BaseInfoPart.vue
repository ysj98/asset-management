<!--楼栋视图业务-楼栋视图详情页面-基础信息组件-->
<template>
  <div class="base_info">
    <SG-Title title="基础信息" noMargin/>
    <div class="title_div">
      <a-row :gutter="16">
        <a-col v-for="(item, i) in baseInfoKeys" :span="8" :key="i">
          <div v-for="{title, key} in item" :key="key" class="item_detail">
            <div v-if="key==='buildingImg'" style="text-align: center">
              <img src="./L123.png" style="width: 185px"/>
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
    data () {
      return {
        baseInfoKeys: [
          [
            {title: '主图', key: 'buildingImg'}, {title: '地理位置', key: 'code'}, {title: '地上层数', key: 'assetCatalog'},
            {title: '权属状态', key: 'assetType'}, {title: '最新估值', key: 'status'}
          ], // 列1
          [
            {title: '楼栋名称', key: 'use'}, {title: '楼栋编码', key: 'building'}, {title: '建筑面积', key: 'unit'},
            {title: '房屋数量', key: 'floor'}, {title: '地下层数', key: 'floors'}, {title: '建筑结构', key: 'district'}
          ], // 列2
          [
            {title: '建筑年代', key: 'use'}, {title: '丘地号', key: 'building'}, {title: '楼高', key: 'unit'},
            {title: '总层数', key: 'floor'}, {title: '权属形式', key: 'floors'}, {title: '资产原值', key: 'district'}
          ] // 列3
        ],
        baseInfoData: {}
      }
    },

    methods: {},

    mounted () {
      // 从vuex中获取数据
      this.baseInfoData = this.$store.state.asset.buildingView || {}
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
