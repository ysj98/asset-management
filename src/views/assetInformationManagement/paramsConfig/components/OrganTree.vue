<!--
 * @Date: 2019-11-08 17:40:33
 * @Author: chen han
 * @Description: 建筑物位置->楼栋，单元，楼层，选择组件
 -->
<template>
  <div class="custom-tree building-tree">
    <div class="tree-search" v-if="searchAble">
      <a-input placeholder="请输入建筑物进行查询" v-model="searchValueInput" @input="onChange">
        <a-icon slot="suffix" style="cursor: pointer;" type="search" @click="onChange"/>
      </a-input>
    </div>
    <div class="tree-main" :key="treeUuid + ''">
      <div class="table-no-data" v-if="gData.length===0">暂无数据</div>
      <a-tree
          @expand="onExpand"
          :loadData="onLoadData"
          :expandedKeys="expandedKeys"
          :autoExpandParent="autoExpandParent"
          :treeData="gData"
          @select="hanldSelect"
      >
        <template slot="title" slot-scope="scope">
          <div class="tree-bg-box" :key="scope.key" :class="[scope.key===activeKey&&'active']" @click="hanldeOper(scope)">
            <!-- 标题及搜索 -->
            <span style="color: #1890ff" class="tree-node-title" v-if="scope.title.indexOf(searchValueInput) > -1 && searchValueInput">{{scope.title}}</span>
            <span class="tree-node-title" v-else>{{scope.title}}</span>
          </div>
        </template>
      </a-tree>
    </div>
  </div>
</template>
<script>
import {utils} from '@/utils/utils'
// 位置类型，1：建筑类，2：公共区域，3：停车场 4 土地
// 当位置类型为2时，0：表示公共区域，1：公共区域位置
// 当位置类型为3时，0：表示车场，1：表示车场区域，2：停车位
// 当位置类型为4时，0：表示土地

let getUuid = ((uuid = 1) => () => ++uuid)()
// 递归找到对应的id 挂在子节点
function fetchItem(data = [], id, type){
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    if (String(item[type]) === String(id)) {
      return item
    }
    let _item = fetchItem(item.children, id, type)
    if (_item) {
      return _item
    }
  }
  return false
}
// 写死顶层项
const topItem = {
  key: getUuid(),
  type: 'top',
  id: ' ',
  organId: '-1',
  title: '楼栋列表',
  scopedSlots: { title: 'title' }
}
export default {
  props: {
    // 是否可搜索
    searchAble: {
      type: Boolean,
      default: true
    },
  },
  watch: {
  },
  mounted () {
    this.positionSelectAsyn()
  },
  data () {
    return {
      autoExpandParent: false,
      activeKey: '', // 当前点击项
      expandedKeys: [],
      copyExpandedKeys: [],
      gData: [],
      copyGdata: [],
      dataList: [], // 缓存每一项请求
      store: {},
      selectItem: {}, // 当前添加项
      treeUuid: getUuid(),
      searchValueInput: '', // 搜索框的值
    }
  },
  computed: {
    // 向上包含的节点树
    containTreeNodes () {
      if (this.searchValueInput) {
        const collect = []
        // 向上找树节点
        const filterList = Object.values(this.store).filter(v => v.title.includes(this.searchValueInput)).map(v => v.key)
        this.upwardCollectOrgan(filterList, collect)
        // 向下找树节点

        return collect
      } else {
        return Object.keys(this.store)
      }
    },
  },
  methods: {
    hanldeOper (scope) {
      if (this.activeKey === scope.key) {
        return
      }
      this.selectItem = {...scope}
      this.activeKey = scope.key
      this.$emit('change', {...scope})
    },
    // 根据id返回对象
    mapStoreOrganIdItem (organId) {
      return this.store[organId]
    },
    // 向上收集节点树
    upwardCollectOrgan (list, store) {
      if (list.length) {
        const upwardList = list.map(v => {
          if (!store.includes(v)) {
            store.push(v)
          }
          return this.mapStoreOrganIdItem(v).parentKey
        }).filter(v => v).map(v => this.mapStoreOrganIdItem(v).key)
        this.upwardCollectOrgan(upwardList, store)
      }
    },
    // 向上重组树
    upCreateTree () {
      // 重组树列表
      let treeList = this.dataList.filter((item) => {
        return this.containTreeNodes.includes(item.key)
      }).map(item => {
        let o = {...item}
        return o
      })
      // 重组树树结构
      let treeData = utils.buildTree(treeList, 'key', 'parentKey')
      return treeData
    },
    onChange (e) {
      this.searchValueInput = e.target.value
      let value = this.searchValueInput
      if (!value || !value.trim()) {
        this.resetLoad()
        this.treeUuid = getUuid()
        return
      }
      let treeData = this.upCreateTree()
      // 匹配到树结构的key
      this.gData = treeData
      this.copyGdata = utils.deepClone(this.gData)
      this.expandedKeys = [...new Set([...this.expandedKeys,this.activeKey])]
      this.autoExpandParent = true
      this.treeUuid = getUuid()
    },
    // 重新加载
    resetLoad () {
      this.positionSelectAsyn()
    },
    hanldSelect () {
    },
    onExpand  (expandedKeys) {
      console.log('expandedKeys',expandedKeys)
      this.expandedKeys = expandedKeys
      if (!this.searchValueInput) {
        this.copyExpandedKeys = [...expandedKeys]
      }
      this.autoExpandParent = false
    },
    // 异步加载数据
    onLoadData (treeNode) {
      console.log(treeNode)
      let data = {
        parentOrganId: treeNode.dataRef.id,
      }
      return this.queryPositionListByParId(data, treeNode.dataRef.key)
    },
    // 一级机构id 请求楼栋
    positionSelectAsyn () {
      // this.emptyTreeData()
      let data = {
        parentOrganId: '',
      }
      return this.$api.assets.queryAsynOrganByUserId(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          this.gData = result.map(item => {
            item.type = 'frist'
            item.key = item.organId
            item.id = item.organId
            item.title = item.name
            item.scopedSlots = { title: 'title'}
            item.parentKey = item.parentOrganId
            this.store[item.key] = this.store[item.key] || item
            this.dataList.push({...item})
            return {...item}
          })
          this.copyGdata = utils.deepClone(this.gData)
          this.expandedKeys = []
          this.treeUuid = getUuid()
          this.hanldeOper(this.gData[0])
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 根据位置id请求位置
    queryPositionListByParId (data = {}, key) {
      return this.$api.assets.queryAsynOrganByUserId(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          let _item = fetchItem(this.gData, key, 'key')
          for (let i = 0; i < result.length; i++) {
            let item = result[i]
            item.key = item.organId
            item.type = 'second'
            item.id = item.organId
            item.title = item.name
            item.scopedSlots = { title: 'title' }
            item.parentKey = key
            this.store[item.key] = this.store[item.key] || item
            this.dataList.push({...item})
          }
          let _copyItem = fetchItem(this.copyGdata, key, 'key')
          this.expandedKeys.push(key)
          this.expandedKeys = [...new Set(this.expandedKeys)]
          if (_item) {
            this.$set(_item, 'children', result)
            this.$set(_copyItem, 'children', result)
          }
        } else {
          this.$message.error(res.data.message)
        }
      }, () => {
      })
    },

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
.tree-search{
  padding: 16px 21px 10px 21px;
}
.tree-main{
  padding-left: 13px;
}
.table-no-data{
  text-align: center;
}
</style>
<style lang="less">
.building-tree{
  .ant-tree li .ant-tree-node-content-wrapper{cursor: default;}
}
</style>
