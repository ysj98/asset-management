<template>
  <a-tree-select
    :multiple="multiple"
    v-model="valueCom"
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
  name: "EquipmentSelectTree",
  props: {
    placeholder: {
      type: String,
      default: "请选择位置"
    },
    // 组织机构 id
    topOrganId: {
      type: String,
      required: true
    },
    value: {
      type: [String, Array],
      default: ""
    },
    multiple: {
      type: Boolean,
      default: false
    }
  },
  model: {
    event: "change",
    prop: "value"
  },
  data() {
    return {
      treeData: []
    };
  },
  computed: {
    valueCom: {
      get() {
        return this.value;
      },
      set(value) {
        this.$emit("change", value);
      }
    }
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
    onLoadData(treeNode) {
      console.log("treeNode", treeNode);
      return new Promise(async (resolve, reject) => {
        const { value, equipmentOrganRelId } = treeNode;
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
        } = await this.$api.building.getEquipmentListByUpEquipmentId(
          requestData
        );
        if (code === 0) {
          resolve(data.resultList);
        } else {
          reject(message);
        }
      });
    },
    handlePositionDataToTreeData(data) {
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
  }
};
</script>

<style scoped></style>
