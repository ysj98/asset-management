<!--
 * @Date: 2019-11-07 17:14:17
 * @Author: chen han
 * @Description: 房间导出
 -->
<template>
  <SG-Modal
    @cancel="hiddeModal"
    title="导出房间信息"
    v-model="visible"
    :width="450"
    :maskClosable="false"
    :noPadding="true"
    :keyboard="false"
    :footer="null"
    :bodyStyle="{ 'overflow-y': 'auto', padding: '0 0px' }"
  >
    <div class="export-box">
      <div class="export-item">
        <!-- 公司 -->
        <treeSelect
          :defaultDisplay="false"
          :defaultOrganName="defaultOrganName"
          :value="organId"
          @changeTree="changeTree"
          placeholder="请选择公司"
          :allowClear="false"
          :style="inputStyple"
        >
        </treeSelect>
      </div>
      <div class="export-item">
        <!-- 楼栋、 -->
        <a-select
          showSearch
          placeholder="请选择楼栋"
          v-model="buildId"
          @search="handleSearch"
          optionFilterProp="children"
          :style="inputStyple"
          :options="$addTitle(buildOpt)"
          :allowClear="true"
          :filterOption="false"
          notFoundContent="没有查询到数据"
        />
      </div>
      <div class="clearfix">
        <a-button class="fr" @click="exportHouse" type="primary">导出</a-button>
      </div>
    </div>
  </SG-Modal>
</template>
<script>
import TreeSelect from '@/views/common/treeSelect';
import { debounce } from '@/utils/utils';
// let getUuid = ((uuid = 1) => () => ++uuid)()
let fintItem = (data, value) => {
  if (!value) {
    return { label: '', value: '' };
  }
  return data.find((item) => item.value === value);
};
export default {
  components: { TreeSelect },
  props: {
    organIdCopy: {
      default: '',
    },
    defaultOrganName: {
      type: String,
      default: '',
    },
    isCurrent: {
      type: [Number, String],
      required: true,
    },
  },
  data() {
    return {
      // uuid: getUuid(),
      visible: false,
      inputStyple: { width: '100%' },
      organName: '',
      organId: undefined,
      buildId: undefined,
      organOpt: [],
      buildOpt: [],
    };
  },
  watch: {
    organIdCopy: {
      handler(nv) {
        this.organId = nv;
      },
      immediate: true,
    },
    defaultOrganName(newValue) {
      if (newValue) {
        this.organName = newValue;
      }
    },
    visible(newVal) {
      if (!newVal) {
        this.hiddeModal();
      }
    },
    organId: {
      handler(newVal) {
        this.buildId = undefined;
        this.buildOpt = [];
        if (newVal) {
        this.queryBuildList(newVal);
      }
      },
      immediate: true,
    },
  },
  created() {},
  mounted() {},
  methods: {
    changeTree(value, organName) {
      this.organId = value;
      this.organName = organName;
    },
    // 隐藏弹窗
    hiddeModal() {
      this.buildId = undefined;
    },
    // 请求楼栋列表默认20条
    queryBuildList(organId, buildName) {
      this.$api.basics.queryBuildList({ organId, buildName: buildName || '' }).then((res) => {
        if (res.data.code === '0') {
          let result = res.data.data || [];
          this.buildOpt = result.map((item) => {
            return { label: item.buildName, value: item.buildId };
          });
        }
      });
    },
    // 楼栋搜索
    handleSearch(value) {
      this.searchBuildName = value;
      this.debounceMothed();
    },
    // 防抖函数后台请求楼栋数据
    debounceMothed: debounce(function () {
      this.queryBuildList(this.organId, this.searchBuildName || '');
    }, 200),
    exportHouse() {
      let data = {
        organId: this.organId || '',
        buildId: this.buildId || '',
        isCurrent: this.isCurrent,
      };
      let organName = this.organName;
      let buildName = fintItem(this.buildOpt, data.buildId).label;
      let fileName = `${organName + buildName}房间.xls`;
      let loadingName = this.SG_Loding('导出中...');
      this.$api.building.exportHouse(data).then(
        (res) => {
          this.DE_Loding(loadingName).then(() => {
            this.visible = false;
            let blob = new Blob([res.data]);
            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = fileName;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
          });
        },
        () => {
          this.DE_Loding(loadingName).then((res) => {
            this.$SG_Message.error('导出失败！');
          });
        }
      );
    },
    closeModal() {
      this.$emit('close');
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  },
};
</script>
<style lang="less" scoped>
.export-box {
  text-align: center;
  padding: 20px;
  .export-item {
    margin-bottom: 20px;
  }
}
</style>
