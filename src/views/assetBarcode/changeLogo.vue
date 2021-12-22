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
    <img width="500" id="image" :src="cropperImg" ref="img">
  </SG-Modal>
</template>

<script>
export default {
  name: "ImgCropper",
  data () {
    return {
      show: false,
      cropperImg: '',
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
      const _this = this
      const img = event.target.files[0]
      const i = new Image()
      i.src = URL.createObjectURL(img)
      i.onload = function() {
        if (i.naturalWidth === i.naturalHeight) {
          _this.cropperImg = i.src
          _this.imgName = img.name
          let fileData = new FormData()
          fileData.append('file', img)
          _this.$api.ownership.uploadAnnex(fileData).then(res => {
            if (Number(res.data.code) === 0) {
              _this.imgInfo.imageUrl = res.data.data.attachmentPath
              _this.show = false
            } else {
              _this.$message.error(res.data.message)
            }
          })
        } else {
          _this.$SG_Message.error('请上传正方形图片')
        }
      }
    },
    submit () {
      this.imgInfo.src = this.cropperImg
      this.imgInfo.name = this.imgName
      this.$emit('submit', this.imgInfo)
      this.cancel ()
    },
    cancel () {
      this.cropperImg = ''
      this.imgName = ''
      this.show = false
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