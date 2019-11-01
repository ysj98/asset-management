<!--
 所属分类组件
 v-model
 @change
-->
<template>
    <a-tree-select
    :key="keyUuid"
    :style="seleteStyle"
    :dropdownStyle="{ maxHeight: '400px', overflow: 'auto', maxWidth: '300px' }"
    :treeData="treeData"
    placeholder='所属分类'
    treeDefaultExpandAll
    @change="handleChange"
    allowClear
    v-model="professionalCategoryId"
    :dropdownMatchSelectWidth="false"
    >
  </a-tree-select>
</template>
<script>
import {TreeSelect} from 'ant-design-vue'
import {getCategoryNodeAll} from '@/api/basics.js'
let getUuid = (() => {
  let uuid = 1
  return () => {
    return ++uuid
  }
})()
const handleGData = (data) => {
  let arr = []
  data.forEach(item => {
    let o = Object.assign({}, item)
    o.title = item.professionalCategoryName
    o.key = item.professionalCategoryId + ''
    o.value = item.professionalCategoryId + ''
    // o.scopedSlots = { title: 'title' }
    arr.push(o)
    if (item.childs && item.childs.length > 0) {
      o.children = handleGData(item.childs)
    }
  })
  return arr
}
export default {
  name: 'CategorySelect',
  components: {
    ATreeSelect: TreeSelect
  },
  props: {
    seleteStyle: {
      type: Object,
      default () {
        return {}
      }
    },
    value: {
      type: [Number, String],
      default: ''
    },
    organData: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  watch: {
    organData (newVal) {
      this.query()
    },
    value (newVal) {
      this.professionalCategoryId = newVal
    }
  },
  data () {
    return {
      keyUuid: getUuid(),
      treeData: [],
      professionalCategoryId: ''
    }
  },
  mounted () {
    this.query()
  },
  methods: {
    handleChange (item) {
      this.$emit('input', this.professionalCategoryId)
      this.$emit('change', this.professionalCategoryId)
    },
    query () {
      // if (!this.organData.organId) {
      //   return this.$message.error('请选择项目')
      //   // return
      // }
      let data = {
        groupId: this.organData.organId || ''
      }
      getCategoryNodeAll(data).then(res => {
        if (res.data.code === '0') {
          let resulte = handleGData(res.data.data)
          if (resulte[0].children) {
            this.treeData = resulte[0].children
          } else {
            this.treeData = []
          }
          this.keyUuid = getUuid()
          if (this.value) {
            this.professionalCategoryId = this.value
          }
        }
      })
    }
  }
}
</script>

