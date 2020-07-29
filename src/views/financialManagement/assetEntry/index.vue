<!--
  资产入账
-->
<template>
  <div class="assets-entry">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <SG-Button icon="import" style="margin-right: 8px" @click="openImportModal">导入</SG-Button>
        <SG-Button icon="export" @click="handleExport" :loading="exportBtnLoading" style="margin-right: 8px">导出</SG-Button>
        <SG-Button icon="plus" type="primary" @click="newAssetEntry" v-power="ASSET_MANAGEMENT.ASSET_ENTRY_NEW">新建卡片</SG-Button>
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect @changeTree="changeTree" placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
          <a-input-search placeholder="卡片名称/编码" :style="allStyle" :value="cardName" @change="cardNameChange" @search="queryClick" />
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" @click="queryClick">查询</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select
          showSearch
          placeholder="请选择资产项目"
          optionFilterProp="children"
          :style="allStyle"
          v-model="assetProject"
          :options="assetProjectOptions"
          :filterOption="filterOption"
        ></a-select>
        <a-select
          :maxTagCount="1"
          :style="allStyle"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部状态"
          v-model="approvalStatus"
          :options="approvalStatusData"
          @select="changeStatus"
        ></a-select>
        <a-select
          :maxTagCount="1"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部资产类型"
          v-model="assetType"
          :options="assetTypeOptions"
          style="width: 190px; margin-right: 10px;"
          @select="changeAssetType"
        ></a-select>
        <a-select
          :maxTagCount="1"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部资产分类"
          v-model="assetClassify"
          :options="assetClassifyOptions"
          style="width: 190px; margin-right: 10px;"
          @select="changeAssetClassify"
        ></a-select>
        <a-select
          :maxTagCount="1"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部资产科目"
          v-model="assetSubject"
          :options="assetSubjectOptions"
          style="width: 190px; margin-right: 10px;"
          @select="changeAssetSubject"
        ></a-select>
        <!--<segi-range-picker label="提交日期" style="margin-right: 10px;" :defaultValue="[moment(beginDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]" :canSelectToday="true" @dateChange="onDateChange"></segi-range-picker>-->
        <SG-DatePicker label="提交日期" pickerType="RangePicker" style="width: 200px;" :defaultValue="[moment(beginDate, 'YYYY-MM-DD'), moment(endDate, 'YYYY-MM-DD')]" @change="onDateChange"></SG-DatePicker>
        <SG-DatePicker label="入账日期" pickerType="RangePicker" style="width: 200px;" @change="onEntryDateChange"></SG-DatePicker>
      </div>
    </SG-SearchContainer>
    <div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        class="custom-table td-pd10"
        :scroll="{ x: 2250 }"
        :pagination="false"
      >
        <template slot="operation" slot-scope="text, record">
          <a class="operation-btn" v-show="+record.approvalStatus === 2" @click="handleOperation('audit', record)" v-power="ASSET_MANAGEMENT.ASSET_ENTRY_AUDIT">审核</a>
          <a class="operation-btn" v-show="+record.approvalStatus === 1" @click="handleStatus(record, 0)" v-power="ASSET_MANAGEMENT.ASSET_ENTRY_REVERSE_AUDIT">反审核</a>
          <a class="operation-btn" v-show="+record.approvalStatus === 0 || +record.approvalStatus === 3" @click="handleOperation('edit', record)"  v-power="ASSET_MANAGEMENT.ASSET_ENTRY_EDIT">编辑</a>
          <a class="operation-btn" v-show="+record.approvalStatus === 0 || +record.approvalStatus === 3" @click="handleStatus(record, 4)" v-power="ASSET_MANAGEMENT.ASSET_ENTRY_DELETE">删除</a>
          <a class="operation-btn" @click="handleOperation('detail', record)">详情</a>
        </template>
      </a-table>
      <no-data-tips v-show="showNoDataTips"></no-data-tips>
    </div>
    <SG-FooterPagination
      :pageLength="paginator.pageLength"
      :totalCount="paginator.totalCount"
      location="absolute"
      v-model="paginator.pageNo"
      @change="handlePageChange"
    />
    <!--导入-->
    <batch-import @upload="uploadFile" @down="downTemplate" ref="batchImport" title="资产卡片导入"/>
  </div>
