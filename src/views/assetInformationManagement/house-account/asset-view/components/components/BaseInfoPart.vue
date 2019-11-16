<!--资产视图业务-资产视图详情页面-'基本信息、空间位置、资产使用方向'组件-->
<template>
  <div>
    <!--基本信息-->
    <SG-Title title="基本信息" noMargin/>
    <a-row class="title_div" style="margin-top: 6px; margin-bottom: 15px">
      <a-col v-for="{title, key, span} in baseInfoKeys" :span="span || 8" :key="key">
        <span style="color: #282D5B">{{title}}:</span>
        <span style="margin-left: 9px; color: #49505E">{{baseInfoData[key] || '无'}}</span>
        <a-icon v-if="key==='assetName'" type="edit" style="color: #0084FF; cursor: pointer; margin-left: 11px" @click="handleModalOpen('edit')"/>
      </a-col>
    </a-row>
    <!--空间位置-->
    <SG-Title title="空间位置" noMargin/>
    <a-row class="title_div" style="margin-top: 6px; margin-bottom: 15px">
      <a-col v-for="{title, key, span} in spaceInfoKeys" :span="span || 8" :key="key">
        <span style="color: #282D5B">{{title}}:</span>
        <span style="margin:0 15px 0 4px; color: #49505E">{{spaceInfoData[key] || '无'}}</span>
        <a-icon v-if="key==='address'" type="environment" style="color: #e4393c; cursor: pointer" @click="handleModalOpen('location')"/>
      </a-col>
    </a-row>
    <!--资产使用方向-->
    <SG-Title title="资产使用方向" noMargin/>
    <overview-number :numList="overviewNumList" class="title_div" style="margin-top: 21px"/>
    <!--编辑资产详情弹窗-->
    <SG-Modal
      v-bind="modalObj"
      v-model="modalObj.status"
      @ok="handleModalOk"
      @cancel="handleModalCancel"
    >
      <edit-asset-detail ref="assetDetail"/>
    </SG-Modal>
  </div>
</template>

<script>
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import EditAssetDetail from './EditAssetDetail'
  export default {
    name: 'BaseInfoPart',
    components: { EditAssetDetail, OverviewNumber },
    props: ['assetHouseId'],
    data () {
      return {
        baseInfoKeys: [
          {title: '资产名称', key: 'assetName'}, {title: '资产编码', key: 'assetCode'}, {title: '资产分类', key: 'objectTypeName'},
          {title: '资产类型', key: 'typeName'}, {title: '房屋形态', key: 'assetStatus'}, {title: '户型', key: 'houseType'},
          {title: '装修情况', key: 'decorate'}, {title: '建筑结构', key: 'structure'}, {title: '资产用途', key: 'use'},
          {title: '建筑面积', key: 'area'}, {title: '竣工日期', key: 'validPeriod'}, {title: '维修日期', key: 'fixDate'},
          {title: '资产状态', key: 'assetStatus'}, {title: '相关描述', key: 'desc', span: 16},
          {title: '资产二维码', key: 'QRCode', span: 24}
        ], // 基本信息字段
        spaceInfoKeys: [
          {title: '项目名称', key: 'use'}, {title: '所在楼栋', key: 'building'}, {title: '所在单元', key: 'unit'},
          {title: '所在楼层', key: 'floor'}, {title: '层高', key: 'floors'}, {title: '省市区', key: 'district'},
          {title: '地质位置', key: 'address', span: 24},
        ], // 空间位置字段
        baseInfoData: {}, // 基本信息数据
        spaceInfoData: {}, // 空间位置数据
        modalObj: { title: '编辑资产信息', details: {}, status: false, okText: '保存', width: 550 },
        overviewNumList: [
          {title: '运营(㎡)', value: 0, bgColor: '#4BD288'}, {title: '闲置(㎡)', value: 0, bgColor: '#1890FF'},
          {title: '自用(㎡)', value: 0, bgColor: '#DD81E6'}, {title: '占用(㎡)', value: 0, bgColor: '#FD7474'},
          {title: '其他(㎡)', value: 0, bgColor: '#BBC8D6'}
        ] // 概览数据
      }
    },

    methods: {
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
          this.$refs['baseInfo'].handleSubmit(resolve, reject)
        }).then(res => {
          debugger
        }).catch(err => {
          debugger
        })
      }
    }
  }
</script>

<style lang='less' scoped>

</style>
