<!---->
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
              <a-icon type="plus" v-if="showTypeArr.includes(scope.type)" class="tree-icon btn_click" />
            </span>
          </template>
        </div>
      </template>
    </a-tree>
  </div>
</template>
<script>
let getUuid = ((uuid = 1) => () => ++uuid)()
function fetchItem(data = [], id, type){
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    if (item[type] === id) {
      return item
    }
    let _item = fetchItem(item.children, id, type)
    if (_item) {
      return _item
    }
  }
  return false
}
export default {
  props: {
    communityId: {
      type: [String, Number],
      default: ''
    },
    showTypeArr: {
      type: [Array],
      default: () => []
    }
  },
  watch: {
    communityId (nv) {
      if (nv) {
        console.log('监听', nv)
        this.queryBuildInfoByCommId(nv)
      }
    },
  },
  mounted () {
    if (this.communityId) {
      console.log('mount', this.communityId)
      this.queryBuildInfoByCommId(this.communityId)
    }
    console.log('显示层级=>', this.showTypeArr)
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
      if (!this.showTypeArr.includes(scope.type)) {
        return
      }
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
      // 楼栋下有单元
      // if (!this.showTypeArr.includes(treeNode.dataRef.type)) {
      //   return Promise.resolve()
      // }
      if (treeNode.dataRef.type === 'build' && String(treeNode.dataRef.isUnit) === '1') {
        return this.queryUnitListByBuildId(treeNode.dataRef.id, '1')
      }
      // 楼栋下无单元, 查楼层
      if (treeNode.dataRef.type === 'build' && String(treeNode.dataRef.isUnit) !== '1') {
        return this.queryFloorListByBuildId(treeNode.dataRef.id)
      }
      // 单元查楼层
      if (treeNode.dataRef.type === 'unit') {
        return this.queryFloorListByUnitId(treeNode.dataRef.id)
      }
      // 查房间
      if (treeNode.dataRef.type === 'floor') {
        return this.queryHouseBriefByFloorId(treeNode.dataRef.id)
      }
      return Promise.resolve()
    },
    // 给组件外层调用根据项目id查询楼栋
    queryBuildInfoByCommId (communityId) {
      this.emptyTreeData()
      return this.$api.undertake.queryBuildInfoByCommId({communityId}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          let arr = result.map(item => {
            return {
              ...item,
              type: 'build', // 楼栋
              id: item.buildId,
              key: getUuid(),
              scopedSlots: { title: 'title' },
              title: item.name,
              positionEntityName: item.name,
            }
          })
          this.gData = arr
          this.dataList = this.dataList.concat(arr)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 根据楼栋ID查询单元列表,有效
    queryUnitListByBuildId (buildId, status) {
      return this.$api.undertake.queryUnitListByBuildId({buildId, status}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          let arr = result.map(item => {
            return {
              ...item,
              type: 'unit', // 单元
              id: item.unitId,
              key: getUuid(),
              scopedSlots: { title: 'title' },
              title: item.unit
            }
          })
          for (let i = 0; i < this.gData.length; i++) {
            let item = this.gData[i]
            if (item.buildId === buildId) {
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
    },
    // 根据楼栋ID查询楼层列表
    queryFloorListByBuildId (buildId) {
      return this.$api.undertake.queryFloorListByBuildId({buildId}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          let arr = result.map(item => {
            return {
              ...item,
              type: 'floor', // 楼层
              key: getUuid(),
              id: item.floorId,
              scopedSlots: { title: 'title' },
              title: item.floorName
            }
          })
          for (let i = 0; i < this.gData.length; i++) {
            let item = this.gData[i]
            if (item.buildId === buildId) {
              this.$set(item, 'children', arr)
              arr.forEach(elm => {
                elm.positionEntityName = item.positionEntityName + '-' + elm.title
              })
              this.dataList = this.dataList.concat(arr)
              return
            }
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 根据单元ID查询楼层列表
    queryFloorListByUnitId (unitId) {
      return this.$api.undertake.queryFloorListByUnitId({unitId}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          let arr = result.map(item => {
            return {
              ...item,
              type: 'floor', // 楼层
              key: getUuid(),
              id: item.floorId,
              scopedSlots: { title: 'title' },
              title: item.floorName
            }
          })
          for (let i = 0; i < this.gData.length; i++) {
            if (this.gData[i]['children']) {
              for (let j = 0; j < this.gData[i]['children'].length; j++) {
                let item = this.gData[i]['children'][j]
                if (item.unitId === unitId) {
                  arr.forEach(elm => {
                    elm.positionEntityName = item.positionEntityName + '-' + elm.title
                  })
                  this.$set(item, 'children', arr)
                  this.dataList = this.dataList.concat(arr)
                  return
                }
              }
            }
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 根据楼层ID查询房屋列表
    queryHouseBriefByFloorId (floorId) {
      return this.$api.undertake.queryHouseBriefByFloorId({floorId}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          let arr = result.map(item => {
            return {
              ...item,
              type: 'house', // 房屋
              key: getUuid(),
              id: item.houseId,
              scopedSlots: { title: 'title' },
              title: item.houseName
            }
          })
          let _item = fetchItem(this.gData, floorId, 'floorId')
          console.log('楼层=>', _item)
          if (_item) {
            arr.forEach(elm => {
              elm.positionEntityName = _item.positionEntityName + '-' + elm.title
            })
            this.$set(_item, 'children', arr)
            this.dataList = this.dataList.concat(arr)
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
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
