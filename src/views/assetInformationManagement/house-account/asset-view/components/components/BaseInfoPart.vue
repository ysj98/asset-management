<!--资产视图业务-资产视图详情页面-'基本信息、空间位置、资产使用方向'组件-->
<template>
  <a-spin :spinning="spinning">
    <!--基本信息-->
    <SG-Title title="基本信息" noMargin />
    <a-row class="title_div" style="margin-top: 6px; margin-bottom: 15px">
      <a-col v-for="{ title, key, span } in baseInfoKeys" :span="span || 8" :key="key">
        <span style="color: #282d5b">{{ title }}:</span>
        <span style="margin-left: 9px; color: #49505e" v-if="title !== '附件'">{{
          judgingCondition.includes(infoData[key]) ? '' : infoData[key]
        }}</span>
        <div v-else>
          <UploadFile
            :show="true"
            :customDownload="customDownload"
            :baseImgURL="configBase.hostImg1"
            v-model="infoData[key]"
            type="all"
            :maxSize="51200"
          >
          </UploadFile>
        </div>
      </a-col>
    </a-row>
    <!--空间位置-->
    <SG-Title title="空间位置" noMargin />
    <a-row class="title_div" style="margin-top: 6px; margin-bottom: 15px">
      <a-col v-for="{ title, key, span } in spaceInfoKeys" :span="span || 8" :key="key">
        <span style="color: #282d5b">{{ title }}:</span>
        <span style="margin: 0 15px 0 4px; color: #49505e">{{ infoData[key] || '' }}</span>
        <a-icon v-if="key === 'address'" type="environment" style="color: #e4393c; cursor: pointer" @click="handleModalOpen('location')" />
      </a-col>
    </a-row>
    <!--资产使用方向-->
    <SG-Title title="资产使用方向" noMargin />
    <overview-number :numList="numList" class="title_div" style="margin-top: 21px" />
    <!--编辑资产详情弹窗-->
    <SG-Modal v-bind="modalObj" v-model="modalObj.status">
      <template slot="footer">
        <a-button key="submit" type="primary" :loading="modalObj.loading" @click="handleModalOk">
          {{ modalObj.okText }}
        </a-button>
        <a-button key="back" @click="handleModalCancel">{{ modalObj.cancelText }}</a-button>
      </template>
      <edit-asset-detail ref="editAssetDetail" :details="details" />
    </SG-Modal>
  </a-spin>
</template>

