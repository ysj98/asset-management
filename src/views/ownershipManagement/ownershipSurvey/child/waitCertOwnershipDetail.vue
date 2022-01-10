<!--
 * @Date: 2019-11-28 14:41:27
 * @Author: chen han
 * @Description: 权属概况->资产项目->待办详情
 -->
 <template>
  <!-- 表格部分 -->
  <div class="table-layout-fixed detail-table">
    <a-table
      class="custom-table td-pd10"
      :loading="table.loading"
      :pagination="false"
      :columns="table.columns"
      :dataSource="table.dataSource"
      :locale="{ emptyText: '暂无数据' }"
      :scroll="{y:500}"
    >
    </a-table>
    <no-data-tips
      class="noTipStyle"
      v-show="table.dataSource.length === 0"
    ></no-data-tips>
    <SG-FooterPagination
      v-if="$route.query.type==='detail'"
      :pageLength="queryCondition.pageSize"
      :totalCount="totalCount"
      location="absolute"
      v-model="queryCondition.pageNum"
      @change="handleChange"
      :noPageTools="true"
    />
  </div>
</template>
 <script>
import noDataTips from "@/components/noDataTips";
let getUuid = ((uuid = 1) => () => ++uuid)();
let queryCondition = {
  pageSize: 10,
  pageNum: 1,
  ownershipStatus: 2,
};
// 表格数据
let columns = [
  {
    title: "资产名称",
    dataIndex: "assetName",
    width: "20%",
  },
  {
    title: "资产编码",
    dataIndex: "assetCode",
    width: "15%",
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    width: "10%",
  },
  {
    title: "资产分类",
    dataIndex: "objectTypeName",
    width: "10%",
  },
  {
    title: "资产项目名称",
    dataIndex: "projectName",
    width: "15%",
  },
  {
    title: "所在位置",
    dataIndex: "location",
    width: "20%",
  },
  // {
  //   title: "面积(㎡)",
  //   dataIndex: "area",
  //   width: "10%",
  // },
  {
    title: "权属类型",
    dataIndex: "kindOfRightName",
    width: "10%",
  },
  {
    title: "权证号",
    dataIndex: "warrantNbr",
    width: "10%",
  },
  {
    title: "权利人",
    dataIndex: "obligeeName",
    width: "10%",
  },
  {
    title: "权属处理方式",
    dataIndex: "settingMethodName",
    width: "124px",
  },
  {
    title: "权属备注",
    dataIndex: "remark",
    width: "124px",
  },
];
export default {
  components: {
    noDataTips,
  },
  props: {
    projectId: {
      default: "",
    },
    scrollHeight: {
      default: () => ({ y: "auto" }),
    },
    totalCount:{
      default: 0
    }
    // assetTypes: {
    //   type: Array,
    //   default: () => []
    // }
  },
  data() {
    return {
      assetTypes: [],
      queryCondition: { ...queryCondition },
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0,
      },
    };
  },
  mounted() {
    this.assetTypes = this.$route.query.assetTypes
    if (this.$route.query.type === 'set'){
      this.queryCondition.pageSize = 9999
    }
    this.query();
  },
  methods: {
    query() {
      let data = {
        ...this.queryCondition,
        projectId: this.projectId,
        assetTypes: this.assetTypes,
      };
      this.table.loading = true;
      this.$api.basics.attrList(data).then(
        (res) => {
          this.table.loading = false;
          if (res.data.code === "0") {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map((item) => {
              item.settingMethod = item.settingMethod || "3"; // 默认无
              item.area = item.area || "--";
              item.assetTypeName = item.assetTypeName || "--";
              item.assetCode = item.assetCode || "--";
              item.location = item.location || "--";
              item.warrantNbr = item.warrantNbr || "--";
              item.obligeeName = item.obligeeName || "--";
              item.remark = item.remark || "--";
              item.settingMethodName = item.settingMethodName || "--";
              return {
                key: getUuid(),
                ...item,
              };
            });
            this.table.totalCount = res.data.data.count || 0;
          } else {
            this.$message.error(res.data.message);
          }
        },
        () => {
          this.table.loading = true;
        }
      );
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.query();
    },
  },
};
</script>
 <style lang="less" scoped>
.detail-table {
  position: relative;
  border: 1px solid rgba(238, 242, 245, 1);
  border-top: none;
  min-height: 140px;
  padding-bottom: 80px;
}
.noTipStyle {
  padding: 20px 0;
}
</style>
