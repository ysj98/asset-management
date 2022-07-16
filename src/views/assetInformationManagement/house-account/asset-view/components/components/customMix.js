/*
 * @Author: LDC
 * @Date: 2022-07-12 18:11:32
 * @LastEditTime: 2022-07-12 18:12:57
 * @Description: 
 * 
 * 
 */
import {ownership} from '@/config/config.url'
export default {
  methods: {
    // 自定义下载
    customDownload (file) {
      console.log({file})
      // 处理新旧数据
      const fileUrl = file.url || ''
      const fileName = file.name || ''
      const newHref = `${ownership.authorityCardManagement.downLoadAnnex}?attachmentPath=${fileUrl}&fileName=${fileName}`
      const oldHref = `/uhomecp-app/common/downloadFile.do?fileName=${fileName}&filePath=${fileUrl}`
      const resHref = file.fileSources === 0 ? oldHref : newHref
      let a = document.createElement('a')
      a.href = resHref
      a.download = file.name
      a.style.display = 'none'
      document.body.appendChild(a)
      a.click()
      a.remove()
    },
    // 自定义上传
    customUpload (list = []) {
      let files = Array.from(list)
      let lists = []
      let errorLists = []
      // 由于基础数据上传接口不是多文件上传
      let requestList = files.map(file => {
        let fileData = new FormData()
        fileData.append('file', file)
        errorLists.push({ url: file.name, name: file.name })
        return this.$api.ownership.uploadAnnex(fileData)
      })
      let requestAll = Promise.all(requestList)
      return requestAll.then(res => {
        res.map(item => {
          if (item.data.code === '0' && item.data.data) {
            let url = item.data.data
            lists.push({url: url.attachmentPath, name: url.originName, size: files[0].size})
          } else {
            this.$SG_Message.error(item.data.message)
          }
        })
        return {lists}
      }).catch(() => {
        return {lists: [], errorLists}
      })
    },
    // 自定义上传图片
    customUploadImg (list = []) {
      let files = Array.from(list)
      let lists = []
      let errorLists = []
      // 由于基础数据上传接口不是多文件上传
      let requestList = files.map(file => {
        let fileData = new FormData()
        fileData.append('file', file)
        errorLists.push({ url: file.name, name: file.name })
        return this.$api.ownership.uploadAnnex(fileData)
      })
      let requestAll = Promise.all(requestList)
      return requestAll.then(res => {
        res.map(item => {
          if (item.data.code === '0' && item.data.data) {
            let url = item.data.data
            lists.push({url: url.attachmentPath, name: url.originName, size: files[0].size})
          } else {
            this.$SG_Message.error(item.data.message)
          }
        })
        return {lists}
      }).catch(() => {
        return {lists: [], errorLists}
      })
    },
  }
}