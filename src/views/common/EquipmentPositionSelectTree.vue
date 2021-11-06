<template>
  <div class="select-container" :style="{width: width}">
    <a-tree-select
        class="tree-select"
        :class="{'have-default-name': showDefaultOrganName}"
        :multiple="multiple"
        v-model="valueCom"
        :showSearch="true"
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
      default: "请选择资源位置"
    },
    // 真实项目Id
    communityId: {
      type: [String, Number],
      required: true
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
    communityId: {
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
    async onLoadData(treeNode) {
      console.log("treeNode", treeNode);
      if (treeNode.dataRef.children && treeNode.dataRef.children.length > 0) {
        return;
      }
      const {communityId,positionType,positionId } = treeNode.dataRef;
      try {
        const params = { communityId, positionType, upPositionId: positionId }
        const data = await this.positionSelectAsynByOwnership(params)
        treeNode.dataRef.children = data
      } catch (error) {
        treeNode.dataRef.children = [];
      }
    },
    // 根据CommunityID查询位置列表
    async positionSelectByCommunityID(communityId) {
      this.treeData = []
      try {
        if (!communityId) {
          return
        }
        const params = {
          communityId,
          positionType: ""
        }
        const {data: res} = await this.$api.building.positionSelectByCommunityID(params)
        if(String(res.code) === '0') {
          res.data.children = (res.data.children || []).map(item=>({...item,key:Math.random(), value: item.positionId,label: item.positionName,title: item.positionName,selectable: false , children: [],isLeaf: false}))
          this.treeData = ([res.data] || []).map(item=>({...item, value: item.positionId,label: item.positionName, selectable: false}))
        }
      }catch {}
    },
    // 根据communitId和positionType查询具体资源
    async positionSelectAsynByOwnership (data) {
      try {
        const params = {
          ...data
        }
        const {data: res} = await this.$api.building.positionSelectAsynByOwnership(params)
        if(String(res.code) === '0') {
          return (res.data || []).map(item=>({...item, value:item.positionId,label: item.positionName}))
        }
      }catch {
        return []
      }
    },
    init() {
      this.positionSelectByCommunityID(this.communityId);
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