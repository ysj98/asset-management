<!--
 * @Description: 
 * @Date: 2020-02-26 12:46:43
 * @LastEditTime: 2021-01-28 10:29:17
 -->
<template>
  <a-spin :spinning="spinning">
    <div class="inventoryPlan-create">
      <div class="edit-box">
        <div>
          <SG-Title noMargin title="资产信息" />
        </div>
        <!-- 由资产项目带出数据 -->
        <div class="edit-box-content">
          <!-- 一项数据 -->
           <div class="edit-box-content-item mb24">
             <div class="label-name-box">
              <span class="label-name label-space-between long">
                资产/卡片名称
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{reportInfo.assetName || reportInfo.cardName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
             <div class="label-name-box">
              <span class="label-name label-space-between long">
                资产/卡片编码
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{reportInfo.assetCode || reportInfo.cardCode || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产类型
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{reportInfo.assetTypeName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                所属机构
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{reportInfo.organName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产项目
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{reportInfo.projectName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产分类
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{reportInfo.assetCategoryName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产状态
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{reportInfo.assetStatusName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产位置
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{reportInfo.address || '-'}}</span>
            </div>
          </div>
        </div>
        <div>
          <SG-Title noMargin title="任务信息" />
        </div>
        <!-- 任务信息数据 -->
        <div>
           <div class="edit-box-content">
           <div class="edit-box-content-item mb24">
            <div class="label-name-box ">
              <span class="label-name label-space-between">
                任务编号
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.reportTaskId || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box ">
              <span class="label-name label-space-between">
                任务名称
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.taskName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box ">
              <span class="label-name label-space-between">
                任务状态
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.taskStatusName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                表单名称
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.reportBillName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box ">
              <span class="label-name label-space-between">
                填报人
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.reportByName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box ">
              <span class="label-name label-space-between">
                任务执行日期
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{`${taskInfo.beginDate || ''}~${taskInfo.endDate || ''}`}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                审核人
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.auditByName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                所属计划
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.reportPlanName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                任务类型
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.taskTypeName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                备注
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.remark || '-'}}</span>
            </div>
          </div>
         </div>
        </div>
        <div>
          <SG-Title noMargin title="填报详情" />
        </div>
        <!-- 填报详情数据 -->
        <div>
           <div class="edit-box-content">
           <div class="edit-box-content-item mb24">
            <div class="label-name-box ">
              <span class="label-name label-space-between">
                呈报编号
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{reportInfo.reportRecordId || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box ">
              <span class="label-name label-space-between">
                填报人
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.reportByName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box ">
              <span class="label-name label-space-between">
                填报日期
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.realBeginDate || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                审核人
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.auditByName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box ">
              <span class="label-name label-space-between">
                呈报方式
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.taskTypeName || '-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mb24">
            <div class="label-name-box ">
              <span class="label-name label-space-between">
                数据状态
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value" >{{taskInfo.taskStatusName || '-'}}</span>
            </div>
          </div>
          <!-- 资产运营 -->
          <template v-if="Number(taskInfo.reportBillId) === 1">
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  合同编号
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.contractCode || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  客户名称
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.customerName || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  资源名称
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.resourceName || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  租赁面积(㎡)
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.leaseArea || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  合同开始日期
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.contractBeginDate || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  合同截止日期
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.contractEndDate || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  起始租金单价
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.originRentUnitPriceAmount || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  平均租金单价
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.avgRentUnitPriceAmount || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  押金(元)
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.deposit || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between biglong">
                  合同租金总额(元)
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.contractRentTotalAmount || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  外部ID
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.objId || reportInfo.objectId || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  租赁用途
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.leaseUse || reportInfo.leaseUse || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  房屋ID
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.houseId || reportInfo.houseId || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  合同状态
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.contractStatus || reportInfo.contractStatus || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  备注
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.remark || '-'}}</span>
              </div>
            </div>
          </template>
          <!-- 资产收入 -->
          <template v-if="Number(taskInfo.reportBillId) === 2">
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  收入类型
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.incomeType || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  收入名称
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.incomeName || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  客户名称
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.customerName || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  所属月份
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.month || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  金额(元)
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.amount || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  单价
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.unitPrice || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  读数
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.readNumber || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  用量
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.useLevel || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  是否结清
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.settleUp || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between long">
                  是否接管前收入
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.incomeBeforeTakeover || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  外部ID
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.objId || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  备注
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.remark || '-'}}</span>
              </div>
            </div>
          </template>
          <!-- 资产费用 -->
          <template v-if="Number(taskInfo.reportBillId) === 3">
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  费用类型
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.expenseType || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  费用名称
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.expenseName || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  客户名称
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.customerName || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  所属月份
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.month || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  金额(元)
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.amount || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  单价
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.unitPrice || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  读数
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.readNumber || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  用量
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.useLevel || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  是否结清
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.settleUp || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between long">
                  是否接管前收入
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.expenseBeforeTakeover || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  外部ID
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.objId || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  备注
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.remark || '-'}}</span>
              </div>
            </div>
          </template>
          <!-- 资产折旧 -->
          <template v-if="Number(taskInfo.reportBillId) === 4">
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  折旧月份
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.deprecitionMonth || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between biglong">
                  本次折旧金额(元)
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.deprecitionAmount || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  外部ID
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.objId || '-'}}</span>
              </div>
            </div>
            <div class="edit-box-content-item mb24">
              <div class="label-name-box">
                <span class="label-name label-space-between">
                  备注
                  <i></i>
                </span>
                <span>：</span>
                <span class="label-value" >{{reportInfo.remark || '-'}}</span>
              </div>
            </div>
          </template>
         </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script>
