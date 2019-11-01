<template>
  <div class="user_page">
    <Cephalosome>
      <div slot="col-l">
        <a-button type="primary">新增用户</a-button>
      </div>
      <div slot="col-r">
        <a-select placeholder="请用户角色" defaultValue="a1" :style="styleAll">
          <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
            {{(i + 9).toString(36) + i}}
          </a-select-option>
        </a-select>
        <a-select placeholder="请用户状态" defaultValue="a1" :style="styleAll">
          <a-select-option v-for="i in 25" :key="(i + 9).toString(36) + i">
            {{(i + 9).toString(36) + i}}
          </a-select-option>
        </a-select>
        <a-input-search v-model="queryCondition.search" placeholder="请输入用户名" :style="styleAll" @search="onSearch" />
      </div>
    </Cephalosome>
    <div>
      <a-table
        class="custom-table"
        :pagination="false"
        :columns="columns"
        :dataSource="dataSource"
        size="middle">
        <template slot="gender" slot-scope="">
          <!-- <div class="inspection-color" v-if="+record.status === 4 && medicalPower.cjcy_bjcyrw" @click="operationFun(record)">编辑</div> -->
          <div>--</div>
        </template>
      </a-table>
       <SG-FooterPagination
        :pageLength="queryCondition.pageLength"
        :totalCount="totalCount"
        location="absolute"
        v-model="queryCondition.pageNo"
        @change="changepage"
      />
    </div>
  </div>
</template>
<script>
import Cephalosome from '@/components/Cephalosome'
let getUuid = ((i = 1) => {return () => ++i})()
const styleAll = {width: '150px', marginRight: '10px'}
const columns = [{
  title: '用户名',
  dataIndex: 'username'
}, {
  title: '邮箱',
  dataIndex: 'email'
}, {
  title: '电话',
  dataIndex: 'phone'
}, {
  title: '状态',
  dataIndex: 'status'
}, {
  title: '角色',
  dataIndex: 'group_type'
}, {
  title: '操作',
  dataIndex: 'gender',
  align: 'center',
  scopedSlots: { customRender: 'gender' }
}]
const queryCondition = {
  search: '',            // 项目id
  pageNo: 1,
  pageLength: 10,
}
export default {
  components: {
    Cephalosome,
  },
  data () {
    return {
      styleAll,
      queryCondition: {...queryCondition},
      columns,
      totalCount: 0,
      dataSource: []
    }
  },
  created () {
    this.query()
  },
  methods: {
    query () {
      let data = {
        ...this.queryCondition
      }
      // this.$api.base.userList(data).then(res => {
      //   if (res.data.code === '0') {
      //     let resultList = res.data.data.resultList || []
      //     this.totalCount = res.data.data.count
      //     this.dataSource = resultList.map(item => ({
      //       ...item, key: getUuid()
      //     }))
      //   } else {
      //     this.$message.error(res.data.message)
      //   }
      // })
    },
    onSearch () {
      this.query()
    },
    changepage ({pageNo, pageLength}) {
      this.queryCondition.pageNo = pageNo
      this.queryCondition.pageLength = pageLength
      this.query()
    },
  }
}
</script>
