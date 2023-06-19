<!--
 * @Date: 2019-11-05 13:36:19
 * @Author: chen han
 * @Description: 搜索折叠组件
 -->
<template>
  <div class="search-box">
    <!-- header -->
    <div class="search-header" :class="[!value && 'off']" :style="headerStyle">
      <div class="search-header-left">
        <slot name="headerBtns"></slot>
      </div>
      <div class="search-header-right">
        <slot name="headerForm"></slot>
      </div>
      <div class="search-icon-box" v-if="type === 'fold'" @click="toggleFold">
        <slot name="toggleIcon">
          <!-- <a-icon class="search-icon" :class="[value&&'active']" type="double-right" /> -->
          <span class="search-icon" :class="[value && 'active']">
            <SG-Icon color="#666" size="15px" type="icon-doubleleft"></SG-Icon>
          </span>
        </slot>
      </div>
    </div>
    <!-- content -->
    <div class="search-content" :style="contentStyle" :class="[!value && 'off-content']">
      <!-- 图标 -->
      <div class="content-icon" :style="searchIconStyle">
        <slot name="searchIcon">
          <i class="search-icon"></i>
        </slot>
      </div>
      <!-- 搜索内容 -->
      <div class="content-form">
        <slot name="contentForm"></slot>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    // 是否为折叠模式 默认是
    type: {
      default: 'fold',
    },
    // 用于v-model 张开true 折叠false
    value: {
      default: true,
    },
    // 头部样式 可选
    headerStyle: {
      default: () => ({}),
    },
    // 折叠内容样式 可选
    contentStyle: {
      default: () => ({}),
    },
    // 图标传入
    searchIconStyle: {
      default: () => ({}),
    },
  },
  methods: {
    toggleFold() {
      this.$emit('input', !this.value);
    },
  },
};
</script>
<style lang="less" scoped>
.search-box {
  .search-header {
    padding: 20px 20px 20px 30px;
    display: flex;
    justify-content: space-between;
    border-bottom: 1px solid rgba(239, 244, 249, 1);
    &.off {
      border-bottom: none;
    }
    .search-header-right {
      text-align: right;
      flex: 1;
    }
    .search-icon-box {
      flex: 0 0 36px;
      height: 32px;
      border: 1px solid rgba(192, 199, 209, 1);
      box-sizing: border-box;
      font-size: 12px;
      border-radius: 4px;
      position: relative;
      cursor: pointer;
      &:hover {
        color: #299fff;
        border-color: #299fff;
      }
      .search-icon {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%) rotate(90deg);
        transform-origin: center center;
        transition: transform 0.2s ease;
        cursor: pointer;
        &.active {
          transform: translate(-50%, -50%) rotate(-90deg);
        }
      }
    }
  }
  .search-content {
    // min-height: 180px;
    padding: 30px 20px 30px 0px;
    display: flex;
    transition: all 0.2s ease;
    overflow: hidden;
    &.off-content {
      height: 0;
      padding: 0;
      display: none;
    }
    .content-icon {
      // display: block;
      padding: 0 70px 0 76px;
      .search-icon {
        display: inline-block;
        width: 84px;
        height: 60px;
        background-image: url('../../assets/image/icon/search-icon.png');
        background-size: 100% 100%;
      }
    }
    .content-form {
      flex: 1;
      text-align: right;
    }
  }
}
</style>
