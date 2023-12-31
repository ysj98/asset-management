<!--
  关联资产弹窗
  judgeInstitutions: 用于判断是否展示组织机构树
  呈报计划选择项目
-->
<template>
  <SG-Modal width="1030px" v-model="show" title="选择资产项目" class="associate-asset-modal" @ok="submitAsset" @cancel="handleCancel">
    <div>
      <a-tabs @change="changeTab" type="card" v-model="defaultActiveKey" :tabBarGutter="10">
        <a-tab-pane tab="待选资产项目" key="1">
          <div class="tab-container">
            <Cephalosome :rightCol="23" :leftCol="1" class="Cephalosome" rowHeight="70px">
              <div slot="col-r">
                <primaryTree
                  v-if="!judgeInstitutions"
                  @changeTree="changeTree"
                  :allOrganId="allOrganId"
                  placeholder="请选择组织机构"
                  :allowClear="false"
                  :style="allStyle"
                ></primaryTree>
                <a-input :style="allStyle" v-model="assetNameCode" placeholder="资产项目/编码" />
                <SG-Button type="primary" @click="queryClick">查询</SG-Button>
              </div>
            </Cephalosome>
            <div class="tab-nav">
              <div class="table-border table-layout-fixed">
                <a-table
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
        <a-tab-pane tab="已选资产项目" key="2">
          <div class="tab-container" style="margin-top: 20px">
            <div class="tab-nav">
              <div class="table-border table-layout-fixed">
                <a-table :columns="chosenColumns" :dataSource="chosenDataSource" size="middle" :pagination="false">
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
  </SG-Modal>
</template>

<script>
import Cephalosome from '@/components/Cephalosome';
import { utils } from '@/utils/utils.js';
import primaryTree from './primaryTree';
import noDataTips from '@/components/noDataTips';

const columns = [
  {
    title: '所属机构',
    dataIndex: 'organName',
  },
  {
    title: '资产项目名称',
    dataIndex: 'projectName',
  },
  {
    title: '资产项目编码',
    dataIndex: 'projectCode',
  },
  {
    title: '来源方式',
    dataIndex: 'sourceTypeName',
  },
  {
    title: '来源方式说明',
    dataIndex: 'souceChannelType',
  },
  {
    title: '资产数量',
    dataIndex: 'assetsNum',
  },
];

export default {
  components: {
    Cephalosome,
    primaryTree,
    noDataTips,
  },
  props: {
    judgeInstitutions: {
      type: Boolean,
      default: true,
    },
    allOrganId: {
      type: Array,
      default: () => [],
    },
    selectNumber: {
      type: Number,
      default: 100000,
    },
  },
  data() {
    return {
      defaultActiveKey: '1',
      firstCall: true,
      show: false,
      assetNameCode: '', // 资产名称/编码
      projectId: '', // 资产项目ID
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
      noPageTools: true,
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
  },
  watch: {
    projectId() {
      console.log('projectId发生变化');
      this.query();
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
    },
    changeTab(value) {
      if (+value === 2) {
        let rowsData = [];
        this.selectedRowKeys.forEach((item) => {
          this.overallData.forEach((element, index) => {
            if (item === element.projectId) {
              rowsData.push(element);
            }
          });
        });
        this.chosenDataSource = rowsData;
      }
    },
    // 选中的
    onSelectChange(selectedRowKeys) {
      if (selectedRowKeys.length <= this.selectNumber) {
        this.selectedRowKeys = selectedRowKeys;
      } else {
        this.$message.info(`资产项目选择不能超过${this.selectNumber}个`);
      }
    },
    // 关闭弹窗
    handleCancel() {
      this.show = false;
    },
    // 删除选中的资产
    deleteRecord(record) {
      this.chosenDataSource.forEach((item, index) => {
        if (item.projectId === record.projectId) {
          this.chosenDataSource.splice(index, 1);
        }
      });
      this.selectedRowKeys.forEach((item, index) => {
        if (record.projectId === item) {
          this.selectedRowKeys.splice(index, 1);
        }
      });
    },
    // 提交
    submitAsset() {
      if (this.selectedRowKeys.length <= 0) {
        this.$message.info('请先选择资产项目');
        return;
      }
      let checkedData = [];
      let checkedNames = [];
      let rowsData = [];
      console.log(this.selectedRowKeys, '选中的');
      console.log(this.overallData, '总的');
      this.selectedRowKeys.forEach((item, index) => {
        this.overallData.forEach((element) => {
          if (item === element.projectId) {
            checkedData.push(element.projectId);
            checkedNames.push(element.projectName);
            rowsData.push(element);
          }
        });
      });
      this.$emit('assetChange', checkedData, checkedNames, rowsData);
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
      if (this.paginator.organId === '') {
        return;
      }
      this.loading = true;
      let obj = {
        pageSize: this.paginator.pageLength,
        pageNum: this.paginator.pageNo,
        organId: this.paginator.organId,
        approvalStatusList: [],
        sourceTypeList: [],
        takeOver: '',
        transferToOperation: '',
        projectName: this.assetNameCode, // 模糊查询
        isCurrent: '',
      };
      this.$api.assets.queryProjectManageListPage(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          if (data) {
            let arrData = utils.deepClone(this.overallData);
            data.forEach((element, index) => {
              element.key = element.projectId;
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
                hash[curVal.projectId] ? '' : (hash[curVal.projectId] = true && preVal.push(curVal));
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
    },
    // 外面给回来的数据
    redactCheckedDataFn(redactChecked, overallData) {
      console.log(redactChecked, overallData, '给会');
      // 有组织机构树的时候每次进来都调第一页！为了适应表格选择
      if (!this.judgeInstitutions) {
        this.paginator.pageNo = 1;
        this.query();
        this.defaultActiveKey = '1';
      }
      // overallData 给回来的数据合并在去重
      if (overallData && overallData.length !== 0) {
        let arrData = [...this.overallData, ...overallData];
        let hash = {};
        arrData = arrData.reduce((preVal, curVal) => {
          hash[curVal.projectId] ? '' : (hash[curVal.projectId] = true && preVal.push(curVal));
          return preVal;
        }, []);
        // 存着全部数据
        this.overallData = arrData;
      }
      this.$nextTick(() => {
        this.selectedRowKeys = redactChecked;
      });
      if (this.firstCall) {
        this.query();
        this.firstCall = false;
      }
    },
  },
  mounted() {
    this.chosenColumns = utils.deepClone(columns);
    this.chosenColumns.push({
      title: '操作',
      dataIndex: 'operation',
      scopedSlots: { customRender: 'operation' },
    });
  },
};
</script>

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
