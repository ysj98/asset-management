<template>
  <a-select
    :mode="mode"
    :maxTagCount="maxTagCount"
    v-model="valueCmp"
    :disabled="disabled"
    :placeholder="placeholder"
    :notFoundContent="notFoundContent"
    optionFilterProp="children"
    :options="$addTitle(options)"
    @change="handleChange"
    @select="handleSelect"
  />
</template>
<script>
import { utils } from "@/utils/utils";

export default {
  name: "DictSelect",
  props:{
    // v-model 绑定的值
    value:{
      type: [String,Number,Array],
      default: () => undefined
    },
    // 手动触发刷新,可使用随机数 触发
    refresh: {
      default: 0
    },
    // 可混入列表的列表
    dictOptions:{
      type: Array,
      default: () => [],
    },
    // 禁用列表
    disableOptions:{
      default: () => []
    },
    // 空列表展示提示语
    notFoundContent:{
      type: String,
      default: '没有查询到数据'
    },
    // 提示语
    placeholder: {
      type:String,
      default: '请选择'
    },
    // 禁用
    disabled:{
      default: false
    },
    // 模式 'default' | 'multiple' | 'tags' | 'combobox'
    mode: {
      type: String,
      default: ''
    },
    // 是否选中一个文字可以取消其它选中项,如选中 '' 将其余置空
    isFilterAll: {
      default: false
    },
    // 设置可以清空其它选项的值
    filterAllValue: {
      type: [String, Number],
      default: ''
    },
    // 展示的行数
    maxTagCount: {
      type: Number,
    },
    // 字典编码
    menuCode: {
      type: String,
      default: ''
    }
  },
  model: {
    event: 'modelEvent',
    prop: 'value'
  },
  watch: {
    menuCode: {
      deep: true,
      immediate: true,
      handler: function () {
        this.$nextTick(()=>{
          this.getOptions()
        })
      }
    },
    refresh:{
      immediate: true,
      handler: function () {
        this.$nextTick(()=>{
          this.getOptions()
        })
      }
    }
  },
  data: () => ({
    options: [],
  }),
  computed: {
    valueCmp: {
      get () {
        return this.value
      },
      set (val) {
        this.$emit('modelEvent',val)
      }
    }
  },
  methods: {
    handleChange (value) {
      if (Array.isArray(value)) {
        // const val = this.handleSelectAllTabExportAllOrSetAll(value)
        // this.valueCmp = val
        const obj = value.map( node =>  this.options.find(item=>item.value === node))
        this.$nextTick(()=>{
          this.$emit('change', value, obj)
        })
      } else {
        const obj = this.options.find(item=>item.value === value)
        this.$emit('change',value,obj)
      }
    },
    handleSelect (v) {
      console.log('1')
      // 仅多选可开启
      if (this.isFilterAll && this.mode === 'multiple') {
        this.handleSelectAllTabExportAllOrSetAll(v)
      }
    },
    handleSelectAllTabExportAllOrSetAll (v) {
      this.$nextTick(()=>{
      let list = this.valueCmp || []
      if (v === this.filterAllValue) {
        list = [v]
      } else {
        list = list.filter(item=>item !== this.filterAllValue)
      }
      this.valueCmp = list
      })
    },
    async getOptions(){

      this.options = utils.deepClone(this.dictOptions || [])
      if (!this.menuCode) {
        return
      }
      this.options = await this.getPlatformDict(this.menuCode)
      if(this.dictOptions.length > 0) {
        this.options.unshift(...utils.deepClone(this.dictOptions))
      }
    },
    // 获取平台字典
    async getPlatformDict(code) {
      try {
        const {data: res} = await this.$api.assets.platformDict({code})
        if (res.code === "0") {
            if (Array.isArray(res.data)) {
              return res.data.map((item) => ({
                value: item["value"],
                label: item["name"],
                disabled: this.disableOptions.includes(item["value"])
              }));
            }
          }
        return []
      }catch (e) {
        return []
      }
    },
  },
  mounted () {
    this.getOptions()
  }
}
</script>

<style scoped>

</style>