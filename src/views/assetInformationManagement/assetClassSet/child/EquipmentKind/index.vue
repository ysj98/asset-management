<template>
  <div>
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
    <div class="container">
      <div class="container-left">
        <EquipmentTree :top-organ-id="currentTopOrganId" />
      </div>
      <div class="container-right">
        <SG-Title :title="selectedKind.name" />
        <div>
          <Information
            :col-props="{ span: 8 }"
            :format-basic-info-list="kindInfoList"
          ></Information>
        </div>
        <SG-Title title="下级分类" />
      </div>
    </div>
  </div>
</template>

<script>
import Information from "@/components/Information";
import EquipmentTree from "@/views/assetInformationManagement/assetClassSet/child/EquipmentKind/EquipmentTree";
import TopOrganByUser from "@/views/common/topOrganByUser";
export default {
  /*
   * 设备 设施分类
   * */
  name: "EquipmentKind",
  components: {
    Information,
    EquipmentTree,
    TopOrganByUser
  },
  data() {
    return {
      currentTopOrganId: "",
      selectedKind: {
        name: ""
      },
      kindInfoList: [
        [
          {
            title: "分类名称",
            key: "",
            value: ""
          },
          {
            title: "分类ID",
            key: "",
            value: ""
          },
          {
            title: "分类描述",
            key: "",
            value: ""
          }
        ],
        [
          {
            title: "台帐描述",
            key: "",
            value: "",
            colProps: {
              span: 24
            }
          }
        ]
      ]
    };
  },
  methods: {
    changeTopOrganId({ value }) {
      this.currentTopOrganId = value;
    }
  }
};
</script>

<style scoped lang="less">
.top {
  height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 10px 30px;
  border-bottom: 1px solid #e8e8e8;
}
.container {
  display: flex;
  height: 600px;
  &-left {
    flex-basis: 400px;
    border: 1px solid #e8e8e8;
    padding: 10px 20px;
  }
  &-right {
    flex: 1;
    padding: 10px 20px;
  }
}
</style>
