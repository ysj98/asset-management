<!--价值登记页面--资产价值登记详情页面--资产价值清单组件-->
<template>
  <div class="worth_list">
    <SG-Title title="资产价值清单"/>
    <div style="margin-left: 40px">
      <div style="margin-bottom: 16px; overflow: hidden">
        <div style="float: right">
          <span v-if="type == 'add' || type == 'edit'">
            <SG-Button icon="plus" type="primary" ghost @click="handleAdd(true)" style="margin-right: 10px">添加资产</SG-Button>
            <!--<SG-Button icon="import" type="primary" ghost @click="handleExport" :loading="exportBtnLoading">批量导入</SG-Button>-->
            <SG-Button icon="delete" type="primary" ghost @click="handleDelete">删除</SG-Button>
          </span>
          <!--<SG-Button icon="export" type="primary" ghost @click="handleExport" :loading="exportBtnLoading" >导出</SG-Button>-->
        </div>
        <div style="line-height: 32px">
          <span>{{`${type == 'add' || type == 'edit' ? "已选" : ""}资产总数:`}}</span>
          <span style="font-weight: bold">{{selectedRowKeys.length}}</span>
        </div>
      </div>
      <a-table
        v-bind="tableObj"
        class="custom-table td-pd10 table-border"
      >
        <template slot="assessmentValue" slot-scope="text, record">
          <a-input-number
            :min="0"
            step="0.01"
            :precision="2"
            :max="999999999.99"
            style="width: 120px"
            v-model="record.assessmentValue"
            @change="calcSum(tableObj.dataSource)"
            v-if="(type == 'add' || type == 'edit') && record.assetName !== '合计'"
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
    <!-- 选择资产 -->
    <select-asset-modal
      :width="1000"
      :organId="organId"
      :initValue="initList"
      @handleOk="getAssetList"
      @handleCancel="handleAdd(false)"
      :visible="isShowAssetSelect"
      v-if="type == 'add' || type == 'edit'"
    />
  </div>
</template>

