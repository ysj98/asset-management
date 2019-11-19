<template>
  <SG-Modal
    class="assetBundlePopover"
    width="1030px"
    v-model="show"
    title="选择资产"
    @ok="statusFn"
    @cancel="handleCancel"
  >
    <div>
      <Cephalosome :rightCol="23" :leftCol="1" class="Cephalosome" rowHeight="48px">
        <div slot="col-r">
        <a-select :style="allStyle" placeholder="全部资产项目" :defaultValue="selecData.projectId" @change="approvalStatusFn">
          <a-select-option v-for="(item, index) in projectData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :style="allStyle" placeholder="全部资产类型" :defaultValue="selecData.assetType" @change="approvalStatusFn">
          <a-select-option v-for="(item, index) in typeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <a-select :style="allStyle" placeholder="全部资产类别" :defaultValue="selecData.objectType" @change="approvalStatusFn">
          <a-select-option v-for="(item, index) in objectTypeData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select>
        <!-- <a-select :style="allStyle" placeholder="资产状态" :defaultValue="selecData.status" @change="approvalStatusFn">
          <a-select-option v-for="(item, index) in statusData" :key="index" :value="item.value">{{item.name}}</a-select-option>
        </a-select> -->
        <a-input style="width:140px; margin: 0 10px;" v-model="selecData.assetNameCode" placeholder="资产名称/编码"/>
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
  components: {Cephalosome},
  props: {
    organId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      columns,
      loading: false,
      noPageTools: true,
      location: 'absolute',
      count: '',
      projectData: [
        {
          name: '全部资产项目',
          value: ''
        }
      ],
      typeData: [
        {
          name: '全部资产类型',
          value: ''
        }
      ],
      objectTypeData: [
        {
          name: '全部资产类型',
          value: ''
        }
      ],
      statusData: [
        {
          name: '全部资产状态',
          value: ''
        }
      ],
      allStyle: 'width: 140px; margin-right: 10px;',
      show: false,
      selecData: {
        assetType: '',   // 资产类型
        objectType: '',  // 资产类别
        assetNameCodeCode: '',  // 资产名称/编码
        queryType: '1',   // 查询类型 1 资产变动，2 资产清理 3权属登记
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
          if (item === element.assetCode) {
            checkedData.push(element.assetCode)
            rowsData.push(element)
          }
        })
      })
      this.$emit('status', checkedData, rowsData)
    },
    // 外面删除了后剩下给回来的数据
    redactCheckedDataFn (redactChecked) {
      this.$nextTick(() => {
        this.selectedRowKeys = redactChecked
      })
    },
    // 关闭弹窗
    handleCancel () {
      this.show = false
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn () {
      let obj = {
        organId: this.organId,
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
          this.projectData = [...this.projectData, ...arr]
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    query () {
      this.loading = true
      let obj = this.selecData
      this.$api.assets.assetListPage(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          if (data) {
            let arrData = utils.deepClone(this.overallData)
            data.forEach((element, index) => {
              element.key = element.assetCode
              arrData.push(element)
            })
            this.tableData = data
            this.count = res.data.data.count
            // 遍历相同的对象
            this.$nextTick(() => {
              let hash = {}
              arrData = arrData.reduce((preVal, curVal) => {
                hash[curVal.assetCode] ? '' : hash[curVal.assetCode] = true && preVal.push(curVal)
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
    },
    approvalStatusFn () {}
  },
  created () {
  },
  mounted () {
    this.getObjectKeyValueByOrganIdFn()
    this.query()
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
