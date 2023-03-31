<template>
  <div :class="{ 'detail-allot': true, mobile: isMobileStatus }">
    <float-anchor style="min-width: 200px" :anchorList="anchorList" v-if="!isMobileStatus" />
    <div>
      <SG-Title title="基本信息" id="baseInfo" />
      <a-row>
        <a-col :offset="2" :span="18">
          <Information :row-props="{ gutter: 5 }" :col-props="{ span: 10 }" v-bind="basicInfoOptions" />
        </a-col>
      </a-row>
      <SG-Title title="资产明细" id="assetDetail" />
      <a-row>
        <a-col :offset="2" :span="18">
          <a-table class="custom_td" v-bind="tableAssetDetail">
            <template #resourceList="text, record">
              <a v-if="record.resourceList.length > 1" @click="btnMoreUsage(record)">查看更多</a>
              <span v-else>
                {{ record.resourceList[0] ? record.resourceList[0].busiStatus : '--' }}
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
      <SG-Title title="租赁信息" id="leaseInfo" />
      <a-row>
        <a-col :offset="2" :span="18">
          <a-table v-bind="tableLease">
            <template #action="text, record">
              <a @click="btnMoreLease(record)" v-if="record.historicLeaseResps && record.historicLeaseResps.length > 1">明细</a>
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
      <SG-Title title="资产评估信息" id="evaluateInfo" />
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
      <SG-Title title="补充资料" id="otherFile" />
      <a-row>
        <a-col :offset="2" :span="18">
          <a-form-model-item label="备注">
            <p>
              {{ basicInfoOptions.data.remark }}
            </p>
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :offset="2" :span="18">
          <a-form-model-item label="附件">
            <ShowFile :value="allFile.otherFile.value" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <SG-Title title="审批轨迹" id="approvalTrack" />
      <a-row>
        <a-col :offset="2" :span="18">
          <div>
            <step v-stepstyleplus v-if="stepList.length" :stepList="stepList" @getFile="getFile" style="margin-left: 45px" />
            <div v-else style="text-align: center; margin: 25px 0">暂无数据</div>
          </div>
        </a-col>
      </a-row>
      <div v-if="isApprove">
        <SG-Title title="审核意见" />
        <a-row>
          <a-col :offset="2" :span="18">
            <a-textarea :rows="4" style="resize: none; margin-left: 45px" placeholder="请输入审核意见" v-model="advice" />
          </a-col>
        </a-row>
      </div>
      <div style="height: 70px"></div>
      <div v-if="isApprove">
        <!--底部审批操作按钮组-->
        <form-footer location="fixed">
          <SG-Button type="primary" @click="handleBtn(1)">审批通过</SG-Button>
          <SG-Button type="dangerous" @click="handleBtn(0)" style="margin-right: 8px">驳回</SG-Button>
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
  </div>
</template>

<script>
import FloatAnchor from '@/views/common/FloatAnchor';
import LeaseTable from '@/views/disposalManagement/allot/LeaseTable';
import UsageTable from '@/views/disposalManagement/allot/UsageTable';
import FormFooter from '@/components/FormFooter';
import ShowFile from '@/views/disposalManagement/allot/ShowFile';
import Information from '@/components/Information';
import Step from '@/components/step';
import moment from 'moment';
import { getDetail } from './share';

const PAGE_ASSET_DETAIL = 'assetDetail';
const PAGE_LEASE = 'lease';
const PAGE_EVALUATE = 'evaluate';

