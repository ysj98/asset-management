<!-- 以全局导入，组件无需再次引入
<UploadFile
  v-model="files"
  type="all"
  :max='5'
  :maxSize="20480"
/>
-->
<template>
  <div class="uploadFile" :class="{ show: show }">
    <!-- 上传部分 -->
    <div class="fileBox" v-if="!show">
      <div class="btn">
        <SG-Button @click="$refs.file.click()" :disabled="lists.length >= max && max !== 0" ref="btn" icon="upload">上传</SG-Button>
        <input @input="handleUpload" ref="file" type="file" :accept="uploadFileType" :multiple="max >= 0" />
      </div>
      <!-- 提示语自定义 -->
      <div class="tips">
        <slot name="tips">
          注：上传的文件最多为 {{ max === 0 ? '不限' : `${max} 张` }}，文件大小最多为 {{ maxSize === 0 ? '不限' : `${maxSize / 1024} M。` }}
          <!-- 支持文件格式包括{{ uploadFileType }} -->
        </slot>
      </div>
      <div class="total" v-show="lists.length > 5">
        共
        <span>{{ lists.length }}</span>
        个
      </div>
    </div>
    <!-- 预览部分 -->
    <div class="preview" v-if="lists.length > 0">
      <div class="previewWrap" :style="wrapStyle">
        <template v-for="index in previewLen">
          <PreviewItem v-if="fileLists[index - 1]" :previewUrl="fileLists[index - 1].previewUrl" :hostImg="hostImg" :key="index - 1" :showCover="showCover" :item="fileLists[index - 1]" :imageIndex="imagesListIndex[index - 1]" :reverseIndex="fileLists.length - index + 1" @delete="handleDelete(index - 1)" @preview="handlePreview" @cover="handleCover(index - 1)" @download="handleDownload(index - 1)" />
          <div v-if="!fileLists[index - 1] && fileLists.length > 5" class="item nodata" :key="index - 1"></div>
        </template>
      </div>
      <div class="previewPages" v-if="previewLen / previewStep > 1">
        <div class="previewPrev" :class="{ disabled: this.previewActive === 0 }" @click="handlePrev"><SG-IconExt type="icon-arrow-left"></SG-IconExt></div>
        <ul>
          <li v-for="index in previewLen / previewStep" :key="index" :class="{ active: index === previewActive + 1 }" @click="previewActive = index - 1"></li>
        </ul>
        <div class="previewNext" :class="{ disabled: this.previewActive === previewLen / previewStep - 1 }" @click="handleNext"><SG-IconExt type="icon-arrow-right"></SG-IconExt></div>
      </div>
    </div>
    <div class="notData" v-if="lists.length === 0 && showNotdata">暂无</div>
    <!-- 弹窗展示上传状态 -->
    <SG-Modal v-model="showUploadStatus" title="上传中" :footer="null" :width="908" :maskClosable="false" wrapClassName="uploadFile-showUpload">
      <div class="itemBox">
        <PreviewItem v-for="(item, index) in uploadLists" :hostImg="hostImg" :key="index" :item="item" :loading="!item.completeStatus" noOperation />
      </div>
    </SG-Modal>
    <!-- 弹窗展示上传失败文件 -->
    <SG-Modal v-model="showErrorStatus" title="上传失败" :footer="null" :width="908" :maskClosable="false" wrapClassName="uploadFile-showUpload error">
      <div class="itemBox">
        <div class="errorTips">{{ errorTips }}</div>
        <PreviewItem v-for="(item, index) in errorLists" :key="index" :item="item" :loading="false" noOperation />
      </div>
    </SG-Modal>
  </div>
</template>

