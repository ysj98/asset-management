<!--
  关联资产弹窗
-->
<template>
  <SG-Modal
    width="1030px"
    v-model="show"
    title="选择资产"
    @ok="submitAsset"
    @cancel="handleCancel"
  >
    <div>
      <Cephalosome :rightCol="23" :leftCol="1" class="Cephalosome" rowHeight="48px">
        <div slot="col-r">
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
  </SG-Modal>
</template>

<script>
  import Cephalosome from '@/components/Cephalosome'
  import {utils} from '@/utils/utils.js'

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
      Cephalosome
    },
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
        firstCall: true,
        show: false,
        assetType: '',   // 资产类型
        objectType: '',  // 资产类别
        assetNameCode: '',  // 资产名称/编码
        assetTypeData: [],
        objectTypeData: [],
        allStyle: 'width: 140px; margin-right: 10px;',
        columns,
        dataSource: [],
        paginator: {
          pageNo: 1,
          pageLength: 10,
          totalCount: 0
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
    methods: {
      // 选中的
      onSelectChange(selectedRowKeys) {
        this.selectedRowKeys = selectedRowKeys
      },
      // 关闭弹窗
      handleCancel() {
        this.show = false
      },
      // 提交
      submitAsset () {
        if (this.selectedRowKeys.length <= 0) {
          this.$message.info('请先选择资产')
          return
        }
        let checkedData = []
        let checkedNames = []
        let originalValueSum = 0
        let rowsData = []
        console.log(this.selectedRowKeys, '选中的')
        console.log(this.overallData, '总的')
        this.selectedRowKeys.forEach(item => {
          this.overallData.forEach((element, index) => {
            if (item === element.assetId) {
              checkedData.push(element.assetId)
              checkedNames.push(element.assetName)
              rowsData.push(element)
              originalValueSum += element.originalValue
            }
          })
        })
        this.$emit('assetChange', checkedData, checkedNames, originalValueSum, rowsData)
      },
      // 资产分类列表
      getListFn () {
        let obj = {
          organId: this.organId,
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
                name: '全部资产类别',
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
      redactCheckedDataFn (redactChecked, overallData) {
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
      // 资产类型
      this.platformDictFn('asset_type')
    }
  }
</script>

<style lang="less" scoped>

</style>