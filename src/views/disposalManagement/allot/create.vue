<template>
  <div class="allot-create">
    <a-form-model ref="ruleForm" :model="formData" :rules="rules">
      <SG-Title title="基本信息" />
      <div style="width: 100%">
        <a-row>
          <a-col :span="8">
            <a-form-model-item :style="formItemStyle" label="申请单名称" prop="name" v-bind="formItemLayout">
              <a-input v-model="formData.name" placeholer="请输入申请单名称"></a-input>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item :style="formItemStyle" label="所属机构" v-bind="formItemLayout">
              <span>{{ this.organName }}</span>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item :style="formItemStyle" label="资产项目" prop="projectId" v-bind="formItemLayout">
              <a-select
                optionFilterProp="children"
                showSearch
                style="width: 200px"
                v-model="formData.projectId"
                :options="projectListOptions"
                @change="changeProject"
              ></a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
        <a-row style="margin-top: 20px">
          <a-col :span="8">
            <a-form-model-item :style="formItemStyle" label="资产类型" prop="assetType" v-bind="formItemLayout">
              <a-select style="width: 200px" v-model="formData.assetType" :options="assetTypeOptions"></a-select>
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item :style="formItemStyle" label="接管组织结构" prop="newOrganId" v-bind="formItemLayout">
              <TreeSelect
                style="width: 200px"
                placeholder="请选择组织机构"
                :allowClear="false"
                :value="formData.newOrganId"
                search
                @changeTree="changeTree"
              />
            </a-form-model-item>
          </a-col>
          <a-col :span="8">
            <a-form-model-item :style="formItemStyle" label="接管资产项目" prop="newProjectId" v-bind="formItemLayout">
              <a-select
                optionFilterProp="children"
                showSearch
                style="width: 200px"
                v-model="formData.newProjectId"
                :options="projectListOptions"
                @change="changeProject"
              ></a-select>
            </a-form-model-item>
          </a-col>
        </a-row>
      </div>
      <SG-Title title="资产明细" />
      <a-row>
        <a-col :offset="2" :span="18">
          <div style="height: 600px; border: 1px solid #e8e8e8; padding: 0; border-radius: 2px">
            <div style="display: flex; height: 100%">
              <!-- 资产列表 -->
              <div style="flex-basis: 300px; height: 600px; border-right: 1px solid #e8e8e8">
                <div
                  style="
                    width: 100%;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    border-bottom: 1px solid #e8e8e8;
                    padding: 10px 20px;
                  "
                >
                  <span>{{ `已选资产列表 ${selectedList.length}` }}</span>
                  <SG-Button @click="changeSelectAssetModalFLag(true)" type="primary"> 添加资产 </SG-Button>
                </div>
                <div style="overflow: auto; height: calc(100% - 70px)">
                  <div
                    class="asset-item"
                    v-for="item in selectedList"
                    :key="item.assetId"
                    :class="{
                      'activity-asset': item.assetId === currentSelectAssetId,
                    }"
                  >
                    <span @click="getAssetDetail(item)" style="flex: 1; padding: 8px 0">
                      {{ item.assetName }}
                    </span>
                    <a-icon class="asset-item-icon" v-if="item.assetId === currentSelectAssetId" type="check" />
                    <a-icon class="asset-item-icon" @click="handleDelSelectAsset(item)" v-else type="close" />
                  </div>
                </div>
              </div>

              <!-- 资产详情信息 -->
              <div style="flex: 1; padding: 20px 40px; height: 100%; overflow: auto" v-if="currentSelectAssetId">
                <div>
                  <span class="detail-title"> 物业名称: {{ `${currentAssetDetail.propertyName}` }} </span>
                  <div style="margin-bottom: 20px">
                    <Information :row-props="{ gutter: 5 }" :col-props="{ span: 10 }" v-bind="basicInfoOptions"></Information>
                  </div>
                </div>
                <div>
                  <span class="detail-title">拟调拨标的历史租赁情况</span>
                  <a @click="btnMoreLeaseInfo" style="margin-left: 20px" v-if="currentAssetDetail.lease.length > 1"> 查看更多租赁信息 </a>
                  <div style="margin-bottom: 20px">
                    <Information :row-props="{ gutter: 5 }" :col-props="{ span: 10 }" v-bind="leasingSituationOptions"></Information>
                  </div>
                </div>
                <div>
                  <span class="detail-title">拟调拨标的资产评估情况</span>
                  <div style="margin-bottom: 20px">
                    <Information :row-props="{ gutter: 5 }" :col-props="{ span: 10 }" v-bind="assessSituationOptions"></Information>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </a-col>
      </a-row>
      <SG-Title title="补充资料" />
      <a-row>
        <a-col :offset="2" :span="18">
          <a-form-model-item prop="remark" label="备注">
            <a-textarea v-model="formData.remark" v-bind="textareaProps" placeholder="其它说明情况" />
          </a-form-model-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :offset="2" :span="18">
          <a-form-model-item label="附件">
            <UploadFile v-model="allFile.otherFile.value" />
          </a-form-model-item>
        </a-col>
      </a-row>
    </a-form-model>
    <div class="footer-action">
      <SG-Button @click="handleSave(0)" type="primary" style="margin-right: 10px"> 暂存草稿 </SG-Button>
      <SG-Button @click="handleSave(1)" type="primary" style="margin-right: 10px" class="right-btn"> 提交 </SG-Button>
      <SG-Button class="right-btn" @click="goBack">取消</SG-Button>
    </div>
    <SelectAssetModal
      ref="selectAssetModalRef"
      v-if="selectAssetModalFlag"
      :organId="organId"
      :proId="formData.projectId"
      :assetType="formData.assetType"
      :isSelectedEquipment="isSelectedEquipment"
      :defaultSelectedList="selectedList"
      @closePop="changeSelectAssetModalFLag(false)"
      @popSave="handlePopSave"
    />
    <SG-Modal
      okText="确认"
      v-model="modalList.usage.show"
      :title="modalList.usage.title"
      @cancel="
        () => {
          doClosePop('usage');
        }
      "
    >
      <template #footer>
        <SG-Button @click="doClosePop('usage')">返回</SG-Button>
      </template>
      <div v-if="modalList.usage.show">
        <UsageTable :dataSource="modalList.usage.dataSource" />
      </div>
    </SG-Modal>
    <SG-Modal
      v-model="modalList.warrant.show"
      :title="modalList.warrant.title"
      @cancel="
        () => {
          doClosePop('warrant');
        }
      "
    >
      <template #footer>
        <SG-Button @click="doClosePop('warrant')">返回</SG-Button>
      </template>
      <div v-if="modalList.warrant.show">
        <WarrantTable :dataSource="modalList.warrant.dataSource" />
      </div>
    </SG-Modal>
    <SG-Modal
      okText="确认"
      v-model="modalList.lease.show"
      :title="modalList.lease.title"
      @cancel="
        () => {
          doClosePop('lease');
        }
      "
    >
      <template #footer>
        <SG-Button @click="doClosePop('lease')">返回</SG-Button>
      </template>
      <div v-if="modalList.lease.show">
        <LeaseTable :dataSource="modalList.lease.dataSource" />
      </div>
    </SG-Modal>
  </div>
