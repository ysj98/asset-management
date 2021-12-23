<template>
  <SG-Modal
    class="changeLogo"
    title="上传Logo"
    :maskClosable="false"
    v-model="show"
    @ok="submit"
    @cancel="cancel"
  >
    <SG-Button @click="upload" style="display:block;margin-bottom:20px;">上传</SG-Button>
    <input ref="changeLogo" style="display:none;" id="file" type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg" />
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
    upload () {
      this.$refs.changeLogo.click()
    },
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
            } else {
              _this.$message.error(res.data.message)
            }
          })
        } else {
          _this.$SG_Message.error('请上传正方形图片')
          event.target.value = null
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
  input {
    border: 1px solid red;
  }
  & > div {
    margin-top: 20px;
  }
}
</style>