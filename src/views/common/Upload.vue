<!-- Created by Lucifer -->
<!--
  props 属性说明:
    value: v-model 绑定数组
    label: 标签名，默认值为 ‘附件’
    maxCount: 最大上传文件数，默认值为无限大
    uploadUrl: 上传文件 api
    imgStr: 预览图片前缀
    fileStr: 下载文件前缀
    deleteUrl: 删除文件 api
    refType: 接口附带参数
    multiple: 多文件上传，默认为 false
    uploadType: 上传类型，select 点击上传按钮的方式，drop 拖拽的方式上传
    imgType: 数组对象，允许上传的图片类型
    imgSize: 缩略图大小
    fileType: 数组对象，允许上传的文件类型
    accept: 允许上传文件类型，input 自带属性
    maxSize: 单个文件大小，单位为 kb
    inputWidth: 文件列表宽度
    disabled: disabled 状态

    /*2019/4/19 by shuai*/
    新增,编辑，详情 图片都是一行并排展示
    详情图片点击按钮可左右切换
    支持键盘左右方向键切换
    resourceImgUrl: 查询出来的 封面图url
    delFileIds: 编辑时 删除的文件id (多个逗号相连)

    调用方式：
      <upload
        uploadType="drop"
        accept="image/png, image/jpg, image/jpeg, image/gif"
        :multiple="true"
        :fileType="[]"
        inputWidth="690px"
        label="图片"
        :maxCount="5"
        :disabled="false"
        v-model="files"
      />
      详情：
      <upload
        uploadType="drop"
        accept="image/png, image/jpg, image/jpeg, image/gif"
        :multiple="true"
        :fileType="[]"
        inputWidth="690px"
        label="图片"
        :maxCount="5"
        :disabled="true"
        v-model="files"
      />
-->

<template>
  <div class="segi-appendix">
    <!-- 包含普通上传 -->
    <div class="title" :style="labelStyle"><span class="required" v-if="required">*</span>{{ label }}</div><div class="main" :style="mainStyle">
      <div class="upload-select btn btn-default" v-if="!disabled && uploadType === 'select'" @click="myClick">上传</div>
      <input
        ref="input"
        class="ipt-file"
        type="file"
        :accept="accept"
        :multiple="this.multiple"
        @change="change($event.target.files, $event)">
      <div class="upload-list">
        <!--新增和编辑时, 查询的图片和本地图片分开循环，是因为删除要fileId,而且index也会有问题-->
        <div class="img-list" v-if="uploadType !== 'carousel'">
          <div
            class="upload-drop"
            :class="borderClass"
            :accept="accept"
            v-if="!disabled && uploadType === 'drop' && count < maxCount"
            @click="myClick"
            @drop.prevent="onDrop"
            @dragover.prevent="dragOver = true"
            @dragleave.prevent="dragOver = false"
            :style="imgCtStyle"
          >
            <a-icon type="plus"/>
            <p>（{{count}}/{{maxCount}}）</p>
          </div>
          <!--查询的图片-->
          <div v-for="(item, index) in allImgList" :key="item.id" :style="imgCtStyle" class="img-ct">
            <img class="simple-img" :style="imgStyle" :src="imgStr + item.value" @click="openBigImg(item.value, index)">
            <!--详情不显示删除-->
            <span class="delete-img" @click="deleteImgOrFile(item, index, 'img')" v-if="!disabled">
              <a-icon type="delete" />
            </span>
          </div>
        </div>
        <!-- 为跑马登时显示 -->
        <div class="upload-carousel" v-if="uploadType === 'carousel' &&allImgList.length>0">
          <div :style="imgCtStyle" class="img-ct">
            <img class="simple-img" :style="imgStyle" :src="imgStr + allImgList[0].value" @click="openBigCarousel()">
            <!--详情不显示删除-->
            <span class="num-img" >
              {{allImgList.length}}
            </span>
          </div>
        </div>

        <div class="file-list">
          <div class="file-ct" v-for="(item, index) in allFilesList" :key="index">
            <div class="file-name-ct">
              <span class="file-name">{{ item.name }}</span>
            </div>
            <div style="width: 75px">
              <button class="btn btn-text btn-primary" @click="download(item.value)">下载</button>
              <button class="btn btn-text btn-danger" @click="deleteImgOrFile(item, index, 'file')" v-if="!disabled">删除</button>
            </div>
          </div>
        </div>
      </div>
      <span v-if="disabled && !allImgList.length && !allFilesList.length" :style="noDataStyle" class="no-data">无</span>
    </div>
    <!--大图左右切换-->
      <div class="big-img-ct" v-if="bigImg.show" @click.prevent="hideImg">
        <a-icon type="close" class="close-big-img" @click.native="hideImg"/>
        <a-icon v-if="allImgList.length>1" type="left-circle" class="prev iconfont" @click.stop="toPrevImg()"/>
        <a-icon v-if="allImgList.length>1" type="right-circle" class="next iconfont" @click.stop="toNextImg()"/>
        <div v-show="currIndex === index" v-for="(item, index) in allImgList" :key="index" style="position: relative;">
          <img class="big-img" :src="imgStr + item.value">
        </div>
      </div>
  </div>
