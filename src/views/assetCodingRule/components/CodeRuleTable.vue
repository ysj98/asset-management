<template>
  <div>
    <a-table :columns="tableHeader" :data-source="mock" bordered :pagination="false">
      <template slot="customCode" slot-scope="text, record,index">
        <div style="display: flex;">
          <a-input v-model="record.customCode"  style="display: inline-block"/>
          <a-button type="link" style="display: inline-block" @click="handleInsertValue(record,index)">插入参数</a-button>
        </div>
      </template>
      <template slot="operation" slot-scope="text, record">
        <a-button type="link" @click="handleSave(record)">保存</a-button>
        <a-button type="link" @click="handleReset(record)">恢复默认</a-button>
      </template>
    </a-table>
    <rule-modal :visible="ruleVisible" @submit="handleRuleSubmit" @close="handleRuleClose"/>
  </div>
</template>
<script>
import {tableHeader, mock} from "./componentDict";
import RuleModal from "./RuleModal";

export default {
  components: {RuleModal},
  props:{
    organId: {
      type: String,
      default: ''
    },
    data: {
      type: Array,
      default: () => [...mock]
    }
  },
  data: () => ({
    tableHeader,
    mock,
    selectIndex: -1, // 插入参数的编码规则
    ruleVisible: false
  }),
  methods: {
    handleSave (record) {
      console.log(record)
      this.refresh()
    },
    handleReset (record) {
      this.refresh()
    },
    handleInsertValue(record, index){
      console.log(arguments)
      this.selectIndex = index
      this.ruleVisible = true
    },
    handleRuleSubmit (data) {
      this.handleRequest(data)
      this.ruleVisible = false
    },
    handleRuleClose () {
      this.ruleVisible = false
    },
    /*************************************/
    // 刷新页面
    refresh () {
      this.$emit('refresh')
    },
    /**********************************/
    beforeRequest (data) {
      return ({
        organId: this.organId,
        value: `{${data.name}:${data.value}}`
      })
    },
    handleRequest (data) {
      const code = this.beforeRequest (data)
      const center = this.mock[this.selectIndex].customCode.split('-')
      center.push(code.value)
      const codeStr = center.join('-')
      console.log(codeStr)
      this.mock[this.selectIndex].customCode = codeStr
    }
  }
}
</script>