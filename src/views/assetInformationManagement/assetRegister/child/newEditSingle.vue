<!--
 * @Author: LW
 * @Date: 2020-07-10 16:07:39
 * @LastEditTime: 2022-07-16 11:55:44
 * @Description: 登记单新建编辑 新建登记单
-->
<template>
  <div class="newEditSingle">
    <!-- 登记单第一步信息 -->
    <newInformation ref="newInformation" v-if="this.activeStepIndex === 0 && setType === 'new' && registerOrderId === ''"></newInformation>
    <basicDetails
      v-if="this.activeStepIndex !== 0 || setType === 'edit' || registerOrderId"
      :registerOrderId="registerOrderId"
    >
    </basicDetails>
    <span class="section-title blue">资产明细</span>
    <div class="newEditSingle-nav">
      <div class="mb15">
        <a-steps :current="activeStepIndex">
          <a-step v-for="(item, index) in stepData" :key="index" :title="item.title" />
        </a-steps>
      </div>
      <!-- 房屋 -->
      <keep-alive>
        <basic
          v-if="this.activeStepIndex === 0"
          ref="basicRef" 
          :organId="organId"
          :registerOrderId="registerOrderId"
          :assetTypeId="assetType"
        >
          <!-- @handleSubmit="handSubmit" -->
        </basic>
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
      <tabFormFooter location="fixed" :rightButtonDisabled="rightButtonDisabled" :showSave="showSave" :showAloneCancel="true" @aloneCancel="aloneCancel" :leftButtonName="leftButtonName" :rightButtonName="rightButtonName" @save="confirmArea" @cancel="handleBackOrReset"></tabFormFooter>
    </div>
    <SG-Modal
      width="500px"
      v-model="modelStatus"
      title="确认登记"
      confirmText="确定"
      @ok="onConfirm"
      @cancel="modelStatus=false"
    >
      <div>
        <p class="modalTips">{{ tips }}</p>
        <p class="modalContent">权证的面积不一致，确定登记吗？</p>
      </div>
    </SG-Modal>
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
import {handleAssetTypeField} from "@/views/assetInformationManagement/assetRegister/common/share";
import {SET_PARKING_PLACE_RESOURCE_TYPE, SET_PARKING_OBJ_TYPE} from "store/types/platformDictTypes";
export default {
  components: {NewInformation, basic, tabFormFooter, basicDetails, necessaryCaaessories, valueToRegister, directionUse, correlativeCharges},
  props: {},
  data () {
    return {
      modelStatus: false, // 确认登记模态框
      tips: '',
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
      titleData: {
        0: '登记基础信息',
        1: '登记配套附属',
        2: '登记价值信息',
        3: '登记使用方向',
        4: '登记相关费用'
      },
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
      this.assetType = String(this.organIdData[0].assetType)
      this.activeStepIndex = Number(this.$route.query.activeStepIndex)
      this.$store.commit('pro/updateNav', [{name: '资产管理', path: ''}, {name: '资产登记', path: '/assetRegister'}, {name: `${this.titleData[this.activeStepIndex]}`, path: ''}])
    }

    this.$store.dispatch('platformDict/getPlatformDict',{
      code: 'PARKING_OBJ_TYPE',
      type: SET_PARKING_OBJ_TYPE
    })
    this.$store.dispatch('platformDict/getPlatformDict',{
      code: 'PARKING_PLACE_RESOURCE_TYPE',
      type: SET_PARKING_PLACE_RESOURCE_TYPE
    })
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
    onConfirm() {
      this.handleSubmit()
    },
    // 资产登记校验权证号
    async getApproveConfig(){
      let { data:{ code,data } } = await this.$api.paramsConfig.queryParamsConfigDetail({
        serviceType: 1009,
        organId: this.organId,
      })
      if (code === "0"){
        const {isValid} = data
        if( isValid === 1){
          return true
        }else {
          return false
        }
      } else {
        return false
      }
    },
    confirmArea () {
      if (this.activeStepIndex === 0 && !this.registerOrderId) {
        let tableData = this.$refs.basicRef.tableData
        if (tableData.length === 0) {
          this.$message.info('请导入资产明细')
          return true
        }
        let array = []
        // area 建筑面积  buildArea 权证面积 这里比较建筑面积和权证面积是否相等（权属情况为有证），如果不等则提示
        tableData.map(item => {
          if (item.ownershipStatusName==='有证' && Number(item.area) !== Number(item.buildArea)) {
            array.push(item.assetName)
          }
        })
        // 有不相等的情况，且相关配置页面已经开启了权证号校验
        if (array.length && this.getApproveConfig()) {
          this.tips = array.join('、')
          this.modelStatus = true
          // this.$SG_Message.confirmDelete({
          //   content: tips,
          //   confirmText: '确定',
          //   onConfirm: () => {
          //     this.handleSubmit()
          //   },
          //   onCancel: () => {
          //     return
          //   }
          // })
        } else {
          this.handleSubmit()
        }
      } else {
        this.handleSubmit()
      }
    },
    // 上一步
    handleSubmit () {
      // 保存(基本信息的单个保存全部放在这里)
      if (this.activeStepIndex === 0 && !this.registerOrderId) {
        this.$refs.newInformation.save()
        let data = this.$refs.newInformation.saveValues
        let filepaths = this.$refs.newInformation.getFilepaths()
        if (!data) {return}
        this.assetType = data.assetType
        console.log(this.assetType, 'assetTypeassetTypeassetType')
        if (this.$refs.basicRef.save()) { return }
        let basicData = this.$refs.basicRef.basicData.map(ele=>{
          delete ele.pasitionString
          return {
            ...ele
          }
        })
        let ASSET_TYPE_LIST = handleAssetTypeField(data.assetType,'list')
        console.log(ASSET_TYPE_LIST, '存储数据==================')
        let obj = {
          registerOrderId: this.registerOrderId,          // 资产变动单Id（新增为空）
          registerOrderName: data.registerOrderName,    // 登记单名称
          projectId: data.projectId,                    // 资产项目Id
          assetType: data.assetType,                    // 资产类型Id
          remark: data.remark,                          // 备注
          organId: this.organId,                          // 组织机构id
          [ASSET_TYPE_LIST]: basicData,
          attachment:filepaths.map(ele=>({attachmentPath:ele.url,oldAttachmentName:ele.name}))
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
              this.$nextTick(() => {
                this.$refs.basicRef.query('sub')
              })
              return true
            })
          } else {
            this.DE_Loding(loadingName).then(() => {
              this.$message.error(res.data.message)
            })
          }
        })
        this.$refs.basicRef.setDetail(obj)
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
    // 取消
    aloneCancel () {
      if (this.registerOrderId) {
        this.$router.push({path: '/assetRegister', query: {refresh: true}})
      } else {
        this.$router.push({path: '/assetRegister'})
      }
    }
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
.modalTips{
  height: 150px;
  overflow-y: auto;
}
.modalContent{
  margin-left: 50%;
  transform: translateX(-50%);
}
</style>
