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
          <a-col class="playground-col" :span="8">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 题：{{particularsData.title || '--'}}</a-col>
          <a-col class="playground-col" :span="8">所属机构：{{particularsData.organName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产项目：{{particularsData.projectName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">当前状态：{{particularsData.approvalStatusName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">变动类型：{{particularsData.changeTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">变动日期：{{particularsData.changeDate || '--'}}</a-col>
          <a-col class="playground-col" :span="8">截止日期：{{particularsData.expiryDate || '--'}}</a-col>
          <a-col class="playground-col" :span="8">交付单位：{{particularsData.deliveryCompany || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建时间：{{particularsData.createTime || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建人：{{particularsData.createByName || '--'}}</a-col>
          <a-col class="playground-col" :span="24">情况说明：{{particularsData.remark || '--'}}</a-col>
          <a-col class="playground-col" :span="24">附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 件： <span v-if="files.length === 0">无</span>
            <div class="umImg" v-if="files.length > 0">
              <SG-UploadFile
                v-model="files"
                type="all"
                :show="true"
              />
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
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
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
  </div>
</template>

<script>
import {deliveryProperty, deliveryOperation, changeDirectionUse, variationOriginalValue, positionChange, projectChange} from './basics'
export default {
  components: {},
  props: {},
  data () {
    return {
      changeType: '',
      changeOrderId: '',
      particularsData: {},
      files: [],
      columns: [],
      loading: false,
      tableData: [],
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
  watch: {
    'changeType' (value) {
      let val = String(value)
      if (val === '2') {
        deliveryProperty.pop()
        this.columns = deliveryProperty
      } else if (val === '1') {
        deliveryOperation.pop()
        this.columns = deliveryOperation
      } else if (val === '4') {
        changeDirectionUse.pop()
        this.columns = changeDirectionUse
      } else if (val === '3') {
        variationOriginalValue.pop()
        this.columns = variationOriginalValue
      } else if (val === '5') {
        positionChange.pop()
        this.columns = positionChange
      } else if (val === '6') {
        projectChange.pop()
        this.columns = projectChange
      }
    }
  },
  methods: {
    // 查询详情
    query () {
      let obj = {
        changeOrderId: this.changeOrderId
      }
      this.$api.assets.getChangeDetail(obj).then(res => {
        console.log(res)
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.particularsData = data
          let files = []
          if (data.attachment && data.attachment.length > 0) {
              data.attachment.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.newAttachmentName
              })
            })
          }
          this.files = files
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产列表
    getChangeDetailPageFn () {
      this.loading = true
      let obj = {
        changeOrderId: this.changeOrderId,
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize
      }
      this.$api.assets.getChangeDetailPage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
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
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.getChangeDetailPageFn()
    },
  },
  created () {
  },
  mounted () {
    this.particularsData = JSON.parse(this.$route.query.record)
    this.changeOrderId = this.particularsData[0].changeOrderId
    this.changeType = this.particularsData[0].changeType
    this.query()
    this.getChangeDetailPageFn()
  }
}
</script>
<style lang="less" scoped>
.particulars {
  .particulars-nav{
      padding: 42px 126px 20px 70px;
      .particulars-obj {
        padding: 20px 0 20px 40px;
        .playground-row {
          .playground-col {
            height: 40px;
            line-height: 40px;
            font-size: 12px;
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
</style>
