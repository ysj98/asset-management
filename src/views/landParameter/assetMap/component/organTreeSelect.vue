<template>
  <div class="select-organ-container">
    <a-tree-select class="tree-select" :class="{ 'have-default-name': showDefaultOrganName }" :multiple="multiple"
      :showSearch="showSearch" :dropdownStyle="dropdownStyle" :treeData="treeData" :placeholder="placeholder"
      :allowClear="allowClear" :loadData="onLoadData" v-model="organId" :disabled="disabled"
      :treeCheckable="treeCheckable" :treeDefaultExpandAll="treeDefaultExpandAll" @change="changeTree">
    </a-tree-select>
    <div class="default-organ-name" v-show="showDefaultOrganName">{{ defaultOrganName }}</div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {
    // 是否展示默认值
    default: {
      type: Boolean,
      default: true,
    },
    defaultOrganName: {
      type: String,
      default: '',
    },
    // 默认支持清空
    allowClear: {
      type: Boolean,
      default: false,
    },
    placeholder: {
      type: String,
      default: '请选择组织机构树',
    },
    // 过滤参数
    typeFilter: {
      type: String,
      default: '',
    },
    value: {
      type: [String, Number],
      default: '',
    },
    // 禁用
    disabled: {
      type: Boolean,
      default: false,
    },
    // 搜索
    showSearch: {
      type: Boolean,
      default: false,
    },
    // 多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 显示 checkbox
    treeCheckable: {
      type: Boolean,
      default: false,
    },
    // 默认展开所有树节点
    treeDefaultExpandAll: {
      type: Boolean,
      default: false,
    },
    // 下拉框样式
    dropdownStyle: {
      type: Object,
      default: function () {
        return {
          maxHeight: '300px',
          overflow: 'auto',
        };
      },
    },
  },
  data() {
    return {
      showDefaultOrganName: false,
      organId: '',
      treeData: [],
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.organId = val;
    },
    defaultOrganName(val) {
      if (val) {
        this.showDefaultOrganName = true;
      }
    },
  },
  methods: {
    // 第一次进来获取组织机构
    initDepartment() {
      this.$api.assets.queryAsynOrganByUserId({ parentOrganId: '', typeFilter: this.typeFilter }).then((res) => {
        console.log(res);
        if (Number(res.data.code) === 0) {
          this.treeData = this.mapTreeNodes(res.data.data);
          if (this.default) {
            this.organId = this.treeData[0].organId;
            this.organName = this.treeData[0].name;
            this.$emit('changeTree', this.organId, this.organName);
          }
        }
      });
    },
    // 组织机构子节点选择
    onLoadData(node) {
      return new Promise((resolve) => {
        this.$api.assets.queryAsynOrganByUserId({ parentOrganId: node.value, typeFilter: this.typeFilter }).then((res) => {
          if (Number(res.data.code) === 0) {
            let children = this.mapTreeNodes(res.data.data);
            this.setTree(node.value, this.treeData, children);
            this.treeData = [...this.treeData];
            resolve();
          }
        });
      });
    },
    setTree(id, tree, children) {
      for (let i = 0; i < tree.length; i++) {
        if (Number(tree[i].key) !== Number(id)) {
          if (tree[i].children && tree[i].children.length > 0) {
            this.setTree(id, tree[i].children, children);
          }
        } else {
          tree[i].children = [...children];
          return;
        }
      }
    },
    mapTreeNodes(nodeList) {
      return nodeList.map((v) => {
        const { organId, name } = v;
        v.title = name;
        v.key = organId;
        v.value = v.organId;
        return { ...v };
      });
    },
    // 选择树
    changeTree(value, label, extra) {
      this.showDefaultOrganName = false;
      if (!this.multiple) {
        // 单选
        this.$emit('changeTree', value, label[0]);
        this.organName = label[0];
        this.organId = value;
      } else {
        // 多选
        this.$emit('changeTree', value, label);
        this.organName = label;
        this.organId = value;
      }
    },
  },
  created() { },
  mounted() {
    this.organId = this.value;
    this.initDepartment();
  },
};
</script>
<style lang="less" scoped>
.select-organ-container {
  position: relative;
  display: inline-block;

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

  .default-organ-name {
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
