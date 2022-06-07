<template>
  <a-select
    mode="multiple"
    style="width: 100%"
    placeholder="请选择保险类型"
    v-model="types"
    @select="handleChange"
    :options="options"
    :maxTagCount="1"
  >
  </a-select>
</template>

<script>
export default {
  data () {
    return {
      types: ['0'],
      options: [
        {
          value: '0',
          label: '全部保险类型'
        },
        {
          value: '1',
          label: '保险类型1'
        },
        {
          value: '2',
          label: '保险类型3'
        },
        {
          value: '3',
          label: '保险类型2'
        },
      ]
    }
  },
  methods: {
    handleChange (value) {
      if(value === '0'){
        this.types = ['0']
      }else{
        if(this.types.includes('0') && this.types.length !== this.options.length - 1){
          let idx = this.types.indexOf('0')
          this.types = this.types.splice(idx+1, 1)
        }
        if(this.types.length === this.options.length - 1 && !this.types.includes('0')){
          this.types = ['0']
        }
      }
      this.$emit('typeClick', value)
    }
  }
}
</script>

<style>

</style>