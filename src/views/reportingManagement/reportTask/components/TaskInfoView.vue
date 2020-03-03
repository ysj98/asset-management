<!--呈报任务-填报/详情页面-展示任务信息part-->
<template>
  <div class="info_view">
    <SG-Title title="任务信息"/>
    <!--散列信息-->
    <div style="margin-left: 40px">
      <a-row>
        <a-col :span="8" v-for="(name, key) in keysObj" :key="key" style="margin: 15px 0">
          <span style="margin-right: 12px; color: #282D5B">{{name}}:</span>
          <span style="color: #49505E">{{detailData[key] || '--'}}</span>
        </a-col>
      </a-row>
      <div style="margin: 15px 0 30px">
        <span style="margin-right: 12px; color: #282D5B">备注:</span>
        <span style="color: #49505E">{{detailData['remark'] || '--'}}</span>
      </div>
      <div>
        <span style="margin-right: 12px; color: #282D5B">附件:</span>
        <span style="color: #49505E">{{detailData['attachments'] || '--'}}</span>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TaskInfoView',
    data () {
      return {
        keysObj: {
          taskName: '任务名称',
          organName: '所属机构',
          projectName: '资产项目',
          reportBillName: '表单名称',
          beginDate: '计划执行日期',
          reportPlanName: '所属计划',
          reportByName: '填报人',
          auditByName: '审核人',
          taskStatusName: '任务状态',
          xxx: '发布人',
          oo: '发布时间',
          taskTypeName: '任务类型'
        },
        detailData: {
          remark: 'dfadsgfdsas发达国家房东说该交了开发读书根节点三联开关记录卡放得开'
        }, // 字段值
      }
    },

    methods: {}
  }
</script>

<style lang='less' scoped>
  .info_view {}
</style>
