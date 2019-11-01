<template>
  <svg class="icon" aria-hidden="true">
    <use :xlink:href="type"></use>
  </svg>
</template>
<script>
export default {
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {}
  }
}
</script>
<style lang="less" scoped>
.icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>