</template>

<script type="text/javascript">
import {Icon, Carousel} from 'ant-design-vue'
import {fileUpload, fileDownLoad} from '@/api/basics'
import {basics} from '@/config/config.url'
let getUuid = (() => {
  let uuid = 1
  return () => {
    return ++uuid
  }
})()
export default {
  components: {
    AIcon: Icon,
    ACarousel: Carousel
  },
  props: {
    value: {
      type: Array
    },
    label: {
      type: String,
      default: '附件'
    },
    labelWidth: {
      type: String,
      default: '90px'
    },
    maxCount: {
      type: Number,
      default: Infinity
    },
    // 上传接口
    uploadUrl: {
      type: String,
      default: 'fileUpload'
    },
    // 下载文件前缀
    fileStr: {
      type: String
    },
    // 删除接口
    deleteUrl: {
      type: String,
      default: 'deleteFile'
    },
    deletePara: {
      type: Object,
      default () {
        return {}
      }
    },
    refType: {
      type: String
    },
    multiple: {
      type: Boolean,
      default: false
    },
    // 'select' and 'drop'
    uploadType: {
      type: String,
      default: 'select'
    },
    // 上传图片类型
    imgType: {
      type: Array,
      default () {
        return ['png', 'jpg', 'jpeg', 'gif']
      }
    },
    // 上传文件类型
    fileType: {
      type: Array,
      default () {
        return ['doc', 'docx', 'pdf', 'xls', 'xlsx', 'txt']
      }
    },
    // 缩略图大小
    imgSize: {
      type: Array,
      default () {
        return [93, 93]
      }
    },
    // 上传图片大小
    imgMaxSize: {
      type: Number,
      default: 5120
    },
    // 上传文件大小
    fileMaxSize: {
      type: Number,
      default: 5120
    },
    accept: {
      type: String
    },
    maxSize: {
      type: Number,
      default: 5120
    },
    inputWidth: {
      type: String,
      default: '340px'
    },
    // 是否禁止， 禁止则为查看
    disabled: {
      type: Boolean,
      default: false
    },
    // 是否显示必填
    required: {
      type: Boolean,
      default: false
    },
    labelStyle: {
      type: Object
    },
    noDataStyle: {
      type: Object
    },
    imgCtStyle: {
      type: Object,
      default () {
        return {}
      }
    }
  },
  data () {
    return {
      imgStr: basics.common.imgStr, // 图片前缀
      allImgList: [], // {id: '', name: '', value: ''}
      allFilesList: [], // {id: '', name: '', value: ''}
      bigImg: {
        url: '',
        show: false
      },
      currIndex: 0, // 当前图片索引,
      ismouse: false,
      dragOver: false,
      prompt: {
        show: false,
        index: '',
        type: 'file'
      },
      showCarousel: false // 查看走马灯
    }
  },
  computed: {
    count () {
      return this.allFilesList.length + this.allImgList.length
    },
    borderClass () {
      return this.dragOver ? 'drag-over' : 'drag-leave'
    },
    mainStyle () {
      return {
        width: `${this.inputWidth}`
      }
    },
    imgStyle () {
      return {
        width: `${this.imgSize[0]}px`,
        height: `${this.imgSize[1]}px`
      }
    }
  },
  methods: {
    // 向上冒出value
    inputEvent () {
      let data = []
      this.allImgList.map((item) => {
        data.push(item.value || '')
        return item.value || ''
      })
      this.allFilesList.map((item) => {
        data.push(item.value || '')
        return item.value || ''
      })
      this.$emit('input', data)
    },
    openBigCarousel () {
      this.bigImg.show = true
      this.currIndex = 0
    },
    /**
     * 删除文件或图片
     */
    deleteImgOrFile (item, index, type) {
      if (type === 'img') {
        this.allImgList.splice(index, 1)
      }
      if (type === 'file') {
        this.allFilesList.splice(index, 1)
      }
      this.inputEvent()
    },
    myClick () {
      this.$refs.input.click()
    },
    /**
     * 从files入手，change时，加到files数组里，删除也从files删除
     */
    change (files, e) {
      if (!files.length) return
      if (files.length + this.count > this.maxCount) {
        e.target.value = ''
        this.$message.error(`文件数量超过${this.maxCount}个`)
        return
      }
      for (let i = 0; i < files.length; i++) {
        let checkObj = this.checkFile(files[i].name, files[i].size)
        // 如果验证不通过
        if (!checkObj.isOk) {
          e.target.value = ''
          return
        }
        // 验证通过发送文件
        let fileData = new FormData()
        fileData.append('file', files[i])
        fileUpload(fileData).then(res => {
          if (res.data.code === '0') {
            let path = res.data.data
            if (checkObj.isImg) {
              this.allImgList.push({id: getUuid(), name: '', value: path})
            }
            if (checkObj.isFile) {
              this.allFilesList.push({id: getUuid(), name: path ? path.split('/').pop() : '', value: path})
            }
            if (i === (files.length - 1)) {
              this.$nextTick(() => {
                e.target.value = ''
              })
              this.inputEvent()
            }
          }
        })
      }
    },
    onDrop (e) {
      this.dragOver = false
      this.change(e.dataTransfer.files, e)
    },
    loadFile (data, ifAdd) {
      if (!Array.isArray(data)) {
        return
      }
      let allImgList = []
      let allFilesList = []
      data.forEach(path => {
        if (!path) {
          return
        }
        let checkObj = this.checkFile(path)
        if (checkObj.isImg) {
          allImgList.push({id: getUuid(), name: '', value: path})
        }
        if (checkObj.isFile) {
          allFilesList.push({id: getUuid(), name: path ? path.split('/').pop() : '', value: path})
        }
      })
      this.allImgList = allImgList
      this.allFilesList = allFilesList
    },
    upload () {
    },
    // 下载文件
    download (path) {
      let data = {
        filePath: path
      }
      fileDownLoad(data).then(res => {
        let blob = new Blob([res.data])
        let a = document.createElement('a')
        a.href = URL.createObjectURL(blob)
        a.download = path.split('/').pop()
        a.style.display = 'none'
        document.body.appendChild(a)
        a.click()
        a.remove()
      })
    },
    checkFile (fileName, fileSize) {
      // 检查图片类型
      let myImgType = false
      if (this.imgType.length) {
        const ImgType = fileName.split('.').pop().toLowerCase()
        myImgType = this.imgType.some(item => item.toLowerCase() === ImgType)
      }
      // 检查文件类型
      let myFileType = false
      if (this.fileType.length) {
        const FileType = fileName.split('.').pop().toLowerCase()
        myFileType = this.fileType.some(item => item.toLowerCase() === FileType)
      }
      // 检查图片大小
      let imgSize = true
      if (this.myImgType && fileSize) {
        imgSize = fileSize <= (this.imgMaxSize * 1024)
      }
      // 检查文件大小
      let mfileSize = true
      if (this.myFileType && fileSize) {
        mfileSize = fileSize <= (this.fileMaxSize * 1024)
      }
      let tipValue = [myImgType || myFileType, imgSize, mfileSize]
      let tipArr = [`文件类型错误`, `图片大小超过${this.imgMaxSize}Kb`, `文件大小超过${this.fileMaxSize}Kb`]
      let flag = true
      for (let i = 0; i < tipValue.length; i++) {
        if (flag && !tipValue[i]) {
          this.$message.error(tipArr[i])
          flag = false
        }
      }
      return {
        isOk: (myImgType && imgSize) || (myFileType && mfileSize),
        isImg: myImgType,
        isFile: myFileType,
        imgSize: imgSize,
        fileSize: mfileSize
      }
    },
    openBigImg (url, index) {
      this.currIndex = index
      this.bigImg.url = url
      this.bigImg.show = true
    },
    hideImg () {
      this.currIndex = 0
      this.bigImg.show = false
      this.bigImg.url = ''
    },
    // 下一张
    toNextImg () {
      this.currIndex++
      this.currIndex = this.currIndex > this.allImgList.length - 1 ? 0 : this.currIndex
    },
    // 上一张
    toPrevImg () {
      this.currIndex--
      this.currIndex = this.currIndex < 0 ? this.allImgList.length - 1 : this.currIndex
    }
  },
  watch: {
    value (val) {
      this.loadFile(val, false)
    }
  },
  mounted () {
    this.loadFile(this.value, false)
  }
}
</script>

