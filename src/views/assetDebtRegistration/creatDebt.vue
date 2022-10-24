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
              <label slot="label">所属组织机构：</label>
              <a-input
                placeholder="请输入组织机构"
                :style="allWidth"
                :disabled="true"
                v-decorator="[
                  'organName',
                  { rules: [], initialValue: organName },
                ]"
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
                v-decorator="[
                  'projectId',
                  {
                    rules: [{ required: true, message: '请选择资产项目' }],
                    initialValue: newDebt.projectId,
                  },
                ]"
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
            <a-form-item
              :colon="false"
              label="债务类型："
              v-bind="formItemLayout"
            >
              <label slot="label">债务类型：</label>
              <a-select
                :style="allWidth"
                placeholder="请选择债务类型"
                v-decorator="[
                  'debtType',
                  {
                    rules: [{ required: true, message: '请选择债务类型' }],
                    initialValue: newDebt.debtType,
                  },
                ]"
                :allowClear="false"
                :options="debtTypeList"
                @change="assetTypeFn"
              >
              </a-select>
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">交付日期：</label>
              <a-range-picker
                v-decorator="[
                  'debtDate',
                  {
                    rules: [{ required: false, message: '请选择交付日期' }],
                    initialValue: newDebt.debtDate,
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">债权人：</label>
              <a-input
                placeholder="请输入债权人名称"
                :style="allWidth"
                :max="30"
                v-decorator="[
                  'creditor',
                  {
                    rules: [
                      {
                        required: false,
                        max: 30,
                        whitespace: true,
                        message: '请输入债权人名称',
                      },
                    ],
                    initialValue: newDebt.creditor,
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">债权人电话：</label>
              <a-input
                placeholder="请输入债权人电话"
                :style="allWidth"
                :max="30"
                v-decorator="[
                  'creditorTel',
                  {
                    rules: [
                      {
                        required: false,
                        max: 30,
                        whitespace: true,
                        message: '请输入债权人电话',
                      },
                    ],
                    initialValue: newDebt.creditorTel,
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">债权人地址：</label>
              <a-input
                placeholder="请输入债权人地址"
                :style="allWidth"
                :max="30"
                v-decorator="[
                  'creditorAddr',
                  {
                    rules: [
                      {
                        required: false,
                        max: 30,
                        whitespace: true,
                        message: '请输入债权人地址',
                      },
                    ],
                    initialValue: newDebt.creditorAddr,
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="8">
            <a-form-item :colon="false" v-bind="formItemLayout">
              <label slot="label">抵押额（元）：</label>
              <a-input
                placeholder="请输入抵押额"
                :style="allWidth"
                :max="30"
                :disabled="true"
                v-decorator="[
                  'amount',
                  {
                    rules: [
                      {
                        required: false,
                        whitespace: true,
                        message: '请输入抵押额',
                      },
                    ],
                    initialValue: newDebt.amount,
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item :colon="false" v-bind="formItemTextarea">
              <label slot="label"
                >备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：</label
              >
              <a-textarea
                placeholder="请输入备注"
                :style="widthBox"
                :autosize="{ minRows: 2, maxRows: 4 }"
                v-decorator="[
                  'remark',
                  {
                    rules: [
                      {
                        required: false,
                        max: 200,
                        message: '请输入问题备注(不超过200字符)',
                      },
                    ],
                    initialValue: newDebt.remark,
                  },
                ]"
              />
            </a-form-item>
          </a-col>
          <a-col class="playground-col" :span="24">
            <a-form-item :colon="false" v-bind="formItemTextarea">
              <label slot="label">上传附件：</label>
              <UploadFile v-model="newDebt.files" type="all" />
            </a-form-item>
          </a-col>
        </a-form>
      </a-row>
      <div class="tab-nav">
        <span class="section-title blue">资产明细</span>
        <div class="button-box">
          <!-- <div class="fl">交付资产数量：{{assetChangeCount || 0}}个<span v-if="!isSelectedEquipment">，合计交付面积：{{deliveryArea || '0'}}㎡</span></div> -->
          <div class="fr">
            <SG-Button class="mr10" type="primary" weaken @click="addTheAsset"
              >添加资产</SG-Button
            >
            <SG-Button
              :disabled="selectedRowKeys.length === 0"
              type="primary"
              weaken
              @click="deleteFn"
              >删除</SG-Button
            >
          </div>
        </div>
        <div
          class="table-layout-fixed"
          :class="{ 'table-border': tableData.length != 0 }"
        >
          <a-table
            :scroll="{ y: 450 }"
            :row-selection="{
              selectedRowKeys: selectedRowKeys,
              onChange: onSelectChange,
            }"
            :columns="columns"
            :dataSource="tableData"
            class="custom-table td-pd10"
            :pagination="false"
          >
          <template slot="num" slot-scope="text, record,index">
              {{index+1}}
            </template>
            <template slot="amount" slot-scope="text, record">
              <a-input
                size="small"
                v-model="record.amount"
                @change="checkAmount"
              />
            </template>
            <template slot="operation" slot-scope="text, record,index">
              <a @click="deleteRe(index)">删除</a>
            </template>
          </a-table>
        </div>
        <no-data-tips v-show="tableData.length === 0"></no-data-tips>
      </div>
    </div>
    <FormFooter style="border: none" location="fixed">
      <div>
        <SG-Button type="primary" @click="save()">提交</SG-Button>
        <!-- <SG-Button style="margin-left: 12px" type="primary" weaken @click="save('draft')">保存草稿</SG-Button> -->
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
import { calc, debounce } from "@/utils/utils";
import AssetBundlePopover from "src/views/common/assetBundlePopover";
import noDataTips from "@/components/noDataTips";
import FormFooter from "@/components/FormFooter";
import moment from "moment";
const conditionalJudgment = [undefined, null, ""];
const columns = [
  {
    title: "序号",
    dataIndex: "num",
    width: "5%",
    scopedSlots: { customRender: "num" },
  },
  {
    title: "资产编码",
    dataIndex: "assetCode",
    width: "10%",
  },
  {
    title: "资产名称",
    dataIndex: "assetName",
    width: "15%",
  },
  {
    title: "地址",
    dataIndex: "address",
    width: "15%",
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    width: "5%",
  },
  {
    title: "资产分类",
    dataIndex: "objectTypeName",
    width: "8%",
  },
  {
    title: "资产面积",
    dataIndex: "area",
    width: "10%",
  },
  {
    title: "金额",
    dataIndex: "amount",
    align: "center",
    width: "15%",
    scopedSlots: { customRender: "amount" },
  },
  {
    title: "操作",
    dataIndex: "operation",
    align: "center",
    width: "12%",
    scopedSlots: { customRender: "operation" },
  },
];
const debtTypeList = [
  {
    label: "抵押",
    value: '1',
  },
  {
    label: "质押",
    value: '2',
  },
];
const newDebt = {
  creditor: "", // 交付名称
  creditorTel: "",
  debtId:'',
  creditorAddr: "",
  amount: undefined,
  debtType: undefined, // 资产类型
  projectId: undefined, // 资产项目
  debtDate: [], // 交付日期
  remark: "", // 备注
  files: [],
};
export default {
  components: { AssetBundlePopover, noDataTips, FormFooter },
  props: {},
  data() {
    return {
      moment,
      debtType: "",
      debtId: "", // 债务id
      deliveryArea: "", // 交付面积
      assetChangeCount: "", // 资产数量
      setType: "", // 新增编辑
      selectedRowKeys: [], // 表格选择的数据
      checkedData: [],
      organIdData: [], // 父组件传进来的数据
      columns, // 表头
      tableData: [], // 表格内容
      organId: "", // 机构id
      organName: "", // 所属机构
      saveValues: "",
      debtTypeList: debtTypeList,
      assetTypeData: [], // 资产类型
      projectIdData: [], // 资产项目
      newDebt: { ...newDebt },
      form: this.$form.createForm(this),
      allWidth: "width: 160px",
      widthBox: "width: 80%",
      deliveryTypeOpt: [
        { value: "1", label: "交付物业" },
        { value: "2", label: "交付运营" },
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
    // isSelectedEquipment(){
    //   return String(this.debtType) === this.$store.state.ASSET_TYPE_CODE.EQUIPMENT
    // },
    // columnsCom(){
    //   if (this.isSelectedEquipment){
    //     const arr = ['deliveryArea','assetArea']
    //     return this.columns.filter(ele=> !arr.includes((ele.dataIndex || ele.key)))
    //   }else {
    //     return this.columns
    //   }
    // }
  },
  created() {
    this.organId = this.$route.query.organId;
    this.organName = this.$route.query.organName;
    this.setType = this.$route.query.setType; // 判断新增修改
  },
  mounted() {
    if (this.setType === "edit") {
      this.debtId = this.$route.query.debtId;
      Promise.all([
        this.editFn(),
        this.getDeliveryDetailList(), // 获取明细
        // this.getDeliveryDetailListStatistics(), // 获取汇总
        this.attachment(), // 获取附件
      ]).then((res) => {});
    }
    this.getObjectKeyValueByOrganIdFn(); // 获取资产项目
    this.platformDictFn(); // 获取资产类型
  },
  methods: {
    // 编辑回填基础信息
    editFn() {
      this.$api.debt
        .getDebtInfo({ debtId: this.debtId })
        .then((res) => {
          if (Number(res.data.code) === 0) {
            let obj = res.data.data;
            let o = {
              creditor: "", // 交付名称
              creditorTel: "",
              debtId:'',
              creditorAddr: "",
              amount: "",
              dateStart:undefined,
              dateEnd:undefined,
              debtType: undefined, // 资产类型
              projectId: undefined, // 资产项目
              remark: "", // 备注
            };
            for (var key in o) {
              if (["debtType", "deliveryType"].includes(key)) {
                o[key] = String(obj[key]);
              } else if (["dateStart", "dateEnd"].includes(key)) {
                o[key] = obj[key] ? moment(obj[key], "YYYY-MM-DD") : undefined;
              } else {
                o[key] = obj[key];
              }
            }
            console.log(o)
            o.debtDate=[moment(o.dateStart, "YYYY-MM-DD"),moment(o.dateEnd, "YYYY-MM-DD")]
            this.form.setFieldsValue(o);
            this.debtType = obj.debtType;
          } else {
            this.$message.error(res.data.message);
          }
        });
    },
    // 查资产明细
    getDeliveryDetailList() {
      this.$api.debt
        .getDebtInfoDetailLis({ debtId: this.debtId })
        .then((res) => {
          if (Number(res.data.code) === 0) {
            let data = res.data.data;
            this.checkedData = [];
            data.forEach((item) => {
              item.key = item.assetId;
            //   item.address = item.pasitionString;
            //   item.assetCategoryName = item.assetObjectTypeName;
            //   item.transferArea = item.oldTransferArea;
            //   item.transferOperationArea = item.oldTransferOperationArea;
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
      this.$api.delivery
        .getDeliveryDetailListStatistics({ deliveryId: this.deliveryId })
        .then((res) => {
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
        objectId: this.debtId, // 交付id
        objectType: "32", // 类型：交付信息18
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
          this.newDebt.files = files;
        } else {
          this.$message.error(res.data.message);
        }
      });
    },
    // 提交
    save() {
      this.form.validateFields((err, values) => {
          console.log(err, 'err11111')
        if (!err) {
            console.log(values)
          if (this.tableData.length === 0) {
            this.$message.info("请选择资产明细");
            return;
          }
          let match =/^(13[0-9]|14[01456879]|15[0-35-9]|16[2567]|17[0-8]|18[0-9]|19[0-35-9])\d{8}$/
          if(values.creditorTel&&values.creditorTel.length!=0){
              if(!values.creditorTel.match(match)){
                  this.$message.info("请填写正确的手机号码");
            return;
              }
          }
          let assetDetailList = this.tableData.map((item) => {
            return {
              debtDetailId: conditionalJudgment.includes(
                item.debtDetailId
              )
                ? ""
                : item.debtDetailId, //明细Id 修改时必填
              amount: conditionalJudgment.includes(item.amount)
                ? ""
                : item.amount, // 修改时必填
              assetId: item.assetId, // 资产id
            };
          });
          let files = [];
          if (this.newDebt.files.length > 0) {
            this.newDebt.files.forEach((list) => {
              files.push({
                attachmentPath: list.url,
                oldAttachmentName: list.name,
              });
            });
          }
          let obj = {
            organId: this.organId, // 组织机构id
            debtId:'',
            amount:values.amount,
            creditor: values.creditor, // 债权人
            creditorTel: values.creditorTel, //债权人电话
            creditorAddr: values.creditorAddr, // 债权人地址
            debtType: values.debtType, // 资产类型
            projectId: values.projectId, // 资产项目Id
            dateStart:
              values.debtDate.length==0
                ? ""
                : `${values.debtDate[0].format("YYYY-MM-DD")}`, // 交付日期
            dateEnd:
              values.debtDate.length==0
                ? ""
                : `${values.debtDate[1].format("YYYY-MM-DD")}`, // 截止日期
            remark: values.remark, // 备注
            attachmentList: files,
            detailList: assetDetailList, // 资产明细
          };
          console.log(obj)
          let loadingName = this.SG_Loding("保存中...");
          this.$api.debt.submitDebt(obj).then((res) => {
            if (Number(res.data.code) === 0) {
              this.DE_Loding(loadingName).then(() => {
                this.$SG_Message.success("提交成功");
                this.$router.push({
                  path: "/debt",
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
        this.deliveryArea = this.tableData.reduce(
          (sun, current) => calc.add(sun, current.deliveryArea || 0),
          0
        );
      } else {
        this.deliveryArea = 0;
      }
    },
    // 取消
    cancel() {
      this.$router.push({ path: "/debt" });
    },
    // 表格选择的数组
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys;
    },
    // 删除
    deleteFn() {
      let _this = this;
      this.$confirm({
        title: "提示",
        content: "确认要删除该条记录吗？",
        onOk() {
          let arr = [];
          _this.tableData = _this.tableData.filter(
            (m) => !_this.selectedRowKeys.includes(m.assetId)
          );
          _this.tableData.forEach((item) => {
            arr.push(item.assetId);
          });
          _this.checkedData = arr;
          _this.assetChangeCount = _this.tableData.length;
        //   _this.calcFn();
          _this.selectedRowKeys = [];
        },
      });
    },
    //单条删除
    deleteRe(val){
        this.tableData.splice(val,1)
    },
    // 确定拿到数据
    status(val, data) {
      this.checkedData = [...val];
      console.log(val);
      data.forEach((item) => {
        item.key = item.assetId;
        item.area = item.assetArea; // 交付面积默认为资产面积
        item.objectTypeName = item.assetCategoryName;
        item.amount=item.debtAmount
      });
      this.tableData = data;
      console.log(data)
      this.assetChangeCount = this.tableData.length;
      this.calcFn();
      this.$refs.assetBundlePopover.show = false;
    },
    // 添加资产
    addTheAsset() {
      if (!this.form.getFieldValue("projectId")) {
        this.$message.info("请先选择资产项目");
        return;
      }
      this.$refs.assetBundlePopover.redactCheckedDataFn(
        this.checkedData,
        this.form.getFieldValue("projectId"),
        '',
        this.tableData
      );
      this.$refs.assetBundlePopover.show = true;
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text
          .toLowerCase()
          .indexOf(input.toLowerCase()) >= 0
      );
    },
    // 平台字典获取资产类型
    platformDictFn() {
      let obj = {
        code: "asset_type",
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
        projectName: "",
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
    assetTypeFn (value) {
    //   this.tableData = []
    //   this.checkedData = []
    },
    checkAmount(){
        console.log(this.form)
        let count = 0
        this.tableData.forEach(ele=>{
            if(ele.amount){
                count+=Number(ele.amount) 
            }
        })
        this.form.setFieldsValue({'amount':String(count)})
    }
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
