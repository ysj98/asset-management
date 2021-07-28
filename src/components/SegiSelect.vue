<template>
  <div>
    <a-select style="width: 300px;" v-bind="$attrs" :value.sync="value">
      <slot v-if="options.length > 0">
        <a-select-option
          v-for="item in options"
          :key="item.value"
          :value="item.value"
          :title="item.label"
        >
          {{ item.label }}
        </a-select-option>
      </slot>
    </a-select>
  </div>
</template>

<script>
export default {
  name: "SegiSelect",
  props: {
    value: {
      type: [String, Number],
      default: ""
    },
    options: {
      type: [Array, Object],
      default: () => []
    }
  },
  methods: {
    handleSelectValue(one, two) {
      debugger;
      console.log(one, two);
      this.$emit("input");
    }
  }
};
</script>

<style scoped></style>
