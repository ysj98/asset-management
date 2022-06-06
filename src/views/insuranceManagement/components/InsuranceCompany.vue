<template>
  <a-select
    mode="multiple"
    style="width: 100%"
    placeholder="请选择保险公司"
    :default-value="['全部保险公司']"
    @change="handleChange"
    :options="options"
  >
  </a-select>
</template>

<script>
export default {
  data () {
    return {
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
    handleChange () {
      
    }
  }
}
</script>

<style>

</style>