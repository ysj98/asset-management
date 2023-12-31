<!--
  关联资产弹窗
  judgeInstitutions: 用于判断是否展示组织机构树
  盘点任务有共用
-->
<template>
  <SG-Modal
    width="1030px"
    v-model="show"
    title="选择资产"
    class="associate-asset-modal"
    :footer="null"
    :maskClosable="false"
    @ok="submitAsset"
    @cancel="handleCancel"
  >
    <div>
      <a-tabs @change="changeTab" type="card" v-model="defaultActiveKey" :tabBarGutter="10">
        <a-tab-pane tab="待选资产" key="1">
          <div class="tab-container">
            <Cephalosome :rightCol="23" :leftCol="1" class="Cephalosome" rowHeight="70px">
              <div slot="col-r">
                <treeSelect
                  v-if="!judgeInstitutions"
                  @changeTree="changeTree"
                  placeholder="请选择组织机构"
                  :allowClear="false"
                  :style="allStyle"
                ></treeSelect>
                <a-select :style="allStyle" :disabled="judgeInstitutions" placeholder="全部资产项目" v-model="projectId">
                  <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{
                    item.name
                  }}</a-select-option>
                </a-select>
                <a-select :style="allStyle" :disabled="judgeInstitutions" placeholder="全部资产类型" v-model="assetType" @change="assetTypeFn">
                  <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{
                    item.name
                  }}</a-select-option>
                </a-select>
                <EquipmentSelectTree
                  v-if="isSelectedEquipment"
                  :style="allStyle"
                  :top-organ-id="paginator.organId"
                  v-model="objectType"
                  :options-data-format="
                    (data) => {
                      return [{ label: '全部资产类别', value: '', isLeaf: true }, ...data];
                    }
                  "
                />
                <a-select v-else :style="allStyle" placeholder="全部资产类别" v-model="objectType">
                  <a-select-option :title="item.name" v-for="(item, index) in objectTypeData" :key="index" :value="item.value">{{
                    item.name
                  }}</a-select-option>
                </a-select>
                <a-input :style="allStyle" v-model="assetNameCode" placeholder="资产名称/编码" />
                <SG-Button type="primary" @click="queryClick">查询</SG-Button>
              </div>
            </Cephalosome>
            <div class="tab-nav">
              <div class="table-border table-layout-fixed">
                <a-table
                  :scroll="{ y: 450 }"
                  :rowSelection="rowSelection"
                  :loading="loading"
                  :columns="columns"
                  :dataSource="dataSource"
                  size="middle"
                  :pagination="false"
                >
                </a-table>
                <no-data-tips v-show="dataSource.length === 0"></no-data-tips>
                <SG-FooterPagination
                  ref="footerPagination"
                  :pageLength="paginator.pageLength"
                  :totalCount="paginator.totalCount"
                  :noPageTools="noPageTools"
                  v-model="paginator.pageNo"
                  @change="handleChange"
                />
              </div>
            </div>
          </div>
        </a-tab-pane>
        <a-tab-pane tab="已选资产" key="2">
          <div class="tab-container" style="margin-top: 20px">
            <div class="tab-nav">
              <div class="table-border table-layout-fixed">
                <a-table :scroll="{ y: 450 }" :columns="chosenColumns" :dataSource="chosenDataSource" size="middle" :pagination="false">
                  <template slot="operation" slot-scope="text, record">
                    <a class="operation-btn" @click="deleteRecord(record)">删除</a>
                  </template>
                </a-table>
                <no-data-tips v-show="chosenDataSource.length === 0"></no-data-tips>
              </div>
            </div>
          </div>
        </a-tab-pane>
      </a-tabs>
    </div>
    <!-- 底部按钮 -->
    <div class="footer">
      <SG-Button class="footer-button" type="primary" @click="submitAsset">确认选择</SG-Button>
      <SG-Button class="footer-button" type="cancel" @click="handleCancel">取消</SG-Button>
    </div>
  </SG-Modal>
