<template>
  <div>
    <a-table v-bind="tableOptions">
      <!-- 分类名称 -->
      <template #professionName="text,record,index">
        <a-input
          v-model="record.professionName"
          placeholder="请输入分类编码"
        ></a-input>
      </template>
      <!-- 属性数量 -->
      <template #attrNum="text,record,index"> </template>
      <!-- 专业分类 -->
      <template #equipmentCode="text,record,index"> </template>
      <!-- 净残值率 -->
      <template #netSalvageRate="text,record,index">
        <a-input placeholder="请输入净残值率"></a-input>
      </template>
      <!-- 折旧方式 -->
      <template #depreciationMethod="text,record,index">
        <a-select
          style="width: 300px;"
          :options="depreciationMethodOptions"
        ></a-select>
      </template>
      <!-- 使用年限 -->
      <template #usedAge="text,record,index">
        <a-input-number
          :min="0"
          :max="999"
          :step="1"
          placeholder="请输入使用年限"
        ></a-input-number>
      </template>
      <!-- 折旧年限 -->
      <template #depreciationAge="text,record,index">
        <a-input-number
          :min="0"
          :max="999"
          :step="1"
          placeholder="请输入折旧年限"
        ></a-input-number>
      </template>
      <!-- 操作 -->
      <template #action="text,record,index">
        <a @click="handleDelete(record)">删除</a>
      </template>
      <template #footer>
        <div @click="handleAddCategory" class="table-footer">
          <a-icon type="plus" />
          <span style="margin-left: 5px;">新增分类</span>
        </div>
      </template>
    </a-table>
  </div>
</template>

<script>
import { uuid } from "utils/utils";

export default {
  /*
   * 下级分类
   * */
  name: "SubEquipmentCategoryTable",
  props: {
    organId: {
      type: String,
      required: true
    },
    upEquipmentId: {
      type: [String, Number],
      required: true
    }
  },
  data() {
    return {
      tableOptions: {
        rowKey: function(record) {
          return record.categoryConfId || record._key;
        },
        pagination: false,
        dataSource: [],
        columns: [
          {
            title: "序号",
            key: "index",
            customRender(text, record, index) {
              return index + 1;
            }
          },
          {
            title: "分类ID",
            key: "categoryConfId",
            customRender(_, record) {
              return record.categoryConfId || '--';
            }
          },
          {
            title: "分类名称",
            key: "professionName",
            scopedSlots: {
              customRender: "professionName"
            }
          },
          {
            title: "属性数量",
            key: "attrNum",
            scopedSlots: {
              customRender: "attrNum"
            }
          },
          {
            title: "专业分类",
            key: "equipmentCode",
            scopedSlots: {
              customRender: "equipmentCode"
            }
          },
          {
            title: "净残值率(%)",
            key: "netSalvageRate",
            scopedSlots: {
              customRender: "netSalvageRate"
            }
          },
          {
            title: "折旧方式",
            key: "depreciationMethod",
            scopedSlots: {
              customRender: "depreciationMethod"
            }
          },
          {
            title: "使用年限",
            key: "usedAge",
            scopedSlots: {
              customRender: "usedAge"
            }
          },
          {
            title: "折旧年限",
            key: "depreciationAge",
            scopedSlots: {
              customRender: "depreciationAge"
            }
          },
          // {
          //   title: "描述"
          // },
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
  watch: {
    upEquipmentId(newValue) {
      if (newValue) {
        this.getPage(newValue);
      }
    }
  },
  computed: {
    depreciationMethodOptions() {
      return this.$store.state.platformDict.DEPRECIATION_METHOD.map(ele => {
        return {
          title: ele.name,
          value: ele.value,
          label: ele.name
        };
      });
    }
  },
  methods: {
    handleAddCategory() {
      if (!this.upEquipmentId) {
        this.$message.error("请先选择分类");
      }
      this.tableOptions.dataSource.push({
        _key: uuid()
      });
    },
    handleDelete({ equipmentOrganRelId, categoryConfId, _key }) {
      const _this = this;
      this.$SG_Modal.confirm({
        title: `确定删除分类吗?`,
        okText: "确定",
        cancelText: "取消",
        async onOk() {
          if (categoryConfId) {
            const requestData = {
              organId: _this.organId,
              equipmentOrganRelId,
              categoryConfId,
              status: 0
            };
            const {
              message,
              code
            } = await this.$api.assets.updateEquipmentStatus(requestData);
            if (code === "0") {
              const idx = _this.tableOptions.dataSource.findIndex(
                ele => ele.categoryConfId === categoryConfId
              );
              if (idx !== -1) {
                _this.tableOptions.dataSource.splice(idx, 1);
              }
            } else {
              _this.$SG_Message.error(message);
            }
          } else {
            const idx = _this.tableOptions.dataSource.findIndex(
              ele => ele._key === _key
            );
            if (idx !== -1) {
              _this.tableOptions.dataSource.splice(idx, 1);
            }
          }
        }
      });
    },
    async getPage(upEquipmentId) {
      const requestData = {
        pageNum: 1,
        pageSize: 9999,
        organId: this.organId,
        assetType: this.$store.state.ASSET_TYPE_CODE.EQUIPMENT,
        upEquipmentId: upEquipmentId
      };
      const {
        data: {
          code,
          data: { data }
        }
      } = await this.$api.assets.getPage(requestData);
      if (code === "0") {
        this.tableOptions.dataSource = data;
      }
    }
  },
  mounted() {}
};
</script>

<style scoped>
.table-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px dashed #e8e8e8;
  cursor: pointer;
  padding: 8px 20px;
}
::v-deep .ant-table-footer {
  background-color: #fff;
  padding: 0;
}
</style>
