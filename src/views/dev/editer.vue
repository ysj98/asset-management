<template>
  <div>
    <a-card title="编辑器示例">
      <SG-Editer v-model="value" />
    </a-card>
    <br>
    <a-card title="编辑内容展示">
      <div v-html="value"></div>
    </a-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      value: ''
    }
  }
}
</script>