<template>
  <div class="tab-container">
    <div class="top">
      <div>
        <!--  导出 批量导入      -->
      </div>
      <div>
        <TopOrganByUser
          @change="changeTopOrganId"
          :hasAll="false"
          :selectFirst="true"
          style="width: 300px;"
        />
      </div>
    </div>
    <div class="content">
      <div class="content-left">
        <EquipmentTree
          :organId="currentTopOrganId"
          @handleSelect="handleSelect"
          ref="refEquipmentTree"
          :selectedKeysDefault.sync="selectedKeysDefault"
          :expandedKeysDefault.sync="expandedKeysDefault"
        />
      </div>
      <div class="content-right">
        <div v-if="selectedKind.value !== -1">
          <SG-Title :title="selectedKind.equipmentName" />
          <div>
            <Information v-bind="kindInfoListOptions"></Information>
          </div>
        </div>
        <SG-Title title="下级分类" />
        <SubEquipmentCategoryTable
          ref="SubEquipmentCategoryTableRef"
          :up-equipment-id="selectedKind.equipmentId"
          :up-equipment-name="selectedKind.equipmentName"
          :organ-id="currentTopOrganId"
          @actionSuccess="handleActionSuccess"
        />
      </div>
    </div>
  </div>
</template>

<script>
import Information from "@/components/Information";
import EquipmentTree from "@/views/assetInformationManagement/assetClassSet/child/EquipmentCategory/EquipmentTree";
import SubEquipmentCategoryTable from "@/views/assetInformationManagement/assetClassSet/child/EquipmentCategory/SubEquipmentCategoryTable";
import TopOrganByUser from "@/views/common/topOrganByUser";
export default {
  /*
   * 设备 设施分类
   * */
  name: "EquipmentKind",
  components: {
    Information,
    EquipmentTree,
    TopOrganByUser,
    SubEquipmentCategoryTable
  },
  data() {
    return {
      selectedKeysDefault:[],
      expandedKeysDefault:[],
      modalList: {
        CategoryAttrModal: {
          modalName: "CategoryAttrModal",
          title: "分类属性",
          payload: {}
        }
      },
      currentTopOrganId: "",
      selectedKind: {
        equipmentName: "--",
        equipmentId: "",
        value: ""
      },
      kindInfoListOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: "分类名称",
              key: "equipmentName"
            },
            {
              title: "分类ID",
              key: "equipmentId"
            }
            // TODO:没有这个信息
            // {
            //   title: "分类描述",
            //   key: "",
            //   value: ""
            // }
          ],
          [
            {
              title: "台帐属性(0)",
              key: "attrNames",
              colProps: {
                span: 24
              }
            }
          ]
        ],
        colProps: { span: 8 }
      }
    };
  },
  methods: {
    handleActionSuccess(){
      this.$refs.refEquipmentTree.resetLoad()
    },
    setKindAttrNum(num) {
      this.kindInfoListOptions.formatBasicInfoList[1][0].title = `台帐属性(${num ||
        0})`;
    },
    async handleSelect(dataRef) {
      this.selectedKind = dataRef;
      if (this.selectedKind.value === -1) {
        this.selectedKind.equipmentId = -1;
        this.selectedKind.equipmentName = "";
        return null;
      }
      const attrs = await this.getKindAttrs(dataRef);
      this.setKindAttrNum((attrs || []).length);
      this.handleKindInfoList({ dataRef, attrs: attrs || [] });
    },
    changeTopOrganId({ value }) {
      this.currentTopOrganId = value;
      this.handleSelect({ equipmentName: "", equipmentId: -1, value: -1 });
    },
    handleKindInfoList({ dataRef, attrs }) {
      const attrNames = attrs.map(e => e.attrName).join("、");
      this.kindInfoListOptions.data = { ...dataRef, attrNames };
    },
    async getKindAttrs(kindData) {
      return new Promise(async (resolve, reject) => {
        const { equipmentId } = kindData;
        const requestData = {
          organId: this.currentTopOrganId,
          equipmentId
        };
        const {
          data: {
            code,
            message,
            data: { resultList }
          }
        } = await this.$api.assets.getInfoAttrListByEquipmentId(requestData);
        if (code === 0) {
          resolve(resultList);
        } else {
          reject(message);
        }
      });
    }
  }
};
</script>

<style scoped lang="less">
.tab-container {
  position: relative;
  //height: calc(100vh - 102px);
  .top {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 10px 30px;
    border-bottom: 1px solid #e8e8e8;
  }
  .content {
    width: 100%;
    min-height: calc(100vh - 162px);
    position: relative;
    overflow: auto;
    &-left {
      width: 300px;
    }
    &-right {
      position: absolute;
      width: calc(100% - 300px);
      min-height: 620px;
      max-height: 800px;
      left: 300px;
      top: 0;
      padding: 10px 20px;
    }
  }
}
</style>
