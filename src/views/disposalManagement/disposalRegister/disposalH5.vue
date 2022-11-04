<template>
  <div class="countingTaskDetail">
    <div class="countingTaskDetail-nav">
      <!-- <span class="section-title blue">基本信息</span> -->
      <SG-Title title="基本信息"></SG-Title>
      <div class="countingTaskDetail-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="24">处置单编号：{{particularsData.disposeRegisterOrderId || '--'}}</a-col>
          <a-col class="playground-col" :span="24">资产处置名称：{{particularsData.disposeName || '--'}}</a-col>
          <a-col class="playground-col" :span="24">状态：{{particularsData.approvalStatusName || '--'}}</a-col>
          <a-col class="playground-col" :span="24">所属组织机构：{{particularsData.organName || '--'}}</a-col>
          <a-col class="playground-col" :span="24">资产项目：{{particularsData.projectName || '--'}}</a-col>
          <a-col class="playground-col" :span="24">资产类型：{{particularsData.assetTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="24">处置类型：{{particularsData.disposeTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="24">处置方式：{{particularsData.disposeModeName || '--'}}</a-col>
          <a-col class="playground-col" :span="24">处置时间：{{particularsData.disposeDate || '--'}}</a-col>
          <a-col class="playground-col" :span="24">处置成本(元)：{{conditionalJudgment.includes(particularsData.disposeCost) ? '--' : particularsData.disposeCost}}</a-col>
          <a-col class="playground-col" :span="24">处置收入(元)：{{conditionalJudgment.includes(particularsData.disposeReceive) ? '--' : particularsData.disposeReceive}}</a-col>
          <a-col class="playground-col" :span="24">资产接收人：{{particularsData.assetReceiver || '--'}}</a-col>
          <a-col class="playground-col" :span="24">提交人：{{particularsData.createByName || '--'}}</a-col>
          <a-col class="playground-col" :span="24">提交时间：{{particularsData.submitDate || '--'}}</a-col>
          <a-col class="playground-col" :span="24">处置原因：{{particularsData.disposeReason || '--'}}</a-col>
          <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
          <a-col class="playground-col" :class="{'files-style': files.length > 0}" :span="24">附件： <span v-if="files.length === 0">无</span>
            <div class="umImg" v-if="files.length > 0">
              <!-- <UploadFile
                v-model="files"
                type="all"
                :show="true"
              /> -->
              <div v-for="(item, index) in files" :key="index"><a  @click="download(item.url)">{{item.name}}</a></div>
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="countingTaskDetail-nav">
      <!-- <span class="section-title blue">资产处置清单 (资产总数：{{queryCondition.count || 0}})</span> -->
      <SG-Title title="资产处置清单"></SG-Title>
      <div class="countingTaskDetail-obj">
        <div class="table-layout-fixed table-border">
          <div class="asset-card" v-for="(item, index) in tableData" :key="index">
          <div style="margin: 10px">资产名称:  {{item.assetName}}</div>
          <div style="margin: 10px">资产编码:  {{item.assetCode}}</div>
          <div style="margin: 10px">资产分类:  {{item.assetCategoryName}}</div>
          <div style="margin: 10px">处置成本(元):  {{item.disposeCost}}</div>
          <div style="margin: 10px">处置收入(元):  {{item.disposeReceive}}</div>
          <div style="margin: 10px">是否需协助办证:  {{item.isAssistAccreditation==1 ? '是' : '否'}}</div>
         </div>
          <no-data-tips v-show="tableData.length === 0"></no-data-tips>
        </div>
      </div>
    </div>
    <div class="countingTaskDetail-nav">
      <!-- <span class="section-title blue">收付款计划</span> -->
      <SG-Title title="收付款计划"></SG-Title>
      <div class="countingTaskDetail-obj">
        <div class="table-layout-fixed table-border">
          <!-- <a-table
            :loading="loading"
            :columns="receivingColumnsData"
            :dataSource="inventoryReportData"
            class="custom-table td-pd10"
            :pagination="false"
            >
          </a-table> -->
          <div class="asset-card" v-for="(item, index) in inventoryReportData" :key="index">
          <div style="margin: 10px">收付款类型:  {{item.receivecostType}}</div>
          <div style="margin: 10px">收款方:  {{item.payee}}</div>
          <div style="margin: 10px">付款方:  {{item.payer}}</div>
          <div style="margin: 10px">费用科目:  {{item.feeSubject}}</div>
          <div style="margin: 10px">金额(元):  {{item.amount}}</div>
          <div style="margin: 10px">收付款时间:  {{item.receivecostDate}}</div>
          <div style="margin: 10px">跟进人:  {{item.secondMover}}</div>
         </div>
          <no-data-tips v-show="inventoryReportData.length === 0"></no-data-tips>
        </div>
      </div>
    </div>
    <!--审批轨迹-->
    <div class="countingTaskDetail-nav">
      <SG-Title title="审批轨迹" />
      <step
        v-stepstyleplus
        v-if="stepList.length"
        :stepList="stepList"
         @getFile="getFile"
        style="margin-left: 45px"
      />
      <div v-else style="text-align: center; margin: 25px 0">暂无数据</div>
    </div>
    <!-- <div class="countingTaskDetail-nav" v-if="isApprove">
      <SG-Title title="审核意见" />
      <a-textarea
        :rows="4"
        style="resize: none; margin-left: 45px"
        placeholder="请输入审核意见"
        v-model="advice"
      />
    </div> -->
    <!-- <div style="height: 70px"></div>
    <div v-if="isApprove">
      <form-footer location="fixed">
        <SG-Button type="primary" @click="handleBtn(1)">审批通过</SG-Button>
        <SG-Button
          type="dangerous"
          @click="handleBtn(0)"
          style="margin-right: 8px"
        >
          驳回
        </SG-Button>
      </form-footer>
    </div> -->
    <!-- <div class="footer-action" v-if="isApprove">
        <a-button type="primary" @click="handleBtn(1)" :loading="submitBtnLoading" block >审批通过</a-button>
          <SG-Button type="dangerous" @click="handleBtn(0)" :loading="submitBtnLoading" style="margin-right: 8px" block>驳回</SG-Button>
      </div> -->
  </div>
</template>

<script>
import FormFooter from "@/components/FormFooter";
import noDataTips from "@/components/noDataTips"
import {utils} from '@/utils/utils.js'
import Step from '@/components/step'
import uploadAndDownLoadFIle from "@/mixins/uploadAndDownLoadFIle";
import {h5Columns, h5Receiving, conditionalJudgment} from './beat.js'
import moment from "moment";
export default {
  components: {noDataTips, FormFooter,Step},
  mixins:[uploadAndDownLoadFIle],
  props: {},
  data () {
    return {
      organId: '',
      storeId: '',
      path: '',
      apprId: '',
      stepList:[],
      advice:'',
      isApprove: false,
      conditionalJudgment,
      detailData: '',
      inventoryAssetCount: 0,
      taskId: '',
      changeType: '',
      changeOrderId: '',
      particularsData: {},
      files: [],
      columnsData: [],
      receivingColumnsData: [],
      loading: false,
      tableData: [],              // 资产列表表格数据
      inventoryReportData: [],    // 盘点报告表格数据
      location: '',
      noPageTools: false,
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
        count: ''
      }
    }
  },
  computed: {
  },
  methods: {
    download (url) {
      window.parent.uhomeNativeApi.downloadFile(window.__configs.hostImg + url)
    },
    async init(){
        const { query: { instId, organId, disposeRegisterOrderId}, path } = this.$route
        // 嵌入bpm
        let busId = ''
        let relatedOrganId = ''
        if (instId){
          // 嵌套在 bpm 中时，关闭 面包屑
          this.$route.meta.noShowProBreadNav = true
          const req = {
            serviceOrderId: instId
          }
          const {data:{code,message,data}} = await this.$api.approve.getApprByServiceOrderId(req)
          if (code === '0'){
            // 返回的数据 busId 代表 入库单id
            busId = data.busId
            relatedOrganId = data.organId
          }else {
            this.$message.error(message)
          }
        }else {
          this.$route.meta.noShowProBreadNav = false
        }
        this.storeId = busId || disposeRegisterOrderId
        this.organId = relatedOrganId || organId
        if (this.storeId){
          this.query()
          this.getRegisterDetailListPage()
          this.getreceivecostPlanList()
          if (this.organId){
            // 资产处置 1006 硬编码
            // 详情页面也需要展示审批轨迹
            const req = {busType: 1006,busId:this.storeId,organId: this.organId}
            this.$api.approve.queryApprovalRecordByBus(req).then(({data:{code,message,data}})=>{
              if (code==='0'){
                // 旧数据不存在审批单，但是 code 为“0”
                if (message === '审批单不存在'){
                  if (path === '/disposalRegister/detailH5'){
                    this.isApprove  = true
                  }
                  this.isOld = true
                }else {
                  this.isOld = false
                  this.apprId = data.amsApprovalResDto.apprId
                  this.stepList = (data.approvalRecordResDtos || []).map(ele=>{
                    return {
                      date: ele.operDateStr ? moment(ele.operDateStr) : moment(),
                      title: ele.operOpinion,
                      desc: "", isDone: false, operation: [],
                    }
                  })
                  this.stepList.length && (this.stepList[0].isDone = true)
                  if (path === '/disposalRegister/detailH5'){
                    this.isApprove = data.amsApprovalResDto.isAbRole === 1
                  }
                }
              }else {
                this.$message.error(message)
              }
            })
          }
        }
      },
    queryApprovalRecordByBus(){
      const { organId, disposeRegisterOrderId } = this.detailData
      const req = {busType: 1006,busId:disposeRegisterOrderId,organId}
      this.$api.approve.queryApprovalRecordByBus(req).then(({data:{code,message,data}})=>{
        if (code==='0'){
          if (message === '审批单不存在'){
            if (this.detailData.type === 'approval'){
              this.isApprove  = true
            }
          }else {
            this.apprId = data.amsApprovalResDto.apprId
            this.stepList = (data.approvalRecordResDtos || []).map(ele=>{
              return {
                      date: ele.operDateStr
                        ? moment(ele.operDateStr)
                        : moment(),
                      title: ele.operOpinion,
                      desc: "",
                      isDone: false,
                      operation: ele.files&&ele.files.length>0?JSON.parse(ele.files).map(ele=>{
                        return{
                          buttonName:ele.name,
                          funcName:'getFile',
                          fileID:ele.id,
                          fileName:ele.name
                        }
                      }):[],
                    };
            })
            this.stepList.length && (this.stepList[0].isDone = true)
            if (this.detailData.type === 'approval'){
              this.isApprove = data.amsApprovalResDto.isAbRole === 1
            }
           
          }
        }else {
          this.$message.error(message)
        }
      })
    },
    //审批流程获取文件
    getFile(item){
      console.log(item)
       this.$api.approve.getFile({fileId:item.fileID});
    },
    // 按钮操作
    handleBtn(operResult) {
      if (operResult === 0) {
        if (!this.advice) {
          this.$message.error("驳回必填审核意见");
          return null;
        }
      }
      let req = {
        apprId: this.apprId,
        operResult,
        operOpinion: this.advice,
      };
      this.$api.approve
        .uniformSubmit(req)
        .then(({ data: res }) => {
          if (res && String(res.code) === "0") {
            this.$message.success(operResult ? "审批成功" : "驳回成功");
            // 跳回列表路由
            this.$router.go(-1);
          } else {
            throw res.message;
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error(err || `${operResult ? "审批失败" : "驳回失败"}`);
        });
    },
    // 资产列表分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.getRegisterDetailListPage()
    },
    // 查询详情
    query () {
      let obj = {
        disposeRegisterOrderId: this.storeId
      }
      this.$api.basics.getDisposeRegisterById(obj).then(res => {
        console.log(res)
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let files = []
          if (data.attachment && data.attachment.length > 0) {
              data.attachment.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.oldAttachmentName
              })
            })
          }
          this.files = files
          this.particularsData = data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产清单列表
    getRegisterDetailListPage () {
      this.loading = true
      let obj = {
        pageSize: 99999,//this.queryCondition.pageSize,
        pageNum: 1,//this.queryCondition.pageNum,
        disposeRegisterOrderId: this.storeId
      }
      this.$api.basics.getRegisterDetailListPage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
            item.assetCategoryName = item.objectTypeName
          })
          this.tableData = data
          this.queryCondition.count = res.data.data.count
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    // 收付款计划
    getreceivecostPlanList () {
      this.loading = true
      let obj = {
        disposeRegisterOrderId: this.storeId
      }
      this.$api.basics.getreceivecostPlanList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          data.forEach((item, index) => {
            item.key = index,
            item.indexKey = index + 1
            item.feeSubject = item.feeSubjectName
            item.receivecostType = item.receivecostTypeName
            item.payee = item.payee ? item.payee : '--'
            item.payer = item.payer ? item.payer : '--'
          })
          this.inventoryReportData = data
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    isMobile() {
      let flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|ios/i.test(navigator.userAgent)
      return flag
    }
  },
  created () {
    // 详情表头没有操作
    this.columnsData = utils.deepClone(h5Columns)
    this.receivingColumnsData = utils.deepClone(h5Receiving)
    this.init()
  },
  mounted () {
    this.detailData = this.$route.query;
    if (this.isMobile()) {
      // 关闭导航栏
      this.$route.meta.noShowProBreadNav = true
    }
  },
  beforeRouteEnter(to, from, next){
    console.log(to.path)
    to.meta.noShowProBreadNav = (to.path === '/disposalRegister/detailH5');
    next(vm =>{
      const {params:{ fromBpmApprove }} = from
      //vm.isApprove = detailData.type === 'approval' || false;
    })
  }
}
</script>
<style lang="less" scoped>
.countingTaskDetail {
  width: 100vw;
  .asset-card {
          border: 2px solid #000;
          font-size: 18px
        }
 .footer-action{
      z-index: 999999;
      position: sticky;
      bottom: 0;
      display: flex;
      justify-content: space-evenly;
      padding: 60px 0;
      height: 60px;
      button{
        height: 60px;
        font-size: 18px !important;
      }
    }
  .countingTaskDetail-nav{
   
    //  width: 100vw;
    // overflow-x: hidden;
    padding: 0 10px ;
     // padding: 20px 20px 0px 20px;
      .countingTaskDetail-obj {
        padding: 10px 0 0px 10px;
        .playground-row {
          .playground-col {
            line-height: 40px;
            font-size: 18px;
          }
        }
      }
      .correspondingTask {
        margin:35px 40px 0 40px;
        border: 1px solid #F0F2F5;
      }
  }
  .nav-box {
    padding-bottom: 100px;
  }
  .file {
    margin: 20px 0 0 40px;
  }
}
/deep/.ant-table-row{
    td{
    font-size: 18px !important;
    }
  }
/deep/.track-step{
    .time-item{
      .time, .date{
        font-size: 14px !important;
      }
    }
    .title,.desc{
      font-size: 14px !important;
    }
  }
/deep/.sg-title-text,/deep/.ant-table-column-title{
  font-size: 18px !important;
}
</style>
