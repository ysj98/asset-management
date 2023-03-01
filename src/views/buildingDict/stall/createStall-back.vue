<!--
 * @Description: 新建 编辑车场
-->
<template>
  <div class="landInfo-create-page">
    <div class="create-form">
      <a-form :form="form" @submit="handleSave" layout="horizontal">
        <!-- 基础信息 -->
        <div class="page-item">
          <div class="mb30">
            <SG-Title noMargin title="基础信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-item :required="true" label="所属机构" v-bind="formItemLayout">
                  <treeSelect
                    ref="organTopRef"
                    :defaultDisplay="false"
                    :typeFilter="typeFilter"
                    @changeTree="changeTree"
                    placeholder="请选择所属机构"
                    :defaultOrganName="organName"
                    :style="allStyle"
                    :allowClear="false"
                    v-decorator="[
                      'organId',
                      {
                        initialValue: '' || undefined,
                        rules: [{ required: true, message: '请选择所属机构' }],
                      },
                    ]"
                  >
                  </treeSelect>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车场名称" :required="true" v-bind="formItemLayout">
                  <a-select
                    show-search
                    :style="allWidth"
                    @search="handleSearch"
                    @change="handleParkChange"
                    placeholder="请选择车场名称"
                    :options="$addTitle(placeArr)"
                    :default-active-first-option="false"
                    v-decorator="['placeId', { rules: [{ required: true, message: '请选择车场名称' }] }]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="区域名称" v-bind="formItemLayout">
                  <a-select
                    :style="allWidth"
                    :options="$addTitle(placeAreaArr)"
                    placeholder="请选择区域名称"
                    :default-active-first-option="false"
                    v-decorator="['parkingAreaId', { initialValue: undefined, rules: [{ required: true, message: '请选择区域名称' }] }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="车位名称" v-bind="formItemLayout">
                  <a-input
                    :style="allWidth"
                    :maxLength="30"
                    placeholder="请输入车位名称"
                    v-decorator="[
                      'name',
                      {
                        initialValue: undefined,
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '请输入车位名称',
                          },
                        ],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车位编码" v-bind="formItemLayout">
                  <a-input
                    :style="allWidth"
                    placeholder="请输入车位编码"
                    :maxLength="30"
                    v-decorator="[
                      'code',
                      {
                        initialValue: undefined,
                        rules: [
                          {
                            required: true,
                            whitespace: true,
                            message: '请输入车位编码',
                          },
                        ],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="交付时间" v-bind="formItemLayout">
                  <a-date-picker
                    :style="allWidth"
                    placeholder="请选择交付时间"
                    :getPopupContainer="getPopupContainer"
                    v-decorator="['deliverDate', { initialValue: '' }]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8" v-if="routeQuery.type !== 'edit'">
                <a-form-item label="车位用途" v-bind="formItemLayout">
                  <dict-select
                    :style="allWidth"
                    :dict-options="parkingUsageOption"
                    v-decorator="[
                      'parkingUsage',
                      {
                        initialValue: '' || undefined,
                        rules: [{ required: true, message: '请选择车位用途' }],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车位类型" v-bind="formItemLayout">
                  <dict-select
                    :style="allWidth"
                    menu-code="PARKING_OBJ_TYPE"
                    @change="handleCarTypeChange"
                    v-decorator="[
                      'objType',
                      {
                        initialValue: '' || undefined,
                        rules: [{ required: true, message: '请选择车位类型' }],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8" v-if="carType">
                <a-form-item label="车位状态" v-bind="formItemLayout">
                  <dict-select
                    :style="allWidth"
                    :menu-code="carType"
                    v-decorator="[
                      'objStatus',
                      {
                        initialValue: formInfo.objStatus,
                        rules: [{ required: true, message: '请选择车位状态' }],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="建筑面积(㎡)" v-bind="formItemLayout">
                  <a-input-number
                    :min="0"
                    :max="999999.9999"
                    :style="allWidth"
                    v-decorator="[
                      'propertyArea',
                      {
                        initialValue: '' || undefined,
                        rules: [{ required: true, message: '请输入建筑面积' }],
                      },
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="使用面积(㎡)" v-bind="formItemLayout">
                  <a-input-number :min="0" :max="999999.9999" :style="allWidth" v-decorator="['useArea', { initialValue: '' || undefined }]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="公摊面积(㎡)" v-bind="formItemLayout">
                  <a-input-number :min="0" :max="999999.9999" :style="allWidth" v-decorator="['shareArea']" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 文本框 -->
                <a-form-item label="备注" v-bind="formItemLayout2">
                  <a-textarea :maxLength="200" v-decorator="['description', { initialValue: '' || undefined }]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="图片" v-bind="formItemLayout2">
                  <SG-UploadFile :customDownload="customDownload" :customUpload="customUpload" v-model="formInfo.parkingImg" :max="1" />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-form>
    </div>
    <FormFooter style="border: none">
      <SG-Button class="mr2" @click="handleSave" type="primary">提交</SG-Button>
      <SG-Button @click="handleCancel">取消</SG-Button>
    </FormFooter>
  </div>
</template>
<script>
import FormFooter from '@/components/FormFooter.vue';
import dictMixin from '../dictMixin.js';
import TreeSelect from '@/views/common/treeSelect';
import { typeFilter } from '@/views/buildingDict/buildingDictConfig';
import { queryTopOrganByOrganID } from '@/views/buildingDict/publicFn';
import { carTypeMenu, parkingUsageOption, parkTypeOpt } from './dict';
import DictSelect from '../../common/DictSelect';
import { stallApiDetail } from '../../../api/building';

const allWidth = { width: '100%' };
const allWidth1 = { width: '100px', marginRight: '10px', flex: '0 0 120px' };
const allWidth2 = { width: '250px', flex: 1 };
// 页面跳转
const operationTypes = {
  index: '/buildingDict',
};
export default {
  components: {
    DictSelect,
    FormFooter,
    TreeSelect,
  },
  mixins: [dictMixin],
  data() {
    return {
      parkingUsageOption,
      parkTypeOpt, // 全部车场
      carTypeMenu, // 车位类型列表
      carType: undefined, // 车位类型
      organId: '',
      organName: '',
      formInfo: {
        // 表单
        organId: '', // '机构Id',
        placeId: '', // '车场Id',
        name: '', // '车位名称',
        code: '', // '车位编码',
        deliverDate: '',
        objType: '', // '车位类型',
        objStatus: '', // '车位状态',
        parkingUsage: '', //'车位用途',
        parkingAreaId: '', // '区域Id',
        useArea: '', // 使用面积
        shareArea: '', //'公摊面积',
        propertyArea: '', // '产权面积',
        parkingImg: [],
        description: '', // '备注',
        // parkingAreaUnits: '' // '面积单位'
      },
      placeArr: [], // 车场列表
      placeAreaArr: [], // 区域列表
      allStyle: 'width: 100%;',
      typeFilter,
      allWidth,
      allWidth1,
      allWidth2,
      communityIdOpt: [], // 选择项目
      routeQuery: {
        // 路由传入数据
        type: 'create', // 页面类型
        placeId: '', // 车场Id
        parkingId: '', // 车位Id
        organName: '',
        organId: '',
      },
      bussType: 'blankDir',
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      },
      formItemLayout2: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      },
      formItemLayoutTable: {
        labelCol: {
          xs: { span: 0 },
          sm: { span: 0 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 22 },
        },
      },
      formItemLayoutGeo: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 21 },
        },
      },
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
    window.fff = this.form;
  },
  mounted() {
    let { organName, organId, type, placeId, parkingId } = this.$route.query;
    Object.assign(this, {
      routeQuery: { organName, organId, type, placeId, parkingId },
    });
    this.init();
  },
  methods: {
    async changeTree(value, title) {
      this.organId = value;
      this.organName = title;
      this.parkApiList({ organId: value });
      this.placeAreaArr = []; // 清空区域
      this.form.resetFields(['placeId', 'parkingAreaId']);
    },
    beforeSubmit(value) {
      return {
        ...value,
        parkingImg: this.formInfo.parkingImg.map((node) => node.url).join(','),
      };
    },
    // 确定
    handleSave() {
      this.form.validateFields((err, values) => {
        if (err) {
          return;
        }
        console.log(values);
        const data = this.beforeSubmit(values);
        if (this.routeQuery.type === 'create') {
          this.stallApiInsert(data);
        } else if (this.routeQuery.type === 'edit') {
          this.stallApiEdit(data);
        }
      });
    },
    // 取消
    handleCancel() {
      this.$router.push({ path: '/buildingDict', query: { showKey: 'stall' } });
    },
    // 车场搜索
    handleSearch(key) {
      this.parkApiList({ nameOrCode: key });
    },
    // 车场 变化查询区域
    handleParkChange(ev) {
      const params = {
        placeId: ev,
        organId: this.organId,
      };
      this.form.resetFields(['parkingAreaId']);
      this.parkAreaApiList(params);
    },
    // 车位类型变化
    handleCarTypeChange(ev) {
      this.form.resetFields(['objStatus']);
      this.formInfo.objStatus = '';
      this.checkCarType(ev);
    },
    checkCarType(ev) {
      switch (Number(ev)) {
        case 0: // 临时
        case 1: // 固定
          this.carType = this.carTypeMenu.PARKING_OBJ_STATUS;
          break;
        case 2: // 产权
          this.carType = this.carTypeMenu.PROPERTY_PARKING_OBJ_STATUS;
          break;
        default:
          this.carType = undefined;
          return;
      }
    },
    // 请求项目
    queryCommunityListByOrganId(organTopId) {
      let data = {
        organId: organTopId,
      };
      this.$api.basics.queryCommunityListByOrganId(data).then((res) => {
        if (res.data.code === '0') {
          let result = res.data.data || [];
          let resultArr = result.map((item) => {
            return {
              label: item.name,
              value: item.communityId,
              ...item,
            };
          });
          this.communityIdOpt = resultArr;
        }
      });
    },
    getPopupContainer(e) {
      return e.parentElement;
    },
    // 改变 所属机构时,做部分重置
    initPreData() {},
    // 初始化
    async init() {
      this.$nextTick(() => {
        this.form.setFieldsValue(this.formInfo);
      });
      if (this.routeQuery.type === 'edit') {
        await this.stallApiDetail({
          placeId: this.routeQuery.placeId,
          parkingId: this.routeQuery.parkingId,
        });
      }
    },
    /* *****************接口相关**************** */
    // 查询 车场列表
    parkApiList(data) {
      if (!this.organId) {
        this.$message.error('请选择所属机构');
        return;
      }
      this.placeArr = [];
      const params = {
        ...data,
        onlyCurrentNode: 1,
        organId: this.organId,
        pageNo: 1,
        pageLength: 999,
      };
      this.$api.building.parkApiList(params).then(({ data: res }) => {
        if (res.code === '0') {
          let result = res.data.resultList || [];
          this.placeArr = result.map((item) => ({
            value: item.placeId,
            label: item.placeName,
          }));
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查询 区域
    parkAreaApiList(data) {
      this.placeAreaArr = [];
      this.$api.building.parkApiDetail(data).then((res) => {
        this.loading = false;
        if (res.data.code === '0') {
          this.formInfo.areaArray = [];
          this.placeAreaArr = (res.data.data.areaArray || []).map((item) => ({
            value: item.parkingAreaId,
            label: item.areaName,
          }));
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 查询 车位详情
    async stallApiDetail(data) {
      const params = {
        ...data,
      };
      let loadingName = this.SG_Loding('加载中...');
      try {
        const { data: res } = await stallApiDetail(params);
        if (res.code === '0') {
          this.form.setFieldsValue(this.afterStallApiList(res.data));
        }
      } finally {
        this.DE_Loding(loadingName);
      }
    },
    afterStallApiList(data) {
      this.formInfo.parkingImg = (data.parkingImg || '')
        .split(',')
        .filter((item) => item)
        .map((item) => ({
          url: item,
          name: item.split('/').pop(),
        }));
      this.placeArr = [
        {
          label: data.placeName,
          value: data.placeId,
        },
      ];
      this.placeAreaArr = [
        {
          label: data.parkingAreaName,
          value: data.parkingAreaId,
        },
      ];
      this.organName = data.organName;
      this.organId = data.organId;
      this.formInfo.objStatus = data.objStatus;
      this.checkCarType(data.objType);
      return {
        ...data,
        organId: data.organId,
        parkingAreaId: data.parkingAreaId,
        placeId: data.placeId,
      };
    },
    stallApiInsert(data) {
      const params = {
        ...data,
      };
      let loadingName = this.SG_Loding('新增中...');
      this.$api.building.stallApiInsert(params).then(
        (res) => {
          this.DE_Loding(loadingName).then(() => {
            if (res.data.code === '0') {
              this.$SG_Message.success('新增车位成功');
              this.$router.push({
                path: '/buildingDict',
                query: { showKey: 'stall', refresh: true },
              });
            } else {
              this.$message.error(res.data.message);
            }
          });
        },
        () => {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error('新增失败！');
          });
        }
      );
    },
    stallApiEdit(data) {
      const params = {
        ...data,
        parkingId: this.routeQuery.parkingId,
      };
      let loadingName = this.SG_Loding('编辑中...');
      this.$api.building.stallApiEdit(params).then(
        (res) => {
          this.DE_Loding(loadingName).then(() => {
            if (res.data.code === '0') {
              this.$SG_Message.success('编辑车位成功');
              this.$router.push({
                path: '/buildingDict',
                query: { showKey: 'stall', refresh: true },
              });
            } else {
              this.$message.error(res.data.message);
            }
          });
        },
        () => {
          this.DE_Loding(loadingName).then(() => {
            this.$SG_Message.error('编辑失败！');
          });
        }
      );
    },
  },
};
</script>
<style lang="less" scoped>
.landInfo-create-page {
  position: relative;
  height: calc(100vh - 40px);
  overflow: hidden;
}

.create-form {
  padding: 42px 100px 70px 94px;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
  height: 100%;
}
</style>
