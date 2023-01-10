<template>
  <div class="add_policy">
    <a-form :form="form" :layout="'vertical'">
      <SG-Title title="基本信息"/>
      <div class="main_info">
        <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item >
            <div slot="label" class="label_tit">
              保险单号<span>(必填):</span>
            </div>
            <a-input
              v-decorator="['insuranceCode',{initialValue: form.insuranceCode}]"
              placeholder="请输入保险单号"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="组织机构名称:"  class="label_tit">
            <a-input
              :disabled="true"
              v-model="organName"
            />
          </a-form-item>
        </a-col>
        <!-- <a-col :span="8">
          <a-form-item>
            <div slot="label" class="label_tit">
              资产项目<span>(必填):</span>
            </div>
            <a-select
              v-decorator="['projectId', {initialValue: form.projectId}]"
              class="project_style"
              :options="projectOptions"
              @change="changeProject"
              placeholder="请选择资产项目"
            ></a-select>
          </a-form-item>
        </a-col> -->
          <a-col :span="8">
            <a-form-item>
              <div slot="label" class="label_tit">
                保险类型<span>(必填):</span>
              </div>
              <a-select
                v-decorator="['insuranceType', {initialValue: form.insuranceType}]"
                class="project_style"
                :options="typeList"
                placeholder="请选择保险类型"
                :loading="loading && !typeList.length"
              ></a-select>
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item>
              <div slot="label" class="label_tit">
                投保人<span>(必填):</span>
              </div>
              <a-input
                v-decorator="['policyHolder', {initialValue: form.policyHolder}]"
                placeholder="请输入投保人"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item>
              <div slot="label" class="label_tit">
                保险公司<span>(必填):</span>
              </div>
              <a-select
                v-decorator="['insuranceCompanyId', {initialValue: form.insuranceCompanyId}]"
                class="project_style"
                :options="companyList"
                placeholder="请选择保险公司"
                :loading="loading && !projectOptions.length"
              ></a-select>
            </a-form-item>
          </a-col>
           <a-col :span="8">
            <a-form-item >
              <div slot="label" class="label_tit">
                保险公司电话<span>(非必填):</span>
              </div>
              <a-input
                v-decorator="['insurancePhone', {initialValue: form.insurancePhone}]"
                placeholder="请输入保险公司电话"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item>
              <div slot="label" class="label_tit">
                保单金额(合计)<span>(必填):</span>
              </div>
              <a-input
                @blur="inputClick($event)"
                v-decorator="['policyAmount', {initialValue: form.policyAmount}]"
                placeholder="请输入保单金额"
              />
            </a-form-item>
          </a-col>
           <a-col :span="8">
            <a-form-item>
              <div slot="label" class="label_tit">
                保险有效期<span>(必填):</span>
              </div>
              <SG-DatePicker
                v-decorator="['rangeValue', {initialValue: form.rangeValue}]"
                pickerType="RangePicker"
                format="YYYY-MM-DD"
                @change="change"
                ></SG-DatePicker>
              <!-- <a-range-picker v-decorator="['range-picker', { rules: [{ required: true, message: '请选择保险有效期' }] }]" /> -->
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="备注">
              <a-textarea
                :max-Length="2000"
                v-decorator="['remark', {initialValue: form.remark}]"
                placeholder="请填写备注(不超过2000字)"
                :autoSize="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <!-- 附件最多十个，最大80兆 -->
            <UploadFile
              :baseImgURL="configBase.hostImg1"
              type="all"
              v-model="attachmentList"
              :max="10"
              :maxSize="81920"
              :customDownload="
                (value) => {
                  return customDownload(value, $api.ownership.downLoadAnnex);
                }
              "
              :customUpload="
              (value) => {
                return customUpload(value, $api.ownership.uploadAnnex);
              }">
              <span slot="tips">(注：上传的附件最多为 10 个,且文件大小小于80M)</span>
            </UploadFile>
          </a-col>
        </a-row>
      </div>
    </a-form>
    <SG-Title title="资产信息"/>
    <div class="button-box">
      <SG-Button
        :disabled="selectedRowKeys.length <= 0"
        class="buytton-nav"
        style="margin-right: 10px;"
        weaken
        @click="deleteData"
      >删除</SG-Button>
      <SG-Button
        class="buytton-nav"
        type="primary"
        style="margin-right: 10px;"
        weaken
        @click="addTheAsset"
      >添加资产</SG-Button>
    </div>
    <a-table
      v-bind="tableObj"
      :row-selection="{ selectedRowKeys: selectedRowKeys, onChange: onSelectChange }"
      class="custom-table td-pd10">
      <template slot="action" slot-scope="text, record">
        <p @click="deleteAsset(record)" style="color: #40a9ff;cursor: pointer; font-size: 14px;margin-bottom:0;">删除</p>
      </template>
    </a-table>
    <FormFooter style="border:none;" location="fixed">
      <div>
        <SG-Button type="primary" @click="save()">提交</SG-Button>
        <SG-Button @click="cancel">取消</SG-Button>
      </div>
    </FormFooter>
    <AssetBundlePopover
      :changeType="true"
      assetType="1"
      :organId="organId"
      queryType="1"
      ref="assetBundlePopover"
      @status="status"
      :projectIdMultiple="true"
    ></AssetBundlePopover>
  </div>
