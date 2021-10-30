<template>
  <a-tree-select
      v-model="valueCmp"
      tree-data-simple-mode
      style="width: 100%"
      placeholder="请选择设备设施分类"
      :dropdown-style="{ maxHeight: '400px', overflow: 'auto' }"
      :tree-data="treeList"
      :load-data="onLoadData"
  />
</template>
<script>

export default {
  props:{
    value:undefined,
    organId: undefined
  },
  model: {
    event: 'change',
    prop: 'value'
  },
  watch: {
    organId: function () {
      this.getEquipmentCodeList()
    }
  },
  data : ()=>({
    treeList: []
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
    onLoadData (treeNode) {
      console.log(treeNode.dataRef)
      return this.getEquipmentListByUpEquipmentId(treeNode.dataRef)
    },
    init () {
      this.getEquipmentCodeList() // 根据组织机构查询设备编码表
    },
    // 顶层
    async getEquipmentCodeList () {
      if(!this.organId) {
        // this.$message.error('请选择所属组织机构')
        return
      }
      const params = {
        organId: this.organId
      }
      const {data: res} = await this.$api.building.getEquipmentCodeList(params)
      if (String(res.code) === "0") {
        this.afterEquipmentCodeList(res.data.resultList|| [])
      } else {
        this.$message.error(res.message)
      }
    },
    afterEquipmentCodeList (value) {
      // code: '6003', name: '视频监控'
      this.treeList=value.map(item => ({ id: item.code, pId: 0, value: item.code, title: item.name }))
    },
    async getEquipmentListByUpEquipmentId(data) {
      const params = {
        organId: this.organId,
        upEquipmentId: data.value // 上级分类Id
      }
      const {data: res} = await this.$api.building.getEquipmentListByUpEquipmentId(params)
      debugger
      if (String(res.code) === "0") {
        this.afterEquipmentListByUpEquipmentId(res.data.resultList|| [], data)
      }
      // this.afterEquipmentListByUpEquipmentId( [], data)
      return
    },
    afterEquipmentListByUpEquipmentId (value,parentData) {
      const list=[
        { id:"8666", pId: parentData.value, value: '8666', title: '测试子组件' }
      ]
      this.treeList.push(...list)
    }
  },
  mounted() {
    this.init()
  }
}
</script>