<!--
  详情: particulars
  审核: audit
-->
<template>
  <div class="particulars">
    <div class="particulars-nav">
      <span class="section-title blue">基本信息</span>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="8">登记单编号：{{particularsData.registerOrderCode || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产项目名称：{{particularsData.projectName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产类型：{{particularsData.assetTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建人：{{particularsData.createByName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建时间：{{particularsData.createTime || '--'}}</a-col>
          <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
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
      <span class="section-title blue">资产明细</span>
      <div class="particulars-obj">
        <div class="tab-exhibition">
          <div class="exhibition" v-for="(item, index) in assetsTotal" :key="index">
            <p>{{item.name}}</p>
            <p>{{item.value}}</p>
          </div>
        </div>
      </div>
      <div class="particulars-obj">
        <!-- table-layout-fixed -->
        <div class="table-border">
          <a-table
            :scroll="{ x: 2600}"
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
    <div class="particulars-nav" v-if="type === 'audit'">
      <span class="section-title blue">审核信息</span>
      <div class="particulars-obj">
        <a-col class="playground-col" :span="8">审核人：{{particularsData.projectName || '--'}}</a-col>
        <a-col class="playground-col" :span="8">审核时间：{{particularsData.organName || '--'}}</a-col>
        <a-col class="playground-col remark" :span="24">审核意见：
          <a-textarea placeholder="请输入审核意见"
          :style="{width:'94%'}"
          :autosize="{ minRows: 3, maxRows: 3 }"
          v-decorator="remark"
          />
        </a-col>
      </div>
    </div>
  </div>
</template>

<script>
import {particulars} from './registerBasics'
const assetsTotal = [
  {
    code: 'assetsNum',
    name: '资产数量',
    value: '0'
  },
  {
    code: 'areaNum',
    name: '建筑面积',
    value: '0'
  },
  {
    code: 'originalNum',
    name: '资产原值',
    value: '0'
  },
  {
    code: 'marketValueNum',
    name: '市场价值',
    value: '0'
  }
]
export default {
  components: {},
  props: {},
  data () {
    return {
      assetsTotal: [...assetsTotal],
      record: '',
      type: '',
      remark: '',     // 意见
      particularsData: {},
      files: [],
      columns: particulars,
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
  methods: {
    // 查询详情
    query () {
      let obj = {
        registerOrderId: this.registerOrderId
      }
      this.$api.assets.getRegisterOrderById(obj).then(res => {
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
    getRegisterOrderDetailsPageByIdFn () {
      this.loading = true
      let obj = {
        registerOrderId: this.registerOrderId,
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize
      }
      this.$api.assets.getRegisterOrderDetailsPageById(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
            item.ownershipStatus = item.ownershipStatusName
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
      this.getRegisterOrderDetailsPageByIdFn()
    },
    // 资产登记-详情明细统计
    getRegisterOrderDetailsStatisticsFn () {
      let obj = {
        registerOrderId: this.registerOrderId
      }
      this.$api.assets.getRegisterOrderDetailsStatistics(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.assetsTotal.forEach(item => {
            Object.keys(data).forEach(key => {
              if (item.code === key) {
                item.value = data[key]
              }
            })
          })
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  created () {
  },
  mounted () {
    this.record = JSON.parse(this.$route.query.record)
    this.registerOrderId = this.record[0].registerOrderId
    this.query()
    this.getRegisterOrderDetailsPageByIdFn()
    this.getRegisterOrderDetailsStatisticsFn()
  }
}
</script>
<style lang="less" scoped>
.particulars {
  overflow: hidden;
  padding-bottom: 70px;
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
    .tab-exhibition {
      margin: 10px 0;
      display: flex;
      height: 83px;
      .exhibition {
        flex: 1;
        color: #fff;
        text-align: center;
        border-right: 1px solid #EFF2F7;
        p:nth-of-type(1) {
          padding-top: 14px;
          font-size: 12px;
        }
        p:nth-of-type(2) {
          font-size: 16px;
          font-weight: bold;
        }
      }
      .exhibition:nth-of-type(1){
        background-color: rgb(75, 210, 136);
      }
      .exhibition:nth-of-type(2){
        background-color: rgb(24, 144, 255);
      }
      .exhibition:nth-of-type(3){
        background-color: rgb(221, 129, 230);
      }
      .exhibition:nth-of-type(4){
        background-color: rgb(253, 116, 116);
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
.playground-col {
    height: 40px;
    line-height: 40px;
    font-size: 12px;
  }
.remark {
  line-height: 64px;
}
</style>
