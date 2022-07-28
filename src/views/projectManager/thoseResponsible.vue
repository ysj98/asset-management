<!--
 * @Author: L
 * @Date: 2022-07-20 16:46:40
 * @LastEditTime: 2022-07-28 18:20:31
 * @Description: 设置责任人
-->
<template>
  <a-modal
    class="thoseResponsible"
    :title="title"
    :visible="visible"
    width="800px"
    :footer="null"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <SG-Title title="基本信息" />
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
        <a-table :scroll="scroll" :columns="columns" :data-source="dataSource" :pagination="false">
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
        <div v-if="type === 'set'" class="table-sub" @click="subFn">添加</div>
      </div>
      <div v-if="type === 'set'" class="tr-modal-footer">
        <a-button class="mr20" @click="handleCancel" type="dashed">取消</a-button>
        <a-button @click="handleOk" type="primary">确定</a-button>
      </div>
  </a-modal>
</template>

<script>
const judgeArr = [undefined, null, '']
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
      scroll: {y: 420},
      basicInformation: {},
      footer: true,
      visible: false,
      title: '',
      typeOptions: [
        {
          key: '0',
          title: '项目联系人'
        },
        {
          key: '1',
          title: '项目经理'
        },
        {
          key: '2',
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
          width: 200,
          scopedSlots: { customRender: "name" },
          title: '姓名',
        },
        {
          dataIndex: 'tel',
          width: 200,
          scopedSlots: { customRender: "tel" },
          title: '联系电话',
        },
        {
          dataIndex: 'operation',
          width: 100,
          scopedSlots: { customRender: "operation" },
          title: '操作',
        }
      ],
      dataSource: [
        {
          type: undefined,
          tel: '',
          name: ''
        }
      ]
    }
  },
  computed: {
  },
  created () {
  },
  mounted () {
    if (this.type === 'set') {
      this.title = '设置责任人'
    } else {
      this.title = '详情'
      this.columns.pop()
      // this.columns = arr
    }
  },
  methods: {
    // 详情
    queryProjectResponsibilityDetail () {
      this.$api.projectManager.queryProjectResponsibilityDetail({projectId: this.basicInformation.projectId}).then(r => {
        let res = r.data
        if (res && String(res.code) === '0') {
          let data = res.data || []
          if (data.length > 0) {
            this.dataSource = data.map((item, index) => {
              return {
                ...item,
                type: String(item.type),
                key: index
              }
            })
          }
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
      let _this = this
      if (record.id) {
        this.$confirm({
          title: '提示',
          content: '确认删除吗？',
          onOk() {
            _this.subDelete(record.id, index)
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
      let show = false
      let form = this.dataSource.map(item => {
        if (judgeArr.includes(item.type) || judgeArr.includes(item.tel) || judgeArr.includes(item.name)) {
          show = true
        }
        return {
          type: item.type,
          tel: item.tel,
          name: item.name,
          projectId: this.basicInformation.projectId,
          organId: this.basicInformation.organId,
          id: item.id || ''
        }
      })
      if (show) {
        this.$message.info('请填写完整')
        return
      }
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
  .sg-title {
    margin: 10px 0;
  }
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
  .tr-modal-footer {
    text-align: center;
    margin: 20px 0 0 0;
  }
}
</style>