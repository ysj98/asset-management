<!--
  新增: new
  编辑: edit
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
                placeholder="请输入标题"
                :style="allWidth"
                :max="50"
                v-decorator="['title',
                {rules: [{required: true, max: 50, whitespace: true, message: '请输入标题(不超过50字符)'}], initialValue: newEditSingleData.title}
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
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">变更类型：</label>
              <a-select
                showSearch
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
                  v-for="(item) in changeTypeData"
                  :key="item.value"
                  :value="item.value"
                >{{item.name}}</a-select-option>
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">变动日期：</label>
              <a-date-picker
                :style="allWidth"
                placeholder="请选择变动日期"
                v-decorator="['changeDate',
                {rules: [{required: true, message: '请选择变动日期'}]}
              ]"
              />
            </a-form-item>
          </a-col>
          <!-- 选择变动类型为，资产原值 -->
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
                    v-for="(item) in originalObjectTypeData"
                    :key="item.value"
                    :value="item.value"
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
                    :max="99999999999.99"
                    :min="0"
                    :precision="0"
                    v-decorator="['originalValue',
                {rules: [{required: true, message: '请输入原值金额'}],
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
                    :style="allWidth"
                    placeholder="请选择原值分摊方式"
                    v-decorator="['shareWay',{
                    rules: [{required: true, message: '请选择原值分摊方式'}],
                    initialValue: newEditSingleData.shareWay
                  }]"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                  >
                    <a-select-option
                      v-for="(item) in shareWayData"
                      :key="item.value"
                      :value="item.value"
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
          <SG-Button class="buytton-nav" type="primary" weaken @click="addTheAsset">添加资产</SG-Button>
        </div>
        <div
          class="table-layout-fixed"
          v-if="columns.length !== 0"
          :class="{'table-border': tableData.length != 0}"
        >
          <a-table
            :scroll="{y: 450}"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
          >
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
            <!-- 使用方向变动 -->
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
            <!-- 原值变动 -->
            <template v-if="changeType === '3'" slot="newOriginalValue" slot-scope="text, record">
              <a-input-number
                size="small"
                :min="0"
                :step="1.00"
                :precision="2"
                v-model="record.newOriginalValue"
              />
            </template>
            <!-- 位置变动 -->
            <template v-if="changeType === '5'" slot="addressName" slot-scope="text, record">
              <a-input size="small" maxlength="100" v-model="record.addressName" />
            </template>
            <!-- 资产项目变动 -->
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
                :options="projectIdData"
                :allowClear="true"
                :filterOption="filterOption"
                notFoundContent="没有查询到数据"
              />
            </template>
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
    <AssetBundlePopover :organId="organId" queryType="1" ref="assetBundlePopover" @status="status"></AssetBundlePopover>
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
import AssetBundlePopover from "../../common/assetBundlePopover";
import {
  deliveryProperty,
  deliveryOperation,
  changeDirectionUse,
  variationOriginalValue,
  positionChange,
  projectChange
} from "./basics";
import FormFooter from "@/components/FormFooter";
import noDataTips from "@/components/noDataTips";
import moment from "moment";
const newEditSingleData = {
  title: "", // 登记单名称
  changeType: undefined, // 变更类型
  assetType: undefined, // 资产类型
  projectId: undefined, // 资产项目
  originalObjectType: undefined, // 原值对象类型
  originalObjectId: undefined, // 原值对象
  originalValue: undefined, // 原值金额
  shareWay: "", // 原值分摊方式
  changeDate: {}, // 变动日期
  remark: "", // 备注
  files: [],
  organId: ""
};
const conditionalJudgment = [undefined, null, ""];
const originalObjectTypeData = [
  { name: "资产项目", value: "1" },
  { name: "楼栋", value: "2" },
  // { name: "车场", value: "3" },
  { name: "资产", value: "4" }
];
const shareWayData = [
  { name: "按资产面积分摊", value: "1" },
  { name: "按资产个数分摊", value: "2" }
];
export default {
  components: { AssetBundlePopover, FormFooter, noDataTips },
  props: {},
  data() {
    return {
      changeOrderId: "",
      organId: "",
      enitData: "",
      changeType: "", // 用来判断对象变更类型
      originalObjectType: "", // 原值对象类型
      projectId: "", // 项目id
      checkedData: [],
      show: false,
      columns: [],
      tableData: [],
      organIdData: [], // 组织机构写死
      changeTypeData: [], // 变更类型
      projectIdData: [], // 资产项目
      assetTypeData: [], // 资产类型
      originalObjectTypeData, // 原值对象类型
      originalObjectIdData: [], // 原值对象值
      shareWayData, // 原值分摊方式
      newEditSingleData: { ...newEditSingleData },
      form: this.$form.createForm(this),
      allWidth: "width: 200px",
      widthBox: "width: 80%",
      formItemTextarea: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 }
        }
      },
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 16 }
        }
      }
    };
  },
  computed: {},
  watch: {
    changeType(val) {
      this.checkedData = [];
      this.tableData = [];
      if (val === "2") {
        this.columns = deliveryProperty;
      } else if (val === "1") {
        this.columns = deliveryOperation;
      } else if (val === "4") {
        this.columns = changeDirectionUse;
      } else if (val === "3") {
        this.columns = variationOriginalValue;
      } else if (val === "5") {
        this.columns = positionChange;
      } else if (val === "6") {
        this.columns = projectChange;
      }
    }
  },
  created() {
    this.organIdData = JSON.parse(this.$route.query.record);
    this.organId = this.organIdData[0].value;
    this.setType = this.$route.query.setType;
  },
  mounted() {
    this.getObjectKeyValueByOrganIdFn();
    this.platformDictFn("asset_change_type");
    this.platformDictFn("asset_type");
    if (this.setType === "edit") {
      this.enitData = JSON.parse(this.$route.query.enitData);
      this.changeOrderId = this.enitData[0].changeOrderId;
      this.editFn();
    } else {
      this.form.setFieldsValue({
        organId: this.organIdData[0].value
      });
    }
  },
  methods: {
    // 编辑获取接口
    editFn() {
      let obj = {
        changeOrderId: this.changeOrderId
      };
      this.$api.assets.getChangeInfo(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          this.changeType = String(data.changeType);
          let files = [];
          if (data.attachment && data.attachment.length > 0) {
            data.attachment.forEach(item => {
              files.push({
                url: item.attachmentPath,
                name: item.newAttachmentName
              });
            });
          }
          this.newEditSingleData.files = files;
          let checkedData = [];
          data.assetDetailList.forEach((item, index) => {
            item.key = item.assetId + index;
            item.addressName = item.address;
            item.newOriginalValue = item.originalValue;
            checkedData.push(item.assetId);
          });
          this.$nextTick(() => {
            this.form.setFieldsValue({
              organId: this.organIdData[0].value,
              projectId: data.projectId,
              title: data.title,
              changeType: String(data.changeType),
              changeDate: moment(data.changeDate, "YYYY-MM-DD"),
              remark: data.remark
            });
            this.checkedData = [...checkedData];
            this.tableData = data.assetDetailList;
          });
          console.log(this.tableData, "拿到的数据");
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
            this.$message.info("请选择变动资产");
            return;
          }
          let files = [];
          if (this.newEditSingleData.files.length > 0) {
            this.newEditSingleData.files.forEach(list => {
              files.push({
                attachmentPath: list.url,
                oldAttachmentName: list.name
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
                this.$message.info("请输入变动后原值");
                return;
              }
            } else if (String(this.changeType) === "4") {
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
            } else if (String(this.changeType) === "5") {
              if (!this.tableData[i].addressName) {
                this.$message.info("请输入变动后位置");
                return;
              }
            } else if (String(this.changeType) === "6") {
              if (!this.tableData[i].changeProjectId) {
                this.$message.info("请选择变动后资产项目");
                return;
              }
            }
          }
          this.tableData.forEach(item => {
            arr.push({
              assetId: item.assetId,
              projectId: Number(item.projectId), // 资产项目Id
              changeProjectId:
                String(this.changeType) === "6"
                  ? Number(item.changeProjectId)
                  : "",
              assetType: item.assetType, // 资产类型 1:楼栋，2房间，3构筑物，4土地，5设备  item.assetType
              assetObjectId: item.assetObjectId, // 资产对象Id 为1和2时，asset_object_id对应的ams_asset_house表asset_house_id
              address: String(this.changeType) === "5" ? item.addressName : "", // 变动位置
              transferArea:
                String(this.changeType) === "2" ? item.transferArea : "", // 交付物业面积-交付物业变动
              transferOperationArea:
                String(this.changeType) === "1"
                  ? item.transferOperationArea
                  : "", // 交付运营面积-交付运营变动
              operationArea:
                String(this.changeType) === "4" ? item.operationArea : "", // 运营面积-使用方向变动
              idleArea: String(this.changeType) === "4" ? item.idleArea : "", // 闲置面积
              selfUserArea:
                String(this.changeType) === "4" ? item.selfUserArea : "", // 自用面积
              occupationArea:
                String(this.changeType) === "4" ? item.occupationArea : "", // 占用面积
              otherArea: String(this.changeType) === "4" ? item.otherArea : "", // 其他面积
              originalValue:
                String(this.changeType) === "3" ? item.newOriginalValue : "" // 资产原值
            });
          });
          let obj = {
            saveType: str === "draft" ? 0 : 1,
            changeOrderId: this.changeOrderId, // 资产变动单Id（新增为空）
            title: values.title, // 标题
            projectId: Number(values.projectId), // 资产项目Id
            changeType: values.changeType, // 变更类型Id
            remark: values.remark, // 备注
            organId: Number(values.organId), // 组织机构id
            changeDate: `${values.changeDate.format("YYYY-MM-DD")}`, // 变动日期
            attachment: files, // 附件
            assetDetailList: arr
          };
          let loadingName = this.SG_Loding("保存中...");
          this.$api.assets.submitChange(obj).then(res => {
            if (Number(res.data.code) === 0) {
              this.DE_Loding(loadingName).then(() => {
                this.$SG_Message.success("提交成功");
                this.$router.push({
                  path: "/assetChange",
                  query: { refresh: true }
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
      data.forEach((item, index) => {
        item.key = item.assetId;
      });
      this.tableData = data;
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
    // 资产类型改变
    assetTypeChange(val) {},
    // 资产项目改变
    projectChangeFn(val) {
      this.projectId = val;
      this.checkedData = [];
      this.tableData = [];
    },
    // 原值对象类型改变
    originalObjectTypeChange(val) {
      console.log("进入原值对象类型改变");
      this.originalObjectType = val;
      this.originalObjectIdData = []
      if (['1', '2'].includes(val)) {
        this.form.setFieldsValue({ originalObjectId: undefined });
      }
      if (!this.projectId) {
        this.$nextTick(() => {
          this.form.setFieldsValue({ originalObjectType: undefined });
          this.originalObjectType = undefined;
        });
        this.$message.error("请选择资产项目!");
        return;
      }
      // 选择资产项目
      if (val === "1") {
        this.originalObjectIdData = [
          this.projectIdData.find(item => item.value === this.projectId)
        ];
      }
      // 选择楼栋
      if (val === "2") {
        let data = {
          organId: this.organId,
          projectId: this.projectId
        }
        this.$api.assets.organBuild(data).then((res) => {
          if (res.data.code === '0') {
            let result = res.data.data || []
            this.originalObjectIdData = result.map(item => {
              return {
                ...item,
                name: item.buildName,
                value: item.buildId
              }
            })
          }
        });
      }
      // 选择车场
    },
    // 原值对象值
    originalObjectIdChange(val) {},
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
    },
    // 平台字典获取变更类型
    platformDictFn(code) {
      let obj = {
        code
      };
      this.$api.assets.platformDict(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          // 变更类型
          if (code === "asset_change_type") {
            this.changeTypeData = [...data];
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
        projectName: ""
      };
      this.$api.assets.getObjectKeyValueByOrganId(obj).then(res => {
        if (Number(res.data.code) === 0) {
          let data = res.data.data;
          let arr = [];
          data.forEach(item => {
            arr.push({
              name: item.projectName,
              value: item.projectId,
              label: item.projectName
            });
          });
          this.projectIdData = [...arr];
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 取消
    cancel() {
      this.$router.push({ path: "/assetChange" });
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    }
  }
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
