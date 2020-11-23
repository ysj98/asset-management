<!--价值登记页面--资产价值登记详情页面--资产价值清单组件-->
<template>
  <div class="worth_list">
    <SG-Title title="资产价值清单"/>
    <div style="margin-left: 40px">
      <!--数据总览-->
      <overview-number :numList="numList" style="margin-bottom: 8px"/>
      <div style="margin-bottom: 8px;text-align: right">
        <!--<div style="">-->
        <span v-if="type == 'add' || type == 'edit'">
          <SG-Button icon="edit" type="primary" ghost @click="handleEditTableAll(true)">快捷录入资产估值</SG-Button>
          <SG-Button icon="plus" type="primary" ghost @click="handleAddModal(true)" style="margin: 10px">添加资产</SG-Button>
          <!--<SG-Button icon="import" type="primary" ghost @click="handleExport" :loading="exportBtnLoading">批量导入</SG-Button>-->
          <SG-Button icon="delete" type="primary" ghost @click="handleDelete">删除</SG-Button>
        </span>
          <!--<SG-Button icon="export" type="primary" ghost @click="handleExport" :loading="exportBtnLoading" >导出</SG-Button>-->
        <!--</div>-->
        <!--<div style="line-height: 32px">-->
          <!--<span>{{`${type == 'add' || type == 'edit' ? "已选" : ""}资产总数:`}}</span>-->
          <!--<span style="font-weight: bold">{{tableObj.dataSource.length ? tableObj.dataSource.length - 1 : 0}}</span>-->
        <!--</div>-->
      </div>
      <!-- class="custom-table td-pd10 eliminate-table" -->
      <a-table
        v-bind="tableObj"
        class="custom-tables"
      >
        <template slot="assetName" slot-scope="text">
          <tooltip-text width="250" :text="text"/>
        </template>
        <template slot="assetCode" slot-scope="text">
        <tooltip-text width="150" :text="text"/>
        </template>
        <template slot="organName" slot-scope="text">
          <tooltip-text width="250" :text="text"/>
        </template>
        <template slot="assessmentOrganName" slot-scope="text">
          <tooltip-text width="150" :text="text"/>
        </template>
        <template slot="assessmentValue" slot-scope="text, record">
          <a-input-number
            :min="0"
            step="0.01"
            :precision="2"
            :max="999999999.99"
            style="width: 120px"
            v-model="record.assessmentValue"
            @change="calcSum(tableObj.dataSource)"
            v-if="type == 'add' || type == 'edit'"
          />
          <span v-else>{{text}}</span>
        </template>
      </a-table>
      <div v-if="!tableObj.dataSource.length" style="text-align: center; margin-top: 25px">暂无数据</div>
      <SG-FooterPagination
        v-bind="paginationObj"
        v-if="(type == 'approval' || type == 'detail') && tableObj.dataSource.length"
        @change="({ pageNo, pageLength }) => queryAssetListByRegisterId({ pageNo, pageLength })"
      />
    </div>
    <SG-Modal
      v-bind="modalObj"
      v-model="modalObj.isShow"
      @cancel="handleAction('')"
      @ok="handleAction('ok')"
      v-if="type == 'add' || type == 'edit'"
    >
      <!-- 选择资产 -->
      <select-asset-list
        v-if="!isEditAll"
        :organId="organId"
        :queryType="queryType"
        v-model="selectedList"
        :height="modalObj.height"
        :assetType="dynamicData.assetType"
        :proId="dynamicData.projectId"
        :key="`${dynamicData.projectId}${dynamicData.assetType}`"
      />
      <!--快捷录入资产估值-->
      <set-asset v-else ref="setAsset" :assetType="dynamicData.assetType"/>
    </SG-Modal>
  </div>
</template>

