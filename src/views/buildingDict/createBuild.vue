<!--
 * @Date: 2019-11-09 16:13:11
 * @Author: chen han
 * @Description: 新建楼栋，编辑楼栋，删除楼栋
 -->
<template>
   <div class="createBuilding-page">
     <div class="form-box">
        <div class="title-box">
          <SG-Title noMargin :title="title" />
        </div>
        <!-- 表单部分 -->
        <div>
          <a-form :form="form" @submit="handleSave" layout="horizontal">
            <a-row>
                <a-col :span="8">
                  <a-form-item label="楼栋名称" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['name', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="楼栋编码" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['code', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="房屋数量" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['houseNum', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="承建商" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['contractor', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="开发商" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['developer', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="楼高" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['buildHeight', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="建筑面积(㎡)" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['builtArea', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="楼栋类型" v-bind="formItemLayout">
                    <a-select
                      :style="allWidth"
                      :getPopupContainer="getPopupContainer"
                        placeholder="请选择楼栋类型"
                        showSearch
                        optionFilterProp="children"
                        :options="buildTypeOpt"
                        :allowClear="false"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                        v-decorator="['buildType']"
                      />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="楼栋用途" v-bind="formItemLayout">
                    <a-select
                      :style="allWidth"
                      :getPopupContainer="getPopupContainer"
                        placeholder="请选择楼栋用途"
                        showSearch
                        optionFilterProp="children"
                        :options="useTypeOpt"
                        :allowClear="false"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                        v-decorator="['useType']"
                      />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="地上层高" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['upGroundHigh', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="地下层高" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['downGroundHigh', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
              <a-col :span="8">
                  <a-form-item label="建筑结构" v-bind="formItemLayout">
                    <a-select
                      :style="allWidth"
                      :getPopupContainer="getPopupContainer"
                        placeholder="请选择建筑结构"
                        showSearch
                        optionFilterProp="children"
                        :options="buildStructOpt"
                        :allowClear="false"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                        v-decorator="['buildStruct']"
                      />
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="总楼层" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['buildFloor', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="地上层数" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['upFloorNum', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="地下层数" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['downFloorNum', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                  <a-form-item label="地理位置" v-bind="formItemLayout2">
                    <div class="address-box">
                      <a-select
                      :style="allWidth1"
                        placeholder="省"
                        :getPopupContainer="getPopupContainer"
                        showSearch
                        optionFilterProp="children"
                        :options="provinceOpt"
                        :allowClear="false"
                        @change="cityOrRegionChange($event, 'city')"
                        v-model="province"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                      />
                      <a-select
                      :style="allWidth1"
                        placeholder="市"
                        :getPopupContainer="getPopupContainer"
                        showSearch
                        optionFilterProp="children"
                        :options="cityOpt"
                        v-model="city"
                        :allowClear="false"
                        @change="cityOrRegionChange($event, 'region')"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                      />
                      <a-select
                        :style="allWidth1"
                        placeholder="区/县"
                        :getPopupContainer="getPopupContainer"
                        showSearch
                        optionFilterProp="children"
                        v-model="region"
                        @change="cityOrRegionChange($event)"
                        :options="regionOpt"
                        :allowClear="false"
                        :filterOption="filterOption"
                        notFoundContent="没有查询到数据"
                      />
                      <a-input :style="allWidth2" placeholder="详细地址"/>
                    </div>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="经纬度" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['longitudelatitude', {initialValue: '' || undefined}]">
                      <a-icon type="plus" @click="showSelectMap" class="pointer" slot="suffix"/>
                    </a-input>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="楼栋排序" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['seq', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="电梯数量" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['liftNum', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="丘地号" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['addressNo', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="建筑年代" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['builtAge', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="8">
                  <a-form-item label="竣工年代" v-bind="formItemLayout">
                    <a-input :style="allWidth" v-decorator="['completionDate', {initialValue: '' || undefined}]"/>
                  </a-form-item>
                </a-col>
                <a-col :span="24">
                    <!-- 文本框 -->
                    <a-form-item label="描述" v-bind="formItemLayout2">
                      <a-textarea v-decorator="['description', {initialValue: ''}]"/>
                    </a-form-item>
                </a-col>
                <a-col :span="24">
                    <a-form-item label="平面图" v-bind="formItemLayout2">
                      <SG-UploadFile v-model="picPath"/>
                    </a-form-item>
                  </a-col>
                  <a-col :span="24">
                    <a-form-item label="附件" v-bind="formItemLayout2">
                      <SG-UploadFile v-model="filepaths"/>
                    </a-form-item>
                  </a-col>
            </a-row>  
          </a-form>
        </div>
    </div>
     <FormFooter>
       <SG-Button class="mr10" @click="handleSave" type="primary">保存</SG-Button>
       <SG-Button @click="handleCancel" type="danger" ghost>删除</SG-Button>
     </FormFooter>
   </div>
</template>
<script>
import FormFooter from '@/components/FormFooter.vue'
const allWidth = {maxWidth: 'auto'}
const allWidth1 = {width: '100px', marginRight: '10px', flex: '0 0 100px'}
const allWidth2 = {width: '250px', flex: 1}
export default {
  components: {
    FormFooter
  },
  props: {
    type: {
      default: 'edit'
    }
  },
  data () {
    return {
      allWidth,
      allWidth1,
      allWidth2,
      province: undefined,
      region: undefined,
      city: undefined,
      provinceOpt: [], // 省
      cityOpt: [], // 市
      regionOpt: [], // 区/县
      buildTypeOpt: [], // 楼栋类型
      useTypeOpt: [], // 楼栋用途
      buildStructOpt: [], // 建筑结构
      picPath: [], // 平面图
      filepaths: [], // 附件
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 }
        }
      },
       formItemLayout2: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 }
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 }
        }
      }
    }
  },
  beforeCreate () {
    this.form = this.$form.createForm(this)
  },
  computed: {
    title () {
      return this.type === 'edit' ? '编辑楼栋' : '新增楼栋'
    }
  },
  mounted () {
    this.queryProvinceList()
    this.queryNodesByRootCode('30')
    this.queryNodesByRootCode('60')
  },
  methods: {
    handleSave () {},
    handleCancel () {},
    // 显示百度地图
    showSelectMap () {
      
    },
    /* 根据根节点业态code获取下面的业态类型 */
    queryNodesByRootCode (code) {
      /**
       * 30  楼栋类型
       * 60  楼栋用途
      */
      let data = {
        categoryCode: code
      }
      this.$api.basics.queryNodesByRootCode(data).then(res => {
        if (res.data.code === '0') {
          let result = res.data.data || []
          let resultArr = result.map(item => {
            return {
              label: item.typeName,
              value: item.typeCode + ',' + item.typeId,
              ...item
            }
          })
          if (code === '30') {
            this.buildTypeOpt = [ ...resultArr]
          }
          if (code === '60') {
            this.useTypeOpt = [...resultArr]
          }
        }
      })
    },
    // 请求省
    queryProvinceList () {
      return this.$api.basics.queryProvinceList().then(res => {
        if (res.data.code === '0') {
          let data = res.data.data || []
          this.provinceOpt = data.map(item => {
            return {label: item.name, value: item.regionId}
          })
        }
      })
    },
    // 请求市区
    queryCityAndAreaList (parentRegionId, type) {
      this.$api.basics.queryCityAndAreaList({parentRegionId}).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data || []
          let result = data.map(item => {
            return {label: item.name, value: item.regionId}
          })
          // 市
          if (type === 'city') {
            this.region = undefined
            this.regionOpt = []
            this.city = undefined
            this.cityOpt = result
          }
          // 区
          if (type === 'region') {
            this.region = undefined
            this.regionOpt = result
          }
        }
      })
    },
    cityOrRegionChange (e, type) {
      console.log(e, type)
      if (!type) {
        return
      }
      this.queryCityAndAreaList(e, type)
    },
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
    getPopupContainer (e) {
      return e.parentElement
    }
  }
}
</script>
<style lang="less" scoped>
  .createBuilding-page{
    height: 100%;
    padding: 0px 3px 0 50px;
    position: relative;
    overflow: hidden;
  }
  .form-box{
     height: 100%;
     overflow: hidden;
     overflow-y: auto;
     padding-top: 36px;
     padding-bottom: 70px;
  }
  .title-box{
    margin-bottom: 40px;
  }
  .address-box{
    display: flex;
  }
</style>
