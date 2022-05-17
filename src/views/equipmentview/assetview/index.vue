<template>
  <div>
    <!-- 搜索条件 -->
    <search-container size="fold" v-model="fold">
      <div slot="headerBtns">
        <SG-Button icon="import" type="primary">导出</SG-Button>
        <SG-Button icon="setting" style="margin: 0 10px">列表设置</SG-Button>
        <SG-Button type="default">资产标签</SG-Button>
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
          <a-select
            v-model="queryForm.statusList"
            :options="statusListOpt"
            :allowClear="true"
            :maxTagCount="1"
            mode="multiple"
            class="search-item"
            placeholder="全部资产状态"
          ></a-select>
          <a-input
            v-model="queryForm.assetName"
            class="search-item"
            placeholder="资产名称/编码"
          ></a-input>
        </div>
      </div>
      <div slot="contentForm">
        <div class="contentForm">
          <EquipmentSelectTree
            v-model="queryForm.equipmentTypes"
            :multiple="true"
            :top-organ-id="queryForm.organIds"
            :maxTagCount="1"
            :allowClear="true"
            class="search-item"
            placeholder="全部资产分类"
          />
          <a-select
            v-model="queryForm.useTypes"
            :options="amsUseDirectionCom"
            :maxTagCount="1"
            :allowClear="true"
            mode="multiple"
            class="search-item"
            placeholder="全部使用方向"
          ></a-select>
          <province-city-district
            class="search-item-address"
            v-model="provinceCityDistrictValue"
            @input="handleAddress"
          />
          <!-- todo: 后台暂未定义枚举 -->
          <a-select class="search-item" placeholder="全部资产标签"></a-select>
          <a-button @click="doSearch" type="primary">查询</a-button>
        </div>
      </div>
    </search-container>
    <!-- 数据汇总 -->
    <div>
      <a-spin :spinning="totalLoadingFlag">
        <overview-number :numList="numList" />
      </a-spin>
    </div>
    <!-- table表格 -->
    <div>
      <!-- class="custom-table" -->
      <a-table
        v-bind="tableOptions"
        :rowSelection="{ selectedRowKeys, onChange: handleSelectChange }"
      >
        <!-- 操作-->
        <template #action="text, { assetEquipmentId }">
          <a @click="goDetail({ assetEquipmentId })">详情</a>
        </template>
      </a-table>
    </div>
    <!-- 间隔 -->
    <div style="height: 100px"></div>
    <!-- 分页 -->
    <SG-FooterPagination v-bind="paginationObj" @change="changePage" />
  </div>
</template>