</template>

<script>
import Cephalosome from '@/components/Cephalosome';
import { utils } from '@/utils/utils.js';
import TreeSelect from '../../common/treeSelect';
import noDataTips from '@/components/noDataTips';
import EquipmentSelectTree from '../../common/EquipmentSelectTree';

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
  components: {
    EquipmentSelectTree,
    Cephalosome,
    TreeSelect,
    noDataTips,
  },
  props: {
    judgeInstitutions: {
      type: Boolean,
      default: true,
    },
    organId: {
      type: [String, Number],
      default: '',
    },
    queryType: {
      type: [String, Number],
      default: '',
    },
    typeTask: {
      type: [String, Number],
      default: '',
    },
  },
  data() {
    return {
      defaultActiveKey: '1',
      firstCall: true,
      show: false,
      assetType: '', // 资产类型
      objectType: '', // 资产类别
      assetNameCode: '', // 资产名称/编码
      projectId: '', // 资产项目ID
      projectData: [],
      assetTypeData: [],
      objectTypeData: [{ name: '全部资产类型', value: '' }],
      allStyle: 'width: 140px; margin-right: 10px;',
      columns,
      dataSource: [],
      chosenColumns: [],
      chosenDataSource: [],
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0,
        organId: '',
      },
      loading: false,
      noPageTools: false,
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
      return this.assetType === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    },
  },
  watch: {
    projectId() {
      console.log('projectId发生变化');
      // this.query()
    },
  },
  methods: {
    // 选择组织机构
    changeTree(value, label) {
      this.organName = label;
      this.paginator.organId = value;
      this.paginator.pageNum = 1;
      this.projectId = '';
      this.objectType = '';
      this.query();
      this.getObjectKeyValueByOrganIdFn();
      this.getListFn();
    },
    changeTab(value) {
      if (+value === 2) {
        let rowsData = [];
        this.selectedRowKeys.forEach((item) => {
          this.overallData.forEach((element, index) => {
            if (item === element.assetId) {
              rowsData.push(element);
            }
          });
        });
        this.chosenDataSource = rowsData;
      }
    },
    // 选中的
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 关闭弹窗
    handleCancel() {
      this.show = false;
      this.$emit('handleCancelFn');
    },
    // 删除选中的资产
    deleteRecord(record) {
      this.chosenDataSource.forEach((item, index) => {
        if (item.assetId === record.assetId) {
          this.chosenDataSource.splice(index, 1);
        }
      });
      this.selectedRowKeys.forEach((item, index) => {
        if (record.assetId === item) {
          this.selectedRowKeys.splice(index, 1);
        }
      });
    },
    // 提交
    submitAsset() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请先选择资产');
        return;
      }
      let checkedData = [];
      let checkedNames = [];
      let rowsData = [];
      let extraData = {
        originalValueSum: 0,
        assetType: '',
        assetCategory: '',
        useType: '',
      };
      console.log(this.selectedRowKeys, '选中的');
      console.log(this.overallData, '总的');
      this.selectedRowKeys.forEach((item, index) => {
        this.overallData.forEach((element) => {
          if (item === element.assetId) {
            checkedData.push(element.assetId);
            checkedNames.push(element.assetName);
            rowsData.push(element);
            if (this.judgeInstitutions) {
              extraData.originalValueSum = utils.accAdd(
                parseFloat(extraData.originalValueSum).toFixed(2),
                parseFloat(element.originalValue || '0').toFixed(2)
              );
            }
            if (index === 0) {
              extraData.assetType = element.assetType;
              extraData.assetCategory = element.objectType;
              extraData.useType = element.useType;
            }
          }
        });
      });
      this.$emit('assetChange', checkedData, checkedNames, rowsData, extraData);
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.judgeInstitutions ? this.organId : this.paginator.organId,
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
          // this.projectData = [...this.projectData, ...arr]
          this.projectData = [{ name: '全部资产项目', value: '' }, ...arr];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产分类列表
    getListFn() {
      console.log(this.organId, this.paginator.organId, 'jinlail');
      // 没有organId都不给查分类
      if (!this.organId && !this.paginator.organId) {
        return;
      }
      let obj = {
        organId: this.judgeInstitutions ? this.organId : this.paginator.organId,
        assetType: this.assetType,
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
              name: '全部资产分类',
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
            let arr = [
              {
                name: '全部资产类型',
                value: '',
              },
            ];
            this.assetTypeData = [...arr, ...data];
          }
          this.getListFn();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产类型发生变化
    assetTypeFn() {
      this.objectType = '';
      this.getListFn();
    },
    // 分页查询
    handleChange(data) {
      this.paginator.pageNo = data.pageNo;
      this.paginator.pageLength = data.pageLength;
      this.query();
    },
    queryClick() {
      this.paginator.pageNo = 1;
      this.query();
    },
    query() {
      if (this.typeTask !== 'task' && !this.assetType) {
        return;
      }
      this.loading = true;
      let obj = {
        organId: this.judgeInstitutions ? this.organId : this.paginator.organId,
        projectId: this.projectId, // 资产项目
        assetType: this.assetType, // 资产类型
        objectType: this.objectType, // 资产类别
        assetNameCode: this.assetNameCode, // 资产名称/编码
        queryType: Number(this.queryType), // 查询类型 1 资产变动，2 资产清理 3权属登记
        pageSize: this.paginator.pageLength,
        pageNum: this.paginator.pageNo,
      };
      this.$api.assets.assetListPage(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          if (data) {
            let arrData = utils.deepClone(this.overallData);
            data.forEach((element, index) => {
              element.key = element.assetId;
              element.informant = undefined; // 提交人
              element.informantOpt = [];
              element.informantOptArr = [];
              element.auditor = undefined; // 审核人
              element.auditorOpt = [];
              element.auditorOptArr = [];
              arrData.push(element);
            });
            this.dataSource = data;
            this.paginator.totalCount = res.data.data.count;
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
    // 外面给回来的数据
    redactCheckedDataFn(redactChecked, projectId, overallData, assetType) {
      // 有组织机构树的时候每次进来都调第一页！为了适应表格选择
      // if (!this.judgeInstitutions) {
      //   this.paginator.pageNo = 1
      //   // this.query()
      //   this.defaultActiveKey = '1'
      // }
      // overallData 给回来的数据合并在去重
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
      if (this.judgeInstitutions) {
        let sumRequest = false;
        if (this.projectId !== projectId) {
          sumRequest = true;
          this.projectId = projectId;
        }
        if (this.assetType !== assetType) {
          sumRequest = true;
          this.assetType = assetType;
          this.getListFn();
        }
        if (this.firstCall) {
          sumRequest = true;
          this.firstCall = false;
        }
        if (sumRequest) {
          this.query();
        }
      }
      this.$nextTick(() => {
        this.selectedRowKeys = redactChecked;
      });
    },
  },
  mounted() {
    this.chosenColumns = utils.deepClone(columns);
    this.chosenColumns.push({
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    });
    // 选择项目
    if (this.judgeInstitutions) {
      this.getObjectKeyValueByOrganIdFn();
    }
    // 资产类型
    this.platformDictFn('asset_type');
  },
};
</script>

<style lang="less" scoped>
.footer {
  margin-top: 40px;
  text-align: center;
  .footer-button {
    width: 90px;
    height: 32px;
    font-size: 12px;
  }
  .footer-button + .footer-button {
    margin-left: 12px;
  }
}
</style>

<style lang="less">
.associate-asset-modal {
  /deep/ .ant-modal-body {
    padding: 14px 0;
  }
  /deep/ .ant-tabs-bar {
    margin: 0;
  }
  /deep/ .ant-tabs-nav {
    margin-left: 30px;
  }
  .wrapper {
    margin: 0;
  }
  .tab-container {
    padding: 0 30px;
  }
}
</style>
