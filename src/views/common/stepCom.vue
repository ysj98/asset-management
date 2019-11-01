<!--
再次封一下steps组件
props:
  stateArr 用来渲染名字和描述的数组对象
  currentState： 当前进行的步数， 下表从 0 开始
-->
<template>
  <a-steps :current="currentState">
    <a-step v-for="(item, index) in stateArr" :key="index">
      <template>
        <a-icon type="arrow-right" slot="icon" :style="{color: '#fff', fontSize: '16px'}"/>
        <template slot="title">
          {{item.name}}
        </template>
        <span slot="description">{{item.description}}</span>
      </template>
    </a-step>
  </a-steps>
</template>
<script>
import { Steps, Icon } from 'ant-design-vue'
export default {
  components: {
    ASteps: Steps,
    AStep: Steps.Step,
    AIcon: Icon
  },
  props: {
    stateArr: {
      type: Array,
      default () {
        return []
      }
    },
    currentState: {
      type: Number,
      default: 0
    }
  },
  watch: {
    currentState (newVal) {
    }
  }
}
</script>
