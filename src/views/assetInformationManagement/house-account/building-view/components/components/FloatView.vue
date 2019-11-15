<!--楼栋视图业务-楼栋视图详情页面-房间信息的浮窗展示组件-->
<template>
  <div
    class="float_view"
    :style="positionObj"
    @mouseenter="handleMouseAction(true)"
    @mouseleave="handleMouseAction(false)"
  >
    <a-spin :spinning="spinning">
      <div class="title">{{title}}</div>
      <div class="content">
        <div v-for="{status, value, percent} in dataList" :key="status" style="padding-bottom: 17px">
          <span style="margin-right: 8px">{{typeObj[status]}}:</span>
          <span>{{`${value || 0}㎡（${percent || 0}%）`}}</span>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
  export default {
    name: 'FloatView',
    props: ['position', 'roomId'],
    data () {
      return {
        count: 0, // 何时设置transition的标志
        timeoutId: 0, // 请求接口的定时器Id
        spinning: false,
        title: '测试房间110',
        positionObj: { top: 0, left: 0 },
        typeObj: { 1: '运营', 2: '闲置', 3: '自用', 4: '占用', 5: '其它'},
        roomDataCache: new Map(), // Map与Array有互转API，便于删除最早放入的键值对，且增删键值对有性能优势(详见MDN)
        dataList: [{status: 1, value: 100, percent: 10}, {status: 2, value: 100, percent: 10}, {status: 3, value: 100}]
      }
    },

    methods: {
      // 设置浮窗位置
      setPos (position) {
        const { clientX, clientY } = position
        this.count += clientX ? 1 : 0
        // 获取浮窗的宽度和高度
        let { offsetHeight: h, offsetWidth: w } = document.getElementsByClassName('float_view')[0]
        // 获取当前视图的宽度和高度
        let ch = document.documentElement.clientHeight
        let cw = document.documentElement.clientWidth
        // 判断定位点距视图右侧及距视图底部的空间是否能容下浮窗
        let top = ch - clientY > h ? `${clientY + 5}px` : `${clientY - h - 5}px`
        let left = cw - clientX > w ? `${clientX + 5}px` : `${clientX - w - 5}px`
        this.positionObj = {
          top, left,
          transition: this.count > 1 ? 'top,left 0.3s' : '' // 防止浮窗第一次显示从最左侧滑出
        }
      },

      // 鼠标移入移出浮窗
      handleMouseAction (bool) {
        this.$emit('handleMouseAction', bool)
      },

      // 查询room数据
      searchRoomData (id) {
        // wofdoewdf//////////////////////////
        this.storeRoomCache({id, data: {}})
      },

      // 缓存15个房间的信息
      storeRoomCache ({id, data}) {
        let { roomDataCache } = this
        if (roomDataCache.size >=15) {
          // 删除最早放入roomDataCache的数据
          roomDataCache = new Map(Array.from(roomDataCache).splice(1))
        }
        roomDataCache.set(id, data)
      }
    },

    mounted () {
      this.setPos(this.position)
    },

    watch: {
      position: function (obj) {
        this.setPos(obj)
      },
      
      roomId: function (id) {
        if (!id) { return false }
        const { roomDataCache } = this
        if (roomDataCache.has(id)) {
          return this.dataList = roomDataCache.get(id)
        } else {
          let _this = this
          clearTimeout(_this.timeoutId)
          _this.timeoutId = setTimeout(() => {
            _this.searchRoomData(id)
          }, 300)
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .float_view {
    z-index: 999;
    width: auto;
    color: #FFFFFF;
    min-width: 155px;
    max-width: 200px;
    border-radius:4px;
    position: fixed;
    display: inline-block;
    background-color: rgba(0,0,0,0.77);
    .title {
      font-size: 14px;
      text-align: center;
      margin-bottom: 15px;
      padding: 12px 0 10px;
      border-bottom: 1px solid #FFFFFF;
    }
    .content {
      padding: 0 23px;
      /*padding-bottom: 21px;*/
    }
  }
</style>
