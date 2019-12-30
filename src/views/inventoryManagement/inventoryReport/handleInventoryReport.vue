<!--
  盘点报告的操作，包括新建、编辑、审核、详情
-->
<template>
  <div class="handle-inventory-report">
    <a-form :form="form" @submit="handleSubmit">
      <div class="edit-box">
        <div class="edit-box-title"><i></i><span>基础信息</span></div>
        <div class="edit-box-content">
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">所属盘点任务<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                :style="allStyle"
                placeholder="请选择盘点任务"
                :open="showInventoryTaskModal"
                :options="inventoryTaskOptions"
                @dropdownVisibleChange="dropdownVisibleChange"
                v-decorator="['taskId',
                {rules: [{required: true, message: '请选择关联资产'}], initialValue: detail.taskId}]"
              >
                <div slot="dropdownRender" slot-scope="menu"></div>
                <a-icon slot="suffixIcon" type="plus-circle" />
              </a-select>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">盘点报告名称<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入盘点报告名称"
                :style="allStyle"
                v-if="editable"
                v-decorator="['reportName',
                {rules: [{required: true, max: 30, whitespace: true, message: '请输入盘点报告名称(不超过30字符)'}], initialValue: detail.reportName}
              ]"/>
              <span class="label-value" v-else>{{detail.reportName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">所属机构<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input :style="allStyle" v-model="organName" type="text" disabled v-if="editable"></a-input>
              <span class="label-value" v-else>{{organName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">盘点结果描述<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <span class="label-value">{{detail.description || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">提交人<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.createByName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">提交时间<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.createTime || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">状态<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.approvalStatusName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">附件<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <SG-UploadFile
                type="all"
                :show="!editable"
                v-model="detail.attachment"/>
              <span class="file-null" v-if="!editable && detail.attachment.length === 0">--</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">总结说明<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <a-textarea
                placeholder="请输入盘点总结说明（最多200字）"
                :rows="3"
                v-if="editable"
                v-decorator="['remark',
                {rules: [{validator: validateRemark}], initialValue: detail.remark}]"></a-textarea>
              <span class="label-value" v-else>{{detail.remark || '--'}}</span>
            </a-form-item>
          </div>
        </div>
      </div>
      <div class="edit-box" v-show="pageType === 'audit'">
        <div class="edit-box-title"><i></i><span>审核信息</span></div>
        <div class="edit-box-content">
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name">审核意见</span><span>：</span></div>
            <a-form-item class="label-value">
              <a-textarea
                placeholder="请输入审核意见"
                :rows="3"
                v-model="audit.auditOpinion"
              ></a-textarea>
            </a-form-item>
          </div>
        </div>
      </div>
    </a-form>
    <form-footer v-show="pageType === 'new' || pageType === 'edit'">
      <slot>
        <SG-Button type="primary" @click="handleSubmit(1)">提交</SG-Button>
        <SG-Button type="primary" weaken @click="handleSubmit(0)">保存草稿</SG-Button>
        <SG-Button @click="cancel">取消</SG-Button>
      </slot>
    </form-footer>
    <form-footer v-show="pageType === 'audit'" leftButtonName="审核通过" rightButtonName="驳回" rightButtonType="danger" @save="approveAudit" @cancel="rejectAudit">
    </form-footer>
    <choose-inventory-task ref="chooseInventoryTask"></choose-inventory-task>
  </div>
</template>

<script>
import FormFooter from '@/components/FormFooter'
import chooseInventoryTask from './chooseInventoryTask'
export default {
  components: {
    FormFooter, chooseInventoryTask
  },
  data () {
    return {
      pageType: 'new',
      editable: false,
      form: this.$form.createForm(this),
      allStyle: 'width: 160px;',
      organId: '',
      organName: '',
      detail: {
        taskId: undefined,
        reportName: '',
        description: '',
        createByName: '',
        createTime: '',
        approvalStatusName: '',
        attachment: [],
        remark: ''
      },
      inventoryTaskOptions: [],
      audit: {
        auditOpinion: ''
      },
      showInventoryTaskModal: false
    }
  },
  methods: {
    dropdownVisibleChange (open) {
      this.showInventoryTaskModal = open
      if (open) {
        this.$refs.chooseInventoryTask.show = true
      }
    },
    // 校验备注
    validateRemark (rule, value, callback) {
      if (value) {
        if (value.length > 200) {
          callback('备注长度不能超过200个字')
        }
      }
      callback()
    },
    // 新增编辑提交
    handleSubmit (approvalStatus) {
      console.log(approvalStatus)
      this.form.validateFields((err, values) => {
        console.log(err)
        console.log(values)
        if (!err) {
          // console.log(values)
          // let form = values
          // form.organId = this.organId
          // form.accountEntryTime = form.accountEntryTime.format('YYYY-MM-DD')
          // form.startUseTime = form.startUseTime.format('YYYY-MM-DD')
          // form.getTime = form.getTime ? form.getTime.format('YYYY-MM-DD') : ''
          // form.safekeepingOrganId = this.detail.safekeepingOrganId || ''
          // form.approvalStatus = approvalStatus
          // let attachment = []
          // this.detail.attachment.forEach(item => {
          //   let obj = {
          //     attachmentPath: item.url,
          //     oldAttachmentName: item.name
          //   }
          //   attachment.push(obj)
          // })
          // form.attachmentList = attachment
          // console.log(form)
          // if (this.pageType === 'new') {
          //   this.$api.assets.insertCard(form).then(res => {
          //     if (res.data.code === '0') {
          //       this.$message.success('提交成功')
          //       this.$router.push({path: '/assetEntry', query: {refresh: true}})
          //     } else {
          //       this.$message.error(res.data.message)
          //     }
          //   })
          // }
          // if (this.pageType === 'edit') {
          //   form.cardId = this.cardId
          //   this.$api.assets.updateCard(form).then(res => {
          //     if (res.data.code === '0') {
          //       this.$message.success('提交成功')
          //       this.$router.push({path: '/assetEntry', query: {refresh: true}})
          //     } else {
          //       this.$message.error(res.data.message)
          //     }
          //   })
          // }
        }
      })
    },
    // 取消
    cancel () {
      this.$router.push({path: '/inventoryManagement/inventoryReport'})
    },
    // 提交审核
    submitAudit () {
    },
    // 审核通过
    approveAudit () {},
    // 驳回
    rejectAudit () {
      if (!this.audit.auditOpinion) {
        this.$message.warning('驳回时审核意见不能为空')
        return
      }
    },
  },
  mounted () {
    this.pageType = this.$route.query.pageType
    this.editable = this.pageType === 'new' || this.pageType === 'edit'
    this.organId = this.$route.query.organId
    this.organName = this.$route.query.organName
  }
}
</script>

<style lang="less" scoped>
  .handle-inventory-report {
    padding: 40px 105px 40px 95px;
    .edit-box {
      text-align: left;
      color: #49505E;
      margin-bottom: 16px;
      .edit-box-title {
        height: 14px;
        font-size: 14px;
        font-weight:bold;
        i {
          display: block;
          height: 14px;
          width: 5px;
          margin-right: 10px;
          background: #0084FF;
          float: left;
        }
        span {
          display: block;
          float: left;
          height: 14px;
          line-height: 14px;
          font-family: PingFang-SC-Heavy;
        }
      }
      .edit-box-content {
        margin: 30px 40px 0 40px;
        position: relative;
        display: inline-block;
        width: 100%;
        .edit-box-content-item {
          width: 33%;
          float: left;
          font-size: 12px;
          .label-name-box {
            float: left;
            line-height: 34px;
            .label-name {
              height: 34px;
              font-family: PingFang-SC-Regular;
              color: #282D5B;
              margin-right: 3px;
              float: left;
              span {
                float: left;
              }
            }
            .label-space-between {
              width: 72px;
              text-align: justify;
              margin-left: 10px;
              i {
                display: inline-block;
                width: 100%;
              }
            }
          }
          .label-name-box.required {
            position: relative;
            &:before {
              position: absolute;
              left: 0px;
              width: 6px;
              content: '*';
              color: #f5222d;
              line-height: 36px;
              font-family: SimSun;
            }
          }
          /deep/ .ant-form-item-control {
            line-height: 34px;
          }
          /deep/ .ant-form-explain {
            margin-left: 90px;
          }
          /deep/ .ant-form-item-with-help {
            margin-bottom: 6px;
          }
        }
        .edit-box-content-item.total-width {
          width: 100%;
          .label-value {
            float: left;
            width: calc(100% - 97px);
          }
        }
        .table-header-btn {
          position: absolute;
          right: 0;
          top: -44px;
        }
        .custom-table {
          /deep/ .ant-table-placeholder{
            display: block!important;
          }
        }
      }
    }
  }
</style>