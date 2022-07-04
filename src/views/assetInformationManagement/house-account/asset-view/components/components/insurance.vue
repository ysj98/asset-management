
<template>
  <div>
    <a-table
      class="custom-table operation"
      :pagination="false"
      :columns="table.columns"
      :dataSource="table.dataSource"
    >
    <span slot="insuranceCode" style="color: #0084FF; cursor: pointer" slot-scope="text, record" @click="goDetail(record.insuranceId)">{{ record.insuranceCode }}</span>
    </a-table>
    <SG-FooterPagination
      :pageLength="table.pageSize"
      :totalCount="table.totalCount"
      v-model="table.pageNum"
      @change="handleChange"
    />
  </div>
</template>
<script>
import moment from "moment"
let getUuid = ((uuid = 1) => () => ++uuid)()
const columns = [
  { title: '保险单号', dataIndex: 'insuranceCode', scopedSlots: { customRender: 'insuranceCode' }},
  { title: '所属机构', dataIndex: 'organName' },
  { title: '资产项目', dataIndex: 'projectName' },
  { title: '投保人', dataIndex: 'policyHolder' },
  { title: '保险类型', dataIndex: 'insuranceTypeName' },
  { title: '保险公司', dataIndex: 'insuranceCompanyName' },
  { title: '保险有效期', dataIndex: 'periodOfInsurance'},
  { title: '保单金额（元）', dataIndex: 'policyAmount', scopedSlots: { customRender: 'policyAmount' } },
  { title: '资产数量', dataIndex: 'assetNum', scopedSlots: { customRender: 'assetNum' } },
  { title: '保单状态', dataIndex: 'insuranceStatusName' },
  { title: '提交时间', dataIndex: 'createDate' },
]


export default {
  props: [
    "assetId",
    "transferOperationArea",
    "transferOperationTime",
  ],
  data() {
    return {
      moment,
      pickerValue: [moment().subtract("month", 1), moment()],
      table: {
        columns,
        dataSource: [],
        totalCount: 0,
        pageSize: 10,
        pageNum: 1,
      },
    }
  },
  mounted() {
    this.queryTable()
    //this.queryTable2()
  },
  methods: {
    goDetail (insuranceId) {
      this.$router.push({path: '/assetView/assetViewDetail/insurancePolicyDetail', query: {insuranceId}})
    },
    queryTable() {
      let data = {
        organId: '1000279',//organId,
        insuranceCompanyIdList: [],
        insuranceCodeAndPolicyHolder: '',
        insuranceStatusList: '',
        insuranceTypeList: [],
        status: '1',
        pageNum: this.table.pageNum,
        pageSize: this.table.pageSize,
      }
      this.$api.assetInsurance.queryAssetInsuranceList(data).then(res => {
        console.log(this.table)
        if(res.data.code === '0') {
          this.table.dataSource = res.data.data.data
          this.table.totalCount = res.data.data.count
          console.log(table)
        }else{
          this.$message.error(res.data.message || '查询列表数据失败')
        }
        if(!load) {
          this.getCount(data)
        }
      }).catch(err => {
        console.log(err)
      })
    },
    queryTable2() {
      if (!this.validateTable2()) {
        return
      }
      let data = {
        pageNo: this.table2.pageNum,
        pageLimit: this.table2.pageSize,
        assetId: this.assetId,
        startMonth: this.pickerValue[0].format("YYYYMM"),
        endMonth: this.pickerValue[1].format("YYYYMM"),
      }
      // data = {"pageNo":1,"pageLimit":10,"startMonth":"202005","endMonth":"202005","organId":1000279,"billObjType":14,"resInstId":"116071150"}

      this.$api.assets
        .assetOperationExpenseParam(data)
        .then((res) => {
          if (+res.data.code === 0) {
            let { organId, billObjType, resInstId } = res.data.data
            return { ...data, organId, billObjType, resInstId }
          } else {
            this.$message.error(res.data.message || res.data.msg)
            return false
          }
        })
        .then((data) => {
          if (data) {
            delete data.assetHouseId
            this.$api.assets.getAcctItemPageList(data).then((res) => {
              if (+res.data.code === 0) {
                let result = res.data.data.resultList || []
                this.table2.dataSource = result.map((item) => {
                  item.fee = item.fee ? Number(item.fee) / 100 : '/'
                  item.accountCycle = item.accountCycle ? String(item.accountCycle) : ''
                  item.accountCycle = item.accountCycle ? (item.accountCycle.slice(0,4) + '-' + item.accountCycle.slice(4)) : '/'
                  return {
                    key: getUuid(),
                    ...item,
                  }
                })
                this.table2.totalCount = res.data.data.paginator.totalCount
              }
            })
          }
        })
    },
    validateTable2() {
      // 时间必有

      if (!this.pickerValue || !this.pickerValue[0]) {
        this.$message.error("请选择运营收入信息时间!")
        return false
      }
      let startTime = new Date(this.pickerValue[0]).getTime()
      let endTime = new Date(this.pickerValue[1]).getTime()
      let minStartTime = new Date(
        moment(endTime).subtract("month", 6)
      ).getTime()
      console.log(
        "时间=>",
        minStartTime,
        startTime,
        endTime,
        minStartTime > startTime
      )
      if (startTime > endTime) {
        this.$message.error("请选择运营收入开始时间小于结束时间!")
        return false
      }
      if (Math.floor(minStartTime / 1000) > Math.floor(startTime / 1000)) {
        this.$message.error("请选择运营收入信息时间跨度不超过6个月!")
        return false
      }
      // 跨度不超过6个月
      return true
    },
    handlePickerChange(value) {
      // console.log(
      //   value[0].format("YYYY-MM") + " ~ " + value[1].format("YYYY-MM")
      // )
    },
    handleChange(data) {
      this.table.pageNum = data.pageNo
      this.table.pageSize = data.pageLength
      this.queryTable()
    },
    handleChange2(data) {
      this.table2.pageNum = data.pageNo
      this.table2.pageSize = data.pageLength
      this.queryTable2()
    },
  },
}
</script>