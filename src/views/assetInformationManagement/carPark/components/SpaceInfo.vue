<!--楼栋视图业务-楼栋视图详情页面-基础信息组件-->
<template>
  <div class="base_info">
    <a-spin :spinning="spinning"></a-spin>
    <SG-Title title="空间位置" noMargin/>
    <div class="title_div" style="margin-top: 20px">
      <a-row :gutter="16">
        <a-col v-for="(item, i) in baseInfoKeys" :span="8" :key="i">
          <div v-for="{title, key} in item" :key="key" class="item_detail">
            <div>
              <span style="color: #282D5B">{{title ? `${title}:` : ''}}</span>
              <span style="margin-left:4px;" v-if="key==='buildName'">
                <a @click="goDetail">{{baseInfoData[key]}}</a>
              </span>
              <span v-else style="margin-left:4px; color: #49505E">{{(baseInfoData[key] !== '' && baseInfoData[key] !== null) ? baseInfoData[key] : '无'}}</span>
            </div>
             <div v-if="key==='picturePath'">
              <img :src="baseInfoData['picturePath'] ? `${imgPrx}${baseInfoData['picturePath']}` : defaultImgUrl" style="height: 115px"/>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
  import { basics } from '@/config/config.url'
  import {win} from "utils/utils";
  export default {
    name: 'BaseInfoPart',
    props: ['buildId'],
    data () {
      return {
        imgPrx: basics.common.imgStr,
        spinning: false, // 页面加载状态
        defaultImgUrl: require('src/assets/image/default_house.png'),
        baseInfoKeys: [
          [
            {title: '运营项目', key: 'buildName'}, {title: '地理位置', key: 'buildCode'}
          ], // 列2
          [
            {title: '所在车场', key: 'years'}
          ], // 列3
          [
            {title: '所在区域', key: 'address'},
          ]
        ],
        baseInfoData: {}
      }
    },

    methods: {
      goDetail(){
        const fromType = 'portal'
        const positionId = this.$route.query.buildId
        const tabTitle = '车场详情'
        const tabUrl = `/asset-management/#/createBuildDetail?fromType=${fromType}&positionId=${positionId}`
        win.openPortalMenu(tabUrl,tabTitle)
      },
      // 查询基本信息
      queryHouseInfo () {
        this.spinning = true
        this.$api.assets.queryBuildingViewBuildInfo({buildId: this.buildId}).then(r => {
          this.spinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            let temp = res.data
            temp.ownText = Number(temp.type) === 1 ? '房屋' : '楼栋'
            return this.baseInfoData = temp
          }
          throw res.message || '查询车场信息出错'
        }).catch(err => {
          this.spinning = false
          this.$message.error(err || '查询车场信息出错')
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
