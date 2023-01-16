<!--
  出库单的操作，包括新增，编辑，审核，详情
-->
<template>
  <div class="handle-clear-form">
    <a-form :form="form" @submit="handleSubmit">
      <div class="edit-box">
        <div class="edit-box-title"><i></i><span>基础信息</span></div>
        <div class="edit-box-content">
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">出库单名称<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入出库单名称"
                :style="allStyle"
                :max="30"
                v-if="editable"
                v-decorator="['cleaningOrderCode',
                {rules: [{required: true, max: 30, whitespace: true, message: '请输入出库单编号(不超过30字符)'}], initialValue: detail.cleaningOrderCode}
              ]"/>
              <span class="label-value" v-else>{{detail.cleaningOrderCode || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">资产项目<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请选择资产项目"
                optionFilterProp="children"
                :style="allStyle"
                :options="$addTitle(projectIdOptions)"
                :filterOption="filterOption"
                @change="changeProjectId"
                v-decorator="['projectId',
                {rules: [{required: true,  message: '请选择资产项目'}], initialValue: detail.projectId}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.projectName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">资产类型<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请选择资产类型"
                optionFilterProp="children"
                :style="allStyle"
                :options="$addTitle(assetTypeOptions)"
                :filterOption="filterOption"
                @change="changeAssetType"
                v-decorator="['assetType',
                {rules: [{required: true,  message: '请选择资产类型'}], initialValue: detail.assetType}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.assetTypeName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">出库原因<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请选择出库原因"
                optionFilterProp="children"
                :style="allStyle"
                :options="$addTitle(cleanupTypeOptions)"
                :filterOption="filterOption"
                v-decorator="['cleanupType',
                {rules: [{required: true,  message: '请选择出库原因'}], initialValue: detail.cleanupType}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.cleanupTypeName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">所属机构<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input :style="allStyle" v-model="organName" type="text" disabled v-if="editable"></a-input>
              <span class="label-value" v-else>{{organName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">创建人<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.createByName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">创建时间<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{formatDate(detail.createTime) || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">备注<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.remark || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width" v-show="editable">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">备注<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <a-textarea
                placeholder="请输入描述（最多200字）"
                :rows="3"
                v-decorator="['remark',
                {rules: [{validator: validateRemark}], initialValue: detail.remark}]"></a-textarea>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">附件<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <UploadFile
                :baseImgURL="configBase.hostImg1"
                v-model="detail.attachment"
                :show="!editable"
                type="all"
                :max="5"
                :maxSize="20480"
                :customDownload="(value)=>{
                  return customDownload(value,$api.ownership.downLoadAnnex)
                }"
                  :customUpload="(value)=>{
                  return customUpload(value,$api.ownership.uploadAnnex)
                }"
                />
              <!-- <UploadFile
                type="all"
                :show="!editable"
                v-model="detail.attachment"/> -->
              <span class="file-null" v-if="!editable && detail.attachment.length === 0">--</span>
            </a-form-item>
          </div>
        </div>
      </div>
      <div class="edit-box">
        <div class="edit-box-title"><i></i><span>资产明细</span></div>
        <div class="edit-box-content table-border" style="padding-bottom: 50px">
          <div class="table-header-btn" v-show="editable">
            <SG-Button type="primary" weaken @click="addAsset">添加资产</SG-Button>
          </div>
          <a-table
            :columns="columnsCom"
            :dataSource="dataSource"
            size="middle"
            :pagination="false"
          >
            <template slot="operation" slot-scope="text, record">
              <a class="operation-btn" @click="deleteFn(record)">删除</a>
            </template>
          </a-table>
          <div class="table-space-pagination"></div>
          <SG-FooterPagination
            v-if="!editable"
            :pageLength="paginator.pageLength"
            :totalCount="paginator.totalCount"
            location="absolute"
            v-model="paginator.pageNo"
            @change="handlePageChange"
          />
        </div>
      </div>
    </a-form>
    <!--审批轨迹-->
    <div v-if="pageType === 'detail' || pageType === 'audit'">
      <SG-Title title="审批轨迹"/>
      <SG-TrackStep v-stepstyleplus v-if="stepList.length" :stepList="stepList" style="margin-left: 45px"/>
      <div v-else style="text-align: center; margin: 25px 0">暂无数据</div>
    </div>
    <div v-if="isApprove">
      <SG-Title title="审核意见"/>
      <a-textarea :rows="4" style="resize: none; margin-left: 45px" placeholder="请输入审核意见" v-model="advice"/>
    </div>
    <div style="height: 70px;"></div>
    <form-footer v-show="pageType === 'new' || pageType === 'edit'">
      <slot>
        <SG-Button type="primary" @click="handleSubmit(1)">提交</SG-Button>
        <SG-Button type="primary" weaken @click="handleSubmit(0)">保存草稿</SG-Button>
        <SG-Button @click="cancel">取消</SG-Button>
      </slot>
    </form-footer>
    <form-footer v-show="isApprove" leftButtonName="审核通过" rightButtonName="驳回" rightButtonType="danger" @save="handleApprove(1)" @cancel="handleApprove(0)">
    </form-footer>
    <!-- 选择资产 -->
    <AssetBundlePopover ref="assetBundlePopover" :organId="organId" queryType="2" @status="status" v-if="editable"></AssetBundlePopover>
  </div>
</template>

<script>
import configBase from "@/config/config.base";
import FormFooter from '@/components/FormFooter'
import AssetBundlePopover from '../../common/assetBundlePopover'
import uploadAndDownLoadFIle from "@/mixins/uploadAndDownLoadFIle";
import SGUploadFilePlus from '@/components/SGUploadFilePlus'
import {dateToString} from 'utils/formatTime'
import moment from "moment";
const defaultColumns = [
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: '160'
  },
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: '160'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: '160'
  },
  {
    title: '资产项目名称',
    dataIndex: 'projectName',
    width: '160'
  },
  {
    title: '所在位置',
    dataIndex: 'address',
    width: '160'
  },
  {
    title: '面积(㎡)',
    dataIndex: 'assetArea',
    width: '160'
  },
  {
    title: '资产状态',
    dataIndex: 'assetStatusName',
    width: '160'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }]
