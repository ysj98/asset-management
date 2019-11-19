<!--资产视图业务-资产视图详情页面-'基本信息、空间位置、资产使用方向'组件-->
<template>
  <a-spin :spinning="spinning">
    <!--基本信息-->
    <SG-Title title="基本信息" noMargin/>
    <a-row class="title_div" style="margin-top: 6px; margin-bottom: 15px">
      <a-col v-for="{title, key, span} in baseInfoKeys" :span="span || 8" :key="key">
        <span style="color: #282D5B">{{title}}:</span>
        <span style="margin-left: 9px; color: #49505E">{{infoData[key] || '无'}}</span>
        <a-icon
          type="edit"
          v-if="key==='assetName'"
          @click="handleModalOpen('edit')"
          style="color: #0084FF; cursor: pointer; margin-left: 11px"
        />
      </a-col>
    </a-row>
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
    <SG-Modal
      v-bind="modalObj"
      v-model="modalObj.status"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <a-spin :spinning="modalObj.confirmLoading">
        <edit-asset-detail ref="editAssetDetail" :details="details"/>
      </a-spin>
    </SG-Modal>
  </a-spin>
</template>

<script>
  import EditAssetDetail from './EditAssetDetail'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  export default {
    name: 'BaseInfoPart',
    components: { EditAssetDetail, OverviewNumber },
    props: ['assetHouseId'],
    data () {
      return {
        spinning: false,
        baseInfoKeys: [
          {title: '资产名称', key: 'assetName'}, {title: '资产编码', key: 'assetCode'}, {title: '资产分类', key: 'objectType'},
          {title: '资产类型', key: 'type'}, {title: '房屋形态', key: 'houseStatus'}, {title: '户型', key: 'houseType'},
          {title: '装修情况', key: 'decorate'}, {title: '建筑结构', key: 'structure'}, {title: '资产用途', key: 'use'},
          {title: '建筑面积', key: 'area'}, {title: '竣工日期', key: 'validPeriod'}, {title: '维修日期', key: 'fixDate'},
          {title: '资产状态', key: 'status'}, {title: '相关描述', key: 'desc', span: 16},
          {title: '资产二维码', key: 'QRCode', span: 24}
        ], // 基本信息字段
        spaceInfoKeys: [
          {title: '项目名称', key: 'use'}, {title: '所在楼栋', key: 'building'}, {title: '所在单元', key: 'unit'},
          {title: '所在楼层', key: 'floor'}, {title: '层高', key: 'floors'}, {title: '省市区', key: 'PCD'},
          {title: '地理位置', key: 'address', span: 24},
        ], // 空间位置字段
        infoData: {}, // 信息数据
        details: {}, // 编辑基本信息数据
        modalObj: { title: '编辑资产信息', status: false, confirmLoading: false, okText: '保存', width: 550 },
        numList: [
          {title: '运营(㎡)', key: 'totalOperationArea', value: 0, bgColor: '#4BD288'},
          {title: '闲置(㎡)', key: 'totalIdleArea', value: 0, bgColor: '#1890FF'},
          {title: '自用(㎡)', key: 'totalSelfUserArea', value: 0, bgColor: '#DD81E6'},
          {title: '占用(㎡)', key: 'totalOccupationArea', value: 0, bgColor: '#FD7474'},
          {title: '其他(㎡)', key: 'totalOtherArea', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数据,如是格式，title 标题，value 数值，color 背景色
      }
    },

    methods: {
      // 查询详情
      queryDetailInfo () {
        this.spinning = true
        this.$api.assets.queryAssetViewBaseInfo({assetHouseId: this.assetHouseId}).then(r => {
          this.spinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            let temp = res.data
            temp.PCD = `${temp.province}${temp.city}${temp.region}`
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
        const { assetHouseId, numList } = this
        return this.$api.assets.queryAssetViewHouseArea({ assetHouseId }).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            // 查楼栋视图详情的面积数据
            return this.numList = numList.map(m => {
              const { percent, number } = res.data[m.key]
              return {
                ...m,
                value: `${number}(${percent})`
              }
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
          return
        }
        Object.assign(this.modalObj, {
          status: true,
          details: {}
        })
      },

      // Modal关闭
      handleModalCancel () {
        this.modalObj.status = false
      },

      // Modal提交
      handleModalOk () {
        new Promise((resolve, reject) => {
          this.$refs['editAssetDetail'].handleSubmit(resolve, reject)
        }).then(values => {
          this.modalObj.confirmLoading = true
          this.$api.assets.saveAssetViewHouseInfo({...values, assetHouseId: this.assetHouseId}).then(r =>{
            this.modalObj.confirmLoading = false
            let res = r.data
            if (res && String(res.code) === '0') {
              this.modalObj.status = false
              return this.$message.success('保存成功')
            }
            this.$message.error(res.message || '保存接口出错')
          })
        }).catch(() => {
          this.modalObj.confirmLoading = false
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
