<!--呈报任务-我填报的任务--新建任务页面-->
<template>
  <div class="new_task">
    <!--任务信息部分-->
    <SG-Title title="任务信息"/>
    <a-form :form="form">
      <a-row>
        <a-col :span="8">
          <a-form-item label="任务名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              placeholder="请输入任务名称"
              v-decorator="['projectName', { rules: [{required: true, message: '请输入任务名称'}, {max: 30, message: '最多30个字符'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="所属机构" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              style="width: 100%;"
              placeholder="请选择所属机构"
              :options="[]"
              v-decorator="['organId', {rules: [{required: true, message: '请选择所属机构'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="资产项目" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              style="width: 100%;"
              placeholder="请选择资产项目"
              :options="[]"
              v-decorator="['projectId', {rules: [{required: true, message: '请选择资产项目'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="8">
          <a-form-item label="表单名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              style="width: 100%;"
              placeholder="请选择表单"
              :options="[]"
              v-decorator="['billId', {rules: [{required: true, message: '请选择表单'}]}]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="填报人" :label-col="labelCol" :wrapper-col="wrapperCol">
            <span style="margin-left: 12px">隔壁老王</span>
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="审核人" :label-col="labelCol" :wrapper-col="wrapperCol" required>
            <span style="margin-left: 12px">隔壁老王 +++</span>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="备注" :label-col="{span: 2}" :wrapper-col="{span: 22}">
            <a-textarea
              :rows="4"
              style="resize: none"
              placeholder="请输入备注"
              v-decorator="['remark', {rules: [{max: 200, message: '最多200个字符'}]}]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="附件" :label-col="{span: 2}" :wrapper-col="{span: 14}">
            <SG-UploadFile type="all" v-model="attachment"/>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!--填报数据部分-->
    <task-table-edit/>
  </div>
</template>

<script>
  import TaskTableEdit from '../components/TaskTableEdit'
  export default {
    name: 'NewTask',
    components: {TaskTableEdit},
    data () {
      return {
        labelCol: {span: 6},
        wrapperCol: {span: 18},
        form: this.$form.createForm(this), // 注册form
        attachment: [], // 附件数据
      }
    },

    methods: {}
  }
</script>

<style lang='less' scoped>
  .new_task {
    padding: 0 40px;
  }
</style>
