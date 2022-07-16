<!--
 * @Author: LDC
 * @Date: 2022-06-09 15:08:00
 * @LastEditTime: 2022-07-14 11:28:14
 * @Description: 
 * 
 * 
-->
<!--资产视图业务-资产视图详情页面-->
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
    <!--其它信息部分-->
    <other-info-part v-if="assetHouseId" :assetHouseId="assetHouseId" :assetId="assetId" :transferOperationArea="transferOperationArea" :transferOperationTime="transferOperationTime"/>
  </div>
</template>

<script>
  import BaseInfoPart from './components/BaseInfoPart'
  import OtherInfoPart from "./components/OtherInfoPart"
  import {ASSET_MANAGEMENT} from '@/config/config.power'
  export default {
    name: 'AssetViewPage',
    components: { OtherInfoPart, BaseInfoPart },
    data () {
      return {
        ASSET_MANAGEMENT, // 权限对象
        exportBtnLoading: false,
        assetHouseId: '', // 房屋Id
        assetId: '', // 资产Id
        transferOperationArea: '', // 转运营面积
        transferOperationTime: '' // 转运营时间
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
    },
    // 路由卫士，用于审批及提交成功后刷新列表
    beforeRouteEnter (to, from, next) {
      const { name } = from
      next(vm => {
        // 通过 `vm` 访问组件实例
          vm.$route.meta.keepAlive = name === '资产价值详情' || name === '资产保险详情'
      })
    },
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
