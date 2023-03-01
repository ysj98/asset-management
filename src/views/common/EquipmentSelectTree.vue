<template>
  <div class="select-container" :style="{ width: width }">
    <a-tree-select
      :size="size"
      class="tree-select"
      :class="{ 'have-default-name': showDefaultOrganName && defaultName }"
      :multiple="multiple"
      v-model="valueCom"
      :allowClear="allowClear"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="optionsDataFormat(treeData)"
      :placeholder="placeholder"
      :load-data="onLoadData"
      treeNodeFilterProp="title"
      @change="handleChange"
      @select="handleSelect"
      :maxTagCount="maxTagCount"
    />
    <div class="default-name" v-show="showDefaultOrganName && defaultName">{{ defaultName }}</div>
  </div>
</template>

<script>
import { queryTopOrganByOrganID } from '../buildingDict/publicFn';

export default {
  name: 'EquipmentSelectTree',
  props: {
    size: {
      type: String,
      default: 'default',
    },
    maxTagCount: {
      type: Number,
      default: 1,
    },
    placeholder: {
      type: String,
      default: '请选择分类',
    },
    // 组织机构 id
    topOrganId: {
      type: [String, Number],
      required: true,
    },
    // 是否开启顶级机构Id反查
    isTopOrganId: {
      default: true,
    },
    // 默认不支持清空
    allowClear: {
      default: false,
    },
    value: {
      type: [Number, Array, String],
      default: undefined,
    },
    width: {
      type: String,
      default: '200px',
    },
    multiple: {
      type: Boolean,
      default: false,
    },
    defaultName: {
      type: String,
      default: '',
    },
    optionsDataFormat: {
      type: Function,
      default(data) {
        return data;
      },
    },
  },
  model: {
    event: 'change',
    prop: 'value',
  },
  data() {
    return {
      // 一级机构 id
      oneOrganId: '',
      treeData: [],
      showDefaultOrganName: true, // 显示默认值
    };
  },
  computed: {
    valueCom: {
      get() {
        return this.value;
      },
      set(value) {
        // ant-design-vue bug https://github.com/vueComponent/ant-design-vue/pull/1551 #1551
        const res = typeof value === 'number' ? String(value) : value;
        this.$emit('change', res);
      },
    },
  },
  watch: {
    topOrganId: {
      handler: async function (newValue) {
        console.log('topOrganID', newValue);
        if (newValue) {
          if (this.isTopOrganId) {
            this.oneOrganId = await this.getTopOrganId({ nOrganId: newValue, nOrgId: newValue });
          }
          this.init();
        }
      },
      immediate: true,
    },
    defaultName: function () {
      this.showDefaultOrganName = true;
    },
  },
  methods: {
    handleSelect(...argus) {
      this.$emit('select', ...argus);
    },
    handleChange() {
      this.showDefaultOrganName = false;
    },
    //  获取 一级机构 id
    async getTopOrganId({ nOrgId, nOrganId }) {
      return new Promise(async (resolve) => {
        const params = { nOrgId, nOrganId };
        let data = await queryTopOrganByOrganID(params);
        resolve(data.organId);
      });
    },
    onLoadData(treeNode) {
      console.log('treeNode', treeNode);
      return new Promise(async (resolve, reject) => {
        const { value } = treeNode;
        let organId = this.topOrganId;
        if (this.isTopOrganId) {
          organId = this.oneOrganId;
        }
        try {
          const data = await this.getPositionData({
            organId: organId,
            upEquipmentId: value,
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
      let organId = this.topOrganId;
      if (this.isTopOrganId) {
        organId = this.oneOrganId;
      }
      console.log('organId', organId);
      return new Promise(async (resolve, reject) => {
        const requestData = {
          organId: organId,
          upEquipmentId: '-1',
        };
        Object.assign(requestData, options);
        const {
          data: { code, message, data },
        } = await this.$api.building.getEquipmentListByUpEquipmentId(requestData);
        if (code === 0) {
          resolve(data.resultList);
        } else {
          reject(message);
        }
      });
    },
    handlePositionDataToTreeData(data) {
      return data.map((ele) => {
        return {
          ...ele,
          value: ele.equipmentId,
          title: ele.equipmentName,
          label: ele.equipmentName,
          children: [],
        };
      });
    },
    async init() {
      const data = await this.getPositionData();
      this.treeData = this.handlePositionDataToTreeData(data);
    },
  },
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
