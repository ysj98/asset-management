<!--
  资产清理
-->
<template>
  <div class="assets-clear">
    <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
      <div slot="headBtns">
        <SG-Button icon="plus" type="primary" @click="newClearForm" v-power="ASSET_MANAGEMENT.ASSET_CLEAR_NEW">新建清理单</SG-Button>
        <div style="position:absolute;top: 20px;right: 76px;display:flex;">
          <treeSelect @changeTree="changeTree" :showSearch="true" placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        </div>
      </div>
      <div slot="btns">
        <SG-Button type="primary" style="margin-right: 10px" @click="queryClick">查询</SG-Button>
        <SG-Button>清空</SG-Button>
      </div>
      <div slot="form" class="formCon">
        <a-select
          showSearch
          placeholder="请选择资产项目"
          optionFilterProp="children"
          :style="allStyle"
          v-model="queryCondition.assetProject"
          :options="assetProjectOptions"
          :filterOption="filterOption"
        ></a-select>
        <a-select
          :maxTagCount="1"
          :style="allStyle"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部状态"
          v-model="queryCondition.approvalStatus"
          :options="approvalStatusData"
          @select="changeStatus"
        ></a-select>
        <a-select
          :maxTagCount="1"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部资产类型"
          v-model="queryCondition.assetType"
          :options="assetTypeOptions"
          style="width: 190px; margin-right: 10px;"
          @select="changeAssetType"
        ></a-select>
        <segi-range-picker label="录入时间" style="margin-right: 10px;" :defaultValue="[moment(queryCondition.beginDate, 'YYYY-MM-DD'), moment(queryCondition.endDate, 'YYYY-MM-DD')]" :canSelectToday="true" @dateChange="onDateChange"></segi-range-picker>
        <a-checkbox style="line-height: 32px" :checked="queryCondition.onlyCurrentOrgan" @change="onOnlyCurrentOrganChange">仅当前机构下资产清理单</a-checkbox>
      </div>
    </SG-SearchContainer>
    <div>
      <!--<SearchContainer v-model="toggle" @input="searchContainerFn">-->
      <!--<div slot="headerBtns">-->
      <!--<a-button type="primary" icon="plus">新建变动单</a-button>-->
      <!--</div>-->
      <!--<div slot="headerForm">-->
      <!--<treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>-->
      <!--</div>-->
      <!--<div slot="contentForm">-->
      <!--<div>-->
      <!--<a-select-->
      <!--showSearch-->
      <!--placeholder="请选择资产项目"-->
      <!--optionFilterProp="children"-->
      <!--style="width: 170px; margin-right: 10px;"-->
      <!--v-model="queryCondition.assetProject"-->
      <!--:options="assetProjectOptions"-->
      <!--:filterOption="filterOption"-->
      <!--&gt;</a-select>-->
      <!--<a-select-->
      <!--:maxTagCount="1"-->
      <!--:style="allStyle"-->
      <!--mode="multiple"-->
      <!--:tokenSeparators="[',']"-->
      <!--placeholder="全部状态"-->
      <!--:defaultValue="queryCondition.approvalStatus"-->
      <!--style="width: 170px; margin-right: 10px;"-->
      <!--&gt;-->
      <!--<a-select-option v-for="(item, index) in approvalStatusData" :key="index" :value="item.value">{{item.name}}</a-select-option>-->
      <!--</a-select>-->
      <!--<a-select-->
      <!--:maxTagCount="1"-->
      <!--:style="allStyle"-->
      <!--mode="multiple"-->
      <!--:tokenSeparators="[',']"-->
      <!--placeholder="全部资产类型"-->
      <!--:defaultValue="queryCondition.assetType"-->
      <!--style="width: 190px; margin-right: 10px;"-->
      <!--&gt;-->
      <!--<a-select-option v-for="(item, index) in assetTypeOptions" :key="index" :value="item.value">{{item.name}}</a-select-option>-->
      <!--</a-select>-->
      <!--<SG-Button type="primary" style="margin-right: 10px">查询</SG-Button>-->
      <!--<SG-Button>清空</SG-Button>-->
      <!--</div>-->
      <!--<div>-->
      <!--<SG-DatePicker label="范围选择"  pickerType="RangePicker"></SG-DatePicker>-->
      <!--<div class="check-box-item" :class="{'active-item': queryCondition.onlyCurrentOrgan}">-->
      <!--<a-checkbox :checked="queryCondition.onlyCurrentOrgan" @change="onOnlyCurrentOrganChange">只显示结果数据</a-checkbox>-->
      <!--</div>-->
      <!--</div>-->
      <!--</div>-->
      <!--</SearchContainer>-->
    </div>
    <div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        class="custom-table"
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
import {getCurrentDate, getThreeMonthsAgoDate} from 'utils/formatTime'
import moment from 'moment'
import {ASSET_MANAGEMENT} from '@/config/config.power'

