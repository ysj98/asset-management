<template>
  <div class="select-detail">
    <SG-Modal
      :visible="true"
      @cancel="
        () => {
          $emit('closePop');
        }
      "
      @ok="popSave"
      width="1000px"
    >
      <a-row :gutter="8" style="margin-bottom: 10px">
        <a-col :span="3">
          <div style="line-height: 32px; font-weight: bold">待选资产</div>
        </a-col>
        <a-col :span="6">
          <EquipmentSelectTree
            v-if="isSelectedEquipment"
            style="width: 100%"
            :top-organ-id="organId"
            v-model="objectType"
            :options-data-format="
              (data) => {
                return [
                  { label: '全部资产分类', value: '-1', isLeaf: true },
                  ...data,
                ];
              }
            "
            @select="fetchData"
          />
          <a-select
            v-else
            style="width: 100%"
            v-model="objectType"
            @change="fetchData"
            :options="$addTitle(objectTypeOptions)"
            placeholder="请选择资产类别"
          />
        </a-col>
        <a-col :span="6">
          <a-select
            style="width: 100%"
            v-model="assetStatus"
            @change="fetchData"
            :options="$addTitle(assetStatusOptions)"
            placeholder="请选择资产状态"
          />
        </a-col>
        <a-col :span="6">
          <a-input-search
            v-model.trim="assetName"
            style="width: 100%"
            @search="fetchData"
            @pressEnter="fetchData"
            placeholder="请输入资产名称"
          />
        </a-col>
        <a-col :span="6" :offset="3">
          <div style="line-height: 32px">
            已选：<span style="color: #49505e; font-weight: bold">{{
              selectedList.length
            }}</span>
          </div>
        </a-col>
      </a-row>
      <a-row :gutter="8">
        <a-col :span="18">
          <div class="col_div" :style="`height: ${height}px`">
            <a-table
              size="small"
              rowKey="assetId"
              :columns="columns"
              :loading="loading"
              :pagination="false"
              :dataSource="dataSource"
              :scroll="{ x: 600, y: 300 }"
              :rowSelection="{
                selectedRowKeys,
                onChange: handleSelectChange,
              }"
            />
            <SG-FooterPagination
              style="margin-top: 20px"
              ref="footerPagination"
              v-bind="paginationObj"
              @change="
                ({ pageNo, pageLength }) => fetchData({ pageNo, pageLength })
              "
            />
          </div>
        </a-col>
        <a-col :span="6">
          <div
            class="col_div"
            :style="`overflow-y: auto; height: ${height}px; max-height: ${height}px`"
          >
            <div
              class="item_div"
              v-for="item in selectedList"
              :key="item.assetId"
              :title="item.assetName"
            >
              <span class="text">{{ item.assetName }}</span>
              <a-icon
                type="close"
                class="remove_icon"
                @click="removeItem(item.assetId)"
              />
            </div>
          </div>
        </a-col>
      </a-row>
    </SG-Modal>
  </div>
</template>

