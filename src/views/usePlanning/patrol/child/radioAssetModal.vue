<!--
 * @Description: 单选资产
 * @Date: 2020-03-02 10:17:06
 * @LastEditTime: 2020-03-04 15:57:59
 -->
<template>
  <SG-Modal
    width="1030px"
    v-model="show"
    title="选择资产"
    class="associate-asset-modal"
    @ok="submitAsset"
    @cancel="handleCancel"
    :maskClosable="false"
  >
    <div class="tab-container">
      <Cephalosome :rightCol="23" :leftCol="1" class="Cephalosome" rowHeight="70px">
        <div slot="col-r">
          <treeSelect v-if="!organId" @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
          <a-input v-else :style="allStyle" :disabled="true" :value="organName" placeholder="组织机构"/>
          <a-select :getPopupContainer="getPopupContainer" :style="allStyle" placeholder="全部资产项目" v-model="projectId" :disabled="!!projectIdTemp">
            <a-select-option v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :getPopupContainer="getPopupContainer" :style="allStyle" placeholder="全部资产类型" v-model="assetType" @change="assetTypeFn" :disabled="!!assetTypeTemp">
            <a-select-option v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-select :getPopupContainer="getPopupContainer" :style="allStyle" placeholder="全部资产类别" v-model="objectType">
            <a-select-option v-for="(item, index) in objectTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
          </a-select>
          <a-input :style="allStyle" v-model="assetNameCode" placeholder="资产名称/编码"/>
          <SG-Button type="primary" @click="queryClick">查询</SG-Button>
        </div>
      </Cephalosome>
      <div class="tab-nav">
        <div class="table-border table-layout-fixed">
          <a-table
            :rowSelection="rowSelection"
            :loading="loading"
            :columns="columns"
            :dataSource="dataSource"
            class="custom-table td-pd10"
            :pagination="false"
          >
          </a-table>
          <no-data-tips v-show="dataSource.length === 0"></no-data-tips>
          <SG-FooterPagination
            :pageLength="paginator.pageLength"
            :totalCount="paginator.totalCount"
            :noPageTools="noPageTools"
            v-model="paginator.pageNo"
            @change="handleChange"
          />
        </div>
      </div>
    </div>  
  </SG-Modal>
</template>
<script>
import Cephalosome from '@/components/Cephalosome'
import {utils} from '@/utils/utils.js'
import TreeSelect from '@/views/common/treeSelect'
import noDataTips from '@/components/noDataTips'
const columns = [
    {
      title: '资产编码',
      dataIndex: 'assetCode'
    },
    {
      title: '资产名称',
      dataIndex: 'assetName'
    },
    {
      title: '所属机构',
      dataIndex: 'organName'
    },
    {
      title: '资产项目',
      dataIndex: 'projectName'
    },
    {
      title: '资产类型',
      dataIndex: 'assetTypeName'
    },
    {
      title: '资产分类',
      dataIndex: 'assetCategoryName'
    },
    {
      title: '所在位置',
      dataIndex: 'address'
    },
    {
      title: '资产状态',
      dataIndex: 'assetStatusName'
    }
    // {
    //   title: '配套数量',
    //   dataIndex: 'approvalStatusName'
    // }
  ]
