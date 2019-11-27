<!--
 * @Date: 2019-11-26 16:46:14
 * @Author: chen han
 * @Description: 资产项目权属
 -->
 <template>
   <div class="assetProject-page">
     <SearchContainer type="line" :value="false">
      <div slot="headerForm">
        <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
        <!-- 资产项目 -->
        <a-select
          showSearch
          placeholder="请选择资产项目"
          v-model="queryCondition.projectId"
          optionFilterProp="children"
          :style="allStyle"
          :options="assetProjectOpt"
          :allowClear="false"
          :filterOption="filterOption"
          notFoundContent="没有查询到数据"
         />
         <a-checkbox :checked="queryCondition.currentOrgan" @change="checkboxFn">仅当前机构下资产项目</a-checkbox>
         <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
      </div>
     </SearchContainer>
     <div class="table-layout-fixed">
      <a-table
        class="custom-table td-pd10"
        :loading="table.loading"
        :pagination="false"
        :scroll="{ x: 1500}"
        :columns="table.columns"
        :dataSource="table.dataSource"
        :locale="{emptyText: '暂无数据'}"
        >
        <template slot="projectName" slot-scope="text, record">
           <span class="nav_name" @click="goPage('detail', record)">{{text}}</span>
        </template>
        <template slot="operation" slot-scope="text, record">
          <span class="btn_click mr15">详情</span>
          <span class="btn_click">权属设置</span>
        </template>
      </a-table>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="table.totalCount"
        location="absolute"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
   </div>
 </template>
 <script>
 import SearchContainer from '@/views/common/SearchContainer'
 import TreeSelect from '@/views/common/treeSelect'
 const allStyle = {width: '140px', marginRight: '10px'}
 const allWidth = {width: '170px', 'margin-right': '10px'}
 let getUuid = ((uuid = 1) => () => ++uuid)()
 const queryCondition = {
   organId: '',
   projectName: '',
   projectId: '',
   currentOrgan: false,
   pageSize: 10,
   pageNum: 1
 }
 const assetProjectOpt = [{
   label: '全部资产项目', value: ''
 }]
 let columns = [{
  title: '管理机构',
  dataIndex: 'organName',
  width: 140
}, {
  title: '资产项目名称',
  dataIndex: 'projectName',
  scopedSlots: { customRender: 'projectName' },
  width: 140
}, {
  title: '资产项目编码',
  dataIndex: 'projectCode',
  width: 100
}, {
  title: '来源方式',
  dataIndex: 'sourceTypeName',
  width: 100
}, {
  title: '来源渠道',
  dataIndex: 'souceChannelType',
  width: 100
}, {
  title: '资产数量',
  dataIndex: 'assetCount',
  width: 70
}, {
  title: '办理进度',
  dataIndex: 'tranProgress',
  scopedSlots: { customRender: 'tranProgress' },
  width: 200
}, {
  title: '有证资产数',
  dataIndex: 'ownershipCount',
  width: 100
}, {
  title: '无证资产数',
  dataIndex: 'noOwnershipCount',
  width: 100
}, {
  title: '待办资产数',
  dataIndex: 'waitOwnershipCount',
  width: 100
}, {
  title: '操作',
  dataIndex: 'operation',
  scopedSlots: { customRender: 'operation' },
  width: 120
}]
 export default {
   components: {
     SearchContainer,
     TreeSelect
   },
   data () {
     return {
       allStyle,
       allWidth,
       organName: '', // 所选组织机构名称
       queryCondition,
       assetProjectOpt,
       table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
     }
   },
   methods: {
     query () {
       let data = {
         ...this.queryCondition,
         flag: this.queryCondition.currentOrgan ? '1' : '0'
       }
       this.table.loading = true
       this.$api.basics.ownerShipList(data).then(res => {
         this.table.loading = false
         if (res.data.code === '0') {
           let result = res.data.data.data || []
           this.table.dataSource = result.map(item => {
            return {
              key: getUuid(),
              ...item
            }
          })
          this.table.totalCount = res.data.data.count || '' 
         }
       }, () => {
         this.table.loading = false
       })
     },
     // 选择组织机构
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      if (!this.isChild) {
        this.queryCondition.pageNum = 1
        this.query()
      } else {
        this.isChild = false
      }
    },
    // 重置分页查询
    searchQuery () {
      this.queryCondition.pageNum = 1
      this.query()
    },
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 选择是否查看当前机构变动单
    checkboxFn (e) {
      this.queryCondition.currentOrgan = e.target.checked
    },
    // 页面跳转
    goPage (type, record) {
      // 存储缓存搜索缓存数据
      // let o = {
      //   ...this.queryConditionStore,
      //   organName: this.organName || '',
      //   showKey: 'house'
      // }
      // this.SET_ROUTE_QUERY(this.$route.path, o)
      // let query = {type}
      // if (['edit', 'copy', 'detail'].includes(type)) {
      //   query.houseId = record.houseId,
      //   query.organId = this.queryCondition.organId
      // }
      // this.$router.push({path: operationTypes[type], query: query || {}})
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
   }
 }
 </script>
 <style lang="less" scoped>
   .assetProject-page{}
 </style>
