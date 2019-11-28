<!--
 * @Date: 2019-11-01 09:42:51
 * @Author: chen han
 * @Description: 
 -->
<!--
生产环境面包屑导航
-->
<template>
  <div class="bread-nav" style="height:40px;min-height:40px;line-height:40px; text-align: left; padding-left:20px;border-bottom:1px solid #ddd;">
    <router-link :tag="getTags(index)" :to='item.path' class='bread-item' :class="[index === proBreadNav.length-1&&'chu']" v-for="(item, index) in proBreadNav" :key="index">{{item.name}}
      <a-icon type="right" :style="{ fontSize: '12px', marginRight: '5px', color: '#C0C7D1', display: index === proBreadNav.length-1 ? 'none' : ''}"/>  
    </router-link>
    <SG-Button class="fr click-button" v-if="show" size="small" @click="handleLogout">登出</SG-Button>
    <SG-Button class="fr click-button" v-if="show" @click="handleToggleMenu" size="small">{{ openMenuStatus ? '收起菜单' : '展开菜单' }}</SG-Button>
  </div>
</template>

<script>
export default {
  name: 'proBreadNav', // componentName
  props: {},
  data () {
    return {
      show: process.env.NODE_ENV === 'development', // 打包后不显示导航等
      openMenuStatus: true
    }
  },
  computed: {
    proBreadNav () {
      return this.$store.state.pro.proBreadNav
    }
  },
  watch: {},
  methods: {
    getTags (index) {
      if (index === 0) {
        return 'span'
      }
      return 'a'
    },
    handleToggleMenu () {
      this.openMenuStatus = !this.openMenuStatus
      this.$store.commit('dev/updateMenuStatus', this.openMenuStatus)
    },
    handleLogout () {
      this.$SG_Message.confirmDelete({
        content: '是否退出系统',
        confirmText: '退出',
        onConfirm: () => {
          this.$store.dispatch('auth/logout')
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.bread-nav {
  color: #6D7585;
  a {
    color: #49505E;
    cursor: pointer;
  }
  .chu{
    font-weight: 500;
  }
}
.click-button{
  margin-top: 7px;
}
</style>
