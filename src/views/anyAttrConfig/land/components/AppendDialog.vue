<template>
  <div>
    <a-modal :title="object?'编辑编码':'新增编码'" :visible="visible" width="800px"  @cancel="handleClose" @ok="handleSubmit">
      <div class="box">
        <div class="section-title blue">资产概况</div>
        <div style="padding: 10px 20px;">
          <a-row class="playground-row">
            <a-form-model ref="form" :rules="rules" :model="formInfo" :label-col="{ span: 5 }" :wrapper-col="{ span: 14 }">
              <a-row>
                <a-col class="playground-col" :span="24">
                  <a-form-model-item label="所属机构：">{{formInfo.organName}}</a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col class="playground-col" :span="24">
                  <a-form-model-item label="业务名称：" :required="true" prop="attrName">
                    <a-input v-model="formInfo.attrName" :maxLength="30"></a-input>
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
import {appendOperation} from "../dict";
import {insertAssetAttrConfig, updateAssetAttrConfig} from "../../../../api/attrConfig";

export default {
  props: {
    value: {
      default: ""
    },
    object: {
      type:[Object]
    },
    organObject: {
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
          this.init()
        })
      },
    }
  },
  data: ()=>({
    oldAttrName: '',
    formInfo:{
      organName: "",
      name: "",
      ...appendOperation
    },
    rules: {
      attrName: [{required: true, message:"请输入业务名称"}]
    }
  }),
  methods: {
    init () {
      if (!this.visible) return
      if (this.object) {
        this.formInfo = {
          organName: this.organObject.name,
          organId: this.organObject.value,
          ...this.object
        }
        this.oldAttrName = this.object.attrName
      } else {
        this.formInfo = {
          ...appendOperation,
          organName: this.organObject.name,
          organId: this.organObject.value,
          assetType: this.$store.state.ASSET_TYPE_CODE.LAND
        }
      }
    },
    handleSubmit () {
      this.$refs.form.validate(async (validate) => {
        if(validate) {
          if (!this.object){
            this.insertAssetAttrConfig()
          } else {
            console.log(this.oldId, this.formInfo.id)
            if ( this.oldAttrName === this.formInfo.attrName) {
              this.$emit("close")
              return
            }
            this.updateAssetAttrConfig()
          }
        }
      })
    },
    handleClose () {
    console.log('handle close')
    this.$emit("close")
    },
    async updateAssetAttrConfig () {
      const {attrCode, attrName, status, id, organId} = this.formInfo
      const params = {
        id,
        attrName,
        attrCode,
        status,
        organId,
      }
      try{
        const { data: res } = await this.$api.attrConfig.updateAssetAttrConfig(params)
        if (String(res.code) === "0") {
          this.$emit("submit")
          this.$SG_Message.success("新增成功")
        } else {
          this.$SG_Message.error(res.message)
        }
      }finally {

      }
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
    }
  }
}
</script>
<style lang="less" scoped>
.playground-col{
  font-size: 14px;
}
</style>

