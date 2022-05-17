<template>
  <div>
    <!-- 搜索区域-->
    <search-container type="" :value="false">
      <div slot="headerBtns">
        <SG-Button icon="import" type="primary">导出</SG-Button>
      </div>
      <div slot="headerForm">
        <div class="headerForm">
          <tree-select
            :allowClear="false"
            @changeTree="changeTree"
            class="search-item"
          />
          <a-select
            v-model="queryForm.projectIdList"
            :options="projectData"
            :maxTagCount="1"
            :allowClear="true"
            mode="multiple"
            class="search-item"
            placeholder="全部资产项目"
          ></a-select>
          <a-button @click="doSearch" type="primary">查询</a-button>
        </div>
      </div>
    </search-container>
    <div>
      <overview-number :numList="numList" />
    </div>
    <!-- 表格 -->
    <div>
      <a-table v-bind="tableOptions"></a-table>
    </div>
    <!-- 分页控件-->
    <SG-FooterPagination v-bind="paginationObj" @change="changePage" />
  </div>
</template>

<script>
import SearchContainer from "@/views/common/SearchContainer";
import TreeSelect from "@/views/common/treeSelect";
import OverviewNumber from "@/views/common/OverviewNumber";
const detailColumns = [
  {
    title: "资产项目名称",
  },
  {
    title: "资产项目编码",
  },
  {
    title: "接管机构",
  },
  {
    title: "来源方式",
  },
  {
    title: "来源渠道",
  },
  {
    title: "接管时间",
  },
  {
    title: "资产数量",
  },
  {
    title: "运营",
  },
  {
    title: "自用",
  },
  {
    title: "闲置",
  },
  {
    title: "其他",
  },
  {
    title: "资产原值(元)",
  },
  {
    title: "最新估值(元)",
  },
  {
    title: "操作",
  },
];
export default {
  name: "index",
  components: {
    SearchContainer,
    TreeSelect,
    OverviewNumber,
  },
  data() {
    return {
      projectData: [],
      tableOptions: {
        rowKey: "",
        scroll: { x: "100%" },
        pagination: false,
        columns: detailColumns,
        dataSource: [],
      },
      paginationObj: {
        pageSize: 10,
        pageNum: 1,
        totalCount: 0,
        location: "fixed",
      },
      queryForm: {
        organId: "",
        projectIdList: [],
      },
      numList: [
        { title: "资产数量", key: "totalArea", value: 0, fontColor: "#324057" },
        {
          title: "运营(㎡)",
          key: "totalOperationArea",
          value: 0,
          bgColor: "#4BD288",
        },
        {
          title: "闲置(㎡)",
          key: "totalIdleArea",
          value: 0,
          bgColor: "#1890FF",
        },
        {
          title: "自用(㎡)",
          key: "totalSelfUserArea",
          value: 0,
          bgColor: "#DD81E6",
        },
        {
          title: "其他(㎡)",
          key: "totalOtherArea",
          value: 0,
          bgColor: "#BBC8D6",
        },
        {
          title: "资产原值(元)",
          key: "totalOccupationArea",
          value: 0,
          bgColor: "#FD7474",
        },
        {
          title: "最新价值(元)",
          key: "totalOccupationArea",
          value: 0,
          bgColor: "#808080",
        },
      ],
    };
  },
  methods: {
    changePage({ pageNo, pageLength }) {
      this.paginationObj.pageNum = pageNo;
      this.paginationObj.pageSize = pageLength;
      this.queryTableDataAndTotal();
    },
    doSearch() {
      this.paginationObj.pageNum = 1;
      this.queryTableDataAndTotal();
    },
    // 获取资产项目并清空 双向绑定数据
    getObjectKeyValueByOrganIdFn({ organId }) {
      let req = {
        organId,
      };
      this.$api.assets.getObjectKeyValueByOrganId(req).then((res) => {
        if (Number(res.data.code) === 0) {
          this.queryForm.projectIdList = [];
          let data = res.data.data;
          this.projectData = (data || []).map((item) => {
            return {
              name: item.projectName,
              value: item.projectId,
              title: item.projectName,
              label: item.projectName,
            };
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    queryTableDataAndTotal() {
      const options = {
        ...this.queryForm,
      };
      this.queryTableData(options);
      this.queryTotal(options);
    },
    // 获取 tableData
    queryTableData(options) {
      const { pageSize, pageNum } = this.paginationObj;
      const req = { ...options, pageNum, pageSize };
      console.log({ req });
      // this.$api.equipmentview
      //   .getPage(req)
      //   .then(({ data: { code, message, data } }) => {
      //     if (code === "0") {
      //       console.log({ data });
      //     } else {
      //       this.$message.error(message);
      //     }
      //   });
    },
    queryTotal(options) {
      const req = { ...options };
      console.log({ req });
      // this.$api.equipmentview
      //   .getTotal(req)
      //   .then(({ data: { code, message, data } }) => {
      //     if (code === "0") {
      //       console.log({ data });
      //     } else {
      //       this.$message.error(message);
      //     }
      //   });
    },
    changeTree(organId) {
      this.queryForm.organId = organId;
      this.getObjectKeyValueByOrganIdFn({ organId });
      this.queryTableDataAndTotal();
    },
  },
};
</script>

<style scoped>
.search-item {
  width: 200px;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
