<template>
  <div class="add_policy">
    <a-form :form="form" :layout="'vertical'">
      <SG-Title title="基本信息"/>
      <div class="main_info">
        <a-row :gutter="24">
        <a-col :span="8">
          <a-form-item label="保险单号(必填):">
            <a-input
              v-model="form.insurancePolicy"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="组织机构名称:">
            <a-input
              :disabled="true"
              v-model="organName"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="资产项目(必填):">
            <a-select
              v-model="projectId"
              class="project_style"
              :options="projectOptions"
              placeholder="请选择资产项目"
            ></a-select>
          </a-form-item>
        </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="保险类型(必填):">
              <a-select
                v-model="form.insuranceType"
                class="project_style"
                :options="projectOptions"
                placeholder="请选择保险类型"
                :loading="loading && !projectOptions.length"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="投保人(必填):">
              <a-input
                v-model="form.policyHolder"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            
          </a-col>
        </a-row>
        <a-row :gutter="24">
          <a-col :span="8">
            <a-form-item label="保险公司(必填):">
              <a-select
                v-model="form.insuranceCompany"
                class="project_style"
                :options="projectOptions"
                placeholder="请选择保险公司"
                :loading="loading && !projectOptions.length"
              ></a-select>
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="保险公司电话(非必填):">
              <a-input
                v-model="form.phone"
              />
            </a-form-item>
          </a-col>
          <a-col :span="8">
            <a-form-item label="保单金额(合计)(必填):">
              <a-input
                v-model="form.amount"
              />
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col>
            <a-form-item label="保险有效期(必填):">
              <SG-DatePicker
                  pickerType="RangePicker"
                  v-model="rangeValue"
                  :defaultValue="defaultValue"
                ></SG-DatePicker>
              <!-- <a-range-picker v-decorator="['range-picker', { rules: [{ required: true, message: '请选择保险有效期' }] }]" /> -->
            </a-form-item>
          </a-col>
        </a-row>
        <a-row>
          <a-col :span="24">
            <a-form-item label="备注">
              <a-textarea
                v-model="form.remark"
                placeholder="请填写备注"
                :auto-size="{ minRows: 3, maxRows: 5 }"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <!-- 附件最多十个，最大80兆 -->
            <SGUploadFilePlus
              :baseImgURL="configBase.hostImg1"
              type="all"
              v-model="attachmentList"
              :max="10"
              :maxSize="80"
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
            </SGUploadFilePlus>
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
      :organId="organId"
      queryType="1"
      ref="assetBundlePopover"
      @status="status"
    ></AssetBundlePopover>
  </div>
</template>

<script>
import configBase from "@/config/config.base";
import SGUploadFilePlus from "@/components/SGUploadFilePlus";
import warantAnnex from '@/views/ownershipManagement/authorityCardManagement/warrantAnnex'
import FormFooter from "@/components/FormFooter";
import AssetBundlePopover from "../../common/assetBundlePopover";
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
      defaultValue: [moment('2019-02-02'), moment('2019-02-04')],
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
        dataSource: [
          {
            assetName: '测试',
            assetCode: '1231'
          }
        ],
        columns: [
          { title: '序号', dataIndex: 'index', fixed: 'left'},
          { title: '资产编码', dataIndex: 'assetCode' },
          { title: '资产名称', dataIndex: 'assetName' },
          { title: '地址', dataIndex: 'address', ellipsis: true },
          { title: '保险类型', dataIndex: 'type' },
          { title: '保险公司', dataIndex: 'projectName' },
          { title: '保险有效期', dataIndex: 'uploadAttachment' },
          { title: '保单金额（元）', dataIndex: 'amount' },
          { title: '资产数量', dataIndex: 'buildName' },
          { title: '保单状态', dataIndex: 'unitName' },
          { title: '提交时间', dataIndex: 'floor' },
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
    this.getProjects()
  },
  methods: {
    save () {
      let {form : {insurancePolicy, insuranceType, policyHolder, insuranceCompany, amount}, rangeValue, projectId} = this
      if(!insurancePolicy || !insuranceType || !policyHolder || !insuranceCompany || !projectId || !amount || rangeValue.includes(undefined)){
        this.$message.info("必填项不能为空");
        return
      }
    },
    getProjects () {
      this.$api.assets.getObjectKeyValueByOrganId({organId: this.organId}).then(res => {
        this.projectOptions = res.data.data.map(item => {
          return {
            value: item.projectId,
            label: item.projectName
          }
        })
        this.projectId = this.projectOptions[0].value
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
      if (!this.projectId) {
        this.$message.info("请先选择资产项目");
        return;
      }
      this.$refs.assetBundlePopover.redactCheckedDataFn(
        this.checkedData,
        // this.form.getFieldValue("projectId"),
        this.projectId,
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
    }
  }
}
</script>

<style lang="less" scoped>
  .add_policy {
    padding-bottom: 70px;
    padding-left: 20px;
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
  }
</style>