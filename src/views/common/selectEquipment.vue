<!--选择设备公共组件-->
<template>
  <SG-Modal
        @cancel="hideModal"
        :title="title"
        v-model="visible"
        width="1058px"
        :maskClosable="false"
        @ok="handleSave"
        :noPadding="true"
      >
      <div class="modal-body">
        <div class="position-tree">
          <positionTree @change="selectEquipmentChange" :communityId="communityId"/>
        </div>
        <div class="equipment-table">
          <div>
            <div class="table-search clearfix">
              <a-input-search
              class="fr"
              placeholder="设备名称"
              v-model="queryCondition.equipmentName"
              :style="allWidth"
              @search="searchQuery"
            />
            </div>
            <div class="table-main">
               <a-table
               :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
              class="custom-table td-pd10"
              :pagination="false"
              :scroll="scrollHeight"
              :loading="table.loading"
              :columns="table.columns"
              :dataSource="table.dataSource"
              :locale="{emptyText: '暂无数据'}"
              >
               </a-table>
            </div>
          </div>
        </div>
      </div>
  </SG-Modal>    
</template>
<script>
import positionTree from '@/views/common/positionTree.vue'
import {utils} from '@/utils/utils.js'
// let getUuid = ((uuid = 1) => () => ++uuid)()
const allWidth = {width: '180px'}
const queryCondition = {
  equipmentName: '',
}
const columns = [{
  title: '设备编码',
  dataIndex: 'equipmentInstCode',
  width: '30%'
}, {
  title: '设备名称',
  dataIndex: 'equipmentInstName',
  width: '30%'
}, {
  title: '设备类型',
  dataIndex: 'equipmentInstType',
  width: '20%'
}]
// 设备类型映射
let buildObj = {
    '1': {
      '0': 1, // '楼栋',
      '1': 2, // '单元',
      '2': 3, // '楼层',
    //  '3': , // '小区',
    //  '4': '建筑物位置',
    //  '5': '电梯'
    },
    '2': {
      '0': 5, // '公共区域',
      '1': 5, // '公共区域位置',
    },
    '3': {
      '0': 7, // '车场',
      '1': 7, // '车场区域',
      '2': 7, // '停车位'
    },
    '4': {
      '0': 6 // '土地'
    }
}
export default {
  components: {
    positionTree
  },
  props: {
    communityId: {
      default: ''
    },
    title: {
      default: '选择设备'
    }
  },
  data () {
    return {
      visible: false,
      allWidth,
      queryCondition: {...queryCondition},
      scrollHeight: {y: 190},
      table: {
        columns,
        loading: false,
        dataSource: [],
      },
      treeActiveItem: {}, // 当前点击节点
      selectedRowKeys: [], // 选择设备的id
      selectRows:{}, // 选择的设备项目，用于新增实物
      overallData: []           // 用于缓存总的数据
    }
  },
  watch: {
    visible (val) {
      this.selectedRowKeys = []
    }
  },
  methods: {
    hideModal () {
      this.visible = false
    },
    handleSave () {
      let checkedData = []    // 对应id
      let rowsData = []       // 整个数据
      this.selectedRowKeys.forEach(item => {
        this.overallData.forEach((element, index) => {
          if (item === element.equipmentInstId) {
            checkedData.push(element.equipmentInstId)
            rowsData.push(element)
          }
        })
      })
      this.$emit('handleSave', checkedData, rowsData)
    },
    searchQuery () {
      this.query()
    },
    onSelectChange(selectedRowKeys) {
      this.selectedRowKeys = selectedRowKeys
    },
    query () {
      let item = {...this.treeActiveItem}
      if (!Object.keys(item).length) {
        return
      }
      // 如果是建筑物
      let objectType = buildObj[item.positionType][item.subPositionType]
      if (!objectType && item.type !== 'frist') {
        return
      }
      let data = {
        communityId: String(this.communityId),
        objectType: String(objectType),
        objectId: String(item.objectId),
        equipmentName: this.queryCondition.equipmentName,
        status: '1'
      }
      // 如果点击的是项目
      if (item.type === 'frist') {
        data = {
          communityId: String(this.communityId),
          equipmentName: this.queryCondition.equipmentName,
          status: '1'
        }
      }
      this.table.loading = true
      this.$api.undertake.queryEquipmentInstListByOptV2(data).then(res => {
        this.table.loading = false
        if (res.data.code === '0') {
          let result = res.data.data.resultList || []
          this.table.dataSource = result.map(item => {
            return {...item, key: item.equipmentInstId}
          })
          if (result) {
            let arrData = utils.deepClone(this.overallData)
            result.forEach(element => {
              element.key = element.equipmentInstId
              element.positionType = String(item.positionType)
              arrData.push(element)
            })
            this.table.dataSource = result
            // 去除相同的对象
            this.$nextTick(() => {
              let hash = {}
              arrData = arrData.reduce((preVal, curVal) => {
                hash[curVal.equipmentInstId] ? '' : hash[curVal.equipmentInstId] = true && preVal.push(curVal)
                return preVal
              }, [])
              this.overallData = arrData
            })
          } else {
            this.table.dataSource = []
          }
        } else {
          this.$message.error(res.data.message)
        }
      }, () => {
        this.table.loading = false
      })
    },
    // 树节点改变
    selectEquipmentChange (item) {
      this.treeActiveItem = {...item}
      this.query()
    }
  },
}
</script>
<style lang="less" scoped>
  .modal-body{
    margin: 30px;
    border:1px solid rgba(192,199,209,1);
    border-radius:4px;
    display: flex;
    .position-tree{
      height: 313px;
      border-right: 1px solid rgba(192,199,209,1);
      flex: 0 0 184px;
      overflow: auto;
    }
    .equipment-table{
      padding: 20px 20px 0 20px;
      flex: 1;
      .table-search{
        padding-bottom: 12px;
      }
    }
  }
  .table-main{
    border-left: 1px solid rgba(239,244,249,1);
    border-right: 1px solid rgba(239,244,249,1);
    border-bottom: 1px solid rgba(239,244,249,1);
  }
</style>
