<!--土地异步选择树-->
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
        this.queryBlankListByOpts(nv, '1')
      }
    },
  },
  mounted () {
    if (this.communityId) {
      this.queryBlankListByOpts(this.communityId, '1')
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
      return Promise.resolve()
    },
    // 请求土地
    queryBlankListByOpts (communityId, status) {
      this.emptyTreeData()
      return this.$api.undertake.queryBlankListByOpts({communityId, status}).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          let arr = result.map(item => {
            return {
              ...item,
              type: 'land', // 车场
              id: item.blankId,
              key: getUuid(),
              scopedSlots: { title: 'title' },
              title: item.blankName,
              positionEntityName: item.blankName
            }
          })
          this.gData = arr
          this.dataList = this.dataList.concat(arr)
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