</template>

<script>
import configBase from "@/config/config.base";
import SGUploadFilePlus from "@/components/SGUploadFilePlus";
import warantAnnex from '@/views/ownershipManagement/authorityCardManagement/warrantAnnex'
import FormFooter from "@/components/FormFooter";
import AssetBundlePopover from "../../common/assetBundlePopover";
import { reg } from '@/config/config.rules'
import moment from 'moment'
export default {
  components: {
    SGUploadFilePlus,
    FormFooter,
    AssetBundlePopover
  },
  mixins: [warantAnnex],
  data () {
    return {
      companyList: [],
      typeList: [],
      // defaultValue: [moment('2019-02-02'), moment('2019-02-04')],
      rangeValue: [undefined, undefined],
      organName: '', // 组织机构
      organId: '',
      loading: false,
      attachmentList: [],
      configBase,
      projectId: '',
      projectOptions: [],
      form: this.$form.createForm(this),
      tableObj: {
        pagination: false,
        rowKey: 'assetId',
        loading: false,
        dataSource: [],
        columns: [
          { title: '序号', dataIndex: 'index', width: 100},
          { title: '资产编码', dataIndex: 'assetCode' },
          { title: '资产名称', dataIndex: 'assetName' },
          { title: '地址', dataIndex: 'address', ellipsis: true },
          { title: '资产类型', dataIndex: 'assetTypeName' },
          { title: '资产分类', dataIndex: 'assetCategoryName' },
          { title: '资产面积（㎡）', dataIndex: 'assetArea' },
          { title: '操作', dataIndex: 'action', scopedSlots: { customRender: 'action' }, fixed: 'right', width: 100 }
        ]
      },
      checkedData: [],
      selectedRowKeys: []
    }
  },
  created () {
    this.organName = this.$route.query.organName
    this.organId = this.$route.query.organId
    // this.getProjects()
    this.getDictData()
    if(this.$route.query.insuranceId) {
      // 编辑
      this.$api.assetInsurance.getDetailBaseInfo({ insuranceId: this.$route.query.insuranceId }).then(res => {
        if(res.data.code === '0') {
          // this.form = res.data.data
          let {
            insuranceCode,remark,insurancePhone,
            periodOfInsurance,
            policyHolder,
            policyAmount,
            projectId,
            insuranceType,
            insuranceCompanyId,
            attachmentList
            } 
          = res.data.data
          this.form.setFieldsValue({
            insuranceCode,
            remark,
            policyHolder,
            policyAmount,
            insurancePhone,
            projectId,//: moment(data.changeDate, "YYYY-MM-DD"),
            insuranceCompanyId: String(insuranceCompanyId),
            insuranceType: String(insuranceType),
            rangeValue: [moment(periodOfInsurance.split('~')[0], "YYYY-MM-DD"),moment(periodOfInsurance.split('~')[1], "YYYY-MM-DD")]
          });
          this.rangeValue = [periodOfInsurance.split('~')[0], periodOfInsurance.split('~')[1]]
          if (attachmentList && attachmentList.length > 0) {
            attachmentList.forEach((item) => {
              this.attachmentList.push({
                url: item.attachmentPath,
                name: item.newAttachmentName,
              });
            });
          }
          // this.form.projectId = projectId
          console.log(this.form.getFieldsValue(), 'projectId')
          // this.attachmentList = attachmentList
          this.getDetailAssetInfo(this.$route.query.insuranceId)
        }
      }).catch(err => {
        console.log(err)      
        this.$message.error('查询失败' || err)  
      })
    }
  },
  methods: {
    inputClick (e) {
      let val = e.target._value
      let regPos = /^\d+(\.\d+)?$/
      if(!regPos.test(val)){
        this.$message.info("保单金额格式不正确，必须为正数值型");
        this.form.setFieldsValue({
          policyAmount: ''
        })
      }
      if(val < 0 || val > 9999999999.9999) {
        this.$message.info("保单金额值取值范围为0-9999999999.9999");
        this.form.setFieldsValue({
          policyAmount: ''
        })
      }
      if(val.toString().includes('.')) {
        if(val.toString().split('.')[1].length > 4) {
          this.form.setFieldsValue({
            policyAmount: Number(val.toString().substr(0,val.length-1))
          })
        }
      }
    },
    getDetailAssetInfo (insuranceId) {
      this.$api.assetInsurance.getDetailAssetInfo({ insuranceId, pageNum: 1, pageSize: 100 })
      .then(res => {
        if(res.data.code === '0') {
          this.tableObj.dataSource = res.data.data.data
          this.tableObj.dataSource.forEach((item, index) => {
            item.index = index+1
          })
          // 拿到已有的资产id
          this.checkedData = this.tableObj.dataSource.map(item => item.assetId)
        }
      }).catch(err => {
        console.log(err)
        this.$message.error('查询失败' || err)
      })
    },
    changeProject (val,val2) {
      this.form.projectId = val
      this.tableObj.dataSource = []
    },
    change (val, val2) {
      this.rangeValue = val2
    },
    save () {
      let {insuranceCode, insuranceType, policyHolder, insuranceCompanyId, policyAmount, projectId, rangeValue, insurancePhone} = this.form.getFieldsValue()
      if(!insuranceCode || !insuranceType || !policyHolder || !insuranceCompanyId || !policyAmount || !rangeValue){ // !projectId
        this.$message.info("必填项不能为空");
        return
      }
      if(insurancePhone && !reg.mobile.test(insurancePhone)){
        this.$message.info("请输入合法手机号码");
        return
      }
      let regPos = /^\d+(\.\d+)?$/
      if(!regPos.test(policyAmount)){
        this.$message.info("保单金额格式不正确，必须为正数值型");
        return
      }
      if(policyAmount < 0 || policyAmount > 9999999999.9999) {
        this.$message.info("保单金额值取值范围为0-9999999999.9999");
        return
      }
      if(this.tableObj.dataSource.length <= 0) {
        this.$message.info("请选择资产信息");
        return
      }
      let data = this.form.getFieldsValue()
      data.projectId = null
      data.insuranceBeginDate = this.rangeValue[0]
      data.insuranceEndDate = this.rangeValue[1]
      data.organId = this.organId
      this.attachmentList = this.attachmentList.map(item => {
        return {
          attachmentPath: item.url,
          oldAttachmentName: item.name,
          fileSources: '1'
        }
      })
      let assetInsuranceDetailList = this.tableObj.dataSource.map(item => {
        return {
          projectId: item.projectId,
          assetType: item.assetType,
          organId: this.organId,
          assetId: item.assetId,
        }
      })
      data.attachmentList = this.attachmentList 
      data.assetInsuranceDetailList = assetInsuranceDetailList
      if(this.$route.query.insuranceId){
        data.insuranceId = this.$route.query.insuranceId
      }
      this.$api.assetInsurance.addOrUpdateAssetInsurance(data).then(res => {
        // console.log(res)
        let { data: {data,code,message} } = res
        if(code === '0') {
          if(this.$route.query.insuranceId){
            this.$message.success("修改成功");
          }else{
            this.$message.success("新增成功");
          }
          this.$router.go(-1)
        }else {
          this.$message.error(message || '新增失败');
        }
      }).catch(err => {
        console.log(err)
      })
    },
    // 保险公司，保险类型
    getDictData () {
      const list = [
          { code: 'ASSET_INSURANCE', tip: '保险公司', optionName: 'companyList', model: 'insuranceCompanyId' },
          { code: 'INSURANCE_TYPE', tip: '保险类型', optionName: 'typeList', model: 'insuranceType' }
        ]
        list.forEach(m => {
          const { code, tip, optionName, model } = m
          this.$api.basics.organDict({code, organId: this.organId}).then(r => {
            let res = r.data
            if (res && String(res.code) === '0') {
              if(res.data.length > 0) {
                this.form[model] = res.data[0].value // 默认选第一项
                return this[optionName] = res.data.map(item => ({
                  label: item.name, value: item.value
                }))
              }else {
                this[optionName] = []
              }
            }else{
              this.$message.error(res.message || `查询${tip}失败`)
            }
          }).catch(err => {
            this.$message.error(err || `查询${tip}失败`)
          })
        })
    },
    getProjects () {
      this.$api.assets.getObjectKeyValueByOrganId({organId: this.organId}).then(res => {
        this.projectOptions = res.data.data.map(item => {
          return {
            value: item.projectId,
            label: item.projectName
          }
        })
        this.form.projectId = this.projectOptions[0].value
      }).catch(err => {
        console.log(err)
      })
    },
    handleSubmit () {},
    deleteAsset (row) {
      this.tableObj.dataSource = this.tableObj.dataSource.filter(item => item.assetId !== row.assetId)
    },
    status (val, data) {
      this.checkedData = [...val];  
      data.forEach((item, index) => {
        this.$set(item, 'index', index+1)
      });
      this.tableObj.dataSource = data
      this.$refs.assetBundlePopover.show = false;
    },
    addTheAsset () {
      // if (!this.form.projectId) {
      //   this.$message.info("请先选择资产项目");
      //   return;
      // }
      this.$refs.assetBundlePopover.redactCheckedDataFn(
        this.checkedData,
        // this.form.getFieldsValue().projectId,
        '',
        '1',
        this.tableObj.dataSource
      );
      this.$refs.assetBundlePopover.show = true;
    },
    cancel () {
      this.$router.go(-1)
    },
    onSelectChange (selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    deleteData () {
      this.tableObj.dataSource = this.tableObj.dataSource.filter(item => {
        return !this.selectedRowKeys.includes(item.assetId)
      })
      this.checkedData = this.tableObj.dataSource.map(item => item.assetId)
    }
  }
}
</script>

<style lang="less" scoped>
  .add_policy {
    padding-bottom: 70px;
    padding-left: 20px;
    padding-right: 20px;
    .main_info {
      padding-left: 20px;
    }
    .button-box {
      overflow: hidden;
      margin-bottom: 10px;
      .buytton-nav {
        float: right;
      }
    }
    .label_tit {
      font-size: 14px;
      span{
        color: #ccc;
        font-size: 12px;
      }
    }
  }
  .custom-table {
    padding-bottom: 70px;
  }
  .sg-datePicker-wrapper {
    width: 100% !important;
  }
</style>