<template>
  <div class="asset_view">
    <SG-Button
      icon="export"
      type="primary"
      @click="exportCard"
      :loading="exportBtnLoading"
      v-power="ASSET_MANAGEMENT.HOUSE_ACCOUNT_AVD_EXPORT"
      style="position: absolute; top: 10px; right: 30px; z-index: 999"
    >
      导出房屋卡片
    </SG-Button>
    <!--基础信息部分-->
    <base-info-part ref="baseInfoPart" v-if="assetHouseId" :assetHouseId="assetHouseId" @updateTransfer="updateTransfer"/>
    <!-- 空间位置 -->
    <space-info :assetHouseId="assetHouseId" @updateTransfer="updateTransfer"/>
    <SG-Title title="资产使用方向" noMargin/>
    <overview-number :numList="numList" isEmit/>
    <!-- <a-spin :spinning="overviewNumSpinning">
    </a-spin> -->
    <!--其它信息部分-->
    <other-info-part v-if="assetHouseId" :assetHouseId="assetHouseId" :assetId="assetId" :transferOperationArea="transferOperationArea" :transferOperationTime="transferOperationTime"/>
  </div>
</template>

<script>
  import BaseInfoPart from './components/BaseInfoPart'
  import OtherInfoPart from "./components/OtherInfoPart"
  import SpaceInfo from './components/SpaceInfo.vue'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import {ASSET_MANAGEMENT} from '@/config/config.power'
  export default {
    name: 'AssetViewPage',
    components: { OtherInfoPart, BaseInfoPart, SpaceInfo, OverviewNumber },
    data () {
      return {
        ASSET_MANAGEMENT, // 权限对象
        exportBtnLoading: false,
        assetHouseId: '', // 房屋Id
        assetId: '', // 资产Id
        transferOperationArea: '', // 转运营面积
        transferOperationTime: '', // 转运营时间
        numList: [
        {title: '运营(㎡)', key: 'transferOperationArea', value: 0, bgColor: '#4BD288'},
        {title: '闲置(㎡)', key: 'idleArea', value: 0, bgColor: '#1890FF'}, {title: '自用(㎡)', key: 'selfUserArea', value: 0, bgColor: '#DD81E6'},
        {title: '其他(㎡)', key: 'otherArea', value: 0, bgColor: '#BBC8D6'} 
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      }
    },

    methods: {
      // 导出房屋卡片
      exportCard () {
        this.exportBtnLoading = true
        const { assetHouseId, assetId } = this
        this.$api.assets.exportHouseCard({ assetHouseId, assetId }).then(res => {
          this.exportBtnLoading = false
          if (String(res.status) === '200' && res.data && res.data.size) {
            let a = document.createElement('a')
            a.href = URL.createObjectURL(new Blob([res.data]))
            a.download = `房屋卡片(${this.$refs.baseInfoPart.infoData.assetName}).xlsx`
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            return a.remove()
          }
          throw res.message
        }).catch(err => {
          this.exportBtnLoading = false
          this.$message.error(err || '导出房屋卡片失败')
        })
      },

      // 兄弟组件间数据通信
      updateTransfer (obj) {
        Object.assign(this, obj)
      }
    },
    
    created () {
      const { query: { houseId, assetId } } = this.$route
      this.assetHouseId = houseId
      this.assetId = assetId
    }
  }
</script>

<style lang='less' scoped>
  .asset_view {
    position: relative;
    padding: 42px 70px 0;
    /*抽离子组件的公共样式*/
    & /deep/ .title_div {
      margin-left: 45px;
      .ant-col-8, .ant-col-24, .ant-col-12, .ant-col-16{
        margin: 15px 0;
      }
    }
  }
</style>