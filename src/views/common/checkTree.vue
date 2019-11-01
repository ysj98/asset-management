<!--
管理查验对象分类的树
props:
  searchAble Boolean 是否可搜索 默认true
-->
<template>
  <div class="custom-tree">
    <div class="tree-search" v-if="searchAble">
      <a-input placeholder="请输入查验分类名称" v-model="searchValueInput" >
        <a-icon slot="suffix" style="cursor: pointer;" type="search" @click="onChange"/>
      </a-input>
    </div>
          <!---->
    <div class="tree-main" :key="treeUuid + ''">
      <div class="table-no-data" v-if="gData.length===0">暂无分类</div>
      <a-tree
       @expand="onExpand"
       :expandedKeys="expandedKeys"
       :autoExpandParent="autoExpandParent"
      :treeData="gData"
      @select="hanldSelect"
      >
        <template slot="title" slot-scope="scope">
          <div @click="showScope(scope)" class="tree-bg-box" 
          :class="[(checkId === scope.key) && 'active', (type=== treeType.init) &&'tree-init', (type=== treeType.object)&& 'tree-object', (type=== treeType.task) && 'tree-task']">
            <!-- 单选 -->
            <a-radio  v-if="radioAble" :checked="checkId === scope.key" class="tree-radio" />
            <!-- 标题及搜索 -->
            <span class="tree-node-title" v-if="scope.title.indexOf(searchValue) > -1">
              {{scope.title.substr(0, scope.title.indexOf(searchValue))}}
              <span style="color: #1890ff">{{searchValue}}</span>
              {{scope.title.substr(scope.title.indexOf(searchValue) + searchValue.length)}}
              <!-- 任务查验需要 -->
              <a-badge :key="scope.num"  :numberStyle="{padding: 0, width: '15px', lineHeight: '15px', height: '15px', top: '-2px'}" v-if="scope.num" :count="scope.num" />
            </span>
            <span class="tree-node-title" v-else>{{scope.title}}<a-badge v-if="scope.num" :key="scope.num"  :count="scope.num" :numberStyle="{width: '15px', lineHeight: '15px', height: '15px', top: '-2px', padding: 0}"/></span>
            <!-- 初始化树操作 -->
            <template v-if="type === treeType.init">
              <span class="tree-ope-box" :style="{display:checkId === scope.key? 'inline-block':'' }">
                <a-icon type="close" class="init-icon" v-if="scope.professionalCategoryId !== gData[0].professionalCategoryId"  @click.stop="hanldeOper('delete', scope)"/>
              </span>
            </template>
            <!-- 管理对象树左侧的操作操作 -->
            <template v-else-if="type=== treeType.object">
              <span class="tree-ope-box" :style="{display:checkId === scope.key? 'inline-block':'' , right: '17px'}">
                <a-icon v-if="medicalPower.cjcy_zyflxz" type="plus" class="tree-icon" style="color:#0084FF;" @click="hanldeOper('create', scope)"/>
                <a-icon type="edit" v-if="(scope.professionalCategoryId !== gData[0].professionalCategoryId) && medicalPower.cjcy_zylfbj" class="tree-icon" @click="hanldeOper('edit', scope)"/>
                <a-icon type="delete" v-if="(scope.professionalCategoryId !== gData[0].professionalCategoryId) && medicalPower.cjcy_zyflsc" class="tree-icon" @click.stop="hanldeOper('delete', scope)"/>
              </span>
            </template>
            <!-- 任务管理树 -->
          </div>
        </template>
      </a-tree>
    </div>
  </div>
