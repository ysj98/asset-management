<!--资产入库-入口列表-详情页-->
<template>
  <div class="detail_page" ref="detail">
    <a-spin :spinning="spinning">
      <!--基本信息-->
      <SG-Title title="基本信息" />
      <div style="margin-left: 45px">
        <a-row>
          <a-col
            :span="span || 8"
            :key="key"
            v-for="{ title, key, span } in baseInfoKeys"
            :title="key === 'assetRegisterName' ? infoData[key] : ''"
            style="margin: 12px 0; white-space: nowrap; overflow: hidden"
          >
            <span style="color: #282d5b">{{ title }}:</span>
            <span style="margin-left: 9px; color: #49505e">{{ infoData[key] || '--' }}</span>
          </a-col>
        </a-row>
        <div style="margin-top: 8px; display: flex">
          <span style="color: #282d5b; float: left; padding-right: 10px; flex-basis: 40px; flex-shrink: 0">图片:</span>
          <div style="width: 100%" v-if="imageAttachment.length">
            <UploadFile show v-model="oldImgAttachment" />
            <UploadFile
              v-model="newImgAttachment"
              :baseImgURL="configBase.hostImg1"
              :customDownload="
                (value) => {
                  return customDownload(value, $api.ownership.downLoadAnnex);
                }
              "
              show
            />
          </div>
          <span v-else style="margin-left: 9px; color: #49505e">--</span>
        </div>
        <div style="margin-top: 8px; display: flex">
          <span style="color: #282d5b; float: left; padding-right: 10px; flex-basis: 40px">附件:</span>
          <div v-if="otherAttachment.length">
            <UploadFile show v-model="oldOtherAttachment" type="file" />
            <UploadFile
              v-model="newOtherAttachment"
              :baseImgURL="configBase.hostImg1"
              :customDownload="
                (value) => {
                  return customDownload(value, $api.ownership.downLoadAnnex);
                }
              "
              type="file"
              show
            />
          </div>
          <span v-else style="margin-left: 9px; color: #49505e">--</span>
        </div>
      </div>
      <!--资产明细-->
      <SG-Title title="资产明细" />
      <div style="margin-left: 45px">
        <a-table v-bind="tableObj" class="custom-table td-pd10 table-border" />
        <SG-FooterPagination
          class="footer-pagination"
          v-if="tableObj.dataSource.length"
          v-bind="paginationObj"
          style="margin-top: 15px"
          @change="({ pageNo, pageLength }) => queryAssetByRegistId({ pageNo, pageLength })"
        />
      </div>
      <!--审批轨迹-->
      <div v-if="!isOld">
        <SG-Title title="审批轨迹" />
        <Step v-stepstyleplus v-if="stepList.length" :stepList="stepList" style="margin-left: 45px" />
        <div v-else style="text-align: center; margin: 25px 0">暂无数据</div>
      </div>
      <div class="footer-advice" v-if="isApprove && !isOld">
        <SG-Title title="审核意见" />
        <a-textarea :rows="4" style="resize: none; margin-left: 45px" placeholder="请输入审核意见" v-model="advice" />
      </div>
      <div class="empty"></div>
      <div class="footer-action" v-if="isApprove">
        <!--底部审批操作按钮组-->
        <form-footer location="fixed">
          <SG-Button type="primary" @click="handleBtn(1)" :loading="submitBtnLoading">审批通过</SG-Button>
          <SG-Button type="dangerous" @click="handleBtn(0)" :loading="submitBtnLoading" style="margin-right: 8px">驳回</SG-Button>
        </form-footer>
      </div>
    </a-spin>
    <!-- v2.2.2版本不上 入库打印功能   -->
    <a-button @click="printFn" type="primary" class="print">打印</a-button>
  </div>
</template>

