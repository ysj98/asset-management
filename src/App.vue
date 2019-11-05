<template>
  <div id="app" style="height: 100%;">
    <proBreadNav/>
    <div class="router-view">
      <router-view/>
    </div>
  </div>
</template>
<script>
import proBreadNav from '@/components/proBreadNav'
export default {
  components: {
    proBreadNav
  }
}
</script>
<style src="@/assets/less/base.less" lang="less"></style>
<style src="@/assets/less/common.less" lang="less"></style>
<style src="@/assets/less/replaceAnt.less" lang="less"></style>
