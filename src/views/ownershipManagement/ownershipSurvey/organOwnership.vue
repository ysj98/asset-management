<!--
 * @Date: 2020-07-23 16:30:01
 * @Description: 组织机构权属
-->
<template>
  <div class="assetProject-page pb70">
    <SearchContainer type="line" :value="false">
      <div slot="headerBtns">
        <SG-Button type="primary" @click="exportList" v-power="ASSET_MANAGEMENT.ASSET_PROOWNERSHIP_ORGAN_EXPORT">
          <segiIcon type="#icon-ziyuan10" class="icon-right" />导出
        </SG-Button>
      </div>
      <div slot="headerForm" style="float: right; text-align: left">
        <treeSelect @changeTree="changeTree" placeholder="请选择组织机构" :allowClear="false" :style="allStyle" :showSearch="true"></treeSelect>
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
          :options="$addTitle(assetTypeData)"
          :allowClear="false"
          :filterOption="filterOption"
          notFoundContent="没有查询到数据"
        />
        <SG-Button @click="searchQuery" class="mr10" type="primary">查询</SG-Button>
      </div>
    </SearchContainer>
    <div>
      <!-- class="custom-table td-pd10 eliminate-table" -->
      <a-table
        class="custom-tables"
        :scroll="{ x: 2700, y: 405 }"
        bordered
        :loading="table.loading"
        :pagination="false"
        :columns="table.columns"
        :dataSource="table.dataSource"
        :locale="{ emptyText: '暂无数据' }"
      >
        <template slot="organName" slot-scope="text">
          <tooltip-text width="250" :text="text" />
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
import SearchContainer from '@/views/common/SearchContainer';
import TreeSelect from '@/views/common/treeSelect';
import { utils } from '@/utils/utils';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import noDataTips from '@/components/noDataTips';
import segiIcon from '@/components/segiIcon.vue';
import TooltipText from '../../common/TooltipText';

