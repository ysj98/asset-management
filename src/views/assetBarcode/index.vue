<template>
  <div class="assetBarcode">
    <a-row>
      <a-col :span="4">
        <treeSelect @changeTree="changeTree" placeholder="请选择组织机构" :allowClear="false" style="width: 100%; padding-right: 10px"></treeSelect>
      </a-col>
      <a-col :span="20">
        <div class="top">
          <a-icon type="info-circle" style="color: #45a2ff; font-size: 16px" theme="filled" />
          <span style="width: 6px"></span>
          <span class="top-title top-title-right"> 对应机构未开启个性化设置时，将使用机构树中最近节点上级组织的开启个性化设置 </span>
        </div>
      </a-col>
    </a-row>
    <div>
      <SG-Title style="margin-left: 20px" title="资产二维码设置" />
      <div class="content">
        <div class="content-title">
          <div>
            <img v-if="logoInfo.src" :src="logoInfo.src" width="80" alt="" style="margin-right: 10px" />
            <img v-else-if="!logoInfo.src" src="../../assets/image/seat.jpg" width="80" alt="" />
            <SG-Button type="primary" @click="change">更换Logo</SG-Button>
          </div>
          <div class="organName">{{ organName || '无' }}</div>
        </div>
        <hr />
        <div class="content-show">
          <div style="font-size: 16px; padding-bottom: 10px">资产名称</div>
          <div style="font-size: 16px; padding-bottom: 10px">资产标签</div>
          <div style="font-size: 16px">资产编码</div>
        </div>
        <hr />
        <div style="width: 800px; display: inline-flex; justify-content: space-between">
          <div class="content-choose">
            <a-select :filterOption="filterOption" v-model="selectConfigure.firstly">
              <a-select-option
                v-for="item in assetCodes"
                :key="item.value"
                :disabled="listCom.includes(item.value) && item.value !== selectConfigure.firstly"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
            <a-select :filterOption="filterOption" v-model="selectConfigure.secondly">
              <a-select-option
                v-for="item in assetCodes"
                :key="item.value"
                :disabled="listCom.includes(item.value) && item.value !== selectConfigure.secondly"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
            <a-select :filterOption="filterOption" v-model="selectConfigure.thirdly">
              <a-select-option
                v-for="item in assetCodes"
                :key="item.value"
                :disabled="listCom.includes(item.value) && item.value !== selectConfigure.thirdly"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
            <a-select :filterOption="filterOption" v-model="selectConfigure.forthly">
              <a-select-option
                v-for="item in assetCodes"
                :key="item.value"
                :disabled="listCom.includes(item.value) && item.value !== selectConfigure.forthly"
              >
                {{ item.name }}
              </a-select-option>
            </a-select>
          </div>
          <div class="pic">
            <div>
              <img src="../../assets/image/example.png" width="200" alt="" />
            </div>
            <img style="position: absolute; top: 75px; right: 73px" :src="logoInfo.src" width="50" height="50" alt="" />
          </div>
        </div>
      </div>
      <SG-Button v-power="ASSET_MANAGEMENT.BARCODE_SETTING_SAVE" style="margin-left: 500px; margin-top: 20px" type="primary" @click="save"
        >保存</SG-Button
      >
    </div>
    <changeLogo ref="showChangeLogo" @submit="logoSubmit" @cancel="cancel"></changeLogo>
  </div>
</template>

<script>
import TreeSelect from '../common/treeSelectold.vue';
import changeLogo from './changeLogo.vue';
import configs from '@/config/config.base.js';
import { ASSET_MANAGEMENT } from '@/config/config.power';

