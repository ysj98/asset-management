<!--
  资产分类设置
-->
<template>
  <div>
    <SG-SearchContainer background="white">
      <div slot="btns">
        <SG-Button type="primary" @click="exportList"><segiIcon type="#icon-ziyuan10" class="icon-right"/>导出</SG-Button>
      </div>
      <div slot="form">
        <topOrganByUser @change="organIdChange" :formStyle="allStyle" v-model="organId" :hasAll="false" :selectFirst="true"/>
        <a-select
          :style="allStyle"
          v-model="status"
          :options="statusOptions"
          @change="queryClick"
        ></a-select>
        <a-input-search placeholder="类别名称/编码" :style="allStyle" v-model="codeName" @search="queryClick" />
      </div>
    </SG-SearchContainer>
    <div>
      <a-table
        :columns="columns"
        :dataSource="dataSource"
        class="custom-table"
        :pagination="false"
      >
        <template slot="operation" slot-scope="text, record">
          <OperationPopover :operationData="record.operationData" :record="record" @operationFun="operationFun"></OperationPopover>
          <!--<a class="operation-btn" v-if="+record.status === 0" @click="operationFun('start', record)">启用</a>-->
          <!--<a class="operation-btn" v-else @click="operationFun('stop', record)">停用</a>-->
          <!--<a class="operation-btn" v-show="+record.status === 1" @click="operationFun('edit', record)">编辑</a>-->
          <!--<a class="operation-btn" @click="operationFun('detail', record)">详情</a>-->
        </template>
        <template slot="statusName" slot-scope="text, record, index">
          <div v-if="+record.status === 1"><SG-Switch disabled checked  :id="index" style="margin-right: 10px;"></SG-Switch>启用</div>
          <div v-else><SG-Switch disabled :id="index" style="margin-right: 10px;"></SG-Switch>停用</div>
        </template>
      </a-table>
    </div>
    <SG-FooterPagination
      :pageLength="paginator.pageLength"
      :totalCount="paginator.totalCount"
      location="absolute"
      v-model="paginator.pageNo"
      @change="handlePageChange"
    />
  </div>
</template>

<script>
import segiIcon from '@/components/segiIcon.vue'
import topOrganByUser from '@/views/common/topOrganByUser'
import OperationPopover from '@/components/OperationPopover'

const columns = [
  {
    title: '分类编号',
    dataIndex: 'professionId',
    width: '160'
  },
  {
    title: '所属机构',
    dataIndex: 'organName',
    width: '200'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: '160'
  },
  {
    title: '分类名称',
    dataIndex: 'professionName',
    width: '160'
  },
  {
    title: '分类编码',
    dataIndex: 'professionCode',
    width: '160'
  },
  {
    title: '计量单位',
    dataIndex: 'unitName',
    width: '160'
  },
  {
    title: '净残值率(%)',
    dataIndex: 'netSalvageRate',
    width: '160'
  },
  {
    title: '折旧方法',
    dataIndex: 'depreciationMethodName',
    width: '160'
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    width: '180',
    scopedSlots: { customRender: 'statusName' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    scopedSlots: { customRender: 'operation' },
  }
]
const operationData1 = [
  {iconType: 'play-circle', text: '启用', editType: 'start'},
  {iconType: 'form', text: '编辑', editType: 'edit'},
  {iconType: 'bars', text: '详情', editType: 'detail'}
]
const operationData2 = [
  {iconType: 'pause-circle', text: '停用', editType: 'stop'},
  {iconType: 'form', text: '编辑', editType: 'edit'},
  {iconType: 'bars', text: '详情', editType: 'detail'}
]

export default {
  components: {
    segiIcon, OperationPopover, topOrganByUser
  },
  data () {
    return {
      allStyle: 'width: 150px; marginLeft: 10px;',
      organId: '',
      organName: '',
      status: '',
      statusOptions: [
        {label: '全部状态', value: ''},
        {label: '启用', value: '1'},
        {label: '停用', value: '0'}
      ],
      codeName: '',
      columns,
      dataSource: [],
      operationData1,
      operationData2,
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0
      },
    }
  },
  methods: {
    organIdChange (value) {
      this.queryClick()
    },
    changeTree (value, label) {
      this.organName = label
      this.organId = value
      this.queryClick()
    },
    // 页码发生变化
    handlePageChange (page) {
      this.paginator.pageNo = page.pageNo
      this.paginator.pageLength = page.pageLength
      this.queryList()
    },
    // 操作回调
    operationFun (editType, record) {
      switch (editType) {
        case 'start': this.changeStatus(1, record.categoryConfId, record.professionCode)
          break
        case 'stop': this.changeStatus(0, record.categoryConfId, record.professionCode)
          break
        case 'edit': this.$router.push({path: '/assetClassSet/edit', query: {pageType: 'edit', categoryConfId: record.categoryConfId, organId: this.organId, professionCode: record.professionCode, assetType: record.assetType}})
          break
        case 'detail': this.$router.push({path: '/assetClassSet/detail', query: {pageType: 'detail', categoryConfId: record.categoryConfId, organId: this.organId, professionCode: record.professionCode, assetType: record.assetType}})
          break
        default: break
      }
    },
    // 改变状态
    changeStatus (status, id, professionCode) {
      let form = {
        categoryConfId: id,
        status: status,
        organId: this.organId,
        professionCode: professionCode
      }
      this.$api.assets.updateStatus(form).then(res => {
        if (res.data.code === '0') {
          this.$message.success('修改成功')
          this.queryList()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 点击查询
    queryClick () {
      this.paginator.pageNo = 1
      this.queryList()
    },
    // 查询列表
    queryList () {
      console.log('query')
      let form = {
        organId: this.organId,
        status: this.status,
        codeName: this.codeName,
        pageNum: this.paginator.pageNo,
        pageSize: this.paginator.pageLength
      }
      this.$api.assets.getPage(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
            item.operationData = +item.status === 0 ? operationData1 : operationData2
            for (let key in item) {
              item[key] = item[key] || '--'
            }
          })
          this.dataSource = data
          this.paginator.totalCount = res.data.data.count
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    exportList () {
      let form = {
        organId: this.organId,
        status: this.status,
        codeName: this.codeName
      }
      this.$api.assets.exportList(form).then(res => {
        console.log(res)
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = '资产分类.xls'
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    }
  }
}
</script>

<style lang="less" scoped>
  .operation-btn {
    color: #0084FF;
    margin-right: 10px;
  }
</style>