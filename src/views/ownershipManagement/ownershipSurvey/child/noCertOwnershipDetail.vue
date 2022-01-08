<!--
 * @Date: 2019-11-28 14:41:27
 * @Author: chen han
 * @Description: 权属概况->资产项目->无证详情
 -->
 <template>
  <!-- 表格部分 -->
  <div class="table-layout-fixed detail-table">
    <a-table
      class="custom-table td-pd10"
      :loading="table.loading"
      :pagination="false"
      :columns="table.columns"
      :dataSource="table.dataSource"
      :scroll="{y:500}"
    >
      <template slot="settingMethod" slot-scope="text, record">
        <span v-if="type === 'detail'">{{ record.settingMethodName }}</span>
        <div v-else>
          <a-select
            :style="{ width: '100%' }"
            @change="watchSettingMethodChange($event, record)"
            optionFilterProp="children"
            :options="$addTitle(seletOpt)"
            :allowClear="false"
            v-model="record.settingMethod"
          />
        </div>
      </template>
      <template slot="remark" slot-scope="text, record">
        <span v-if="type === 'detail'">{{ record.remark }}</span>
        <div v-else>
          <a-input
            :maxLength="200"
            @input="watchRemarkChange($event, record)"
            v-model="record.remark"
          />
        </div>
      </template>
      <template slot="supportMaterial" slot-scope="text, record">
        <span v-if="type === 'detail'">{{ record.supportMaterial === 1 ? '是' : '否' }}</span>
        <div v-else>
          <a-select
            :style="{ width: '100%' }"
            @change="watchSupportMaterialChange($event, record)"
            optionFilterProp="children"
            :options="$addTitle(supportMaterialOptions)"
            :allowClear="false"
            v-model="record.supportMaterial"
          />
        </div>
      </template>
      <template slot="attachment" slot-scope="text, record">
        <span v-if="type === 'detail'">
          <a @click="openPop(record)">查看附件 {{record.attachmentRespDtos ? record.attachmentRespDtos.length : 0}}</a>
        </span>
        <div v-else>
          <a @click="openPop(record)">编辑附件 {{record.attachmentRespDtos ? record.attachmentRespDtos.length : 0}}</a>
        </div>
      </template>
    </a-table>
    <no-data-tips
      class="noTipStyle"
      v-show="table.dataSource.length === 0"
    ></no-data-tips>
    <SG-FooterPagination
      v-if="$route.query.type==='detail'"
      :pageLength="queryCondition.pageSize"
      :totalCount="totalCount"
      location="absolute"
      v-model="queryCondition.pageNum"
      @change="handleChange"
      :noPageTools="true"
    />
    <SG-Modal
      title="附件"
      v-model="attachmentModalFlag"
      :maskClosable="false"
      @ok="attachmentModalSubmit"
      @cancel="()=>{attachmentModalFlag=false}"
    >
      <div>
        <SG-UploadFile
          :baseImgURL="configBase.hostImg1"
          v-model="currentRowAttachmentList"
          :show="!isSet"
          type="all"
          :max="10"
          :maxSize="20480"
          :customDownload="
            (value) => {
              return  customDownload(value, $api.ownership.downLoadAnnex);
            }
          "
          :customUpload="
            (value) => {
              return customUpload(value, $api.ownership.uploadAnnex);
            }
          "
        />
      </div>
    </SG-Modal>
  </div>
</template>
 <script>
