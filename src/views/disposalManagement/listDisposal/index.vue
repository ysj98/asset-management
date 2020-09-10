<template>
  <div class="custom-tabs">
    <a-tabs v-model="key" type="card" :tabBarGutter="10">
      <a-tab-pane tab="组织机构视图" key="1">
        <organ-index />
      </a-tab-pane>
      <a-tab-pane tab="资产视图" key="2">
        <assets-index />
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import assetsIndex from './assetsIndex'
import organIndex from './organIndex'
export default {
  name: 'listDisposal',
  components: {
    assetsIndex,
    organIndex
  },
  data () {
    return {
      key: '1'
    }
  }
}
</script>

<style lang='less' scoped>
  .custom-tabs {
    /deep/ .custom_date {
      .prefix_style {
        float: left;
        color: #C0C7D1;
        line-height: 30px;
        text-align: center;
        border: 1px solid #d9d9d9;
        border-right: none;
        border-top-left-radius: 4px;
        border-bottom-left-radius: 4px;
      }
      .date_picker_style {
        display: block;
        margin-left: 69px;
        & /deep/ .ant-calendar-picker-input {
          border-top-left-radius: 0 !important;
          border-bottom-left-radius: 0 !important;
        }
      }
    }
    /deep/ .action_text {
      color: #0084FF;
      cursor: pointer;
      margin-right: 12px;
      white-space: nowrap;
    }
  }
</style>
