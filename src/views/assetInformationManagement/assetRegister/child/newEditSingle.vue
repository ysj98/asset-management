<!--
 * @Author: LW
 * @Date: 2020-07-10 16:07:39
 * @LastEditTime: 2020-07-13 11:15:03
 * @Description: 登记单新建编辑
--> 
<template>
  <div class="newEditSingle">
    <!-- 登记单信息 -->
    <newInformation></newInformation>
    <span class="section-title blue">资产明细</span>
    <div class="newEditSingle-nav">
      <div class="mb15">
        <a-steps :current="0">
          <a-step v-for="(item, index) in stepData" :key="index" :title="item.title" />
        </a-steps>
      </div>
      <!-- 房屋 -->
      <basic ref="basicRef" :organId="organId"></basic>
    </div>
  </div>
</template>

<script>
import NewInformation from './newInformation'
import basic from './basic'
export default {
  components: {NewInformation, basic},
  props: {},
  data () {
    return {
      stepData: [
        {title: '基础信息'},
        {title: '附属配套'},
        {title: '价值信息'},
        {title: '使用方向'},
        {title: '相关费用'}
      ],
      organIdData: [],
      organId: '',
      setType: ''
    }
  },
  computed: {
  },
  created () {
    this.organIdData = JSON.parse(this.$route.query.record)
    this.organId = this.organIdData[0].value
    this.setType = this.$route.query.setType
  },
  mounted () {
  },
  methods: {
  }
}
</script>
<style lang="less" scoped>
.newEditSingle {
  padding: 42px 106px 70px 94px;
  .newEditSingle-nav {
    margin: 28px 20px;
  }
}
</style>