<template>
  <a-select
    showSearch
    placeholder="请选择资产项目"
    optionFilterProp="children"
    :style="allStyle"
    v-model="assetProject"
    :options="$addTitle(assetProjectOptions)"
    :filterOption="filterOption"
  ></a-select>
</template>

<script>
export default {
  props: {
    organId: {
      type: String
    }
  },
  data () {
    return {
      assetProjectOptions: [],
      assetProject: '',
      allStyle: 'width: 215px; margin-right: 10px;',
    }
  },
  watch: {
    organId: {
      handler(newVal,oldVal){
        this.getAssetProjectOptions(newVal)
      },
      immediate: true
    }
  },
  methods: {
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    getAssetProjectOptions (id) {
      let form = {
        organId: id
      }
      this.$api.assets.getObjectKeyValueByOrganId(form).then(res => {
        if (res.data.code === '0') {
          let arr = [{label: '全部资产项目', value: ''}]
          res.data.data.forEach(item => {
            let obj = {
              label: item.projectName,
              value: item.projectId
            }
            arr.push(obj)
          })
          this.assetProjectOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
  }
}
</script>

<style>

</style>