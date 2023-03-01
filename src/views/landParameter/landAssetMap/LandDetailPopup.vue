<template>
  <div class="land-detail-popup">
    <div class="title">
      <span>{{ assetName || '--' }}</span>
      <a-icon @click="doClosePopup" class="close-icon" type="close" />
    </div>
    <div class="content">
      <div class="base-info">
        <SimpleAssetLandInfo :popupDataSource="popupDataSource" :assetId="assetId" :assetNameShow="false" style="padding: 0" />
      </div>
      <SG-Title style="margin-top: 10px; margin-bottom: 20px" title="业务信息" />
      <div class="wrapper">
        <div v-if="attrData.length" class="attr-block">
          <div class="item" v-for="(item, index) in attrData" :key="item.attrCode">
            <span class="attr-name" :class="{ 'attr-name-top-border': index === 0 }">
              {{ item.attrName }}
            </span>
            <span class="attr-value" :class="{ 'attr-value-top-border': index === 0 }">
              {{ item.attrValue }}
            </span>
          </div>
        </div>
        <div v-else style="text-align: center">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script>
import SimpleAssetLandInfo from '@/views/mapDrawLand/components/SimpleAssetLandInfo';

export default {
  name: 'landDetailPopup',
  props: {
    mapInstance: {
      type: Object,
      required: true,
    },
    popupDataSource: {
      type: Array,
      required: true,
    },
    assetId: {
      type: [String, Number],
      required: true,
    },
  },
  components: {
    SimpleAssetLandInfo,
  },
  data() {
    return {
      assetName: '',
      baseInfoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: '项目名称/物业名称',
              key: 'projectName',
            },
            {
              title: '地块编号',
              key: 'assetCode',
            },
          ],
          [
            {
              title: '宗地号',
              key: 'theNo',
            },
            {
              title: '土地面积',
              key: 'landArea',
            },
          ],
          [
            {
              title: '土地性质',
              key: 'landProperties',
            },
            {
              title: '经营方式',
              key: 'modelOperName',
            },
          ],
          [
            {
              title: '使用期限',
              key: 'startAndEndTime',
              render(h, data, value) {
                return value;
              },
              colProps: {
                span: 24,
              },
            },
          ],
          [
            {
              title: '地理位置',
              key: 'position',
              colProps: {
                span: 24,
              },
            },
          ],
          [
            {
              title: '运营项目',
              key: 'communityName',
              colProps: {
                span: 24,
              },
            },
          ],
        ],
        colProps: { span: 12 },
      },
      attrData: [],
    };
  },
  methods: {
    doClosePopup() {
      this.mapInstance.closePopup();
    },
    init(data) {
      this.initBaseInfo(data);
      this.initAttrData(data);
      this.assetName = data.assetName;
    },
    initAttrData(allData) {
      const fieldNameArr = this.popupDataSource.map((ele) => ele.fieldName);

      this.attrData = allData.assetAttrDtos || [];

      // 过滤 已经在基础属性中的业务属性信息
      this.attrData = this.attrData.filter((ele) => {
        return !fieldNameArr.includes(ele.attrName);
      });
    },
    initBaseInfo(allData) {
      this.baseInfoOptions.data = {
        ...allData,
        startAndEndTime: allData.startDate && allData.endDate ? [allData.startDate, allData.endDate] : '',
      };
    },
  },
};
</script>

<style scoped lang="less">
.land-detail-popup {
  background: #ffffff;
  box-shadow: 0 10px 40px 0 rgba(73, 80, 94, 0.3);
  border-radius: 8px;
  max-height: 550px;
  position: relative;
  .title {
    height: 40px;
    width: 100%;
    line-height: 40px;
    background-color: #fff;
    position: absolute;
    padding-left: 20px;
    border-radius: 8px 8px 0 0;
    border-bottom: 1px solid #dce1e6;
    z-index: 4;
    .close-icon {
      position: absolute;
      right: 15px;
      top: 12px;
    }
  }
  .content {
    height: 520px;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 50px 20px 20px;
  }
}

.wrapper {
  padding: 0 14px;
}
.attr-block {
  border: 1px solid #dce1e6;
  border-radius: 4px;
  .item {
    height: 37px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    .attr-name {
      font-weight: bold;
      width: 125px;
      height: 37px;
      line-height: 27px;
      padding: 5px 14px;
      border-right: 1px solid #dce1e6;
      border-top: 1px solid #dce1e6;
    }
    .attr-value {
      flex: 1;
      height: 37px;
      line-height: 27px;
      padding: 5px 14px;
      border-top: 1px solid #dce1e6;

      font-size: 14px;
      color: #6d7585;
    }
    .attr-name-top-border,
    .attr-value-top-border {
      border-top: none;
    }
  }
}
</style>
