<!--报表管理-房屋资产统计分析入口页面--查询列表Part--编辑列表表头组件-->
<template>
  <div class="table_header">
    <a-checkbox-group v-model="checkedList" @change="checkedFn">
      <a-list itemLayout="horizontal" :dataSource="options" bordered>
        <a-list-item slot="renderItem" slot-scope="item, index" style="line-height: 24px">
          <a-checkbox :value="item.dataIndex" style="width: 340px">{{ item.title }}</a-checkbox>
          <a-button v-if="index" size="small" @click="handleRank('up', index)" style="margin-right: 8px">
            <a-icon type="arrow-up" style="margin: 0 8px; color: red" />
          </a-button>
          <a-button v-if="index !== options.length - 1" size="small" @click="handleRank('down', index)" style="margin-right: 8px">
            <a-icon type="arrow-down" style="margin: 0 8px" />
          </a-button>
          <a-button v-if="index" size="small" @click="handleRank('top', index)">置顶</a-button>
        </a-list-item>
      </a-list>
    </a-checkbox-group>
    <a-radio-group v-if="show" v-model="penetrateValue">
      <a-radio v-for="(item, index) in penetrate" :key="index" :style="radioStyle" :value="item.value">{{ item.name }}</a-radio>
    </a-radio-group>
  </div>
</template>

<script>
export default {
  name: 'EditTableHeader',
  props: ['columns', 'checkedArr', 'penetrateData'],
  data() {
    return {
      radioStyle: {
        display: 'block',
        height: '30px',
        lineHeight: '30px',
      },
      penetrateValue: '2',
      show: true,
      penetrate: [
        {
          value: '1',
          name: '按组织机构层级展示',
        },
        {
          value: '2',
          name: '平铺所有资产权属单位',
        },
      ],
      checkedList: [], // 选中项
      options: [], // 数据选项
    };
  },

  methods: {
    checkedFn(val) {
      this.show = this.checkedList.includes('organName');
      if (!this.show) {
        val === 'int' ? (this.penetrateValue = this.penetrateData) : (this.penetrateValue = '2');
      } else {
        val === 'int' ? (this.penetrateValue = this.penetrateData) : '';
      }
    },
    // 排序
    handleRank(type, index) {
      let { options } = this;
      let moveItem = options.splice(index, 1)[0];
      if (type === 'up') {
        this.options.splice(index - 1, 0, moveItem);
      } else if (type === 'down') {
        this.options.splice(index + 1, 0, moveItem);
      } else {
        this.options.unshift(moveItem);
      }
    },
  },

  created() {
    // 初始化值
    const { checkedArr, columns } = this;
    Object.assign(this, {
      checkedList: checkedArr,
      options: [...columns],
    });
  },
  mounted() {
    this.checkedFn('int');
  },
};
</script>

<style lang="less" scoped></style>
