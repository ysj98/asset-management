<template>
  <div>
    <SG-Modal v-if="useModal" v-bind="$attrs" v-on="$listeners">
      <slot></slot>
    </SG-Modal>
    <slot v-else></slot>
  </div>
</template>

<script>
export default {
  name: 'SuperModal',
  props: {
    useModal: {
      type: Boolean,
      default: true,
    },
  },
  mounted() {
    console.log(this);
  },
};
</script>

<style></style>
