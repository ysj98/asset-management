<!--价值登记页面--资产价值登记详情页面-->
<template>
    <div class="detail_page">
      <a-spin :spinning="spinning" style="padding-bottom: 75px;">
        <!--基础信息-->
        <base-info-part ref="baseInfo" v-if="type" :type="type" :details="details" @setData="setListTableData" :defaultOrganName="organName" :defaultOrganId="organId" :investAreaTotal="investAreaTotal" :investCount="investCount"/>
        <!--资产价值清单-->
        <worth-list-part
          v-if="type"
          :type="type"
          :details="details"
          :dynamicData="dynamicData"
          :organId="details.organId"
          :registerId="registerId"
          @backAssetList="getAssetList"
          @validateProject="validateProject"
        />
        <!--审批轨迹及审批意见-->
        <approval-flow-part v-if="type === 'approval' || type === 'detail'" :type="type" :stepList="stepList"/>
      </a-spin>
      <!--底部按钮-->
      <form-footer
        v-if="type === 'add' || type === 'edit' || type === 'approval'"
        v-bind="footerObj[type]"
        @save="handleFooterBtn('left')"
        @cancel="handleFooterBtn('right')"
        @darft="handleFooterBtn('mid')"
      />
  </div>
</template>

<script>
  import FormFooter from 'src/components/FormFooter'
  import BaseInfoPart from './components/BaseInfoPart'
  import WorthListPart from './components/WorthListPart'
  import ApprovalFlowPart from './components/ApprovalFlowPart'
  
  export default {
    name: 'DetailPage',
    components: { ApprovalFlowPart, WorthListPart, BaseInfoPart, FormFooter },
    data () {
      return {
        investAreaTotal: 0, // 总投资资产面积
        investCount: 0,  // 总投资数量
        registerId: '', // 登记Id
        stepList: [], // 审批轨迹
        details: {}, // 基础信息数据
        spinning: false, // 加载状态
        assetList: [], // 关联资产对象提交数据
        type: '', // 页面状态 edit编辑 approval审批 detail详情 add新增，控制页面是否可编辑
        footerObj: {
          add: { leftButtonName: '提交审批', rightButtonName: '取消', midButtonName: '保存草稿', showDarft: true },
          edit: { leftButtonName: '提交审批', rightButtonName: '取消', midButtonName: '保存草稿', showDarft: true},
          approval: { leftButtonName: '审批通过', rightButtonName: '驳回' }
        }, // 页面底部操作按钮
        dynamicData: {}, // 资产价值清单联动数据
        saveType: 1, // 提交类型 1:提交审核 0：暂存草稿
        organName: '', // 组织机构名称
        organId: '',  // 组织机构id
        queryType: 1 // 资产明细是否分页，0分，1不分
      }
    },

    methods: {
      // 校验基础信息组件资产项目数据
      validateProject () {
        this.$refs['baseInfo'].validateProject()
      },

      // 获取资产关联对象数据
      getAssetList (list, investAreaSum) {
        this.assetList = list
        this.investAreaTotal = +investAreaSum
        this.investCount = list.length
        console.log(this.investAreaTotal,this.investCount )
      },

      // 提交
      handleSubmit (saveWays) {
        console.log(123)
        const { type, registerId, assetList, dynamicData, investAreaTotal, saveType } = this
        // 编辑或新增时保存
        new Promise((resolve, reject) => {
          this.$refs['baseInfo'].handleSubmit(resolve, reject)
        }).then(data => {
          //校验关联资产
          if (!assetList.length) {
            return this.$message.warn('请选择关联资产数据')
          } else if(this.validateAssetList(assetList)) {
            return this.$message.warn('投资面积为必有项')
          }
          let api = { add: 'insertRegister', edit: 'updateRegister' }
          let tip = type === 'add' ? '新增': '保存'
          this.spinning = true
          let investDetail = []
          console.log(assetList)
          assetList.forEach(m => {
            const { investDetailId, investArea, remark, assetId } = m
            investDetail.push({ investDetailId, investArea, remark, assetId })
          })
          let form = type === 'edit' || type === 'add' ? { ...data, investDetail, investOrderId: registerId ? registerId : '', investArea: investAreaTotal, 
          ...dynamicData, approvalStatus: saveWays } : { ...data, detailList }
          console.log(form)
          delete form.assetArea
          this.$api.assetInvest.saveUpdateInvestOrder(form).then(r => {
            this.spinning = false
            let res = r.data
            if (res && String(res.code) === '0') {
              this.$message.success(`${tip}成功`)
              // 跳回列表路由
              return this.$router.push({ name: '投资登记', params: { refresh: true } })
            }
            throw res.message || `${tip}失败`
          }).catch(err => {
            this.spinning = false
            this.$message.error(err || `${tip}失败`)
          })
        }).catch((err) => {
          console.log(err)
          this.spinning = false
         })
      },

      // 查询详情
      queryDetailById (registerId) {
        this.spinning = true
        const { details,queryType } = this
        this.$api.assetInvest.getInvestOrder({investOrderId: registerId}).then(r => {
          let res = r.data
          this.$api.basics.attachment({objectId: registerId, objectType: 20}).then(result => {
          if(result.data.code != 0){return false}
          this.spinning = false
          if (res && String(res.code) === '0') {
            const { stepList, ...others } = res.data
            // 初始化，用于资产价值清单组件
            this.dynamicData = {
              assetType: res.data.assetType,
              // receiveOrganName: res.data.receiveOrganName,
              // receiveUserName: res.data.receiveUserName,
              projectId: res.data.projectId,
              // receiveDate: res.data.receiveDate,
              // returnDate: res.data.returnDate,
              // returnUserId: res.data.returnUserId,
              // returnOrganId: res.data.returnOrganId,
             
            }
             return Object.assign(this, { stepList, details: { ...details, ...res.data, attachmentList: [...result.data.data]} })
              
          }
          
          })
          return
          throw res.message || '查询领用登记详情出错'
        }).catch(err => {
          this.spinning = false
          console.log(err)
          this.$message.error(123 || '查询领用登记详情出错')
        })
      },
      
      // 处理底部按钮事件
      handleFooterBtn (sign) {
        const { type } = this
        let {saveType} = this
        if (sign === 'left') {
          type === 'approval' ? this.handleApprove('left') : this.handleSubmit(saveType)
        } else if(sign === 'mid'){
           saveType = 0
           this.handleSubmit(saveType)
        }else {
          type === 'approval' ? this.handleApprove() : this.$router.go(-1)
        }
      },
      
      // 审批驳回、通过
      handleApprove (sign) {
        this.spinning = true
        const { registerId } = this
        let tip = sign === 'left' ? '审批': '驳回'
        let approvalStatus = sign === 'left' ? '1' : '3'
        this.$api.worthRegister.updateStatus({ approvalStatus, registerId }).then(r => {
          this.spinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.$message.success(`${tip}成功`)
            // 跳回列表路由
            return this.$router.push({ name: '价值登记', params: { refresh: true } })
          }
          throw res.message || `${tip}失败`
        }).catch(err => {
          this.spinning = false
          this.$message.error(err || `${tip}失败`)
        })
      },
      
      // 联动更新资产价值清单Table中评估基准日、评估方法、评估机构的值
      setListTableData (obj) {
        this.dynamicData = Object.assign({}, this.dynamicData, obj)
      },
      
      // 校验资产价值清单本次必有项非空
      validateAssetList (list) {
        console.log(list,123)
        let arr = list.filter(m => +m.investArea === 0 || !m.investArea)
        return arr.length
      }
    },

    created () {
      const { params : { type, organId, organName, registerId } } = this.$route
      if(type == 'edit'){
        this.queryType = 1
      }
      if(type == 'detail' || type == 'approval') {
        this.queryType = 0
      }
      Object.assign(this, { type, registerId }, { details: { organId, organName }})
      this.organName = organName
      this. organId = organId
      console.log(this.organId)
      registerId && this.queryDetailById(registerId)
    }
  }
</script>

<style lang='less' scoped>
  .detail_page {
    padding-left: 70px;
    padding-right: 10px;
  }
</style>
