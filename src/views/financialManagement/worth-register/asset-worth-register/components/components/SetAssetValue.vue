<template>
  <div>
    <a-row style="margin: 24px 0 32px">
      <a-col :span="12">
        <span>估值类型：</span>
        <a-select v-model="typeValue" style="width: 250px;" :options="$addTitle(typeOptions)" @change="changeType"/>
      </a-col>
      <a-col :span="12">
        <span>估值金额(元)：</span>
        <a-input-number
          :min="0"
          step="0.01"
          :precision="2"
          :max="99999999999.99"
          v-model="assetValue"
          style="width: 250px"
          placeholder="请输入估计金额"
        />
      </a-col>
    </a-row>
    <a-row v-if="isShowMethod" style="margin-bottom: 24px">
      <a-col :span="24">
        <span style="vertical-align: top">分摊方式：</span>
        <a-radio-group v-model="methodValue" :disabled="shareWayDisabled">
          <div>
            <a-radio value="1" style="vertical-align: top; margin-right: 50px">按照资产个数均摊</a-radio>
            <span style="display: inline-block; width: 400px; color: #bfbfbf">*说明：估值总金额为100万，5个资产，则每个资产估值20万</span>
          </div>
          <div style="margin-top: 16px">
            <a-radio value="2" style="vertical-align: top; margin-right: 50px">按照资产面积均摊</a-radio>
            <span style="display: inline-block; width: 400px; color: #bfbfbf">*说明：估值总金额为100万，资产1面积10㎡，资产02面积30㎡，则资产1估值25万，资产2估值75万</span>
          </div>
        </a-radio-group>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  export default {
    name: 'SetAssetValue',
    props: ['assetType'],
    watch: {
      assetType: {
        immediate: true,
        handler: function () {
          this.$nextTick(()=>{
            this.shareWayByAssetType()
          })
        }
      }
    },
    data () {
      return {
        assetValue: '', // 估值金额
        typeValue: '2', // 估值类型
        isShowMethod: false, //是否显示分摊方式
        shareWayDisabled: false, // 分摊方式禁用标志位
        methodValue: '1', // 分摊方式： 1 按个数， 2 按面积
        typeOptions: [{title: '单个资产估值', value: '2'}, {title: '所选资产总估值', value: '1'}], // 估值类型选项
      }
    },

    methods: {
      // 改变估值类型
      changeType (value) {
        this.isShowMethod = ['1'].includes(String(value))
      },
      // 根据资源类型设置相应的分摊方式
      shareWayByAssetType () {
        switch (String(this.assetType)) {
          case "3": // 设备
            this.shareWayDisabled = true
            this.methodValue = '1'
            break;
          case "5": // 车场
            this.shareWayDisabled = false
            this.methodValue = '2'
            break
        }
      },
      // 传递到外层组件值
      transferData () {
        const {assetValue, typeValue, methodValue} = this
        return {
          typeValue, assetValue, methodValue
        }
      }
    },
    // mounted () {
    //   this.methodValue = this.assetType === '房屋' ? '1' : '2'
    // }
  }
</script>

<style lang='less' scoped>

</style>
