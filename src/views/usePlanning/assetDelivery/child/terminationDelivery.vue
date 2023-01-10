<!--
 * @Author: L
 * @Date: 2020-11-04 11:27:08
 * @LastEditTime: 2020-11-09 18:25:47
 * @Description: 结束交付
-->
<template>
  <SG-Modal
    v-model="status"
    title="结束交付"
    width="600px"
    @ok="submit"
    :noPadding="true"
    @cancel="cancel"
  >
    <div class="p15">
      <a-form :form="form">
        <a-form-item label="结束日期：" v-bind="formItemLayout">
          <a-date-picker v-decorator="['endDate',
            {rules: [{required: true, message: '请选择日期'}], initialValue: subData.endDate}]" />
        </a-form-item>
        <a-form-item label="原因：" v-bind="formItemTextarea">
          <a-textarea
            placeholder="请输入原因"
            :style="widthBox"
            :autoSize="{ minRows: 2, maxRows: 4 }"
            v-decorator="['cause',
            {rules: [{required: false, max: 200, message: '请输入原因(不超过200字符)'}], initialValue: subData.cause}
            ]"
          />
        </a-form-item>
      </a-form>
    </div>
  </SG-Modal>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      formItemTextarea: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 4 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
      },
      widthBox: "width: 80%",
      deliveryId: '',             // 交付id
      subData: {
        cause: '',                // 原因
        endDate: undefined,       // 日期
      },
      form: this.$form.createForm(this),
      status: false,
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  methods: {
    // 重置数据
    replacement (id) {
      let o = {
        cause: '',                // 原因
        endDate: undefined,       // 日期
      }
      console.log('jinlaima ')
      this.form.setFieldsValue(o)
      this.deliveryId = id
    },
    // 提交
    submit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          let obj = {
            deliveryId: this.deliveryId,         // 交付id
            approvalStatus: '',                  // 状态
            cause: values.cause,                 // 原因
            endDate: values.endDate === undefined ? '' : `${values.endDate.format('YYYY-MM-DD')}`,       // 日期
          }
          let loadingName = this.SG_Loding("保存中...");
          this.$api.delivery.updateStatus(obj).then((res) => {
            if (Number(res.data.code) === 0) {
              this.DE_Loding(loadingName).then(() => {
                this.$SG_Message.success("提交成功")
                this.$emit('submitFn')
                this.cancel()
              });
            } else {
              this.DE_Loding(loadingName).then(() => {
                this.$message.error(res.data.message)
              });
            }
          });
        }
      })
    },
    cancel () {
      this.status = false
    }
  }
}
</script>
<style lang="less" scoped>
</style>