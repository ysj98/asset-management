<!--
 * @Date: 2019-11-09 16:13:11
 * @Author: chen han
 * @Description: 新建楼栋，编辑楼栋，删除楼栋
 -->
<template>
  <div class="createBuilding-page">
    <div class="form-box">
      <div class="title-box">
        <SG-Title noMargin :title="title" />
      </div>
      <!-- 表单部分 -->
      <div>
        <a-form :form="form" @submit="handleSave" layout="horizontal">
          <a-row>
            <a-col v-bind="formSpan">
              <a-form-item :required="true" label="所属机构" v-bind="formItemLayout">
                <treeSelect
                  ref="organTopRef"
                  :defaultDisplay="false"
                  :typeFilter="typeFilter"
                  @changeTree="changeTree"
                  placeholder="请选择所属机构"
                  :defaultOrganName="organNameMain"
                  :style="allStyle"
                  :value="organIdMain"
                  :allowClear="false"
                >
                </treeSelect>
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="楼栋名称" v-bind="formItemLayout">
                <a-input
                  :style="allWidth"
                  v-decorator="['name', { initialValue: '' || undefined, rules: [{ required: true, whitespace: true, message: '请输入楼栋名称' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="运营项目" v-bind="formItemLayout">
                <a-select
                  :style="allWidth"
                  :disabled="communityIdDisabled"
                  :getPopupContainer="getPopupContainer"
                  @change="communityIdChange"
                  :placeholder="type === 'create' ? '请选择' : '无'"
                  showSearch
                  optionFilterProp="children"
                  :options="$addTitle(communityIdOpt)"
                  :allowClear="false"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到数据"
                  v-decorator="['communityId']"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="楼栋别名" v-bind="formItemLayout">
                <a-input
                  :style="allWidth"
                  v-decorator="[
                    'aliasName',
                    { initialValue: '' || undefined, rules: [{ required: true, whitespace: true, message: '请输入楼栋名称' }] },
                  ]"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="楼栋编码" v-bind="formItemLayout">
                <a-input :style="allWidth" v-decorator="['code', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="房屋数量" v-bind="formItemLayout">
                <a-input-number
                  :min="0"
                  :max="9999999"
                  :style="allWidth"
                  v-decorator="['houseNum', { initialValue: '' || undefined, rules: [{ pattern: /^[0-9]*$/, message: '请输入整数' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="承建商" v-bind="formItemLayout">
                <a-input :maxLength="30" :style="allWidth" v-decorator="['contractor', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="开发商" v-bind="formItemLayout">
                <a-input :maxLength="30" :style="allWidth" v-decorator="['developer', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="楼高(m)" v-bind="formItemLayout">
                <a-input-number :style="allWidth" v-decorator="['buildHeight', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="建筑面积(㎡)" v-bind="formItemLayout">
                <a-input-number :precision="4" :max="999999.9999" :style="allWidth" v-decorator="['builtArea', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="使用面积(㎡)" v-bind="formItemLayout">
                <a-input-number :min="0" :max="999999.9999" :style="allWidth" v-decorator="['useArea', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="套内面积(㎡)" v-bind="formItemLayout">
                <a-input-number :precision="4" :min="0" :style="allWidth" v-decorator="['innerArea', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="楼栋类型" v-bind="formItemLayout">
                <a-select
                  :style="allWidth"
                  :getPopupContainer="getPopupContainer"
                  placeholder="请选择楼栋类型"
                  showSearch
                  optionFilterProp="children"
                  :options="$addTitle(buildTypeOpt)"
                  :allowClear="false"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到数据"
                  v-decorator="['buildType', { rules: [{ required: true, whitespace: true, message: '请选择楼栋类型' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="楼栋用途" v-bind="formItemLayout">
                <a-select
                  :style="allWidth"
                  :getPopupContainer="getPopupContainer"
                  placeholder="请选择楼栋用途"
                  showSearch
                  optionFilterProp="children"
                  :options="$addTitle(useTypeOpt)"
                  :allowClear="true"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到数据"
                  v-decorator="['useType', { rules: [{ required: false, whitespace: true, message: '请选择楼栋用途' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="建筑形态" v-bind="formItemLayout">
                <!-- 房屋建筑形态 -->
                <a-select
                  showSearch
                  placeholder="请选择建筑形态"
                  optionFilterProp="children"
                  :style="allWidth"
                  :options="$addTitle(houseCategoryOpt)"
                  :allowClear="false"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到数据"
                  v-decorator="['buildHouseType', { rules: [{ required: false, whitespace: true, message: '请选择建筑形态' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="地上层高(m)" v-bind="formItemLayout">
                <a-input-number :min="0" :max="999.99" :style="allWidth" v-decorator="['upGroundHigh', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="地下层高(m)" v-bind="formItemLayout">
                <a-input-number :min="0" :max="999.99" :style="allWidth" v-decorator="['downGroundHigh', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="建筑结构" v-bind="formItemLayout">
                <a-select
                  :style="allWidth"
                  :getPopupContainer="getPopupContainer"
                  placeholder="请选择建筑结构"
                  showSearch
                  optionFilterProp="children"
                  :options="$addTitle(buildStructOpt)"
                  :allowClear="false"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到数据"
                  v-decorator="['buildStruct', { rules: [{ required: true, message: '请选择楼栋建筑结构' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="总楼层" v-bind="formItemLayout">
                <a-input-number :style="allWidth" v-decorator="['buildFloor', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="地上层数" v-bind="formItemLayout">
                <a-input-number :style="allWidth" v-decorator="['upFloorNum', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="地下层数" v-bind="formItemLayout">
                <a-input-number :style="allWidth" v-decorator="['downFloorNum', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="地理位置" v-bind="formItemLayout2">
                <div class="address-box">
                  <a-select
                    :style="allWidth1"
                    placeholder="省"
                    :getPopupContainer="getPopupContainer"
                    showSearch
                    optionFilterProp="children"
                    :options="$addTitle(provinceOpt)"
                    :allowClear="false"
                    @change="(e, val) => cityOrRegionChange(e, val, 'province')"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="[
                      'province',
                      { initialValue: '' || undefined, rules: [{ required: true, message: '请选择省' }, { validator: validateAddress }] },
                    ]"
                  />
                  <a-select
                    :style="allWidth1"
                    placeholder="市"
                    :getPopupContainer="getPopupContainer"
                    showSearch
                    optionFilterProp="children"
                    :options="$addTitle(cityOpt)"
                    v-model="city"
                    :allowClear="false"
                    @change="(e, val) => cityOrRegionChange(e, val, 'city')"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                  />
                  <a-select
                    :style="allWidth1"
                    placeholder="区/县"
                    :getPopupContainer="getPopupContainer"
                    showSearch
                    optionFilterProp="children"
                    v-model="region"
                    @change="(e, val) => cityOrRegionChange(e, val, 'region')"
                    :options="$addTitle(regionOpt)"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                  />
                  <!-- @input="getLL" -->
                  <a-input :maxLength="100" :disabled="true" v-model="address" :style="allWidth2" placeholder="详细地址" />
                </div>
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="经纬度" v-bind="formItemLayout">
                <a-input
                  :style="allWidth"
                  v-decorator="[
                    'lngAndlat',
                    { initialValue: '' || undefined, rules: [{ required: true, whitespace: true, message: '请选择或输入经纬度' }] },
                  ]"
                >
                  <a-icon type="plus" @click="showSelectMap" class="pointer" slot="suffix" />
                </a-input>
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="楼栋排序" v-bind="formItemLayout">
                <a-input-number :style="allWidth" v-decorator="['seq', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="电梯数量" v-bind="formItemLayout">
                <a-input-number
                  :style="allWidth"
                  v-decorator="['liftNums', { initialValue: '' || undefined, rules: [{ pattern: /^[0-9]*$/, message: '请输入整数' }] }]"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="宗地号" v-bind="formItemLayout">
                <a-select
                  :style="allWidth"
                  :getPopupContainer="getPopupContainer"
                  placeholder="请选择宗地号"
                  showSearch
                  optionFilterProp="children"
                  :options="$addTitle(addressNoList)"
                  :allowClear="false"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到数据"
                  v-decorator="['addressNo', { rules: [{ required: false, whitespace: true, message: '请选择宗地号' }] }]"
                />
                <!-- @change="addressNoChange" -->
                <!-- <a-input :maxLength='40' :style="allWidth" v-decorator="['addressNo', {initialValue: '' || undefined}]"/> -->
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="建筑年代" v-bind="formItemLayout">
                <a-input :maxLength="20" :style="allWidth" v-decorator="['builtAge', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="竣工日期" v-bind="formItemLayout">
                <a-date-picker
                  :style="allWidth"
                  placeholder="请选择竣工日期"
                  :getPopupContainer="getPopupContainer"
                  v-decorator="['completionDate', { initialValue: '' || undefined }]"
                />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="物业管理单位" v-bind="formItemLayout">
                <a-input :maxLength="30" :style="allWidth" v-decorator="['organManagement', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="物业缴费期限" v-bind="formItemLayout">
                <a-input :maxLength="30" :style="allWidth" v-decorator="['organPayDeadline', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item label="物业费" v-bind="formItemLayout">
                <a-input :maxLength="30" :style="allWidth" v-decorator="['organFee', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan" >
              <a-form-item :labelCol="{span:7}" label="分摊土地面积(㎡)" v-bind="formItemLayout">
                <a-input-number :precision="4" :min="0" :style="allWidth" v-decorator="['landArea', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col v-bind="formSpan">
              <a-form-item :labelCol="{span:7}" label="房产设计使用年限" v-bind="formItemLayout">
                <a-input-number :precision="4" :min="0" :style="allWidth" v-decorator="['usefulLife', { initialValue: '' || undefined }]" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <!-- 文本框 -->
              <a-form-item label="描述" v-bind="formItemLayout2">
                <a-textarea :maxLength="200" v-decorator="['description', { initialValue: '' }]" />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="是否有消防验收材料" v-bind="formItemLayout">
                <a-select
                  :style="allWidth"
                  :getPopupContainer="getPopupContainer"
                  placeholder="是否有消防验收材料"
                  showSearch
                  optionFilterProp="children"
                  :options="$addTitle(fireMaterialOpt)"
                  :allowClear="false"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到数据"
                  v-decorator="['fireMaterial', { initialValue: 0 }]"
                />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="平面图" v-bind="formItemLayout2">
                <SG-UploadFile v-model="picPath" :maxSize="51200" :max="1" :customDownload="customDownload" :customUpload="customUpload" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="图片" v-bind="formItemLayout2">
                <SG-UploadFile v-model="buildPic" :max="5" :maxSize="51200" :customDownload="customDownload" :customUpload="customUpload" />
              </a-form-item>
            </a-col>
            <a-col :span="24">
              <a-form-item label="附件" v-bind="formItemLayout2">
                <SG-UploadFile
                  :max="5"
                  :maxSize="51200"
                  type="all"
                  v-model="filepaths"
                  :customDownload="customDownload"
                  :customUpload="customUpload"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-form>
      </div>
    </div>
    <FormFooter v-if="fromType !== 'portal'">
      <SG-Button v-if="hasUpdatePower" :class="[type === 'edit' && 'mr2']" @click="handleSave" type="primary">保存</SG-Button>
      <SG-Button v-power="ASSET_MANAGEMENT.ASSET_BUILD_DELETE" v-if="type === 'edit'" @click="handleCancel" type="danger" ghost>删除</SG-Button>
    </FormFooter>
    <div v-if="visibleShow">
      <newSelectLngAndLat
        @cancel="cancel"
        :addressData="address"
        :oneSearchValue="oneSearchValue"
        :point="point"
        @addressFn="addressFn"
        ref="longitudeAndLatitud"
      >
        <div class="detail-item mt15">
          <div class="detail-item-label">详情地址：</div>
          <div class="detail-item-content">{{ `${this.oneSearchValueData}（经纬度：${lngAndlatData}）` }}</div>
        </div>
      </newSelectLngAndLat>
    </div>
  </div>
