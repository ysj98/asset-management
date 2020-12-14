<!--
  用于底部通栏的固定按钮
  提供save, cancel事件供父组件调用
  rightButtonName: 自定义名称  默认为：取消
-->
<template>
  <div class="form-footer" :class="{'absolute': location === 'absolute', 'fixed': location === 'fixed'}">
    <slot>
      <a-button v-if="showSave" type="primary" :style="buttonStyle" @click="$emit('save')">{{leftButtonName}}</a-button>
      <a-button v-if="showDarft" type="primary" :style="buttonStyle" @click="$emit('darft')">{{midButtonName}}</a-button>
      <a-button v-if="showCancel" :type="rightButtonType" :style="buttonStyle" @click="$emit('cancel')">{{rightButtonName}}</a-button>
    </slot>
  </div>
</template>

<script>
import {Button} from 'ant-design-vue'
export default {
  name: 'FormFooter', // componentName
  components: {
    AButton: Button
  },
  props: {
    buttonStyle: {
      type: String,
      default: 'width: 90px;'
    },
    rightButtonName: {
      type: String,
      default: '取消'
    },
    leftButtonName: {
      type: String,
      default: '提交'
    },
    midButtonName: {
      type: String,
      default: '保存草稿'
    },
    showDarft: {
      type: Boolean,
      default: false
    },
    showSave: {
      type: Boolean,
      default: true
    },
    showCancel: {
      type: Boolean,
      default: true
    },
    rightButtonType: {
      type: String,
      default: 'default'
    },
    location: {
      type: String,
      default: 'absolute'
    }
  },
  data () {
    return {
    }
  },
  mounted () {
    console.log(this.location)
  }
}
</script>

<style lang='less' scoped>
  .form-footer{
    width: 100%;
    text-align: center;
    padding: 18px 20px;
    border-top: 1px solid #E6EAEF;
    box-shadow:0px -2px 6px 0px rgba(66,155,255,0.08);
    background-color: #fff;
    button {
      &:not(:first-child) {
        margin-left: 10px;
      }
    }
  }
  .absolute {
    position: absolute;
    bottom: 0;
    right: 0;
    z-index: 999;
  }
  .fixed {
    position: fixed;
    bottom: 0;
    right: 0;
    z-index: 999;
  }
</style>
