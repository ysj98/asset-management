<template>
  <div class="equipmentview-assetview-detail">
    <SG-Title title="基本信息" />
    <Information v-bind="basicInfoOptions" />
    <SG-Title title="空间位置" />
    <Information v-bind="spaceInfoOptions" />
    <SG-Title title="设备设施属性" />
    <Information v-bind="attrInfoOptions" />
    <SG-Title title="其他信息" />
    <a-tabs>
      <a-tab-pane v-for="(item, key) in otherTabOptions" :key="key" :tab="item.tab">
        <keep-alive>
          <component
            :is="item.component"
            :assetId="queryParams.assetId"
            :organId="queryParams.organId"
            :equipmentId="queryParams.equipmentId"
          ></component>
        </keep-alive>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import Information from "@/components/Information";
import TakeOverInformation from "@/views/equipmentview/assetview/components/TakeOverInformation";
import RelatedCosts from "@/views/equipmentview/assetview/components/RelatedCosts";
import Changelog from "@/views/equipmentview/assetview/components/Changelog";
import BookInformation from "@/views/equipmentview/assetview/components/BookInformation";
import AssetDisposal from "@/views/equipmentview/assetview/components/AssetDisposal";
import ArchiveFile from "@/views/equipmentview/assetview/components/ArchiveFile";
import AncillaryPackage from "@/views/equipmentview/assetview/components/AncillaryPackage";
import DevOps from "@/views/equipmentview/assetview/components/DevOps.vue";

export default {
  name: "assetViewDetail",
  components: {
    Information,
  },
  data() {
    return {
      queryParams: {
        assetId: "",
        organId: "",
        equipmentId: "",
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
      otherTabOptions: {
        one: {
          tab: "接管信息",
          key: "",
          component: TakeOverInformation,
          auth: "",
        },
        two: {
          tab: "账面信息",
          key: "",
          component: BookInformation,
        },
        three: {
          tab: "附属&配套",
          key: "",
          component: AncillaryPackage,
        },
        four: {
          tab: "资产处置",
          key: "",
          component: AssetDisposal,
        },
        five: {
          tab: "变动记录",
          key: "",
          component: Changelog,
        },
        six: {
          tab: "相关费用",
          key: "",
          component: RelatedCosts,
        },
        seven: {
          tab: "档案文件",
          key: "",
          component: ArchiveFile,
        },
        eight: {
          tab: "运维信息",
          key: "",
          component: DevOps,
        },
      },
    };
  },
  methods: {
    queryDetail() {
      const { assetEquipmentId } = this.queryParams;
      const req = {
        assetEquipmentId,
      };
      this.$api.equipmentview.getDetail(req).then(({ data: { code, message, data } }) => {
        if (code === "0") {
          console.log({ data });
          this.attrInfoOptions.BasicInfoList = (data.attrList || []).map((ele) => {
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
    this.queryDetail();
  },
  created() {
    const { assetId, organId, equipmentId } = this.$route.query;
    this.queryParams.assetId = assetId;
    this.queryParams.organId = organId;
    this.queryParams.equipmentId = equipmentId;
  },
};
</script>

<style scoped>
.equipmentview-assetview-detail {
  padding: 20px 60px;
}
</style>
