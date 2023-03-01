<template>
  <div class="item SGUploadFilePlus">
    <!-- 内容 -->
    <div class="ItemBox" :class="Ext">
      <a-spin v-if="loading"><a-icon slot="indicator" type="loading" style="font-size: 24px" spin /></a-spin>
      <img
        v-if="!loading && !errorStatus && !noOperation && !isFile"
        :src="FileURL"
        @load="handleLoad"
        @error="handleError"
        @click="$emit('preview', imageIndex)"
        :style="imgAutoStyle"
      />
    </div>
    <!-- 标题 -->
    <div class="ItemTitle">
      <a-tooltip>
        <template slot="title">
          {{ item.name }}
        </template>
        <div class="text">{{ item.name }}</div>
      </a-tooltip>
      <div class="download" v-if="isFile && !noOperation" @click="$emit('download')"><a-icon type="cloud-download" /></div>
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
// 获取图片域名
let hostImg = window.__configs ? window.__configs.hostImg : 'https://betapic.uhomecp.com/';
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
  },
  data() {
    return {
      errorStatus: false,
      imgAutoStyle: {
        width: 'auto',
        height: 'auto',
      },
    };
  },
  computed: {
    // 图片地址
    FileURL() {
      let resUrl = hostImg + this.item.url;
      return resUrl;
    },
    // 扩展名，即文件类型
    Ext() {
      return this.item.url && this.item.url.split('.').pop().toLocaleLowerCase();
    },
    // 判断是否是文件类型
    isFile() {
      const Dict = ['txt', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx', 'zip', 'rar', 'gz', '7z', 'acd'];
      return Dict.includes(this.Ext);
    },
  },
  methods: {
    // 图片加载失败
    handleError() {
      this.errorStatus = true;
    },
    // 图片加载成功
    handleLoad(e) {
      if (e.target.width > e.target.height) {
        this.imgAutoStyle.height = '100%';
      } else {
        this.imgAutoStyle.width = '100%';
      }
    },
  },
};
</script>
