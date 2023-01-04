<!--
  详情: particulars
  审核: audit  一期暂时不做审核和审核轨迹
-->
<template>
  <div class="particulars">
    <div class="particulars-nav">
      <span class="section-title blue">基本信息</span>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="8">变更单编号：{{particularsData.changeOrderId || '--'}}</a-col>
          <a-col class="playground-col" :span="8">变更单名称：{{particularsData.title || '--'}}</a-col>
          <a-col
            class="playground-col"
            :span="8"
          >当前状态：{{particularsData.approvalStatusName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">所属机构：{{particularsData.organName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产项目：{{particularsData.projectName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产类型：{{particularsData.assetTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">变更类型：{{particularsData.changeTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">变更日期：{{particularsData.changeDate || '--'}}</a-col>
          <!-- <a-col
            class="playground-col"
            :span="8"
            v-if="+changeType === 1 || +changeType === 2"
          >截止日期：{{particularsData.expiryDate || '--'}}</a-col>
          <a-col class="playground-col" :span="8">交付单位：{{particularsData.deliveryCompany || '--'}}</a-col>-->
          <template v-if="+changeType === 3">
            <div>
              <a-col
                class="playground-col"
                :span="8"
              >原值对象类型：{{particularsData.originalObjectTypeName || '--'}}</a-col>
              <a-col
                class="playground-col"
                :span="8"
              >原值对象：{{particularsData.originalObjectIdName|| '--'}}</a-col>
              <a-col
                class="playground-col"
                :span="8"
              >原值金额(元)：{{particularsData.originalValue || '--'}}</a-col>
            </div>
          </template>
          <a-col class="playground-col" :span="8">创建时间：{{particularsData.createTime || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建人：{{particularsData.createByName || '--'}}</a-col>
          <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
          <a-col class="playground-col" :span="24">
            附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 件：
            <span v-if="files.length === 0">无</span>
            <div class="umImg" v-if="files.length > 0">
              <UploadFile v-model="files" type="all" :show="true" />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="particulars-nav">
      <span class="section-title blue">资产列表</span>
      <div class="particulars-obj">
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columnsCom"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
          >
            <!-- 有无经营权 -->
            <template v-if="changeType === '7'" slot="managementRight" slot-scope="text, record">
              {{record.managementRightName}}
            </template>
          </a-table>
          <SG-FooterPagination
            :pageLength="queryCondition.pageSize"
            :totalCount="queryCondition.count"
            :location="location"
            :noPageTools="noPageTools"
            v-model="queryCondition.pageNum"
            @change="handleChange"
          />
        </div>
      </div>
    </div>
    <div class="particulars-nav">
      <div>
        <SG-Title title="审批轨迹"/>
        <SG-TrackStep v-stepstyleplus v-if="stepList.length" :stepList="stepList" style="margin-left: 45px"/>
        <div v-else style="text-align: center; margin: 25px 0">暂无数据</div>
      </div>
      <div v-if="isApprove">
        <SG-Title title="审核意见"/>
        <a-textarea :rows="4" style="resize: none; margin-left: 45px" placeholder="请输入审核意见" v-model="advice"/>
      </div>
      <div style="height: 70px;"></div>
      <div v-if="isApprove">
        <!--底部审批操作按钮组-->
        <form-footer location="fixed">
          <SG-Button type="primary" @click="handleBtn(1)">审批通过</SG-Button>
          <SG-Button type="dangerous" @click="handleBtn(0)" style="margin-right: 8px">驳回</SG-Button>
        </form-footer>
      </div>
    </div>
  </div>
</template>

<script>
import FormFooter from '@/components/FormFooter'
import {
  deliveryProperty,
  deliveryOperation,
  changeDirectionUse,
  variationOriginalValue,
  positionChange,
  projectChange,
  baseChange,
  debtChange,
  baseChangeTwo,
  assetSize, changeDirectionUseEq, propertyColumn
} from "./basics";
import { utils } from "@/utils/utils.js";
import moment from "moment";
const originalObjectTypeMap = {
  "1": "资产项目",
  "2": "楼栋",
  "3": "车场",
  "4": "资产",
};
const shareWayMap = {
  "1": "按资产面积分摊",
  "2": "按资产个数分摊",
};
export default {
  components: {FormFooter},
  props: {},
  data() {
    return {
      advice:'',
      isApprove: false,
      stepList:[],
      managementRightOptions:[],
      changeType: "",
      assetType: "",
      changeOrderId: "",
      particularsData: {},
      files: [],
      columns: [],
      loading: false,
      tableData: [],
      location: "",
      noPageTools: false,
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
        count: "",
      },
    };
  },
  computed: {
    isSelectedEquipment(){
      return String(this.assetType) === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT
    },
    columnsCom(){
      if (this.isSelectedEquipment){
        const arr = ['assetArea']
        return this.columns.filter(ele=>{
          return !arr.includes(ele.dataIndex)
        })
      }else {
        return this.columns
      }
    }
  },
  watch: {
    changeType(value) {
      let val = String(value);
      let arr = [];
      if (val === "2") {
        arr = utils.deepClone(deliveryProperty);
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "1") {
        arr = utils.deepClone(deliveryOperation);
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "4") {
        arr = utils.deepClone(changeDirectionUse);
        arr = this.assetType === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT ? utils.deepClone(changeDirectionUseEq) : utils.deepClone(changeDirectionUse)
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "3") {
        arr = utils.deepClone(variationOriginalValue);
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "5") {
        arr = utils.deepClone(positionChange);
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "6") {
        arr = utils.deepClone(projectChange);
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "7") {
        arr = utils.deepClone(baseChange);
        this.columns = arr.splice(0, arr.length - 1);
        this.handleBaseAndHuse();
      } else if (val === "8") {
        arr = utils.deepClone(debtChange);
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "9") {
        arr = utils.deepClone(assetSize);
        this.columns = arr.splice(0, arr.length - 1);
      } else if (val === "10") {
        arr = utils.deepClone(propertyColumn);
        this.columns = arr.splice(0, arr.length - 1);
      }
    },
  },
  methods: {
    // 按钮操作
    handleBtn (operResult) {
      if (operResult === 0){
        if (!this.advice){
          this.$message.error('驳回必填审核意见')
          return null
        }
      }
      let req = {
        apprId: this.apprId,
        operResult,
        operOpinion: this.advice
      }
      this.$api.approve.uniformSubmit(req).then(({data: res}) => {
        if (res && String(res.code) === '0') {
          this.$message.success(operResult ?'审批成功' : '驳回成功')
          // 跳回列表路由
          this.$router.push({
            path: "/assetChangeRegister",
            query: { refresh: true },
          });
        }else {
          throw res.message
        }
      }).catch(err => {
        console.error(err)
        this.$message.error(err || `${operResult ?   '审批失败' : '驳回失败'}`)
      })
    },
    // 查询详情
    query() {
      let obj = {
        changeOrderId: this.changeOrderId,
      };
      this.$api.assets.getChangeDetail(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          this.changeType = data.changeType + "";
          this.assetType = data.assetType + "";
          data.originalObjectTypeName =
            originalObjectTypeMap[data.originalObjectType];
          data.shareWayName = shareWayMap[data.shareWay];
          this.particularsData = data;
          let files = [];
          if (data.attachment && data.attachment.length > 0) {
            data.attachment.forEach((item) => {
              files.push({
                url: item.attachmentPath,
                name: item.newAttachmentName,
              });
            });
          }
          this.files = files;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产列表
    getChangeDetailPageFn() {
      this.loading = true;
      let obj = {
        changeOrderId: this.changeOrderId,
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize,
      };
      this.$api.assets.getChangeDetailPage(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          this.$nextTick(() => {
            this.$textReplace(this.$route.query.relatedOrganId)
          })
          let data = res.data.data.data;
          data.forEach((item, index) => {
            item.key = index;
            item.newOriginalValue = item.originalValue;
            item.changeProjectId = item.changeProjectName;
            // 债权映射
            item.newCreditorAmount = item.creditorAmount;
            item.newDebtAmount = item.debtAmount;

            item.creditorAmount = item.oldCreditorAmount;
            item.debtAmount = item.oldDebtAmount;
            // 资产面积映射
            item.assetArea = item.oldAssetArea;
            // 基础信息字段映射
            item.newDecorationSituation = item.decorationSituation;
            // 实际产权单位
            item.newPropertyRightUnit = item.propertyRightUnit
            //有无经营产权
            this.managementRightOptions.forEach(j=>{
              if(+j.key === +item.managementRight ){
                item.managementRightName = j.title
              }
            })
            item.oldUseDirection = item.oldUseDirectionName
            item.newUseDirection = item.newUseDirectionName
          });
          this.tableData = data;
          this.queryCondition.count = res.data.data.count;
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    // 当为基础信息变动， 并且为房屋或者车场，资产类型
    handleBaseAndHuse() {
      console.log("会进到这里来2", this.changeType, "www", this.assetType);
      if (this.changeType === "7" && ["1"].includes(this.assetType)) {
        let arr = utils.deepClone(baseChangeTwo);
        this.columns = arr.splice(0, arr.length - 1);
      }
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.getChangeDetailPageFn();
    },
    // 平台字典获取变更类型
    platformDictFn(code) {
      let obj = {
        code,
      };
      this.$api.assets.platformDict(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          //有无经营权
          if(code === "ASSET_MANAGEMENT_RIGHT"){
            this.managementRightOptions=data.map(item=>{
              return {
                key:item.value,
                title:item.name
              }
            })
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    async init(){
      const { query: { instId } } = this.$route
      let obj = this.$route.query
      if (instId){
        // 嵌套在 bpm 中时，关闭 面包屑
        this.$route.meta.noShowProBreadNav = true
        const req = {
          serviceOrderId: instId
        }
        const {data:{code,message,data}} = await this.$api.approve.getApprByServiceOrderId(req)
        if (code === '0'){
          console.log('data',data)
          // 合并数据 query 和 接口 data
          Object.assign(obj,data)
          // 返回的数据 budId 代表 变更单单id
          obj.record = JSON.stringify([{changeOrderId: data.busId}])
        }else {
          this.$message.error(message)
        }
      }else {
        this.$route.meta.noShowProBreadNav = false
      }

      const setType = obj.setType
      // 判断是否嵌套在 bpm 中
      this.particularsData = JSON.parse(obj.record);
      // 固定取值集合第一个，只有第一个有数据
      this.changeOrderId = this.particularsData[0].changeOrderId;
      this.query();
      this.getChangeDetailPageFn();
      this.platformDictFn("ASSET_MANAGEMENT_RIGHT");
      if (obj.organId){
        // 资产变更 1003 硬编码
        // 详情页面也需要展示审批轨迹
        const req = {busType: 1003,busId:this.changeOrderId,organId: this.$route.query.relatedOrganId || obj.organId }
        this.$api.approve.queryApprovalRecordByBus(req).then(({data:{code,message,data}})=>{
          if (code==='0'){
            this.apprId = data.amsApprovalResDto.apprId
            this.stepList = (data.approvalRecordResDtos || []).map(ele=>{
              return {
                date: ele.operDateStr ? moment(ele.operDateStr) : moment(),
                title: ele.operOpinion,
                desc: "", isDone: false, operation: [],
              }
            })
            this.stepList.length && (this.stepList[0].isDone = true)
            if (setType === 'approve'){
              this.isApprove = data.amsApprovalResDto.isAbRole === 1
            }
          }else {
            this.$message.error(message)
          }
        })
      }

    }
  },
  mounted() {
    this.init()
  },
};
</script>
<style lang="less" scoped>
.particulars {
  .particulars-nav {
    padding: 42px 126px 20px 70px;
    .particulars-obj {
      // padding: 20px 0 20px 40px;
      .playground-row {
        .playground-col {
          height: 40px;
          line-height: 40px;
          font-size: 12px;
        }
      }
    }
    .correspondingTask {
      margin: 35px 40px 0 40px;
      border: 1px solid #f0f2f5;
    }
  }
  .nav-box {
    padding-bottom: 100px;
  }
  .file {
    margin: 20px 0 0 40px;
  }
}
</style>
