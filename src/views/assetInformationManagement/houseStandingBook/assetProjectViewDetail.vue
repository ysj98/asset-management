<!--
  资产项目视图详情
-->
<template>
  <div class="asset-project-view-detail">
    <div class="edit-box" style="margin-bottom: 10px">
      <div class="edit-box-title"><i></i><span>基础信息</span></div>
      <div class="edit-box-content">
        <div class="edit-box-content-item">
          <span class="label-name">组织机构：</span>
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
          <span class="label-value">{{detail.sourceType || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">来源渠道：</span>
          <span class="label-value">{{detail.sourceChannelType || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">是否接管：</span>
          <span class="label-value">{{detail.takeOver === 1 ? '是' : '否'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">接管时间：</span>
          <span class="label-value">{{detail.takeOverDate || '--'}}</span>
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
      <div class="edit-box-content">
        <div class="edit-box-content-item">
          <span class="label-name">划转批复下发时间：</span>
          <span class="label-value">{{detail.transferApprovalDate || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">协议签署时间：</span>
          <span class="label-value">{{detail.agreementSignDate || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">上报基础情况表时间：</span>
          <span class="label-value">{{detail.reportBasicInfoDate || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">资产核实时间：</span>
          <span class="label-value">{{detail.houseVerificationDate || '--'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">上报划转请示时间：</span>
          <span class="label-value">{{detail.reportHouseTransferReqDate || '--'}}</span>
        </div>
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
      <div class="edit-box-title"><i></i><span>转运营（物业）</span></div>
      <div class="edit-box-content">
        <a-table
          :columns="columns"
          :dataSource="dataSource"
          class="custom-table"
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
              <div class="asset-project-item">
                <div class="asset-project-item-title">{{item.title}}</div>
                <div class="asset-project-item-number">{{item.area}}<span v-show="item.percent">({{item.percent}})</span></div>
              </div>
            </a-col>
          </a-row>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const columns = [
  {
    title: '转运营日期',
    dataIndex: 'transferOperationTime',
    width: '160'
  },
  {
    title: '转运营面积',
    dataIndex: 'transferOperationArea',
    width: '160'
  },
  {
    title: '转物业日期',
    dataIndex: 'transferTime',
    width: '160'
  },
  {
    title: '转物业面积',
    dataIndex: 'transferArea',
    width: '160'
  }]
export default {
  data () {
    return {
      projectId: '',
      detail: {
        organName: '',
        projectName: '',
        projectCode: '',
        sourceType: '',
        sourceChannelType: '',
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
        houseTransferHisProblem: ''
      },
      columns,
      dataSource: [],
      assetStatistics: [
        {title: '所有资产(㎡)', area: '', percent: ''},
        {title: '运营(㎡)', area: '', percent: ''},
        {title: '闲置(㎡)', area: '', percent: ''},
        {title: '自用(㎡)', area: '', percent: ''},
        {title: '占用(㎡)', area: '', percent: ''},
        {title: '其他(㎡)', area: '', percent: ''}
      ],
    }
  },
  methods: {
    getDetail () {
      let form = {
        projectId: this.projectId
      }
      this.$api.assets.projectDetailsById(form).then(res => {
        if (res.data.code === '0') {
          this.detail = res.data.data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取转运营信息统计
    getTransferInfo () {
      let form = {
        projectId: this.projectId
      }
      this.$api.assets.getProjectTransferByProjectId(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data
          data.key = 0
          this.dataSource = [data]
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
      this.$api.assets.viewProjectHouseDetails(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data
          this.assetStatistics[0].area = data.allAssetsNum.toFixed(2)
          this.assetStatistics[1].area = data.operationNum.toFixed(2)
          this.assetStatistics[1].percent = data.operationPercent
          this.assetStatistics[2].area = data.lieIdleNum.toFixed(2)
          this.assetStatistics[2].percent = data.lieIdlePercent
          this.assetStatistics[3].area = data.selfUseNum.toFixed(2)
          this.assetStatistics[3].percent = data.selfUsePercent
          this.assetStatistics[4].area = data.occupyNum.toFixed(2)
          this.assetStatistics[4].percent = data.occupyPercent
          this.assetStatistics[5].area = data.otherNum.toFixed(2)
          this.assetStatistics[5].percent = data.otherPercent
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  mounted () {
    this.projectId = this.$route.query.projectId
    this.getDetail()
    this.getTransferInfo()
    this.getAssetStatistics()
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
          .asset-project-header {
            .asset-project-item {
              height: 80px;
              padding: 18px 0;
              text-align: center;
              color: white;
              border-right: 1px solid #EFF2F7;
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
        }
      }
    }
  }
</style>