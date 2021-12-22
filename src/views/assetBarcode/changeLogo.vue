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
    <div>
      <div style="width:800px;display:inline-flex;justify-content:space-between;">
        <div style="width: 400px;">
          <img id="image" :src="cropperImg" ref="img">
        </div>
        <div style="width:200px;height:200px;border:1px solid red">
          <div style="width:100px;height:100px;border:1px solid green">
            <img src="" alt="">
          </div>
          <div style="width:100px;height:100px;border:1px solid pink">
            <img src="" alt="">
          </div>
        </div>
      </div>
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
      console.log('~~~', fileData)
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
          // ready(e) {
          //   console.log('e', e)
          // },
          crop(event) {
            console.log(event)
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
      
      // var dataurl = image.cropper("getCroppedCanvas")
      // cropper.getCroppedCanvas().toBlob(async function(blob) {
      //     const params = new FormData()
      //     params.append('upload_file', blob, this.imgName)
      //     console.log('params', params)
      //   //   $.ajax({url: 'ams/attachment/uploadAnnex'})
      //   // }, 'image/jpeg')
      // })
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