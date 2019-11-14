<!--楼栋视图业务-楼栋视图详情页面-资产使用方向组件-->
<template>
  <div class="asset_detail">
    <SG-Title title="资产使用方向" noMargin/>
    <div class="title_div">
      <overview-number :numList="numList"/>
      <!--楼层数据-->
      <div class="building_style" v-if="buildingList.length">
        <div class="floor_style" v-for="floor in buildingList" :key="floor.floorName">
          <div class="floor_num">{{floor.floorName}}</div>
          <div class="floor_rooms">
            <div
              class="room_style"
              v-for="room in floor.roomList"
              :key="room.roomNo"
              :style="handleStyle(room.status, room.area)"
              @mousemove="handleMouseMove($event, true, room.roomNo)"
              @mouseout="handleMouseMove($event, false)"
            >
              {{room.name}}
            </div>
          </div>
        </div>
      </div>
      <float-view
        :id="roomId"
        v-if="roomId"
        :position='position'
        v-show="isShowFloatView"
        @handleMouseAction="handleShowFloatView"
      />
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import FloatView from './FloatView'
  export default {
    name: 'AssetDirectPart',
    components: { OverviewNumber, FloatView },
    data () {
      return {
        ...mapState('asset', ['buildingView']),
        timeoutId: 0, // 定时器Id
        roomId: '', // 房间Id
        position: { clientX: 0, clientY: 0 }, // 设置浮窗的定位位置
        isShowFloatView: false, // 控制浮窗显示
        maxTotalArea: 1, // 每层所有房间面积之和中的最大值
        numList: [
          {title: '运营(㎡)', value: 0, bgColor: '#4BD288'}, {title: '闲置(㎡)', value: 0, bgColor: '#1890FF'},
          {title: '自用(㎡)', value: 0, bgColor: '#DD81E6'}, {title: '占用(㎡)', value: 0, bgColor: '#FD7474'},
          {title: '其他(㎡)', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数据,如是格式，title 标题，value 数值，color 背景色
        bgColorObj: {1: '#1890FF', 2: '#DD81E6', 3: '#FD7474', 4: '#BBC8D6', 5: '#4BD288'}, // 房间背景色映射
        buildingList: [
          {
            floorName: '一层',
            roomList: [
              { area: 100, roomNo: 1011, name: 101, status: 2 },
              { area: 10, roomNo: 10121, name: 102, status: 4 }
            ]
          },
          {
            floorName: '二层',
            roomList: [
              { area: 10, roomNo: 7101, name: 21011, status: 1 },
              { area: 20, roomNo: 1701, name: 21012 },
              { area: 30, roomNo: 19801, name: 21013, status: 5 },
              { area: 40, roomNo: 17801, name: 21014 },
              { area: 50, roomNo: 10781, name: 21015, status: 3 }
            ]
          }
        ]
      }
    },

    methods: {
      // 处理背景色和宽度
      handleStyle (status, area) {
        const { bgColorObj, maxTotalArea } = this
        let color = bgColorObj[status] || ''
        let width = (Number(area) / maxTotalArea * 100).toFixed(2)
        return `background-color: ${color}; width: ${width}%`
      },

      // 计算每层所有房间面积之和中的最大值，作为所有房间宽度百分比的基数
      calcMaxTotalArea () {
        const {buildingList} = this
        let totalList = buildingList.map(item => {
          return (item.roomList || []).reduce((accumulator, currentValue) => {
            return accumulator + Number(currentValue.area || 0)
          }, 0)
        })
        this.maxTotalArea = Math.max(...totalList)
      },
      
      // 鼠标移入房间区域内
      handleMouseMove (e, bool, roomId) {
        let _this = this
        clearTimeout(_this.timeoutId)
        if (!bool) {
          // 鼠标移出立即隐藏
          return _this.isShowFloatView = false
        }
        _this.timeoutId = setTimeout(() => {
          let {clientX, clientY} = e
          Object.assign(_this, {
            roomId,
            isShowFloatView: true,
            position: { clientX, clientY }
          })
        }, 300)
      },

      // 鼠标移入/移出浮窗
      handleShowFloatView (bool) {
        let _this = this
        clearTimeout(_this.timeoutId)
        if (bool) {
          // 鼠标移出立即显示
          return _this.isShowFloatView = true
        }
        _this.timeoutId = setTimeout(() => {
          _this.isShowFloatView = false
        }, 300)
      }
    },

    mounted () {
      this.calcMaxTotalArea()
    }
  }
</script>

<style lang='less' scoped>
  .asset_detail {
    margin: 10px;
    .building_style {
      border: 1px solid #E5E9F2;
      border-bottom: none;
      .floor_style {
        height: 60px;
        border-bottom: 1px solid #E5E9F2;
        .floor_num {
          width: 80px;
          float: left;
          height: 100%;
          color: #49505E;
          font-weight: bold;
          padding-top: 22px;
          text-align: center;
          border-right: 1px solid #E5E9F2;
        }
        .floor_rooms {
          height: 100%;
          margin-left: 81px;
          white-space: nowrap;
          overflow-x: auto; // 房间设置了min-width，防止楼栋过多情况
          overflow-y: hidden;
          /*设置横向滚动样式*/
          &::-webkit-scrollbar {
            height:5px;
          }
          .room_style {
            height: 100%;
            color: #687485;
            min-width: 10px;
            cursor: default;
            overflow: hidden;
            padding-top: 22px;
            text-align: center;
            display: inline-block;
            border-right: 1px solid #E5E9F2;
          }
        }
      }
    }
  }
</style>
