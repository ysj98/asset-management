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
    title: "出租方",
    dataIndex: "出租方字段待定",
  },
  {
    title: "备注",
    dataIndex: "remark",
  },
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
      }
    }
  },
  mounted() {
    this.queryTable()
  },
  methods: {
    queryTable() {
      let data = {
        pageNum: this.table.pageNum,
        pageSize: this.table.pageSize,
        assetId: this.assetId,
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
    handleChange(data) {
      this.table.pageNum = data.pageNo
      this.table.pageSize = data.pageLength
      this.queryTable()
    }
  },
}
</script>
