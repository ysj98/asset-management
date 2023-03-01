<template>
  <div>
    <div class="color-box">
      <p class="text">{{ valueCmp }}</p>
      <div class="inner" :style="{ 'background-color': valueCmp }"></div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      default: '',
    },
  },
  model: {
    prop: 'value',
    event: 'valueChange',
  },
  data: () => ({}),
  computed: {
    valueCmp: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit('valueChange', val);
      },
    },
  },
};
</script>
<style lang="less" scoped>
.color-box {
  display: flex;
  width: 140px;
  margin: auto;
  justify-content: space-around;
  align-content: center;
  .text {
    width: 50px;
    text-align: left;
    line-height: 30px;
  }
  .inner {
    width: 60px;
    height: 30px;
    background-color: #ababab;
  }
}
</style>
