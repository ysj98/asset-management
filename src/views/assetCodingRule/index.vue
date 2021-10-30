<template>
  <div>
    <a-row style="border-bottom: 1px solid #cccccc66;background: #fff">
      <a-col :span="4" style="padding: 12px 10px 0;">
        <treeSelect :typeFilter="typeFilter"  v-model="formInfo.organId"  placeholder='请选择组织机构' :allowClear="false" style="width:100%;"></treeSelect>
      </a-col>
      <a-col :span="20">
        <div class="top">
          <div class="title-box">
            <a-icon
              type="info-circle"
              style="color: #45a2ff;font-size: 16px"
              theme="filled" />
            <div style="width: 6px;"></div>
            <span class="top-title top-title-right">
            对应机构未开启个性化设置时，将使用机构树中最近节点上级组织的开启个性化设置
          </span>
          </div>
        </div>
      </a-col>
    </a-row>
    <div>
      <a-row :offset="1" style="padding:20px;">
        <SG-Title noMargin title="资产编码规则" />
        <code-rule-table :organ-id="formInfo.organId" style="margin-left: 20px" :data="tableData"/>
      </a-row>
      <a-row :offset="1" style="padding:20px;">
        <SG-Title noMargin title="资产卡片编码规则" />
        <code-rule-table :organ-id="formInfo.organId" style="margin-left: 20px" :data="tableData"/>
      </a-row>
    </div>
  </div>
</template>
<script>
import TreeSelect from "@/views/common/treeSelect";
import { typeFilter } from '@/views/buildingDict/buildingDictConfig';
import CodeRuleTable from "./components/CodeRuleTable";

export default {
  components: {
    CodeRuleTable,
    TreeSelect
  },
  data: () => ({
    typeFilter,
    formInfo: {
      organId: '' // 组织机构Id
    },
    tableData: [],
  })
}
</script>
<style lang="less">
.top {
  .title-box {
    display: flex;
    align-items: center;
    height: 100%;
  }
  width: 100%;
  height: 60px;
}
</style>