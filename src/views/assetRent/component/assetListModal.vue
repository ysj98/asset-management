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
        <span class="f14">待选资产:</span>
        <EquipmentSelectTree
          v-if="isSelectedEquipment"
          style="width: 140px; margin-left: 200px"
          :top-organ-id="organId"
          v-model="objectType"
          :options-data-format="(data)=>{
            return [{label: '全部资产分类', value: '', isLeaf: true},...data]
          }"
        />
        <a-select
          v-else
          style="width: 140px; margin-left: 200px"
          v-model="objectType"
          @change="fetchData"
          :options="$addTitle(objectTypeOptions)"
          placeholder="请选择资产类别"
        />
        <a-select
          style="width: 140px; margin-left: 12px"
          @change="statusChange"
          placeholder="请选择资产状态"
        >
          <a-select-option
            :title="item.name"
            v-for="(item, index) in assetStatus"
            :key="index"
            :value="item.value"
            >{{ item.name }}</a-select-option
          >
        </a-select>
        <a-input-search
          placeholder="资产名称/编码"
          v-model="assetNameCode"
          style="width: 140px; margin-left: 12px"
          @pressEnter="onPressEnter"
          @search="onSearch"
        />
        <div class="ml10">
          已选:&emsp;<span style="font-size: 14px; font-weight: bold">{{
            selectedList.length === 0 ? 0 : selectedList.length
          }}</span>
        </div>
      </div>
      <!-- 表格 -->
      <div class="left_table">
        <a-table
          :columns="columns"
          :data-source="dataSource"
          :loading="loading"
          :scroll="{ x: 2000,y:380 }"
          size="small"
          :pagination="false"
          class="custom-table td-pd10"
          :row-selection="{ selectedRowKeys, onChange: onSelectChange }"
          tableLayout="fixed"
        >
        </a-table>
      </div>
      <!-- 已选列表 -->
      <div class="selectedBox pa">
        <div class="scrollbar">
          <div v-for="(item, index) in selectedList" :key="index">
            <div class="selected-unit">
              <div class="addedName">{{ item.assetName }}</div>
              <a-icon
                class="del"
                type="close"
                @click="removeItem(item.assetId)"
              />
            </div>
          </div>
        </div>
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
import EquipmentSelectTree from "@/views/common/EquipmentSelectTree";
const assetStatus = [
  {
    name: "全部资产状态",
    value: "allStatus",
  },
  {
    name: "待入库",
    value: "0",
  },
  {
    name: "入库中",
    value: "7",
  },
  {
    name: "正常",
    value: "1",
  },
  {
    name: "报废",
    value: "2",
  },
  {
    name: "报损",
    value: "4",
  },
  {
    name: "已转让",
    value: "3",
  },
];
const columns = [
  {
    title: "资产编码",
    align: "center",
    dataIndex: "assetCode",
  },
  { title: "资产名称", align: "center", dataIndex: "assetName" },
  { title: "资产类型", align: "center", dataIndex: "assetTypeName" },
  { title: "资产分类", align: "center", dataIndex: "assetCategoryName" },
  { title: "资产项目", align: "center", dataIndex: "projectName" },
  { title: "资产面积(㎡)", align: "center", dataIndex: "assetArea" },
  { title: "规格型号", align: "center", dataIndex: "model" },
  { title: "资产位置", align: "center", dataIndex: "address" },
  { title: "资产状态", align: "center", dataIndex: "assetStatusName" },
];
export default {
  components:{EquipmentSelectTree},
  data() {
    return {
      columns,
      show: false, // 模态框显示
      objectType: '', // 资产类别
      objectTypeOptions: [], // 类别选项
      assetStatus: [...assetStatus],
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
    isSelectedEquipment: { type:Boolean,default:false }
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
        areaType: 1
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
    // 更改资产状态
    statusChange(val) {
      if (val === "allStatus") {
        this.assetState = "";
      } else {
        this.assetState = val;
      }
      this.fetchData({});
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
      this.$emit('areaChange')
    },

    // 根据资产类型查资产分类列表
    queryObjectType(assetType) {
      this.objectType = '';
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
      width: 703px;
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
