<template>
  <a-modal :visible="visible" title="列表设置" width="800px" @cancel="handleClose" @ok="handleSubmit">
    <a-checkbox-group v-model="selectedList">
      <div class="loading" v-if="loading">
        <span>加载中...</span>
      </div>
      <div v-else class="check-box">
        <template v-for="(item, index) of options">
          <a-checkbox :value="item.value" :key="index" style="margin-left: 10px" :disabled="item.disabled">
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
    organId:{
      default: ""
    },
    visible: {
      default : false
    },
  },
  data: ()=>({
    options: [],
    loading: false,
    selectedList: [],
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
    init () {
      this.assetRolList()
    },
    handleClose () {
      this.$emit("close")
    },
    handleSubmit () {
      const params = this.beforeAddCustomShow(this.selectedList)
      this.addCustomShow(params)
    },
    /*********************************************************************************************************/
    beforeAddCustomShow (params) {
      const chooseList = this.options.filter(item=>params.some(n=>n===item.value)).map(item=>({colName:item.colName,colCode:item.colCode}))
      return {chooseList}
    },
    async addCustomShow(params){
      try {
        const {data: res} = await this.$api.assetBussinessInformation.addCustomShow(params)
        if (String(res.code) === '0') {
          this.$emit("submit")
          this.$SG_Message.success("编辑成功")
        } else {
          this.$SG_Message.error(res.message)
        }
      } finally {
      }
    },
    async assetRolList () {
      this.loading = true
      try {
        const params = {
          assetType: this.$store.state.ASSET_TYPE_CODE.LAND,
          organId: this.organId
        }
        const {data: res} = await this.$api.assetBussinessInformation.assetRolList(params)
        if (String(res.code) === '0') {
          this.options = this.generatorOptions(res.data)
        } else {
          this.$SG_Message.error(res.message)
        }
      } finally {
        this.loading = false
      }
    },
    /**
     *
     * @param customChose 默认列表
     * @param customShow 用户配置数据列表
     * @param templeCode 全量数据列表
     */
    generatorOptions ({customChose=[],customShow = [],templeCode = []}) {
      this.selectedList = []
      const selectItemList = new Set()
      const itemList = templeCode.map(item => {
        return {
          ...item,
          label: item.colName,
          value: item.colCode,
          disabled: false
        }
      });
      const returnList = itemList.map(item =>{ // 处理默认表格
        const choseNum = customChose.some(n=>n.colCode == item.colCode)
        const userShow = customShow.some(n=>n.colCode == item.colCode)
        if (userShow) {
          item.disabled = true
          // this.selectedList.push(item.value)
        } else if (choseNum) {
          selectItemList.add(item.value)
        }
        return item
      }).sort(item=>item.disabled?-1:1);
      this.selectedList = Array.from(selectItemList)
      return returnList
    },

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
.loading {
  width: 750px;
  display: flex;
  font-size: 18px;
  justify-content: center;
}
</style>







