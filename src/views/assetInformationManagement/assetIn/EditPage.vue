<!--资产入库-入口列表页-编辑、新建-->
<template>
  <a-spin :spinning="spinning" class="edit_page">
    <SG-Title title="基础信息" />
    <a-form :form="form">
      <a-row>
        <a-col :span="8">
          <a-form-item label="入库单名称" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-input
              placeholder="请输入入库单名称"
              v-decorator="[
                'storeName',
                {
                  rules: [
                    { required: true, message: '请输入入库单名称' },
                    { max: 30, message: '最多30个字符' },
                  ],
                },
              ]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="资产项目" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              showSearch
              style="width: 100%"
              :options="$addTitle(projectOptions)"
              placeholder="请选择资产项目"
              :filterOption="filterOption"
              @change="changeSelect"
              v-decorator="['projectId', { rules: [{ required: true, message: '请选择资产项目' }] }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="8">
          <a-form-item label="资产类型" :label-col="labelCol" :wrapper-col="wrapperCol">
            <a-select
              style="width: 100%"
              placeholder="请选择资产类型"
              :options="$addTitle(typeOptions)"
              @change="changeSelect"
              v-decorator="['assetType', { rules: [{ required: true, message: '请选择资产类型' }] }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item
            required
            label="关联资产登记单"
            :label-col="{ span: 2 }"
            :wrapper-col="{ span: 22 }"
            :help="validateAssets ? '请选择关联资产登记单' : ''"
            :validate-status="validateAssets ? 'error' : ''"
          >
            <div>
              <a-tag closable v-for="m in selectedList" :key="m.registerOrderId" style="background: #fff" @close="handleAddAsset(m)">
                {{ m.registerOrderName }}
              </a-tag>
              <a-tag color="#108ee9" @click="handleAddAsset('')"> <a-icon type="select" style="margin-right: 8px" />选择 </a-tag>
            </div>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="备注" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
            <a-textarea
              :rows="4"
              style="resize: none"
              placeholder="请输入备注"
              v-decorator="['remark', { rules: [{ max: 200, message: '最多200个字符' }] }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="图片" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
            <!-- <UploadFile  v-model="attachmentList"/> -->
            <UploadFile
              :baseImgURL="configBase.hostImg1"
              v-model="imgFiles"
              :max="5"
              :maxSize="20480"
              :customDownload="
                (value) => {
                  return customDownload(value, $api.ownership.downLoadAnnex);
                }
              "
              :customUpload="
                (value) => {
                  return customUpload(value, $api.ownership.uploadAnnex);
                }
              "
            />
          </a-form-item>
        </a-col>
      </a-row>
      <a-row>
        <a-col :span="24">
          <a-form-item label="附件" :label-col="{ span: 2 }" :wrapper-col="{ span: 22 }">
            <!-- <UploadFile type="file" v-model="attachmentList"/> -->
            <UploadFile
              :baseImgURL="configBase.hostImg1"
              v-model="attachmentList"
              type="all"
              :max="5"
              :maxSize="20480"
              :customDownload="
                (value) => {
                  return customDownload(value, $api.ownership.downLoadAnnex);
                }
              "
              :customUpload="
                (value) => {
                  return customUpload(value, $api.ownership.uploadAnnex);
                }
              "
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <!--资产明细-->
    <SG-Title title="资产明细" />
    <a-table v-bind="tableObj" size="middle" bordered>
      <!--<span slot="registerOrderId" slot-scope="text, record">-->
      <!--<router-link-->
      <!--class="action_text"-->
      <!--:to="{path: '/reportTask/taskDetail', query: {taskId: record.registerOrderId}}"-->
      <!--&gt;{{text}}</router-link>-->
      <!--</span>-->
    </a-table>
    <SG-FooterPagination
      v-if="tableObj.dataSource.length"
      v-bind="paginationObj"
      @change="({ pageNo, pageLength }) => queryAssetByRegistId({ pageNo, pageLength })"
    />
    <!--底部审批操作按钮组-->
    <form-footer location="fixed">
      <SG-Button type="primary" @click="handleSubmit('')" :loading="submitBtnLoading">提交</SG-Button>
      <SG-Button @click="handleSubmit('second')" style="margin-right: 8px">取消</SG-Button>
    </form-footer>
    <SG-Modal v-bind="modalObj" v-model="modalObj.isShow" @ok="handleModalAction('ok')" @cancel="handleModalAction('')">
      <!-- 选择资产 -->
      <select-asset
        :key="refreshKey"
        ref="select_asset"
        :storeId="storeId"
        :organId="organId"
        :projectId="projectId"
        :assetType="assetType"
        :initList="selectedList"
        :height="modalObj.height"
      />
    </SG-Modal>
  </a-spin>
