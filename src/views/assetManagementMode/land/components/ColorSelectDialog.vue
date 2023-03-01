<template>
  <div>
    <a-modal :visible="visible" width="450px" @cancel="handleClose" @ok="handleSubmit">
      <div class="color-title" :style="{ 'background-color': color }"></div>
      <div class="modal-box">
        <template v-for="(item, index) of colorList">
          <div
            :key="index"
            class="color-content"
            :style="{ 'background-color': item }"
            :class="{ 'select-color': color === item }"
            @click="() => (color = item)"
          ></div>
        </template>
      </div>
      <div style="padding-bottom: 10px">
        <a-button type="link" style="float: right" @click="() => (color = '')">置空</a-button>
      </div>
    </a-modal>
  </div>
</template>
<script>
export default {
  props: {
    value: {
      default: '',
    },
    visible: {
      default: false,
    },
  },
  watch: {
    visible: {
      handler: function () {
        this.$nextTick(() => {
          this.color = this.value;
        });
      },
    },
  },
  data: () => ({
    color: '',
    colorList: [
      '#CC00CC',
      '#CC0099',
      '#CC0066',
      '#CC0033',
      '#CC0000',
      '#CC3300',
      '#CC6600',
      '#CC9900',
      '#CCCC00',
      '#99CC00',
      '#66CC00',
      '#33CC00',
      '#00CC00',
      '#00CC33',
      '#00CC66',
      '#00CC99',
      '#00CCCC',
      '#0099CC',
      '#0066CC',
      '#0033CC',
      '#0000CC',
      '#3300CC',
      '#6600CC',
      '#9900CC',
    ],
  }),
  methods: {
    handleSubmit() {
      console.log('submit');
      this.$emit('submit', this.color);
    },
    handleClose() {
      console.log('handle close');
      this.$emit('close');
    },
  },
};
</script>
<style lang="less" scoped>
.color-title {
  width: 50px;
  height: 10px;
}
.modal-box {
  width: 400px;
  margin-top: 20px;
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  align-content: flex-start;
  .color-content {
    width: 50px;
    height: 46px;
    cursor: pointer;
    border-radius: 4px;
    border: 2px solid #fff;
  }
  .select-color {
    border: 2px solid #1890ff !important;
  }
}
</style>
