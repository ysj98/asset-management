<template>
  <div class="center-text">
    <a-tooltip>
      <template #title v-if="centralName">
        {{ centralName }}
      </template>
      <template v-else #title></template>
      <div class="content">
        <a-input
          v-model="centralName"
          :max-Length="100"
          placeholder="请输入"
          @focus="initDefault"
          @blur="handleBlur"
        />
        <!--  按钮形式保存 交互      -->
        <!--        <a-button-->
        <!--          shape="circle"-->
        <!--          class="content-icon"-->
        <!--          v-if="!saveIngFlag"-->
        <!--          @click="handleSave"-->
        <!--          icon="save"-->
        <!--        />-->
        <!--        <a-button v-else shape="circle" class="content-icon" icon="loading" />-->
      </div>
    </a-tooltip>
  </div>
</template>

<script>
export default {
  name: "CenterText",
  props: {
    layerId: {
      type: [String, Number],
    },
    organId: {
      type: [String, Number],
    },
    defaultCentralName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      centralName: "",
      saveIngFlag: false,
      oldText: "",
    };
  },
  mounted() {
    this.centralName = this.defaultCentralName;
  },
  methods: {
    initDefault() {
      this.oldText = this.centralName;
      console.log("this.oldText", this.oldText);
    },
    handleBlur() {
      console.log(this.centralName, this.oldText);
      if (this.centralName !== this.oldText) {
        this.handleSave();
      }
    },
    handleSave() {
      const req = {
        organId: this.organId,
        layerId: this.layerId,
        centralName: this.centralName,
      };
      this.saveIngFlag = true;
      console.log(req);
      this.$api.drawMap.updateLayerScheme(req).then(({data:{code,message,data}})=>{
        if (code==='0'){
          console.log('data',data)
          this.$emit("saveSuccess", this.centralName);
          this.$message.success("中心点保存成功");
          this.saveIngFlag = false;
        }else {
          this.$message.error(message)
        }
      },reason => {
        console.error(reason)
        this.saveIngFlag = false;
      })
    },
    cancel() {
      this.centralName = this.defaultCentralName;
    },
  },
};
</script>

<style scoped>
.center-text .content {
  display: flex;
  align-items: center;
}
.center-text .content .content-icon {
  margin-left: 10px;
}
</style>
