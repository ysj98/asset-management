<template>
  <a-modal :visible="visible" title="列表设置" width="800px">
    <a-checkbox-group>
      <div class="check-box">
        <template v-for="(item, index) of options">
          <a-checkbox :value="item.value" :key="index" style="margin-left: 10px">
            <a-tooltip>
              <template slot="title">
                {{item.label}}
              </template>
              <div class="check-content">
                {{item.label}}
              </div>
            </a-tooltip>
          </a-checkbox>
        </template>
      </div>
    </a-checkbox-group>
  </a-modal>
</template>
<script>
export default  {
  props: {
    visible: {
      default : false
    },
  },
  data: ()=>({
    options: [
      { label: 'Apple', value: 'Apple' },
      { label: 'Pear', value: 'Pear' },
      { label: 'Orange', value: 'Orange' },{ label: 'Apple', value: 'Apple' },
      { label: 'Pear', value: 'Pear' },
      { label: 'Orange', value: 'Orange' },{ label: 'Apple', value: 'Apple' },
      { label: 'Pear', value: 'Pear' },
      { label: 'Orange', value: 'Orange' },{ label: 'Apple', value: 'Apple' },
      { label: 'Pear', value: 'Pear' },
      { label: 'Orange', value: 'Orange' },{ label: 'Apple', value: 'Apple' },
      { label: 'Pear', value: 'Pear' },
      { label: 'Orange', value: 'Orange' },{ label: 'Apple', value: 'Apple' },
      { label: 'Pear', value: 'Pear' },
      { label: 'Orange', value: 'Orange' },{ label: 'Apple', value: 'Apple' },
      { label: 'Pear', value: 'Pear' }, { label: 'Orange', value: 'Orange' },
      { label: 'Apple', value: 'Apple' },{ label: 'Pear', value: 'Pear' },
      { label: 'Orange', value: 'Orange' },
    ]
  }),
  watch: {
    visible: {
      handler: function (v) {
        if(v) {
          this.init()
        }
      }
    }
  },
  methods:{
    init () {}
  }
}
</script>
<style lang="less" scoped>
.check-box {
  width: 750px;
  height: auto;
}
.check-content {
  width: 60px;
  overflow: hidden;
  white-space: nowrap;
  display: inline-block;
  text-overflow:ellipsis;
  vertical-align: bottom;
  margin-top: 10px;
}
</style>







