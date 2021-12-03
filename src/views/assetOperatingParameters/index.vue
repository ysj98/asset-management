<template>
  <div class="container">
    <a-tabs value="LAND" type="card">
      <a-tab-pane key="LAND" tab="土地">
        <div>
          <div class="action-block">
            <a-button style="width: 100px;" type="primary" @click="btnAddClick"
              >新建</a-button
            >
            <div>
              <TopOrganByUser
                class="search-form-item"
                :hasAll="false"
                :selectFirst="true"
                @change="changeTopOrganId"
              />
              <a-select class="search-form-item" :options="statusOptions">
              </a-select>
              <a-input
                class="search-form-item"
                placeholder="参数名称"
              ></a-input>
            </div>
          </div>
          <a-table v-bind="tableOptions"></a-table>
          <SG-Modal
            v-model="modalList.add.show"
            :title="modalList.add.title"
            :maskClosable="false"
            @ok="handleAddPopSave"
          >
            <div>
              <div>
                <a-form
                  labelAlign="right"
                  :labelCol="{ span: 3 }"
                  :wrapperCol="{ span: 10 }"
                >
                  <a-form-item label="所属机构">
                    <span>
                      {{ organInfo.organName }}
                    </span>
                  </a-form-item>
                  <a-form-item label="转运营项名称" :required="true">
                    <a-input placeholer="请输入" />
                  </a-form-item>
                  <a-form-item label="是否必填" :required="true">
                    <a-select
                      v-model="formData.requiredFlagDebugger"
                      :options="requiredOptions"
                      optionFilterProp="children"
                    ></a-select>
                  </a-form-item>
                  <a-form-item label="备注">
                    <a-textarea placeholer="请输入备注信息" />
                  </a-form-item>
                </a-form>
              </div>
            </div>
          </SG-Modal>
        </div>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script>
import TopOrganByUser from "@/views/common/topOrganByUser";
export default {
  /*
   * 资产转运营参数
   * */
  name: "assetOperatingParameters",
  components: {
    TopOrganByUser
  },
  data() {
    return {
      organInfo: {
        organID: "",
        organName: ""
      },
      requiredOptions: [
        {
          label: "必填",
          value: "1"
        },
        {
          label: "非必填",
          value: "0"
        }
      ],
      formData: {
        requiredFlagDebugger: "0"
      },
      modalList: {
        add: {
          modelName: "add",
          show: false,
          title: "新增",
          payload: {}
        }
      },
      statusOptions: [
        {
          label: "全部状态",
          value: "0"
        },
        {
          label: "启用",
          value: "1"
        },
        {
          label: "停用",
          value: "2"
        }
      ],
      tableOptions: {
        pagination: false,
        columns: [
          {
            title: "序号"
          },
          {
            title: "转运营编码"
          },
          {
            title: "转运营项名称"
          },
          {
            title: "备注"
          },
          {
            title: "必填项"
          },
          {
            title: "状态"
          },
          {
            title: "操作"
          }
        ]
      }
    };
  },
  methods: {
    handleAddPopSave() {},
    btnAddClick() {
      this.modalList.add.show = true;
    },
    changeTopOrganId(info) {
      this.organInfo.organID = info.value;
      this.organInfo.organName = info.name;
    }
  },
  activated() {
    console.log("activated");
  }
};
</script>

<style scoped>
.search-form-item {
  width: 200px;
  margin-right: 20px;
}
.action-block {
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
}
.container {
  padding: 20px;
}
</style>
