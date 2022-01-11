<template>
<!-- 需要打印的内容 -->
  <div class="codeCotainer" ref='printContainer'>
      <!-- printHide是为了隐藏打印的按钮，在打印页面时 -->
    <div class="btn"><a-button type="primary" @click="printClick" class='printHide'>打印</a-button></div>
    <div class="content" id="content">
      <div class="codecontent" v-for="(item, index) in codeArray" :id="`code${index}`" :key="index" style="page-break-after:always;">
        <div :ref="`ref${index}`" class="code"></div>
        <div v-for="asset in assetInfo" :key="asset.value">
          <div class="up">
            <span class="left">{{asset.name}}：</span>
            <span class="right">
              {{ codeArray[index][asset.value] }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import QRCode from "qrcodejs2"
import configs from "@/config/config.base.js"
import { axiosGet } from '../../utils/axios'
const assetCodes = [
  {name: '资产位置', value: 0},
  {name: '资产类型', value: 1},
  {name: '资产分类', value: 2},
  {name: '资产项目', value: 3},
  {name: '所属机构', value: 4},
  {name: '接管时间', value: 5}
]
const dictionaryCodes = [
  {name: 'address', value: 0},
  {name: 'assetTypeName', value: 1},
  {name: 'objectTypeName', value: 2},
  {name: 'projectName', value: 3},
  {name: 'organName', value: 4},
  {name: 'takeOverDate', value: 5}
]

export default {
  data() {
    return {
       // 查询二维码信息
      codeInformationParams:{
        organId: '',
        assetIdList: []
      },
      codeArray: [],
      assetCodes: [...assetCodes],
      dictionaryCodes: [...dictionaryCodes],
      assetInfo: [],
      imgUrl: ''
    };
  },
 mounted () {
    this.codeInformationParams.organId = this.$route.query.organId
    if(Array.isArray(this.$route.query.assetId)){
      this.codeInformationParams.assetIdList.push(...this.$route.query.assetId)
    }else{
      this.codeInformationParams.assetIdList.push(this.$route.query.assetId)
    }
    this.checkCode()
  },
  methods: {
    //打印值
    printClick () {
      var newWin = window.open(""); //新打开一个空窗口
      for (var i = 0; i < this.codeArray.length; i++) {
        var imageToPrint = document.getElementById(`code${i}`); //获取需要打印的内容
        newWin.document.write(imageToPrint.outerHTML); //将需要打印的内容添加进新的窗口
      }
      const styleSheet = `<style>.codecontent{float:left;margin-top:35px;width:50%}</style>`;
      newWin.document.head.innerHTML = styleSheet; //给打印的内容加上样式
      newWin.document.close(); //在IE浏览器中使用必须添加这一句
      newWin.focus(); //在IE浏览器中使用必须添加这一句
      setTimeout(function() {
        newWin.print(); //打印
        newWin.close(); //关闭窗口
      }, 100);
    },
     // 查看二维码接口
    checkCode(){
      this.$api.barCode.barCodePrint(this.codeInformationParams).then((res)=>{
        if (Number(res.data.code) === 0) {
          this.codeArray = JSON.parse(JSON.stringify(res.data.data))
          let dictionaryAttr = this.codeArray[0].dictionaryAttr.split(',')
          let selectData = [{name: '资产名称', value: 'assetName'}, {name: '资产标签', value: 'labelCode'}, {name: '资产编码', value: 'assetCode'}]
          dictionaryAttr.forEach(dictionary => {
            let info = {}
            info.name = this.assetCodes.filter(item => dictionary.indexOf(String(item.value)) > -1)[0].name
            info.value = this.dictionaryCodes.filter(item => dictionary.indexOf(String(item.value)) > -1)[0].name
            selectData.push(info)
          })
          this.assetInfo = selectData
          this.bindQRCode()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    bindQRCode() {
      document.title = window.opener.getTitleFun;//接收传过来的title值
      let url = this.codeArray[0].imageUrl
      console.log('url', url)
      this.$nextTick(()=>{
        this.codeArray.forEach((item,index) => {
          let qrcode = new QRCode(this.$refs[`ref${index}`][0], {
            text: item.qrCode,
            width: 150,
            height: 150, // 高度
            colorDark: "#333333", //二维码颜色
            colorLight: "#ffffff", //二维码背景色
            correctLevel : QRCode.CorrectLevel.Q,
          })
          const id = `code${index}`
          const divBlock = document.getElementById(id)
          const cEle = divBlock.querySelector('canvas')
          const iEle = divBlock.querySelector('img')
          const image = new Image(50, 50)
          const reqUrl = `${configs.hostImg1}${url}`
          axiosGet(`${reqUrl}`, {}, false, { responseType: 'blob'}).then(value=>{
            image.src = URL.createObjectURL(value.data)
            image.onload = function (){
              cEle.getContext('2d').drawImage(image, 55, 55, 40, 40)
              iEle.src = cEle.toDataURL()
            }
          })
        })
      })
    },
  },
};
</script>
<style scoped lang="less">
.codeCotainer {
  box-sizing: border-box;
  padding: 20px;
  .btn {
    text-align: right;
  }
  .content {
    display: flex;
    flex-wrap: wrap;
    .codecontent {
      margin-top: 35px;
      margin-left: 60px;
      .up,
      .center,
      .down {
        margin-top: 6px;
      }
    }
  }
}
</style>
