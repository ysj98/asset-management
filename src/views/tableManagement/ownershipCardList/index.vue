<template>
  <div class="ownership_card">
    <!--查询调件-->
    <a-row :gutter="8" style="padding: 20px 20px 20px 30px">
      <a-col :span="7">
        <SG-Button icon="import" :loading='exportBtnLoading' @click="handleExport">导出</SG-Button>
      </a-col>
      <a-col :span="3">
        <tree-select @changeTree="changeTree" style="width: 100%"/>
      </a-col>
      <a-col :span="3">
        <a-select v-model="kindOfRight" style="width: 100%" placeholder="请选择权属类型" :options="typeOptions"/>
      </a-col>
      <a-col :span="3">
        <a-select v-model="obligeeId" allowClear style="width: 100%" placeholder="请选择权属人" :options="ownerOptions"/>
      </a-col>
      <a-col :span="3">
        <a-select v-model="status" style="width: 100%" placeholder="请选择权属状态" :options="statusOptions"/>
      </a-col>
      <a-col :span="3">
        <a-input v-model.trim="warrantNbr" style="width: 100%" placeholder="请输入权证号"/>
      </a-col>
      <a-col :span="2">
        <SG-Button type="primary" @click="queryTableData">查询</SG-Button>
      </a-col>
    </a-row>
    <!--列表Table-->
    <a-table v-bind="tableObj" class="custom-table td-pd10"/>
    <no-data-tip v-if="!tableObj.dataSource.length" style="margin-top: -30px"/>
    <SG-FooterPagination v-bind="paginationObj" @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"/>
  </div>
</template>

<script>
  import NoDataTip from 'src/components/noDataTips'
  import TreeSelect from 'src/views/common/treeSelect'
  export default {
    name: 'index',
    components: {  NoDataTip, TreeSelect },
    data () {
      return {
        organId: '', // 组织机构ID
        status: '', // 查询条件-权属状态
        warrantNbr: '', // 查询条件-权证号
        kindOfRight: '', // 查询条件-权属类型
        obligeeId: undefined, // 查询条件-权属人
        ownerOptions: [], // 查询条件-权属人选项
        typeOptions: [
          { title: '全部权属类型', key: '' }, { title: '产权证', key: '1' }, { title: '使用权证', key: '0' }
        ], // 查询条件-权属类型选项
        statusOptions: [
          { title: '全部权证状态', key: '' }, { title: '正常', key: '1' }, { title: '已注销', key: '0' }
        ], // 查询条件-权属状态选项
        exportBtnLoading: false, // 导出按钮loading
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10, location: 'absolute' },
        tableObj: {
          scroll: {x: true},
          pagination: false,
          rowKey: 'warrantId',
          loading: false,
          dataSource: [],
          columns: [
            { title: '所属机构', dataIndex: 'organName' },
            { title: '权证号', dataIndex: 'warrantNbr' },
            { title: '权属类型', dataIndex: 'kindOfRightName' },
            { title: '权属人', dataIndex: 'obligeeName' },
            { title: '丘地号', dataIndex: 'lotNo' },
            { title: '不动产单元号', dataIndex: 'estateUnitCode' },
            { title: '坐落位置', dataIndex: 'seatingPosition', width: 200 },
            { title: '权属用途', dataIndex: 'ownershipUseName' },
            { title: '建筑面积', dataIndex: 'buildArea' },
            { title: '专有建筑面积', dataIndex: 'exclusiveBuildArea' },
            { title: '分摊面积', dataIndex: 'apportionArea' },
            { title: '产别', dataIndex: 'antenatal' },
            { title: '结构', dataIndex: 'structureName' },
            { title: '总层数', dataIndex: 'totalFloor' },
            { title: '所在层', dataIndex: 'placeFloor' },
            { title: '土地面积', dataIndex: 'landArea' },
            { title: '权利性质', dataIndex: 'qualityOfRightName' },
            { title: '登记日期', dataIndex: 'rigisterDate' },
            { title: '使用期限', dataIndex: 'useLimitDate' },
            { title: '交接日期', dataIndex: 'handoverDate' },
            { title: '状态', dataIndex: 'statusName' },
            { title: '附记', dataIndex: 'remark', width: 200 }
          ]
        },
      }
    },

    methods: {
      // 根据organId查询权属人
      queryOwner (organId) {
        this.ownerOptions = []
        this.obligeeId = undefined
        this.$api.assets.select({organId}).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            let list = (res.data || []).map(m => {
              return { title: m.obligeeName, key: m.obligeeId }
            })
            return this.ownerOptions = [{name: '全部权属人', value: ''}, ...list]
          }
          throw res.message
        }).catch(err => {
          this.$message.error(err || '查询权属人接口出错')
        })
      },

      // 获取选择的组织机构
      changeTree (organId) {
        this.organId = organId
        this.queryOwner(organId)
      },

      // 导出
      handleExport () {
        return false
      },

      // 查询列表数据
      queryTableData ({pageNo = 1, pageLength = 10}) {
        const {organProjectValue: {organId, projectId}} = this
        if (!organId) { return this.$message.info('请选择组织机构') }
        this.tableObj.loading = true
        this.$api.tableManage.projectAsset({organId, projectId}).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const {count, data} = res.data
            this.tableObj.dataSource = data
            return Object.assign(this.paginationObj, {
              totalCount: count, pageNo, pageLength
            })
          }
          throw res.message
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询接口出错')
        })
      }
    },
    
    watch: {
      warrantNbr: function (val) {
        if (val.length > 60) {
          this.warrantNbr = val.slice(0, 60)
          return this.$message.warn('最多支持60字符')
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .ownership_card {
    .custom-table {
      padding-bottom: 55px;
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table-thead th, .ant-table td {
        white-space: nowrap;
      }
    }
  }
</style>
