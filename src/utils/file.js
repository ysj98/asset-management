
import XLSX from 'xlsx'
 
/**
 * 导入ex表格 得到json数据
 * 已注入所有Vue实例，
 * template模板里调用 $importf
 * 组件方法里调用 this.$importf
 * 例：<input type="file" id="file22" @change="importf('file22')" />
 * this.$importf(id) 得到 json数据
 */
// import SG_UI from 'segi-ant'

// const SG_Message = SG_UI.SG_Message.Message
// SG_Message.loading()
const importf = (FileList, Event) => {
  let promise = new Promise((resolve, reject) => {
    // 导入
    // FileReader共有4种读取方法：
    // 1.readAsArrayBuffer(file) ：将文件读取为ArrayBuffer。
    // 2.readAsBinaryString(file) ：将文件读取为二进制字符串
    // 3.readAsDataURL(file) ：将文件读取为Data URL
    // 4.readAsText(file, [encoding]) ：将文件读取为文本，encoding缺省值为'UTF-8'
    var wb // 读取完成的数据
    var rABS = false // 是否将文件读取为二进制字符串
    if (!FileList) {
      Event.target.value = ''
      return
    }
    var f = FileList[0]
    if (f.name.split('.').pop().toLowerCase() !== 'xlsx' && f.name.split('.').pop().toLowerCase() !== 'xls') {
      // this.$message.warning('This is message of warning')
      alert('格式错误')
      Event.target.value = ''
      return
    }
    var reader = new FileReader()
    if (rABS) {
      reader.readAsArrayBuffer(f)
    } else {
      reader.readAsBinaryString(f)
    }
    var arr = []
    reader.onload = function (e) {
      var data = e.target.result
      if (rABS) {
        wb = XLSX.read(btoa(fixdata(data)), { // 手动转化
          type: 'base64'
        })
      } else {
        wb = XLSX.read(data, {
          type: 'binary'
        })
      }
      // wb.SheetNames[0]是获取Sheets中第一个Sheet的名字
      // wb.Sheets[Sheet名]获取第一个Sheet的数据
      arr = XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
      // console.log(JSON.stringify(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])))
      // console.log(XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]]))
      // return XLSX.utils.sheet_to_json(wb.Sheets[wb.SheetNames[0]])
      Event.target.value = ''
      resolve(arr)
    }
    reader.onerror = function (e) {
      Event.target.value = ''
      reject()
    }
  })
  return promise
}
const fixdata = (data) => { // 文件流转BinaryString
  var o = ''
  var w = 10240
  for (var l = 0 ; l < data.byteLength / w; ++l) o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w, l * w + w)))
  o += String.fromCharCode.apply(null, new Uint8Array(data.slice(l * w)))
  return o
}

export default importf
