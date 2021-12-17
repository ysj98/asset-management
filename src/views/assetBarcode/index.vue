<template>
  <div class="assetBarcode">
    <a-row>
      <a-col :span="4">
        <treeSelect @changeTree="changeTree" placeholder='请选择组织机构' :allowClear="false" style="width:100%;padding-right:10px;"></treeSelect>
      </a-col>
      <a-col :span="20">
        <div class="top">
          <a-icon
            type="info-circle"
            style="color: #45a2ff;font-size: 16px"
            theme="filled" />
          <span style="width: 6px;"></span>
          <span class="top-title top-title-right">
            对应机构未开启个性化设置时，将使用机构树中最近节点上级组织的开启个性化设置
          </span>
        </div>
      </a-col>
    </a-row>
    <div>
      <SG-Title style="margin-left: 20px;" title="资产二维码设置" />
      <div class="content">
        <div class="content-title">
          <img src="../../assets/image/seat.jpg" width="80" alt="" style="margin-right:10px;">
          <SG-Button type="primary" @click="change">更换Logo</SG-Button>
          <div class="organName">组织机构</div>
          <span class="assetLabel">资产标签</span>
        </div>
        <hr />
        <div class="content-show">
          <div style="font-size:16px;padding-bottom:10px;">资产名称</div>
          <div style="font-size:12px;">资产编码</div>
        </div>
        <hr />
        <div class="content-choose">
          <a-select :filterOption="filterOption" v-model="selectConfigure.firstly">
            <a-select-option v-for="(item, index) in assetCodes" :key="index">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-select :filterOption="filterOption" v-model="selectConfigure.secondly">
            <a-select-option v-for="(item, index) in assetCodes" :key="index">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-select :filterOption="filterOption" v-model="selectConfigure.thirdly">
            <a-select-option v-for="(item, index) in assetCodes" :key="index">
              {{ item.name }}
            </a-select-option>
          </a-select>
          <a-select :filterOption="filterOption" v-model="selectConfigure.forthly">
            <a-select-option v-for="(item, index) in assetCodes" :key="index">
              {{ item.name }}
            </a-select-option>
          </a-select>
        </div>
      </div>
    </div>
    <SG-Modal
      title="上传Logo"
      v-model="showChangeLogo"
    >
      <changeLogo></changeLogo>
    </SG-Modal>
  </div>
</template>

<script>
import TreeSelect from '../common/treeSelect.vue'
import changeLogo from './changeLogo.vue'

const assetCodes = [
  {name: '资产位置', value: 0},
  {name: '资产类型', value: 1},
  {name: '资产分类', value: 2},
  {name: '资产项目', value: 3},
  // {name: '规格型号', value: 4},
  {name: '所属机构', value: 5},
  {name: '接管时间', value: 6}
]
export default {
  components: {TreeSelect, changeLogo},
  computed: {

  },
  data () {
    return {
      organId: '',
      assetCodes: [...assetCodes],
      showChangeLogo: false,
      selectConfigure: {
        firstly: '',
        secondly: '',
        thirdly: '',
        forthly: ''
      }
    }
  },
  mounted() {
    this.search()
  },
  methods: {
    change () {
      this.showChangeLogo = true
    },
    changeTree (value, label) {
      this.organId = value
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      )
    },
    search () {
      this.$api.barCode.findAssetLabel({organId: this.organId}).then(res => {
        console.log('res', res.data.data)
      })
    }
  }
}
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
    width: 700px;
    margin-top: 30px;
    margin-left: 300px;
    .content-title {
      display: flex;
      align-items: center;
      margin-top: 20px;
      margin-bottom: 20px;
      img{
        margin: 10px 10px 10px 50px;
      }
      button{
        margin-left: 10px;
        margin-right: 80px;
      }
      .organName{
        display: inline-block;
        border: 2px solid black;
        width: 200px;
        font-size: 20px;
        font-weight: bold;
      }
      .assetLabel{
        margin-left: 80px;
        font-size: 16px;
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
  }
}
</style>