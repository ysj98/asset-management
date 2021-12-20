<!--楼栋视图业务-楼栋视图详情页面-其它信息组件-->
<template>
  <div class="other_info">
    <a-spin :spinning="spinning">
      <SG-Title title="其它信息"/>
      <a-table v-bind="tableObj" :pagination="false" class="custom-table td-pd10 title_div table-border">
        <span slot="action" slot-scope="text, record">
          <span class="btn-text">下载</span>
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
        tableObj: {
          rowKey: 'buildId',
          dataSource: [],
          columns: [
            { title: '档案分类', dataIndex: 'address', key: 'address' },
            { title: '档案名称', dataIndex: 'tags', key: 'tags'},
            { title: '档案日期', dataIndex: 'tagss', key: 'tagss'},
            { title: '归档人', dataIndex: 'taas', key: 'taas'},
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
          buildId: this.buildId
        }
        this.$api.assets.queryAssetViewArchiveDetail(form).then(res => {
          if (Number(res.data.code) === 0) {
            this.spinning = false
          } else {
            this.$message.error(res.data.message)
          }
        })
      }
    },
    watch: {}
  }
</script>

<style lang='less' scoped>
  // .other_info {
  // }
</style>
