<!--
管理查验对象， 查验分项， 查验标准的树
props:
  searchAble Boolean 是否可搜索 默认true
-->
<template>
  <div class="custom-tree custom-popover">
    <div class="tree-search" v-if="searchAble">
      <a-input placeholder="请输入名称" v-model="searchValueInput" >
        <a-icon slot="suffix" style="cursor: pointer;" type="search" @click="onChange"/>
      </a-input>
    </div>
    <div class="table-no-data" v-if="gData.length === 0">暂无对象</div>
    <div class="tree-main custom-badge" :key="treeUuid">
      <a-tree
      :loadData="onLoadData"
      :expandedKeys="expandedKeys"
      @expand="onExpand"
      :autoExpandParent="autoExpandParent"
      :treeData="gData"
      @select="hanldSelect"
      >
        <template slot="title" slot-scope="scope">
          <div @click="showScope(scope)" class="tree-bg-box" 
          :class="[(checkId === scope.key && type=== treeType.init)?'tree-init':checkId === scope.key && 'tree-object', type=== treeType.init?'tree-init-hover': 'tree-hover']">
            <!-- 单选 -->
            <a-radio :checked="checkId === scope.key" v-if="radioAble" style="z-index: 2;"></a-radio>
            <!-- 标题及搜索 -->
            <a-badge class="t-badge" v-if="scope.stype === 'obj'" status="error"/>
            <a-badge class="t-badge" v-else-if="scope.stype === 'subitem'" status="processing"/>
            <a-badge class="t-badge" v-else status="warning"/>
            <span class="tree-node-title" v-if="scope.title.indexOf(searchValue) > -1" @click="showScope(scope)">
              {{scope.title.substr(0, scope.title.indexOf(searchValue))}}
              <span style="color: #1890ff">{{searchValue}}</span>
              {{scope.title.substr(scope.title.indexOf(searchValue) + searchValue.length)}}
            </span>
            <span class="tree-node-title" v-else>
              {{scope.title}}</span>
            <!-- 管理对象树炒作 -->
            <template>
              <span class="tree-ope-box" :style="{display:checkId === scope.key? 'inline-block':'' }">
                <a-icon type="plus" v-if="(scope.stype==='obj' && medicalPower.cjcy_cyfxxz) || (scope.stype==='subitem'&&medicalPower.cjcy_cybzxz)" class="tree-icon" style="color:#0084FF;" @click="hanldeOper('create', scope)"/>
                <span v-if="scope.stype==='obj' && medicalPower.cjcy_cydxxrfl" @click="hanldeOper('edit', scope)"><segiIcon type="#icon-apartment" class="tree-icon"/></span>
                <a-icon type="edit" v-if="(scope.stype==='subitem' && medicalPower.cjcy_cyfxbj) || (scope.stype==='standard'&&medicalPower.cjcy_cybzbj)" @click="hanldeOper('edit', scope)" class="tree-icon"/>
                <a-icon v-if="(scope.stype==='subitem' && medicalPower.cjcy_cyfxsc) || (scope.stype==='standard'&&medicalPower.cjcy_cybzsc) || (scope.stype==='obj' && medicalPower.cjcy_yccydx)" type="delete" class="tree-icon" @click.stop="hanldeOper('delete', scope)"/>
              </span>
            </template>
          </div>
        </template>
      </a-tree>
    </div>
  </div>
