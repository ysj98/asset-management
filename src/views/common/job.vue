<template>
  <a-modal
    title="选择查验负责人"
    v-model="show"
    :width="902"
    @cancel="handleCancel"
    @ok="handleOk"
  >
  <div class="organTree">
    <div class="tree-ct scrollbar">
      <OrganTree @listenTreeid="listenTreeId"></OrganTree>
    </div>
    <div class="organTab">
      <Cephalosome style="margin: 0" :rightCol="22" :leftCol="2">
        <div slot="col-r">
          <a-select :allowClear="true" :defaultValue="queryCondition.principal || undefined" style="width: 150px" @change="inspectionTaskFn" placeholder="请选择岗位">
            <a-select-option v-for="(item, index) in principalData" :key="index" :value="item.postId">{{item.postName}}</a-select-option>
          </a-select>
          <a-input style="width: 200px; margin: 0 10px;"  v-model="queryCondition.name" placeholder="请输入员工姓名/手机号/工号"/>
          <a-button type="primary" style="width: 90px" @click="query('1')">查询</a-button>
        </div>
      </Cephalosome>
      <div class="table-layout-fixed table-border">
        <a-table
          :scroll="{y: 300 }"
          :rowSelection="{type: 'radio', columnTitle: '', onSelect: onRadioChange}"
          :pagination="false"
          :columns="columns"
          :loading="loading"
          :dataSource="data"
          class="custom-table td-pd10">
        </a-table>
      </div>
      <footer-pagination
        :totalCount="count" 
        :pageNo="queryCondition.pageNo"
        @changepage="changepage"
        @query="query"
      />
    </div>
    </div>
    <div slot="footer" style="text-align: center;">
      <a-button key="submit" type="primary" @click="handleOk">
        确认
      </a-button>
      <a-button key="back" @click="handleCancel">
        取消
      </a-button>
    </div>
  </a-modal>
</template>

<script>
import {Modal, Button, Select, Input, Table} from 'ant-design-vue'
import OrganTree from '@/components/common/OrganTree'
// import segiDrawer from '@/components/SegiDrawer.vue'
import Cephalosome from '@/components/common/Cephalosome'
import FooterPagination from '@/components/common/FooterPagination.vue'
// import * as api from '@/api/basics'
import * as api from '@/api/basics'
const columns = [{
  title: '姓名',
  dataIndex: 'userName',
  width: 100
}, {
  title: '手机号',
  dataIndex: 'tel',
  width: 100
}, {
  title: '工号',
  dataIndex: 'jobNumber',
  width: 100
}, {
  title: '岗位名称',
  dataIndex: 'postName',
  width: 100
}, {
  title: '所属组织',
  dataIndex: 'organName',
  width: 100
}, {
  title: '上级组织',
  dataIndex: 'parOrganName'
}]

const queryCondition = {
  organId: '',    // 项目id
  principal: '',      // 岗位名称
  name: '',           // 人名工号
  pageLength: 10,
  pageNo: 1
}
export default {
  components: {
    AModal: Modal,
    // ATabs: Tabs,
    // ATabPane: Tabs.TabPane,
    OrganTree,
    AButton: Button,
    // segiDrawer,
    Cephalosome,
    AInput: Input,
    ASelect: Select,
    ASelectOption: Select.Option,
    ATable: Table,
    // ARadio: Radio,
    FooterPagination
  },
  props: {
    viShow: {
      type: Boolean,
      default: false
    },
    communityId: {
      type: [String, Number],
      default: ''
    }
  },
  data () {
    return {
      count: '',
      sunData: [{
        value: '',
        label: ''
      }],
      loading: false,
      dataGroup: [],
      dataGroupShow: true,
      queryCondition: {...queryCondition},
      selectedRowKeys: '',
      columns,
      radioValue: '',
      data: [],
      show: false,
      principalData: [],
      defaultActiveKey: 1
    }
  },
  watch: {
    viShow (val) {
      this.show = val
      if (this.dataGroup.length === 0) {
        this.callback('1')
      }
    }
  },
  computed: {
  },
  methods: {
    // 表格选择
    onRadioChange (selectedRowKeys) {
      this.sunData[0].value = selectedRowKeys.userId
      this.sunData[0].label = selectedRowKeys.userName
    },
    // 分页
    changepage (pageNo, pageLength) {
      this.queryCondition.pageNo = pageNo
      this.queryCondition.pageLength = pageLength
    },
    // 提交
    handleOk () {
      if (this.sunData[0].value === '') {
        this.$message.info('请选择负责人')
      } else {
        this.$emit('close', this.sunData)
      }
    },
    // 项目id
    listenTreeId (id) {
      this.queryCondition.organId = id
      this.queryCondition.pageNo = 1
      this.queryUserPageByFn()
      this.postList()
    },
    // 取消
    handleCancel () {
      this.$emit('close')
    },
    // 岗位名称
    inspectionTaskFn (val) {
      this.queryCondition.principal = val
      this.queryUserPageByFn()
    },
    // 获取岗位列表
    postList () {
      api.queryPostInfoListByOrganIdAndOpts({organId: this.queryCondition.organId}).then(res => {
        if (res.data.code === '0') {
          this.principalData = res.data.data.resultList
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取岗位人员列表
    queryUserPageByFn () {
      let data = {
        organId: this.queryCondition.organId,
        filter: this.queryCondition.name,
        postId: this.queryCondition.principal,
        pageNo: this.queryCondition.pageNo,
        pageLength: this.queryCondition.pageLength
      }
      this.loading = true
      api.queryUserPageByOrganIdAndOptsV2(data).then(res => {
        if (res.data.code === '0') {
          let arr = res.data.data.data
          arr.forEach((item, index) => {
            item.key = index
          })
          this.data = arr
          this.count = res.data.data.count
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
    // 查询
    query (str) {
      if (str === '1') {
        this.queryCondition.pageNo = 1
      }
      this.queryUserPageByFn()
    }
  },
  created () {
  },
  mounted () {
    this.show = this.viShow
  }
}
</script>
<style lang="less" scoped>
.organTree {
  display: flex;
  .tree-ct, .table-ct{
    border: 1px solid #ccc;
    overflow: auto;
    height: 400px;
    float: left;
  }
  .tree-ct{
    width: 250px;
    margin-right: 10px;
  }
  .organTab {
    position: relative;
    width: 100%;
  }
}
</style>
