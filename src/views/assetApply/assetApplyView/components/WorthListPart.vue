<!--价值登记页面--资产价值登记详情页面--资产价值清单组件-->
<template>
  <div class="worth_list">
    <SG-Title title="资产明细" />
    <div style="margin-left: 40px">
      <!--数据总览-->
      <overview-number :numList="numList" style="margin-bottom: 8px" v-if="isShow" />
      <div style="margin-bottom: 8px; text-align: right">
        <div v-if="type == 'add' || type == 'edit'" class="box">
          <div class="left" style="height: 100%">已选择资产数量：{{ tableObj.dataSource.length }}，合计领用面积：{{ receiveAreaSum }}㎡</div>
          <div class="right" style="margin-bottom: 8px">
            <SG-Button icon="plus" type="primary" ghost @click="handleAddModal(true)" style="margin-right: 10px">添加资产</SG-Button>
            <SG-Button icon="delete" type="primary" ghost @click="handleDelete">删除</SG-Button>
          </div>
        </div>
      </div>
      <a-table v-bind="tableObj" :columns="columnsCom" class="custom-tables" bordered>
        <template slot="assetCode" slot-scope="text">
          <tooltip-text width="150" :text="text" />
        </template>
        <template slot="assetName" slot-scope="text">
          <tooltip-text width="50" :text="text" />
        </template>
        <template slot="organName" slot-scope="text">
          <tooltip-text width="250" :text="text" />
        </template>
        <template slot="assessmentOrganName" slot-scope="text">
          <tooltip-text width="150" :text="text" />
        </template>
        <template slot="receiveArea" slot-scope="text, record">
          <a-input-number
            :min="0"
            step="0.01"
            :precision="2"
            :max="record.area"
            style="width: 120px"
            v-model="record.receiveArea"
            @change="calcSum(tableObj.dataSource)"
            v-if="type == 'add' || type == 'edit'"
          />
          <span v-else>{{ text }}</span>
        </template>
        <template slot="remark" slot-scope="text, record">
          <a-input v-if="type == 'add' || type == 'edit'" v-model="record.remark" />
          <span v-else>{{ text }}</span>
        </template>
        <template slot="address" slot-scope="text, record">
          <a-input-number
            :min="0"
            step="0.01"
            :precision="2"
            :max="999999999.99"
            style="width: 120px"
            v-model="record.address"
            @change="calcSum(tableObj.dataSource)"
            v-if="type == 'add' || type == 'edit'"
          />
          <span v-else>{{ text }}</span>
        </template>
      </a-table>
      <div v-if="!tableObj.dataSource.length" style="text-align: center; margin-top: 25px">暂无数据</div>
      <SG-FooterPagination
        v-bind="paginationObj"
        v-if="(type == 'approval' || type == 'detail') && tableObj.dataSource.length"
        @change="({ pageNo, pageLength }) => queryAssetListByRegisterId({ pageNo, pageLength })"
      />
    </div>
  </div>
</template>