export default {
  mixins:[uploadAndDownLoadFIle],
  components: {
    FormFooter, AssetBundlePopover, SGUploadFilePlus
  },
  data () {
    return {
      configBase,
      advice:'',
      stepList:[],
      isApprove: false,
      apprId:'',
      assetType:'',
      pageType: 'new',
      editable: false,
      form: this.$form.createForm(this),
      allStyle: 'width: 160px;',
      organId: '',
      organName: '',
      cleaningOrderId: '',
      detail: {
        cleaningOrderCode: '',
        projectId: undefined,
        projectName: '',
        assetType: undefined,
        assetTypeName: '',
        cleanupType: undefined,
        cleanupTypeName: '',
        createByName: '',
        createTime: '',
        remark: '',
        attachment: []
      },
      projectIdOptions: [],
      assetTypeOptions: [],
      cleanupTypeOptions: [],
      columns: [...defaultColumns],
      dataSource: [],
      checkedData: [],
      audit: {
        auditor: '',
        auditTime: '',
        auditOpinion: ''
      },
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0
      }
    }
  },
  computed:{
    isSelectedEquipment(){
      return String(this.assetType) === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT
    },
    columnsCom(){
      if (this.isSelectedEquipment){
        return this.columns.filter(ele=>(ele.dataIndex || ele.key) !== 'assetArea')
      }else {
        return this.columns
      }
    }
  },
  methods: {
    formatDate (value) {
      if (value) {
        return dateToString(new Date(value), 'yyyy-mm-dd')
      }
      return ''
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 资产项目发生变化
    changeProjectId () {
      this.dataSource = []
      this.checkedData = []
    },
    // 资产类型发生变化
    changeAssetType (value) {
      this.dataSource = []
      this.checkedData = []
      this.assetType = value
    },
    // 页码发生变化
    handlePageChange (page) {
      this.paginator.pageNo = page.pageNo
      this.paginator.pageLength = page.pageLength
      this.getAssetDetailList()
    },
    // 获取资产项目下拉列表
    getProjectIdOptions () {
      let form = {
        organId: this.organId
      }
      this.$api.assets.getObjectKeyValueByOrganId(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.projectName,
              value: item.projectId
            }
            arr.push(obj)
          })
          this.projectIdOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取资产类型下拉列表
    getAssetTypeOptions () {
      let form = {
        code: 'asset_type'
      }
      this.$api.basics.platformDict(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.name,
              value: item.value
            }
            arr.push(obj)
          })
          this.assetTypeOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取资产出库原因下拉列表
    getCleanupTypeOptions() {
      let form = {
        code: 'asset_cleanup_type',
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
          this.cleanupTypeOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 添加资产
    addAsset () {
      if (!this.form.getFieldValue('projectId')) {
        this.$message.info('请先选择资产项目')
        return
      }
      if (!this.form.getFieldValue('assetType')) {
        this.$message.info('请先选择资产类型')
        return
      }
      this.$refs.assetBundlePopover.redactCheckedDataFn(this.checkedData, this.form.getFieldValue('projectId'), this.form.getFieldValue('assetType'), this.dataSource)
      this.$refs.assetBundlePopover.show = true
    },
    // 资产变动时
    status (val, data) {
      this.checkedData = [...val]
      data.forEach((item, index) => {
        item.key = index.toString()
      })
      this.dataSource = data
      this.$refs.assetBundlePopover.show = false
    },
    // 删除
    deleteFn (record) {
      this.dataSource.forEach((item, index) => {
        if (item.assetId === record.assetId) {
          this.dataSource.splice(index, 1)
        }
      })
      this.checkedData.forEach((item, index) => {
        if (record.assetId === item) {
          this.checkedData.splice(index, 1)
        }
      })
    },
    // 校验备注
    validateRemark (rule, value, callback) {
      if (value.length > 200) {
        callback('备注长度不能超过200个字')
      } else {
        callback()
      }
    },
    // 新增编辑提交
    handleSubmit (saveType) {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.dataSource.length === 0) {
            this.$message.info('资产明细列表不能为空')
            return
          }
          let form = {
            organId: this.organId,
            cleaningOrderCode: values.cleaningOrderCode,
            projectId: values.projectId,
            assetType: values.assetType,
            cleanupType: values.cleanupType,
            remark: values.remark,
            saveType: saveType
          }
          let attachment = []
          this.detail.attachment.forEach(item => {
            let obj = {
              attachmentPath: item.url,
              oldAttachmentName: item.name,
              fileSources: 1
            }
            attachment.push(obj)
          })
          form.attachment = attachment
          let arr = []
          this.dataSource.forEach(item => {
            let obj = {
              assetId: item.assetId,
              projectId: item.projectId,
              assetType: values.assetType,
              assetObjectId: item.assetObjectId
            }
            arr.push(obj)
          })
          form.assetDetailList = arr
          if (this.pageType === 'edit') {
            form.cleaningOrderId = this.cleaningOrderId
          }
          this.$api.assets.submitCleanup(form).then(res => {
            if (res.data.code === '0') {
              this.$message.success('提交成功')
              this.$router.push({path: '/assetClear', query: {refresh: true}})
            } else {
              this.$message.error(res.data.message)
            }
          })
        }
      })
    },
    // 提交审核
    submitAudit () {
    },
    // 取消
    cancel () {
      this.$router.push({path: '/assetClear'})
    },
    // 出库审批 待联调
    handleApprove(operResult){
      if (operResult === 0){
        if (!this.advice){
          this.$message.error('驳回必填审核意见')
          return null
        }
      }
      const req = {
        apprId: this.apprId,
        operResult,
        operOpinion: this.advice
      }
      this.$api.approve.uniformSubmit(req).then(({data: res}) => {
        if (res && String(res.code) === '0') {
          this.$message.success('操作成功')
          this.$router.push({path: '/assetClear', query: {refresh: true}})
        }else {
          throw res.message
        }
      }).catch(err => {
        console.error(err)
        this.$message.error('操作失败')
      })

    },
    getEditDetail () {
      let form = {
        cleaningOrderId: this.cleaningOrderId
      }
      this.$api.assets.getCleanupInfo(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data
          this.detail = data
          this.assetType = data.assetType
          this.organId = data.organId
          this.organName = data.organName
          this.detail.attachment.forEach(item => {
            item.url = item.attachmentPath
            item.name = item.oldAttachmentName
          })
          this.detail.assetType = this.detail.assetType.toString()
          this.detail.cleanupType = this.detail.cleanupType.toString()
          let checkedData = []
          this.detail.assetDetailList.forEach((item, index) => {
            item.key = index.toString()
            checkedData.push(item.assetId)
          })
          this.checkedData = checkedData
          this.dataSource = this.detail.assetDetailList
        }
      })
    },
    getDetail () {
      let form = {
        cleaningOrderId: this.cleaningOrderId
      }
      this.$api.assets.getCleanupDetail(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data
          let resKey = ''
          Object.keys(this.$store.state.ASSET_TYPE_STRING).forEach(ele=>{
            if (this.$store.state.ASSET_TYPE_STRING[ele] === data.assetTypeName){
              resKey = ele
            }
          })
          this.assetType = this.$store.state.ASSET_TYPE_CODE[resKey]
          this.organName = data.organName
          this.detail = data
          this.detail.attachment.forEach(item => {
            item.url = item.attachmentPath
            item.name = item.oldAttachmentName
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getAssetDetailList () {
      let form = {
        cleaningOrderId: this.cleaningOrderId,
        pageNum: this.paginator.pageNo,
        pageSize: this.paginator.pageLength
      }
      this.$api.assets.getCleanupDetailPage(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index.toString()
          })
          this.dataSource = data
          this.paginator.totalCount = res.data.data.count
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    async init(){
      const { query: { instId } } = this.$route
      let obj = this.$route.query
      if (instId){
        this.$route.meta.noShowProBreadNav = true
        const req = {
          serviceOrderId: instId
        }
        const {data:{code,message,data}} = await this.$api.approve.getApprByServiceOrderId(req)
        if (code === '0'){
          console.log('data',data)
          obj = data
          Object.assign(obj,data)
          obj.pageType = 'audit'
          obj.cleaningOrderId = data.busId
        }else {
          this.$message.error(message)
        }
      }else {
        this.$route.meta.noShowProBreadNav = false
      }

      this.pageType = obj.pageType
      this.editable = this.pageType === 'new' || this.pageType === 'edit'
      this.organId = obj.organId
      this.organName = obj.organName
      if (this.editable) {
        this.getProjectIdOptions()
        this.getAssetTypeOptions()
        this.getCleanupTypeOptions()
      }
      if (this.pageType !== 'new') {
        this.cleaningOrderId = obj.cleaningOrderId
        if (this.pageType === 'edit') {
          this.getEditDetail()
        } else {
          this.getDetail()
          this.getAssetDetailList()
        }
        // 暂时不需要审批轨迹，所以只有是审批页面才调用接口
          if (this.pageType === 'audit' || this.pageType === 'detail'){
            console.log('this.$route.query.relatedOrganId',this.$route.query.relatedOrganId)
            const req = {busType: 1002,busId:this.cleaningOrderId,organId: this.$route.query.relatedOrganId || obj.organId}
            this.$api.approve.queryApprovalRecordByBus(req).then(({data:{code,message,data}})=>{
              if (code==='0'){
                console.log('data',data)
                this.apprId = data.amsApprovalResDto.apprId
                this.stepList = (data.approvalRecordResDtos || []).map(ele=>{
                  return {
                    date: ele.operDateStr ? moment(ele.operDateStr) : moment(),
                    title: ele.operOpinion,
                    desc: "", isDone: false, operation: [],
                  }
                })
                this.stepList.length && (this.stepList[0].isDone = true)
                if (this.pageType === 'audit'){
                  this.isApprove = data.amsApprovalResDto.isAbRole === 1
                }
              }else {
                this.$message.error(message)
              }
            })
          }
      }
      if (!this.editable) {
        this.columns = this.columns.slice(0, this.columns.length - 1)
      }
    }
  },
  mounted () {
    this.init()
  }
}
</script>

<style lang="less" scoped>
  .handle-clear-form {
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