let getUuid = ((uuid = 1) => () => ++uuid)()
const allStyle = { width: "200px" }
export default {
  data () {
    return {
      spinning: false,
      allStyle,
      type: 'create',
      checkNick: false,
      reportBillId: '', // 填报类型
      reportTaskId: '', // 任务类型
      reportRecordId: '', // 呈报记录id
      billType: '',
      taskInfo: {},
      reportInfo: {}
    }
  },
  created () {
    this.type = this.$route.query.type || ''
    this.reportRecordId = this.$route.query.reportRecordId || ''
    this.reportBillId = this.$route.query.reportBillId || ''
    this.reportTaskId = this.$route.query.reportTaskId || ''
    this.billType = this.$route.query.billType
    if (this.reportRecordId) {
      this.spinning = true
      Promise.all([this.queryReportRecordDetail(), this.queryTaskInfo()]).then(res => {
        this.spinning = false
      })    
    }
  },
  methods: {
    queryTaskInfo () {
      let data = {
        reportTaskId: this.reportTaskId
      }
      return this.$api.reportManage.queryTaskInfo(data).then(res => {
        if (res.data.code === "0") {
          let obj = res.data.data || {}
          this.taskInfo = {...obj}
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    queryReportRecordDetail () {
      let data = {
        reportRecordId: this.reportRecordId,
        billType: this.billType
      }
      return this.$api.reportManage.queryReportRecordDetail(data).then(res => {
        if (res.data.code === "0") {
          let obj = res.data.data || {}
          obj.objId = obj.objId || obj.objectId || '-'
          this.reportInfo =  {...obj}
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    handleChange (e) {
     this.checkNick = e.target.checked;
    },
  }
}
</script>
<style lang="less" scoped>
.inventoryPlan-create {
  padding: 40px 100px 110px 95px;
  position: relative;
  .edit-box {
    text-align: left;
    color: #49505e;
    margin-bottom: 16px;
    .edit-box-content {
      padding: 30px 0px 0 40px;
      position: relative;
      display: inline-block;
      width: 100%;
      .edit-box-content-item {
        width: 33%;
        float: left;
        font-size: 12px;
        &.mb24{
          margin-bottom:24px;
        }
        &.total-width {
          width: 100%;
          .label-value {
            float: left;
            width: calc(100% - 125px);
          }
        }
        .label-name-box {
          float: left;
          line-height: 34px;
          .label-name {
            height: 34px;
            font-family: PingFang-SC-Regular;
            color: #282d5b;
            margin-right: 3px;
            float: left;
            span {
              float: left;
            }
          }
          .label-space-between {
            width: 74px;
            &.long{
              width: 84px;
            }
            &.biglong{
              width: 100px;
            }
            text-align: justify;
            margin-left: 10px;
            i {
              display: inline-block;
              width: 100%;
            }
          }
        }
      }
    }
  }
}
.detail-table {
  position: relative;
  border-left: 1px solid rgba(238, 242, 245, 1);
  border-right: 1px solid rgba(238, 242, 245, 1);
}
.btn-delete {
  color: #f5222d;
  cursor: pointer;
}
.label-value{
}
</style>
