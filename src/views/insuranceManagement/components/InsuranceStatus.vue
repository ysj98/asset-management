<template>
  <a-select
    mode="multiple"
    style="width: 100%"
    placeholder="请选择状态"
    v-model="status"
    @select="handleChange"
    :options="optionStatus"
    :maxTagCount="1"
  >
  </a-select>
</template>

<script>
export default {
  data () {
    return {
      status: ['-1'],
      optionStatus: [
        {
          value: '-1',
          label: '全部状态'
        },
        {
          value: '待承保',
          label: '待承保'
        },
        {
          value: '已生效',
          label: '已生效'
        },
        {
          value: '已终止',
          label: '已终止'
        },
      ],
    }
  },
  methods: {
    handleChange (value) {
      if(value === '-1'){
        this.status = ['-1']
      }else{
        if(this.status.includes('-1')){
          let idx = this.status.indexOf('-1')
          this.status = this.status.splice(idx+1, 1)
        }
        if(this.status.length === this.optionStatus.length - 1 && !this.status.includes('-1')){
          this.status = ['-1']
        }
      }
      this.$emit('statusClick', this.status)
    }
  }
}
</script>

<style>

</style>