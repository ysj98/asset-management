<!--价值登记页面--资产价值登记Tab及价值登记记录Tab页面--查询条件组件-->
<!--组织机构-资产项目-资产类型-->
<template>
  <div class="container_style">
    <a-row :gutter="8">
      <a-col :span="16">
        <organ-project-building v-model="organProjectBuildingValue" :isShowBuilding="false"/>
      </a-col>
      <a-col :span="8">
        <a-select
          v-model="assetType"
          v-bind="properties"
          class="asset_type_style"
          placeholder="请选择资产类型"
          :options="assetTypeOptions"
          :filterOption="filterOption"
          :loading="loading && !assetTypeOptions.length"
        ></a-select>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import OrganProjectBuilding from 'src/views/common/OrganProjectBuilding'
  export default {
    name: 'SearchCondition',
    components: { OrganProjectBuilding },
    props: {
      // 支持v-model,向外传递一个对象 { organId, projectId, assetType }
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
        loading: false, // 加载状态
        assetType: undefined, // 资产类型
        assetTypeOptions: [], // 资产类型选项
        organProjectBuildingValue: {}, // 组织机构-资产项目-楼栋 对象{organId, projectId, assetType}
      }
    },

    methods: {
      // 搜索过滤选项
      filterOption(input, option) {
        return (
          option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        )
      },

      // 查询资产类型--平台字典
      queryAssetType () {
        this.$api.basics.platformDict({code: 'asset_type'}).then(r => {
          let res = r.data
          if (res && String(res.code) === '0') {
            let list = res.data.map(item => ({
              title: item.name, key: item.value
            }))
            return this.assetTypeOptions = [{title: '全部资产类型', key: '-1'}].concat(list)
          }
          throw res.message || '查询资产类型失败'
        }).catch(err => {
          this.tableObj.loading = false
          this.$message.error(err || '查询资产类型失败')
        })
      }
    },

    mounted () {
      // 初始化属性和值
      const { allowClear, size, showSearch, value, mode } = this
      let properties = { allowClear, size, showSearch, mode }
      mode === 'multiple' ? properties.maxTagCount = 1 : '' // 多选模式防止换行
      this.properties = properties
      Object.assign(this, { ...value })
      this.queryAssetType()
    },

    watch: {
      organProjectBuildingValue: function (obj) {
        const { organId, projectId, organName } = obj
        this.$emit('input', { organId, projectId, organName, assetType: this.assetType })
      },

      assetType: function (assetType) {
        if (assetType && assetType.length !== 1 && assetType.includes('-1')) {
          this.assetType = ['-1']
        }
        const { organId, projectId, organName } = this.organProjectBuildingValue
        this.$emit('input', { organId, organName, projectId, assetType: this.assetType })
      }
    }
  }
</script>

<style lang='less' scoped>
  .container_style {
    .asset_type_style {
      width: 100%;
    }
  }
</style>
