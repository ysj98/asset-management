<!--
 * @Date: 2019-11-08 17:40:33
 * @Author: chen han
 * @Description: 建筑物位置->楼栋，单元，楼层，选择组件
 -->
<template>
  <div class="custom-tree building-tree">
    <div class="tree-search" v-if="searchAble">
      <a-input placeholder="请输入建筑物进行查询" v-model="searchValueInput" @input="onChange">
        <a-icon slot="suffix" style="cursor: pointer" type="search" @click="onChange" />
      </a-input>
    </div>
    <div class="tree-main" :key="treeUuid + ''">
      <div class="table-no-data" v-if="gData.length === 0">暂无分类</div>
      <a-tree
        @expand="onExpand"
        :loadData="onLoadData"
        :expandedKeys="expandedKeys"
        :autoExpandParent="autoExpandParent"
        :treeData="gData"
        @select="hanldSelect"
      >
        <template slot="title" slot-scope="scope">
          <div class="tree-bg-box" :key="scope.key" :class="[scope.key === activeKey && 'active']" @click="hanldeOper(scope)">
            <!-- 标题及搜索 -->
            <span style="color: #1890ff" class="tree-node-title" v-if="scope.title.indexOf(searchValueInput) > -1 && searchValueInput">{{
              scope.title
            }}</span>
            <span class="tree-node-title" v-else>{{ scope.title }}</span>
          </div>
        </template>
      </a-tree>
    </div>
  </div>
</template>
<script>
// 位置类型，1：建筑类，2：公共区域，3：停车场 4 土地
// 位置子类型	subPositionType	int		当位置类型为1时，0：表示楼栋，1：表示单元，2：表示楼层,3：表示小区,4：建筑位置,5：电梯
// 当位置类型为2时，0：表示公共区域，1：公共区域位置
// 当位置类型为3时，0：表示车场，1：表示车场区域，2：停车位
// 当位置类型为4时，0：表示土地

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
// 搜索获取
const getParentKey = (key, tree) => {
  let parentKey;
  for (let i = 0; i < tree.length; i++) {
    const node = tree[i];
    if (node.children) {
      if (node.children.some((item) => item.key === key)) {
        parentKey = node.key;
      } else if (getParentKey(key, node.children)) {
        parentKey = getParentKey(key, node.children);
      }
    }
  }
  return parentKey;
};
// 写死顶层项
const topItem = {
  key: getUuid(),
  type: 'top',
  id: '-1',
  upPositionId: '-1',
  positionId: '-1',
  subPositionType: '-2',
  title: '楼栋列表',
  scopedSlots: { title: 'title' },
};
export default {
  props: {
    organId: {
      type: [String, Number],
      default: '',
    },
    // 是否可搜索
    searchAble: {
      type: Boolean,
      default: true,
    },
  },
  watch: {
    organId(nv) {
      if (nv) {
        this.positionSelectAsyn(nv);
      }
    },
  },
  mounted() {
    if (this.organId) {
      this.positionSelectAsyn(this.organId);
    }
  },
  data() {
    return {
      activeKey: '', // 当前点击项
      expandedKeys: [topItem.key],
      autoExpandParent: false,
      gData: [{ ...topItem }],
      dataList: [{ ...topItem }], // 缓存每一项请求
      selectItem: {}, // 当前添加项
      treeUuid: getUuid(),
      searchValueInput: '', // 搜索框的值
    };
  },
  methods: {
    emptyTreeData() {
      this.gData = [{ ...topItem }];
      this.expandedKeys = [topItem.key];
      this.dataList = [{ ...topItem }];
      this.selectItem = {};
      console.log('hhhhhh', this.expandedKeys);
    },
    hanldeOper(scope) {
      if (this.activeKey === scope.key) {
        return;
      }
      this.selectItem = { ...scope };
      this.activeKey = scope.key;
      this.$emit('change', { ...scope });
    },
    // 重新加载
    resetLoad() {
      this.positionSelectAsyn(this.organId);
    },
    hanldSelect() {},
    onExpand(expandedKeys) {
      this.expandedKeys = expandedKeys;
      this.autoExpandParent = false;
    },
    // 异步加载数据
    onLoadData(treeNode) {
      if (['-2', '2'].includes(String(treeNode.dataRef.subPositionType))) {
        return Promise.resolve();
      }
      let data = {
        upPositionId: treeNode.dataRef.id,
        positionType: '1',
        organId: this.organId,
      };
      return this.queryPositionListByParId(data, treeNode.dataRef.key);
    },
    // 一级机构id 请求楼栋
    positionSelectAsyn(organId) {
      this.emptyTreeData();
      let data = {
        organId: this.organId,
        upPositionId: '-1',
        positionType: '1',
      };
      return this.$api.building.positionSelectAsyn(data).then((res) => {
        if (res.data.code === '0') {
          let result = res.data.data || [];
          this.gData[0].children = result.map((item) => {
            item.type = 'frist';
            item.key = item.positionId;
            item.id = item.positionId;
            item.title = item.positionName;
            item.scopedSlots = { title: 'title' };
            this.dataList.push({ ...item });
            return { ...item };
          });
          this.expandedKeys = [topItem.key];
          this.treeUuid = getUuid();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 根据位置id请求位置
    queryPositionListByParId(data = {}, key) {
      return this.$api.building.positionSelectAsyn(data).then(
        (res) => {
          if (res.data.code === '0') {
            let result = res.data.data || [];
            for (let i = 0; i < result.length; i++) {
              let item = result[i];
              item.key = item.positionId;
              item.type = 'second';
              item.id = item.positionId;
              item.title = item.positionName;
              item.scopedSlots = { title: 'title' };
              this.dataList.push({ ...item });
            }
            let _item = fetchItem(this.gData, key, 'key');
            this.expandedKeys.push(key);
            this.expandedKeys = [...new Set(this.expandedKeys)];
            if (_item) {
              this.$set(_item, 'children', result);
            }
          } else {
            this.$message.error(res.data.message);
          }
        },
        () => {}
      );
    },
    onChange(e) {
      let value = this.searchValueInput;
      // 找到需要的节点
      let expandedKeys = this.dataList
        .map((item) => {
          if (item.title.indexOf(value) > -1 && value.trim()) {
            return getParentKey(item.key, this.gData);
          }
          return null;
        })
        .filter((item, i, self) => item && self.indexOf(item) === i);
      if (!expandedKeys.length) {
        expandedKeys = [topItem.key];
      }
      Object.assign(this, {
        expandedKeys,
        // searchValue: value,
        autoExpandParent: true,
      });
    },
  },
};
</script>
<style lang="less" scoped>
.tree-bg-box {
  z-index: 4;
  &::before {
    content: '';
    display: inline-block;
    position: absolute;
    left: 0;
    right: 0;
    height: 30px;
    margin-top: -2px;
    background: transparent;
  }
  .tree-ope-box {
    position: absolute;
    right: 16px;
    z-index: 3;
    display: none;
  }
  &:hover {
    &::before {
      background: #f5f7fa;
    }
    .tree-ope-box {
      display: inline-block;
    }
  }
  &.active {
    &::before {
      background: #f5f7fa;
    }
    .tree-ope-box {
      display: inline-block;
    }
  }
}
.tree-node-title {
  z-index: 2;
  position: relative;
}
.tree-search {
  padding: 16px 21px 10px 21px;
}
.tree-main {
  padding-left: 13px;
}
</style>
<style lang="less">
.building-tree {
  .ant-tree li .ant-tree-node-content-wrapper {
    cursor: default;
  }
}
</style>
