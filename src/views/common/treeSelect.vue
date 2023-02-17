<!--
  查询组织机构树 新
-->
<template>
  <div class="treeSelect">
    <SG-Select
      :popper-append-to-body="false"
      :autoValidate="true"
      :size="size"
      :disabled="disabled"
      v-model="organName"
      :formType="formType"
      :formInputConfig="formInputConfig"
      placeholder="组织机构"
      ref="select"
      :style="width ? `width:${width}'px'` : 'width:100%'"
      class="select-classify-tree"
      :class="{ 'required-icon': formType }"
    >
      <a-spin :spinning="loading">
        <SG-Input-Search
          v-if="showSearch"
          class="select-name"
          :placeholder="placeholder"
          style="width: 96%"
          v-model="keywords"
          search
          @search="queryTree"
        ></SG-Input-Search>
        <a-tree
          v-if="treeData && treeData.length"
          :checkStrictly="true"
          :checkable="multiple"
          :multiple="multiple"
          :loadData="onLoadData"
          :treeData="treeData"
          :defaultExpandAll="defaultExpandAll"
          :checkedKeys="checkedKeys"
          @select="treeNodeSelect"
          @check="treeNodeSelect"
          style="padding-left: 5px; padding-right: 10px; width: 226px"
        ></a-tree>
        <div class="nav-no-data" v-else>暂无数据</div>
      </a-spin>
    </SG-Select>
  </div>
</template>

