<!--
 * @Date: 2019-11-28 14:41:27
 * @Author: chen han
 * @Description: 权属概况->资产项目->有证详情
 -->
 <template>
  <!-- 表格部分 -->
  <div class="table-layout-fixed detail-table">
    <a-table
      class="custom-table td-pd10"
      :loading="table.loading"
      :pagination="false"
      :columns="table.columns"
      :dataSource="table.dataSource"
      :locale="{emptyText: '暂无数据'}"
    >
      <template slot="settingMethod" slot-scope="text, record">
        <span v-if="type==='detail'">{{record.settingMethodName}}</span>
        <div v-else>
          <a-select
            :style="{width: '100%'}"
            @change="watchSettingMethodChange($event,record)"
            optionFilterProp="children"
            :options="seletOpt"
            :allowClear="false"
            v-model="record.settingMethod"
          />
        </div>
      </template>
      <template slot="remark" slot-scope="text, record">
        <span v-if="type==='detail'">{{record.remark}}</span>
        <div v-else>
          <a-input :maxLength="200" @input="watchRemarkChange($event,record)" v-model="record.remark" />
        </div>
      </template>
    </a-table>
    <no-data-tips class="noTipStyle" v-show="table.dataSource.length === 0"></no-data-tips>
    <SG-FooterPagination
      :pageLength="queryCondition.pageSize"
      :totalCount="table.totalCount"
      location="absolute"
      v-model="queryCondition.pageNum"
      @change="handleChange"
    />
  </div>
</template>
 <script>
import noDataTips from "@/components/noDataTips";
let getUuid = ((uuid = 1) => () => ++uuid)();
let queryCondition = {
  pageSize: 10,
  pageNum: 1,
  ownershipStatus: 1
};
let seletOpt = [{ label: "无", value: 3 }, { label: "换证", value: 4 }];
// 表格数据
let columns = [
  {
    title: "资产名称",
    dataIndex: "assetName",
    width: "20%"
  },
  {
    title: "资产编码",
    dataIndex: "assetCode",
    width: "15%"
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    width: "10%"
  },
  {
    title: "资产项目名称",
    dataIndex: "projectName",
    width: "15%"
  },
  {
    title: "所在位置",
    dataIndex: "location",
    width: "20%"
  },
  {
    title: "面积(㎡)",
    dataIndex: "area",
    width: "10%"
  },
  {
    title: "权证号",
    dataIndex: "warrantNbr",
    width: "10%"
  },
  {
    title: "权利人",
    dataIndex: "obligeeName",
    width: "10%"
  },
  {
    title: "权属办理设置",
    dataIndex: "settingMethod",
    scopedSlots: { customRender: "settingMethod" },
    width: "120px"
  },
  {
    title: "备注",
    dataIndex: "remark",
    scopedSlots: { customRender: "remark" },
    width: "150px"
  }
];
export default {
  components: {
    noDataTips
  },
  props: {
    type: {
      default: "detail"
    },
    projectId: {
      default: ""
    },
    scrollHeight: {
      default: () => ({ y: "auto" })
    }
  },
  data() {
    return {
      seletOpt,
      queryCondition: { ...queryCondition },
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0
      }
    };
  },
  mounted() {
    this.query();
  },
  methods: {
    query() {
      let data = {
        ...this.queryCondition,
        projectId: this.projectId
      };
      this.table.loading = true;
      this.$api.basics.attrList(data).then(
        res => {
          this.table.loading = false;
          if (res.data.code === "0") {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map(item => {
              item.settingMethod = item.settingMethod || 3; // 默认无
              item.area = item.area || "--";
              item.assetTypeName = item.assetTypeName || "--";
              item.assetCode = item.assetCode || "--";
              item.location = item.location || "--";
              item.warrantNbr = item.warrantNbr || "--";
              item.obligeeName = item.obligeeName || "--";
              if (this.type !== "set") {
                item.remark = item.remark || "--";
                item.settingMethodName = item.settingMethodName || "无";
              }
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
          this.table.loading = true;
        }
      );
    },
    // 监听选择框变化
     watchSettingMethodChange (e, row) {
      console.log('记录select=>', e, row)
      let o = {
        settingMethod: Number(e),
        remark: row.remark || '',
        assetType: row.assetType,
        assetObjectId: row.assetHouseId
      }
      this.$emit('change', o)
     },
     // 监听输入框变化
     watchRemarkChange (e, row) {
       console.log('记录input=>', e, row)
       let o = {
          settingMethod: Number(row.settingMethod),
          remark: row.remark || '',
          assetType: row.assetType,
          assetObjectId: row.assetHouseId
        }
        this.$emit('change', o)
     },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    }
  }
};
</script>
 <style lang="less" scoped>
.detail-table {
  position: relative;
  border: 1px solid rgba(238, 242, 245, 1);
  border-top: none;
  min-height: 140px;
  padding-bottom: 50px;
}
.noTipStyle {
  padding: 20px 0;
}
</style>
