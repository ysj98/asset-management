<template>
  <div class="item">
    <!-- 内容 -->
    <div class="ItemBox" :class="Ext" @mouseover="previewBtn = !previewBtn" @mouseout="previewBtn = !previewBtn">
      <a-spin v-if="loading"><a-icon slot="indicator" type="loading" style="font-size: 24px" spin /></a-spin>
      <img v-if="!loading && !errorStatus && !noOperation && !isFile" :src="FileURL" @load="handleLoad" @error="handleError" :style="imgAutoStyle" />
      <!-- 预览按钮 如果是图片，只通过hover的方式去控制预览按钮；如果是文件，判断有无在线预览的地址，同时通过hover去控制 -->
      <div class="previewBtn" v-show="(previewBtn && !isFile) || (previewBtn && previewUrl)" @click="toPreview">预览</div>
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
  data() {
    return {
      previewBtn: false,
      errorStatus: false,
      imgAutoStyle: {
        width: 'auto',
        height: 'auto',
      },
    }
  },

  mounted() {},
  computed: {
    // 图片地址
    FileURL() {
      let resUrl = this.hostImg + this.item.url
      return resUrl
    },
    // 扩展名，即文件类型
    Ext() {
      return this.item.url && this.item.url.split('.').pop().toLocaleLowerCase()
    },
    // 判断是否是文件类型
    isFile() {
      const Dict = ['txt', 'pdf', 'doc', 'docx', 'xlsx', 'xls', 'ppt', 'pptx', 'zip', 'rar', 'gz', '7z', 'acd']
      return Dict.includes(this.Ext)
    },
  },
  methods: {
    toPreview() {
      if (!this.isFile) {
        this.$emit('preview', this.imageIndex)
      } else {
        alert('文件预览，正在开发')
      }
    },
    // 图片加载失败
    handleError() {
      this.errorStatus = true
    },
    // 图片加载成功
    handleLoad(e) {
      if (e.target.width > e.target.height) {
        this.imgAutoStyle.height = '100%'
      } else {
        this.imgAutoStyle.width = '100%'
      }
    },
  },
}
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
