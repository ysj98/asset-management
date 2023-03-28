<!-- 资产调拨
调拨（资产调拨是作为同一法律主体的总公司和分公司之间的财产转移）：资产从资产项目A挂到资产项目B。
-->
<template>
  <div class="allot">
    <SearchContainer v-model="showSearchContainer" @input="changeSearchContainer">
      <div slot="headerBtns">
        <SG-Button @click="btnAddFn" icon="plus" type="primary" style="margin-right: 8px" v-power="ASSET_MANAGEMENT.asset_allot_add">
          新增资产调拨单
        </SG-Button>
        <!-- <SG-Button icon="export" v-power="ASSET_MANAGEMENT.asset_allot_export" :loading="exportBtnLoading"> 导出 </SG-Button> -->
      </div>
      <div slot="headerForm">
        <TreeSelect
          style="width: 200px; margin-right: 10px"
          placeholder="请选择组织机构"
          :allowClear="false"
          :value="organId"
          search
          @changeTree="changeTree"
        />
      </div>
      <div slot="contentForm" class="contentForm">
        <div class="contentForm-main">
          <!-- 全部资产项目 -->
          <a-select
            style="width: 200px; margin-right: 10px"
            showSearch
            placeholder="请选择资产项目"
            v-model="queryForm.projectIds"
            @change="handleSelectProject"
            mode="multiple"
            optionFilterProp="children"
            :options="projectIdOpt"
            :allowClear="false"
            notFoundContent="没有查询到数据"
          />
          <!-- 全部状态 -->
          <a-select
            style="width: 200px; margin-right: 10px"
            placeholder="请选择状态"
            v-model="queryForm.approvalStatusList"
            optionFilterProp="children"
            :options="allApprovalStatusOpt"
            @change="handleSelectStatus"
            mode="multiple"
            :maxTagCount="1"
            :allowClear="false"
            notFoundContent="没有查询到数据"
          />
          <!-- 申请单名称ID -->
          <a-input style="width: 200px; margin-right: 8px; margin-bottom: 15px" v-model="queryForm.nameOrId" placeholder="申请单名称/申请单ID" />
          <!-- 提交日期 -->
          <div>
            <SG-DatePicker
              label="提交日期"
              style="width: 232px"
              pickerType="RangePicker"
              format="YYYY-MM-DD"
              v-model="queryForm.date"
            ></SG-DatePicker>
          </div>
        </div>
        <div class="contentForm-btn">
          <SG-Button @click="doSearch" type="primary" style="margin-right: 10px"> 查询 </SG-Button>
        </div>
      </div>
    </SearchContainer>
    <div>
      <a-table v-bind="tableOptions">
        <template #operation="text, record">
          <OperationPopover :operationData="handleActionBtn(record)" @operationFun="operationFun($event, record)" />
        </template>
      </a-table>
    </div>
    <SG-FooterPagination
      location="absolute"
      :pageLength="pageInfo.pageSize"
      :totalCount="tableTotal"
      :noPageTools="true"
      v-model="pageInfo.pageNum"
      @change="changePage"
    />
  </div>
</template>