</template>
<script>
import {Tree, Input, Radio, Icon, Badge} from 'ant-design-vue'
import {geChildtNodeForSubitem, geChildtNodeForObject, geChildtNodeForStandard} from '@/api/basics.js'
import segiIcon from '@/views/common/segiIcon.vue'
let getUuid = (() => {
  let uuid = 1
  return () => {
    return ++uuid
  }
})()
// 搜索获取
const getParentKey = (key, tree) => {
  let parentKey
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i]
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children)
      }
    }
  }
  return parentKey
}
const levelMap = {
  obj: 'obj',
  subitem: 'subitem',
  standard: 'standard'
}
// 处理返回对象数据
const handleObjectData = (data) => {
  let arr = []
  data.forEach(item => {
    let o = Object.assign({}, item)
    o.title = item.inspectionObjectName
    o.key = getUuid()
    o.stype = levelMap.obj
    o.scopedSlots = { title: 'title' }
    arr.push(o)
  })
  return arr
}
// 处理查验分项返回
const handleItemData = (data) => {
  let arr = []
  data.forEach(item => {
    let o = Object.assign({}, item)
    o.title = item.inspectionItemsName
    o.key = getUuid()
    o.stype = levelMap.subitem
    o.scopedSlots = { title: 'title' }
    arr.push(o)
  })
  return arr
}
// 处理标准
const handleStandardData = (data) => {
  let arr = []
  data.forEach(item => {
    let o = Object.assign({}, item)
    o.title = item.inspectionStandardTitle
    o.stype = levelMap.standard
    o.key = getUuid()
    o.scopedSlots = { title: 'title' }
    arr.push(o)
  })
  return arr
}
// 树的类型
let treeType = {
  init: 'init',
  object: 'object'
}
export default {
  name: 'checkTree',
  components: {
    ATree: Tree,
    AInput: Input,
    ARadio: Radio,
    AIcon: Icon,
    ABadge: Badge,
    segiIcon: segiIcon
  },
  props: {
    // 是否可搜索
    searchAble: {
      type: Boolean,
      default: true
    },
    // 绑定值
    value: {
      type: [Number, String],
      default: ''
    },
    // 显示单选
    radioAble: {
      type: Boolean,
      default: true
    },
    // 是否显示背景色
    backgroundAble: {
      type: Boolean,
      default: true
    },
    // 是那种类型的树
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      treeUuid: getUuid(),
      expandedKeys: [],
      searchValue: '',
      searchValueInput: '',
      autoExpandParent: true,
      gData: [],
      dataList: [],
      checkId: '', // 选中id
      treeType,
      loadedKeys: []
    }
  },
  watch: {
    checkId (newVal) {
      this.$emit('input', newVal)
    },
    value (newVal) {
      this.checkId = newVal
    }
  },
  created () {
    this.getPower()
  },
  mounted () {
  },
  methods: {
    emptyTreeData () {
      this.gData = []
      this.expandedKeys = []
      this.dataList = []
      this.checkId = ''
    },
    // 异步加载数据
    onLoadData (treeNode) {
      if (treeNode.dataRef.stype === 'obj') {
        return this.geChildtNodeForSubitem(treeNode.dataRef.inspectionObjectId)
      }
      if (treeNode.dataRef.stype === 'subitem') {
        return this.geChildtNodeForStandard(treeNode.dataRef.inspectionItemsId)
      }
      return Promise.resolve()
    },
    // 给外层调用根据专业分类id请求对象
    geChildtNodeForObject (groupId, professionalCategoryId) {
      let data = {
        groupId,
        id: professionalCategoryId
      }
      return geChildtNodeForObject(data).then(res => {
        if (res.data.code === '0') {
          this.treeUuid = getUuid()
          this.gData = handleObjectData(res.data.data)
          this.dataList = [].concat(this.gData)
          // if (!res.data.data.length) {
          //   this.$message.info('暂无对象')
          // }
          return
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 给外层调用查询分项
    geChildtNodeForSubitem (inspectionObjectId) {
      let data = {
        id: inspectionObjectId
      }
      return geChildtNodeForSubitem(data).then(res => {
        if (res.data.code === '0') {
          let subitem = handleItemData(res.data.data)
          for (let i = 0; i < this.gData.length; i++) {
            let item = this.gData[i]
            if (item.inspectionObjectId === inspectionObjectId) {
              this.$set(item, 'children', subitem)
              this.dataList = this.dataList.concat(subitem)
              return
            }
          }
          return
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 给外层调用查验标准
    geChildtNodeForStandard (inspectionItemsId) {
      let data = {
        id: inspectionItemsId
      }
      return geChildtNodeForStandard(data).then(res => {
        if (res.data.code === '0') {
          let standard = handleStandardData(res.data.data)
          for (let i = 0; i < this.gData.length; i++) {
            if (this.gData[i]['children']) {
              for (let j = 0; j < this.gData[i]['children'].length; j++) {
                let item = this.gData[i]['children'][j]
                if (item.inspectionItemsId === inspectionItemsId) {
                  this.$set(item, 'children', standard)
                  this.dataList = this.dataList.concat(standard)
                  return
                }
              }
            }
          }
          return
        } else {
          this.$message.error(res.data.message)
          return
        }
      })
    },
    // 移除对象
    removeObj (inspectionObjectId) {
      for (let i = 0; i < this.gData.length; i++) {
        if (this.gData[i].inspectionObjectId === inspectionObjectId) {
          this.gData.splice(i, 1)
          return
        }
      }
    },
    // 移除分项
    removeItem (inspectionObjectId, inspectionItemsId) {
      for (let i = 0; i < this.gData.length; i++) {
        if (this.gData[i].inspectionObjectId === inspectionObjectId) {
          for (let j = 0; j < this.gData[i]['children'].length; j++) {
            let item = this.gData[i]['children'][j]
            if (item.inspectionItemsId === inspectionItemsId) {
              this.gData[i]['children'].splice(j, 1)
              return
            }
          }
        }
      }
    },
    hanldSelect () {
    },
    hanldeOper (type, scope) {
      this.$emit('operationFun', type, scope)
    },
    showScope (item) {
      this.checkId = item.key
      this.$emit('checkTree', item)
    },
    onExpand  (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    onChange () {
      let value = this.searchValueInput
      const expandedKeys = this.dataList.map((item) => {
        if (item.title.indexOf(value) > -1 && value.trim()) {
          return getParentKey(item.key, this.gData)
        }
        return null
      }).filter((item, i, self) => item && self.indexOf(item) === i)
      Object.assign(this, {
        expandedKeys,
        searchValue: value,
        autoExpandParent: true
      })
    }
  }
}
</script>
<style lang="less" scoped>
.custom-tree{
  .tree-search{
    padding: 18px 17px;
  }
  .tree-main{
    padding-left: 10px;
    padding-right: 17px;
  }
}
.tree-bg-box{
  &::after{
    content: '';
    display: inline-block;
    position: absolute;
    left: 0;
    right: 0;
    height: 24px;
    background:transparent;
  }
  &::before{
    content: '';
    display: inline-block;
    position: absolute;
    left: 0;
    right: 0;
    height: 24px;
  }
  &:hover{
    .tree-ope-box{
      display: inline-block;
    }
  }
}
.tree-object{
  &::before{
    background:rgba(245,247,250,1);
  }
}
.tree-init{
  &::before{
    background:#e6f7ff;
  }
}
.tree-init-hover{
  &:hover::after{
    background:#e6f7ff;
  }
}
.tree-hover{
  &:hover::after{
    background:rgba(245,247,250,1);
  }
}
.tree-ope-box{
 position: absolute;
 right: 17px;
 z-index: 3;
 display: none;
 .tree-icon{
   margin-left: 16px;
 }
 .init-icon{
   display: none;
   color: #FD7474;
   &.active{
     display: inline-block;
   }
 }
}
.tree-node-title{
  position: relative;
  z-index: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.t-badge{
  z-index: 10;
}
.table-no-data{
  text-align: center;
  padding: 25px;
  color: #49505E;
}
</style>
