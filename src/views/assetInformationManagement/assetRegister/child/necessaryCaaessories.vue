<!--
 * @Author: LW
 * @Date: 2020-07-13 17:56:01
 * @LastEditTime: 2020-07-14 17:24:45
 * @Description: 附属配套
--> 
<template>
  <div class="necessaryCaaessories">
    <div class="button-box">
      <div class="buytton-l">
        <span>配套附属总数量：{{statistics.num || '--'}}</span> <span class="p120">总价值：{{statistics.valueAmount || '--'}}</span>
      </div>
      <div class="buytton-nav">
        <SG-Button type="primary" weaken @click="newlyFn">新增配套</SG-Button>
        <SG-Button class="ml20" type="primary" weaken @click="addTheAsset">批量导入</SG-Button>
      </div>
    </div>
    <div class="table-borders">
      <a-table
        class="table-boxs"
        :columns="columns"
        :loading="loading"
        :scroll="{y: 450, x: 2300}"
        :dataSource="tableData"
        :pagination="false"
        >
        <template slot="operation" slot-scope="text, record">
          <span @click="deleteFn(record)">编辑</span>
          <span @click="deleteFn(record)">删除</span>
        </template>
      </a-table>
      <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="count"
        location="absolute"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
    <completeSetNew @cancel="cancel" v-if="modalShow" ref="completeSetNew"></completeSetNew>
  </div>
</template>

<script>
import {auxiliary} from './../common/registerBasics'
import noDataTips from '@/components/noDataTips'
import completeSetNew from './../common/completeSetNew'
export default {
  components: {noDataTips, completeSetNew},
  props: {},
  data () {
    return {
      columns: auxiliary,
      tableData: [],
      count: '',            // 总页数
      loading: false,
      modalShow: false,
      noPageTools: false,
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
        registerOrderId: '',   // 资产登记单Id
        assetType: ''          // 资产类型
      },
      statistics: {}          // 统计
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    this.query()
  },
  methods: {
    // 删除
    deleteFn () {},
    // 新增
    newlyFn () {
      this.modalShow = true
      this.$nextTick(() => {
        this.$refs.completeSetNew.modalShow = true
      })
    },
    cancel () {
      console.log('0-0-0-')
      this.modalShow = false
    },
    // 导入
    addTheAsset () {},
    // 分页查询
    handleChange (data) {
      this.queryCondition.pageNum = data.pageNo
      this.queryCondition.pageSize = data.pageLength
      this.query()
    },
    // 查询
    query () {
      this.loading = true
      this.tableData = [
        {
          subsidiaryMatchingId: '1000',                //类型：String  必有字段  备注：附属配套ID
          assetId: '1000',                //类型：String  必有字段  备注：资产信息Id
          assetCode: '1000',                //类型：String  必有字段  备注：资产编码
          assetTypeName: '1000',                //类型：String  必有字段  备注：资产类型名称，fy
          assetName: '1000',                //类型：String  必有字段  备注：资产名称，fy
          matchingName: '1000',                //类型：String  必有字段  备注：附属配套名称
          matchingCode: '1000',                //类型：String  必有字段  备注：附属配套编码
          matchingType: '1000',                //类型：String  必有字段  备注：类型（附属配套）
          matchingTypeName: '1000',                //类型：String  必有字段  备注：类型名称（附属配套），fy
          specificationType: '1000',                //类型：String  必有字段  备注：规格型号
          status: '1000',                //类型：String  必有字段  备注：状态，用于状态操作
          statusName: '1000',                //类型：String  必有字段  备注：状态名称，fy
          value: '1000',                //类型：String  必有字段  备注：价值(元)
          number: '1000',                //类型：String  必有字段  备注：数量
          unitOfMeasurementName: '1000',                //类型：String  必有字段  备注：计量单位名称，fy
          isBeforeName: '1000',                //类型：String  必有字段  备注：是否接管前附属配套 1是 0否，fy
          remark: '1000'                //类型：String  必有字段  备注：备注
        }
      ]
      this.loading = false
      this.$api.assets.getListPageByRegisterOrderId(this.queryCondition).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index
          })
          this.tableData = data
          this.count = res.data.data.count
          this.loading = false
        } else {
          this.$message.error(res.data.message)
          this.loading = false
        }
      })
    },
  }
}
</script>
<style lang="less" scoped>
.necessaryCaaessories{
  .button-box {
    overflow: hidden;
    margin-bottom: 15px;
    line-height: 40px;
    display: flex;
    .button-l {
      flex: 1;
      text-align: left;
    }
    .buytton-nav {
      flex: 1;
      text-align: right;
    }
  }
}
</style>