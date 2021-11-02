<template>
  <div>
    <a-table :columns="tableHeader" :data-source="data" bordered :pagination="false">
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
    <rule-modal :visible="ruleVisible" :organ-id="organId" @submit="handleRuleSubmit" @close="handleRuleClose"/>
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
    async handleRequest (data) {
      const code = this.beforeRequest (data)
      const center = (this.data[this.selectIndex].customCode || '').split('-').filter(item=>item)
      center.push(code.value)
      const codeStr = center.join('-')
      console.log(codeStr)
      this.data[this.selectIndex].customCode = codeStr
      // 调用预览
      await this.getPreview(this.beforeGetPreview(this.data[this.selectIndex],data.seq))
    },
    beforeGetPreview (data,seq) {
      return {
        organId: data.organId,
        codeString: data.customCode,
        seq: seq,
        codeTypeId: data.codeTypeId
      }
    },
    async getPreview(data) {
      const {data: res} = await this.$api.codeRule.getPreview(data)
      if(res.code === '0') {
        return res.data || ""
      }
      return ''
    },
  }
}
</script>