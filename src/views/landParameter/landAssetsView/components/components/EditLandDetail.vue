<!--资产视图业务-资产视图详情页面-编辑基本信息组件-->
<template>
  <a-form :form="form">
    <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="资产名称">
      <a-input
        v-decorator="[
          'assetName',
          {
            rules: [
              { required: true, message: '请填写资产名称' },
              { max: 30, message: '最多30个字符' },
            ],
          },
        ]"
        placeholder="请填写资产名称"
      />
    </a-form-item>
    <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="资产编码">
      <a-input
        v-decorator="[
          'assetCode',
          {
            rules: [
              { required: true, message: '请填写资产编码' },
              { max: 30, message: '最多30个字符' },
            ],
          },
        ]"
        placeholder="请填写资产名称"
      />
    </a-form-item>
    <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="装修情况">
      <a-input v-decorator="['decorationSituation', { rules: [{ max: 30, message: '最多30个字符' }] }]" placeholder="请填写装修情况" />
    </a-form-item>
    <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="保管部门">
      <a-input v-if="!isShowTreeSelect" @click="showTreeSelect" v-decorator="['ownerOrganName']" style="width: 100%" />
      <tree-select v-else @changeTree="changeTree" placeholder="请选择保管部门" style="width: 100%" />
    </a-form-item>
    <a-form-item :label-col="formItemLayout.labelCol" :wrapper-col="formItemLayout.wrapperCol" label="使用人">
      <a-select
        allowClear
        showSearch
        :options="$addTitle(userOptions)"
        placeholder="请选择使用人"
        v-decorator="['ownerUser']"
        :filterOption="filterOption"
      />
    </a-form-item>
  </a-form>
</template>

<script>
import TreeSelect from 'src/views/common/treeSelect';
export default {
  name: 'EditAssetDetail',
  components: { TreeSelect },
  props: ['details'],
  data() {
    return {
      formItemLayout: {
        labelCol: { span: 4 },
        wrapperCol: { span: 19 },
      },
      form: this.$form.createForm(this),
      ownerOrgan: '', // 保管部门
      // assetName: '', // 资产名
      // assetCode: '', // 资产编码
      // decorateOptions: '', // 装修情况选项
      userOptions: [], // 使用人选项
      isShowTreeSelect: false,
    };
  },

  methods: {
    showTreeSelect() {
      this.isShowTreeSelect = true;
    },
    // 员工搜索过滤选项
    filterOption(input, option) {
      let item = option.componentOptions.children[0];
      return item && item.text.toLowerCase().indexOf(input.toLowerCase()) >= 0;
    },

    // 获取组织机构下的员工
    queryUser(organId) {
      this.userOptions = [];
      this.form.setFieldsValue({ ownerUser: undefined });
      if (!organId) {
        return false;
      }
      this.$api.assets
        .queryUserListByOrganId({ organId })
        .then((r) => {
          let res = r.data;
          if (res && String(res.code) === '0') {
            this.userOptions = (res.data || []).map((m) => ({
              key: m.userId,
              title: m.userName,
            }));
            return false;
          }
          throw res.message || '查询组织机构下的员工出错';
        })
        .catch((err) => {
          this.$message.error(err || '查询组织机构下的员工出错');
        });
    },

    // 获取选择的组织机构
    changeTree(organId) {
      this.ownerOrgan = organId;
      this.queryUser(organId);
    },

    // 提交数据
    handleSubmit(resolve, reject) {
      const {
        ownerOrgan,
        details: { assetHouseId },
      } = this;
      this.form.validateFields((err, values) => {
        if (!err) {
          this.$api.assets
            .saveAssetViewHouseInfo({ ...values, assetHouseId, ownerOrgan })
            .then((r) => {
              let res = r.data;
              if (res && String(res.code) === '0') {
                this.$message.success('保存成功');
                return resolve();
              }
              throw res.message || '保存接口出错';
            })
            .catch((err) => {
              this.$message.error(err || '保存接口出错');
              reject();
            });
        } else {
          reject();
        }
      });
    },
  },

  mounted() {
    const { assetName, assetCode, decorationSituation, ownerUser, ownerOrgan, ownerOrganName } = this.details;
    this.ownerOrgan = ownerOrgan;
    this.queryUser(ownerOrgan);
    this.form.setFieldsValue({ assetName, assetCode, decorationSituation, ownerUser, ownerOrganName });
  },
};
</script>

<style lang="less" scoped></style>
