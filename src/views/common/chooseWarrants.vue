<!-- 
  选择权证
  organId: 组织机构id
  projectId: 项目id
  queryType: 查询类型 1 资产变动，2 资产清理 3权属登记
  redactCheckedDataFn()    // 外层删除后给回来的数据调这个方法 this.$refs.chooseWarrants.redactCheckedDataFn(this.checkedData)
  this.$refs.assetBundlePopover.show = true    // 弹窗控制
-->
<template>
  <SG-Modal
    class="assetBundlePopover assetBundlePopover-nav"
    width="1030px"
    v-model="show"
    title="选择权证"
    @ok="statusFn"
    @cancel="handleCancel"
  >
    <div>
      <a-tabs @change="changeTab" type="card" v-model="defaultActiveKey" :tabBarGutter="10">
        <a-tab-pane tab="待选权证" key="1">
          <div class="tab-container">
          <Cephalosome :rightCol="23" :leftCol="1" class="Cephalosome" rowHeight="48px">
            <div slot="col-r">
            <a-select :style="allStyle" placeholder="全部权证类型" v-model="selecData.kindOfRights">
              <a-select-option v-for="(item, index) in kindOfRightsData" :key="index" :value="item.value">{{item.name}}</a-select-option>
            </a-select>
            <a-input :style="allStyle" v-model="selecData.warrantNbr" placeholder="权证号码"/>
            <SG-Button type="primary" @click="query">查询</SG-Button>
            </div>
          </Cephalosome>
          <div class="tab-nav">
            <div class="table-border table-layout-fixed">
              <a-table
                :rowSelection="rowSelection"
                :loading="loading"
                :columns="columns"
                :dataSource="tableData"
                class="custom-table td-pd10"
                :pagination="false"
                >
                <template slot="obligeeName" slot-scope="text, record">
                  <span>{{record.obligeeName || '--'}}</span>
                </template>
                <template slot="qualityOfRightName" slot-scope="text, record">
                  <span>{{record.qualityOfRightName || '--'}}</span>
                </template>
              </a-table>
              <no-data-tips v-show="tableData.length === 0"></no-data-tips>
              <SG-FooterPagination
                class="sg-footer"
                :pageLength="selecData.pageSize"
                :totalCount="count"
                :noPageTools="noPageTools"
                v-model="selecData.pageNum"
                @change="handleChange"
              />
            </div>
          </div>
        </div>
      </a-tab-pane>
        <a-tab-pane tab="已选权证" key="2">
          <div class="tab-container" style="margin-top: 20px">
            <div class="tab-nav">
              <div class="table-border table-layout-fixed">
                <a-table
                  :columns="chosenColumns"
                  :dataSource="chosenDataSource"
                  class="custom-table td-pd10"
                  :pagination="false"
                >
                  <template slot="obligeeName" slot-scope="text, record">
                    <span>{{record.obligeeName || '--'}}</span>
                  </template>
                  <template slot="qualityOfRightName" slot-scope="text, record">
                    <span>{{record.qualityOfRightName || '--'}}</span>
                  </template>
                  <template slot="operation" slot-scope="text, record">
                    <a class="operation-btn" @click="deleteRecord(record)">删除</a>
                  </template>
                </a-table>
                <no-data-tips v-show="chosenDataSource.length === 0"></no-data-tips>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
  </SG-Modal>
</template>

