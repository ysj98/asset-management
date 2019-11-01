<!--停车场异步选择树-->
<template>
  <div class="custom-tree building-tree">
    <a-tree
       @expand="onExpand"
       :loadData="onLoadData"
       :expandedKeys="expandedKeys"
       :autoExpandParent="autoExpandParent"
      :treeData="gData"
      @select="hanldSelect"
      >
      <template slot="title" slot-scope="scope">
        <div class="tree-bg-box" :class="[scope.key===activeKey&&'active']" @click="hanldeOper(scope)">
          <span class="tree-node-title">
            {{scope.title}}
          </span>
          <!-- 图标加号 -->
          <template>
            <span class="tree-ope-box">
              <a-icon type="plus" class="tree-icon btn_click" />
            </span>
          </template>
        </div>
      </template>
    </a-tree>
  </div>
</template>
<script>
let getUuid = ((uuid = 1) => () => ++uuid)()
export default {
  props: {
    communityId: {
      type: [String, Number],
      default: ''
    }
  },
  watch: {
    communityId (nv) {
      if (nv) {
        this.queryParkingPlaceListByOpt(nv)
      }
    },
  },
  mounted () {
    if (this.communityId) {
      this.queryParkingPlaceListByOpt(this.communityId)
    }
  },
  data () {
    return {
      activeKey: '', // 当前点击项
      expandedKeys: [],
      autoExpandParent: true,
      gData: [],
      dataList: [],
      selectItem: {}, // 当前添加项
    }
  },
  methods: {
    emptyTreeData () {
      this.gData = []
      this.expandedKeys = []
      this.dataList = []
      this.activeKey = ''
      this.selectItem = {}
    },
    hanldeOper (scope) {
      console.log('点击项=>', scope)
      this.selectItem = {...scope}
      this.activeKey = scope.key
      this.$emit('add', {...scope})
    },
    hanldSelect () {
    },
    onExpand  (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 异步加载数据
    onLoadData (treeNode) {
      // 单元查楼层
      // if (treeNode.dataRef.type === 'parking') {
      //   return this.queryPlaceAreaListByPlaceIdList(treeNode.dataRef.id)
      // }
      return Promise.resolve()
    },
    // 请求停车场
    queryParkingPlaceListByOpt (communityId) {
      this.emptyTreeData()
      return this.$api.undertake.queryParkingPlaceListByOpt({communityId}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          let arr = result.map(item => {
            return {
              ...item,
              type: 'parking', // 车场
              id: item.placeId,
              key: getUuid(),
              scopedSlots: { title: 'title' },
              title: item.placeName,
              positionEntityName: item.placeName
            }
          })
          this.gData = arr
          this.dataList = this.dataList.concat(arr)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 根据车场请求停车区域
    queryPlaceAreaListByPlaceIdList (placeId) {
      return this.$api.undertake.queryPlaceAreaListByPlaceIdList({placeId}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          let arr = result.map(item => {
            return {
              ...item,
              type: 'parkingArea', // 车场区域
              id: item.parkingAreaId,
              key: getUuid(),
              scopedSlots: { title: 'title' },
              title: item.name
            }
          })
          for (let i = 0; i < this.gData.length; i++) {
            let item = this.gData[i]
            if (item.placeId === placeId) {
              arr.forEach(elm => {
                elm.positionEntityName = item.positionEntityName + '-' + elm.title
              })
              this.$set(item, 'children', arr)
              this.dataList = this.dataList.concat(arr)
              return
            }
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
}
</script>
<style lang="less" scoped>
  .tree-bg-box{
  &::before{
    content: '';
    display: inline-block;
    position: absolute;
    left: 0;
    right: 0;
    height: 30px;
    margin-top: -2px;
    background: transparent;
    z-index: -1;
  }
  .tree-ope-box{
    position: absolute;
    right: 16px;
    z-index: 3;
    display: none;
  }
  &:hover{
    &::before{
      background: #f5f7fa;
    }
    .tree-ope-box{
      display: inline-block;
    }
  }
  &.active{
    &::before{
      background: #f5f7fa;
    }
    .tree-ope-box{
      display: inline-block;
    }
  }
}
</style>
<style lang="less">
.building-tree{
  .ant-tree li .ant-tree-node-content-wrapper{cursor: default;}
}
</style>
