<!--
 * @Date: 2020-07-10 17:21:14
 * @Description: 列表通用模板
-->
<template>
  <div>
    <SG-SearchContainer background="white">
      <div slot="headBtns">
        <!-- <SG-Button v-if="createPower" icon="plus" type="primary" @click="operationFun('create')" class="mr10"
          >新建</SG-Button
        >-->
        <SG-Button type="primary" @click="exportList" v-if="type === 'land'" v-power="ASSET_MANAGEMENT.ASSET_CLASS_LAND_EXPORT">
          <segiIcon type="#icon-ziyuan10" class="icon-right" />导出
        </SG-Button>
        <SG-Button type="primary" @click="exportList" v-else v-power="ASSET_MANAGEMENT.ASSET_CLASS_HOUSE_EXPORT">
          <segiIcon type="#icon-ziyuan10" class="icon-right" />导出
        </SG-Button>
      </div>
      <div slot="headRight" style="display: flex">
        <topOrganByUser @change="organIdChange" :formStyle="allStyle" v-model="organId" :hasAll="false" :selectFirst="true" />
        <a-select :style="allStyle" v-model="status" :options="$addTitle(statusOptions)" @change="queryClick"></a-select>
        <a-input-search placeholder="类别名称/编码" :style="allStyle" v-model="codeName" @search="queryClick" />
      </div>
    </SG-SearchContainer>
    <div>
      <a-table :scroll="{ x: 2360 }" :columns="columns" :dataSource="dataSource" size="middle" :pagination="false">
        <template slot="operation" slot-scope="text, record">
          <!-- 状态修改 -->
          <a class="operation-btn" v-if="changePower" @click="operationFun(String(record.status) === '0' ? 'start' : 'stop', record)">{{
            String(record.status) === '0' ? '启用' : '停用'
          }}</a>
          <!-- 编辑权限，及状态 -->
          <a class="operation-btn" @click="operationFun('edit', record)" v-if="editPower && String(record.status) === '1'">编辑</a>
          <!-- <a
            class="operation-btn"
            @click="operationFun('delete', record)"
            v-if="deletePower&&String(record.status) === '0'"
          >删除</a> -->
          <a class="operation-btn" @click="operationFun('detail', record)">详情</a>
        </template>
        <template slot="statusName" slot-scope="text, record, index">
          <div>
            <SG-Switch disabled :checked="String(record.status) === '1'" :id="String(record.key)" style="margin-right: 10px"></SG-Switch>
            {{ String(record.status) === '1' ? '启用' : '停用' }}
          </div>
        </template>
      </a-table>
      <no-data-tips v-show="showNoDataTips"></no-data-tips>
    </div>
    <SG-FooterPagination
      :pageLength="paginator.pageLength"
      :totalCount="totalCount"
      location="fixed"
      v-model="paginator.pageNo"
      @change="handlePageChange"
    />
    <createClassModal
      @success="queryList"
      :categoryConfId="categoryConfId"
      :action="action"
      :type="type"
      :storeDetail="storeDetail"
      ref="createClassModal"
    />
  </div>
</template>

