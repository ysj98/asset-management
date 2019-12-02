<!--价值登记页面--资产价值登记详情页面-->
<template>
  <a-spin :spinning="spinning">
    <div class="detail_page">
      <!--基础信息-->
      <base-info-part ref="baseInfo" v-if="type" :type="type" :details="details"/>
      <!--资产价值清单-->
      <worth-list-part v-if="type" :type="type" :assetList="initAssetList" @backAssetList="getAssetList"/>
      <!--审批轨迹及审批意见-->
      <approval-flow-part v-if="type" :type="type" :stepList="stepList"/>
    </div>
  </a-spin>
</template>

<script>
  import BaseInfoPart from './BaseInfoPart'
  import WorthListPart from './WorthListPart'
  import ApprovalFlowPart from './ApprovalFlowPart'
  export default {
    name: 'DetailPage',
    components: { ApprovalFlowPart, WorthListPart, BaseInfoPart },
    data () {
      return {
        registerId: '', // 登记Id
        stepList: [], // 审批轨迹
        details: {}, // 基础信息数据
        spinning: false, // 加载状态
        assetList: [], // 关联资产对象提交数据
        initAssetList: [], // 关联资产对象渲染数据
        organId: '', // 组件机构Id
        organName: '', // 组件机构name
        type: '' // 页面状态 edit编辑 approval审批 detail详情 add新增，控制页面是否可编辑
      }
    },

    methods: {
      // 获取资产关联对象数据
      getAssetList (list) {
        this.assetList = list
      },

      // 提交
      handleSubmit () {
        const { type, registerId, assetList: registerValueRelList } = this
        // 编辑或新增时保存
        if (type === 'add' || type === 'edit') {
          new Promise((resolve, reject) => {
            this.$refs['baseInfo'].handleSubmit(resolve, reject)
          }).then(data => {
            // 校验关联资产
            if (!registerValueRelList.length) {
              return this.$message.error('请选择关联资产数据')
            }
            let api = { add: 'insertRegister', edit: 'updateRegister' }
            this.spinning = true
            let form = type === 'edit' ? { ...data, registerValueRelList, registerId } : { ...data, registerValueRelList }
            this.$api.worthRegister[api[type]](form).then(r => {
              this.spinning = false
              let res = r.data
              if (res && String(res.code) === '0') {
                this.$message.success(`${type === 'add' ? '新增': '保存'}成功`)
                // 跳回列表路由
                return this.router.go(-1)
              }
              throw res.message || `${type === 'add' ? '新增': '保存'}失败`
            }).catch(err => {
              this.spinning = false
              this.$message.error(err || `${type === 'add' ? '新增': '保存'}失败`)
            })
          }).catch(() => {
            this.spinning = false
          })
        } else if (type === 'approval') {
          // 审核提交
          this.spinning = true
          debugger
        } else {
          this.$message.error('操作不存在')
        }
      },

      // 查询详情
      queryDetailById (registerId) {
        this.spinning = true
        const { organId, organName } = this
        this.$api.worthRegister.queryDetail({registerId}).then(r => {
          this.spinning = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { assetList, stepList, ...others } = res.data
            return Object.assign(this, { initAssetList: assetList, stepList, details: { organId, organName, ...others} })
          }
          throw res.message || '查询价值登记详情出错'
        }).catch(err => {
          this.spinning = false
          this.$message.error(err || '查询价值登记详情出错')
        })
      }
    },

    created () {
      debugger
      const { params : { type, organId, organName, registerId } } = this.$route
      Object.assign(this, { type, organId, organName, registerId })
      registerId && this.queryDetailById(registerId)
    }
  }
</script>

<style lang='less' scoped>
  .detail_page {
    padding-left: 70px;
  }
</style>
