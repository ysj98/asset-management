<!--资产视图业务-资产视图详情页面-编辑基本信息组件-->
<template>
  <a-form :form="form">
    <a-form-item
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      label="资产名称"
    >
      <a-input
        v-decorator="[ 'assetName', { rules: [{ required: true, message: '请填写资产名称' }] } ]"
        placeholder="请填写资产名称"
      />
    </a-form-item>
    <a-form-item
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      label="资产编码"
    >
      <a-input
        v-decorator="[ 'assetCode', { rules: [{ required: true, message: '请填写资产编码' }] } ]"
        placeholder="请填写资产名称"
      />
    </a-form-item>
    <a-form-item
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      label="装修情况"
    >
      <a-select
        v-decorator="[ 'decorationSituation' ]"
        placeholder="请选择装修情况"
        :options="decorateOptions"
      />
    </a-form-item>
    <a-form-item
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      label="保管部门"
    >
      <tree-select @changeTree="changeTree" placeholder="请选择保管部门"/>
    </a-form-item>
    <a-form-item
      :label-col="formItemLayout.labelCol"
      :wrapper-col="formItemLayout.wrapperCol"
      label="使用人"
    >
      <a-select
        v-decorator="[ 'ownerUser' ]"
        placeholder="请选择使用人"
        :options="userOptions"
      />
    </a-form-item>
  </a-form>
</template>

<script>
  import TreeSelect from 'src/views/common/treeSelect'
  export default {
    name: 'EditAssetDetail',
    components: { TreeSelect },
    props: ['details'],
    data () {
      return {
        formItemLayout: {
          labelCol: { span: 4 },
          wrapperCol: { span: 19 }
        },
        form: this.$form.createForm(this),
        // organId: '', // 保管部门
        // assetName: '', // 资产名
        // assetCode: '', // 资产编码
        userOptions: [], // 使用人选项
        decorateOptions: [], // 装修情况选项
      }
    },

    methods: {
      // 获取选择的组织机构
      changeTree (organId) {
        this.organId = organId
      },
      
      // 提交数据
      handleSubmit (resolve, reject) {
        this.form.validateFields((err, values) => err ? reject() : resolve(values))
      }
    },

    mounted () {
      // 初始化数据
      this.form.setFieldsValue(this.details)
    }
  }
</script>

<style lang='less' scoped>

</style>
