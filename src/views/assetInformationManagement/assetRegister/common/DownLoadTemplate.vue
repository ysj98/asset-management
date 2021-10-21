<template>
  <div>
    <div class="modal-nav">
      <a-radio-group :value="checkboxAssetType">
        <span>资产类型：</span>
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
      v-if="checkboxAssetType === ASSET_TYPE_CODE.EQUIPMENT"
      style="margin: 0 0 20px"
    >
      <span>所在位置：</span>
      <TreeSelect :allowClear="false"/>
      <BuildSelectedTree :organ-id="organId" />
    </div>
    <div>
      <span>{{ title }}：</span>
      <a-select
        style="width: 300px"
        mode="multiple"
        :maxTagCount="4"
        showSearch
        :placeholder="`请选择${title}`"
        :value="positionIds"
        @change="
          value => {
            $emit('update:positionIds', value);
          }
        "
        @search="handleSearch"
        optionFilterProp="children"
        :options="$addTitle(positionNameData)"
        :allowClear="true"
        :filterOption="false"
        notFoundContent="没有查询到数据"
      />
    </div>
    <div
      class="modal-nav"
      v-if="
        [ASSET_TYPE_CODE.HOUSE, ASSET_TYPE_CODE.YARD].includes(
          checkboxAssetType
        )
      "
    >
      <a-checkbox-group
        :value="scope"
        @change="
          value => {
            $emit('update:scope', value);
          }
        "
      >
        <span>数据范围：</span>
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
import BuildSelectedTree from "@/views/assetInformationManagement/assetRegister/common/BuildSelectedTree";
import TreeSelect from '@/views/common/treeSelect'
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
    BuildSelectedTree,
    TreeSelect
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
      positionNameData: []
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
    init() {
      this.debounceMothed();
    },
    handleChange(value) {
      this.$emit("input", value);
    },
    handleSearch(value) {
      this.searchBuildName = value;
      this.debounceMothed();
    },
    // 防抖函数后台请求楼栋数据
    debounceMothed: debounce(function() {
      this.positionApiList(this.organId, this.searchBuildName || "");
    }, 200),
    positionApiList(organId, aliasName) {
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
</style>
