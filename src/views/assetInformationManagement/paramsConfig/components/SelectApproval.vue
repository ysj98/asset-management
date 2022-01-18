<template>
  <div>
    <a-radio-group
      v-model="approvalMethod"
      name="radioGroup"
      @change="changeApprovalMethod"
    >
      <a-radio value="0"> AB角审批 </a-radio>
      <a-radio value="1"> BPM工作流 </a-radio>
      <a-select
        v-if="approvalMethod === '1'"
        style="width: 200px"
        v-model="approvalItem"
        placeholder="请选择"
        :options="approvalOptions"
        @change="handleChange"
      />
    </a-radio-group>
  </div>
</template>
<script>
export default {
  name: "SelectApproval",
  props: {
    approvalOptions: {
      type: Array,
      default() {
        return [];
      },
    },
    paramKey: {
      type: String,
      default: "",
    },
    subKey: {
      type: String,
      default: "",
    },
    serviceTypeText: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      // 审批方式
      approvalMethod: "0",
      // 工作流 具体流程
      approvalItem: "",
    };
  },
  created() {
    this.approvalMethod = this.paramKey;
    this.approvalItem = this.subKey;
  },
  methods: {
    handleChange() {},
    handleValidate() {
      if (!this.approvalMethod) {
        return `${this.serviceTypeText}--请选择审批方式`;
      } else if (this.approvalMethod === "1" && !this.approvalItem) {
        return `${this.serviceTypeText}--请选择具体审批流程`;
      }
    },
    sendData() {
      const error = this.handleValidate();
      if (error) {
        return error;
      }
      const { approvalMethod, approvalItem } = this;
      const payload = {
        paramKey: approvalMethod,
        // 如果审批方式是 工作流 flowJson就是 1,现在只有 bpm工作流，ab角的话，subKey和flowJson是空/0
        subKey: approvalMethod === "1" ? approvalItem : "",
        flowJson: approvalMethod === "1" ? 1 : 0,
      };
      console.log("payload_son", payload);
      this.$emit("sendData", payload);
    },
    changeApprovalMethod(value) {
      if (value === "1") {
        this.approvalItem = "";
      }
    },
  },
};
</script>

<style scoped></style>