<script>
import EditAssetDetail from './EditAssetDetail';
import SGUploadFilePlus from '@/components/SGUploadFilePlus';
import OverviewNumber from 'src/views/common/OverviewNumber';
import configBase from '@/config/config.base';
import customMix from './customMix';
export default {
  name: 'BaseInfoPart',
  components: { EditAssetDetail, OverviewNumber, SGUploadFilePlus },
  props: ['assetHouseId'],
  mixins: [customMix],
  data() {
    return {
      configBase,
      judgingCondition: [undefined, null, ''],
      spinning: false,
      baseInfoKeys: [
        { title: '资产名称', key: 'assetName' },
        { title: '资产编码', key: 'assetCode' },
        { title: '资产分类', key: 'objectType' },
        { title: '资产类型', key: 'assetType' },
        { title: '房屋形态', key: 'houseType' },
        { title: '户型', key: 'apartmentName' },
        { title: '装修情况', key: 'decorationSituation' },
        { title: '建筑结构', key: 'buildStruct' },
        { title: '资产用途', key: 'useType' },
        { title: '建筑面积', key: 'area' },
        { title: '可出租面积', key: 'rentArea' },
        { title: '竣工日期', key: 'completionDate' },
        { title: '维修日期', key: 'repair' },
        { title: '资产状态', key: 'statusName' },
        { title: '物业管理单位', key: 'organManagement' },
        { title: '物业缴费期限', key: 'organPayDeadline' },
        { title: '物业费', key: 'organFee' },
        { title: '已租面积', key: 'rentedArea' },
        { title: '未租面积', key: 'unRentedArea' },
        { title: '质押', key: 'pledgeName' },
        { title: '抵押', key: 'mortgageName' },
        { title: '涉诉', key: 'lawsuitName' },
        { title: '涉诉情况', key: 'lawsuitRemark' },
        { title: '是否缴纳土地出让金', key: 'isLandSell' },
        { title: '权属是否清晰', key: 'isRightClearChange' },
        { title: '权属不清晰原因', key: 'rightClearReason' },
        { title: '是否账外资产', key: 'isAccountOut' },
        { title: '所属园区', key: 'belongToParkName' },
        { title: '产生或有资产原因', key: 'assetReasonName' },
        { title: '或有资产取得时间', key: 'getAssetDate' },
        { title: '预计转确认资产时间', key: 'confirmAssetDate' },
        { title: '相关描述', key: 'remark', span: 16 },
        { title: '附件', key: 'attachmentList', span: 16 },
        // {title: '资产二维码', key: 'QRCode', span: 24}
      ], // 基本信息字段
      spaceInfoKeys: [
        { title: '项目名称', key: 'projectName' },
        { title: '所在楼栋', key: 'buildName' },
        { title: '所在单元', key: 'unitName' },
        { title: '所在楼层', key: 'floor' },
        { title: '层高', key: 'groundHigh' },
        { title: '省市区', key: 'proCity' },
        { title: '地理位置', key: 'totalAddress', span: 24 },
      ], // 空间位置字段
      infoData: {}, // 信息数据
      details: {}, // 编辑基本信息数据
      modalObj: { title: '编辑资产信息', status: false, okText: '保存', cancelText: '取消', width: 550, loading: false },
      numList: [
        { title: '运营(㎡)', key: 'operationArea', value: 0, bgColor: '#4BD288', code: '1001', isAble: 'Y' },
        { title: '闲置(㎡)', key: 'idleArea', value: 0, bgColor: '#1890FF', code: '1002', isAble: 'Y' },
        { title: '自用(㎡)', key: 'selfUserArea', value: 0, bgColor: '#DD81E6', code: '1003', isAble: 'Y' },
        { title: '占用(㎡)', key: 'occupationArea', value: 0, bgColor: '#FD7474', code: '1004', isAble: 'Y' },
        { title: '其他(㎡)', key: 'otherArea', value: 0, bgColor: '#BBC8D6', code: '1005', isAble: 'Y' },
      ], // 概览数据,如是格式，title 标题，value 数值，color 背景色
    };
  },

  methods: {
    // 配置
    useForConfig() {
      this.$api.houseStatusConfig.querySettingByOrganId({ organId: this.organId }).then((res) => {
        if (res.data.code == 0) {
          let data = res.data.data;
          data.map((item) => {
            this.numList.map((e) => {
              if (item.code == e.code) {
                e.bgColor = item.color;
                e.isAble = item.isAble;
                e.title = item.alias || e.title;
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
    // 查询详情
    queryDetailInfo() {
      this.spinning = true;
      this.$api.assets
        .queryAssetViewBaseInfo({ assetHouseId: this.assetHouseId })
        .then((r) => {
          console.log(r);
          this.spinning = false;
          let res = r.data;
          if (res && String(res.code) === '0') {
            let temp = res.data;
            // temp.PCD = `${temp.province}${temp.city}${temp.region}`
            temp.assetType = '房屋';
            temp.houseType = '房屋';
            temp.rentArea = Number(temp.rentedArea) + Number(temp.unRentedArea);
            temp.attachmentList = temp.attachmentList.map((e) => {
              return {
                name: e.oldAttachmentName,
                url: e.attachmentPath,
              };
            });
            let { transferOperationTime, transferOperationArea } = temp;
            this.$emit('updateTransfer', { transferOperationTime, transferOperationArea });
            return (this.infoData = temp);
          }
          throw res.message || '查询接口出错';
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err || '查询接口出错');
        });
    },

    // 查询楼栋视图面积概览数据
    queryHouseAreaInfo() {
      const { assetHouseId, numList } = this;
      return this.$api.assets
        .queryAssetViewHouseArea({ assetHouseId })
        .then((r) => {
          let res = r.data;
          if (res && String(res.code) === '0') {
            // 查楼栋视图详情的面积数据
            return (this.numList = numList.map((m) => {
              const { percent, number } = res.data[m.key];
              return { ...m, value: `${number}（${percent}）` };
            }));
          }
          throw res.message || '查询视图面积详情出错';
        })
        .catch((err) => {
          this.$message.error(err || '查询视图面积详情出错');
        });
    },

    // 打开编辑Modal
    handleModalOpen(type) {
      if (type === 'location') {
        return false;
      }
      const {
        infoData: { assetName, assetCode, decorationSituation, assetHouseId, ownerUser, ownerOrgan, ownerOrganName },
      } = this;
      this.modalObj.status = true;
      this.details = { assetName, assetCode, decorationSituation, assetHouseId, ownerUser, ownerOrgan, ownerOrganName };
    },

    // Modal关闭
    handleModalCancel() {
      this.modalObj.status = false;
    },

    // Modal提交
    handleModalOk() {
      this.modalObj.loading = true;
      new Promise((resolve, reject) => {
        this.$refs['editAssetDetail'].handleSubmit(resolve, reject);
      })
        .then(() => {
          this.modalObj.loading = false;
          this.modalObj.status = false;
          // 更新页面
          this.queryDetailInfo();
          this.queryHouseAreaInfo();
        })
        .catch(() => {
          this.modalObj.loading = false;
        });
    },
  },

  created() {
    this.queryDetailInfo();
    this.queryHouseAreaInfo();
    this.useForConfig();
  },
};
</script>

<style lang="less" scoped></style>
