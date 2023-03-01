/*
 * @Date: 2019-12-07 11:22:07
 * @Description: 楼盘字典自定义下载 调用基础数据接口
 */
import * as apiOwnership from '@/api/ownership';
export default {
  methods: {
    // 自定义下载
    customDownload(file) {
      let loadingName = this.SG_Loding('下载中...');
      apiOwnership.downLoadAnnex({ attachmentPath: file.url, fileName: file.name }).then(
        (res) => {
          this.DE_Loding(loadingName).then(() => {
            let blob = new Blob([res.data]);
            let a = document.createElement('a');
            a.href = URL.createObjectURL(blob);
            a.download = file.name;
            a.style.display = 'none';
            document.body.appendChild(a);
            a.click();
            a.remove();
          });
        },
        (err) => {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error('下载失败！');
          });
        }
      );
    },
    // 自定义上传
    customUpload(list = [], apiFn) {
      let files = Array.from(list);
      console.log({ files });
      let lists = [];
      let errorLists = [];
      let requestList = files.map((file) => {
        let fileData = new FormData();
        fileData.append('file', file);
        errorLists.push({ url: file.name, name: file.name });
        if (this.bussType) {
          fileData.append('bussType', this.bussType);
        }
        return apiFn(fileData);
      });
      let requestAll = Promise.all(requestList);
      return requestAll
        .then((res) => {
          res.map((item) => {
            if (item.data.code === '0' && item.data.data) {
              let data = item.data.data;
              lists.push({
                url: data.attachmentPath,
                name: data.originName,
                size: files[0].size,
              });
            } else {
              this.$SG_Message.error(item.data.message);
            }
          });
          lists = lists.map((ele, index) => {
            const res = { ...ele };
            const resKey = files[index]._key;
            if (resKey) {
              res._key = resKey;
            }
            return res;
          });
          console.log({ lists });
          return { lists };
        })
        .catch(() => {
          return { lists: [], errorLists };
        });
    },
  },
};
