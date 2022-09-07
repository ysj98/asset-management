<!--
  权属人新建、编辑、详情弹窗
-->
<template>
  <SG-Modal
    class="handlePropertyOwner"
    :width="modal.width"
    v-model="modal.show"
    :title="modal.title"
    @ok="handleSubmit"
    @cancel="handleCancel"
  >
  <div slot="footer" v-show="editable">
        <SG-Button key="submit" type="primary"  @click="handleSubmit">
          提交
        </SG-Button>
        <SG-Button key="back" @click="handleCancel">
          取消
        </SG-Button>
      </div>
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
                :options="$addTitle(obligeeTypeOptions)"
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
                :options="$addTitle(certificateTypeOptions)"
                @change="changeCertificateType"
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
                {rules: [{required: true, max: 40, whitespace: true, message: '请输入证件号码(长度最多为40)'}, {validator: validateCertificateNo}], initialValue: detail.certificateNo}]"/>
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
                {rules: [{max: 100, whitespace: true, message: '邮编长度最多为100'}, {validator: validatePostalCode}], initialValue: detail.postalCode}]"/>
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
                {rules: [{max: 30, whitespace: true, message: '联系方式长度最多为30'}, {validator: validateTel}], initialValue: detail.legalAgentTel}]"/>
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
                {rules: [{max: 30, whitespace: true, message: '联系方式长度最多为30'}, {validator: validateTel}], initialValue: detail.agentTel}]"/>
              <span class="label-value" v-else>{{detail.agentTel || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">备注<i></i></span><span>：</span></div>
            <a-form-item>
              <a-textarea
                class="label-value"
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
            <a-form-item>
              <SG-UploadFile
                type="all"
                :show="!editable"
                v-model="detail.attachment"/>
              <span class="file-null" v-if="!editable && detail.attachment.length === 0">--</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-if="checkNick">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">AppID<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入AppID"
                :style="allStyle"
                :max="60"
                v-if="editable"
                v-decorator="['appId',
                {rules: [{max: 60, whitespace: true, message: 'AppID长度最多为60'} ], initialValue: detail.appId}]"/>
              <span class="label-value" v-else>{{detail.appId || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-if="checkNick">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">秘钥<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入秘钥"
                :style="allStyle"
                :max="60"
                v-if="editable"
                v-decorator="['secretKey',
                {rules: [{max: 60, whitespace: true, message: '秘钥长度最多为60'} ], initialValue: detail.secretKey}]"/>
              <span class="label-value" v-else>{{detail.secretKey || '--'}}</span>
            </a-form-item>
          </div>
        </div>
      </div>
    </a-form>
  </SG-Modal>
</template>

<script>
import { reg } from '@/config/config.rules'
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
      checkNick: false,
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
        attachment: [],
        appId: '',
        secretKey: ''
      },
      obligeeTypeOptions: [],
      certificateTypeOptions: []
    }
  },
  watch: {
    modalType (val) {
      if (val === 'detail') {
        this.editable = false
      } else {
        this.editable = true
      }
        console.log(this.editable)
    },
    'modal.show' (val) {
      if (val) {
        switch (this.modalType) {
          case 'new': this.modal.title = '新建权属人'
            break
          case 'edit': this.modal.title = '编辑权属人'
            break
          case 'detail': this.modal.title = '权属人详情'
            break
          default: break
        }
        if (this.modalType === 'edit' || this.modalType === 'detail') {
          this.getDetail()
        }
      } else {
        if (this.editable) {
          this.form.setFieldsValue({
            obligeeName: '',
            currentOrgan: 1,
            obligeeType: undefined,
            certificateType: undefined,
            certificateNo: '',
            mailingAddress: '',
            postalCode: '',
            legalAgent: '',
            legalAgentTel: '',
            agent: '',
            agentTel: '',
            remark: ''
          })
        }
        this.detail.attachment = []
      }
    },
    organId (val) {
      if (val) {
        this.getApproveConfig()
      }
    }
  },
  methods: {
    changeCertificateType (value) {
      console.log(reg.idCard)
      let str = '440881199512223561'
      console.log(reg.idCard.test(str))
      console.log('切换证件类型', value)
      this.detail.certificateType = value
    },
    // 校验证件号码
    validateCertificateNo (rule, value, callback) {
      if (value) {
        // 校验身份证号码
        if (+this.detail.certificateType === 1) {
          if (!reg.idCard.test(value)) {
            callback('请输入有效的身份证号码')
          }
        }
        // 校验统一社会信用代码
        if (+this.detail.certificateType === 2) {
          if (!this.checkSocialCreditCode(value)) {
            callback('请输入有效的统一信用代码')
          }
        }
        // 校验护照
        if (+this.detail.certificateType === 3) {
          if (!reg.passport.test(value)) {
            callback('请输入有效的护照号码')
          }
        }
      }
      callback()
    },
    // 校验邮编
    validatePostalCode (rule, value, callback) {
      if (value) {
        if (!reg.postalCode.test(value)) {
          callback('请输入有效的邮编')
        }
      }
      callback()
    },
    // 校验联系方式
    validateTel (rule, value, callback) {
      let reg = /^((0\d{2,3}-\d{7,8})|(1[3456789]\d{9}))$/
      if (value) {
        if (!reg.test(value)) {
          callback('请输入有效的联系方式')
        }
      }
      callback()
    },
    // 校验统一社会信用代码
    checkSocialCreditCode (Code) {
      let patrn = /^[0-9A-Z]+$/
      //18位校验及大写校验
      if ((Code.length !== 18) || (patrn.test(Code) === false)) {
        console.info("不是有效的统一社会信用编码！")
        return false
      } else {
        let Ancode //统一社会信用代码的每一个值
        let Ancodevalue //统一社会信用代码每一个值的权重
        let total = 0
        let weightedfactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28] //加权因子
        let str = '0123456789ABCDEFGHJKLMNPQRTUWXY'
        // 不用I、O、S、V、Z
        for (let i = 0; i < Code.length - 1; i++) {
          Ancode = Code.substring(i, i + 1)
          Ancodevalue = str.indexOf(Ancode)
          total = total + Ancodevalue * weightedfactors[i]
          // 权重与加权因子相乘之和
        }
        let logiccheckcode = 31 - total % 31
        if (logiccheckcode === 31) {
          logiccheckcode = 0
        }
        let Str = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y'
        let Array_Str = Str.split(',')
        logiccheckcode = Array_Str[logiccheckcode]

        let checkcode = Code.substring(17, 18)
        if (logiccheckcode != checkcode) {
          // console.info("不是有效的统一社会信用编码！")
          return false
        } else{
          // console.info("yes")
        }
        return true
      }
    },
    // 获取权属人类型下拉列表
    getObligeeTypeOptions () {
      let form = {
        code: 'AMS_OBLIGEE_TYPE'
      }
      this.$api.basics.platformDict(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.name,
              value: +item.value
            }
            arr.push(obj)
          })
          this.obligeeTypeOptions = arr
        } else {
          this.$error({
            title: '提示',
            content: res.data.message
          })
        }
      })
    },
    // 获取证件类型下拉列表
    getCertificateTypeOptions () {
      let form = {
        code: 'AMS_CERTIFICATE_TYPE'
      }
      this.$api.basics.platformDict(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.name,
              value: +item.value
            }
            arr.push(obj)
          })
          this.certificateTypeOptions = arr
        } else {
          this.$error({
            title: '提示',
            content: res.data.message
          })
        }
      })
    },
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
          this.$api.assets.saveOrUpdateOwner(form).then(res => {
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
          if (this.editable) {
            this.form.setFieldsValue({
              obligeeName: this.detail.obligeeName,
              currentOrgan: this.detail.currentOrgan,
              obligeeType: this.detail.obligeeType,
              certificateType: this.detail.certificateType,
              certificateNo: this.detail.certificateNo,
              mailingAddress: this.detail.mailingAddress,
              postalCode: this.detail.postalCode,
              legalAgent: this.detail.legalAgent,
              legalAgentTel: this.detail.legalAgentTel,
              agent: this.detail.agent,
              agentTel: this.detail.agentTel,
              remark: this.detail.remark
            })
          }
          console.log(this.detail)
        } else {
          this.$error({
            title: '提示',
            content: res.data.message
          })
        }
      })
    },
    // 获取是否AppID , 秘钥 设置 checkNick
    async getApproveConfig(){
      let { data:{ code,data } } = await this.$api.paramsConfig.queryParamsConfigDetail({
        // 参考 serviceTypeAll.js 文件
        serviceType: 1014,
        organId: this.organId,
      })
      if (code === "0"){
        const {isValid} = data
        if( isValid === 1){
          this.checkNick = true
        }
      }
    },
  },
  mounted () {
    this.getObligeeTypeOptions()
    this.getCertificateTypeOptions()
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
          /*width: 50%;*/
          width: 312px;
          float: left;
          font-size: 12px;
          &:nth-child(2n + 1) {
            margin-right: 116px;
          }
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
            margin-left: 98px;
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
  // .no-footer {
  //   /deep/ .sg-modal .ant-modal-footer {
  //     display: none ;
  //   }
  // }
</style>
