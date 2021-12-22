<template>
  <SG-Modal
    class="changeLogo"
    title="上传Logo"
    :maskClosable="false"
    v-model="show"
    @ok="submit"
    @cancel="cancel"
  >
    <input style="margin-bottom: 20px;" id="file" type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg" />
    <div style="width: 400px;">
      <img id="image" :src="cropperImg" ref="img">
    </div>
  </SG-Modal>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

export default {
  name: "ImgCropper",
  props: {
    show: {
      type: Boolean
    }
  },
  data () {
    return {
      cropperImg: '',
      cropper: '',
      imgName: '',
      imgInfo: {
        src: '',
        name: '',
        imageUrl: ''
      }
    }
  },
  methods: {
    uploadImg (event) {
      const img = event.target.files[0]

      let fileData = new FormData()
      fileData.append('file', img)
      this.$api.ownership.uploadAnnex(fileData).then(res => {
        if (Number(res.data.code) === 0) {
          this.imgInfo.imageUrl = res.data.data.attachmentPath
        } else {
          this.$message.error(res.data.message)
        }
      })

      this.cropperImg = URL.createObjectURL(img)
      this.imgName = img.name
      this.initCropper()
    },
    initCropper () {
      const image = document.getElementById('image')
      const cropper = {}
      image.addEventListener('load', () => {
        if (cropper) {
          cropper.destroy()
        }
        const cropper = new Cropper(image, {
          aspectRatio: 1 / 1,
          ready(e) {
            console.log('e', e)
          },
          crop(event) {
            console.log(event.detail.x);
            console.log(event.detail.y);
            console.log(event.detail.width);
            console.log(event.detail.height);
            console.log(event.detail.rotate);
            console.log(event.detail.scaleX);
            console.log(event.detail.scaleY);
          }
        })
      })
      console.log('cropper', cropper)
    },
    submit () {
      this.imgInfo.src = this.cropperImg
      this.imgInfo.name = this.imgName
      this.$emit('submit', this.imgInfo)
      this.cancel ()
    },
    cancel () {
      this.cropperImg = ''
      this.cropper = ''
      this.imgName = ''
      this.$emit("cancel")
    }
  }
}
</script>

<style lang="less">
.changeLogo{
  & > div {
    margin-top: 20px;
  }
  img {
    display: block;
    /* This rule is very important, please don't ignore this */
    max-width: 100%;
  }
}
</style>