<script>
import moment from 'moment';
import FormFooter from '@/components/FormFooter';
import { generateTableAreaByAssetTypeString } from 'utils/utils';
import uploadAndDownLoadFIle from '@/mixins/uploadAndDownLoadFIle';
import configBase from '@/config/config.base';
import Step from '@/components/step';
export default {
  name: 'DetailPage',
  components: { FormFooter, Step },
  mixins: [uploadAndDownLoadFIle],
  data() {
    return {
      isOld: true,
      apprId: '',
      spinning: false,
      storeId: '', // 入库单Id
      configBase,
      baseInfoKeys: [
        { title: '入库单名称', key: 'storeName' },
        { title: '入库单编号', key: 'storeCode' },
        { title: '状态', key: 'statusName' },
        { title: '所属机构', key: 'organName' },
        { title: '资产项目', key: 'projectName' },
        { title: '资产类型', key: 'assetTypeName' },
        { title: '关联资产登记单', key: 'assetRegisterName' },
        { title: '创建人', key: 'createUserName' },
        { title: '创建日期', key: 'createDate' },
        { title: '备注', key: 'remark', span: 24 },
      ], // 基本信息字段
      advice: '', // 审核意见
      otherAttachment: [], // 附件
      imageAttachment: [],
      oldOtherAttachment: [],
      newOtherAttachment: [],
      oldImgAttachment: [],
      newImgAttachment: [],
      infoData: {}, // 基本信息字段值
      submitBtnLoading: false, // 按钮loading
      isApprove: false, // 当前页面是否为审批操作
      stepList: [
        // { date: moment(), title: '修改', desc: '待修改', isDone: true, operation: [] }
      ], // 审批轨迹
      tableObj: {
        dataSource: [],
        loading: false,
        pagination: false,
        columns: [
          { title: '登记单编号', dataIndex: 'registerOrderId', scopedSlots: { customRender: 'registerOrderId' }, width: 150 },
          { title: '资产名称', dataIndex: 'assetName', width: 300 },
          { title: '资产编码', dataIndex: 'assetCode', width: 300 },
          { title: '资产类型', dataIndex: 'assetTypeName', width: 150 },
          { title: '资产分类', dataIndex: 'objectTypeName', width: 150 },
          { title: '权属单位', dataIndex: 'organName', width: 250 },
          { title: '资产项目名称', dataIndex: 'projectName', width: 250 },
          {
            title: '资产面积(㎡)',
            key: 'area',
            customRender(record) {
              return generateTableAreaByAssetTypeString({ record, assetTypeName: record.assetTypeName, keyStr: 'area' });
            },
            width: 150,
          },
          { title: '资产位置', dataIndex: 'pasitionString', width: 300 },
          { title: '创建日期', dataIndex: 'createTime', width: 200 },
          { title: '创建人', dataIndex: 'createByName', width: 150 },
          { title: '核实时间', dataIndex: 'verifierTime', width: 200 },
          { title: '核实人', dataIndex: 'verifierByName', width: 150 },
        ],
      },
      paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 },
    };
  },

  created() {
    this.init();
  },
  methods: {
    printFn() {
      if (this.$route.path === '/assetIn/printDetail') {
        window.print();
      } else {
        const query = this.$route.query;
        const res = new URLSearchParams();
        Object.keys(query).forEach((ele) => {
          res.append(ele, query[ele]);
        });
        res.append('pageNo', this.paginationObj.pageNo);
        res.append('pageLength', this.paginationObj.pageLength);
        const resStr = res.toString();
        window.open(`#/assetIn/printDetail?${resStr}`);
      }
    },
    async init() {
      console.log('this.$route', this.$route);
      const {
        query: { instId },
        path,
      } = this.$route;
      let obj = this.$route.query;
      if (instId) {
        // 嵌套在 bpm 中时，关闭 面包屑
        this.$route.meta.noShowProBreadNav = true;
        const req = {
          serviceOrderId: instId,
        };
        const {
          data: { code, message, data },
        } = await this.$api.approve.getApprByServiceOrderId(req);
        if (code === '0') {
          console.log('data', data);
          // 合并数据 query 和 接口 data
          Object.assign(obj, data);
          // 返回的数据 busId 代表 入库单id
          obj.id = data.busId;
          obj.relatedOrganId = obj.organId;
        } else {
          this.$message.error(message);
        }
      } else {
        this.$route.meta.noShowProBreadNav = false;
      }
      const { id, relatedOrganId } = obj;
      this.storeId = id;
      if (id) {
        this.queryDetail(id);
        if (relatedOrganId) {
          // 资产入库 1001 硬编码
          // 详情页面也需要展示审批轨迹
          const req = { busType: 1001, busId: id, organId: relatedOrganId };
          this.$api.approve.queryApprovalRecordByBus(req).then(({ data: { code, message, data } }) => {
            if (code === '0') {
              // 旧数据不存在审批单，但是 code 为“0”
              if (message === '审批单不存在') {
                if (path === '/assetIn/approve') {
                  this.isApprove = true;
                }
                this.isOld = true;
              } else {
                this.isOld = false;
                this.apprId = data.amsApprovalResDto.apprId;
                this.stepList = (data.approvalRecordResDtos || []).map((ele) => {
                  return {
                    date: ele.operDateStr ? moment(ele.operDateStr) : moment(),
                    title: ele.operOpinion,
                    desc: ele.taskName, // 审批节点
                    isDone: false,
                    operation: [],
                  };
                });
                this.stepList.length && (this.stepList[0].isDone = true);
                if (path === '/assetIn/approve') {
                  this.isApprove = data.amsApprovalResDto.isAbRole === 1;
                }
              }
            } else {
              this.$message.error(message);
            }
          });
        }
      }
    },
    // 根据资产登记单查询资产明细
    queryAssetByRegistId({ pageNo = 1, pageLength = 10, assetRegisterId = this.assetRegisterId }) {
      if (!assetRegisterId) {
        return false;
      }
      this.tableObj.loading = true;
      this.$api.assets
        .getRegisterOrderDetailsPageByIdList({
          registerOrderIdList: assetRegisterId.split(','),
          pageNum: pageNo,
          pageSize: pageLength,
        })
        .then((r) => {
          let res = r.data;
          if (res && String(res.code) === '0') {
            const { count, data } = res.data;
            this.tableObj.dataSource = (data || []).map((m, key) => ({ ...m, key }));
            return Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo,
              pageLength,
            });
          }
          throw res.message || '查询资产明细列表出错';
        })
        .catch((err) => {
          this.$message.error(err || '查询资产明细列表出错');
        })
        .finally(() => (this.tableObj.loading = false));
    },

    // 查询详情
    queryDetail(storeId) {
      this.spinning = true;
      this.$api.assets
        .queryAssetStoreDetail({ storeId })
        .then(({ data: res }) => {
          this.spinning = false;
          if (res && String(res.code) === '0') {
            let nameList = ['草稿', '已审批', '待审批', '已驳回', '已取消'];
            const { attachmentList, assetRegisterId, status, ...others } = res.data;
            assetRegisterId && this.queryAssetByRegistId({ assetRegisterId });
            let arr1 = attachmentList.filter(
              (item) =>
                item.attachmentSuffix === '.jpg' ||
                item.attachmentSuffix === '.png' ||
                item.attachmentSuffix === '.jpeg' ||
                item.attachmentSuffix === '.bmp'
            );
            let arr2 = attachmentList.filter(
              (item) =>
                item.attachmentSuffix !== '.jpg' &&
                item.attachmentSuffix !== '.png' &&
                item.attachmentSuffix !== '.jpeg' &&
                item.attachmentSuffix !== '.bmp'
            );
            let img0 = arr1.filter((img) => Number(img.fileSources) === 0);
            let img1 = arr1.filter((img) => Number(img.fileSources) === 1);
            let file0 = arr2.filter((img) => Number(img.fileSources) === 0);
            let file1 = arr2.filter((img) => Number(img.fileSources) === 1);
            console.log(this.otherAttachment, this.imageAttachment, 'this.otherAttachment');
            return Object.assign(this, {
              assetRegisterId,
              infoData: { ...others, statusName: nameList[status] },
              otherAttachment: (arr2 || []).map((m) => {
                return { url: m.attachmentPath, name: m.oldAttachmentName, suffix: m.attachmentSuffix, fileSources: m.fileSources };
              }),
              imageAttachment: (arr1 || []).map((m) => {
                return { url: m.attachmentPath, name: m.oldAttachmentName, suffix: m.attachmentSuffix, fileSources: m.fileSources };
              }),
              oldImgAttachment: (img0 || []).map((m) => {
                return { url: m.attachmentPath, name: m.oldAttachmentName, suffix: m.attachmentSuffix, fileSources: m.fileSources };
              }),
              newImgAttachment: (img1 || []).map((m) => {
                return {
                  url: m.attachmentPath,
                  name: m.oldAttachmentName,
                  suffix: m.attachmentSuffix,
                  fileSources: m.fileSources,
                  attachmentId: m.attachmentId,
                };
              }),
              oldOtherAttachment: (file0 || []).map((m) => {
                return { url: m.attachmentPath, name: m.oldAttachmentName, suffix: m.attachmentSuffix, fileSources: m.fileSources };
              }),
              newOtherAttachment: (file1 || []).map((m) => {
                return {
                  url: m.attachmentPath,
                  name: m.oldAttachmentName,
                  suffix: m.attachmentSuffix,
                  fileSources: m.fileSources,
                  attachmentId: m.attachmentId,
                };
              }),
            });
          }
          throw res.message || '查询详情出错';
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err || '查询详情出错');
        });
    },

    // 按钮操作
    handleBtn(operResult) {
      if (operResult === 0) {
        if (!this.advice && !this.isOld) {
          this.$message.error('驳回必填审核意见');
          return null;
        }
      }
      this.submitBtnLoading = true;
      let req = {
        apprId: this.apprId,
        operResult,
        operOpinion: this.advice,
      };

      let apiFn = this.$api.approve.uniformSubmit;
      if (this.isOld) {
        const { storeId, advice } = this;
        req = { storeId, advice, status: operResult ? 1 : 3, organId: this.$route.query.relatedOrganId };
        apiFn = this.$api.assets.auditAssetStore;
      }
      apiFn(req)
        .then(({ data: res }) => {
          if (res && String(res.code) === '0') {
            this.$message.success(operResult ? '审批成功' : '驳回成功');
            // 跳回列表路由
            return this.$router.push({ path: '/assetIn', query: { refresh: true } });
          } else {
            throw res.message;
          }
        })
        .catch((err) => {
          console.error(err);
          this.$message.error(err || `${operResult ? '审批失败' : '驳回失败'}`);
        })
        .finally(() => (this.submitBtnLoading = false));
    },
  },
};
</script>

<style lang="less" scoped>
.detail_page {
  padding: 0 70px 75px;
  & /deep/ .ant-table-placeholder {
    display: block;
    border-bottom: 1px solid #e8e8e8;
  }
}
.print {
  position: absolute;
  right: 20px;
  top: 20px;
}
.empty {
  height: 70px;
}
</style>
