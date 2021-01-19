<!--价值登记页面--资产价值登记Tab及价值登记记录Tab页面--查询条件组件-->
<!--提交日期-评估基准日-评估方法--评估机构-->
<template>
  <div class="container_style">
    <a-row :gutter="8">
      <!--<a-col :span="5">-->
        <!--<a-select-->
          <!--v-bind="properties"-->
          <!--v-model="assessmentMethod"-->
          <!--:options="methodOptions"-->
          <!--class="assess_method_style"-->
          <!--placeholder="请选择评估方法"-->
          <!--:filterOption="filterOption"-->
          <!--:loading="!methodOptions.length"-->
        <!--&gt;</a-select>-->
      <!--</a-col>-->
      <a-col :span="7">
        <a-select
          v-bind="properties"
          v-model="assessmentOrgan"
          :options="organOptions"
          class="assess_organ_style"
          placeholder="请选择评估机构"
          :filterOption="filterOption"
        ></a-select>
      </a-col>
      <a-col :span="8">
        <span class="prefix_style" style="width: 69px">提交日期</span>
        <a-range-picker
          @change="changeConfirmDate"
          class="date_picker_style"
          format="YYYY-MM-DD" style="margin-left: 69px"
          :defaultValue="defaultValue"
        />
      </a-col>
      <a-col :span="8">
        <span class="prefix_style" style="width: 78px">评估基准日</span>
        <a-range-picker @change="changeAssessDate" class="date_picker_style" format="YYYY-MM-DD" style="margin-left: 78px"/>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import moment from 'moment'
  export default {
    name: 'DateMethodOrgan',
    props: {
      // 支持v-model,向外传递一个对象
      // { assessmentMethod, assessmentOrgan, beginDate, endDate, beginAssessmenBaseDate, endAssessmenBaseDate }
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
      },
      // 查询评估机构需要organId
      organId: {
        type: String,
        default: () => ''
      }
    },
    data () {
      return {
        properties: {}, // 属性值
        defaultValue: [], // 默认值
        organOptions: [], // 评估机构选项,
        // methodOptions: [], // 评估方法选项
        beginDate: null, // 提交日期开始日期
        endDate: null, // 提交日期结束日期
        assessmentOrgan: undefined, // 评估机构,
        assessmentMethod: undefined, // 评估方法
        beginAssessmenBaseDate: null, // 评估基准日开始日期
        endAssessmenBaseDate: null // 评估基准日结束日期
      }
    },

    methods: {
      moment,

      // 搜索过滤选项
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },

      // 获取日期
      changeConfirmDate (date, dateStrings) {
        const { assessmentOrgan, beginAssessmenBaseDate, endAssessmenBaseDate, assessmentMethod } = this
        let confirmDate = { beginDate: dateStrings[0], endDate: dateStrings[1] }
        Object.assign(this, confirmDate)
        this.$emit('input', { assessmentOrgan, beginAssessmenBaseDate, endAssessmenBaseDate, assessmentMethod, ...confirmDate})
      },
      changeAssessDate (date, dateStrings) {
        const { assessmentOrgan, beginDate, endDate, assessmentMethod } = this
        let assessDate = { beginAssessmenBaseDate: dateStrings[0], endAssessmenBaseDate: dateStrings[1] }
        Object.assign(this, assessDate)
        this.$emit('input', { assessmentOrgan, beginDate, endDate, assessmentMethod, ...assessDate})
      },

      // 查询平台字典
      queryDict () {
        const list = [
          // { code: 'asset_type', tip: '资产类型', optionName: 'typeOptions' },
          { code: 'ASSESSMENT_METHOD', tip: '评估方法', optionName: 'methodOptions' }
        ]
        list.forEach(m => {
          const { code, tip, optionName } = m
          this.$api.basics.platformDict({code}).then(r => {
            let res = r.data
            if (res && String(res.code) === '0') {
              let list = res.data.map(item => ({
                title: item.name, key: String(item.value)
              }))
              return this[optionName] =[{title: `全部${tip}`, key: '-1'}].concat(list)
            }
            throw res.message || `查询${tip}失败`
          }).catch(err => {
            this.$message.error(err || `查询${tip}失败`)
          })
        })
      },

      // 查询评估机构-机构字典
      queryOrganOptions (organId) {
        this.organOptions = []
        this.assessmentOrgan = undefined
        if (!organId) { return false}
        this.$api.basics.organDict({ code: 'ASSESSMENT_ORGAN', organId }).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            let list = res.data.map(item => ({
              title: item.name, key: String(item.value)
            }))
            return this.organOptions = [{title: '全部评估机构', key: '-1'}].concat(list)
          }
          throw res.message || '查询评估机构失败'
        }).catch(err => {
          this.$message.error(err || '查询评估机构失败')
        })
      },
    },

    created () {
      // 初始化属性和值
      const { allowClear, size, showSearch, value, mode } = this
      let properties = { allowClear, size, showSearch, mode }
      mode === 'multiple' ? properties.maxTagCount = 1 : '' // 多选模式防止换行
      this.properties = properties
      Object.assign(this, { ...value })
      this.defaultValue = [
        value.beginDate ? moment(value.beginDate, 'YYYY-MM-DD') : null,
        value.endDate ? moment(value.endDate, 'YYYY-MM-DD') : null
      ]
      // this.queryDict()
    },

    watch: {
      organId: function (organId) {
        this.queryOrganOptions(organId)
      },
      assessmentOrgan: function (assessmentOrgan) {
        if (assessmentOrgan && assessmentOrgan.length !== 1 && assessmentOrgan.includes('-1')) {
          this.assessmentOrgan = ['-1']
        }
        const { beginDate, endDate, beginAssessmenBaseDate, endAssessmenBaseDate, assessmentMethod } = this
        this.$emit('input', { assessmentOrgan: this.assessmentOrgan, beginDate, endDate, beginAssessmenBaseDate, endAssessmenBaseDate, assessmentMethod })
      },

      assessmentMethod: function (assessmentMethod) {
        if (assessmentMethod && assessmentMethod.length !== 1 && assessmentMethod.includes('-1')) {
          this.assessmentMethod = ['-1']
        }
        const { assessmentOrgan, beginDate, endDate, beginAssessmenBaseDate, endAssessmenBaseDate } = this
        this.$emit('input', { assessmentOrgan, beginDate, endDate, beginAssessmenBaseDate, endAssessmenBaseDate, assessmentMethod: this.assessmentMethod })
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