<style scoped lang="less">
@import '../../assets/less/variables.less';
.carousel-box{
  position: fixed;
  background: rgba(0, 0, 0, .84);
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  display: flex;
  justify-content: center;
  align-items: center;
  .carousel-box-div{
    width: 300px;
    height: 200px;
    position: relative;
    img{
      width: 100%;
      height: 100%;
    }
    .close-carousel-img{
      position:absolute;
      top: -50px;
      right: -50px;
      color: #fff;
    }
  }
}
.no-data{
  position:relative;
  top: 10px;
  left:0;
  color: @black;
}
.title {
  display: inline-block;
  color: #687485;
  font-size: 14px;
  line-height: 14px;
  font-weight: normal;
  text-align: left;
  vertical-align: top;
  margin-right: 15px;
  .required {
    color: @primary-red;
  }
}
.main {
  display: inline-block;
  text-align: left;
}
.upload-select {
  margin-bottom: 13px;
}
.upload-drop {
  width: 113px;
  height: 113px;
  display: inline-block;
  font-size: 43px;
  color: #aaa;
  background: #fafafa;
  border: 1px dashed #d9d9d9;
  border-radius: 4px;
  text-align: center;
  position: relative;
  margin:0 19px 13px 0;
  cursor: pointer;
  transition: all .3s ease;
  & > i{
    font-size: 32px;
    margin-top: 13px;
    position: absolute;
    top: 19px;
    left: 50%;
    transform: translateX(-50%);
  }
  p{
    font-size: 14px;
    color: #959dab;
    position: absolute;
    text-align: center;
    width: 100%;
    bottom: 0;
  }
  &:hover {
    border: 1px dashed #2d8cf0;
    color: #2d8cf0;
  }
  & span {
    display: inline-block;
    margin-top: 50%;
    transform: translateY(-50%);
  }
}
.drag-over {
  border: 2px dashed #2d8cf0;
  color: #2d8cf0;
}
.drag-leave {
  border: 1px dashed #aaa;
  color: #aaa;
}
.ipt-file {
  display: none !important;
}
.img-ct {
  display: inline-block;
  vertical-align: top;
  margin-right: 23px;
  position: relative;
  padding: 9px;
  border:1px solid #dfdfdf;
  border-radius:4px; 
  transition: all .2s;
  &:hover{
    border-color: #2b99ff;
  }
  &:hover .delete-img, &:hover .cover {
    display: block;  
  }
  .delete-img .anticon-delete:hover{
    color: #fff;
  }
  .cover{
    width: 93px;
    height: 20px;
    line-height: 20px;
    background: rgba(0, 0, 0, 0.3);
    position: absolute;
    bottom: 10px;
    text-align: center;
    color: #dedede;
    font-size: 12px;
    cursor: pointer;
    display: none;
    &.active{
      color: #fff;
      display: block;
    }
    &:hover {
      color: #fff;
    }
  }
  .img-num{
    position:absolute;
    right:0;
    bottom:0;
    width:16px;
    height:16px;
    background: rgba(0, 0, 0, 0.6);
    z-index:1;
    border-radius: 9px 0 4px 0;
    margin:0;
    color:#fff;
    font-size: 12px;
    line-height: 16px;
    text-align: center;
  }
}
.simple-img {
  cursor: pointer;
}
.delete-img {
  width: 20px;
  height: 20px;
  line-height: 20px;
  background: rgba(0, 0, 0, .4);
  text-align: center;
  position: absolute;
  top: 10px;
  right: 10px;
  color: #dedede;
  cursor: pointer;
  transition: all .3s;
  border-radius:0 0 0 4px;
  display: none;
  i{
    color: #dedede;
  }
}
.num-img{
  width: 17px;
  height: 18px;
  background: #202020;
  opacity: 0.5;
  position: absolute;
  bottom: 9px;
  right: 9px;
  text-align: center;
  color: #fff;
  line-height: 17px;
}
.big-img-ct {
  background: rgba(0, 0, 0, .84);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  width: 100vw;
  top: 0;
  // left: 50%;
  bottom: 0;
  right: 0;
  // margin-left: -45vw;
  z-index: 999;
  overflow: hidden;
  .iconfont {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    font-size: 50px;
    color:#a4a4a4;
    border-radius: 50%;
    cursor: pointer;
    z-index: 1;
    &:hover{
      border-color: #c7c7c7;
      color: #c7c7c7;
      background: rgba(0, 0, 0, 0.46);
    }
  }
  .prev{
    left: 10vw;
  }
  .next{
    right: 10vw;
  }
  .zoom-tool {
    width:100%;
    height: 165px;
    position: absolute;
    left: 0;
    bottom: 0;
    &:hover div{
      opacity: 1;
    }
    div {
      width: 50%;
      height: 42px;
      line-height: 42px;
      background: rgba(0, 0, 0, 0.8);
      margin: 0 auto;
      color: #fff;
      text-align: center;
      position: absolute;
      bottom:0;
      left: 50%;
      transform: translateX(-50%);
      opacity: 0;
      font-size: 22px;
    }
  }
}
.big-img{
  max-height: 85vh;
  max-width: 90vw;
  user-select: none;
  -webkit-animation-name: antZoomIn;
  animation-name: antZoomIn;
  -webkit-animation-fill-mode: both;
  animation-fill-mode: both;
  -webkit-animation-duration: .2s;
  animation-duration: .2s
}
.close-big-img {
  font-size:25px;
  position: absolute;
  top: 50px;
  right: 50px;
  z-index: 10;
  cursor: pointer;
  color: #fff;
}
.big-img + .close-big-img {
  position: absolute;
  top: -50px;
  right: -60px;
  z-index: 10;
}

