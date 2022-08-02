<template>
  <SGUploadFilePlus
    :max="5"
    :maxSize="10240"
    :files="value"
    @input="inputFn"
    :baseImgURL="configBase.hostImg1"
    errorTips="以下文件上传失败,请重新检查后再上传(附件大小超出10M或当前网络不稳定)"
    :customDownload="
      (value) => {
        return customDownload(value, $api.ownership.downLoadAnnex);
      }
    "
    :customUpload="
      (value) => {
        return customUpload(value, $api.ownership.uploadAnnex);
      }
    "
    accept="image/png, image/jpg, image/jpeg,application/pdf,application/msword,application/vnd.ms-powerpoint,application/vnd.ms-excel"
  >
    <!-- <span slot="tips">(注：上传的附件最多为 5 个,且文件大小小于10M)</span> -->
  </SGUploadFilePlus>
</template>

<script>
import SGUploadFilePlus from "@/components/SGUploadFilePlus";
import configBase from "@/config/config.base";
import uploadAndDownLoadFIle from "@/mixins/uploadAndDownLoadFIle";
export default {
  /*
   * 减少代码量，其他没什么用
   * */
  name: "UploadFile",
  mixins: [uploadAndDownLoadFIle],
  components: { SGUploadFilePlus },
  props: {
    value: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      configBase,
    };
  },
  methods: {
    inputFn(value) {
      console.log("value", value);
      this.$emit("input", value);
    },
  },
};
</script>

<style scoped></style>
