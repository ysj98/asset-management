<template>
  <div class="asset-project-view-detail">
    <div class="edit-box" >
      <SG-Title title="基本信息"/>
      <div class="edit-box-content two">
        <div class="edit-box-content-item">
          <span class="label-name">组织机构名称：</span>
          <span class="label-value">{{detail.organName || '无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">所属项目：</span>
          <span class="label-value">{{detail.projectName || '无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">保险单号：</span>
          <span class="label-value">{{detail.insuranceCode || '无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">保险类型：</span>
          <span class="label-value">{{detail.insuranceTypeName || '无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">投保人：</span>
          <span class="label-value">{{detail.policyHolder || '无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">保险公司：</span>
          <span class="label-value">{{detail.insuranceCompanyName || '否'}}</span>
        </div>
      </div>
      <div class="edit-box-content two">
        <div class="edit-box-content-item">
          <span class="label-name">保险公司电话：</span>
          <span class="label-value">{{detail.insurancePhone || '无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">保单金额：</span>
          <span class="label-value">{{detail.policyAmount || '无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">保险有效期：</span>
          <span class="label-value">{{detail.periodOfInsurance ||'无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">保单状态：</span>
          <span class="label-value">{{detail.insuranceStatusName ||'无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">创建时间：</span>
          <span class="label-value">{{detail.createDate ||'无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">创建人：</span>
          <span class="label-value">{{detail.createUserName ||'无'}}</span>
        </div>
      </div>
      <div class="edit-box-content two">
        <span>备注：</span>
        <span>{{ detail.remark || '无' }}</span>
      </div>
      <div class="edit-box-content">
        <p>附件：<span v-if="attachmentList.length<=0">无</span></p>
        <!--  -->
        <UploadFile
          v-if="attachmentList && attachmentList.length > 0"
          :baseImgURL="configBase.hostImg1"
          type="all"
          v-model="attachmentList"
          :max="10"
          :maxSize="80"
          >
          <span slot="tips">(注：上传的附件最多为 10 个,且文件大小小于80M)</span>
        </UploadFile>
      </div>
    </div>
    <SG-Title title="资产信息"/>
    <a-table
      v-bind="tableObj"
      size="middle">
    </a-table>
    <SG-FooterPagination v-bind="paginationObj" @change="pageChange"/>
  </div>
</template>

<script>
import SGUploadFilePlus from "@/components/SGUploadFilePlus";
import configBase from "@/config/config.base";
export default {
  components: {SGUploadFilePlus},
  data () {
    return {
      configBase,
      insuranceId:'',
      attachmentList: [],
      detail:{},
      tableObj: {
        pagination: false,
        rowKey: 'assetCode',
        loading: false,
        dataSource: [],
        columns: [
          { title: '序号', dataIndex: 'index', fixed: 'left'},
          { title: '资产编码', dataIndex: 'assetCode' },
          { title: '资产名称', dataIndex: 'assetName' },
          { title: '地址', dataIndex: 'address', ellipsis: true },
          { title: '资产类型', dataIndex: 'assetTypeName' },
          { title: '资产分类', dataIndex: 'objectTypeName' },
          { title: '资产面积（㎡）', dataIndex: 'area' }
        ]
      },
      paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
    }
  },
  created () {

    this.insuranceId = this.$route.query.insuranceId
    this.getDetailBaseInfo()
    this.getDetailAssetInfo()
  },
  methods: {
    pageChange (val) {
      this.paginationObj.pageLength = val.pageLength
      this.paginationObj.pageNo = val.pageNo
      this.getDetailAssetInfo()
    },
    getDetailBaseInfo () {
      this.$api.assetInsurance.getDetailBaseInfo({ insuranceId: this.insuranceId }).then(res => {
        if(res.data.code === '0') {
          this.detail = res.data.data
          if (this.detail.attachmentList && this.detail.attachmentList.length > 0) {
            this.detail.attachmentList.forEach((item) => {
              this.attachmentList.push({
                url: item.attachmentPath,
                name: item.newAttachmentName,
              });
            });
          }
        }
      }).catch(err => {
        console.log(err)      
        this.$message.error('查询失败' || err)  
      })
    },
    // 资产信息
    getDetailAssetInfo () {
      let {insuranceId, paginationObj: {pageNo,pageLength}} = this
      this.$api.assetInsurance.getDetailAssetInfo({ insuranceId: insuranceId, pageNum: pageNo, pageSize: pageLength  })
      .then(res => {
        if(res.data.code === '0') {
          this.tableObj.dataSource = res.data.data.data
          this.tableObj.dataSource.forEach((item, index) => {
            item.index = index+1
          })
          this.paginationObj.totalCount = res.data.data.count
        }
      }).catch(err => {
        this.$message.error('查询失败' || err)
      })
    }
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
      .two {
        margin-top: 0;
      }
    }
    .custom-table {
      & /deep/ .ant-table .ant-table-placeholder {
        display: block;
        border-bottom: 1px solid #e8e8e8;
      }
    }
    
  }
  .custom-table {
      padding-bottom: 70px;
    }
</style>
