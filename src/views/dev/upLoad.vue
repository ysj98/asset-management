<template>
  <div>
    <a-card title="文件上传">
      <SG-UploadFile
        v-model="files"
      />
    </a-card>
  </div>
</template>

<script>
export default {
  data () {
    return {
      files: [
        { url: '/doc/2019/07/23/8/2019/07/23/1563883528442.txt', name: '1563883528442.txt' },
        { url: '/picture/2019/07/23/8/201907232005287916_700_375.JPEG', name: '201907232005287916_700_375.JPEG' },
        { url: '/picture/2019/07/23/8/201907232005287916_700_375.JPEG', name: '201907232005287916_700_375.JPEG' }
      ]
    }
  }
}
</script>