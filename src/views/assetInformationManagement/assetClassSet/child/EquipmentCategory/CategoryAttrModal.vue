<template>
  <div>
    <SG-Modal
      :title="modalOptions.title"
      :visible="true"
      @cancel="
        () => {
          $emit('doClosePop', modalOptions.modalName);
        }
      "
    >
      <a-table ref="refTable" v-bind="tableOptions">
        <!-- 表格 底部 新增 -->
        <template #footer>
          <div @click="handleAddAttr" class="table-footer">
            <a-icon type="plus" />
            <span style="margin-left: 5px">新增分类</span>
          </div>
        </template>
        <!-- 属性名称 -->
        <template #attrName="text, record">
          <a-input v-if="!record.attrId" :max="100" v-model="record.attrName" placeholder="请输入属性名称"></a-input>
          <span v-else>
            {{ record.attrName }}
          </span>
        </template>
        <!-- 操作 -->
        <template #action="text, record">
          <a class="red" @click="handleDelete(record)">删除</a>
        </template>
      </a-table>
      <template #footer>
        <a-button type="primary" @click="handleSave">保存</a-button>
        <a-button style="margin-left: 20px" @click="$emit('doClosePop', modalOptions.modalName)"> 取消 </a-button>
      </template>
    </SG-Modal>
  </div>
</template>

<script>
import { uuid } from 'utils/utils';
import Cookies from 'js-cookie';
export default {
  /*
   * 分类属性
   * */
  name: 'CategoryAttrModal',
  props: {
    modalOptions: {
      type: Object,
      required: true,
    },
  },
  data() {
    return {
      total: 0,
      organId: '',
      equipmentId: '',
      tableOptions: {
        scroll: { x: 500, y: 400 },
        pagination: false,
        loading: true,
        rowKey: function (record) {
          return record.attrId || record._key;
        },
        dataSource: [],
        columns: [
          {
            title: '序号',
            customRender(text, record, index) {
              return index + 1;
            },
          },
          {
            title: '属性名称',
            key: 'attrName',
            scopedSlots: {
              customRender: 'attrName',
            },
          },
          {
            title: '操作',
            key: 'action',
            scopedSlots: {
              customRender: 'action',
            },
          },
        ],
      },
    };
  },
  methods: {
    handleAddAttr() {
      this.tableOptions.dataSource.push({
        _key: uuid(),
      });
      this.$nextTick(() => {
        const antTableBodyEle = this.$refs.refTable.$el.querySelector('.ant-table-body');
        antTableBodyEle.scrollTop = antTableBodyEle.scrollHeight;
      });
    },
    async handleSave() {
      const tempArr = this.tableOptions.dataSource
        .filter((ele) => !ele.attrId)
        .map((ele) => ({
          attrName: ele.attrName,
        }));
      if (!tempArr.length) {
        this.$message.success('操做成功');
        this.$emit('doClosePop', this.modalOptions.modalName);
        return null;
      } else {
        if (
          !tempArr.every((ele) => {
            return ele.attrName;
          })
        ) {
          this.$message.error('请输入属性名称');
          return null;
        }
        const attrNameArr = this.tableOptions.dataSource.map((ele) => ele.attrName);
        if (attrNameArr.length !== new Set(attrNameArr).size) {
          this.$message.error('属性名称不能重复');
          return null;
        }
      }
      const requestData = {
        organId: this.organId,
        equipmentId: this.equipmentId,
        userId: Cookies.get('aid'),
        attrList: tempArr,
      };
      const {
        data: { code, message },
      } = await this.$api.assets.batchSaveInfoAttr(requestData);
      if (code === 0) {
        this.$message.success('新增成功');
        this.modalOptions.payload.successFn(this.tableOptions.dataSource.length);
        this.$emit('doClosePop', this.modalOptions.modalName);
      } else {
        this.$message.error(message);
      }
    },
    handleDelete(record) {
      const { attrId, attrOrganRelId, _key } = record;
      const _this = this;
      this.$SG_Modal.confirm({
        content: `确定删除此属性吗?`,
        okText: '确定',
        cancelText: '取消',
        onOk: async () => {
          if (attrId) {
            const requestData = {
              organId: _this.organId,
              attrOrganRelId: attrOrganRelId,
              userId: Cookies.get('aid'),
            };
            const {
              data: { message, code },
            } = await this.$api.assets.deleteInfoAttr(requestData);
            if (code === 0) {
              const idx = _this.tableOptions.dataSource.findIndex((ele) => ele.attrId === attrId);
              this.$message.success('操作成功');
              if (idx !== -1) {
                _this.tableOptions.dataSource.splice(idx, 1);
              }
              this.modalOptions.payload.successFn(this.tableOptions.dataSource.filter((ele) => ele.attrId).length);
            } else {
              _this.$SG_Message.error(message);
            }
          } else {
            const idx = _this.tableOptions.dataSource.findIndex((ele) => ele._key === _key);
            if (idx !== -1) {
              _this.tableOptions.dataSource.splice(idx, 1);
              this.$message.success('操作成功');
            }
          }
        },
      });
    },
    async getTableData() {
      this.tableOptions.loading = true;
      const requestData = {
        organId: this.organId,
        equipmentId: this.equipmentId,
      };
      const {
        data: { code, message, data },
      } = await this.$api.assets.getInfoAttrListByEquipmentId(requestData);
      this.tableOptions.loading = false;
      if (code === 0) {
        this.tableOptions.dataSource = data ? data.resultList : [];
      } else {
        this.$message.error(message);
      }
    },
  },
  mounted() {
    const { payload } = this.modalOptions;
    this.organId = payload.organId;
    this.equipmentId = payload.equipmentId;
    this.getTableData();
  },
};
</script>

<style scoped lang="less">
.table-footer {
  border: 1px dashed #eff4f9;
  cursor: pointer;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
}
::v-deep .ant-table-footer {
  background-color: #fff;
  padding: 0;
}
.table-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #e8e8e8;
  cursor: pointer;
  padding: 8px 20px;
  height: 30px;
}
::v-deep .ant-table-body {
  scroll-behavior: smooth;
}
</style>
