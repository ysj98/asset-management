<!--props参数释义：
1.width: String | Number, Modal宽度，默认950px
2.title: String, Modal title, 默认‘选择对应人员’
3.visible: Boolean，必传项，控制组件显示/隐藏，默认false隐藏组
4.height: String || Number, 设置Modal高度，默认450px
5.allAttrs: Boolean，是否获取全部属性，默认false获取userId字符串构成的数组
6.initValue: Array，初始值,默认格式['UID001', 'UID001']，如果 allAttrs 为true, 传入格式为[{assetId: 'UID001'}]
-->

<!--需要传入的函数：
handleCancel 关闭弹窗
handleOk 保存数据,传出选中的数据数组
-->
<template>
  <div>
    <a-modal
      :width="width"
      :title="title"
      okText="确定选择"
      cancelText="取消"
      :visible="visible"
      @cancel="handleAction('')"
      @ok="handleAction('ok')"
    >
      <select-asset-list v-model="selectedList" :height="height" :organId="organId" :queryType="queryType"/>
    </a-modal>
  </div>
</template>
<script>
  import SelectAssetList from './SelectAssetList'
  export default {
    name: 'SelectAssetListModal',
    components: {SelectAssetList},
    props: {
      // organId 必须
      organId: {
        type: [Number, String],
        default: () => ''
      },
      // 查询类型 必须
      queryType: {
        type: [Number, String],
        default: () => 1 // 1 资产变动，2 资产清理 3 权属登记
      },
      // Modal title
      title: {
        type: String,
        default: () => '选择资产'
      },
      // Modal宽度
      width: {
        type: [Number, String],
        default: () => 950
      },
      // 设置Modal高度
      height: {
        type: [Number, String],
        default: () => 450
      },
      // 初始选中的值
      initValue: {
        type: Array,
        default: () => []
        // !注意：默认格式['UID001', 'UID001']，如果 allAttrs 为true, 传入格式为[{assetId: 'UID001'}]
      },
      // 是否获取全部属性，默认false获取Id字符串构成的数组
      allAttrs: {
        type: Boolean,
        default: () => false
      },
      // 控制组件显示/隐藏
      visible: {
        type: Boolean,
        default: () => false
      }
    },
    data () {
      return {
        selectedList: this.initValue
      }
    },

    methods: {
      // 处理Modal关闭/保存
      handleAction (type) {
        if (type) {
          if (!this.selectedList.length) { return this.$message.warn('请选择资产数据') }
          this.$emit('handleOk', this.selectedList)
        } else {
          // 取消时selectedList恢复初始值
          this.selectedList = this.initValue
          this.$emit('handleCancel')
        }
      }
    }
  }
</script>

<style lang='less' scoped>

</style>
