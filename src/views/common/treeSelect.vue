<template>
  <div class="select-organ-container">
    <a-tree-select
      class="tree-select"
      :class="{ 'have-default-name': showDefaultOrganName }"
      :maxTagCount="maxTagCount"
      :multiple="multiple"
      :showSearch="showSearch"
      :dropdownStyle="dropdownStyle"
      :treeData="treeData"
      :placeholder="placeholder"
      :allowClear="allowClear"
      :loadData="onLoadData"
      v-model="organId"
      :disabled="disabled"
      :searchValue="searchvalueBusinessType"
      :treeCheckable="treeCheckable"
      :treeDefaultExpandAll="treeDefaultExpandAll"
      tree-node-filter-prop="title"
      @change="changeTree"
      @search="searchOrgan"
    >
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
      default: "",
    },
    // 默认支持清空
    allowClear: {
      type: Boolean,
      default: true,
    },
    placeholder: {
      type: String,
      default: "请选择组织机构树",
    },
    // 过滤参数
    typeFilter: {
      type: String,
      default: "",
    },
    value: {
      type: [String, Number],
      // default: ''
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
          maxHeight: "400px",
          overflow: "auto",
        };
      },
    },
  },
  model: {
    event: "change",
    prop: "value",
  },
  data() {
    return {
      showDefaultOrganName: false,
      organId: "",
      treeData: [],
      maxTagCount: -1,
      searchvalueBusinessType: "",
      organIdMap: {}, // 存储所有的组织机构id {key: organId, value: {}}
    };
  },
  computed: {},
  watch: {
    value(val) {
      this.organId = val;
    },
    organId(nVal, oVal) {
      // organId和value 互相监听，若不判等，将造成死循环，不建议，也不要这样写，但是组件本身逻辑已完成
      if (nVal === oVal || !nVal) return;
      this.$emit("change", nVal);
    },
    defaultOrganName: {
      handler: function (newValue) {
        if (newValue) {
          this.showDefaultOrganName = true;
        }
      },
      immediate: true,
    },
  },
  methods: {
    // 第一次进来获取组织机构
    initDepartment(organTopId, organTopName) {
      this.$api.assets.queryAsynOrganByUserId({ parentOrganId: "", typeFilter: this.typeFilter }).then((res) => {
        if (Number(res.data.code) === 0) {
          let resultData = res.data.data;
          // TODO: 过滤同一 一级机构, 这种通过 外部 ref 调用内部方法 传参 区分过滤 的写法 不太优雅,有时间优化一下
          if (organTopId && organTopName) {
            resultData = [
              {
                organId: organTopId,
                name: organTopName,
              },
            ];
          }
          this.setOrganIdMap(resultData);
          this.treeData = this.mapTreeNodes(resultData);
          if (this.default) {
            this.organId = this.treeData[0].organId;
            this.organName = this.treeData[0].name;
            this.$emit("changeTree", this.organId, this.organName);
          }
        }
      });
    },
    // 组织机构子节点选择
    onLoadData(node) {
      return new Promise((re) => {
        this.$api.paramsConfig.queryParamsConfigDetail({ organId: node.value, serviceType: 1010 }).then((res) => {
          if (res.data.code === "0") {
            const { isValid, paramKey } = res.data.data;
            if (Number(isValid) === 1) {
              if (this.typeFilter.length) {
                if (!this.typeFilter.includes("7")) {
                  this.typeFilter = this.typeFilter + ",7";
                }
              } else {
                this.typeFilter = "7";
              }
            } else {
              if (this.typeFilter.length && this.typeFilter.includes("7")) {
                this.typeFilter = this.typeFilter
                  .split(",")
                  .filter((item) => {
                    return item !== "7";
                  })
                  .join(",");
              }
            }
            //  根据父节点organId 去获取子节点
            this.$api.assets.queryAsynOrganByUserId({ parentOrganId: node.value, typeFilter: this.typeFilter }).then((r) => {
              if (Number(r.data.code) === 0) {
                this.setOrganIdMap(r.data.data);
                let children = this.mapTreeNodes(r.data.data);
                this.setTree(node.value, this.treeData, children);
                this.treeData = [...this.treeData];
              }
            });
          }
          re();
        });
      });
      // return new Promise((resolve) => {
      //   this.$api.assets.queryAsynOrganByUserId({parentOrganId: node.value, typeFilter: this.typeFilter}).then(res => {
      //     if (Number(res.data.code) === 0) {
      //       let children = this.mapTreeNodes(res.data.data)
      //       this.setTree(node.value, this.treeData, children)
      //       this.treeData = [...this.treeData]
      //       resolve()
      //     }
      //   })
      // })
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
      function deep(nodeList) {
        let resultData = [];
        nodeList.forEach((v) => {
          const { organId, name, organName, children } = v;
          v.title = organName || name;
          v.key = organId;
          v.value = v.organId;
          v.isLeaf = organId + "" === "1" ? true : false;
          v.disableCheckbox = organId + "" === "1" ? true : false;
          v.selectable = organId + "" === "1" ? true : false;
          v.children = Array.isArray(children) && children.length > 0 ? deep(children) : [];
          resultData.push({
            ...v,
          });
        });
        return resultData;
      }
      return deep(nodeList);
      // return nodeList.map(v => {
      //   const { organId, name,organName } = v
      //   v.title = organName||name
      //   v.key = organId
      //   v.value = v.organId
      //   return {...v}
      // })
    },
    setOrganIdMap(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children && arr[i].children.length > 0) {
          this.setOrganIdMap(arr[i].children);
        }
        delete arr[i].children;
        if (!this.organIdMap[arr[i].organId]) {
          this.organIdMap[arr[i].organId] = arr[i];
        }
      }
    },
    // 选择树
    changeTree(value, label, extra) {
      console.log("组织结构树change事件", value, label, extra);
      this.showDefaultOrganName = false;
      if (!this.multiple) {
        // 单选
        this.$emit("changeTree", value, label[0]);
        this.organName = label[0];
        this.organId = value;
      } else {
        // 多选
        // 如果是多选只能选中一个一级物业 一级物业 如organCode为八位
        let flag = value.filter((item) => this.organIdMap[item].organCode.length === 8);
        if (flag.length >= 2) {
          this.$message.error("不能跨物业选择");
          this.organName = label.slice(0, label.length - 1);
          this.organId = value.slice(0, label.length - 1);
        } else {
          this.$emit("changeTree", value.toString(), label.toString());
          this.organName = label;
          this.organId = value;
        }
      }
    },
    //转换查询
    searchOrgan(value) {
      this.searchvalueBusinessType = value;
      if (this.showSearch && value.length > 0) {
        this.organId = "";
        this.keywordOrgan(value);
      }
    },
    //关键字查询组织机构
    keywordOrgan(value) {
      this.searchvalueBusinessType = value;
      this.$api.assets.queryAsynOrganByKey({ keywords: value }).then((res) => {
        if (Number(res.data.code) === 0) {
          let resultData = res.data.data;
          this.treeData = [];
          this.treeData = this.mapTreeNodes(resultData);
          // console.log(this.treeData)
          // if (this.default) {
          //   this.organId = this.treeData[0].organId
          //   this.organName = this.treeData[0].name
          //   this.$emit('changeTree', this.organId, this.organName)
          // }
        }
      });
    },
  },
  created() {},
  mounted() {
    // 多选模式防止换行
    this.maxTagCount = this.multiple ? 1 : -1;
    this.organId = this.value;
    this.initDepartment();
    this.$nextTick(() => {
      document.addEventListener("click", (event) => {
        event.stopPropagation();
        this.searchvalueBusinessType = "";
      });
    });
  },
};
</script>
<style lang="less" scoped>
.select-organ-container {
  width: 200px !important;
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
  .default-organ-name {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 0;
    width: 100%;
    padding: 0 30px 0 11px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    z-index: 1;
    line-height: 30px;
  }
}
</style>
