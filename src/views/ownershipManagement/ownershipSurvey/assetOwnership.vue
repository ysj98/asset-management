<!--
 * @Date: 2019-11-26 16:47:09
 * @Author: chen han
 * @Description: 资产权属
 -->
 <template>
  <div>
    <div class="pb70">
      <SearchContainer v-model="toggle" :contentStyle="{paddingTop: toggle?'16px': 0}">
        <!-- <div slot="headerBtns">
        <SG-Button type="primary" class="mr10" @click="openExport"><segiIcon type="#icon-ziyuan10" class="mr10"/>导出</SG-Button>
      </div> -->
        <div slot="contentForm" class="search-content-box">
          <div class="search-from-box">
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
            <!-- 全部权属情况 -->
            <a-select
              showSearch
              placeholder="请选择权属情况"
              v-model="queryCondition.ownershipStatuss"
              optionFilterProp="children"
              @change="ownershipStatussSelect"
              mode="multiple"
              :maxTagCount="1"
              :style="allWidth"
              :options="ownershipStatussOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部权属人 -->
            <a-select
              showSearch
              placeholder="请选择权属人"
              v-model="queryCondition.obligeeId"
              optionFilterProp="children"
              :style="allStyle"
              :options="obligeeIdOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部权属类型 -->
            <a-select
              showSearch
              placeholder="请选择权利类型"
              v-model="queryCondition.kindOfRights"
              optionFilterProp="children"
              @change="kindOfRightsSelect"
              mode="multiple"
              :maxTagCount="1"
              :style="allWidth"
              :options="kindOfRightsOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <!-- 全部资产状态 -->
            <a-select
              showSearch
              placeholder="请选择资产状态"
              v-model="queryCondition.statuss"
              @change="statussSelect"
              optionFilterProp="children"
              mode="multiple"
              :maxTagCount="1"
              :style="allWidth"
              :options="statussOpt"
              :allowClear="false"
              :filterOption="filterOption"
              notFoundContent="没有查询到数据"
            />
            <a-input
              :maxLength="30"
              v-model="queryCondition.name"
              placeholder="输入资产名称/权利号"
              :style="allStyle"
            />
          </div>
          <div class="two-row-box">
            <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
            <SG-Button @click="restQuery">清除</SG-Button>
          </div>
        </div>
      </SearchContainer>
      <div>
        <a-table
          class="custom-table td-pd10"
          :loading="table.loading"
          :pagination="false"
          :scroll="{ x: 1400}"
          :columns="table.columns"
          :dataSource="table.dataSource"
          :locale="{emptyText: '暂无数据'}"
        >
          <template slot="assetName" slot-scope="text, record">
            <span class="nav_name" @click="goPage('detail', record)">{{text}}</span>
          </template>
          <template slot="tranProgress" slot-scope="text, record">
            <a-progress :percent="Number(record.tranProgress) || 0" />
          </template>
          <template slot="operation" slot-scope="text, record">
            <span v-power="ASSET_MANAGEMENT.ASSET_OWNERSHIP_SET" @click="goPage('detail', record)" class="btn_click mr15">详情</span>
          </template>
        </a-table>
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
  </div>
