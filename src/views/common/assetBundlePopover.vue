<!--
  organId: 组织机构id
  projectId: 项目id
  queryType: 查询类型 1 资产变动，2 资产清理 3权属登记
  redactCheckedDataFn()    // 外层删除后给回来的数据调这个方法 this.$refs.assetBundlePopover.redactCheckedDataFn(this.checkedData)
  this.$refs.assetBundlePopover.show = true    // 弹窗控制
-->
<template>
  <SG-Modal class="assetBundlePopover" width="1030px" v-model="show" title="选择资产" @ok="statusFn" @cancel="handleCancel">
    <div>
      <Cephalosome :rightCol="23" :leftCol="1" class="cephalosome" rowHeight="48px">
        <!-- <SG-Button slot="col-l" type="primary" :disabled="selectedRowKeys.length <= 0">导出</SG-Button> -->
        <div slot="col-r">
          <a-select
            :style="allStyle"
            :filterOption="filterOption"
            :disabled="!projectIdMultiple"
            placeholder="全部资产项目"
            v-model="selecData.projectId"
            :mode="projectIdMultiple ? 'multiple' : 'default'"
            :maxTagCount="1"
            :maxTagTextLength="8"
          >
            <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <a-select :style="allStyle" placeholder="全部资产类型" v-model="selecData.assetType" @change="assetTypeFn" :disabled="assetTypeDisabled">
            <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <EquipmentSelectTree
            v-if="isSelectedEquipment"
            :style="allStyle"
            :top-organ-id="organId"
            v-model="selecData.objectType"
            :options-data-format="
              (data) => {
                return [{ label: '全部资产分类', value: '', isLeaf: true }, ...data];
              }
            "
          />
          <a-select v-else :style="allStyle" placeholder="全部资产类别" v-model="selecData.objectType">
            <a-select-option :title="item.name" v-for="(item, index) in objectTypeData" :key="index" :value="item.value">{{
              item.name
            }}</a-select-option>
          </a-select>
          <a-select :style="allStyle" :maxTagCount="1" placeholder="资产状态" v-model="selecData.multiStatus" @change="statusChange" mode="multiple">
            <a-select-option :title="item.title" v-for="(item, index) in statusData" :key="index" :value="item.value">{{
              item.title
            }}</a-select-option>
          </a-select>
          <a-input :style="allStyle" v-model="selecData.assetNameCode" placeholder="资产名称/编码" />
          <SG-Button type="primary" @click="query">查询</SG-Button>
        </div>
      </Cephalosome>
      <div class="tab-nav">
        <div class="table-border table-layout-fixed">
          <a-table
            rowKey="assetId"
            :scroll="{ y: 450 }"
            :rowSelection="rowSelection"
            :loading="loading"
            :columns="columns"
            :dataSource="tableData"
            size="middle"
            :pagination="false"
          >
          </a-table>
          <no-data-tips v-show="tableData.length === 0"></no-data-tips>
          <SG-FooterPagination
            ref="footerPagination"
            class="sg-footer"
            :pageLength="selecData.pageSize"
            :totalCount="count"
            :noPageTools="noPageTools"
            v-model="selecData.pageNum"
            @change="handleChange"
          />
        </div>
      </div>
    </div>
  </SG-Modal>
</template>

