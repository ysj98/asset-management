<!--车场视图业务-车场视图详情页面-资产使用方向组件-->
<template>
  <div class="asset_detail">
    <a-spin :spinning="spinning">
      <SG-Title title="资产使用方向" noMargin />
      <div class="title_div" style="margin-top: 20px">
        <overview-number :numList="numList" style="margin-bottom: 12px" />
        <!--楼层数据-->
        <a-row style="padding: 3px 0 15px" v-if="placingList.length || unitOptions.length">
          <a-col :span="12">
            <span style="line-height: 32px; font-weight: bold; color: #49505e; font-size: 14px">车位列表</span>
          </a-col>
          <a-col :span="12" style="text-align: right" v-if="unitOptions.length">
            <a-select v-model="parkingAreaName" @change="queryFloorInfo" style="width: 200px" placeholder="单元选择"
              :options="$addTitle(unitOptions)" />
          </a-col>
        </a-row>
        <div class="building_style" v-if="placingList.length">
          <div class="floor_style" v-for="item in placingList" :key="item.parkingAreaName">
            <div class="floor_num">{{ item.parkingAreaName }}</div>
            <div class="floor_rooms">
              <div class="room_style" v-for="place in item.parkingList" :key="place.parkingId">
                <a-popover :title="place.parkingName" overlayClassName="tooltip_sty">
                  <template slot="content">
                    <p>运营(㎡): {{ place.areaInfo.transferOperationArea }}</p>
                    <p>闲置(㎡): {{ place.areaInfo.idleArea }}</p>
                    <p>自用(㎡): {{ place.areaInfo.selfUserArea }}</p>
                    <p>占用(㎡): {{ place.areaInfo.occupationArea }}</p>
                    <p>其他(㎡): {{ place.areaInfo.otherArea }}</p>
                  </template>
                  <a @click="goDetail({ id: place.parkingId })">{{ place.parkingName }}</a>
                </a-popover>
              </div>
              <!-- <div
                class="room_style"
                v-for="place in item.parkingList"
                :key="place.parkingId"
                :style="handleStyle(place.areaInfo)"
                @mousemove="handleMouseMove($event, true, place.parkingId, place.parkingName)"
                @mouseout="handleMouseMove($event, false)"
              >
                <a @click="goDetail({id:place.parkingId})">{{place.parkingName}}</a>
              </div> -->
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import OverviewNumber from 'src/views/common/OverviewNumber';
import FloatView from './FloatView.vue';
import { win } from 'utils/utils';
export default {
  name: 'AssetDirectPart',
  components: { OverviewNumber, FloatView },
  props: ['organId', 'placeId', 'organName'],
  data() {
    return {
      spinning: false, // 加载状态
      timeoutId: 0, // 定时器Id
      roomId: '', // 房间Id
      roomNo: '', // 房间名称
      position: { clientX: 0, clientY: 0 }, // 设置浮窗的定位位置
      isShowFloatView: false, // 控制浮窗显示
      maxTotalArea: 1, // 每层所有房间面积之和中的最大值
      numList: [
        { title: '车位数量', key: 'parkingNums', value: 0, bgColor: '#4BD288', isAble: 'Y' },
        { title: '车场面积(㎡)', key: 'placeArea', value: 0, bgColor: '#1890FF', isAble: 'Y' },
        { title: '运营(㎡)', key: 'operationArea', value: 0, bgColor: '#DD81E6', code: '1001', isAble: 'Y' },
        { title: '闲置(㎡)', key: 'idleArea', value: 0, bgColor: '#FD7474', code: '1002', isAble: 'Y' },
        { title: '自用(㎡)', key: 'selfUserArea', value: 0, bgColor: '#BBC8D6', code: '1003', isAble: 'Y' },
        { title: '占用(㎡)', key: 'occupationArea', value: 0, bgColor: '#FD7474', code: '1004', isAble: 'Y' },
        { title: '其他(㎡)', key: 'otherArea', value: 0, bgColor: '#4BD288', code: '1005', isAble: 'Y' },
      ], // 概览数据,如是格式，title 标题，value 数值，color 背景色
      // mouseData: [
      //   {title: '车位名称', key: 'operationArea', value: 0},
      //   {title: '车位编码', key: 'operationArea', value: 0},
      //   {title: '车场面积(㎡)', key: 'operationArea', value: 0},
      //   {title: '使用方向', key: 'idleArea', value: 0},
      // ],
      bgColorObj: {
        idleArea: '#1890FF',
        otherArea: '#BBC8D6',
        selfUserArea: '#DD81E6',
        occupationArea: '#FD7474',
        transferOperationArea: '#4BD288',
      }, // 房间背景色映射
      placingList: [], // 楼层列表数据
      parkingAreaName: undefined, // 单元名下的楼层编码
      unitOptions: [], // 单元选项
      placeNum: 0, // 车位数量
    };
  },

  methods: {
    // 数据概览信息配置
    useForConfig() {
      this.$api.houseStatusConfig.querySettingByOrganId({ organId: this.organId }).then((res) => {
        if (res.data.code == 0) {
          let data = res.data.data;
          data.forEach((item) => {
            this.numList.forEach((e) => {
              if (item.code == e.code) {
                e.bgColor = item.color;
                e.isAble = item.isAble;
                e.title = item.alias + '(㎡)' || item.statusName + '(㎡)';
              }
            });
          });
          this.numList = this.numList.filter((i) => {
            return i.isAble === 'Y';
          });
        } else {
          this.$message.error(res.message || '系统内部错误');
        }
      });
    },
    goDetail({ id }) {
      const tabTitle = '车位详情';
      const tabUrl = `/asset-management/#/buildingDict/detailViewStall?type=detail&organId=${this.organId}&selectedOrganName=${this.organName}&placeId=${this.placeId}&parkingId=${id}`;
      win.openPortalMenu(tabUrl, tabTitle);
    },
    // 处理背景色和宽度
    handleStyle(areaInfo) {
      const { bgColorObj, maxTotalArea } = this;
      let colorArr = Object.keys(areaInfo).filter((n) => areaInfo[n]);
      let bagColor = colorArr.length === 1 ? bgColorObj[colorArr[0]] : '';
      let fontColor = colorArr.length === 1 ? '#fff' : '#687485';
      let width = Math.floor((Number(areaInfo.totalArea || 0) * 100000) / maxTotalArea) / 1000;
      return `background-color: ${bagColor}; width: ${width}%; color: ${fontColor}`;
    },

    // 计算每层所有房间面积之和中的最大值，作为所有房间宽度百分比的基数
    calcMaxTotalArea(list) {
      let totalList = list.map((item) => Number(item.floorArea));
      // return (item.roomList || []).reduce((accumulator, currentValue) => {
      //   return accumulator + Number(currentValue.totalArea || 0)
      // }, 0)
      // })
      this.maxTotalArea = Math.max(...totalList);
    },

    // 鼠标移入房间区域内
    handleMouseMove(e, bool, roomId, roomNo) {
      let _this = this;
      clearTimeout(_this.timeoutId);
      if (!bool) {
        // 鼠标移出立即隐藏浮窗
        return (_this.isShowFloatView = false);
      }
      _this.timeoutId = setTimeout(() => {
        let { clientX, clientY } = e;
        Object.assign(_this, {
          roomId,
          roomNo,
          isShowFloatView: true,
          position: { clientX, clientY },
        });
      }, 300);
    },

    // 鼠标移入/移出浮窗
    handleShowFloatView(bool) {
      let _this = this;
      clearTimeout(_this.timeoutId);
      if (bool) {
        // 鼠标移入浮窗立即设置true
        return (_this.isShowFloatView = true);
      }
      _this.timeoutId = setTimeout(() => {
        _this.isShowFloatView = false;
      }, 300);
    },

    // 查车场视图面积概览数据
    queryPlaceArea() {
      // const { buildId, mouseData } = this
      // let api = args ? 'queryBuildingViewRoomArea' : 'queryBuildingViewDetailArea'
      // let param = args ? { houseId: args.id, buildId } : { buildId }
      return this.$api.carPark
        .placeArea({ placeId: this.placeId })
        .then((r) => {
          let res = r.data;
          if (res && String(res.code) === '0') {
            this.numList = this.numList.map((m) => {
              if (m.key === 'parkingNums' || m.key === 'placeArea') {
                console.log(m.key);
                return { ...m, value: res.data[m.key] || 0 };
              } else {
                const { percent, number } = res.data[m.key];
                return { ...m, value: `${number}（${percent}）` };
              }
            });
            // 查车场视图详情的面积数据
            // let arr = mouseData.map(m => {
            //   const { percent, number } = res.data[m.key]
            //   return { ...m, value: `${number}（${percent}）` }
            // })
            // 查浮窗的面积数据与详情页面的面积数据共用一个接口
            // return args ? args.resolve(arr) : this.mouseData = arr
          }
        })
        .catch((err) => {
          this.$message.error(err || '查询车场视图面积使用统计出错');
        });
    },

    // 楼层信息查询
    queryFloorInfo() {
      const { parkingAreaName, placeId, organId } = this;
      // if (!unitId) { return sign === 'init' ? false : this.$message.warn('单元Id不存在') }
      this.spinning = true;
      this.$api.carPark
        .carParkingList({ placeId, organId, parkingAreaName })
        .then((r) => {
          this.spinning = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            this.placingList = res.data;
            return this.calcMaxTotalArea(res.data);
          }
          throw res.message || '查询楼层信息出错';
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err || '查询楼层信息出错');
        });
    },

    // 查询车场下的单元-楼层关系
    queryNameList() {
      this.spinning = true;
      this.$api.carPark
        .parkingAreaNames({ placeId: this.placeId, organId: this.organId })
        .then((r) => {
          this.spinning = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            // this.parkingAreaId = res.data[0].parkingAreaName
            this.unitOptions = (res.data || []).map((n, i) => {
              i === 0 && (this.parkingAreaName = n.parkingAreaName); // 默认查询第一条
              return { title: n.parkingAreaName, key: n.parkingAreaName };
            });
            return this.queryFloorInfo();
          }
          throw res.message || '查询楼层信息出错';
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err || '查询楼层信息出错');
        });
    },
  },

  mounted() {
    this.queryNameList();
    this.queryPlaceArea();
    this.useForConfig();
  },
};
</script>

