<template>
  <div class="sg-uploadFile" :class="{ show: show }">
    <!-- 上传部分 -->
    <div class="fileBox" v-if="!show">
      <div class="btn">
        <SG-Button
          @click="$refs.file.click()"
          :disabled="lists.length >= max && max !== 0"
          ref="btn"
          icon="upload"
        >上传</SG-Button>
        <input
          @input="handleUpload"
          ref="file"
          type="file"
          :accept="uploadFileType"
          :multiple="max >= 0"
        >
      </div>
      <div class="tips"><slot name="tips">注：上传的文件最多为 {{ max === 0 ? '不限' : `${max} 张` }}。文件大小最多为 {{ maxSize === 0 ? '不限' : `${maxSize} kb` }}</slot></div>
      <div class="total" v-show="lists.length > 5">共<span>{{ lists.length }}</span>个</div>
    </div>
    <!-- 预览部分 -->
    <div class="preview" v-if="lists.length > 0">
      <div class="previewWrap" :style="wrapStyle">
        <template v-for="index in previewLen">
          <PreviewItem
            v-if="fileLists[index - 1]"
            :key="index - 1"
            :showCover="showCover"
            :item="fileLists[index -1]"
            :imageIndex="imagesListIndex[index - 1]"
            :reverseIndex="fileLists.length - index + 1"
            @delete="handleDelete(index - 1)"
            @preview="handlePreview"
            @cover="handleCover(index - 1)"
            @download="handleDownload(index - 1)"
          />
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
    <SG-Modal
      v-model="showUploadStatus"
      title="上传中"
      :footer="null"
      :width="908"
      :maskClosable="false"
      wrapClassName="sg-uploadFile-showUpload"
    >
      <div class="itemBox">
        <PreviewItem
          v-for="(item, index) in uploadLists" :key="index"
          :item="item"
          :loading="!item.completeStatus"
          noOperation
        />
      </div>
    </SG-Modal>
    <!-- 弹窗展示上传失败文件 -->
    <SG-Modal
      v-model="showErrorStatus"
      title="上传失败"
      :footer="null"
      :width="908"
      :maskClosable="false"
      wrapClassName="sg-uploadFile-showUpload error"
    >
      <div class="itemBox">
        <div class="errorTips">{{ errorTips }}</div>
        <PreviewItem
          v-for="(item, index) in errorLists" :key="index"
          :item="item"
          :loading="false"
          noOperation
        />
      </div>
    </SG-Modal>
  </div>
</template>

