<template>
  <SG-Modal
    v-model="show"
    :width="960"
    wrapClassName="assetRentForm"
    :noPadding="true"
    :maskClosable="false"
    :footer="null"
  >
    <template #title>
      <div style="font-size: 16px">选择资产</div>
    </template>
    <div class="content">
      <!-- 输入框 -->
      <div class="search_box">
        <a-select
          style="width: 140px; margin-left: 600px"
          v-model="objectType"
          @change="objectTypeChange"
          :options="$addTitle(objectTypeOptions)"
          placeholder="全部资产分类"
        />
        <a-input-search
          placeholder="资产名称/编码"
          v-model="assetNameCode"
          style="width: 175px; margin-left: 15px"
          @pressEnter="onPressEnter()"
          @search="onSearch"
        />
      </div>
      <!-- 表格 -->
      <a-table
        :loading="loading"
        :columns="columns"
        :data-source="tableData"
        :pagination="false"
        :bordered="true"
        :scroll="{ x: 1300 }"
        size="middle"
      >
        <template slot="operation" slot-scope="text, record">
          <a @click="chose(record)">选择</a>
        </template>
        <template slot="leaseArea" slot-scope="text">
          <tooltip-text width="120" :text="text" />
        </template>
      </a-table>
      <SG-FooterPagination
        :pageLength="pagination.pageLength"
        :totalCount="count"
        location="absolute"
        :noPageTools="true"
        v-model="pagination.pageNo"
        @change="pageChange"
      />
    </div>
  </SG-Modal>
</template>

<script>
const columns = [
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 70,
    fixed: "left",
    align: "center",
  },
  {
    title: "资产编码",
    align: "center",
    dataIndex: "assetCode",
    fixed: "left",
    width: 120,
  },
  { title: "资产名称", align: "center", dataIndex: "assetName" },
  { title: "所属机构", align: "center", dataIndex: "organName" },
  { title: "资产项目", align: "center", dataIndex: "projectName" },
  { title: "资产类型", align: "center", dataIndex: "assetTypeName" },
  { title: "资产分类", align: "center", dataIndex: "assetCategoryName" },
  { title: "规格型号", align: "center", dataIndex: "model" },
  { title: "所在位置", align: "center", dataIndex: "address" },
  { title: "资产状态", align: "center", dataIndex: "assetStatusName" },
];
import moment from "moment";
import TooltipText from "../../common/TooltipText";
export default {
  data() {
    return {
      columns,
      show: false,
      loading: false,
      objectType: undefined, // 资产类别
      objectTypeOptions: [], // 类别选项
      contractStatus: [""], // 当前合同状态
      assetNameCode: "", // 资产名称/编码
      tableData: [],
      count: 0, // 总条数
      pagination: {
        pageNo: 1,
        pageLength: 10,
      },
    };
  },
  props: ["organId", "assetType", "proId", "assetType"],
  components: { TooltipText },
  watch: {
    show(newVal) {
      if (newVal === true) {
        this.query();
      } else {
        this.$emit("input", newVal);
      }
    },
    assetType(val) {
      if (val) {
        this.queryObjectType(String(val));
      }
    },
  },
  methods: {
    query() {
      this.loading = true;
      let form = {
        organId: this.organId,
        projectId: this.proId,
        assetType: this.assetType,
        queryType: 2,
        pageSize: this.pagination.pageLength,
        pageNum: this.pagination.pageNo,
        objectType: Number(this.objectType),
        assetNameCode: this.assetNameCode,
      };
      return this.$api.assets.assetListPage(form).then((r) => {
        let res = r.data;
        res.data.data.forEach((item, index) => {
          item.key = item.assetId;
          item.model = "/";
        });
        if (res && res.code.toString() === "0") {
          this.loading = false;
          const { count, data } = res.data;
          this.tableData = data;
          this.count = count;
        } else {
          this.$message.error(r.data.message);
        }
      });
    },
    // 搜索回车
    onPressEnter() {
      this.pagination.pageNo = 1;
      this.query();
    },
    // 搜索框按钮搜索
    onSearch() {
      this.onPressEnter();
    },
    // 选择按钮
    chose(record) {
      this.$emit("getAsset", record);
      this.show = false;
    },
    // 页码改变
    pageChange(page) {
      this.pagination.pageNo = page.pageNo;
      this.query();
    },
    // 根据资产类型查资产分类列表
    queryObjectType(assetType) {
      this.objectType = undefined;
      this.objectTypeOptions = [];
      if (!assetType) {
        return false;
      }
      const { organId } = this;
      this.$api.assets
        .getList({ assetType, organId })
        .then((res) => {
          if (Number(res.data.code) === 0) {
            let { data } = res.data;
            let list = data.map((m) => ({
              title: m.professionName,
              key: m.professionCode,
            }));
            list.unshift({ title: "全部资产分类", key: "-1" });
            this.objectTypeOptions = list;
            return false;
          } else {
            this.$message.error(res.data.message);
          }
          throw res.message || "查询资产类别失败";
        })
        .catch((err) => {
          this.$message.error(err || "查询资产类别失败");
        });
    },
    objectTypeChange(val) {
      this.objectType = val;
      this.query();
    },
  },
};
</script>

<style lang="less" scoped>
.assetRentForm {
  .content {
    padding: 0 15px;
    padding-bottom: 55px;
    .search_box {
      display: flex;
      height: 60px;
      align-items: center;
    }
  }
}
</style>
