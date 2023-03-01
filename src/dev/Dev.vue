<template>
  <div id="Dev" class="p-development">
    <DevMenu />
    <MenuButton />
    <!-- <BreadNav /> -->
  </div>
</template>

<script>
import DevMenu from './compon/DevMenu';
// import BreadNav from './compon/BreadNav'
import MenuButton from './compon/MenuButton';
export default {
  components: {
    DevMenu,
    MenuButton,
    // BreadNav
  },
};
</script>

<style src="@/assets/less/dev.less" lang="less"></style>
