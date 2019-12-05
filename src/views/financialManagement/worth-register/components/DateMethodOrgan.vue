<!--价值登记页面--资产价值登记Tab及价值登记记录Tab页面--查询条件组件-->
<!--提交日期-评估基准日-评估方法--评估机构-->
<template>
  <div class="container_style">
    <a-row :gutter="8">
      <a-col :span="5">
        <a-select
          v-bind="properties"
          v-model="assessmentMethod"
          :options="methodOptions"
          class="assess_method_style"
          placeholder="请选择评估方法"
          :filterOption="filterOption"
          :loading="!methodOptions.length"
        ></a-select>
      </a-col>
      <a-col :span="5">
        <a-select
          v-bind="properties"
          v-model="assessmentOrgan"
          :options="organOptions"
          class="assess_organ_style"
          placeholder="请选择评估机构"
          :filterOption="filterOption"
          :loading="!organOptions.length"
        ></a-select>
      </a-col>
      <a-col :span="7">
        <span class="prefix_style" style="width: 69px">提交日期</span>
        <a-range-picker @change="changeConfirmDate" class="date_picker_style" format="YYYY-MM-DD" style="margin-left: 69px"/>
      </a-col>
      <a-col :span="7">
        <span class="prefix_style" style="width: 78px">评估基准日</span>
        <a-range-picker @change="changeAssessDate" class="date_picker_style" format="YYYY-MM-DD" style="margin-left: 78px"/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'SearchContainerII',
    props: {
      // 支持v-model,向外传递一个对象 { assessmentMethod, assessmentOrgan, assessDate, confirmDate }
      value: {
        type: Object,
        default: () => ({})
      },
      // 是否可搜索
      showSearch: {
        type: Boolean,
        default: () => true
      },
      // 是否可清除
      allowClear: {
        type: Boolean,
        default: () => true
      },
      // 尺寸大小default large small
      size: {
        type: String,
        default: () => 'default'
      },
      // 多选/单选模式
      mode: {
        type: String,
        default: () => 'multiple'
      }
    },
    data () {
      return {
        properties: {}, // 属性值
        // loading: false, // 加载状态
        assessDate: null, // 评估基准日
        confirmDate: null, // 提交日期
        organOptions: [], // 评估机构选项,
        methodOptions: [], // 评估方法选项
        assessmentOrgan: undefined, // 评估机构,
        assessmentMethod: undefined, // 评估方法
      }
    },

    methods: {
      // 搜索过滤选项
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },

      // 获取日期
      changeConfirmDate (date) {
        const { assessmentOrgan, assessDate, assessmentMethod } = this
        let confirmDate = date.length ? {
          beginDate: moment(date[0]).format('YYYY-MM-DD'),
          endDate: moment(date[1]).format('YYYY-MM-DD')
        } : {}
        this.$emit('input', { assessmentOrgan, ...(assessDate || {}), assessmentMethod, ...confirmDate})
      },
      changeAssessDate (date) {
        const { assessmentOrgan, confirmDate, assessmentMethod } = this
        let assessDate = date.length ? {
          beginAssessmentBaseDate: moment(date[0]).format('YYYY-MM-DD'),
          endAssessmentBaseDate: moment(date[1]).format('YYYY-MM-DD')
        } : {}
        this.$emit('input', { assessmentOrgan, ...(confirmDate || {}), assessmentMethod, ...assessDate})
      }
      
    },

    mounted () {
      // 初始化属性和值
      const { allowClear, size, showSearch, value, mode } = this
      let properties = { allowClear, size, showSearch, mode }
      mode === 'multiple' ? properties.maxTagCount = 1 : '' // 多选模式防止换行
      this.properties = properties
      Object.assign(this, { ...value })
    },

    watch: {
      assessmentOrgan: function (assessmentOrgan) {
        const { assessDate, confirmDate, assessmentMethod } = this
        this.$emit('input', { assessmentOrgan, ...(assessDate || {}), ...(confirmDate || {}), assessmentMethod })
      },

      assessmentMethod: function (assessmentMethod) {
        const { assessmentOrgan, assessDate, confirmDate } = this
        this.$emit('input', { assessmentOrgan, ...(assessDate || {}), ...(confirmDate || {}), assessmentMethod })
      }
    }
  }
</script>

<style lang='less' scoped>
  .container_style {
    .assess_organ_style, .assess_method_style {
      width: 100%;
    }
    .prefix_style {
      float: left;
      color: #C0C7D1;
      /*width: 69px;*/
      line-height: 30px;
      text-align: center;
      border: 1px solid #d9d9d9;
      border-right: none;
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    .date_picker_style {
      display: block;
      & /deep/ .ant-calendar-picker-input {
        border-top-left-radius: 0 !important;
        border-bottom-left-radius: 0 !important;
      }
    }
  }
</style>
