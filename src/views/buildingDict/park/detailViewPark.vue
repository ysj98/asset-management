<!--
 * @Description: 新建 编辑车场
-->
<template>
  <div class="landInfo-create-page">
    <div class="create-form">
      <a-form layout="horizontal">
        <!-- 基础信息 -->
        <div class="page-item">
          <div class="mb30">
            <SG-Title noMargin title="基础信息" />
          </div>
          <div class="form-content">
            <a-row>
              <a-col :span="8">
                <a-form-item label="所属机构"  v-bind="formItemLayout">
                  {{formInfo.organName}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车场名称" v-bind="formItemLayout">
                  {{formInfo.placeName}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车场编码" v-bind="formItemLayout">
                  {{formInfo.placeCode}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="8">
                <a-form-item label="运营项目" v-bind="formItemLayout">
                  {{formInfo.communityName}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车场面积(㎡)" v-bind="formItemLayout">
                  {{formInfo.placeArea}}
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车位数量" v-bind="formItemLayout">
                  {{formInfo.placeNums}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="16">
                <a-form-item label="地理位置" v-bind="formItemLayoutGeo">
                  <div class="address-box">
                    {{formInfo.placeAddr}}
                  </div>
                </a-form-item>
              </a-col>
              <a-col :span="8">
                <a-form-item label="车场类型" v-bind="formItemLayout">
                  {{formInfo.typeName}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <!-- 文本框 -->
                <a-form-item label="备注" v-bind="formItemLayout2">
                  {{formInfo.description}}
                </a-form-item>
              </a-col>
            </a-row>
            <a-row>
              <a-col :span="24">
                <a-form-item label="图片" v-bind="formItemLayout2">
                  <SG-UploadFile
                    :show="true"
                    v-model="formInfo.otherImg"
                  />
                </a-form-item>
              </a-col>
            </a-row>
          </div>
          <div class="mb30">
            <SG-Title noMargin title="区域信息" />
            <a-row>
              <a-col :span="23" :offset="1">
                <a-form-item label="" v-bind="formItemLayoutTable">
                  <a-table :columns="areaTitle.filter(item=>item.dataIndex !=='operation')" :pagination="false" bordered :data-source="formInfo.areaArray">
                    <template v-for="com in areaTitle.filter(item=>item.dataIndex !=='operation')" :slot="com.dataIndex" slot-scope="item, record, index">
                      <div :key="com.dataIndex">
                        <a-form-item style="margin: -5px;">
                          <span v-if="['text', 'input'].includes(com.component)">{{ item }}</span>
                          <div style="transform: scale(0.8)" v-else-if="com.component ==='image'">
                            <SG-UploadFile
                                :show="true"
                                v-model="formInfo.areaArray[index].areaOtherImg"
                            >
                              <span slot="tips"></span>
                            </SG-UploadFile>
                          </div>
                        </a-form-item>
                      </div>
                    </template>
                  </a-table>
                </a-form-item>
              </a-col>
            </a-row>
          </div>
        </div>
      </a-form>
    </div>
  </div>
</template>
<script>
import dictMixin from "../dictMixin.js"
import {typeFilter} from '@/views/buildingDict/buildingDictConfig';
import {areaTitle} from "./dict";

// 页面跳转
const operationTypes = {
  index: "/buildingDict",
}
export default {
  mixins: [dictMixin],
  data() {
    return {
      areaTitle, // 区域信息表头
      formInfo: { // 表单
        organId:'', // 组织机构ID
        communityId: '', // 项目Id
        placeName: '', // 车场名称
        placeCode: '', // 车场编码
        placeArea: 0,// 车场面积
        placeAreaUnit: '', // 车场面积单位
        placeNums: 0, // 车位数量
        typeId: '', // 车厂类型Id
        placeAddr: '', // 车厂地址
        carPlaceImg: '', // 车场平面图
        otherImg: [], // 其它图片
        description: '', // 备注
        areaArray: []
      },
      allStyle: 'width: 100%;',
      typeFilter,
      filePath: [], // 附件
      routeQuery: {
        // 路由传入数据
        type: "create", // 页面类型
        blankId: "",
        organName: "",
        organId: "",
      },
      bussType: "blankDir",
      formItemLayout: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 6 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 12 },
        },
      },
      formItemLayout2: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 2 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 20 },
        },
      },
      formItemLayoutTable: {
        labelCol: {
          xs: { span: 0 },
          sm: { span: 0 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 22 },
        },
      },
      formItemLayoutGeo: {
        labelCol: {
          xs: { span: 24 },
          sm: { span: 3 },
        },
        wrapperCol: {
          xs: { span: 24 },
          sm: { span: 21 },
        },
      },

    }
  },
  mounted() {
    let { organName, organId, type, placeId } = this.$route.query
    Object.assign(this, {
      routeQuery: { organName, organId, type, placeId },
    })
    this.init()
  },
  methods: {
    // 请求土地详情
    async blankApiDetail() {
    },
    // 初始化
    async init(){
      this.parkApiDetail()
    },
    /*************接口相关************/
    afterParkApiDetail (value) {
      const data = {
        ...value,
      }
      data.areaArray = value.areaArray.map(item=>({...item, key:Math.random(),areaOtherImg: (item.areaOtherImg|| "").split(',').filter(item=>item).map(item=>({url:item,name:item.split('/').pop()}))}))
      // 遍历循环
      this.formInfo.areaArray = [...data.areaArray]
      // this.formInfo.otherImg = (value.otherImg|| "").split(',').filter(item=>item).map(item=>({url:item,name:item.split('/').pop()}))
      return {
        ...data,
        otherImg: (value.otherImg|| "").split(',').filter(item=>item).map(item=>({url:item,name:item.split('/').pop()}))
      }
    },
    // 详情
    async parkApiDetail() {
      return new Promise((resolve, reject) => {
        let data = {
          placeId: this.routeQuery.placeId,
          organId: this.routeQuery.organId
        }
        this.loading = true
        this.$api.building.parkApiDetail(data).then(
            async (res) => {
              this.loading = false
              if (res.data.code === "0") {
                this.formInfo.areaArray=[]
                this.formInfo = this.afterParkApiDetail(res.data.data)
              } else {
                this.$message.error(res.data.message)
              }
              resolve()
            },
            () => {
              this.loading = false
              reject()
            }
        )
      })
    },
  },
}
</script>
<style lang="less" scoped>
.landInfo-create-page {
  position: relative;
  height: calc(100vh - 40px);
  overflow: hidden;
}
.create-form {
  padding: 42px 100px 70px 94px;
  position: relative;
  overflow: hidden;
  overflow-y: auto;
  height: 100%;
}
</style>
