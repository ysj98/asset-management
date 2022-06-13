<template>
  <a-select
    mode="multiple"
    style="width: 100%"
    placeholder="请选择保险类型"
    v-model="types"
    @change="handleChange"
    :options="options"
    :maxTagCount="1"
  >
  </a-select>
</template>

<script>
export default {
  data () {
    return {
      types: [],
      options: [],
      // options: [
      //   {
      //     value: '0',
      //     label: '全部保险类型'
      //   },
      // ]
    }
  },
  methods: {
    getDictData (organId) {

      this.$api.basics.organDict({code: 'INSURANCE_TYPE', organId: organId}).then(r => {
        let res = r.data
        if (res && String(res.code) === '0') {
          if(res.data.length > 0) {
            this.options = []
            res.data.forEach(item => {
              this.options.push({label: item.name, value: item.value})
            })
            this.options.unshift( {
              value: '0',
              label: '全部保险类型'
            })
            this.types = ['0']
          }
        }
      }).catch(err => {
        console.log(err)
        this.$message.error(err || `查询${tip}失败`)
      })
    },
    handleChange (value) {
      debugger
      if(value === '0'){
        this.types = ['0']
      }else{
        if(this.types.includes('0')){
          let idx = this.types.indexOf('0')
          this.types = this.types.splice(idx+1, 1)
        }
        if(this.types.length === this.options.length - 1 && !this.types.includes('0')){
          this.types = ['0']
        }
      }
      this.$emit('typeClick', this.types)
    }
  }
}
</script>

<style>

</style>