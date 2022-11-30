<!--组织机构视图业务-列表页面-->
<template>
  <div>
    <!--搜索条件-->
    <div style="padding: 20px 30px">
      <a-row :gutter="8">
        <a-col :span="12">
          <SG-Button
            icon="import"
            type="primary"
            @click="handleExport"
            v-power="ASSET_MANAGEMENT.LAND_ORGAN_EXPORT"
            :loading="exportBtnLoading"
          >导出组织机构视图</SG-Button>
        </a-col>
        <a-col :span="5">
          <tree-select @changeTree="changeTree" style="width: 100%" :multiple="true" :treeCheckable="true"/>
        </a-col>
        <a-col :span="5">
          <a-select
            v-model="statusList"
            mode="multiple"
            :maxTagCount="1"
            style="width: 100%"
            placeholder="请选择资产状态"
            :options="$addTitle(statusListOpt)"
          />
        </a-col>
        <a-col :span="2">
          <SG-Button icon="search" type="primary" @click="queryTableData({type: 'search'})">查询</SG-Button>
        </a-col>
      </a-row>
    </div>
    <!--概览-->
    <a-spin :spinning="overviewNumSpinning">
      <overview-number :numList="numList" isEmit @click="handleClickOverview" />
    </a-spin>
    <!--列表部分-->
    <a-table v-bind="tableObj" class="custom-table td-pd10">
      <span slot="action" slot-scope="text, record">
        <span v-if="!record.totalRow" style="color: #0084FF; cursor: pointer" @click="handleViewDetail(record)">详情</span>
      </span>
    </a-table>
    <no-data-tip v-if="!tableObj.dataSource.length" />
    <SG-FooterPagination
      v-bind="paginationObj"
      @change="({ pageNo, pageLength }) => queryTableData({ pageNo, pageLength })"
    />
  </div>
</template>

