<template>
  <SG-Modal
    v-model="show"
    :width="960"
    wrapClassName="assetListModal"
    :noPadding="true"
    :maskClosable="false"
    @ok="submitAdd"
  >
    <template #title>
      <div class="f16">选择资产</div>
    </template>
    <div class="content">
      <!-- 输入框 -->
      <div class="search_box">
        <a-select
          style="width: 140px; margin-left: 600px"
          v-model="objectType"
          @change="fetchData"
          :options="objectTypeOptions"
          placeholder="全部资产分类"
        />
        <a-input-search
          placeholder="资产名称/编码"
          v-model="assetNameCode"
          style="width: 140px; margin-left: 12px"
          @pressEnter="onPressEnter"
          @search="onSearch"
        />
      </div>
      <!-- 表格 -->
      <div class="left_table">
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :scroll="{ x: 1200 }"
          size="small"
          :pagination="false"
          class="custom-table td-pd10"
          :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
        >
        </a-table>
      </div>
      <SG-FooterPagination
        :pageLength="pagination.pageLength"
        :totalCount="pagination.totalCount"
        location="absolute"
        :noPageTools="true"
        v-model="pagination.pageNo"
        @change="({ pageNo, pageLength }) => fetchData({ pageNo, pageLength })"
      />
    </div>
  </SG-Modal>
</template>

<script>
const columns = [
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
export default {
  data() {
    return {
      columns,
      show: false, // 模态框显示
      objectType: undefined, // 资产类别
      objectTypeOptions: [], // 类别选项
      dataSource: [], // 表格数据源
      selectedRowKeys: [], // table选中项
      loading: false, // Table loading
      pagination: {
        pageLength: 10,
        totalCount: 100,
        pageNo: 1,
      },
      assetNameCode: "", // 资产名称/编码
      assetState: "", // 资产状态
      selectedList: [],
    };
  },
  props: {
    // organId
    organId: { type: [Number, String], default: () => "" },
    // 查询类型  1 资产变动（或交付管理），2 资产清理 3 权属登记，4资产处置登记 5附属配套 6出租登记  7投资登记
    queryType: { type: [Number, String], default: () => 6 },
    // 资产项目projectId
    proId: { type: [Number, String], default: () => "" },
    // 资产类型
    assetType: { type: [Number, String], default: () => "" },
  },
  watch: {
    assetType(val) {
      if (val) {
        this.queryObjectType(String(val));
      }
    },
    show(bool) {
      if (bool === true) {
        this.fetchData({});
      }
    },
    selectedRowKeys: function (keys) {
      let { dataSource, selectedList } = this;
      let primaryKeys = [];
      let primaryList = selectedList.filter((n) => {
        let flag = keys.includes(n.assetId);
        flag && primaryKeys.push(n.assetId);
        return flag;
      });
      let newList = dataSource.filter(
        (i) => !primaryKeys.includes(i.assetId) && keys.includes(i.assetId)
      );
      this.selectedList = primaryList.concat(newList);
    },
  },
  methods: {
    // 获取数据
    fetchData({ pageLength = 10, pageNo = 1 }) {
      const {
        objectType,
        assetNameCode,
        assetType,
        proId: projectId,
        assetState: multiStatus,
        queryType,
        organId,
      } = this;
      if (!projectId) {
        return this.$message.warn("资产项目Id不存在");
      }
      this.loading = true;
      let form = {
        queryType,
        assetNameCode,
        projectId,
        organId,
        multiStatus,
        // projectId: projectId === '-1' ? '' : projectId, 改前
        assetType: assetType === "-1" ? "" : assetType,
        objectType: objectType === "-1" ? "" : objectType,
        pageSize: pageLength,
        pageNum: pageNo,
      };
      return this.$api.assets
        .assetListPage(form)
        .then((r) => {
          let res = r.data;
          res.data.data.forEach((item, index) => {
            item.key = item.assetId;
            item.model = "/";
            item.leaseArea = item.assetArea;
            item.remark = "";
          });
          if (res && res.code.toString() === "0") {
            this.loading = false;
            const { count, data } = res.data;
            this.dataSource = data;
            Object.assign(this.pagination, {
              pageLength,
              pageNo: Number(pageNo),
              totalCount: Number(count),
            });
            return false;
          }
          throw res.msg;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err || `列表查询请求错误`);
        });
    },
    // 回车搜索
    onPressEnter() {
      this.fetchData({});
    },
    // 按钮搜索
    onSearch() {
      this.onPressEnter();
    },
    // 处理选中的数据
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 移除选中的人员
    removeItem(id) {
      this.selectedRowKeys = this.selectedRowKeys.filter((i) => i !== id);
    },
    // 模态框确定按钮
    submitAdd() {
      this.show = false;
      this.$emit("input", this.selectedList);
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
          }
          throw res.message || "查询资产类别失败";
        })
        .catch((err) => {
          this.$message.error(err || "查询资产类别失败");
        });
    },
  },
};
</script>

<style lang="less" scoped>
.assetListModal {
  .content {
    position: relative;
    padding: 0 15px;
    padding-bottom: 55px;
    height: 567px;
    .search_box {
      display: flex;
      height: 45px;
      align-items: flex-end;
      margin-bottom: 15px;
    }

    .left_table {
      position: absolute;
      top: 60;
      left: 15px;
      // display: inline-block;
      width: 930px;
      height: 443px;
      margin-right: 10px;
      border: 1px solid #dce1e6;

      .custom-table {
        /*if you want to set scroll: { x: true }*/
        /*you need to add style .ant-table td { white-space: nowrap; }*/
        & /deep/ .ant-table {
          line-height: 1.91;
          .ant-table-thead th {
            background-color: #fafafa;
            white-space: nowrap;
          }
          .ant-table-tbody tr {
            background-color: transparent;
          }
        }
      }
    }
    .selectedBox {
      position: absolute;
      top: 60;
      right: 15px;
      display: inline-block;
      border: 1px solid #dce1e6;
      width: 217px;
      height: 443px;
      overflow-y: auto;
      background-color: #fafafa;

      .scrollbar {
        .selected-unit {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 16px;
          width: 100%;
          height: 40px;
          color: #49505e;
          &:hover {
            background-color: #ecf6ff;
            cursor: pointer;
          }
          &:hover .del {
            visibility: initial;
          }

          .addedName {
            font-size: 12px;
          }
          .del {
            visibility: hidden;
            color: #c1cad3;
            &:hover {
              color: #49505e;
            }
          }
        }
      }
    }
  }
}
/deep/.ant-input-suffix {
  font-size: 16px;
}
</style>