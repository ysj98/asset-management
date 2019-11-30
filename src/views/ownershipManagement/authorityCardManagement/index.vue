<!--
  权证管理
-->
<template>
  <div class="ownershipRegistration">
    <SearchContainer v-model="toggle" @input="searchContainerFn" :contentStyle="{paddingTop:'16px'}">
      <div slot="headerBtns">
        <SG-Button icon="plus" type="primary" @click="newChangeSheetFn">新建权证</SG-Button>
        <!-- <SG-Button icon="plus" type="primary" @click="newChangeSheetFn">新建权证</SG-Button>
        <SG-Button icon="plus" type="primary" @click="newChangeSheetFn">新建权证</SG-Button> -->
      </div>
      <div slot="headerForm">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" style="width: 170px; margin-right: 10px;"></treeSelect>
      </div>
      <div slot="contentForm" class="search-content-box">
        <div class="search-from-box">
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部权利类型" :tokenSeparators="[',']"  @select="kindOfRightsDataFn" v-model="queryCondition.kindOfRights">
            <a-select-option v-for="(item, index) in kindOfRightsData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :style="allStyle" :filterOption="filterOption" placeholder="全部权属人" v-model="queryCondition.obligeeId">
            <a-select-option v-for="(item, index) in obligeeIdData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :maxTagCount="1" :style="allStyle" mode="multiple" placeholder="全部状态" :tokenSeparators="[',']"  @select="statusFn" v-model="queryCondition.status">
            <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input :style="allStyle" v-model="queryCondition.warrantNbr" placeholder="请输入权证号" maxlength="30"  />
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px;" @click="query">查询</SG-Button>
          <SG-Button @click="eliminateFn">清空</SG-Button>
        </div>
      </div>
    </SearchContainer>
    <div class="table-layout-fixed" ref="table_box">
      <!-- :loading="loading" -->
      <a-table
        :columns="columns"
        :dataSource="tableData"
        class="custom-table td-pd10"
        :pagination="false"
        >
        <!-- <template slot="operation" slot-scope="text, record">
          <OperationPopover :operationData="operationData" :record="record" @operationFun="operationFun"></OperationPopover>
        </template> -->
      </a-table>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="count"
        :location="location"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
    <NewCard ref="newCard" :organId="queryCondition.organId"></NewCard>
  </div>
</template>

