<!--
 * @Author: L
 * @Date: 2020-11-04 14:31:59
 * @LastEditTime: 2020-11-12 18:43:23
 * @Description: 资产交付管理-新增编辑
-->
<template>
  <div class="delivery-newEditor">
    <div class="delivery-newEditor-nav">
      <span class="section-title blue">基础信息</span>
      <a-row class="playground-row">
        <a-form :form="form">
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">交付单名称：</label>
              <a-input
                placeholder="请输入登记单名称"
                :style="allWidth"
                :max="30"
                v-decorator="[
                  'deliveryName',
                  {
                    rules: [{ required: true, max: 30, whitespace: true, message: '请输入交付单名称(不超过30字符)' }],
                    initialValue: newEditSingleData.deliveryName,
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">所属组织机构：</label>
              <a-input
                placeholder="请输入组织机构"
                :style="allWidth"
                :disabled="true"
                v-decorator="['organName', { rules: [], initialValue: organName }]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">资产项目：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产项目"
                v-decorator="['projectId', { rules: [{ required: true, message: '请选择资产项目' }], initialValue: newEditSingleData.projectId }]"
                :allowClear="false"
                :filterOption="filterOption"
                :options="$addTitle(projectIdData)"
                @change="projectIdFn"
                notFoundContent="没有查询到资产项目"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" label="资产类型：" v-bind="formItemLayout">
              <label slot="label">资产类型：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产类型"
                v-decorator="['assetType', { rules: [{ required: true, message: '请选择资产类型' }], initialValue: newEditSingleData.assetType }]"
                :allowClear="false"
                :options="$addTitle(assetTypeData)"
                :filterOption="filterOption"
                @change="assetTypeFn"
                notFoundContent="没有查询到资产类型"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" label="交付类型：" v-bind="formItemLayout">
              <label slot="label">交付类型：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择交付类型"
                v-decorator="[
                  'deliveryType',
                  { rules: [{ required: true, message: '请选择交付类型' }], initialValue: newEditSingleData.deliveryType },
                ]"
                :allowClear="false"
                :options="$addTitle(deliveryTypeOpt)"
                :filterOption="filterOption"
                notFoundContent="没有查询到交付类型"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">交付单位：</label>
              <a-input
                placeholder="请输入交付单位"
                :style="allWidth"
                :max="30"
                v-decorator="[
                  'deliveryCompany',
                  {
                    rules: [{ required: true, max: 30, whitespace: true, message: '请输入交付单位(不超过30字符)' }],
                    initialValue: newEditSingleData.deliveryCompany,
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">交付日期：</label>
              <a-date-picker
                v-decorator="[
                  'deliveryDate',
                  { rules: [{ required: true, message: '请选择交付日期' }], initialValue: newEditSingleData.deliveryDate },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">结束日期：</label>
              <a-date-picker
                v-decorator="['endDate', { rules: [{ required: false, message: '请选择结束日期' }], initialValue: newEditSingleData.endDate }]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item :colon="false" v-bind="formItemTextarea">
              <label slot="label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label>
              <a-textarea
                placeholder="请输入备注"
                :style="widthBox"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-decorator="[
                  'remark',
                  { rules: [{ required: false, max: 200, message: '请输入问题备注(不超过200字符)' }], initialValue: newEditSingleData.remark },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item :colon="false" v-bind="formItemTextarea">
              <label slot="label">上传附件：</label>
              <UploadFile v-model="newEditSingleData.files" type="all" />
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>
      <div class="tab-nav">
        <span class="section-title blue">资产明细</span>
        <div class="button-box">
          <div class="fl">
            交付资产数量：{{ assetChangeCount || 0 }}个<span v-if="!isSelectedEquipment">，合计交付面积：{{ deliveryArea || '0' }}㎡</span>
          </div>
          <div class="fr">
            <SG-Button class="mr10" type="primary" weaken @click="addTheAsset">添加资产</SG-Button>
            <SG-Button :disabled="selectedRowKeys.length === 0" type="primary" weaken @click="deleteFn">删除</SG-Button>
          </div>
        </div>
        <div class="table-layout-fixed" :class="{ 'table-border': tableData.length != 0 }">
          <a-table
            :scroll="{ y: 450 }"
            :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
            :columns="columnsCom"
            :dataSource="tableData"
            size="middle"
            :pagination="false"
          >
            <template slot="deliveryArea" slot-scope="text, record">
              <a-input-number
                size="small"
                :min="0"
                :max="+record.assetArea"
                :step="1.0"
                :precision="2"
                @change="deliveryChange"
                v-model="record.deliveryArea"
              />
            </template>
            <template slot="remark" slot-scope="text, record">
              <a-input placeholder="请输入备注" :max="200" v-model="record.remark" />
            </template>
          </a-table>
        </div>
        <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      </div>
    </div>
    <FormFooter style="border: none" location="fixed">
      <div>
        <SG-Button type="primary" @click="save('save')">提交</SG-Button>
        <SG-Button style="margin-left: 12px" type="primary" weaken @click="save('draft')">保存草稿</SG-Button>
        <SG-Button @click="cancel">取消</SG-Button>
      </div>
    </FormFooter>
    <!-- 选择资产 -->
    <AssetBundlePopover
      judgmentType="delivery"
      :changeType="true"
      :organId="organId"
      queryType="1"
      ref="assetBundlePopover"
      @status="status"
    ></AssetBundlePopover>
  </div>
</template>

<script>
import { calc, debounce } from '@/utils/utils';
import AssetBundlePopover from 'src/views/common/assetBundlePopover';
import noDataTips from '@/components/noDataTips';
import FormFooter from '@/components/FormFooter';
import moment from 'moment';
const conditionalJudgment = [undefined, null, ''];
const columns = [
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: '10%',
  },
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: '10%',
  },
  {
    title: '权属单位',
    dataIndex: 'organName',
    width: '10%',
  },
  {
    title: '所属资产项目',
    dataIndex: 'projectName',
    width: '10%',
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: '10%',
  },
  {
    title: '资产分类',
    dataIndex: 'assetCategoryName',
    width: '8%',
  },
  {
    title: '资产面积',
    dataIndex: 'assetArea',
    width: '6%',
  },
  {
    title: '资产位置',
    dataIndex: 'address',
    width: '10%',
  },
  {
    title: '交付面积(㎡)',
    dataIndex: 'deliveryArea',
    align: 'center',
    scopedSlots: { customRender: 'deliveryArea' },
  },
  {
    title: '备注',
    dataIndex: 'remark',
    align: 'center',
    scopedSlots: { customRender: 'remark' },
  },
];
const newEditSingleData = {
  deliveryName: '', // 交付名称
  assetType: undefined, // 资产类型
  projectId: undefined, // 资产项目
  deliveryType: undefined, // 交付类型
  deliveryCompany: '', // 交付单位
  deliveryDate: undefined, // 交付日期
  endDate: undefined, // 截止日期
  remark: '', // 备注
  files: [],
};
export default {
  components: { AssetBundlePopover, noDataTips, FormFooter },
  props: {},
  data() {
    return {
      moment,
      assetType: '',
      deliveryId: '', // 交付id
      deliveryArea: '', // 交付面积
      assetChangeCount: '', // 资产数量
      setType: '', // 新增编辑
      selectedRowKeys: [], // 表格选择的数据
      checkedData: [],
      organIdData: [], // 父组件传进来的数据
      columns, // 表头
      tableData: [], // 表格内容
      organId: '', // 机构id
      organName: '', // 所属机构
      saveValues: '',
      assetTypeData: [], // 资产类型
      projectIdData: [], // 资产项目
      newEditSingleData: { ...newEditSingleData },
      form: this.$form.createForm(this),
      allWidth: 'width: 160px',
      widthBox: 'width: 80%',
      deliveryTypeOpt: [
        { value: '1', label: '交付物业' },
        { value: '2', label: '交付运营' },
      ],
      formItemTextarea: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 },
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
    };
  },
  computed: {
    isSelectedEquipment() {
      return String(this.assetType) === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT;
    },
    columnsCom() {
      if (this.isSelectedEquipment) {
        const arr = ['deliveryArea', 'assetArea'];
        return this.columns.filter((ele) => !arr.includes(ele.dataIndex || ele.key));
      } else {
        return this.columns;
      }
    },
  },
  created() {
    this.organIdData = JSON.parse(this.$route.query.record);
    this.organId = this.organIdData[0].organId;
    this.organName = this.organIdData[0].organName;
    this.setType = this.$route.query.setType; // 判断新增修改
  },
  mounted() {
    if (this.setType === 'edit') {
      this.deliveryId = this.organIdData[0].deliveryId;
      Promise.all([
        this.editFn(),
        this.getDeliveryDetailList(), // 获取明细
        this.getDeliveryDetailListStatistics(), // 获取汇总
        this.attachment(), // 获取附件
      ]).then((res) => {});
    }
    this.getObjectKeyValueByOrganIdFn(); // 获取资产项目
    this.platformDictFn(); // 获取资产类型
  },
  methods: {
    // 编辑回填基础信息
    editFn() {
      this.$api.delivery.getDeliveryById({ deliveryId: this.deliveryId }).then((res) => {
        if (Number(res.data.code) === 0) {
          let obj = res.data.data;
          let o = {
            deliveryName: '', // 交付名称
            assetType: undefined, // 资产类型
            projectId: undefined, // 资产项目
            deliveryType: undefined, // 交付类型
            deliveryCompany: '', // 交付单位
            deliveryDate: undefined, // 交付日期
            endDate: undefined, // 截止日期
            remark: '', // 备注
          };
          for (var key in o) {
            if (['assetType', 'deliveryType'].includes(key)) {
              o[key] = String(obj[key]);
            } else if (['deliveryDate', 'endDate'].includes(key)) {
              o[key] = obj[key] ? moment(obj[key], 'YYYY-MM-DD') : undefined;
            } else {
              o[key] = obj[key];
            }
          }
          this.form.setFieldsValue(o);
          this.assetType = obj.assetType;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查资产明细
    getDeliveryDetailList() {
      this.$api.delivery.getDeliveryDetailList({ deliveryId: this.deliveryId }).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          this.checkedData = [];
          data.forEach((item) => {
            item.key = item.assetId;
            item.address = item.pasitionString;
            item.assetCategoryName = item.assetObjectTypeName;
            item.transferArea = item.oldTransferArea;
            item.transferOperationArea = item.oldTransferOperationArea;
            this.checkedData.push(item.assetId);
          });
          this.tableData = data;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查汇总信息
    getDeliveryDetailListStatistics() {
      this.$api.delivery.getDeliveryDetailListStatistics({ deliveryId: this.deliveryId }).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          this.assetChangeCount = data.assetChangeCount; // 数量
          this.deliveryArea = data.deliveryArea; // 面积
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 附件查询
    attachment() {
      let obj = {
        objectId: this.deliveryId, // 交付id
        objectType: '18', // 类型：交付信息18
      };
      this.$api.basics.attachment(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let files = [];
          if (data && data.length > 0) {
            data.forEach((item) => {
              files.push({
                url: item.attachmentPath,
                name: item.newAttachmentName,
              });
            });
          }
          this.newEditSingleData.files = files;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 提交
    save(str) {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.tableData.length === 0) {
            this.$message.info('请选择资产明细');
            return;
          }
          if (values.endDate) {
            let start = values.deliveryDate.format('YYYY-MM-DD');
            let endDate = values.endDate.format('YYYY-MM-DD');
            if (endDate < start) {
              this.$message.info('结束日期不能小于交付日期');
              return;
            }
          }
          let assetDetailList = this.tableData.map((item) => {
            return {
              deliveryDetailId: conditionalJudgment.includes(item.deliveryDetailId) ? '' : item.deliveryDetailId, //明细Id 修改时必填
              deliveryId: conditionalJudgment.includes(item.deliveryId) ? '' : item.deliveryId, // 修改时必填
              assetId: item.assetId, // 资产id
              assetType: item.assetType, // 资产类型
              assetCode: item.assetCode, // 资产编码
              organId: item.organId, // 组织机构Id
              projectId: item.projectId, // 资产项目Id
              assetObjectId: item.assetObjectId, // 资产对象id
              objectType: item.objectType, // 资产分类
              assetArea: item.assetArea, // 资产面积
              remark: item.remark, // 备注，填的
              deliveryArea: item.deliveryArea || 0, // 交付面积，填的
              oldTransferArea: item.transferArea || '', // 原交付物业面积(转物业面积)
              oldTransferOperationArea: item.transferOperationArea || '', // 原交付运营面积(原转运营面积)
            };
          });
          // 非设备类型时 且 tableData 有数据 且每一个数据中的交付面积，都不为 undefined "" null 0
          if (
            !this.isSelectedEquipment &&
            this.tableData.length &&
            this.tableData.some((ele) => [...conditionalJudgment, 0].includes(ele.deliveryArea))
          ) {
            this.$message.info('请填写交付面积');
            return;
          }
          let files = [];
          if (this.newEditSingleData.files.length > 0) {
            this.newEditSingleData.files.forEach((list) => {
              files.push({
                attachmentPath: list.url,
                oldAttachmentName: list.name,
              });
            });
          }
          let obj = {
            deliveryId: this.deliveryId, // 交付ID
            deliveryName: values.deliveryName, // 交付名称
            organId: this.organId, // 组织机构id
            assetType: values.assetType, // 资产类型
            projectId: values.projectId, // 资产项目Id
            deliveryType: values.deliveryType, // 交付类型 取值1交付物业、2交付运营
            deliveryCompany: values.deliveryCompany, // 交付单位
            deliveryDate: values.deliveryDate === undefined ? '' : `${values.deliveryDate.format('YYYY-MM-DD')}`, // 交付日期
            endDate: values.endDate === undefined ? '' : `${values.endDate.format('YYYY-MM-DD')}`, // 截止日期
            remark: values.remark, // 备注
            attachmentList: files,
            assetChangeCount: this.assetChangeCount, // 资产数量
            assetDetailList: assetDetailList, // 资产明细
            approvalStatus: str === 'draft' ? 0 : 1, // 状态
          };
          let loadingName = this.SG_Loding('保存中...');
          this.$api.delivery.saveOrUpdateDelivery(obj).then((res) => {
            if (Number(res.data.code) === 0) {
              this.DE_Loding(loadingName).then(() => {
                this.$SG_Message.success('提交成功');
                this.$router.push({
                  path: '/assetDelivery',
                  query: { refresh: true },
                });
              });
            } else {
              this.DE_Loding(loadingName).then(() => {
                this.$message.error(res.data.message);
              });
            }
          });
        }
      });
    },
    // 监听输入的值
    deliveryChange() {
      this.debounceMothed();
    },
    // 防抖函数计算交付面积总计
    debounceMothed: debounce(function () {
      this.calcFn();
    }, 200),
    // 每次再次计算统计的值
    calcFn() {
      if (this.tableData.length > 0) {
        this.deliveryArea = this.tableData.reduce((sun, current) => calc.add(sun, current.deliveryArea || 0), 0);
      } else {
        this.deliveryArea = 0;
      }
    },
    // 取消
    cancel() {
      this.$router.push({ path: '/assetDelivery' });
    },
    // 表格选择的数组
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 删除
    deleteFn() {
      let _this = this;
      this.$confirm({
        title: '提示',
        content: '确认要删除该条记录吗？',
        onOk() {
          let arr = [];
          _this.tableData = _this.tableData.filter((m) => !_this.selectedRowKeys.includes(m.assetId));
          _this.tableData.forEach((item) => {
            arr.push(item.assetId);
          });
          _this.checkedData = arr;
          _this.assetChangeCount = _this.tableData.length;
          _this.calcFn();
          _this.selectedRowKeys = [];
        },
      });
    },
    // 确定拿到数据
    status(val, data) {
      this.checkedData = [...val];
      data.forEach((item) => {
        item.key = item.assetId;
        item.deliveryArea = item.assetArea; // 交付面积默认为资产面积
      });
      this.tableData = data;
      this.assetChangeCount = this.tableData.length;
      this.calcFn();
      this.$refs.assetBundlePopover.show = false;
    },
    // 添加资产
    addTheAsset() {
      if (!this.form.getFieldValue('projectId')) {
        this.$message.info('请先选择资产项目');
        return;
      }
      if (!this.form.getFieldValue('assetType')) {
        this.$message.info('请先选择资产类型');
        return;
      }
      this.$refs.assetBundlePopover.redactCheckedDataFn(
        this.checkedData,
        this.form.getFieldValue('projectId'),
        this.form.getFieldValue('assetType'),
        this.tableData
      );
      this.$refs.assetBundlePopover.show = true;
    },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    // 平台字典获取资产类型
    platformDictFn() {
      let obj = {
        code: 'asset_type',
      };
      this.$api.assets.platformDict(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          this.assetTypeData = data.map((item) => {
            return {
              label: item.name,
              value: item.value,
              key: item.value,
            };
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.organId,
        projectName: '',
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let arr = [];
          data.forEach((item) => {
            arr.push({
              label: item.projectName,
              value: item.projectId,
              key: item.projectId,
            });
          });
          this.projectIdData = [...arr];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 项目监听
    projectIdFn() {
      this.tableData = [];
      this.checkedData = [];
    },
    // 资产类型监听
    assetTypeFn(value) {
      this.assetType = value;
      this.tableData = [];
      this.checkedData = [];
    },
  },
};
</script>
<style lang="less" scoped>
.delivery-newEditor {
  padding-bottom: 70px;
  .delivery-newEditor-nav {
    padding: 42px 106px 70px 94px;
    .playground-row {
      margin-top: 20px;
    }
    .tab-nav {
      margin-top: 40px;
      .button-box {
        overflow: hidden;
        margin-bottom: 10px;
        .fl {
          font-size: 14px;
          line-height: 32px;
        }
      }
    }
  }
}
</style>