<script>
  import SelectAssetModal from './SelectAssetModal'
  export default {
    name: 'WorthListPart',
    components: { SelectAssetModal },
    props: ['type', 'registerId', 'organId', 'dynamicData'],
    data () {
      return {
        tableObj: {
          dataSource: [],
          loading: false,
          pagination: false,
          scroll: { x: 2000 },
          rowKey: 'assetId',
          columns: [
            { title: '编号', dataIndex: 'index', fixed: 'left', width: 70 },
            { title: '资产名称', dataIndex: 'assetName', fixed: 'left', width: 180 },
            { title: '资产编码', dataIndex: 'assetCode' },
            { title: '所属机构', dataIndex: 'organName' },
            { title: '所属资产项目', dataIndex: 'projectName' },
            { title: '资产类型', dataIndex: 'assetTypeName' },
            { title: '资产分类', dataIndex: 'assetCategoryName' },
            { title: '资源原值(元)', dataIndex: 'originalValue' },
            { title: '评估原值(元)', dataIndex: 'assetValuation' },
            { title: '原值评估基准日', dataIndex: 'originalAssessmenBaseDate' },
            { title: '上次评估方法', dataIndex: 'lastAssessmentMethodName' },
            { title: '上次评估值', dataIndex: 'lastAssessmentValue' },
            { title: '本次评估方法', dataIndex: 'assessmentMethodName' },
            { title: '评估机构', dataIndex: 'assessmentOrganName' },
            { title: '评估基准日', dataIndex: 'assessmenBaseDate' },
            { title: '本次估值(元)', dataIndex: 'assessmentValue', scopedSlots: { customRender: 'assessmentValue' }, fixed: 'right', width: 120 },
            { title: '上浮比', dataIndex: 'upRate', fixed: 'right', width: 120 }
          ]
        },
        selectedRowKeys: [], // Table选中的key数据
        exportBtnLoading: false, // 导出按钮loading
        isShowAssetSelect: false, // 显示选择资产弹窗
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 },
        initSumValueObj: {
          upRate: '--',
          assetCode: '--',
          organName: '--',
          projectName: '--',
          assetName: '合计',
          assetTypeName: '--',
          // originalValue: '--',
          // assetValuation: '--',
          // assessmentValue: '--',
          assessmenBaseDate: '--',
          assessmentOrganName: '--',
          assetObjectTypeName: '--',
          // lastAssessmentValue: '--',
          assessmentMethodName: '--',
          lastAssessmentMethodName: '--',
          originalAssessmenBaseDate: '--'
        }, // Table最后一列求和的默认值
        initList: [] // 选择资产Modal初始选中值
      }
    },

    methods: {
      // 计算最后一行求和数据及上浮比例
      calcSum (data = []) {
        const { initSumValueObj } = this
        let flag = false
        let assessmentValue = 0
        let originalValue = 0
        let assetValuation = 0
        let lastAssessmentValue = 0
        data.forEach(m => {
          if (m.assetName !== '合计') {
            assessmentValue += m.assessmentValue ? Number(m.assessmentValue) : 0
            originalValue += m.originalValue ? Number(m.originalValue) : 0
            assetValuation += m.assetValuation ? Number(m.assetValuation) : 0
            lastAssessmentValue += m.lastAssessmentValue ? Number(m.lastAssessmentValue) : 0
          } else {
            flag = true
          }
          // 上浮比例=本次评估/上次估值*100%-100%
          m.upRate = m.lastAssessmentValue ? `${((Number(m.assessmentValue) / Number(m.lastAssessmentValue) -1) * 100).toFixed(2) }%` : '--'
        })
        // let i = flag ? 1 : 0
        let temp = {
          ...initSumValueObj,
          assetId: '-10', // Table rowKey need to set
          originalValue: originalValue.toFixed(2),
          assetValuation: assetValuation.toFixed(2),
          assessmentValue: assessmentValue.toFixed(2),
          lastAssessmentValue: lastAssessmentValue.toFixed(2)
        }
        flag ? data.splice(-1, 1, temp) : data.push(temp)
        this.tableObj.dataSource = data
        // 返回给上层组件,用于保存
        this.$emit('backAssetList', data)
      },

      // 批量删除资产
      handleDelete () {
        const {selectedRowKeys, tableObj: {dataSource}} = this
        if (!selectedRowKeys.length) {
          return this.$message.warn('请选择数据')
        }
        let data = dataSource.filter(m => m.assetName !== '合计' && !selectedRowKeys.includes(m.assetId))
        data.length ? this.calcSum(data) : this.tableObj.dataSource = []
      },

      // 添加资产
      handleAdd (bool) {
        if (bool) {
          const { tableObj: { dataSource } } = this
          let list = []
          dataSource.forEach(m => {
            m.assetName !== '合计' && list.push(Number(m.assetId))
          })
          this.initList = list
        }
        this.isShowAssetSelect = bool
      },
      
      // 导出
      handleExport () {},

      // Table rowSelection
      rowSelection() {
        return {
          selections: true,
          onChange: (selectedRowKeys) => {
            this.selectedRowKeys = selectedRowKeys
          },
          getCheckboxProps: record => {
            return {
              style: { display: record.assetName === '合计' ? 'none' : 'block', }
            }
          }
        }
      },
      
      // 获取选中的资产数据
      getAssetList (arr) {
        this.isShowAssetSelect = !arr.length
        // 去重处理，比较arr 与 tableObj.dataSource
        if (arr.length) {
          const { tableObj: { dataSource } } = this
          let newList = arr.filter(m => !dataSource.some(n => String(n.assetId) === String(m)))
          newList.length && this.queryAssetListByAssetId(arr)
        }
      },

      // 查询汇总数据
      queryTotalData () {
        // type === 'approval' || type === 'detail'时后端计算求和数据
        const { initSumValueObj, registerId, tableObj: { dataSource } } = this
        if (!registerId) { return this.$message.info('登记Id不存在') }
        this.tableObj.loading = true
        this.$api.worthRegister.queryListSum({ registerId }).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            this.tableObj.dataSource = dataSource.concat({ ...initSumValueObj, ...res.data })
            return false
          }
          throw res.message || '查询登记资产汇总接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询登记资产汇总接口出错')
        })
      },

      // 根据登记Id查询资产详情的列表数据--分页
      queryAssetListByRegisterId ({pageNo = 1, pageLength = 10}) {
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
            return this.queryTotalData()
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
        let { registerId, tableObj: { dataSource } } = this
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
              // 新增：删除旧dataSource最后一行求和数据
              dataSource.splice(-1, 1, ...addData)
              // 关闭选择资源Modal
              this.isShowAssetSelect = false
            }
            let list = dataSource.map((m, i) => ({...m, index: i + 1}))
            return this.calcSum(list)
          }
          throw res.message || '查询登记资产接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询登记资产接口出错')
        })
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
        this.queryAssetListByRegisterId({})
      }
    },
    
    watch: {
      // 基础信息组件传递的数据，更新Table相关项
      dynamicData: function (data) {
        const { type, value } = data
        const { tableObj: { dataSource } } = this
        this.tableObj.dataSource = dataSource.map(m => {
          m.assetName !== '合计' ? m[type] = value : ''
          return m
        })
      }
    }
  }
</script>

<style lang='less' scoped>
  .worth_list {
    .custom-table {
      /*if you want to set scroll: { x: true }*/
      /*you need to add style .ant-table td { white-space: nowrap; }*/
      & /deep/ .ant-table-thead th, .ant-table td {
        white-space: nowrap;
      }
    }
  }
</style>
