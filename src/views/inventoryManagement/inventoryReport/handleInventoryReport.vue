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
                v-if="editable"
                v-decorator="['taskId',
                {rules: [{required: true, message: '请选择关联资产'}], initialValue: detail.taskId}]"
              >
                <div slot="dropdownRender" slot-scope="menu"></div>
                <a-icon slot="suffixIcon" type="plus-circle" />
              </a-select>
              <span class="label-value" v-else>{{detail.taskName || '--'}}</span>
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
          <div class="edit-box-content-item total-width" v-show="detail.taskId">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">盘点结果描述<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <span class="label-value">盘点资产总数{{assetListCount.total}}个，正常资产{{assetListCount.normal}}个，未盘点{{assetListCount.unCount}}个，异常资产{{assetListCount.abnormal}}个（盘亏{{assetListCount.fail}}，盘盈{{assetListCount.success}}，信息有误{{assetListCount.error}}）</span>
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
      <div class="edit-box" v-show="detail.taskId">
        <div class="edit-box-title"><i></i><span>盘点结果列表</span></div>
        <div class="edit-box-content">
          <a-tabs type="card" :tabBarGutter="10">
            <a-tab-pane :tab="'异常资产(' + assetListCount.abnormal + ')'" key="1">
              <div class="header-container">
                <div class="count-description">异常总数：{{assetListCount.abnormal}}，盘亏{{assetListCount.fail}}，盘盈{{assetListCount.success}}，信息有误{{assetListCount.error}}</div>
                <div class="abnormal-type">
                  <a-checkbox :value="item.value" :key="index" :checked="abnormalAsset.abnormalType.indexOf(item.value) > -1" :disabled="abnormalAsset.abnormalType.indexOf(item.value) > -1 && abnormalAsset.abnormalType.length === 1" v-for="(item,index) in abnormalAsset.abnormalTypeOptions" @change="onAbnormalTypeChange">{{item.label}}</a-checkbox>
                </div>
              </div>
              <div class="tab-nav">
                <div class="table-border table-layout-fixed">
                  <a-table
                    :columns="abnormalAsset.columns"
                    :dataSource="abnormalAsset.dataSource"
                    class="custom-table td-pd10"
                    :pagination="false"
                  >
                    <template slot="operation" slot-scope="text, record">
                      <div v-if="editable">
                        <span v-if="+record.checkResult === 3" @click="handleAbnormalAssetList('delete', record)" class="btn_click mr15">删除</span>
                        <span @click="handleAbnormalAssetList('edit', record)" class="btn_click">编辑</span>
                      </div>
                      <div v-else>
                        <span @click="viewDetails(record)" class="btn_click">详情</span>
                      </div>
                    </template>
                  </a-table>
                  <SG-FooterPagination
                    :pageLength="abnormalAsset.paginator.pageLength"
                    :totalCount="abnormalAsset.paginator.totalCount"
                    :noPageTools="true"
                    v-model="abnormalAsset.paginator.pageNo"
                    @change="handleAbnormalAssetPageChange"
                  />
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane :tab="'未盘点资产(' + assetListCount.unCount + ')'" key="2">
              <div class="tab-nav">
                <div class="table-border table-layout-fixed">
                  <a-table
                    :columns="unCountAsset.columns"
                    :dataSource="unCountAsset.dataSource"
                    class="custom-table td-pd10"
                    :pagination="false"
                  >
                  </a-table>
                  <SG-FooterPagination
                    :pageLength="unCountAsset.paginator.pageLength"
                    :totalCount="unCountAsset.paginator.totalCount"
                    :noPageTools="true"
                    v-model="unCountAsset.paginator.pageNo"
                    @change="handleUnCountAssetPageChange"
                  />
                </div>
              </div>
            </a-tab-pane>
            <a-tab-pane :tab="'正常资产(' + assetListCount.normal + ')'" key="3">
              <div class="tab-nav">
                <div class="table-border table-layout-fixed">
                  <a-table
                    :columns="normalAsset.columns"
                    :dataSource="normalAsset.dataSource"
                    class="custom-table td-pd10"
                    :pagination="false"
                  >
                    <template slot="operation" slot-scope="text, record">
                      <div>
                        <span @click="viewDetails(record)" class="btn_click">详情</span>
                      </div>
                    </template>
                  </a-table>
                  <SG-FooterPagination
                    :pageLength="normalAsset.paginator.pageLength"
                    :totalCount="normalAsset.paginator.totalCount"
                    :noPageTools="true"
                    v-model="normalAsset.paginator.pageNo"
                    @change="handleNormalAssetPageChange"
                  />
                </div>
              </div>
            </a-tab-pane>
          </a-tabs>
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
    <!-- 选择所属任务 -->
    <choose-inventory-task ref="chooseInventoryTask" @chosenTaskIdFn="chosenTaskIdFn"></choose-inventory-task>
    <!-- 编辑异常盘点结果 -->
    <inventoryResultRegistration v-if="newShow" ref="irr" @showFn="showFn" @successQuery="successQueryFn"></inventoryResultRegistration>
    <!-- 登记盘盈资产 -->
    <assetsInventorySurplus v-if="assetsShow" ref="ats" @showFn="showFn" @successQuery="successQueryFn"></assetsInventorySurplus>
    <!-- 盘点结果详情 -->
    <viewDetails ref="vd" ></viewDetails>
  </div>