<script>
// 获取图片域名
const config = window.__configs
let hostImg  = config ? config.hostImg : ''
import PreviewItem from './PreviewItem'
import { uploadMultipartImage, uploadMultipartFile } from './api.js'
export default {
  name: 'SG-UploadFile',
  model: {
    prop: 'files',
    event: 'input'
  },
  components: {
    PreviewItem
  },
  props: {
    // 是否显示设为封面按钮
    showCover: {
      type: Boolean,
      default: false
    },
    // 文件上传类型，可以是图片和文件
    type: {
      type: String,
      default: 'image'
    },
    // 自定义上传文件类型
    accept: String,
    // 最大上传数量
    max: {
      type: [Number, String],
      default: 5
    },
    // 默认文件列表
    files: {
      type: Array,
      default: () => []
    },
    // 是否为展示模式，展示模式没有上传控件
    show: {
      type: Boolean,
      default: false
    },
    // 是否显示无数据时占位图
    showNotdata: {
      type: Boolean,
      default: false
    },
    // 自定义上传过程
    customUpload: {
      type: [Function, Boolean],
      default: false
    },
    // 自定义下载过程
    customDownload: {
      type: [Function, Boolean],
      default: false
    },
    // 最大上传尺寸
    maxSize: {
      type: Number,
      default: 2000
    },
    // 图片基础地质，用于拼接展示图片
    baseImgURL: String,
    errorTips: {
      type: String,
      default: '以下文件上传失败，请重新检查后再上传。'
    }
  },
  provide () {
    return {
      hostImg: this.hostImg
    }
  },
  data () {
    return {
      // 文件类型
      fileExt: ['doc', 'docx', 'ppt', 'pptx', 'txt', 'pdf', 'xls', 'xlsx', 'acd', 'zip', 'rar', 'gz', '7z'],
      // 图片类型
      imageExt: ['jpg', 'gif', 'png', 'jpeg'],
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
      previewStep: 5
    }
  },
  computed: {
    // 图片基础地址
    hostImg () {
      if (this.baseImgURL === 'off') {
        return ''
      }
      return this.baseImgURL || hostImg
    },
    // 上传文件可选择类型
    uploadFileType () {
      const Dict = {
        'image': 'image/png, image/jpg, image/jpeg',
        'file': this.fileExt.join(',.'),
        'all': 'image/*,.' + this.fileExt.join(',.')
      }
      return this.accept ? this.accept : Dict[this.type]
    },
    // 预览列表宽度
    wrapStyle () {
      return {
        width: this.previewLen * 172 + 'px',
        transform: `translateX(-${ this.previewActive * this.previewStep * 172 }px)`
      }
    },
    // 预览列表长度
    previewLen () {
      const listLen = this.lists.length
      const step = listLen % this.previewStep === 0 ? 0 : 5 - listLen % this.previewStep
      return listLen + step
    },
    // 预览列表页数
    previewAllPage () {
      return this.previewLen / this.previewStep
    },
    // 文件列表
    fileLists () {
      return this.lists
    },
    // 图片列表
    imagesList () {
      let imageExt = this.imageExt
      return this.fileLists.filter(el => {
        const ext = el.url.split('.').pop().toLocaleLowerCase()
        return imageExt.includes(ext)
      })
    },
    // 图片列表索引
    imagesListIndex () {
      let len = 0
      return this.lists.map(el => {
        const ext = el.url.split('.').pop().toLocaleLowerCase()
        if (this.imageExt.includes(ext)) {
          len += 1
          return len - 1
        } else {
          return null
        }
      })
    }
  },
  watch: {
    files: {
      handler (val) {
        this.lists = [...val]
      },
      immediate: true
    }
  },
  methods: {
    // 上传
    async handleUpload () {
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

      // 如果有自定义上传过程，则执行自定义的上传过程
      if (this.customUpload) {
        const customUpload = this.customUpload(files)
        // 判断是否返回 Promise 对象
        if (!customUpload || !customUpload.then) {
          this.$SG_Message.error('自定义上传需返回 Promise 对象')
          return
        }
        // 取得自定义上传数据，完成上传操作
        customUpload.then(res => {
          this.uploadLists = res.lists.map(el => {
            el.completeStatus = true
            return el
          })
          if (res.errorLists) this.errorLists.push(...res.errorLists)
          this.completeUpload()
        }).catch(error => {
          console.log(error)
          this.$SG_Message.error('上传失败')
        })
        return
      }

      // 分类图片和文件表单
      const ImgFormData = new FormData()
      const FileFOrmData = new FormData()
      let ImgList = []
      let FileList = []
      const errorLists = []
      files.forEach(item => {
        const ext = item.name.split('.').pop().toLocaleLowerCase()
        if (this.imageExt.includes(ext)) {
          ImgFormData.append('file', item)
          ImgList.push({ ...item, url: item.name, name: item.name,})
        } else {
          FileFOrmData.append('file', item)
          FileList.push({ ...item, url: item.name, name: item.name, })
        }
      })
      
      // 上传图片
      if (ImgFormData.has('file')) {
        try {
          let res = await uploadMultipartImage(ImgFormData)
          const data = res.data
          if (data.code === '0') {
            this.updateLists(data.data, 'image')
          } else {
            this.$SG_Message.error(data.message)
          }
        } catch (error) {
          console.log(error)
          errorLists.push(...ImgList)
          this.$SG_Message.error('上传图片失败')
        }
      }

      // 上传文件
      if (FileFOrmData.has('file')) {
        try {
          let res = await uploadMultipartFile(FileFOrmData)
          const data = res.data
          if (data.code === '0') {
            this.updateLists(data.data, 'file')
          } else {
            this.$SG_Message.error(data.message)
          }
        } catch (error) {
          console.log(error)
          errorLists.push(...FileList)
          this.$SG_Message.error('上传文件失败')
        }
      }

      // 处理失败数据
      this.errorLists.push(...errorLists)

      // 完成上传
      this.completeUpload()
    },
    /**
     * 图片或者文件上传成功后，更新上传列表数据
     * @param {Array} list 成功上传的文件数组
     * @param {String} type 更新的文件类型，可为 image 和 file 
    **/
    updateLists (list, type) {
      if (list) {
        // 定义字典
        let Dict
        if (type === 'image') {
          Dict = this.imageExt
        } else {
          Dict = this.fileExt
        }
        // 先排除需要更新的数据，因为上传的文件和返回无法对应，所以直接批量替换。
        this.uploadLists = this.uploadLists.filter(el => {
          const ext = el.name.split('.').pop().toLocaleLowerCase()
          if (!Dict.includes(ext)) {
            return true
          }
        })
        // 将上传成功的数据，插入 Lists
        this.uploadLists.unshift(...list.map(el => {
          return {
            ...el,
            url: el,
            name: el.split('/').pop(),
            completeStatus: true
          }
        }))
      }
    },
    // 初始化上传列表
    initUploadLists (files) {
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
          completeStatus: true
        }
      })
      // 初始化上传列表
      this.uploadLists = filterLists.map(el => {
        return {
          ...el,
          url: el.name,
          name: el.name,
          completeStatus: false
        }
      })
      return filterLists
    },
    // 上传完成
    completeUpload () {
      // 完成上传的数据
      const newList = this.uploadLists.filter(el => el.completeStatus).map(el => {
        return {
          ...el,
          url: el.url,
          name: el.name
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
    handleGoPage (index) {
      if (index <= 0) {
        index = 0
      } else if (index >= this.previewLen / this.previewStep) {
        index = this.previewLen / this.previewStep - 1
      }
      this.previewActive = index
    },
    // 上一页
    handlePrev () {
      this.handleGoPage(this.previewActive - 1)
    },
    // 下一页
    handleNext () {
      this.handleGoPage(this.previewActive + 1)
    },
    // 删除
    handleDelete (index) {
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
    handleCover (index) {
      this.$emit('cover', index)
    },
    // 预览
    handlePreview (index) {
      this.$previewImages.destroy()
      this.$previewImages.init({
        list: this.imagesList.map(el => {
          return this.hostImg + el.url
        }),
        index
      }).view(index)
    },
    // 下载文件
    handleDownload (index) {
      const File = this.lists[index]
      if (this.customDownload) {
        this.customDownload(File)
        return
      }
      const Dom = document.createElement('a')
      Dom.href = `/uhomecp-app/common/downloadFile.do?fileName=${File.name}&filePath=${File.url}`
      Dom.download =  File.name
      Dom.target = '_blank'
      Dom.click()
    }
  },
}
</script>

<style lang="less" src="./style.less"></style>