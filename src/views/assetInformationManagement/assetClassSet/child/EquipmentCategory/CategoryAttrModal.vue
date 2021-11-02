<template>
  <div>
    <SG-Modal
      :title="modalOptions.title"
      :value="modalOptions.flag"
      @ok="handleSave"
      @cancel="$emit('doClosePop', modalOptions.modalName)"
    >
      <a-table v-bind="tableOptions">
        <!-- 表格 底部 新增 -->
        <template #footer>
          <div class="table-footer">
            新增
          </div>
        </template>
        <!-- 操作 -->
        <template #action="text,record">
          <a @click="handleDelete(record)">删除</a>
        </template>
      </a-table>
    </SG-Modal>
  </div>
</template>

<script>
export default {
  /*
   * 分类属性
   * */
  name: "KindAttrModal",
  props: {
    modalOptions: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      tableOptions: {
        rowKey: "attrId",
        dataSource: [],
        columns: [
          {
            title: "序号",
            customRender(text, record, index) {
              return index + 1;
            }
          },
          {
            title: "属性名称",
            dataIndex: "attrName"
          },
          {
            title: "操作",
            key: "action",
            scopedSlots: {
              customRender: "action"
            }
          }
        ]
      }
    };
  },
  methods: {
    async handleSave() {},
    handleDelete({ attrOrganRelId }) {
      const requestData = {
        organId,
        attrOrganRelId,
        userId
      };
    }
  }
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
</style>
