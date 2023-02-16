/* 作者： 刘鹏真 */

<template>
  <div class="preview-images-warp">
    <div class="close-img" @click="closeImg">x</div>
    <div class="forward" @click="next">
      <svg viewBox="64 64 896 896" data-icon="right" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M765.7 486.8L314.9 134.7A7.97 7.97 0 0 0 302 141v77.3c0 4.9 2.3 9.6 6.1 12.6l360 281.1-360 281.1c-3.9 3-6.1 7.7-6.1 12.6V883c0 6.7 7.7 10.4 12.9 6.3l450.8-352.1a31.96 31.96 0 0 0 0-50.4z"></path></svg>
    </div>
    <div class="backward" @click="prev">
      <svg viewBox="64 64 896 896" data-icon="left" width="1em" height="1em" fill="currentColor" aria-hidden="true" focusable="false" class=""><path d="M724 218.3V141c0-6.7-7.7-10.4-12.9-6.3L260.3 486.8a31.86 31.86 0 0 0 0 50.3l450.8 352.1c5.3 4.1 12.9.4 12.9-6.3v-77.3c0-4.9-2.3-9.6-6.1-12.6l-360-281 360-281.1c3.8-3 6.1-7.7 6.1-12.6z"></path></svg>
    </div>
    <div>
      <div class="segi-image-wrap">
        <div class="figure" id="box">
          <img class="img-show" id="imgShow" :src="images[current].url" :key="imgkey"/>
        </div>
      </div>
    </div>
    <footer class="segi-toolbar">
      <p class="index-wrapper"><strong>{{current + 1}}</strong><span>/{{this.total}}</span></p>
      <span class="images-titli" v-show="images[current].title">{{images[current].title}}</span>
      <div class="segi-toolbar-right">
        <div class="segi-toolbar-btns-wrap">
          <i class="zoom" @click="zoom(0.1)"></i>
          <i class="zoomOut" @click="zoom(-0.1)"></i>
          <i class="remote" @click="rotate()"></i>
        </div>
        <a :href="images[current].url" download="" target="_blank" class="save"></a>
      </div>
    </footer>
  </div>
</template>

<script>
export default {
  computed: {
    images () {
      return this.imgList.map(option => {
        if (typeof option === 'string') {
          return {
            url: /^http|https/.test(option) ? option : this.hostImg + option
          }
        } else {
          return /^http|https/.test(option.url) ? option : Object.assign(option, {url: this.hostImg + option.url})
        }
      })
    },
    total () {
      return this.images.length
    }
  },
  data () {
    return {
      current: 0,
      degree: 0,
      imgkey: 1,
      imgList: []
    }
  },
  props: {
    // 预览图片数组
    list: {
      type: [Array, String],
      default: () => []
    },
    hostImg: {
      type: String,
      default: window.__configs ? window.__configs.hostImg : 'https://betapic.uhomecp.com/'
    },
    options: {
      type: Object
    },
    imgIndex: Number
  },
  created () {
    if (this.list === '' || this.list === '[]') {
      this.imgList = []
    } else {
      if (typeof this.list === 'string') {
        this.imgList = [this.list]
      } else {
        this.imgList = this.list
      }
    }
  },
  mounted () {
    this.current = this.imgIndex
    this.moveTo()
    let this_ = this
    window.addEventListener('mousewheel', function (ev) {
      this_.zoomWheel(ev)
    })
  },
  methods: {
    closeImg () {
      this.$emit('closeImg')
    },
    // 滚轮滚动缩放图片
    zoomWheel (ev) {
      ev.preventDefault()
      let scale = ev.deltaY < 0 ? 0.05 : -0.05
      this.zoom(scale)
    },
    // 图片相对比例缩放
    zoom (scale) {
      let imgShow = document.getElementById('imgShow')
      if (imgShow.width < 100 && scale < 0) {
        return
      }
      if (imgShow.width > 3000 && scale > 0) {
        return
      }
      imgShow.style.width = imgShow.width * (1 + scale) + 'px'
      imgShow.style.height = imgShow.height * (1 + scale) + 'px'
    },
    // 图片相对位置旋转
    rotate () {
      let imgShow = document.getElementById('imgShow')
      if (this.degree === 360) {
        this.degree = 0
      }
      this.degree += 90
      imgShow.style.transform = `rotate(${this.degree}deg)`
    },
    // 移动图片到固定位置
    moveTo (x, y) {
      let imgShow = document.getElementById('imgShow')
      if (imgShow) {
        imgShow.onmousedown = function (ev) {
        var oEvent = ev
        // 浏览器有一些图片的默认事件,这里要阻止
        oEvent.preventDefault()
        let oldLeft = Number(imgShow.style.left.replace('px', ''))
        let oldtop = Number(imgShow.style.top.replace('px', ''))
        var disX = oEvent.clientX - oldLeft
        var disY = oEvent.clientY - oldtop
        imgShow.onmousemove = function (ev) {
          oEvent = ev
          oEvent.preventDefault()
          var x = oEvent.clientX - disX
          var y = oEvent.clientY - disY
          imgShow.style.left = x + 'px'
          imgShow.style.top = y + 'px'
        }
        // 图形移出父盒子取消移动事件,防止移动过快触发鼠标移出事件,导致鼠标弹起事件失效
        imgShow.onmouseleave = function () {
          imgShow.onmousemove = null
          imgShow.onmouseup = null
        }
        // 鼠标弹起后停止移动
        imgShow.onmouseup = function () {
          imgShow.onmousemove = null
          imgShow.onmouseup = null
          }
        }
      }
    },
    // 上一张图片
    prev () {
      this.imgkey += 1
      if (this.current <= 0) {
        this.current = this.total - 1
      } else {
        this.current -= 1
      }
      this.$nextTick(() => {
        this.moveTo()
      })
    },
    // 下一张图片
    next () {
      this.imgkey += 1
      if (this.current + 1 >= this.total) {
        this.current = 0
      } else {
        this.current += 1
      }
      this.$nextTick(() => {
        this.moveTo()
      })
    }
  }
}
</script>

