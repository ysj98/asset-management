<!--
 查询对象类型
 v-model
 @change
-->
<template>
    <a-select
      :defaultValue="selectValue === '' ? undefined : selectValue"
      :style="{width: width}"
      @change="handleChange"
      v-model="selectValue"
      placeholder="类型"
      >
        <a-select-option
          v-for="(item) in options"
          :key="item.value"
          :value='item.value'>
          {{item.name}}
        </a-select-option>
    </a-select>
</template>
<script>
import {Select} from 'ant-design-vue'
import {getProfessionalTypeSelect} from '@/api/basics.js'
export default {
  name: 'ObjectTypeSelect',
  components: {
    ASelect: Select,
    ASelectOption: Select.Option
  },
  props: {
    width: {
      type: String,
      default: '136px'
    },
    value: {
      type: [Number, String],
      default: ''
    }
  },
  data () {
    return {
      options: [],
      selectValue: ''
    }
  },
  mounted () {
    this.query()
  },
  methods: {
    handleChange (val) {
      let o = this.options.filter((item) => {
        return item.value === val
      })
      this.$emit('change', o[0])
      this.$emit('input', val)
    },
    query () {
      getProfessionalTypeSelect().then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let o = {name: item.C_TEXT, value: item.C_VALUE}
            arr.push(o)
          })
          this.options = arr
          if (this.options.length) {
            this.$emit('change', this.options[0])
            this.$emit('input', this.options[0].value)
            this.selectValue = this.options[0].value
          }
        }
      })
    }
  }
}
</script>