const allStyle = { width: '140px', marginRight: '10px' };
let columns = [
  {
    title: '权属单位',
    dataIndex: 'organName',
    width: '250px',
    scopedSlots: { customRender: 'organName' },
    fixed: 'left',
  },
  {
    title: '资产总数',
    dataIndex: 'assetCount',
    width: '100px',
  },
  {
    title: '资产面积(㎡)',
    dataIndex: 'assetArea',
    width: '150px',
  },
  {
    title: '权证总面积(㎡)',
    dataIndex: 'ownerShipTotalArea',
    width: '150px',
  },
  {
    title: '办理进度',
    dataIndex: 'progressName',
    width: '100px',
  },
  {
    title: '所有权',
    dataIndex: 'goodsTypeNames',
    children: [
      {
        title: '总数',
        dataIndex: 'ownerShipCount',
        width: '100px',
      },
      {
        title: '总面积(㎡)',
        dataIndex: 'ownerShipArea',
      },
      {
        title: '有证',
        dataIndex: 'ownerShipYesCount',
        width: '80px',
      },
      {
        title: '有证面积(㎡)',
        dataIndex: 'ownerShipYesArea',
      },
      {
        title: '无证',
        dataIndex: 'ownerShipNoCount',
        width: '80px',
      },
      {
        title: '无证面积(㎡)',
        dataIndex: 'ownerShipNoArea',
      },
      {
        title: '待办证',
        dataIndex: 'ownerShipWaitCount',
        width: '80px',
      },
      {
        title: '待办证面积(㎡)',
        dataIndex: 'ownerShipWaitArea',
      },
    ],
  },
  {
    title: '使用权',
    dataIndex: 'wsPrice',
    children: [
      {
        title: '总数',
        dataIndex: 'useShipCount',
        width: '80px',
      },
      {
        title: '总面积(㎡)',
        dataIndex: 'useShipArea',
      },
      {
        title: '有证',
        width: '80px',
        dataIndex: 'useShipYesCount',
      },
      {
        title: '有证面积(㎡)',
        dataIndex: 'useShipYesArea',
      },
      {
        title: '无证',
        width: '80px',
        dataIndex: 'useShipNoCount',
      },
      {
        title: '无证面积(㎡)',
        dataIndex: 'useShipNoArea',
      },
      {
        title: '待办证',
        width: '80px',
        dataIndex: 'useShipWaitCount',
      },
      {
        title: '待办证面积(㎡)',
        dataIndex: 'useShipWaitArea',
      },
    ],
  },
  {
    title: '暂无权属',
    dataIndex: 'noOwnership',
    children: [
      {
        title: '数量',
        dataIndex: 'noShipCount',
      },
      {
        title: '面积(㎡)',
        dataIndex: 'noShipCountArea',
      },
    ],
  },
];
const queryCondition = {
  organId: '',
  assetType: '', // 资产类型，多个用，分隔
  pageNum: 1,
  pageSize: 10,
};
export default {
  components: {
    SearchContainer,
    TreeSelect,
    segiIcon,
    noDataTips,
    TooltipText,
  },
  data() {
    return {
      allStyle,
      ASSET_MANAGEMENT,
      queryCondition: { ...queryCondition },
      assetTypeData: [{ label: '全部资产类型', value: '' }],
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0,
      },
      totalTableRow: {}, // 汇总数据行
    };
  },
  mounted() {
    this.platformDictFn('asset_type');
  },
  methods: {
    async query() {
      await this.organViewTotal();
      let data = {
        ...this.queryCondition,
        assetTypes: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '', // 资产类型id(多个用，分割)
      };
      delete data.assetType;
      this.table.loading = true;
      this.$api.ownership.organView(data).then(
        (res) => {
          this.table.loading = false;
          if (res.data.code === '0') {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map((item) => {
              item.progressName = String(item.progress) ? item.progress : '';
              return {
                key: utils.getUuid(),
                ...item,
              };
            });
            this.table.dataSource.push({ ...this.totalTableRow });
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
    // 请求汇总
    organViewTotal() {
      let data = {
        organId: this.queryCondition.organId,
        assetTypes: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '', // 资产类型id(多个用，分割)
      };
      return this.$api.ownership.organViewTotal(data).then((res) => {
        if (res.data.code === '0') {
          let result = res.data.data || {};
          let areaKey = ['assetArea', 'ownerShipTotalArea', 'ownerShipArea', 'useShipYesArea', 'useShipNoArea', 'useShipWaitArea', 'noShipCountArea'];
          Object.keys(result).forEach((key) => {
            if (areaKey.includes(key)) {
              result[key] = result[key] ? Math.round(result[key] * 10000) / 10000 : 0;
            }
          });
          this.totalTableRow = {
            ...result,
            key: utils.getUuid(),
            organName: '全部汇总',
            progressName: result.progress,
          };
        } else {
          this.$message.error(res.data.message || res.data.msg);
        }
      });
    },

    // 资产类型发生变化
    changeAssetType(value) {
      this.$nextTick(function () {
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeData);
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
      let data = {
        ...this.queryCondition,
        assetTypes: this.queryCondition.assetType.length > 0 ? this.queryCondition.assetType.join(',') : '', // 资产类型id(多个用，分割)
      };
      delete data.assetType;
      delete data.pageNum;
      delete data.pageSize;
      this.$api.ownership.organViewExport(data).then((res) => {
        let blob = new Blob([res.data]);
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `组织机构权属表.xls`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    },
    // 处理多选下拉框有全选时的数组
    handleMultipleSelectValue(value, data, dataOptions) {
      // 如果选的是全部
      if (value === '') {
        data = [''];
      } else {
        let totalIndex = data.indexOf('');
        if (totalIndex > -1) {
          data.splice(totalIndex, 1);
        } else {
          // 如果选中了其他选项加起来就是全部的话就直接勾选全部一项
          if (data.length === dataOptions.length - 1) {
            data = [''];
          }
        }
      }
      return data;
    },
    // 平台字典获取变动类型
    platformDictFn(str) {
      let obj = {
        code: str,
      };
      this.$api.assets.platformDict(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          if (str === 'asset_type') {
            this.assetTypeData = [
              { label: '全部资产类型', value: '' },
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
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  },
};
</script>
<style lang="less" scoped>
/deep/.ant-table-tbody {
  tr:nth-last-child(1) {
    position: sticky;
    bottom: 0;
    background: #fff;
  }
}
.custom-table {
  padding-bottom: 55px;
  & /deep/ .ant-table {
    .ant-table-thead th {
      white-space: nowrap;
    }
    tr:last-child {
      height: 151px !important;
      font-weight: bold;
    }
  }
  /deep/.ant-table-fixed {
    padding: 9px 0 6px 0px;
    background-color: #fff;
    color: #49505e;
  }
}
/deep/ .ant-table-header {
  height: 100% !important;
}
</style>

<style lang="less">
.eliminate-table {
  & /deep/ .ant-table {
    .ant-table-thead {
      tr:nth-of-type(2) {
        th:first-child {
          padding-left: 6px !important;
        }
        td:first-child {
          padding-left: 6px !important;
        }
        td:last-child {
          padding-left: 6px !important;
        }
      }
    }
  }
}
</style>
