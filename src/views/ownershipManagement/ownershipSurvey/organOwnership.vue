<!--
 * @Date: 2020-07-23 16:30:01
 * @Description: 组织机构权属
--> 
<template>
  <div class="assetProject-page pb70">
    <SearchContainer type="line" :value="false">
      <div slot="headerBtns">
        <SG-Button type="primary" @click="exportList"
          ><segiIcon type="#icon-ziyuan10" class="icon-right" />导出</SG-Button
        >
      </div>
      <div slot="headerForm">
        <treeSelect
          @changeTree="changeTree"
          placeholder="请选择组织机构"
          :allowClear="false"
          :style="allStyle"
        ></treeSelect>
        <!-- 资产项目 -->
        <a-select
          showSearch
          :maxTagCount="1"
          :style="allStyle"
          mode="multiple"
          placeholder="全部资产类型"
          @select="changeAssetType"
          :tokenSeparators="[',']"
          v-model="queryCondition.assetType"
          :options="assetTypeData"
          :allowClear="false"
          :filterOption="filterOption"
          notFoundContent="没有查询到数据"
        />
        <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
      </div>
    </SearchContainer>
    <div>
      <a-table
        class="custom-table td-pd10"
        bordered
        :loading="table.loading"
        :pagination="false"
        :columns="table.columns"
        :dataSource="table.dataSource"
        :locale="{emptyText: '暂无数据'}"
      ></a-table>
      <no-data-tips v-show="table.dataSource.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="table.totalCount"
        location="absolute"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
  </div>
</template>
<script>
import SearchContainer from "@/views/common/SearchContainer";
import TreeSelect from "@/views/common/treeSelect";
import { utils } from "@/utils/utils";
import { ASSET_MANAGEMENT } from "@/config/config.power";
import noDataTips from "@/components/noDataTips";
const allStyle = { width: "140px", marginRight: "10px" };
let columns = [
  {
    title: "管理机构",
    dataIndex: "planName"
  },
  {
    title: "资产总数",
    dataIndex: "storeName"
  },
  {
    title: "办理进度",
    dataIndex: "organName"
  },
  {
    title: "所有权",
    dataIndex: "goodsTypeNames",
    children: [
      {
        title: "总数",
        dataIndex: "gtCount"
      },
      {
        title: "有证",
        dataIndex: "gtSameCount"
      },
      {
        title: "无证",
        dataIndex: "gtDiffCount"
      },
      {
        title: "待办证",
        dataIndex: "gtDiffCount2"
      }
    ]
  },
  {
    title: "使用权",
    dataIndex: "wsPrice",
    children: [
      {
        title: "总数",
        dataIndex: "storeGoodsCount"
      },
      {
        title: "有证",
        dataIndex: "checkCount"
      },
      {
        title: "无证",
        dataIndex: "diffCount"
      },
      {
        title: "待办证",
        dataIndex: "diffCount2"
      },
    ]
  },
]
const queryCondition = {
  organId: "",
  assetType: "", // 资产类型，多个用，分隔
  pageNum: 1,
  pageSize: 20
};
export default {
  components: {
    SearchContainer,
    TreeSelect,
    noDataTips
  },
  data() {
    return {
      allStyle,
      ASSET_MANAGEMENT,
      queryCondition: { ...queryCondition },
      assetTypeData: [{ label: "全部资产类型", value: "" }],
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
    };
  },
  mounted() {
    this.platformDictFn("asset_type");
  },
  methods: {
    query() {
      let data = {
        ...this.queryCondition,
        assetType:
          this.queryCondition.assetType.length > 0
            ? this.queryCondition.assetType.join(",")
            : "" // 资产类型id(多个用，分割)
      };
    },
    // 资产类型发生变化
    changeAssetType(value) {
      this.$nextTick(function() {
        this.queryCondition.assetType = this.handleMultipleSelectValue(
          value,
          this.queryCondition.assetType,
          this.assetTypeData
        );
      });
    },
    searchQuery() {
      this.queryCondition.pageNum = 1;
      this.query();
    },
    // 选择组织机构
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.searchQuery();
    },
    exportList() {
      let form = {
        organId: this.organId,
        status: this.status,
        codeName: this.codeName,
        assetType: pageTypeMap[this.type],
      }
      this.$api.assets.exportList(form).then((res) => {
        console.log(res)
        let blob = new Blob([res.data])
        let a = document.createElement("a")
        a.href = URL.createObjectURL(blob)
        a.download = `资产${typeMap[this.type]}分类.xls`
        a.style.display = "none"
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
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
    // 平台字典获取变动类型
    platformDictFn(str) {
      let obj = {
        code: str
      };
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          if (str === "asset_type") {
            this.assetTypeData = [{ label: "全部资产类型", value: "" }, ...data.map(item => {
              return {...item, label: item.name}
            })];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  }
};
</script>
