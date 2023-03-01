<!--
 * @Author: LW
 * @Date: 2020-07-16 11:30:26
 * @LastEditTime: 2020-08-01 18:08:20
 * @Description: 相关费用
-->
<template>
  <div class="necessaryCaaessories">
    <div class="button-box">
      <div class="buytton-l">
        <span>费用总额：{{ statistics.expenseAmount || 0 }}元</span> <span class="p120">收入总额：{{ statistics.incomeAmount || 0 }}元</span>
      </div>
      <div class="buytton-nav" v-if="setType !== 'detail'">
        <SG-Button type="primary" weaken @click="newlyFn('new')">新增相关费用</SG-Button>
        <SG-Button class="ml20" type="primary" weaken @click="addTheAsset">批量导入</SG-Button>
      </div>
    </div>
    <div class="table-borders" :class="{ overflowX: tableData.length === 0 }">
      <a-table class="table-boxs" :columns="columns" :loading="loading" :scroll="{ y: 450, x: 1900 }" :dataSource="tableData" :pagination="false">
        <template slot="operation" slot-scope="text, record">
          <div class="tab-opt">
            <span @click="newlyFn('edit', record)">编辑</span>
            <span class="pl10 postAssignment-icon" @click="deleteFn(record)">删除</span>
          </div>
        </template>
      </a-table>
      <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      <SG-FooterPagination
        :pageLength="queryCondition.pageSize"
        :totalCount="count"
        location="static"
        :noPageTools="noPageTools"
        v-model="queryCondition.pageNum"
        @change="handleChange"
      />
    </div>
    <!-- 新增编辑 -->
    <chargesNewEdit @cancel="cancel" v-if="modalShow" ref="chargesNewEdit" @allQuery="allQuery"></chargesNewEdit>
    <!-- 下载模板 -->
    <eportAndDownFile title="相关费用" ref="eportAndDownFile" @upload="uploadModeFile" @down="down"></eportAndDownFile>
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import { costData } from './../common/registerBasics';
import noDataTips from '@/components/noDataTips';
import chargesNewEdit from './../common/chargesNewEdit';
import eportAndDownFile from './.././../../common/eportAndDownFile';
export default {
  components: { noDataTips, chargesNewEdit, eportAndDownFile },
  props: {
    registerOrderId: [String, Number],
    assetType: [String, Number],
    organId: [String, Number],
  },
  data() {
    return {
      record: [],
      setType: '',
      columns: [],
      tableData: [],
      count: '', // 总页数
      loading: false,
      modalShow: false,
      noPageTools: false,
      queryCondition: {
        pageSize: 10,
        pageNum: 1,
        registerOrderId: '', // 资产登记单Id
        assetType: '', // 资产类型
      },
      statistics: {}, // 统计
    };
  },
  computed: {},
  created() {},
  mounted() {
    this.queryCondition.registerOrderId = this.registerOrderId;
    this.queryCondition.assetType = this.assetType;
    this.record = JSON.parse(this.$route.query.record);
    this.setType = this.$route.query.setType;
    if (this.setType === 'detail') {
      let arr = [];
      arr = utils.deepClone(costData);
      arr.pop();
      this.columns = arr;
    } else {
      this.columns = costData;
    }
    this.query();
    this.$textReplace();
  },
  methods: {
    allQuery() {
      this.queryCondition.pageNum = 1;
      this.queryCondition.pageSize = 10;
      this.query();
    },
    // 删除
    deleteFn(record) {
      this.$SG_Modal.confirm({
        content: `确认要删除该相关费用吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk: () => {
          let data = {
            correlationExpenseId: record.correlationExpenseId, // 相关费用id
          };
          let loadingName = this.SG_Loding('提交中...');
          this.$api.assets.correlationExpenseDelete(data).then((res) => {
            if (res.data.code === '0') {
              this.DE_Loding(loadingName).then(() => {
                this.$SG_Message.success('删除成功');
                this.query();
              });
            } else {
              this.DE_Loding(loadingName).then(() => {
                this.$message.error(res.data.message);
              });
            }
          });
        },
      });
    },
    // 新增
    newlyFn(str, record) {
      this.modalShow = true;
      let obj = '';
      if (str === 'new') {
        obj = {
          registerOrderId: this.queryCondition.registerOrderId, //  资产登记ID
          assetType: this.queryCondition.assetType,
          organId: this.organId,
        };
      } else {
        (obj = record),
          (obj.registerOrderId = this.queryCondition.registerOrderId), //  资产登记ID
          (obj.assetType = this.queryCondition.assetType),
          (obj.organId = this.organId);
      }
      this.$nextTick(() => {
        this.$refs.chargesNewEdit.allMounted(str, obj);
        this.$refs.chargesNewEdit.modalShow = true;
      });
    },
    cancel() {
      this.modalShow = false;
    },
    // 导入
    addTheAsset() {
      this.$refs.eportAndDownFile.visible = true;
    },
    // 上传文件
    uploadModeFile(file) {
      let fileData = new FormData();
      fileData.append('file', file);
      fileData.append('organId', this.organId);
      fileData.append('registerOrderId', this.registerOrderId);
      // fileData.append('assetType', this.assetType)
      let loadingName = this.SG_Loding('导入中...');
      this.$api.assets.correlationExpenseImport(fileData).then(
        (res) => {
          if (res.data.code === '0') {
            this.DE_Loding(loadingName).then(() => {
              this.$refs.eportAndDownFile.visible = false;
              this.$SG_Message.success('导入成功！');
              this.allQuery();
            });
          } else {
            this.DE_Loding(loadingName).then(() => {
              this.$refs.eportAndDownFile.visible = false;
              this.$SG_Message.error(res.data.message);
            });
          }
        },
        () => {
          this.DE_Loding(loadingName).then((res) => {
            this.$SG_Message.error('导入失败！');
          });
        }
      );
    },
    down() {
      let obj = {
        registerOrderId: this.queryCondition.registerOrderId, // 资产登记单
        assetType: this.queryCondition.assetType, // 资产类型
      };
      this.$api.assets.correlationExpenseExport(obj).then((res) => {
        let blob = new Blob([res.data]);
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = `相关费用.xls`;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    },
    // 分页查询
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.queryCondition.pageSize = data.pageLength;
      this.query();
    },
    // 查询
    query() {
      this.loading = true;
      this.$api.assets.correlationExpenseList(this.queryCondition).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data.data;
          data.forEach((item, index) => {
            item.key = index;
          });
          this.tableData = data;
          this.count = res.data.data.count;
          this.correlationExpenseTotal();
          this.loading = false;
        } else {
          this.$message.error(res.data.message);
          this.loading = false;
        }
      });
    },
    // 统计
    correlationExpenseTotal() {
      let obj = {
        registerOrderId: this.queryCondition.registerOrderId, // 资产登记单
        assetType: this.queryCondition.assetType, // 资产类型
      };
      this.$api.assets.correlationExpenseTotal(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          this.statistics = res.data.data;
          console.log(this.statistics, '-=-=-=-=');
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
};
</script>
<style lang="less" scoped>
.necessaryCaaessories {
  .button-box {
    overflow: hidden;
    margin-bottom: 15px;
    line-height: 40px;
    display: flex;
    .button-l {
      flex: 1;
      text-align: left;
    }
    .buytton-nav {
      flex: 1;
      text-align: right;
    }
  }
  .tab-opt {
    span {
      padding-right: 10px;
      color: #0084ff;
      cursor: pointer;
    }
    .postAssignment-icon {
      color: red;
    }
  }
  .overflowX {
    /deep/ .ant-table-scroll {
      overflow-x: auto;
    }
    /deep/.ant-table-header {
      padding-bottom: 0px !important;
      margin-bottom: 0px !important;
    }
  }
}
</style>
