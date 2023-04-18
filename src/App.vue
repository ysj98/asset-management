<template>
  <div id="app" style="height: 100%">
    <proBreadNav />
    <div class="router-view">
      <keep-alive>
        <router-view v-if="$route.meta.keepAlive" />
      </keep-alive>
      <router-view v-if="!$route.meta.keepAlive" />
    </div>
  </div>
</template>
<script>
import proBreadNav from '@/components/proBreadNav';
export default {
  components: {
    proBreadNav,
  },
};
</script>
<style src="@/assets/less/base.less" lang="less"></style>
<style src="@/assets/less/common.less" lang="less"></style>
<style src="@/assets/less/replaceAnt.less" lang="less"></style>
<style src="@/assets/less/custom.less" lang="less"></style>
<style>
.ant-table-header {
  min-width: 12px !important;
}
.ant-table-wrapper {
  padding-bottom: 68px !important;
}
/* 去除table data为空时组件的提示，替换成自己的组件提示 */
/* .ant-table-placeholder {
  display: none;
} */
/* .search-header {
  padding: 10px !important;
} */
</style>
