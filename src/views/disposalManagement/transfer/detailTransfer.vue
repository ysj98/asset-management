<template>
  <div class="detail-transfer">
    <SG-Title title="基本信息" />
    <a-row>
      <a-col :offset="2" :span="18">
        <Information
          :row-props="{ gutter: 5 }"
          :col-props="{ span: 10 }"
          v-bind="basicInfoOptions"
        />
      </a-col>
    </a-row>
    <SG-Title title="资产明细" />
    <a-row>
      <a-col :offset="2" :span="18">
        <a-table class="custom_td" v-bind="tableAssetDetail">
          <template #resourceList="text, record">
            <a
              v-if="record.resourceList.length > 1"
              @click="btnMoreUsage(record)"
            >
              查看更多
            </a>
            <span v-else>
              {{
                record.resourceList[0]
                  ? record.resourceList[0].busiStatus
                  : "--"
              }}
            </span>
          </template>
        </a-table>
        <SG-FooterPagination
          v-if="false"
          :pageLength="allPageObj.assetDetail.pageSize"
          :totalCount="allTableTotal.assetDetail"
          :noPageTools="true"
          v-model="allPageObj.assetDetail.pageNum"
          @change="changePage($event, 'assetDetail')"
        />
      </a-col>
    </a-row>
    <SG-Title title="租赁信息" />
    <a-row>
      <a-col :offset="2" :span="18">
        <a-table v-bind="tableLease">
          <template #action="text, record">
            <a
              @click="btnMoreLease(record)"
              v-if="record.historicLeaseResps.length > 1"
            >
              明细
            </a>
            <span v-else>--</span>
          </template>
        </a-table>
        <SG-FooterPagination
          v-if="false"
          :pageLength="allPageObj.lease.pageSize"
          :totalCount="allTableTotal.lease"
          :noPageTools="true"
          v-model="allPageObj.lease.pageNum"
          @change="changePage($event, 'lease')"
        />
      </a-col>
    </a-row>
    <SG-Title title="资产评估信息" />
    <a-row>
      <a-col :offset="2" :span="18">
        <a-table v-bind="tableEvaluate"></a-table>
        <SG-FooterPagination
          v-if="false"
          :pageLength="allPageObj.evaluate.pageSize"
          :totalCount="allTableTotal.evaluate"
          :noPageTools="true"
          v-model="allPageObj.evaluate.pageNum"
          @change="changePage($event, 'evaluate')"
        />
      </a-col>
    </a-row>
    <SG-Title title="可行性和必要性分析" />
    <a-row>
      <a-col :offset="2" :span="18">
        <a-form-model-item label="可行性和必要性分析">
          <p class="test">
            {{ otherInfo.feasibility }}
          </p>
        </a-form-model-item>
      </a-col>
    </a-row>
    <SG-Title title="经营测算" />
    <a-row>
      <a-col :offset="2" :span="18">
        <a-form-model-item label="经营测算">
          <ShowFile v-model="allFile.operationFile.value" />
        </a-form-model-item>
      </a-col>
    </a-row>
    <SG-Title title="合规性条文" />
    <a-row>
      <a-col :offset="2" :span="18">
        <a-form-model-item label="重要条款">
          <p>
            {{ otherInfo.compliance }}
          </p>
        </a-form-model-item>
      </a-col>
      <a-col :offset="2" :span="18">
        <a-form-model-item label="合规性条文附件">
          <ShowFile v-model="allFile.clauseFile.value" />
        </a-form-model-item>
      </a-col>
    </a-row>

    <SG-Title title="其他必要资料" />
    <a-row>
      <a-col :offset="2" :span="18">
        <a-form-model-item label="法律意见书">
          <ShowFile v-model="allFile.lawFile.value" />
        </a-form-model-item>
      </a-col>
      <a-col :offset="2" :span="18">
        <a-form-model-item label="合规审查表">
          <ShowFile v-model="allFile.reviewFile.value" />
        </a-form-model-item>
      </a-col>
      <a-col :offset="2" :span="18">
        <a-form-model-item label="决策文件">
          <ShowFile v-model="allFile.decisionFile.value" />
        </a-form-model-item>
      </a-col>
      <a-col :offset="2" :span="18">
        <a-form-model-item label="审计报告">
          <ShowFile v-model="allFile.auditFile.value" />
        </a-form-model-item>
      </a-col>
      <a-col :offset="2" :span="18">
        <a-form-model-item label="财务报表">
          <ShowFile v-model="allFile.reportFile.value" />
        </a-form-model-item>
      </a-col>
      <a-col :offset="2" :span="18">
        <a-form-model-item label="其它文档">
          <ShowFile v-model="allFile.otherFile.value" />
        </a-form-model-item>
      </a-col>
    </a-row>
    <SG-Title title="拟转让条件" />
    <a-row>
      <a-col :offset="2" :span="18">
        <div
          style="
            border-top: 1px solid #efefef;
            border-right: 1px solid #efefef;
            border-left: 1px solid #efefef;
          "
        >
          <div class="block">
            <div class="block-title">挂牌价格</div>
            <div class="block-content">{{ conditions.listingPrice }}</div>
          </div>
          <div class="block">
            <div class="block-title">市场分析</div>
            <div class="block-content">{{ conditions.marketAnalysis }}</div>
          </div>
          <div class="block">
            <div class="block-title">潜在意向方情况</div>
            <div class="block-content">{{ conditions.interestedParty }}</div>
          </div>
          <div class="block">
            <div class="block-title">退出条款</div>
            <div class="block-content">{{ conditions.withdrawalClause }}</div>
          </div>
          <div class="block">
            <div class="block-title">其他说明情况</div>
            <div class="block-content">{{ conditions.remark }}</div>
          </div>
        </div>
      </a-col>
      <a-col :offset="2" :span="18">
        <a-form-model-item label="租赁合同模板">
          <ShowFile v-model="allFile.contractFile.value" />
        </a-form-model-item>
      </a-col>
      <a-col :offset="2" :span="18">
        <a-form-model-item label="安全生产管理协议书模板">
          <ShowFile :value="allFile.safeFile.value" />
        </a-form-model-item>
      </a-col>
    </a-row>
    <SG-Title title="审批轨迹" />
    <a-row>
      <a-col :offset="2" :span="18">
        <!--审批轨迹-->
        <div>
          <SG-TrackStep
            v-if="stepList.length"
            :stepList="stepList"
            style="margin-left: 45px"
          />
          <div v-else style="text-align: center; margin: 25px 0">暂无数据</div>
        </div>
      </a-col>
    </a-row>
    <div v-if="isApprove">
      <SG-Title title="审核意见" />
      <a-row>
        <a-col :offset="2" :span="18">
          <a-textarea
            :rows="4"
            style="resize: none; margin-left: 45px"
            placeholder="请输入审核意见"
            v-model="advice"
          />
        </a-col>
      </a-row>
    </div>
    <div style="height: 70px"></div>
    <div v-if="isApprove">
      <!--底部审批操作按钮组-->
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
    </div>
    <SG-Modal
      okText="确认"
      v-model="modalList.usage.show"
      :title="modalList.usage.title"
      @cancel="
        () => {
          doClosePop('usage');
        }
      "
    >
      <template #footer>
        <SG-Button @click="doClosePop('usage')">返回</SG-Button>
      </template>
      <div v-if="modalList.usage.show">
        <UsageTable :dataSource="modalList.usage.dataSource" />
      </div>
    </SG-Modal>
    <SG-Modal
      okText="确认"
      v-model="modalList.lease.show"
      :title="modalList.lease.title"
      @cancel="
        () => {
          doClosePop('lease');
        }
      "
    >
      <template #footer>
        <SG-Button @click="doClosePop('lease')">返回</SG-Button>
      </template>
      <div v-if="modalList.lease.show">
        <LeaseTable :dataSource="modalList.lease.dataSource" />
      </div>
    </SG-Modal>
  </div>
