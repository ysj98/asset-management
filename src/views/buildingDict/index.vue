<!--
 * @Date: 2019-11-05 10:55:52
 * @Author: chen han
 * @Description: 楼盘字典首页
 -->
<template>
  <div class="buildingDict-page">
    <div class="custom-tabs">
      <div class="top-select">
        <a-checkbox :checked="Boolean(isCurrent)" @change="changeChecked" style="margin-top: 7px; margin-right: 10px">
          仅当前机构下{{ tabName }}
        </a-checkbox>
        <treeSelect
          @changeTree="organIdChange"
          :typeFilter="typeFilter"
          placeholder="请选择组织机构"
          :allowClear="false"
          :style="allWidth"
          :showSearch="true"
        ></treeSelect>
      </div>
      <a-tabs @change="tabChange" v-model="showKey" type="card" :tabBarGutter="10">
        <a-tab-pane v-for="tabPane in tabList" :key="tabPane.keyStr" v-show="$power.has(tabPane.auth)" :tab="tabPane.title">
          <components v-if="showKey === tabPane.keyStr" :is="tabPane.components" :isCurrent="isCurrent" :organIdInfo="organIdInfo"></components>
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>
<script>
const tabList = [
  {
    auth: ASSET_MANAGEMENT.ASSET_SOURCE_TAB_BUILD,
    title: '楼栋信息',
    keyStr: 'building',
    components: 'buildingInfo',
  },
  {
    auth: ASSET_MANAGEMENT.ASSET_SOURCE_TAB_HOUSE,
    title: '房间信息',
    keyStr: 'house',
    components: 'houseInfo',
  },
  {
    auth: ASSET_MANAGEMENT.ASSET_SOURCE_TAB_LAND,
    title: '土地信息',
    keyStr: 'land',
    components: 'landInfo',
  },
  {
    auth: ASSET_MANAGEMENT.ASSET_SOURCE_TAB_PARK,
    title: '车场信息',
    keyStr: 'park',
    components: 'parkInfo',
  },
  {
    auth: ASSET_MANAGEMENT.ASSET_SOURCE_TAB_PARK_ITEM,
    title: '车位信息',
    keyStr: 'stall',
    components: 'stallInfo',
  },
  {
    auth: ASSET_MANAGEMENT.ASSET_SOURCE_TAB_EQ,
    title: '设备信息',
    keyStr: 'equipment',
    components: 'equipmentInfo',
  },
];
import { ASSET_MANAGEMENT } from '@/config/config.power';
import buildingInfo from './buildingInfo';
import houseInfo from './houseInfo';
import landInfo from './land/landInfo';
import parkInfo from './park/ParkInfo';
import StallInfo from './stall/StallInfo';
import TreeSelect from '../common/treeSelect';
import { typeFilter } from './buildingDictConfig';
import EquipmentInfo from './equipment/EquipmentInfo';
const allWidth = { width: '250px', zIndex: 99999 };
export default {
  components: {
    EquipmentInfo,
    parkInfo,
    landInfo,
    houseInfo,
    StallInfo,
    TreeSelect,
    buildingInfo,
  },
  computed: {
    tabName() {
      return tabList
        .filter((i) => {
          return this.showKey === i.keyStr;
        })[0]
        .title.slice(0, 2);
    },
  },
  data() {
    return {
      ASSET_MANAGEMENT,
      typeFilter,
      isCurrent: 0, // 查询条件-是否仅当前机构
      showKey: 'building',
      allWidth,
      organIdInfo: { organId: '', organName: '' },
      tabList: tabList,
    };
  },
  created() {
    this.init();
    // let query = this.GET_ROUTE_QUERY(this.$route.path)
    // if (Object.keys(query).length > 0) {
    //   if (query.showKey === 'house') {
    //     this.showKey = 'house'
    //   }
    // }
  },
  // beforeRouteLeave (to, from, next) {
  //   if (to.path.indexOf(from.path) === -1) {
  //     let o = {
  //       key: from.path,
  //       data: {}
  //     }
  //     this.$store.commit('pro/SET_ROUTE_QUERY', o)
  //   }
  //   next()
  // },
  methods: {
    // 处理是否选中仅当前机构
    changeChecked(e) {
      this.isCurrent = Number(e.target.checked);
    },
    tabChange(v) {
      console.log(this.organIdInfo, '切换tab', v);
      this.showKey = v;
    },
    organIdChange(organId, organName) {
      console.log(organId, organName, '顶部组织机构');
      this.organIdInfo.organId = organId;
      this.organIdInfo.organName = organName;
    },
    init() {
      for (let i = 0; i < tabList.length; i++) {
        if (this.$power.has(tabList[i].auth)) {
          this.showKey = tabList[i].keyStr;
          break;
        }
      }
    },
  },
};
</script>
<style lang="less" scoped>
.buildingDict-page {
  position: relative;
}
.top-select {
  position: absolute;
  right: 30px;
  top: 13px;
}
</style>