<script>
import OverviewNumber from 'src/views/common/OverviewNumber';
import TooltipText from 'src/views/common/TooltipText';
export default {
  name: 'WorthListPart',
  components: { OverviewNumber, TooltipText },
  props: ['type', 'registerId', 'organId', 'dynamicData', 'details', 'isSelectedEquipment'],
  data() {
    return {
      tableObj: {
        dataSource: [],
        loading: false,
        pagination: false,
        scroll: { x: 2000 },
        rowKey: 'assetId',
        selectedRowKeys: [], // Table选中的key数据
        columns: [
          { title: '归还ID', dataIndex: 'returnDetailId' },
          { title: '归还日期', dataIndex: 'returnDate' },
          { title: '归还面积（㎡）', dataIndex: 'returnArea' },
          { title: '归还部门', dataIndex: 'returnOrganName' },
          { title: '提交人', dataIndex: 'createByName' },
          { title: '提交日期', dataIndex: 'createTime' },
          { title: '备注', dataIndex: 'remark' },
        ],
      },
      exportBtnLoading: false, // 导出按钮loading
      paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 },
      initList: [], // 选择资产Modal初始选中值
      selectedList: [], // 选择资产Modal选中值
      queryType: 2, // 1 资产变动，2 资产清理 3 权属登记,
      modalObj: {
        width: 1000, // Modal宽度
        height: 450, // Modal高度
        title: '选择资产',
        okText: '确定选择',
        cancelText: '取消',
        isShow: false,
      },
      isEditAll: false, // 批量修改本次估值列
      receiveAreaSum: 0,
      isShow: false,
      numList: [
        { title: '领用面积（m²）', key: 'receiveArea', value: 0, fontColor: '#324057' },
        { title: '已归还面积（m²）', key: 'returnArea', value: 0, fontColor: '#324057' },
        { title: '未归还面积（m²）', key: 'unReturnArea', value: 0, fontColor: '#324057' },
      ], // 概览数字数据, title 标题，value 数值，bgColor 背景色
    };
  },
  computed: {
    columnsCom() {
      if (this.isSelectedEquipment) {
        return this.tableObj.columns.filter((ele) => (ele.dataIndex || ele.key) !== 'returnArea');
      } else {
        return this.tableObj.columns;
      }
    },
  },
  methods: {
    // 计算最后一行求和数据及上浮比例
    calcSum(data) {
      let assessmentValue = 0;
      let originalValue = 0;
      let assetValuation = 0;
      let firstMarketValue = 0;
      let lastAssessmentValue = 0;
      this.tableObj.dataSource = data.map((m) => {
        assessmentValue += m.assessmentValue ? Number(m.assessmentValue) : 0;
        originalValue += m.originalValue ? Number(m.originalValue) : 0;
        assetValuation += m.assetValuation ? Number(m.assetValuation) : 0;
        lastAssessmentValue += m.lastAssessmentValue ? Number(m.lastAssessmentValue) : 0;
        firstMarketValue += m.firstMarketValue ? Number(m.firstMarketValue) : 0;
        return m;
      });
      let num = 0;
      this.tableObj.dataSource.map((item) => {
        if (item.receiveArea) {
          return (num += item.receiveArea);
        }
      });
      this.receiveAreaSum = num.toFixed(2);
      // 返回给上层组件,用于保存
      this.$emit('backAssetList', data, this.receiveAreaSum);
    },

    // 批量删除资产
    handleDelete() {
      const {
        tableObj: { selectedRowKeys, dataSource },
      } = this;
      if (!selectedRowKeys.length) {
        return this.$message.warn('请选择数据');
      }
      let data = dataSource.filter((m) => !selectedRowKeys.includes(m.assetId));
      if (!data.length) {
        this.tableObj.dataSource = [];
        this.selectedRowKeys = [];
      }
      this.calcSum(data);
    },

    // 添加资产
    handleAddModal(bool) {
      if (bool) {
        const {
          tableObj: { dataSource },
          dynamicData: { projectId, assetType },
        } = this;
        // 校验是否已选择资产项目
        if (!assetType || !projectId) {
          return this.$emit('validateProject');
        }
        let list = dataSource.map((m) => Number(m.assetId));
        Object.assign(this, {
          modalObj: { width: 1000, height: 450, title: '选择资产', okText: '确定选择', cancelText: '取消', isShow: false },
          isEditAll: false,
          initList: list,
          selectedList: list,
        });
      } else {
        // 取消时selectedList恢复初始值
        this.selectedList = this.initList;
      }
      this.modalObj.isShow = bool;
    },

    // 导出
    handleExport() {},

    // Table rowSelection
    rowSelection() {
      return {
        selections: true,
        onChange: (selectedRowKeys) => {
          this.tableObj.selectedRowKeys = selectedRowKeys;
        },
      };
    },

    // 获取选中的资产数据
    getAssetList() {
      let { selectedList } = this;
      if (!selectedList.length) {
        return this.$message.warn('请选择资产数据');
      }
      this.modalObj.isShow = !selectedList.length;
      // 去重处理，比较arr 与 tableObj.dataSource
      if (selectedList.length) {
        let {
          tableObj: { dataSource },
        } = this;
        this.initList = [...selectedList];
        let newList = selectedList.filter((m) => !dataSource.some((n) => String(n.assetId) === String(m)));
        if (newList.length) {
          this.queryAssetListByAssetId(newList);
        } else {
          // 过滤列表中被取消选中的数据
          dataSource = dataSource.filter((n) => selectedList.includes(Number(n.assetId))).map((m, i) => ({ ...m, index: i + 1 }));
          return this.calcSum(dataSource);
        }
      }
    },

    // 根据登记Id查询资产详情的列表数据--分页
    queryAssetListByRegisterId() {
      const { registerId, details } = this;
      if (!details.returnList) {
        return false;
      } //this.$message.info('无归还记录')
      this.tableObj.loading = true;
      this.tableObj.loading = false;
      this.tableObj.dataSource = (details.returnList || []).map((m, i) => ({ ...m, index: i + 1 }));
      this.paginationObj.totalCount = details.returnList.length;
      this.numList.map((item, index) => {
        if (!this.details[item.key]) {
          return (this.numList[index].value = 0);
        }
        this.numList[index].value = this.details[item.key];
      });
      return false;
      //   const { registerId } = this
      //   if(this.type == 'add'){
      //     return false
      //   }
      //   if (!registerId) { return this.$message.info('登记Id不存在') }
      //   this.tableObj.loading = true
      //   this.$api.useManage.getReceiveDetailInfo({ receiveId:registerId, pageNum:pageNo, pageSize:pageLength }).then(r => {
      //     console.log(r)
      //     this.tableObj.loading = false
      //     let res = r.data
      //     if (res && String(res.code) === '0') {
      //       const { data, count } = res.data
      //       this.tableObj.dataSource = (data || []).map((m, i) => ({...m, index: i + 1}))
      //       Object.assign(this.paginationObj, {
      //         totalCount: count,
      //         pageNo, pageLength
      //       })
      //       let num = 0
      //        this.tableObj.dataSource.map(item => {
      //       return num += item.receiveArea
      // })
      //       this.receiveAreaSum = num
      //       this.calcSum(this.tableObj.dataSource)
      //       this.numList.map((item,index) => {
      //       if(!this.details[item.key]){
      //         return this.numList[index].value = 0
      //       }
      //       this.numList[index].value = this.details[item.key]
      //     })
      //       return false
      //     }
      //     throw res.message || '查询登记资产接口出错'
      //   }).catch(err => {
      //     this.tableObj.loading = false
      //     this.$message.error(123 || '查询登记资产接口出错')
      //   })
    },

    // 根据资产id查询资产详情的列表数据--不分页
    queryAssetListByAssetId(selectedRows = [], status) {
      let form = {};
      let {
        registerId,
        tableObj: { dataSource },
        dynamicData,
        selectedList,
      } = this;
      if (status === 'init') {
        form.registerId = registerId;
      } else {
        if (!selectedRows.length) {
          return false;
        }
        form.assetId = selectedRows.join(',');
      }
      this.tableObj.loading = true;
      this.$api.worthRegister
        .queryRelList(form)
        .then((r) => {
          this.tableObj.loading = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            let addData = res.data.data || [];
            if (!addData.length) {
              return false;
            }
            if (status === 'init') {
              dataSource = addData;
            } else {
              dataSource.push(...addData);
              // 过滤列表中被取消选中的数据
              dataSource = dataSource.filter((n) => selectedList.includes(Number(n.assetId)));
            }
            let list = dataSource.map((m, i) => ({ ...m, index: i + 1, ...dynamicData, area: +m.assetArea, objectTypeName: m.assetCategoryName }));
            return this.calcSum(list);
          }
          throw res.message || '查询登记资产接口出错';
        })
        .catch((err) => {
          this.tableObj.loading = false;
          this.$message.error(err || '查询登记资产接口出错');
        });
    },

    // 处理Modal关闭/保存
    handleAction(type) {
      let { isEditAll } = this;
      if (type) {
        isEditAll ? this.handleAssetValueAll() : this.getAssetList();
      } else {
        isEditAll = this.handleAddModal(false);
      }
    },

    handleAssetValueAll() {
      const {
        tableObj: { dataSource },
      } = this;
      let { typeValue, assetValue, methodValue } = this.$refs['setAsset'].transferData();
      if (assetValue === '') {
        return this.$message.warn('请输入估值金额');
      }
      let list = [];
      // 按单个资产估值
      if (typeValue === '2') {
        list = dataSource.map((m) => {
          return { ...m, assessmentValue: assetValue };
        });
      } else {
        // 按资产个数估值
        if (methodValue === '1') {
          let rest = (assetValue * 100) % dataSource.length;
          let val = Math.floor((assetValue * 100) / dataSource.length);
          list = dataSource.map((m, i) => {
            return { ...m, assessmentValue: i + 1 === dataSource.length ? (val + rest) / 100 : val / 100 };
          });
        } else {
          // 按资产面积均摊
          let totalArea = 0;
          dataSource.forEach((m) => {
            totalArea += m.assetArea ? Number(m.assetArea) * 100 : 0;
          });
          totalArea = totalArea ? totalArea / 100 : 0;
          if (totalArea && assetValue) {
            let diff = 1;
            let rest = 0;
            if (assetValue >= totalArea) {
              rest = assetValue % totalArea;
            } else {
              diff = Math.pow(10, totalArea.toFixed().length - assetValue.toFixed().length);
              rest = (assetValue * diff * 10) % totalArea;
            }
            list = dataSource.map((m, i) => {
              let val = Math.floor((100 * Number(m.assetArea || 0) * assetValue) / totalArea);
              let assessmentValue = i + 1 === dataSource.length ? (val + (rest * (diff === 1 ? 1 : 10)) / diff) / 100 : val / 100;
              return { ...m, assessmentValue };
            });
          } else {
            list = dataSource;
          }
        }
      }
      this.calcSum(list);
    },
  },

  created() {
    const { type } = this;
    if (type === 'add' || type === 'edit') {
      // 允许多选
      this.tableObj.rowSelection = this.rowSelection();
      // 列表查询结果不分页，且前端计算求和数据
      type === 'edit' && this.queryAssetListByAssetId([], 'init');
      this.queryAssetListByRegisterId({ type: 'init' });
    } else {
      // type === 'approval' || type === 'detail'时
      // 列表查询结果分页，且后端计算求和数据
      this.queryAssetListByRegisterId({ type: 'init' });
    }
  },
  watch: {
    details: function () {
      this.isShow = true;
      this.numList.map((item, index) => {
        if (!this.details[item.key]) {
          return (this.numList[index].value = 0);
        }
        this.numList[index].value = this.details[item.key];
      });
      this.queryAssetListByRegisterId();
    },
    // 基础信息组件传递的数据，更新Table相关项
    dynamicData: function (data) {
      let {
        tableObj: { dataSource },
        type,
        numList,
        details,
      } = this;
      if (this.isSelectedEquipment) {
        const arr = ['领用数量', '已归数量', '未归还数量'];
        this.numList.forEach((ele, index) => {
          ele.title = arr[index];
        });
      }
      if ((type === 'add' || type === 'edit') && dataSource.length) {
        const { projectId, assetType } = data;
        // 如果切换资产项目\资产类型，则清空Table dataSource
        if ((assetType && String(assetType) !== String(details.assetType)) || String(projectId) !== String(details.projectId)) {
          // 重置selectedRowKeys
          this.details.assetType = assetType;
          this.details.projectId = projectId;
          this.tableObj.selectedRowKeys = [];
          this.tableObj.dataSource = [];
          this.receiveAreaSum = 0;
          return (this.numList = numList.map((m) => {
            return { ...m, value: 0 };
          }));
        } else {
          this.tableObj.dataSource = dataSource.map((m) => {
            return Object.assign(m, data);
          });
        }
      }
    },
  },
};
</script>

<style lang="less" scoped>
.worth_list {
  .custom-table {
    /*if you want to set scroll: { x: true }*/
    /*you need to add style .ant-table td { white-space: nowrap; }*/
    & /deep/ .ant-table {
      .ant-table-thead th {
        white-space: nowrap;
      }
    }
  }
  .box {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
}
</style>