</template>

<script>
import FormFooter from '@/components/FormFooter'
import chooseInventoryTask from './chooseInventoryTask'
import inventoryResultRegistration from './../inventoryPerform/inventoryResultRegistration'
import assetsInventorySurplus from './../inventoryPerform/assetsInventorySurplus'
import viewDetails from './../inventoryPerform/viewDetails'

const abnormalColumns = [
  {
    title: '资产编码',
    dataIndex: 'assetCode'
  },
  {
    title: '资产名称',
    dataIndex: 'assetName'
  },
  {
    title: '盘点单号',
    dataIndex: 'resultId'
  },
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '所属资产项目',
    dataIndex: 'projectName'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName'
  },
  {
    title: '资产分类',
    dataIndex: 'objectTypeName'
  },
  {
    title: '所在位置',
    dataIndex: 'location'
  },
  {
    title: '盘点人',
    dataIndex: 'userNames'
  },
  {
    title: '盘点时间',
    dataIndex: 'checkTime'
  },
  {
    title: '异常类型',
    dataIndex: 'checkResultName'
  },
  {
    title: '异常说明',
    dataIndex: 'remark'
  },
  {
    title: '处理建议',
    dataIndex: 'handleRemark'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

const unCountColumns = [
  {
    title: '资产编码',
    dataIndex: 'assetCode'
  },
  {
    title: '资产名称',
    dataIndex: 'assetName'
  },
  {
    title: '盘点单号',
    dataIndex: 'resultId'
  },
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '所属资产项目',
    dataIndex: 'projectName'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName'
  },
  {
    title: '资产分类',
    dataIndex: 'objectTypeName'
  },
  {
    title: '所在位置',
    dataIndex: 'location'
  }
]

const normalColumns = [
  {
    title: '资产编码',
    dataIndex: 'assetCode'
  },
  {
    title: '资产名称',
    dataIndex: 'assetName'
  },
  {
    title: '盘点单号',
    dataIndex: 'resultId'
  },
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '所属资产项目',
    dataIndex: 'projectName'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName'
  },
  {
    title: '资产分类',
    dataIndex: 'objectTypeName'
  },
  {
    title: '所在位置',
    dataIndex: 'location'
  },
  {
    title: '盘点人',
    dataIndex: 'userNames'
  },
  {
    title: '盘点时间',
    dataIndex: 'checkTime'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' }
  }
]

