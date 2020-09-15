<!--
  资产项目视图详情-戚思婷
-->
<template>
  <div class="asset-project-view-detail">
    <div class="edit-box" style="margin-bottom: 10px">
      <div class="edit-box-title"><i></i><span>基础信息</span></div>
      <div class="edit-box-content">
        <div class="edit-box-content-item">
          <span class="label-name">管理机构：</span>
          <span class="label-value">{{detail.organName || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">资产项目名称：</span>
          <span class="label-value">{{detail.projectName || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">资产项目编码：</span>
          <span class="label-value">{{detail.projectCode || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">来源方式：</span>
          <span class="label-value">{{detail.sourceTypeName || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">来源渠道：</span>
          <span class="label-value">{{detail.souceChannelType || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">是否接管：</span>
          <span class="label-value">{{detail.takeOver === 1 ? '是' : '否'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">接管时间：</span>
          <span class="label-value">{{formatDate(detail.takeOverDate) || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">接管时资产状态：</span>
          <span class="label-value">{{detail.takeoverAssetStatusName || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">项目状态：</span>
          <span class="label-value">{{detail.takeoverAssetStatusName || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">备注：</span>
          <span class="label-value">{{detail.remark || '--'}}</span>
        </div>
        <div class="edit-box-content-item" v-show="detail.attachment.length === 0">
          <span class="label-name">附件：</span>
          <span class="label-value">--</span>
        </div>
        <div class="edit-box-content-item total-width" v-show="detail.attachment.length > 0">
          <span class="label-name">附件：</span>
          <span class="label-value">
            <SG-UploadFile
              type="all"
              :show="true"
              v-model="detail.attachment"/>
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
          <span class="label-value">{{formatDate(detail.transferApprovalDate) || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">协议签署时间：</span>
          <span class="label-value">{{formatDate(detail.agreementSignDate) || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">上报基础情况表时间：</span>
          <span class="label-value">{{formatDate(detail.reportBasicInfoDate) || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">资产核实时间：</span>
          <span class="label-value">{{formatDate(detail.houseVerificationDate) || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">上报划转请示时间：</span>
          <span class="label-value">{{formatDate(detail.reportHouseTransferReqDate) || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">上报核实报告时间：：</span>
          <span class="label-value">{{detail.reportingVerificationReportDate || '--'}}</span>
        </div>
      </div>
      <!--当来源方式为 外购 字典值2-->
      <div class="edit-box-content" v-else-if="sourceType === '2'">
        <div class="edit-box-content-item">
          <span class="label-name">购买日期：</span>
          <span class="label-value">{{formatDate(detail.purchaseDate) || '--'}}</span>
        </div>
      </div>
      <!--当来源方式为 自建 字典值3-->
      <div class="edit-box-content" v-else-if="sourceType === '3'">
        <div class="edit-box-content-item">
          <span class="label-name">开发商：</span>
          <span class="label-value">{{detail.developers || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">承建商：</span>
          <span class="label-value">{{detail.contractor || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">竣工日期：</span>
          <span class="label-value">{{formatDate(detail.completionDate) || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">交付日期：</span>
          <span class="label-value">{{formatDate(detail.deliveryDate) || '--'}}</span>
        </div>
      </div>
      <!--当来源方式为 租入 字典值4-->
      <div class="edit-box-content" v-else-if="sourceType === '4'">
        <div class="edit-box-content-item">
          <span class="label-name">租入开始日期：</span>
          <span class="label-value">{{formatDate(detail.leaseInStartDate) || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">租入结束日期：</span>
          <span class="label-value">{{formatDate(detail.leaseInEndDate) || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">租入合同编号：</span>
          <span class="label-value">{{detail.leaseInContractNo || '--'}}</span>
        </div>
      </div>
      <div class="edit-box-content" :style="['1', '2', '3', '4'].includes(sourceType) ? 'margin-top: 0' : ''">
        <div class="edit-box-content-item">
          <span class="label-name">权属办理中存在问题：</span>
          <span class="label-value">{{detail.ownershipHandleProblems || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">划转历史遗留问题：</span>
          <span class="label-value">{{detail.houseTransferHisProblem || '--'}}</span>
        </div>
      </div>
    </div>
    <div class="edit-box">
      <div class="edit-box-title"><i></i><span>权属概况</span></div>
      <div class="edit-box-content">
        <a-table
          bordered
          :columns="ownershipColumns"
          :dataSource="ownershipDataSource"
          class="custom-table th-td-padding-10-20"
          :pagination="false"
        >
        </a-table>
      </div>
    </div>
    <div class="edit-box">
      <div class="edit-box-title"><i></i><span>资产状况</span></div>
      <div class="edit-box-content">
        <div class="asset-condition">
          <a-row class="asset-project-header">
            <a-col v-for="(item,index) in assetStatistics" :key="index" :span="4">
              <div class="asset-project-item custom-height">
                <div class="asset-project-item-title" style="font-size: 14px; margin-bottom: 10px">{{item.title}}</div>
                <div class="asset-project-item-number" style="font-size:20px; font-weight:bold; color:#324057">{{item.area || 0}}</div>
              </div>
            </a-col>
          </a-row>
          <a-row class="asset-project-content" v-for="(item,index) in assetList" :key="index">
            <a-col :span="4">
              <div class="asset-project-introduction">
                <img :src="item.pictureUrl">
                <div class="asset-project-introduction-name">{{item.buildName}}</div>
              </div>
            </a-col>
            <a-col :span="4"><div class="asset-project-item"><div class="asset-project-item-number">{{item.operationNum}}<span>({{item.operationNumPercent}})</span></div></div></a-col>
            <a-col :span="4"><div class="asset-project-item"><div class="asset-project-item-number">{{item.idleNum}}<span>({{item.idleNumPercent}})</span></div></div></a-col>
            <a-col :span="4"><div class="asset-project-item"><div class="asset-project-item-number">{{item.selfUseNum}}<span>({{item.selfUseNumPercent}})</span></div></div></a-col>
            <a-col :span="4"><div class="asset-project-item"><div class="asset-project-item-number">{{item.occupyNum}}<span>({{item.occupyNumPercent}})</span></div></div></a-col>
            <a-col :span="4"><div class="asset-project-item"><div class="asset-project-item-number">{{item.otherNum}}<span>({{item.otherNumPercent}})</span></div></div></a-col>
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
import {dateToString} from 'utils/formatTime'
import { basics } from '@/config/config.url'
// import _ from 'lodash'

const ownershipColumns = [
  {
    title: '有证',
    dataIndex: 'useShipYesCount'
  },
  {
    title: '无证',
    dataIndex: 'useShipNoCount'
  },
  {
    title: '待办',
    dataIndex: 'useShipWaitCount'
  },
  {
    title: '权属办理进度',
    dataIndex: 'progress'
  }]

export default {
  data () {
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
        takeoverAssetStatusName: ''
      },
      ownershipColumns,
      ownershipDataSource: [],
      assetStatistics: [
        {title: '所有资产(㎡)', area: '', percent: ''},
        {title: '运营(㎡)', area: '', percent: ''},
        {title: '闲置(㎡)', area: '', percent: ''},
        {title: '自用(㎡)', area: '', percent: ''},
        {title: '占用(㎡)', area: '', percent: ''},
        {title: '其他(㎡)', area: '', percent: ''}
      ],
      assetList: [],
      imgPrx: basics.common.imgStr,
      defaultImg: require('../../../assets/image/default_house.png'),
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0
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
    // 页码发生变化
    handlePageChange (page) {
      this.paginator.pageNo = page.pageNo
      this.paginator.pageLength = page.pageLength
      this.getAssetList()
    },
    getDetail () {
      let form = {
        projectId: this.projectId
      }
      this.$api.assets.projectDetailsById(form).then(res => {
        if (res.data.code === '0') {
          let {sourceType, projectId, ...others}= res.data.data
          this.detail = others
          projectId && this.getOwnershipData(projectId)
          this.sourceType = String(sourceType)
          this.detail.attachment.forEach(item => {
            item.url = item.attachmentPath
            item.name = item.oldAttachmentName
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取权属概况
    getOwnershipData (projectId) {
      let form = {
        projectId,
        assetType: 4
      }
      this.$api.assets.queryAssetProjectOwnershipInfo(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data
          data.key = 0
          data.progress = data.progress + '%'
          this.ownershipDataSource = [data]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取资产状况总数
    getAssetStatistics () {
      let form = {
        projectId: this.projectId
      }
      this.$api.land.viewGetAssetLandStatistics(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data
          this.assetStatistics[0].area = data.measuredArea.toFixed(2)
          this.assetStatistics[1].area = data.transferOperationArea.toFixed(2)
          this.assetStatistics[2].area = data.idleArea.toFixed(2)
          this.assetStatistics[3].area = data.selfUserArea.toFixed(2)
          this.assetStatistics[4].area = data.occupationArea.toFixed(2)
          this.assetStatistics[5].area = data.otherArea.toFixed(2)
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产状况列表
    getAssetList () {
      let form = {
        projectId: this.projectId,
        pageNum: this.paginator.pageNo,
        pageSize: this.paginator.pageLength
      }
      console.log('获取列表获取列表')
      this.$api.land.viewLandDetailsPage(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data.data
          this.assetList = data
          this.assetList.forEach(item => {
            if (item.pictureUrl) {
              item.pictureUrl = this.imgPrx + item.pictureUrl
            } else {
              item.pictureUrl = this.defaultImg
            }
          })
          this.paginator.totalCount = res.data.data.count
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  mounted () {
    this.projectId = this.$route.query.projectId
    this.getDetail()
    this.getAssetStatistics()
    this.getAssetList()
  }
}
</script>

<style lang="less" scoped>
  .asset-project-view-detail {
    padding: 40px 105px 0 95px;
    .edit-box {
      text-align: left;
      color: #49505E;
      margin-bottom: 40px;
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
          margin-bottom: 30px;
          .label-name {
            float: left;
            font-family: PingFang-SC-Regular;
            color: #282D5B;
            margin-right: 3px;
          }
        }
        .edit-box-content-item.total-width {
          width: 100%;
        }
        .asset-condition {
          border: 1px solid #EFF2F7;
          /*border-left: 1px solid #EFF2F7;*/
          /*border-top: 1px solid #EFF2F7;*/
          border-right: none;
          position: relative;
          padding-bottom: 50px;
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
              border-right: 1px solid #EFF2F7;
              border-bottom: 1px solid #EFF2F7;
              .asset-project-item-title {
                font-size: 12px;
                margin-bottom: 3px;
              }
              .asset-project-item-number {
                font-size: 16px;
                font-weight:bold;
                span {
                  font-size: 12px;
                  font-weight: normal;
                }
              }
            }
            .ant-col-4 {
              &:nth-child(1) .asset-project-item{
                background: white;
                color: #49505E;
              }
              &:nth-child(2) {
                background: #1EC76A;
              }
              &:nth-child(3) {
                background: #46A6FF;
              }
              &:nth-child(4) {
                background: #E49AEB;
              }
              &:nth-child(5) {
                background: #FD9090;
              }
              &:nth-child(6) {
                background: #BBC8D6;
              }
            }
          }
          .asset-project-content {
            .asset-project-introduction {
              height: 80px;
              padding: 10px;
              border-right: 1px solid #EFF2F7;
              border-bottom: 1px solid #EFF2F7;
              display: flex;
              align-items: center;
              img {
                width: 60px;
                height: 60px;
                margin-right: 10px;
              }
            }
            .asset-project-item {
              height: 80px;
              text-align: center;
              color: #959DAB;
              border-right: 1px solid #EFF2F7;
              border-bottom: 1px solid #EFF2F7;
              display: flex;
              align-items: center;
              justify-content: center;
              .asset-project-item-number {
                font-size: 16px;
                font-weight:bold;
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
