<template>
  <SG-Modal v-model="visible" title="编辑标签编码" @ok="submit" @cancel="cancel">
    <a-form-model :label-col="{ span: 4 }" :wrapper-col="{ span: 14 }">
      <a-form-model-item label="标签编码原值：">
        {{ assetsData.labelCode }}
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
    assetsData: {
      type: '',
      default: '',
    },
  },
  data() {
    return {
      visible: false,
      newLabel: '',
    };
  },
  methods: {
    submit() {
      let form = {
        assetId: this.assetsData.assetId,
        labelCode: this.newLabel,
      };
      this.$api.barCode.editLabel(form).then((res) => {
        if (!this.newLabel) {
          this.$SG_Message.error('请填写标签编码新值');
        } else {
          if (res.data.code === '0') {
            this.visible = false;
            this.newLabel = '';
            this.cancel();
          } else {
            this.$SG_Message.error('标签编码不能重复');
          }
        }
      });
    },
    cancel() {
      this.newLabel = '';
      this.$emit('cancel');
    },
  },
};
</script>

<style></style>
