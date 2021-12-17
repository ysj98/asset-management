<template>
  <SG-Modal
    v-model="show"
    title="编辑标签编码"
    @ok="submit"
    @cancel="cancel"
  >
    <a-form-model :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
      <a-form-model-item label="标签编码原值：">
        {{assetsData.labelCode}}
      </a-form-model-item>
      <a-form-model-item label="标签编码新值：" :required="true">
        <a-input v-model="newLabel"></a-input>
      </a-form-model-item>
    </a-form-model>
  </SG-Modal>
</template>

<script>
export default {
  props: {
    show: {
      type: Boolean,
      default: false
    },
    assetsData: {
      type: "",
      default: ''
    }
  },
  data () {
    return {
      newLabel: ''
    }
  },
  methods: {
    submit () {
      let form = {
        assetId: this.assetsData.assetId,
        labelCode: this.newLabel
      }
      this.$api.barCode.editLabel(form).then(res => {
        console.log('res', res)
        this.cancel()
      })
    },
    cancel () {
      this.$emit("cancel", false)
    }
  }
}
</script>

<style>

</style>