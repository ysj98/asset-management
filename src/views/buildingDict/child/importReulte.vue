<!--
 * @Date: 2019-11-07 17:14:17
 * @Author: chen han
 * @Description: 房间资料导入结果页
 -->
<template>
  <a-modal
    @cancel="cancel"
    title="导入结果"
    v-model="visible"
    :width="600"
    :keyboard="false"
    :maskClosable="false"
    :footer="null"
    :bodyStyle="{ 'overflow-y': 'auto',padding: '0 0px'}"
    >
    <div class="export-box">
      <!-- 导入头部 -->
      <!-- <div class="export-right">
      </div> -->
      <div class="export-right">
        <div class="right-tip">
          <div class="tip-item" v-for="(item, index) in textArr" :key="index">{{item}}</div>
          <!-- <div>问题文档: <span>下载</span></div> -->
          <!-- <div>修复后可继续导入!</div> -->
        </div>
        <div class="btn-box">
          <SG-Button class="plr30" @click="hiddeModal"  type="primary" weaken>我知道了</SG-Button>
        </div>
      </div>
    </div>  
  </a-modal>
</template>
<script>
import {Modal, Select, Button} from 'ant-design-vue'
export default {
  components: {
    AModal: Modal,
    ASelect: Select,
    AButton: Button
  },
  props: {
    tipText: {
      type: String,
      default: '成功导入900条数据, 有100行导入失败'
    }
  },
  data () {
    return {
      visible: false
    }
  },
  computed: {
    textArr () {
      return this.tipText.split(/,/) || []
    }
  },
  methods: {
    hiddeModal () {
      this.visible = false
    },
    cancel () {
      this.hiddeModal()
    }
  }
}
</script>
<style lang="less" scoped>
  .export-box{
     padding: 20px 30px;
  }
  .export-right{
    .tip-item{
      padding: 2px 0;
      font-size: 14px;
      letter-spacing: 1px;
    }
    .btn-box{
      margin-top: 20px;
      text-align: center;
    }
  }
</style>