<script>
import { ASSET_MANAGEMENT } from "@/config/config.power";
import NoDataTip from "src/components/noDataTips";
import TreeSelect from "src/views/common/treeSelect";
import OverviewNumber from "src/views/common/OverviewNumber";
export default {
  name: "index",
  components: { OverviewNumber, NoDataTip, TreeSelect },
  data() {
    return {
      ASSET_MANAGEMENT,
      organName: "",
      organId: "", // 查询条件-组织机构
      exportBtnLoading: false, // 导出按钮loading
      overviewNumSpinning: false, // 查询视图面积概览数据loading
      numList: [
        { title: "全部资产(㎡)", key: "landArea", value: 0, fontColor: "#324057" },
        {
          title: "运营(㎡)",
          key: "transferOperationArea",
          value: 0,
          bgColor: "#4BD288",
        },
        { title: "闲置(㎡)", key: "idleArea", value: 0, bgColor: "#1890FF" },
        {
          title: "自用(㎡)",
          key: "selfUserArea",
          value: 0,
          bgColor: "#DD81E6",
        },
        {
          title: "占用(㎡)",
          key: "occupationArea",
          value: 0,
          bgColor: "#FD7474",
        },
        { title: "其他(㎡)", key: "otherArea", value: 0, bgColor: "#BBC8D6" },
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
      tableObj: {
        scroll: {y: 420},
        dataSource: [],
        loading: false,
        pagination: false,
        rowKey: "organId",
        columns: [
          { title: "管理机构", dataIndex: "organName" },
          { title: "土地面积(㎡)", dataIndex: "landArea" },
          { title: "土地数量", dataIndex: "landCount" },
          { title: "运营(㎡)", dataIndex: "transferOperationArea" },
          { title: "自用(㎡)", dataIndex: "selfUserArea" },
          { title: "闲置(㎡)", dataIndex: "idleArea" },
          { title: "占用(㎡)", dataIndex: "occupationArea" },
          { title: "其它(㎡)", dataIndex: "otherArea" },
          { title: "资产原值", dataIndex: "originalValue" },
          { title: "最新估值", dataIndex: "marketValue" },
          { title: '操作', key: 'action', scopedSlots: { customRender: 'action' }, width: 60}
        ],
      },
      paginationObj: {
        pageNo: 1,
        totalCount: 0,
        pageLength: 10,
        location: "absolute",
      },
      sumObj: {
        organName: "",
        landArea: "",
        landCount: "",
        transferOperationArea: "",
        selfUserArea: "",
        idleArea: "",
        occupationArea: "",
        otherArea: "",
        originalValue: "",
        marketValue: "",
      }, // 求和用的对象
      current: null, // 当前选中的概览区域下标，与后台入参一一对应
      statusList: [], // 资产分类
      statusListOpt: [
        { title: "全部状态", key: "all" },
        { title: "待入库", key: "0" },
        { title: "正常", key: "1" },
        { title: "报废", key: "2" },
        { title: "转让", key: "3" },
        { title: "报损", key: "4" },
        { title: '入库中', key: '7' }
      ],
    };
  },
  watch: {
    // 全选与其他选项互斥处理
    statusList: function (val) {
      if (val && val.length !== 1 && val.includes("all")) {
        this.statusList = ["all"];
      }
    },
  },
  methods: {
    // 点击总览数据块
    handleClickOverview({ i }) {
      this.current = i;
      this.queryTableData({ type: "" });
    },

    // 查看组织机构视图详情
    handleViewDetail(record) {
      let query = {
        organId: record.organId,
        statusList: this.statusList.includes('all') ? [] : this.statusList
      }
      this.$router.push({ path: '/landOrganView/detail', query: query || {} });
    },

    // 查询列表数据
    queryTableData({ pageNo = 1, pageLength = 10, type }) {
      const { sumObj, organId, current, statusList } = this;
      if (!organId) {
        return this.$message.info("请选择组织机构");
      }
      this.tableObj.loading = true;
      this.$api.land
        .organView({
          organIds: organId.toString(),
          pageSize: pageLength,
          pageNum: pageNo,
          flag: current ? current - 1 : "",
          statusList: statusList.includes("all") ? [] : statusList,
        })
        .then(({ data: res }) => {
          this.tableObj.loading = false;
          if (res && String(res.code) === "0") {
            const { count, data } = res.data;
            let pageSum = {};
            /**
             * 面积类最多保留4位小数，金额类、百分数最多保留2位小数，数量类为整数，全都不补零
             * 数量：landCount, 金额：originalValue marketValue, 
             */
            data.forEach((item, index) => {
              item.key = index;
              Object.keys(sumObj).forEach(key => {
                !pageSum[key] && (pageSum[key] = 0)
                pageSum[key] += item[key] ?
                  (['landCount'].includes(key) ?
                    Number(item[key]) : ['originalValue', 'marketValue'].includes(key) ? Math.round(item[key]*100)/100 : Math.round(item[key]*10000)/10000)
                    : 0
                if (index === data.length - 1) {
                  pageSum[key] = ['buildNum'].includes(key) ?
                    pageSum[key] : ['originalValue', 'marketValue'].includes(key) ? Math.round(pageSum[key]*100)/100 : Math.round(pageSum[key]*10000)/10000
                }
              })
            });
            this.tableObj.dataSource = data.length
              ? data.concat({
                  ...pageSum,
                  organName: "本页合计",
                  organId: "-999",
                  totalRow: true
                })
              : [];
            // 查询楼栋面积统计数据
            if (type !== "search") {
              data.length &&
                this.tableObj.dataSource.push({
                  ...sumObj,
                  organName: "全部合计",
                  organId: Date.now(),
                  totalRow: true
                });
            } else {
              this.queryAreaInfo();
            }
            return Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo,
              pageLength,
            });
          }
          throw res.message;
        })
        .catch((err) => {
          this.tableObj.loading = false;
          this.$message.error(err || "查询列表接口出错");
        });
    },

    // 查询组织机构视图面积概览数据
    queryAreaInfo() {
      let {
        organId,
        numList,
        tableObj: { dataSource },
        current,
        sumObj,
        statusList,
      } = this;
      this.overviewNumSpinning = true;
      this.$api.land
        .organViewTotal({
          organIds: organId.toString(),
          flag: current ? current - 1 : "",
          statusList: statusList.includes("all") ? [] : statusList,
        })
        .then(({ data: res }) => {
          this.overviewNumSpinning = false;
          if (res && String(res.code) === "0") {
            let obj = {};
            let list = res.data || {};
            Object.keys(sumObj).forEach(
              (key) => (obj[key] = list[key] ?
                (['landCount'].includes(key) ?
                  list[key] : (['originalValue', 'marketValue'].includes(key) ?
                    Math.round(list[key]*100)/100 : Math.round(list[key]*10000)/10000)) : 0)
            );
            this.sumObj = obj;
            dataSource.length &&
              this.tableObj.dataSource.push({
                ...obj,
                organName: "全部合计",
                organId: Date.now(),
                totalRow: true
              });
            return (this.numList = numList.map((m) => {
              return { ...m, value: list[m.key] ? Math.round(list[m.key]*10000)/10000 : 0 };
            }));
          }
          throw res.message;
        })
        .catch((err) => {
          this.overviewNumSpinning = false;
          this.$message.error(err || "查询组织机构视图面积统计出错");
        });
    },

    // 导出数据
    handleExport() {
      this.exportBtnLoading = true;
      const { organId, current } = this;
      this.$api.land
        .organViewExport({
          organIds: organId.toString(),
          flag: current ? current - 1 : "",
          pageSize: 1,
          pageNum: 1,
        })
        .then((res) => {
          this.exportBtnLoading = false;
          if (res.status === 200 && res.data && res.data.size) {
            let a = document.createElement("a");
            a.href = URL.createObjectURL(new Blob([res.data]));
            a.download = "组织机构视图导出列表.xls";
            a.style.display = "none";
            document.body.appendChild(a);
            a.click();
            return a.remove();
          }
          throw res.message || "导出组织机构视图失败";
        })
        .catch((err) => {
          this.exportBtnLoading = false;
          this.$message.error(err || "导出组织机构视图失败");
        });
    },

    // 获取选择的组织机构
    changeTree(organId, name) {
      this.organName = name;
      this.organId = organId;
      organId && this.queryTableData({ type: "search" });
    },
  },

  created() {},
};
</script>

<style lang='less' scoped>
.custom-table {
  padding-bottom: 55px;
  /*if you want to set scroll: { x: true }*/
  /*you need to add style .ant-table td { white-space: nowrap; }*/
  & /deep/ .ant-table {
    .ant-table-thead th {
      white-space: nowrap;
    }
    tr:last-child,
    tr:nth-last-child(2) {
      font-weight: bold;
    }
  }
}
/deep/.ant-table-tbody {
  tr:nth-last-child(1){
    position: sticky;
    bottom: 4px;
    background: #fff;
  }
  tr:nth-last-child(2){
    position: sticky;
    bottom: 43px;
    background: #fff;
  }
}
</style>
