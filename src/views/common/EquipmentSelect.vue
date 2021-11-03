<template>
  <div class="select-container" :style="{width: width}" >
    <a-tree-select
        v-model="valueCmp"
        :class="{'have-default-name': showDefaultOrganName}"
        tree-data-simple-mode
        style="width: 100%"
        placeholder="请选择设备设施分类"
        :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
        :tree-data="treeList"
        @change="handleChange"
        @focus="handleFocus"
    />
    <div class="default-name" v-show="showDefaultOrganName">{{defaultName}}</div>
  </div>
</template>
<script>

export default {
  props:{
    value: '',
    communityId: {
      type: [String, Number]
    },
    width:{
      type: String,
      default: '200px'
    },
    defaultName : {
      type: String,
      default: ''
    }
  },
  model: {
    event: 'change',
    prop: 'value'
  },
  watch: {
    communityId: function () {
      this.init()
    },
    defaultName: function () {
      this.showDefaultOrganName = true
    }
  },
  data : ()=>({
    treeList: [],
    showDefaultOrganName: true // 显示默认值
  }),
  computed:{
    valueCmp: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('change',val)
      }
    }
  },
  methods: {
    handleFocus () {
      console.log('focus')
        this.init()
    },
    handleChange () {
      this.showDefaultOrganName = false
    },
    init () {
      this.treeList = []
      this.getEquipmentInstListByTopOrganId() // 根据组织机构查询设备编码表
    },
    // 顶层
    async getEquipmentInstListByTopOrganId () {
      if(!this.communityId) {
        return
      }
      const params = {
        systemCode: 'assets',
        communityId: this.communityId
      }
      const {data: res} = await this.$api.building.getEquipmentInstListByTopOrganId(params)
      if (String(res.code) === "0") {
        this.afterEquipmentCodeList(res.data.resultList|| [])
      } else {
        this.$message.error(res.message)
      }
    },
    afterEquipmentCodeList (value) {
      this.treeList=value.map(item => {
        const pId = item.upPositionId // === -1 ? 0 : item.upPositionId
        return { id: item.positionId, pId: pId, value: item.positionId, title: item.positionName }
      })
    }
  },
  mounted() {
    this.init()
  }
}
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