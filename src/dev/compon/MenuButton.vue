/** * @filename: MenuButton.vue * @desc: vue components file * @author: utaware * @createTime: 2019/06/26 10:27:30 星期三 */

<template>
  <div class="menu-button-components">
    <a-button-group>
      <!-- gitlab地址 -->
      <a-tooltip placement="topLeft">
        <template slot="title">
          <span>gitlab地址</span>
        </template>
        <a-button type="dashed" @click="openGitlab">
          <a-icon type="gitlab" />
        </a-button>
      </a-tooltip>
      <!-- docs -->
      <a-tooltip placement="topLeft">
        <template slot="title">
          <span>ant-vue文档</span>
        </template>
        <a-button type="dashed" @click="openAntDocs">
          <a-icon type="ant-design" />
        </a-button>
      </a-tooltip>
      <a-tooltip placement="topLeft">
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
import { Button, Icon, Tooltip } from 'ant-design-vue';

export default {
  name: 'MenuButton',
  components: {
    AButton: Button,
    AButtonGroup: Button.Group,
    AIcon: Icon,
    ATooltip: Tooltip,
  },
  mixins: [],
  watch: {},
  props: {},
  data() {
    return {};
  },
  computed: {},
  methods: {
    // open gitlab project url
    openGitlab() {
      window.open('http://192.168.1.6:9200/web-sys/asset-management');
    },
    // open ant vue docs
    openAntDocs() {
      window.open('https://vue.ant.design/docs/vue/introduce-cn/');
    },
    openUi() {
      window.open('http://sgui.rxshc.com/segi-ant/v1/index.html#/comlist/sg-button');
    },
    Rpd() {
      window.open(
        'https://docs.qq.com/sheet/DQnVUTmFLcG9aS0Fv?tab=bj226v&_t=1604282931509&groupUin=NlD0v%25252FXQQk7tB6rSk%25252BkIpQ%25253D%25253D&ADUIN=916166346&ADSESSION=1604281281&ADTAG=CLIENT.QQ.5627_.0&ADPUBNO=27047'
      );
    },
  },
  filters: {},
  created() {},
  mounted() {},
};
</script>

<style lang="less" scoped>
.menu-button-components {
  position: fixed;
  left: -46px;
  bottom: 0;
  z-index: 999;
  &:hover {
    left: 0;
  }
}
</style>
