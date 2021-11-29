<template>
  <a-tree-select
    multiple
    v-model="value"
    style="width: 200px;"
    :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
    :tree-data="treeData"
    :placeholder="placeholder"
    :load-data="onLoadData"
    option-filter-prop="label"
  />
</template>

<script>
export default {
  name: "BuildSelectedTree",
  props: {
    placeholder: {
      type: String,
      default: "请选择位置"
    },
    // 组织机构 id
    organId: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      value: [],
      treeData: []
    };
  },
  methods: {
    onLoadData(treeNode) {
      return new Promise(async (resolve, reject) => {
        const { value } = treeNode;
        try {
          const data = await this.getPositionData({
            upPositionId: value
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
          organId: this.organId,
          positionType: "1",
          upPositionId: "-1"
        };
        Object.assign(requestData, options);
        const {
          data: { code, message, data }
        } = await this.$api.building.positionSelectAsyn(requestData);
        if (code === "0") {
          console.log("data", data);
          resolve(data);
        } else {
          reject(message);
        }
      });
    },
    handlePositionDataToTreeData(data) {
      return data.map(ele => {
        return {
          value: ele.positionId,
          title: ele.positionName,
          label: ele.positionName,
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
    this.init();
  }
};
</script>

<style scoped></style>
