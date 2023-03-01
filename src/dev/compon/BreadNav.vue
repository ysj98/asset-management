<template>
  <div class="m-devBreadNav">
    <div class="toggleMenu">
      <SG-Button @click="handleToggleMenu" size="small">{{ openMenuStatus ? '收起菜单' : '展开菜单' }}</SG-Button>
    </div>
    <ul class="nav">
      <li v-for="(item, index) in BreadNav" :key="index">
        {{ item }}
        <a-icon type="right" />
      </li>
    </ul>
    <div class="right">
      <SG-Button size="small" @click="handleLogout">登出</SG-Button>
    </div>
  </div>
</template>

<script>
export default {
  computed: {
    BreadNav() {
      return this.$store.state.dev.BreadNav;
    },
    openMenuStatus() {
      return this.$store.state.dev.openMenuStatus;
    },
  },
  methods: {
    handleLogout() {
      this.$SG_Message.confirmDelete({
        content: '是否退出系统',
        confirmText: '退出',
        onConfirm: () => {
          this.$store.dispatch('auth/logout');
        },
      });
    },
    handleToggleMenu() {
      this.$store.commit('dev/updateMenuStatus', !this.openMenuStatus);
    },
  },
};
</script>
