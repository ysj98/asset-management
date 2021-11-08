<template>
  <div class="select-container" :style="{width: width}">
    <a-tree-select
      class="tree-select"
      :class="{'have-default-name': showDefaultOrganName}"
      :multiple="multiple"
      v-model="valueCom"
      :allowClear="allowClear"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeData"
      :placeholder="placeholder"
      :load-data="onLoadData"
      option-filter-prop="label"
      @change="handleChange"
    />
    <div class="default-name" v-show="showDefaultOrganName">{{defaultName}}</div>
  </div>
</template>

<script>
export default {
  name: "EquipmentSelectTree",
  props: {
    placeholder: {
      type: String,
      default: "请选择分类"
    },
    // 组织机构 id
    topOrganId: {
      type: [String, Number],
      required: true
    },
    // 默认不支持清空
    allowClear: {
      default: false
    },
    value: {
      type: [String, Array, Number],
      default: undefined
    },
    width:{
      type: String,
      default: '200px'
    },
    multiple: {
      type: Boolean,
      default: false
    },
    defaultName : {
      type: String,
      default: ''
    }
  },
  model: {
    event: "change",
    prop: "value"
  },
  data() {
    return {
      treeData: [],
      showDefaultOrganName: true // 显示默认值
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
    },
    defaultName: function () {
      this.showDefaultOrganName = true
    }
  },
  methods: {
    handleChange () {
      this.showDefaultOrganName = false
    },
    onLoadData(treeNode) {
      console.log("treeNode", treeNode);
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

<style lang="less" scoped>
.select-container {
  position: relative;
  display: inline-block;
  text-align: left;
  .tree-select {
    width: 100%;
  }
  .have-default-name {
    z-index: 100;
    /deep/ .ant-select-selection-selected-value {
      opacity: 0;
    }
    /deep/ .ant-select-selection {
      background: transparent;
    }
  }
  .default-name {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    padding: 0 30px 0 11px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    z-index: 1;
  }
}
</style>