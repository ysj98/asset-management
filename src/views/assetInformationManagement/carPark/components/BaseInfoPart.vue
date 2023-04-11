<!--楼栋视图业务-楼栋视图详情页面-基础信息组件-->
<template>
  <div class="base_info">
    <a-spin :spinning="spinning"></a-spin>
    <SG-Title title="基础信息" noMargin />
    <div class="title_div" style="margin-top: 20px">
      <a-row :gutter="16">
        <a-col v-for="(item, i) in baseInfoKeys" :span="8" :key="i">
          <div v-for="{ title, key } in item" :key="key" class="item_detail">
            <div v-if="key === 'placeImg'">
              <img :src="baseInfoData['placeImg'] ? `${imgPrx}${baseInfoData['placeImg']}` : defaultImgUrl" style="height: 115px" />
            </div>
            <div v-else>
              <span style="color: #282d5b">{{ title ? `${title}:` : '' }}</span>
              <span style="margin-left: 4px" v-if="key === 'buildName'">
                <a @click="goDetail(title)">{{ baseInfoData[key] || '' }}</a>
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
import { win } from 'utils/utils';
export default {
  name: 'BaseInfoPart',
  props: ['assetCarParkId', 'baseInfoKeys', 'placeId', 'comType'],
  data() {
    return {
      imgPrx: window.__configs.hostImg,
      spinning: false, // 页面加载状态
      defaultImgUrl: require('src/assets/image/carPark@2x.png'),
      baseInfoData: {},
    };
  },

  methods: {
    goDetail(val) {
      if (val === '资产名称') {
        this.$emit('parkingDetail');
        return;
      }
      const fromType = 'portal';
      const positionId = this.$route.query.assetCarParkId;
      const tabTitle = '车场详情';
      const tabUrl = `/asset-management/#/createBuildDetail?fromType=${fromType}&positionId=${positionId}`;
      win.openPortalMenu(tabUrl, tabTitle);
    },
    // 查询基本信息
    queryHouseInfo() {
      let { comType, placeId, assetCarParkId } = this;
      this.spinning = true;
      let form = {};
      if (comType === 'assetCarPark') {
        form = { assetCarParkId };
      } else if (comType === 'carParkViewDetail') {
        form = { placeId };
      }
      this.$api.carPark[comType](form)
        .then((r) => {
          this.spinning = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            let temp = res.data;
            this.$set(temp, 'assetType', '车场');
            this.$set(temp, 'typeName', temp.type === 1 ? '车场' : '车位');
            return (this.baseInfoData = temp);
          }
          throw res.message || '查询车场信息出错';
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err || '查询车场信息出错');
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
