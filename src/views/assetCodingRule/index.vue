<template>
  <div>
    <a-row style="border-bottom: 1px solid #cccccc66;background: #fff">
      <a-col :span="4" style="padding: 12px 10px 0;">
        <treeSelect :typeFilter="typeFilter"  v-model="formInfo.organId"  placeholder='请选择组织机构' @changeTree="handleTreeChange" :allowClear="false" style="width:100%;"></treeSelect>
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
        <code-rule-table :organ-id="formInfo.organId" :type="1" style="margin-left: 20px" :data="tableData | filterData(1)"/>
      </a-row>
      <a-row :offset="1" style="padding:20px;">
        <SG-Title noMargin title="资产卡片编码规则" />
        <code-rule-table :organ-id="formInfo.organId" :type="2" style="margin-left: 20px" :data="tableData | filterData(2)"/>
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
  }),
  methods: {
    handleTreeChange (val) {
      if(this.formInfo.organId != 0 ) {
        this.$SG_Modal.confirm({
          content: `即将切换组织机构，请确认自定义编码已保存?`,
          okText: "确定",
          cancelText: "关闭",
          onOk: async () => {
            console.log('treeChange', val,this.formInfo.organId )
            this.formInfo.organId = val
            this.getPage()
          }
        })
      } else {
        console.log('treeChange', val,this.formInfo.organId )
        this.formInfo.organId = val
        this.getPage()
      }
    },
    async getPage () {
      try {
        const params = { ...this.formInfo }
        const {data: res} = await this.$api.codeRule.init(params)
        if(res.code === '0') {
          this.tableData = res.data
        } else {
          this.$message.error(res.message)
        }
      } catch {
        this.$message.error('系统异常')
      }
    }
  },
  filters: {
    filterData (data, val) {
      switch (Number(val)) {
        case 1: // 表示资产编码规则
        return data.filter(item=>Number(item.codeTypeId)< 2000)
        case 2: // 表示卡片编码规则
        return data.filter(item=>Number(item.codeTypeId) >= 2000)
      }
    }
  }
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