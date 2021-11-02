<template>
  <div>
    <a-table :columns="tableHeader" :data-source="data" bordered :pagination="false">
      <template slot="customCode" slot-scope="text, record,index">
        <div style="display: flex;">
          <a-input v-model="record.customCode"  style="display: inline-block" @blur="handleBlur(record)"/>
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
import {queryTopOrganByOrganID} from "../../buildingDict/publicFn";

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
      // this.refresh()
      this.postSave(record)
    },
    async handleBlur (record) {
      if(!record.customCode) {
        this.$SG_Message.error('自定义规则不能为空')
        return
      }
      // 调用预览
      const preview  = await this.getPreview(this.beforeGetPreview(record,record.seq))
      record.preview = preview
    },
    async handleReset (record) {
      console.log(record)
      this.$SG_Modal.confirm({
        title: `确定要回复自定义编码规则吗?`,
        okText: "确定",
        cancelText: "关闭",
        onOk: async () => {
          const data = await this.postDefault(record)
          if(data) {
            record.preview = data.preview
            record.customCode = data.customCode
          }
        }})
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
        value: `{${data.name}:${data.value}}`
      })
    },
    async handleRequest (data) {
      console.log(data)
      const code = this.beforeRequest (data)
      const center = (this.data[this.selectIndex].customCode || '').split('-').filter(item=>item)
      center.push(code.value)
      const codeStr = center.join('-')
      console.log(codeStr)
      this.data[this.selectIndex].customCode = codeStr
      // 调用预览
      const preview  = await this.getPreview(this.beforeGetPreview(this.data[this.selectIndex],data.seq))
      this.data[this.selectIndex].preview = preview
    },
    beforeGetPreview (data,seq = 1000) {
      // 增加seq
      data.seq = seq || 1000
      return {
        organId: data.organId,
        codeString: data.customCode,
        seq: seq || 1000,
        codeTypeId: data.codeTypeId
      }
    },
    // 获取编码规则
    async getPreview(data) {
      const {data: res} = await this.$api.codeRule.getPreview(data)
      if(res.code === '0') {
        return res.data || ""
      }
      this.$SG_Message.error(res.message)
      return ''
    },
    // 恢复默认值
    async postDefault (data) {
      let loadingName = this.SG_Loding("恢复中...");
      try {
        const params = {
          organId: data.organId,
          codeTypeId: data.codeTypeId
        }
        const {data: res } = await this.$api.codeRule.defaultReq(params)
        if (String(res.code) === '0') {
          this.$SG_Message.success("操作成功");
          return {
            preview: res.data.preview || '',
            customCode: res.data.customCode || ''
          }
        }
        this.$SG_Message.error(res.message);
        this.$message.error(res.message)
      } catch {
        this.$SG_Message.error('系统异常')
        return false
      } finally {
        this.DE_Loding(loadingName)
      }
      return false
    },
    // 保存
    async postSave (data) {
      if(!data.customCode) {
        this.$SG_Message.error('自定义编码规则不能为空')
        return
      }
      let loadingName = this.SG_Loding("保存中...");
      try {
        let {organId:organTopId} = await queryTopOrganByOrganID(
            {
              nOrgId: data.organId,
              nOrganId: data.organId,
            }
        )

        const params = {
          organId: data.organId,
          codeTypeId: data.codeTypeId,
          customCode: data.customCode,
          groupId: organTopId,
          seq: data.seq || 1000
        }
        const {data: res } = await this.$api.codeRule.save(params)
        if (String(res.code) === '0') {
          this.$SG_Message.success("保存成功");
          return
        }
        this.$SG_Message.error(res.message)
      } catch {
        this.$SG_Message.success("系统异常");
        return false
      } finally {
        this.DE_Loding(loadingName)
      }
    }
  }
}
</script>