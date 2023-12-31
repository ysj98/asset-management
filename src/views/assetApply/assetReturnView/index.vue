<!--
  资产归还一览表
-->
<template>
  <div class="assetRegister">
    <keep-alive>
      <SG-SearchContainer size="fold" background="white" v-model="toggle" @input="searchContainerFn">
        <div slot="headBtns">
          <div class="box" style="margin-left: 16px">
            <SG-Button type="primary" v-power="ASSET_MANAGEMENT.ASSET_RETURN_VIEW_EXPORT" @click="exportFn"
              ><segiIcon type="#icon-ziyuan10" class="icon-right" />导出</SG-Button
            >
          </div>
          <div style="position: absolute; top: 20px; right: 76px; display: flex">
            <treeSelect @changeTree="changeTree" :multiple="true" placeholder="请选择组织机构" :allowClear="false" :style="allStyle"></treeSelect>
            <a-select
              :maxTagCount="1"
              mode="multiple"
              :style="allStyle"
              :allowClear="true"
              placeholder="全部资产项目"
              v-model="queryCondition.projectList"
              :filterOption="filterOption"
              @select="getObjectKeyValueByOrganIdFn"
              :getPopupContainer="
                (triggerNode) => {
                  return triggerNode.parentNode || document.body;
                }
              "
            >
              <a-select-option :title="item.name" v-for="(item, index) in projectData" :key="index" :value="item.value">{{
                item.name
              }}</a-select-option>
            </a-select>
            <a-select
              :maxTagCount="1"
              :style="allStyle"
              mode="multiple"
              placeholder="全部资产类型"
              :tokenSeparators="[',']"
              @select="assetTypeDataFn"
              v-model="queryCondition.assetType"
              :getPopupContainer="
                (triggerNode) => {
                  return triggerNode.parentNode || document.body;
                }
              "
            >
              <a-select-option :title="item.name" v-for="(item, index) in assetTypeData" :key="index" :value="item.value">{{
                item.name
              }}</a-select-option>
            </a-select>
            <a-select
              :maxTagCount="1"
              style="width: 160px; margin-right: 10px"
              mode="multiple"
              placeholder="全部状态"
              :tokenSeparators="[',']"
              @select="approvalStatusFn"
              v-model="queryCondition.approvalStatusList"
              :getPopupContainer="
                (triggerNode) => {
                  return triggerNode.parentNode || document.body;
                }
              "
            >
              <a-select-option
                :title="item.name"
                v-for="(item, index) in approvalStatusData"
                :key="index"
                :value="item.value"
                :getPopupContainer="
                  (triggerNode) => {
                    return triggerNode.parentNode || document.body;
                  }
                "
                >{{ item.name }}</a-select-option
              >
            </a-select>
            <a-input-search
              v-model="queryCondition.assetName"
              placeholder="资产名称/编号"
              :maxLength="30"
              style="width: 140px; height: 32px; margin-right: 10px"
              @search="allQuery"
            />
          </div>
        </div>
        <div slot="btns">
          <SG-Button type="primary" @click="allQuery">查询</SG-Button>
        </div>
        <div slot="form" class="formCon">
          <EquipmentSelectTree
            v-if="isSelectedEquipment"
            :multiple="true"
            style="width: 190px; margin-right: 10px"
            :top-organ-id="queryCondition.organId.split(',')[0]"
            v-model="queryCondition.objectTypeList"
            :options-data-format="
              (data) => {
                return [{ label: '全部资产分类', value: '', isLeaf: true }, ...data];
              }
            "
            @select="changeAssetClassify"
          />
          <a-select
            v-else
            :maxTagCount="1"
            mode="multiple"
            :tokenSeparators="[',']"
            placeholder="全部资产分类"
            v-model="queryCondition.objectTypeList"
            :options="$addTitle(assetClassifyOptions)"
            style="width: 190px; margin-right: 10px"
            @select="changeAssetClassify"
            :getPopupContainer="
              (triggerNode) => {
                return triggerNode.parentNode || document.body;
              }
            "
          ></a-select>
          <treeSelect @changeTree="changeLeaf" placeholder="全部归还部门" :allowClear="true" :style="allStyle" :default="false"></treeSelect>
          <div class="box">
            <SG-DatePicker
              :allowClear="false"
              :defaultValue="applyValue"
              label="归还日期"
              style="width: 200px"
              pickerType="RangePicker"
              v-model="applyValue"
              format="YYYY-MM-DD"
            ></SG-DatePicker>
          </div>
          <div class="box">
            <a-input placeholder="归还单编号" v-model="queryCondition.returnName" :maxLength="30"></a-input>
            <a-input placeholder="领用单编号" v-model="queryCondition.receiveName" class="box-right" :maxLength="30"></a-input>
          </div>
        </div>
      </SG-SearchContainer>
    </keep-alive>
    <!--数据总览-->
    <div class="table-layout-fixed">
      <!-- ref="table_box" -->
      <!-- :scroll="scrollHeight" -->
      <a-table :loading="loading" :columns="columns" :dataSource="tableData" size="middle" :pagination="false">
        <template slot="returnDetailId" slot-scope="text, record">
          <div class="opt">
            <router-link
              :to="{ name: '资产归还一览表详情', params: { registerId: record.returnDetailId, type: 'detail', organId, organName } }"
              class="action_text"
              >{{ record.returnDetailId }}</router-link
            >
          </div>
        </template>
      </a-table>
    </div>
    <no-data-tips v-show="tableData.length === 0"></no-data-tips>
    <SG-FooterPagination
      :pageLength="queryCondition.pageSize"
      :totalCount="count"
      location="absolute"
      :noPageTools="noPageTools"
      v-model="queryCondition.pageNum"
      @change="handleChange"
    />
  </div>
