<template>
  <div class="asset_view">
    <!-- <SG-Button
      icon="export"
      type="primary"
      @click="exportCard"
      :loading="exportBtnLoading"
      v-power="ASSET_MANAGEMENT.HOUSE_ACCOUNT_AVD_EXPORT"
      style="position: absolute; top: 10px; right: 30px; z-index: 999"
    >
      导出房屋卡片
    </SG-Button> -->
    <!--基础信息部分-->
    <base-info-part ref="baseInfoPart" v-if="assetCarParkId" comType="assetCarPark" :assetCarParkId="assetCarParkId" @updateTransfer="updateTransfer" :baseInfoKeys="baseInfoKeys" @parkingDetail="parkingDetail"/>
    <SpaceInfo :assetCarParkId="assetCarParkId"/>
    <!--其它信息部分-->
    <other-info-part v-if="assetCarParkId" :assetCarParkId="assetCarParkId" :assetId="assetId" :transferOperationArea="transferOperationArea" :transferOperationTime="transferOperationTime"/>
  </div>
</template>

<script>
  import BaseInfoPart from './components/BaseInfoPart'
  import OtherInfoPart from "./components/OtherInfoPart"
  import SpaceInfo from './components/SpaceInfo.vue'
  import {ASSET_MANAGEMENT} from '@/config/config.power'
  export default {
    name: 'AssetViewPage',
    components: { OtherInfoPart, BaseInfoPart, SpaceInfo },
    data () {
      return {
        ASSET_MANAGEMENT, // 权限对象
        exportBtnLoading: false,
        assetCarParkId: '', // 房屋Id
        assetId: '', // 资产Id
        transferOperationArea: '', // 转运营面积
        transferOperationTime: '', // 转运营时间
        baseInfoKeys: [
          // [
          //   {title: '主图', key: 'picturePath'},
          // ], // 列1
          [
            {title: '资产名称', key: 'assetName'}, {title: '资产类型', key: 'assetType'}, {title: '建筑面积(㎡)', key: 'area'},
            {title: '资产状态', key: 'statusName'},{title: '是否抵押', key: 'mortgage'}, {title: '涉诉情况', key: 'lawsuitRemark'}
          ], // 列2
          [
            {title: '资产编码', key: 'assetCode'}, {title: '是否质押', key: 'pledge'}, {title: '涉诉', key: 'lawsuit'}
          ], // 列3
          // [
          //   {title: '', key: 'picturePath'},
          // ]
        ],
      }
    },

    methods: {
      // 车位详情
      parkingDetail () {},
      // 导出房屋卡片
      exportCard () {
        this.exportBtnLoading = true
        const { assetCarParkId, assetId } = this
        this.$api.assets.exportHouseCard({ assetCarParkId, assetId }).then(res => {
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
      const { query: { assetCarParkId, assetId } } = this.$route
      this.assetCarParkId = assetCarParkId
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