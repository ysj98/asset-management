<!--楼栋视图业务-楼栋视图详情页面-基础信息组件-->
<template>
  <div class="base_info">
    <a-spin :spinning="spinning"></a-spin>
    <SG-Title title="基础信息" noMargin />
    <div class="title_div" style="margin-top: 20px">
      <a-row :gutter="16">
        <a-col v-for="(item, i) in baseInfoKeys" :span="8" :key="i">
          <div v-for="{ title, key } in item" :key="key" class="item_detail">
            <div v-if="key === 'picturePath'">
              <img :src="baseInfoData['picturePath'] ? `${imgPrx}${baseInfoData['picturePath']}` : defaultImgUrl" style="height: 115px" />
            </div>
            <div v-else>
              <span style="color: #282d5b">{{ title ? `${title}:` : '' }}</span>
              <span style="margin-left: 4px" v-if="key === 'buildName'">
                <a @click="goDetail">{{ baseInfoData[key] }}</a>
              </span>
              <span v-else style="margin-left: 4px; color: #49505e">{{
                baseInfoData[key] !== '' && baseInfoData[key] !== null ? baseInfoData[key] : ''
              }}</span>
            </div>
          </div>
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
import { basics } from '@/config/config.url';
import { win } from 'utils/utils';
export default {
  name: 'BaseInfoPart',
  props: ['buildId'],
  data() {
    return {
      imgPrx: basics.common.imgStr,
      spinning: false, // 页面加载状态
      defaultImgUrl: require('src/assets/image/default_house.png'),
      baseInfoKeys: [
        [
          { title: '主图', key: 'picturePath' },
          { title: '地理位置', key: 'totalAddress' },
          { title: '地上层数', key: 'upFloorNum' },
          { title: '权属状态', key: 'ownerShipStatusName' },
          { title: '最新估值', key: 'marketValue' },
        ], // 列1
        [
          { title: '楼栋名称', key: 'buildName' },
          { title: '楼栋编码', key: 'buildCode' },
          { title: '建筑面积', key: 'area' },
          { title: '房屋数量', key: 'roomNum' },
          { title: '地下层数', key: 'downFloorNum' },
          { title: '建筑结构', key: 'buildStruct' },
        ], // 列2
        [
          { title: '建筑年代', key: 'years' },
          { title: '宗地号', key: 'addressNo' },
          { title: '楼高', key: 'buildHeight' },
          { title: '总层数', key: 'floorNum' },
          { title: '权属形式', key: 'ownText' },
          { title: '资产原值', key: 'originalValue' },
        ], // 列3
      ],
      baseInfoData: {},
    };
  },

  methods: {
    goDetail() {
      const fromType = 'portal';
      const positionId = this.$route.query.buildId;
      const tabTitle = '楼栋详情';
      const tabUrl = `/asset-management/#/createBuildDetail?fromType=${fromType}&positionId=${positionId}`;
      win.openPortalMenu(tabUrl, tabTitle);
    },
    // 查询基本信息
    queryHouseInfo() {
      this.spinning = true;
      this.$api.assets
        .queryBuildingViewBuildInfo({ buildId: this.buildId })
        .then((r) => {
          this.spinning = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            let temp = res.data;
            temp.ownText = Number(temp.type) === 1 ? '房屋' : '楼栋';
            return (this.baseInfoData = temp);
          }
          throw res.message || '查询楼栋信息出错';
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err || '查询楼栋信息出错');
        });
    },
  },

  mounted() {
    // 从vuex中获取数据
    // this.baseInfoData = this.$store.state.asset.buildingView || {}
    this.queryHouseInfo();
  },
};
</script>

<style lang="less" scoped>
.base_info {
  .item_detail {
    margin-bottom: 30px;
  }
}
</style>