export default {
  components: {
    FormFooter, chooseInventoryTask, inventoryResultRegistration, assetsInventorySurplus, viewDetails
  },
  data () {
    return {
      pageType: 'new',
      editable: false,
      form: this.$form.createForm(this),
      allStyle: 'width: 160px;',
      organId: '',
      organName: '',
      reportId: '',
      detail: {
        taskId: undefined,
        reportName: '',
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
      showInventoryTaskModal: false,
      assetListCount: {
        total: '', // 资产总数
        normal: '', // 正常资产数
        unCount: '', // 未盘点资产数
        abnormal: '', // 异常资产数
        fail: '', // 盘亏数
        success: '', // 盘盈数
        error: '' // 信息有误数
      },
      abnormalAsset: {
        abnormalType: [0, 2, 3],
        abnormalTypeOptions: [
          { label: '盘亏', value: 0 },
          { label: '盘盈', value: 3 },
          { label: '信息有误', value: 2 }
        ],
        columns: [...abnormalColumns],
        dataSource: [],
        paginator: {
          pageNo: 1,
          pageLength: 10,
          totalCount: 0
        }
      },
      unCountAsset: {
        columns: [...unCountColumns],
        dataSource: [],
        paginator: {
          pageNo: 1,
          pageLength: 10,
          totalCount: 0
        }
      },
      normalAsset: {
        columns: [...normalColumns],
        dataSource: [],
        paginator: {
          pageNo: 1,
          pageLength: 10,
          totalCount: 0
        }
      },
      newShow: false,
      assetsShow: false,
    }
  },
  methods: {
    dropdownVisibleChange (open) {
      this.showInventoryTaskModal = open
      if (open) {
        this.$refs.chooseInventoryTask.show = true
        this.$refs.chooseInventoryTask.redactCheckedDataFn(this.detail.taskId, this.detail.taskName)
      }
    },
    // 选择了所属任务
    chosenTaskIdFn (taskId, taskName) {
      console.log(taskId, taskName)
      this.detail.taskId = taskId
      this.form.setFieldsValue({
        taskId: taskId
      })
      this.inventoryTaskOptions = [{label: taskName, value: taskId}]
      this.$refs.chooseInventoryTask.show = false
      this.abnormalAsset.paginator.pageNo = 1
      this.unCountAsset.paginator.pageNo = 1
      this.normalAsset.paginator.pageNo = 1
      this.getAbnormalAssetList(1)
      this.getUnCountAssetList()
      this.getNormalAssetList()
    },
    // 获取异常资产列表
    getAbnormalAssetList (init) {
      this.getAssetList('1', this.abnormalAsset.abnormalType.join(','), this.abnormalAsset.paginator, init)
    },
    // 获取未盘点资产列表
    getUnCountAssetList () {
      this.getAssetList('0', '', this.unCountAsset.paginator)
    },
    // 获取正常资产列表
    getNormalAssetList () {
      this.getAssetList('1', '1', this.normalAsset.paginator)
    },
    getAssetList (checkStatus, checkResults, paginator, init) {
      let form = {
        taskId: this.detail.taskId,
        checkStatus: checkStatus,
        checkResults: checkResults,
        pageSize: paginator.pageLength,
        pageNum: paginator.pageNo
      }
      this.$api.inventoryManagementApi.assetCheckInstAsseDetail(form).then(res => {
        if (Number(res.data.code) === 0) {
          // 如果是初次调用默认异常资产，给数量赋值
          let data = res.data.data
          if (init) {
            this.assetListCount = {
              total: data.assetCount, // 资产总数
              normal: data.normalCount, // 正常资产数
              unCount: data.noCheckCount, // 未盘点资产数
              abnormal: data.exceptionCount, // 异常资产数
              fail: data.failCount, // 盘亏数
              success: data.successCount, // 盘盈数
              error: data.errorCount // 信息有误数
            }
            console.log(this.assetListCount)
          }
          let dataArr = res.data.data.data
          dataArr.forEach((item, index) => {
            item.key = index
            for (let key in item) {
              if (item[key] === '' || item[key] === null) {
                item[key] = '--'
              }
            }
          })
          // 如果是异常资产
          if (checkStatus === '1' && checkResults !== '1') {
            this.abnormalAsset.dataSource = dataArr
            this.abnormalAsset.paginator.totalCount = res.data.data.count
          }
          // 如果是未盘点资产
          if (checkStatus === '0') {
            this.unCountAsset.dataSource = dataArr
            this.unCountAsset.paginator.totalCount = res.data.data.count
          }
          // 如果是正常资产
          if (checkStatus === '1' && checkResults === '1') {
            this.normalAsset.dataSource = dataArr
            this.normalAsset.paginator.totalCount = res.data.data.count
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 异常资产类型发生改变
    onAbnormalTypeChange (e) {
      let index = this.abnormalAsset.abnormalType.indexOf(e.target.value)
      if (index === -1) {
        this.abnormalAsset.abnormalType.push(e.target.value)
      } else {
        this.abnormalAsset.abnormalType.splice(index, 1)
      }
      this.getAbnormalAssetList()
    },
    handleAbnormalAssetPageChange (data) {
      this.abnormalAsset.paginator.pageNo = data.pageNo
      this.abnormalAsset.paginator.pageLength = data.pageLength
      this.getAbnormalAssetList()
    },
    handleUnCountAssetPageChange (data) {
      this.unCountAsset.paginator.pageNo = data.pageNo
      this.unCountAsset.paginator.pageLength = data.pageLength
      this.getUnCountAssetList()
    },
    handleNormalAssetPageChange (data) {
      this.normalAsset.paginator.pageNo = data.pageNo
      this.normalAsset.paginator.pageLength = data.pageLength
      this.getNormalAssetList()
    },
    // 异常资产列表操作
    handleAbnormalAssetList (type, record) {
      console.log(type)
      console.log(record)
      if (type === 'edit') {
        // 盘盈编辑
        if (+record.checkResult === 3) {
          this.assetsShow = true
          this.$nextTick(() => {
            this.$refs.ats.show = true
            this.$refs.ats.query('set', record.resultId, '', this.detail.taskId, record.assetId, this.organId)
          })
        } else {
          this.newShow = true
          this.$nextTick(() => {
            this.$refs.irr.show = true
            this.$refs.irr.query('set', record.resultId, '', this.detail.taskId, record.assetId, true)
          })
        }
      } else {
        let _this = this
        _this.$confirm({
          title: '提示',
          content: '确认要删除该盘盈资产吗',
          onOk() {
            let obj = {
              resultId: record.resultId,  // 盘点单id
              checkResult: '3'
            }
            _this.$api.inventoryManagementApi.assetCheckInstDeleteByCheckResult(obj).then(res => {
              if (Number(res.data.code) === 0) {
                _this.$message.info(res.data.message)
                _this.successQueryFn()
              } else {
                _this.$message.error(res.data.message)
              }
            })
          }
        })
      }
    },
    // 异常资产清单编辑
    successQueryFn () {
      this.abnormalAsset.paginator.pageNo = 1
      this.getAbnormalAssetList()
    },
    showFn (val) {
      this.newShow = val
      this.assetsShow = val
    },
    // 查看资产详情
    viewDetails (record) {
      console.log(record)
      this.$refs.vd.show = true
      this.$refs.vd.query(record.resultId, '', this.detail.taskId, record.assetId)
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
      this.form.validateFields((err, values) => {
        if (!err) {
          let form = values
          form.organId = this.organId
          form.approvalStatus = approvalStatus
          let attachment = []
          this.detail.attachment.forEach(item => {
            let obj = {
              attachmentPath: item.url,
              oldAttachmentName: item.name
            }
            attachment.push(obj)
          })
          form.attachmentList = attachment
          console.log(form)
          if (this.pageType === 'edit') {
            form.reportId = this.reportId
          }
          this.$api.inventoryManagementApi.saveOrUpdate(form).then(res => {
            if (res.data.code === '0') {
              this.$message.success('提交成功')
              this.$router.push({path: '/inventoryManagement/inventoryReport', query: {refresh: true}})
            } else {
              this.$message.error(res.data.message)
            }
          })
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
    getDetail () {
      let form = {
        reportId: this.reportId
      }
      this.$api.inventoryManagementApi.detail(form).then(res => {
        if (res.data.code === '0') {
          console.log(res)
          let data = res.data.data
          this.organId = data.organId
          this.organName = data.organName
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
          this.inventoryTaskOptions = [{label: this.detail.taskName, value: this.detail.taskId}]
          this.getAbnormalAssetList(1)
          this.getUnCountAssetList()
          this.getNormalAssetList()
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  mounted () {
    this.pageType = this.$route.query.pageType
    this.editable = this.pageType === 'new' || this.pageType === 'edit'
    this.organId = this.$route.query.organId
    this.organName = this.$route.query.organName
    if (this.pageType !== 'new') {
      this.reportId = this.$route.query.reportId
      this.getDetail()
    }
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
        .header-container {
          position: relative;
          width: 100%;
          height: 35px;
          .count-description {
            float: left;
            padding-left: 10px;
            color: #fd7474;
          }
          .abnormal-type {
            float: right;
          }
        }
      }
    }
  }
</style>