</template>

<script>
import { generateTableAreaByAssetTypeString } from '@/utils/utils';
import configBase from '@/config/config.base';
import uploadAndDownLoadFIle from '@/mixins/uploadAndDownLoadFIle';
import FormFooter from '@/components/FormFooter';
import SelectAsset from './components/SelectRegistAsset';
import { queryProjectListByOrganId, filterOption, queryAssetTypeList } from 'src/views/common/commonQueryApi';
export default {
  name: 'EditPage',
  mixins: [uploadAndDownLoadFIle],
  components: { FormFooter, SelectAsset },
  data() {
    return {
      configBase,
      imgFiles: [],
      filepaths: [],
      organId: '',
      labelCol: { span: 6 },
      wrapperCol: { span: 18 },
      storeId: '', // 入库单Id
      projectId: '', // 资产Id
      assetType: '', // 资产类型
      attachmentList: [], // 附件数据
      typeOptions: [], // 资产类型选项
      spinning: false, // 页面加载状态
      projectOptions: [], // 资产项目选项
      selectedList: [], // 选中的资产登记单
      submitBtnLoading: false, // 提交按钮loading
      form: this.$form.createForm(this), // 注册form
      validateAssets: false, // 自定义校验auditUsers标志
      tableObj: {
        dataSource: [],
        loading: false,
        scroll: { x: 1600 },
        pagination: false,
        columns: [
          { title: '登记单编号', dataIndex: 'registerOrderId', scopedSlots: { customRender: 'registerOrderId' } },
          { title: '资产名称', dataIndex: 'assetName' },
          { title: '资产编码', dataIndex: 'assetCode' },
          { title: '资产类型', dataIndex: 'assetTypeName' },
          { title: '资产分类', dataIndex: 'objectTypeName' },
          { title: '管理机构', dataIndex: 'organName' },
          { title: '资产项目名称', dataIndex: 'projectName' },
          {
            title: '资产面积(㎡)',
            key: 'area',
            customRender(record) {
              return generateTableAreaByAssetTypeString({ record, assetTypeName: record.assetTypeName, keyStr: 'area' });
            },
          },
          { title: '资产位置', dataIndex: 'pasitionString', width: 150 },
          { title: '创建日期', dataIndex: 'createTime' },
          { title: '创建人', dataIndex: 'createByName' },
          { title: '核实时间', dataIndex: 'verifierTime' },
          { title: '核实人', dataIndex: 'verifierByName' },
        ],
      },
      paginationObj: { pageNo: 1, totalCount: 0, pageLength: 10 },
      modalObj: {
        width: 1000, // Modal宽度
        height: 450, // Modal高度
        title: '选择资产',
        okText: '确定选择',
        cancelText: '取消',
        isShow: false,
      },
      refreshKey: 0, // 重新执行选择资产登记单组件
    };
  },

  methods: {
    // 下拉搜索筛选
    filterOption,
    // 改变资产项目或资产类型，清空关联的登记单
    changeSelect() {
      this.selectedList = [];
      this.tableObj.dataSource = [];
    },

    // 查询资产类型--平台字典
    queryAssetType() {
      queryAssetTypeList().then((list) => {
        list ? (this.typeOptions = list) : this.$message.error('查询资产类型失败');
      });
    },

    // 处理资产登记单Modal关闭/保存
    handleModalAction(type) {
      if (type) {
        this.selectedList = this.$refs['select_asset'].selectedList;
        // this.queryAssetByRegistId({})
      }
      this.modalObj.isShow = false;
    },

    // 根据organId查询资产项目
    queryProjectByOrganId(organId) {
      organId && queryProjectListByOrganId(organId).then((list) => (list ? (this.projectOptions = list) : this.$message.error('查询资产项目失败')));
    },

    // 删除、选择关联资产登记单
    handleAddAsset(m) {
      if (m) {
        this.selectedList = this.selectedList.filter((v) => v.registerOrderId !== m.registerOrderId);
      } else {
        let { projectId, assetType } = this.form.getFieldsValue(['projectId', 'assetType']);
        if (!projectId || !assetType) {
          this.$message.warn(`请选择${!projectId ? '资产项目' : ''} ${!assetType ? '资产类型' : ''}`);
        } else {
          Object.assign(this, { projectId, assetType, refreshKey: Date.now() });
          this.modalObj.isShow = true;
        }
      }
    },

    // 根据资产登记单查询资产明细
    queryAssetByRegistId({ pageNo = 1, pageLength = 10 }) {
      const { selectedList } = this;
      if (!selectedList.length) {
        return (this.tableObj.dataSource = []);
      }
      this.tableObj.loading = true;
      this.$api.assets
        .getRegisterOrderDetailsPageByIdList({
          registerOrderIdList: selectedList.map((m) => m.registerOrderId),
          pageNum: pageNo,
          pageSize: pageLength,
        })
        .then((r) => {
          let res = r.data;
          if (res && String(res.code) === '0') {
            const { count, data } = res.data;
            this.tableObj.dataSource = (data || []).map((m, key) => ({ ...m, key }));
            return Object.assign(this.paginationObj, {
              totalCount: count,
              pageNo,
              pageLength,
            });
          }
          throw res.message || '查询资产明细列表出错';
        })
        .catch((err) => {
          this.$message.error(err || '查询资产明细列表出错');
        })
        .finally(() => (this.tableObj.loading = false));
    },

    // 查询入库单详情
    queryDetail(storeId) {
      this.spinning = true;
      this.$api.assets
        .queryAssetStoreDetail({ storeId })
        .then(({ data: res }) => {
          if (res && String(res.code) === '0') {
            const { storeName, projectId, assetType, remark, organId, otherAttachment, imageAttachment, assetRegisterId, assetRegisterName } =
              res.data;
            this.queryProjectByOrganId(organId);
            let idArr = assetRegisterId ? assetRegisterId.split(',') : [];
            let nameArr = assetRegisterName ? assetRegisterName.split(',') : [];
            Object.assign(this, {
              organId,
              selectedList: idArr.map((registerOrderId, i) => {
                return {
                  registerOrderName: nameArr[i],
                  registerOrderId,
                };
              }),
              attachmentList: (otherAttachment || []).map((m) => {
                return { url: m.attachmentPath, name: m.oldAttachmentName };
              }),
              imgFiles: (imageAttachment || []).map((m) => {
                return { url: m.attachmentPath, name: m.oldAttachmentName };
              }),
            });
            this.queryAssetByRegistId({});
            return this.$nextTick(function () {
              this.form.setFieldsValue({
                storeName,
                projectId,
                assetType: String(assetType),
                remark,
              });
            });
          }
          throw res.message;
        })
        .catch((err) => {
          this.$message.error(err || '查询入库单信息出错');
        })
        .finally(() => (this.spinning = false));
    },

    // footer按钮操作
    handleSubmit(type) {
      if (type === 'second') {
        return this.$router.go(-1);
      }
      this.form.validateFieldsAndScroll((err, values) => {
        // 提交保存
        const { attachmentList, organId, selectedList, storeId, imgFiles } = this;
        let arr = [...attachmentList, ...imgFiles];
        this.validateAssets = !selectedList.length;
        if (err || !selectedList.length) {
          return selectedList.length ? false : this.$message.warn('请选择关联资产登记单');
        }
        let form = {
          ...values,
          organId,
          status: 2,
          storeId,
          assetRegisterId: selectedList.map((m) => m.registerOrderId).join(','),
          attachmentList: arr.map((m) => {
            return { attachmentPath: m.url, oldAttachmentName: m.name };
          }),
        };
        this.submitBtnLoading = true;
        this.$api.assets
          .addOrUpdateAssetStore(form)
          .then(({ data: res }) => {
            if (res && String(res.code) === '0') {
              this.$message.success('提交成功');
              // 跳回列表路由
              return this.$router.push({ path: '/assetIn', query: { refresh: true } });
            }
            throw res.message;
          })
          .catch((err) => {
            this.$message.error(err || '提交失败');
          })
          .finally(() => (this.submitBtnLoading = false));
      });
    },
  },

  mounted() {
    // 获取当前用户信息
    let {
      query: { id, organId },
    } = this.$route;
    this.storeId = id;
    this.organId = organId;
    id && this.queryDetail(id);
    !id && organId && this.queryProjectByOrganId(organId);
    this.queryAssetType();
  },

  watch: {
    // 自定义必填项校验
    selectedList: function (val) {
      if (val.length) {
        this.validateAssets = false;
      }
      this.queryAssetByRegistId({});
    },
    imgFiles(files) {
      let reg = /^((?!png|jpg|jpeg|bmp).)*$/;
      let flag = this.imgFiles.some((item) => {
        let str = item.name.split('.');
        return str[str.length - 1] !== 'png' && str[str.length - 1] !== 'jpg' && str[str.length - 1] !== 'jpeg' && str[str.length - 1] !== 'bmp';
      });
      if (flag) {
        this.$message.error('请上传图片');
        this.imgFiles = files.filter((item) => !reg.test(item.name));
      }
    },
  },
};
</script>

<style lang="less" scoped>
.edit_page {
  padding: 0 45px 70px 70px;
  & /deep/ .ant-table-placeholder {
    display: block;
    border-bottom: 1px solid #e8e8e8;
  }
}
</style>
