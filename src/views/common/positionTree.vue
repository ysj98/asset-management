<!--位置树异步选择树-->
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
          <!-- <template>
            <span class="tree-ope-box">
              <a-icon type="plus" class="tree-icon btn_click" />
            </span>
          </template> -->
        </div>
      </template>
    </a-tree>
  </div>
</template>
<script>
// 位置类型，1：建筑类，2：公共区域，3：停车场 4 土地
// 位置子类型	subPositionType	int		当位置类型为1时，0：表示楼栋，1：表示单元，2：表示楼层,3：表示小区,4：建筑位置,5：电梯
// 当位置类型为2时，0：表示公共区域，1：公共区域位置
// 当位置类型为3时，0：表示车场，1：表示车场区域，2：停车位
// 当位置类型为4时，0：表示土地

let getUuid = ((uuid = 1) => () => ++uuid)()
// 递归找到对应的id
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
// 处理数据
function handleData (data = [], type = 'frist') {
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    item.key = getUuid()
    item.id = item.positionId
    item.title = item.positionName
    item.type = type
    item.scopedSlots = { title: 'title'}
    if (item.children && item.children.length) {
      handleData(item.children, 'second')
    }
  }
  return data
}
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
        this.queryTopPositionInfo(nv)
      }
    },
  },
  mounted () {
    if (this.communityId) {
      this.queryTopPositionInfo(this.communityId)
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
      console.log('树结构=>', scope)
      if (this.activeKey === scope.key) {
        return
      }
      //  && scope.positionType === 1
      if (scope.subPositionType === undefined && scope.type !== 'frist') {
        return
      }
      this.selectItem = {...scope}
      this.activeKey = scope.key
      this.$emit('change', {...scope})
    },
    hanldSelect () {
    },
    onExpand  (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 异步加载数据
    onLoadData (treeNode) {
      // if (!this.showTypeArr.includes(treeNode.dataRef.type)) {
      //   return Promise.resolve()
      // }
      // 单元查楼层
      if (treeNode.dataRef.type === 'second') {
        let data = {
          positionId: treeNode.dataRef.id,
          positionType: treeNode.dataRef.positionType,
          communityId: this.communityId
        }
        console.log('请求参数=>', data, treeNode.dataRef)
        return this.queryPositionListByParId(data, treeNode.dataRef.key)
      }
      return Promise.resolve()
    },
    // 项目id请求顶级位置
    queryTopPositionInfo (communityId) {
      this.emptyTreeData()
      return this.$api.undertake.queryTopPositionInfo({communityId}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || {}
          result = handleData([result])
          console.log(33333, result)
          this.gData = result
          this.expandedKeys = [...this.expandedKeys, result[0]['key']]
          // this.dataList = this.dataList.concat(arr)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 根据位置id请求位置
    queryPositionListByParId (data = {}, key) {
      return this.$api.undertake.queryPositionListByParId(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          for (let i = 0; i < result.length; i++) {
            let item = result[i]
            item.key = getUuid()
            item.id = item.positionId
            item.title = item.positionName
            item.type = 'second'
            item.scopedSlots = { title: 'title' }
          }
          let _item = fetchItem(this.gData, key, 'key')
          if (_item) {
            this.$set(_item, 'children', result)
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
    z-index: 4;
  &::before{
    content: '';
    display: inline-block;
    position: absolute;
    left: 0;
    right: 0;
    height: 30px;
    margin-top: -2px;
    background: transparent;
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
.tree-node-title{
  z-index: 2;
  position: relative;
}
</style>
<style lang="less">
.building-tree{
  .ant-tree li .ant-tree-node-content-wrapper{cursor: default;}
}
</style>
