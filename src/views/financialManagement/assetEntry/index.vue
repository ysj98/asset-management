<!--
  资产入账
-->
<template>
  <div class="assets-entry">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <SG-Button icon="plus" type="primary" @click="newAssetEntry">新建卡片</SG-Button>
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect @changeTree="changeTree" placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
          <a-input-search placeholder="卡片名称/编码" :style="allStyle" v-model="cardName" @search="queryClick" />
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
        :pagination="false"
      >
        <template slot="operation" slot-scope="text, record">
          <a class="operation-btn" v-show="+record.approvalStatus === 2" @click="handleOperation('audit', record)" v-power="ASSET_MANAGEMENT.ASSET_CLEAR_AUDIT">审核</a>
          <a class="operation-btn" v-show="+record.approvalStatus === 1" @click="antiAudit(record)" v-power="ASSET_MANAGEMENT.ASSET_CLEAR_REVERSE_AUDIT">反审核</a>
          <a class="operation-btn" v-show="+record.approvalStatus === 0 || +record.approvalStatus === 3" @click="handleOperation('edit', record)"  v-power="ASSET_MANAGEMENT.ASSET_CLEAR_EDIT">编辑</a>
          <a class="operation-btn" v-show="+record.approvalStatus === 0 || +record.approvalStatus === 3" @click="deleteClearForm(record)" v-power="ASSET_MANAGEMENT.ASSET_CLEAR_DELETE">删除</a>
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
  </div>
</template>

<script>
  import TreeSelect from '../../common/treeSelect'
  import SegiRangePicker from '@/components/SegiRangePicker'
  import noDataTips from '@/components/noDataTips'
  import {getCurrentDate, getMonthsAgoDate} from 'utils/formatTime'
  import moment from 'moment'
  import {ASSET_MANAGEMENT} from '@/config/config.power'

  const columns = [
    {
      title: '所属机构',
      dataIndex: 'organName',
      width: 160
    },
    {
      title: '卡片编码',
      dataIndex: 'cardCode',
      width: 160
    },
    {
      title: '卡片名称',
      dataIndex: 'cardName',
      width: 160
    },
    {
      title: '资产项目',
      dataIndex: 'projectName',
      width: 160
    },
    {
      title: '资产类型',
      dataIndex: 'assetTypeName',
      width: 160
    },
    {
      title: '资产分类',
      dataIndex: 'assetCategoryName',
      width: 160
    },
    {
      title: '入账日期',
      dataIndex: 'accountEntryTime',
      width: 160
    },
    {
      title: '存放地点',
      dataIndex: 'storagePathName',
      width: 160
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
      width: 120
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
      width: 120
    },
    {
      title: '操作',
      width: 160,
      dataIndex: 'operation',
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
      label: '已审批',
      value: '1'
    },
    {
      label: '已取消',
      value: '4'
    }
  ]
  export default {
    components: {
      TreeSelect, SegiRangePicker, noDataTips
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
        assetClassifyOptions: [],
        beginDate: getMonthsAgoDate(6),
        endDate: getCurrentDate(),
        entryBeginDate: '',
        entryEndDate: '',
        paginator: {
          pageNo: 1,
          pageLength: 10,
          totalCount: 0
        },
        showNoDataTips: false
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
      // 删除清理单
      deleteClearForm (record) {
        let self = this
        this.$confirm({
          title: '提示',
          content: '确认要删除该资产清理单吗？',
          onOk() {
            let form = {
              cleaningOrderId: record.cleaningOrderId
            }
            self.$api.assets.deleteCleanup(form).then(res => {
              if (res.data.code === '0') {
                self.$message.success('删除成功')
                self.queryList()
              } else {
                self.$message.error(res.data.message)
              }
            })
          }
        })
      },
      antiAudit (record) {
        let self = this
        this.$confirm({
          title: '提示',
          content: '确认要对此清理单反审核吗？',
          onOk() {
            let form = {
              cleaningOrderId: record.cleaningOrderId
            }
            console.log(form)
            self.$api.assets.reverseApproveCleanup(form).then(res => {
              if (res.data.code === '0') {
                self.$message.success('操作成功')
                self.queryList()
              } else {
                self.$message.error(res.data.message)
              }
            })
          }
        })
      },
      handleOperation (pageType, record) {
        this.$router.push({path: '/assetEntry/' + pageType, query: {pageType: pageType, cleaningOrderId: record.cleaningOrderId, organId: this.organId, organName: this.organName}})
      },
      // 点击查询
      queryClick () {
        this.paginator.pageNo = 1
        this.queryList()
      },
      queryList () {
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
                if (item[key] === '') {
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
        this.$api.assets.getList(obj).then(res => {
          if (res.data.code === '0') {
            let arr = [{label: '全部资产分类', value: ''}]
            res.data.data.forEach(item => {
              let obj = {
                label: item.professionName,
                value: item.categoryConfId
              }
              arr.push(obj)
            })
            this.assetClassifyOptions = arr
          } else {
            this.$message.error(res.data.message)
          }
        })
      },
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