<!--
 * 组织机构-资产项目-楼栋-联动组件
 
 * 需求背景描述
   1>组织机构：加载当前用户所拥有的组织机构权限，默认展示最高层级的组织机构，可点击进行修改，单选
   2>资产项目：可多选，取值所选组织机构下所有的资产项目，支持按照资产项目名称模糊搜索，默认全部资产项目，可修改，展示格式：$资产项目名称$+（$资产项目编码$），如资产项目001（ZCXM001）
   3>楼栋名称：可多选，取值所选组织机构对应的企业（一级物业公司）下所有的楼栋，支持按照楼栋名称模糊搜索，默认全部楼栋
   
 * 外层组件可通过定义在省控件上的class[.organ_style, .project_style, .building_style]用 /deep/ 控制布局样式
-->
<template>
  <div class="choose_area">
    <a-row :gutter="8">
      <!--组织机构选择控件, 单选-->
      <a-col :span="8">
        <tree-select @changeTree="changeTree" class="organ_style"/>
      </a-col>
      <a-col :span="8">
        <a-select
          v-model="projectId"
          v-bind="properties"
          class="project_style"
          :options="projectOptions"
          placeholder="请选择资产项目"
          :loading="loading && !projectOptions.length"
        ></a-select>
      </a-col>
      <a-col :span="8">
        <a-select
          v-if="isShowBuilding"
          v-model="buildingId"
          v-bind="properties"
          class="building_style"
          placeholder="请选择楼栋"
          :options="buildingOptions"
          :loading="loading && !buildingOptions.length"
        ></a-select>
      </a-col>
    </a-row>
  </div>
</template>

<script>
  import TreeSelect from 'src/views/common/treeSelect'
  export default {
    name: 'OrganProjectBuilding',
    components: { TreeSelect },
    props: {
      // 是否显示楼栋
      isShowBuilding: {
        type: Boolean,
        default: () => true
      },
      // 支持v-model,向外传递一个对象 { organId, projectId, buildingId }
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
        default: () => 'default'
      }
    },
    data () {
      return {
        loading: false, // 加载状态
        organId: '',
        organName: '',
        timeoutId: '',
        projectId: undefined, // 多选和单选值类型不同，定义undefined
        projectOptions: [],
        buildingId: undefined,
        buildingOptions: [],
        properties: {} // 属性值
      }
    },

    methods: {
      // 获取选择的组织机构
      changeTree (organId, name) {
        this.organName = name
        this.organId = organId
      },

      // 查询资产项目接口
      queryData (type) {
        if (!this.isShowBuilding && type === 'buildingOptions') { return false } // 不展示楼栋不执行调接口
        const api = { buildingOptions: 'queryBuildingByOrganId', projectOptions: 'getObjectKeyValueByOrganId' }
        this.loading = true
        clearTimeout(this.timeoutId)
        let _this = this
        _this.timeoutId = setTimeout(() => {
          _this.$api.assets[api[type]]({organId: this.organId}).then(r => {
            _this.loading = false
            let res = r.data
            if (res && String(res.code) === '0') {
              _this[type] = (res.data || []).map(item => {
                return {
                  key: item.assetHouseId || item.projectId,
                  title: item.assetName || item.projectName
                }
              })
              return false
            }
            throw res.message || `查询${type === 'buildingOptions' ? '楼栋' : '资产项目'}失败`
          }).catch(err => {
            _this.loading = false
            _this.$message.error(err || `查询${type === 'buildingOptions' ? '楼栋' : '资产项目'}失败`)
          })
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
    },

    watch: {
      organId: function (organId) {
        Object.assign(this, {
          projectId: undefined,
          buildingId: undefined
        })
        this.$emit('input', { organId, projectId: undefined, buildingId: undefined })
        this.queryData('projectOptions')
      },

      projectId: function (projectId) {
        const { organId } = this
        this.buildingId = ''
        this.$emit('input', { organId, projectId, buildingId: undefined })
        this.queryData('buildingOptions')
      },

      buildingId: function (buildingId) {
        const { organId, projectId } = this
        this.$emit('input', { organId, projectId, buildingId })
      }
    }
  }
</script>

<style lang='less' scoped>
  .choose_area {
    .organ_style, .project_style, .building_style {
      width: 100%;
    }
  }
</style>
