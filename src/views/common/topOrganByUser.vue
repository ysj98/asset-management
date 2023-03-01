<!--
 * @Date: 2019-11-06 10:30:14
 * @Author: chen han
 * @Description: 一级物业选择框
 -->
<template>
  <div>
    <SG-Select
      v-if="type === 'segiSelect'"
      :defaultValue="selectValue === '' ? undefined : selectValue"
      :style="formStyle"
      showSearch
      v-model="selectValue"
      @change="handleChange"
      notFoundContent="没有查询到数据"
      :placeholder="hasAll ? '全部公司' : '所选公司'"
    >
      <SG-Option v-for="item in options" :key="item.value" :label="item.name" :value="item.value" :title="item.name"> </SG-Option>
    </SG-Select>
    <a-select
      v-else
      :defaultValue="selectValue === '' ? undefined : selectValue"
      :style="formStyle"
      showSearch
      v-model="selectValue"
      :allowClear="showClear"
      :filterOption="filterOption"
      @change="handleChange"
      notFoundContent="没有查询到数据"
      :placeholder="hasAll ? '全部公司' : '所选公司'"
    >
      <a-select-option :title="item.name" v-for="item in options" :key="item.value" :value="item.value">
        {{ item.name }}
      </a-select-option>
    </a-select>
  </div>
</template>
<script>
export default {
  name: 'topOrganByUser',
  props: {
    // 高保真样式
    type: {
      type: String,
      default: 'antSelect',
      validator: function (value) {
        return ['antSelect', 'segiSelect'].includes(value);
      },
    },
    // 搜索框样式
    formStyle: {
      default: () => ({}),
    },
    // 绑定的organId
    value: {
      type: [Number, String],
      default: '',
    },
    // 是否显示清楚按钮
    showClear: {
      type: Boolean,
      default: false,
    },
    // 是否默认选择第一个
    selectFirst: {
      type: Boolean,
      default: false,
    },
    // 是否有全部
    hasAll: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      options: [],
      selectValue: undefined,
    };
  },
  created() {},
  mounted() {
    this.query();
  },
  watch: {
    value(nv) {
      if (nv) {
        this.selectValue = nv;
      }
    },
  },
  methods: {
    handleChange(item) {
      let o = this.options.filter((val) => {
        return item === val.value;
      })[0];
      this.$emit('input', item);
      this.$emit('change', o);
    },
    query() {
      let data = {};
      this.$api.basics.queryAllTopOrganByUser(data).then((res) => {
        if (res.data.code === '0') {
          let arr = [];
          // 如果可以选择全部项目
          if (this.hasAll) {
            arr.push({ name: '全部公司', value: '' });
          }
          res.data.data.forEach((item) => {
            let o = { name: item.organName, value: item.organId };
            arr.push(o);
          });
          this.options = arr;
          // 如果有默认选项
          if (this.value) {
            this.selectValue = this.value;
            this.handleChange(this.value);
            return;
          }
          // 是否选择第一项
          if (this.selectFirst) {
            // 设置本地值
            this.selectValue = this.options[0].value;
            // 冒上数据
            this.$emit('input', this.options[0].value);
            this.$emit('change', this.options[0]);
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  },
};
</script>