</template>
<script>
import noDataTips from "@/components/noDataTips";
import SearchContainer from "@/views/common/SearchContainer";
import TreeSelect from "@/views/common/treeSelect";
import segiIcon from '@/components/segiIcon.vue'
import { utils } from "@/utils/utils";
import {ASSET_MANAGEMENT} from '@/config/config.power'
let getUuid = ((uuid = 1) => () => ++uuid)();
// 页面跳转
const operationTypes = {
  detail: "/ownershipSurvey/assetOwnershipDetail"
};
const allStyle = {
  width: "170px",
  "margin-right": "10px",
  "margin-top": "14px"
};
const allWidth = {
  width: "170px",
  "margin-right": "10px",
  "margin-top": "14px",
  height: '32px',
  overflow: 'hidden'
};
const queryCondition = {
  organId: "",
  projectId: "",
  ownershipStatuss: [''], // 权属情况(多选)
  obligeeId: "", // 权属人
  kindOfRights: [''], // 权利类型(多选)
  statuss: [''], // 资产状态(多选)
  name: "", // 资产名称/权证号
  pageNum: 1,
  pageSize: 10
};
const projectIdOpt = [{ label: "全部资产项目", value: "" }];
const ownershipStatussOpt = [
  { label: "全部权属情况", value: "" },
  { label: "有证", value: "1" },
  { label: "无证", value: "0" },
  { label: "待办", value: "2" }
];
const obligeeIdOpt = [{ label: "全部权属人", value: "" }];
const kindOfRightsOpt = [{ label: "全部权利类型", value: "" }];
const statussOpt = [
  { label: "全部资产状态", value: "" },
  { label: "未生效", value: "0" },
  { label: "正常", value: "1" },
  { label: "资产报废", value: "2" },
  { label: "资产转让", value: "3" },
  { label: "资产报损", value: "4" },
  { label: "已清理", value: "5" }
];
let columns = [
  {
    title: "资产名称",
    dataIndex: "assetName",
    scopedSlots: { customRender: "assetName" },
    width: 150
  },
  {
    title: "资产编码",
    dataIndex: "assetCode",
    width: 120
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    width: 120
  },
  {
    title: "管理机构",
    dataIndex: "organName",
    width: 120
  },
  {
    title: "资产项目名称",
    dataIndex: "projectName",
    width: 120
  },
  {
    title: "所在位置",
    dataIndex: "location",
    width: 200
  },
  {
    title: "面积(㎡)",
    dataIndex: "area",
    width: 100
  },
  {
    title: "权属情况",
    dataIndex: "ownershipStatusName",
    width: 100
  },
  {
    title: "权属办理方式",
    dataIndex: "settingMethodName",
    width: 120
  },
  {
    title: "权利类型",
    dataIndex: "kindOfRightName",
    width: 120
  },
  {
    title: "权证号",
    dataIndex: "warrantNbr",
    width: 120
  },
  {
    title: "资产状态",
    dataIndex: "statusName",
    width: 100
  },
  {
    title: "操作",
    dataIndex: "operation",
    scopedSlots: { customRender: "operation" },
    width: 100
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
      ASSET_MANAGEMENT,
      toggle: true,
      allStyle,
      allWidth,
      queryCondition: utils.deepClone(queryCondition),
      projectIdOpt,
      ownershipStatussOpt,
      obligeeIdOpt,
      kindOfRightsOpt,
      statussOpt,
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
    };
  },
  created() {
    this.platformDictFn("AMS_KIND_OF_RIGHT");
  },
  methods: {
    query() {
      let data = {
        ...this.queryCondition,
        flag: "0"
      };
      console.log('this.queryCondition', this.queryCondition)
      data.ownershipStatuss = data.ownershipStatuss.join(',')
      data.kindOfRights = data.kindOfRights.join(',')
      data.statuss = data.statuss.join(',')
      this.table.loading = true;
      this.$api.basics.assetList(data).then(
        res => {
          this.table.loading = false;
          if (res.data.code === "0") {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map(item => {
              item.settingMethodName = item.settingMethodName || '--'
              item.kindOfRightName = item.kindOfRightName || '--'
              item.warrantNbr = item.warrantNbr || '--'
              return {
                key: getUuid(),
                ...item
              };
            });
            this.table.totalCount = res.data.data.count || 0;
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
    // 权属人
    ownerShipUserSelect() {
      let data = { organId: this.queryCondition.organId };
      this.$api.basics.ownerShipUserSelect(data).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || []
          result = result.map(item => {
            return {...item, value: item.obligeeId, label: item.obligeeName}
          })
          this.obligeeIdOpt = [...utils.deepClone(obligeeIdOpt), ...result]
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    ownershipStatussSelect (value) {
      this.$nextTick(function () {
        this.queryCondition.ownershipStatuss = this.handleMultipleSelectValue(value, this.queryCondition.ownershipStatuss, this.ownershipStatussOpt)
      })
    },
    kindOfRightsSelect (value) {
      this.$nextTick(function () {
        this.queryCondition.kindOfRights = this.handleMultipleSelectValue(value, this.queryCondition.kindOfRights, this.kindOfRightsOpt)
      })
    },
    statussSelect (value) {
      this.$nextTick(function () {
        this.queryCondition.statuss = this.handleMultipleSelectValue(value, this.queryCondition.statuss, this.statussOpt)
      })
    },
    // 选择组织机构
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.projectId = "";
      this.queryCondition.obligeeId = "";
      this.getObjectKeyValueByOrganIdFn();
      this.ownerShipUserSelect();
      this.searchQuery();
    },
    handleMultipleSelectValue (value, data, dataOptions) {
      // 如果选的是全部
      let hasAll = data.indexOf('') !== -1
      let len = data.length
      // 如果点击全选或者取消全选
      if (data[len-1] === '' || len === 0) {
        return data = ['']
      }
      // 如果不包含全选，但其他选项都选中
      if (!hasAll && len === (dataOptions.length-1)) {
        return data = ['']
      }
      // 包含全选，并且其他选项只选一部分
      if (hasAll && len !== dataOptions.length) {
        data.splice(data.indexOf(''), 1)
      }
      return data
    },
    // 导出
    openExport () {},
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
    // 重置查询条件
    restQuery() {
      this.queryCondition.projectId = "";
      this.queryCondition.ownershipStatuss = [''];
      this.queryCondition.obligeeId = "";
      this.queryCondition.kindOfRights = [''];
      this.queryCondition.statuss = [''];
      this.queryCondition.name = "";
    },
    platformDictFn(code) {
      this.$api.assets.platformDict({ code }).then(res => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          let arr = result.map(item => ({ label: item.name, ...item }));
          // 权利类型
          if (code === "AMS_KIND_OF_RIGHT") {
            this.kindOfRightsOpt = [
              ...utils.deepClone(kindOfRightsOpt),
              ...arr
            ];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    goPage(type, record) {
      let query = {
        type,
        assetHouseId: record.assetHouseId
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
.search-content-box {
  display: flex;
  justify-content: space-between;
  .search-from-box {
    flex: 1;
    display: flex;
    flex-wrap: wrap;
  }
  .two-row-box {
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
</style>
