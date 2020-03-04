<!--
 * @Description: 资源信息 附属配套 资源
 * @Date: 2020-02-17 19:08:55
 * @LastEditTime: 2020-03-03 10:27:40
 -->
<template>
  <a-spin :spinning="spinning">
    <div class="inventoryPlan-create">
      <div class="edit-box">
        <div>
          <SG-Title noMargin title="资产信息" />
        </div>
        <!-- 由资产项目带出数据 -->
        <div class="edit-box-content">
          <!-- 一项数据 -->
           <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                所属组织机构
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{'-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box required">
              <span class="label-name label-space-between">
                资产名称
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{''}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产编码
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{'-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box required">
              <span class="label-name label-space-between">
                资产项目
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{'-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产类型
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{'-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产分类
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{'-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产状态
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{'-'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item mr24">
             <div class="label-name-box">
              <span class="label-name label-space-between">
                资产位置
                <i></i>
              </span>
              <span>：</span>
              <span class="label-value">{{'-'}}</span>
            </div>
          </div>
        </div>
        <div>
          <SG-Title noMargin title="附属配套信息" />
        </div>
        <!-- 表单填写数据 -->
        <div>
           <div class="edit-box-content">
           <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                名称
                <i></i>
              </span>
              <span>：</span>
            </div>
            <div>
              <span class="label-value">{{'--'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                编码
                <i></i>
              </span>
              <span>：</span>
            </div>
            <div>
              <span class="label-value" >{{'--'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                类型
                <i></i>
              </span>
              <span>：</span>
            </div>
            <div>
              <span class="label-value" >{{organName || '--'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                规格型号
                <i></i>
              </span>
              <span>：</span>
            </div>
            <div>
              <span class="label-value" >{{organName || '--'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                价值
                <i></i>
              </span>
              <span>：</span>
            </div>
            <div>
              <span class="label-value" >{{organName || '--'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box required">
              <span class="label-name label-space-between">
                数量
                <i></i>
              </span>
              <span>：</span>
            </div>
            <div>
              <span class="label-value" >{{organName || '--'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                计量单位
                <i></i>
              </span>
              <span>：</span>
            </div>
            <div>
              <span class="label-value" >{{organName || '--'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item">
            <!-- <div class="label-name-box">
              <span class="label-name label-space-between">
                <i></i>
              </span>
              <span></span>
            </div> -->
            <div>
              <a-checkbox :disabled="true" :checked="checkNick" @change="handleChange">
                接管前附属配套
              </a-checkbox>
            </div>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box">
              <span class="label-name label-space-between">
                备注
                <i></i>
              </span>
              <span>：</span>
            </div>
            <div>
              <span class="label-value" >{{organName || '--'}}</span>
            </div>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box">
              <span class="label-name label-space-between">附件<i></i></span
              ><span>：</span>
            </div>
            <div class="label-value">
              <SG-UploadFile :show="false" type="all" :maxSize="5120" v-model="filepaths" />
            </div>
          </div>
         </div>
        </div>
      </div>
    </div>
  </a-spin>
</template>
<script>
let getUuid = ((uuid = 1) => () => ++uuid)()
const allStyle = { width: "200px" }
export default {
  data () {
    return {
      spinning: false,
      form: this.$form.createForm(this),
      allStyle,
      filepaths: [],
      type: 'create',
      checkNick: false,
      subsidiayInfo: {}
    }
  },
  created () {
    this.organId = this.$route.query.organId || ''
    this.organName = this.$route.query.organName || ''
    this.type = this.$route.query.type || ''
    this.subsidiaryMatchingId = this.$route.query.subsidiaryMatchingId || ''
    this.assetId = this.$route.query.assetId || ''
    if (this.subsidiaryMatchingId) {
      this.getMatchingById()
    }
  },
  methods: {
    getMatchingById () {
      let data = {
        subsidiaryMatchingId: this.subsidiaryMatchingId
      }
      this.$api.subsidiary.getMatchingById(data).then(res => {
        if (res.data.code === "0") {
          let obj = res.data.data || {}
          // 处理表单数据
          let o = {
            matchingName: obj.matchingName,
            matchingCode: obj.matchingCode,
            matchingType: obj.matchingType,
            specificationType: obj.specificationType,
            value: obj.value,
            number: obj.number,
            unitOfMeasurement: obj.unitOfMeasurement,
            remark: obj.remark,
          }
          // 处理复选框
          this.checkNick = String(obj.isBefore) === '1' ? true : false
          // 处理附件
          if (obj.attachmentList && obj.attachmentList.length) {
            this.filepaths = obj.attachmentList.map(item => {
              return {url: item.attachmentPath, name: item.oldAttachmentName}
            })
          } else {
            this.filepaths = []
          }
          this.subsidiayInfo = o
        } else {
          this.$message.error(res.data.message);
        }
      })
    },
    handleChange (e) {
     this.checkNick = e.target.checked;
    },
  }
}
</script>
<style lang="less" scoped>
.inventoryPlan-create {
  padding: 40px 100px 110px 95px;
  position: relative;
  .edit-box {
    text-align: left;
    color: #49505e;
    margin-bottom: 16px;
    .edit-box-content {
      padding: 30px 0px 0 40px;
      position: relative;
      display: inline-block;
      width: 100%;
      .edit-box-content-item {
        width: 33%;
        float: left;
        font-size: 12px;
        &.mr24{
          margin-bottom:24px;
        }
        &.total-width {
          width: 100%;
          .label-value {
            float: left;
            width: calc(100% - 125px);
          }
        }
        .label-name-box {
          float: left;
          line-height: 34px;
          .label-name {
            height: 34px;
            font-family: PingFang-SC-Regular;
            color: #282d5b;
            margin-right: 3px;
            float: left;
            span {
              float: left;
            }
          }
          .label-space-between {
            width: 74px;
            text-align: justify;
            margin-left: 10px;
            i {
              display: inline-block;
              width: 100%;
            }
          }
        }
        .label-name-box.required {
          position: relative;
          &:before {
            position: absolute;
            left: 0px;
            width: 6px;
            content: "*";
            color: #f5222d;
            line-height: 36px;
            font-family: SimSun;
          }
        }
      }
    }
  }
}
.detail-table {
  position: relative;
  border-left: 1px solid rgba(238, 242, 245, 1);
  border-right: 1px solid rgba(238, 242, 245, 1);
}
.btn-delete {
  color: #f5222d;
  cursor: pointer;
}
.label-value{
}
</style>