<script>
import SearchContainer from '@/views/common/SearchContainer'
import TreeSelect from '../../common/treeSelect'
import moment from 'moment'
import segiIcon from '@/components/segiIcon.vue'
import NewCard from './newCard.vue'
import {utils, debounce} from '@/utils/utils.js'
const allWidth = {width: '170px', 'margin-right': '10px', float: 'left', 'margin-top': '14px'}
const columns = [
  {
    title: '所属机构',
    dataIndex: 'organName'
  },
  {
    title: '权证号码',
    dataIndex: 'warrantNbr'
  },
  {
    title: '权利类型',
    dataIndex: 'kindOfRightName'
  },
  {
    title: '权属人',
    dataIndex: 'obligeeId'
  },
  {
    title: '丘地号/不动产单元号',
    dataIndex: 'lotNoEstateUnitCode'
  },
  {
    title: '坐落位置',
    dataIndex: 'seatingPosition'
  },
  {
    title: '用途',
    dataIndex: 'ownershipUseName'
  },
  {
    title: '建筑面积(㎡)',
    dataIndex: 'buildArea'
  },
  {
    title: '登记日期',
    dataIndex: 'createTime'
  },
  {
    title: '使用期限',
    dataIndex: 'useLimitDate'
  },
  {
    title: '交接日期',
    dataIndex: 'handoverDate'
  },
  {
    title: '状态',
    dataIndex: 'statusName'
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
]
const operationData = [
  {iconType: 'form', text: '修改', editType: 'edit'},
  {iconType: 'delete', text: '删除', editType: 'delete'}
]
const statusData = [
  {
    name: '全部权证状态',
    value: ''
  },
  {
    name: '已注销',
    value: '0'
  },
  {
    name: '正常',
    value: '1'
  }
]
const queryCondition =  {
    organId: '',        // 组织机构
    kindOfRights: '',   // 权利类型(多选)
    obligeeId: '',      // 权属人
    status: '',         // 权证状态
    warrantNbr: '',     // 权证号
    pageNum: 1,         // 第几页
    pageSize: 10,       // 每页显示记录数
  }
export default {
  components: {SearchContainer, TreeSelect, segiIcon, NewCard},
  props: {},
  data () {
    return {
      loading: false,
      noPageTools: false,
      location: 'absolute',
      allStyle: allWidth,
      toggle: true,
      columns,
      organName: '',
      organId: '',
      tableData: [],
      kindOfRightsData: [],
      operationData: [...operationData],
      statusData: [...statusData],
      queryCondition: {...queryCondition},
      count: '',
      obligeeIdData: []
    }
  },
  computed: {
  },
  methods: {
    // 新建权证
    newChangeSheetFn () {
      this.$refs.newCard.show = true
      this.$refs.newCard.selectFn()
    },
    // 组织机构树
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.pageNum = 1
      this.queryCondition.obligeeId = ''
      this.selectFn()
      this.query()
    },
    // 搜索
    onSearch () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    // 选择是否查看当前机构变动单
    checkboxFn (e) {
      this.queryCondition.flag = e.target.checked
    },
    // 高级搜索控制
    searchContainerFn (val) {
      this.toggle = val
    },
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 权属人
    selectFn () {
      let obj = {
        organId: this.queryCondition.organId,
        obligeeName: ''
      }
      this.$api.assets.select(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.obligeeName,
              value: item.obligeeId
            })
          })
          this.obligeeIdData = [{name: '全部权属人', value: ''}, ...arr]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 权利类型
    platformDictFn () {
      let obj = {
        code: 'AMS_KIND_OF_RIGHT'
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          this.kindOfRightsData = [{name: '全部权利类型', value: ''}, ...data]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 权利类型变化
    kindOfRightsDataFn (value) {
      this.$nextTick(function () {
        this.queryCondition.kindOfRights = this.handleMultipleSelectValue(value, this.queryCondition.kindOfRights, this.kindOfRightsData)
      })
    },
    // 状态发生变化
    statusFn (value) {
      this.$nextTick(function () {
        this.queryCondition.status = this.handleMultipleSelectValue(value, this.queryCondition.status, this.statusData)
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
    // 清空
    eliminateFn () {
      let organId = this.queryCondition.organId
      this.alterationDate = []
      this.queryCondition = {...queryCondition}
      this.queryCondition.organId = organId
      this.query()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    // 查询
    query () {
      this.loading = true
      let obj = {
        organId: Number(this.queryCondition.organId),        // 组织机构
        kindOfRights: this.queryCondition.kindOfRights.length > 0 ? this.queryCondition.kindOfRights.join(',') : '',   // 权利类型(多选)
        obligeeId: this.queryCondition.obligeeId,       // 权属人
        status: this.queryCondition.status.length > 0 ? this.queryCondition.status.join(',') : '',         // 权证状态
        warrantNbr: this.queryCondition.warrantNbr,     // 权证号
        pageNum: this.queryCondition.pageNum,     // 当前页
        pageSize: this.queryCondition.pageSize,    // 每页显示记录数
      }
      this.$api.ownership.warrantList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          if (data && data.length > 0) {
            data.forEach((item, index) => {
              item.key = index
            })
            this.tableData = data
            this.count = res.data.data.count
          } else {
            this.tableData = []
            this.count = 0
          }
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    }
  },
  created () {
  },
  watch: {
    '$route' () {
      if (this.$route.path === '/authorityCardManagement' && this.$route.query.refresh) {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
        this.query()
      }
    }
  },
  mounted () {
    // 权利类型
    this.platformDictFn()
  }
}
</script>
<style lang="less" scoped>
.ownershipRegistration {
  .from-second {
    padding: 26px 190px 0 0;
  }
  .box {
    display: inline-block;
  }
  .box-right {
    margin-right: 10px;
  }
}
.search-content-box{
  display: flex;
  justify-content: space-between;
  .search-from-box{
    flex: 1;
  }
  .two-row-box{
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
</style>