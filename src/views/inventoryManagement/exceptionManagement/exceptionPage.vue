<!--
  异常管理的操作，包括异常处理、异常详情
-->
<template>
  <div class="exception-page">
    <a-form :form="form" @submit="handleSubmit">
      <div class="edit-box">
        <div class="edit-box-title"><i></i><span>异常处理登记</span></div>
        <div class="edit-box-content">
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">处理方式<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请选择处理方式"
                optionFilterProp="children"
                :style="allStyle"
                :options="$addTitle(handleWayOptions)"
                :filterOption="filterOption"
                v-decorator="['handleWay',
                {rules: [{required: true,  message: '请选择处理方式'}], initialValue: detail.handleWay}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.handleWayName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">状态<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.handleStatusName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">处理人<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.handleByName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">处理时间<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.handleTime || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">处理说明<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <a-textarea
                placeholder="请输入处理说明（最多200字）"
                :rows="3"
                v-if="editable"
                v-decorator="['handleRemark',
                {rules: [{validator: validateRemark}], initialValue: detail.handleRemark}]"></a-textarea>
              <span class="label-value" v-else>{{detail.handleRemark || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">附件<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <UploadFile
                type="all"
                :show="!editable"
                v-model="detail.attachment"/>
              <span class="file-null" v-if="!editable && detail.attachment.length === 0">--</span>
            </a-form-item>
          </div>
        </div>
      </div>
      <div class="edit-box">
        <div class="edit-box-title"><i></i><span>异常信息</span></div>
        <div class="edit-box-content">
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">资产编码<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.assetCode || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">资产名称<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.assetName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">所属机构<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.organName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">资产项目<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.projectName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">资产类型<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.assetTypeName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">资产分类<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.objectTypeName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">资产状态<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.statusName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">资产位置<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.location || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">异常编号<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.resultId || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">盘点任务<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.taskName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">异常类型<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.checkResultName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">提交人<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.userNames || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">提交时间<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.checkTime || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">异常说明<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.remark || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name">处理建议<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{exceptionInfo.handleTip || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name">图片<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <UploadFile
                type="all"
                :show="true"
                v-model="exceptionInfo.attachment"/>
              <span class="file-null" v-if="exceptionInfo.attachment.length === 0">--</span>
            </a-form-item>
          </div>
        </div>
      </div>
    </a-form>
    <form-footer v-show="pageType === 'handle'">
      <slot>
        <SG-Button type="primary" @click="handleSubmit">保存</SG-Button>
        <SG-Button @click="cancel">取消</SG-Button>
      </slot>
    </form-footer>
  </div>
</template>

<script>
import FormFooter from '@/components/FormFooter'
export default {
  components: {
    FormFooter
  },
  data () {
    return {
      pageType: 'handle',
      editable: true,
      form: this.$form.createForm(this),
      allStyle: 'width: 160px;',
      organId: '',
      resultId: '',
      handleWayOptions: [],
      detail: {
        handleWay: undefined,
        handleWayName: '',
        handleStatusName: '',
        handleByName: '',
        handleTime: '',
        handleRemark: '',
        attachment: []
      },
      exceptionInfo: {
        assetCode: '',
        assetName: '',
        organName: '',
        projectName: '',
        assetTypeName: '',
        objectTypeName: '',
        statusName: '',
        location: '',
        resultId: '',
        taskName: '',
        checkResultName: '',
        userNames: '',
        checkTime: '',
        remark: '',
        handleTip: '',
        attachment: []
      }
    }
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 校验备注
    validateRemark (rule, value, callback) {
      if (value.length > 200) {
        callback('备注长度不能超过200个字')
      } else {
        callback()
      }
    },
    handleSubmit () {
      this.form.validateFields((err, values) => {
        if (!err) {
          console.log(values)
          let form = values
          form.resultId = this.resultId
          form.handleStatus = 1
          let attachment = []
          this.detail.attachment.forEach(item => {
            let obj = {
              attachmentPath: item.url,
              oldAttachmentName: item.name
            }
            attachment.push(obj)
          })
          form.attachment = attachment
          let loadingName = this.SG_Loding('保存中...')
          this.$api.inventoryManagementApi.handleException(form).then(res => {
            if (res.data.code === '0') {
              this.DE_Loding(loadingName).then(() => {
                this.$SG_Message.success('保存成功')
                this.$router.push({path: '/inventoryManagement/exceptionManagement', query: {refresh: true}})
              })
            } else {
              this.DE_Loding(loadingName).then(() => {
                this.$message.error(res.data.message)
              })
            }
          })
        }
      })
    },
    // 取消
    cancel () {
      this.$router.push({path: '/inventoryManagement/exceptionManagement'})
    },
    getHandleWayOptions () {
      let form = {
        code: 'AMS_EXE_HANDLE_WAY',
        organId: this.organId
      }
      this.$api.basics.organDict(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.name,
              value: item.value
            }
            arr.push(obj)
          })
          this.handleWayOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getDetail () {
      let form = {
        resultId: this.resultId
      }
      if (this.pageType === 'detail') {
        this.$api.inventoryManagementApi.getCheckResultHandle(form).then(res => {
          console.log(res)
          if (res.data.code === '0') {
            let data = res.data.data
            this.detail = data
            let attachment = []
            this.detail.attachmentList.forEach(item => {
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
      this.$api.inventoryManagementApi.assetCheckInstFailDetail(form).then(res => {
        console.log(res)
        if (res.data.code === '0') {
          let data = res.data.data
          this.exceptionInfo = data
          let attachment = []
          this.exceptionInfo.attachmentList.forEach(item => {
            let obj = {
              url: item.attachmentPath,
              name: item.oldAttachmentName
            }
            attachment.push(obj)
          })
          this.exceptionInfo.attachment = attachment
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  mounted () {
    this.pageType = this.$route.query.pageType
    this.organId = this.$route.query.organId
    this.resultId = this.$route.query.resultId
    this.editable = this.pageType === 'handle'
    if (this.editable) {
      this.getHandleWayOptions()
    }
    this.getDetail()
  },
}
</script>

<style lang="less" scoped>
  .exception-page {
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
              width: 65px;
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
            width: calc(100% - 90px);
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
