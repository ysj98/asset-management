<template>
  <div class="status-config">
    <div class="header">
      <a-select
        showSearch
        style="width: 265px"
        :options="$addTitle(organOptions)"
        @change="query"
        :filterOption="filterOption"
        placeholder="请选择组织机构"
        v-model="organId"
      ></a-select>
      <SG-Button type="primary" @click="save">保存</SG-Button>
    </div>
    <a-table :columns="columns" :dataSource="dataSource" :pagination="false">
      <div slot="isAble" slot-scope="text, record">
        <a-switch :checked="record.isAble === 'Y'" @click="handleChange(record)"></a-switch>{{ text === 'Y' ? '已开启' : '已禁用' }}
      </div>
      <div slot="alias" slot-scope="text, record"><a-input v-model.trim="record.alias" /></div>
      <div slot="color" slot-scope="text, record, index">
        {{ record.color }}
        <span
          class="color-btn"
          @click.stop="
            show = true;
            active = index;
          "
          :style="{ backgroundColor: record.color }"
        ></span>
      </div>
    </a-table>
    <div class="color" v-if="show"><chrome-picker @input="updateValue" v-model="color"></chrome-picker></div>
  </div>
</template>
<script>
import { Chrome, Swatches } from 'vue-color';
const columns = [
  {
    title: '是否启用',
    dataIndex: 'isAble',
    scopedSlots: { customRender: 'isAble' },
    key: 'isAble',
  },
  {
    title: '编码',
    dataIndex: 'code',
    key: 'code',
  },
  {
    title: '状态名称',
    dataIndex: 'statusName',
    key: 'statusName',
  },

  {
    title: '状态别名',
    dataIndex: 'alias',
    scopedSlots: { customRender: 'alias' },
    key: 'alias',
  },
  {
    title: '展示颜色',
    dataIndex: 'color',
    scopedSlots: { customRender: 'color' },
    key: 'statusName',
  },
];

export default {
  components: {
    'chrome-picker': Swatches, //Chrome
  },
  mounted() {
    console.log(document.body);
    document.body.addEventListener('click', this.closeColor);
  },
  data() {
    return {
      active: '',
      show: false,
      color: {},
      columns,
      dataSource: [],
      organId: '',
      organOptions: [],
    };
  },
  created() {
    this.queryOrganList();
  },
  methods: {
    save() {
      let apiName = this.dataSource[0].id ? 'updateSetting' : 'insertSetting';
      this.$api.houseStatusConfig[apiName](this.dataSource).then((res) => {
        if (res.data.code == 0) {
          this.$message.success(res.message || '保存成功');
        } else {
          this.$message.error(res.message || '系统内部错误');
        }
      });
    },
    closeColor() {
      this.show = false;
    },
    updateValue(val) {
      this.show = false;
      this.dataSource[this.active].color = val.hex;
      this.color = {};
      console.log(val);
    },
    handleChange(val) {
      val.isAble = val.isAble === 'Y' ? 'N' : 'Y';
      console.log(val);
    },
    // 查询一级组织机构
    queryOrganList(init) {
      this.$api.assets
        .queryAsynOrganByUserId({ parentOrganId: '', typeFilter: '' })
        .then((res) => {
          if (Number(res.data.code) === 0) {
            let list = res.data.data || [];
            let id = list[0] ? list[0].organId : undefined;
            this.organId = id;
            this.query();
            this.organOptions = list.map((item) => {
              return {
                key: item.organId,
                title: item.name,
              };
            });
            return false;
          }
          throw res.message || '查询组织机构失败';
        })
        .catch((err) => {
          this.$message.error(err || '查询组织机构失败');
        });
    },
    // 查询数据
    query() {
      this.$api.houseStatusConfig
        .querySettingByOrganId({ organId: this.organId })
        .then((res) => {
          if (res.data.code == 0) {
            this.dataSource = res.data.data;
          } else {
            this.$message.error(res.message || '系统内部错误');
          }
        })
        .catch((err) => {
          console.log(err);
        });
    },
    // 搜索过滤选项
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
  },
};
</script>
<style lang="less">
.status-config {
  padding: 30px;
  .header {
    margin-bottom: 30px;
    display: flex;
    justify-content: space-between;
  }
  .color-btn {
    display: inline-block;
    height: 20px;
    width: 20px;
    margin-left: 20px;
    border: 2px solid #f5f5f5;
  }
  .color {
    position: relative;
    top: -55%;
    left: 76%;
  }
}
</style>
