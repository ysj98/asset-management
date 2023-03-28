<template>
  <div class="operation-detail">
    <SG-Title title="基本信息" />
    <div style="padding-left: 40px">
      <Information :row-props="{ gutter: 5 }" :col-props="{ span: 8 }" :basic-info-list="list" />
      <div style="margin-top: 10px; display: flex; align-items: baseline">
        <span style="margin-right: 10px">附件:</span>
        <UploadFile
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
    <a-table v-bind="tableOptions">
      <template #community="text, record">
        <a-select
          style="width: 200px"
          placeholder="请选择项目"
          showSearch
          optionFilterProp="children"
          notFoundContent="没有查询到数据"
          :options="communityIdOpt"
          :allowClear="false"
          :disabled="fromType !== 'approve'"
          v-model="record.communityId"
        />
      </template>
    </a-table>
    <SG-FooterPagination
      v-if="fromType !== 'approve'"
      v-model="pageForm.pageNum"
      :pageLength="pageForm.pageSize"
      :totalCount="totalCount"
      :noPageTools="true"
      @change="handleChange"
    />
    <!--审批轨迹-->
    <div>
      <SG-Title title="审批轨迹" />
      <step v-stepstyleplus v-if="stepList.length" :stepList="stepList" style="margin-left: 45px" @getFile="getFile" />
      <div v-else style="text-align: center; margin: 25px 0">暂无数据</div>
    </div>
    <div v-if="isApprove">
      <SG-Title title="审核意见" />
      <a-textarea :rows="4" style="resize: none; margin-left: 45px" placeholder="请输入审核意见" v-model="advice" />
    </div>
    <div style="height: 70px"></div>
    <div v-if="isApprove">
      <!--底部审批操作按钮组-->
      <form-footer location="fixed">
        <SG-Button type="primary" @click="handleBtn(1)">审批通过</SG-Button>
        <SG-Button type="dangerous" @click="handleBtn(0)" style="margin-right: 8px">驳回</SG-Button>
      </form-footer>
    </div>
  </div>
</template>

<script>
import FormFooter from '@/components/FormFooter';
import Information from '@/components/Information';
import Step from '@/components/step';