const columns = [
  {
    title: '清理单编号',
    dataIndex: 'cleaningOrderCode',
    width: 160
  },
  {
    title: '管理机构',
    dataIndex: 'organName',
    width: 160
  },
  {
    title: '资产项目名称',
    dataIndex: 'projectName',
    width: 160
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 160
  },
  {
    title: '资产数量',
    dataIndex: 'assetCount',
    width: 120
  },
  {
    title: '清理原因',
    dataIndex: 'cleanupTypeName',
    width: 160
  },
  {
    title: '创建日期',
    dataIndex: 'createTime',
    width: 160
  },
  {
    title: '创建人',
    dataIndex: 'createByName',
    width: 120
  },
  {
    title: '当前状态',
    dataIndex: 'approvalStatusName',
    width: 120
  },
  {
    title: '操作',
    width: 160,
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
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
    TreeSelect, SegiRangePicker
  },
  data () {
    return {
      ASSET_MANAGEMENT,
      allStyle: 'width: 170px; margin-right: 10px;',
      toggle: false,
      organName: '',
      organId: '',
      columns,
      dataSource: [],
      approvalStatusData: [...approvalStatusData],
      assetProjectOptions: [],
      assetTypeOptions: [],
      queryCondition: {
        approvalStatus: [''],
        assetProject: '',
        assetType: [''],
        beginDate: getThreeMonthsAgoDate(),
        endDate: getCurrentDate(),
        onlyCurrentOrgan: false
      },
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0
      },
    }
  },
  watch: {
    '$route' () {
      if (this.$route.path === '/assetClear' && this.$route.query.refresh) {
        this.queryList()
      }
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
      this.queryClick()
    },
    // 状态发生变化
    changeStatus (value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatus = this.handleMultipleSelectValue(value, this.queryCondition.approvalStatus, this.approvalStatusData)
      })
    },
    // 资产类型发生变化
    changeAssetType (value) {
      this.$nextTick(function () {
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeOptions)
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
    // 起止日期发生变化
    onDateChange (val) {
      this.queryCondition.beginDate = val[0]
      this.queryCondition.endDate = val[1]
    },
    // 复选框发生变化
    onOnlyCurrentOrganChange (event) {
      this.queryCondition.onlyCurrentOrgan = event.target.checked
    },
    // 页码发生变化
    handlePageChange (page) {
      this.paginator.pageNo = page.pageNo
      this.paginator.pageLength = page.pageLength
      this.queryList()
    },
    // 新增清理单
    newClearForm () {
      this.$router.push({path: '/assetClear/new', query: {pageType: 'new', organId: this.organId, organName: this.organName}})
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
      this.$router.push({path: '/assetClear/' + pageType, query: {pageType: pageType, cleaningOrderId: record.cleaningOrderId, organId: this.organId, organName: this.organName}})
    },
    // 点击查询
    queryClick () {
      this.paginator.pageNo = 1
      this.queryList()
    },
    queryList () {
      let form = {
        organId: this.organId,
        projectId: this.queryCondition.assetProject,
        multiAssetType: this.queryCondition.assetType.join(','),
        multiApprovalStatus: this.queryCondition.approvalStatus.join(','),
        currentOrganId: this.queryCondition.onlyCurrentOrgan ? '1' : '0',
        startCreateDate: this.queryCondition.beginDate,
        endCreateDate: this.queryCondition.endDate,
        pageNum: this.paginator.pageNo,
        pageSize: this.paginator.pageLength
      }
      this.$api.assets.getCleanupPage(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data.data
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