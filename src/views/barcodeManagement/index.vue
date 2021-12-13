<template>
  <div class="barcodeManagement">
    <search-container size="fold" v-model="fold">
      <div slot="headerBtns">
        <SG-Button>条码打印</SG-Button>
        <SG-Button style="margin-left:15px;">导出</SG-Button>
        <SG-Button style="margin-left:15px;">批量更新标签</SG-Button>
      </div>
      <div slot="contentForm" class="search-content-box" style="position: absolute;">
        <div class="search-from-box" style="float: right; text-align: left;">
          <treeSelect @changeTree="changeTree"  placeholder='请选择组织机构' :allowClear="false" :style="allStyle"></treeSelect>
          <a-select
            :style="allStyle"
            placeholder="全部资产项目"
            v-model="queryCondition.projectId"
            :showSearch="true"
            :filterOption="filterOption"
          >
            <a-select-option
              :title="item.name"
              v-for="(item, index) in projectData"
              :key="index"
              :value="item.value"
            >{{item.name}}</a-select-option>
          </a-select>
          <a-select
            :maxTagCount="1"
            :style="allStyle"
            mode="multiple"
            placeholder="全部资产类型"
            :tokenSeparators="[',']"
            @select="changeAssetType"
            v-model="queryCondition.assetType"
          >
            <a-select-option
              v-for="(item, index) in assetTypeData"
              :key="index"
              :value="item.value"
              :title="item.name"
            >{{item.name}}</a-select-option>
          </a-select>
          <a-input placeholder="请输入资产名称/编码" maxlength="30" :style="allStyle"/>
          <a-select placeholder="全部资产分类" :style="allStyle"></a-select>
          <a-input placeholder="请输入登记单名称/编码" maxlength="30" :style="allStyle"/>
        </div>
        <div class="two-row-box">
          <SG-Button type="primary" style="margin-right: 10px;">查询</SG-Button>
          <SG-Button style="margin-right: 10px;">清空</SG-Button>
        </div>
      </div>
    </search-container>
  </div>
</template>

<script>
import SearchContainer from 'src/views/common/SearchContainer'
import TreeSelect from '../common/treeSelect.vue'
const allWidth = {width: '170px', 'margin-right': '10px', float: 'left', 'margin-top': '14px'}
export default {
  components: {SearchContainer, TreeSelect},
  data () {
    return {
      fold: true,
      allStyle: allWidth,
      queryCondition: {
        organId: '', // 组织机构id
        projectId: "", // 资产项目Id
      },
      projectData: [{ name: "全部资产项目", value: "" }],
      assetTypeData: [],
    }
  },
  mounted() {
    // 获取资产类型
    this.platformDictFn("asset_type")
  },
  methods: {
    // 组织机构树
    changeTree (value, label) {
      console.log('!!!', value, label)
      // this.organName = label
      this.queryCondition.organId = value
      // this.queryCondition.pageNum = 1
      // this.queryCondition.obligeeId = ''
      // this.selectFn()
      // this.queryHandler()
      this.getObjectKeyValueByOrganIdFn()
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.queryCondition.organId,
        projectName: ""
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let arr = [];
          data.forEach(item => {
            arr.push({
              name: item.projectName,
              value: item.projectId
            });
          });
          this.projectData = [{ name: "全部资产项目", value: "" }, ...arr];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 平台字典获取变更类型
    platformDictFn(str) {
      let obj = {
        code: str
      };
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          if (str === "asset_type") {
            this.assetTypeData = [{ name: "全部资产类型", value: "" }, ...data];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产类型发生变化
    changeAssetType(value) {
      this.$nextTick(function() {
        this.queryCondition.assetType = this.handleMultipleSelectValue(
          value,
          this.queryCondition.assetType,
          this.assetTypeData
        );
      });
    },
  }
}
</script>

<style lang="less">
.barcodeManagement{
  .search-content-box{
    display: flex;
    justify-content: space-between;
    .search-from-box{
      flex: 1;
    }
    .two-row-box{
      padding-top: 14px;
      flex: 0 0 200px;
    }
  }
}
</style>