.file-ct {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
  padding-right: 20px;
}
.file-name-ct {
  width: 90%;
  color: #324057;
  white-space: nowrap;
  text-align: left;
  text-overflow: ellipsis;
  overflow: hidden;
  &:hover {
    white-space: normal;
    color: @primary-blue;
  }
}
.file-name {
  cursor: pointer;
}
/*效果和ant-design里antZoomIn（antd.css）动画效果一样*/
@-webkit-keyframes layer-bounceIn {
    0% {
        opacity: 0;
        -webkit-transform: scale(.2);
        transform: scale(.2)
    }

    100% {
        opacity: 1;
        -webkit-transform: scale(1);
        transform: scale(1)
    }
}

@keyframes layer-bounceIn {
    0% {
        opacity: 0;
        -webkit-transform: scale(.2);
        -ms-transform: scale(.2);
        transform: scale(.2)
    }

    100% {
        opacity: 1;
        -webkit-transform: scale(1);
        -ms-transform: scale(1);
        transform: scale(1)
    }
}
.custom-slick-arrow {
  width: 25px;
  height: 25px;
  font-size: 25px;
  color: #fff;
  background-color: rgba(31,45,61,.11);
  opacity: 0.3;
}
.custom-slick-arrow:before {
  display: none;
}
.custom-slick-arrow:hover {
  color: #fff!important;
  opacity: 0.7!important;
}
</style>