const assetCodes = [
  { name: '资产位置', value: 0 },
  { name: '资产类型', value: 1 },
  { name: '资产分类', value: 2 },
  { name: '资产项目', value: 3 },
  { name: '所属机构', value: 4 },
  { name: '接管时间', value: 5 },
];
export default {
  components: { TreeSelect, changeLogo },
  data() {
    return {
      assetLabelCodeId: '',
      ASSET_MANAGEMENT,
      organId: '',
      organName: '',
      assetCodes: [...assetCodes],
      selectData: [],
      selectConfigure: {
        firstly: '',
        secondly: '',
        thirdly: '',
        forthly: '',
      },
      logoInfo: {
        src: '',
        name: '',
        imageUrl: '',
      },
    };
  },
  computed: {
    listCom() {
      return Object.keys(this.selectConfigure).map((ele) => this.selectConfigure[ele]);
    },
  },
  methods: {
    change() {
      this.$refs.showChangeLogo.show = true;
    },
    changeTree(value) {
      this.organId = value;
      this.logoInfo = {};
      this.query();
    },
    query() {
      this.$api.barCode.findAssetLabel({ organId: this.organId }).then((res) => {
        if (Number(res.data.code) === 0) {
          this.assetLabelCodeId = res.data.data.assetLabelCodeId;
          this.organName = res.data.data.organName;
          let data = res.data.data.dictionaryAttr.split(',');
          data = data.map((ele) => Number(ele));
          this.selectConfigure.firstly = data[0];
          this.selectConfigure.secondly = data[1];
          this.selectConfigure.thirdly = data[2];
          this.selectConfigure.forthly = data[3];
          if (res.data.data.attachmentList && res.data.data.attachmentList[0]) {
            let hostImgLength = configs.hostImg.length;
            this.logoInfo.name = res.data.data.attachmentList[0].oldAttachmentName;
            this.logoInfo.imageUrl = res.data.data.attachmentList[0].attachmentPath;
            if (configs.hostImg[hostImgLength - 1] === '/') {
              this.logoInfo.src = configs.hostImg + res.data.data.attachmentList[0].attachmentPath;
            } else {
              this.logoInfo.src = configs.hostImg + '/' + res.data.data.attachmentList[0].attachmentPath;
            }
            console.log('>>>', this.logoInfo.src);
            this.$forceUpdate();
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    logoSubmit(data) {
      this.logoInfo = data;
    },
    cancel() {
      this.showChangeLogo = false;
    },
    save() {
      let dictionaryAttr = [];
      for (let i in this.selectConfigure) {
        dictionaryAttr.push(this.selectConfigure[i]);
      }
      let form = {
        assetLabelCodeId: this.assetLabelCodeId,
        organId: this.organId,
        attachmentList: [
          {
            attachmentPath: this.logoInfo.imageUrl,
            oldAttachmentName: this.logoInfo.name,
          },
        ],
        dictionaryAttr: dictionaryAttr.join(','),
      };
      this.$api.barCode.saveAssetLabel(form).then((res) => {
        if (res.data.code === '0') {
          this.query();
          this.$message.success('保存成功');
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
  },
};
</script>

<style lang="less">
.assetBarcode {
  .ant-row {
    margin: 10px 0 10px 20px;
    display: flex;
    align-items: center;
  }
  .content {
    border: 1px solid black;
    width: 800px;
    margin-top: 30px;
    margin-left: 200px;
    .content-title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-top: 20px;
      margin-bottom: 20px;
      img {
        margin: 10px 10px 10px 50px;
      }
      button {
        margin-left: 10px;
        margin-right: 50px;
      }
      .organName {
        display: inline-flex;
        justify-content: center;
        border: 2px solid black;
        min-width: 300px;
        font-size: 20px;
        font-weight: bold;
        margin-right: 40px;
        padding-left: 10px;
        padding-right: 10px;
      }
    }
    .content-show {
      margin: 20px 0 20px 50px;
    }
    .content-choose {
      margin-top: 30px;
      & > div {
        display: block;
        width: 200px;
        margin-left: 50px;
        margin-bottom: 20px;
      }
    }
    .pic {
      margin-top: 30px;
      margin-right: 160px;
      position: relative;
    }
  }
}
</style>
