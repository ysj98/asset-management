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
          <a-col class="playground-col" :span="8">资产项目名称：{{particularsData.objectName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">资产类型：{{particularsData.assetType || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建人：{{particularsData.createByName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建时间：{{particularsData.objectName || '--'}}</a-col>
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
      <span class="section-title blue">资产列表</span>
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
import {columnsData} from './registerBasics'
export default {
  components: {},
  props: {},
  data () {
    return {
      type: '',
      remark: '',     // 意见
      particularsData: {},
      files: [],
      columns: [...columnsData],
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
        registerOrderId: ''
      }
      this.$api.assets.getRegisterOrderById(obj).then(res => {
        console.log(res)
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          console.log(data, '-=-=')
          this.particularsData = data
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产列表
    getRegisterOrderDetailsPageByIdFn () {
      this.loading = true
      let obj = {
        registerOrderId: '',
        pageNum: this.queryCondition.pageNum,
        pageSize: this.queryCondition.pageSize
      }
      this.$api.assets.getRegisterOrderDetailsPageById(obj).then(res => {
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
      this.getRegisterOrderDetailsPageByIdFn()
    },
  },
  created () {
  },
  mounted () {
    console.log(this.columnsData, '12321')
    this.query()
    this.getRegisterOrderDetailsPageByIdFn()
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
