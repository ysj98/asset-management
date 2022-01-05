<template>
  <div class="operation-detail">
    <SG-Title title="基本信息" />
    <div style="padding-left: 40px">
      <Information
        :row-props="{ gutter: 5 }"
        :col-props="{ span: 8 }"
        :basic-info-list="list"
      />
      <div style="margin-top: 10px; display: flex; align-items: baseline">
        <span style="margin-right: 10px">附件:</span>
        <SG-UploadFile
          v-if="attachment.length"
          style="width: 600px"
          v-model="attachment"
          :show="true"
          :max="5"
          :maxSize="5120"
          :customDownload="
            (value) => {
              return customDownload(value, $api.ownership.downLoadAnnex);
            }
          "
        />
        <span v-else>--</span>
      </div>
    </div>
    <SG-Title title="资产列表" />
    <a-table v-bind="tableOptions"></a-table>
    <SG-FooterPagination
      v-model="pageForm.pageNum"
      :pageLength="pageForm.pageSize"
      :totalCount="totalCount"
      :noPageTools="true"
      @change="handleChange"
    />
  </div>
</template>

<script>
import Information from "@/components/Information";
import {
  getBaseInfo,
  baseColumns,
  generateColumnsByParamList,
  getOperationDetailListPage,
  flatTableDataSource,
} from "@/views/assetOperating/share";
import moment from "moment";
export default {
  /*
   * 详情页面
   * */
  name: "operationDetail",
  components: {
    Information,
  },
  data() {
    return {
      totalCount: 0,
      pageForm: {
        pageNum: 1,
        pageSize: 10,
      },
      assetOperationRegisterId: "",
      attachment: [],
      list: [
        {
          keyName: "assetOperationRegisterId",
          title: "转运营单编号",
          value: "",
        },
        {
          keyName: "title",
          title: "转运营单名称",
          value: "",
        },
        {
          keyName: "approvalStatusName",
          title: "当前状态",
          value: "",
        },
        {
          keyName: "organName",
          title: "所属机构",
          value: "",
        },
        {
          keyName: "projectName",
          title: "资产项目",
          value: "",
        },
        {
          keyName: "assetTypeName",
          title: "资产类型",
          value: "",
        },
        {
          keyName: "createTime",
          title: "创建日期",
          value: "",
          render(h, data, resValue) {
            return moment(resValue).format("YYYY-MM-DD hh:mm:ss");
          },
        },
        {
          keyName: "createByName",
          title: "创建人",
          value: "",
        },
        {
          keyName: "remark",
          title: "备注",
          value: "",
        },
      ],
      tableOptions: {
        rowKey: function (record) {
          return record.assetId;
        },
        scroll: { x: 600, y: 500 },
        dataSource: [],
        columns: [],
        pagination: false,
      },
    };
  },
  methods: {
    async init() {
      this.initRouteQuery();
      getBaseInfo({
        assetOperationRegisterId: this.assetOperationRegisterId,
      }).then(
        (value) => {
          this.initList(value);
          this.initAttachment(value.attachment || []);
        },
        (reason) => {
          console.error(reason);
        }
      );
      await this.getOperationDetailListPage();
      this.initTableColumns();
    },
    handleChange({ pageNo, pageLength }) {
      this.pageForm = {
        pageSize: pageLength,
        pageNum: pageNo,
      };
      this.getOperationDetailListPage();
    },
    getOperationDetailListPage() {
      return new Promise((resolve, reject) => {
        getOperationDetailListPage({
          assetOperationRegisterId: this.assetOperationRegisterId,
          pageSize: this.pageForm.pageSize,
          pageNum: this.pageForm.pageNum,
        }).then(
          (data) => {
            console.log("data", data);
            this.tableOptions.dataSource = flatTableDataSource({
              dataSource: data ? data.data : [],
            });
            this.totalCount = data ? data.count : 0;
            resolve(data);
          },
          (reason) => {
            console.error(reason);
            reject(reason);
          }
        );
      });
    },
    initTableColumns() {
      const item = this.tableOptions.dataSource[0];
      if (!item) {
        return null;
      }
      const res = generateColumnsByParamList({ paramList: item.paramList });
      this.tableOptions.columns = [...baseColumns, ...res];
    },
    initRouteQuery() {
      const { assetOperationRegisterId } = this.$route.query;
      this.assetOperationRegisterId = assetOperationRegisterId;
    },
    initList(data) {
      this.list.forEach((ele) => {
        ele.value = data[ele.keyName];
      });
    },
    initAttachment(attachment) {
      this.attachment = attachment.map((ele) => {
        return {
          url: ele.attachmentPath,
          name: ele.oldAttachmentName,
        };
      });
    },
  },
  mounted() {
    this.init();
  },
};
</script>

<style scoped lang="less">
.operation-detail {
  padding: 10px 20px;
}
::v-deep .sg-uploadFile > .preview {
  overflow: auto;
}
</style>
