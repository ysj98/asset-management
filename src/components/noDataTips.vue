<template>
  <div class="no-data-tips">
    <img src="./../assets/image/no_data_tips_img.png">
    <div class="tips-content">{{noDataTips}}</div>
    <a-button type="primary" class="edit-btn" @click="noDataOperation" v-show="showBtn">{{operationName}}</a-button>
  </div>
</template>

<script>
export default {
  props: {
    noDataTips: {
      type: String,
      default: '暂无数据'
    },
    showBtn: {
      type: Boolean,
      default: false
    },
    operationName: {
      type: String,
      default: ''
    }
  },
  methods: {
    noDataOperation () {
      this.$emit('noDataOperation')
    }
  }
}
</script>

<style lang="less" scoped>
  .no-data-tips {
    padding: 80px 0 100px 0;
    img {
      display: block;
      margin: auto;
    }
    .tips-content {
      margin-top: 30px;
      text-align: center;
      color: #0084FF;
      margin-left: 32px;
    }
    .edit-btn {
      margin: 20px auto;
      display: block;
    }
  }
</style>
