<!--
 * @Date: 2019-11-26 16:46:14
 * @Author: chen han
 * @Description: 资产项目权属
 -->
 <template>
   <div class="assetProject-page pb70">
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
          :options="projectIdOpt"
          :allowClear="false"
          :filterOption="filterOption"
          notFoundContent="没有查询到数据"
         />
         <a-checkbox :checked="queryCondition.currentOrgan" @change="checkboxFn">仅当前机构下资产项目</a-checkbox>
         <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
      </div>
     </SearchContainer>
     <div>
      <a-table
        class="custom-table td-pd10"
        :loading="table.loading"
        :pagination="false"
        :columns="table.columns"
        :dataSource="table.dataSource"
        :locale="{emptyText: '暂无数据'}"
        >
        <template slot="projectName" slot-scope="text, record">
           <span class="nav_name" @click="goPage('detail', record)">{{text}}</span>
        </template>
        <template slot="tranProgress" slot-scope="text, record">
           <a-progress :percent="Number(record.tranProgress) || 0" />
        </template>
        <template slot="operation" slot-scope="text, record">
          <span  @click="goPage('detail', record)" class="btn_click mr15">详情</span>
          <span @click="goPage('set', record)" class="btn_click">权属设置</span>
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
 import {utils} from '@/utils/utils'
 // 页面跳转
const operationTypes = {
  detail: '/ownershipSurvey/projectDetail',
  set: '/ownershipSurvey/projectSet'
}
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
 const projectIdOpt = [{
   label: '全部资产项目', value: ''
 }]
 let columns = [{
  title: '管理机构',
  dataIndex: 'organName',
  width: 150
}, {
  title: '资产项目名称',
  dataIndex: 'projectName',
  scopedSlots: { customRender: 'projectName' },
  width: 150
}, {
  title: '资产项目编码',
  dataIndex: 'projectCode',
  width: 120
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
  width: 100
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
  width: 120,
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
       projectIdOpt,
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
         flag: this.queryCondition.currentOrgan ? 1 : 0
       }
       this.table.loading = true
       this.$api.basics.ownerShipList(data).then(res => {
         this.table.loading = false
         if (res.data.code === '0') {
           let result = res.data.data.data || []
           this.table.dataSource = result.map(item => {
             item.sourceTypeName = item.sourceTypeName || '-'
             item.souceChannelType = item.souceChannelType || '-'
            return {
              key: getUuid(),
              ...item
            }
          })
          this.table.totalCount = res.data.data.count || '' 
         } else {
           this.$message.error(res.data.message)
         }
       }, () => {
         this.table.loading = false
       })
     },
     // 资产项目
    getObjectKeyValueByOrganIdFn () {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: ''
      }
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data || []
          let result = data.map((item) => {
            return {
              label: item.projectName,
              value: item.projectId
            }
          })
          this.projectIdOpt = [...utils.deepClone(projectIdOpt), ...result]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
     // 选择组织机构
    changeTree (value, label) {
      this.organName = label
      this.queryCondition.organId = value
      this.queryCondition.projectId = ''
      this.getObjectKeyValueByOrganIdFn()
      this.searchQuery()
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
      let query = {
        type,
        projectId: record.projectId
      }
      this.$router.push({path: operationTypes[type], query})
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