</template>

<script>
import EquipmentSelectTree from '@/views/common/EquipmentSelectTree';
import { generateTableAreaByAssetTypeString } from '@/utils/utils';
import TreeSelect from '../../common/treeSelect';
import segiIcon from '@/components/segiIcon.vue';
import noDataTips from '@/components/noDataTips';
import moment from 'moment';
import { ASSET_MANAGEMENT } from '@/config/config.power';
const approvalStatusData = [
  { name: '全部状态', value: '' },
  { name: '草稿', value: 0 },
  { name: '待审批', value: 2 },
  { name: '已驳回', value: 3 },
  { name: '已审批', value: 1 },
  { name: '已取消', value: 4 },
];

const columns = [
  {
    title: '归还编号',
    dataIndex: 'returnDetailId',
    width: 100,
    scopedSlots: { customRender: 'returnDetailId' },
  },
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
    title: '资产面积',
    key: 'area',
    customRender(record) {
      return generateTableAreaByAssetTypeString({ record, assetTypeName: record.assetTypeName, keyStr: 'area' });
    },
  },
  {
    title: '归还单号',
    dataIndex: 'returnId',
  },
  {
    title: '领用单号',
    dataIndex: 'receiveId',
  },
  {
    title: '领用日期',
    dataIndex: 'receiveDate',
  },
  {
    title: '领用部门',
    dataIndex: 'receiveOrganName',
  },
  {
    title: '领用人',
    dataIndex: 'receiveUserName',
  },
  {
    title: '领用面积（m²）',
    key: 'receiveArea',
    customRender(record) {
      return generateTableAreaByAssetTypeString({ record, assetTypeName: record.assetTypeName, keyStr: 'receiveArea' });
    },
  },
  {
    title: '已归还面积(㎡)',
    key: 'totalReturnArea',
    customRender(record) {
      return generateTableAreaByAssetTypeString({ record, assetTypeName: record.assetTypeName, keyStr: 'totalReturnArea' });
    },
  },
  {
    title: '归还日期',
    dataIndex: 'returnDate',
  },
  {
    title: '归还部门',
    dataIndex: 'returnOrganName',
  },
  {
    title: '本次归还面积(㎡)',
    key: 'returnArea',
    customRender(record) {
      return generateTableAreaByAssetTypeString({ record, assetTypeName: record.assetTypeName, keyStr: 'returnArea' });
    },
  },
  {
    title: '剩余归还面积(㎡)',
    key: 'unReturnArea',
    customRender(record) {
      return generateTableAreaByAssetTypeString({ record, assetTypeName: record.assetTypeName, keyStr: 'unReturnArea' });
    },
  },
  {
    title: '状态',
    dataIndex: 'approvalStatusName',
  },
  {
    title: 'key值',
    dataIndex: 'key',
    width: 0,
  },
];

