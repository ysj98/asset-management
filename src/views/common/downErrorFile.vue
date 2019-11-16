<!--
 * @Date: 2019-11-15 11:23:56
 * @Author: chen han
 * @Description: 导入错误文件下载
 -->
<template>
    <SG-Modal
        @cancel="hideModal"
        :title="title"
        v-model="visible"
        width="488px"
        cancelText=""
        @ok="hideModal"
        okText="我知道啦"
        :noPadding="true"
        :footer="null"
      >
      <div class="dialog-body">
        <div class="dialog-content">
          <div class="dialog-img">
            <i class="dialog-img-box"></i>
          </div>
          <div class="dialog-num">
            <div>成功导入<span>{{errorInfo.successNum}}</span>行数据，有<span>{{errorInfo.failNum}}</span>行导入失败。</div>
            <div>问题文档 <span v-if="errorInfo.failDataTextPath" class="down_btn" @click="down">下载</span></div>
            <div>修复问题后可继续导入</div>
          </div>
        </div>
        <div class="dialog-footer">
          <SG-Button type="primary" @click="hideModal">我知道了</SG-Button>
        </div>
      </div>
    </SG-Modal>
</template>  
<script>
export default {
  props: {
    title: {
      default: '导入结果'
    },
    errorInfo: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      visible: false,
    }
  },
  methods: {
    hideModal () {
      this.visible = false
    },
    handleSave () {
    },
    down () {
      let loadingName = this.SG_Loding('下载中...')
      this.$api.basics.fileDownLoad({filePath: this.errorInfo.failDataTextPath}).then(res => {
        this.DE_Loding(loadingName).then(() => {
          let blob = new Blob([res.data])
          let a = document.createElement('a')
          a.href = URL.createObjectURL(blob)
          a.download = '异常数据.xlsx'
          a.style.display = 'none'
          document.body.appendChild(a)
          a.click()
          a.remove()
        })
      }, () => {
        this.DE_Loding(loadingName).then(res => {
          this.$SG_Message.error('下载失败！')
        })
      })
    }
  },
}
</script>
<style lang="less" scoped>
  .dialog-content{
    padding: 50px 30px 50px 60px;
    display: flex;
    .dialog-img{
      margin-right: 20px;
      .dialog-img-box{
        display: inline-block;
         width: 147px;
         height: 81px;
         background-image: url('../../assets/image/undertake/result_error.png');
         background-size: 100% 100%;
      }
    }
    .dialog-num{
      &>div{
        margin-bottom: 16px;
      }
    }
  }
</style>
