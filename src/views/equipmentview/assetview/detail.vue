<template>
  <div class="equipmentview-assetview-detail">
    <SG-Title title="基本信息" />
    <Information v-bind="basicInfoOptions" />
    <SG-Title title="空间位置" />
    <Information v-bind="spaceInfoOptions" />
    <SG-Title title="设备设施属性" />
    <Information v-bind="attrInfoOptions" />
    <SG-Title title="其他信息" />
  </div>
</template>

<script>
import Information from "@/components/Information";
export default {
  name: "assetViewDetail",
  components: {
    Information,
  },
  data() {
    return {
      queryParams: {
        assetEquipmentId: "",
      },
      basicInfoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: "资产名称",
              key: "assetName",
            },
            {
              title: "资产编码",
              key: "assetCode",
            },
            {
              // todo:枚举转换
              title: "资产类型",
              key: "assetType",
            },
          ],
          [
            {
              title: "资产分类",
              key: "equipmentTypeName",
            },
            {
              title: "规格型号",
              key: "equipmentModel",
            },
            {
              title: "生产厂家",
              key: "factory",
            },
          ],
          [
            {
              title: "出厂日期",
              key: "dateOfProduction",
            },
            {
              title: "报废日期",
              key: "scrapDate",
            },
            {
              // todo:枚举转换
              title: "使用方向",
              key: "useType",
            },
          ],
          [
            {
              title: "品牌",
              key: "brand",
            },
            {
              title: "安装日期",
              key: "installDate",
            },
            {
              title: "资产状态",
              key: "statusName",
            },
          ],
        ],
        colProps: { span: 8 },
      },
      spaceInfoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: "运营项目",
              key: "communityName",
            },
            {
              title: "所在位置",
              key: "address",
            },
            {
              title: "备注",
              key: "remarks",
            },
          ],
        ],
      },
      attrInfoOptions: {
        BasicInfoList: [],
        colProps: { span: 8 },
      },
    };
  },
  methods: {
    queryDetail() {
      const { assetEquipmentId } = this.queryParams;
      const req = {
        assetEquipmentId,
      };
      this.$api.equipmentview
        .getDetail(req)
        .then(({ data: { code, message, data } }) => {
          if (code === "0") {
            console.log({ data });
            this.attrInfoOptions = (data.attrData || []).map((ele) => {
              return {
                title: ele.attrName,
                value: ele.attrValue,
              };
            });
            this.basicInfoOptions.data = { ...data };
            this.spaceInfoOptions.data = { ...data };
          } else {
            this.$message.error(message);
          }
        });
    },
  },
  mounted() {
    const { assetEquipmentId } = this.$route.query;
    this.queryParams.assetEquipmentId = assetEquipmentId;
    this.queryDetail();
  },
};
</script>

<style scoped>
.equipmentview-assetview-detail {
  padding: 20px 60px;
}
</style>
