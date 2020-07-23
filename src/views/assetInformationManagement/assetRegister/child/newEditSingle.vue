<!--
 * @Author: LW
 * @Date: 2020-07-10 16:07:39
 * @LastEditTime: 2020-07-23 19:17:01
 * @Description: 登记单新建编辑
--> 
<template>
  <div class="newEditSingle">
    <!-- 登记单第一步信息 -->
    <newInformation ref="newInformation" v-if="this.activeStepIndex === 0 && setType === 'new' && registerOrderId === ''"></newInformation>
    <basicDetails v-if="this.activeStepIndex !== 0 || setType === 'edit' || registerOrderId" :registerOrderId="registerOrderId"></basicDetails>
    <span class="section-title blue">资产明细</span>
    <div class="newEditSingle-nav">
      <div class="mb15">
        <a-steps :current="activeStepIndex">
          <a-step v-for="(item, index) in stepData" :key="index" :title="item.title" />
        </a-steps>
      </div>
      <!-- 房屋 -->
      <keep-alive>
        <basic v-if="this.activeStepIndex === 0" ref="basicRef" :organId="organId" :registerOrderId="registerOrderId" :assetTypeId="assetType"></basic>
      </keep-alive>
      <!-- 附属配套 -->
      <necessaryCaaessories v-if="this.activeStepIndex === 1" :organId="organId" :registerOrderId="registerOrderId" :assetType="assetType"></necessaryCaaessories>
      <!-- 价值登记 -->
      <valueToRegister v-if="this.activeStepIndex === 2" :organId="organId" :registerOrderId="registerOrderId" :assetType="assetType"></valueToRegister>
      <!-- 使用方向 -->
      <directionUse v-if="this.activeStepIndex === 3" :organId="organId" :registerOrderId="registerOrderId" :assetType="assetType"></directionUse>
      <!-- 相关费用 -->
      <correlativeCharges v-if="this.activeStepIndex === 4" :organId="organId" :registerOrderId="registerOrderId" :assetType="assetType"></correlativeCharges>
    </div>
    <div class="step-footer-operation" v-if="setType === 'new'">
      <tabFormFooter location="fixed" :rightButtonDisabled="rightButtonDisabled" :showSave="showSave" :leftButtonName="leftButtonName" :rightButtonName="rightButtonName" @save="handleSubmit" @cancel="handleBackOrReset"></tabFormFooter>
    </div>
  </div>
</template>

<script>
import tabFormFooter from '../../../common/tabFormFooter'
import NewInformation from './newInformation'
import basicDetails from './basicDetails'
import necessaryCaaessories from './necessaryCaaessories'
import valueToRegister from './valueToRegister'
import directionUse from './directionUse'
import correlativeCharges from './correlativeCharges'
import basic from './basic'
export default {
  components: {NewInformation, basic, tabFormFooter, basicDetails, necessaryCaaessories, valueToRegister, directionUse, correlativeCharges},
  props: {},
  data () {
    return {
      registerOrderId: '',      // 登记单id
      assetType: '',
      showSave: true,              // 上一步展示
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
      rightButtonDisabled: true,  // 下一步禁止选择
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
    },
    rightButtonName: function () {
      if (this.activeStepIndex === 4) {
        return '上一步'
      } else {
        return '下一步'
      }
    }
  },
  created () {
    this.organIdData = JSON.parse(this.$route.query.record)
    this.organId = this.organIdData[0].value
    this.setType = this.$route.query.setType
    if (this.setType !== 'new') {
      this.registerOrderId = this.organIdData[0].registerOrderId
      this.assetType = this.organIdData[0].assetType
      this.activeStepIndex = this.$route.query.activeStepIndex
    }
  },
  watch: {
    'activeStepIndex' (val) {
      if (val === 0 && this.registerOrderId) {
        this.showSave = false
      } else {
        this.showSave = true
      }
    }
  },
  mounted () {
  },
  methods: {
    // 上一步
    handleSubmit () {
      // 保存(基本信息的单个保存全部放在这里)
      if (this.activeStepIndex === 0 && !this.registerOrderId) {
        this.$refs.newInformation.save()
        let data = this.$refs.newInformation.saveValues
        if (!data) {return}
        this.assetType = data.assetType
        console.log(this.assetType, 'assetTypeassetTypeassetType')
        if (this.$refs.refs.basicRef.save()) { return }
        let basicData = this.$refs.refs.basicRef.basicData
        let obj = {
          registerOrderId: this.registerOrderId,          // 资产变动单Id（新增为空）
          registerOrderName: data.registerOrderName,    // 登记单名称
          projectId: data.projectId,                    // 资产项目Id
          assetType: data.assetType,                    // 资产类型Id
          remark: data.remark,                          // 备注
          organId: this.organId,                          // 组织机构id
          assetHouseList: data.assetType === '1' ? basicData : [],   // 房屋
          assetBlankList: data.assetType === '4' ? basicData : []    // 土地
        }
        // 新增
        let loadingName = this.SG_Loding('保存中...')
        this.$api.assets.saveRegisterOrder(obj).then(res => {
          if (Number(res.data.code) === 0) {
            this.DE_Loding(loadingName).then(() => {
              this.$SG_Message.success('提交成功')
              this.registerOrderId = res.data.data
              this.showSave = false
              this.rightButtonDisabled = false                     // 成功了才可以下一步
              this.$refs.basicRef.query('sub')
              return true
            })
          } else {
            this.DE_Loding(loadingName).then(() => {
              this.$message.error(res.data.message)
            })
          }
        })
      }  else if (this.activeStepIndex === 4) {
        // 点击完成
        this.$router.push({path: '/assetRegister', query: {refresh: true}})
      } else {
        this.activeStepIndex--
        this.showSave = true
      }
    },
    // 点击下一步或重置
    handleBackOrReset () {
      // 最后一步时显示上一步
      if (this.activeStepIndex === 4) {
        this.activeStepIndex--
      } else {
        this.activeStepIndex++
      }
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