</template>

<script>
import LeaseTable from "@/views/disposalManagement/transfer/LeaseTable";
import UsageTable from "@/views/disposalManagement/transfer/UsageTable";
import FormFooter from "@/components/FormFooter";
import ShowFile from "@/views/disposalManagement/transfer/ShowFile";
import Information from "@/components/Information";
import moment from "_moment@2.29.1@moment";
import { getDetail } from "./share";

const PAGE_ASSET_DETAIL = "assetDetail";
const PAGE_LEASE = "lease";
const PAGE_EVALUATE = "evaluate";

export default {
  name: "detailTransfer",
  components: {
    ShowFile,
    Information,
    FormFooter,
    UsageTable,
    LeaseTable,
  },
  data() {
    return {
      apprId: "",
      advice: "",
      fromType: "",
      isApprove: false,
      stepList: [],
      // 拟转让
      conditions: {
        interestedParty: "",
        listingPrice: "",
        marketAnalysis: "",
        remark: "",
        withdrawalClause: "",
      },
      otherInfo: {
        feasibility: "",
        compliance: "",
      },
      applyId: "",
      allFile: {
        // 经营测算
        operationFile: {
          value: [],
          subType: 2001,
        },
        // 法律意见
        lawFile: {
          value: [],
          subType: 2002,
        },
        // 合规审查表
        reviewFile: {
          value: [],
          subType: 2003,
        },
        // 决策文件
        decisionFile: {
          value: [],
          subType: 2004,
        },
        // 审计报告
        auditFile: {
          value: [],
          subType: 2005,
        },
        // 财务报表
        reportFile: {
          value: [],
          subType: 2006,
        },
        // 租赁合同模板
        contractFile: {
          value: [],
          subType: 2007,
        },
        // 安全生产管理协议书模板
        safeFile: {
          value: [],
          subType: 2008,
        },
        // 合规性条文附件
        clauseFile: {
          value: [],
          subType: 2009,
        },
        // 其它文档
        otherFile: {
          value: [],
          subType: 2010,
        },
      },
      basicInfoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: "申请单名称",
              key: "name",
              colProps: {
                span: 24,
              },
            },
          ],
          [
            {
              title: "组织机构名称",
              key: "organName",
            },
            {
              title: "资产项目",
              key: "projectName",
            },
            {
              title: "资产类型",
              key: "assetTypeName",
            },
          ],
          [
            {
              title: "状态",
              key: "apprStatusStr",
            },
            {
              title: "申请单ID",
              key: "applyId",
            },
          ],
        ],
        colProps: { span: 8 },
      },
      tableEvaluate: {
        columns: [
          {
            title: "序号",
            customRender: (text, record, index) => {
              return this.generateNum(index, PAGE_ASSET_DETAIL);
            },
          },
          {
            title: "物业名称",
            width: 300,
            dataIndex: "propertyName",
          },
          {
            title: "评估机构",
            dataIndex: "assessmentOrganName",
          },
          {
            title: "评估号",
            dataIndex: "assessmentNum",
          },
          {
            title: "评估基准日",
            dataIndex: "assessmenBaseDate",
          },
          {
            title: "评估有效期",
            dataIndex: "assessmentValidDate",
          },
          {
            title: "评估价值（元）",
            dataIndex: "assessmentValue",
          },
        ],
        dataSource: [],
        rowKey: "_key",
        pagination: false,
        scroll: { x: 1200, y: 600 },
      },
      tableLease: {
        columns: [
          {
            title: "序号",
            customRender: (text, record, index) => {
              return this.generateNum(index, PAGE_ASSET_DETAIL);
            },
          },
          {
            title: "物业名称",
            width: 300,
            dataIndex: "propertyName",
          },
          {
            title: "历史承租人",
            dataIndex: "secondName",
          },
          {
            title: "承租时间",
            key: "startAndEndDateFormat",
            customRender(text, record) {
              if (record.startDateFormat && record.endDateFormat) {
                return `${record.startDateFormat}至${record.endDateFormat}`;
              } else {
                return "";
              }
            },
          },
          {
            title: "承租金额（元）",
            dataIndex: "allRent",
          },
          {
            title: "承租单价（元）",
            dataIndex: "rentAveragePrice",
          },
          {
            title: "操作",
            scopedSlots: {
              customRender: "action",
            },
          },
        ],
        dataSource: [],
        rowKey: "_key",
        pagination: false,
        scroll: { x: 1200, y: 600 },
      },
      tableAssetDetail: {
        scroll: { x: 1200, y: 600 },
        columns: [
          {
            title: "序号",
            align: "center",
            width: 100,
            customRender: (text, record, index) => {
              return this.generateNum(index, PAGE_ASSET_DETAIL);
            },
          },
          {
            title: "物业名称",
            align: "center",
            width: 300,
            dataIndex: "propertyName",
          },
          {
            title: "权属单位",
            align: "center",
            width: 200,
            key: "obligeeName",
            customRender: (text, record) => {
              return this.generateTableItem(record.details, "obligeeName");
            },
          },
          {
            title: "权属人股权构成",
            align: "center",
            width: 200,
            key: "equityComposition",
            customRender: (text, record) => {
              return this.generateTableItem(
                record.details,
                "equityComposition"
              );
            },
          },
          {
            title: "产权证号",
            align: "center",
            width: 200,
            key: "warrantNbr",
            customRender: (text, record) => {
              return this.generateTableItem(record.details, "warrantNbr");
            },
          },
          {
            title: "权证有效期",
            align: "center",
            key: "houseStartAndEndDate",
            width: 260,
            customRender: (text, record) => {
              record.details.forEach((ele) => {
                ele.houseStartAndEndDate =
                  ele.houseStartDate && ele.houseEndDate
                    ? `${ele.houseStartDate}~${ele.houseEndDate}`
                    : "";
              });
              return this.generateTableItem(
                record.details,
                "houseStartAndEndDate"
              );
            },
          },
          {
            title: "目前使用状况",
            align: "center",
            width: 200,
            key: "resourceList",
            scopedSlots: {
              customRender: "resourceList",
            },
          },
          {
            title: "证载用途",
            align: "center",
            width: 200,
            key: "ownershipUse",
            customRender: (text, record) => {
              return this.generateTableItem(record.details, "ownershipUse");
            },
          },
          {
            title: "建筑面积(㎡)",
            align: "center",
            width: 200,
            key: "buildArea",
            customRender: (text, record) => {
              return this.generateTableItem(record.details, "buildArea");
            },
          },
          {
            title: "土地面积(㎡)",
            align: "center",
            width: 200,
            key: "landArea",
            customRender: (text, record) => {
              return this.generateTableItem(record.details, "landArea");
            },
          },
          {
            title: "获得来源",
            align: "center",
            width: 200,
            dataIndex: "sourceType",
          },
          {
            title: "质押情况",
            align: "center",
            width: 200,
            dataIndex: "pledgeStr",
          },
          {
            title: "其他披露事项",
            align: "center",
            width: 200,
            dataIndex: "disclosures",
          },
        ],
        dataSource: [],
        rowKey: "_key",
        pagination: false,
      },
      allPageObj: {
        [PAGE_ASSET_DETAIL]: {
          pageSize: 10,
          pageNum: 1,
        },
        [PAGE_LEASE]: {
          pageSize: 10,
          pageNum: 1,
        },
        [PAGE_EVALUATE]: {
          pageSize: 10,
          pageNum: 1,
        },
      },
      allTableTotal: {
        assetDetail: 0,
        lease: 0,
        evaluate: 0,
      },
      modalList: {
        usage: {
          show: false,
          title: "",
          dataSource: [],
        },
        lease: {
          show: false,
          title: "",
          dataSource: [],
        },
      },
    };
  },
  methods: {
    btnMoreLease(row) {
      this.modalList.lease.dataSource = row.historicLeaseResps;
      this.doOpenPop("lease", row.propertyName || "");
    },
    btnMoreUsage(row) {
      this.modalList.usage.dataSource = row.resourceList;
      this.doOpenPop("usage", row.propertyName || "");
    },
    doClosePop(modal) {
      this.modalList[modal].show = false;
    },
    doOpenPop(modal, title) {
      this.modalList[modal].show = true;
      if (title) {
        this.modalList[modal].title = title;
      }
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
    generateTableItem(details, keyStr) {
      const _h = this.$createElement;
      const children = (details || []).map((ele) =>
        _h(
          "div",
          {
            class: "table-content-item",
          },
          [ele[keyStr]]
        )
      );
      return _h("div", {}, children);
    },
    generateNum(index, type) {
      return this.$createElement(
        "div",
        {
          class: "custom_height",
        },
        [(this.allPageObj[type].pageNum - 1) * 10 + 1 + index]
      );
    },
    changePage({ pageNo, pageLength }, type) {
      this.allPageObj[type].pageNum = pageNo;
      this.allPageObj[type].pageSize = pageLength;
    },
    getTableAssetDetail(data) {
      this.tableAssetDetail.dataSource = data.map((ele) => ({
        ...ele,
        details: ele.details || [],
        _key: Math.random(),
      }));
    },
    getTableLease({ assetIds }) {
      this.$api.transfer
        .leaseBatchQuery(assetIds)
        .then(({ data: { code, message, data } }) => {
          if (code === "0") {
            console.log("data", data);
            this.tableLease.dataSource = (data || []).map((ele) => {
              // 如果ele.historicLeaseResps只有一个 则把其中的一个元素中的属性加载到外层
              const childRes =
                ele.historicLeaseResps && ele.historicLeaseResps.length > 1
                  ? {}
                  : { ...ele.historicLeaseResps[0] };

              return {
                _key: Math.random(),
                ...ele,
                ...childRes,
              };
            });
          } else {
            this.$message.error(message);
          }
        });
    },
    getTableEvaluate(data) {
      const res = data || [];
      this.tableEvaluate.dataSource = res.map((ele) => ({
        ...ele,
        _key: Math.random(),
      }));
    },
    getAllFileData(data) {
      const res = data || [];
      res.forEach((ele) => {
        Object.keys(this.allFile).forEach((e) => {
          const item = this.allFile[e];
          if (item.subType === ele.subType) {
            item.value.push({
              name: ele.oldAttachmentName,
              url: ele.attachmentPath,
              attachmentId: ele.attachmentId,
            });
          }
        });
      });
    },
    getOtherInfo(data) {
      this.otherInfo = {
        compliance: data.compliance,
        feasibility: data.feasibility,
      };
    },
    getConditions(data) {
      this.conditions = data;
    },
    getBasicInfo(data) {
      this.basicInfoOptions.data = Object.assign(data || {}, {});
    },
    queryApprovalRecordByBus() {
      const req = {
        busType: 1007,
        busId: this.applyId,
        organId: this.organId,
      };
      this.$api.approve
        .queryApprovalRecordByBus(req)
        .then(({ data: { code, message, data } }) => {
          if (code === "0") {
            if (message === "审批单不存在") {
              if (this.fromType === "approve") {
                this.isApprove = true;
              }
            } else {
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
              if (this.fromType === "approve") {
                this.isApprove = data.amsApprovalResDto.isAbRole === 1;
              }
            }
          } else {
            this.$message.error(message);
          }
        });
    },
    async initData() {
      this.fromType = this.$route.query.fromType;
      this.applyId = this.$route.query.applyId;
      this.organId = this.$route.query.organId;
      const data = await getDetail({ applyId: this.applyId });
      this.getTableAssetDetail(data.assetDetails);
      this.getTableEvaluate(data.valueInfos);
      this.getAllFileData(data.attachments);
      this.getBasicInfo(data.baseInfo);
      this.getOtherInfo(data);
      this.getConditions(data.conditions);

      const assetIds = (data.assetDetails || []).map((ele) => ele.assetId);
      this.getTableLease({ assetIds });
      if (["detail", "approve"].includes(this.fromType)) {
        this.queryApprovalRecordByBus();
      }
    },
  },
  mounted() {
    this.initData();
  },
  beforeRouteEnter(to, from, next) {
    to.meta.noShowProBreadNav = from.path === "/approve";
    next((vm) => {
      const {
        params: { fromBpmApprove },
      } = from;
      vm.isApprove = fromBpmApprove || false;
    });
  },
};
</script>

<style scoped>
.detail-transfer {
  padding: 10px 40px;
}
.block {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #efefef;
}
.block-title {
  line-height: 40px;
  text-align: center;
  height: 40px;
  flex-basis: 260px;
  font-weight: bold;
  font-size: 16px;
  background-color: #f2f2f2;
}
.block-content {
  flex: 1;
  line-height: 40px;
  padding: 0 10px;
  text-align: left;
}
.custom_td ::v-deep .ant-table-row td {
  padding: 0;
}
.custom_td .custom_height {
  min-height: 40px;
  line-height: 40px;
}

.table-content-item {
  height: 40px;
  padding: 0 20px;
  border-top: 1px solid #efefef;
  line-height: 40px;
  text-align: center;
}
p {
  white-space: pre-line;
}
</style>
