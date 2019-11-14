<!--资产视图业务-资产视图详情页面-编辑基本信息组件-->
<template>
  <a-form :form="form">
    <a-form-item
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      label="资产名称"
    >
      <a-input
        v-decorator="[
          'assetName',
          { rules: [{ required: true, message: '请填写资产名称' }] },
        ]"
        placeholder="请填写资产名称"
      />
    </a-form-item>
    <a-form-item
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      label="Nickname"
    >
      <a-select
        v-decorator="[
          'nickname',
          { rules: [{ required: true, message: 'Please input your nickname' }] },
        ]"
        mode="multiple" placeholder="请选择项目状态" style="width: 100%;" :options="statusOptions"
      />
    </a-form-item>
  </a-form>
</template>

<script>
  export default {
    name: 'EditAssetDetail',
    data () {
      return {
        formItemLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 19 }
        },
        form: this.$form.createForm(this),
      }
    },

    methods: {
      // 提交数据
      handleSubmit (resolve, reject) {
        this.form.validateFieldsAndScroll(err => {
          if (!err) {
            console.info('success');
          }
        });
      }
    }
  }
</script>

<style lang='less' scoped>

</style>
