<!--
  呈报表单详情
-->
<template>
  <div class="particulars">
    <div class="particulars-nav">
      <span class="section-title blue">基本信息</span>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col" :span="8">表单名称：{{particularsData.registerName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">表单编码：{{particularsData.registerTypeName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">状态：{{particularsData.approvalStatusName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建人：{{particularsData.createByName || '--'}}</a-col>
          <a-col class="playground-col" :span="8">创建时间：{{particularsData.createTime || '--'}}</a-col>
          <a-col class="playground-col" :span="24">备注：{{particularsData.remark || '--'}}</a-col>
        </a-row>
      </div>
    </div>
    <div class="particulars-nav">
      <span class="section-title blue">呈报数据列表</span>
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
        </div>
      </div>
    </div>
		<div class="particulars-nav">
      <span class="section-title blue">表单预览</span>
      <div class="particulars-obj">
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="previewColumns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
            >
          </a-table>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
const colu = [
  {
    title: "编号",
    dataIndex: "index"
  },
  {
    title: "字段名称",
    dataIndex: "index1"
  },
  {
    title: "字段编码",
    dataIndex: "index2"
  },
  {
    title: "字段类型",
    dataIndex: "index3"
  },
  {
    title: "字段格式",
    dataIndex: "index4"
  },
  {
    title: "字段长度",
    dataIndex: "index5"
  },
  {
    title: "字段值",
    dataIndex: "index6"
  },
  {
    title: "必填字段",
    dataIndex: "index7"
  }
]
const previewColumns = [
  {
    title: "所属机构",
    dataIndex: "index"
  },
  {
    title: "资产项目名称",
    dataIndex: "index1"
  },
  {
    title: "资产卡片名称",
    dataIndex: "index2"
  },
  {
    title: "资产卡片编码",
    dataIndex: "index3"
  },
  {
    title: "折旧月份",
    dataIndex: "index4"
  },
  {
    title: "本次折旧金额(月份)",
    dataIndex: "index5"
  },
  {
    title: "外部ID",
    dataIndex: "index6"
  }
]
export default {
  components: {},
  props: {},
  data () {
    return {
      changeType: '',
      registerId: '',
      particularsData: {},
      files: [],
			columns: colu,
			previewColumns: previewColumns,
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
        registerId: this.registerId
      }
      this.$api.ownership.shipDetail(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.particularsData = data.registerInfo
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
    }
  },
  created () {
  },
  mounted () {
    // this.particularsData = JSON.parse(this.$route.query.record)
    // this.registerId = this.particularsData[0].registerId
    // this.query()
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
