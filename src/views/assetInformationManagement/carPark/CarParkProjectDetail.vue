<!--
  资产项目视图详情-戚思婷
-->
<template>
  <div class="asset-project-view-detail">
    <div class="edit-box" style="margin-bottom: 10px">
      <div class="edit-box-title"><i></i><span>基础信息</span></div>
      <div class="edit-box-content">
        <div class="edit-box-content-item">
          <span class="label-name">组织机构：</span>
          <span class="label-value">{{ detail.organName || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">资产项目名称：</span>
          <span class="label-value">{{ detail.projectName || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">资产项目编码：</span>
          <span class="label-value">{{ detail.projectCode || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">来源方式：</span>
          <span class="label-value">{{ detail.sourceTypeName || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">来源方式说明：</span>
          <span class="label-value">{{ detail.souceChannelType || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">是否接管：</span>
          <span class="label-value">{{ detail.takeOver === 1 ? '是' : '否' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">接管时间：</span>
          <span class="label-value">{{ formatDate(detail.takeOverDate) || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">接管人：</span>
          <span class="label-value">{{ detail.receiver || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">接管时资产状态：</span>
          <span class="label-value">{{ detail.takeoverAssetStatusName || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">备注：</span>
          <span class="label-value">{{ detail.remark || '' }}</span>
        </div>
        <div class="edit-box-content-item" v-show="detail.attachment.length === 0">
          <span class="label-name">附件：</span>
          <span class="label-value"></span>
        </div>
        <div class="edit-box-content-item total-width" v-show="detail.attachment.length > 0">
          <span class="label-name">附件：</span>
          <span class="label-value">
            <UploadFile type="all" :show="true" v-model="detail.attachment" />
          </span>
        </div>
      </div>
    </div>
    <div class="edit-box" style="margin-bottom: 10px">
      <div class="edit-box-title"><i></i><span>其他信息</span></div>
      <!--当来源方式为 划转 字典值1-->
      <div class="edit-box-content" v-if="sourceType === '1'">
        <div class="edit-box-content-item">
          <span class="label-name">划转批复下发时间：</span>
          <span class="label-value">{{ formatDate(detail.transferApprovalDate) || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">协议签署时间：</span>
          <span class="label-value">{{ formatDate(detail.agreementSignDate) || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">上报基础情况表时间：</span>
          <span class="label-value">{{ formatDate(detail.reportBasicInfoDate) || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">资产核实时间：</span>
          <span class="label-value">{{ formatDate(detail.houseVerificationDate) || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">上报划转请示时间：</span>
          <span class="label-value">{{ formatDate(detail.reportHouseTransferReqDate) || '' }}</span>
        </div>
      </div>
      <!--当来源方式为 外购 字典值2-->
      <div class="edit-box-content" v-else-if="sourceType === '2'">
        <div class="edit-box-content-item">
          <span class="label-name">购买日期：</span>
          <span class="label-value">{{ formatDate(detail.purchaseDate) || '' }}</span>
        </div>
      </div>
      <!--当来源方式为 自建 字典值3-->
      <div class="edit-box-content" v-else-if="sourceType === '3'">
        <div class="edit-box-content-item">
          <span class="label-name">开发商：</span>
          <span class="label-value">{{ detail.developers || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">承建商：</span>
          <span class="label-value">{{ detail.contractor || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">竣工日期：</span>
          <span class="label-value">{{ formatDate(detail.completionDate) || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">交付日期：</span>
          <span class="label-value">{{ formatDate(detail.deliveryDate) || '' }}</span>
        </div>
      </div>
      <!--当来源方式为 租入 字典值4-->
      <div class="edit-box-content" v-else-if="sourceType === '4'">
        <div class="edit-box-content-item">
          <span class="label-name">租入开始日期：</span>
          <span class="label-value">{{ formatDate(detail.leaseInStartDate) || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">租入结束日期：</span>
          <span class="label-value">{{ formatDate(detail.leaseInEndDate) || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">租入合同编号：</span>
          <span class="label-value">{{ detail.leaseInContractNo || '' }}</span>
        </div>
      </div>
      <!--当来源方式为 代管 字典值5-->
      <div class="edit-box-content" v-else-if="sourceType === '5'">
        <div class="edit-box-content-item">
          <span class="label-name">代管开始日期：</span>
          <span class="label-value">{{ formatDate(detail.escrowStartDate) || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">代管结束日期：</span>
          <span class="label-value">{{ formatDate(detail.escrowEndDate) || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">托管面积(㎡)：</span>
          <span class="label-value">{{ detail.trusteeshipArea || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">实际接收面积(㎡)：</span>
          <span class="label-value">{{ detail.actualReceiveArea || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">实际可用面积(㎡)：</span>
          <span class="label-value">{{ detail.actualUsableArea || '' }}</span>
        </div>
      </div>
      <div class="edit-box-content" :style="['1', '2', '3', '4', '5'].includes(sourceType) ? 'margin-top: 0' : ''">
        <div class="edit-box-content-item">
          <span class="label-name">权属办理中存在问题：</span>
          <span class="label-value">{{ detail.ownershipHandleProblems || '' }}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">划转历史遗留问题：</span>
          <span class="label-value">{{ detail.houseTransferHisProblem || '' }}</span>
        </div>
      </div>
    </div>
    <div class="edit-box">
      <div class="edit-box-title"><i></i><span>转运营（物业）</span></div>
      <div class="edit-box-content">
        <a-table :columns="columns" :dataSource="dataSource" class="custom-table td-pd10 table-border" :pagination="false"> </a-table>
      </div>
    </div>
    <div class="edit-box">
      <div class="edit-box-title"><i></i><span>权属概况</span></div>
      <div class="edit-box-content">
        <a-table bordered :columns="ownershipColumns" :dataSource="ownershipDataSource" class="custom-table th-td-padding-10-20" :pagination="false">
        </a-table>
      </div>
    </div>
    <div class="edit-box">
      <div class="edit-box-title"><i></i><span>资产状况</span></div>
      <div class="edit-box-content">
        <div class="asset-condition">
          <a-row class="asset-project-header">
            <a-col v-for="(item, index) in assetStatistics" :key="index" :span="4">
              <div class="asset-project-item custom-height">
                <div class="asset-project-item-title" style="font-size: 14px; margin-bottom: 10px">{{ item.title }}</div>
                <div class="asset-project-item-number" style="font-size: 20px; font-weight: bold; color: #324057">
                  {{ item.area || 0 }}<span v-show="item.percent">({{ item.percent }})</span>
                </div>
              </div>
            </a-col>
          </a-row>
          <a-row class="asset-project-content" v-for="(item, index) in assetList" :key="index">
            <a-col :span="4">
              <div class="asset-project-introduction">
                <!-- <img :src="item.pictureUrl"> -->
                <div class="asset-project-introduction-name">{{ item.placeName }}</div>
              </div>
            </a-col>
            <a-col :span="4"
              ><div class="asset-project-item">
                <div class="asset-project-item-number">
                  {{ item.operationNum }}<span>({{ item.operationNumPercent }})</span>
                </div>
              </div></a-col
            >
            <a-col :span="4"
              ><div class="asset-project-item">
                <div class="asset-project-item-number">
                  {{ item.idleNum }}<span>({{ item.idleNumPercent }})</span>
                </div>
              </div></a-col
            >
            <a-col :span="4"
              ><div class="asset-project-item">
                <div class="asset-project-item-number">
                  {{ item.selfUseNum }}<span>({{ item.selfUseNumPercent }})</span>
                </div>
              </div></a-col
            >
            <a-col :span="4"
              ><div class="asset-project-item">
                <div class="asset-project-item-number">
                  {{ item.occupyNum }}<span>({{ item.occupyNumPercent }})</span>
                </div>
              </div></a-col
            >
            <a-col :span="4"
              ><div class="asset-project-item">
                <div class="asset-project-item-number">
                  {{ item.otherNum }}<span>({{ item.otherNumPercent }})</span>
                </div>
              </div></a-col
            >
          </a-row>
          <SG-FooterPagination
            :pageLength="paginator.pageLength"
            :totalCount="paginator.totalCount"
            location="absolute"
            v-model="paginator.pageNo"
            @change="handlePageChange"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { dateToString } from 'utils/formatTime';
import { basics } from '@/config/config.url';
// import _ from 'lodash'
const columns = [
  {
    title: '转运营日期',
    dataIndex: 'transferOperationTime',
    width: '160',
  },
  {
    title: '转运营面积',
    dataIndex: 'transferOperationArea',
    width: '160',
  },
  {
    title: '转物业日期',
    dataIndex: 'transferTime',
    width: '160',
  },
  {
    title: '转物业面积',
    dataIndex: 'transferArea',
    width: '160',
  },
];

const ownershipColumns = [
  {
    title: '所有权',
    children: [
      {
        title: '总数',
        dataIndex: 'ownerShipCount',
      },
      {
        title: '有证',
        dataIndex: 'ownerShipYesCount',
      },
      {
        title: '待办',
        dataIndex: 'ownerShipWaitCount',
      },
      {
        title: '无证',
        dataIndex: 'ownerShipNoCount',
      },
    ],
  },
  {
    title: '使用权',
    children: [
      {
        title: '总数',
        dataIndex: 'useShipCount',
      },
      {
        title: '有证',
        dataIndex: 'useShipYesCount',
      },
      {
        title: '待办',
        dataIndex: 'useShipWaitCount',
      },
      {
        title: '无证',
        dataIndex: 'useShipNoCount',
      },
    ],
  },
  {
    title: '权属办理进度',
    dataIndex: 'progress',
    width: 120,
  },
];

export default {
  data() {
    return {
      projectId: '',
      sourceType: '', // 来源方式字典值，其他 99，租入 4，自建 3，外购 2，划转 1
      detail: {
        organName: '',
        projectName: '',
        projectCode: '',
        sourceTypeName: '',
        souceChannelType: '',
        takeOver: '',
        takeOverDate: '',
        remark: '',
        attachment: [],
        transferApprovalDate: '',
        agreementSignDate: '',
        reportBasicInfoDate: '',
        houseVerificationDate: '',
        reportHouseTransferReqDate: '',
        ownershipHandleProblems: '',
        houseTransferHisProblem: '',
        takeoverAssetStatusName: '',
      },
      columns,
      dataSource: [],
      ownershipColumns,
      ownershipDataSource: [],
      assetStatistics: [
        { title: '所有资产(㎡)', area: '', percent: '' },
        { title: '运营(㎡)', area: '', percent: '' },
        { title: '闲置(㎡)', area: '', percent: '' },
        { title: '自用(㎡)', area: '', percent: '' },
        { title: '占用(㎡)', area: '', percent: '' },
        { title: '其他(㎡)', area: '', percent: '' },
      ],
      assetList: [],
      imgPrx: basics.common.imgStr,
      defaultImg: require('../../../assets/image/default_house.png'),
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0,
      },
    };
  },
  methods: {
    formatDate(value) {
      if (value) {
        return dateToString(new Date(value), 'yyyy-mm-dd');
      }
      return '';
    },
    // 页码发生变化
    handlePageChange(page) {
      this.paginator.pageNo = page.pageNo;
      this.paginator.pageLength = page.pageLength;
      this.getAssetList();
    },
    getDetail() {
      let form = {
        projectId: this.projectId,
      };
      this.$api.carPark.projectDetailsById(form).then((res) => {
        if (res.data.code === '0') {
          let { sourceType, projectId, ...others } = res.data.data;
          this.detail = others;
          projectId && this.getOwnershipData(projectId);
          this.sourceType = String(sourceType);
          this.detail.attachment.forEach((item) => {
            item.url = item.attachmentPath;
            item.name = item.oldAttachmentName;
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取转运营信息统计
    getTransferInfo() {
      let form = {
        projectId: this.projectId,
      };
      this.$api.assets.getProjectTransferByProjectId(form).then((res) => {
        if (res.data.code === '0') {
          let data = res.data.data;
          data.key = 0;
          data.transferOperationTime = this.formatDate(data.transferOperationTime);
          data.transferTime = this.formatDate(data.transferTime);
          this.dataSource = [data];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取权属概况
    getOwnershipData(projectId) {
      this.$api.assets.queryAssetProjectOwnershipInfo({ projectId, assetType: 5 }).then((res) => {
        if (res.data.code === '0') {
          let data = res.data.data;
          data.key = 0;
          data.progress = data.progress + '%';
          this.ownershipDataSource = [data];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取资产状况总数
    getAssetStatistics() {
      let form = {
        projectId: this.projectId,
      };
      this.$api.carPark.viewProjectCarParkDetails(form).then((res) => {
        if (res.data.code === '0') {
          let data = res.data.data;
          this.assetStatistics[0].area = data.allArea ? data.allArea.toFixed(2) : 0;
          this.assetStatistics[1].area = data.operationNum ? data.operationNum.toFixed(2) : 0;
          this.assetStatistics[1].percent = data.operationNumPercent;
          this.assetStatistics[2].area = data.idleNum ? data.idleNum.toFixed(2) : 0;
          this.assetStatistics[2].percent = data.idleNumPercent;
          this.assetStatistics[3].area = data.selfUseNum ? data.selfUseNum.toFixed(2) : 0;
          this.assetStatistics[3].percent = data.selfUseNumPercent;
          this.assetStatistics[4].area = data.occupyNum ? data.occupyNum.toFixed(2) : 0;
          this.assetStatistics[4].percent = data.occupyNumPercent;
          this.assetStatistics[5].area = data.otherNum ? data.otherNum.toFixed(2) : 0;
          this.assetStatistics[5].percent = data.otherNumPercent;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    getAssetList() {
      let form = {
        projectId: this.projectId,
        pageNum: this.paginator.pageNo,
        pageSize: this.paginator.pageLength,
      };
      this.$api.carPark.viewCarParkDetailsPage(form).then((res) => {
        if (res.data.code === '0') {
          let data = res.data.data.data;
          this.assetList = data;
          // this.assetList[0].pictureUrl = '/picture/2019/11/19/338/201911191743467970_1920_1080.JPEG'
          // let obj = _.cloneDeep(this.assetList[0])
          // this.assetList.push(obj)
          // this.assetList[1].pictureUrl = null
          this.assetList.forEach((item) => {
            if (item.pictureUrl) {
              item.pictureUrl = this.imgPrx + item.pictureUrl;
            } else {
              item.pictureUrl = this.defaultImg;
            }
          });
          this.paginator.totalCount = res.data.data.count;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
  mounted() {
    this.projectId = this.$route.query.projectId;
    this.getDetail();
    this.getTransferInfo();
    this.getAssetStatistics();
    this.getAssetList();
  },
};
</script>

<style lang="less" scoped>
.asset-project-view-detail {
  padding: 40px 105px 0 95px;
  .edit-box {
    text-align: left;
    color: #49505e;
    margin-bottom: 40px;
    .edit-box-title {
      height: 14px;
      font-size: 14px;
      font-weight: bold;
      i {
        display: block;
        height: 14px;
        width: 5px;
        margin-right: 10px;
        background: #0084ff;
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
        margin-bottom: 30px;
        .label-name {
          float: left;
          font-family: PingFang-SC-Regular;
          color: #282d5b;
          margin-right: 3px;
        }
      }
      .edit-box-content-item.total-width {
        width: 100%;
      }
      .asset-condition {
        border: 1px solid #eff2f7;
        /*border-left: 1px solid #EFF2F7;*/
        /*border-top: 1px solid #EFF2F7;*/
        border-right: none;
        position: relative;
        padding-bottom: 70px;
        .custom-height {
          padding: 18px 0;
          height: auto !important;
        }
        .asset-project-header {
          .asset-project-item {
            height: 80px;
            padding: 18px 0;
            text-align: center;
            color: white;
            border-right: 1px solid #eff2f7;
            border-bottom: 1px solid #eff2f7;
            .asset-project-item-title {
              font-size: 12px;
              margin-bottom: 3px;
            }
            .asset-project-item-number {
              font-size: 16px;
              font-weight: bold;
              span {
                font-size: 12px;
                font-weight: normal;
              }
            }
          }
          .ant-col-4 {
            &:nth-child(1) .asset-project-item {
              background: white;
              color: #49505e;
            }
            &:nth-child(2) {
              background: #1ec76a;
            }
            &:nth-child(3) {
              background: #46a6ff;
            }
            &:nth-child(4) {
              background: #e49aeb;
            }
            &:nth-child(5) {
              background: #fd9090;
            }
            &:nth-child(6) {
              background: #bbc8d6;
            }
          }
        }
        .asset-project-content {
          .asset-project-introduction {
            height: 80px;
            padding: 10px;
            border-right: 1px solid #eff2f7;
            border-bottom: 1px solid #eff2f7;
            display: flex;
            align-items: center;
            justify-content: center;
            img {
              width: 60px;
              height: 60px;
              margin-right: 10px;
            }
          }
          .asset-project-item {
            height: 80px;
            text-align: center;
            color: #959dab;
            border-right: 1px solid #eff2f7;
            border-bottom: 1px solid #eff2f7;
            display: flex;
            align-items: center;
            justify-content: center;
            .asset-project-item-number {
              font-size: 16px;
              font-weight: bold;
              span {
                font-size: 12px;
                font-weight: normal;
              }
            }
          }
        }
      }
    }
  }
  .custom-table {
    & /deep/ .ant-table .ant-table-placeholder {
      display: block;
      border-bottom: 1px solid #e8e8e8;
    }
  }
}
</style>
