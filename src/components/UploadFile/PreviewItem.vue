<template>
  <div class="item">
    <!-- 内容 -->
    <div class="ItemBox" :class="Ext" @mouseover="previewBtn = !previewBtn" @mouseout="previewBtn = !previewBtn">
      <a-spin v-if="loading"><a-icon slot="indicator" type="loading" style="font-size: 24px" spin /></a-spin>
      <img v-if="!loading && !errorStatus && !noOperation && !isFile" :src="FileURL" @load="handleLoad" @error="handleError" :style="imgAutoStyle" />
      <div class="previewBtn" v-show="previewBtn && isPreview" @click="toPreview" :hidden="!preview">预览</div>
    </div>
    <!-- 标题 -->
    <div class="ItemTitle">
      <a-tooltip>
        <template slot="title">
          {{ item.name }}
        </template>
        <div class="text">{{ item.name }}</div>
      </a-tooltip>
      <div class="download" v-if="isFile && !noOperation" @click="$emit('download')" :hidden="!download"><a-icon type="cloud-download" /></div>
    </div>
    <!-- 索引 -->
    <div class="ItemIndex">{{ reverseIndex }}</div>
    <!-- 删除按钮 -->
    <div class="ItemDelete" v-if="!noOperation" @click="$emit('delete')"><a-icon type="close" /></div>
    <!-- 动作 -->
    <div class="ItemAction" v-if="!noOperation && !errorStatus && showCover" @click="$emit('cover')">设为封面</div>
    <div class="ItemActionText" v-if="item.isCover && showCover">封面</div>
  </div>
</template>

<script>
import * as apiOwnership from "@/api/ownership";
export default {
  props: {
    // 是否显示设为封面按钮
    showCover: Boolean,
    // url
    item: Object,
    // 当前图片的索引
    imageIndex: Number,
    // 反向索引
    reverseIndex: {
      type: Number,
      default: 0,
    },
    // 加载状态
    loading: {
      type: Boolean,
      default: false,
    },
    // 错误状态
    noOperation: {
      type: Boolean,
      default: false,
    },
    hostImg: {
      type: String,
      required: true,
    },
    previewUrl: {
      type: String,
    },
  },
  inject: {
    // 使用一个默认值使其变成可选项
    preview: {
      // 健名
      from: "preview", // 来源
      default: false, // 默认值
    },
    download: {
      // 健名
      from: "download", // 来源
      default: false, // 默认值
    },
  },
  data() {
    return {
      previewBtn: false,
      errorStatus: false,
      imgAutoStyle: {
        width: "auto",
        height: "auto",
      },
      previewTag: false,
      downloadTag: false,
    };
  },
  mounted() {
    console.log(this.preview);
  },
  computed: {
    // 图片地址
    FileURL() {
      let resUrl = this.hostImg + this.item.url;
      return resUrl;
    },
    // 扩展名，即文件类型
    Ext() {
      return this.item.url && this.item.url.split(".").pop().toLocaleLowerCase();
    },
    // 判断文件是否支持预览
    isPreview() {
      const Dict = ["txt", "pdf", "doc", "docx", "xlsx", "xls", "ppt", "pptx", "jpg", "jpeg", "png", "bmp"];
      return Dict.includes(this.Ext);
    },
    // 判断是否是文件类型
    isFile() {
      const Dict = ["txt", "pdf", "doc", "docx", "xlsx", "xls", "ppt", "pptx", "zip", "rar", "gz", "7z", "acd"];
      return Dict.includes(this.Ext);
    },
  },
  methods: {
    toPreview() {
      // 如果是图片
      if (!this.isFile) {
        this.$emit("preview", this.imageIndex);
        // 如果是其他支持预览的文件
      } else if (this.isPreview) {
        let loadingName = this.SG_Loding("打开文件中...");
        apiOwnership.reviewFile({ attachmentPath: this.item.url }).then(
          (res) => {
            this.DE_Loding(loadingName).then(() => {
              const attachmentUrl = this.hostImg + res.data.data.previewAttachmentPath;
              window.open(attachmentUrl);
            });
          },
          () => {
            this.DE_Loding(loadingName).then(() => {
              this.$SG_Message.error("打开文件失败！");
            });
          }
        );
      }
    },
    // 图片加载失败
    handleError() {
      this.errorStatus = true;
    },
    // 图片加载成功
    handleLoad(e) {
      if (e.target.width > e.target.height) {
        this.imgAutoStyle.height = "100%";
      } else {
        this.imgAutoStyle.width = "100%";
      }
    },
  },
};
</script>
<style lang="less" scoped>
.previewBtn {
  cursor: pointer;
  position: absolute;
  top: 15%;
  left: 24%;
  width: 80px;
  height: 80px;
  line-height: 80px;
  border-radius: 50%;
  text-align: center;
  background-color: #cfcece;
  opacity: 0.8;
  color: white;
  font-weight: bold;
  font-size: 20px;
}
</style>
