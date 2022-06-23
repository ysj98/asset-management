<template>
  <div>
    <a-radio-group v-model="value" name="radioGroup" @change="onChange">
      <a-radio value="1"> 开启 </a-radio>
      <a-radio value="0"> 关闭 </a-radio>
    </a-radio-group>
  </div>
</template>

<script>
export default {
  name: "SelectSwitch",
  props: {
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
      value: "1",
    };
  },
  watch: {
    paramKey: {
      handler: function (newValue) {
        if (newValue != null) {
          this.value = newValue;
        }
      },
      immediate: true,
    },
  },
  methods: {
    onChange(value) {
      if (value === "1") {
        this.value = "";
      }
    },
    handleValidate() {
      if (!this.value) {
        return `${this.serviceTypeText}--请选择开启/关闭`;
      }
    },
    sendData() {
      const error = this.handleValidate();
      if (error) {
        return error;
      }
      const payload = {
        paramKey: this.value,
      };
      this.$emit("sendData", payload);
    },
  },
};
</script>

<style scoped></style>
