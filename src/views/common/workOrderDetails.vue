<template>
  <a-modal
    class="workOrderDetails"
    :footer="null"
    title="工单详情"
    v-model="show"
    :width="1400"
    @cancel="handleCancel"
  >
  <div>
    <iframe style="width:1280px; height:600px;max-height:1280px;min-height:600px;" :src="detailUrl" frameborder="0"></iframe>
  </div>
  </a-modal>
</template>

<script>
import { Modal } from 'ant-design-vue'
// import host from '../../config.js'
import host from '@/config/config.base.js'
export default {
  components: {
    AModal: Modal
  },
  props: {
    workShow: {
      type: Boolean,
      default: false
    },
    organId: {
      type: [String, Number],
      default: ''
    },
    serviceOrderId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      show: false,
      // detailUrl: 'http://192.168.1.11:10080/order-web/#/home/HisOrderDetail?organId=67&serviceOrderId=2251799925695251'
      detailUrl: `${host.hostPrime}/order-web/#/home/orderDetail?organId=${this.organId}&serviceOrderId=${this.serviceOrderId}`
    }
  },
  computed: {
  },
  methods: {
    handleCancel () {
      this.$emit('close')
    }
  },
  created () {
  },
  watch: {
    workShow (val) {
      this.show = val
    }
  },
  mounted () {
    this.show = this.workShow
  }
}
</script>
<style lang="less" scoped>
</style>
