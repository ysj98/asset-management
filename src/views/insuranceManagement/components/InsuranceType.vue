<template>
  <a-select
    mode="multiple"
    style="width: 100%"
    placeholder="请选择保险类型"
    :default-value="['全部保险类型']"
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
    handleChange () {

    }
  }
}
</script>

<style>

</style>