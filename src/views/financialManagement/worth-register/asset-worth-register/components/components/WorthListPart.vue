<!--价值登记页面--资产价值登记详情页面--资产价值清单组件-->
<template>
  <div class="worth_list">
    <SG-Title title="资产价值清单"/>
    <div style="margin-left: 40px">
      <div style="margin-bottom: 16px; overflow: hidden">
        <div style="float: right">
          <span v-if="type == 'add' || type == 'edit'">
            <SG-Button icon="edit" type="primary" ghost @click="handleEditTableAll(true)">批量修改</SG-Button>
            <SG-Button icon="plus" type="primary" ghost @click="handleAddModal(true)" style="margin: 10px">添加资产</SG-Button>
            <!--<SG-Button icon="import" type="primary" ghost @click="handleExport" :loading="exportBtnLoading">批量导入</SG-Button>-->
            <SG-Button icon="delete" type="primary" ghost @click="handleDelete">删除</SG-Button>
          </span>
          <!--<SG-Button icon="export" type="primary" ghost @click="handleExport" :loading="exportBtnLoading" >导出</SG-Button>-->
        </div>
        <div style="line-height: 32px">
          <span>{{`${type == 'add' || type == 'edit' ? "已选" : ""}资产总数:`}}</span>
          <span style="font-weight: bold">{{tableObj.dataSource.length ? tableObj.dataSource.length - 1 : 0}}</span>
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
        :projectObj="dynamicData.projectObj"
        :key="dynamicData.projectObj && dynamicData.projectObj.projectId"
      />
      <!--批量修改本次估值-->
      <a-input-number
        v-else
        :min="0"
        step="0.01"
        :precision="2"
        :max="999999999.99"
        v-model="assetValueAll"
        style="width: 250px; margin: 10px 0"
      />
    </SG-Modal>
  </div>
</template>

<script>
  import SelectAssetList from './SelectAssetList'
  export default {
    name: 'WorthListPart',
    components: { SelectAssetList },
    props: ['type', 'registerId', 'organId', 'dynamicData'],
    data () {
      return {
        tableObj: {
          dataSource: [],
          loading: false,
          pagination: false,
          scroll: { x: 2200 },
          rowKey: 'assetId',
          selectedRowKeys: [], // Table选中的key数据
          columns: [
            { title: '编号', dataIndex: 'index', fixed: 'left', width: 70 },
            { title: '资产名称', dataIndex: 'assetName', fixed: 'left', width: 180 },
            { title: '资产编码', dataIndex: 'assetCode' },
            { title: '所属机构', dataIndex: 'organName' },
            { title: '所属资产项目', dataIndex: 'projectName' },
            { title: '资产类型', dataIndex: 'assetTypeName' },
            { title: '资产分类', dataIndex: 'assetCategoryName' },
            { title: '资产原值(元)', dataIndex: 'originalValue' },
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
        exportBtnLoading: false, // 导出按钮loading
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 },
        initSumValueObj: {
          assetId: '-10',
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
        assetValueAll: '' // 批量本次估值值
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
          m.upRate = (m.lastAssessmentValue && m.lastAssessmentValue!== '0.00') ? `${((Number(m.assessmentValue || 0) / Number(m.lastAssessmentValue) -1) * 100).toFixed(2) }%` : '--'
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
        const {tableObj: {selectedRowKeys, dataSource}} = this
        if (!selectedRowKeys.length) {
          return this.$message.warn('请选择数据')
        }
        let data = dataSource.filter(m => m.assetName !== '合计' && !selectedRowKeys.includes(m.assetId))
        data.length ? this.calcSum(data) : this.tableObj.dataSource = []
      },

      // 添加资产
      handleAddModal (bool) {
        if (bool) {
          const { tableObj: { dataSource }, dynamicData: { projectObj } } = this
          // 校验是否已选择资产项目
          if (!projectObj || !projectObj.projectId || !projectObj.projectName) {
            return this.$emit('validateProject')
          }
          let list = []
          dataSource.forEach(m => {
            m.assetName !== '合计' && list.push(Number(m.assetId))
          })
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
          },
          getCheckboxProps: record => {
            return {
              style: { display: record.assetName === '合计' ? 'none' : 'block', }
            }
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
          const { tableObj: { dataSource } } = this
          let newList = selectedList.filter(m => !dataSource.some(n => String(n.assetId) === String(m)))
          newList.length && this.queryAssetListByAssetId(newList)
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
        let { registerId, tableObj: { dataSource }, dynamicData } = this
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
              // 关闭选择资产Modal
              this.modalObj.isShow = false
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
          Object.assign(this, {
            assetValueAll: '',
            isEditAll: true,
            modalObj: { width: 450, isShow: true, okText: '确定', cancelText: '取消', title: '批量修改本次估值' }
          })
        } else {
          this.modalObj.isShow = false
        }
      },

      handleAssetValueAll () {
        const { assetValueAll, tableObj: { dataSource } } = this
        if (!(assetValueAll === 0 || assetValueAll)) { return this.$message.warn('请输入本次估值') }
        let list = dataSource.map(m => {
          return m.assetName !== '合计' ? {...m, assessmentValue: assetValueAll} : m
        })
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
        this.queryAssetListByRegisterId({})
      }
    },
    
    watch: {
      // 基础信息组件传递的数据，更新Table相关项
      dynamicData: function (data) {
        const { projectObj } = data
        const {tableObj: {dataSource}} = this
        if (dataSource.length) {
          // 如果切换资产项目，则清空Table dataSource
          if (projectObj && String(projectObj.projectId) !== String(dataSource[0].projectId)) {
            // 重置selectedRowKeys
            this.tableObj.selectedRowKeys = []
            return this.tableObj.dataSource = []
          }
          this.tableObj.dataSource = dataSource.map(m => {
            return m.assetName !== '合计' ? Object.assign(m, data) : m
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
