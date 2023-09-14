<!--资产视图业务-资产视图详情页面-'基本信息、空间位置、资产使用方向'组件-->
<template>
  <a-spin :spinning="spinning">
    <!--基本信息-->
    <SG-Title title="基本信息" noMargin />
    <a-row class="title_div" style="margin-top: 6px; margin-bottom: 15px">
      <a-col v-for="{ title, key, span } in baseInfoKeys" :span="span || 8" :key="key">
        <span style="color: #282d5b">{{ title }}:</span>
        <a @click="goDetail" v-if="key === 'assetName'">
          {{ infoData[key] }}
        </a>
        <span v-else style="margin-left: 9px; color: #49505e">{{ infoData[key] || '' }}</span>
      </a-col>
    </a-row>
    <!--空间位置-->
    <SG-Title title="空间位置" noMargin />
    <a-row class="title_div" style="margin-top: 6px; margin-bottom: 15px">
      <a-col v-for="{ title, key, type, span } in spaceInfoKeys" :span="span || 8" :key="key">
        <span style="color: #282d5b">{{ title }}:</span>
        <span v-if="type === 'text'" style="margin: 0 15px 0 4px; color: #49505e">{{ infoData[key] || '' }}</span>
        <div class="img-icon" v-else-if="type === 'img' && infoData[key] && infoData[key].length">
          <img v-for="(url, index) in infoData[key]" :src="getUrl(url)" @click="openBigImg(infoData[key], index)" alt=""
            :key="index" />
        </div>
        <span v-else></span>
      </a-col>
    </a-row>
    <!--资产使用方向-->
    <SG-Title title="资产使用方向" noMargin />
    <overview-number :numList="numList" class="title_div" style="margin-top: 21px" />
    <preview-images v-if="bigImg.show" @closeImg="hideImg" :imgIndex="bigImg.imgIndex"
      :list="bigImg.list"></preview-images>
  </a-spin>
</template>

