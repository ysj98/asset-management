/*
 * @Author: LDC
 * @Date: 2022-07-25 14:32:11
 * @LastEditTime: 2022-07-25 15:17:08
 * @Description: 
 * 
 * 
 */
import * as apiOwnership from '@/api/ownership'
export default {
  methods: {
    // 自定义下载
    customDownload(file) {
      let loadingName = this.SG_Loding("下载中...");
      apiOwnership.downLoadAnnex({ attachmentPath: file.url,fileName: file.name }).then(
        (res) => {
          this.DE_Loding(loadingName).then(() => {
            let blob = new Blob([res.data]);
            //let a = document.createElement("a");
            window.parent.uhomeNativeApi.downloadFile(URL.createObjectURL(blob))
            // a.href = URL.createObjectURL(blob);
            // a.download = file.name;
            // a.style.display = "none";
            // document.body.appendChild(a);
            // a.click();
            // a.remove();
          });
        },
        (err) => {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error("下载失败！");
          });
        }
      );
    },
  }
}