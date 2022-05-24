<template>
  <a-spin :spinning="spinning">
    <!--空间位置-->
    <SG-Title title="空间位置" noMargin/>
    <a-row class="title_div" style="margin-top: 6px; margin-bottom: 15px">
      <a-col v-for="{title, key, span} in spaceInfoKeys" :span="span || 8" :key="key">
        <span style="color: #282D5B">{{title}}:</span>
        <span style="margin:0 15px 0 4px; color: #49505E">{{infoData[key] || '无'}}</span>
        <a-icon v-if="key==='address'" type="environment" style="color: #e4393c; cursor: pointer" @click="handleModalOpen('location')"/>
      </a-col>
    </a-row>
    <!--资产使用方向-->
    <SG-Title title="资产使用方向" noMargin/>
    <overview-number :numList="numList" class="title_div" style="margin-top: 21px"/>
    <!--编辑资产详情弹窗-->
    <SG-Modal v-bind="modalObj" v-model="modalObj.status">
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="modalObj.loading" @click="handleModalOk">
          {{modalObj.okText}}
        </a-button>
        <a-button key="back" @click="handleModalCancel">{{modalObj.cancelText}}</a-button>
      </template>
      <edit-asset-detail ref="editAssetDetail" :details="details"/>
    </SG-Modal>
  </a-spin>
</template>

<script>
  // import EditAssetDetail from './EditAssetDetail'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  export default {
    name: 'BaseInfoPart',
    components: { OverviewNumber },
    props: ['assetCarParkId'],
    data () {
      return {
        judgingCondition: [undefined, null, ''],
        spinning: false,
        spaceInfoKeys: [
          {title: '运营项目', key: 'communityName'}, {title: '所在车场', key: 'placeName'}, {title: '所在区域', key: 'parkingAreaName'},
          {title: '地理位置', key: 'totalAddress', span: 24},
        ], // 空间位置字段
        infoData: {}, // 信息数据
        details: {}, // 编辑基本信息数据
        modalObj: { title: '编辑资产信息', status: false, okText: '保存', cancelText: '取消', width: 550, loading: false },
        numList: [
          {title: '运营(㎡)', key: 'operationArea', value: 0, bgColor: '#4BD288'},
          {title: '闲置(㎡)', key: 'idleArea', value: 0, bgColor: '#1890FF'},
          {title: '自用(㎡)', key: 'selfUserArea', value: 0, bgColor: '#DD81E6'},
          // {title: '占用(㎡)', key: 'occupationArea', value: 0, bgColor: '#FD7474'},
          {title: '其他(㎡)', key: 'otherArea', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数据,如是格式，title 标题，value 数值，color 背景色
      }
    },

    methods: {
      // 查询详情
      queryDetailInfo () {
        this.spinning = true
        this.$api.carPark.assetCarPark({assetCarParkId: this.assetCarParkId})
        .then(r => {
          this.spinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            let temp = res.data
            // temp.PCD = `${temp.province}${temp.city}${temp.region}`
            temp.assetType = '房屋'
            temp.houseType = '房屋'
            let {transferOperationTime, transferOperationArea} = temp
            this.$emit('updateTransfer', {transferOperationTime, transferOperationArea})
            return this.infoData = temp
          }
          throw res.message || '查询接口出错'
        }).catch(err => {
          this.spinning = false
          this.$message.error(err || '查询接口出错')
        })
      },

      // 查询楼栋视图面积概览数据
      queryHouseAreaInfo () {
        const { assetCarParkId, numList } = this
        return this.$api.carPark.cartParkArea({ assetCarParkId }).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            // 查楼栋视图详情的面积数据
            return this.numList = numList.map(m => {
              const { percent, number } = res.data[m.key]
              return { ...m, value: `${number}（${percent}）` }
            })
          }
          throw res.message || '查询视图面积详情出错'
        }).catch(err => {
          this.$message.error(err || '查询视图面积详情出错')
        })
      },

      // 打开编辑Modal
      handleModalOpen (type) {
        if (type === 'location') {
          return false
        }
        const { infoData: { assetName, assetCode, decorationSituation, assetCarParkId, ownerUser, ownerOrgan, ownerOrganName } } = this
        this.modalObj.status = true
        this.details = { assetName, assetCode, decorationSituation, assetCarParkId, ownerUser, ownerOrgan, ownerOrganName }
      },

      // Modal关闭
      handleModalCancel () {
        this.modalObj.status = false
      },

      // Modal提交
      handleModalOk () {
        this.modalObj.loading = true
        new Promise((resolve, reject) => {
          this.$refs['editAssetDetail'].handleSubmit(resolve, reject)
        }).then(() => {
          this.modalObj.loading = false
          this.modalObj.status = false
          // 更新页面
          this.queryDetailInfo()
          this.queryHouseAreaInfo()
        }).catch(() => {
          this.modalObj.loading = false
        })
      }
    },

    created () {
      this.queryDetailInfo()
      this.queryHouseAreaInfo()
    }
  }
</script>

<style lang='less' scoped>

</style>