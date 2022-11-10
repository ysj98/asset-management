<template>
  <SuperModal
    class="assetBundlePopSG-Modalover"
    width="1000px"
    :visible="show"
    @change="show = $event"
    :noPadding="true"
    :footer="null"
    :title="type === 'approval' ? '权证审批' : '权证详情'"
    :use-modal="useModal"
  >
    <div :class="{ newCard: true, openDirectly: openDirectly }">
      <div class="newCard-nav">
        <span class="section-title blue">基础信息</span>
        <a-row class="playground-row">
          <a-col class="playground-col" :span="12" v-for="(item, index) in basicDate" :key="index"
            >{{ item.text }}：{{ conditionalJudgment.includes(particularsData[item.value]) ? "" : particularsData[item.value] }}</a-col
          >
          <a-col class="playground-col" :span="24">附加说明：{{ particularsData.excursus || "" }}</a-col>
          <a-col class="playground-col" :span="24">备注：{{ particularsData.remark || "" }}</a-col>
          <a-col class="playground-col" :class="{ 'files-style': files.length > 0 }" :span="24">
            附件：
            <span v-if="files.length === 0">无</span>
            <div v-if="files.length > 0">
              <div class="umImg">
                <upload-file v-model="files" :show="true" type="all" />
              </div>
            </div>
          </a-col>
        </a-row>
      </div>
      <div class="newCard-nav" v-if="this.kindOfRight === '1' || this.kindOfRight === '3'">
        <span class="section-title blue">权属人</span>
        <div class="tab-nav table-border">
          <a-table :columns="columns" :dataSource="amsOwnershipWarrantObligeeList" class="custom-table td-pd10" :pagination="false"></a-table>
        </div>
      </div>
      <div class="newCard-nav" v-if="this.kindOfRight === '1'">
        <span class="section-title blue">抵押信息</span>
        <div class="tab-nav table-border">
          <a-table :columns="mortgageInformation" :dataSource="amsOwnershipWarrantMortgageList" class="custom-table td-pd10" :pagination="false"></a-table>
        </div>
      </div>
      <div class="newCard-nav" v-if="type === 'approval'">
        <span class="section-title blue">审批轨迹</span>
        <div class="tab-nav">
          <SG-TrackStep v-stepstyleplus v-if="stepList.length" :stepList="stepList" style="margin-left: 45px" />
          <div v-else style="text-align: center; margin: 25px 0">暂无数据</div>
        </div>
      </div>
      <div class="newCard-nav" v-if="type === 'approval'">
        <span class="section-title blue">审核意见</span>
        <div class="tab-nav">
          <a-textarea :rows="4" style="resize: none" placeholder="请输入审核意见" v-model="operOpinion" />
        </div>
      </div>
    </div>
    <form-footer v-if="type === 'approval'" leftButtonName="审核通过" rightButtonName="驳回" rightButtonType="danger" @save="handleApprove(1)" @cancel="handleApprove(0)"> </form-footer>
  </SuperModal>
</template>