<script>
import { approvalStatusOpt } from '@/config/share.js';
import OperationPopover from '@/components/OperationPopover';
import SearchContainer from '@/views/common/SearchContainer';
import TreeSelect from '@/views/common/treeSelect';
import { utils } from 'utils/utils';
import moment from 'moment';
import { getObjectKeyValueByOrganIdFn } from '@/views/disposalManagement/allot/share';
import { ASSET_MANAGEMENT } from '@/config/config.power';
const projectIdOpt = [{ label: '全部资产项目', value: '' }];
export default {
  name: 'allot',
  components: {
    SearchContainer,
    TreeSelect,
    OperationPopover,
  },
  data() {
    return {
      ASSET_MANAGEMENT,
      tableTotal: 0,
      pageInfo: {
        pageSize: 10,
        pageNum: 1,
      },
      allApprovalStatusOpt: [
        {
          title: '全部状态',
          value: '',
        },
        ...approvalStatusOpt,
      ],
      tableOptions: {
        rowKey: 'id',
        columns: [
          {
            title: '申请单ID',
            dataIndex: 'id',
          },
          {
            title: '所属机构',
            dataIndex: 'organName',
          },
          {
            title: '申请单名称',
            dataIndex: 'name',
          },
          {
            title: '原资产项目',
            dataIndex: 'projectName',
          },
          {
            title: '接管组织机构',
            dataIndex: 'newOrganName',
          },
          {
            title: '接管资产项目',
            dataIndex: 'newProjectName',
          },
          {
            title: '提交人',
            dataIndex: 'createUserName',
          },
          {
            title: '提交时间',
            dataIndex: 'createDate',
          },
          {
            title: '状态',
            dataIndex: 'approvalStatusName',
          },
          {
            title: '操作',
            scopedSlots: {
              customRender: 'operation',
            },
          },
        ],
        dataSource: [],
        pagination: false,
      },
      organId: '',
      organName: '',
      exportBtnLoading: false,
      showSearchContainer: true,
      // 通过 initQueryForm 初始化
      queryForm: {},
      projectIdOpt,
    };
  },
  methods: {
    changePage({ pageNo, pageLength }) {
      this.pageInfo.pageNum = pageNo;
      this.pageInfo.pageSize = pageLength;
      this.getTableDataSource({});
    },
    async getTableDataSource() {
      let req = this.handleSearchReq({
        ...this.pageInfo,
        ...this.queryForm,
      });
      const mockData = await this.$api.allot.queryTransferList(req);
      const {
        data: { code, message, data },
      } = mockData;
      if (code === '0') {
        this.tableTotal = data.count;
        this.tableOptions.dataSource = data ? data.data : [];
      } else {
        this.$message.error(message);
      }
    },
    goAddEdit(id) {
      this.$router.push({
        path: '/allot/edit',
        query: {
          id,
          organId: this.organId,
          organName: this.organName,
        },
      });
    },
    /*
     * @desc:跳转详情页面
     * @param fromType <detail | approve>
     * */
    goDetail({ id, organId }, fromType) {
      this.$router.push({
        path: '/allot/detail',
        query: {
          id,
          organId,
          fromType,
        },
      });
    },
    btnAddFn() {
      this.$router.push({
        path: '/allot/add',
        query: {
          organId: this.organId,
          organName: this.organName,
        },
      });
    },
    /*
     * @desc: 多选全选判断
     * @param {Array}  allSelected 多选得到的数据
     * @param {Number} allLength 除全部状态外的选项size
     * @param {Array}  defaultData 全部状态对应的数据
     * */
    judgmentSelectAll({ allSelected, allLength, defaultData = [''] }) {
      if (allSelected[allSelected.length - 1] !== '') {
        if (allSelected.length !== allLength) {
          return allSelected.filter((ele) => ele !== '');
        } else {
          return defaultData;
        }
      } else {
        return defaultData;
      }
    },
    /*
     * @desc: 处理筛选条件-选择状态 (全部状态特殊处理)
     * */
    handleSelectStatus(values) {
      this.queryForm.approvalStatusList = this.judgmentSelectAll({
        allSelected: values,
        allLength: approvalStatusOpt.length,
      });
    },
    /*
     * @desc: 处理筛选条件-选择项目 (全部项目特殊处理)
     * */
    handleSelectProject(values) {
      this.queryForm.projectIds = this.judgmentSelectAll({
        allSelected: values,
        // 包含全部选项 size-1
        allLength: this.projectIdOpt.length - 1,
      });
    },
    /*
     * 根据数据状态生成操作按钮
     * */
    handleActionBtn(record) {
      const { approvalStatus } = record;
      const apprStatusNum = Number(approvalStatus);
      // statusAuth 参考 approvalStatusOpt
      const operationList = [
        {
          iconType: 'edit',
          text: '编辑',
          statusAuth: [0, 3],
          editType: 'edit',
          auth: ASSET_MANAGEMENT.asset_allot_edit,
        },
        {
          iconType: 'check-square',
          text: '审批',
          statusAuth: [2],
          editType: 'approve',
          auth: ASSET_MANAGEMENT.asset_allot_approve,
        },
        {
          iconType: 'minus-square',
          text: '反审核',
          statusAuth: [1],
          editType: 'antiApprove',
          auth: ASSET_MANAGEMENT.asset_allot_opposeApprove,
        },
        {
          iconType: 'delete',
          text: '删除',
          statusAuth: [0, 3],
          editType: 'delete',
          auth: ASSET_MANAGEMENT.asset_allot_delete,
        },
        { iconType: 'book', text: '详情', editType: 'detail' },
      ];
      const authRes = operationList.filter((ele) => {
        if (!ele.auth) {
          return true;
        } else {
          return this.$power.has(ele.auth);
        }
      });
      return authRes.filter((ele) => {
        return !ele.statusAuth || (ele.statusAuth.length && ele.statusAuth.includes(apprStatusNum));
      });
    },
    /*
     * 操作按钮对应事件
     * */
    operationFun(type, record) {
      const { id, organId } = record;
      switch (type) {
        case 'edit':
          this.goAddEdit(id);
          break;
        case 'approve':
          this.goDetail(
            {
              id,
              organId,
            },
            'approve'
          );
          break;
        case 'delete':
          this.handleDel({ id });
          break;
        case 'antiApprove':
          this.handleAntiAudit({ id });
          break;
        case 'detail':
          this.goDetail(
            {
              id,
              organId,
            },
            'detail'
          );
          break;
      }
    },
    handleAntiAudit({ id }) {
      const _this = this;
      this.$confirm({
        title: '提示',
        content: '确认要反审核吗？',
        onOk() {
          let req = {
            id: id,
          };
          _this.$api.allot.deApproval(req).then((res) => {
            if (Number(res.data.code) === 0) {
              _this.$message.success('反审核成功');
              _this.getTableDataSource();
            } else {
              _this.$message.error(res.data.message);
            }
          });
        },
      });
    },
    handleDel({ id }) {
      const _this = this;
      this.$confirm({
        title: '提示',
        content: '确认要删除吗？',
        onOk() {
          let req = {
            id: id,
            status: '0',
          };
          _this.$api.allot.addOrUpdateTransfer(req).then((res) => {
            if (Number(res.data.code) === 0) {
              _this.$message.success('删除成功');
              _this.getTableDataSource();
            } else {
              _this.$message.error(res.data.message);
            }
          });
        },
      });
    },
    initQueryForm() {
      const date = [moment(new Date()).add(-3, 'month'), moment(new Date())];
      this.queryForm = {
        projectIds: [''],
        date,
        approvalStatusList: [''],
        nameOrId: '',
      };
    },
    handleSearchReq(data) {
      const { projectIds, approvalStatusList, nameOrId, pageNum, pageSize } = data;
      const minCreateDate = data.date[0].format('YYYY-MM-DD');
      const maxCreateDate = data.date[1].format('YYYY-MM-DD');
      return {
        organId: this.organId,
        // 为全选 则传空集合
        projectIds: projectIds[0] === '' ? [] : projectIds,
        approvalStatusList: approvalStatusList[0] === '' ? [] : approvalStatusList,
        nameOrId,
        minCreateDate,
        maxCreateDate,
        pageNum,
        pageSize,
      };
    },
    doSearch() {
      this.pageInfo.pageNum = 1;
      this.getTableDataSource();
    },
    doSearchReset() {
      this.initQueryForm();
    },
    changeTree(value, name) {
      this.organId = value;
      this.organName = name;
      this.queryForm.projectIds = [''];
      getObjectKeyValueByOrganIdFn({ organId: value }).then((data) => {
        this.projectIdOpt = [...utils.deepClone(projectIdOpt), ...data];
      });
      this.getTableDataSource();
    },
    /*
     * 开/关 搜索容器
     * */
    changeSearchContainer(val) {
      this.showSearchContainer = val;
    },
  },
  mounted() {
    this.initQueryForm();
    // this.getTableDataSource();
  },
  activated() {
    // TODO:首次加载避免重复调用接口
    if (this.organId) {
      this.getTableDataSource();
    }
  },
};
</script>

<style scoped>
.contentForm {
  display: flex;
}
.contentForm-main {
  width: 100%;
  display: flex;
  justify-content: flex-end;
  flex: 1;
  flex-wrap: wrap;
}
.contentForm-btn {
  flex-basis: 100px;
}
</style>
