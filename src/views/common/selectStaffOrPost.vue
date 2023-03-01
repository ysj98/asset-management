<!--
选岗位或选人组件
selectType  String 区分选人staff  选岗post
selectOptList Array 编辑时已选种的岗或人
selectionNumber Number 默认最多选择5个 传0不做选择控制且显示全选按钮
allOrganId: Array  默认选择全部组织机构  如果传了组织机构进来就只能选择改组织机构下的组织机构的人
-->
<template>
  <div class="select-staffs-components">
    <!-- 弹框内容 -->
    <a-modal
      class="dialog"
      :title="'选择' + selectTypeText"
      v-model="visible"
      okText="确认"
      width="700px"
      wrapClassName="select-dialog custom-modal-white"
      :footer="null"
      :closable="false"
      :maskClosable="false"
      cancelText="取消"
    >
      <div class="data-wrapper">
        <!-- 顶部查询 -->
        <div class="header">
          <div class="query-condition">
            <!-- 选择组织机构 -->
            <TreeSelect v-if="allOrganId.length === 0" @changeTree="changeTree" placeholder="请选择组织机构" :allowClear="false" :style="allStyle" />
            <primaryTree
              v-if="allOrganId.length > 0"
              @changeTree="changeTree"
              :allOrganId="allOrganId"
              placeholder="请选择组织机构"
              :allowClear="false"
              :style="allStyle"
            ></primaryTree>
            <!-- 选择人员姓氏首字母 -->
            <!-- <letter-list v-if="selectType==='staff'" v-model="queryCondition.staff.firstLetter" class="letter-select"></letter-list> -->
            <!-- 姓名搜索 -->
            <a-input-search
              class="name-search"
              placeholder="姓名"
              v-if="selectType === 'staff'"
              v-model="queryCondition.staff.name"
              @search="getSearchDataList"
            >
            </a-input-search>
            <!-- 显示label -->
            <!-- <span v-if="selectType==='post'" class="fr">待选岗位</span> -->
          </div>
          <div class="count-text">
            已选{{ selectTypeText }}: <span class="strong"> {{ checkCount }} </span>
          </div>
        </div>
        <!-- 列表内容 -->
        <div class="body">
          <!-- 左侧数据选择 -->
          <a-spin tip="Loading..." :spinning="spinning">
            <div class="selec-List-components">
              <div class="list">
                <!-- 单选 -->
                <a-checkbox
                  class="item"
                  v-for="(item, index) of mapList"
                  :checked="item.checked"
                  :key="item.id + index"
                  @change="oneCheck($event, item)"
                >
                  <a-tooltip class="tip" overlayClassName="form-name-popover" :title="selectTipText(item)" :getPopupContainer="getPopupContainer">
                    <span>{{ item.name }}</span>
                  </a-tooltip>
                </a-checkbox>
                <!-- 全选框 -->
                <a-checkbox v-if="selectionNumber === 0" class="item all" @change="onCheckAllChange" :checked="checkAll">
                  <span class="text">全选</span>
                </a-checkbox>
              </div>
              <div class="page">
                <p class="total-text">合计 {{ paginator.totalCount }} 条 , 共 {{ getPageCount(paginator) }} 页</p>
                <a-pagination
                  v-model="paginator.pageNo"
                  size="small"
                  @change="pageChange"
                  :pageSize="paginator.pageLength"
                  :defaultCurrent="1"
                  :total="paginator.totalCount"
                />
              </div>
            </div>
          </a-spin>
          <!-- 右侧选择的人员展示 -->
          <a-spin tip="Loading..." :spinning="spinning">
            <ul class="store-lib-components scrollbar">
              <li class="item" v-for="(item, id) of storeData" :key="id">
                <!-- 包裹容器 -->
                <div class="container">
                  <div class="name">{{ item.name }}</div>
                  <span class="facker-close" title="移除" @click="removeStoreLib(id)"></span>
                </div>
              </li>
            </ul>
          </a-spin>
        </div>
        <!-- 底部按钮 -->
        <div class="footer">
          <a-button class="footer-button" type="primary" @click="submitSelectAll">确认选择</a-button>
          <a-button class="footer-button" @click="cancelSelect">取消</a-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