<script>
import FormFooter from "@/components/FormFooter";
import configBase from "@/config/config.base";
import { utils } from "@/utils/utils";
import { columns, mortgageInformation } from "./beat";
import SuperModal from "./SuperModal.vue";
import moment from "moment";
const conditionalJudgment = [undefined, null, ""];
const titleDeed = [
  { text: "权证号", value: "warrantNbr" },
  { text: "权属形式", value: "ownerTypeName" },
  { text: "权证类型", value: "kindOfRightName" },
  { text: "实际产权单位", value: "propertyRightUnit" },
  { text: "实际保管单位", value: "safekeepUnit" },
  { text: "不动产单元号", value: "estateUnitCode" },
  { text: "宗地号", value: "lotNo" },
  { text: "坐落位置", value: "seatingPosition" },
  { text: "土地面积 (㎡)", value: "landArea" },
  { text: "土地用途", value: "landUse" },
  { text: "权属用途", value: "ownershipUseName" },
  { text: "建筑结构", value: "structureName" },
  { text: "建筑面积(㎡)", value: "buildArea" },
  { text: "专有建筑面积", value: "exclusiveBuildArea" },
  { text: "分摊面积(㎡)", value: "apportionArea" },
  { text: "总套数", value: "totalSuite" },
  { text: "权利性质", value: "qualityOfRightName" },
  { text: "使用期限", value: "useLimitDate" },
  { text: "房产证使用年限", value: "houseProveLife" },
  { text: "房产证起始日期", value: "houseStartDate" },
  { text: "房产证截止日期", value: "houseEndDate" },
  { text: "登记日期", value: "rigisterDate" },
  { text: "交接日期", value: "handoverDate" },
];
const accessCard = [
  { text: "权证号", value: "warrantNbr" },
  { text: "权属形式", value: "ownerTypeName" },
  { text: "权证类型", value: "kindOfRightName" },
  { text: "实际产权单位", value: "propertyRightUnit" },
  { text: "实际保管单位", value: "safekeepUnit" },
  { text: "房屋所有权人", value: "houseOwner" },
  { text: "承租人", value: "tenantIdName" },
  { text: "委托管理单位", value: "entrustOrganization" },
  { text: "建筑面积(㎡)", value: "buildArea" },
  { text: "使用面积(㎡)", value: "useArea" },
  { text: "专有建筑面积(㎡)", value: "exclusiveBuildArea" },
  { text: "分摊面积(㎡)", value: "apportionArea" },
  { text: "坐落位置", value: "seatingPosition" },
  { text: "用途", value: "ownershipUseName" },
  { text: "建筑结构", value: "structureName" },
  { text: "总层数", value: "totalFloor" },
  { text: "所在层", value: "placeFloor" },
  { text: "房屋号", value: "houseNo" },
  { text: "租金单价", value: "rentUnitPice" },
  { text: "租金总价", value: "rentTotalPrice" },
  { text: "合同期限", value: "contractData" },
  { text: "议价租金单价", value: "talkUnitPrice" },
  { text: "议价租金总价", value: "talkTotalPrice" },
  { text: "租金缴纳期限", value: "rentPayDate" },
  { text: "产别", value: "antenatal" },
  { text: "登记日期", value: "rigisterDate" },
  { text: "交接日期", value: "handoverDate" },
];
const landDeed = [
  { text: "权证号", value: "warrantNbr" },
  { text: "权属形式", value: "ownerTypeName" },
  { text: "权证类型", value: "kindOfRightName" },
  { text: "实际产权单位", value: "propertyRightUnit" },
  { text: "实际保管单位", value: "safekeepUnit" },
  { text: "地号", value: "landNumber" },
  { text: "图号", value: "picNumber" },
  { text: "座落位置", value: "seatingPosition" },
  { text: "地类(用途)", value: "landCategory" },
  { text: "取得价格", value: "getPrice" },
  { text: "使用权类型", value: "useCategory" },
  { text: "使用权面积(㎡)", value: "useArea" },
  { text: "独有面积(㎡)", value: "exclusiveArea" },
  { text: "分摊面积(㎡)", value: "apportionArea" },
  { text: "终止日期", value: "terminationData" },
  { text: "登记日期", value: "rigisterDate" },
  { text: "交接日期", value: "handoverDate" },
];
export default {
  components: { SuperModal, FormFooter },
  props: {},
  data() {
    return {
      type: "particulars",
      openDirectly: false,
      configBase,
      conditionalJudgment,
      basicDate: [],
      titleDeed,
      accessCard,
      landDeed,
      particularsData: {},
      files: [],
      kindOfRight: "", // 权证类型判断
      beat: [],
      columns: [],
      mortgageInformation: [],
      amsOwnershipWarrantObligeeList: [],
      amsOwnershipWarrantMortgageList: [],
      allWidth: "width: 214px",
      widthBox: "width: 73.5%",
      newCard: "",
      show: false,
      formItemTextarea: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 18 },
        },
      },
      operOpinion: "", // 审核意见
      stepList: [], // 审批轨迹
      apprId: "",
    };
  },
  provide() {
            return {
                    preview: this.handlePower('AUTHORITY_MANA_PREVIEW'),
                    download: this.handlePower('AUTHORITY_MANA_DOWNLOAD')
            };
},
  computed: {
    useModal() {
      return this.$route && this.$route.path !== "/authorityCardInfo";
    },
  },
  watch: {
    kindOfRight(val) {
      if (val === "1" || val === "3" || val === "4") {
        let arr = utils.deepClone(columns);
        this.columns = arr.splice(0, arr.length - 1);
        let opt = utils.deepClone(mortgageInformation);
        this.mortgageInformation = opt.splice(0, opt.length - 1);
        if (val === "1") {
          this.basicDate = titleDeed;
        } else if (val === "3") {
          this.basicDate = landDeed;
        } else if (val === "4") {
          this.basicDate = titleDeed;
        }
      } else if (val === "2") {
        this.basicDate = accessCard;
      }
    },
    show() {
      this.operOpinion = ''
    }
  },
  methods: {
    // 审批
    handleApprove(operResult) {
      if (operResult === 0) {
        if (!this.operOpinion) {
          this.$message.error("驳回必填审核意见");
          return null;
        }
      }
      const req = {
        apprId: this.apprId,
        operResult,
        operOpinion: this.operOpinion,
      };
      this.$api.approve
        .uniformSubmit(req)
        .then(({ data: res }) => {
          if (res && String(res.code) === "0") {
            this.$message.success("操作成功");
            this.show = false
            // 刷新页面
            this.$parent.query()
          } else {
            throw res.message;
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error("操作失败");
        });
    },
    // 关闭弹窗
    handleCancel() {
      this.show = false;
    },
    initData({ warrantNbr }) {
      this.warrantNbr = warrantNbr;
    },
    // 权限函数处理
    handlePower(val) {
      let permissionStr = window.sessionStorage.getItem('b083aa5461ace946');
      if (typeof permissionStr === 'string' && permissionStr.length > 0) {
        let permissions = JSON.parse(permissionStr);
        for (let i = 0; i < permissions.length; i++) {
           if (permissions[i].popeCode === val) {
            return false
          }
        }
        return true
          }
    },
    // 详情查询
    query({ warrantId, warrantNbr, organId }) {
      if (!warrantId && !warrantNbr && !organId) {
        this.$message.error("缺少必要入参");
        return null;
      }
      this.particularsData = {};
      this.show = true;
      let apiFn = this.$api.ownership.warrantDetail;
      let req = { warrantId };
      if (!warrantId) {
        apiFn = this.$api.ownership.detailByWarrantNbr;
        req = {
          warrantNbr,
          organId,
        };
      }
      apiFn(req).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          // 如果是审批，则获取审批轨迹
          if (this.type === "approval") this.queryApprovalRecordByBus(data.amsOwnershipWarrant.warrantId, data.amsOwnershipWarrant.organId);
          this.kindOfRight = String(data.amsOwnershipWarrant.kindOfRight);
          this.particularsData = data.amsOwnershipWarrant;
          this.particularsData["houseEndDate"] = this.particularsData["houseEndDate"] ? this.particularsData["houseEndDate"].split("T")[0] : "";
          this.particularsData["houseStartDate"] = this.particularsData["houseStartDate"] ? this.particularsData["houseStartDate"].split("T")[0] : "";
          let files = [];
          if (data.amsAttachmentList && data.amsAttachmentList.length > 0) {
            data.amsAttachmentList.forEach((item) => {
              files.push({
                url: item.attachmentPath,
                name: item.oldAttachmentName,
                fileSources: item.fileSources,
              });
            });
          }
          this.files = files;
          // 权属人信息
          data.amsOwnershipWarrantObligeeList.forEach((list, index) => {
            list.key = index;
            list.obligeeId = list.obligeeName;
            data.amsOwnershipWarrantObligeeList[index].percent = list.percent.toFixed(2);
          });
          this.amsOwnershipWarrantObligeeList = data.amsOwnershipWarrantObligeeList;
          // 抵押信息
          data.amsOwnershipWarrantMortgageList.forEach((evl, index) => {
            evl.key = index;
          });
          this.amsOwnershipWarrantMortgageList = data.amsOwnershipWarrantMortgageList;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取审批轨迹
    queryApprovalRecordByBus(busId, organId) {
      const req = { busType: 1009, busId, organId };
      this.$api.approve.queryApprovalRecordByBus(req).then(({ data: { code, message, data } }) => {
        if (code === "0") {
          this.apprId = data.amsApprovalResDto.apprId;
          this.stepList = (data.approvalRecordResDtos || []).map((ele) => {
            return {
              date: ele.operDateStr ? moment(ele.operDateStr) : moment(),
              title: ele.operOpinion,
              desc: "",
              isDone: false,
              operation: [],
            };
          });
          this.stepList.length && (this.stepList[0].isDone = true);
        } else {
          this.$message.error(message);
        }
      });
    },
  },
  created() {
    // 权证详情弹框可以从权证管理页面点击详情打开，也可以按照下面的方式直接路由访问打开
    if (this.$route && this.$route.path === "/authorityCardInfo") {
      const { warrantId } = this.$route.query;
      this.openDirectly = true;
      this.query({ warrantId });
    }
  },
  mounted() {},
};
</script>
<style lang="less" scoped>
.newCard {
  height: 500px;
  overflow-y: scroll;
  padding-bottom: 110px;
  .newCard-nav {
    padding: 40px 70px 0 70px;
    .tab-nav {
      margin: 24px 20px;
    }
  }
  .playground-row {
    margin: 23px 0 0 26px;
    .playground-col {
      // height: 40px;
      line-height: 40px;
      font-size: 12px;
    }
    .files-style {
      margin-bottom: 70px;
    }
  }
}
.openDirectly {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 99;
  background-color: white;
}
// ::v-deep .sg-uploadFile.show>.preview {
//   overflow: auto;
// }
</style>
