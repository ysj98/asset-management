<!--搜索折叠组件-->
<template>
  <div class="search-box">
    <!-- header -->
    <div class='search-header'>
      <div class='search-header-left'>
        <slot name="headerBtns"></slot>
      </div>
      <div class='search-header-right'>
        <slot name="headerForm"></slot>
      </div>
      <div class="search-icon-box" v-if="type==='fold'">
        <slot name="toggleIcon">
          <i class="search-icon" :class="[value&&'active']"><a-icon type="double-right" /></i>
        </slot>
      </div>
    </div>
    <!-- content -->
    <div class="search-content">
      <!-- 图标 -->
      <div class="content-icon">
        <slot name="searchIcon">
          <i>

          </i>
        </slot>
      </div>
      <!-- 搜索内容 -->
      <div>
        <slot name="contentForm"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    type: {
      default: 'fold'
    },
    value: {
      default: true
    },
    headerStyle: {
      default: () =>({})
    },
    contentStyle: {
      default: () => ({})
    }
  },
  data () {
    return {
    }
  },
  methods: {
    toggleFold () {
      this.$emit('input', !this.value)
    }
  },
  
}
</script>
<style lang="less" scoped>
  .search-box{
    .search-header{
      padding: 20px 20px 20px 30px;
      display: flex;
      justify-content: space-between;
      border-bottom: 1px solid rgba(239,244,249,1);
      .search-header-left{
        flex: 1;
      }
      .search-header-right{
        flex: 1;
      }
      .search-icon-box{
        flex: 0 0 36px;
        height: 32px;
        border: 1px solid rgba(192, 199, 209, 1);
        box-sizing: border-box;
        font-size: 12px;
        border-radius: 4px;
        position: relative;
        cursor: pointer;
        .search-icon{
          transition: transform .2s ease;
          .active{
            transform: translate(-50%, -50%) rotate(-90deg);
          }
        }
      }
    }
  }
</style>