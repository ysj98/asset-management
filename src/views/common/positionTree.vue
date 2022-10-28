<!--
 * @Date: 2019-11-08 17:40:33
 * @Author: chen han
 * @Description: 建筑物位置->楼栋，单元，楼层，选择组件
 -->
<template>
  <div class="building-tree">
    <p style="margin-top: 5px;margin-left: 10px;">
      <a-icon type="info-circle" theme="twoTone"/>：<a-icon type="check-circle" />  为已登记的资产
    </p>
    <div class="tree-search" v-if="searchAble">
      <a-input placeholder="请输入建筑物进行查询" v-model="searchValueInput" @input="onChange">
        <a-icon slot="suffix" style="cursor: pointer;" type="search" @click="onChange"/>
      </a-input>
    </div>
    <div class="tree-main" :key="treeUuid + ''">
      <div class="table-no-data" v-if="gData.length===0">暂无数据</div>
      <a-tree
        :selectedKeys="selectedKeysDefault"
        :loadData="onLoadData"
        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        :treeData="gData"
        @expand="onExpand"
        @select="handleSelect"
      >
        <template slot="title" slot-scope="scope">
          <div class="tree-bg-box" :key="scope.key" :class="[scope.key===activeKey&&'active']" @click="hanldeOper(scope)">
            <!-- 标题及搜索 -->
            <span style="color: #1890ff" class="tree-node-title" v-if="scope.title.indexOf(searchValueInput) > -1 && searchValueInput">{{scope.title}}</span>
            <span class="tree-node-title" v-else>{{scope.title}}</span>
            <a-icon v-show="scope.isRegister == '1'" type="check-circle" style="position: relative;left: 20px;"/>
          </div>
        </template>
      </a-tree>
    </div>
  </div>
</template>
<script>
import {utils} from '@/utils/utils'
// 位置类型，1：建筑类，2：公共区域，3：停车场 4 土地
// 位置子类型	subPositionType	int		当位置类型为1时，0：表示楼栋，1：表示单元，2：表示楼层,3：表示小区,4：建筑位置,5：电梯
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
  id: '-1',
  upPositionId: '-1',
  positionId: '-1',
  subPositionType: '-2',
  title: '楼栋列表',
  scopedSlots: { title: 'title' }
}
export default {
  props: {
    isCurrent:{
      type: Number,
      default: 0,
    },
    pageNo:{
      type: Number,
      default: 1,
    },
    pageLength:{
      type: String,
      default: '10',
    },
    organId: {
      type: [String, Number],
      default: ''
    },
    // 是否可搜索
    searchAble: {
      type: Boolean,
      default: true
    },
    selectedKeysDefault: {
      type: Array,
      default() {
        return [];
      }
    },
    expandedKeysDefault: {
      type: Array,
      default() {
        return [];
      }
    }
  },
  watch: {
    organId (nv) {
      if (nv) {
        this.positionSelectAsyn()
      }
    },
    isCurrent(){
      this.positionSelectAsyn()
    },
    selectedKeys(newValue) {
      this.$emit("update:selectedKeysDefault", newValue);
    },
    expandedKeys(newValue) {
      this.$emit("update:expandedKeysDefault", newValue);
    },
  },
  mounted () {
    if (this.organId) {
      this.positionSelectAsyn()
    }
    if (this.selectedKeysDefault.length) {
      this.selectedKeys = this.selectedKeysDefault;
    }
    if (this.expandedKeysDefault.length) {
      this.expandedKeys = this.expandedKeysDefault;
    }
  },
  data () {
    return {
      selectedKeys: [topItem.key],
      activeKey: '', // 当前点击项
      expandedKeys: [topItem.key],
      autoExpandParent: false,
      gData: [{...topItem}],
      copyGdata: [{...topItem}],
      dataList: [{...topItem}], // 缓存每一项请求
      store: {},
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
    handleSelect(selectedKeys, e) {
      const {
        node: { dataRef }
      } = e;
      this.selectedKeys = selectedKeys;
      this.$emit("handleSelect", dataRef);
    },
    emptyTreeData () {
      this.gData = [{...topItem}]
      this.dataList = [{...topItem}]
      this.store = {[topItem.key]: topItem}
      this.copyGdata = utils.deepClone(this.gData)
      this.searchValueInput = ''
    },
    hanldeOper (scope) {
      if (this.activeKey === scope.key) {
        return
      }
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
      this.$emit('searchTag',value)
      this.positionSelectAsyn(value)
      // if (!value || !value.trim()) {
      //   this.resetLoad()
      //   this.treeUuid = getUuid()
      //   return
      // }
      // this.gData = this.upCreateTree()
      // Object.assign(this, {
      //   expandedKeys: [topItem.key],
      //   // searchValue: value,
      //   autoExpandParent: true
      // })
      // this.treeUuid = getUuid()
    },
    // 重新加载
    resetLoad () {
      this.positionSelectAsyn()
    },
    onExpand  (expandedKeys) {
      this.expandedKeys = expandedKeys
      this.autoExpandParent = false
    },
    // 异步加载数据
    onLoadData (treeNode) {
      if (['-2', '2'].includes(String(treeNode.dataRef.subPositionType))) {
        return Promise.resolve()
      }
      let data = {
        upPositionId: treeNode.dataRef.id,
        positionType: '1',
        organId:this.organId,
      }
      return this.queryPositionListByParId(data, treeNode.dataRef.key)
    },
    // 一级机构id 请求楼栋
    positionSelectAsyn (positionName='') {
      if(positionName==''){
        this.emptyTreeData()
      }

      let data = {
        organId:this.organId,
        isCurrent:this.isCurrent,
        upPositionId: '-1',
        positionType: '1',
        pageNo:this.pageNo,
        pageLength:this.pageLength,
        positionName:positionName
      }
      return this.$api.building.positionSelectAsyn(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          this.gData[0].children = result.map(item => {
            item.type = 'frist'
            item.key = item.positionId
            item.id = item.positionId
            item.buildingId = item.positionId
            item.title = item.positionName
            item.scopedSlots = { title: 'title'}
            item.parentKey = topItem.key
            this.store[item.key] = this.store[item.key] || item
            this.dataList.push({...item})
            return {...item}
          })
          this.$emit('init',{gData:this.gData})
          this.$emit('changePage',res.data.paginator.totalCount)
          this.copyGdata = utils.deepClone(this.gData)
          // this.expandedKeys = [topItem.key]
          this.treeUuid = getUuid()
          this.hanldeOper(this.gData[0])
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 根据位置id请求位置
    queryPositionListByParId (data = {}, key) {
      return this.$api.building.positionSelectAsyn(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          let _item = fetchItem(this.gData, key, 'key')
          for (let i = 0; i < result.length; i++) {
            let item = result[i]
            item.key = item.positionId
            item.type = 'second'
            item.id = item.positionId
            item.title = item.positionName
            item.buildingId = _item.buildingId
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
 padding: 5px 21px 10px 21px;
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
<style lang="less">
.building-tree{
  .ant-tree li .ant-tree-node-content-wrapper{cursor: default;}
}
</style>
