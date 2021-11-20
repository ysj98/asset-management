<!--
  新增: new
  编辑: edit
  新建变更单
-->
<template>
  <div class="newEditSingle">
    <div class="newEditSingle-nav">
      <span class="section-title blue">基础信息</span>
      <a-row class="playground-row">
        <a-form :form="form">
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">变更单名称：</label>
              <a-input
                autocomplete="off"
                placeholder="请输入变更单名称"
                :style="allWidth"
                :max="50"
                v-decorator="['title',
                {rules: [{required: true, max: 50, whitespace: true, message: '请输入变更单名称(不超过50字符)'}], initialValue: newEditSingleData.title}
              ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">所属机构：</label>
              <a-select
                :disabled="true"
                showSearch
                :style="allWidth"
                placeholder="请选择所属机构"
                v-decorator="['organId',{
                    rules: [{required: true, message: '请选择所属机构'}],
                    initialValue: newEditSingleData.organId
                  }]"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到所属机构"
              >
                <a-select-option
                  v-for="(item) in organIdData"
                  :key="item.value"
                  :value="item.value"
                  :title="item.name"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">资产项目：</label>
              <a-select
                showSearch
                :style="allWidth"
                placeholder="请选择资产项目"
                v-decorator="['projectId',{
                    rules: [{required: true, message: '请选择资产项目'}],
                    initialValue: newEditSingleData.projectId
                  }]"
                :allowClear="false"
                @change="projectChangeFn"
                :filterOption="filterOption"
                notFoundContent="没有查询到资产项目"
              >
                <a-select-option
                  v-for="(item) in projectIdData"
                  :key="item.value"
                  :value="item.value"
                  :title="item.name"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">资产类型：</label>
              <!-- :maxTagCount="1"
              :tokenSeparators="[',']"
              mode="multiple"-->
              <a-select
                showSearch
                :disabled="setType==='edit'"
                :style="allWidth"
                placeholder="请选择资产类型"
                v-decorator="['assetType',{
                    rules: [{required: true, message: '请选择资产类型'}],
                    initialValue: newEditSingleData.assetType
                  }]"
                @change="assetTypeChange"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到资产类型"
              >
                <a-select-option
                  v-for="(item) in assetTypeData"
                  :key="item.value"
                  :value="item.value"
                  :title="item.name"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">变更类型：</label>
              <a-select
                showSearch
                :disabled="setType==='edit'"
                :style="allWidth"
                placeholder="请选择变更类型"
                v-decorator="['changeType',{
                    rules: [{required: true, message: '请选择变更类型'}],
                    initialValue: newEditSingleData.changeType
                  }]"
                @change="changeTypeChange"
                :allowClear="false"
                :filterOption="filterOption"
                notFoundContent="没有查询到变更类型"
              >
                <a-select-option
                  v-for="(item) in changeTypeDataCom"
                  :key="item.value"
                  :value="item.value"
                  :title="item.name"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">变更日期：</label>
              <a-date-picker
                :style="allWidth"
                placeholder="请选择变更日期"
                v-decorator="['changeDate',
                {rules: [{required: true, message: '请选择变更日期'}]}
              ]"
              />
            </a-form-item>
          </a-col>
          <!-- 选择变更类型为，资产原值 -->
          <template v-if="changeType === '3'">
            <a-col class="playground-col" :span="8">
              <a-form-item :colon="false" v-bind="formItemLayout">
                <label slot="label">原值对象类型:</label>
                <a-select
                  showSearch
                  :style="allWidth"
                  placeholder="请选择原值对象类型"
                  v-decorator="['originalObjectType',{
                    rules: [{required: true, message: '请选择原值对象类型'}],
                    initialValue: newEditSingleData.originalObjectType
                  }]"
                  @change="originalObjectTypeChange"
                  :allowClear="false"
                  :filterOption="filterOption"
                  notFoundContent="没有查询到数据"
                >
                  <a-select-option
                    v-for="(item) in originalObjectTypeDataCom"
                    :key="item.value"
                    :value="item.value"
                    :title="item.name"
                  >{{item.name}}</a-select-option>
                </a-select>
              </a-form-item>
            </a-col>
            <template v-if="originalObjectType!=='4'">
              <a-col class="playground-col" :span="8">
                <a-form-item :colon="false" v-bind="formItemLayout">
                  <label slot="label">原值对象：</label>
                  <a-select
                    showSearch
                    :style="allWidth"
                    placeholder="请选择原值对象"
                    v-decorator="['originalObjectId',{
                    rules: [{required: true, message: '请选择原值对象'}],
                    initialValue: newEditSingleData.originalObjectId
                  }]"
                    @change="originalObjectIdChange"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                  >
                    <a-select-option
                      v-for="(item) in originalObjectIdData"
                      :key="item.value"
                      :value="item.value"
                      :title="item.name"
                    >{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
              <a-col class="playground-col" :span="8">
                <a-form-item :colon="false" v-bind="formItemLayout">
                  <label slot="label">原值金额(元)：</label>
                  <a-input-number
                    placeholder="原值金额"
                    :style="allWidth"
                    step="1"
                    :min="0"
                    :max="99999999999.99"
                    :precision="2"
                    @change="originalValueChange"
                    v-decorator="['originalValue',
                {rules: [{required: true, message: '请输入原值金额'}, {validator: validatorOriginalValue}],
                initialValue: newEditSingleData.originalValue}
              ]"
                  />
                </a-form-item>
              </a-col>
              <a-col class="playground-col" :span="8">
                <a-form-item :colon="false" v-bind="formItemLayout">
                  <label slot="label">原值分摊方式：</label>
                  <a-select
                    showSearch
                    :disabled="true"
                    :style="allWidth"
                    placeholder="请选择原值分摊方式"
                    v-decorator="['shareWay',{
                    rules: [{required: true, message: '请选择原值分摊方式'}],
                    initialValue: newEditSingleData.shareWay
                  }]"
                    :allowClear="false"
                    @select="shareWayChange"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                  >
                    <a-select-option
                      v-for="(item) in shareWayData"
                      :key="item.value"
                      :value="item.value"
                      :title="item.name"
                    >{{item.name}}</a-select-option>
                  </a-select>
                </a-form-item>
              </a-col>
            </template>
          </template>
          <a-col class="playground-col" :span="24">
            <a-form-item :colon="false" v-bind="formItemTextarea">
              <label slot="label">备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label>
              <a-textarea
                placeholder="请输入备注"
                :style="widthBox"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-decorator="['remark',
                {rules: [{required: false, max: 200, message: '请输入问题备注(不超过200字符)'}], initialValue: newEditSingleData.remark}
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item :colon="false" v-bind="formItemTextarea">
              <label slot="label">上传附件：</label>
              <SG-UploadFile v-model="newEditSingleData.files" type="all" />
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>
      <div class="tab-nav">
        <span class="section-title blue">资产列表</span>
        <div class="button-box">
          <SG-Button
            v-show="changeType!=='3' || !['1', '2','3'].includes(originalObjectType)"
            class="buytton-nav"
            type="primary"
            weaken
            @click="addTheAsset"
          >添加资产</SG-Button>
        </div>
        <div
          class="table-layout-fixed"
          v-if="columns.length !== 0"
          :class="{'table-border': tableData.length != 0}"
        >
          <a-table
            :scroll="scroll"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
          >
            <template #newAssetCategoryCode="text,record">
              <EquipmentSelectTree
                v-if="isSelectedEquipment"
                size="small"
                style="width: 100%"
                :top-organ-id="organId"
                :defaultName="record.newAssetCategoryName"
                v-model="record.newAssetCategoryCode"
              />
              <a-select
                v-else
                size="small"
                style="width: 100%"
                v-model="record.newAssetCategoryCode"
                :options="$addTitle(objectTypeOptions)"
                placeholder="请选择资产类别"
              />
            </template>
            <!-- 资产面积(㎡) 建筑面积(㎡) -->
            <template #assetArea="text,record">
              {{[$store.state.ASSET_TYPE_STRING.EQUIPMENT,$store.state.ASSET_TYPE_CODE.EQUIPMENT].includes(String(record.assetType)) ? '/' : record.assetArea}}
            </template>
            <!-- 使用方向 -->
            <template #newUseDirection="text,record">
              <a-select v-model="record.newUseDirection" style="width: 200px;" :options="amsUseDirectionCom"></a-select>
            </template>
            <!-- 交付运营 -->
            <template
              v-if="changeType === '1'"
              slot="transferOperationArea"
              slot-scope="text, record"
            >
              <a-input-number
                size="small"
                :min="0.01"
                :step="1.00"
                :precision="2"
                v-model="record.transferOperationArea"
              />
            </template>
            <!-- 交付物业 -->
            <template v-if="changeType === '2'" slot="transferArea" slot-scope="text, record">
              <a-input-number
                size="small"
                :min="0.01"
                :step="1.00"
                :precision="2"
                v-model="record.transferArea"
              />
            </template>
            <!-- 使用方向变更 -->
            <template v-if="changeType === '4'" slot="operationArea" slot-scope="text, record">
              <a-input-number
                size="small"
                :min="0"
                :step="1.00"
                :precision="2"
                v-model="record.operationArea"
              />
            </template>
            <template v-if="changeType === '4'" slot="selfUserArea" slot-scope="text, record">
              <a-input-number
                size="small"
                :min="0"
                :step="1.00"
                :precision="2"
                v-model="record.selfUserArea"
              />
            </template>
            <template v-if="changeType === '4'" slot="idleArea" slot-scope="text, record">
              <a-input-number
                size="small"
                :min="0"
                :step="1.00"
                :precision="2"
                v-model="record.idleArea"
              />
            </template>
            <template v-if="changeType === '4'" slot="occupationArea" slot-scope="text, record">
              <a-input-number
                size="small"
                :min="0"
                :step="1.00"
                :precision="2"
                v-model="record.occupationArea"
              />
            </template>
            <template v-if="changeType === '4'" slot="otherArea" slot-scope="text, record">
              <a-input-number
                size="small"
                :min="0"
                :step="1.00"
                :precision="2"
                v-model="record.otherArea"
              />
            </template>
            <!-- 原值变更 -->
            <template v-if="changeType === '3'" slot="newOriginalValue" slot-scope="text, record">
              <a-input-number
                :disabled="changeType=='3'&&['1', '2','3'].includes(originalObjectType)"
                size="small"
                :min="0"
                :step="1.00"
                :precision="2"
                v-model="record.newOriginalValue"
              />
            </template>
            <!-- 位置变更 -->
            <template v-if="changeType === '5'" slot="addressName" slot-scope="text, record">
              <a-input size="small" maxlength="100" v-model="record.addressName" />
            </template>
            <!-- 资产项目变更 -->
            <template v-if="changeType === '6'" slot="changeProjectId" slot-scope="text, record">
              <!-- <a-select showSearch :defaultValue="record.changeProjectId === '' ? undefined : record.changeProjectId" v-model="record.changeProjectId === '' ? record.changeProjectId = undefined : record.changeProjectId" :allowClear="false"
                :filterOption="filterOption" :placeholder="'请选择资产项目'" style="width: 120px">
                <a-select-option v-for="(opt) in projectIdData" :key="opt.value" :value='opt.value'>
                  {{opt.name}}
                </a-select-option>
              </a-select>-->
              <a-select
                :placeholder="'请选择资产项目'"
                style="width: 120px"
                showSearch
                :defaultValue="record.changeProjectId === '' ? undefined : record.changeProjectId"
                v-model="record.changeProjectId === '' ? record.changeProjectId = undefined : record.changeProjectId"
                optionFilterProp="children"
                :options="$addTitle(projectIdData)"
                :allowClear="true"
                :filterOption="filterOption"
                notFoundContent="没有查询到数据"
              />
            </template>
            <!-- 基础信息 -->
            <template v-if="changeType === '7'" slot="newAssetName" slot-scope="text, record">
              <a-input size="small" maxlength="30" v-model="record.newAssetName" />
            </template>
            <template v-if="changeType === '7'" slot="newAssetCode" slot-scope="text, record">
              <a-input size="small" maxlength="30" v-model="record.newAssetCode" />
            </template>
            <template
              v-if="changeType === '7' && ['1'].includes(assetType)"
              slot="newDecorationSituation"
              slot-scope="text, record"
            >
              <a-input size="small" maxlength="200" v-model="record.newDecorationSituation" />
            </template>
            <template v-if="changeType === '7'" slot="newSourceMode" slot-scope="text, record">
              <a-select
                size="small"
                style="width: 100%"
                v-model="record.newSourceMode"
                placeholder="请选择资产来源方式"
                :options="$addTitle(sourceOptions)"
              />
            </template>
            <!-- 债权债务 -->
            <template v-if="changeType === '8'" slot="newCreditorAmount" slot-scope="text, record">
              <a-input-number
                size="small"
                :min="0"
                :step="1.00"
                :precision="2"
                v-model="record.newCreditorAmount"
              />
            </template>
            <template v-if="changeType === '8'" slot="newDebtAmount" slot-scope="text, record">
              <a-input-number
                size="small"
                :min="0"
                :step="1.00"
                :precision="2"
                v-model="record.newDebtAmount"
              />
            </template>
            <template v-if="changeType === '9'" slot="newAssetArea" slot-scope="text, record">
              <a-input-number
                size="small"
                :min="0"
                :step="1.00"
                :precision="2"
                v-model="record.newAssetArea"
              />
            </template>
            <!-- 操作 -->
            <template slot="operation" slot-scope="text, record">
              <span class="postAssignment-icon" weaken @click="deleteFn(record)">删除</span>
            </template>
          </a-table>
        </div>
        <no-data-tips v-show="tableData.length === 0"></no-data-tips>
        <!-- <div v-else style="text-align: center">
          暂无数据
        </div>-->
      </div>
    </div>
    <!-- 选择资产 -->
    <AssetBundlePopover
      :changeType="true"
      :organId="organId"
      queryType="1"
      ref="assetBundlePopover"
      @status="status"
    ></AssetBundlePopover>
    <FormFooter style="border:none;" location="fixed">
      <div>
        <SG-Button type="primary" @click="save('save')">提交</SG-Button>
        <SG-Button style="margin-left: 12px" type="primary" weaken @click="save('draft')">保存草稿</SG-Button>
        <SG-Button @click="cancel">取消</SG-Button>
      </div>
    </FormFooter>
  </div>
