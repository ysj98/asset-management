<!--楼栋视图业务-楼栋视图详情页面-其它信息组件-->
<template>
  <div class="other_info">
    <a-spin :spinning="spinning">
      <SG-Title title="其它信息"/>
      <a-table
        :columns="tableObj.columns"
        :dataSource="tableData"
        rowKey="archiveId"
        :pagination="false"
        class="custom-table td-pd10 title_div table-border"
      >
        <span slot="action" slot-scope="text, record">
          <span class="btn-text" style="color: #0084FF; cursor: pointer" @click="detail(record)">详情</span>
        </span>
      </a-table>
      <SG-FooterPagination ref="footerPagination" v-bind="paginationObj" @change="({pageNo, pageLength}) => fetchData({pageNo, pageLength})"/>
    </a-spin>
  </div>
</template>

<script>
  export default {
    name: 'OtherInfoPart',
    props: ['buildId', 'assetIds'],
    data () {
      return {
        spinning: false, // 页面加载状态
        paginationObj: {
          pageNum: 1,
          pageSize: 10,
          totalCount: 0
        },
        tableData: [],
        tableObj: {
          rowKey: 'buildId',
          dataSource: [],
          columns: [
            { title: '档案分类', dataIndex: 'typeName', key: 'typeName' },
            { title: '档案名称', dataIndex: 'archiveName', key: 'archiveName'},
            { title: '档案日期', dataIndex: 'filingDate', key: 'filingDate'},
            { title: '归档人', dataIndex: 'createByName', key: 'createByName'},
            { title: '操作', key: 'action', dataIndex: 'action', scopedSlots: { customRender: 'action' } }
          ]
        }
      }
    },
    mounted() {
      this.queryOtherInfo()
    },
    methods: {
      queryOtherInfo () {
        this.spinning = true
        let form = {
          buildId: this.buildId,
          pageNum: this.paginationObj.pageNum,
          pageSize: this.paginationObj.pageSize
        }
        this.$api.assets.queryAssetViewArchiveDetail(form).then(res => {
          if (Number(res.data.code) === 0) {
            this.tableData = res.data.data.data
          } else {
            this.$message.error(res.data.message)
          }
        }).finally(()=>{
          this.spinning = false
        })
      },
      detail(data) {
        window.parent.openPortalMenu('/archives-management/#/consultantFile/details?type=detail&archiveId=' + data.archiveId, '档案文件详情')
      },
    },
    watch: {}
  }
</script>

<style lang='less' scoped>
  // .other_info {
  // }
</style>