<script>
export default {
  model: {
    prop: "value",
    event: "input",
  },
  props: {
    // 多选
    multiple: {
      type: Boolean,
      default: false,
    },
    // 默认选择第一个
    defaultDisplay: {
      type: Boolean,
      default: true,
    },
    value: {
      type: [String, Number],
    },
    // 编辑给回来展示的
    defaultOrganName: {
      type: String,
      default: "",
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    width: {
      type: [String, Number],
      default: "",
    },
    placeholder: {
      type: String,
      default: "请输入组织机构名字",
    },
    // 过滤参数
    TypeFilter: {
      type: String,
      default: "",
    },
    size: {
      type: String,
      default: "small",
    },
    formInputConfig: {
      type: Object,
      default: function () {
        return {
          label: "所属机构",
          required: true,
          requiredText: "(必选):",
        };
      },
    },
    // 新增编辑传form
    formType: {
      type: String,
      default: "",
    },
    // 自定义传入的根元素  Array: {organName: '', organId: ''}
    rootData: {
      type: Array,
      default: () => [],
    },
    // 是否展示搜索
    showSearch: {
      type: Boolean,
      default: true,
    },
    authorizedUserId: {
      type: String || Number,
      default: "",
    },
  },
  data() {
    return {
      loading: false,
      organId: "",
      organName: "",
      keywords: "",
      expandedKeys: [],
      autoExpandParent: true,
      defaultExpandedKeys: [],
      defaultExpandAll: false, // 是否展开所有树节点
      treeData: [],
      orgtype: "",
      organIdMap: {}, // 存储所有的组织机构id {key: organId, value: {}}
      checkedKeys: null, //选中复选框的树节点  多选时 { checked: [], halfChecked: [] }
      typeFilter: this.TypeFilter, // 过滤参数
    };
  },
  methods: {
    // 处理自定义跟节点
    manageRootData(data) {
      this.treeData = [];
      this.expandedKeys = [];
      let children = data.map((item) => {
        return {
          title: item.organName || item.name,
          key: item.organId,
          selectable: !this.multiple,
          orgtype: item.orgtype,
          organCode: item.organCode,
        };
      });
      this.treeData = children;
      this.organId = this.treeData[0].key;
      this.organName = this.treeData[0].title;
      this.orgtype = this.treeData[0].orgtype;
      // this.$emit("changeTree", this.organId, this.organName, this.orgtype);
    },
    // 校验组件必填
    validateForm(context = this) {
      context.$children.forEach((item) => {
        item.validate && item.validate();
        if (!item.validate && item.$children && item.$children.length) {
          this.validateForm(item);
        }
      });
    },
    // 返回机构名称
    getOrganName(treeData, key) {
      let organName = [];
      function temp(treeData, key) {
        treeData.forEach((item) => {
          if (item.key && key.includes(item.key)) {
            organName.push(item.title);
          }
          if (item.children && item.children.length > 0) {
            temp(item.children, key);
          }
        });
      }
      temp(treeData, key);
      if (organName.length === 1) {
        return organName[0];
      } else {
        return "已选" + organName[0] + "等" + organName.length + "个组织";
      }
    },
    // 选中树节点
    treeNodeSelect(selectedKeys, e) {
      // console.log(selectedKeys, e);
      if (this.multiple) {
        this.checkedKeys = selectedKeys;
        if (this.checkedKeys.checked.length === 0) {
          this.$message.info("请选择组织机构");
          return;
        }
        let flag = this.checkedKeys.checked.filter((item) => this.organIdMap[item] && this.organIdMap[item].organCode.length === 8);
        if (flag.length >= 2) {
          this.$message.info("不能跨物业选择");
          this.checkedKeys.checked = this.checkedKeys.checked.slice(0, this.checkedKeys.checked.length - 1);
          return;
        }
        this.organId = this.checkedKeys.checked;
        // 选中的组织机构名称
        this.organName = this.getOrganName(this.treeData, this.checkedKeys.checked);
      } else {
        this.$refs.select.changeVisible(false);
        this.organId = e.node.dataRef.key;
        this.organName = e.node.dataRef.title;
        this.orgtype = e.node.dataRef.orgtype;
      }
      if (this.formType) {
        this.$nextTick(function () {
          this.validateForm();
        });
      }
      // 获取货币单位以及面积单位，改变页面的单位显示 (项目信息设置页面根据项目配置)
      this.$textReplace(this.organId.toString());
      this.$emit("changeTree", this.organId.toString(), this.organName, this.orgtype);
    },
    // 下载下级数据
    onLoadData(treeNode) {
      return new Promise((resolve) => {
        if (treeNode.dataRef.children) {
          resolve();
          return;
        }
        Promise.all([
          // 是否过滤部门节点 （资产参数配置页面）
          this.$api.paramsConfig.queryParamsConfigDetail({ organId: treeNode.dataRef.key, serviceType: 1010 }),
          // 是否过滤经营项目
          this.$api.paramsConfig.queryParamsConfigDetail({ organId: treeNode.dataRef.key, serviceType: 1017 }),
        ]).then((res) => {
          if (res[0].data.code === "0") {
            const { isValid } = res[0].data.data;
            if (Number(isValid) === 1) {
              if (this.typeFilter.length) {
                // 如果prop传入的过滤参数不包含部门，则加上部门
                if (!this.typeFilter.includes("7")) {
                  this.typeFilter = this.typeFilter + ",7";
                }
              } else {
                this.typeFilter = "7";
              }
            } else {
              // 如果关闭了过滤部门设置 传入prop包含部门也剔除掉
              if (this.typeFilter.length && this.typeFilter.includes("7")) {
                this.typeFilter = this.typeFilter
                  .split(",")
                  .filter((item) => {
                    return item !== "7";
                  })
                  .join(",");
              }
            }
          }

          if (res[1].data.code === "0") {
            const { isValid } = res[1].data.data;
            if (Number(isValid) === 1) {
              if (this.typeFilter.length) {
                // 如果prop传入的过滤参数不包含经营项目， 则加上经营项目
                if (!this.typeFilter.includes("6")) {
                  this.typeFilter = this.typeFilter + ",6";
                }
              } else {
                this.typeFilter = "6";
              }
            } else {
              // 如果关闭了过滤经营项目设置 传入prop包含经营项目也剔除掉
              if (this.typeFilter.length && this.typeFilter.includes("6")) {
                this.typeFilter = this.typeFilter
                  .split(",")
                  .filter((item) => {
                    return item !== "6";
                  })
                  .join(",");
              }
            }
          }

          let obj = {
            typeFilter: this.typeFilter,
            parentOrganId: treeNode.dataRef.key,
          };
          this.expandedKeys.push(treeNode.dataRef.key);
          this.$api.assets.queryAsynOrganByUserId(obj).then((result) => {
            if (+result.data.code === 0) {
              let data = result.data.data;
              let children = data.map((item) => {
                return {
                  title: item.organName || item.name,
                  key: item.organId,
                  selectable: !this.multiple,
                  orgtype: item.orgtype,
                  organCode: item.organCode,
                };
              });
              this.setOrganIdMap(children);
              treeNode.dataRef.children = children;
              this.treeData = [...this.treeData];
              resolve();
            }
          });
        });
      });
    },
    // 根据用户加载组织机构
    loadOrganTree() {
      this.treeData = [];
      this.expandedKeys = [];
      let form = {
        parentOrganId: "",
        typeFilter: this.typeFilter,
      };
      this.loading = true;
      this.$api.assets.queryAsynOrganByUserId(form).then((res) => {
        this.loading = false;
        if (+res.data.code === 0) {
          let data = res.data.data;
          let children = data.map((item) => {
            return {
              title: item.organName || item.name,
              key: item.organId,
              selectable: !this.multiple,
              orgtype: item.orgtype,
              organCode: item.organCode,
            };
          });
          this.setOrganIdMap(children);
          this.treeData = children;
          // 默认选择
          if (this.defaultDisplay) {
            // 如果用户初始返回的不是一级机构，则全部选中初始返回的
            if (this.treeData[0].organCode.length !== 8 && this.multiple) {
              this.organId = this.treeData.map((item) => {
                return item.key;
              });
              this.checkedKeys.checked = this.organId;
              // 选中的组织机构名称
              this.organName = this.getOrganName(this.treeData, this.checkedKeys.checked);
            } else {
              // 默认选择第一个
              this.organId = this.treeData[0].key;
              this.organName = this.treeData[0].title;
              this.orgtype = this.treeData[0].orgtype;
            }
            // 获取货币单位以及面积单位，改变页面的单位显示 (项目信息设置页面根据项目配置)
            this.$textReplace(this.organId.toString());
            this.$emit("changeTree", this.organId.toString(), this.organName, this.orgtype);
          }
        }
      });
    },
    setOrganIdMap(arr) {
      for (let i = 0; i < arr.length; i++) {
        if (arr[i].children && arr[i].children.length > 0) {
          this.setOrganIdMap(arr[i].children);
        }
        delete arr[i].children;
        if (!this.organIdMap[arr[i].key]) {
          this.organIdMap[arr[i].key] = arr[i];
        }
      }
    },
    // 按关键字搜索
    queryTree() {
      this.treeData = [];
      if (this.keywords) {
        this.defaultExpandAll = true;
      } else {
        this.defaultExpandAll = false;
        this.loadOrganTree();
        return;
      }
      this.checkedKeys = [];
      let form = {
        keywords: this.keywords,
        // exclusionOrgTypes: "6,7",
      };
      this.loading = true;
      this.$api.assets.queryAsynOrganByKey(form).then((res) => {
        this.loading = false;
        if (+res.data.code === 0) {
          let data = res.data.data;
          // this.setOrganIdMap(data);
          this.dataToTree(data, this.treeData);
        }
      });
    },
    // 构造树形结构
    dataToTree(data, tree) {
      data.forEach((item) => {
        tree.push({
          title: item.organName || item.name,
          key: item.organId,
          selectable: !this.multiple,
          orgtype: item.orgtype,
          organCode: item.organCode,
          children: this.treeAdapter(item.children),
        });
      });
    },
    treeAdapter(children) {
      let result = [];
      if (children && children.length) {
        result = children.map((item) => {
          return {
            title: item.organName || item.name,
            key: item.organId,
            selectable: !this.multiple,
            orgtype: item.orgtype,
            organCode: item.organCode,
            children: this.treeAdapter(item.children),
          };
        });
      }
      return result;
    },
  },
  created() {
    if (this.multiple) {
      this.checkedKeys = { checked: [], halfChecked: [] };
    } else {
      this.checkedKeys = null;
    }
  },
  mounted() {
    this.organName = this.defaultOrganName;
    if (this.rootData.length) {
      this.manageRootData(this.rootData);
    } else {
      this.loadOrganTree();
    }
  },
  watch: {
    organId(nVal, oVal) {
      if (nVal === oVal || !nVal) return;
      this.$emit("input", nVal);
    },
    defaultOrganName() {
      this.organName = this.defaultOrganName;
    },
    authorizedUserId(val) {
      console.log(val);
    },
    rootData: {
      handler(val) {
        if (val.length > 0) {
          this.treeData = [];
          this.manageRootData(val);
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="less">
.select-name {
  display: flex;
  margin: 0 auto;
}
.nav-no-data {
  padding-left: 20px;
  line-height: 40px;
  color: #ccc;
}
.treeSelect {
  display: inline-block;
  position: relative;
  .required-icon {
    &:before {
      position: absolute;
      left: 6px;
      top: 4px;
      content: "*";
      color: #fd7474;
      font-weight: bold;
      z-index: 1;
    }
  }
}
</style>
