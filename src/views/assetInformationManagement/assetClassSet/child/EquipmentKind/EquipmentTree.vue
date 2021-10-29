<template>
  <div>
    <a-tree
      style="width: 200px;height: 500px;"
      :expanded-keys="expandedKeys"
      :auto-expand-parent="autoExpandParent"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      :placeholder="placeholder"
      :load-data="onLoadData"
      @expand="onExpand"
      option-filter-prop="label"
    />
  </div>
</template>

<script>
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
      treeData: [],
      expandedKeys: [],
      autoExpandParent: true
    };
  },
  watch: {
    topOrganId: {
      handler: function(newValue) {
        if (newValue) {
          this.init();
        }
      },
      immediate: true
    }
  },
  methods: {
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
          treeNode.dataRef.children = this.handlePositionDataToTreeData(data);
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
    handlePositionDataToTreeData(data) {
      debugger
      return data.map(ele => {
        return {
          ...ele,
          value: ele.equipmentId,
          title: ele.equipmentName,
          label: ele.equipmentName,
          children: []
        };
      });
    },
    async init() {
      const data = await this.getPositionData();
      this.treeData = this.handlePositionDataToTreeData(data);
    }
  },
  mounted() {
    // this.init();
  }
};
</script>

<style scoped></style>
