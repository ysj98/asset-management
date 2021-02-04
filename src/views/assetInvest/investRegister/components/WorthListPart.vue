<!--价值登记页面--资产价值登记详情页面--资产价值清单组件-->
<template>
  <div class="worth_list">
    <SG-Title title="资产明细"/>
    <div style="margin-left: 40px">
      <div style="margin-bottom: 8px;text-align: right">
        <div class="box">
          <div class="left" style="height: 100%">资产数量：{{ tableObj.dataSource.length }}，投资面积：{{ investAreaSum }}㎡</div><div class="right" style="margin-bottom: 8px">
          <SG-Button icon="plus" type="primary" ghost @click="handleAddModal(true)" style="margin-right: 10px" v-if="type=='add' || type=='edit'">添加资产</SG-Button>
          <SG-Button icon="delete" type="primary" ghost @click="handleDelete" v-if="type=='add' || type=='edit'">删除</SG-Button>
        </div>
        </div>
      </div>
      <a-table
        v-bind="tableObj"
        class="custom-tables"
        bordered
      >
      <template slot="assetCode" slot-scope="text">
        <tooltip-text width="150" :text="text"/>
        </template>
      <template slot="assetCode" slot-scope="text">
        <tooltip-text width="150" :text="text"/>
        </template>
        <template slot="assetName" slot-scope="text">
          <tooltip-text width="50" :text="text"/>
        </template>
        <template slot="organName" slot-scope="text">
          <tooltip-text width="250" :text="text"/>
        </template>
        <template slot="assessmentOrganName" slot-scope="text">
          <tooltip-text width="150" :text="text"/>
        </template>
        <template slot="investArea">
              <span class="icon-red">投资面积(㎡)</span>
            </template>
        <template slot="investArea" slot-scope="text, record">
          <a-input-number
            :min="0"
            step="0.01"
            :precision="2"
            :max="record.assetArea"
            style="width: 120px"
            v-model="record.investArea"
            @change="calcSum(tableObj.dataSource)"
            v-if="type == 'add' || type == 'edit'"
          />
          <span v-else>{{text}}</span>
        </template>
        <template slot="remark" slot-scope="text, record">
          <a-input v-if="type == 'add' || type == 'edit'" v-model="record.remark" :maxLength="200" />
          <span v-else>{{text}}</span>
        </template>
         <template slot="opt" slot-scope="text, record" >
          <a-popconfirm
          okText="确定"
          cancelText="取消"
          title="确定要删除该资产项目吗?"
          @confirm="deleteOpt(record.assetId)"
          v-if="type == 'add' || type == 'edit'"
        ><a href="javascript:void(0);" >删除</a>
        </a-popconfirm>
        </template>
      </a-table>
     
      <div v-if="!tableObj.dataSource.length" style="text-align: center; margin-top: 25px">暂无数据</div>
      <SG-FooterPagination
        v-bind="paginationObj"
        v-if="(type == 'approval' || type == 'detail') && tableObj.dataSource.length"
        @change="({ pageNo, pageLength }) => queryAssetListByRegisterId({ pageNo, pageLength })"
      />
    </div>
    <div v-if="type == 'detail'">
    <SG-Title title="收益明细"/>
    <div style="margin-left: 40px">
      <div style="margin-bottom: 8px;text-align: right">
        
        <div class="box">
          <div class="left" style="height: 100%">总收益：{{ profitSum }}</div><div class="right" style="margin-bottom: 8px">
        </div>
        </div>
      
      <a-table
        v-bind="profitTableObj"
        class="custom-tables"
        bordered
      >
      <template slot="assetCode" slot-scope="text">
        <tooltip-text width="150" :text="text"/>
        </template>
        <template slot="assetName" slot-scope="text">
          <tooltip-text width="50" :text="text"/>
        </template>
        <template slot="organName" slot-scope="text">
          <tooltip-text width="250" :text="text"/>
        </template>
        <template slot="assessmentOrganName" slot-scope="text">
          <tooltip-text width="150" :text="text"/>
        </template>
      </a-table>
     </div>
      <div v-if="!profitTableObj.dataSource.length" style="text-align: center; margin-top: 25px">暂无数据</div>
      <SG-FooterPagination
        v-bind="profitPaginationObj"
        v-if="(type == 'approval' || type == 'detail') && profitTableObj.dataSource.length"
        @change="({ pageNo, pageLength }) => queryAssetListByRegisterId({ pageNo, pageLength })"
      />
    </div> 
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
        @getReturnAssetInfo="getReturnAssetInfo"
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
    props: ['type', 'registerId', 'organId', 'dynamicData', 'details'],
    data () {
      return {
        tableObj: {
          dataSource: [],
          loading: false,
          pagination: false,
          scroll: { x: 1600 },
          rowKey: 'assetId',
          selectedRowKeys: [], // Table选中的key数据
          columns: (this.type == 'add' || this.type == 'edit') ? [
            { title: '序号', dataIndex: 'index' },
            { title: '资产编码', dataIndex: 'assetCode' },{ title: '资产名称', dataIndex: 'assetName' }, 
            { title: '资产类型', dataIndex: 'assetTypeName' }, { title: '资产分类', dataIndex: 'assetObjectTypeName' }, { title: '规格型号', dataIndex: 'specificationTypeName' },
            { title: '资产面积(㎡)', dataIndex: 'assetArea' }, 
            { slots: { title: "investArea" }, dataIndex: 'investArea', scopedSlots: { customRender: 'investArea' } },
            { title: '备注', dataIndex: 'remark', scopedSlots: { customRender: 'remark' } },{ title: '操作', dataIndex: 'opt', scopedSlots: { customRender: 'opt' } }
          ] : [
            { title: '序号', dataIndex: 'index' },
            { title: '资产编码', dataIndex: 'assetCode' },{ title: '资产名称', dataIndex: 'assetName' }, 
            { title: '资产类型', dataIndex: 'assetTypeName' }, { title: '资产分类', dataIndex: 'assetObjectTypeName' }, { title: '规格型号', dataIndex: 'specificationTypeName' },
            { title: '资产面积(㎡)', dataIndex: 'assetArea' }, 
            { title: '投资面积(㎡)', dataIndex: 'investArea', scopedSlots: { customRender: 'investArea' } },
            { title: '备注', dataIndex: 'remark', scopedSlots: { customRender: 'remark' } }
          ]
        },
        profitTableObj: {
          dataSource: [],
          loading: false,
          pagination: false,
          scroll: { x: 1000 },
          rowKey: 'assetId',
          selectedRowKeys: [], // Table选中的key数据
          columns: [
            { title: '序号', dataIndex: 'index' },
            { title: '收入编号', dataIndex: 'incomeId' },{ title: '费用科目', dataIndex: 'feeSubjectName' }, 
            { title: '账期', dataIndex: 'accountingPeriod' }, { title: '收益金额(元)', dataIndex: 'amount' },
            { title: '备注', dataIndex: 'remark', scopedSlots: { customRender: 'remark' } }
          ] 
        },
        exportBtnLoading: false, // 导出按钮loading
        paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 },
        profitPaginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 },
        initList: [], // 选择资产Modal初始选中值
        selectedList: [], // 选择资产Modal选中值
        queryType: 2, // 1 资产变动，2 资产清理 3 权属登记,
        modalObj: {
          width: 1000, // Modal宽度
          height: 450, // Modal高度
          title: '选择资产',
          okText: '确定选择',
          cancelText: '取消',
          isShow: false
        },
        isEditAll: false, // 批量修改本次估值列
        investAreaSum: 0,
        profitSum: 0,
        assetList: []
      }
    },

    methods: {
      // 计算最后一行求和数据及上浮比例
      calcSum (data) {
        let assessmentValue = 0
        let originalValue = 0
        let assetValuation = 0
        let firstMarketValue = 0
        let lastAssessmentValue = 0
        // this.tableObj.dataSource = data.map(m => {
        //   assessmentValue += m.assessmentValue ? Number(m.assessmentValue) : 0
        //   originalValue += m.originalValue ? Number(m.originalValue) : 0
        //   assetValuation += m.assetValuation ? Number(m.assetValuation) : 0
        //   lastAssessmentValue += m.lastAssessmentValue ? Number(m.lastAssessmentValue) : 0
        //   firstMarketValue += m.firstMarketValue ? Number(m.firstMarketValue) : 0
        //   return m
        // })
        let num = 0
        this.tableObj.dataSource.map(item => {
          if(item.investArea){
           return num += item.investArea
          } 
        })
        let num1 = 0
        this.profitTableObj.dataSource.map(i => {
          if(i.amount){
            return num1 += i.amount
          }
        })
        this.profitSum = num1
        this.investAreaSum = num.toFixed(2)
        // 返回给上层组件,用于保存
        this.$emit('backAssetList', data, this.investAreaSum)
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
        }else{
          this.tableObj.dataSource = data
        }
        this.calcSum(data)
      },
      // 单个删除资产
      deleteOpt (assetId) {
          let data = []
          this.tableObj.dataSource.map(i => {
            if(i.assetId != assetId){
              data.push(i)
            } 
          })
          if (!data.length) {
          this.tableObj.dataSource = []
          this.selectedRowKeys = []
        }else{
          this.tableObj.dataSource = data
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
        let {selectedList, assetList} = this
        if (!selectedList.length) { return this.$message.warn('请选择资产数据') }
        this.modalObj.isShow = !selectedList.length
        // 去重处理，比较arr 与 tableObj.dataSource
        if (selectedList.length) {
          let { tableObj: { dataSource } } = this
          this.initList = [...selectedList]
          let newList = selectedList.filter(m => !dataSource.some(n => String(n.assetId) === String(m)))
          if (newList.length) {
            //this.queryAssetListByAssetId(newList)
              assetList.map(item => {
              if(newList.includes(item.assetId)){
                this.tableObj.dataSource.push(item)
                this.tableObj.dataSource.map((i,d) => {
                  if(i.assetId==item.assetId){
                    i.index = d + 1
                  }
                })
              }
            })
             return this.calcSum(dataSource)
          } else {
            // 过滤列表中被取消选中的数据
            this.tableObj.dataSource = dataSource.filter(n => selectedList.includes(Number(n.assetId))).map((m, i) => ({...m, index: i + 1}))
           
            return this.calcSum(dataSource)
          }
        }
      },

      // 根据登记Id查询资产详情的列表数据--分页
      queryAssetListByRegisterId ({pageNo = 1, pageLength = 10, type}) {
        const { registerId } = this
        if(this.type == 'add'){
          return false
        }
        if (!registerId) { return this.$message.info('登记Id不存在') }
        this.tableObj.loading = true
        this.profitTableObj.loading = true
        this.$api.assetInvest.getInvestDetailPageList({ investOrderId:registerId, pageNum:pageNo, pageSize:pageLength }).then(r => {
          this.tableObj.loading = false
          let res = r.data
          if (res && String(res.code) === '0') {
            const { data, count } = res.data
            this.tableObj.dataSource = (data || []).map((m, i) => ({...m, index: i + 1}))
            Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo, pageLength
            })
            let num = 0
             this.tableObj.dataSource.map(item => {
            return num += item.receiveArea
      })
            this.investAreaSum = num
            this.calcSum(this.tableObj.dataSource)
            
          }
          if(this.type=='detail'){
            this.$api.assetRent.getIncomeDetailPageList({pageNum:pageNo, pageSize:pageLength, orderId:registerId, orderType: 2, status: 1}).then(result => {
          this.profitTableObj.loading = false
          let re = result.data
          console.log(re)
          if (re && String(re.code) === '0') {
            const { data, count } = re.data
            this.profitTableObj.dataSource = (data || []).map((m, i) => ({...m, index: i + 1}))
            Object.assign(this.profitPaginationObj, {
              totalCount: count,
              pageNo, pageLength
            })
            let num1 = 0
             this.profitTableObj.dataSource.map(it => {
            return num1 += it.amount
      })
            this.profitSum = num1
            return this.calcSum(this.profitTableObj.dataSource)
            
          }
          })
          }
          
          return
          throw res.message || '查询登记资产接口出错'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(123 || '查询登记资产接口出错')
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
            let addData = res.data.detailList || []
            if (!addData.length) { return false }
            if (status === 'init') {
              dataSource = addData
            } else {
              
              dataSource.push(...addData)
              // 过滤列表中被取消选中的数据
              dataSource = dataSource.filter(n => selectedList.includes(Number(n.assetId)))
            }
            let list = dataSource.map((m, i) => ({...m, index: i + 1}))
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
          isEditAll = this.handleAddModal(false)
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
      },
      getReturnAssetInfo(assetList) {
         assetList.map((item,index) => {
           assetList[index].assetObjectTypeName = item.assetCategoryName
           assetList[index].investArea = item.assetArea
         })
         this.assetList = assetList
         console.log(this.assetList)
         this.tableObj.dataSource = assetList
    },
    },
    
    
    created () {
      
      const { type } = this
      if (type === 'add' || type === 'edit') {
        
        // 允许多选
        this.tableObj.rowSelection = this.rowSelection()
        // 列表查询结果不分页，且前端计算求和数据
        //type === 'edit' &&  this.queryAssetListByAssetId([], 'init')
        this.queryAssetListByRegisterId({type: 'init'})
      } else {
        // type === 'approval' || type === 'detail'时
        // 列表查询结果分页，且后端计算求和数据
        this.queryAssetListByRegisterId({type: 'init'})
      }
      
    },
    
    watch: {
      'tableObj.dataSource': function (val) {
             this.calcSum(val)
      },
      details: function (val) {
         if(this.details.detailList){
           this.queryAssetListByAssetId([], 'init')
         }
      },
      // 基础信息组件传递的数据，更新Table相关项
      dynamicData: function (data) {
        let {tableObj: {dataSource}, type, numList, details} = this
        if ((type === 'add' || type === 'edit') && dataSource.length) {
          const { projectId, assetType } = data
          // 如果切换资产项目\资产类型，则清空Table dataSource
          if ((assetType && String(assetType) !== String(details.assetType)) || (String(projectId) !== String(details.projectId))) {
            // 重置selectedRowKeys
            this.details.assetType = assetType
            this.details.projectId = projectId
            this.tableObj.selectedRowKeys = []
            this.tableObj.dataSource = []
            this.investAreaSum = 0
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
    .box{
      display: flex;
      justify-content: space-between;
      align-items: center;
  }
  }
</style>