<script>
  import SelectAssetList from './SelectAssetList'
  import SetAsset from './SetAssetValue'
  import OverviewNumber from 'src/views/common/OverviewNumber'
  import TooltipText from "src/views/common/TooltipText";
  export default {
    name: 'WorthListPart',
    components: { SelectAssetList, OverviewNumber, SetAsset, TooltipText },
    props: ['type', 'registerId', 'organId', 'dynamicData'],
    data () {
      return {
        tableObj: {
          dataSource: [],
          loading: false,
          pagination: false,
          scroll: { x: 3200 },
          rowKey: 'assetId',
          selectedRowKeys: [], // Table选中的key数据
          columns: [
            { title: '编号', dataIndex: 'index', fixed: 'left', width: 70 },
            { title: '资产名称', dataIndex: 'assetName', fixed: 'left', width: 250, scopedSlots: { customRender: 'assetName' } },
            { title: '资产编码', dataIndex: 'assetCode', width: 150, scopedSlots: { customRender: 'assetCode' } },
            { title: '所属机构', dataIndex: 'organName', width: 250, scopedSlots: { customRender: 'organName' } },
            { title: '所属资产项目', dataIndex: 'projectName' },
            { title: '资产类型', dataIndex: 'assetTypeName' },
            { title: '资产分类', dataIndex: 'assetCategoryName' },
            { title: '资产原值(元)', dataIndex: 'originalValue' },
            { title: '首次成本法估值(元)', dataIndex: 'assetValuation' },
            { title: '首次市场法估值', dataIndex: 'firstMarketValue' },
            { title: '原值评估基准日', dataIndex: 'originalAssessmenBaseDate' },
            { title: '上次评估方法', dataIndex: 'lastAssessmentMethodName' },
            { title: '上次评估值', dataIndex: 'lastAssessmentValue' },
            { title: '本次评估方法', dataIndex: 'assessmentMethodName' },
            { title: '评估机构', dataIndex: 'assessmentOrganName', width: 150, scopedSlots: { customRender: 'assessmentOrganName' } },
            { title: '本次估值(元)', dataIndex: 'assessmentValue', scopedSlots: { customRender: 'assessmentValue' }, fixed: 'right', width: 120 },
            { title: '上浮比', dataIndex: 'upRate', fixed: 'right', width: 120 }
          ]
        },
        exportBtnLoading: false, // 导出按钮loading
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 },
        initList: [], // 选择资产Modal初始选中值
        selectedList: [], // 选择资产Modal选中值
        queryType: 1, // 1 资产变动，2 资产清理 3 权属登记,
        modalObj: {
          width: 1000, // Modal宽度
          height: 450, // Modal高度
          title: '选择资产',
          okText: '确定选择',
          cancelText: '取消',
          isShow: false
        },
        isEditAll: false, // 批量修改本次估值列
        numList: [
          {title: '资产总数', key: 'total', value: 0, fontColor: '#324057'},
          {title: '资产原值(元)', key: 'originalValue', value: 0, fontColor: '#324057'},
          {title: '首次成本法估值(元)', key: 'assetValuation', value: 0, fontColor: '#324057'},
          {title: '首次市场法估值(元)', key: 'firstMarketValue', value: 0, fontColor: '#324057'},
          {title: '上次估值(元)', key: 'lastAssessmentValue', value: 0, fontColor: '#324057'},
          {title: '本次估值(元)', key: 'assessmentValue', value: 0, fontColor: '#324057'}
        ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      }
    },

    methods: {
      // 计算最后一行求和数据及上浮比例
      calcSum (data = []) {
        let assessmentValue = 0
        let originalValue = 0
        let assetValuation = 0
        let firstMarketValue = 0
        let lastAssessmentValue = 0
        this.tableObj.dataSource = data.map(m => {
          assessmentValue += m.assessmentValue ? Number(m.assessmentValue) : 0
          originalValue += m.originalValue ? Number(m.originalValue) : 0
          assetValuation += m.assetValuation ? Number(m.assetValuation) : 0
          lastAssessmentValue += m.lastAssessmentValue ? Number(m.lastAssessmentValue) : 0
          firstMarketValue += m.firstMarketValue ? Number(m.firstMarketValue) : 0
          // 上浮比例=本次评估/上次估值*100%-100%
          m.upRate = (m.lastAssessmentValue && m.lastAssessmentValue!== '0.00') ? `${((Number(m.assessmentValue || 0) / Number(m.lastAssessmentValue) -1) * 100).toFixed(2) }%` : '--'
          return m
        })
        let temp = {
          total: data.length,
          originalValue: originalValue.toFixed(2),
          assetValuation: assetValuation.toFixed(2),
          assessmentValue: assessmentValue.toFixed(2),
          firstMarketValue: firstMarketValue.toFixed(2),
          lastAssessmentValue: lastAssessmentValue.toFixed(2)
        }
        this.numList = this.numList.map(m => {
          return { ...m, value: temp[m.key] || 0 }
        })
        // 返回给上层组件,用于保存
        this.$emit('backAssetList', data)
      },

      // 批量删除资产
      handleDelete () {
        const {tableObj: {selectedRowKeys, dataSource}} = this
        if (!selectedRowKeys.length) {
          return this.$message.warn('请选择数据')
        }
        let data = dataSource.filter(m => !selectedRowKeys.includes(m.assetId))
        if (!data.length) {
          this.tableObj.dataSource = []
          this.selectedRowKeys = []
        }
        this.calcSum(data)
      },

      // 添加资产
      handleAddModal (bool) {
        if (bool) {
          const { tableObj: { dataSource }, dynamicData: { projectId, assetType } } = this
          // 校验是否已选择资产项目
          if (!assetType || !projectId) {
            return this.$emit('validateProject')
          }
          let list = dataSource.map(m => Number(m.assetId))
          Object.assign(this, {
            modalObj: { width: 1000, height: 450, title: '选择资产', okText: '确定选择', cancelText: '取消', isShow: false },
            isEditAll: false,
            initList: list,
            selectedList: list
          })
        } else {
          // 取消时selectedList恢复初始值
          this.selectedList = this.initList
        }
        this.modalObj.isShow = bool
      },
      
      // 导出
      handleExport () {},

      // Table rowSelection
      rowSelection() {
        return {
          selections: true,
          onChange: (selectedRowKeys) => {
            this.tableObj.selectedRowKeys = selectedRowKeys
          }
        }
      },
      
      // 获取选中的资产数据
      getAssetList () {
        let {selectedList} = this
        if (!selectedList.length) { return this.$message.warn('请选择资产数据') }
        this.modalObj.isShow = !selectedList.length
        // 去重处理，比较arr 与 tableObj.dataSource
        if (selectedList.length) {
          let { tableObj: { dataSource } } = this
          this.initList = [...selectedList]
          let newList = selectedList.filter(m => !dataSource.some(n => String(n.assetId) === String(m)))
          if (newList.length) {
            this.queryAssetListByAssetId(newList)
          } else {
            // 过滤列表中被取消选中的数据
            dataSource = dataSource.filter(n => selectedList.includes(Number(n.assetId))).map((m, i) => ({...m, index: i + 1}))
            return this.calcSum(dataSource)
          }
        }
      },

      // 查询汇总数据
      queryTotalData (total) {
        // type === 'approval' || type === 'detail'时后端计算求和数据
        const { registerId } = this
        if (!registerId) { return this.$message.info('登记Id不存在') }
        this.$api.worthRegister.queryListSum({ registerId }).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            let temp = { ...res.data, total }
            return this.numList = this.numList.map(m => {
              return { ...m, value: temp[m.key] || 0 }
            })
          }
          throw res.message || '查询登记资产汇总接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询登记资产汇总接口出错')
        })
      },

      // 根据登记Id查询资产详情的列表数据--分页
      queryAssetListByRegisterId ({pageNo = 1, pageLength = 10, type}) {
        const { registerId } = this
        if (!registerId) { return this.$message.info('登记Id不存在') }
        this.tableObj.loading = true
        this.$api.worthRegister.queryRelPageList({ registerId, pageSize: pageLength, pageNum: pageNo }).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { count, data } = res.data
            this.tableObj.dataSource = (data || []).map((m, i) => ({...m, index: i + 1}))
            Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo, pageLength
            })
            return type === 'init' ? this.queryTotalData(count) : ''
          }
          throw res.message || '查询登记资产接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询登记资产接口出错')
        })
      },
      
      // 根据资产id查询资产详情的列表数据--不分页
      queryAssetListByAssetId (selectedRows = [], status) {
        let form = {}
        let { registerId, tableObj: { dataSource }, dynamicData, selectedList } = this
        if (status === 'init') {
          form.registerId = registerId
        } else {
          if (!selectedRows.length) { return false }
          form.assetId = selectedRows.join(',')
        }
        this.tableObj.loading = true
        this.$api.worthRegister.queryRelList(form).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            let addData = res.data.data || []
            if (!addData.length) { return false }
            if (status === 'init') {
              dataSource = addData
            } else {
              dataSource.push(...addData)
              // 过滤列表中被取消选中的数据
              dataSource = dataSource.filter(n => selectedList.includes(Number(n.assetId)))
            }
            let list = dataSource.map((m, i) => ({...m, index: i + 1, ...dynamicData}))
            return this.calcSum(list)
          }
          throw res.message || '查询登记资产接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询登记资产接口出错')
        })
      },

      // 处理Modal关闭/保存
      handleAction (type) {
        let { isEditAll } = this
        if (type) {
          isEditAll ? this.handleAssetValueAll() : this.getAssetList()
        } else {
          isEditAll ? this.handleEditTableAll(false) : this.handleAddModal(false)
        }
      },
      
      // 批量修改Table本次估值列
      handleEditTableAll (bool) {
        if (!this.tableObj.dataSource.length) { return this.$message.warn('请先选择资产') }
        if (bool) {
          this.isEditAll = true
          Object.assign(this.modalObj, {
            width: 750, isShow: true, okText: '确定', cancelText: '取消', title: '快捷录入资产估值'
          })
        } else {
          this.modalObj.isShow = false
        }
      },

      handleAssetValueAll () {
        const { tableObj: { dataSource } } = this
        let {typeValue, assetValue, methodValue} = this.$refs['setAsset'].transferData()
        if (assetValue === '') { return this.$message.warn('请输入估值金额') }
        let list = []
        // 按单个资产估值
        if (typeValue === '2') {
          list = dataSource.map(m => {
            return {...m, assessmentValue: assetValue}
          })
        } else {
          // 按资产个数估值
          if (methodValue === '1') {
            let rest = assetValue * 100 % dataSource.length
            let val = Math.floor(assetValue * 100 / dataSource.length)
            list = dataSource.map((m, i) => {
              return {...m, assessmentValue: i + 1 === dataSource.length ? ((val + rest) / 100) : (val / 100)}
            })
          } else {
            // 按资产面积均摊
            let totalArea = 0
            dataSource.forEach(m => {
              totalArea += m.assetArea ? Number(m.assetArea) * 100 : 0
            })
            totalArea = totalArea ? totalArea / 100 : 0
            if (totalArea && assetValue) {
              let diff = 1
              let rest = 0
               if (assetValue >= totalArea) {
                 rest = assetValue % totalArea
               } else {
                 diff = Math.pow(10, totalArea.toFixed().length - assetValue.toFixed().length)
                 rest = (assetValue * diff * 10) % totalArea
               }
              list = dataSource.map((m, i) => {
                let val = Math.floor(100 * Number(m.assetArea || 0) * assetValue / totalArea)
                let assessmentValue = (i + 1 === dataSource.length) ? ((val + rest * (diff === 1 ? 1 : 10) / diff) / 100) : (val / 100)
                return {...m, assessmentValue}
              })
            } else {
              list = dataSource
            }
          }
        }
        this.calcSum(list)
        this.handleEditTableAll(false)
      }
    },
    
    created () {
      const { type } = this
      if (type === 'add' || type === 'edit') {
        // 允许多选
        this.tableObj.rowSelection = this.rowSelection()
        // 列表查询结果不分页，且前端计算求和数据
        type === 'edit' && this.queryAssetListByAssetId([], 'init')
      } else {
        // type === 'approval' || type === 'detail'时
        // 列表查询结果分页，且后端计算求和数据
        this.queryAssetListByRegisterId({type: 'init'})
      }
    },
    
    watch: {
      // 基础信息组件传递的数据，更新Table相关项
      dynamicData: function (data) {
        let {tableObj: {dataSource}, type, numList} = this
        if ((type === 'add' || type === 'edit') && dataSource.length) {
          const { projectId, assetType } = data
          // 如果切换资产项目\资产类型，则清空Table dataSource
          if ((assetType && String(assetType) !== String(dataSource[0].assetType)) || (String(projectId) !== String(dataSource[0].projectId))) {
            // 重置selectedRowKeys
            this.tableObj.selectedRowKeys = []
            this.tableObj.dataSource = []
            return this.numList = numList.map(m => {
              return { ...m, value:  0 }
            })
          }
          this.tableObj.dataSource = dataSource.map(m => {
            return Object.assign(m, data)
          })
        }
      }
    }
  }
</script>

<style lang='less' scoped>
  .worth_list {
    .custom-table {
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table {
        .ant-table-thead th {
          white-space: nowrap;
        }
      }
    }
  }
</style>
