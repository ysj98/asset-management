<!--
 * @Author: LW
 * @Date: 2020-09-02 16:55:35
 * @LastEditTime: 2020-09-02 18:13:57
 * @Description: 列表设置
   const columnsData = [
    {
      title: '所属机构',
      dataIndex: 'organName',
      disabled: true,
      width: 200
    },
  ]
-->
<template>
  <SG-Modal
    width="500px"
    v-model="modalShow"
    okText="确定"
    title="列表设置"
    @ok="commonFn"
    @cancel="()=>{ modalShow = false }"
  >
    <div>
      <a-checkbox-group v-model="listValue">
        <a-row>
          <a-col class="p10" :span="8" v-for="(item, index) in columnsData" :key="index">
            <a-checkbox :value="item.dataIndex" :disabled="item.disabled ? item.disabled : false">{{item.title}}</a-checkbox>
          </a-col>
        </a-row>
      </a-checkbox-group>
    </div>
  </SG-Modal>
</template>

<script>
export default {
  components: {},
  props: {
    columnsData: {
      style: Array, default: () =>{ return []}
    }
  },
  data () {
    return {
      modalShow: false,
      listValue: [],
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
  },
  methods: {
    commonFn () {
      this.$emit('determineSet', this.listValue)
    }
  }
}
</script>
<style lang="less" scoped>
</style>