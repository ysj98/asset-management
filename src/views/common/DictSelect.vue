<template>
  <a-select
    :mode="mode"
    v-model="valueCmp"
    :placeholder="placeholder"
    :notFoundContent="notFoundContent"
    optionFilterProp="children"
    :options="$addTitle(options)"
    @change="handleChange" />
</template>
<script>
import { utils } from "@/utils/utils";

export default {
  name: "DictSelect",
  props:{
    value:{
      type: [String,Number,Array],
      default: ()=>undefined
    },
    dictOptions:{
      type: Array,
      default: () => [],
    },
    notFoundContent:{
      type: String,
      default: '没有查询到数据'
    },
    placeholder: {
      type:String,
      default: '请选择'
    },
    mode: {
      type: String,
      default: ''
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
      const obj = this.options.find(item=>item.value === value)
      this.$emit('change',value,obj)
    },
    async getOptions(){
      if (!this.menuCode) {
        this.options = utils.deepClone(this.dictOptions)
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