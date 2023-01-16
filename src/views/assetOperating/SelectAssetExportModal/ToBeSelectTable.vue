<template>
  <div>
    <div class="search-block">
      <EquipmentSelectTree
        v-if="isSelectedEquipment"
        style="width: 200px"
        :top-organ-id="organInfo.organId"
        v-model="objectType"
        :options-data-format="
          (data) => {
            return [
              { label: '全部资产类别', value: '', isLeaf: true },
              ...data,
            ];
          }
        "
      />
      <a-select
        v-else
        style="width: 200px"
        placeholder="全部资产类别"
        v-model="objectType"
      >
        <a-select-option
          :title="item.name"
          v-for="(item, index) in objectTypeData"
          :key="index"
          :value="item.value"
        >
          {{ item.name }}
        </a-select-option>
      </a-select>
      <a-input-search
        style="width: 200px; margin-left: 20px"
        v-model="assetNameCode"
        placeholder="资产名称/编码"
        @search="getTableData"
      ></a-input-search>
    </div>
    <a-table
      size="middle"
      v-bind="tableOptions"
      :row-selection="{
        selectedRowKeys: selectedRowKeys,
        onChange: onSelectChange,
        onSelect: onSelect,
      }"
    ></a-table>
    <SG-FooterPagination
      v-model="pageForm.pageNum"
      :pageLength="pageForm.pageSize"
      :totalCount="totalCount"
      :noPageTools="true"
      @change="handleChange"
    />
  </div>
</template>

<script>
import { columns } from "@/views/assetOperating/SelectAssetExportModal/share";
import EquipmentSelectTree from "@/views/common/EquipmentSelectTree";
export default {
  name: "ToBeSelectTable",
  components: {
    EquipmentSelectTree,
  },
  inject: ["sonData"],
  props: {
    selectTableData: {
      type: Array,
    },
  },
  data() {
    return {
      objectTypeData: [{ name: "全部资产类型", value: "" }],
      assetNameCode: "",
      objectType: "",
      pageForm: {
        pageSize: 10,
        pageNum: 1,
      },
      totalCount: 0,
      tableOptions: {
        rowKey: function (record) {
          return record.assetId;
        },
        scroll: { x: 560, y: 500 },
        columns: columns,
        dataSource: [],
        pagination: false,
      },
      selectedRowKeys: [],
    };
  },
  watch: {
    selectTableData: {
      handler(newValue) {
        this.initSelectedRowKeys(newValue);
      },
    },
  },
  computed: {
    projectId() {
      return this.sonData.projectId();
    },
    assetType() {
      return this.sonData.assetType();
    },
    organInfo() {
      return this.sonData.organInfo();
    },
    isSelectedEquipment() {
      return this.assetType === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    },
  },
  methods: {
    // 资产分类列表
    getListFn() {
      // 没有organId都不给查分类
      if (!this.organInfo.organId) {
        return;
      }
      let obj = {
        organId: this.organInfo.organId,
        assetType: this.assetType,
      };
      this.$api.assets.getList(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let arr = [];
          data.forEach((item) => {
            arr.push({
              name: item.professionName,
              value: item.professionCode,
            });
          });
          this.objectTypeData = [];
          let atr = [
            {
              name: "全部资产分类",
              value: "",
            },
          ];
          this.objectTypeData = [...atr, ...arr];
        }
      });
    },
    initSelectedRowKeys(selectTableData) {
      this.selectedRowKeys = selectTableData.map((ele) => ele.assetId);
    },
    onSelect() {
      console.log(arguments);
    },
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys;
      const arr = [...this.selectTableData, ...selectedRows];
      // // TODO: 可优化
      let result = [];
      arr.forEach((ele) => {
        if (result.findIndex((item) => item.assetId === ele.assetId) === -1) {
          result.push(ele);
        }
      });
      result = result.filter((ele) =>
        this.selectedRowKeys.includes(ele.assetId)
      );
      this.$emit("update:selectTableData", result);
    },
    handleChange({ pageNo, pageLength }) {
      this.pageForm = {
        pageSize: pageLength,
        pageNum: pageNo,
      };
      this.getTableData();
    },
    async getTableData() {
      const req = {
        ...this.pageForm,
        assetNameCode: this.assetNameCode,
        objectType: this.objectType,
        assetType: this.assetType,
        organId: this.organInfo.organId,
        isTransferOperation: 0,
        queryType: 8,
        projectId: this.projectId,
      };
      const {
        data: { data, code, message },
      } = await this.$api.assets.assetListPage(req);
      if (code === "0") {
        this.tableOptions.dataSource = data ? data.data : [];
        this.totalCount = data.count;
      } else {
        this.$message.error(message);
      }
    },
  },
  mounted() {
    this.getListFn();
    this.getTableData();
  },
};
</script>

<style scoped>
.search-block {
  display: flex;
  justify-content: flex-end;
  margin-bottom: 20px;
}
</style>
