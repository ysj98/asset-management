<!--资产项目管理业务-资产项目管理详情页面-基础信息组件-->
<template>
  <a-spin :spinning="spinning">
    <a-form :class="['detail_info', isEdit ? '' : 'disabled_form']" :form="form" :layout="layout">
      <SG-Title title="基础信息" noMargin />
      <div :class="{ title_div: !type || type == 'approval' }" style="margin-top: 10px; margin-bottom: 15px">
        <a-row>
          <a-col :span="colSpan">
            <a-form-item label="权属单位" :label-col="labelCol" :wrapper-col="wrapperCol">
              <!-- 公司 -->
              <treeSelect
                v-if="['edit'].includes(type)"
                :default="false"
                :defaultOrganName="organName"
                :value="organKey"
                @changeTree="changeTree"
                style="width: 100%"
                placeholder="请选择组织机构"
                :allowClear="false"
              >
              </treeSelect>
              <span v-else style="margin-left: 11px">{{ organName }}</span>
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="资产项目名称" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input
                :disabled="!isEdit"
                placeholder="请输入资产项目名称"
                v-decorator="[
                  'projectName',
                  {
                    initialValue,
                    rules: [
                      { required: true, message: '请输入资产项目名称' },
                      { max: 30, message: '最多30个字符' },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="资产项目编码" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input
                :disabled="!isEdit"
                placeholder="请输入资产项目编码"
                v-decorator="[
                  'projectCode',
                  {
                    initialValue,
                    rules: [
                      { required: true, message: '请输入资产项目编码' },
                      { max: 30, message: '最多30个字符' },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="是否接管" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择是否接管' : ''"
                :options="$addTitle(takeOverOptions)"
                @change="getTakeOver"
                v-decorator="['takeOver', { initialValue: '1', rules: [{ required: true, message: '请选择是否接管' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="来源方式" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择来源方式' : ''"
                :options="$addTitle(typeOptions)"
                @change="getSourceType"
                v-decorator="['sourceType', { initialValue: undefined, rules: [{ required: true, message: '请选择来源方式' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="来源方式说明" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input
                :disabled="!isEdit"
                placeholder="请输入来源方式说明"
                v-decorator="[
                  'souceChannelType',
                  {
                    initialValue,
                    rules: [
                      { required: true, message: '请输入来源方式说明' },
                      { max: 40, message: '最多40个字符' },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan" v-if="takeOver === '1'">
            <a-form-item label="接管日期" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择接管日期' : ''"
                v-decorator="['takeOverDate', { rules: [{ required: true, message: '请选择接管日期' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan" v-if="takeOver === '1'">
            <a-form-item label="接管人" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input
                :disabled="!isEdit"
                placeholder="请输入接管名称"
                v-decorator="[
                  'receiver',
                  {
                    initialValue,
                    rules: [
                      { required: false, message: '请输入接管人' },
                      { max: 50, message: '最多50个字符' },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan" v-if="takeOver === '1'">
            <a-form-item label="接管时资产状态" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-select
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择资产状态' : ''"
                :options="$addTitle(takeOverStatusOptions)"
                v-decorator="['takeoverAssetStatus', { initialValue: undefined }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="第三方编码" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input
                :disabled="!isEdit"
                placeholder="请输入第三方编码"
                v-decorator="[
                  'thirdPartyCode',
                  {
                    initialValue,
                    rules: [
                      { required: false, message: '请输入第三方编码' },
                      { max: 50, message: '最多50个字符' },
                    ],
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="经营单位" :label-col="labelCol" :wrapper-col="wrapperCol">
              <treeSelect
                v-if="isEdit"
                :default="false"
                :defaultOrganName="businessUnit"
                :value="businessUnitId"
                :typeFilter="typeFilter"
                @changeTree="unitTree"
                style="width: 100%"
                placeholder="请选择经营单位"
              >
              </treeSelect>
              <span v-else style="margin-left: 11px">{{ businessUnit || '无' }}</span>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="备注" :label-col="type ? { span: 4 } : { span: 3 }" :wrapper-col="type ? { span: 20 } : { span: 21 }">
              <a-textarea
                :disabled="!isEdit"
                style="resize: none"
                :autosize="{ maxRows: 3 }"
                placeholder="请输入备注"
                v-decorator="['remark', { initialValue, rules: [{ max: 200, message: '最多200个字符' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="colSpan === 12 ? 24 : 24">
            <a-form-item label="附件" :label-col="{ span: colSpan === 12 ? 4 : 3 }" :wrapper-col="{ span: colSpan === 12 ? 19 : 21 }">
              <UploadFile v-if="isEdit || attachment.length" type="all" :show="!isEdit" v-model="attachment" :maxSize="20480" />
              <span v-else style="margin-left: 12px">无</span>
            </a-form-item>
          </a-col>
        </a-row>
      </div>
      <SG-Title title="其他信息" noMargin />
      <div :class="{ title_div: !type || type == 'approval' }" style="margin-top: 10px; margin-bottom: 15px">
        <a-row>
          <a-col :span="24">
            <a-form-item label="权属办理中存在问题" :label-col="type ? { span: 4 } : { span: 3 }" :wrapper-col="type ? { span: 20 } : { span: 21 }">
              <a-textarea
                :disabled="!isEdit"
                style="resize: none"
                :autosize="{ maxRows: 3 }"
                placeholder="请输入权属办理中存在问题"
                v-decorator="['ownershipHandleProblems', { initialValue, rules: [{ max: 200, message: '最多200个字符' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="历史遗留问题" :label-col="type ? { span: 4 } : { span: 3 }" :wrapper-col="type ? { span: 20 } : { span: 21 }">
              <a-textarea
                :disabled="!isEdit"
                style="resize: none"
                :autosize="{ maxRows: 3 }"
                placeholder="请输入历史遗留问题"
                v-decorator="['houseTransferHisProblem', { initialValue, rules: [{ max: 200, message: '最多200个字符' }] }]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <!--当来源方式为 划转 字典值1-->
        <a-row v-if="sourceType === '1'">
          <a-col :span="colSpan">
            <a-form-item label="上报基础情况表时间" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择上报基础情况表时间' : ''"
                v-decorator="['reportBasicInfoDate']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="资产核实时间" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择房屋核实时间' : ''"
                v-decorator="['houseVerificationDate']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="上报资产划转请示时间" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择划上报房屋划转请示时间' : ''"
                v-decorator="['reportHouseTransferReqDate']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="上报核实报告时间" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择上报核实报告时间' : ''"
                v-decorator="['reportingVerificationReportDate']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="划转批复下发时间" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择划转批复下发时间' : ''"
                v-decorator="['transferApprovalDate']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="协议签署时间" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择协议签署时间' : ''"
                v-decorator="['agreementSignDate']"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <!--当来源方式为 外购 字典值2-->
        <a-row v-else-if="sourceType === '2'">
          <a-col :span="colSpan">
            <a-form-item label="购买日期" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择购买日期' : ''" v-decorator="['purchaseDate']" />
            </a-form-item>
          </a-col>
        </a-row>
        <!--当来源方式为 自建 字典值3-->
        <a-row v-else-if="sourceType === '3'">
          <a-col :span="colSpan">
            <a-form-item label="开发商" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input
                :disabled="!isEdit"
                placeholder="请输入开发商"
                v-decorator="['developers', { initialValue, rules: [{ message: '请输入开发商' }, { max: 30, message: '最多30个字符' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="承建商" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input
                :disabled="!isEdit"
                placeholder="请输入承建商"
                v-decorator="['contractor', { initialValue, rules: [{ message: '请输入承建商' }, { max: 30, message: '最多30个字符' }] }]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="竣工日期" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择竣工日期' : ''" v-decorator="['completionDate']" />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="交付日期" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker :disabled="!isEdit" style="width: 100%" :placeholder="isEdit ? '请选择交付日期' : ''" v-decorator="['deliveryDate']" />
            </a-form-item>
          </a-col>
        </a-row>
        <!--当来源方式为 租入 字典值4-->
        <a-row v-else-if="sourceType === '4'">
          <a-col :span="colSpan">
            <a-form-item label="租入开始日期" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择租入开始日期' : ''"
                v-decorator="['leaseInStartDate']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="租入结束日期" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择租入结束日期' : ''"
                v-decorator="['leaseInEndDate']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="租入合同编号" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input
                :disabled="!isEdit"
                placeholder="请输入租入合同编号"
                v-decorator="[
                  'leaseInContractNo',
                  { initialValue, rules: [{ message: '请输入租入合同编号' }, { max: 30, message: '最多30个字符' }] },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <!--当来源方式为 代管 字典值5-->
        <a-row v-else-if="sourceType === '5'">
          <a-col :span="colSpan">
            <a-form-item label="代管开始日期" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择代管开始日期' : ''"
                v-decorator="['escrowStartDate']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="代管结束日期" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-date-picker
                :disabled="!isEdit"
                style="width: 100%"
                :placeholder="isEdit ? '请选择代管结束日期' : ''"
                v-decorator="['escrowEndDate']"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="托管面积(㎡)" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input
                :disabled="!isEdit"
                placeholder="请输入托管面积"
                v-decorator="[
                  'trusteeshipArea',
                  { initialValue, rules: [{ pattern: /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/, message: '请输入0-99999999.99的数值' }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="实际接收面积(㎡)" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input
                :disabled="!isEdit"
                placeholder="请输入实际接收面积"
                v-decorator="[
                  'actualReceiveArea',
                  { initialValue, rules: [{ pattern: /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/, message: '请输入0-99999999.99的数值' }] },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col :span="colSpan">
            <a-form-item label="实际可用面积(㎡)" :label-col="labelCol" :wrapper-col="wrapperCol">
              <a-input
                :disabled="!isEdit"
                placeholder="请输入实际可用面积"
                v-decorator="[
                  'actualUsableArea',
                  { initialValue, rules: [{ pattern: /^([1-9][\d]{0,7}|0)(\.[\d]{1,2})?$/, message: '请输入0-99999999.99的数值' }] },
                ]"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </div>
    </a-form>
  </a-spin>
</template>

<script>
import moment from 'moment';
import { queryPlatformDict } from 'src/views/common/commonQueryApi';
import TreeSelect from '@/views/common/treeSelect';
import { typeFilter } from '@/views/buildingDict/buildingDictConfig';
export default {
  name: 'BaseInfo',
  components: {
    TreeSelect,
  },
  props: {
    type: String,
    projectId: [String, Number],
    organTitle: String,
    organId: [String, Number],
    sourceTypeOptions: Array,
  },
  data() {
    return {
      typeFilter,
      colSpan: 8,
      layout: 'horizontal',
      isEdit: false, // 是否可编辑
      labelCol: { span: 8 },
      wrapperCol: { span: 16 },
      initialValue: '无', // 表单控件初始值
      spinning: false, // 页面加载状态
      form: this.$form.createForm(this), // 注册form
      attachment: [], // 附件
      businessUnitId: '',
      businessUnit: '',
      organName: '', // 权属单位
      organKey: '', // 权属单位
      takeOver: '1', // 是否接管，否 0，是 1
      receiver: '', // 接管人
      trusteeshipArea: '', //托管面积
      actualReceiveArea: '', //实际接收面积
      actualUsableArea: '', //实际可用面积
      sourceType: '', // 来源方式字典值，其他 99，租入 4，自建 3，外购 2，划转 1
      typeOptions: (this.sourceTypeOptions || []).slice(1), // 删除"全部"的选项
      takeOverOptions: [
        { title: '是', key: '1' },
        { title: '否', key: '0' },
      ], // 是否接管的选项
      takeOverStatusOptions: [], // 接管时资产状态选项
      objBySourceType: {
        1: [
          'reportBasicInfoDate',
          'houseVerificationDate',
          'reportHouseTransferReqDate',
          'transferApprovalDate',
          'agreementSignDate',
          'reportingVerificationReportDate',
        ],
        2: ['purchaseDate'],
        3: ['deliveryDate', 'completionDate'],
        4: ['leaseInStartDate', 'leaseInEndDate'],
        5: ['escrowStartDate', 'escrowEndDate'],
      }, // 根据来源方式动态展示的日期格式的字段,用于处理详情和提交操作中格式转换
    };
  },

  methods: {
    // 选择经营单位
    unitTree(id, name) {
      this.businessUnit = name;
      this.businessUnitId = id;
    },
    // 获取选择的组织机构
    changeTree(id) {
      this.organIdEdit = id;
    },
    // 查询编码规则
    getProjectCode(id) {
      let obj = {
        organId: id || this.organId,
      };
      this.$api.publicCode.getProjectCode(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          this.form.setFieldsValue({ projectCode: res.data.data });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 获取来源方式，动态展示其他信息模块中的字段
    getSourceType(value) {
      this.sourceType = String(value);
    },

    // 获取接管状态，动态展示其他字段
    getTakeOver(value) {
      this.takeOver = String(value);
    },

    // 提交数据
    handleSubmit(resolve, reject) {
      const api = {
        add: 'saveProjectManageNewProject',
        edit: 'saveProjectManageEditProject',
      };
      this.form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          this.spinning = true;
          const { attachment, organId, type, projectId, objBySourceType, sourceType, takeOver, organIdEdit, organKey, businessUnit, businessUnitId } =
            this;
          console.log(this);
          // 转换日期格式为string
          let dateKeys = objBySourceType[sourceType] || [];
          dateKeys.forEach((key) => {
            let dateValue = values[key];
            values[key] = dateValue ? moment(dateValue).format('YYYY-MM-DD') : '';
          });
          if (String(takeOver) === '1') {
            values.takeOverDate = values.takeOverDate ? moment(values.takeOverDate).format('YYYY-MM-DD') : '';
          }
          let attachArr = attachment.map((m) => {
            const { url: attachmentPath, suffix, name } = m;
            return { attachmentPath, attachmentSuffix: suffix || name.split('.')[1], oldAttachmentName: name, newAttachmentName: name };
          }); // 处理附件格式
          let form = Object.assign({}, { attachment: attachArr, organId, businessUnit, businessUnitId }, values);
          if (type === 'edit') {
            form.projectId = projectId; // 编辑时传入projectId
            // organIdEdit 未编辑的情况会是 undefined
            form.organId = organIdEdit || organKey; // 编辑时传入organId
          }
          this.$api.assets[api[type]](form)
            .then(({ data: res }) => {
              this.spinning = false;
              if (res && String(res.code) === '0') {
                this.$message.success('保存成功');
                return resolve();
              }
              throw res.message || '保存失败';
            })
            .catch((err) => {
              this.spinning = false;
              this.$message.error(err || '保存失败');
              return reject();
            });
        } else {
          reject();
        }
      });
    },

    // 获取编辑时资产项目详情
    queryDetail(type) {
      const api = {
        show: 'queryProjectManageDetailById',
        edit: 'queryProjectManageEditDetailById',
      };
      this.spinning = true;
      this.$api.assets[api[type]]({ projectId: this.projectId })
        .then(({ data: res }) => {
          this.spinning = false;
          if (res && String(res.code) === '0') {
            let {
              attachment,
              organName,
              organId,
              projectName,
              sourceType,
              souceChannelType,
              projectCode,
              takeoverAssetStatus,
              takeOver,
              receiver,
              trusteeshipArea,
              actualReceiveArea,
              actualUsableArea,
              ownershipHandleProblems,
              remark,
              houseTransferHisProblem,
              sourceTypeName,
              takeOverDate,
              takeoverAssetStatusName,
              contractor,
              developers,
              leaseInContractNo,
              thirdPartyCode,
              businessUnit,
              businessUnitId,
              ...others
            } = res.data;
            // 处理附件格式
            let attachArr = attachment.map((m) => {
              return { url: m.attachmentPath, name: m.oldAttachmentName, suffix: m.attachmentSuffix };
            });
            takeOver = String(takeOver);
            sourceType = String(sourceType);
            Object.assign(this, {
              takeOver,
              receiver,
              trusteeshipArea,
              actualReceiveArea,
              actualUsableArea,
              sourceType,
              attachment: attachArr,
              organKey: String(organId), // 保存权属单位id
              organName: organName, // 展示权属单位名称
              businessUnit: businessUnit ? businessUnit : '',
              businessUnitId: businessUnitId ? String(businessUnitId) : '',
            });
            // 转换日期格式为moment
            let formData = {
              businessUnit: type === 'show' ? businessUnit || '无' : businessUnit,
              ownershipHandleProblems: type === 'show' ? ownershipHandleProblems || '无' : ownershipHandleProblems,
              houseTransferHisProblem: type === 'show' ? houseTransferHisProblem || '无' : houseTransferHisProblem,
              projectName,
              sourceType: type === 'show' ? sourceTypeName : sourceType,
              takeOver,
              receiver: type === 'show' ? receiver || '无' : receiver,
              trusteeshipArea: type === 'show' ? trusteeshipArea || '无' : trusteeshipArea,
              actualReceiveArea: type === 'show' ? actualReceiveArea || '无' : actualReceiveArea,
              actualUsableArea: type === 'show' ? actualUsableArea || '无' : actualUsableArea,
              remark: type === 'show' ? remark || '无' : remark,
              souceChannelType,
              projectCode,
              thirdPartyCode: type === 'show' ? thirdPartyCode || '无' : thirdPartyCode,
            };
            if (takeOver === '1') {
              formData.takeoverAssetStatus = type === 'show' ? takeoverAssetStatusName || '无' : String(takeoverAssetStatus || '');
              formData.takeOverDate = takeOverDate ? moment(takeOverDate, 'YYYY-MM-DD') : null;
            }
            if (sourceType === '3') {
              formData.developers = type === 'show' ? developers || '无' : '';
              formData.contractor = type === 'show' ? contractor || '无' : '';
            }
            if (sourceType === '4') {
              formData.leaseInContractNo = type === 'show' ? leaseInContractNo || '无' : '';
            }
            // 转换日期格式为string
            let dateKeys = this.objBySourceType[sourceType] || [];
            dateKeys.forEach((key) => {
              let dateValue = others[key];
              formData[key] = dateValue ? moment(dateValue, 'YYYY-MM-DD') : null;
            });
            return this.$nextTick(function () {
              this.form.setFieldsValue(formData);
            });
          }
          throw res.message || '查询资产项目详情出错';
        })
        .catch((err) => {
          this.spinning = false;
          this.$message.error(err || '查询资产项目详情出错');
        });
    },

    // 初始化复制
    initAction(type) {
      if (!type) {
        return false;
      }
      if (type == 'add' || type == 'edit') {
        Object.assign(this, {
          colSpan: 12,
          isEdit: true,
          initialValue: '', // 编辑时不展示‘无’
        });
        if (type == 'add') {
          // 新增时权属单位名称和Id取自props
          this.organName = this.organTitle;
          this.organKey = this.organId;
          this.getProjectCode();
        } else {
          // 编辑时调用接口查询详情
          this.queryDetail('edit');
        }
      } else {
        Object.assign(this, {
          colSpan: type == 'approval' ? 12 : 8,
          labelCol: type == 'approval' ? { span: 8 } : { span: 9 },
          wrapperCol: type == 'approval' ? { span: 16 } : { span: 15 },
          isEdit: false,
          layout: type == 'approval' ? 'horizontal' : 'inline',
          initialValue: '无',
        });
        this.queryDetail('show');
      }
    },
  },

  created() {
    this.initAction(this.type || 'show');
    queryPlatformDict('TAKEOVER_ASSET_STATUS').then((list) => (this.takeOverStatusOptions = list));
  },

  watch: {
    // 防止审核和编辑操作权限同时存在时切换页面不刷新编辑状态
    type: function (type) {
      this.initAction(type);
    },
  },
};
</script>

<style lang="less" scoped>
.detail_info {
}
.disabled_form {
  /*不可以编辑时覆盖表单组件的默认样式*/
  & /deep/ .ant-form-item {
    width: 100% !important;
    margin-bottom: 8px !important;
    textarea.ant-input-disabled {
      width: 100% !important;
      margin-top: 5px;
    }
    .ant-form-item-required:before {
      content: none;
    }
    .ant-input:disabled {
      border: none;
      color: #49505e;
      cursor: default;
      background-color: #fff;
    }
    .ant-calendar-picker-icon {
      display: none;
    }
    .ant-select-disabled {
      .ant-select-selection {
        border: none;
        background-color: #fff;
        .ant-select-arrow {
          display: none;
        }
        .ant-select-selection-selected-value {
          color: #49505e;
          cursor: default;
        }
      }
    }
  }
}
</style>