<script>
// 获取图片域名
import configs from '@/config/config.base'
import PreviewItem from './PreviewItem'
import * as apiOwnership from '@/api/ownership'
export default {
  name: 'UploadFile',
  model: {
    prop: 'files',
    event: 'input',
  },
  components: {
    PreviewItem,
  },
  props: {
    // 是否显示设为封面按钮
    showCover: {
      type: Boolean,
      default: false,
    },
    // 文件上传类型，可以是图片和文件 image/file/all
    type: {
      type: String,
      default: 'all',
    },
    // 自定义上传文件类型 doc, docx, xls, xlsx, ppt, pptx, zip, rar, jpg, jpeg, bmp, png, txt, pdf。
    accept: String,
    // 最大上传数量
    max: {
      type: [Number, String],
      default: 10,
    },
    // 默认文件列表
    files: {
      type: Array,
      default: () => [],
    },
    // 是否为展示模式，展示模式没有上传控件
    show: {
      type: Boolean,
      default: false,
    },
    // 是否显示无数据时占位图
    showNotdata: {
      type: Boolean,
      default: false,
    },
    // 最大上传尺寸 kb
    maxSize: {
      type: Number,
      default: 51200,
    },
    errorTips: {
      type: String,
      default: '以下文件上传失败，请重新检查后再上传。',
    },
  },
  data() {
    return {
      // 文件类型
      fileExt: ['doc', 'docx', 'ppt', 'pptx', 'txt', 'pdf', 'xls', 'xlsx', 'acd', 'zip', 'rar', 'gz', '7z'],
      // 图片类型
      imageExt: ['jpg', 'gif', 'png', 'jpeg', 'bmp'],
      // 图片列表
      lists: [],
      // 弹窗展示上传状态
      showUploadStatus: false,
      // 上传列表
      uploadLists: [],
      // 上传失败列表状态
      showErrorStatus: false,
      // 上传失败列表
      errorLists: [],
      // 滑动预览页面
      previewActive: 0,
      // 滑动预览页面 步长
      previewStep: 5,
    }
  },
  computed: {
    // 图片基础地址
    hostImg() {
      return configs.hostImg1
    },
    // 上传文件可选择类型
    uploadFileType() {
      const Dict = {
        image: 'image/png, image/jpg, image/jpeg',
        file: this.fileExt.join(',.'),
        all: 'image/*,.' + this.fileExt.join(',.'),
      }
      return this.accept ? this.accept : Dict[this.type]
    },
    // 预览列表宽度
    wrapStyle() {
      return {
        width: this.previewLen * 172 + 'px',
        transform: `translateX(-${this.previewActive * this.previewStep * 172}px)`,
      }
    },
    // 预览列表长度
    previewLen() {
      const listLen = this.lists.length
      const step = listLen % this.previewStep === 0 ? 0 : 5 - (listLen % this.previewStep)
      return listLen + step
    },
    // 预览列表页数
    previewAllPage() {
      return this.previewLen / this.previewStep
    },
    // 文件列表
    fileLists() {
      return this.lists
    },
    // 图片列表
    imagesList() {
      let imageExt = this.imageExt
      return this.fileLists.filter(el => {
        const ext = el.url && el.url.split('.').pop().toLocaleLowerCase()
        return imageExt.includes(ext)
      })
    },
    // 图片列表索引
    imagesListIndex() {
      let len = 0
      return this.lists.map(el => {
        const ext = el.url && el.url.split('.').pop().toLocaleLowerCase()
        if (this.imageExt.includes(ext)) {
          len += 1
          return len - 1
        } else {
          return null
        }
      })
    },
  },
  watch: {
    files: {
      handler(val) {
        this.lists = [...val]
      },
      immediate: true,
    },
  },
  methods: {
    // 自定义下载
    customDownload(file) {
      let loadingName = this.SG_Loding('下载中...')
      apiOwnership.downLoadAnnex({ attachmentPath: file.url, fileName: file.name }).then(
        res => {
          this.DE_Loding(loadingName).then(() => {
            let blob = new Blob([res.data])
            let a = document.createElement('a')
            a.href = URL.createObjectURL(blob)
            a.download = file.name
            a.style.display = 'none'
            document.body.appendChild(a)
            a.click()
            a.remove()
          })
        },
        () => {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error('下载失败！')
          })
        }
      )
    },
    // 自定义上传
    customUpload(list = []) {
      let files = Array.from(list)
      let lists = []
      let errorLists = []
      let requestList = files.map(file => {
        let fileData = new FormData()
        fileData.append('file', file)
        errorLists.push({ url: file.name, name: file.name })
        return apiOwnership.uploadAnnex(fileData)
      })
      let requestAll = Promise.all(requestList)
      return requestAll
        .then(res => {
          res.map(item => {
            if (item.data.code === '0' && item.data.data) {
              let data = item.data.data
              lists.push({
                url: data.attachmentPath,
                name: data.originName,
                size: files[0].size,
              })
            } else {
              this.$SG_Message.error(item.data.message)
            }
          })
          lists = lists.map((ele, index) => {
            const res = { ...ele }
            const resKey = files[index]._key
            if (resKey) {
              res._key = resKey
            }
            return res
          })
          return { lists }
        })
        .catch(() => {
          return { lists: [], errorLists }
        })
    },
    // 上传
    async handleUpload() {
      // 将文件列表转换为数组
      let files = Array.from(this.$refs.file.files)
      this.$refs.file.value = ''
      // 判断是否是否选择超出数量的文件
      const maxLen = this.max - this.lists.length
      if (files.length > maxLen && this.max !== 0) {
        this.$SG_Message.error(`最多还可选择个${maxLen}文件`)
        return
      }
      // 如果没有选择文件，则终止执行
      if (files.length === 0) return

      // 初始化上传列表数据，并取得初始化过滤之后的文件列表
      files = this.initUploadLists(files)
      // 显示上传中弹窗
      if (this.uploadLists.length > 0) this.showUploadStatus = true

      const customUpload = this.customUpload(files)
      // 判断是否返回 Promise 对象
      if (!customUpload || !customUpload.then) {
        this.$SG_Message.error('自定义上传需返回 Promise 对象')
        return
      }

      // 取得自定义上传数据，完成上传操作
      customUpload
        .then(res => {
          this.uploadLists = res.lists.map(item => {
            return {
              ...item,
              completeStatus: true,
            }
          })
          this.completeUpload()
          if (res.errorLists) this.errorLists.push(...res.errorLists)
        })
        .catch(error => {
          console.log(error)
          this.$SG_Message.error('上传失败')
        })
    },

    // 初始化上传列表
    initUploadLists(files) {
      // 将超过限制大小的文件推入错误列表，否则推入过滤列表
      const errorLists = []
      const filterLists = []
      files.forEach(el => {
        if (el.size / 1024 > this.maxSize && this.maxSize !== 0) {
          errorLists.push(el)
        } else {
          filterLists.push(el)
        }
      })
      // 记录文件大小不符合的文件
      this.errorLists = errorLists.map(el => {
        return {
          ...el,
          url: el.name,
          name: el.name,
          completeStatus: true,
        }
      })
      // 初始化上传列表
      this.uploadLists = filterLists.map(el => {
        return {
          ...el,
          url: el.name,
          name: el.name,
          completeStatus: false,
        }
      })
      return filterLists
    },
    // 上传完成
    completeUpload() {
      // 完成上传的数据
      const newList = this.uploadLists
        .filter(el => el.completeStatus)
        .map(el => {
          return {
            ...el,
            url: el.url,
            name: el.name,
          }
        })
      // 推入list列表
      this.lists.push(...newList)
      // 触发 input 事件，供 v-model 更新数据，返回所有的文件数据
      this.$emit('input', this.lists)
      // 触发 update 事件，只返回当前更新的数据
      this.$emit('update', newList)
      // 关闭上传中弹窗，延迟关闭，避免上传完成一闪而过
      setTimeout(() => {
        this.showUploadStatus = false
        // 如果有上传失败的文件，则提示用户
        if (this.errorLists.length > 0) {
          this.showErrorStatus = true
        }
      }, 400)
    },
    // 跳转页面
    handleGoPage(index) {
      if (index <= 0) {
        index = 0
      } else if (index >= this.previewLen / this.previewStep) {
        index = this.previewLen / this.previewStep - 1
      }
      this.previewActive = index
    },
    // 上一页
    handlePrev() {
      this.handleGoPage(this.previewActive - 1)
    },
    // 下一页
    handleNext() {
      this.handleGoPage(this.previewActive + 1)
    },
    // 删除
    handleDelete(index) {
      const { name, url } = this.lists[index]
      this.lists.splice(index, 1)
      this.$emit('input', this.lists)
      this.$emit('delete', { index, name, url })
      // 如果删除后有页数变化，则跳转上一页
      this.$nextTick().then(() => {
        if (this.previewAllPage === this.previewActive) {
          this.handlePrev()
        }
      })
    },
    // 设为封面
    handleCover(index) {
      this.$emit('cover', index)
    },
    // 预览
    handlePreview(index) {
      this.$previewImages.destroy()
      this.$previewImages
        .init({
          list: this.imagesList.map(el => {
            let resUrl = this.hostImg + el.url
            if (el.fileSources === 0) {
              resUrl =  this.hostImg + el.url
            }
            return resUrl
          }),
          index,
        })
        .view(index)
      const saveDom = document.querySelector('.segi-toolbar-right').querySelector('.save')
      if (saveDom) saveDom.remove()
    },
    // 下载文件
    handleDownload(index) {
      const File = this.lists[index]
      this.customDownload(File)
    },
  },
}
</script>

<style lang="less" src="./style.less"></style>