<style lang="less" scoped>
.preview-images-warp{
  background: rgba(0, 0, 0, .3);
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  right: 0;
  z-index: 999;
  .forward, .backward, .close-img{
    width: 72px;
    height: 72px;
    position:absolute;
    font-size: 20px;
    color: #fff;
    font-weight: 600;
    border-radius: 50%;
    text-align: center;
    line-height: 72px;
    transition: all 0.6s;
    &:hover{
      background: #fff;
      color: #6D7585;
    }
  }
  .forward{
    top: 45%;
    right: 10px;
  }
  .backward{
    top: 45%;
    left: 10px;
  }
  .close-img{
    width: 48px;
    height: 48px;
    border-radius: 8px;
    top: 10px;
    right: 10px;
    font-weight: 400;
    line-height: 44px;
  }
  .img-warp{
    max-height: 80vh;
    max-width: 80vw;
  }
  .segi-toolbar {
    position: fixed;
    display: flex;
    padding: 0 20px;
    align-items: center;
    justify-content: space-between;
    left: 50%;
    transform: translateX(-50%);
    bottom: 10px;
    height: 48px;
    width: 600px;
    border-radius: 4px;
    background: rgba(255, 255, 255, 0.8);
    z-index: 10000;
    .index-wrapper {
      margin: 0;
      color: #6D7585;
      font-size: 14px;
      strong {
        color: #49505E;
        font-size: 20px;
      }
    }
    .images-titli{
      display: inline-block;
      font-size: 15px;
      font-size: 800;
      lint-height: 48px;
    }
    .segi-toolbar-right {
      display: flex;
      line-height: 1;
      .segi-toolbar-btns-wrap {
        padding-right: 19px;
        position: relative;
        &::after {
          content: '';
          display: inline-block;
          width: 0;
          height: 18px;
          border-right: 2px solid #DCE1E6;
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          right: 0;
        }
        i {
         display: inline-block;
         margin-right: 25px;
         width: 32px;
         height: 32px;
         background-size: cover;
         cursor: pointer;
         &:last-child {
           margin-right: 0;
         }
         &.zoom {
           background-image: url(../assets/image/imgShow/zoom_icon.png);
         }
         &.zoomOut {
           background-image: url(../assets/image/imgShow/zoomOut_icon.png);
         }
         &.remote {
           background-image: url(../assets/image/imgShow/remote_icon.png);
         }
        }
      }
      .save {
        display: block;
        margin-left: 19px;
        width: 32px;
        height: 32px;
        background-image: url(../assets/image/imgShow/save_icon.png);
        background-size: contain;
      }
    }
  }
  .segi-image-wrap {
    display: flex;
    text-align: center;
    .figure {
      position: relative;
      overflow: hidden;
      width: 80vw;
      height: 80vh;
      padding: 8px;
      display: table-cell;
      text-align: center;
      line-height: 80vw;
      p {
        margin: 12px 0 0;
      }
    }
  }
  .img-show {
    position: relative;
    display: block;
    max-width: 100%;
    max-height: 100%;
    margin: 0 auto;
    cursor:move
  }
}
</style>
