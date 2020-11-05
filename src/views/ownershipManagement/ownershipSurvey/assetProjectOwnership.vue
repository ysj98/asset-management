<!--
 * @Date: 2019-11-26 16:46:14
 * @Author: chen han
 * @Description: 资产项目权属
 -->
 <template>
  <div class="assetProject-page pb70">
    <SearchContainer type="line" :value="false">
      <div slot="headerBtns">
        <SG-Button type="primary" @click="exportList" v-power="ASSET_MANAGEMENT.ASSET_OWNERSHIP_ITEMS_EXPORT">
          <segiIcon type="#icon-ziyuan10" class="icon-right" />导出
        </SG-Button>
      </div>
      <div slot="headerForm">
        <a-checkbox :checked="queryCondition.currentOrgan" @change="checkboxFn">仅当前机构下资产项目</a-checkbox>
        <treeSelect
          @changeTree="changeTree"
          placeholder="请选择组织机构"
          :allowClear="false"
          :style="allStyle"
        ></treeSelect>
        <!-- 资产项目 -->
        <a-select
          showSearch
          placeholder="请选择资产项目"
          v-model="queryCondition.projectId"
          optionFilterProp="children"
          :style="allStyle"
          :options="projectIdOpt"
          :allowClear="false"
          :filterOption="filterOption"
          notFoundContent="没有查询到数据"
        />
        <!-- 资产类型 -->
        <a-select
          showSearch
          :maxTagCount="1"
          :style="allStyle"
          mode="multiple"
          placeholder="全部资产类型"
          @select="changeAssetType"
          :tokenSeparators="[',']"
          v-model="queryCondition.assetTypes"
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
        bordered
        class="custom-table td-pd10"
        :loading="table.loading"
        :pagination="false"
        :columns="table.columns"
        :dataSource="table.dataSource"
        :locale="{emptyText: '暂无数据'}"
      >
        <template slot="projectName" slot-scope="text, record">
          <!-- <span class="nav_name" @click="goPage('detail', record)">{{text}}</span> -->
          <span>{{text}}</span>
        </template>
        <template slot="tranProgress" slot-scope="text, record">
          <div style="padding-right: 10px;">
              <a-progress :percent="Number(record.tranProgress) || 0" />
            </div>
          <!-- <a-progress :percent="Number(record.tranProgress) || 0" /> -->
        </template>
        <template slot="operation" slot-scope="text, record">
          <span @click="goPage('detail', record)" class="btn_click mr15">详情</span>
          <span v-power="ASSET_MANAGEMENT.ASSET_PROOWNERSHIP_SET" @click="goPage('set', record)" class="btn_click">权属设置</span>
        </template>
      </a-table>
      <no-data-tips v-show="table.dataSource.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="table.totalCount"
        location="fixed"
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
import {ASSET_MANAGEMENT} from '@/config/config.power'
import noDataTips from "@/components/noDataTips";
import segiIcon from '@/components/segiIcon.vue'
// 页面跳转
const operationTypes = {
  detail: "/ownershipSurvey/projectDetail",
  set: "/ownershipSurvey/projectSet"
};
const allStyle = { width: "140px", marginRight: "10px" };
const allWidth = { width: "170px", "margin-right": "10px" };
let getUuid = ((uuid = 1) => () => ++uuid)();
const queryCondition = {
  organId: "",
  projectName: "",
  projectId: "",
  assetTypes: '',
  currentOrgan: false,
  pageSize: 10,
  pageNum: 1
};
const projectIdOpt = [
  {
    label: "全部资产项目",
    value: ""
  }
];
const assetTypeData = [
  {
    label: "全部资产类型",
    value: ""
  }
]
let columns = [
  {
    title: "管理机构",
    dataIndex: "organName",
    width: 150
  },
  {
    title: "资产项目名称",
    dataIndex: "projectName",
    scopedSlots: { customRender: "projectName" },
    width: 150
  },
  {
    title: "资产项目编码",
    dataIndex: "projectCode",
    width: 120
  },
  {
    title: "来源方式",
    dataIndex: "sourceTypeName",
    width: 100
  },
  {
    title: "来源渠道",
    dataIndex: "souceChannelType",
    width: 100
  },
  {
    title: "资产数量",
    dataIndex: "assetCount",
    width: 100
  },
  {
    title: "办理进度",
    dataIndex: "tranProgress",
    scopedSlots: { customRender: "tranProgress" },
    width: 150
  },
   {
    title: "所有权",
    dataIndex: "goodsTypeNames",
    children: [
      {
        title: "总数",
        dataIndex: "ownerShipCount",
        width: 100
      },
      {
        title: "有证",
        dataIndex: "ownerShipYesCount",
        width: 100
      },
      {
        title: "无证",
        dataIndex: "ownerShipNoCount",
        width: 100
      },
      {
        title: "待办证",
        dataIndex: "ownerShipWaitCount",
       width: 100
      }
    ],
  },
  {
    title: "使用权",
    dataIndex: "wsPrice",
    children: [
      {
        title: "总数",
        dataIndex: "useShipCount",
        width: 100
      },
      {
        title: "有证",
        width: 100,
        dataIndex: "useShipYesCount",
      },
      {
        title: "无证",
        width: 100,
        dataIndex: "useShipNoCount",
      },
      {
        title: "待办证",
       width: 100,
        dataIndex: "useShipWaitCount",
      }
    ],
  },
  // {
  //   title: "有证资产数",
  //   dataIndex: "ownershipCount",
  //   width: 100
  // },
  // {
  //   title: "无证资产数",
  //   dataIndex: "noOwnershipCount",
  //   width: 100
  // },
  // {
  //   title: "待办资产数",
  //   dataIndex: "waitOwnershipCount",
  //   width: 100
  // },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 200
  }
];
export default {
  components: {
    SearchContainer,
    TreeSelect,
    noDataTips,
    segiIcon
  },
  data() {
    return {
      allStyle,
      allWidth,
      ASSET_MANAGEMENT,
      organName: "", // 所选组织机构名称
      queryCondition,
      projectIdOpt,
      assetTypeData,
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
    };
  },
  watch: {
    '$route' () {
      if (this.$route.path === '/ownershipSurvey' && this.$route.query.refresh) {
      this.queryCondition.pageNum = 1
      this.queryCondition.pageSize = 10
        this.query()
      }
    }
  },
  mounted() {
    this.platformDictFn("asset_type");
  },
  methods: {
    exportList() {
      let data = {
        ...this.queryCondition,
        flag: this.queryCondition.currentOrgan ? 1 : 0
      };
      data.pageNum = 1
      data.pageSize = 1
      data.assetTypes = this.alljudge(data.assetTypes)
      this.$api.basics.projectExport(data).then((res) => {
        console.log(res);
        let blob = new Blob([res.data]);
        let a = document.createElement("a");
        a.href = URL.createObjectURL(blob);
        a.download = `资产项目权属表.xls`;
        a.style.display = "none";
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    },
    // 资产类型发生变化
    changeAssetType(value) {
      this.$nextTick(function () {
        this.queryCondition.assetTypes = this.handleMultipleSelectValue(
          value,
          this.queryCondition.assetTypes,
          this.assetTypeData
        );
      });
    },
    alljudge (val) {
      if (val.length !== 0) {
        if (val[0] === '') {
          return []
        } else {
          return val
        }
      } else {
        return []
      }
    },
    query() {
      let data = {
        ...this.queryCondition,
        flag: this.queryCondition.currentOrgan ? 1 : 0,
      };
      data.assetTypes = this.alljudge(data.assetTypes)
      this.table.loading = true;
      this.$api.basics.ownerShipList(data).then(
        res => {
          this.table.loading = false;
          if (res.data.code === "0") {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map(item => {
              item.sourceTypeName = item.sourceTypeName || "--";
              item.souceChannelType = item.souceChannelType || "--";
              item.tranProgress = item.tranProgress.substring(0, item.tranProgress.length - 1)
              return {
                key: getUuid(),
                ...item
              };
            });
            this.table.totalCount = res.data.data.count || "";
          } else {
            this.$message.error(res.data.message);
          }
        },
        () => {
          this.table.loading = false;
        }
      );
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: ""
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data || [];
          let result = data.map(item => {
            return {
              label: item.projectName,
              value: item.projectId
            };
          });
          this.projectIdOpt = [...utils.deepClone(projectIdOpt), ...result];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 平台字典获取变动类型
    platformDictFn(str) {
      let obj = {
        code: str,
      };
      this.$api.assets.platformDict(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          if (str === "asset_type") {
            this.assetTypeData = [
              { label: "全部资产类型", value: "" },
              ...data.map((item) => {
                return { ...item, label: item.name };
              }),
            ];
          }
        } else {
          this.$message.error(res.data.message);
        }
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
    // 选择组织机构
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.projectId = "";
      this.getObjectKeyValueByOrganIdFn();
      this.searchQuery();
    },
    // 重置分页查询
    searchQuery() {
      this.queryCondition.pageNum = 1;
      this.query();
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    // 选择是否查看当前机构变动单
    checkboxFn(e) {
      this.queryCondition.currentOrgan = e.target.checked;
    },
    // 页面跳转
    goPage(type, record) {
      let query = {
        type,
        projectId: record.projectId,
        assetTypes: this.queryCondition.assetTypes || []
      };
      this.$router.push({ path: operationTypes[type], query });
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
 <style lang="less" scoped>
.assetProject-page {
}
</style>
