<template>
  <div class="assetCard">
    <SG-Modal v-model="isShow" width="1000px" height="450px" title="选择资产卡片" okText="确定选择" cancelText="取消" @cancel="handleAction('cancel')" @ok="handleAction('ok')">
      <div class="search" style="display: flex">
        <a-select
          :maxTagCount="1"
          mode="multiple"
          :tokenSeparators="[',']"
          placeholder="全部资产分类"
          v-model="assetClassify"
          :options="$addTitle(assetClassifyOptions)"
          style="width: 190px; margin-right: 10px"
          @select="changeAssetClassify($event)"
        ></a-select>
        <a-input placeholder="卡片名称/编码" :style="allStyle" :value="cardName" @change="cardNameChange" />
        <a-button icon="search" @click="queryClick"> 查询 </a-button>
      </div>
      <div>
        <a-table
          :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
          :columns="columns"
          :dataSource="dataSource"
          class="custom-table td-pd10"
          :scroll="scroll"
          :pagination="false"
          rowKey="cardId"
          :customRow="customRow"
          bordered
        >
          <template slot="cardName" slot-scope="text">
            <a-popover placement="topLeft">
              <template slot="content">
                <span>{{ text }}</span>
              </template>
              <span>{{ text }}</span>
            </a-popover>
          </template>
          <template slot="cardCode" slot-scope="text">
            <a-popover placement="topLeft">
              <template slot="content">
                <span>{{ text }}</span>
              </template>
              <span>{{ text }}</span>
            </a-popover>
          </template>
        </a-table>
        <no-data-tips v-show="showNoDataTips"></no-data-tips>
      </div>
      <SG-FooterPagination :pageLength="paginator.pageLength" :totalCount="paginator.totalCount" location="relative" v-model="paginator.pageNo" @change="handlePageChange" />
      <a-spin class="loading" size="large" :spinning="loading" />
    </SG-Modal>
  </div>
</template>
<script>
import noDataTips from "@/components/noDataTips";

const columnsData = [
  {
    title: "卡片名称",
    dataIndex: "cardName",
    width: 120,
    scopedSlots: { customRender: "cardName" },
    fixed: "left",
  },
  {
    title: "卡片编码",
    dataIndex: "cardCode",
    width: 220,
    scopedSlots: { customRender: "cardCode" },
  },

  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    width: 80,
  },
  {
    title: "资产分类",
    dataIndex: "assetCategoryName",
    width: 110,
  },
  {
    title: "入账日期",
    dataIndex: "accountEntryTime",
    width: 100,
  },
  { title: "存放地点", dataIndex: "storagePath", width: 120 },
  {
    title: "入账原值(元)",
    dataIndex: "purchaseValue",
    width: 110,
  },
  {
    title: "累计折旧(元)",
    dataIndex: "cumulativeDepreciation",
    width: 110,
  },
  {
    title: "净值(元)",
    dataIndex: "netValue",
    width: 110,
  },
];