</template>

<script>
import EquipmentSelectTree from "@/views/common/EquipmentSelectTree";
import AssetBundlePopover from "../../common/assetBundlePopover";
import {
  assetSize,
  baseChange,
  baseChangeTwo,
  changeDirectionUse,
  changeDirectionUseEq,
  debtChange,
  deliveryOperation,
  deliveryProperty,
  positionChange,
  projectChange,
  variationOriginalValue,
} from "./basics";
import FormFooter from "@/components/FormFooter";
import noDataTips from "@/components/noDataTips";
import {calc, debounce} from "@/utils/utils.js";

import moment from "moment";
import {querySourceType} from "@/views/common/commonQueryApi";
import {SET_AMS_USE_DIRECTION} from "store/types/platformDictTypes";
import {carPage} from "api/assets";

const newEditSingleData = {
  title: "", // 登记单名称
  changeType: undefined, // 变更类型
  assetType: undefined, // 资产类型
  projectId: undefined, // 资产项目
  originalObjectType: undefined, // 原值对象类型
  originalObjectId: undefined, // 原值对象
  originalValue: undefined, // 原值金额
  shareWay: undefined, // 原值分摊方式
  changeDate: {}, // 变更日期
  remark: "", // 备注
  files: [],
  organId: "",
};
const conditionalJudgment = [undefined, null, ""];
const shareWayData = [
  { name: "按资产面积分摊", value: "1" },
  { name: "按资产个数分摊", value: "2" },
];
export default {
  components: { AssetBundlePopover, FormFooter, noDataTips, EquipmentSelectTree },
  props: {},
  data() {
    return {
      objectTypeOptions:[],
      sourceOptions:[], // 来源方式
      changeOrderId: "",
      scroll: {y: 450, x: 1600},
      organId: "",
      enitData: "", // 路由带入传入
      // 表单已有值start
      changeType: "", // 用来判断对象变更类型
      originalObjectType: "", // 原值对象类型
      projectId: "", // 项目id
      shareWay: "", // 原值分摊方式
      assetType: "", // 资产类型
      originalValue: 0, // 原值金额
      // 表单已有值end
      checkedData: [],
      show: false,
      columns: [],
      tableData: [],
      organIdData: [], // 组织机构写死
      changeTypeData: [], // 变更类型
      projectList:[], // 资产项目 集合
      projectIdData: [], // 资产项目id 集合
      assetTypeData: [], // 资产类型
      originalObjectIdData: [], // 原值对象值
      shareWayData, // 原值分摊方式
      newEditSingleData: { ...newEditSingleData },
      form: this.$form.createForm(this),
      allWidth: "width: 200px",
      widthBox: "width: 80%",
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
    originalObjectTypeDataCom(){
      const {HOUSE,YARD} = this.$store.state.ASSET_TYPE_CODE
      const originalObjectTypeData = [
        { name: "资产项目", value: "1" },
        { name: "楼栋", value: "2", auth:[HOUSE]},
        { name: "车场", value: "3", auth:[YARD]},
        { name: "资产", value: "4" },
      ];
      return originalObjectTypeData.filter(ele=>{
        if (ele.auth && ele.auth.length){
          return ele.auth.includes(this.assetType);
        }else {
          return true
        }
      })
    },
    changeTypeDataCom(){
      const tempApp = ['交付运营','交付物业']
      return this.changeTypeData.filter(ele=>{
        return this.assetType !== this.$store.state.ASSET_TYPE_CODE.EQUIPMENT  || !tempApp.includes(ele.name)
      })
    },
    amsUseDirectionCom(){
      return this.$store.state.platformDict.AMS_USE_DIRECTION.map(ele=>{
        return {
          title: ele.name,
          value: ele.value,
          label: ele.name
        };
      })
    },
    isSelectedEquipment(){
      return String(this.assetType) === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT
    },
  },
  watch: {
    changeType(val) {
      this.checkedData = [];
      this.tableData = [];
      if (val === "2") {
        this.columns = deliveryProperty;
      } else if (val === "1") {
        this.columns = deliveryOperation;
      } else if (val === "4") {
        this.columns = this.assetType === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT ? changeDirectionUseEq : changeDirectionUse
      } else if (val === "3") {
        this.columns = variationOriginalValue;
      } else if (val === "5") {
        this.columns = positionChange;
      } else if (val === "6") {
        this.columns = projectChange;
      } else if (val === "7") {
        this.columns = baseChange;
        // 装修情况有变化
        this.handleBaseAndHuse();
        // 如果 不是 设备设施类型
        if(this.assetType !== this.$store.state.ASSET_TYPE_CODE.EQUIPMENT){
          this.queryObjectType()
        }
      } else if (val === "8") {
        this.columns = debtChange;
      } else if (val === "9") {
        // TODO: 字典里面没有 9
        this.columns = assetSize;      // 资产面积
      }
      console.log(this.columns)
      this.columns.forEach(item => {
        item.width = 150
      })
      this.scroll.x = this.columns.length * 150
    },
  },
  created() {
    this.organIdData = JSON.parse(this.$route.query.record);
    this.organId = this.organIdData[0].value;
    this.setType = this.$route.query.setType;
    this.$store.dispatch('platformDict/getPlatformDict',{
      code:'AMS_USE_DIRECTION',
      type: SET_AMS_USE_DIRECTION
    })
  },
  mounted() {
    this.getSourceOptions()
    this.getObjectKeyValueByOrganIdFn();
    this.platformDictFn("asset_change_type");
    this.platformDictFn("asset_type");
    if (this.setType === "edit") {
      this.enitData = JSON.parse(this.$route.query.enitData);
      this.changeOrderId = this.enitData[0].changeOrderId;
      this.editFn();
    } else {
      this.form.setFieldsValue({
        organId: this.organIdData[0].value,
      });
    }
  },
  methods: {
    queryObjectType () {
      const organId = this.organId
      const assetType = this.assetType
      if(!organId || !assetType){
        return null
      }
      this.$api.assets.getList({ assetType, organId }).then(res => {
        if (Number(res.data.code) === 0) {
          let { data } = res.data
          this.objectTypeOptions = data.map(m => ({
            title: m.professionName,
            key: m.professionCode
          }))
        }
      }).catch(err => {
        this.$message.error(err || '查询资产类别失败')
      })
    },
    /*
    * 获取来源方式
    * */
    async getSourceOptions(){
      let organId = this.organId
      this.sourceOptions = []
      this.source = []
      querySourceType(organId, this).then(list => {
        return this.sourceOptions = list
      })
    },
    // 编辑获取接口
    editFn() {
      let obj = {
        changeOrderId: this.changeOrderId,
      };
      this.$api.assets.getChangeInfo(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let files = [];
          if (data.attachment && data.attachment.length > 0) {
            data.attachment.forEach((item) => {
              files.push({
                url: item.attachmentPath,
                name: item.newAttachmentName,
              });
            });
          }
          Object.assign(this, {
            projectId: data.projectId,
            changeType: String(data.changeType), // 用来判断对象变更类型
            originalObjectType: String(data.originalObjectType), // 原值对象类型
            assetType: String(data.assetType),
            shareWay: String(data.shareWay),
            originalValue: Number(data.originalValue) || undefined,
          });
          this.newEditSingleData.files = files;
          let checkedData = [];
          data.assetDetailList.forEach((item, index) => {
            item.key = item.assetId + index;
            // item.addressName = item.address;
            item.newOriginalValue = item.originalValue;
            // 债权映射
            item.newCreditorAmount = item.creditorAmount;
            item.newDebtAmount = item.debtAmount;

            item.creditorAmount = item.oldCreditorAmount;
            item.debtAmount = item.oldDebtAmount;
            // 资产面积映射
            item.assetArea = item.oldAssetArea;
            // 基础信息字段映射
            item.newDecorationSituation = item.decorationSituation;
            checkedData.push(item.assetId);
          });
          this.$nextTick(() => {
            this.form.setFieldsValue({
              organId: this.organIdData[0].value,
              projectId: data.projectId,
              title: data.title,
              assetType: String(data.assetType),
              changeType: String(data.changeType),
              changeDate: moment(data.changeDate, "YYYY-MM-DD"),
              remark: data.remark,
            });
            // 如果是资产原值
            if (String(data.changeType) === "3") {
              this.form.setFieldsValue({
                originalValue: data.originalValue,
                shareWay: String(data.shareWay),
                originalObjectId: data.originalObjectId,
                originalObjectType: String(data.originalObjectType),
              });
              // 选择资产项目
              if (String(data.originalObjectType) === "1") {
                this.originalObjectProject();
              }
              // 选择楼栋
              if (String(data.originalObjectType) === "2") {
                this.organBuild(data.projectId);
              }
            }
            this.checkedData = [...checkedData];
            this.tableData = data.assetDetailList.map(ele=>{
              return {
                ...ele,
                // select 组件 数字 value 匹配不上,需转换 string 类型
                newSourceMode: String(ele.newSourceMode)
              }
            });
            console.log(this.tableData, "拿到的数据");
          });
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 提交
    save(str) {
      this.form.validateFields((err, values) => {
        if (!err) {
          if (this.tableData.length <= 0) {
            this.$message.info("请选择变更资产");
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
          let arr = [];
          for (let i = 0; i < this.tableData.length; i++) {
            if (String(this.changeType) === "1") {
              if (!this.tableData[i].transferOperationArea) {
                this.$message.info("请输入交付运营面积");
                return;
              }
            } else if (String(this.changeType) === "2") {
              if (!this.tableData[i].transferArea) {
                this.$message.info("请输入交付物业面积");
                return;
              }
            } else if (String(this.changeType) === "3") {
              if (
                conditionalJudgment.includes(this.tableData[i].newOriginalValue)
              ) {
                this.$message.info("请输入变更后原值");
                return;
              }
            } else if (String(this.changeType) === "4") {
              if (String(this.assetType) === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT){
                if(conditionalJudgment.includes(this.tableData[i].newUseDirection)){
                  this.$message.info("请输入变更后使用方向");
                  return;
                }
              }else {
                if (
                  conditionalJudgment.includes(this.tableData[i].operationArea)
                ) {
                  this.$message.info("请输入运营面积");
                  return;
                } else if (
                  conditionalJudgment.includes(this.tableData[i].selfUserArea)
                ) {
                  this.$message.info("请输入自用面积");
                  return;
                } else if (
                  conditionalJudgment.includes(this.tableData[i].idleArea)
                ) {
                  this.$message.info("请输入闲置面积");
                  return;
                } else if (
                  conditionalJudgment.includes(this.tableData[i].occupationArea)
                ) {
                  this.$message.info("请输入占用面积");
                  return;
                } else if (
                  conditionalJudgment.includes(this.tableData[i].otherArea)
                ) {
                  this.$message.info("请输入其他面积");
                  return;
                }
              }
            } else if (String(this.changeType) === "5") {
              if (!this.tableData[i].addressName) {
                this.$message.info("请输入变更后位置");
                return;
              }
            } else if (String(this.changeType) === "6") {
              if (!this.tableData[i].changeProjectId) {
                this.$message.info("请选择变更后资产项目");
                return;
              }
            } else if (String(this.changeType) === "7") {
              if (!this.tableData[i].newAssetName) {
                this.$message.info("请选择变更后资产名称");
                return;
              }
              if (!this.tableData[i].newAssetCode) {
                this.$message.info("变更后资产编码");
                return;
              }
              if (!this.tableData[i].newSourceMode) {
                this.$message.info("变更后来源方式");
                return;
              }
              if (!this.tableData[i].newAssetCategoryCode) {
                this.$message.info("变更后资产分类");
                return;
              }
            } else if (String(this.changeType) === "8") {
              if (!this.tableData[i].newCreditorAmount) {
                this.$message.info("请选择变更后债权金额");
                return;
              }
              if (!this.tableData[i].newDebtAmount) {
                this.$message.info("变更后债务金额");
                return;
              }
            } else if (String(this.changeType) === "9") {
              if (!this.tableData[i].newAssetArea) {
                this.$message.info("请输入变更后资产面积");
                return;
              }
            }
          }

          this.tableData.forEach((item) => {
            arr.push({
              assetId: item.assetId,
              projectId: Number(item.projectId), // 资产项目Id
              changeProjectId:
                String(this.changeType) === "6"
                  ? Number(item.changeProjectId)
                  : "",
              assetType: item.assetType, // 资产类型 1:楼栋，2房间，3构筑物，4土地，5设备  item.assetType
              assetObjectId: item.assetObjectId, // 资产对象Id 为1和2时，asset_object_id对应的ams_asset_house表asset_house_id
              address: String(this.changeType) === "5" ? item.addressName : "", // 变更位置
              transferArea:
                String(this.changeType) === "2" ? item.transferArea : "", // 交付物业面积-交付物业变更
              transferOperationArea:
                String(this.changeType) === "1"
                  ? item.transferOperationArea
                  : "", // 交付运营面积-交付运营变更
              operationArea:
                String(this.changeType) === "4" ? item.operationArea : "", // 运营面积-使用方向变更
              idleArea: String(this.changeType) === "4" ? item.idleArea : "", // 闲置面积
              selfUserArea:
                String(this.changeType) === "4" ? item.selfUserArea : "", // 自用面积
              occupationArea:
                String(this.changeType) === "4" ? item.occupationArea : "", // 占用面积
              otherArea: String(this.changeType) === "4" ? item.otherArea : "", // 其他面积
              originalValue:
                String(this.changeType) === "3" ? item.newOriginalValue : "", // 资产原值
              newAssetName:
                String(this.changeType) === "7" ? item.newAssetName : "", // 变更后资产名称
              newAssetCode:
                String(this.changeType) === "7" ? item.newAssetCode : "", // 变更后资产编码
              newSourceMode:
                String(this.changeType) === "7" ? item.newSourceMode : "", // 变更后来源方式
              decorationSituation:
                String(this.changeType) === "7" &&
                ["1"].includes(String(this.assetType))
                  ? item.newDecorationSituation
                  : "", // 变更后装修情况
              creditorAmount:
                String(this.changeType) === "8" ? item.newCreditorAmount : "", // 变更后债权金额
              debtAmount:
                String(this.changeType) === "8" ? item.newDebtAmount : "", // 变更后债权金额
              newAssetArea: String(this.changeType) === "9" ? item.newAssetArea : "" ,  // 变更后资产面积
              newUseDirection: ((String(this.changeType) === "4") && String(this.assetType) === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT) ? item.newUseDirection : "", // 变更后使用方向(设备设施 独有)
              newAssetCategoryCode: String(this.changeType) === "7" ? item.newAssetCategoryCode : "" // 变更后资产分类
            });
          });
          let obj = {
            saveType: str === "draft" ? 0 : 1,
            changeOrderId: this.changeOrderId, // 资产变更单Id（新增为空）
            title: values.title, // 标题
            projectId: Number(values.projectId), // 资产项目Id
            assetType: Number(values.assetType), // 资产项目Id
            changeType: values.changeType, // 变更类型Id
            remark: values.remark, // 备注
            organId: Number(values.organId), // 组织机构id
            changeDate: `${values.changeDate.format("YYYY-MM-DD")}`, // 变更日期
            attachment: files, // 附件
            originalObjectType: values.originalObjectType,
            originalObjectId: values.originalObjectId,
            originalValue: values.originalValue,
            shareWay: values.shareWay,
            assetDetailList: arr,
          };
          let loadingName = this.SG_Loding("保存中...");
          this.$api.assets.submitChange(obj).then((res) => {
            if (Number(res.data.code) === 0) {
              this.DE_Loding(loadingName).then(() => {
                this.$SG_Message.success("提交成功");
                this.$router.push({
                  path: "/assetChangeRegister",
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
    // 确定拿到数据
    status(val, data) {
      this.checkedData = [...val];
      data.forEach((item) => {
        // 默认 取 资产项目的来源方式 如果需要在弹窗中展示 来源方式,这个就要后端去做了
        let oldSourceModeName = item.sourceModeName || item.oldSourceModeName
        if(!oldSourceModeName){
          let sourceType = this.projectList.find(ele=>ele.projectId === this.projectId).sourceType
          oldSourceModeName = this.sourceOptions.find(ele=>ele.key === String(sourceType)).title
        }

        item.key = item.assetId;
        item.oldDecorationSituation = item.decorationSituation;
        // 弹窗中返回的是 sourceModeName 但是 columns 中绑定的是 oldSourceModeName,因为草稿状态 回显的时候需要这样
        item.oldSourceModeName = oldSourceModeName
      });
      this.tableData = data;
      console.log("有走这里=>", this.tableData);
      this.$refs.assetBundlePopover.show = false;
    },
    // 添加资产
    addTheAsset() {
      if (!this.form.getFieldValue("projectId")) {
        this.$message.info("请先选择资产项目");
        return;
      }
      if (!this.form.getFieldValue("assetType")) {
        this.$message.info("请先选择资产类型");
        return;
      }
      if (this.changeType) {
        this.$refs.assetBundlePopover.redactCheckedDataFn(
          this.checkedData,
          this.form.getFieldValue("projectId"),
          this.form.getFieldValue("assetType"),
          this.tableData
        );
        this.$refs.assetBundlePopover.show = true;
      } else {
        this.$message.info("请先选择变更类型");
      }
    },
    // 变更类型
    changeTypeChange(val) {
      this.changeType = val;
    },
    // 分摊方式改变
    shareWayChange(val) {
      this.shareWay = val;
      console.log("分摊方式改变=>", val);
      this.computedEqually();
    },
    // 平均分摊值改变
    originalValueChange(val) {
      this.originalValue = val;
      this.computedEqually();
      if(val==0){
        this.tableData.map((item) => {
          item.newOriginalValue = 0
        })
      }
    },
    // 资产类型改变
    assetTypeChange(val) {
      this.assetType = val;
      console.log("资产类型改变=>", val);
      this.form.setFieldsValue({
        changeType: '',
      });
      this.changeTypeChange("")
      // 如果是设备 并且变更类型是原值变动  原值对象类型非资产
      this.handleDefaultShareWay();
      // 装修情况有变化
      this.handleBaseAndHuse();
      // 清空表格
      this.tableData = []
    },
    handleDefaultShareWay() {
      // 如果是设备 并且变更类型是原值变动  原值对象类型非资产
      if (this.changeType === "3" && this.originalObjectType !== "4") {
        let value = this.assetType === "3" ? "2" : "1";
        this.form.setFieldsValue({ shareWay: value });
        this.shareWay = value;
      }
    },
    // 拼接备注
    joinRemark() {
      // 根据”+$原值对象类型$（$原值对象$）+“资产原值”+$原值金额$+$原值分摊规则$，
      //如根据楼栋（楼栋001）资产原值为100000按照资产面积分摊
      if (this.changeType === "3" && this.originalObjectType !== "4") {
        let originalObjectTypeName = this.originalObjectTypeDataCom.find(
          (item) => item.value === this.originalObjectType
        ).name;
        let originalObjectId =
          this.form.getFieldValue("originalObjectId") || "";
        let originalObjectIdName = this.originalObjectIdData.find(
          (item) => item.value === originalObjectId
        ).name;
        let shareWayName = this.shareWayData.find(
          (item) => item.value === this.shareWay
        ).name;
        let originalValue = this.originalValue;
        return `根据${originalObjectTypeName}(${originalObjectIdName})资产原值${originalValue}${shareWayName}`;
      }
      return "";
    },
    // 计算平均分摊值
    computedEqually: debounce(function () {
      let shareWay = this.shareWay;
      let originalValue = this.originalValue;
      // console.log("原值分摊方式");
      // console.log("shareWay", shareWay);
      // console.log("originalValue", originalValue);
      // console.log("this.tableData.length", this.tableData.length);
      if (!shareWay || !originalValue || !this.tableData.length) {
        return;
      }
      // 按资产面积分摊
      if (shareWay === "1") {
        let meanTotal = 0
        // 把面积叠加起来
        let nums = this.tableData.reduce((nums, item) => {
          return calc.add(nums, item.assetArea ? Number(item.assetArea) : 0);
        }, 0);
        // 平均值
        let pin = calc.divide(originalValue, nums);
        this.tableData.forEach((item) => {
          item.newOriginalValue = !Number(item.assetArea)
            ? 0
            : Number(Number(calc.multiply(pin, item.assetArea)).toFixed(2));
        });
        // 计算平均值总和
        meanTotal = this.tableData.reduce((sun, current) => calc.add(sun, current.newOriginalValue || 0), 0)
        // 如果平均值总和大于输入值  大于的部分从第一个有面积的地方减去
        if (meanTotal > originalValue) {
          let big = calc.minus(meanTotal, originalValue)
          for(let i = 0; i <= this.tableData.length; i++){
            if (Number(this.tableData[i].assetArea) !== 0) {
              this.tableData[i].newOriginalValue = calc.minus(this.tableData[i].newOriginalValue, big)
              return
            }
          }
        } else if (meanTotal < originalValue) {
        // 如果平均值总和小于输入值  多出来的部分从第一个面积加进去
          let big = calc.minus(originalValue, meanTotal)
          for(let i = 0; i <= this.tableData.length; i++){
            if (Number(this.tableData[i].assetArea) !== 0) {
              this.tableData[i].newOriginalValue = calc.add(big, this.tableData[i].newOriginalValue)
              return
            }
          }
        }
        // 依次各个值
      }
      // 按资产个数分摊
      if (shareWay === "2") {
        // 平均值
        let pin = calc.divide(originalValue, this.tableData.length);
        this.tableData.forEach((item) => {
          item.newOriginalValue = Number(pin.toFixed(2));
        });
        // 依次各个值
      }
      let str = this.joinRemark()
      console.log('str',str)
      this.form.setFieldsValue({ remark: this.joinRemark(str) });
    }, 200),
    // 当为基础信息变动， 并且为房屋或者车场，资产类型
    handleBaseAndHuse() {
      console.log("会进到这里来2", this.changeType, "www", this.assetType);
      if (this.changeType === "7") {
        // 房屋
        if (this.assetType === this.$store.state.ASSET_TYPE_CODE.HOUSE) {
          this.columns = baseChangeTwo;
        }else {
          this.columns = baseChange;
        }
      }
    },
    // 资产类型改变清空值
    assetTypeChangeClear() {
      // 如果是变更类型资产原值
      if (this.changeType === "3") {
        this.form.setFieldsValue({
          originalObjectType: undefined,
          originalObjectId: undefined,
          shareWay: undefined,
          originalValue: undefined,
        });
        this.originalObjectIdData = [];
        this.tableData = [];
        this.checkedData = [];
      }
      this.handleDefaultShareWay();
    },
    // 资产项目改变
    projectChangeFn(val) {
      let changeType = this.form.getFieldValue("changeType");
      let originalObjectType = this.form.getFieldValue("originalObjectType");
      this.projectId = val;
      this.checkedData = [];
      this.tableData = [];
      // 如果是变更类型是资产原值
      console.log("变更类型=>", changeType, originalObjectType);
      if (changeType === "3") {
        this.form.setFieldsValue({ originalObjectId: undefined });
        // 如果原值对象类型是项目
        if (originalObjectType === "1") {
          this.originalObjectProject();
        }
        // 如果原值对象类型是楼栋
        if (originalObjectType === "2") {
          this.organBuild();
        }
        // 如果原值对象类型是车场
        if (originalObjectType === "3") {
          this.getParkApiList();
        }
      }
    },
    // 原值对象类型改变
    originalObjectTypeChange(val) {
      console.log("进入原值对象类型改变");
      let projectId = this.form.getFieldValue("projectId");
      this.originalObjectType = val;
      this.originalObjectIdData = [];
      this.tableData = [];
      this.checkedData = [];
      if (["1", "2"].includes(val)) {
        this.form.setFieldsValue({ originalObjectId: undefined });
      }
      if (!projectId) {
        this.$nextTick(() => {
          this.form.setFieldsValue({ originalObjectType: undefined });
          this.originalObjectType = undefined;
        });
        this.$message.error("请选择资产项目!");
        return;
      }
      // 选择资产项目
      if (val === "1") {
        this.originalObjectProject();
      }
      // 选择楼栋
      if (val === "2") {
        this.organBuild(val);
      }
      // 选择车场
      if (val === "3") {
        this.getParkApiList();
      }
      // 选择车场 原值分摊方式 处理
      this.$nextTick(() => {
        this.handleDefaultShareWay();
      });
    },
    // 项目生成原值对象
    originalObjectProject() {
      let projectId = this.projectId;
      // let projectId = this.form.getFieldValue("projectId");
      this.originalObjectIdData = [
        this.projectIdData.find((item) => item.value === projectId),
      ];
    },
    handleFormatAssetData(data){
      return data.map((element) => {
        element.key = element.assetId;
        element.oldOriginalValue = element.originalValue;
        element.newOriginalValue = ""; // 变动后原值
        element.transferArea = ""; // 交付物业面积
        element.transferOperationArea = ""; // 交付运营面积
        element.addressName = ""; // 变动后位置
        element.changeProjectId = ""; // 变动后资产项目
        element.oldWarrantNbr = element.warrantNbr;
        element.warrantNbr = undefined;
        element.warrantNbrData = []; // 用于存储单个下拉框数据
        element.warrantGeneralData = []; // 用于存权证号总是数据
        element.disposeCost = ""; // 处置成本
        element.disposeReceive = ""; // 处置收入
        element.remark = ""; // 处置备注
        return {
          ...element,
        };
      });
    },
    async getStallApiPageList(val){
      let projectId = this.form.getFieldValue("projectId");
      const requestData  = {
        organId: this.organId, // 机构id
        projectIdList: [projectId], // 车场Id
        placeIdList: [val],
        type:'2'
      }
      const {data:{code,data}} = await this.$api.assets.carPage(requestData)
      if (code === '0'){
        let resultList =  data
        this.checkedData = resultList.map(ele=>ele.assetId);
        this.tableData = this.handleFormatAssetData(resultList);
        this.computedEqually();
      }
    },
    async getParkApiList(){
      const requestData = {
        organId: this.organId,
        onlyCurrentNode: 1,
        pageNo: 1,
        pageLength: 9999
      }
      const {data:{code,data}} = await this.$api.building.parkApiList(requestData)
      if (code === "0") {
        let result = data ? data.resultList : [];
        this.originalObjectIdData = result.map(item => {
          return {
            ...item,
            name: item.placeName,
            value: item.placeId,
          };
        });
      }
    },
    // 项目请求楼栋
    organBuild() {
      let data = {
        organId: this.organId,
        projectId: this.projectId,
      };
      this.$api.assets.organBuild(data).then((res) => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          this.originalObjectIdData = result.map((item) => {
            return {
              ...item,
              name: item.buildName,
              value: item.buildId,
            };
          });
        }
      });
    },
    // 楼栋请求房屋
    queryAssetViewPage2(val) {
      let projectId = this.form.getFieldValue("projectId");
      let data = {
        organId: this.organId,
        projectIdList: [projectId],
        buildIdList: [val],
        type: "2",
      };
      this.$api.assets.queryAssetViewPage2(data).then((res) => {
        if (res.data.code === "0") {
          let result = res.data.data || [];
          this.checkedData = result.map(ele=>ele.assetId);
          this.tableData = this.handleFormatAssetData(result);
          this.computedEqually();
        }
      });
    },
    // 原值对象值改变
    originalObjectIdChange(val) {
      let originalObjectType = this.form.getFieldValue("originalObjectType");
      // 如果是项目
      if (originalObjectType === "1") {
        this.assetListPage();
      }
      // 如果原值对象是楼栋，则请求房间
      if (originalObjectType === "2") {
        this.queryAssetViewPage2(val);
      }
      // 如果原值对象是车场，则请求车场
      if (originalObjectType === "3") {
        this.getStallApiPageList(val);
      }
    },
    // 项目请求全部资产
    assetListPage() {
      let assetType = this.form.getFieldValue("assetType");
      let projectId = this.form.getFieldValue("projectId");
      let obj = {
        organId: this.organId,
        assetType,
        queryType: "1",
        projectId,
        pageNum: 1,
        pageSize: 10000,
      };
      this.$api.assets.assetListPage(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let result = res.data.data.data || [];
          this.checkedData = result.map(ele=>ele.assetId);
          this.tableData = this.handleFormatAssetData(result);
          this.computedEqually();
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 删除
    deleteFn(record) {
      this.tableData.forEach((item, index) => {
        if (item.assetId === record.assetId) {
          this.tableData.splice(index, 1);
        }
      });
      this.checkedData.forEach((item, index) => {
        if (record.assetId === item) {
          this.checkedData.splice(index, 1);
        }
      });
      // 如果是资产原值，且知产是自动计算
      if (
        this.changeType == "3" &&
        ["1", "2"].includes(this.originalObjectType)
      ) {
        this.computedEqually();
      }
    },
    // 验证资产对象原值
    validatorOriginalValue(rule, value, callback) {
      if (Number(value) > 99999999999.99) {
        callback("最大值99999999999.99");
      } else {
        callback();
      }
    },
    // 平台字典获取变更类型
    platformDictFn(code) {
      let obj = {
        code,
      };
      this.$api.assets.platformDict(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          // 变更类型
          if (code === "asset_change_type") {
            this.changeTypeData = [...data];
            // this.changeTypeData.push({ name: "基础信息", value: "7" });
            // this.changeTypeData.push({ name: "债权债务", value: "8" });
          }
          // 资产类型
          if (code === "asset_type") {
            this.assetTypeData = [...data];
          }
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 资产项目
    getObjectKeyValueByOrganIdFn() {
      let obj = {
        organId: this.organId,
        projectName: "",
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then((res) => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let arr = [];
          data.forEach((item) => {
            arr.push({
              name: item.projectName,
              value: item.projectId,
              label: item.projectName,
            });
          });
          this.projectIdData = [...arr];
          this.projectList = data
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 取消
    cancel() {
      this.$router.push({ path: "/assetChangeRegister" });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
  },
};
</script>
<style lang="less" scoped>
.newEditSingle {
  padding-bottom: 70px;
  .newEditSingle-nav {
    padding: 42px 106px 70px 94px;
  }
  .playground-row {
    margin-top: 28px;
  }
  .tab-nav {
    margin-top: 40px;
    .button-box {
      overflow: hidden;
      margin-bottom: 10px;
      .buytton-nav {
        float: right;
      }
    }
  }
  .postAssignment-icon {
    cursor: pointer;
    color: #0084ff;
    // font-size: 18px;
  }
  .postAssignment-icon:hover {
    color: red;
  }
}
</style>

<style lang="less">
.newEditSingle {
  .ant-form-item-label label:after {
    margin: 0 0 0 2px;
  }
}
</style>
