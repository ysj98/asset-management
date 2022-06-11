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
  // props: {
  //   options: {
  //     type: Array,
  //     default: []
  //   }
  // },
  data () {
    return {
      companys: [],
      options: []
    }
  },
  created () {
    
  },
  methods: {
    getDictData (organId) {
      let _this = this
      // const list = [
      //     { code: 'ASSET_INSURANCE', tip: '保险公司', optionName: 'companyList', model: 'insuranceCompanyId' },
      //     { code: 'INSURANCE_TYPE', tip: '保险类型', optionName: 'typeList', model: 'insuranceType' }
      //   ]
      this.$api.basics.organDict({code: 'ASSET_INSURANCE', organId: organId}).then(r => {
        let res = r.data
        if (res && String(res.code) === '0') {
          if(res.data.length > 0) {
            _this.options = []
            res.data.forEach(item => {
              _this.options.push({label: item.name, value: item.value})
            })
            _this.options.unshift( {
              value: '0',
              label: '全部保险公司'
            })
            this.companys = ['0']
          }
        }
      }).catch(err => {
        console.log(err)
        this.$message.error(err || `查询${tip}失败`)
      })
    },
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
      this.$emit('companyClick', this.companys)
    }
  }
}
</script>

<style>

</style>