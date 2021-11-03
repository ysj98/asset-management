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
          :top-organ-id="currentTopOrganId"
          @handleSelect="handleSelect"
        />
      </div>
      <div class="content-right">
        <SG-Title :title="selectedKind.equipmentName" />
        <div>
          <Information
            title-width="100px"
            v-bind="kindInfoListOptions"
          ></Information>
        </div>
        <SG-Title title="下级分类" />
        <SubEquipmentCategoryTable
          style="height: calc(100% - 320px);overflow:auto;"
          ref="SubEquipmentCategoryTableRef"
          :up-equipment-id="selectedKind.equipmentId"
          :up-equipment-name="selectedKind.equipmentName"
          :organ-id="currentTopOrganId"
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
        equipmentId: ""
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
    setKindAttrNum(num) {
      this.kindInfoListOptions.formatBasicInfoList[1][0].title = `台帐属性(${num ||
        0})`;
    },
    async handleSelect(dataRef) {
      this.selectedKind = dataRef;
      this.setKindAttrNum(dataRef.attrNum);
      const attrs = await this.getKindAttrs(dataRef);
      this.handleKindInfoList({ dataRef, attrs: attrs || [] });
    },
    changeTopOrganId({ value }) {
      this.currentTopOrganId = value;
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
  height: calc(100vh - 102px);
  .top {
    height: 60px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    padding: 10px 30px;
    border-bottom: 1px solid #e8e8e8;
  }
  .content {
    display: flex;
    height: calc(100% - 60px);
    &-left {
      max-width: 400px;
    }
    &-right {
      flex: 1;
      padding: 10px 20px;
      position: relative;
    }
  }
}
</style>