import { baseColumns, flatTableDataSource, generateColumnsByParamList, getBaseInfo, getOperationDetailListPage } from '@/views/assetOperating/share';
import moment from 'moment';
import uploadAndDownLoadFIle from '@/mixins/uploadAndDownLoadFIle';
import { handleDownloadFile } from '@/utils/utils.js';
export default {
  /*
   * 详情页面
   * */
  name: 'operationDetail',
  components: {
    Information,
    FormFooter,
    Step,
  },
  mixins: [uploadAndDownLoadFIle],
  data() {
    return {
      communityIdOpt: [],
      advice: '',
      stepList: [],
      isApprove: false,
      approvalStatus: '',
      fromType: '',
      totalCount: 0,
      pageForm: {
        pageNum: 1,
        pageSize: 10,
      },
      assetOperationRegisterId: '',
      attachment: [],
      list: [
        {
          keyName: 'assetOperationRegisterId',
          title: '转运营单编号',
          value: '',
        },
        {
          keyName: 'title',
          title: '转运营单名称',
          value: '',
        },
        {
          keyName: 'approvalStatusName',
          title: '当前状态',
          value: '',
        },
        {
          keyName: 'organName',
          title: '所属机构',
          value: '',
        },
        {
          keyName: 'projectName',
          title: '资产项目',
          value: '',
        },
        {
          keyName: 'assetTypeName',
          title: '资产类型',
          value: '',
        },
        {
          keyName: 'createTime',
          title: '创建日期',
          value: '',
          render(h, data, resValue) {
            return moment(resValue).format('YYYY-MM-DD HH:mm:ss');
          },
        },
        {
          keyName: 'createByName',
          title: '创建人',
          value: '',
        },
        {
          keyName: 'remark',
          title: '备注',
          value: '',
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
    queryCommunityListByOrganId({ organId }) {
      return new Promise((resolve, reject) => {
        let data = {
          organId: organId,
        };
        this.$api.basics.queryCommunityListByOrganId(data).then(
          (res) => {
            if (res.data.code === '0') {
              let result = res.data.data || [];
              let resultArr = result.map((item) => {
                return {
                  label: item.name,
                  value: item.communityId,
                  title: item.name,
                  ...item,
                };
              });
              resolve(resultArr);
            }
            reject(res.data.message);
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    },
    // 按钮操作
    handleBtn(operResult) {
      if (operResult === 0) {
        if (!this.advice) {
          this.$message.error('驳回必填审核意见');
          return null;
        }
      }
      let req = {
        apprId: this.apprId,
        operResult,
        operOpinion: this.advice,
      };
      if (operResult === 1) {
        const data = this.tableOptions.dataSource.map((ele) => {
          return { assetId: ele.assetId, communityId: ele.communityId };
        });
        const error = this.handleValidate(data);
        if (error) {
          this.$message.error(error);
          return null;
        } else {
          req.boData = JSON.stringify(data);
        }
      }
      this.$api.approve
        .uniformSubmit(req)
        .then(({ data: res }) => {
          if (res && String(res.code) === '0') {
            this.$message.success(operResult ? '审批成功' : '驳回成功');
            // 跳回列表路由
            this.$router.go(-1);
          } else {
            throw res.message;
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error(err || `${operResult ? '审批失败' : '驳回失败'}`);
        });
    },
    // 验证是否选择运营项目
    handleValidate(data) {
      if (data.some((ele) => !ele.communityId)) {
        return '请选择运营项目';
      }
    },
    async initCurrentEnvironmentQuery() {
      // 不嵌套在 bpm 中，不用做特殊处理
      // const {
      //   query: { instId },
      // } = this.$route;
      let obj = this.$route.query;
      // if (instId) {
      //   this.$route.meta.noShowProBreadNav = true;
      //   const req = {
      //     serviceOrderId: instId,
      //   };
      //   const {
      //     data: { code, message, data },
      //   } = await this.$api.approve.getApprByServiceOrderId(req);
      //   if (code === "0") {
      //     console.log("data", data);
      //     obj = data;
      //     Object.assign(obj, data);
      //     obj.fromType = "approve";
      //     obj.assetOperationRegisterId = data.busId;
      //     obj.approvalStatus = String(data.approvalStatus;)
      //   } else {
      //     this.$message.error(message);
      //   }
      // } else {
      //   this.$route.meta.noShowProBreadNav = false;
      // }
      return obj;
    },
    initApproveData({ organId, assetOperationRegisterId }) {
      return new Promise((resolve, reject) => {
        const req = { busType: 1004, busId: assetOperationRegisterId, organId };
        console.log('relatedOrganId', organId);
        this.$api.approve.queryApprovalRecordByBus(req).then(
          ({ data: { code, message, data } }) => {
            if (code === '0') {
              if (message === '操作成功') {
                this.apprId = data.amsApprovalResDto.apprId;
                this.stepList = (data.approvalRecordResDtos || []).map((ele) => {
                  //  console.log(JSON.parse(ele.files))
                  return {
                    date: ele.operDateStr ? moment(ele.operDateStr) : moment(),
                    title: ele.operOpinion,
                    desc: ele.taskName, // 审批节点
                    isDone: false,
                    operation:
                      ele.files && ele.files.length > 0
                        ? JSON.parse(ele.files).map((ele) => {
                            return {
                              buttonName: ele.name,
                              funcName: 'getFile',
                              fileID: ele.id,
                              fileName: ele.name,
                            };
                          })
                        : [],
                  };
                });
                this.stepList.length && (this.stepList[0].isDone = true);
                console.log('first', this.stepList);
                if (this.fromType === 'approve') {
                  this.isApprove = data.amsApprovalResDto.isAbRole === 1;
                }
              }
              resolve();
            } else {
              this.$message.error(message);
              reject();
            }
          },
          (reason) => {
            reject(reason);
          }
        );
      });
    },
    //审批流程获取文件
    getFile(item) {
      console.log(item);
      this.$api.approve.getFile({ fileId: item.fileID }).then((res) => {
        let blob = new Blob([res.data]);
        console.log(blob);
        const fileName = decodeURIComponent(res.headers['content-disposition'].split(';')[1].split('filename=')[1]);
        let a = document.createElement('a');
        a.href = URL.createObjectURL(blob);
        a.download = fileName;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        a.remove();
      });
    },
    async init() {
      const obj = await this.initCurrentEnvironmentQuery();
      const { organId, assetOperationRegisterId } = obj;
      this.initRouteQuery(obj);
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
      const a1 = this.initApproveData({ organId: this.$route.query.relatedOrganId, assetOperationRegisterId });
      const a2 = this.getOperationDetailListPage();
      console.log('one');
      await a1;
      await a2;
      // 是审批且是 AB角，或者状态是已审批
      if ((this.fromType === 'approve' && this.isApprove) || this.approvalStatus === '1') {
        this.queryCommunityListByOrganId({ organId }).then(
          (data) => {
            this.communityIdOpt = data;
          },
          (reason) => {
            console.error(reason);
          }
        );
      }
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
        let pageReq = {
          pageSize: this.pageForm.pageSize,
          pageNum: this.pageForm.pageNum,
        };
        if (this.fromType === 'approve') {
          pageReq = {
            pageSize: 9999,
            pageNum: 1,
          };
        }
        getOperationDetailListPage({
          assetOperationRegisterId: this.assetOperationRegisterId,
          ...pageReq,
        }).then(
          (data) => {
            const resultData = (data.data || []).map((ele) => ({
              ...ele,
              communityId: String(ele.communityId || ''),
            }));
            this.tableOptions.dataSource = flatTableDataSource({
              dataSource: resultData || [],
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
      console.log('two');
      const item = this.tableOptions.dataSource[0];
      if (!item) {
        return null;
      }
      const res = generateColumnsByParamList({ paramList: item.paramList });
      this.tableOptions.columns = [...baseColumns, ...res];
      if ((this.fromType === 'approve' && this.isApprove) || this.approvalStatus === '1') {
        this.tableOptions.columns.push({
          title: '运营项目',
          width: 220,
          scopedSlots: {
            customRender: 'community',
          },
        });
      }
    },
    initRouteQuery(data) {
      const { assetOperationRegisterId, fromType, approvalStatus } = data;
      this.assetOperationRegisterId = assetOperationRegisterId;
      this.fromType = fromType;
      this.approvalStatus = String(approvalStatus);
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
          attachmentId: ele.attachmentId,
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
