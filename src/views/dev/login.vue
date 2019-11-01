<template>
  <div>
    <a-card title="登录系统" class="m-devLogin">
      <a-form :form="formData" @submit="handleLogin">
        <a-form-item label="用户名" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input v-decorator="formDataRules.username" placeholder="请输入用户名" />
        </a-form-item>
        <a-form-item label="密码" :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol">
          <a-input type="password" v-decorator="formDataRules.password" placeholder="请输入密码" />
        </a-form-item>
        <a-form-item :label-col="formTailLayout.labelCol" :wrapper-col="formTailLayout.wrapperCol">
          <SG-Button type="primary" html-type="submit" :disabled="hasErrors(formData.getFieldsError())">登录</SG-Button>
        </a-form-item>
      </a-form>
    </a-card>
  </div>
</template>

<script>
import { throttle } from '@/utils/utils'
import rules from '@/config/config.rules'
const formItemLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16 },
}
const formTailLayout = {
  labelCol: { span: 4 },
  wrapperCol: { span: 16, offset: 4 },
}
export default {
  data () {
    return {
      formItemLayout,
      formTailLayout,
      formData: this.$form.createForm(this),
      formDataRules: {
        username: ['username', { rules: rules.username }],
        password: ['password', { rules: rules.password }]
      }
    }
  },
  methods: {
    // 表单是否包含错误
    hasErrors (fieldsError) {
      return Object.keys(fieldsError).some(field => fieldsError[field]);
    },
    // 登录请求
    handleLogin: throttle(function (e) {
      e.preventDefault()
      this.formData.validateFields((errors, values) => {
        console.log(errors, values)
        if (!errors) {
          this.$store.dispatch('auth/login', values)
        }
      })
    }, 1000)
  }
}
</script>
