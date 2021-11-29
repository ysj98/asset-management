<template>
  <div>
    <div class="modal-nav container">
      <span class="title">资产类型：</span>
      <a-radio-group :value="checkboxAssetType">
        <a-radio
          v-for="(item, index) in checkboxData"
          :key="index"
          disabled
          :value="item.value"
        >
          {{ item.name }}
        </a-radio>
      </a-radio-group>
    </div>
    <div
      v-if="[ASSET_TYPE_CODE.EQUIPMENT,ASSET_TYPE_CODE.YARD].includes(checkboxAssetType)"
      style="margin: 0 0 20px;"
      class="container"
    >
      <span class="title">所属组织：</span>
      <TreeSelect
        @change="handleChangeOrgan"
        style="width: 300px"
        :allowClear="false"
      />
    </div>
    <div class="container">
      <span class="title">{{ title }}：</span>
      <EquipmentSelectTree
        v-if="[ASSET_TYPE_CODE.EQUIPMENT].includes(checkboxAssetType)"
        style="width: 300px"
        :top-organ-id="topOrganId"
        :multiple="true"
        :value="positionIds"
        @change="handlePositionIds"
      />
      <a-select
        v-else
        style="width: 300px"
        mode="multiple"
        :maxTagCount="4"
        showSearch
        :placeholder="`请选择${title}`"
        :value="positionIds"
        @change="handlePositionIds"
        @search="handleSearch"
        optionFilterProp="children"
        :options="$addTitle(positionNameData)"
        :allowClear="true"
        :filterOption="false"
        notFoundContent="没有查询到数据"
      />
    </div>
    <div
      class="modal-nav container"
      v-if="
        [ASSET_TYPE_CODE.HOUSE, ASSET_TYPE_CODE.YARD].includes(
          checkboxAssetType
        )
      "
    >
      <span class="title">数据范围：</span>
      <a-checkbox-group
        :value="scope"
        @change="
          value => {
            $emit('update:scope', value);
          }
        "
      >
        <a-checkbox
          v-for="(item, index) in scopeDataCom"
          :key="index"
          :value="item.value"
        >
          {{ item.name }}
        </a-checkbox>
      </a-checkbox-group>
    </div>
  </div>
</template>

<script>
import {queryTopOrganByOrganID} from '@/views/buildingDict/publicFn.js'
import TreeSelect from "@/views/common/treeSelect";
import EquipmentSelectTree from "@/views/common/EquipmentSelectTree";
import { debounce } from "utils/utils";
const yardScopeData = [
  {
    value: "1",
    name: "车场"
  },
  {
    value: "2",
    name: "车位"
  }
];
const scopeData = [
  {
    value: "1",
    name: "楼栋"
  },
  {
    value: "2",
    name: "房屋"
  }
];
export default {
  name: "DownLoadTemplate",
  components: {
    TreeSelect,
    EquipmentSelectTree
  },
  props: {
    checkboxAssetType: {
      type: String,
      required: true
    },
    organId: {
      type: String,
      required: true
    },
    positionIds: {
      type: Array,
      required: true
    },
    scope: {
      type: Array,
      required: true
    }
  },

  data() {
    return {
      yardScopeData,
      scopeData,
      positionNameData: [],
      topOrganId: "",
      searchName:''
    };
  },
  computed: {
    title() {
      const ASSET_TYPE_CODE = this.$store.state.ASSET_TYPE_CODE;
      const title = {
        [ASSET_TYPE_CODE.HOUSE]: "楼栋名称",
        [ASSET_TYPE_CODE.LAND]: "土地名称",
        [ASSET_TYPE_CODE.YARD]: "车场名称",
        [ASSET_TYPE_CODE.EQUIPMENT]: "设备设施分类"
      };
      return title[this.checkboxAssetType];
    },
    checkboxData() {
      return this.$store.state.ASSET_TYPE_OPTIONS;
    },
    ASSET_TYPE_CODE() {
      return this.$store.state.ASSET_TYPE_CODE;
    },
    scopeDataCom() {
      if (this.checkboxAssetType === this.$store.state.ASSET_TYPE_CODE.HOUSE) {
        return this.scopeData;
      } else {
        return this.yardScopeData;
      }
    }
  },
  methods: {
    handlePositionIds(value) {
      this.$emit("update:positionIds", value);
    },
    async handleChangeOrgan(userSelectedOrganId) {
      this.$emit("changeOrganId", userSelectedOrganId);
      if (this.ASSET_TYPE_CODE.EQUIPMENT === this.checkboxAssetType){
        const {organId:organTopId} = await queryTopOrganByOrganID({
          nOrganId:userSelectedOrganId,
          nOrgId:userSelectedOrganId
        });
        this.topOrganId = organTopId
      }
      if (this.ASSET_TYPE_CODE.YARD === this.checkboxAssetType){
        this.positionApiList(userSelectedOrganId,this.searchName)
      }
    },
    init() {
      // this.ASSET_TYPE_CODE.YARD
      const _tempArr = [this.ASSET_TYPE_CODE.HOUSE,this.ASSET_TYPE_CODE.LAND]
      if (_tempArr.includes(this.checkboxAssetType)){
        this.debounceMothed();
      }
    },
    handleChange(value) {
      this.$emit("input", value);
    },
    handleSearch(value) {
      this.searchName = value;
      this.debounceMothed();
    },
    // 防抖函数后台请求楼栋数据
    debounceMothed: debounce(function() {
      this.positionApiList(this.organId, this.searchName || "");
    }, 200),
    positionApiList(organId, aliasName) {
      if (this.checkboxAssetType === this.ASSET_TYPE_CODE.YARD){
        const requestData = {
          organId: this.topOrganId || organId,
          onlyCurrentNode: 1,
          nameOrCode: aliasName,
          pageNo: 1,
          pageLength: 20
        }
        this.$api.building.parkApiList(requestData).then(value=>{
          if (value.data.code === "0") {
            let result = value.data ? value.data.data.resultList : [];
            this.positionNameData = result.map(item => {
              return {
                name: item.placeName,
                value: item.placeId,
                label: item.placeName
              };
            });
          }
        })
      }else {
        this.$api.basics
          .positionApiList({
            organId,
            aliasName: aliasName || "",
            positionType: this.checkboxAssetType,
            subPositionType: ""
          })
          .then(res => {
            if (res.data.code === "0") {
              let result = res.data.data || [];
              this.positionNameData = result.map(item => {
                return {
                  name: item.aliasName,
                  value: item.positionId,
                  label: item.aliasName
                };
              });
            }
          });
      }
      }
  },
  created() {
    this.init();
  }
};
</script>

<style scoped>
.modal-nav {
  line-height: 60px;
}
.title {
  flex-basis: 100px;
}
.container {
  display: flex;
  align-items: center;
}
</style>
