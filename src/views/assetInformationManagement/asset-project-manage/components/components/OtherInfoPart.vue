<!--资产项目管理业务-资产项目管理详情页面-其它信息组件-->
<template>
  <div class="other_info">
    <!--资产概况-->
    <SG-Title title="资产概况" noMargin/>
    <a-table v-bind="overviewTable" class="custom-table title_div"/>
    <!--转运营(物业)-->
    <SG-Title title="转运营(物业)" noMargin/>
    <a-table v-bind="operateTable" class="custom-table title_div"/>
    <!--权属情况-->
    <SG-Title title="权属情况" noMargin/>
    <a-table v-bind="ownTable" class="custom-table title_div" style="border: 1px solid #e8e8e8"/>
    <!--审批轨迹-->
    <SG-Title title="审批轨迹" noMargin/>
    <SG-TrackStep :stepList="stepList" class="title_div"/>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'OtherInfo',
    data () {
      return {
        overviewTable: {
          rowKey: 'assetCode',
          dataSource: [],
          columns: [
            { title: '资产类型', dataIndex: 'name', key: 'name'},
            { title: '楼栋数', dataIndex: 'age', key: 'age' },
            { title: '资产数', dataIndex: 'address', key: 'address', align: 'right' },
            { title: '面积', key: 'tags', dataIndex: 'tadgs', align: 'right' },
            { title: '资产账面原值', key: 'action', dataIndex: 'agwe', align: 'right' },
            { title: '资产市值', key: 'value', dataIndex: 'awwge', align: 'right' }
          ]
        }, // 资产概况Table
        operateTable: {
          rowKey: 'assetCode',
          dataSource: [],
          columns: [
            { title: '转运营日期', dataIndex: 'name', key: 'name' },
            { title: '转运营面积(㎡)', dataIndex: 'age', key: 'age' },
            { title: '转物业日期', dataIndex: 'address', key: 'address' },
            { title: '处置收入费用科目', key: 'tags', dataIndex: 'tdags' }
          ]
        }, // 转运营(物业)Table
        ownTable: {
          bordered: true,
          rowKey: 'assetCode',
          dataSource: [],
          columns: [
            { title: '有证', children: [
              { title: '产权', dataIndex: 'age', key: 'age' },
              { title: '使用权', dataIndex: 'agfe', key: 'agfe' }
            ] },
            { title: '待办', children: [
              { title: '产权', dataIndex: 'agse', key: 'agse' },
              { title: '使用权', dataIndex: 'agee', key: 'agee' }
            ] },
            { title: '无证', dataIndex: 'address', key: 'address' },
            { title: '权属办理进度', key: 'taegs', dataIndex: 'tags' }
          ]
        }, // 权属概况Table
        stepList: [
          { date: moment(), title: '修改', desc: '待修改', isDone: true, operation: [] },
          { date: moment(), title: '初审', desc: '操作人：张三 审核不通过', isDone: false, operation: [] },
          { date: moment(), title: '提单', desc: '提交水牌名牌办理申请', isDone: false, operation: [] }
        ] // 审批轨迹
      }
    },

    methods: {
    }
  }
</script>

<style lang='less' scoped>
  .other_info {
    padding: 0 15px;
    .custom-table {
      /*margin-left: 44px;*/
      margin-bottom: 15px;
    }
  }
</style>
