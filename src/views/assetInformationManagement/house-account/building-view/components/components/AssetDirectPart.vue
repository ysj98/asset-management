<!--楼栋视图业务-楼栋视图详情页面-资产使用方向组件-->
<template>
  <div class="asset_detail">
    <a-spin :spinning="spinning">
      <SG-Title title="资产使用方向" noMargin/>
      <div class="title_div" style="margin-top: 20px">
        <overview-number :numList="numList" style="margin-bottom: 12px"/>
        <!--楼层数据-->
        <div class="building_style" v-if="buildingList.length">
          <div class="floor_style" v-for="floor in buildingList" :key="floor.floorName">
            <div class="floor_num">{{floor.floorName}}</div>
            <div class="floor_rooms">
              <div
                class="room_style"
                v-for="room in floor.roomList"
                :key="room.roomNo"
                :style="handleStyle(room.areaInfo, room.totalArea)"
                @mousemove="handleMouseMove($event, true, room.roomId, room.roomNo)"
                @mouseout="handleMouseMove($event, false)"
              >
                {{room.roomNo}}
              </div>
            </div>
          </div>
        </div>
        <float-view
          v-if="roomId"
          :roomNo="roomNo"
          :roomId="roomId"
          :position='position'
          v-show="isShowFloatView"
          @queryAreaInfo="queryHouseAreaInfo"
          @handleMouseAction="handleShowFloatView"
        />
      </div>
    </a-spin>
  </div>
</template>

<script>
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import FloatView from './FloatView'
  export default {
    name: 'AssetDirectPart',
    components: { OverviewNumber, FloatView },
    props: ['organId', 'assetHouseId', 'projectId'],
    data () {
      return {
        spinning: false, // 加载状态
        timeoutId: 0, // 定时器Id
        roomId: '', // 房间Id
        roomNo: '', // 房间名称
        position: { clientX: 0, clientY: 0 }, // 设置浮窗的定位位置
        isShowFloatView: false, // 控制浮窗显示
        maxTotalArea: 1, // 每层所有房间面积之和中的最大值
        numList: [
          {title: '运营(㎡)', key: 'totalOperationArea', value: 0, bgColor: '#4BD288'},
          {title: '闲置(㎡)', key: 'totalIdleArea', value: 0, bgColor: '#1890FF'},
          {title: '自用(㎡)', key: 'totalSelfUserArea', value: 0, bgColor: '#DD81E6'},
          {title: '占用(㎡)', key: 'totalOccupationArea', value: 0, bgColor: '#FD7474'},
          {title: '其他(㎡)', key: 'totalOtherArea', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数据,如是格式，title 标题，value 数值，color 背景色
        bgColorObj: {
          idleArea: '#1890FF',
          otherArea: '#BBC8D6',
          selfUserArea: '#DD81E6',
          occupationArea: '#FD7474',
          transferOperationArea: '#4BD288'
        }, // 房间背景色映射
        buildingList: [
          // {
          //   floorName: '一层',
          //   floorArea: 110,
          //   roomList: [
          //     {
          //       totalArea: 100, roomNo: 1011, roomId: 101, areaInfo: {
          //         transferOperationArea: 15,
          //         idleArea: 35,
          //         selfUserArea: 75,
          //         occupationArea: 15,
          //         otherArea: 25
          //       }
          //     }
          //   ]
          // }
        ]
      }
    },

    methods: {
      // 处理背景色和宽度
      handleStyle (areaInfo, totalArea) {
        const { bgColorObj, maxTotalArea } = this
        let colorArr = Object.keys(areaInfo).filter(n => areaInfo[n])
        let bagColor = colorArr.length === 1 ? bgColorObj[colorArr[0]] : ''
        let fontColor = colorArr.length > 1 ? '#687485' : '#fff'
        let width = (Number(totalArea) / maxTotalArea * 100).toFixed(2)
        return `background-color: ${bagColor}; width: ${width}%; color: ${fontColor}`
      },

      // 计算每层所有房间面积之和中的最大值，作为所有房间宽度百分比的基数
      calcMaxTotalArea (list) {
        let totalList = list.map(item => Number(item.floorArea))
          // return (item.roomList || []).reduce((accumulator, currentValue) => {
          //   return accumulator + Number(currentValue.totalArea || 0)
          // }, 0)
        // })
        this.maxTotalArea = Math.max(...totalList)
      },
      
      // 鼠标移入房间区域内
      handleMouseMove (e, bool, roomId, roomNo) {
        let _this = this
        clearTimeout(_this.timeoutId)
        if (!bool) {
          // 鼠标移出立即隐藏
          return _this.isShowFloatView = false
        }
        _this.timeoutId = setTimeout(() => {
          let {clientX, clientY} = e
          Object.assign(_this, {
            roomId, roomNo,
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
      },

      // 查询楼栋视图面积概览数据
      queryHouseAreaInfo (args) {
        const { buildingId, numList } = this
        return this.$api.assets.queryAssetViewHouseArea({ assetHouseId: args ? args.id : buildingId }).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            // 查楼栋视图详情的面积数据
            let arr = numList.map(m => {
              const { percent, number } = res.data[m.key]
              return {
                ...m,
                value: `${number}(${percent})`
              }
            })
            // 查浮窗的面积数据与详情页面的面积数据共用一个接口
            return args.id ? args.resolve(arr) : this.numList = arr
          }
          throw res.message || '查询楼栋视图面积使用统计出错'
        }).catch(err => {
          args.id && args.reject()
          this.$message.error(err || '查询楼栋视图面积使用统计出错')
        })
      },

      // 楼层信息查询
      queryFloorInfo () {
        this.spinning = true
        this.$api.assets.queryBuildingViewFloorInfo({assetHouseId: this.houseId, organId: this.organId}).then(r => {
          this.spinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.buildingList = res.data
            return this.calcMaxTotalArea(res.data)
          }
          throw res.message || '查询楼层信息出错'
        }).catch(err => {
          this.spinning = false
          this.$message.error(err || '查询楼层信息出错')
        })
      }
    },

    mounted () {
      // 模拟调用接口
      // this.calcMaxTotalArea(this.buildingList)
      // this.queryFloorInfo()
      // this.queryHouseAreaInfo()
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
            /*color: #fff;*/
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
