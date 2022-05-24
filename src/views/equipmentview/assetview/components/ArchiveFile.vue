<template>
  <div>
    <a-table v-bind="tableOptions">
      <template #operation="text, record">
        <a href="javascript:void(0);" @click="checkDetail(record)">详情</a>
      </template>
    </a-table>
    <SG-FooterPagination
      v-if="tableOptions.dataSource.length"
      v-bind="pageObj"
      @change="changePage"
    />
  </div>
</template>

<script>
import { win } from "@/utils/utils";

export default {
  // 档案文件
  name: "ArchiveFile",
  props: {
    assetId: {
      type: [String, Number],
      required: true,
    },
  },
  data() {
    return {
      pageObj: {
        pageLength: 10,
        pageNo: 1,
        totalCount: 0,
        noPageTools: false,
      },
      tableOptions: {
        rowKey: "archiveId",
        scroll: { x: "100%", y: 600 },
        dataSource: [],
        columns: [
          { title: "文档编号", dataIndex: "archiveId" },
          { title: "文档名称", dataIndex: "archiveName" },
          { title: "类型", dataIndex: "typeName" },
          { title: "密级", dataIndex: "secretLevelName" },
          { title: "纸质档案(实物)", dataIndex: "hasPaper" },
          { title: "电子档", dataIndex: "hasElectronic" },
          { title: "建档日期", dataIndex: "filingDate" },
          { title: "建档人", dataIndex: "createByName" },
          { title: "存放位置", dataIndex: "positionName" },
          { title: "备注", dataIndex: "description" },
          {
            title: "操作",
            key: "operation",
            scopedSlots: { customRender: "operation" },
          },
        ],
        pagination: false,
      },
    };
  },
  methods: {
    checkDetail({ archiveId }) {
      win.openPortalMenu(
        "/archives-management/#/consultantFile/details?type=detail&archiveId=" +
          archiveId,
        "档案文件详情"
      );
    },
    changePage({ pageNo, pageLength }) {
      this.pageObj.pageNo = pageNo;
      this.pageObj.pageLength = pageLength;
      this.queryAssetViewArchiveDetail();
    },
    queryAssetViewArchiveDetail() {
      const { pageNo, pageLength } = this.pageObj;
      const req = {
        assetId: this.assetId,
        pageNum: pageNo,
        pageSize: pageLength,
      };
      this.$api.assets
        .queryAssetViewArchiveDetail(req)
        .then(({ data: { code, message, data } }) => {
          if (code === "0") {
            const resData = data || {};
            console.log({ resData });
            this.pageObj.totalCount = resData.total || 0;
            this.tableOptions.dataSource = resData.list || [];
          } else {
            this.$message.error(message);
          }
        })
        .catch((reason) => {
          console.error(reason);
        });
    },
  },
  mounted() {
    this.queryAssetViewArchiveDetail();
  },
};
</script>

<style scoped></style>
