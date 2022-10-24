<!--
  资产抵押登记
-->
<template>
  <div>
    <SG-SearchContainer background="white">
        <div slot="headBtns">
        <SG-Button icon="plus" type="primary" style="margin-right: 8px" @click="creatDebt" >新建</SG-Button>
        <SG-Button
          icon="export"
          :loading="exportBtnLoading"
          style="margin-right: 8px"
          @click="downloadFn"
        >导出</SG-Button>
      </div>
      <div slot="headRight" class="search-content-box">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        <a-select :style="allStyle" :showSearch="true" :filterOption="filterOption" placeholder="全部资产项目" v-model="queryCondition.projectId">
            <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
         <a-select :style="allStyle"   placeholder="全部债务项目" v-model="queryCondition.debtType">
            <a-select-option :title="item.name" v-for="(item, index) in debtData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
        <a-input placeholder="债权人/资产名称" :style="allStyle" v-model="queryCondition.creditorOrAssetName"  />
        <SG-Button type="primary" @click="queryClick">查询</SG-Button>
      </div>
    </SG-SearchContainer>
    <div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        class="custom-table td-pd10"
        :pagination="false"
        :scroll="{y: 510}"
      >
        <template slot="operation" slot-scope="text, record">
          <a class="operation-btn" @click="editDebt(record)">编辑</a>
          <a class="operation-btn" @click="deleteDebt(record)">删除</a>
          <a class="operation-btn" @click="detailDebt(record)">详情</a>
        </template>
      </a-table>
      <no-data-tips v-show="showNoDataTips"></no-data-tips>
    </div>
    <SG-FooterPagination
      :pageLength="queryCondition.pageSize"
      :totalCount="paginator.totalCount"
      location="absolute"
      v-model="queryCondition.pageNum"
      @change="handlePageChange"
    />
  </div>
</template>

<script>
import TreeSelect from '@/views/common/treeSelect'
import noDataTips from '@/components/noDataTips'
import {ASSET_MANAGEMENT} from '@/config/config.power'
const checkboxAllStyle = {'margin-right': '10px', flex: 1, 'margin-top': '20px', 'display': 'inline-block', 'vertical-align': 'middle'}
const allWidth = {width: '170px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', 'display': 'inline-block', 'vertical-align': 'middle'}
const dateWidth = {width: '300px', 'margin-right': '10px', flex: 1, 'margin-top': '14px', 'display': 'inline-block', 'vertical-align': 'middle'}
const columns = [
  {
    title: '所属机构',
    dataIndex: 'organName',
    width: 150
  },
  {
    title: '资产项目',
    dataIndex: 'projectName',
    width: 100
  },
  {
    title: '资产数量',
    dataIndex: 'assetCount',
    width: 80
  },
  {
    title: '债务类型',
    dataIndex: 'debtTypeName',
    width: 80
  },
  {
    title: '债权人',
    dataIndex: 'creditor',
    width: 100
  },
  {
    title: '债务有效期',
    dataIndex: 'dateStr',
    width: 150
  },
  {
    title: '债务金额（元）',
    dataIndex: 'amount',
    width: 120
  },
  {
    title: '提交时间',
    dataIndex: 'createTime',
    width: 120
  },
  {
    title: '提交人',
    dataIndex: 'createByName',
    width: 120
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 120,
    scopedSlots: { customRender: 'operation' }
  }
]
const queryCondition =  {
    organId: '',         // 组织机构id
    projectId: '',       // 资产项目Id
    debtType: '',       // 债务类型
    creditorOrAssetName:'',
    pageNum: 1,          // 第几页
    pageSize: 10,        // 每页显示记录数
  }
export default {
  components: {
   noDataTips, TreeSelect
  },
  data () {
    return {
      ASSET_MANAGEMENT,
      warrantNbr: '',
      createByName: '',
      allStyle: 'width: 150px; marginLeft: 10px;',
      organId: '',
      organName: '',
      columns,
      dataSource: [],
      queryCondition: {...queryCondition},
      projectData: [
        {
          name: '全部资产项目',
          value: ''
        }
      ],
      debtData: [
        {
          name: '全部债务类型',
          value: ''
        },
        {
          name: '抵押',
          value: '1'
        },
        {
          name: '质押',
          value: '2'
        },
      ],
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0
      },
      modalType: 'new', // 弹窗类型
      ownerId: '', // 权属人id
      showNoDataTips: false,
      exportBtnLoading: false // 导出按钮loading
    }
  },
  methods: {
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = 1300
      this.queryClick()
    },
    // 页码发生变化
    handlePageChange (page) {
      console.log(page, 'pagepagepage')
      this.queryCondition.pageNum = page.pageNo
      this.queryCondition.pageSize = page.pageLength
      this.queryList()
    },
    // 操作回调
    operationFun (record) {
      this.$router.push({path: '/ownershipChangeLog/detail', query: {warrantNbr: record.warrantNbr, kindOfRightName: record.kindOfRightName, logId: record.logId}})
    },
    creatDebt(){
      this.$router.push({path: '/debt/creatDebt',query: {organId: this.queryCondition.organId, organName: this.organName,setType:'add'} })
    },
    editDebt(record){
      this.$router.push({path: '/debt/creatDebt',query: {organId: this.queryCondition.organId, organName: this.organName,setType:'edit',debtId:record.debtId} })
    },
    detailDebt(record){
      this.$router.push({path: '/debt/detailDebt',query: {organId: this.queryCondition.organId, organName: this.organName,setType:'detail',debtId:record.debtId} })
    },
    deleteDebt(record){
      let _this = this;
      this.$confirm({
        title: "提示",
        content: "确认要删除该条记录吗？",
        onOk() {
          _this.$api.debt.deleteDebt({debtId:record.debtId}).then((res)=>{
             if (res.data.code === '0') {
                _this.$message.success('删除成功')
                _this.queryList()
        } else {
          _this.$message.error(res.data.message)
        }
          })
        },
      });
    },
    // 点击查询
    queryClick () {
      this.queryCondition.pageNum = 1
      this.queryList()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    //导出
    downloadFn () {
      let obj = {
        ...this.queryCondition
      }
      delete obj.pageNum
      delete obj.pageSize
      this.$api.debt.exportDebt(obj).then(res => {
         let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产抵押记录.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    },
    // 查询列表
    queryList () {
      let form = {
        ...this.queryCondition
      }
      this.$api.debt.getDebtPage(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data.data || []
          if (data.length === 0) {
            this.showNoDataTips = true
          } else {
            this.showNoDataTips = false
          }
         console.log(data)
          this.dataSource = [...data]
          this.paginator.totalCount = res.data.count
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    //资产项目
    getObjectKeyValueByOrganIdFn () {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: ''
      }
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.projectName,
              value: item.projectId
            })
          })
          this.projectData = [{name: '全部资产项目', value: ''}, ...arr]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
  },
  mounted(){
    // this.queryList()
  }
}
</script>

<style lang="less" scoped>
  .operation-btn {
    color: #0084FF;
    margin-right: 10px;
  }
  .custom-table {
    padding-bottom: 50px;
  }
  .search-content-box {
    div {
      display: inline-block;
    }
  }
</style>
