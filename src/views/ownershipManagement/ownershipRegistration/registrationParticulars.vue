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
          <a-col class="playground-col" :span="8">标&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; 题：{{particularsData.registerName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">登记类型：{{particularsData.registerTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">登&nbsp;&nbsp;&nbsp;记&nbsp;&nbsp;单&nbsp;&nbsp;&nbsp;状&nbsp;&nbsp;&nbsp;态：{{particularsData.approvalStatusName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产项目：{{particularsData.projectName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产类型：{{particularsData.assetTypeName || '--'}}</a-col>
          <!-- <a-col class="playground-col" :span="8">关联权属办理任务：{{particularsData.ownershipHandleName || '--'}}</a-col> -->
          <a-col class="playground-col" :span="8">创&nbsp;&nbsp;建&nbsp;&nbsp;人：{{particularsData.createByName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建时间：{{particularsData.createTime || '--'}}</a-col>
          <a-col class="playground-col" :span="24">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：{{particularsData.remark || '--'}}</a-col>
          <a-col class="playground-col" :span="24">附&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;件： <span v-if="files.length === 0">无</span>
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
      <span class="section-title blue">权属登记详情</span>
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
import {register} from './basics'
import {utils} from '@/utils/utils.js'
export default {
  components: {},
  props: {},
  data () {
    return {
      changeType: '',
      registerId: '',
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
      let arr = []
      arr = utils.deepClone(register)
      this.columns = arr.splice(0, arr.length - 1)
    }
  },
  methods: {
    // 查询详情
    query () {
      let obj = {
        registerId: this.registerId
      }
      this.$api.ownership.shipDetail(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.particularsData = data.registerInfo
          let files = []
          if (data.amsAttachmentList && data.amsAttachmentList.length > 0) {
              data.amsAttachmentList.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.oldAttachmentName
              })
            })
          }
          this.files = files
          data.amsOwnershipRegisterDetailList.forEach((item, index) => {
            item.key = index
            item.address = item.location
            item.assetArea = item.area
          })
          this.tableData = data.amsOwnershipRegisterDetailList
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
  },
  created () {
  },
  mounted () {
    this.particularsData = JSON.parse(this.$route.query.record)
    this.registerId = this.particularsData[0].registerId
    this.changeType = this.particularsData[0].changeType
    this.query()
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
            // height: 40px;
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