</template>

<script>
import './addAndEdit.less';
import TreeSelect from '@/views/common/treeSelect';
import Information from '@/components/Information';
import SelectAssetModal from '@/views/disposalManagement/allot/SelectAssetModal';
import { getDetail, getObjectKeyValueByOrganIdFn } from '@/views/disposalManagement/allot/share';
import configBase from '@/config/config.base';
import UsageTable from '@/views/disposalManagement/allot/UsageTable';
import LeaseTable from '@/views/disposalManagement/allot/LeaseTable';
import WarrantTable from '@/views/disposalManagement/allot/WarrantTable';
export default {
  name: 'allotCreate',
  components: {
    WarrantTable,
    LeaseTable,
    UsageTable,
    SelectAssetModal,
    Information,
    TreeSelect,
  },
  data() {
    return {
      modalList: {
        usage: {
          show: false,
          title: '',
          dataSource: [],
        },
        warrant: {
          show: false,
          title: '',
          dataSource: [],
        },
        lease: {
          show: false,
          title: '',
          dataSource: [],
        },
      },
      // 当前资产详情信息
      currentAssetDetail: {
        // 使用情况
        resourceList: [],
        // 物业名称
        propertyName: '',
        // 基础信息
        details: [],
        // 租赁相关信息
        lease: [],
        // 评估信息
        valueInfos: {},
      },
      basicInfoOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              key: 'obligeeName',
              title: '权属单位',
            },
            {
              key: 'equityComposition',
              title: '权属人股权构成',
            },
          ],
          [
            {
              key: 'warrantNbr',
              title: '产权证号',
              render: (_h, data, resValue) => {
                const _this = this;
                const resNode = _h('span', [resValue]);
                let childNode = [resNode];
                if (this.currentAssetDetail.details.length > 1) {
                  const moreNode = _h(
                    'a',
                    {
                      style: {
                        marginLeft: '20px',
                        flexBasis: '80px',
                      },
                      on: {
                        click() {
                          _this.modalList.warrant.dataSource = _this.currentAssetDetail.details;
                          _this.doOpenPop('warrant', _this.currentSelectAsset.assetName);
                        },
                      },
                    },
                    ['查看更多权证']
                  );
                  childNode.push(moreNode);
                }
                return _h(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                    },
                  },
                  childNode
                );
              },
            },
            {
              key: 'houseStartAndEndDate',
              title: '权证有效期',
            },
          ],
          [
            {
              key: 'usage',
              title: '目前使用状况',
              render: (_h, data, resValue) => {
                const _this = this;
                const resNode = _h('span', [resValue]);
                let childNode = [resNode];
                if (this.currentAssetDetail.resourceList.length > 1) {
                  const moreNode = _h(
                    'a',
                    {
                      style: {
                        marginLeft: '20px',
                        flexBasis: '80px',
                      },
                      on: {
                        click() {
                          _this.modalList.usage.dataSource = _this.currentAssetDetail.resourceList;
                          _this.doOpenPop('usage', _this.currentSelectAsset.assetName);
                        },
                      },
                    },
                    ['查看更多使用情况']
                  );
                  childNode.push(moreNode);
                }
                return _h(
                  'div',
                  {
                    style: {
                      display: 'flex',
                      alignItems: 'center',
                    },
                  },
                  childNode
                );
              },
            },
            {
              key: 'ownershipUse',
              title: '证载用途',
            },
          ],
          [
            {
              key: 'buildArea',
              title: '建筑面积',
            },
            {
              key: 'landArea',
              title: '土地面积',
            },
          ],
          [
            {
              key: 'sourceModeName',
              title: '获得来源',
            },
          ],
        ],
      },
      leasingSituationOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              key: 'resName',
              title: '房号',
            },
            {
              key: 'startAndEndDateFormat',
              title: '承租时间',
            },
          ],
          [
            {
              key: 'secondName',
              title: '历史承租人',
            },
            {
              key: 'allRent',
              title: '承租金额',
              render(_h, data, resValue) {
                return _h('span', Number(resValue || 0).toLocaleString());
              },
            },
          ],
          [
            {
              key: 'unitRentAveragePrice',
              title: '租金单价',
            },
          ],
        ],
      },
      assessSituationOptions: {
        data: {},
        formatBasicInfoList: [
          [
            {
              key: 'assessmentOrganName',
              title: '评估机构',
            },
            {
              key: 'assessmentNum',
              title: '报告号',
            },
          ],
          [
            {
              key: 'assessmenBaseDate',
              title: '评估基准日',
            },
            {
              key: 'assessmentValidDate',
              title: '评估有效期',
            },
          ],
          [
            {
              key: 'assessmentValue',
              title: '评估价值（元）',
              render(_h, data, resValue) {
                return _h('span', Number(resValue || 0).toLocaleString());
              },
            },
          ],
        ],
      },
      currentSelectAsset: {},
      currentSelectAssetId: '',
      selectedList: [],
      selectAssetModalFlag: false,
      allFile: {
        // 附件
        otherFile: {
          value: [],
          subType: 2001,
        },
      },
      ingyingFIle: [],
      configBase,
      textareaProps: {
        maxLength: 3000,
        autoSize: {
          minRows: 6,
          maxRows: 12,
        },
      },
      organName: '',
      organId: '',
      projectListOptions: [],
      formItemStyle: {
        width: '100%',
      },
      formItemLayoutTwo: {
        labelCol: {
          xs: { span: 8 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 },
        },
      },
      rules: {
        name: [
          {
            required: true,
            message: '请输入申请单名称',
            trigger: 'blur',
          },
        ],
        projectId: [
          {
            required: true,
            message: '请选择资产项目',
            trigger: 'change',
          },
        ],
        newOrganId: [
          {
            required: true,
            message: '请选择接管机构',
            trigger: 'change',
          },
        ],
        newProjectId: [
          {
            required: true,
            message: '接管项目',
            trigger: 'change',
          },
        ],
        assetType: [{ required: true, message: '请选择资产类型', trigger: 'change' }],
        remark: [
          {
            required: true,
            message: '请输入其它说明情况',
            trigger: 'blur',
          },
        ],
      },
      formStyle: {
        width: '200px',
      },
      formData: {
        name: '',
        projectId: '',
        assetType: '',
        remark: '',
        newOrganId: '',
        newProjectId: '',
      },
    };
  },
  computed: {
    isEdit() {
      return this.$route.path === '/allot/edit';
    },
    assetTypeOptions() {
      return this.$store.state.ASSET_TYPE_OPTIONS.length
        ? this.$store.state.ASSET_TYPE_OPTIONS.map((ele) => ({
            title: ele.name,
            value: ele.value,
            label: ele.name,
          }))
        : [];
    },
    isSelectedEquipment() {
      return String(this.formData.assetType) === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    },
  },
  methods: {
    changeTree(value) {
      this.$set(this.formData, 'newOrganId', value);
    },
    btnMoreLeaseInfo() {
      this.modalList.lease.dataSource = this.currentAssetDetail.lease;
      this.doOpenPop('lease', this.currentSelectAsset.assetName);
    },
    doClosePop(modal) {
      this.modalList[modal].show = false;
    },
    doOpenPop(modal, title) {
      this.modalList[modal].show = true;
      if (title) {
        this.modalList[modal].title = title;
      }
    },
    changeProject() {
      this.selectedList = [];
      this.currentSelectAsset = {};
      this.currentSelectAssetId = '';
      this.currentAssetDetail = {
        // 使用情况
        resourceList: [],
        // 物业名称
        propertyName: '',
        // 基础信息
        details: [],
        // 租赁相关信息
        lease: [],
        // 评估信息
        valueInfos: {},
      };
    },
    goBack() {
      this.$router.go(-1);
    },
    /*
     * saveType 0草稿 1提交
     * */
    async handleSave(type) {
      this.$refs.ruleForm.validate(async (valid) => {
        if (valid) {
          const detailReqs = this.selectedList.map((ele) => {
            return {
              assetId: ele.assetId,
              assetType: ele.assetType,
            };
          });
          let errorFlag = false;
          let errorInfo = [];
          if (!this.selectedList.length) {
            errorFlag = true;
            errorInfo.push(`请添加资产`);
          }
          const attachmentList = Object.keys(this.allFile)
            .map((ele) => {
              return this.allFile[ele].value.map((e) => {
                return {
                  newAttachmentName: e.name,
                  attachmentPath: e.url,
                  oldAttachmentName: e.name,
                  subType: this.allFile[ele].subType,
                };
              });
            })
            .flat();
          if (errorFlag) {
            this.$message.error(errorInfo.join(','));
            return null;
          }
          const req = {
            organId: this.organId,
            saveType: type,
            detailReqs,
            attachmentList,
            status: '1', // 1 有效 0删除
            ...this.formData,
          };
          if (this.isEdit) {
            req.id = this.$route.query.id;
          }
          const {
            data: { code, message },
          } = await this.$api.allot.addOrUpdateTransfer(req);
          if (code === '0') {
            this.$message.success('操作成功');
            this.goBack();
          } else {
            this.$message.error(message);
          }
        } else {
          return false;
        }
      });
    },
    handleDelSelectAsset({ assetId }) {
      const _this = this;
      this.$confirm({
        title: '提示',
        content: '确认删除吗？',
        onOk() {
          _this.selectedList = _this.selectedList.filter((ele) => ele.assetId !== assetId);
        },
      });
    },
    getHistoricLease({ assetId }) {
      const req = {
        assetId,
      };
      this.$api.transfer.historicLease(req).then(({ data: { code, message, data } }) => {
        if (code === '0') {
          this.currentAssetDetail.lease = data || [];
          this.leasingSituationOptions.data = this.currentAssetDetail.lease[0] || {};
          if (this.leasingSituationOptions.data.rentAveragePrice && this.leasingSituationOptions.data.unit) {
            this.leasingSituationOptions.data.unitRentAveragePrice = `${this.leasingSituationOptions.data.rentAveragePrice} ${this.leasingSituationOptions.data.unit}`;
          }
          if (this.leasingSituationOptions.data.startDateFormat && this.leasingSituationOptions.data.endDateFormat) {
            this.leasingSituationOptions.data.startAndEndDateFormat = `${this.leasingSituationOptions.data.startDateFormat}至${this.leasingSituationOptions.data.endDateFormat}`;
          }
        } else {
          this.$message.error(message);
        }
      });
    },
    getAssetInfo({ assetId }) {
      const req = {
        assetId,
      };
      this.$api.transfer.assetDetail(req).then(({ data: { code, message, data } }) => {
        if (code === '0') {
          this.currentAssetDetail.propertyName = data.propertyName;
          this.currentAssetDetail.details = data.details || [];
          this.currentAssetDetail.valueInfos = data.valueInfos || {};
          this.currentAssetDetail.resourceList = data.resourceList || [];
          this.basicInfoOptions.data = this.currentAssetDetail.details[0] || {};
          this.assessSituationOptions.data = this.currentAssetDetail.valueInfos;
          this.basicInfoOptions.data.sourceModeName = data.sourceModeName;
          this.basicInfoOptions.data.usage = this.currentAssetDetail.resourceList[0] ? this.currentAssetDetail.resourceList[0].busiStatus : '--';
          if (this.basicInfoOptions.data.houseStartDate && this.basicInfoOptions.data.houseEndDate) {
            this.basicInfoOptions.data.houseStartAndEndDate = `${this.basicInfoOptions.data.houseStartDate}至${this.basicInfoOptions.data.houseEndDate}`;
          }
        } else {
          this.$message.error(message);
        }
      });
    },
    async getAssetDetail({ assetId }) {
      this.currentSelectAssetId = assetId;
      this.currentSelectAsset = this.selectedList.find((ele) => ele.assetId === assetId);
      this.getHistoricLease({ assetId });
      this.getAssetInfo({ assetId });
    },
    handleValidateBaseInfo() {
      if (!this.formData.assetType || !this.formData.projectId) {
        return '请先选择资产类型和资产项目';
      }
    },
    handlePopSave(selectedList) {
      this.selectedList = selectedList;
      const resAssetId = selectedList.find((ele) => ele.assetId === this.currentSelectAssetId) ? this.currentSelectAssetId : selectedList[0].assetId;
      this.getAssetDetail({ assetId: resAssetId });
    },
    changeSelectAssetModalFLag(flag) {
      const error = this.handleValidateBaseInfo();
      if (error) {
        this.$message.error(error);
        return null;
      }
      this.selectAssetModalFlag = flag;
    },
    getAllFileData(data) {
      const res = data || [];
      res.forEach((ele) => {
        Object.keys(this.allFile).forEach((e) => {
          const item = this.allFile[e];
          if (item.subType === ele.subType) {
            item.value.push({
              name: ele.oldAttachmentName,
              url: ele.attachmentPath,
              attachmentId: ele.attachmentId,
            });
          }
        });
      });
    },
    initFormData(data) {
      const baseInfo = data.baseInfo;
      this.formData = {
        name: baseInfo.name,
        newOrganId: baseInfo.newOrganId,
        projectId: baseInfo.projectId,
        newProjectId: baseInfo.newProjectId,
        assetType: String(baseInfo.assetType),
        remark: baseInfo.remark,
      };
    },
    async initEditData({ id }) {
      const data = await getDetail({ id });
      // 资产明细列表
      this.handlePopSave(
        data.assetDetails.map((ele) => ({
          ...ele,
        })) || []
      );
      this.initFormData(data);
      this.getAllFileData(data.attachments); // 附件
    },
  },
  mounted() {
    this.organId = this.$route.query.organId;
    this.organName = this.$route.query.organName;
    getObjectKeyValueByOrganIdFn({ organId: this.organId }).then((data) => {
      this.projectListOptions = data;
    });

    if (this.isEdit) {
      const id = this.$route.query.id;
      this.initEditData({ id });
    }
  },
};
</script>
<style lang="less" scoped>
/deep/ .ant-form-item-label {
  label {
    font-size: 13px;
    color: #959dab;
    font-family: 'Microsoft Yahei';
  }
}
/deep/ .ant-form-item-children {
  span,
  input,
  textarea {
    font-size: 15px;
    color: #49505e;
    font-family: 'Microsoft Yahei';
  }
  .button {
    span {
      color: white;
    }
  }
}
</style>
