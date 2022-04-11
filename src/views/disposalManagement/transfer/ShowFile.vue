<template>
  <SG-UploadFile
    :baseImgURL="configBase.hostImg1"
    v-model="value"
    type="all"
    :show="true"
    :customDownload="
      (value) => {
        return customDownload(value, $api.ownership.downLoadAnnex);
      }
    "
  />
</template>

<script>
import uploadAndDownLoadFIle from "@/mixins/uploadAndDownLoadFIle";
import configBase from "@/config/config.base";
export default {
  name: "ShowFile",
  mixins: [uploadAndDownLoadFIle],
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
};
</script>

<style scoped></style>
