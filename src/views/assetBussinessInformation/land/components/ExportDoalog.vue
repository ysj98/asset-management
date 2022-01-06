<template>
  <div>
    <a-modal
      title="导出"
      :visible="visible"
      width="800px"
      okText="下载模板"
      @cancel="handleCancel"
      @ok="handleSubmit">
      <div class="box">
        <div style="padding: 10px 20px;">
          <a-row class="playground-row">
            <a-form-model ref="form" :rules="rules" :model="formInfo" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
              <a-row>
                <a-col class="playground-col" :span="24">
                  <a-form-model-item label="经营方式：">
                    <dict-select
                      :dictOptions="operationMode"
                      placeholder='选择经营方式'
                      @change="handleChange"
                      v-model="formInfo.modeOperId"/>
                  </a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col class="playground-col" :span="24">
                  <a-form-model-item label="土地名称：">
                    <dict-select
                        mode="multiple"
                        :maxTagCount="1"
                        :isFilterAll="true"
                        :dict-options="assetList"
                        placeholder='选择土地用途'
                        v-model="formInfo.assetLandIds"/>
                  </a-form-model-item>
                </a-col>
              </a-row>
            </a-form-model>
          </a-row>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import DictSelect from "../../../common/DictSelect";
import {exportDataAsExcel} from "../../../common/commonQueryApi";

export default {
  components: {DictSelect},
  props: {
    value: {
      default: ""
    },
    organId: {
      default: ()=>{}
    },
    visible: {
      default: false
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler: function () {
        this.$nextTick(()=>{
          this.show = this.visible
          this.init()
        })
      },
    }
  },
  data: ()=>({
    show: false,
    oldAttrName: '',
    formInfo:{
      modeOperId: undefined,
      assetLandIds: [''],
    },
    operationMode: [],// 经营方式
    assetList: [{label: '全部土地',value: ''}], // 土地列表
    rules: {
      attrName: [{required: true, message:"请输入业务名称"}]
    }
  }),
  methods: {
    init () {
      this.clearData()
      this.queryModeOperList()
    },
    handleSubmit () {
      this.exportTransferOperation()
    },
    handleCancel () {
      console.log('close')
      this.$emit("close")
    },
    clearData () {
      this.formInfo.assetLandIds= [""]
      this.formInfo.modeOperId = ""
    },
    handleChange () {
      this.$nextTick(()=>{
        this.formInfo.assetLandIds = ['']
        this.queryAssetToExport()
      })
    },
    async insertAssetAttrConfig () {
      const params = {
        ...this.formInfo
      }
      try{
        const { data: res } = await this.$api.attrConfig.insertAssetAttrConfig(params)
        if (String(res.code) === "0") {
          this.$emit("submit")
          this.$SG_Message.success("新增成功")
        } else {
          this.$SG_Message.error(res.message)
        }
      }finally {
      }
    },
    // 取全部经营方式
    queryModeOperList() {
      let data = {
        dictCode: "OCM_MODE_OPER",
        dictFlag: "1",
        groupId: this.organIdMain,
        code: "OCM_MODE_OPER",
        organId: this.organIdMain,
      }
      this.$api.basics.organDict(data).then((res) => {
        if (res.data.code === "0") {
          let data = res.data.data
          this.operationMode = data.map((item) => ({
            value: item["value"],
            label: item["name"],
          }))
          if(this.operationMode){
            this.formInfo.modeOperId = (this.operationMode || [])[0].value
            this.queryAssetToExport()
          }
        }
      })
    },
    async queryAssetToExport () {
      const params = {
        modeOperId: this.formInfo.modeOperId,
        organId: this.organId
      }
      try{
        const { data: res } = await this.$api.assetBussinessInformation.queryAssetToExport(params)
        if (String(res.code) === "0") {
          this.assetList = [{label: '全部土地',value: ''}]
          this.assetList = (res.data.data || []).map(item=>({
            label: item.assetName,
            value: item.assetLandId
          }))
          this.assetList.unshift({label: '全部土地',value: ''})
        } else {
          this.$SG_Message.error(res.message)
        }
      }finally {
      }
    },
    // 下载
    async exportTransferOperation () {
      const params = {
        modeOperId: this.formInfo.modeOperId,
        assetLandIds: this.formInfo.assetLandIds.filter(item=>item !== ""),
        organId: this.organId
      }
      try{
        const {data: res} = await this.$api.assetBussinessInformation.exportTransferOperation(params)
        let blob = new Blob([res])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = `资产土地经营导出.xls`
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
        this.$emit("submit")
      } catch (e) {
        this.$SG_Message.error("下载失败")
      }finally {
      }
    }
  }
}
</script>
<style lang="less" scoped>
.playground-col{
  font-size: 14px;
}
</style>