<script>
import EquipmentSelectTree from "@/views/common/EquipmentSelectTree";
export default {
  name: "SelectAssetListModal",
  components: { EquipmentSelectTree },
  props: {
    defaultSelectedList: {
      type: Array,
      default() {
        return [];
      },
    },
    // organId
    organId: { type: [Number, String], default: () => "" },
    // 设置table高度
    height: { type: [Number, String], default: () => 450 },
    // 资产项目projectId
    proId: { type: [Number, String], default: () => "" },
    // 资产类型
    assetType: { type: [Number, String], default: () => "" },
    isSelectedEquipment: { type: Boolean, default: false },
  },
  data() {
    return {
      showFlag: false,
      receiveDetailId: "", // 领用编号
      assetName: "", // 资产名
      projectId: undefined, // 资产项目
      projectOptions: [], // 资产项目选项
      objectType: "-1", // 资产类别
      objectTypeOptions: [], // 类别选项
      assetStatus: undefined, // 资产状态
      assetStatusOptions: [
        { key: "0", title: "未生效" },
        { key: "1", title: "正常" },
        { key: "2", title: "报废" },
        { key: "3", title: "转让" },
        { key: "4", title: "报损" },
        { key: "5", title: "已出库" },
        { key: "6", title: "已取消" },
        { key: "7", title: "入库中" },
      ], // 类别选项
      dataSource: [], // Table数据源
      loading: false, // Table loading
      selectedList: [],
      selectedRowKeys: [], // Table选中项
      paginationObj: {
        pageNo: 1,
        totalCount: 0,
        pageLength: 10,
        noPageTools: false,
      },
      columns: [
        { title: "资产编码", dataIndex: "assetCode", width: 150 },
        { title: "资产名称", dataIndex: "assetName", width: 150 },
        { title: "资产类型", dataIndex: "assetTypeName", width: 150 },
        { title: "资产分类", dataIndex: "assetCategoryName", width: 150 },
        { title: "资产项目", dataIndex: "projectName", width: 150 },
        { title: "资产面积", dataIndex: "assetArea", width: 150 },
        { title: "规格型号", dataIndex: "specificationTypeName", width: 150 },
        { title: "资产位置", dataIndex: "address", width: 150 },
        { title: "资产状态", dataIndex: "assetStatusName", width: 150 },
      ],
    };
  },

  methods: {
    popSave() {
      const list = this.selectedList;
      if (!list.length){
        this.$message.warn('至少选择一个资产')
        return null
      }
      this.$emit("popSave", list);
      this.$emit("closePop");
    },
    // 获取列表数据
    fetchData({ pageLength = 10, pageNo = 1 }) {
      const {
        objectType,
        assetName,
        assetType,
        proId: projectId,
        organId,
        assetStatus,
      } = this;
      if (!projectId) {
        return this.$message.warn("资产项目Id不存在");
      }
      this.loading = true;
      let form = {
        queryType: 7,
        assetNameCode: assetName,
        projectId,
        organId,
        // projectId: projectId === '-1' ? '' : projectId, 改前
        assetType: assetType === "-1" ? "" : assetType,
        objectType: objectType === "-1" ? "" : objectType,
        multiStatus: assetStatus,
        pageSize: pageLength,
        pageNum: pageNo,
      };
      return this.$api.assets
        .assetListPage(form)
        .then((r) => {
          let res = r.data;
          if (res && res.code.toString() === "0") {
            this.loading = false;
            res.data.data.map((item, index) => {
              if (!item.returnArea) {
                res.data.data[index].returnArea = 0;
              }
              if (!item.unReturnArea) {
                res.data.data[index].unReturnArea = 0;
              }
              if (!item.receiveArea) {
                res.data.data[index].receiveArea = 0;
              }
            });
            const { count, data } = res.data;
            this.dataSource = data;
            Object.assign(this.paginationObj, {
              pageLength,
              location: "absolute",
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

    // 处理选中的数据
    handleSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },

    // 移除选中的人员
    removeItem(id) {
      this.selectedRowKeys = this.selectedRowKeys.filter((i) => i !== id);
    },

    // 平台字典获取资产类型
    queryAssetTypeDict() {
      this.$api.assets
        .platformDict({ code: "asset_type" })
        .then((res) => {
          if (Number(res.data.code) === 0) {
            let { data } = res.data;
            let list = data.map((m) => ({
              title: m.name,
              key: m.value,
            }));
            list.unshift({ title: "全部资产类型", key: "-1" });
            this.assetTypeOptions = list;
            return false;
          }
          throw res.message || "查询资产类型失败";
        })
        .catch((err) => {
          this.$message.error(err || "查询资产类型失败");
        });
    },

    // 资产项目
    queryProjectByOrganId() {
      this.$api.assets
        .getObjectKeyValueByOrganId({ organId: this.organId, projectName: "" })
        .then((res) => {
          if (Number(res.data.code) === 0) {
            let { data } = res.data;
            let arr = data.map((m) => ({
              title: m.projectName,
              key: m.projectId,
            }));
            // arr.unshift({title: '全部项目', key: '-1'}) 改前
            this.projectId = arr.length ? arr[0].key : undefined;
            this.projectOptions = arr;
            return this.fetchData({});
          }
          throw res.message || "查询资产项目失败";
        })
        .catch((err) => {
          this.$message.error(err || "查询资产项目失败");
        });
    },

    // 根据资产类型查资产分类列表
    queryObjectType(assetType) {
      this.objectType = "-1";
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
  mounted() {
    const { assetType } = this;
    this.fetchData({});
    if (!this.isSelectedEquipment) {
      this.queryObjectType(String(assetType));
    }
  },
  watch: {
    defaultSelectedList: {
      handler: function (newValue) {
        if (newValue.length) {
          this.selectedRowKeys = newValue.map((ele) => ele.assetId);
          this.selectedList = newValue;
        }
      },
      immediate: true,
    },
    selectedRowKeys: {
      handler: function (keys) {
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
  },
};
</script>

<style lang="less" scoped>
.select-detail {
  min-width: 650px;
  .col_div {
    /*height: 450px;*/
    /*max-height: 450px;*/
    position: relative;
    border-radius: 3px;
    border: 1px solid #dce1e6;
    & /deep/ .sg-FooterPagination {
      margin-bottom: 0 !important;
      padding: 5px 20px !important;
    }
  }
  .custom-table {
    /*if you want to set scroll: { x: true }*/
    /*you need to add style .ant-table td { white-space: nowrap; }*/
    & /deep/ .ant-table {
      .ant-table-thead th {
        white-space: nowrap;
      }
    }
  }
}
.item_div {
  /*width: 100%;*/
  padding: 10px;
  cursor: default;
  overflow: hidden;
  display: flex;
  align-items: center;
  &:hover {
    background-color: #e6f7ff;
  }
  .text {
    width: 180px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .remove_icon {
    float: right;
    margin-top: 5px;
    cursor: pointer;
  }
}
</style>
