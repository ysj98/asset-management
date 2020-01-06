<!--
  关联资产弹窗
  judgeInstitutions: 用于判断是否展示组织机构树
-->
<template>
  <SG-Modal
    width="1030px"
    v-model="show"
    title="选择资产"
    class="associate-asset-modal"
    @ok="submitAsset"
    @cancel="handleCancel"
  >
    <div>
      <a-tabs @change="changeTab" type="card" :tabBarGutter="10">
        <a-tab-pane tab="待选资产" key="1">
          <div class="tab-container">
            <Cephalosome :rightCol="23" :leftCol="1" class="Cephalosome" rowHeight="70px">
              <div slot="col-r">
                <treeSelect v-if="!judgeInstitutions" @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
                <a-select :style="allStyle" :disabled="judgeInstitutions" placeholder="全部资产项目" v-model="projectId">
                  <a-select-option v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
                </a-select>
                <a-select :style="allStyle" placeholder="全部资产类型" v-model="assetType" @change="assetTypeFn">
                  <a-select-option v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
                </a-select>
                <a-select :style="allStyle" placeholder="全部资产类别" v-model="objectType">
                  <a-select-option v-for="(item, index) in objectTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
                </a-select>
                <a-input style="width:140px; margin: 0 10px;" v-model="assetNameCode" placeholder="资产名称/编码"/>
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
        </a-tab-pane>
        <a-tab-pane tab="已选资产" key="2">
          <div class="tab-container" style="margin-top: 20px">
            <div class="tab-nav">
              <div class="table-border table-layout-fixed">
                <a-table
                  :columns="chosenColumns"
                  :dataSource="chosenDataSource"
                  class="custom-table td-pd10"
                  :pagination="false"
                >
                  <template slot="operation" slot-scope="text, record">
                    <a class="operation-btn" @click="deleteRecord(record)">删除</a>
                  </template>
                </a-table>
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
  import TreeSelect from '../../common/treeSelect'

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
    },
    {
      title: '配套数量',
      dataIndex: 'approvalStatusName'
    }
  ]

  export default {
    components: {
      Cephalosome,
      TreeSelect
    },
    props: {
      judgeInstitutions: {
        type: Boolean,
        default: true
      },
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
        firstCall: true,
        show: false,
        assetType: '',   // 资产类型
        objectType: '',  // 资产类别
        assetNameCode: '',  // 资产名称/编码
        projectId: '',  // 资产项目ID
        projectData: [],
        assetTypeData: [],
        objectTypeData: [],
        allStyle: 'width: 140px; margin-right: 10px;',
        columns,
        dataSource: [],
        chosenColumns: [],
        chosenDataSource: [],
        paginator: {
          pageNo: 1,
          pageLength: 10,
          totalCount: 0,
          organId: ''
        },
        loading: false,
        noPageTools: true,
        selectedRowKeys: [],
        overallData: []
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
    watch: {
      projectId () {
        console.log('projectId发生变化')
        this.query()
      }
    },
    methods: {
      // 选择组织机构
      changeTree (value, label) {
        this.organName = label
        this.paginator.organId = value
        this.paginator.pageNum = 1
        this.projectId = ''
        this.query()
        this.getObjectKeyValueByOrganIdFn()
      },
      changeTab (value) {
        if (+value === 2) {
          let rowsData = []
          this.selectedRowKeys.forEach(item => {
            this.overallData.forEach((element, index) => {
              if (item === element.assetId) {
                rowsData.push(element)
              }
            })
          })
          this.chosenDataSource = rowsData
        }
      },
      // 选中的
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      // 关闭弹窗
      handleCancel() {
        this.show = false
      },
      // 删除选中的资产
      deleteRecord (record) {
        this.chosenDataSource.forEach((item, index) => {
          if (item.assetId === record.assetId) {
            this.chosenDataSource.splice(index, 1)
          }
        })
        this.selectedRowKeys.forEach((item, index) => {
          if (record.assetId === item) {
            this.selectedRowKeys.splice(index, 1)
          }
        })
      },
      // 提交
      submitAsset () {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.info('请先选择资产')
          return
        }
        let checkedData = []
        let checkedNames = []
        let rowsData = []
        let extraData = {
          originalValueSum: 0,
          assetType: '',
          assetCategory: '',
          useType: ''
        }
        console.log(this.selectedRowKeys, '选中的')
        console.log(this.overallData, '总的')
        this.selectedRowKeys.forEach((item, index) => {
          this.overallData.forEach((element) => {
            if (item === element.assetId) {
              checkedData.push(element.assetId)
              checkedNames.push(element.assetName)
              rowsData.push(element)
              extraData.originalValueSum = utils.accAdd(parseFloat(extraData.originalValueSum).toFixed(2), parseFloat(element.originalValue).toFixed(2))
              if (index === 0) {
                extraData.assetType = element.assetType
                extraData.assetCategory = element.objectType
                extraData.useType = element.useType
              }
            }
          })
        })
        this.$emit('assetChange', checkedData, checkedNames, rowsData, extraData)
      },
      // 资产项目
      getObjectKeyValueByOrganIdFn () {
        let obj = {
          organId: this.judgeInstitutions ? this.organId : this.paginator.organId,
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
        if (!this.organId || !this.paginator.organId) {
          return
        }
        let obj = {
          organId: this.judgeInstitutions ? this.organId : this.paginator.organId,
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
          // organId: this.organId,
          projectId: this.projectId, // 资产项目
          assetType: this.assetType,   // 资产类型
          objectType: this.objectType,  // 资产类别
          assetNameCode: this.assetNameCode,  // 资产名称/编码
          queryType: Number(this.queryType),   // 查询类型 1 资产变动，2 资产清理 3权属登记
          pageSize: this.paginator.pageLength,
          pageNum: this.paginator.pageNo
        }
        this.$api.assets.assetListPage(obj).then(res => {
          if (Number(res.data.code) === 0) {
            let data = res.data.data.data
            if (data) {
              let arrData = utils.deepClone(this.overallData)
              data.forEach((element, index) => {
                element.key = element.assetId
                arrData.push(element)
              })
              this.dataSource = data
              this.paginator.totalCount = res.data.data.count
              // 遍历相同的对象
              this.$nextTick(() => {
                let hash = {}
                arrData = arrData.reduce((preVal, curVal) => {
                  hash[curVal.assetId] ? '' : hash[curVal.assetId] = true && preVal.push(curVal)
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
      // 外面给回来的数据
      redactCheckedDataFn (redactChecked, projectId, overallData) {
        // overallData 给回来的数据合并在去重
        if (overallData && overallData.length !== 0) {
          let arrData = [...this.overallData, ...overallData]
          let hash = {}
          arrData = arrData.reduce((preVal, curVal) => {
            hash[curVal.assetId] ? '' : hash[curVal.assetId] = true && preVal.push(curVal)
            return preVal
          }, [])
          // 存着全部数据
          this.overallData = arrData
        }
        if (this.projectId !== projectId) {
          this.projectId = projectId
          this.query()
        }
        this.$nextTick(() => {
          this.selectedRowKeys = redactChecked
        })
        if (this.firstCall) {
          this.query()
          this.firstCall = false
        }
      },
    },
    mounted () {
      this.chosenColumns = utils.deepClone(columns)
      this.chosenColumns.push({
        title: '操作',
        dataIndex: 'operation',
        scopedSlots: { customRender: 'operation' }
      })
      // 选择项目
      if (this.judgeInstitutions) {
        this.getObjectKeyValueByOrganIdFn()
      } 
      // 资产类型
      this.platformDictFn('asset_type')
    }
  }
</script>

<style lang="less">
  .associate-asset-modal {
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
  }
</style>