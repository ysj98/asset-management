<template>
  <div class="container">
    <div v-if="searchAble">
      <a-input
        placeholder="请输入分类名称"
        v-model="searchValueInput"
        @input="onChange"
      >
        <a-icon
          slot="suffix"
          style="cursor: pointer"
          type="search"
          @click="onChange"
        />
      </a-input>
    </div>
    <div class="tree-main" :key="treeUuid + ''">
      <div class="table-no-data" v-if="gData.length === 0">暂无数据</div>
      <a-tree
        :selectedKeys="selectedKeys"
        :loadData="onLoadData"
        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        :treeData="gData"
        @expand="onExpand"
        @select="handleSelect"
      >
        <template slot="title" slot-scope="scope">
          <div
            class="tree-bg-box"
            :key="scope.key"
            :class="[scope.key === activeKey && 'active']"
            @click="handleOper(scope)"
          >
            <!-- 标题及搜索 -->
            <span
              style="color: #1890ff"
              class="tree-node-title"
              v-if="
                scope.title.indexOf(searchValueInput) > -1 && searchValueInput
              "
              >{{ scope.title }}</span
            >
            <span class="tree-node-title" v-else>{{ scope.title }}</span>
          </div>
        </template>
      </a-tree>
    </div>
  </div>
</template>
<script>
import { utils } from "@/utils/utils";
let getUuid = (
  (uuid = 1) =>
  () =>
    ++uuid
)();
// 递归找到对应的id 挂在子节点
function fetchItem(data = [], id, type) {
  for (let i = 0; i < data.length; i++) {
    let item = data[i];
    if (String(item[type]) === String(id)) {
      return item;
    }
    let _item = fetchItem(item.children, id, type);
    if (_item) {
      return _item;
    }
  }
  return false;
}
// 写死顶层项
const topItem = {
  label: "设备设施管理",
  value: -1,
  key: -1,
  id: -1,
  upEquipmentId: -1,
  equipmentId: -1,
  title: "设备设施分类",
  scopedSlots: { title: "title" },
};
export default {
  props: {
    organId: {
      type: [String, Number],
      default: "",
    },
    // 是否可搜索
    searchAble: {
      type: Boolean,
      default: true,
    },
    selectedKeysDefault:{
      type:Array,
      default(){
        return []
      }
    },
    expandedKeysDefault:{
      type:Array,
      default(){
        return []
      }
    },
  },
  watch: {
    organId(nv) {
      if (nv) {
        this.getEquipmentList();
      }
    },
    selectedKeys(newValue){
      this.$emit('update:selectedKeysDefault',newValue)
    },
    expandedKeys(newValue){
      this.$emit('update:expandedKeysDefault',newValue)
    },
  },
  mounted() {
    if (this.organId) {
      this.getEquipmentList();
    }
    if (this.selectedKeysDefault.length){
      this.selectedKeys = this.selectedKeysDefault
    }
    if (this.expandedKeysDefault.length){
      this.expandedKeys = this.expandedKeysDefault
    }
  },
  data() {
    return {
      selectedKeys: [-1],
      activeKey: "",
      expandedKeys: [topItem.key],
      autoExpandParent: false,
      gData: [{ ...topItem }],
      copyGdata: [{ ...topItem }],
      dataList: [{ ...topItem }], // 缓存每一项请求
      store: {},
      selectItem: {}, // 当前添加项
      treeUuid: getUuid(),
      searchValueInput: "", // 搜索框的值
    };
  },
  computed: {
    // 向上包含的节点树
    containTreeNodes() {
      if (this.searchValueInput) {
        const collect = [];
        // 向上找树节点
        const filterList = Object.values(this.store)
          .filter((v) => v.title.includes(this.searchValueInput))
          .map((v) => v.key);
        this.upwardCollectOrgan(filterList, collect);
        // 向下找树节点

        return collect;
      } else {
        return Object.keys(this.store);
      }
    },
  },
  methods: {
    handleSelect(selectedKeys, e) {
      const {
        node: { dataRef },
      } = e;
      this.selectedKeys = selectedKeys;
      this.$emit("handleSelect", dataRef);
    },
    emptyTreeData() {
      this.gData = [{ ...topItem }];
      this.dataList = [{ ...topItem }];
      this.selectItem = {};
      this.store = { [topItem.key]: topItem };
      this.copyGdata = utils.deepClone(this.gData);
      this.searchValueInput = "";
    },
    handleOper(scope) {
      if (this.activeKey === scope.key) {
        return;
      }
      this.selectItem = { ...scope };
      this.activeKey = scope.key;
      this.$emit("change", { ...scope });
    },
    // 根据id返回对象
    mapStoreOrganIdItem(organId) {
      return this.store[organId];
    },
    // 向上收集节点树
    upwardCollectOrgan(list, store) {
      if (list.length) {
        const upwardList = list
          .map((v) => {
            if (!store.includes(v)) {
              store.push(v);
            }
            return this.mapStoreOrganIdItem(v).parentKey;
          })
          .filter((v) => v)
          .map((v) => this.mapStoreOrganIdItem(v).key);
        this.upwardCollectOrgan(upwardList, store);
      }
    },
    // 向上重组树
    upCreateTree() {
      // 重组树列表
      let treeList = this.dataList
        .filter((item) => {
          return this.containTreeNodes.includes(item.key);
        })
        .map((item) => {
          return { ...item };
        });
      // 重组树树结构
      return utils.buildTree(treeList, "key", "parentKey");
    },
    onChange(e) {
      this.searchValueInput = e.target.value;
      let value = this.searchValueInput;
      if (!value || !value.trim()) {
        this.resetLoad();
        this.treeUuid = getUuid();
        return;
      }
      this.gData = this.upCreateTree();
      Object.assign(this, {
        expandedKeys: [topItem.key],
        autoExpandParent: true,
      });
      this.treeUuid = getUuid();
    },
    // 重新加载
    resetLoad() {
      this.getEquipmentList();
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    // 异步加载数据
    onLoadData(treeNode) {
      if (this.organId) {
        let data = {
          upEquipmentId: treeNode.dataRef.id,
          organId: this.organId,
        };
        return this.queryEquipmentListByUpEquipmentId(
          data,
          treeNode.dataRef.key
        );
      } else {
        return Promise.resolve();
      }
    },
    getEquipmentList() {
      this.emptyTreeData();
      let data = {
        organId: this.organId,
        isCurrent: this.isCurrent,
        upEquipmentId: -1,
      };
      return this.$api.building
        .getEquipmentListByUpEquipmentId(data)
        .then((res) => {
          if (res.data.code === 0) {
            let result = res.data.data ? res.data.data.resultList : [];
            this.gData[0].children = result.map((item) => {
              item.key = item.equipmentId;
              item.id = item.equipmentId;
              item.title = item.equipmentName;
              item.scopedSlots = { title: "title" };
              item.parentKey = topItem.key;
              this.store[item.key] = this.store[item.key] || item;
              this.dataList.push({ ...item });
              return { ...item };
            });
            this.copyGdata = utils.deepClone(this.gData);
            this.treeUuid = getUuid();
            this.handleOper(this.gData[0]);
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    queryEquipmentListByUpEquipmentId(data = {}, key) {
      return this.$api.building.getEquipmentListByUpEquipmentId(data).then(
        (res) => {
          if (res.data.code === 0) {
            let result = res.data.data ? res.data.data.resultList : [];
            let _item = fetchItem(this.gData, key, "key");
            for (let i = 0; i < result.length; i++) {
              let item = result[i];
              item.key = item.equipmentId;
              item.id = item.equipmentId;
              item.title = item.equipmentName;
              item.scopedSlots = { title: "title" };
              item.parentKey = key;
              this.store[item.key] = this.store[item.key] || item;
              this.dataList.push({ ...item });
            }
            let _copyItem = fetchItem(this.copyGdata, key, "key");
            this.expandedKeys.push(key);
            this.expandedKeys = [...new Set(this.expandedKeys)];
            if (_item) {
              this.$set(_item, "children", result);
              this.$set(_copyItem, "children", result);
            }
          } else {
            this.$message.error(res.data.message);
          }
        },
        () => {}
      );
    },
  },
};
</script>
<style lang="less" scoped>
.container {
  width: 100%;
  height: calc(100vh - 162px);
  overflow: auto;
  position: relative;
  padding: 20px 20px;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
}
</style>