<style lang="less" scoped>
.asset_detail {
  margin: 10px;

  .building_style {
    border: 1px solid #e5e9f2;
    border-bottom: none;

    .floor_style {
      height: 60px;
      border-bottom: 1px solid #e5e9f2;

      .floor_num {
        width: 80px;
        float: left;
        height: 100%;
        color: #49505e;
        font-weight: bold;
        padding-top: 22px;
        text-align: center;
        border-right: 1px solid #e5e9f2;
      }

      .floor_rooms {
        height: 100%;
        margin-left: 81px;
        white-space: nowrap;
        overflow-x: auto; // 房间设置了min-width，防止车场过多情况
        overflow-y: hidden;

        /*设置横向滚动样式*/
        &::-webkit-scrollbar {
          height: 5px;
        }

        .room_style {
          height: 100%;
          /*color: #fff;*/
          min-width: 10px;
          cursor: default;
          overflow: hidden;
          padding-top: 22px;
          text-align: center;
          display: inline-block;
          border-right: 1px solid #e5e9f2;
          padding-left: 10px;
          padding-right: 10px;
        }
      }
    }
  }
}
</style>
<style lang="less">
//
.tooltip_sty .ant-popover-content {
  .ant-popover-arrow {
    position: unset;
  }

  .ant-popover-inner {
    div {
      background-color: rgba(0, 0, 0, 0.5);
      color: #fff;
      text-align: center;
      border-radius: 5px;

      .ant-popover-title {
        font-size: 16px;
      }
    }
  }
}
</style>
