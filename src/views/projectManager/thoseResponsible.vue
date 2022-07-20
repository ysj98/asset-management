<!--
 * @Author: L
 * @Date: 2022-07-20 16:46:40
 * @LastEditTime: 2022-07-20 18:39:30
 * @Description: 设置责任人
-->
<template>
  <a-modal
    class="thoseResponsible"
    :title="title"
    :visible="visible"
    width="800px"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <SG-Title title="标题" />
      <div>
        <a-row>
          <a-col :span="12">
            资产项目名称：{{basicInformation.projectName  || '--'}}
          </a-col>
          <a-col :span="12">
            所属上级机构: {{basicInformation.organName  || '--'}}
          </a-col>
          <a-col class="mt20"  :span="12">
            资产项目编码：{{basicInformation.projectCode  || '--'}}
          </a-col>
        </a-row>
      </div>
    <SG-Title title="项目责任人列表" />
      <div>
        <a-table :columns="columns" :data-source="dataSource" :pagination="false" bordered>
          <template slot="type" slot-scope="text, record">
            <a-select
               v-if="type === 'set'" 
              style="width:150px"
              v-model="record.type"
              :options="$addTitle(typeOptions)"
              placeholder="请选择职责类型"
            ></a-select>
            <span v-else>{{record.typeName}}</span>
          </template>
          <template slot="name" slot-scope="text, record">
            <a-input v-if="type === 'set'" placeholder="请输入姓名" v-model="record.name"/>
            <span v-else>{{text}}</span>
          </template>
          <template slot="tel" slot-scope="text, record">
            <a-input v-if="type === 'set'" placeholder="请输入联系电话" v-model="record.tel"/>
            <span v-else>{{text}}</span>
          </template>
          <template slot="operation" slot-scope="text, record, index">
            <span class="color-delete" @click="deleteFn(record, index)">删除</span>
          </template>
        </a-table>
        <div class="table-sub" @click="subFn">添加</div>
      </div>
  </a-modal>
</template>

<script>
export default {
  components: {},
  props: {
    type: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      basicInformation: {},
      visible: false,
      title: '标题',
      typeOptions: [
        {
          key: '1',
          title: '项目联系人'
        },
        {
          key: '2',
          title: '项目经理'
        },
        {
          key: '3',
          title: '分管领导'
        }
      ],
      columns: [
        {
          dataIndex: 'type',
          title: '职责类型',
          scopedSlots: { customRender: "type" },
        },
        {
          dataIndex: 'name',
          scopedSlots: { customRender: "name" },
          title: '姓名',
        },
        {
          dataIndex: 'tel',
          scopedSlots: { customRender: "tel" },
          title: '联系电话',
        },
        {
          dataIndex: 'operation',
          scopedSlots: { customRender: "operation" },
          title: '操作',
        }
      ],
      dataSource: []
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {

  },
  methods: {
    // 详情
    queryProjectResponsibilityDetail () {
      this.$api.projectManager.addProjectResponsibility({projectId: this.basicInformation.projectId}).then(r => {
        let res = r.data
        if (res && String(res.code) === '0') {
          this.$message.info('提交成功')
        } else {
          this.$message.error(r.data.message || '查询接口出错')
        }
      })
    },
    // 添加
    subFn () {
      let obj = {
        type: undefined,
        tel: '',
        name: ''
      }
      this.dataSource.push(obj)
      this.dataSource.forEach((item, index) => {
        item.key = index
      })
    },
    // 删除
    deleteFn (record, index) {
      if (record.id) {
        this.$confirm({
          title: '提示',
          content: '确认删除吗？',
          onOk() {
            this.subDelete(record.id, index)
          },
          onCancel() {},
        });
      } else {
        this.dataSource.splice(index, 1)
      }
    },
    subDelete (id, index) {
      this.$api.projectManager.deleteProjectResponsibility({id: id}).then(r => {
        let res = r.data
        if (res && String(res.code) === '0') {
          this.$message.info('删除成功')
          this.dataSource.splice(index, 1)
        } else {
          this.$message.error(r.data.message || '查询接口出错')
        }
      })
    },
    handleOk () {
      let form = this.dataSource.map(item => {
        return {
          type: item.type,
          tel: item.tel,
          name: item.name,
          projectId: this.basicInformation.projectId,
          organId: this.basicInformation.organId
        }
      })
      this.$api.projectManager.addProjectResponsibility(form).then(r => {
        let res = r.data
        if (res && String(res.code) === '0') {
          this.$message.info('提交成功')
          this.handleCancel('sub')
        } else {
          this.$message.error(r.data.message || '查询接口出错')
        }
      })
    },
    handleCancel (val) {
      this.visible = false
      this.$emit('handleCancel', val)
    }
  }
}
</script>
<style lang="less" scoped>
.thoseResponsible {
  .table-sub {
    margin-top: 6px;
    width: 100%;
    line-height:32px;
    text-align: center;
    border: 1px solid #ccc;
    cursor: pointer;
  }
  .table-sub:hover {
    border: 1px solid #0084ff;
    color: #0084ff;
  }
  .color-delete {
    color: #0084ff;
    cursor: pointer;
  }
  .color-delete:hover {
    color: red;
  }
}
</style>