<!--
  权属人新建、编辑、详情弹窗
-->
<template>
  <SG-Modal
    class="handlePropertyOwner"
    :class="{'no-footer': !editable}"
    :width="modal.width"
    v-model="modal.show"
    :title="modal.title"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
    <a-form :form="form" @submit="handleSubmit">
      <div class="edit-box">
        <div class="edit-box-content">
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">所属机构<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input :style="allStyle" v-model="organName" type="text" disabled v-if="editable"></a-input>
              <span class="label-value" v-else>{{organName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">本企业所属人<i></i></span><span>：</span></div>
            <a-form-item>
              <a-radio-group
                option.initialValue="detail.currentOrgan"
                v-if="editable"
                v-decorator="['currentOrgan',
                {rules: [], initialValue: detail.currentOrgan}]">
                <a-radio :value="1">是</a-radio>
                <a-radio :value="0">否</a-radio>
              </a-radio-group>
              <span class="label-value" v-else>{{detail.currentOrganName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">权属人名称<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入权属人名称"
                :style="allStyle"
                v-if="editable"
                v-decorator="['obligeeName',
                {rules: [{required: true, max: 50, whitespace: true, message: '请输入权属人名称(长度最多为50)'}], initialValue: detail.obligeeName}
              ]"/>
              <span class="label-value" v-else>{{detail.obligeeName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">权属人类型<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请选择权属人类型"
                :style="allStyle"
                :options="obligeeTypeOptions"
                v-decorator="['obligeeType',
                {rules: [{required: true,  message: '请选择权属人类型'}], initialValue: detail.obligeeType}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.obligeeTypeName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">证件类型<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请选择证件类型"
                :style="allStyle"
                :options="certificateTypeOptions"
                v-decorator="['certificateType',
                {rules: [{required: true,  message: '请选择证件类型'}], initialValue: detail.certificateType}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.certificateTypeName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">证件号码<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入证件号码"
                :style="allStyle"
                v-if="editable"
                v-decorator="['certificateNo',
                {rules: [{required: true, max: 40, whitespace: true, message: '请输入证件号码(长度最多为40)'}], initialValue: detail.certificateNo}]"/>
              <span class="label-value" v-else>{{detail.certificateNo || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">通讯地址<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入通讯地址"
                :style="allStyle"
                :max="100"
                v-if="editable"
                v-decorator="['mailingAddress',
                {rules: [{max: 100, whitespace: true, message: '通讯地址长度最多为100'}], initialValue: detail.mailingAddress}]"/>
              <span class="label-value" v-else>{{detail.mailingAddress || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">邮编<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入邮编"
                :style="allStyle"
                :max="100"
                v-if="editable"
                v-decorator="['postalCode',
                {rules: [{max: 100, whitespace: true, message: '邮编长度最多为100'}], initialValue: detail.postalCode}]"/>
              <span class="label-value" v-else>{{detail.postalCode || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">法定代表<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入法定代表"
                :style="allStyle"
                :max="50"
                v-if="editable"
                v-decorator="['legalAgent',
                {rules: [{max: 50, whitespace: true, message: '法定代表长度最多为50'}], initialValue: detail.legalAgent}]"/>
              <span class="label-value" v-else>{{detail.legalAgent || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">联系方式(法)<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入联系方式(法)"
                :style="allStyle"
                :max="30"
                v-if="editable"
                v-decorator="['legalAgentTel',
                {rules: [{max: 30, whitespace: true, message: '联系方式长度最多为30'}], initialValue: detail.legalAgentTel}]"/>
              <span class="label-value" v-else>{{detail.legalAgentTel || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">代理人(机构)<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入代理人(机构)"
                :style="allStyle"
                :max="50"
                v-if="editable"
                v-decorator="['agent',
                {rules: [{max: 50, whitespace: true, message: '代理人(机构)长度最多为50'}], initialValue: detail.agent}]"/>
              <span class="label-value" v-else>{{detail.agent || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">联系方式(代)<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入联系方式(代)"
                :style="allStyle"
                :max="30"
                v-if="editable"
                v-decorator="['agentTel',
                {rules: [{max: 30, whitespace: true, message: '联系方式长度最多为30'}], initialValue: detail.agentTel}]"/>
              <span class="label-value" v-else>{{detail.agentTel || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">备注<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <a-textarea
                placeholder="请输入描述（最多200字）"
                :rows="3"
                :max="200"
                v-if="editable"
                v-decorator="['remark',
                {rules: [{max: 200, whitespace: true, message: '描述长度最多为200'}], initialValue: detail.remark}]">
              </a-textarea>
              <span class="label-value" v-else>{{detail.remark || '--'}}</span>
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
        </div>
      </div>
    </a-form>
  </SG-Modal>
</template>

<script>
export default {
  props: {
    modalType: {
      type: String,
      default: 'new'
    },
    organId: {
      type: [String, Number],
      default: ''
    },
    organName: {
      type: String,
      default: ''
    },
    ownerId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      modal: {
        title: '新建权属人',
        width: '860px',
        show: false
      },
      form: this.$form.createForm(this),
      allStyle: 'width: 215px;',
      editable: true,
      detail: {
        obligeeName: '',
        currentOrgan: 1,
        currentOrganName: '',
        obligeeType: undefined,
        obligeeTypeName: '',
        certificateType: undefined,
        certificateTypeName: '',
        certificateNo: '',
        mailingAddress: '',
        postalCode: '',
        legalAgent: '',
        legalAgentTel: '',
        agent: '',
        agentTel: '',
        remark: '',
        attachment: []
      },
      obligeeTypeOptions: [
        {label: '个人', value: 1},
        {label: '企业', value: 2},
        {label: '政府事业单位', value: 3}
      ],
      certificateTypeOptions: [
        {label: '身份证', value: 1},
        {label: '统一信用代码', value: 2}
      ]
    }
  },
  watch: {
    modalType (val) {
      if (val === 'detail') {
        this.editable = false
      } else {
        this.editable = true
      }
    },
    'modal.show' (val) {
      if (val) {
        if (this.modalType === 'edit' || this.modalType === 'detail') {
          this.getDetail()
        }
      } else {
        this.detail = {
          obligeeName: '',
          currentOrgan: 1,
          currentOrganName: '',
          obligeeType: undefined,
          obligeeTypeName: '',
          certificateType: undefined,
          certificateTypeName: '',
          certificateNo: '',
          mailingAddress: '',
          postalCode: '',
          legalAgent: '',
          legalAgentTel: '',
          agent: '',
          agentTel: '',
          remark: '',
          attachment: []
        }
      }
    }
  },
  methods: {
    // 提交
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          let form = values
          form.organId = this.organId
          let attachment = []
          this.detail.attachment.forEach(item => {
            let obj = {
              attachmentPath: item.url,
              oldAttachmentName: item.name
            }
            attachment.push(obj)
          })
          form.amsAttachmentList = attachment
          if (this.modalType === 'edit') {
            form.obligeeId = this.ownerId
          }
          console.log(form)
          this.$api.assets.saveOrUpdate(form).then(res => {
            if (res.data.code === '0') {
              this.modal.show = false
              this.$message.success('提交成功')
              this.$parent.queryClick()
            } else {
              this.$error({
                title: '提示',
                content: res.data.message
              })
            }
          })
        }
      })
    },
    // 取消
    handleCancel () {
      this.modal.show = false
    },
    // 获取详情
    getDetail () {
      let form = {
        obligeeId: this.ownerId
      }
      this.$api.assets.detail(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data
          this.detail = data.amsOwnershipObligee
          let attachment = []
          data.amsAttachmentList.forEach(item => {
            let obj = {
              url: item.attachmentPath,
              name: item.oldAttachmentName
            }
            attachment.push(obj)
          })
          this.detail.attachment = attachment
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  }
}
</script>

<style lang="less">
  .handlePropertyOwner {
    .edit-box {
      text-align: left;
      color: #49505E;
      padding: 15px 30px;
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
        position: relative;
        display: inline-block;
        width: 100%;
        .edit-box-content-item {
          width: 50%;
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
      }
    }
  }
  .no-footer {
    /deep/ .ant-modal-footer {
      display: none!important;
    }
  }
</style>