<script>
import Cephalosome from '@/components/Cephalosome'
import {utils} from '@/utils/utils.js'
import noDataTips from '@/components/noDataTips'
const columns = [
  {
    title: '权证号码',
    dataIndex: 'warrantNbr'
  },
  {
    title: '权证类型',
    dataIndex: 'kindOfRightName'
  },
  {
    title: '权属人',
    dataIndex: 'obligeeName',
    scopedSlots: { customRender: 'obligeeName' },
  },
  {
    title: '丘地号/不动产单元号',
    dataIndex: 'lotNoEstateUnitCode'
  },
  {
    title: '面积',
    dataIndex: 'buildArea'
  },
  {
    title: '坐落位置',
    dataIndex: 'seatingPosition'
  },
  {
    title: '权利性质',
    dataIndex: 'qualityOfRightName',
    scopedSlots: { customRender: 'qualityOfRightName' },
  },
  {
    title: '登记日期',
    dataIndex: 'rigisterDate'
  }
]
export default {
  components: {Cephalosome, noDataTips},
  props: {
    organId: {
      type: [String, Number],
      default: ''
    },
    queryType: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      selectKey: '',
      firstCall: true,
      columns,
      loading: false,
      noPageTools: true,
      location: 'absolute',
      count: '',
      kindOfRightsData: [],
      allStyle: 'width: 140px; margin-right: 10px;',
      show: false,
      selecData: {
        warrantNbr: '',
        assetType: '',   // 资产类型
        objectType: '',  // 资产类别
        queryType: this.queryType,   // 查询类型 1 资产变动，2 资产清理 3权属登记
        projectId: '',  // 资产项目ID
        pageSize: 10,
        pageNum: 1
      },
      tableData: [],
      chosenColumns: [],
      chosenDataSource: [],
      selectedRowKeys: [],
      overallData: [],
      defaultActiveKey: '1',
    }
  },
  computed: {
    rowSelection () {
      const { selectedRowKeys } = this
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        onSelection: this.onSelection
      }
    }
  },
  // watch: {
  //   'selectedData.projectId' () {
  //     this.selecData.warrantNbr = ''
  //     this.selecData.kindOfRights = ''
  //     this.query()
  //   }
  // },
  methods: {
    changeTab (value) {
      if (+value === 2) {
        let rowsData = []
        this.selectedRowKeys.forEach(item => {
          this.overallData.forEach((element, index) => {
            if (item === element.warrantId) {
              rowsData.push(element)
            }
          })
        })
        rowsData.forEach((list, index) => {
          list.key = index
        })
        this.chosenDataSource = rowsData
      }
    },
    // 删除选中的权证
    deleteRecord (record) {
      this.chosenDataSource.forEach((item, index) => {
        if (item.warrantId === record.warrantId) {
          this.chosenDataSource.splice(index, 1)
        }
      })
      this.selectedRowKeys.forEach((item, index) => {
        if (record.warrantId === item) {
          this.selectedRowKeys.splice(index, 1)
        }
      })
    },
    // 选中的
    onSelectChange (selectedRowKeys) {
      if (selectedRowKeys.length > 5) {
        this.$message.info('权证号最多只能选择5个！')
      } else {
        this.selectedRowKeys = selectedRowKeys
      }
    },
    // 提交返回数据
    statusFn () {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请选择权证')
        return
      }
      let checkedData = []
      let rowsData = []
      let roeNameData = []
      console.log(this.selectedRowKeys, '选中的')
      console.log(this.overallData, '总的')
      this.selectedRowKeys.forEach(item => {
        this.overallData.forEach((element, index) => {
          if (item === element.warrantId) {
            checkedData.push(element.warrantId)
            rowsData.push(element)
            roeNameData.push(element.warrantNbr)
          }
        })
      })
      this.$emit('status', checkedData, rowsData, roeNameData, this.selectKey)
    },
    // 外面删除了后剩下给回来的数据
    redactCheckedDataFn (redactChecked, overallData, selectKey) {
      console.log(redactChecked, '外面给回来拿到的数据')
      // overallData 给回来的数据合并在去重
      if (overallData && overallData.length !== 0) {
        let arrData = [...this.overallData, ...overallData]
        let hash = {}
        arrData = arrData.reduce((preVal, curVal) => {
          hash[curVal.warrantId] ? '' : hash[curVal.warrantId] = true && preVal.push(curVal)
          return preVal
        }, [])
        // 存着全部数据
        this.overallData = arrData
      }
      this.$nextTick(() => {
        this.selectedRowKeys = redactChecked
      })
      if (selectKey !== this.selectKey) {
        this.defaultActiveKey = '1'
      }
      this.selectKey = selectKey   // 外面列表选择的第几个
      // 第一次进来调一下接口
      // if (this.firstCall) {
      //   this.query()
      //   this.firstCall = false
      // }
      // 因为有权证新增每次进来都调一次
      this.selecData.pageSize = 10
      this.selecData.pageNum = 1
      this.selecData.warrantNbr = ''
      this.selecData.kindOfRights = ''
      this.query()
    },
    // 关闭弹窗
    handleCancel () {
      this.show = false
    },
    // 平台字典获取变动类型
    platformDictFn (str) {
      let obj = {
        code: str
      }
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data
          if (str === 'AMS_KIND_OF_RIGHT') {
            this.kindOfRightsData = [{name: '全部权证类型', value: ''}, ...data]
          }
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    query () {
      this.loading = true
      let obj = {
        organId: this.organId,         // 组织机构
        kindOfRights: this.selecData.kindOfRights,              // 权证类型(多选)
        obligeeId: '',                 // 权属人
        status: '1',                    // 权证状态
        warrantNbr: this.selecData.warrantNbr,                // 权证号
        pageSize: this.selecData.pageSize,
        pageNum: this.selecData.pageNum
      }
      this.$api.ownership.warrantList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          if (data) {
            let arrData = utils.deepClone(this.overallData)
            data.forEach((element, index) => {
              element.lotNoEstateUnitCode = `${element.lotNo || '--'}/${element.estateUnitCode || '--'}`
              element.key = element.warrantId
              arrData.push(element)
            })
            this.tableData = data
            this.count = res.data.data.count
            // 遍历相同的对象
            this.$nextTick(() => {
              let hash = {}
              arrData = arrData.reduce((preVal, curVal) => {
                hash[curVal.warrantId] ? '' : hash[curVal.warrantId] = true && preVal.push(curVal)
                return preVal
              }, [])
              // 存着全部数据
              this.overallData = arrData
            })
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
    // 分页查询
    handleChange (data) {
      this.selecData.pageNum = data.pageNo
      this.selecData.pageSize = data.pageLength
      this.query()
    }
  },
  created () {
  },
  mounted () {
    this.chosenColumns = utils.deepClone(columns)
    this.chosenColumns.push({
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' }
    })
    // 资产类型
    this.platformDictFn('AMS_KIND_OF_RIGHT')
  }
}
</script>
<style lang="less" scoped>
.assetBundlePopover {
  .tab-nav {
    // margin-top: 10px;
  }
}
</style>

<style lang="less">
.assetBundlePopover-nav {
  /deep/ .ant-modal-body {
    padding: 14px 0;
  }
  /deep/ .ant-tabs-bar {
    margin: 0;
  }
  /deep/ .ant-tabs-nav {
    margin-left: 30px;
  }
  .wrapper {
    margin: 0;
  }
  .tab-container {
    padding: 0 30px;
  }
  .sg-footer {
    border-top: none;
  }
}
</style>
