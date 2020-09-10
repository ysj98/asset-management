<!--
 * @Date: 2020-04-22 15:10:16
 * @Description: 资产视图--运营信息
 -->
<template>
  <div>
    <a-row>
      <a-col :span="8">
        <span style="margin-right: 4px; color: #282D5B">转运营面积:</span>
        <span style="color: #49505E">{{
          transferOperationArea ? transferOperationArea + "㎡" : "无"
        }}</span>
      </a-col>
      <a-col :span="8">
        <span style="margin-right: 4px; color: #282D5B">转运营时间:</span>
        <span style="color: #49505E">{{ transferOperationTime || "无" }}</span>
      </a-col>
    </a-row>
    <a-table
      class="custom-table operation"
      :pagination="false"
      :columns="table.columns"
      :dataSource="table.dataSource"
    >
    </a-table>
    <SG-FooterPagination
      :pageLength="table.pageSize"
      :totalCount="table.totalCount"
      v-model="table.pageNum"
      @change="handleChange"
    />
    <SG-Title title="运营收入信息：">
      <!-- .format('YYYY-MM') -->
      <SG-MonthPicker
        label="所属月份"
        style="display:inline-block;"
        :defaultValueArray="[moment().subtract('month', 1), moment()]"
        v-model="pickerValue"
        @input="handlePickerChange"
      >
      </SG-MonthPicker>
      <SG-Button style="min-width: auto;" type="primary" @click="queryTable2"
        >查询</SG-Button
      >
    </SG-Title>
    <a-table
      class="custom-table operation"
      :pagination="false"
      :columns="table2.columns"
      :dataSource="table2.dataSource"
    >
    </a-table>
    <SG-FooterPagination
      :pageLength="table2.pageSize"
      :totalCount="table2.totalCount"
      v-model="table2.pageNum"
      @change="handleChange2"
    />
  </div>
</template>
<script>
import moment from "moment"
let getUuid = ((uuid = 1) => () => ++uuid)()
let columns = [
  {
    title: "资源名称",
    dataIndex: "resourceName",
  },
  {
    title: "合同编号",
    dataIndex: "contractCode",
  },
  {
    title: "客户名称",
    dataIndex: "customerName",
  },
  {
    title: "合同开始日期",
    dataIndex: "contractBeginDate",
  },
  {
    title: "合同截止日期",
    dataIndex: "contractEndDate",
  },
  {
    title: "起始租金单价",
    dataIndex: "originRentUnitPriceAmount",
  },
  {
    title: "押金",
    dataIndex: "deposit",
  },
  {
    title: "合同租金总额",
    dataIndex: "contractRentTotalAmount",
  },
  {
    title: "备注",
    dataIndex: "remark",
  },
]
let columns2 = [
  {
    title: "资源名称",
    dataIndex: "resInstName",
  },
  {
    title: "客户名称",
    dataIndex: "custName",
  },
  {
    title: "收入类型",
    dataIndex: "acctItemTypeName",
  },
  {
    title: "收入名称",
    dataIndex: "feeItemTypeName",
  },
  {
    title: "所属月份",
    dataIndex: "accountCycle",
  },
  {
    title: "金额(元)",
    dataIndex: "fee",
  },
  {
    title: "备注",
    dataIndex: "remark",
  },
]
export default {
  props: [
    "assetHouseId",
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
      table2: {
        columns: columns2,
        dataSource: [],
        totalCount: 0,
        pageSize: 10,
        pageNum: 1,
      },
    }
  },
  mounted() {
    this.queryTable()
    this.queryTable2()
  },
  methods: {
    queryTable() {
      let data = {
        pageNum: this.table.pageNum,
        pageSize: this.table.pageSize,
        assetHouseId: this.assetHouseId,
      }
      this.$api.assets.assetOperationContractInfo(data).then((res) => {
        if (+res.data.code === 0) {
          let result = res.data.data.data || []
          this.table.dataSource = result.map((item) => {
            return {
              key: getUuid(),
              ...item,
            }
          })
          this.table.totalCount = res.data.data.count
        } else {
          this.$message.error(res.data.message || res.data.msg)
        }
      })
    },
    queryTable2() {
      if (!this.validateTable2()) {
        return
      }
      let data = {
        pageNo: this.table2.pageNum,
        pageLimit: this.table2.pageSize,
        assetHouseId: this.assetHouseId,
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
