<!--
  房屋台账
-->
<template>
  <div class="assetChange">
    <div class="custom-tabs">
      <a-tabs type="card" :tabBarGutter="10">
        <a-tab-pane tab="组织机构视图" key="0">
          <organ-view />
        </a-tab-pane>
        <a-tab-pane tab="资产项目视图" key="1">
          <asset-project-view-list />
        </a-tab-pane>
        <a-tab-pane tab="楼栋视图" key="2">
          <building-view />
        </a-tab-pane>
        <a-tab-pane tab="资产视图" key="3">
          <asset-view />
        </a-tab-pane>
      </a-tabs>
    </div>
  </div>
</template>

<script>
import AssetView from '../house-account/asset-view';
import OrganView from '../house-account/organ-view';
import BuildingView from '../house-account/building-view';
import assetProjectViewList from './assetProjectViewList';
export default {
  components: { assetProjectViewList, AssetView, BuildingView, OrganView },
  props: {},
  data() {
    return {};
  },
  computed: {},
  methods: {},
  created() {},
  mounted() {},
};
</script>
<style lang="less" scoped></style>