<script>
import provinceCityDistrict from "@/views/common/ProvinceCityDistrict";
import SearchContainer from "@/views/common/SearchContainer";
import OverviewNumber from "@/views/common/OverviewNumber";
import TreeSelect from "@/views/common/treeSelect";
import EquipmentSelectTree from "@/views/common/EquipmentSelectTree";
import { SET_AMS_USE_DIRECTION } from "store/types/platformDictTypes";
export default {
  name: "index",
  components: {
    SearchContainer,
    provinceCityDistrict,
    OverviewNumber,
    TreeSelect,
    EquipmentSelectTree,
  },
  data() {
    return {
      totalLoadingFlag: false,
      statusListOpt: [
        { title: "未生效", key: "0" },
        { title: "正常", key: "1" },
        { title: "报废", key: "2" },
        { title: "转让", key: "3" },
        { title: "报损", key: "4" },
        { title: "已清理", key: "5" },
        { title: "已取消", key: "6" },
        { title: "入库中", key: "7" },
      ],
      projectData: [],
      paginationObj: {
        pageLength: 10,
        pageNo: 1,
        totalCount: 0,
        location: "fixed",
      },
      provinceCityDistrictValue: {},
      fold: true,
      queryForm: {
        organIds: "",
        assetName: "",
        province: "",
        city: "",
        region: "",
        label: "",
        projectIdList: [],
        useTypes: [],
        statusList: [],
        equipmentTypes: [],
      },
      numList: [
        { title: "资产数量", key: "total", value: 0, fontColor: "#324057" },
        {
          title: "运营",
          key: "operate",
          value: 0,
          bgColor: "#4BD288",
        },
        {
          title: "闲置",
          key: "idle",
          value: 0,
          bgColor: "#1890FF",
        },
        {
          title: "自用",
          key: "self",
          value: 0,
          bgColor: "#DD81E6",
        },
        {
          title: "其他",
          key: "other",
          value: 0,
          bgColor: "#BBC8D6",
        },
        {
          title: "资产原值(元)",
          key: "originalValue",
          value: 0,
          bgColor: "#FD7474",
        },
        {
          title: "最新价值(元)",
          key: "marketValue",
          value: 0,
          bgColor: "#808080",
        },
      ],
      selectedRowKeys: [],
      tableOptions: {
        loading: false,
        columns: [
          {
            title: "资产名称",
            dataIndex: "assetName",
            width: 200,
            fixed: "left",
          },
          {
            title: "资产编码",
            dataIndex: "assetCode",
            width: 200,
          },
          {
            title: "资产分类",
            dataIndex: "equipmentTypeName",
            width: 120,
          },
          {
            title: "管理机构",
            dataIndex: "organName",
            width: 200,
          },
          {
            title: "资产项目名称",
            dataIndex: "projectName",
            width: 200,
          },
          {
            title: "规格型号",
            dataIndex: "equipmentModel",
            width: 120,
          },
          {
            title: "所在位置",
            dataIndex: "address",
            width: 300,
          },
          {
            title: "使用方向",
            dataIndex: "useType",
            width: 120,
          },
          {
            title: "设备厂家",
            dataIndex: "factory",
            width: 120,
          },
          {
            title: "出厂日期",
            dataIndex: "dateOfProduction",
            width: 200,
          },
          {
            title: "报废日期",
            dataIndex: "scrapDate",
            width: 200,
          },
          {
            title: "接管日期",
            dataIndex: "startDate",
            width: 200,
          },
          {
            title: "财务卡片编码",
            dataIndex: "financialCode",
            width: 200,
          },
          {
            title: "资产原值(元)",
            dataIndex: "originalValue",
            width: 120,
          },
          {
            title: "最新估值(元)",
            dataIndex: "assetValuation",
            width: 120,
          },
          {
            title: "资产状态",
            dataIndex: "statusName",
            width: 120,
          },
          {
            title: "资产标签",
            dataIndex: "label",
            width: 120,
          },
          {
            title: "操作",
            key: "action",
            width: 120,
            fixed: "right",
            scopedSlots: { customRender: "action" },
          },
        ],
        dataSource: [],
        pagination: false,
        rowKey: "assetEquipmentId",
        // y: "max-content"
        scroll: { x: "max-content", y: 600 },
      },
    };
  },
  computed: {
    amsUseDirectionCom() {
      return this.$store.state.platformDict.AMS_USE_DIRECTION.map((ele) => {
        return {
          title: ele.name,
          value: ele.value,
          label: ele.name,
        };
      });
    },
  },
  methods: {
    goDetail({ assetEquipmentId }) {
      const queryParams = {
        assetEquipmentId,
      };
      this.$router.push({
        path: "/equipmentview/detail",
        query: queryParams,
      });
    },
    handleAddress({ province, city, district }) {
      this.queryForm.province = province || "";
      this.queryForm.city = city || "";
      this.queryForm.region = district || "";
    },
    doSearch() {
      this.paginationObj.pageNo = 1;
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
    changeTree(organId) {
      this.queryForm.organIds = organId;
      this.getObjectKeyValueByOrganIdFn({ organId });
      this.queryTableDataAndTotal();
    },
    // 获取 tableData
    queryTableData(options) {
      this.tableOptions.loading = true;
      this.$api.equipmentview.getPage(options).then(
        ({
          data: {
            code,
            message,
            data: { data, count },
          },
        }) => {
          if (code === "0") {
            console.log({ data });
            this.paginationObj.totalCount = count;
            this.tableOptions.dataSource = data || [];
            this.tableOptions.loading = false;
          } else {
            this.$message.error(message);
          }
        }
      );
    },
    queryTotal(options) {
      this.totalLoadingFlag = true;
      this.$api.equipmentview
        .getTotal(options)
        .then(({ data: { code, message, data } }) => {
          if (code === "0") {
            console.log({ data });
            this.numList.forEach((ele) => {
              ele.value = Number(data[ele.key] || 0).toLocaleString();
            });
            this.totalLoadingFlag = false;
          } else {
            this.$message.error(message);
          }
        });
    },
    queryTableDataAndTotal(notRequiredTotalFlag) {
      const { pageNo, pageLength } = this.paginationObj;
      const options = {
        ...this.queryForm,
        pageNum: pageNo,
        pageSize: pageLength,
      };
      this.queryTableData(options);
      if (!notRequiredTotalFlag) {
        this.queryTotal(options);
      }
    },
    // 分页时间
    changePage({ pageNo, pageLength }) {
      this.paginationObj.pageNo = pageNo;
      this.paginationObj.pageLength = pageLength;
      this.queryTableDataAndTotal(true);
    },
    // 处理选中表格数据
    handleSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
  },
  mounted() {
    this.$store.dispatch("platformDict/getPlatformDict", {
      code: "AMS_USE_DIRECTION",
      type: SET_AMS_USE_DIRECTION,
    });
  },
  activated() {
    if (this.queryForm.organIds) {
      this.queryTableDataAndTotal();
    }
  },
};
</script>

<style scoped>
.headerForm,
.contentForm {
  display: flex;
  flex-wrap: wrap;
  justify-content: flex-end;
}
.search-item {
  width: 200px;
  margin-right: 10px;
  margin-bottom: 10px;
}
.search-item-address {
  width: 660px;
  margin-right: 10px;
  margin-bottom: 10px;
}
</style>
