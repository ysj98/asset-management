<!--楼栋视图业务-楼栋视图详情页面-资产使用方向组件-->
<template>
  <div class="asset_detail">
    <a-spin :spinning="spinning">
      <SG-Title title="资产使用方向" noMargin/>
      <div class="title_div" style="margin-top: 20px">
        <overview-number :numList="numList" style="margin-bottom: 12px"/>
        <!--楼层数据-->
        <a-row style="padding: 3px 0 15px" v-if="buildingList.length || unitOptions.length">
          <a-col :span="12">
            <span style="line-height: 32px; font-weight: bold; color: #49505E; font-size: 14px">楼栋列表</span>
          </a-col>
          <a-col :span="12" style="text-align: right" v-if="unitOptions.length">
            <a-select v-model="unitId" @change="queryFloorInfo" style="width: 200px" placeholder="单元选择" :options="$addTitle(unitOptions)"/>
          </a-col>
        </a-row>
        <!-- 楼栋列表 -->
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
                @click="goDetail({id:room.roomId})"
              >
                {{room.roomName}}
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
  import {win} from "utils/utils";
  export default {
    name: 'AssetDirectPart',
    components: { OverviewNumber, FloatView },
    props: ['organId', 'buildId','organName'],
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
          {title: '运营(㎡)', key: 'operationArea', value: 0, bgColor: '#4BD288'},
          {title: '闲置(㎡)', key: 'idleArea', value: 0, bgColor: '#1890FF'},
          {title: '自用(㎡)', key: 'selfUserArea', value: 0, bgColor: '#DD81E6'},
          {title: '占用(㎡)', key: 'occupationArea', value: 0, bgColor: '#FD7474'},
          {title: '其他(㎡)', key: 'otherArea', value: 0, bgColor: '#BBC8D6'}
        ], // 概览数据,如是格式，title 标题，value 数值，color 背景色
        bgColorObj: {
          idleArea: '#1890FF',
          otherArea: '#BBC8D6',
          selfUserArea: '#DD81E6',
          occupationArea: '#FD7474',
          transferOperationArea: '#4BD288'
        }, // 房间背景色映射
        buildingList: [], // 楼层列表数据
        unitId: undefined, // 单元名下的楼层编码
        unitOptions: [] // 单元选项
      }
    },

    methods: {
      goDetail({id}){
        const tabTitle = '房间详情'
        const tabUrl = `/asset-management/#/buildingDict/detailHouse?type=detail&organId=${this.organId}&selectedOrganName=${this.organName}&houseId=${id}&searchBuildName=`
        win.openPortalMenu(tabUrl,tabTitle)
      },
      // 处理背景色和宽度
      handleStyle (areaInfo, totalArea) {
        const { bgColorObj, maxTotalArea } = this
        let colorArr = Object.keys(areaInfo).filter(n => areaInfo[n])
        // 如果只有一种面积，则显示对应的面积颜色 bgColorObj
        let bagColor = colorArr.length === 1 ? bgColorObj[colorArr[0]] : ''
        let fontColor = colorArr.length === 1 ? '#fff' : '#000000'
        let width = 0
        if (Number(totalArea) < 100) {
          width = 50
        } else if (100 <= Number(totalArea) < 500) {
          width = 70
        } else if (500 <= Number(totalArea)) {
          width = 100
        }
        // let width = Math.floor(Number(totalArea || 0) * 100000 / maxTotalArea) / 1000
        return `background-color: ${bagColor}; width: ${width}px; color: ${fontColor};${colorArr.length !== 1? 'border: 1px solid #E5E9F2;' : ''}`
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
          // 鼠标移出立即隐藏浮窗
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
          // 鼠标移入浮窗立即设置true
          return _this.isShowFloatView = true
        }
        _this.timeoutId = setTimeout(() => {
          _this.isShowFloatView = false
        }, 300)
      },

      // 查询楼栋视图面积概览数据
      queryHouseAreaInfo (args) {
        const { buildId, numList } = this
        let api = args ? 'queryBuildingViewRoomArea' : 'queryBuildingViewDetailArea'
        let param = args ? { houseId: args.id, buildId } : { buildId }
        return this.$api.assets[api](param).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            // 查楼栋视图详情的面积数据
            let arr = numList.map(m => {
              const { percent, number } = res.data[m.key]
              return { ...m, value: `${number}（${percent}）` }
            })
            // 查浮窗的面积数据与详情页面的面积数据共用一个接口
            return args ? args.resolve(arr) : this.numList = arr
          }
          throw res.message || '查询楼栋视图面积使用统计出错'
        }).catch(err => {
          args && args.reject()
          this.$message.error(err || '查询楼栋视图面积使用统计出错')
        })
      },

      // 楼层信息查询
      queryFloorInfo () {
        const { unitId, buildId, organId } = this
        // if (!unitId) { return sign === 'init' ? false : this.$message.warn('单元Id不存在') }
        this.spinning = true
        this.$api.assets.queryBuildingViewFloorInfo({buildId, organId, unitId}).then(r => {
          this.spinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.buildingList = res.data
            this.buildingList.forEach(item => {
              if (Array.isArray(item.roomList) && item.roomList.length > 0) {
                item.roomList.forEach(room => {
                  room.roomName = room.roomNo.split('_')[room.roomNo.split('_').length - 1]
                })
              }
            })
            // return this.calcMaxTotalArea(res.data)
          }
          throw res.message || '查询楼层信息出错'
        }).catch(err => {
          this.spinning = false
          this.$message.error(err || '查询楼层信息出错')
        })
      },

      // 查询楼栋下的单元-楼层关系
      queryUnit () {
        this.spinning = true
        this.$api.assets.queryBuildingViewUnitByHouseId({buildId: this.buildId, organId: this.organId}).then(r => {
          this.spinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.unitOptions = (res.data || []).map((n, i) => {
              i === 0 && (this.unitId = n.unitId) // 默认查询第一条
              return { title: n.unitName, key: n.unitId }
            })
            return this.queryFloorInfo()
          }
          throw res.message || '查询楼层信息出错'
        }).catch(err => {
          this.spinning = false
          this.$message.error(err || '查询楼层信息出错')
        })
      }
    },

    mounted () {
      this.queryUnit()
      this.queryHouseAreaInfo()
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
        border-bottom: 1px solid #E5E9F2;
        display:flex;
        .floor_num {
          align-self: center;
          width: 8%;
          height: 100%;
          line-height:100%;
          color: #49505E;
          font-weight: bold;
          text-align: center;
        }
        .floor_rooms {
          border-left: 1px solid #E5E9F2;
          width: 92%;
          .room_style {
            height: 60px;
            line-height:60px;
            min-width: 10px;
            cursor: pointer;
            overflow: hidden;
            font-weight: bold;
            text-align: center;
            display: inline-block;
            border-right: 1px solid #E5E9F2;
          }
        }
      }
    }
  }
</style>