</template>

<script>
  import TreeSelect from '../../common/treeSelect'
  import SegiRangePicker from '@/components/SegiRangePicker'
  import noDataTips from '@/components/noDataTips'
  import {getCurrentDate, getMonthsAgoDate} from 'utils/formatTime'
  import moment from 'moment'
  import {ASSET_MANAGEMENT} from '@/config/config.power'
  import BatchImport from 'src/views/common/eportAndDownFile'
  import {exportDataAsExcel} from 'src/views/common/commonQueryApi'

  const columns = [
    {
      title: '所属机构',
      dataIndex: 'organName',
      width: 200,
      fixed: 'left'
    },
    {
      title: '卡片编码',
      dataIndex: 'cardCode',
      width: 180,
      fixed: 'left'
    },
    {
      title: '卡片名称',
      dataIndex: 'cardName',
      width: 120
    },
    {
      title: '资产项目',
      dataIndex: 'projectName',
      width: 120
    },
    {
      title: '资产类型',
      dataIndex: 'assetTypeName',
      width: 120
    },
    {
      title: '资产分类',
      dataIndex: 'assetCategoryName',
      width: 120
    },
    {
      title: '入账日期',
      dataIndex: 'accountEntryTime',
      width: 120
    },
    {
      title: '存放地点',
      dataIndex: 'storagePathName',
      width: 120
    },
    {
      title: '入账原值(元)',
      dataIndex: 'purchaseValue',
      width: 120
    },
    {
      title: '累计折旧(元)',
      dataIndex: 'cumulativeDepreciation',
      width: 120
    },
    {
      title: '净值(元)',
      dataIndex: 'netValue',
      width: 120
    },
    {
      title: '折旧方式',
      dataIndex: 'depreciationMethodName',
      width: 180
    },
    {
      title: '计量单位',
      dataIndex: 'unitOfMeasurementName',
      width: 120
    },
    {
      title: '数量',
      dataIndex: 'num',
      width: 120
    },
    {
      title: '减值准备(元)',
      dataIndex: 'impairmentReady',
      width: 120
    },
    {
      title: '状态',
      dataIndex: 'approvalStatusName',
      width: 80
    },
    {
      title: '操作',
      width: 170,
      dataIndex: 'operation',
      fixed: 'right',
      scopedSlots: { customRender: 'operation' }
    }
  ]

  const approvalStatusData = [
    {
      label: '全部状态',
      value: ''
    },
    {
      label: '草稿',
      value: '0'
    },
    {
      label: '待审批',
      value: '2'
    },
    {
      label: '已驳回',
      value: '3'
    },
    {
      label: '在役',
      value: '1'
    },
    {
      label: '已取消',
      value: '4'
    }
  ]
  export default {
    components: {
      TreeSelect, SegiRangePicker, noDataTips, BatchImport
    },
    data () {
      return {
        ASSET_MANAGEMENT,
        allStyle: 'width: 170px; margin-right: 10px;',
        toggle: false,
        organName: '',
        organId: '',
        cardName: '',
        columns,
        dataSource: [],
        approvalStatus: [''],
        approvalStatusData: [...approvalStatusData],
        assetProject: '',
        assetProjectOptions: [],
        assetType: [''],
        assetTypeOptions: [],
        assetSubject: [''],
        assetSubjectOptions: [],
        assetClassify: [''],
        assetClassifyOptions: [{label: '全部资产分类', value: ''}],
        beginDate: getMonthsAgoDate(6),
        endDate: getCurrentDate(),
        entryBeginDate: '',
        entryEndDate: '',
        paginator: {
          pageNo: 1,
          pageLength: 10,
          totalCount: 0
        },
        showNoDataTips: false,
        exportBtnLoading: false // 导出按钮loading
      }
    },
    watch: {
      '$route' () {
        if (this.$route.path === '/assetEntry' && this.$route.query.refresh) {
          this.queryClick()
        }
      },
      assetType () {
        this.getAssetClassifyOptions()
      }
    },
    methods: {
      moment,
      // 高级搜索控制
      searchContainerFn (val) {
        this.toggle = val
      },
      changeTree (value, label) {
        this.organName = label
        this.organId = value
        this.getAssetProjectOptions()
        this.getAssetSubjectList()
        this.getAssetClassifyOptions()
        this.queryClick()
      },
      // 卡片名称发生变化
      cardNameChange (event) {
        if (event.target.value.length <= 40) {
          this.cardName = event.target.value
        }
      },
      // 状态发生变化
      changeStatus (value) {
        this.$nextTick(function () {
          this.approvalStatus = this.handleMultipleSelectValue(value, this.approvalStatus, this.approvalStatusData)
        })
      },
      // 资产类型发生变化
      changeAssetType (value) {
        console.log(value)
        this.$nextTick(function () {
          this.assetType = this.handleMultipleSelectValue(value, this.assetType, this.assetTypeOptions)
        })
      },
      // 资产分类发生变化
      changeAssetClassify (value) {
        this.$nextTick(function () {
          this.assetClassify = this.handleMultipleSelectValue(value, this.assetClassify, this.assetClassifyOptions)
        })
      },
      // 资产科目发生变化
      changeAssetSubject (value) {
        this.$nextTick(function () {
          this.assetSubject = this.handleMultipleSelectValue(value, this.assetSubject, this.assetSubjectOptions)
        })
      },
      // 处理多选下拉框有全选时的数组
      handleMultipleSelectValue (value, data, dataOptions) {
        // 如果选的是全部
        if (value === '') {
          data = ['']
        } else {
          let totalIndex = data.indexOf('')

          if (totalIndex > -1) {
            data.splice(totalIndex, 1)
          } else {
            // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
            if (data.length === dataOptions.length - 1) {
              data = ['']
            }
          }
        }
        return data
      },
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },
      // 提交日期发生变化
      onDateChange (moment, val) {
        this.beginDate = val[0]
        this.endDate = val[1]
      },
      // 入账日期发生变化
      onEntryDateChange (moment, val) {
        this.entryBeginDate = val[0]
        this.entryEndDate = val[1]
      },
      // 页码发生变化
      handlePageChange (page) {
        this.paginator.pageNo = page.pageNo
        this.paginator.pageLength = page.pageLength
        this.queryList()
      },
      // 新建卡片
      newAssetEntry () {
        this.$router.push({path: '/assetEntry/new', query: {pageType: 'new', organId: this.organId, organName: this.organName}})
      },
      handleStatus (record, status) {
        let self = this
        switch (status) {
          // 反审核-变成草稿状态
          case 0:
            this.$confirm({
              title: '提示',
              content: '确认要对此资产卡片反审核吗？',
              onOk() {
                self.updateCardStatus(status, record.cardId)
              }
            })
            break
          // 删除-变成已取消状态
          case 4:
            this.$confirm({
              title: '提示',
              content: '确认要删除该资产卡片吗？',
              onOk() {
                self.updateCardStatus(status, record.cardId)
              }
            })
            break
          default: break
        }
      },
      // 改变卡片状态
      updateCardStatus (status, cardId) {
        let form = {
          approvalStatus: status,
          cardId: cardId
        }
        this.$api.assets.updateCardStatus(form).then(res => {
          if (res.data.code === '0') {
            this.$message.success('操作成功')
            this.queryList()
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      handleOperation (pageType, record) {
        this.$router.push({path: '/assetEntry/' + pageType, query: {pageType: pageType, cardId: record.cardId, organId: this.organId, organName: this.organName}})
      },
      // 点击查询
      queryClick () {
        this.paginator.pageNo = 1
        this.queryList()
      },
      queryList (type) {
        let form = {
          organId: this.organId,
          projectId: this.assetProject,
          beginDate: this.beginDate,
          endDate: this.endDate,
          beginAccountEntryTime: this.entryBeginDate,
          endAccountEntryTime: this.entryEndDate,
          approvalStatus: this.approvalStatus.join(','),
          cardName: this.cardName,
          assetSubject: this.assetSubject.join(','),
          assetType: this.assetType.join(','),
          assetCategoryId: this.assetClassify.join(','),
          pageNum: this.paginator.pageNo,
          pageSize: this.paginator.pageLength
        }
        if (type === 'export') { return form }
        this.$api.assets.queryCardPageList(form).then(res => {
          if (res.data.code === '0') {
            let data = res.data.data.data
            if (data.length === 0) {
              this.showNoDataTips = true
            } else {
              this.showNoDataTips = false
            }
            data.forEach((item, index) => {
              item.key = index
              for (let key in item) {
                if (item[key] === '' || item[key] === null) {
                  item[key] = '--'
                }
              }
            })
            this.dataSource = data
            this.paginator.totalCount = res.data.data.count
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 获取资产项目下拉列表
      getAssetProjectOptions () {
        let form = {
          organId: this.organId
        }
        this.$api.assets.getObjectKeyValueByOrganId(form).then(res => {
          if (res.data.code === '0') {
            let arr = [{label: '全部资产项目', value: ''}]
            res.data.data.forEach(item => {
              let obj = {
                label: item.projectName,
                value: item.projectId
              }
              arr.push(obj)
            })
            this.assetProjectOptions = arr
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 获取资产类型下拉列表
      getAssetTypeOptions () {
        let form = {
          code: 'asset_type'
        }
        this.$api.basics.platformDict(form).then(res => {
          if (res.data.code === '0') {
            let arr = [{label: '全部资产类型', value: ''}]
            res.data.data.forEach(item => {
              let obj = {
                label: item.name,
                value: item.value
              }
              arr.push(obj)
            })
            this.assetTypeOptions = arr
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 获取资产科目下拉列表
      getAssetSubjectList () {
        let form = {
          organId: this.organId
        }
        this.$api.assets.getFeeTypeList(form).then(res => {
          if (res.data.code === '0') {
            let arr = [{label: '全部资产科目', value: ''}]
            res.data.data.forEach(item => {
              let obj = {
                label: item.feeTypeName,
                value: item.feeTypeId
              }
              arr.push(obj)
            })
            this.assetSubjectOptions = arr
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
      // 获取资产分类下拉列表
      getAssetClassifyOptions () {
        let obj = {
          organId: this.organId,
          assetType: this.assetType.length > 0 ? this.assetType.join(',') : ''
        }
        if (!obj.assetType) {
          return
        }
        this.$api.assets.getList(obj).then(res => {
          if (res.data.code === '0') {
            let arr = [{label: '全部资产分类', value: ''}]
            res.data.data.forEach(item => {
              let obj = {
                label: item.professionName,
                value: item.professionCode
              }
              arr.push(obj)
            })
            this.assetClassifyOptions = arr
          } else {
            this.$message.error(res.data.message)
          }
        })
      },

      // 导出
      handleExport () {
        this.exportBtnLoading = true
        let data = this.queryList('export')
        exportDataAsExcel(data, this.$api.tableManage.exportCardExcel, '资产入账列表.xlsx', this).then(() => {
          this.exportBtnLoading = false
        })
      },

      // 打开批量导入Modal
      openImportModal () {
        if (!this.organId) { return this.$message.info('请选择组织机构') }
        this.$refs.batchImport.visible = true
      },

      // 下载导入模板文件
      downTemplate () {
        exportDataAsExcel('import_template_zckp.xlsx', this.$api.tableManage.downloadTemplate, '资产卡片导入模板.xlsx', this)
      },

      // 批量导入
      uploadFile (file) {
        const { organId } = this
        let name = this.$SG_Message.loading({ duration: 0, content: '批量导入中' })
        let fileData = new FormData()
        fileData.append('file', file)
        let query = `?organId=${organId}`
        this.$api.tableManage.importAssetCardData(query, fileData).then(r => {
          this.$SG_Message.destroy(name)
          let res = r.data
          if (res && String(res.code) === '0') {
            this.$SG_Message.success(res.message || '导入成功')
            this.$refs.batchImport.visible = false
            return this.queryClick()
          }
          throw res.message
        }).catch(err => {
          this.$SG_Message.destroy(name)
          this.$SG_Message.error(err || '批量导入失败')
        })
      }
    },
    created () {
    },
    mounted () {
      this.getAssetTypeOptions()
    }
  }
</script>

<style lang="less" scoped>
  .formCon {
    display: flex;
    width: 100%;
    justify-content:flex-end;
    flex-wrap: wrap;
    > * {
      margin-right:10px;
      margin-bottom: 10px;
      position: relative;
      height: 32px;
    }
  }
  .operation-btn {
    color: #0084FF;
    margin-right: 10px;
  }
  .custom-table {
    padding-bottom: 50px;
  }
</style>