export default {
  components: { TreeSelect, noDataTips, segiIcon, EquipmentSelectTree },
  data() {
    return {
      ASSET_MANAGEMENT,
      toggle: false,
      loading: false,
      columns,
      organName: '',
      organId: '',
      approvalStatusData: [...approvalStatusData],
      allStyle: 'width: 150px; margin-right: 10px;',
      applyValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      createValue: [moment(new Date() - 24 * 1000 * 60 * 60 * 90), moment(new Date())],
      tableData: [],
      count: '',
      noPageTools: false,
      queryCondition: {
        pageNum: 1, // 当前页
        pageSize: 10, // 每页显示记录数
        projectList: [], // 资产项目Id
        organId: 1300, // 组织机构id
        returnOrganId: null, // 领用部门id
        assetTypeList: [''], // 资产类型id(多个用，分割)
        approvalStatusList: [], // 状态
        receiveName: '', // 领用单名称/编号
        startReceiveDate: '', // 领用开始日期
        endReceiveDate: '', // 领用结束如期
        startCreateDate: '', // 提交开始日期
        endCreateDate: '', // 提交结束日期
        assetType: '', // 资产类型
        objectTypeList: [], // 资产分类
        assetName: '', // 资产名称/编号
        returnName: '', // 归还单名称/编号
      },
      organProjectType: {
        organId: 1300,
        organName: this.organName,
        projectId: [],
        assetType: [],
      }, // 查询条件：组织机构-资产项目-资产类型 { organId, projectId, assetType }
      assetClassifyOptions: [{ label: '全部资产分类', value: '' }],
      assetTypeData: [
        {
          name: '全部资产类型',
          value: '',
        },
      ],
      projectData: [],
    };
  },
  computed: {
    isSelectedEquipment() {
      const assetTypeArr = this.queryCondition.assetType;
      return assetTypeArr.length === 1 && assetTypeArr[0] === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    },
  },
  watch: {
    'queryCondition.assetType'() {
      this.getAssetClassifyOptions();
    },
    // 'queryCondition.projectList' () {
    //   sessionStorage.setItem('returnViewProjectList', this.queryCondition.projectList)
    // },
    // 'queryCondition.assetType' () {
    //   sessionStorage.setItem('returnViewAssetType', this.queryCondition.assetType)
    // },
    // 'queryCondition.approvalStatusList' () {
    //   sessionStorage.setItem('returnViewApprovalStatusList', this.queryCondition.approvalStatusList)
    // },
  },
  mounted() {
    this.platformDictFn('asset_type');
  },
  methods: {
    // // 控制跳转至新增领用单页面
    // handleBtnAction ({id, type}) {
    //     const { organProjectType: { organId }, organName } = this
    //     this.$router.push({ name: '领用登记新增', params: { organId:this.queryCondition.organId, organName, type: 'add' }})
    // },
    exportFn() {
      let obj = {
        returnOrganId: this.alljudge(this.queryCondition.returnOrganId), //领用部门ID
        approvalStatusList: this.alljudge(this.queryCondition.approvalStatusList), // 领用单状态
        projectIdList: this.queryCondition.projectList ? this.queryCondition.projectList : [], // 资产项目Id
        organIds: this.queryCondition.organId, // 组织机构id
        assetTypeList: this.alljudge(this.queryCondition.assetTypeList), // 资产类型id(多个用，分割)
        returnName: this.queryCondition.returnName, // 归还单名称/编号
        receiveName: this.queryCondition.receiveName, // 领用单名称/编号
        startReturnDate: moment(this.applyValue[0]).format('YYYY-MM-DD'), // 开始归还日期
        endReturnDate: moment(this.applyValue[1]).format('YYYY-MM-DD'), // 结束归还日期
        assetName: this.queryCondition.assetName, // 资产名称
        objectTypeList: this.alljudge(this.queryCondition.assetTypeList), // 资产分类
      };
      this.$api.useManage.exportReturnDetail(obj).then((res) => {
        let blob = new Blob([res.data]);
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = '资产归还一览表.xls';
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    },
    changeTree(value, label) {
      this.organName = label;
      this.queryCondition.organId = value;
      this.queryCondition.pageNum = 1;
      this.queryCondition.projectId = undefined;
      this.getObjectKeyValueByOrganIdFn();
      this.query();
      // sessionStorage.setItem('returnViewOrgan', label)
      // sessionStorage.setItem('returnViewOrganId', value)
    },
    changeLeaf(value) {
      this.queryCondition.returnOrganId = value;
    },
    query() {
      this.loading = true;
      let obj = {
        pageNum: this.queryCondition.pageNum, // 当前页
        pageSize: this.queryCondition.pageSize, // 每页显示记录数
        approvalStatusList: this.alljudge(this.queryCondition.approvalStatusList), // 入库单状态 0草稿 2待审批、已驳回3、已审批1 已取消4
        projectIdList: this.alljudge(this.queryCondition.projectList), // 资产项目Id
        organIds: this.queryCondition.organId, // 组织机构id
        assetTypeList: this.alljudge(this.queryCondition.assetType), // 资产类型id(多个用，分割)
        startReturnDate: moment(this.applyValue[0]).format('YYYY-MM-DD'), // 领用开始日期
        endReturnDate: moment(this.applyValue[1]).format('YYYY-MM-DD'), // 领用结束日期
        receiveName: this.queryCondition.receiveName, // 领用单名称/编号
        returnOrganId: this.queryCondition.returnOrganId, // 领用部门id
        objectTypeList: this.alljudge(this.queryCondition.objectTypeList), // 资产分类
        assetName: this.queryCondition.assetName, // 资产名称/编号
        returnName: this.queryCondition.returnName, // 归还单名称/编号
      };
      this.$api.useManage.getReturnDetailPage(obj).then((r) => {
        if (r.data.code == 0) {
          r.data.data.data.map((item, index) => {
            r.data.data.data[index].key = item.returnDetailId;
          });
          this.tableData = r.data.data.data;
          this.count = r.data.data.count;
        }
        this.loading = false;
      });
    },
    allQuery() {
      this.queryCondition.pageNum = 1;
      this.queryCondition.pageSize = 10;
      this.query();
    },
    alljudge(val) {
      if (val.length !== 0) {
        if (val[0] === '') {
          return [];
        } else {
          return val;
        }
      } else {
        return [];
      }
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    // 查询统计信息
    pageListStatistics(form) {
      this.$api.useManage
        .getReceiveSum(form)
        .then((r) => {
          let res = r.data;
          if (res && String(res.code) === '0') {
            let { numList } = this;
            return (this.numList = numList.map((m) => {
              return { ...m, value: (res.data || {})[m.key] };
            }));
          }
          throw res.message;
        })
        .catch((err) => {
          this.$message.error(err || '查询统计信息出错');
        });
    },
    // 获取资产分类下拉列表
    getAssetClassifyOptions() {
      let obj = {
        organId: this.queryCondition.organId.split(',')[0],
        assetType: this.queryCondition.assetType.length === 1 ? this.queryCondition.assetType.join(',') : '',
      };
      if (!obj.assetType) {
        this.queryCondition.objectTypeList = [''];
        this.assetClassifyOptions = [{ label: '全部资产分类', value: '' }];
        return;
      }
      this.$api.assets.getList(obj).then((res) => {
        if (res.data.code === '0') {
          let arr = [{ label: '全部资产分类', value: '' }];
          res.data.data.forEach((item) => {
            let obj = {
              label: item.professionName,
              value: item.professionCode,
            };
            arr.push(obj);
          });
          this.assetClassifyOptions = arr;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产分类发生变化
    changeAssetClassify(value) {
      this.$nextTick(function () {
        this.queryCondition.objectTypeList = this.handleMultipleSelectValue(value, this.queryCondition.objectTypeList, this.assetClassifyOptions);
      });
    },
    // 状态发生变化
    approvalStatusFn(value) {
      this.$nextTick(function () {
        this.queryCondition.approvalStatusList = this.handleMultipleSelectValue(
          value,
          this.queryCondition.approvalStatusList,
          this.approvalStatusData
        );
      });
    },
    // 资产类型变化
    assetTypeDataFn(value) {
      this.$nextTick(function () {
        this.queryCondition.assetType = this.handleMultipleSelectValue(value, this.queryCondition.assetType, this.assetTypeData);
      });
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.queryCondition.organId,
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
          this.projectData = arr;
          console.log(this.projectData);
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
          if (str === 'asset_type') {
            this.assetTypeData = [{ name: '全部资产类型', value: '' }, ...data];
          }
        } else {
          this.$message.error(res.data.message);
        }
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
    // 高级搜索控制
    searchContainerFn(val) {
      this.toggle = val;
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  },
};
</script>

<style lang="less" scoped>
.assetRegister {
  .opt {
    display: flex;
    justify-content: space-around;
    width: 50px;
  }
  .box {
    display: flex;
    // vertical-align: middle;
    margin-right: 10px;
    justify-content: space-between;
    .box-right {
      margin-left: 10px;
    }
  }
  .nav {
    display: inline-block;
    vertical-align: middle;
  }
  .tab-opt {
    span {
      padding-right: 10px;
      color: #0084ff;
      cursor: pointer;
    }
  }
  .custom-table {
    padding-bottom: 60px;
  }
  .formCon {
    display: flex;
    width: 100%;
    justify-content: flex-end;
    flex-wrap: wrap;
    > * {
      margin-right: 10px;
      margin-bottom: 10px;
      position: relative;
      height: 32px;
    }
  }
}
</style>
