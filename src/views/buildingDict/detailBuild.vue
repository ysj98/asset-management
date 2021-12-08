<!--
 * @Date: 2019-11-08 09:52:48
 * @Author: chen han
 * @Description: 房间详情
 -->
<template>
  <div class="detailHouse-page">
    <Information
      :row-props="{ gutter: 5 }"
      :col-props="{ span: 8 }"
      :basic-info-list="list"
    />
  </div>
</template>
<script>
import Information from "components/Information";
export default {
  name: "detailBuild",
  components: {
    Information
  },
  data() {
    return {
      listData: {},
      list: [
        {
          keyName: "assetId",
          title: "所属机构",
          value: ""
        },
        {
          keyName: "assetName",
          title: "楼栋名称",
          value: ""
        },
        {
          keyName: "assetCode",
          title: "运营项目",
          value: ""
        },
        {
          keyName: "assetTypeName",
          title: "楼栋别名",
          value: ""
        },
        {
          keyName: "objectTypeName",
          title: "楼栋编码",
          value: ""
        },
        {
          keyName: "area",
          title: "房屋数量",
          value: ""
        },
        {
          keyName: "buildName",
          title: "承建商",
          value: ""
        },
        {
          keyName: "landName",
          title: "开发商",
          value: ""
        },
        {
          keyName: "carParkName",
          title: "楼高(m)",
          value: ""
        },
        {
          keyName: "equipmentName",
          title: "建筑面积(㎡)",
          value: ""
        },
        {
          keyName: "houseName",
          title: "套内面积(㎡)",
          value: ""
        },
        {
          keyName: "landCode",
          title: "楼栋类型",
          value: ""
        },
        {
          keyName: "address",
          title: "楼栋用途",
          value: ""
        },
        {
          keyName: "kindOfRightName",
          title: "地上层高(m)",
          value: ""
        },
        {
          keyName: "ownershipStatusName",
          title: "地下层高(m)",
          value: ""
        },
        {
          keyName: "warrantNbr",
          title: "建筑结构",
          value: ""
        },
        {
          keyName: "decorationSituation",
          title: "总楼层",
          value: ""
        },
        {
          keyName: "creditorAmount",
          title: "地上层数",
          value: ""
        },
        {
          keyName: "creditorAmount",
          title: "地下层数",
          value: ""
        },
        {
          keyName: "debtAmount",
          title: "地理位置",
          value: ""
        },
        {
          keyName: "debtAmount",
          title: "经纬度",
          value: ""
        },
        {
          keyName: "debtAmount",
          title: "楼栋排序",
          value: ""
        },
        {
          keyName: "debtAmount",
          title: "电梯数量",
          value: ""
        },
        {
          keyName: "debtAmount",
          title: "宗地号",
          value: ""
        },
        {
          keyName: "debtAmount",
          title: "建筑年代",
          value: ""
        },
        {
          keyName: "debtAmount",
          title: "竣工日期",
          value: ""
        },
        {
          keyName: "debtAmount",
          title: "物业管理单位",
          value: ""
        },
        {
          keyName: "debtAmount",
          title: "物业缴费期限",
          value: ""
        },
        {
          keyName: "debtAmount",
          title: "物业费",
          value: ""
        },
        {
          keyName: "debtAmount",
          title: "描述",
          value: ""
        },
        {
          keyName: "debtAmount",
          title: "地下层数",
          value: ""
        }
      ]
    };
  },
  mounted() {
    this.queryProvinceList()
    this.queryNodesByRootCode('30')
    this.queryNodesByRootCode('60')
    // this.queryDictDataList()
    this.platformDictFn()
    this.init()
    this.handleBtn()
    this.init();
  },
  methods: {
    init() {
      this.list.forEach(ele => {
        ele.value = this.listData[ele.keyName];
      });
    }
  }
};
</script>
<style lang="less" scoped>
.detailHouse-page {
  color: #49505e;
  padding: 42px 10px 0 94px;
  .detail-page-item {
    margin-bottom: 53px;
  }
  .detail-item-content {
    margin-left: 44px;
  }
  .detail-item {
    display: flex;
    margin-bottom: 32px;
    .item-label {
      flex: 0 0 auto;
      margin-right: 12px;
    }
    .item-content {
      flex: 1;
    }
  }
}
</style>