</template>
<script>
import FormFooter from '@/components/FormFooter.vue';
import newSelectLngAndLat from '@/views/common/newSelectLngAndLat.vue';
import utils from '@/utils/utils';
import moment from 'moment';
import { ASSET_MANAGEMENT } from '@/config/config.power';
import dictMixin from './dictMixin.js';
import TreeSelect from '@/views/common/treeSelect';
import { typeFilter } from '@/views/buildingDict/buildingDictConfig';
import { queryTopOrganByOrganID } from './publicFn';

const allWidth = { width: '100%' };
const allWidth1 = { width: '100px', marginRight: '10px', flex: '0 0 120px' };
const allWidth2 = { width: '250px', flex: 1 };
const judgeArr = [undefined, null, '', 'null'];
export default {
  components: {
    FormFooter,
    newSelectLngAndLat,
    TreeSelect,
  },
  mixins: [dictMixin],
  props: {
    type: {
      default: 'create',
    },
    organId: {
      default: '',
    },
    objectData: {
      default: () => ({}),
    },
  },
  watch: {
    // 监听楼栋编辑框变化
    type() {
      this.init();
    },
    // 监听id变化
    objectData() {
      this.init();
    },
  },
  data() {
    return {
      addressNoList: [],
      visibleShow: false,
      lngAndlatData: '',
      fireMaterialOpt: [
        { key: 0, title: '否' },
        { key: 1, title: '是' },
      ],
      fromType: '',
      allStyle: 'width: 100%;',
      organIdMain: '', // 所属机构
      organNameMain: '', // 所属机构名称
      typeFilter,
      bussType: 'buildDir',
      ASSET_MANAGEMENT,
      hasUpdatePower: false,
      allWidth,
      allWidth1,
      allWidth2,
      formSpan: {
        xl: 8,
        sm: 12,
      },
      loading: false,
      region: undefined, // 区/县
      city: undefined, // 市
      address: '', // 详细地址
      provinceOpt: [], // 省
      cityOpt: [], // 市
      regionOpt: [], // 区/县
      point: {
        // 经纬度
        lng: '',
        lat: '',
      },
      buildPic: [], // 图片
      picPath: [], // 平面图
      filepaths: [], // 附件
      buildTypeOpt: [], // 楼栋类型
      useTypeOpt: [], // 楼栋用途
      houseCategoryOpt: [], // 楼栋用途
      buildStructOpt: [], // 建筑结构
      communityIdOpt: [], // 项目列表
      communityIdDisabled: false, // 是否禁止选择项目
      addressObj: {
        provinceName: '',
        cityName: '',
        regionName: '',
      },
      oneSearchValueData: '',
      oneSearchValue: '',
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
    };
  },
  beforeCreate() {
    this.form = this.$form.createForm(this);
  },
  computed: {
    title() {
      if (this.fromType === 'portal') {
        return '楼栋详情';
      }
      return this.type === 'edit' ? '编辑楼栋' : '新增楼栋';
    },
  },
  mounted() {
    this.fromType = this.$route.query.fromType;
    if (this.fromType === 'portal') {
      this.resetAll();
      this.queryBuildDetail(this.$route.query.positionId);
    }
    this.queryProvinceList();
    this.platformDictFn();
    this.init();
    this.handleBtn();
  },
  methods: {
    getLandTheNo() {
      let obj = {
        organId: this.organIdMain,
        province: this.form.getFieldValue('province') || '',
        city: this.city || '',
        region: this.region || '',
      };
      console.log(obj, '宗地号');
      this.$api.building.getLandTheNo(obj).then((res) => {
        if (+res.data.code === 0) {
          this.addressNoList = res.data.data.map((item) => {
            return { value: item, label: item };
          });
        }
      });
    },
    //objectId type=1时，为项目ID，type=2为楼栋ID ，type=3时，根据isBuild 传楼栋ID或者单元ID
    getObjectSeq(id) {
      this.$api.building.getObjectSeq({ objectId: id, type: '1', isBuild: '0' }).then((res) => {
        if (+res.data.code === 0) {
          let data = judgeArr.includes(res.data.data) ? 1 : res.data.data;
          this.form.setFieldsValue({ seq: data });
        } else {
          this.form.setFieldsValue({ seq: 1 });
        }
      });
    },
    cancel() {
      this.visibleShow = false;
    },
    addressFn(address, { lng, lat }, type) {
      if (type === 'zero') {
        this.oneSearchValueData = address;
        this.lngAndlatData = `${lng}-${lat}`;
      } else {
        this.oneSearchValueData = `${this.oneSearchValueData}${address}`;
        let lngAndlat = lng + '-' + lat;
        this.form.setFieldsValue({ lngAndlat });
        this.address = address;
        this.point.lng = lng;
        this.point.lat = lat;
        this.visibleShow = false;
      }
    },
    queryCommunityTypeInfo(communityId) {
      this.$api.basics.queryCommunityTypeInfo({ communityId: communityId }).then((res) => {
        console.log(res);
      });
    },
    async changeTree(value) {
      this.organIdMain = value || '';
      // 有值 且 非禁用状态
      if (value && !this.communityIdDisabled) {
        let { organId: organTopId, organName: organTopName } = await queryTopOrganByOrganID({
          nOrgId: value,
          nOrganId: value,
        });
        await this.queryCommunityListByOrganId(organTopId, organTopName);
        this.form.resetFields(['communityId']);
      }
      this.form.setFieldsValue({ buildType: '' });
      this.form.setFieldsValue({ useType: '' });
      this.form.setFieldsValue({ buildHouseType: '' });
      this.queryNodesByRootCode('30');
      this.queryNodesByRootCode('60');
      this.queryNodesByRootCode('20');
    },
    async init() {
      this.resetAll();
      if (this.type === 'edit') {
        this.queryBuildDetail(this.objectData.positionId);
      }
    },
    handleBtn() {
      if (this.type === 'create') {
        this.hasUpdatePower = true;
      }
      if (this.type === 'edit' && this.$power.has(ASSET_MANAGEMENT.ASSET_BUILD_EDIT)) {
        this.hasUpdatePower = true;
      }
    },
    // 选择项目变化
    communityIdChange(e) {
      console.log(e, 'jsjjsdh');
      let o = this.communityIdOpt.filter((item) => item.value === e)[0];
      let communityName = o.name;
      let name = this.form.getFieldValue('name');
      if (name) {
        this.form.setFieldsValue({ aliasName: `${name}_${communityName}` });
      }
      // 新增的时候回去顺顺序
      if (this.type === 'create') {
        this.getObjectSeq(e);
      }
      // console.log('得到值', name, '2',communityName)
    },
    // 请求项目
    queryCommunityListByOrganId(organTopId) {
      return new Promise((resolve, reject) => {
        let data = {
          organId: organTopId || this.organIdMain,
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
            resolve();
          }
          reject();
        });
      });
    },
    handleSave() {
      if (!this.organIdMain) {
        this.$message.error('请选择所属机构');
        return null;
      }
      this.form.validateFields((err, values) => {
        // console.log('得到值=>', values)
        if (!err) {
          let data = {};
          utils.each(values, (value, key) => {
            data[key] = value || '';
          });
          data.fireMaterial = data.fireMaterial || 0;
          // 处理时间类型
          if (data.completionDate) {
            data.completionDate = data.completionDate.format('YYYY-MM-DD');
          }
          // 处理经纬度
          let lngAnLatArr = data.lngAndlat.split('-');
          data.longitude = lngAnLatArr[0];
          data.latitude = lngAnLatArr[1];
          // 处理平面图
          if (this.picPath.length > 0) {
            data.picPath = this.picPath[0].url;
          }
          // 处理图片
          if (this.buildPic.length > 0) {
            data.buildPic = this.buildPic.map((item) => item.url).join(',');
          }
          // 处理附件
          if (this.filepaths.length > 0) {
            data.filepaths = this.filepaths.map((item) => item.url).join(',');
          }
          // 处理省市区的联动start
          data.city = this.city;
          data.region = this.region;
          data.address = this.address;
          //删除多余字段
          delete data.lngAndlat;
          // 新增楼栋
          if (this.type === 'create') {
            // TODO:改成所属机构
            data.organId = this.organIdMain;
            data.upPositionId = this.objectData.positionId;
            let loadingName = this.SG_Loding('新增中...');
            this.$api.building.addBuild(data).then(
              (res) => {
                this.DE_Loding(loadingName).then(() => {
                  if (res.data.code === '0') {
                    this.$SG_Message.success('新增楼栋成功');
                    this.resetAll();
                    this.$emit('success', 'create');
                  } else {
                    this.$message.error(res.data.message);
                  }
                });
              },
              () => {
                this.DE_Loding(loadingName).then((res) => {
                  this.$SG_Message.error('新增失败！');
                });
              }
            );
          }
          // 编辑楼栋
          if (this.type === 'edit') {
            // TODO:改成所属机构
            data.organId = this.organIdMain;
            data.buildId = this.objectData.positionId; // 当前节点
            data.upPositionId = this.objectData.upPositionId; // 上级节点
            let loadingName = this.SG_Loding('编辑中...');
            this.$api.building.updateBuild(data).then(
              (res) => {
                this.DE_Loding(loadingName).then(() => {
                  if (res.data.code === '0') {
                    this.$SG_Message.success('编辑楼栋成功');
                    this.$emit('success', 'edit');
                  } else {
                    this.$message.error(res.data.message);
                  }
                });
              },
              () => {
                this.DE_Loding(loadingName).then((res) => {
                  this.$SG_Message.error('编辑失败！');
                });
              }
            );
          }
        }
      });
    },
    handleCancel() {
      this.$SG_Modal.confirm({
        content: `确定删除该楼栋吗?`,
        okText: '确定',
        cancelText: '再想想',
        onOk: () => {
          let data = {
            buildId: this.objectData.positionId,
          };
          data.organId = this.organIdMain;
          this.$api.building.deleteBuild(data).then((res) => {
            if (res.data.code === '0') {
              this.$SG_Message.success(`删除成功`);
              this.$emit('success', 'delete');
            } else {
              this.$message.error(res.data.message);
            }
          });
        },
      });
    },
    queryBuildDetail(buildId) {
      let data = {
        buildId,
      };
      this.loading = true;
      this.$api.building.queryBuildDetail(data).then(
        (res) => {
          this.loading = false;
          if (res.data.code === '0') {
            this.$textReplace(res.data.data.organId);
            this.handleEdit({ ...res.data.data });
          } else {
            this.$message.error(res.data.message);
          }
        },
        () => {
          this.loading = false;
        }
      );
    },
    // 处理编辑数据
    async handleEdit(data) {
      let loadingName = this.SG_Loding('加载中');
      //消防材料
      data.fireMaterial = +data.fireMaterial || 0;
      // 把楼栋的 organId 传出去供 单元和楼层使用
      this.$emit('handleOrganIdOwn', data.organId);
      // 处理时间类型
      if (data.completionDate) {
        data.completionDate = moment(data.completionDate, 'YYYY-MM-DD');
      }
      // 处理经纬度
      if (data.longitude) {
        data.lngAndlat = data.longitude + '-' + data.latitude;
        this.point = {
          lng: data.longitude,
          lat: data.latitude,
        };
      }
      // 处理图片
      if (data.picPath) {
        let picPath = [{ url: data.picPath, name: '' }];
        this.picPath = picPath;
      }
      // 处理附件
      if (data.buildPic) {
        let buildPic = data.buildPic.split(',');
        this.buildPic = buildPic.map((url) => {
          return { url, name: url.substring(url.lastIndexOf('/') + 1) };
        });
      }
      // 处理附件
      if (data.filepaths) {
        let filepaths = data.filepaths.split(',');
        this.filepaths = filepaths.map((url) => {
          return { url, name: url.substring(url.lastIndexOf('/') + 1) };
        });
      }
      // 处理省市区的联动start
      this.city = data.city;
      this.region = data.region;
      this.address = data.address;
      Promise.all([this.queryCityAndAreaList(data.province, 'province', 'edit'), this.queryCityAndAreaList(data.city, 'city', 'edit')]).then(() => {
        // 处理省市区名称回显到地图
        this.addressObj.provinceName = this.transformProvince(data.province);
        this.addressObj.cityName = this.transformCity();
        this.addressObj.regionName = this.transformArea();
        this.lngAndlatData = `${data.longitude}-${data.latitude}`;
      });
      let { organId: organTopId, organName: organTopName } = await queryTopOrganByOrganID({
        nOrgId: data.organId,
        nOrganId: data.organId,
      });
      this.organIdMain = data.organId;
      this.queryNodesByRootCode('30');
      this.queryNodesByRootCode('60');
      this.queryNodesByRootCode('20');
      // this.$refs.organTopRef.manageRootData([{organId: data.organId, organName: data.organName}])
      this.getLandTheNo();
      // console.log('dfsdfsdf')
      // 在获取 所属机构id 之后 获取项目 暂时和所属机构一样只能选同一 一级机构下的
      try {
        await this.queryCommunityListByOrganId(organTopId);
      } catch (e) {
        console.error(e);
      }
      this.organNameMain = data.organName;
      // 处理项目是否可以选择
      // console.log('楼栋数据=>', data)
      this.communityIdDisabled = data.communityId && data.communityId !== '-1' ? true : false;
      data.communityId = data.communityId && data.communityId !== '-1' ? data.communityId : '';
      // this.queryCommunityTypeInfo(data.communityId)
      // end
      let o = this.form.getFieldsValue();
      // console.log('表单数据=>', o)
      let values = {};
      utils.each(o, (value, key) => {
        if (data[key] && data[key] !== 0) {
          values[key] = data[key];
        }
      });
      // console.log('得到值all=>', values)
      this.form.setFieldsValue(values);
      this.DE_Loding(loadingName);
    },
    // 重置所有数据
    resetAll() {
      this.form.resetFields();
      this.region = undefined; // 区/县
      this.city = undefined; // 市
      this.address = ''; // 详细地址
      this.point = {
        // 经纬度
        lng: '',
        lat: '',
      };
      this.picPath = []; // 平面图
      this.buildPic = []; // 图片
      this.filepaths = []; // 附件
    },
    // 显示百度地图
    showSelectMap() {
      if (!this.region) {
        this.$message.info('请先选择省市区');
        return;
      }
      this.oneSearchValue = `${this.addressObj.provinceName}${this.addressObj.cityName}${this.addressObj.regionName}${this.address}`;
      this.oneSearchValueData = this.oneSearchValue;
      this.visibleShow = true;
      this.$nextTick(() => {
        this.$refs.longitudeAndLatitud.visible = true;
      });
    },
    /* 根据根节点业态code获取下面的业态类型 */
    queryNodesByRootCode(code) {
      /**
       * 10  项目业态
       * 20  建筑形态
       * 30  房间类型
       * 40  生命周期
       * 50  房间状态
       * 60  房间用途
       */
      let data = {
        categoryCode: code,
        organId: this.organIdMain,
      };
      this.$api.basics.queryNodesByRootCode(data).then((res) => {
        if (res.data.code === '0') {
          let result = res.data.data || [];
          let resultArr = result.map((item) => {
            return {
              label: item.typeName,
              value: item.typeCode,
              ...item,
            };
          });
          if (code === '30') {
            this.buildTypeOpt = [...resultArr];
          }
          if (code === '60') {
            this.useTypeOpt = [...resultArr];
          }
          if (code === '20') {
            this.houseCategoryOpt = [...resultArr];
          }
        }
      });
    },
    // 平台字典获取变动类型
    platformDictFn() {
      let obj = {
        code: 'BUILD_STRUCT',
      };
      this.$api.assets.platformDict(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data || [];
          this.buildStructOpt = data.map((item) => {
            return { ...item, label: item.name };
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 请求省
    queryProvinceList() {
      return this.$api.basics.queryProvinceList().then((res) => {
        if (res.data.code === '0') {
          let data = res.data.data || [];
          this.provinceOpt = data.map((item) => {
            return { label: item.name, value: item.regionId };
          });
        }
      });
    },
    // 请求市区
    queryCityAndAreaList(parentRegionId, type, val) {
      return this.$api.basics.queryCityAndAreaList({ parentRegionId }).then((res) => {
        if (res.data.code === '0') {
          let data = res.data.data || [];
          let result = data.map((item) => {
            return { label: item.name, value: item.regionId };
          });
          // 市
          if (type === 'province') {
            if (val !== 'edit') {
              this.regionOpt = [];
            }
            this.cityOpt = result;
          }
          // 区
          if (type === 'city') {
            this.regionOpt = result;
          }
        }
      });
    },
    // 验证省市区
    validateAddress(rule, value, callback) {
      // console.log('ss', this.city)
      if (!value) {
        callback('请选择省份');
      } else if (!this.city) {
        callback('请选择市');
      } else if (!this.region) {
        callback('请选择区/县');
      } else {
        callback();
      }
    },
    cityOrRegionChange(e, val, type) {
      // console.log('改变项', e, val, type)
      // 只要一改变就直接清空经纬度和详细地址
      this.oneSearchValueData = '';
      this.form.setFieldsValue({ lngAndlat: '' });
      this.address = ''; // 详细地址
      this.point = {
        // 经纬度
        lng: '',
        lat: '',
      };
      // 如果是区/县 请求经纬度
      if (type === 'region') {
        // this.getLL()
        this.addressObj.regionName = val.data.props.title;
        this.form.setFieldsValue({ addressNo: '' });
        this.getLandTheNo();
      }
      // 市
      if (type === 'province') {
        this.region = undefined;
        this.city = undefined;
        this.addressObj.provinceName = val.data.props.title;
      }
      // 区
      if (type === 'city') {
        this.region = undefined;
        this.addressObj.cityName = val.data.props.title;
      }
      // 触发验证
      if (['region', 'city'].includes(type)) {
        this.form.validateFields(['province'], { force: true });
      }
      // 请求联动数据
      if (['province', 'city'].includes(type)) {
        this.queryCityAndAreaList(e, type);
      }
    },
    transformProvince(val) {
      if (!val) return;
      let value = val;
      let arr = this.provinceOpt.filter((item) => String(item.value) === String(value));
      return arr[0].label;
    },
    transformCity() {
      let value = this.city;
      if (!value) return;
      let arr = this.cityOpt.filter((item) => String(item.value) === String(value));
      return arr[0].label;
    },
    transformArea() {
      let value = this.region;
      if (!value) return;
      let arr = this.regionOpt.filter((item) => String(item.value) === String(value));
      return arr[0].label;
    },
    // 请求经纬度坐标
    // getLL () {
    //   if (!BMap) return
    //   if (!this.region) return
    //   var myGeo = new BMap.Geocoder()
    //   let self = this
    //   let longitude = 0
    //   let latitude = 0
    //   let transformProvince = this.transformProvince()
    //   let transformCity = this.transformCity()
    //   let transformArea = this.transformArea()
    //   let address = this.address
    //   console.log('动态经纬度=>', transformProvince)
    //   if (transformProvince && transformCity && transformArea) {
    //     myGeo.getPoint(transformProvince + transformCity + transformArea + address, (point) => {
    //       if (point) {
    //         let lngAndlat = point.lng + '-' + point.lat
    //         this.form.setFieldsValue({lngAndlat})
    //       }
    //     })
    //   }
    // },
    filterOption(input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },
    getPopupContainer(e) {
      return e.parentElement;
    },
  },
};
</script>
<style lang="less" scoped>
.createBuilding-page {
  height: 100%;
  padding: 0px 3px 0 50px;
  position: relative;
  overflow: hidden;
}
.form-box {
  height: 100%;
  overflow: hidden;
  overflow-y: auto;
  padding-top: 36px;
  padding-bottom: 70px;
}
.title-box {
  margin-bottom: 40px;
}
.address-box {
  display: flex;
  margin-top: 7px;
}
</style>
