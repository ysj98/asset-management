<template>
  <div class="changeLogo">
    <input type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg" />
    <div>
      <img :src="cropperImg" width="400" ref="img">
    </div>
  </div>
</template>

<script>
import Cropper from 'cropperjs'
import 'cropperjs/dist/cropper.min.css'

export default {
  name: "ImgCropper",
  data () {
    return {
      cropperImg: '',
      cropper: '',
      imgName: ''
    }
  },
  methods: {
    uploadImg (event) {
      const img = event.target.files[0]
      this.cropperImg = URL.createObjectURL(img)
      this.imgName = img.name
      this.initCropper()
    },
    initCropper () {
      let cropper = new Cropper(this.$refs.img, {
        viewMode: 1,
        dragMode: 'none',
        aspectRatio: 16/9
      })
      console.log('cropper', cropper, this.$refs.img)
      this.cropper = cropper
    },
  }
}
</script>

<style lang="less">
.changeLogo{
  & > div {
    margin-top: 20px;
  }
}
</style>