<script>
import EditAssetDetail from './EditLandDetail';
import PreviewImages from 'components/PreviewImages.vue';
import OverviewNumber from 'src/views/common/OverviewNumber';
import { win } from 'utils/utils';
export default {
  name: 'BaseInfoPart',
  components: { EditAssetDetail, OverviewNumber, PreviewImages },
  props: ['assetHouseId', 'assetLandId'],
  data() {
    return {
      spinning: false,
      baseInfoKeys: [
        { title: '资产名称', key: 'assetName' },
        { title: '资产编码', key: 'assetCode' },
        { title: '资产类型', key: 'assetType' },
        { title: '资产分类', key: 'landType' },
        { title: '土地面积', key: 'landArea' },
        { title: '宗地号', key: 'theNo' },
        { title: '批准日期', key: 'approvalDate' },
        { title: '计容面积(㎡)', key: 'acreage' },
        { title: '资产用途', key: 'landuse' },
        { title: '容积率', key: 'landRate' },
        { title: '资产状态', key: 'statusName' },
        { title: '使用年限', key: 'validPeriod' },
        { title: '有限期限', key: 'endDate' },
        { title: '土地性质', key: 'landuseType ', span: 16 },
        { title: '质押', key: 'pledgeName' },
        { title: '抵押', key: 'mortgageName' },
        { title: '涉诉', key: 'lawsuitName' },
        { title: '土地上盖建筑物面积(㎡)', key: 'structureArea' },
        { title: '不可开发利用土地面积(㎡)', key: 'unavailableArea' },
        { title: '其他土地面积(㎡)', key: 'otherLandArea' },
        { title: '该地块原用地性质', key: 'landNature', span: 16 },
        { title: '该地块最新城市规划情况', key: 'landPlanning ', span: 16 },
        { title: '是否城市更新项目', key: 'cityUpdate' },
        { title: '三旧改造图编号', key: 'transformDrawingNo' },
        { title: '地块是否已签订土地交储协议', key: 'isSign' },
        { title: '是否确权', key: 'isRight' },
        { title: '是否缴纳土地出让金', key: 'isSell' },
        { title: '权属是否清晰', key: 'isRightClear' },
        { title: '权属不清晰原因', key: 'rightClearReason' },
        { title: '是否账外资产', key: 'isAccountOut' },
        { title: '所属园区', key: 'belongToParkName' },
        { title: '产生或有资产原因', key: 'assetReasonName' },
        { title: '或有资产取得时间', key: 'getAssetDate' },
        { title: '预计转确认资产时间', key: 'confirmAssetDate' },
        { title: '土地使用性质', key: 'useNatureName' },
        { title: '土地利用情况', key: 'useUtilizeName' },
        { title: '土地使用状况', key: 'useConditionName' },
        { title: '缴纳土地出让金时间', key: 'payAssignmentTime' },
        { title: '四至范围', key: 'fourToRange', span: 16 },
        { title: '涉诉情况', key: 'lawsuitRemark', span: 16 },
      ], // 基本信息字段
      spaceInfoKeys: [
        { title: '运营项目', key: 'projectName', type: 'text' },
        { title: '土地位置', key: 'location', type: 'text' },
        { title: '用地红线图', key: 'redMap', type: 'img' },
        { title: '资产范围', key: 'isEncloseWall', type: 'text' },
        { title: '围墙图片', key: 'encloseWallPic', type: 'img' },
        { title: '现状图片', key: 'nowPic', type: 'img' },
        { title: '土地备注', key: 'desc', type: 'text' },
      ], // 空间位置字段
      infoData: {}, // 信息数据
      details: {}, // 编辑基本信息数据
      modalObj: { title: '编辑资产信息', status: false, okText: '保存', cancelText: '取消', width: 550, loading: false },
      numList: [
        { title: '运营(㎡)', key: 'transferOperationArea', value: 0, bgColor: '#4BD288', code: '1001', isAble: 'Y' },
        { title: '闲置(㎡)', key: 'idleArea', value: 0, bgColor: '#1890FF', code: '1002', isAble: 'Y' },
        { title: '自用(㎡)', key: 'selfUserArea', value: 0, bgColor: '#DD81E6', code: '1003', isAble: 'Y' },
        { title: '其他(㎡)', key: 'otherArea', value: 0, bgColor: '#BBC8D6', code: '1005', isAble: 'Y' },
      ], // 概览数据,如是格式，title 标题，value 数值，color 背景色
      bigImg: {
        // 查看大图所需数据
        show: false,
        list: [],
        imgIndex: 0,
      },
    };
  },

  methods: {
    // 数据概览信息配置
    useForConfig() {
      const { organId } = this.$route.query;
      this.$api.houseStatusConfig.querySettingByOrganId({ organId }).then((res) => {
        if (res.data.code == 0) {
          let data = res.data.data;
          data.forEach((item) => {
            this.numList.forEach((e) => {
              if (item.code == e.code) {
                e.bgColor = item.color;
                e.isAble = item.isAble;
                e.title = item.alias + '(㎡)' || item.statusName + '(㎡)';
              }
            });
          });
          this.numList = this.numList.filter((i) => {
            return i.isAble === 'Y';
          });
        } else {
          this.$message.error(res.message || '系统内部错误');
        }
      });
    },
    goDetail() {
      const { organId, organName } = this.$route.query;
      const { landId } = this.infoData;
      const tabUrl = `/asset-management/#/buildingDict/detailLand?organId=${organId}&organName=${organName}&type=detail&blankId=${landId}`;
      const tabTitle = '土地详情';
      win.openPortalMenu(tabUrl, tabTitle);
    },
    // 查询详情
    queryDetailInfo() {
      this.spinning = true;
      this.$api.land
        .assetViewDetail({ assetLandId: this.assetLandId + '' })
        .then((r) => {
          this.spinning = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            let temp = res.data;
            let { transferOperationTime, transferOperationArea } = temp;
            this.$emit('updateTransfer', { transferOperationTime, transferOperationArea });
            this.numList = this.numList.map((m) => {
              return { ...m, value: `${temp[m.key] ? temp[m.key].toFixed(2) : 0}` };
            });
            temp.redMap = temp.redMap ? temp.redMap.split(',') : [];
            temp.encloseWallPic = temp.encloseWallPic ? temp.encloseWallPic.split(',') : [];
            temp.nowPic = temp.nowPic ? temp.nowPic.split(',') : [];
            temp.isEncloseWall = temp.isEncloseWall + '' === '0' ? '否' : '是';
            this.$textReplace(temp.organId);
            return (this.infoData = { ...temp, assetType: '土地' });
          } else {
            this.$message.error(res.message || '查询接口出错');
          }
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err || '查询接口出错');
        });
    },
    // 获取图片可展示路径
    getUrl(url) {
      let urlShow = /^http|https/.test(url) ? url : window.__configs ? window.__configs.hostImg + url : 'https://betapic.uhomecp.com/' + url;
      return urlShow;
    },
    openBigImg(lists, index) {
      this.bigImg.imgIndex = index;
      this.bigImg.list = [];
      lists.forEach((item) => {
        this.bigImg.list.push({
          url: item,
          title: '',
        });
      });
      this.bigImg.show = true;
    },
    hideImg() {
      this.bigImg.show = false;
    },
  },

  created() {
    this.queryDetailInfo();
    this.useForConfig();
  },
};
</script>

<style lang="less" scoped>
.img-icon {
  vertical-align: text-top;
  display: inline-block;
  overflow: hidden;
  width: auto;
  max-width: 240px;
  height: 50px;

  img {
    cursor: pointer;
    margin-left: 10px;
    margin-bottom: 10px;
    display: inline-block;
    max-width: 50px;
    max-height: 50px;
  }
}
</style>
