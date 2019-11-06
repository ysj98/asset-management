<!-- 
  CREATE BY W
  操作列表
  引入： import OperationPopover from 'components/common/OperationPopover.vue'
  typeInterpretation: // 用来判断是用ant的字体还是用阿里字体
  props：
       operationData：[
          {iconType: 'form', text: '编辑', editType: 'edit', typeInterpretation: true},
          {iconType: 'setting', text: '恢复订单', editType: 'recover'},
          {iconType: 'file-text', text: '确认支付', editType: 'confirmPayment'}
       ]
       record: 对应数据列表中的单条数据
  
 -->
<template>
  <div class="operation"  v-if="operationData.length">
    <a-popover overlayClassName="operation-popover" title="" placement="bottom" :overlayStyle="{zIndex: 2019}">
      <a-icon type="ellipsis" style="font-size: 26px;cursor: pointer;"/>
      <template slot="content" style="z-index:2019;">
        <ul class="ul-operation">
          <template v-for="(item, index) in operationData">
            <li
              :key="index"
              @click="jumpToEdit(item.editType)">
              <segiIcon v-if="item.typeInterpretation" :type="item.iconType" class="segiIcon"/>
              <a-icon v-else :type=item.iconType style="font-size: 14px"/>
              <span>{{item.text}}</span>
              <i class="left-border"></i>
            </li>
          </template>
        </ul>
      </template>
    </a-popover>
  </div>
</template>

<script>
import { Popover, Icon } from 'ant-design-vue'
import segiIcon from './segiIcon.vue'

export default {
  name: 'OperationPopover',
  components: {
    APopover: Popover,
    AIcon: Icon,
    segiIcon
  },
  props: {
    index: {
      type: [String, Number],
      default: ''
    },
    operationData: {
      type: Array,
      default: () => []
    },
    record: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data () {
    return {}
  },
  computed: {},
  watch: {},
  methods: {
    /**
     * 点击操作列表中相应的操作跳转相应类型的页面
     * @param {string} editType 跳转页面的类型
     */
    jumpToEdit (editType) {
      let record = Object.assign({}, this.record)
      this.$emit('operationFun', editType, record, this.index)
    }
  }
}
</script>

<style lang='less' scoped>
.operation{
  position: relative;
  &:hover {
    color: #397DEB;
    cursor: pointer;
  }
}
.ul-operation {
  min-width: 80px;
  margin: 0;
  li {
    // padding: 12px;
    line-height: 40px;
    border-bottom: 1px solid #ccc;
    position: relative;
    .left-border{
      display: none;
      width: 3px;
      height: 19px;
      background-color: #397DEB;
      position: absolute;
      left: -10px;
      top: 12px;
    }
    &:hover .left-border{display: block;}
    &:hover {
      color: #397DEB;
      cursor: pointer;
    }
    &:last-child {
      border-bottom: 0;
    }
    span {
      margin-left: 8px; 
    }
    .segiIcon {
      // margin-right: 8px;
    }
  }
}
</style>

<style lang="less">
.operation-popover {
  .ant-popover-inner-content {
    padding: 0 14px 0 10px;
  }
}
</style>
