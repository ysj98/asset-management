<template>
  <div>
    <a-table v-bind="tableOptions">
      <!-- 分类名称 -->
      <template #professionName="text,record,index">
        <a-input
          style="width: 200px;"
          v-model="record.professionName"
          placeholder="请输入分类编码"
        ></a-input>
      </template>
      <!-- 属性数量 -->
      <template #attrNum="text,record,index">
        <a
          v-if="record.professionCode"
          style="text-decoration: underline"
          @click="handleSetAttr(record)"
        >
          {{ record.attrNum || 0 }}
        </a>
        <span title="请保存成功之后设置属性" v-else>--</span>
      </template>
      <!-- 专业设备 -->
      <template #equipmentCode="text,record,index">
        <a-select
          :disabled="Boolean(record.professionCode)"
          v-model="record.equipmentCode"
          style="width: 200px;"
          :options="equipmentCodeSubOptions"
        ></a-select>
      </template>
      <!-- 净残值率 -->
      <template #netSalvageRate="text,record,index">
        <a-input-number
          style="width: 200px;"
          v-model="record.netSalvageRate"
          placeholder="请输入净残值率"
          :min="0"
          :max="999.99"
          :precision="2"
        ></a-input-number>
      </template>
      <!-- 折旧方式 -->
      <template #depreciationMethod="text,record,index">
        <a-select
          v-model="record.depreciationMethod"
          style="width: 200px;"
          :options="depreciationMethodOptions"
        ></a-select>
      </template>
      <!-- 使用年限 -->
      <template #usedAge="text,record,index">
        <a-input-number
          style="width: 110px;"
          v-model="record.usedAge"
          :min="0"
          :max="999"
          :step="1"
          placeholder="请输入使用年限"
        ></a-input-number>
      </template>
      <!-- 折旧年限 -->
      <template #depreciationAge="text,record,index">
        <a-input-number
          style="width: 110px;"
          v-model="record.depreciationAge"
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
    <div class="footer">
      <div>
        <a-button @click="handleSave" type="primary">保存</a-button>
        <a-button
          @click="handleResetSubEquipmentCategoryTable"
          style="margin-left: 20px;"
        >
          重置
        </a-button>
      </div>
    </div>
    <CategoryAttrModal
      v-if="modalList.CategoryAttrModal.flag"
      @success="handleSetAttrSuccess"
      @doClosePop="doClosePop"
      :modal-options="modalList.CategoryAttrModal"
    />
  </div>
</template>