// import letterList from './letterList.vue'
import TreeSelect from '@/views/common/treeSelect';
import primaryTree from './primaryTree';
import _ from 'lodash';
// import { queryUsersByOrgan, queryPostByOrgan } from '@/api/global'
import { queryUserPageList, queryPostNewPageList } from '@/api/basics.js';
// 选岗位与选人类型
let selectType = {
  staff: 'staff',
  post: 'post',
};
// 查询条件
let queryCondition = {
  staff: {
    name: null,
    firstLetter: null, // 人名首字母
  },
};
let paginator = {
  pageLength: 10,
  pageNo: 1,
  totalCount: 0,
};
const allStyle = { width: '148px' };
export default {
  name: 'selectStaffOrPost',
  components: {
    // selectDropTree,
    TreeSelect,
    primaryTree,
  },
  props: {
    allOrganId: {
      type: Array,
      default: () => [],
    },
    selectType: {
      type: [String, Number],
      default: 'staff',
    },
    selectOptList: {
      type: Array,
      default: () => [],
    },
    selectionNumber: {
      // 控制选择数量
      type: Number,
      default: 5,
    },
  },
  data() {
    return {
      judgeInstitutions: false,
      allStyle,
      visible: false,
      organId: {}, // 组织机构id
      checkAll: false,
      dataList: [], // 列表数据
      storeData: {}, // 勾选对象
      spinning: false, // 加载状态
      queryCondition: _.cloneDeep(queryCondition),
      paginator: { ...paginator },
    };
  },
  computed: {
    // 选择数量
    checkCount() {
      return Object.keys(this.storeData).length;
    },
    selectTypeText() {
      return this.selectType === 'staff' ? '人员' : '岗位';
    },
    mapList() {
      return this.dataList.map((v) => {
        v.checked = !!this.storeData[v.id];
        return v;
      });
    },
    // 关联全选的对象
    associateCheckAll() {
      const { storeData, dataList } = this;
      return { storeData, dataList };
    },
  },
  watch: {
    selectType() {
      this.resetData();
      if (this.organId.value) {
        this.getDataList();
      }
    },
    selectOptList: {
      handler(nv) {
        const list = _.cloneDeep(nv);
        const o = {};
        list.forEach((v) => {
          o[v.id] = v;
        });
        this.storeData = o;
      },
      deep: true,
      immediate: true,
    },
    'queryCondition.staff.firstLetter'(nv) {
      if (this.organId.value) {
        this.paginator.pageNo = 1;
        this.getDataList();
      }
    },
    // 检查数据源
    associateCheckAll: {
      handler() {
        this.checkAll = this.checkSelectIsAll();
      },
      deep: true,
      immediate: true,
    },
  },
  methods: {
    selectTipText(options) {
      if (this.selectType === 'staff') {
        const { organName, tel, name } = options;
        return `${name} (${organName} / ${tel} )`;
      } else {
        const { organName, groupName, postDesc, postCode, postName } = options;
        return [organName, postName, postCode, postDesc].filter((v) => v).join('/');
      }
    },
    // 重置数据
    resetData() {
      this.dataList = []; // 列表数据
      this.queryCondition = _.cloneDeep(queryCondition);
      this.paginator = { ...paginator };
    },
    // 隐藏弹框
    hideModal() {
      // this.resetData()
      this.visible = false;
    },
    changeTree(value, label) {
      this.organId = { label, value };
      this.paginator.pageNo = 1;
      this.getDataList();
    },
    // 查询人员列表
    getStaffListData() {
      const organId = this.organId.value;
      const {
        staff: { firstLetter, name },
      } = this.queryCondition;
      const { pageNo, pageLength } = this.paginator;
      const params = { organId, firstLetter, name, pageNo, pageLength, contractOrganId: organId };
      this.spinning = true;
      queryUserPageList(params)
        .then((res) => {
          const { code, data, message, paginator } = res.data;
          if (code === '0') {
            this.paginator.totalCount = +paginator.totalCount;
            this.dataList = data.map((v) => {
              v.id = v.userId;
              v.name = v.name;
              return v;
            });
          } else {
            this.$message.error(message);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.spinning = false;
        });
    },
    // 查询岗位列表
    getPostListData() {
      const organId = this.organId.value;
      const { pageNo, pageLength } = this.paginator;
      const params = { organId, pageLength, pageNo };
      this.spinning = true;
      queryPostNewPageList(params)
        .then((res) => {
          const { code, data, message, paginator } = res.data;
          if (code === '0') {
            this.paginator.totalCount = +paginator.totalCount;
            this.dataList = data.resultList.map((v) => {
              v.name = v.postName;
              v.id = v.postId;
              return v;
            });
          } else {
            this.$message.error(message);
          }
        })
        .catch((err) => {
          console.log(err);
        })
        .finally(() => {
          this.spinning = false;
        });
    },
    getSearchDataList() {
      this.paginator.pageNo = 1;
      this.getDataList();
    },
    // 根据到底是选择人员还是岗位具体调用接口
    getDataList() {
      if (!this.organId.value) {
        return this.$message.error('请选择组织机构');
      }
      this.selectType === 'staff' ? this.getStaffListData() : this.getPostListData();
    },
    // 改变分页触发查询
    pageChange(pageNo, pageLength) {
      this.paginator.pageNo = pageNo;
      this.paginator.pageLength = pageLength;
      this.getDataList();
    },
    // 分页计算
    getPageCount({ pageLength, totalCount }) {
      if (totalCount === 0) {
        return 1;
      } else {
        const result = Number.parseInt(totalCount / pageLength);
        const ceil = Math.ceil(totalCount / pageLength);
        const isDivided = totalCount % pageLength === 0;
        return isDivided ? result : ceil;
      }
    },
    // 移除某个岗位或者人员
    removeStoreLib(id) {
      this.$delete(this.storeData, id);
    },
    // 全选点击实现的效果
    onCheckAllChange(e) {
      const { checked } = e.target;
      this.storeLibList(checked, this.dataList);
    },
    // 单个选中
    oneCheck(e, item) {
      const { id } = item;
      const { checked } = e.target;
      if (this.selectionNumber !== 0) {
        if (Object.values(this.storeData).length > this.selectionNumber - 1) {
          this.$message.info(`最多只能选择${this.selectionNumber}人`);
          return;
        }
      }
      checked ? this.$set(this.storeData, id, item) : this.$delete(this.storeData, id);
    },
    // 批量提交
    storeLibList(checked, list) {
      list.forEach((v) => {
        this.oneCheck({ target: { checked } }, v);
      });
    },
    // 提交所选的岗位或者联系人
    submitSelectAll() {
      let values = Object.values(this.storeData);
      if (!values.length) {
        return this.$message.error(`请选择${this.selectTypeText}!`);
      }
      this.$emit('change', values);
      this.visible = false;
    },
    // 取消选择
    cancelSelect() {
      this.hideModal();
      this.$emit('change', _.cloneDeep(this.selectOptList));
    },
    // 是否全选
    checkSelectIsAll() {
      return this.dataList.every((v) => this.storeData[v.id]);
    },
    getPopupContainer(e) {
      return e.parentElement;
    },
  },
};
</script>

<style lang="scss" scoped>
// 包裹容器
.dialog {
  .data-wrapper {
    .header {
      display: flex;
      justify-content: space-between;
      .query-condition {
        .letter-select {
          margin-left: 10px;
        }
        .name-search {
          width: 140px;
          margin-left: 10px;
        }
      }
      .count-text {
        font-size: 12px;
        color: #959dab;
        line-height: 32px;
        .strong {
          font-size: 14px;
          color: #49505e;
        }
      }
    }
    .body {
      display: flex;
      justify-content: space-between;
    }
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
  }
}
.store-lib-components {
  margin: 10px 0 0 20px;
  width: 180px;
  min-width: 180px;
  height: 275px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  overflow-y: auto;
  padding: 15px 0;
  .container {
    display: flex;
    align-items: center;
    width: 100%;
    height: 32px;
    line-height: 32px;
    color: #49505e;
    font-size: 14px;
    text-align: left;
    padding: 0 10px;
    &:hover {
      background: #f3f9ff;
    }
    .name {
      flex: 1;
    }
    .facker-close {
      display: inline-block;
      width: 24px;
      height: 24px;
      position: relative;
      font-size: 0;
      cursor: pointer;
      &:after {
        position: absolute;
        display: inline-block;
        left: 12px;
        top: 2px;
        width: 2px;
        height: 20px;
        content: '';
        background: #959dab;
        transform: rotateZ(45deg);
        border-radius: 2px;
      }
      &:before {
        position: absolute;
        display: inline-block;
        right: 10px;
        top: 2px;
        width: 2px;
        height: 20px;
        content: '';
        background: #959dab;
        transform: rotateZ(-45deg);
        border-radius: 2px;
      }
    }
  }
}
.selec-List-components {
  margin-top: 10px;
  width: 447px;
  height: 275px;
  border: 1px solid #d9d9d9;
  border-radius: 4px;
  .list {
    padding: 15px 0 0 20px;
    height: 230px;
    min-width: 440px;
    box-sizing: border-box;
    border-bottom: 1px solid #d9d9d9;
    .ant-checkbox-wrapper {
      margin-left: 0;
      width: 200px;
      height: 35px;
    }
    .all {
      display: block;
      .text {
        padding: 0;
      }
    }
  }
  .page {
    display: flex;
    padding: 10px;
    height: 45px;
    justify-content: space-between;
    // 分页
    .total-text {
      color: #6d7585;
      font-size: 12px;
      line-height: 24px;
    }
    // 分页样式修改
    .ant-pagination {
      padding: 0;
      .ant-pagination-prev {
        margin-right: 20px;
      }
      .ant-pagination-next {
        margin-left: 20px;
      }
    }
  }
}
</style>

<style lang="scss">
// 全局修改外层模态框的样式
// 合同提醒下的样式修改
.select-dialog {
  // 弹框内容
  min-width: 700px;
  .ant-modal-content {
    // 头部
    min-width: 700px;
  }
  .ant-modal-body {
    height: 440px;
  }
}
</style>
