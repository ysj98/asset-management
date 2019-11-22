<!--资产项目管理业务-资产项目管理详情页面-其它信息组件-->
<template>
  <div class="other_info">
    <!--资产概况-->
    <SG-Title title="资产概况" noMargin/>
    <a-table v-bind="overviewTable" class="custom-table td-pd10 title_div"/>
    <!--转运营(物业)-->
    <SG-Title title="转运营(物业)" noMargin/>
    <a-table v-bind="operateTable" class="custom-table td-pd10 title_div"/>
    <!--权属情况-->
    <SG-Title title="权属情况" noMargin/>
    <a-table v-bind="ownTable" class="custom-table td-pd10 title_div" style="border: 1px solid #e8e8e8"/>
    <!--审批轨迹-->
    <SG-Title title="审批轨迹" noMargin/>
    <SG-TrackStep v-if="stepList.length" :stepList="stepList" class="title_div"/>
    <div v-else style="text-align: center; margin: 25px 0">暂无数据</div>
  </div>
</template>

<script>
  export default {
    name: 'OtherInfo',
    props: ['projectId'],
    data () {
      return {
        overviewTable: {
          loading: false,
          pagination: false,
          rowKey: 'assetTypeName',
          dataSource: [],
          columns: [
            { title: '资产类型', dataIndex: 'assetTypeName', key: 'assetTypeName'},
            { title: '楼栋数', dataIndex: 'buildNum', key: 'buildNum' },
            { title: '资产数', dataIndex: 'assetNum', key: 'assetNum', align: 'assetNum' },
            { title: '面积', key: 'area', dataIndex: 'area', align: 'right' },
            { title: '资产账面原值', key: 'originalValue', dataIndex: 'originalValue', align: 'right' },
            { title: '资产市值', key: 'marketValue', dataIndex: 'marketValue', align: 'right' }
          ]
        }, // 资产概况Table
        operateTable: {
          dataSource: [],
          loading: false,
          pagination: false,
          // rowKey: 'transferOperationTime',
          columns: [
            { title: '转运营日期', dataIndex: 'transferOperationTime', key: 'transferOperationTime' },
            { title: '转运营面积(㎡)', dataIndex: 'transferOperationArea', key: 'transferOperationArea' },
            { title: '转物业日期', dataIndex: 'transferTime', key: 'transferTime' },
            { title: '处置收入费用科目', key: 'transferArea', dataIndex: 'transferArea' }
          ]
        }, // 转运营(物业)Table
        ownTable: {
          dataSource: [],
          bordered: true,
          rowKey: 'assetCode',
          pagination: false,
          columns: [
            { title: '有证', children: [
              { title: '产权', dataIndex: 'a1', key: 'a1' },
              { title: '使用权', dataIndex: 'a12', key: 'a11' }
            ] },
            { title: '待办', children: [
              { title: '产权', dataIndex: 'a2', key: 'a2' },
              { title: '使用权', dataIndex: 'a21', key: 'a22' }
            ] },
            { title: '无证', dataIndex: 'a3', key: 'a3' },
            { title: '权属办理进度', key: 'a31', dataIndex: 'a31' }
          ]
        }, // 权属概况Table
        stepList: [
          // { date: moment(), title: '修改', desc: '待修改', isDone: true, operation: [] }
        ] // 审批轨迹
      }
    },

    methods: {
      // 查询资产概况
      queryGeneralInfo () {
        this.overviewTable.loading = true
        this.$api.assets.queryProjectManageGeneralInfo({projectId: this.projectId}).then(r => {
          this.overviewTable.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.overviewTable.dataSource = res.data
            return false
          }
          throw res.message || '查询资产概况接口出错'
        }).catch(err => {
          this.overviewTable.loading = false
          this.$message.error(err || '查询资产概况接口出错')
        })
      },

      // 查询转运营信息
      queryOperateInfo () {
        this.operateTable.loading = true
        this.$api.assets.getProjectTransferByProjectId({projectId: this.projectId}).then(r => {
          this.operateTable.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.operateTable.dataSource = [{...res.data, key: 1}]
            return false
          }
          throw res.message || '查询转运营信息接口出错'
        }).catch(err => {
          this.operateTable.loading = false
          this.$message.error(err || '查询转运营信息接口出错')
        })
      }
    },

    mounted () {
      this.queryGeneralInfo()
      this.queryOperateInfo()
    }
  }
</script>

<style lang='less' scoped>
  .other_info {
    /*padding: 0 15px;*/
    .custom-table {
      margin-top: 20px;
      margin-bottom: 25px;
    }
  }
</style>