export default {
  name: 'detail',
  components: {
    ShowFile,
    Information,
    FormFooter,
    UsageTable,
    LeaseTable,
    FloatAnchor,
    Step,
  },
  data() {
    return {
      isMobileStatus: false,
      anchorList: [
        { title: '基本信息', id: 'baseInfo' },
        { title: '资产明细', id: 'assetDetail' },
        { title: '租赁信息', id: 'leaseInfo' },
        { title: '资产评估信息', id: 'evaluateInfo' },
        { title: '补充资料', id: 'otherFile' },
        { title: '审批轨迹', id: 'approvalTrack' },
      ],
      apprId: '',
      advice: '',
      fromType: '',
      isApprove: false,
      stepList: [],
      otherInfo: {
        feasibility: '',
        compliance: '',
      },
      id: '',
      allFile: {
        // 附件
        otherFile: {
          value: [],
          subType: 2001,
        },
      },
      basicInfoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: '申请单名称',
              key: 'name',
              colProps: {
                span: 24,
              },
            },
          ],
          [
            {
              title: '组织机构名称',
              key: 'organName',
              colProps: {
                span: 8,
              },
            },
            {
              title: '资产项目',
              key: 'projectName',
              colProps: {
                span: 8,
              },
            },
            {
              title: '资产类型',
              key: 'assetTypeName',
              colProps: {
                span: 8,
              },
            },
          ],
          [
            {
              title: '接管组织机构名称',
              key: 'newOrganName',
              colProps: {
                span: 8,
              },
            },
            {
              title: '接管资产项目',
              key: 'newProjectName',
              colProps: {
                span: 8,
              },
            },
            {
              title: '状态',
              key: 'approvalStatusName',
              colProps: {
                span: 8,
              },
            },
          ],
          [
            {
              title: '申请单ID',
              key: 'id',
              colProps: {
                span: 8,
              },
            },
          ],
        ],
        colProps: { span: 8 },
      },
      tableEvaluate: {
        columns: [
          {
            title: '序号',
            customRender: (text, record, index) => {
              return this.generateNum(index, PAGE_ASSET_DETAIL);
            },
          },
          {
            title: '物业名称',
            width: 300,
            dataIndex: 'propertyName',
          },
          {
            title: '评估机构',
            dataIndex: 'assessmentOrganName',
          },
          {
            title: '评估号',
            dataIndex: 'assessmentNum',
          },
          {
            title: '评估基准日',
            dataIndex: 'assessmenBaseDate',
          },
          {
            title: '评估有效期',
            dataIndex: 'assessmentValidDate',
          },
          {
            title: '评估价值（元）',
            dataIndex: 'assessmentValue',
          },
        ],
        dataSource: [],
        rowKey: '_key',
        pagination: false,
        scroll: { x: 1200, y: 600 },
      },
      tableLease: {
        columns: [
          {
            title: '序号',
            customRender: (text, record, index) => {
              return this.generateNum(index, PAGE_ASSET_DETAIL);
            },
          },
          {
            title: '物业名称',
            width: 300,
            dataIndex: 'propertyName',
          },
          {
            title: '历史承租人',
            dataIndex: 'secondName',
          },
          {
            title: '承租时间',
            key: 'startAndEndDateFormat',
            customRender(text, record) {
              if (record.startDateFormat && record.endDateFormat) {
                return `${record.startDateFormat}至${record.endDateFormat}`;
              } else {
                return '';
              }
            },
          },
          {
            title: '承租金额（元）',
            dataIndex: 'allRent',
          },
          {
            title: '承租单价（元）',
            dataIndex: 'rentAveragePrice',
          },
          {
            title: '操作',
            scopedSlots: {
              customRender: 'action',
            },
          },
        ],
        dataSource: [],
        rowKey: '_key',
        pagination: false,
        scroll: { x: 1200, y: 600 },
      },
      tableAssetDetail: {
        scroll: { x: 1200, y: 600 },
        columns: [
          {
            title: '序号',
            align: 'center',
            width: 100,
            customRender: (text, record, index) => {
              return this.generateNum(index, PAGE_ASSET_DETAIL);
            },
          },
          {
            title: '资产名称',
            align: 'center',
            width: 300,
            dataIndex: 'assetName',
          },
          {
            title: '权属单位',
            align: 'center',
            width: 200,
            key: 'obligeeName',
            customRender: (text, record) => {
              return this.generateTableItem(record.details, 'obligeeName');
            },
          },
          {
            title: '权属人股权构成',
            align: 'center',
            width: 300,
            key: 'equityComposition',
            customRender: (text, record) => {
              return this.generateTableItem(record.details, 'equityComposition');
            },
          },
          {
            title: '产权证号',
            align: 'center',
            width: 200,
            key: 'warrantNbr',
            customRender: (text, record) => {
              return this.generateTableItem(record.details, 'warrantNbr');
            },
          },
          {
            title: '权证有效期',
            align: 'center',
            key: 'houseStartAndEndDate',
            width: 260,
            customRender: (text, record) => {
              record.details.forEach((ele) => {
                ele.houseStartAndEndDate = ele.houseStartDate && ele.houseEndDate ? `${ele.houseStartDate}~${ele.houseEndDate}` : '';
              });
              return this.generateTableItem(record.details, 'houseStartAndEndDate');
            },
          },
          {
            title: '目前使用状况',
            align: 'center',
            width: 200,
            key: 'resourceList',
            scopedSlots: {
              customRender: 'resourceList',
            },
          },
          {
            title: '证载用途',
            align: 'center',
            width: 200,
            key: 'ownershipUse',
            customRender: (text, record) => {
              return this.generateTableItem(record.details, 'ownershipUse');
            },
          },
          {
            title: '建筑面积(㎡)',
            align: 'center',
            width: 200,
            key: 'buildArea',
            customRender: (text, record) => {
              return this.generateTableItem(record.details, 'buildArea');
            },
          },
          {
            title: '土地面积(㎡)',
            align: 'center',
            width: 200,
            key: 'landArea',
            customRender: (text, record) => {
              return this.generateTableItem(record.details, 'landArea');
            },
          },
          {
            title: '获得来源',
            align: 'center',
            width: 200,
            dataIndex: 'sourceType',
          },
          {
            title: '质押情况',
            align: 'center',
            width: 200,
            dataIndex: 'pledgeStr',
          },
          {
            title: '其他披露事项',
            align: 'center',
            width: 200,
            dataIndex: 'disclosures',
          },
        ],
        dataSource: [],
        rowKey: '_key',
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
          title: '',
          dataSource: [],
        },
        lease: {
          show: false,
          title: '',
          dataSource: [],
        },
      },
    };
  },
  methods: {
    isMobile() {
      let flag = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|ios/i.test(navigator.userAgent);
      return flag;
    },
    btnMoreLease(row) {
      this.modalList.lease.dataSource = row.historicLeaseResps;
      this.doOpenPop('lease', row.propertyName || '');
    },
    btnMoreUsage(row) {
      this.modalList.usage.dataSource = row.resourceList;
      this.doOpenPop('usage', row.propertyName || '');
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
    //审批流程获取文件
    getFile(item) {
      console.log(item);
      this.$api.approve.getFile({ fileId: item.fileID }).then((res) => {
        let blob = new Blob([res.data]);
        const fileName = decodeURIComponent(res.headers['content-disposition'].split(';')[1].split('filename=')[1]);
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    },
    // 按钮操作
    handleBtn(operResult) {
      if (operResult === 0) {
        if (!this.advice) {
          this.$message.error('驳回必填审核意见');
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
          if (res && String(res.code) === '0') {
            this.$message.success(operResult ? '审批成功' : '驳回成功');
            // 跳回列表路由
            this.$router.go(-1);
          } else {
            throw res.message;
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error(err || `${operResult ? '审批失败' : '驳回失败'}`);
        });
    },
    generateTableItem(details, keyStr) {
      const _h = this.$createElement;
      const children = (details || []).map((ele) =>
        _h(
          'div',
          {
            class: 'table-content-item',
            attrs: {
              title: ele[keyStr],
            },
          },
          [ele[keyStr]]
        )
      );
      return _h('div', {}, children);
    },
    generateNum(index, type) {
      return this.$createElement(
        'div',
        {
          class: 'custom_height',
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
      this.$api.transfer.leaseBatchQuery(assetIds).then(({ data: { code, message, data } }) => {
        if (code === '0') {
          console.log('data', data);
          this.tableLease.dataSource = (data || []).map((ele) => {
            // 如果ele.historicLeaseResps只有一个 则把其中的一个元素中的属性加载到外层
            const childRes =
              ele.historicLeaseResps && ele.historicLeaseResps.length > 1 ? {} : ele.historicLeaseResps ? { ...ele.historicLeaseResps[0] } : {};

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
    getBasicInfo(data) {
      this.basicInfoOptions.data = Object.assign(data || {}, {});
    },
    // 获取审批轨迹
    queryApprovalRecordByBus() {
      const req = {
        busType: 1010,
        busId: this.id,
        // organId: this.organId,
      };
      this.$api.approve.queryApprovalRecordByBus(req).then(({ data: { code, message, data } }) => {
        if (code === '0') {
          if (message === '审批单不存在') {
            if (this.fromType === 'approve') {
              this.isApprove = true;
            }
          } else {
            this.apprId = data.amsApprovalResDto.apprId;
            this.stepList = (data.approvalRecordResDtos || []).map((ele) => {
              return {
                date: ele.operDateStr ? moment(ele.operDateStr) : moment(),
                title: ele.operOpinion,
                desc: ele.taskName, // 审批节点
                isDone: false,
                operation:
                  ele.files && ele.files.length > 0
                    ? JSON.parse(ele.files).map((ele) => {
                        return {
                          buttonName: ele.name,
                          funcName: 'getFile',
                          fileID: ele.id,
                          fileName: ele.name,
                        };
                      })
                    : [],
              };
            });
            this.stepList.length && (this.stepList[0].isDone = true);
            if (this.fromType === 'approve') {
              this.isApprove = data.amsApprovalResDto.isAbRole === 1;
            }
          }
        } else {
          this.$message.error(message);
        }
      });
    },
    async initData() {
      // 支持两种方式打开详情页面
      // /asset-management/#/allot/detail?id=120&organId=1000279&fromType=detail
      // /asset-management/#/allot/detail?instId=1583291911515570176
      const {
        query: { instId },
      } = this.$route;
      if (instId) {
        this.$route.meta.noShowProBreadNav = true;
        const req = {
          serviceOrderId: instId,
        };
        const {
          data: { code, message, data },
        } = await this.$api.approve.getApprByServiceOrderId(req);
        if (code === '0') {
          this.id = data.busId;
        } else {
          this.$message.error(message);
        }
      } else {
        this.$route.meta.noShowProBreadNav = false;
        this.id = this.$route.query.id;
      }
      // 移动端打开详情页不会带上fromType=detail 参数
      this.fromType = this.$route.query.fromType || 'detail';
      // this.organId = this.$route.query.organId;
      const data = await getDetail({ id: this.id }); // 获取详情
      this.getBasicInfo(data.baseInfo); // 基本信息
      this.getTableAssetDetail(data.assetDetails); // 资产明细
      this.getTableEvaluate(data.valueInfos); // 资产评估信息
      this.getAllFileData(data.attachments); // 附件

      const assetIds = (data.assetDetails || []).map((ele) => ele.assetId);
      this.getTableLease({ assetIds }); // 租赁信息
      if (['detail', 'approve'].includes(this.fromType)) {
        this.queryApprovalRecordByBus();
      }
    },
  },
  mounted() {
    this.initData();
    if (this.isMobile()) {
      this.isMobileStatus = true;
      // 修改body样式
      document.querySelector('body').style = 'min-width: auto !important;';
      // 关闭导航栏
      this.$route.meta.noShowProBreadNav = true;
      // 关闭侧边菜单栏
      this.$store.commit('dev/updateMenuStatus', false);
      const docEl = window.document.documentElement;
      if (docEl.querySelector('head')) {
        docEl.querySelector('head').querySelector('meta[name="viewport"]').setAttribute('content', 'width=device-width,initial-scale=1');
      }
    }
  },
  beforeRouteEnter(to, from, next) {
    to.meta.noShowProBreadNav = from.path === '/approve';
    next((vm) => {
      const {
        params: { fromBpmApprove },
      } = from;
      vm.isApprove = fromBpmApprove || false;
    });
  },
};
</script>

<style lang="less" scoped>
.detail-allot {
  padding: 10px 20px;
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
.custom_td .ant-table-row td {
  padding: 0;
}
.custom_td .custom_height {
  min-height: 40px;
  line-height: 40px;
}

.table-content-item {
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
  height: 40px;
  padding: 0 20px;
  border-top: 1px solid #efefef;
  line-height: 40px;
  text-align: center;
}
p {
  white-space: pre-line;
}
/deep/ .track-step .right .detail-item .title {
  font-weight: normal;
  font-size: 15px;
}
//移动端样式
.mobile {
  position: fixed;
  z-index: 99;
  top: 0;
  left: 0;
  padding: 0px;
  margin: 0px;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  > div {
    width: 100% !important;
    height: 100% !important;
    padding: 0px !important;
    margin: 0px !important;
  }
  /deep/ .ant-col-18 {
    width: 90%;
  }
  /deep/.ant-col-10 {
    float: none;
    width: 88%;
  }
  .block-title {
    line-height: 40px;
    text-align: center;
    height: 40px;
    flex-basis: 110px;
    font-weight: bold;
    font-size: 16px;
    background-color: #f2f2f2;
  }
  .track-step {
    margin-left: 0px !important;
    .left {
      min-width: 84px;
    }
  }
}
</style>
