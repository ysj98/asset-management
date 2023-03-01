<template>
  <a-select
    :mode="modeStr"
    showSearch
    placeholder="请选择资产项目"
    optionFilterProp="children"
    :style="allStyle"
    v-model="assetProject"
    :options="$addTitle(assetProjectOptions)"
    :filterOption="filterOption"
    :maxTagCount="maxTagCount"
    @select="projectFn"
  ></a-select>
</template>

<script>
export default {
  props: {
    organId: {
      type: String,
    },
    modeStr: {
      type: String,
    },
  },
  data() {
    return {
      maxTagCount: 1,
      assetProjectOptions: [],
      assetProject: [''],
      allStyle: 'width: 215px; margin-right: 10px;',
    };
  },
  watch: {
    organId: {
      handler(newVal, oldVal) {
        this.getAssetProjectOptions(newVal);
      },
    },
    assetProject: {
      handler() {
        this.$emit('projectChange', this.assetProject);
      },
    },
  },
  created() {
    this.maxTagCount = this.modeStr === 'multiple' ? 1 : '';
  },
  methods: {
    projectFn(value) {
      if (value === '') {
        return (this.assetProject = ['']);
      }
      if (this.assetProject.includes('') && this.assetProject.length !== this.assetProjectOptions.length) {
        let idx = this.assetProject.indexOf('');
        this.assetProject = this.assetProject.splice(idx + 1, 1);
        return;
      }
      if (!this.assetProject.includes('') && this.assetProject.length === this.assetProjectOptions.length - 1) {
        return (this.assetProject = ['']);
      }
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    getAssetProjectOptions(id) {
      let form = {
        organId: id,
      };
      this.$api.assets.getObjectKeyValueByOrganId(form).then((res) => {
        if (res.data.code === '0') {
          let arr = [{ label: '全部资产项目', value: '' }];
          res.data.data.forEach((item) => {
            let obj = {
              label: item.projectName,
              value: item.projectId,
            };
            arr.push(obj);
          });
          this.assetProjectOptions = arr;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
};
</script>

<style></style>
