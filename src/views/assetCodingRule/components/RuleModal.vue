<template>
  <a-modal
    :width="800"
    title="编码规则设置"
    :visible="visible"
    @ok="handleSubmit"
    @cancel="handleClose"
  >
    <div class="box">
      <div class="left-box">
        <p class="title">参数列表</p>
        <div class="left-inner-box">
          <template v-for="(item,index) of menuList">
            <p
              :key="index"
              v-text="item.name"
              @click="handleLeftClick(index,item)"
              :class="{'list-item-active':activeIndex === index}"
              class="list-item"></p>
          </template>
        </div>
      </div>
      <div class="right-box">
        <p class="title">参数类型</p>
        <div class="right-inner-box">
          <template v-if="Array.isArray(rightList)">
            <template v-for="(item,index) of rightList">
              <p
                :key="index"
                v-text="item.value"
                @click="handleRightClick(index,item)"
                :class="{'list-item-active':activeRightIndex === index}"
                class="list-item"></p>
            </template>
          </template>
          <template v-else-if="sequenceFlag">
            <div style="padding:10px">
              <a-form-model ref="ruleForm" :model="formInfo" :rules="rules" :label-col="labelCol" :wrapper-col="wrapperCol">
                <a-form-model-item has-feedback label="序列长度" prop="codeLength" :required="true">
                  <a-input v-model="formInfo.codeLength" type="number" placeholder="请输入序列长度"/>
                </a-form-model-item>
                <a-form-model-item has-feedback label="开始数值" prop="codeSeq" :required="true">
                  <a-input v-model="formInfo.codeSeq" type="number" placeholder="请输入开始数值"/>
                </a-form-model-item>
              </a-form-model>
            </div>
          </template>
        </div>
      </div>
    </div>
  </a-modal>
</template>
<script>
// import {menuList} from "./componentDict";
export default {
  props: {
    organId: {
      default: ''
    },
    visible: {
      default: false
    }
  },
  data: () => ({
    menuList: [],
    labelCol: { span: 4 },
    wrapperCol: { span: 16 },
    rightList: [],
    activeIndex: -1,
    sequenceFlag: false, // 序列标志位
    activeRightIndex: -1,
    formInfo: {
      codeLength: 4,
      codeSeq: 1000
    },
    rules:{
      codeLength: [{ required: true, message: '请输入序列长度', trigger: 'change' }],
      codeSeq: [{ required: true, message: '请输入开始数值', trigger: 'change' }],
    }
  }),
  watch: {
    visible: function (nVal) {
      if (nVal) {
        this.paramInit()
      }
    }
  },
  methods: {
    handleSubmit () {
      if(this.sequenceFlag) {
        this.handleSeqSubmit();
      } else {
        this.handleOtherSubmit();
      }
    },
    // 处理 序列 提交
    handleSeqSubmit () {
      this.$refs.ruleForm.validate(valid => {
        if (valid) {
          if(this.formInfo.codeLength <= 0) {
            this.$message.error('序列长度应大于0')
            return
          }
          const codeSeq = this.formInfo.codeSeq.toString().split('')
          if (codeSeq.length > this.formInfo.codeLength) {
            this.$message.error('开始数值应小于等于序列长度')
            return false
          }
          let length= this.formInfo.codeLength - codeSeq.length
          if(length>0) {
            while (--length >= 0) {
              codeSeq.unshift('0')
            }
          }
          console.log(codeSeq)
          // const code = [this.menuList[this.activeIndex].name,codeSeq.join('')].join(':')
          this.submit({
            name: this.menuList[this.activeIndex].name,
            seq: codeSeq.join(''),
            value: codeSeq.join('')
          })
        } else {
          return false;
        }
      });
    },
    handleOtherSubmit () {
      this.submit({
        name: this.menuList[this.activeIndex].name,
        value: this.rightList[this.activeRightIndex].value
      })
    },
    submit (data) {
      console.log(data)
      this.$emit('submit', data)
    },
    handleClose () {
      this.$emit('close')
    },
    handleLeftClick (index, item) {
      this.activeIndex = index
      this.rightList = item.param
      this.sequenceFlag = false
      if (item.name === '序列') {
        this.sequenceFlag = true
      }
    },
    handleRightClick (index, item) {
      this.activeRightIndex = index
    },
    /*******************************************/
    async paramInit () {
      this.activeIndex = -1
      this.activeRightIndex = -1
      this.menuList = []
      this.rightList = []
      try {
        const params = { organId: this.organId }
        const {data: res} = await this.$api.codeRule.paramInit(params)
        if(res.code === '0') {
          this.menuList = res.data || []
        } else {
          this.$message.error(res.message)
        }
      } catch {
        this.$message.error('系统异常')
      }
    }
  }
}
</script>
<style lang="less" scoped>
.box {
  .title {
    font-size: 16px;
    margin: 0;
    line-height: 25px;
  }
  display: flex;
  justify-content: space-around;
  height: 500px;
  .left-box {
    width: 30%;
    .left-inner-box {
      height: 95%;
      overflow-y: auto;
      border-radius: 5px;
      border: 1px solid #bdbdbd;
    }
  }
  .right-box {
    width: 70%;
    margin-left: 10px;
    .right-inner-box {
      height: 95%;
      border-radius: 5px;
      border: 1px solid #bdbdbd;
    }
  }
  .list-item {
    width: 100%;
    height: 35px;
    padding: 0;
    margin: 0;
    font-size: 16px;
    line-height: 35px;
    padding-left: 15px;
    background: #fff;
    user-select: none;
    cursor: pointer;
    border-bottom: 1px solid rgba(73, 68, 68, 0.19);
  }
  .list-item-active {
    background: rgba(126, 126, 126, 0.22);
  }
}
</style>