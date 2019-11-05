/**
 * @filename: MenuButton.vue
 * @desc: vue components file
 * @author: utaware
 * @createTime: 2019/06/26 10:27:30 星期三
 */

<template>
  
  <div class="menu-button-components">

    <a-button-group>
      <!-- gitlab地址 -->
      <a-tooltip placement="topLeft" >
        <template slot="title">
          <span>gitlab地址</span>
        </template>
        <a-button type="dashed" @click="openGitlab">
          <a-icon type="gitlab" />
        </a-button>
      </a-tooltip>
      <!-- 蓝湖高保真 -->
      <a-tooltip placement="topLeft" >
        <template slot="title">
          <span>蓝湖高保真</span>
        </template>
        <a-button type="dashed" @click="openLanhu">
          <a-icon type="snippets" />
        </a-button>
      </a-tooltip>
      <!-- docs -->
      <a-tooltip placement="topLeft" >
        <template slot="title">
          <span>ant-vue文档</span>
        </template>
        <a-button type="dashed" @click="openAntDocs">
          <a-icon type="ant-design" />
        </a-button>
      </a-tooltip>
      <a-tooltip placement="topLeft" >
        <template slot="title">
          <span>组件UI地址</span>
        </template>
        <a-button type="dashed" @click="openUi">
          <a-icon type="snippets" />
        </a-button>
      </a-tooltip>
    </a-button-group>

  </div>

</template>

<script>
// components
import { Button, Icon, Tooltip } from 'ant-design-vue'

export default {
  name: 'MenuButton',
  components: {
    AButton: Button,
    AButtonGroup: Button.Group,
    AIcon: Icon,
    ATooltip: Tooltip
  },
  mixins: [],
  watch: {},
  props: {},
  data () {
    return {}
  },
  computed: {},
  methods: {
    // open gitlab project url
    openGitlab () {
      window.open('http://192.168.1.6:9200/web-sys/data-report')
    },
    // open ant vue docs
    openAntDocs () {
      window.open('https://vue.ant.design/docs/vue/introduce-cn/')
    },
    // open lanhu Ui
    openLanhu () {
      window.open('https://lanhuapp.com/web/#/item/project/board?pid=40bdae3a-630a-46bd-a38e-993a6b8ea422&teamId=d22c4265-5e0a-42cc-b87b-c861a865c661')
    },
    openUi () {
      window.open('http://sgui.rxshc.com/segi-ant/index.html#/comlist/sg-button?tdsourcetag=s_pctim_aiomsg')
    }
  },
  filters: {},
  created () {},
  mounted () {}
}
</script>

<style lang="scss" scoped>
.menu-button-components {
  position: fixed;
  left: -138px;
  bottom: 0;
  z-index: 999;
  &:hover {
    left: 0;
  }
}
</style>
