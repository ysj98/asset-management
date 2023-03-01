<template>
  <div class="m-devMenu" :class="{ close: !openMenuStatus }">
    <a-menu mode="inline" :defaultOpenKeys="[0]">
      <a-sub-menu v-for="(item, index) in menuList" :key="index">
        <span slot="title"
          ><span>{{ item.title }}</span></span
        >
        <a-menu-item v-for="(sub, subIndex) in item.children" :key="`${index}-${subIndex}`" @click="handleToggleMenu(item.title, sub.title)">
          <router-link :to="sub.path">{{ sub.title }}</router-link>
        </a-menu-item>
      </a-sub-menu>
    </a-menu>
    <div class="devOpts">
      <div class="cell" @click="handleOpenOpts">开发环境设置<a-icon type="setting" theme="filled" /></div>
    </div>
    <a-drawer title="开发环境设置" placement="left" @close="handleClose" :visible="optStatus" wrapClassName="dev" width="300">
      <devOpts />
    </a-drawer>
  </div>
</template>

<script>
import menuList from '@/config/config.devMenu.js';
import devOpts from './devOpts.vue';
export default {
  components: {
    devOpts,
  },
  data() {
    return {
      // 菜单列表
      menuList,
      // 设置窗口状态
      optStatus: false,
    };
  },
  computed: {
    openMenuStatus() {
      return this.$store.state.dev.openMenuStatus;
    },
  },
  watch: {
    // 兼容菜单打开状态以切换 body 的 class
    openMenuStatus() {
      const body = document.body;
      body.classList.toggle('closeMenu');
    },
  },
  methods: {
    // 切换菜单
    handleToggleMenu(...args) {
      this.$store.commit('dev/update', args);
    },
    // 打开设置窗口
    handleOpenOpts() {
      this.optStatus = true;
    },
    // 关闭设置窗口
    handleClose() {
      this.optStatus = false;
    },
  },
};
</script>