import configBase from "@/config/config.base";
import uploadAndDownLoadFIle from "@/mixins/uploadAndDownLoadFIle";
import noDataTips from "@/components/noDataTips";
let getUuid = ((uuid = 1) => () => ++uuid)();
let queryCondition = {
  pageSize: 10,
  pageNum: 1,
  ownershipStatus: 0,
};
let seletOpt = [
  { label: "办理新证", value: 1 },
  { label: "不具备办理条件", value: 2 },
];
let supportMaterialOptions = [
  { label: "是", value: 1 },
  { label: "否", value: 0 },
]
// 表格数据
let columns = [
  {
    title: "资产名称",
    dataIndex: "assetName",
    width: "20%",
  },
  {
    title: "资产编码",
    dataIndex: "assetCode",
    width: "15%",
  },
  {
    title: "资产类型",
    dataIndex: "assetTypeName",
    width: "10%",
  },
  {
    title: "资产分类",
    dataIndex: "objectTypeName",
    width: "10%",
  },
  {
    title: "资产项目名称",
    dataIndex: "projectName",
    width: "15%",
  },
  {
    title: "所在位置",
    dataIndex: "location",
    width: "20%",
  },
  {
    title: "权属类型",
    dataIndex: "kindOfRightName",
    width: "10%",
  },
  {
    title: "权属办理设置",
    dataIndex: "settingMethod",
    scopedSlots: { customRender: "settingMethod" },
    width: "150px",
  },
  {
    title: "权属备注",
    dataIndex: "remark",
    scopedSlots: { customRender: "remark" },
    width: "150px",
  },
  {
    title: "是否有证明材料",
    dataIndex: "supportMaterial",
    scopedSlots: { customRender: "supportMaterial" },
    width: "150px",
  },
  {
    title: "附件",
    dataIndex: "attachment",
    scopedSlots: { customRender: "attachment" },
    width: "150px",
  },
];
export default {
  components: {
    noDataTips,
  },
  props: {
    type: {
      default: "detail",
    },
    projectId: {
      default: "",
    },
    scrollHeight: {
      default: () => ({ y: "auto" }),
    },
    totalCount:{
      default: 0
    }
    // assetTypes: {
    //   type: Array,
    //   default: () => []
    // }
  },
  mixins:[uploadAndDownLoadFIle],
  data() {
    return {
      currentRowAttachmentList:[],
      configBase,
      currentRow:{},
      attachmentModalFlag:false,
      assetTypes: [],
      seletOpt,
      supportMaterialOptions,
      queryCondition: { ...queryCondition },
      table: {
        columns,
        dataSource: [],
        loading: false,
        totalCount: 0,
      },
    };
  },
  computed:{
    isSet(){
      return this.$route.query.type === 'set'
    }
  },
  mounted() {
    this.assetTypes = this.$route.query.assetTypes
    if (this.$route.query.type === 'set'){
      this.queryCondition.pageSize = 9999
    }
    this.query();
  },
  methods: {
    // 打开附件弹窗
    openPop(row){
      this.currentRow = row
      this.attachmentModalFlag = true
      this.currentRowAttachmentList = this.currentRow.attachmentRespDtos.map(ele=>{
        return {
          ...ele,
          name:ele.newAttachmentName,
          url: ele.attachmentPath
        }
      })
    },
    attachmentModalSubmit(){
      this.currentRow.attachmentRespDtos = this.currentRowAttachmentList.map(ele=>{
        return {
          ...ele,
          objectId:this.currentRow.assetHouseId,
          newAttachmentName: ele.name,
          attachmentPath: ele.url,
          oldAttachmentName: ele.name
        }
      })
      this.watchAttachmentRespDtosChange(this.currentRow.attachmentRespDtos,this.currentRow)
      this.attachmentModalFlag = false
    },
    query() {
      let data = {
        ...this.queryCondition,
        projectId: this.projectId,
        assetTypes: this.assetTypes,
      };
      this.table.loading = true;
      this.$api.basics.attrList(data).then(
        (res) => {
          this.table.loading = false;
          if (res.data.code === "0") {
            let result = res.data.data.data || [];
            this.table.dataSource = result.map((item) => {
              //  item.settingMethod = item.settingMethod || 2 // 默认不具备办理条件
              item.settingMethod = 2; // 默认不具备办理条件
              item.supportMaterial = item.supportMaterial || '否'
              item.area = item.area || "--";
              item.assetTypeName = item.assetTypeName || "--";
              item.assetCode = item.assetCode || "--";
              item.location = item.location || "--";
              console.log('this.type !== "set"',this.type !== "set")
              if (this.type !== "set") {
                item.remark = item.remark || "--";
                item.settingMethodName = "不具备办理条件";
              }
              return {
                key: getUuid(),
                ...item,
              };
            });
            this.table.totalCount = res.data.data.count || 0;
          } else {
            this.$message.error(res.data.message);
          }
        },
        () => {
          this.table.loading = false;
        }
      );
    },
    // 监听选择框(权属办理设置)变化
    watchSettingMethodChange(e, row) {
      console.log("记录select=>", e, row);
      let o = {
        supportMaterial: Number(e),
        settingMethod: Number(e),
        remark: row.remark || "",
        assetType: row.assetType,
        assetObjectId: row.assetHouseId,
        attachmentReqDtos: row.attachmentRespDtos
      };
      this.$emit("change", o);
    },
    // 监听选择框(是否有证明材料)变化
    watchSupportMaterialChange(e, row) {
      let o = {
        supportMaterial: Number(e),
        settingMethod: Number(row.settingMethod),
        remark: row.remark || "",
        assetType: row.assetType,
        assetObjectId: row.assetHouseId,
        attachmentReqDtos: row.attachmentRespDtos
      };
      this.$emit("change", o);
    },
    // 监听输入框变化
    watchRemarkChange(e, row) {
      let o = {
        supportMaterial: Number(row.supportMaterial),
        settingMethod: Number(row.settingMethod),
        remark: row.remark || "",
        assetType: row.assetType,
        assetObjectId: row.assetHouseId,
        attachmentReqDtos: row.attachmentRespDtos
      };
      this.$emit("change", o);
    },
    // 监听附件发生变化
    watchAttachmentRespDtosChange(e, row) {
      let o = {
        supportMaterial: Number(row.supportMaterial),
        settingMethod: Number(row.settingMethod),
        remark: row.remark || "",
        assetType: row.assetType,
        assetObjectId: row.assetHouseId,
        attachmentReqDtos: e
      };
      this.$emit("change", o);
    },
    handleChange(data) {
      this.queryCondition.pageNum = data.pageNo;
      this.query();
    },
  },
};
</script>
 <style lang="less" scoped>
.detail-table {
  position: relative;
  border: 1px solid rgba(238, 242, 245, 1);
  border-top: none;
  min-height: 140px;
  padding-bottom: 80px;
}
.noTipStyle {
  padding: 20px 0;
}
</style>