export default {
  components: {
    Cephalosome,
    TreeSelect,
    noDataTips
  },
  props: {
    organId: {
      type: [String, Number],
      default: ''
    },
    queryType: {
      type: [String, Number],
      default: ''
    },
    organName: {
      default: ''
    },
    projectIdTemp: {
      type: [String, Number],
      default: ''
    },
    assetTypeTemp: {
      type: [String, Number],
      default: ''
    },
    assetTypeDataTemp: {
      type: Array,
      default: () => []
    },
    projectDataTemp: {
      type: Array,
      default: () => []
    },
    selectObj: {
      type: [Object],
      default: () => {}
    }
  },
  data () {
    return {
      show: false,
      assetType: '',   // 资产类型
      objectType: '',  // 资产类别
      assetNameCode: '',  // 资产名称/编码
      projectId: '',  // 资产项目ID
      projectData: [], // 资产项目选项
      assetTypeData: [], // 资产类型选项
      objectTypeData: [], // 资产类别选项
      allStyle: 'width: 140px; margin-right: 10px;',
      columns,
      dataSource: [],
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0,
        organId: ''
      },
      loading: false,
      noPageTools: true,
      selectedRowKeys: [],
      selectedRowData: {},
    }
  },
  watch: {
    organId () {
      console.log('监听变化')
      this.query()
    },
    projectId () {
      this.query()
    },
    selectObj (obj) {
      this.selectedRowData = {...obj}
      this.selectRowKeys = [obj.assetId]
    }
  },
  computed: {
    rowSelection () {
      const { selectedRowKeys } = this
      return {
        type: 'radio',
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        onSelection: this.onSelection
      }
    }
  },
  methods: {
    // 选中的
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 选择组织机构
    changeTree (value, label) {
      this.organName = label
      this.paginator.organId = value
      this.paginator.pageNum = 1
      this.projectId = ''
      this.objectType = ''
      this.query()
      this.getObjectKeyValueByOrganIdFn()
      this.getListFn()
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn () {
      let obj = {
        organId: this.organId ? this.organId : this.paginator.organId,
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
          // this.projectData = [...this.projectData, ...arr]
          this.projectData = [{name: '全部资产项目', value: ''}, ...arr]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产分类列表
    getListFn () {
      // 没有organId都不给查分类
      if (!this.organId && !this.paginator.organId) {
        return
      }
      let obj = {
        organId: this.organId ? this.organId : this.paginator.organId,
        assetType: this.assetType
      }
      this.$api.assets.getList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          let arr = []
          data.forEach(item => {
            arr.push({
              name: item.professionName,
              value: item.professionCode
            })
          })
          this.objectTypeData = []
          let atr = [
            {
              name: '全部资产分类',
              value: ''
            }
          ]
          this.objectTypeData = [...atr, ...arr]
        }
      })
    },
    // 平台字典获取变动类型
    platformDictFn (str) {
      let obj = {
        code: str
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          if (str === 'asset_type') {
            let arr = [
              {
                name: '全部资产类型',
                value: ''
              }
            ]
            this.assetTypeData = [...arr, ...data]
          }
          this.getListFn()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 资产类型发生变化
    assetTypeFn () {
      this.objectType = ''
      this.getListFn()
    },
    // 分页查询
    handleChange (data) {
      this.paginator.pageNo = data.pageNo
      this.paginator.pageLength = data.pageLength
      this.query()
    },
    queryClick () {
      this.paginator.pageNo = 1
      this.query()
    },
    query () {
      this.loading = true
      let obj = {
        organId: this.organId,
        projectId: this.projectId, // 资产项目
        assetType: this.assetType,   // 资产类型
        objectType: this.objectType,  // 资产类别
        assetNameCode: this.assetNameCode,  // 资产名称/编码
        queryType: Number(this.queryType),   // 查询类型 1 资产变动，2 资产清理 3 权属登记，4资产处置登记 5附属配套 
        pageSize: this.paginator.pageLength,
        pageNum: this.paginator.pageNo
      }
      this.$api.assets.assetListPage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          if (data) {
            let arrData = []
            data.forEach((element, index) => {
              element.key = element.assetId
              element.informant = undefined,
              element.informantOpt = []
            })
            this.dataSource = data
            this.paginator.totalCount = res.data.data.count
          } else {
            this.data = []
          }
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    submitAsset () {
      if (!this.selectedRowKeys.length) {
        return this.$message.error('请选择一项资产!')
      }
      let flag = this.dataSource.some(item => item.assetId === this.selectedRowKeys[0])
      if (flag) {
        this.selectedRowData = this.dataSource.filter(item => item.assetId === this.selectedRowKeys[0])[0]
      }
      this.$emit('select', {...this.selectedRowData})
      this.handleCancel()
    },
    // 关闭弹窗
    handleCancel() {
      this.show = false
    },
    getPopupContainer (e) {
      return e.parentElement
    }
  },
  mounted () {
    // 选择项目
    if (this.assetTypeDataTemp.length <= 0) {
      this.getObjectKeyValueByOrganIdFn()
    } else {
      this.assetTypeData = this.assetTypeDataTemp
      this.assetType = this.assetTypeTemp
    }
    // 资产类型
    if (this.projectDataTemp.length <= 0) {
      this.platformDictFn('asset_type')
    } else {
      this.projectData = this.projectDataTemp
      this.projectId = this.projectIdTemp
      this.getListFn()
    }
    if (this.selectObj && this.selectObj.assetId) {
      this.selectedRowKeys = [this.selectObj.assetId]
    }
  }
}
</script>