</template>
<script>
import {Tree, Input, Button, Radio, Icon, Badge} from 'ant-design-vue'
import {getCategoryNodeAll} from 'api/basics.js'
// 处理数据成平及结构
const hanldeDataList = (data) => {
  let arr = []
  let fun = (data) => {
    for (let i = 0; i < data.length; i++) {
      const node = data[i]
      const key = node.key
      arr.push({ key, title: node.title })
      if (node.children) {
        fun(node.children, node.key)
      }
    }
  }
  fun(data)
  return arr
}
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
// 处理返回数据
const handleGData = (data) => {
  let arr = []
  data.forEach(item => {
    let o = Object.assign({}, item)
    o.title = item.professionalCategoryName
    o.key = item.professionalCategoryId
    o.num = ''
    o.scopedSlots = { title: 'title' }
    arr.push(o)
    if (item.childs && item.childs.length > 0) {
      o.children = handleGData(item.childs)
    }
  })
  return arr
}
// 设置数字
var handleSetNumber = (data, id, num) => {
  for (let i = 0; i < data.length; i++) {
    let item = data[i]
    if (String(item.professionalCategoryId) === String(id)) {
      item.num = num
      return
    }
    if (item.children) {
      handleSetNumber(item.children, id, num)
    }
  }
}
// 树的类型
let treeType = {
  init: 'init',
  object: 'object',
  task: 'task'
}
let getUuid = (() => {
  let uuid = 1
  return () => {
    return ++uuid
  }
})()
export default {
  name: 'checkTree',
  components: {
    ATree: Tree,
    AInputSearch: Input.Search,
    AInput: Input,
    AButton: Button,
    ARadio: Radio,
    AIcon: Icon,
    ABadge: Badge
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
    },
    // 默认展开层级 全部 all 第二级 two
    expandLevel: {
      type: String,
      default: 'two'
    },
    hiddenFirst: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      treeUuid: getUuid(),
      expandedKeys: [],
      copyExpandedKeys: [],
      defaultExpandedKeys: [],
      searchValue: '',
      searchValueInput: '', // 搜索框的值
      autoExpandParent: true,
      gData: [],
      dataList: [],
      checkId: '', // 选中id
      treeType,
      // 一级公司
      organId: ''
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
  methods: {
    getCategoryNodeAll () {
      // if (!this.organId) {
      //   return this.$message.warning('请选择公司')
      // }
      let data = {
        groupId: this.organId
      }
      return getCategoryNodeAll(data).then(res => {
        if (res.data.code === '0') {
          let resulte = handleGData(res.data.data)
          if (!this.hiddenFirst) {
            this.gData = resulte
          }
          if (this.hiddenFirst && resulte[0].children) {
            this.gData = resulte[0].children
          }
          if (this.hiddenFirst && !resulte[0].children) {
            this.gData = []
          }
          this.dataList = hanldeDataList(this.gData)
          // 展开第二级
          if (this.expandLevel === 'two') {
            let keys = []
            resulte.forEach(item => {
              keys.push(item.key)
              if (item.children) {
                item.children.forEach(val => {
                  keys.push(val.key)
                })
              }
            })
            keys.concat(this.copyExpandedKeys)
            this.expandedKeys = [...new Set(keys)]
          }
          // 展开全部
          if (this.expandLevel === 'all') {
            this.expandedKeys = this.dataList.map(item => {
              return item.key
            })
          }
          this.treeUuid = getUuid()
          return
        }
      })
    },
    // 设置分项数字
    setNodeNumber (id, num) {
      if (num === 0) {
        return
      }
      num = Number(num)
      handleSetNumber(this.gData, id, num)
    },
    // 设置organId
    setOrganId (organId) {
      this.organId = organId
    },
    // 重置数据
    resetLoad () {
      return this.getCategoryNodeAll()
    },
    // 获取最上层节点
    getTopNode () {
      let {professionalCategoryId, professionalCategoryName, groupId} = this.gData[0]
      return {professionalCategoryId, professionalCategoryName, groupId}
    },
    hanldSelect (item, a, b) {
    },
    hanldeOper (type, scope) {
      if (type === 'delete') {
        let flag = !scope.children
        return this.$emit('operationFun', type, scope, flag)
      }
      let isTop = scope.professionalCategoryId === this.gData[0].professionalCategoryId
      this.$emit('operationFun', type, scope, isTop)
      this.$emit('operationFun', type, scope, isTop)
    },
    showScope (item) {
      this.checkId = item.key
      this.$emit('checkTree', item)
    },
    onExpand  (expandedKeys) {
      this.autoExpandParent = false
      this.expandedKeys = expandedKeys
      this.copyExpandedKeys = [...expandedKeys]
    },
    onChange (e) {
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
// 任务树样式
.tree-task{
  &.active{
    &::before{
      background:rgba(245,247,250,1);
    }
  }
  &:hover{
    &::before{
      background:rgba(245,247,250,1);;
    }
  }
}
// 对橡树样式
.tree-object{
  &.active{
    &::before{
      background:rgba(245,247,250,1);
    }
    .tree-node-title{
      width: calc(~"100% - 90px");
    }
  }
  &:hover{
    &::before{
      background:rgba(245,247,250,1);;
    }
    .tree-node-title{
      width: calc(~"100% - 90px");
    }
  }
}
// 初始化树样式
.tree-init{
  display: flex;
  align-items: center;
  &.active{
    &::before{
      background:#e6f7ff;
    }
    .tree-node-title{
      width: calc(~"100% - 20px");
    }
  }
  &:hover{
    &::before{
      background:#e6f7ff;
    }
    .tree-node-title{
      width: calc(~"100% - 20px");
    }
  }
}
.tree-ope-box{
 position: absolute;
 right: 4px;
 z-index: 3;
 display: none;
 .tree-icon{
   margin-left: 16px;
 }
 .init-icon{
   color: #FD7474;
 }
}
.tree-node-title{
  position: relative;
  z-index: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block;
}
.table-no-data{
  text-align: center;
  padding: 25px;
  color: #49505E;
}
.tree-radio{
  z-index: 2;
}
</style>
