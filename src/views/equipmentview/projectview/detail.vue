<template>
  <div class="equipmentview-projectview-detail">
    <SG-Title title="基本信息" />
    <Information v-bind="basicInfoOptions" />
    <SG-Title title="其他信息" />
    <Information v-bind="otherInfoOptions" />
    <SG-Title title="权属概况" />
    <a-table v-bind="tableOptions" size="middle"></a-table>
    <SG-Title title="资产状况" />
    <div style="max-height: 600px; overflow: auto">
      <overview-number :numList="numList" />
      <!-- 与 numlist 顺序一致   -->
      <!-- todo:有时间优化此段代码 -->
      <div style="display: flex" v-for="rowItem in assetList" :key="rowItem._key">
        <!-- 资产数量 -->
        <div class="asset-col" :title="rowItem.assetName">
          {{ rowItem.assetName }}
          （{{ (rowItem.assetCount || 0).toLocaleString() }}）
        </div>
        <!-- 运营 -->
        <div class="asset-col">
          {{ rowItem.operationCount }}
          （{{ (rowItem.operationPercentage || 0).toLocaleString() }}%）
        </div>
        <!-- 闲置 -->
        <div class="asset-col">
          {{ rowItem.idleCount }}
          （{{ (rowItem.idlePercentage || 0).toLocaleString() }}%）
        </div>
        <!-- 自用 -->
        <div class="asset-col">
          {{ rowItem.selfCount }}
          （{{ (rowItem.selfPercentage || 0).toLocaleString() }}%）
        </div>
        <!-- 其它 -->
        <div class="asset-col">
          {{ rowItem.otherCount }}
          （{{ (rowItem.otherPercentage || 0).toLocaleString() }}%）
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import OverviewNumber from '@/views/common/OverviewNumber';
import Information from '@/components/Information';
import uploadAndDownLoadFIle from '@/mixins/uploadAndDownLoadFIle';
export default {
  name: 'projectviewDetail',
  components: {
    Information,
    OverviewNumber,
  },
  mixins: [uploadAndDownLoadFIle],
  data() {
    return {
      assetList: [],
      numList: [
        {
          title: '资产数量',
          key: 'assetCount',
          percentageKey: 'assetCount',
          value: 0,
          fontColor: '#324057',
        },
        {
          title: '运营',
          key: 'operationCount',
          percentageKey: 'operationPercentage',
          value: 0,
          bgColor: '#4BD288',
        },
        {
          title: '闲置',
          key: 'idleCount',
          percentageKey: 'idlePercentage',
          value: 0,
          bgColor: '#1890FF',
        },
        {
          title: '自用',
          key: 'selfCount',
          percentageKey: 'selfPercentage',
          value: 0,
          bgColor: '#DD81E6',
        },
        {
          title: '其他',
          key: 'otherCount',
          percentageKey: 'otherPercentage',
          value: 0,
          bgColor: '#BBC8D6',
        },
      ],
      tableOptions: {
        rowKey: '_key',
        pagination: false,
        columns: [
          {
            title: '有证',
            dataIndex: 'ownershipYesCount',
          },
          {
            title: '无证',
            dataIndex: 'ownershipNoCount',
          },
          {
            title: '待办',
            dataIndex: 'ownershipPendingCount',
          },
          {
            title: '权属办理进度 (%)',
            dataIndex: 'ownershipProgress',
          },
        ],
        dataSource: [],
      },
      queryParams: {
        projectId: '',
      },
      basicInfoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: '权属单位',
              key: 'organName',
            },
            {
              title: '资产项目名称',
              key: 'projectName',
            },
            {
              title: '资产项目编码',
              key: 'projectCode',
            },
          ],
          [
            {
              title: '来源方式',
              key: 'sourceTypeName',
            },
            {
              title: '来源方式说明',
              key: 'souceChannelType',
            },
            {
              title: '是否接管',
              key: 'takeOver',
            },
          ],
          [
            {
              title: '接管时间',
              key: 'takeOverDate',
            },
            {
              title: '接管时资产状态',
              key: 'takeoverAssetStatusName',
            },
            {
              title: '备注',
              key: 'remark',
            },
          ],
          [
            {
              title: '附件',
              key: 'attachment',
              render(_h, data, resValue) {
                return _h('UploadFile', {
                  props: {
                    type: 'all',
                    files: resValue,
                    show: true,
                  },
                });
              },
              colProps: {
                span: 24,
              },
            },
          ],
        ],
        colProps: { span: 8 },
      },
      otherInfoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              title: '上报基础情况表时间',
              key: 'reportBasicInfoDate',
            },
            {
              title: '设备设施核实时间',
              key: 'houseVerificationDate',
            },
            {
              title: '上报房屋划转请示时间',
              key: 'reportHouseTransferReqDate',
            },
          ],
          [
            {
              title: '上报核实报告时间',
              key: 'reportingVerificationReportDate',
            },
            {
              title: '划转批复下发时间',
              key: 'transferApprovalDate',
            },
            {
              title: '协议签署时间',
              key: 'agreementSignDate',
            },
          ],
          [
            {
              title: '权属办理中存在问题',
              key: 'ownershipHandleProblems',
            },
            {
              title: '历史遗留问题',
              key: 'houseTransferHisProblem',
            },
          ],
        ],
        colProps: { span: 8 },
      },
    };
  },
  methods: {
    async getDetail() {
      const req = {
        projectId: this.queryParams.projectId,
      };
      console.log({ req });
      const res1 = this.$api.equipmentview.detailProject(req);
      const res2 = this.$api.assets.queryProjectManageDetailById(req);
      Promise.all([res1, res2])
        .then(
          ([
            {
              data: { code: code1, message: message1, data: data1 },
            },
            {
              data: { code: code2, message: message2, data: data2 },
            },
          ]) => {
            if (code1 === '0' && code2 === '0') {
              // 优先使用 设备设施详情的接口数据
              const resData = Object.assign({}, data2, data1);

              // mock数据
              resData.attachment = [
                {
                  attachmentId: 2796,
                  objectType: 8,
                  objectId: 100205,
                  newAttachmentName: 'wKgBB2J1zS6AP0fJAB9RobfhZ4o899.jpg',
                  attachmentPath: 'group1/M1B/00/74/wKgBB2J1zS6AP0fJAB9RobfhZ4o899.jpg',
                  attachmentSuffix: '.jpg',
                  oldAttachmentName: '7fcb43d25f2cbeceb5456d9ff01eb90e.jpg',
                  originName: null,
                  fileSources: 1,
                  subType: null,
                  bpmFileId: null,
                },
              ];
              console.log({ resData });
              resData.attachment = resData.attachment.map((ele) => {
                return {
                  ...ele,
                  url: ele.attachmentPath,
                  name: ele.oldAttachmentName,
                };
              });

              this.basicInfoOptions.data = resData;
              this.otherInfoOptions.data = resData;

              // 处理权属概况数据
              const { ownershipYesCount, ownershipNoCount, ownershipPendingCount, ownershipProgress } = resData;
              this.tableOptions.dataSource = [
                {
                  ownershipYesCount,
                  ownershipNoCount,
                  ownershipPendingCount,
                  ownershipProgress,
                  _key: Math.random(),
                },
              ];
              this.assetList = (resData.list || []).map((ele) => ({
                ...ele,
                _key: Math.random(),
              }));
              // list 出参 第一个数据就是汇总数据
              const tempRes = this.assetList.shift();
              // 处理资产概况数据
              this.numList.forEach((ele) => {
                ele.value = Number(tempRes[ele.key] || 0);
              });
            } else {
              if (code1 !== '0') {
                this.$message.error(message1);
              }
              if (code2 !== '0') {
                this.$message.error(message2);
              }
            }
          }
        )
        .catch((reason) => {
          console.error(reason);
        });
    },
  },
  mounted() {
    this.queryParams.projectId = this.$route.query.projectId;
    this.getDetail();
  },
};
</script>

<style scoped>
.equipmentview-projectview-detail {
  padding: 20px 60px;
}
.asset-col {
  font-size: 16px;
  text-align: center;
  width: 25%;
  height: 80px;
  line-height: 40px;
  box-sizing: border-box;
  padding: 20px;
  border-bottom: 1px solid #eff2f7;
  border-right: 1px solid #eff2f7;
  border-left: 1px solid #eff2f7;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
