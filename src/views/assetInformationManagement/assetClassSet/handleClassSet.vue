<!--
  资产分类设置编辑页或详情页
-->
<template>
  <div></div>
</template>

<script>
export default {
  data () {
    return {
      pageType: 'edit'
    }
  },
  methods: {
  },
  mounted () {
    this.pageType = this.$route.query.pageType
  }
}
</script>

<style lang="less" scoped>

</style>