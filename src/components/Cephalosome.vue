<!--
  默认总格树为24
   leftCol: 左边占比 默认:6
   rightCol： 右边占比 默认:18
   rowHeight: 默认height: 67px
-->
<template>
  <div class="wrapper" :style="{ height: rowHeight }">
    <a-row>
      <a-col class="col-l nav" :style="{ height: rowHeight }" :span="leftCol">
        <slot name="col-l"></slot>
      </a-col>
      <a-col class="col-r nav" :style="{ height: rowHeight }" :span="rightCol">
        <div class="commom">
          <slot name="col-r"></slot>
        </div>
      </a-col>
    </a-row>
  </div>
</template>

<script>
import { Row, Col } from 'ant-design-vue';
export default {
  components: {
    ARow: Row,
    ACol: Col,
    // AButton: Button
  },
  props: {
    rowHeight: {
      type: String,
      default: '67px',
    },
    leftCol: {
      type: Number,
      default: 6,
    },
    rightCol: {
      type: Number,
      default: 18,
    },
  },
  data() {
    return {};
  },
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped>
.wrapper {
  // height: 67px;
  margin: 0 30px;
  .col-l {
    padding-left: -8px;
  }
  .col-r {
    .commom {
      position: absolute;
      right: 0;
    }
  }
  .nav {
    display: flex;
    // height: 67px;
    align-items: center;
  }
}
</style>
