<!--
 * @Date: 2019-11-08 09:50:07
 * @Author: chen han
 * @Description: 新增和编辑和复制房间
 -->
 <<template>
   <div class="createHouse-page">
     <div class="create-form">
       <a-form :form="form" @submit="handleSave" layout="horizontal">
        <!-- 基础信息 -->
        <div class="page-item">
          <div class="mb30">
              <SG-Title noMargin title="基础信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-item label="项目名称" v-bind="formItemLayout">
                  <a-select
                  :style="allWidth"
                    placeholder="请选择项目"
                    showSearch
                    optionFilterProp="children"
                    :options="organOptions"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="['organId',
                      { rules: [{required: true, message: '请选择所属项目'}]}
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="楼栋" v-bind="formItemLayout">
                  <a-select
                  :style="allWidth"
                    placeholder="请选择楼栋"
                    showSearch
                    optionFilterProp="children"
                    :options="buildOpt"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="['buildId',
                      { rules: [{required: true, message: '请选择楼栋'}]}
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="单元" v-bind="formItemLayout">
                  <a-select
                  :style="allWidth"
                    placeholder="请选择单元"
                    showSearch
                    optionFilterProp="children"
                    :options="unitOpt"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="['unitId',
                      { rules: [{required: true, message: '请选择单元'}]}
                    ]"
                  />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="楼层" v-bind="formItemLayout">
                  <a-select
                  :style="allWidth"
                    placeholder="请选择楼层"
                    showSearch
                    optionFilterProp="children"
                    :options="floorOpt"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="['floorId',
                      { rules: [{required: true, message: '请选择楼层'}]}
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="房号" v-bind="formItemLayout">
                  <a-input :style="allWidth" v-decorator="['roomNo', {initialValue: '' || undefined, rules: [{required: true, message: '请输入房号'}]}]"/>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>
        <!-- 面积信息 -->
        <div class="page-item">
          <div class="mb30">
              <SG-Title noMargin title="面积信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-item label="建筑面积" v-bind="formItemLayout">
                  <a-input :style="allWidth" v-decorator="['area', {initialValue: '' || undefined, rules: [{required: true, message: '请输入建筑面积'}]}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="分摊面积" v-bind="formItemLayout">
                  <a-input :style="allWidth" v-decorator="['shareArea', {initialValue: '' || undefined }]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="套内面积" v-bind="formItemLayout">
                  <a-input :style="allWidth" v-decorator="['innerArea', {initialValue: '' || undefined }]"/>
                </a-form-item>
              </a-col>
            </a-row>  
          </div>
        </div>
        <!-- 分类信息 -->
        <div class="page-item">
          <div class="mb30">
              <SG-Title noMargin title="分类信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-item label="建筑形态" v-bind="formItemLayout">
                  <a-select
                  :style="allWidth"
                    placeholder="请选择建筑形态"
                    showSearch
                    optionFilterProp="children"
                    :options="houseCategoryOpt"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="['houseCategory',
                      { rules: [{required: true, message: '请选择建筑形态'}]}
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="房间类型" v-bind="formItemLayout">
                  <a-select
                    :style="allWidth"
                    placeholder="请选择房间类型"
                    showSearch
                    optionFilterProp="children"
                    :options="houseTypeOpt"
                    :allowClear="false"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="['houseType',
                      { rules: [{required: true, message: '请选择房间类型'}]}
                    ]"
                  />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="房间用途" v-bind="formItemLayout">
                  <a-select
                    :style="allWidth"
                    placeholder="请选择房间用途"
                    showSearch
                    optionFilterProp="children"
                    :options="resTypeOpt"
                    :allowClear="true"
                    :filterOption="filterOption"
                    notFoundContent="没有查询到数据"
                    v-decorator="['resType']"
                  />
                </a-form-item>
              </a-col>
            </a-row>  
          </div>
        </div>
        <!-- 详细信息 -->
        <div class="page-item">
          <div class="mb30">
              <SG-Title noMargin title="详细信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-item label="户型" v-bind="formItemLayout">
                  <a-input  :style="allWidth" v-decorator="['apartmentId', {initialValue: '' || undefined}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="朝向" v-bind="formItemLayout">
                  <a-input :style="allWidth" v-decorator="['face', {initialValue: '' || undefined}]"/>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="房间编码" v-bind="formItemLayout">
                  <a-input :style="allWidth" v-decorator="['code', {initialValue: '' || undefined}]"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="交付日期" v-bind="formItemLayout">
                   <a-date-picker :style="allWidth" v-decorator="['deliveryTime', {initialValue: '' || undefined}]" />
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="保修到期日期" v-bind="formItemLayout">
                  <a-date-picker :style="allWidth" v-decorator="['repairTime', {initialValue: '' || undefined}]" />
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 文本框 -->
                <a-form-item label="描述" v-bind="formItemLayout2">
                  <a-textarea v-decorator="['description', {initialValue: ''}]"/>
                </a-form-item>
                <!-- <component :is="currItem.disabled?'a-input':'a-textarea'" :autosize="!currItem.disabled"  :disabled="currItem.disabled" v-else-if="currItem.formType === 'textarea'" :placeholder="(currItem.disabled?'':currItem.attrName) | filterInput" 
                  v-decorator="[currItem.attrCode, 
                    {initialValue: currItem.attrValue || undefined, rules: currItem.ruleConf}
                ]"/> -->
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="平面图" v-bind="formItemLayout2">
                  <SG-UploadFile v-model="planeFigurePath"/>
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="附件" v-bind="formItemLayout2">
                  <SG-UploadFile v-model="filepaths"/>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>
       </a-form>
     </div>
    <FormFooter @save="handleSave" @cancel="handleCancel" />
   </div>
 </template>
<script>
import FormFooter from '@/components/FormFooter.vue'
const allWidth = {maxWidth: 'auto'}
export default {
  components: {
    FormFooter
  },
  data () {
    return {
      allWidth,
      organOptions: [],
      buildOpt: [],
      unitOpt: [],
      floorOpt: [],
      houseCategoryOpt: [],
      houseTypeOpt: [],
      resTypeOpt: [],
      planeFigurePath: [], // 平面图
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
  methods: {
    handleSave () {},
    handleCancel () {},
    filterOption (input, option) {
      return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
    },
  }
}
</script>
<style lang="less" scoped>
  .page-item{
    margin-bottom: 18px;
  }
  .createHouse-page{
    position: relative;
    padding: 42px 100px 70px 94px;
  }
</style>