<script>
import Cephalosome from '@/components/Cephalosome';
import { utils } from '@/utils/utils.js';
import noDataTips from '@/components/noDataTips';
import EquipmentSelectTree from '@/views/common/EquipmentSelectTree';
const columns = [
  {
    title: '资产编码',
    dataIndex: 'assetCode',
  },
  {
    title: '资产名称',
    dataIndex: 'assetName',
  },
  {
    title: '所属机构',
    dataIndex: 'organName',
  },
  {
    title: '资产项目',
    dataIndex: 'projectName',
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
  },
  {
    title: '资产分类',
    dataIndex: 'assetCategoryName',
  },
  {
    title: '所在位置',
    dataIndex: 'address',
  },
  {
    title: '资产状态',
    dataIndex: 'assetStatusName',
  },
  // {
  //   title: '配套数量',
  //   dataIndex: 'approvalStatusName'
  // }
];
export default {
  components: { Cephalosome, noDataTips, EquipmentSelectTree },
  props: {
    organId: {
      type: [String, Number],
      default: '',
    },
    queryType: {
      type: [String, Number],
      default: '',
    },
    changeType: {
      type: Boolean,
      default: false,
    },
    judgmentType: {
      type: String,
      default: '',
    },
    projectIdMultiple: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      firstCall: true,
      columns,
      loading: false,
      noPageTools: false,
      location: 'absolute',
      count: '',
      projectData: [],
      assetTypeData: [
        {
          name: '全部资产类型',
          value: '',
        },
      ],
      objectTypeData: [],
      statusData: [
        {
          title: '全部资产状态',
          value: 'all',
        },
        { title: '待入库', value: '0' },
        { title: '正常', value: '1' },
        { title: '报废', value: '2' },
        { title: '已转让', value: '3' },
        { title: '报损', value: '4' },
        { title: '入库中', value: '7' },
      ],
      allStyle: 'width: 140px; margin-right: 10px; height: 32px;',
      show: false,
      assetTypeDisabled: false,
      selecData: {
        assetType: '', // 资产类型
        objectType: '', // 资产类别
        multiStatus: ['1'],
        assetNameCode: '', // 资产名称/编码
        queryType: this.queryType, // 查询类型 1 资产变动，2 资产清理 3权属登记
        projectId: undefined, // 资产项目ID
        pageSize: 10,
        pageNum: 1,
      },
      tableData: [],
      selectedRowKeys: [],
      overallData: [],
    };
  },
  computed: {
    rowSelection() {
      const { selectedRowKeys } = this;
      return {
        selectedRowKeys,
        onChange: this.onSelectChange,
        hideDefaultSelections: true,
        onSelection: this.onSelection,
      };
    },
    isSelectedEquipment() {
      const assetTypeArr = [this.selecData.assetType];
      return assetTypeArr.length === 1 && assetTypeArr[0] === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    },
  },
  watch: {
    'selectedData.projectId'() {
      this.query();
    },
  },
  methods: {
    // 搜索过滤选项
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    // 全选与其他选项互斥处理
    statusChange(value) {
      let lastIndex = value.length - 1;
      this.selecData.multiStatus = value[lastIndex] === 'all' ? ['all'] : value.filter((m) => m !== 'all');
    },
    // 选中的
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 提交返回数据
    statusFn() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请先选择资产');
        return;
      }
      let checkedData = [];
      let rowsData = [];
      this.selectedRowKeys.forEach((item) => {
        this.overallData.forEach((element) => {
          if (item === element.assetId) {
            checkedData.push(element.assetId);
            rowsData.push(element);
          }
        });
      });
      this.$emit('status', checkedData, rowsData);
    },
    // 外面删除了后剩下给回来的数据
    redactCheckedDataFn(redactChecked, projectId, assetType, overallData) {
      // overallData 给回来的数据合并在去重
      this.loading = false;
      console.log(redactChecked, projectId, assetType, overallData);
      if (overallData && overallData.length !== 0) {
        let arrData = [...this.overallData, ...overallData];
        let hash = {};
        arrData = arrData.reduce((preVal, curVal) => {
          hash[curVal.assetId] ? '' : (hash[curVal.assetId] = true && preVal.push(curVal));
          return preVal;
        }, []);
        // 存着全部数据
        this.overallData = arrData;
      }

      let flag = false; // 搜索条件有变化
      // 项目变化
      if (projectId && this.selecData.projectId !== projectId) {
        this.selecData.projectId = projectId;
        flag = true;
      }
      // 资产类型变化
      console.log(this.selecData);
      if (typeof assetType !== 'undefined' && this.selecData.assetType !== assetType) {
        flag = true;
        this.selecData.assetType = assetType;
        if (!this.projectIdMultiple) {
          this.assetTypeDisabled = true;
        }
        this.assetTypeFn();
      }
      // 是否第一次加载
      if (this.firstCall) {
        flag = true;
        this.firstCall = false;
      }
      // 是否发起请求
      if (flag) {
        this.query();
      }
      // if (this.selecData.projectId !== projectId) {
      //   this.selecData.projectId = projectId
      //   this.query()
      // }
      // if (typeof assetType !== 'undefined' && this.selecData.assetType !== assetType) {
      //   this.selecData.assetType = assetType
      //   this.assetTypeDisabled = true
      //   this.assetTypeFn()
      //   this.query()
      // }
      this.$nextTick(() => {
        this.selectedRowKeys = redactChecked;
      });
      // if (this.firstCall) {
      //   this.query()
      //   this.firstCall = false
      // }
    },
    // 关闭弹窗
    handleCancel() {
      this.show = false;
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.organId,
        projectName: '',
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let arr = [];
          data.forEach((item) => {
            arr.push({
              name: item.projectName,
              value: item.projectId,
            });
          });
          this.projectData = [...this.projectData, ...arr];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产分类列表
    getListFn() {
      let obj = {
        organId: this.organId,
        assetType: this.selecData.assetType,
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
              name: '全部资产类别',
              value: '',
            },
          ];
          this.objectTypeData = [...atr, ...arr];
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
          if (str === 'asset_type') {
            this.assetTypeData = [...this.assetTypeData, ...data];
          }
          // this.getListFn()
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产类型
    assetTypeFn() {
      this.selecData.objectType = '';
      this.getListFn();
    },
    query() {
      this.loading = true;
      let obj = {
        organId: this.organId,
        queryType: Number(this.queryType), // 查询类型 1 资产变动，2 资产清理 3权属登记
        ...this.selecData,
      };
      obj.multiStatus = obj.multiStatus.includes('all') ? '0,1,2,3,4,7' : obj.multiStatus.join(',');
      if (this.projectIdMultiple) {
        obj.projectIds = obj.projectId && obj.projectId.toString();
        delete obj.projectId;
      }
      if (this.changeType && !obj.assetType) {
        this.loading = false;
        return;
      }

      this.$api.assets.assetListPage(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          if (data) {
            let arrData = utils.deepClone(this.overallData);
            data.forEach((element) => {
              element.key = element.assetId;
              element.remark = ''; // 处置备注
              if (this.judgmentType === 'delivery') {
                element.deliveryArea = ''; // 交付面积
              }
              if (this.judgmentType === 'register') {
                element.objectTypeName = element.assetCategoryName;
                element.oldWarrantNbr = element.warrantNbr;
                element.warrantNbr = undefined;
                element.warrantNbrData = []; // 用于存储单个下拉框数据
                element.warrantGeneralData = []; // 用于存权证号总是数据
              } else {
                element.oldOriginalValue = element.originalValue;
                element.newOriginalValue = ''; // 变动后原值
                element.transferArea = ''; // 交付物业面积
                element.transferOperationArea = ''; // 交付运营面积
                element.addressName = ''; // 变动后位置
                element.changeProjectId = ''; // 变动后资产项目
                element.oldWarrantNbr = element.warrantNbr;
                element.warrantNbr = undefined;
                element.warrantNbrData = []; // 用于存储单个下拉框数据
                element.warrantGeneralData = []; // 用于存权证号总是数据
                element.disposeCost = ''; // 处置成本
                element.disposeReceive = ''; // 处置收入
              }
              arrData.push(element);
            });
            this.tableData = data;
            this.count = res.data.data.count;
            // 遍历相同的对象
            this.$nextTick(() => {
              let hash = {};
              arrData = arrData.reduce((preVal, curVal) => {
                hash[curVal.assetId] ? '' : (hash[curVal.assetId] = true && preVal.push(curVal));
                return preVal;
              }, []);
              // 存着全部数据
              this.overallData = arrData;
            });
          } else {
            this.data = [];
          }
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
      // 添加可以选择不同数量分页
      this.$nextTick(function () {
        let arr = this.$refs.footerPagination.pageLists;
        if (!arr.includes(200)) {
          this.$refs.footerPagination.pageLists = [10, 20, 30, 50, 100, 200];
        }
      });
    },
    // 分页查询
    handleChange(data) {
      this.selecData.pageNum = data.pageNo;
      this.selecData.pageSize = data.pageLength;
      this.query();
    },
  },
  created() {},
  mounted() {
    this.getObjectKeyValueByOrganIdFn();
    // 资产类型
    this.platformDictFn('asset_type');
    // this.$nextTick( function () {
    //   console.log(this.$refs['footerPagination'])
    //   this.$refs.footerPagination.pageLists = [10, 20, 30, 50, 100, 200]
    // })
  },
};
</script>
<style lang="less" scoped>
.assetBundlePopover {
  .tab-nav {
    margin-top: 10px;
  }
  .cephalosome {
    margin: 0;
  }
  .sg-footer {
    border-top: none;
  }
  .ant-select:first-of-type {
    width: 160px !important;
  }
}
</style>