<script>
import segiIcon from '@/components/segiIcon.vue';
import topOrganByUser from '@/views/common/topOrganByUser';
import noDataTips from '@/components/noDataTips';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import { getTargetObject } from '@/utils/utils';
import { statusOptions, pageTypeMap, typeMap } from './child/dict';
import createClassModal from './child/createClassModal';
import Tools from '@/utils/utils';
const columns = [
  // {
  //   title: "分类编号",
  //   dataIndex: "professionId",
  //   width: 160
  // },
  {
    title: '所属机构',
    dataIndex: 'organName',
    width: 200,
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: 160,
  },
  {
    title: '分类名称',
    dataIndex: 'professionName',
    width: 160,
  },
  {
    title: '分类编码',
    dataIndex: 'professionCode',
    width: 160,
  },
  {
    title: '计量单位',
    dataIndex: 'unitName',
    width: 160,
  },
  {
    title: '折旧年限',
    dataIndex: 'depreciationAge',
    width: 160,
  },
  {
    title: '净残值率(%)',
    dataIndex: 'netSalvageRate',
    width: 160,
  },
  {
    title: '折旧方法',
    dataIndex: 'depreciationMethodName',
    width: 200,
  },
  {
    title: '状态',
    dataIndex: 'statusName',
    width: 180,
    scopedSlots: { customRender: 'statusName' },
  },
  {
    title: '操作',
    dataIndex: 'operation',
    width: 180,
    scopedSlots: { customRender: 'operation' },
  },
];
const paginator = {
  pageNo: 1,
  pageLength: 10,
};
const allStyle = `width: 150px; marginLeft: 10px;`;
export default {
  props: {
    type: { default: '' },
    curTab: { default: '' },
  },
  components: {
    segiIcon,
    topOrganByUser,
    noDataTips,
    createClassModal,
  },
  data() {
    return {
      toggle: false,
      ASSET_MANAGEMENT,
      allStyle,
      organId: '',
      organName: '',
      status: '',
      codeName: '',
      statusOptions,
      columns,
      dataSource: [],
      paginator: { ...paginator },
      totalCount: 0,
      showNoDataTips: false,
      storeDetail: {}, // 存储弹窗需要数据
      action: 'create', // 是编辑还是信息，或者详情
      categoryConfId: '', // 当前点击分类id
      createPower: false, // 创建权限
      editPower: false, // 编辑权限
      changePower: false, // 状态改变权限
      deletePower: false, // 删除权限
    };
  },
  watch: {
    curTab(val) {
      if (val === 'house') {
        this.columns = JSON.parse(JSON.stringify(columns));
      } else {
        let idColumns = {
          title: '分类编号',
          dataIndex: 'professionId',
          width: 160,
        };
        this.columns = [idColumns, ...columns];
      }
    },
  },
  mounted() {
    this.handlePower();
  },
  methods: {
    // 查询列表
    queryList() {
      let form = {
        organId: this.organId,
        status: this.status,
        codeName: this.codeName,
        pageNum: this.paginator.pageNo,
        pageSize: this.paginator.pageLength,
        assetType: pageTypeMap[this.type],
      };
      this.$api.assets.getPage(form).then((res) => {
        if (res.data.code === '0') {
          if (!res.data || !res.data.data || !res.data.data.data) {
            this.dataSource = [];
            this.totalCount = 0;
          }
          let data = res.data.data.data || [];
          if (data.length === 0) {
            this.showNoDataTips = true;
          } else {
            this.showNoDataTips = false;
          }
          data.forEach((item, index) => {
            item.key = Tools.getUuid();
            for (let key in item) {
              if (item[key] === '') {
                item[key] = '--';
              }
            }
          });
          this.dataSource = data;
          this.totalCount = res.data.data.count;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 点击查询
    queryClick() {
      this.paginator.pageNo = 1;
      this.queryList();
    },
    organIdChange(obj) {
      this.storeDetail = {
        organName: obj.name,
        organId: obj.value,
      };
      this.queryClick();
    },
    // 操作回调
    operationFun(editType, record) {
      let self = this;
      if (['edit', 'detail'].includes(editType)) {
        this.categoryConfId = record.categoryConfId;
        this.storeDetail.professionCode = record.professionCode;
      }
      // 新增编辑详情
      if (['create', 'edit', 'detail'].includes(editType)) {
        this.action = editType;
        this.$refs.createClassModal.visible = true;
        return;
      }
      // 如果开启
      if (['start'].includes(editType)) {
        this.changeStatus(1, record.categoryConfId, record.professionCode, record.professionName);
        return;
      }
      // 如果暂停
      if (['stop'].includes(editType)) {
        this.$confirm({
          title: '提示',
          content: '确认要停用该资产分类吗？',
          onOk() {
            self.changeStatus(0, record.categoryConfId, record.professionCode, record.professionName);
          },
        });
        return;
      }
      // 如果是删除
      if (['delete'].includes(editType)) {
        this.$confirm({
          title: '提示',
          content: '确认要删除该资产分类吗？',
          onOk: () => {
            let data = {
              orginId: this.organId,
              blankId: record.blankId,
            };
            this.$api.building.blankApiDelete(data).then((res) => {
              if (res.data.code === '0') {
                this.$message.success('删除成功');
                this.queryList();
              } else {
                this.$message.error(res.data.message || res.data.msg || '删除失败');
              }
            });
          },
        });
      }
    },
    // 改变状态
    changeStatus(status, id, professionCode, professionName) {
      let form = {
        categoryConfId: id,
        status: status,
        organId: this.organId,
        professionCode: professionCode,
        professionName: professionName,
        assetType: pageTypeMap[this.type],
      };
      this.$api.assets.updateStatus(form).then((res) => {
        if (res.data.code === '0') {
          this.$message.success('修改成功');
          this.queryList();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    exportList() {
      let form = {
        organId: this.organId,
        status: this.status,
        codeName: this.codeName,
        assetType: pageTypeMap[this.type],
      };
      this.$api.assets.exportList(form).then((res) => {
        console.log(res);
        let blob = new Blob([res.data]);
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `资产${typeMap[this.type]}分类.xls`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    },
    // 处理按钮权限
    handlePower() {
      // 如果是房屋权限判断
      if (['house'].includes(this.type)) {
        if (this.$power.has(ASSET_MANAGEMENT.ASSET_CLASS_SET_EDIT)) {
          this.editPower = true;
        }
        if (this.$power.has(ASSET_MANAGEMENT.ASSET_CLASS_SET_CHANGE_STATUS)) {
          this.changePower = true;
        }
      }
      // 如果是土地权限判断
      if (['land'].includes(this.type)) {
        if (this.$power.has(ASSET_MANAGEMENT.ASSET_CLASS_LAND_CREATE)) {
          this.createPower = true;
        }
        if (this.$power.has(ASSET_MANAGEMENT.ASSET_CLASS_LAND_EDIT)) {
          this.editPower = true;
        }
        if (this.$power.has(ASSET_MANAGEMENT.ASSET_CLASS_LAND_CHANGE)) {
          this.changePower = true;
        }
        if (this.$power.has(ASSET_MANAGEMENT.ASSET_CLASS_LAND_DELETE)) {
          this.deletePower = true;
        }
      }
      if (['carPark'].includes(this.type)) {
        if (this.$power.has(ASSET_MANAGEMENT.ASSET_CLASS_CAR_PARK_CREATE)) {
          this.createPower = true;
        }
        if (this.$power.has(ASSET_MANAGEMENT.ASSET_CLASS_CAR_PARK_EDIT)) {
          this.editPower = true;
        }
        if (this.$power.has(ASSET_MANAGEMENT.ASSET_CLASS_CAR_PARK_CHANGE)) {
          this.changePower = true;
        }
        if (this.$power.has(ASSET_MANAGEMENT.ASSET_CLASS_CAR_PARK_DELETE)) {
          this.deletePower = true;
        }
      }
    },
    // 页码发生变化
    handlePageChange(page) {
      this.paginator.pageNo = page.pageNo;
      this.paginator.pageLength = page.pageLength;
      this.queryList();
    },
  },
};
</script>

<style lang="less" scoped>
.operation-btn {
  color: #0084ff;
  margin-right: 10px;
}
.custom-table {
  padding-bottom: 50px;
}
.search-content-box {
  display: flex;
  justify-content: space-between;
  .search-from-box {
    flex: 1;
    flex-wrap: wrap;
    text-align: right;
  }
  .two-row-box {
    padding-top: 14px;
    flex: 0 0 190px;
  }
}
</style>
