<template>
  <div>
    <a-modal :title="object ? '编辑编码' : '新增编码'" :visible="visible" width="800px" @cancel="handleClose" @ok="handleSubmit">
      <div class="box">
        <div class="section-title blue">资产概况</div>
        <div style="padding: 10px 20px">
          <a-row class="playground-row">
            <a-form-model ref="form" :rules="rules" :model="formInfo" :label-col="{ span: 5 }" :wrapper-col="{ span: 15 }">
              <a-row>
                <a-col class="playground-col" :span="12">
                  <a-form-model-item label="资产项目：">{{ object.projectName }}</a-form-model-item>
                </a-col>
                <a-col class="playground-col" :span="12">
                  <a-form-model-item label="资产编码：">{{ object.assetCode }}</a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col class="playground-col" :span="12">
                  <a-form-model-item label="资产名称：">{{ object.assetName }}</a-form-model-item>
                </a-col>
                <a-col class="playground-col" :span="12">
                  <a-form-model-item label="运营项目：">{{ object.communityName }}</a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col class="playground-col" :span="12">
                  <a-form-model-item label="宗地号：">{{ object.theNo }}</a-form-model-item>
                </a-col>
                <a-col class="playground-col" :span="12">
                  <a-form-model-item label="土地面积：">{{ object.landArea }}</a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col class="playground-col" :span="12">
                  <a-form-model-item label="土地用途：">{{ object.landuse }}</a-form-model-item>
                </a-col>
                <a-col class="playground-col" :span="12">
                  <a-form-model-item label="土地类型：">{{ object.landType }}</a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col class="playground-col" :span="12">
                  <a-form-model-item label="经营方式：">{{ object.modeOperName }}</a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col class="playground-col" :span="12">
                  <a-form-model-item label="地理位置：">{{ object.location }}</a-form-model-item>
                </a-col>
              </a-row>
              <a-row>
                <a-col class="playground-col" :span="12">
                  <a-form-model-item label="权属单位：">{{ object.organName }}</a-form-model-item>
                </a-col>
              </a-row>
              <div class="section-title blue" style="margin-bottom: 20px">业务信息</div>
              <a-row>
                <a-col class="playground-col" :span="24">
                  <a-table :bordered="true" :pagination="false" :columns="table.columns" :dataSource="table.datasource" :scroll="{ y: 500 }">
                    <template slot="attrName" slot-scope="text, record">
                      <span>{{ text }}</span>
                    </template>
                    <template slot="operate" slot-scope="text, record">
                      <a-form-model-item label="" :label-col="0" style="margin: 0" :wrapper-col="{ span: 24 }">
                        <a-input v-model="record.attrValue"></a-input>
                      </a-form-model-item>
                    </template>
                  </a-table>
                </a-col>
              </a-row>
            </a-form-model>
          </a-row>
        </div>
      </div>
    </a-modal>
  </div>
</template>
<script>
import { editColumns } from '../dict';
import { insertAssetAttrConfig, updateAssetAttrConfig } from '../../../../api/attrConfig';

export default {
  props: {
    value: {
      default: '',
    },
    header: {
      default: () => [],
    },
    object: {
      type: [Object],
    },
    organObject: {
      default: () => {},
    },
    visible: {
      default: false,
    },
  },
  watch: {
    visible: {
      immediate: true,
      handler: function () {
        this.$nextTick(() => {
          this.init();
        });
      },
    },
  },
  data: () => ({
    oldAttrName: '',
    formInfo: {
      organName: '',
      name: '',
      ...appendOperation,
    },
    rules: {},
    table: {
      columns: editColumns,
      datasource: [],
    },
  }),
  methods: {
    init() {
      if (!this.visible) return;
      if (this.object) {
        this.table.datasource = this.object.assetAttrList || [];
      }
    },
    handleSubmit() {
      this.updateAssetAttrConfig();
    },
    handleClose() {
      console.log('handle close');
      this.$emit('close');
    },
    async updateAssetAttrConfig() {
      const params = {
        assetAttrDtoList: this.table.datasource,
      };
      try {
        const { data: res } = await this.$api.assetBussinessInformation.updateAssetAttr(params);
        if (String(res.code) === '0') {
          this.$emit('submit');
          this.$SG_Message.success('编辑成功');
        } else {
          this.$SG_Message.error(res.message);
        }
      } finally {
      }
    },
  },
};
</script>
<style lang="less" scoped>
.playground-col {
  font-size: 14px;
  margin-top: -10px;
}
</style>