export default {
  name: "assetCard",
  components: { noDataTips },
  props: {
    organId: {
      type: String || Number,
      required: true,
    },
    projectId: {
      type: String || Number,
      required: true,
    },
    assetType: {
      type: String || Number,
      required: true,
    },
    // 查询类型 必须 1 资产变动，2 资产清理 3 权属登记
    queryType: { type: [Number, String], default: () => 1 },
  },
  data() {
    return {
      selectedRowKeys: [],
      showNoDataTips: false,
      assetClassifyOptions: [{ label: "全部资产分类", value: "" }],
      allStyle: "width: 170px; margin-right: 10px;",
      isShow: true,
      assetClassify: [""], //  资产分类
      cardName: "", // 资产编码
      columns: [...columnsData],
      dataSource: [],
      scroll: { x: columnsData.length * 140 },
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0,
      },
      loading: false,
    };
  },
  mounted() {
    // 获取资产分类
    this.getAssetClassifyOptions();
    this.queryClick();
  },
  methods: {
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    handleAction(type) {
      if (type === "cancel") {
        // 关闭弹框
        this.$parent.handleAddCard(false);
      } else if (type === "ok") {
        if (this.selectedRowKeys.length === 0) {
          this.$message.error("还未选择资产卡片");
          return;
        }

        this.fetchData();
      }
    },

    // 获取资产数据
    fetchData() {
      const { assetClassify, assetType, projectId, organId, selectedRowKeys, queryType } = this;
      this.loading = true;
      let form = {
        organId,
        projectId,
        assetType,
        objectType: assetClassify.toString(), // 资产分类
        cardIds: selectedRowKeys, // 资产卡片id
        queryType,
        pageSize: 100,
        pageNum: 1,
      };
      return this.$api.assets
        .assetListPage(form)
        .then((r) => {
          let res = r.data;
          if (res && res.code.toString() === "0") {
            this.loading = false;
            const { data } = res.data;
            let assetIdList = data.map((item) => {
              return item.assetId;
            });
            this.$emit("assetCardSubmit", assetIdList);
            // 关闭弹框
            this.$parent.handleAddCard(false);
            // Object.assign(this.paginationObj, {
            //   pageLength,
            //   location: "absolute",
            //   pageNo: Number(pageNo),
            //   totalCount: Number(count),
            // });
            return false;
          }
          throw res.msg;
        })
        .catch((err) => {
          this.loading = false;
          this.$message.error(err || `列表查询请求错误`);
        });
    },
    // 卡片名称发生变化
    cardNameChange(event) {
      if (event.target.value.length <= 40) {
        this.cardName = event.target.value;
      }
    },
    // 页码发生变化
    handlePageChange(page) {
      this.paginator.pageNo = page.pageNo;
      this.paginator.pageLength = page.pageLength;
      this.queryList();
    },
    // 点击查询
    queryClick() {
      this.paginator.pageNo = 1;
      this.queryList();
    },
    queryList() {
      let form = {
        organId: this.organId,
        projectId: Number(this.projectId),
        cardName: this.cardName,
        assetType: this.assetType,
        assetCategoryId: this.assetClassify.join(","),
        pageNum: this.paginator.pageNo,
        pageSize: this.paginator.pageLength,
      };
      this.$api.assets.queryCardPageList(form).then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data.data;
          if (data.length === 0) {
            this.showNoDataTips = true;
          } else {
            this.showNoDataTips = false;
          }
          data.forEach((item, index) => {
            item.key = index;
            for (let key in item) {
              if (item[key] === "" || item[key] === null) {
                item[key] = "--";
              }
            }
          });
          this.dataSource = data;
          this.paginator.totalCount = res.data.data.count;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    customRow: (record) => {
      return {
        class: {
          text_hidden: record,
        },
      };
    },
    // 资产分类发生变化
    changeAssetClassify(value) {
      this.$nextTick(function () {
        this.assetClassify = this.handleMultipleSelectValue(value, this.assetClassify, this.assetClassifyOptions);
      });
    },
    // 处理多选下拉框有全选时的数组
    handleMultipleSelectValue(value, data, dataOptions) {
      // 如果选的是全部
      if (value === "") {
        data = [""];
      } else {
        let totalIndex = data.indexOf("");
        if (totalIndex > -1) {
          data.splice(totalIndex, 1);
        } else {
          // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
          if (data.length === dataOptions.length - 1) {
            data = [""];
          }
        }
      }
      return data;
    },
    // 获取资产分类下拉列表
    getAssetClassifyOptions() {
      let obj = {
        organId: this.organId,
        assetType: this.assetType,
      };
      this.$api.assets.getList(obj).then((res) => {
        if (res.data.code === "0") {
          let arr = [{ label: "全部资产分类", value: "" }];
          res.data.data.forEach((item) => {
            let obj = {
              label: item.professionName,
              value: item.professionCode,
            };
            arr.push(obj);
          });
          this.assetClassifyOptions = arr;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.search {
  margin: 10px;
}
.ant-table-wrapper {
  padding-bottom: 10px !important;
}
.loading {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
