<!--
 真实项目选择框 communityId
 v-model
 @change
-->
<template>
    <a-select
      :defaultValue="selectValue === '' ? undefined : selectValue"
      :style="{width: width}"
      showSearch
      v-model="selectValue"
      :allowClear="showClear"
      :filterOption="filterOption"
      @change="handleChange"
      :placeholder="hasAll?'全部项目': '所选项目'"
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
import * as api from '@/api/basics'
// import {apiqueryVirCommunityListByUserIdV2} from '@/api/basics.js'
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
    },
    // 是否显示清楚按钮
    showClear: {
      type: Boolean,
      default: false
    },
    // 是否默认选择第一个
    selectFirst: {
      type: Boolean,
      default: false
    },
    // 是否有全部
    hasAll: {
      type: Boolean,
      default: true
    }
  },
  data () {
    return {
      options: [],
      selectValue: undefined,
      userId: this.getSysUserId()
    }
  },
  watch: {
    value (nv) {
      this.selectValue = nv
    }
  },
  mounted () {
    this.query()
  },
  methods: {
    handleChange (item) {
      let o = this.options.filter(val => {
        return item === val.value
      })[0]
      this.$emit('input', item)
      this.$emit('change', o)
    },
    query () {
      let data = {}
      this.userId && (data.userId = this.userId)
      api.queryVirCommunityListByUserIdV2(data).then(res => {
        if (res.data.code === '0') {
          let arr = []
          // 如果可以选择全部项目
          if (this.hasAll) {
            arr.push({name: '全部项目', value: '', parOrganId: '', communityId: ''})
          }
          res.data.data.resultList.forEach(item => {
            let o = {name: item.organName, value: item.communityId, ...item}
            arr.push(o)
          })
          this.options = arr
          if (this.value) {
            this.selectValue = this.value
            this.handleChange(this.value)
            return
          }
          // 是否选择第一项
          if (this.selectFirst) {
            // 设置本地值
            this.selectValue = this.options[0].value
            // 冒上数据
            this.$emit('input', this.options[0].value)
            this.$emit('change', this.options[0])
          }
        }
      })
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    }
  }
}
</script>

