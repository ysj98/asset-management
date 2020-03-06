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
        <span style="float: left; color: #282D5B">备注:</span>
        <div style="color: #49505E; margin-left: 38px">{{detailData['remark'] || '--'}}</div>
      </div>
      <div v-if="detailData['attachments'] && detailData['attachments'].length">
        <span style="float: left; color: #282D5B">附件:</span>
        <div style="color: #49505E; margin-left: 38px">
          <div v-for="item in detailData['attachments']" :key="item.name" style="color: #49505E">{{ item.name || '--'}}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'TaskInfoView',
    props: ['taskId'],
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
          createBy: '发布人',
          createTime: '发布时间',
          taskTypeName: '任务类型'
        },
        detailData: {
          remark: '发达国家房东说该交了开发读书根节点三联开关记录卡放得开',
          attachments: [
            { name: 'xxxxcooo'}, { name: 'xxxcoooo'}, { name: 'xxcooo'}
          ]
        }, // 字段值
      }
    },

    mounted () {
      this.queryTaskInfo()
    },

    methods: {
      // 查询任务信息详情
      queryTaskInfo () {
        this.$api.reportManage.queryTaskInfo({reportTaskId: this.taskId}).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            return this.detailData = res.data || {}
          }
          throw res.message
        }).catch(err => {
          this.$message.error(err || '查询任务信息出错')
        })
      }
    }
  }
</script>

<style lang='less' scoped>
  .info_view {}
</style>
