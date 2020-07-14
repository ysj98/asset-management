<!--
 * @Author: LW
 * @Date: 2020-07-10 16:07:39
 * @LastEditTime: 2020-07-14 11:54:48
 * @Description: 登记单新建编辑
--> 
<template>
  <div class="newEditSingle">
    <!-- 登记单第一步信息 -->
    <newInformation v-show="this.activeStepIndex === 0"></newInformation>
    <basicDetails v-show="this.activeStepIndex !== 0"></basicDetails>
    <span class="section-title blue">资产明细</span>
    <div class="newEditSingle-nav">
      <div class="mb15">
        <a-steps :current="activeStepIndex">
          <a-step v-for="(item, index) in stepData" :key="index" :title="item.title" />
        </a-steps>
      </div>
      <!-- 房屋 -->
      <basic v-show="this.activeStepIndex === 0" ref="basicRef" :organId="organId"></basic>
      <!-- 附属配套 -->
      <necessaryCaaessories v-show="this.activeStepIndex === 1"></necessaryCaaessories>
    </div>
    <div class="step-footer-operation">
      <tabFormFooter location="fixed" :rightButtonDisabled="rightButtonDisabled" :leftButtonName="leftButtonName" rightButtonName="下一步" @save="handleSubmit" @cancel="handleBackOrReset"></tabFormFooter>
    </div>
  </div>
</template>

<script>
import tabFormFooter from '../../../common/tabFormFooter'
import NewInformation from './newInformation'
import basicDetails from './basicDetails'
import necessaryCaaessories from './necessaryCaaessories'
import basic from './basic'
export default {
  components: {NewInformation, basic, tabFormFooter, basicDetails, necessaryCaaessories},
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
      setType: '',                // 新增还是编辑
      rightButtonDisabled: true,    // 下一步禁止选择
      activeStepIndex: 0          // 第几步
    }
  },
  computed: {
    leftButtonName: function () {
      if (this.activeStepIndex === 0) {
        return '保存'
      } else if (this.activeStepIndex < 4) {
        return '上一步'
      } else {
        return '完成'
      }
    }
  },
  created () {
    this.organIdData = JSON.parse(this.$route.query.record)
    this.organId = this.organIdData[0].value
    this.setType = this.$route.query.setType
  },
  mounted () {
  },
  methods: {
    // 上一步
    handleSubmit () {
      // 保存(基本信息的单个保存全部放在这里)
      if (this.activeStepIndex === 0) {
        console.log('保存')
        this.rightButtonDisabled = false
      } else {
        this.activeStepIndex--
      }
    },
    // 点击下一步或重置
    handleBackOrReset () {
      this.activeStepIndex++
    },
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