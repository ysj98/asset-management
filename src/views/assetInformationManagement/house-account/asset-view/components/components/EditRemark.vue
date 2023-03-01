<!--
 * @Author: LDC
 * @Date: 2022-07-12 15:13:37
 * @LastEditTime: 2022-07-20 18:27:24
 * @Description: 
 * 
 * 
-->
<template>
  <div class="edit-remark">
    <div class="left-box">
      <div style="marginbottom: 10px">已选择的房屋资产：</div>
      <div class="content">
        <div class="item" v-for="(item, index) in asset" :key="index">
          <span>{{ item.assetName }} </span
          ><span style="float: right" @click="deleteItem(item.assetHouseId)"><SG-Icon type="icon-ic_guanbi" size="12px"></SG-Icon></span>
        </div>
      </div>
    </div>

    <div class="right-box">
      <a-spin :spinning="spinning">
        <div style="marginbottom: 10px">备注内容：</div>
        <div class="content">
          <a-textarea placeholder="请输入备注内容" showCount :maxLength="200" :rows="5" v-model="remark"></a-textarea>
          <div class="files">
            <!-- <UploadFile type="all" v-model="uploadList" :maxSize="51200">
          <div slot="tips">上传的文件最多为5个，文件大小最多为50M</div>
        </UploadFile> -->
            <UploadFile
              :baseImgURL="configBase.hostImg1"
              :customUpload="customUpload"
              :customDownload="customDownload"
              v-model="uploadList"
              type="all"
              :maxSize="51200"
              :isMultiple="false"
            >
              <div slot="tips">上传的文件最多为5个，文件大小最多为50M</div>
            </UploadFile>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
import { utils } from '@/utils/utils';
import configBase from '@/config/config.base';
import SGUploadFilePlus from '@/components/SGUploadFilePlus';
import customMix from './customMix';
export default {
  components: { SGUploadFilePlus },
  props: ['list'],
  mixins: [customMix],
  data() {
    return {
      configBase,
      asset: [],
      uploadList: [],
      remark: '',
      spinning: false,
      assetHouseId: '',
    };
  },
  methods: {
    // 查询详情
    queryDetailInfo(assetHouseId) {
      this.spinning = true;
      this.$api.assets
        .queryAssetViewBaseInfo({ assetHouseId })
        .then((r) => {
          console.log(r);
          this.spinning = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            let temp = res.data;
            // temp.assetType = '房屋'
            // temp.houseType = '房屋'
            // temp.rentArea = Number(temp.rentedArea) + Number(temp.unRentedArea)
            // let {transferOperationTime, transferOperationArea} = temp
            // this.$emit('updateTransfer', {transferOperationTime, transferOperationArea})
            // return this.infoData = temp
            this.remark = temp.remark;
            let uploadList = [];
            if (temp.attachmentList && temp.attachmentList.length) {
              temp.attachmentList.map((item) => {
                uploadList.push({
                  name: item.oldAttachmentName,
                  url: item.attachmentPath,
                });
              });
            }
            this.uploadList = uploadList;
          }
          //throw res.message || '查询接口出错'
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err || '查询接口出错');
        });
    },
    deleteItem(assetHouseId) {
      if (this.asset.length < 2) {
        return;
      }
      this.asset = this.asset.filter((item) => {
        return item.assetHouseId !== assetHouseId;
      });
      let temp = [];
      this.asset.map((e) => {
        temp.push(e.assetHouseId);
      });
      this.assetHouseId = temp.join(',');
    },
  },
  watch: {
    list: {
      handler(val) {
        if (val.length == 1) {
          this.queryDetailInfo(val[0].assetHouseId);
        }
        this.asset = utils.deepClone(val);
        let temp = [];
        this.asset.map((e) => {
          temp.push(e.assetHouseId);
        });
        this.assetHouseId = temp.join(',');
      },
      immediate: true,
    },
  },
};
</script>

<style lang="less">
.edit-remark {
  display: flex;
  height: 400px;
  justify-content: space-between;
  .content {
    border: 2px solid #f5f6f7;
    height: 100%;
    overflow-y: auto;
    overflow-x: auto;
  }
  .left-box {
    width: 40%;
    height: 400px;
    .item {
      display: flex;
      justify-content: space-between;
      line-height: 30px;
      padding: 5px;
      border-bottom: 2px solid #f2f2f2;
    }
  }
  .right-box {
    width: 58%;
    height: 400px;
    .files {
      margin-top: 100px;
      width: 100%;
    }
  }
  .previewWrap {
    width: 100% !important;
  }
  .ant-spin-container {
    height: 400px !important;
  }
}
</style>