<script>
import { uuid } from "utils/utils";
import { pick } from "lodash";
import CategoryAttrModal from "@/views/assetInformationManagement/assetClassSet/child/EquipmentCategory/CategoryAttrModal";
export default {
  /*
   * 下级分类
   * */
  name: "SubEquipmentCategoryTable",
  components: {
    CategoryAttrModal
  },
  props: {
    organId: {
      type: String,
      required: true
    },
    upEquipmentId: {
      type: [String, Number],
      required: true
    },
    upEquipmentName: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      tableOptions: {
        rowKey: function(record) {
          return record.professionCode || record._key;
        },
        scroll:{
          x: 2560,
          y: 450
        },
        pagination: false,
        dataSource: [],
        columns: [
          {
            title: "序号",
            key: "index",
            width: 80,
            customRender(text, record, index) {
              return index + 1;
            }
          },
          {
            title: "分类ID",
            key: "professionCode",
            width: 100,
            customRender(_, record) {
              return record.professionCode || "--";
            }
          },
          {
            title: "分类名称",
            width: 240,
            key: "professionName",
            scopedSlots: {
              customRender: "professionName"
            }
          },
          {
            title: "属性数量",
            key: "attrNum",
            width: 80,
            scopedSlots: {
              customRender: "attrNum"
            }
          },
          {
            title: "专业设备",
            width: 240,
            key: "equipmentCode",
            scopedSlots: {
              customRender: "equipmentCode"
            }
          },
          {
            title: "净残值率(%)",
            width: 240,
            key: "netSalvageRate",
            scopedSlots: {
              customRender: "netSalvageRate"
            }
          },
          {
            title: "折旧方式",
            width: 240,
            key: "depreciationMethod",
            scopedSlots: {
              customRender: "depreciationMethod"
            }
          },
          {
            title: "使用年限",
            width: 180,
            key: "usedAge",
            scopedSlots: {
              customRender: "usedAge"
            }
          },
          {
            title: "折旧年限",
            width: 180,
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
            width: 100,
            key: "action",
            scopedSlots: {
              customRender: "action"
            }
          }
        ]
      },
      modalList: {
        CategoryAttrModal: {
          modalName: "CategoryAttrModal",
          flag: false,
          title: "分类属性",
          payload: {}
        }
      }
    };
  },
  watch: {
    upEquipmentId: {
      handler: function (newValue) {
        if (newValue) {
          this.getPage(newValue);
        }
      },
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
    },
    equipmentCodeSubOptions() {
      return this.$store.state.platformDict.EQUIPMENT_CODE_SUB.map(ele => {
        return {
          title: ele.name,
          value: ele.value,
          label: ele.name
        };
      });
    }
  },
  methods: {
    doOpenPop(modal, title) {
      this.modalList[modal].flag = true;
      if (title) {
        this.modalList[modal].title = title;
      }
    },
    doClosePop(modal) {
      this.modalList[modal].flag = false;
    },
    handleSetAttrSuccess() {},
    handleSetAttr(record) {
      this.doOpenPop("CategoryAttrModal");
      this.modalList.CategoryAttrModal.payload = {
        successFn(num) {
          record.attrNum = num;
        },
        organId: this.organId,
        equipmentId: record.professionCode
      };
    },
    handleResetSubEquipmentCategoryTable() {
      this.getPage(this.upEquipmentId);
    },
    handleAddCategory() {
      if (!this.upEquipmentId) {
        this.$message.error("请先选择分类");
        return null;
      }
      this.tableOptions.dataSource.push({
        _key: uuid()
      });
    },
    handleDelete(record) {
      const { professionCode, _key } = record;
      const _this = this;
      this.$SG_Modal.confirm({
        title: `确定删除此分类吗?`,
        okText: "确定",
        cancelText: "取消",
        onOk: async () => {
          if (professionCode) {
            const requestData = {
              ...record,
              organId: _this.organId,
              categoryConfId: professionCode,
              status: 0
            };
            const {
              data: { message, code }
            } = await this.$api.assets.updateEquipmentStatus(requestData);
            if (code === "0") {
              const idx = _this.tableOptions.dataSource.findIndex(
                ele => ele.professionCode === professionCode
              );
              this.$message.success("操作成功");
              this.$emit('actionSuccess')
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
              this.$emit('actionSuccess')
            }
          }
        }
      });
    },
    async handleSave() {
      if (!this.upEquipmentId) {
        this.$message.error("请选择设备设施分类");
        return null;
      }
      if (!this.tableOptions.dataSource.length) {
        this.$message.error("不存在下级分类 无法保存");
        return null;
      }
      if (!this.tableOptions.dataSource.every(ele => ele.professionName)) {
        this.$message.error("请输入分类名称");
        return null;
      }
      const professionNameArr = this.tableOptions.dataSource.map(ele=>ele.professionName)
      if(professionNameArr.length !== new Set(professionNameArr).size){
        this.$message.error("分类名称不能重复")
        return null
      }
      const keyArr = [
        "equipmentOrganRelId",
        "equipmentName",
        "equipmentCode",
        "assetType",
        "professionCode",
        "depreciationMethod",
        "netSalvageRate",
        "usedAge",
        "depreciationAge"
      ];
      const tempArr = this.tableOptions.dataSource.map(ele => {
        const res = pick(ele, keyArr);
        return {
          ...res,
          assetType: 3,
          organId: this.organId,
          categoryConfId: ele.categoryConfId || "",
          upEquipmentId: this.upEquipmentId,
          upEquipmentName: this.upEquipmentName,
          equipmentId: ele.professionCode || "",
          equipmentName: ele.professionName || "",
          professionName: ele.professionName || ""
        };
      });
      const requestData = {
        categoryBatchEquipmentDtos: tempArr
      };
      const {
        data: { code, message }
      } = await this.$api.assets.updateEquipment(requestData);
      if (code === "0") {
        this.$message.success("保存成功");
        this.getPage(this.upEquipmentId);
        this.$emit('actionSuccess')
      } else {
        this.$message.error(message);
      }
    },
    async getPage(upEquipmentId) {
      if (!upEquipmentId) {
        this.$message.error("请选择设备设施分类");
        return null;
      }
      const requestData = {
        pageNum: 1,
        pageSize: 9999,
        organId: this.organId,
        assetType: this.$store.state.ASSET_TYPE_CODE.EQUIPMENT,
        upEquipmentId: upEquipmentId
      };
      const {
        data: { code, data }
      } = await this.$api.assets.getPage(requestData);
      if (code === "0") {
        this.tableOptions.dataSource = data ? data.data : [];
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
.footer {
  z-index: 3;
  height: 60px;
  text-align: center;
  line-height: 60px;
  background-color: #fff;
  width: 100%;
}
::v-deep .ant-table-footer {
  background-color: #fff;
  padding: 0;
}
</style>
