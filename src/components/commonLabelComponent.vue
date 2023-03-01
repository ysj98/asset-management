<!--
 * @Author: L
 * @Date: 2022-07-14 11:41:05
 * @LastEditTime: 2022-07-15 15:01:57
 * @Description: 公共标签弹框
 type: checkbox 多选  radio 单选
-->
<template>
  <SG-Modal width="800px" :visible="show" okText="确定" :title="title" @ok="commonFn" @cancel="cancelFn">
    <div v-if="type === 'checkbox'">
      <a-checkbox-group v-model="value">
        <a-row>
          <a-col class="p10" :span="8" v-for="item in listData" :key="item.value">
            <a-checkbox :disabled="notAllowedCode.includes(item.value)" :value="item.value">
              {{ item.name }}
            </a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </div>
    <div v-if="type === 'radio'">
      <a-radio-group style="width: 100%" v-model="value" @change="onChange">
        <a-row>
          <a-col class="p10" :span="8" v-for="item in listData" :key="item.value">
            <a-radio :value="item.value">
              {{ item.name }}
            </a-radio>
          </a-col>
        </a-row>
      </a-radio-group>
    </div>
  </SG-Modal>
</template>

<script>
export default {
  components: {},
  props: {
    title: {
      type: String,
      default: '标签设置',
    },
    type: {
      type: String,
      default: 'radio',
    },
    // 列表数据
    listData: {
      type: Array,
      default: () => [],
    },
    // 是否可以选
    notAllowedCode: {
      type: Array,
      default: () => [],
    },
  },
  data() {
    return {
      show: false,
      value: '',
    };
  },
  computed: {},
  created() {},
  mounted() {},
  methods: {
    onChange() {
      this.$emit('input', this.value);
    },
    commonFn() {
      if (this.type === 'radio') {
        let name = '';
        this.listData.forEach((item) => {
          if (this.value === item.value) {
            name = item.name;
          }
        });
        this.$emit('commonFn', this.value, name);
      }
    },
    cancelFn() {
      this.show = false;
      this.$emit('cancelFn');
    },
  },
};
</script>
<style lang="less" scoped></style>
