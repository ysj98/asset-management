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
    class="assetBundlePopover"
    width="1030px"
    v-model="show"
    title="选择权证"
    @ok="statusFn"
    @cancel="handleCancel"
  >
    <div>
      <Cephalosome :rightCol="23" :leftCol="1" class="Cephalosome" rowHeight="48px">
        <div slot="col-r">
        <a-select :style="allStyle" placeholder="全部资产项目" v-model="selecData.kindOfRights">
          <a-select-option v-for="(item, index) in kindOfRightsData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
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
          </a-table>
          <SG-FooterPagination
            :pageLength="selecData.pageSize"
            :totalCount="count"
            :noPageTools="noPageTools"
            v-model="selecData.pageNum"
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
    title: '权证号码',
    dataIndex: 'warrantNbr'
  },
  {
    title: '权利类型',
    dataIndex: 'kindOfRightName'
  },
  {
    title: '权属人',
    dataIndex: 'obligeeName'
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
    dataIndex: 'address'
  },
  {
    title: '登记日期',
    dataIndex: 'qualityOfRightName'
  }
]
export default {
  components: {Cephalosome},
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
      columns,
      loading: false,
      noPageTools: true,
      location: 'absolute',
      count: '',
      kindOfRightsData: [],
      allStyle: 'width: 140px; margin-right: 10px;',
      show: false,
      selecData: {
        assetType: '',   // 资产类型
        objectType: '',  // 资产类别
        queryType: this.queryType,   // 查询类型 1 资产变动，2 资产清理 3权属登记
        projectId: '',  // 资产项目ID
        pageSize: 10,
        pageNum: 1
      },
      tableData: [],
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
    'selectedData.projectId' () {
      this.query()
    }
  },
  methods: {
    // 选中的
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    // 提交返回数据
    statusFn () {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请先选择资产')
        return
      }
      let checkedData = []
      let rowsData = []
      console.log(this.selectedRowKeys, '选中的')
      console.log(this.overallData, '总的')
      this.selectedRowKeys.forEach(item => {
        this.overallData.forEach((element, index) => {
          if (item === element.warrantId) {
            checkedData.push(element.warrantId)
            rowsData.push(element)
          }
        })
      })
      this.$emit('status', checkedData, rowsData)
    },
    // 外面删除了后剩下给回来的数据
    redactCheckedDataFn (redactChecked, overallData) {
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
      // 第一次进来调一下接口
      if (this.firstCall) {
        this.query()
        this.firstCall = false
      }
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
            this.kindOfRightsData = [...this.kindOfRightsData, ...data]
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
        kindOfRights: '',              // 权利类型(多选)
        obligeeId: '',                 // 权属人
        status: '',                    // 权证状态
        warrantNbr: '',                // 权证号
        pageSize: this.selecData.pageSize,
        pageNum: this.selecData.pageNum
      }
      this.$api.assets.warrantList(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          if (data) {
            let arrData = utils.deepClone(this.overallData)
            data.forEach((element, index) => {
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
    // 资产类型
    this.platformDictFn('AMS_KIND_OF_RIGHT')
  }
}
</script>
<style lang="less" scoped>
.assetBundlePopover {
  .tab-nav {
    margin-top: 10px;
  }
}
</style>
