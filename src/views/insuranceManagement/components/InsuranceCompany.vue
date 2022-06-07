<template>
  <a-select
    mode="multiple"
    style="width: 100%"
    placeholder="请选择保险公司"
    v-model="companys"
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
      companys: ['0'],
      options: [
        {
          value: '0',
          label: '全部保险公司'
        },
        {
          value: '1',
          label: '保险公司1'
        },
        {
          value: '2',
          label: '保险公司3'
        },
        {
          value: '3',
          label: '保险公司2'
        },
      ]
    }
  },
  methods: {
    handleChange (value) {
      if(value === '0'){
        this.companys = ['0']
      }else{
        if(this.companys.includes('0') && this.companys.length !== this.options.length - 1){
          let idx = this.companys.indexOf('0')
          this.companys = this.companys.splice(idx+1, 1)
        }
        if(this.companys.length === this.options.length - 1 && !this.companys.includes('0')){
          this.companys = ['0']
        }
      }
      this.$emit('companyClick', value)
    }
  }
}
</script>

<style>

</style>