<template>
  <div class="container">
    <a-input-search
      style="width: 100%;height: 50px;margin-bottom: 20px;"
      placeholder="搜索设备设施分类"
      @change="onChange"
    />
    <a-tree
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      :placeholder="placeholder"
      :load-data="onLoadData"
      @expand="onExpand"
      option-filter-prop="label"
      @select="handleSelect"
    >
      <template slot="title" slot-scope="{ title }">
        <span v-if="title.indexOf(searchValue) > -1">
          {{ title.substr(0, title.indexOf(searchValue)) }}
          <span style="color: #0084ff">{{ searchValue }}</span>
          {{ title.substr(title.indexOf(searchValue) + searchValue.length) }}
        </span>
        <span v-else>{{ title }}</span>
      </template>
    </a-tree>
    <a-spin class="spin" :spinning="loading" size="small" />
  </div>
</template>

<script>
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some(item => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
const dataList = [];
const generateList = data => {
  for (let i = 0; i < data.length; i++) {
    const node = data[i];
    const key = node.value;
    dataList.push({ key, title: key });
    if (node.children) {
      generateList(node.children);
    }
  }
};
export default {
  /*
   * 侧边 设备设施分类 树状选择组件
   * */
  name: "EquipmentTree",
  props: {
    placeholder: {
      type: String,
      default: "请选择位置"
    },
    // 一级机构 id
    topOrganId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      loading: false,
      treeData: [],
      searchValue: "",
      expandedKeys: [],
      autoExpandParent: true
    };
  },
  watch: {
    topOrganId: {
      handler: function(newValue) {
        if (newValue) {
          this.loading = true;
          this.init();
        }
      },
      immediate: true
    }
  },
  methods: {
    handleSelect(selectedKeys, e) {
      const {
        node: { dataRef }
      } = e;
      this.$emit("handleSelect", dataRef);
    },
    onChange(e) {
      const value = e.target.value;
      const expandedKeys = dataList
        .map(item => {
          if (String(item.title).indexOf(value.trim()) > -1) {
            return getParentKey(item.key, this.treeData);
          }
          return null;
        })
        .filter((item, i, self) => item && String(self).indexOf(item) === i);
      console.log("expandedKeys", expandedKeys);

      this.searchValue = value
      this.expandedKeys = expandedKeys
      this.autoExpandParent = true
    },
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    onLoadData(treeNode) {
      return new Promise(async (resolve, reject) => {
        const { value } = treeNode;
        try {
          const data = await this.getPositionData({
            organId: this.topOrganId,
            upEquipmentId: value
          });
          treeNode.dataRef.children = this.handleDataToTreeData(data);
          resolve();
        } catch (error) {
          reject(error);
          treeNode.dataRef.children = [];
        }
      });
    },
    async getPositionData(options = {}) {
      return new Promise(async (resolve, reject) => {
        const requestData = {
          organId: this.topOrganId,
          upEquipmentId: "-1"
        };
        Object.assign(requestData, options);
        const {
          data: { code, message, data }
        } = await this.$api.assets.getEquipmentListByUpEquipmentId(requestData);
        if (code === 0) {
          console.log("data", data.resultList);
          resolve(data.resultList);
        } else {
          reject(message);
        }
      });
    },
    handleDataToTreeData(data) {
      const resData = data.map(ele => {
        return {
          ...ele,
          key: ele.equipmentId,
          value: ele.equipmentId,
          title: ele.equipmentName,
          label: ele.equipmentName,
          scopedSlots: {
            title: "title"
          },
          children: []
        };
      });
      generateList(resData);
      return resData;
    },
    async init() {
      const data = await this.getPositionData();
      this.treeData = this.handleDataToTreeData(data);
      this.loading = false;
    }
  },
  mounted() {
    // this.init();
  }
};
</script>

<style scoped lang="less">
.container {
  width: 100%;
  height: calc(100% - 1px);
  overflow: auto;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 20px 20px;
  border-right: 1px solid #e8e8e8;
  border-bottom: 1px solid #e8e8e8;
  .spin {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>
