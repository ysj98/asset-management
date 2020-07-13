 <!--
 * @Author: LW
 * @Date: 2020-07-10 16:13:27
 * @LastEditTime: 2020-07-13 17:49:21
 * @Description: 新增信息
--> 
<template>
  <div class="basicDetails">
    <div class="newInformation-nav">
      <span class="section-title blue">基础信息</span>
      <a-row class="playground-row">
        <a-col class="playground-col" :span="8" v-for="(item, index) in basicDetails" :key="index">
          {{item.text}}：{{Detail[item.value] || '--'}}
        </a-col>
      </a-row>
    </div>
  </div>
</template>

<script>
export default {
  components: {},
  props: {},
  data () {
    return {
      basicDetails: [
        { text: '登记单编号', value: 'partitionName' },
        { text: '登记单名称', value: 'totalNum' },
        { text: '所属机构', value: 'partitionedNum' },
        { text: '资产项目名称', value: 'unPartitionedNum' },
        { text: '资产类型', value: 'totalNum' },
        { text: '创建人', value: 'partitionedNum' },
        { text: '创建日期', value: 'unPartitionedNum' },
        { text: '备注', value: 'unPartitionedNum' }
      ],
      Detail: {},
      registerOrderId: ''
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {                                // 获取资产类型
  },
  methods: {
    editFn () {
      let obj = {
        registerOrderId: this.registerOrderId     // 资产登记单ID
      }
      this.$api.assets.getRegisterOrderById(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.Detail = data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.basicDetails {
  .playground-row {
    margin: 28px 20px 0 20px;
    .playground-col {
      line-height: 40px;
      font-size: 12px;
    }
  }
}
</style>