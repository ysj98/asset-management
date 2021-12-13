<template>
  <div>
    <a-modal title="新增编码" :visible="visible" width="800px"  @cancel="handleClose" @ok="handleSubmit">
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
                  <a-form-model-item label="业务名称：" :required="true" prop="name">
                    <a-input v-model="formInfo.attrName" @blur.native="handleBlur"></a-input>
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

export default {
  props: {
    value: {
      default: ""
    },
    attrId: {
      default: ""
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
      handler: function (nv) {
        this.$nextTick(()=>{
          if (!nv) return
          if (this.attrId) {
          } else {
            this.formInfo.organName = this.organObject.name
            this.formInfo.organId = this.organObject.value
          }
        })
      },
    }
  },
  data: ()=>({
    formInfo:{
      organName: "",
      name: "",
      ...appendOperation
    },
    rules: {
      name:[{required: true, message:"请输入业务名称"}]
    }
  }),
  methods: {
    handleSubmit () {
      this.$refs.form.validate(async (validate) => {
        if(validate) {
          this.$emit("submit")
        }
      })
    },
    handleClose () {
    console.log('handle close')
    this.$emit("close")
    },
    handleBlur () {
    }
  }
}
</script>
<style lang="less" scoped>
.playground-col{
  font-size: 14px;
}
</style>

