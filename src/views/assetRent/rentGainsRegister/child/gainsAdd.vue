<!--出租收益新建-->
<template>
  <SG-Modal
    v-model="show"
    :width="770"
    wrapClassName="gainsAdd"
    :noPadding="true"
    :maskClosable="false"
    :footer="null"
  >
    <template #title>
      <div style="font-size: 16px">出租收益登记</div>
    </template>
    <div style="padding: 15px 56px 0 0">
      <a-form :form="form" style="height: 300px">
        <a-col :span="12">
          <a-form-item
            label="所属组织机构"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            <a-input
              placeholder="请输入收益名称"
              @change="nameChange"
              v-decorator="[
                'incomeName',
                {
                  rules: [
                    { required: true, message: '请输入收益名称' },
                    { max: 30, message: '最多30个字符' },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item
            label="资产项目"
            :label-col="labelCol"
            :wrapper-col="wrapperCol"
          >
            {{ organName }}
          </a-form-item>
        </a-col>
      </a-form>
    </div>
  </SG-Modal>
</template>

<script>
import { calc, debounce } from "@/utils/utils";
export default {
  data() {
    return {
      show: false,
      form: this.$form.createForm(this), // 注册form
      labelCol: { span: 12 },
      wrapperCol: { span: 10 },
      incomeName: "", // 收益名称
    };
  },
  props: ["organName"],
  methods: {
    nameChange(e) {
      this.incomeName = e.target.value;
    },
  },
};
</script>

<style lang="less" scoped>
.gainsAdd {
}
</style>
