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
          <span class="label-name">资产ID：</span>
          <span class="label-value">{{detail.assetId || '无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">资产名称：</span>
          <span class="label-value">{{detail.assetName || '无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">资产类型：</span>
          <span class="label-value">{{detail.type && detail.type === '1'?'楼栋':'房屋' || '无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">资产分类：</span>
          <span class="label-value">{{detail.objectTypeName || '否'}}</span>
        </div>
      </div>
      <div class="edit-box-content two">
        <div class="edit-box-content-item">
          <span class="label-name">资产地址：</span>
          <div class="label-value label_div" :title="detail.pasitionString">{{detail.pasitionString || '无'}}</div>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">有无投保：</span>
          <span class="label-value">{{detail.insuranceStatus ? '有':'无'}}</span>
        </div>
        <div class="edit-box-content-item">
          <span class="label-name">投保情况：</span>
          <span class="label-value">
            <span>{{ detail.info && detail.info.length > 0 && detail.info.join(',') }}</span>
            <!-- {{detail.notStarted ? '待承保'+detail.notStarted+',':''}}{{ detail.notStarted && detail.effective  ? ',':''}}
            {{detail.effective ? '已生效'+detail.effective:''}} {{ detail.effective && detail.terminated  ? ',':''}}
            {{detail.terminated ? '已终止'+detail.terminated:''}} -->
            {{!detail.effective && !detail.notStarted && !detail.terminated ? '无':''}}
          </span>
        </div>
      </div>
    </div>
    <SG-Title title="投保信息"/>
    <a-table
      v-bind="tableObj"
      class="custom-table td-pd10">
      <template slot="action" slot-scope="text, record">
        <p @click="detailPolicy(record)" style="color: #40a9ff;cursor: pointer; font-size: 14px;margin-bottom:0;">详情</p>
      </template>
    </a-table>
    <SG-FooterPagination v-bind="paginationObj" @change="pageChange"/>
  </div>
</template>

<script>
import InsuranceType from '../components/InsuranceType.vue'
import InsuranceCompany from '../components/InsuranceCompany.vue'
import InsuranceStatus from '../components/InsuranceStatus.vue'
import {utils} from '@/utils/utils.js'
export default {
  components: {
    InsuranceType, InsuranceCompany, InsuranceStatus
  },
  data () {
    return {
      attachment: [],
      detail: {},
      tableObj: {
        pagination: false,
        // rowKey: 'assetId',
        loading: false,
        dataSource: [],
        columns: [
          { title: '序号', dataIndex: 'index'},
          { title: '保险单编号', dataIndex: 'insuranceId' },
          { title: '投保人', dataIndex: 'policyHolder' },
          { title: '保险类型', dataIndex: 'insuranceTypeName' },
          { title: '保险公司', dataIndex: 'insuranceCompanyName' },
          { title: '保单金额（元）', dataIndex: 'policyAmount' },
          { title: '保单状态', dataIndex: 'insuranceStatus' },
          { title: '保险有效期', dataIndex: 'periodOfInsurance'},
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }},
        ]
      },
      paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
      cloneList: []
    }
  },
  created () {
    this.detail = JSON.parse(this.$route.query.detail)
    let arr = []
    this.detail.notStarted ?  arr.push('待承保'+this.detail.notStarted) : arr
    this.detail.effective ? arr.push('已生效'+this.detail.effective) : arr
    this.detail.terminated ? arr.push('已终止'+this.detail.terminated): arr
    this.detail.info = arr 
    this.tableObj.dataSource = this.detail.insuranceResDetailList
    this.paginationObj.totalCount = this.tableObj.dataSource.length
    this.cloneList = utils.deepClone(this.tableObj.dataSource)
    this.getTable()
  },
  methods: {
    getTable () {
      let { paginationObj: {pageNo,pageLength } } = this
      this.tableObj.dataSource = 
      this.cloneList.slice((pageNo - 1) * pageLength, pageNo * pageLength)
      this.tableObj.dataSource.forEach((item,index) => {
        item.index = index+1
      })
    },
    pageChange (val) {
      this.paginationObj.pageNo = val.pageNo
      this.paginationObj.pageLength = val.pageLength
      this.getTable()
    },

    detailPolicy (row) {
      this.$router.push({path: '/insuranceManagement/insurancePolicy/insurancePolicyDetail', query: { insuranceId:  row.insuranceId }})
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
    .label_div {
      width: 260px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      cursor: pointer;
    }
  }
</style>
