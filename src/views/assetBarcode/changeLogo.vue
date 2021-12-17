<template>
  <SG-Modal
    class="changeLogo"
    title="上传Logo"
    v-model="show"
    @ok="submit"
    @cancel="cancel"
  >
    <input id="file" type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg" />
    <div>
      <img :src="cropperImg" width="400" ref="img">
    </div>
  </SG-Modal>
</template>

<script>
// import Cropper from 'cropperjs'
// import 'cropperjs/dist/cropper.min.css'

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
        name: ''
      }
    }
  },
  methods: {
    uploadImg (event) {
      const img = event.target.files[0]

      let fileData = new FormData()
      fileData.append('file', img)
      this.$api.ownership.uploadAnnex(fileData).then(res => {
        console.log('res', res)
      })

      this.cropperImg = URL.createObjectURL(img)
      this.imgName = img.name
      // this.initCropper()
    },
    // initCropper () {
    //   let cropper = new Cropper(this.$refs.img, {
    //     viewMode: 1,
    //     dragMode: 'none',
    //     aspectRatio: 16/9
    //   })
    //   console.log('cropper', cropper, this.$refs.img)
    //   this.cropper = cropper
    // },
    submit () {
      this.imgInfo.src = this.cropperImg
      this.imgInfo.name = this.imgName
      this.$emit('submit', this.imgInfo)
      this.cancel ()
    },
    cancel () {
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
}
</style>