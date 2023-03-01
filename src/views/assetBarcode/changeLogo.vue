<template>
  <SG-Modal class="changeLogo" title="上传Logo" :maskClosable="false" v-model="show" @ok="submit" @cancel="cancel">
    <div>
      <SG-Button @click="upload" style="margin-bottom: 20px; margin-right: 10px">上传</SG-Button>
      <a-icon type="info-circle" style="color: red; margin-right: 5px" />
      <span style="color: red">建议上传正方形的图片。</span>
    </div>
    <input ref="changeLogo" style="display: none" id="file" type="file" accept="image/png, image/jpeg, image/gif, image/jpg" @change="uploadImg" />
    <img width="500" :src="cropperImg" ref="img" />
  </SG-Modal>
</template>

<script>
export default {
  name: 'ImgCropper',
  data() {
    return {
      show: false,
      cropperImg: '',
      imgName: '',
      imgInfo: {
        src: '',
        name: '',
        imageUrl: '',
      },
    };
  },
  methods: {
    upload() {
      this.$refs.changeLogo.click();
    },
    uploadImg(event) {
      const _this = this;
      const img = event.target.files[0];
      const i = new Image();
      i.src = URL.createObjectURL(img);
      i.onload = function () {
        if (i.naturalWidth / i.naturalHeight > 0.9 && i.naturalWidth / i.naturalHeight < 1.1) {
          _this.cropperImg = i.src;
          _this.imgName = img.name;
          let fileData = new FormData();
          fileData.append('file', img);
          _this.$api.ownership.uploadAnnex(fileData).then((res) => {
            if (Number(res.data.code) === 0) {
              _this.imgInfo.imageUrl = res.data.data.attachmentPath;
              _this.$message.success('上传成功');
            } else {
              _this.$message.error(res.data.message);
              _this.cropperImg = '';
              _this.imgName = '';
            }
          });
        } else {
          _this.$SG_Message.error('请上传长宽比为1:1的图片');
          event.target.value = null;
        }
      };
    },
    submit() {
      this.imgInfo.src = this.cropperImg;
      this.imgInfo.name = this.imgName;
      this.$emit('submit', this.imgInfo);
      this.cancel();
    },
    cancel() {
      this.cropperImg = '';
      this.imgName = '';
      this.show = false;
    },
  },
};
</script>

<style lang="less">
.changeLogo {
  input {
    border: 1px solid red;
  }
  & > div {
    margin-top: 20px;
  }
}
</style>
