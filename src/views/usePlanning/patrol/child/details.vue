<!--
 * @Author: L
 * @Date: 2020-11-05 10:01:40
 * @LastEditTime: 2020-11-18 15:56:02
 * @Description: 详情
-->
<template>
<a-spin :spinning="spinning">
  <div class="particulars">
    <div class="particulars-nav">
      <span class="section-title blue">基本信息</span>
      <SG-Button v-power="ASSET_MANAGEMENT.PATROL_DETAIL_EXPORT" size="small" style="float:right" type="primary" @click="downloadFn">导出巡查记录表</SG-Button>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col"
            :span="8"
            v-for="(item, index) in basicData"
            :key="index">
            {{item.name}}：{{basicObj[item.key] || '--'}}
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="particulars-nav">
      <span class="section-title blue">巡查结果</span>
      <div class="particulars-obj">
        <a-row class="playground-row">
          <a-col class="playground-col"
            :span="8"
            v-for="(item, index) in resultsData"
            :key="index">
            {{item.name}}：{{basicObj[item.key] || '--'}}
          </a-col>
          <a-col class="playground-col" :span="24">
            巡查现场图片：
            <span v-if="attachmentList.length === 0">无</span>
            <div class="umImg" v-if="attachmentList.length > 0">
              <SG-UploadFile v-model="attachmentList" type="all" :show="true" />
            </div>
          </a-col>
          <a-col class="playground-col" :span="24">
            整改后图片：
            <span v-if="rectifyAttachmentList.length === 0">无</span>
            <div class="umImg" v-if="rectifyAttachmentList.length > 0">
              <SG-UploadFile v-model="rectifyAttachmentList" type="all" :show="true" />
            </div>
          </a-col>
        </a-row>
      </div>
    </div>
    <div class="particulars-nav">
      <span class="section-title blue">检查项列表</span>
      <div class="particulars-obj">
        <div class="table-layout-fixed table-border">
          <a-table
            :loading="loading"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
          ></a-table>
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
</a-spin>
</template>

<script>
const columns = [
   {
    title: '序号',
    dataIndex: 'index',
    width: '10%'
  },
  {
    title: '检查项名称',
    dataIndex: 'itemName',
    width: '20%'
  }, {
    title: '检查结果',
    dataIndex: 'result',
    width: '35%'
  }, {
    title: '检查说明',
    dataIndex: 'remark',
    width: '35%'
  }
]
const basicData = [
  { name: '所属组织机构', key: 'organName'},
  { name: '巡查类型', key: 'inspectionTypeName'},
  { name: '计划巡查日期', key: 'inspectionDate'},
  { name: '巡查人', key: 'userNames'},
  { name: '巡查状态', key: 'inspectionStatusName'},
  { name: '资产项目', key: 'projectName'},
  { name: '资产类型', key: 'assetTypeName'},
  { name: '资产名称', key: 'assetName'},
  { name: '资产编码', key: 'assetCode'},
  { name: '资产分类', key: 'objectTypeName'},
  { name: '资产位置', key: 'position'}
]

const resultsData = [
  { name: '实际巡查日期', key: 'actualInspectionDate'},
  { name: '巡查问题描述', key: 'problemDescription'},
  { name: '现场处理措施', key: 'sceneHandleMeasure'},
  { name: '备注', key: 'remark'}
]
import { ASSET_MANAGEMENT } from "@/config/config.power";
export default {
  components: {},
  props: {},
  data() {
    return {
      spinning: false,
      ASSET_MANAGEMENT,
      recordId: '',           // 交付单id
      basicData, // 渲染基础信息
      resultsData, // 渲染巡查结果
      basicObj: {},             // 基本信息
      columns,
      loading: false,
      tableData: [],
      location: "",
      attachmentList: [], // 巡查图片
      rectifyAttachmentList: [], // 整改后图片
      noPageTools: false,
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
        count: "",
      },
    };
  },
  computed: {},
  watch: {
  },
  methods: {
      // 导出详情
    downloadFn () {
      let obj = {recordId: this.recordId}
      this.$api.useManage.exportList(obj).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '巡查记录详情.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    },
    // 查询基本信息
    query() {
      this.$api.useManage.getInspectionTaskRecord({recordId: this.recordId}).then((res) => {
        if (Number(res.data.code) === 0) {
          this.basicObj = res.data.data
          let date1 = this.basicObj.inspectionDate ? new Date(this.basicObj.inspectionDate) : ''
          let date2 = this.basicObj.actualInspectionDate ? new Date(this.basicObj.actualInspectionDate) : ''
          this.basicObj.inspectionDate = date1 ? `${date1.getFullYear()}-${date1.getMonth() + 1}-${date1.getDate()}` : ''
          this.basicObj.actualInspectionDate = date2 ? `${date2.getFullYear()}-${date2.getMonth() + 1}-${date2.getDate()}` : ''
          this.attachmentList = this.basicObj.attachmentList.map(item => {
            return {name: item.oldAttachmentName, url: item.attachmentPath}
          })
          this.rectifyAttachmentList = this.basicObj.rectifyAttachmentList.map(item => {
            return {name: item.oldAttachmentName, url: item.attachmentPath}
          })
        } else {
          this.$message.error(res.data.message)
        }
      });
    },
    // 查询检查项
    getInspectionCheckItemPageList () {
      this.loading = true
      let obj = {
        recordId: this.recordId,                  // 交付id
        pageNum: this.queryCondition.pageNum,         
        pageSize: this.queryCondition.pageSize
      }
      this.$api.useManage.getInspectionCheckItemPageList(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          this.checkedData = []
          data.forEach((item, index) => {
            item.index = index + 1
            item.key = item.itemId
          })
          this.queryCondition.count = res.data.data.count
          this.tableData = data
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.getInspectionCheckItemPageList()
    },
  },
  created() {},
  mounted() {
    this.recordId = this.$route.query.recordId
    this.spinning = true
    Promise.all([
      this.query(),
      this.getInspectionCheckItemPageList(),
    ]).then((res) => {
      this.spinning = false
    })
  },
};
</script>
<style lang="less" scoped>
.particulars {
  .particulars-nav {
    padding: 42px 126px 20px 70px;
    .particulars-obj {
      padding: 20px 0 20px 40px;
      .playground-row {
        .playground-col {
        line-height: 40px;
        font-size: 12px;
        word-break: break-all;
        }
      }
      .particulars-t {
        line-height: 40px;
        font-size:14px;
      }
    }
  }
}
</style>
