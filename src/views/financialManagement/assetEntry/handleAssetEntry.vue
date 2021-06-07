<!--
  资产入账的操作，包括新建、编辑、审核、详情
-->
<template>
  <div class="handle-asset-entry">
    <a-form :form="form" @submit="handleSubmit">
      <div class="edit-box">
        <div class="edit-box-title"><i></i><span>基础信息</span></div>
        <div class="edit-box-content">
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">所属机构<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input :style="allStyle" v-model="organName" type="text" disabled v-if="editable"></a-input>
              <span class="label-value" v-else>{{organName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">卡片名称<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入卡片名称"
                :style="allStyle"
                :max="30"
                v-if="editable"
                v-decorator="['cardName',
                {rules: [{required: true, max: 30, whitespace: true, message: '请输入卡片名称(不超过30字符)'}], initialValue: detail.cardName}
              ]"/>
              <span class="label-value" v-else>{{detail.cardName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">卡片编码<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="若未填写系统自动生成"
                :style="allStyle"
                :max="30"
                v-if="editable"
                v-decorator="['cardCode',
                {rules: [{max: 30, whitespace: true, message: '卡片编码长度不得超过30字符'}], initialValue: detail.cardCode}
              ]"/>
              <span class="label-value" v-else>{{detail.cardCode || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">资产项目<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请选择资产项目"
                optionFilterProp="children"
                :style="allStyle"
                :options="projectIdOptions"
                :filterOption="filterOption"
                @change="changeProjectId"
                v-decorator="['projectId',
                {rules: [{required: true,  message: '请选择资产项目'}], initialValue: detail.projectId}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.projectName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">财务编码<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入财务编码"
                :style="allStyle"
                :max="30"
                v-if="editable"
                v-decorator="['financeCode',
                {rules: [{max: 30, whitespace: true, message: '财务编码长度不得超过30字符'}], initialValue: detail.financeCode}
              ]"/>
              <span class="label-value" v-else>{{detail.financeCode || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">入账日期<i></i></span><span>：</span></div>
            <a-form-item>
              <a-date-picker
                v-if="editable"
                :style="allStyle"
                placeholder="请选择入账日期"
                v-decorator="['accountEntryTime',
                {rules: [{required: true, message: '请选择入账日期'}], initialValue: detail.accountEntryTime}
              ]"/>
              <span class="label-value" v-else>{{detail.accountEntryTime || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-if="editable">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">关联资产<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                :style="allStyle"
                placeholder="请选择关联资产"
                :open="showAssociateAssetModal"
                :options="associateAssetsOptions"
                @dropdownVisibleChange="dropdownVisibleChange"
                v-decorator="['assetIds',
                {rules: [{required: true, message: '请选择关联资产'}], initialValue: detail.assetIds}]"
              >
                <div slot="dropdownRender" slot-scope="menu"></div>
                <a-icon slot="suffixIcon" type="plus-circle" />
              </a-select>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">资产类型<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                showSearch
                allowClear
                placeholder="请选择资产类型"
                optionFilterProp="children"
                :style="allStyle"
                :options="assetTypeOptions"
                :filterOption="filterOption"
                @change="changeAssetType"
                v-decorator="['assetType',
                {rules: [{required: true,  message: '请选择资产类型'}], initialValue: detail.assetType}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.assetTypeName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">资产分类<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                placeholder="请选择资产分类"
                :options="assetCategoryOptions"
                :style="allStyle"
                :filterOption="filterOption"
                @change="changeAssetCategory"
                v-decorator="['assetCategoryId',
                {rules: [{required: true,  message: '请选择资产分类'}], initialValue: detail.assetCategoryId}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.assetCategoryName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">保管部门<i></i></span><span>：</span></div>
            <a-form-item>
              <treeSelect
                :default="false"
                @changeTree="changeTree"
                placeholder='请选择保管部门'
                :defaultOrganName="detail.safekeepingOrganName"
                :style="allStyle"
                v-model="detail.safekeepingOrganId"
                v-if="editable"
              >
              </treeSelect>
              <span class="label-value" v-else>{{detail.safekeepingOrganName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">计量单位<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                allowClear
                placeholder="请选择计量单位"
                :style="allStyle"
                :options="unitOptions"
                v-decorator="['unitOfMeasurement',
                {rules: [{required: true, message: '请选择计量单位'}], initialValue: detail.unitOfMeasurement}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.unitOfMeasurementName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">数量<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input-number
                placeholder="请输入数量"
                :style="allStyle"
                step="1"
                v-if="editable"
                v-decorator="['num',
                {rules: [validateNumber], initialValue: detail.num}
              ]"/>
              <span class="label-value" v-else>{{detail.num || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">资产用途<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                allowClear
                placeholder="请选择资产用途"
                :style="allStyle"
                :options="assetPurposeOptions"
                v-decorator="['assetPurpose',
                {rules: [{required: true, message: '请选择资产用途'}], initialValue: detail.assetPurpose}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.assetPurposeName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">资产来源<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                allowClear
                placeholder="请选择资产来源"
                :style="allStyle"
                :options="assetSourceOptions"
                v-decorator="['assetSource',
                {rules: [], initialValue: detail.assetSource}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.assetSourceName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">取得日期<i></i></span><span>：</span></div>
            <a-form-item>
              <a-date-picker
                v-if="editable"
                :style="allStyle"
                placeholder="请选择取得日期"
                v-decorator="['getTime',
                {rules: [], initialValue: detail.getTime}
              ]"/>
              <span class="label-value" v-else>{{detail.getTime || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">存放地点<i></i></span><span>：</span></div>
            <!-- <a-form-item>
              <a-select
                allowClear
                placeholder="请选择存放地点"
                :style="allStyle"
                :options="storagePathOptions"
                v-decorator="['storagePath',
                {rules: [], initialValue: detail.storagePath}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.storagePath || '--'}}</span>
            </a-form-item> -->
              <a-form-item>
                <a-input
                  placeholder="请输入存放地点"
                  :style="allStyle"
                  :max="30"
                  v-if="editable"
                  v-decorator="['storagePath',
                  {rules: [{required: false, max: 50, whitespace: true, message: '请输入存放地点不超过50字符)'}], initialValue: detail.storagePath}
                ]"/>
                <span class="label-value" v-else>{{detail.storagePath || '--'}}</span>
              </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">规格型号<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入规格型号"
                :style="allStyle"
                v-if="editable"
                v-decorator="['specification',
                {rules: [{max: 30, message: '规格型号长度最多为30'}], initialValue: detail.specification}
              ]"/>
              <span class="label-value" v-else>{{detail.specification || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">资产科目<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                allowClear
                placeholder="请选择资产科目"
                :style="allStyle"
                :options="assetSubjectOptions"
                v-decorator="['assetSubject',
                {rules: [{required: true, message: '请选择资产科目'}], initialValue: detail.assetSubject}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.assetSubjectName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">贷方科目<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                allowClear
                placeholder="请选择贷方科目"
                :style="allStyle"
                :options="assetSubjectOptions"
                v-decorator="['lenderSubject',
                {rules: [{required: true, message: '请选择贷方科目'}], initialValue: detail.lenderSubject}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.lenderSubjectName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">累计折旧科目<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                allowClear
                placeholder="请选择累计折旧科目"
                :style="allStyle"
                :options="assetSubjectOptions"
                v-decorator="['cumulativeDepreciationSubject',
                {rules: [{required: true, message: '请选择累计折旧科目'}], initialValue: detail.cumulativeDepreciationSubject}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.cumulativeDepreciationSubjectName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">减值准备科目<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                allowClear
                placeholder="请选择减值准备科目"
                :style="allStyle"
                :options="assetSubjectOptions"
                v-decorator="['impairmentReadySubject',
                {rules: [{required: true, message: '请选择减值准备科目'}], initialValue: detail.impairmentReadySubject}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.impairmentReadySubjectName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">创建人<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{detail.createByName || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item" v-show="!editable">
            <div class="label-name-box"><span class="label-name">创建时间<i></i></span><span>：</span></div>
            <a-form-item>
              <span class="label-value">{{formatDate(detail.createTime) || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">备注<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <a-textarea
                placeholder="请输入描述（最多200字）"
                :rows="3"
                v-if="editable"
                v-decorator="['remark',
                {rules: [{validator: validateRemark}], initialValue: detail.remark}]"></a-textarea>
              <span class="label-value" v-else>{{detail.remark || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">附件<i></i></span><span>：</span></div>
            <a-form-item class="label-value">
              <SG-UploadFile
                type="all"
                :show="!editable"
                v-model="detail.attachment"/>
              <span class="file-null" v-if="!editable && detail.attachment.length === 0">--</span>
            </a-form-item>
          </div>
        </div>
      </div>
      <div class="edit-box">
        <div class="edit-box-title"><i></i><span>原值与折旧</span></div>
        <div class="edit-box-content">
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">购入原值<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入购入原值"
                :style="allStyle"
                v-if="editable"
                @change="onPurchaseValueChange"
                v-decorator="['purchaseValue',
                {rules: [{required: true, message: '请输入购入原值'}, {validator: validateValue}], initialValue: detail.purchaseValue}
              ]">
                <template slot="suffix">
                  <div style="color: #C4CBD4">元</div>
                </template>
              </a-input>
              <span class="label-value" v-else>{{detail.purchaseValue}}元</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">购入累计折旧<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入购入累计折旧"
                :style="allStyle"
                v-if="editable"
                v-decorator="['purchaseCumulativeDepreciation',
                {rules: [{required: true, message: '请输入购入累计折旧'}, validateValue], initialValue: detail.purchaseCumulativeDepreciation}
              ]">
                <template slot="suffix">
                  <div style="color: #C4CBD4">元</div>
                </template>
              </a-input>
              <span class="label-value" v-else>{{detail.purchaseCumulativeDepreciation}}元</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">开始使用日期<i></i></span><span>：</span></div>
            <a-form-item>
              <a-date-picker
                v-if="editable"
                :style="allStyle"
                placeholder="请选择开始使用日期"
                v-decorator="['startUseTime',
                {rules: [{required: true, message: '请选择开始使用日期'}], initialValue: detail.startUseTime}
              ]"/>
              <span class="label-value" v-else>{{detail.startUseTime || '--'}}</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">预计使用期限<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入预计使用期限"
                :style="allStyle"
                v-if="editable"
                v-decorator="['estimateUseTerm',
                {rules: [{required: true, message: '请输入预计使用期限'}, validateMonth], initialValue: detail.estimateUseTerm}
              ]">
                <template slot="suffix">
                  <div style="color: #C4CBD4">月</div>
                </template>
              </a-input>
              <span class="label-value" v-else>{{detail.estimateUseTerm}}个月</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">已使用期限<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入已使用期限"
                :style="allStyle"
                v-if="editable"
                v-decorator="['alreadyUseTerm',
                {rules: [{required: true, message: '请输入已使用期限'}, validateMonth], initialValue: detail.alreadyUseTerm}
              ]">
                <template slot="suffix">
                  <div style="color: #C4CBD4">月</div>
                </template>
              </a-input>
              <span class="label-value" v-else>{{detail.alreadyUseTerm}}个月</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">累计折旧<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入累计折旧"
                :style="allStyle"
                v-if="editable"
                @input="changeCumulativeDepreciation"
                v-decorator="['cumulativeDepreciation',
                {rules: [{required: true, message: '请输入累计折旧'}, validateValue], initialValue: detail.cumulativeDepreciation}
              ]">
                <template slot="suffix">
                  <div style="color: #C4CBD4">元</div>
                </template>
              </a-input>
              <span class="label-value" v-else>{{detail.cumulativeDepreciation }}元</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">净残值率<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                :style="allStyle"
                v-if="editable"
                disabled
                v-decorator="['netSalvageValueRate',
                {rules: [], initialValue: detail.netSalvageValueRate}
              ]">
                <template slot="suffix">
                  <div style="color: #C4CBD4">%</div>
                </template>
              </a-input>
              <span class="label-value" v-else>{{detail.netSalvageValueRate}}%</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">预计净残值<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                :style="allStyle"
                v-if="editable"
                disabled
                v-decorator="['estimateNetSalvageValue',
                {rules: [], initialValue: detail.estimateNetSalvageValue}
              ]">
                <template slot="suffix">
                  <div style="color: #C4CBD4">元</div>
                </template>
              </a-input>
              <span class="label-value" v-else>{{detail.estimateNetSalvageValue}}元</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">净值<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                :style="allStyle"
                v-if="editable"
                disabled
                v-decorator="['netValue',
                {rules: [], initialValue: detail.netValue}
              ]">
                <template slot="suffix">
                  <div style="color: #C4CBD4">元</div>
                </template>
              </a-input>
              <span class="label-value" v-else>{{detail.netValue}}元</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">减值准备<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                placeholder="请输入减值准备"
                :style="allStyle"
                v-if="editable"
                @input="changeImpairmentReady"
                v-decorator="['impairmentReady',
                {rules: [{required: true, message: '请输入减值准备'}, validateValue], initialValue: detail.impairmentReady}
              ]">
                <template slot="suffix">
                  <div style="color: #C4CBD4">元</div>
                </template>
              </a-input>
              <span class="label-value" v-else>{{detail.impairmentReady}}元</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box"><span class="label-name" :class="{'label-space-between': editable}">净额<i></i></span><span>：</span></div>
            <a-form-item>
              <a-input
                :style="allStyle"
                v-if="editable"
                disabled
                v-decorator="['netForehead',
                {rules: [], initialValue: detail.netForehead}
              ]">
                <template slot="suffix">
                  <div style="color: #C4CBD4">元</div>
                </template>
              </a-input>
              <span class="label-value" v-else>{{detail.netForehead}}元</span>
            </a-form-item>
          </div>
          <div class="edit-box-content-item">
            <div class="label-name-box" :class="{'required': editable}"><span class="label-name" :class="{'label-space-between': editable}">折旧方法<i></i></span><span>：</span></div>
            <a-form-item>
              <a-select
                allowClear
                dropdownClassName="dropdown-class-depreciation"
                placeholder="请选择折旧方法"
                :style="allStyle"
                :options="depreciationMethodOptions"
                v-decorator="['depreciationMethod',
                {rules: [{required: true, message: '请选择折旧方法'}], initialValue: detail.depreciationMethod}]"
                v-if="editable"
              ></a-select>
              <span class="label-value" v-else>{{detail.depreciationMethodName || '--'}}</span>
            </a-form-item>
          </div>
        </div>
      </div>
      <div class="edit-box" v-show="!editable">
        <div class="edit-box-title"><i></i><span>关联资产清单</span><span style="font-size: 12px;margin-left: 5px">(资产总数：{{dataSource.length}})</span></div>
        <div class="edit-box-content table-border">
          <!--<div class="table-header-btn" v-show="editable">-->
            <!--<SG-Button type="primary" weaken>导出</SG-Button>-->
          <!--</div>-->
          <a-table
            :columns="columns"
            :dataSource="dataSource"
            class="custom-table td-pd10"
            :pagination="false"
          >
          </a-table>
        </div>
      </div>
      <div class="edit-box" v-show="pageType === 'audit'">
        <div class="edit-box-title"><i></i><span>审核信息</span></div>
        <div class="edit-box-content">
          <div class="edit-box-content-item total-width">
            <div class="label-name-box"><span class="label-name">审核意见</span><span>：</span></div>
            <a-form-item class="label-value">
              <a-textarea
                placeholder="请输入审核意见"
                :rows="3"
                v-model="audit.auditOpinion"
              ></a-textarea>
            </a-form-item>
          </div>
        </div>
      </div>
    </a-form>
    <form-footer v-show="pageType === 'new' || pageType === 'edit'">
      <slot>
        <SG-Button type="primary" @click="handleSubmit(1)">提交</SG-Button>
        <SG-Button type="primary" weaken @click="handleSubmit(0)">保存草稿</SG-Button>
        <SG-Button @click="cancel">取消</SG-Button>
      </slot>
    </form-footer>
    <form-footer v-show="pageType === 'audit'" leftButtonName="审核通过" rightButtonName="驳回" rightButtonType="danger" @save="approveAudit" @cancel="rejectAudit">
    </form-footer>
    <associate-asset-modal ref="associateAssetModal" :organId="organId" queryType="1" @assetChange="assetChange" v-if="editable"></associate-asset-modal>
  </div>
</template>

<script>
import TreeSelect from '../../common/treeSelect'
import FormFooter from '@/components/FormFooter'
import associateAssetModal from './associateAssetModal'
import {dateToString} from 'utils/formatTime'
import utils from '@/utils/utils'
import moment from 'moment'

const columns = [
  {
    title: '资产编码',
    dataIndex: 'assetCode',
    width: '160px'
  },
  {
    title: '资产名称',
    dataIndex: 'assetName',
    width: '160px'
  },
  {
    title: '所属机构',
    dataIndex: 'organName',
    width: '160px'
  },
  {
    title: '所属资产项目',
    dataIndex: 'projectName',
    width: '180px'
  },
  {
    title: '资产类型',
    dataIndex: 'assetTypeName',
    width: '160px'
  },
  {
    title: '资产类别',
    dataIndex: 'assetCategoryName',
    width: '160px'
  },
  {
    title: '资产位置',
    dataIndex: 'address',
    width: '200px'
  },
  {
    title: '资产状态',
    dataIndex: 'assetStatusName',
    width: '160px'
  },
  {
    title: '资产原值(元)',
    dataIndex: 'originalValue',
    width: '180px'
  },
  {
    title: '最新价值(元)',
    dataIndex: 'marketValue',
    width: '180px'
  },
  ]

export default {
  components: {
    FormFooter, TreeSelect, associateAssetModal
  },
  data () {
    return {
      pageType: 'new',
      editable: false,
      form: this.$form.createForm(this),
      allStyle: 'width: 160px;',
      organId: '',
      organName: '',
      cardId: '',
      detail: {
        cardName: '',
        cardCode: '',
        projectId: undefined,
        projectName: '',
        financeCode: '',
        accountEntryTime: undefined,
        assetIds: undefined,
        assetNames: [],
        assetType: undefined,
        assetTypeName: '',
        assetCategoryId: undefined,
        assetCategoryName: '',
        safekeepingOrganId: '',
        safekeepingOrganName: '',
        unitOfMeasurement: undefined,
        unitOfMeasurementName: '',
        num: '',
        assetPurpose: undefined,
        assetPurposeName: '',
        assetSource: undefined,
        assetSourceName: '',
        getTime: undefined,
        storagePath: '',
        specification: '',
        assetSubject: undefined,
        assetSubjectName: '',
        lenderSubject: undefined,
        lenderSubjectName: '',
        cumulativeDepreciationSubject: undefined,
        cumulativeDepreciationSubjectName: '',
        impairmentReadySubject: undefined,
        impairmentReadySubjectName: '',
        createByName: '',
        createTime: '',
        remark: '',
        attachment: [],
        purchaseValue: '',
        purchaseCumulativeDepreciation: 0,
        startUseTime: undefined,
        estimateUseTerm: '',
        alreadyUseTerm: '',
        cumulativeDepreciation: 0,
        netSalvageValueRate: '',
        estimateNetSalvageValue: '',
        netValue: '',
        impairmentReady: 0,
        netForehead: '',
        depreciationMethod: undefined,
        depreciationMethodName: ''
      },
      projectIdOptions: [],
      assetIdOptions: [],
      assetTypeOptions: [],
      assetCategoryOptions: [],
      unitOptions: [],
      assetPurposeOptions: [],
      assetSourceOptions: [],
      // storagePathOptions: [],
      assetSubjectOptions: [],
      depreciationMethodOptions: [],
      associateAssetsOptions: [],
      showAssociateAssetModal: false,
      columns,
      dataSource: [],
      checkedData: [],
      audit: {
        auditor: '',
        auditTime: '',
        auditOpinion: ''
      },
      paginator: {
        pageNo: 1,
        pageLength: 10,
        totalCount: 0
      }
    }
  },
  watch: {
    'detail.purchaseValue' () {
      if (this.editable && this.detail.purchaseValue && this.detail.netSalvageValueRate) {
        this.form.setFieldsValue({
          estimateNetSalvageValue: utils.accDiv(parseFloat(this.detail.purchaseValue * this.detail.netSalvageValueRate).toFixed(2), parseFloat(100).toFixed(2), 2)
        })
      }
      if (this.editable && this.detail.purchaseValue && this.detail.cumulativeDepreciation !== '') {
        this.form.setFieldsValue({
          netValue: utils.accSub(parseFloat(this.detail.purchaseValue).toFixed(2), parseFloat(this.detail.cumulativeDepreciation).toFixed(2))
        })
        this.detail.netValue = utils.accSub(parseFloat(this.detail.purchaseValue).toFixed(2), parseFloat(this.detail.cumulativeDepreciation).toFixed(2))
      }
    },
    'detail.netSalvageValueRate' () {
      if (this.editable && this.detail.purchaseValue && this.detail.netSalvageValueRate) {
        this.form.setFieldsValue({
          estimateNetSalvageValue: utils.accDiv(parseFloat(this.detail.purchaseValue * this.detail.netSalvageValueRate).toFixed(2), parseFloat(100).toFixed(2), 2)
        })
      }
    },
    'detail.netValue' () {
      if (this.editable && this.detail.netValue !== '' && this.detail.impairmentReady !== '') {
        this.form.setFieldsValue({
          netForehead: utils.accSub(parseFloat(this.detail.netValue).toFixed(2), parseFloat(this.detail.impairmentReady).toFixed(2))
        })
      }
    }
  },
  methods: {
    moment,
    formatDate (value) {
      if (value) {
        return dateToString(new Date(value), 'yyyy-mm-dd')
      }
      return ''
    },
    filterOption(input, option) {
      return (
        option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
      )
    },
    dropdownVisibleChange (open) {
      this.showAssociateAssetModal = open
      if (open) {
        this.toggleAssociateAsset()
      }
    },
    // 展示关联资产弹窗
    toggleAssociateAsset () {
      if (!this.form.getFieldValue('projectId')) {
        this.$message.info('请先选择资产项目')
        return
      }
      if (!this.form.getFieldValue('assetType')) {
        this.$message.info('请先选择资产类型')
        return
      }
      this.$refs.associateAssetModal.show = true
      this.$refs.associateAssetModal.redactCheckedDataFn(this.checkedData, this.form.getFieldValue('projectId'), this.dataSource, this.form.getFieldValue('assetType'))
    },
    // 关联资产发生变动
    assetChange (checkedData, checkedNames, rowsData, extraData) {
      this.checkedData = checkedData
      this.detail.assetIds = checkedData.join(',')
      this.detail.assetNames = checkedNames.join(',')
      this.associateAssetsOptions = [{label: this.detail.assetNames, value: this.detail.assetIds}]
      this.detail.purchaseValue = extraData.originalValueSum
      this.form.setFieldsValue({
        purchaseValue: extraData.originalValueSum,
        assetIds: checkedData.join(',')
      })
      this.form.setFieldsValue({
        num: this.checkedData.length
      })
      this.form.setFieldsValue({
        assetType: extraData.assetType.toString()
      })
      this.form.setFieldsValue({                // 资产分类回填
        assetCategoryId: extraData.assetCategory.toString()
      })
      this.handleChangeAssetCategory(extraData.assetCategory.toString())
      this.form.setFieldsValue({                // 资产用途回填
        assetPurpose: extraData.useType ? extraData.useType.toString() : ''
      })
      this.dataSource = rowsData
      this.$refs.associateAssetModal.show = false
    },
    changeTree (value, label) {
      this.detail.safekeepingOrganId = value
    },
    // 校验数量
    validateNumber (rule, value, callback) {
      let reg =  /^[0-9]*[1-9][0-9]*$/
      if (!value) {
        callback('请输入数量')
      } else if (!reg.test(value)) {
        callback('数量必须为正整数')
      } else if (value < 0 || value > 9999999) {
        callback('数量取值范围为0-9999999')
      } else {
        callback()
      }
    },
    // 校验钱值
    validateValue (rule, value, callback) {
      var regPos = /^\d+(\.\d+)?$/
      if (value) {
        if (!regPos.test(value)) {
          callback('格式不正确，必须为正数值型')
        }else if (value < 0 || value > 9999999999.99) {
          callback('该值取值范围为0-9999999999.99')
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 校验输入的月份
    validateMonth (rule, value, callback) {
      let reg =  /^[0-9]*[1-9][0-9]*$/
      if (value) {
        if (!reg.test(value)) {
          callback('格式不正确，必须为正整数')
        }else if (value < 0 || value > 9999) {
          callback('该值取值范围为0-9999')
        } else {
          callback()
        }
      } else {
        callback()
      }
    },
    // 校验备注
    validateRemark (rule, value, callback) {
      if (value) {
        if (value.length > 200) {
          callback('备注长度不能超过200个字')
        }
      }
      callback()
    },
    // 资产项目发生变化
    changeProjectId (value, options) {
      this.dataSource = []
      this.checkedData = []
      this.detail.assetIds = undefined
      this.detail.assetNames = ''
      this.associateAssetsOptions = []
      this.form.setFieldsValue({
        getTime: options.data.props.date ? moment(options.data.props.date) : undefined
      })
      this.form.setFieldsValue({
        assetSource: options.data.props.sourceType.toString() || undefined
      })
    },
    // 资产类型发生变化
    changeAssetType (value) {
      this.detail.assetType = value
      this.getAssetCategoryOptions()
      this.getAssetPurposeOptions()
      this.checkedData = []
      this.dataSource = []
      this.form.setFieldsValue({
        assetCategoryId: undefined,     // 资产分类
        assetIds: undefined,             // 关联资产
        assetPurpose: undefined          // 资产用途
      })
    },
    // 资产分类发生变化
    changeAssetCategory (value) {
      this.handleChangeAssetCategory(value)
    },
    handleChangeAssetCategory (value) {
      this.assetCategoryOptions.forEach(item => {
        if (item.value === value) {
          console.log(item)
          this.form.setFieldsValue({
            netSalvageValueRate: item.netSalvageRate || '',
            unitOfMeasurement: item.unit || undefined
          })
          this.detail.netSalvageValueRate = item.netSalvageRate || ''
        }
      })
    },
    // 购入原值发生变化
    onPurchaseValueChange (event) {
      let value = event.target.value
      let reg =  /^\d+(\.\d+)?$/
      if (value && reg.test(value) && value > 0 && value < 9999999999.99) {
        this.detail.purchaseValue = event.target.value
      }
    },
    // 累计折旧发生变化
    changeCumulativeDepreciation (event) {
      let value = event.target.value
      let reg =  /^\d+(\.\d+)?$/
      if (value && reg.test(value) && value > 0 && value < 9999999999.99) {
        this.detail.cumulativeDepreciation = event.target.value
        if (this.detail.purchaseValue && this.detail.cumulativeDepreciation !== '') {
          this.form.setFieldsValue({
            netValue: utils.accSub(parseFloat(this.detail.purchaseValue).toFixed(2), parseFloat(this.detail.cumulativeDepreciation).toFixed(2))
          })
          this.detail.netValue = utils.accSub(parseFloat(this.detail.purchaseValue).toFixed(2), parseFloat(this.detail.cumulativeDepreciation).toFixed(2))
        }
      }
    },
    // 减值准备发生变化
    changeImpairmentReady (event) {
      let value = event.target.value
      let reg =  /^\d+(\.\d+)?$/
      if (value && reg.test(value) && value > 0 && value < 9999999999.99) {
        this.detail.impairmentReady = event.target.value
        if (this.detail.netValue !== '' && this.detail.impairmentReady !== '') {
          this.form.setFieldsValue({
            netForehead: utils.accSub(parseFloat(this.detail.netValue).toFixed(2), parseFloat(this.detail.impairmentReady).toFixed(2))
          })
        }
      }
    },
    // 获取资产项目下拉列表
    getProjectIdOptions () {
      let form = {
        organId: this.organId
      }
      this.$api.assets.getObjectKeyValueByOrganId(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.projectName,
              value: item.projectId,
              date: item.takeOverDate,
              sourceType: item.sourceType
            }
            arr.push(obj)
          })
          this.projectIdOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取资产类型下拉列表
    getAssetTypeOptions () {
      let form = {
        code: 'asset_type'
      }
      this.$api.basics.platformDict(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.name,
              value: item.value
            }
            arr.push(obj)
          })
          this.assetTypeOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取资产分类下拉列表
    getAssetCategoryOptions () {
      let obj = {
        organId: this.organId,
        assetType: this.detail.assetType
      }
      this.$api.assets.getList(obj).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.professionName,
              value: item.professionCode,
              netSalvageRate: item.netSalvageRate,
              unit: item.unit
            }
            arr.push(obj)
          })
          this.assetCategoryOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取计量单位下拉列表
    getUnitOptions () {
      let form = {
        code: 'MEASURE_UNIT',
        organId: this.organId
      }
      this.$api.basics.organDict(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.name,
              value: item.value
            }
            arr.push(obj)
          })
          this.unitOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取资产房屋用途下拉列表
    getAssetPurposeOptions () {
      if (+this.detail.assetType === 1) {
        let form = {
          categoryCode: 60
        }
        this.$api.basics.queryNodesByRootCode(form).then(res => {
          if (res.data.code === '0') {
            let arr = []
            res.data.data.forEach(item => {
              let obj = {
                label: item.typeName,
                value: item.typeCode
              }
              arr.push(obj)
            })
            this.assetPurposeOptions = arr
          } else {
            this.$message.error(res.data.message)
          }
        })
      } else {
        let data = {
          code: 'OCM_LANDUSE',
          organId: this.organId
        }
        this.$api.basics.organDict(data).then(res => {
          if (res.data.code === "0") {
            let data = res.data.data
            this.assetPurposeOptions = data.map(item => ({
              value: item["value"],
              label: item["name"],
            }))
          }
        })
      }
    },
    // 获取资产来源下拉列表
    getAssetSourceOptions () {
      let form = {
        code: 'ams_source_type',
        // organId: this.organId
      }
      this.$api.basics.platformDict(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.name,
              value: item.value
            }
            arr.push(obj)
          })
          this.assetSourceOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取存放地点下拉列表
    // getStoragePathOptions () {
    //   let form = {
    //     code: 'STORAGE_PATH',
    //     organId: this.organId
    //   }
    //   this.$api.basics.organDict(form).then(res => {
    //     console.log(res, '获取存放地点下拉列表')
    //     if (res.data.code === '0') {
    //       let arr = []
    //       res.data.data.forEach(item => {
    //         let obj = {
    //           label: item.name,
    //           value: item.value
    //         }
    //         arr.push(obj)
    //       })
    //       this.storagePathOptions = arr
    //     } else {
    //       this.$message.error(res.data.message)
    //     }
    //   })
    // },
    // 获取资产科目下拉列表
    getAssetSubjectList () {
      let form = {
        organId: this.organId
      }
      this.$api.assets.getFeeTypeList(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.feeTypeName,
              value: item.feeTypeId.toString()
            }
            arr.push(obj)
          })
          this.assetSubjectOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 获取折旧方法下拉列表
    getDepreciationMethodOptions () {
      let form = {
        code: 'DEPRECIATION_METHOD'
      }
      this.$api.basics.platformDict(form).then(res => {
        if (res.data.code === '0') {
          let arr = []
          res.data.data.forEach(item => {
            let obj = {
              label: item.name,
              value: item.value
            }
            arr.push(obj)
          })
          this.depreciationMethodOptions = arr
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    // 新增编辑提交
    handleSubmit (approvalStatus) {
      console.log(approvalStatus)
      this.form.validateFields((err, values) => {
        console.log(err)
        console.log(values)
        if (!err) {
          console.log(values)
          let form = values
          form.organId = this.organId
          form.accountEntryTime = form.accountEntryTime.format('YYYY-MM-DD')
          form.startUseTime = form.startUseTime.format('YYYY-MM-DD')
          form.getTime = form.getTime ? form.getTime.format('YYYY-MM-DD') : ''
          form.safekeepingOrganId = this.detail.safekeepingOrganId || ''
          form.approvalStatus = approvalStatus
          let attachment = []
          this.detail.attachment.forEach(item => {
            let obj = {
              attachmentPath: item.url,
              oldAttachmentName: item.name
            }
            attachment.push(obj)
          })
          form.attachmentList = attachment
          console.log(form)
          if (this.pageType === 'new') {
            this.$api.assets.insertCard(form).then(res => {
              if (res.data.code === '0') {
                this.$message.success('提交成功')
                this.$router.push({path: '/assetEntry', query: {refresh: true}})
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
          if (this.pageType === 'edit') {
            form.cardId = this.cardId
            this.$api.assets.updateCard(form).then(res => {
              if (res.data.code === '0') {
                this.$message.success('提交成功')
                this.$router.push({path: '/assetEntry', query: {refresh: true}})
              } else {
                this.$message.error(res.data.message)
              }
            })
          }
        }
      })
    },
    // 提交审核
    submitAudit () {
    },
    // 取消
    cancel () {
      this.$router.push({path: '/assetEntry'})
    },
    // 审核通过
    approveAudit () {},
    // 驳回
    rejectAudit () {
      if (!this.auditOpinion) {
        this.$message.warning('驳回时审核意见不能为空')
        return
      }
    },
    getDetail () {
      let form = {
        cardId: this.cardId
      }
      this.$api.assets.queryCardDetail(form).then(res => {
        if (res.data.code === '0') {
          console.log(res)
          let data = res.data.data
          this.organId = data.organId
          this.organName = data.organName
          this.detail = data
          this.detail.projectId = +this.detail.projectId
          if (this.editable) {
            this.detail.accountEntryTime = moment(this.detail.accountEntryTime, 'YYYY-MM-DD')
            this.detail.startUseTime = moment(this.detail.startUseTime, 'YYYY-MM-DD')
            this.detail.getTime = this.detail.getTime ? moment(this.detail.getTime, 'YYYY-MM-DD') : undefined
          }
          this.detail.assetSource = this.detail.assetSource === null ? undefined : this.detail.assetSource
          // this.detail.storagePath = this.detail.storagePath === null ? undefined : this.detail.storagePath
          let attachment = []
          this.detail.attachmentList.forEach(item => {
            let obj = {
              url: item.attachmentPath,
              name: item.oldAttachmentName
            }
            attachment.push(obj)
          })
          this.detail.attachment = attachment
          let checkedData = []
          let checkedNames = []
          this.detail.assetList.forEach((item, index) => {
            item.assetId = +item.assetId
            item.key = item.assetId
            checkedData.push(item.assetId)
            checkedNames.push(item.assetName)
          })
          this.checkedData = checkedData
          this.detail.assetIds = checkedData.join(',')
          this.detail.assetNames = checkedNames.join(',')
          this.associateAssetsOptions = [{label: this.detail.assetNames, value: this.detail.assetIds}]
          this.dataSource = this.detail.assetList
          // 查询资产分类
          this.getAssetCategoryOptions()
          // 查询资产类型
          this.getAssetPurposeOptions()
        } else {
          this.$message.error(res.data.message)
        }
      })
    },
    getAssetDetailList () {
      let form = {
        cleaningOrderId: this.cleaningOrderId,
        pageNum: this.paginator.pageNo,
        pageSize: this.paginator.pageLength
      }
      this.$api.assets.getCleanupDetailPage(form).then(res => {
        if (res.data.code === '0') {
          let data = res.data.data.data
          data.forEach((item, index) => {
            item.key = index.toString()
          })
          this.dataSource = data
          this.paginator.totalCount = res.data.data.count
        } else {
          this.$message.error(res.data.message)
        }
      })
    }
  },
  mounted () {
    this.pageType = this.$route.query.pageType
    this.editable = this.pageType === 'new' || this.pageType === 'edit'
    this.organId = this.$route.query.organId
    this.organName = this.$route.query.organName
    if (this.editable) {
      this.getProjectIdOptions()
      this.getAssetTypeOptions()
      this.getAssetCategoryOptions()
      this.getUnitOptions()
      this.getAssetSourceOptions()
      // this.getStoragePathOptions()
      this.getAssetSubjectList()
      this.getDepreciationMethodOptions()
    }
    if (this.pageType !== 'new') {
      this.cardId = this.$route.query.cardId
      this.getDetail()
    }
  }
}
</script>

<style lang="less">
  .dropdown-class-depreciation{width: 200px !important;}
</style>
<style lang="less" scoped>
  .handle-asset-entry {
    padding: 40px 105px 40px 95px;
    .edit-box {
      text-align: left;
      color: #49505E;
      margin-bottom: 16px;
      .edit-box-title {
        height: 14px;
        font-size: 14px;
        font-weight:bold;
        i {
          display: block;
          height: 14px;
          width: 5px;
          margin-right: 10px;
          background: #0084FF;
          float: left;
        }
        span {
          display: block;
          float: left;
          height: 14px;
          line-height: 14px;
          font-family: PingFang-SC-Heavy;
        }
      }
      .edit-box-content {
        margin: 30px 40px 0 40px;
        position: relative;
        display: inline-block;
        width: 100%;
        .edit-box-content-item {
          width: 33%;
          float: left;
          font-size: 12px;
          .label-name-box {
            float: left;
            line-height: 34px;
            .label-name {
              height: 34px;
              font-family: PingFang-SC-Regular;
              color: #282D5B;
              margin-right: 3px;
              float: left;
              span {
                float: left;
              }
            }
            .label-space-between {
              width: 72px;
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
              content: '*';
              color: #f5222d;
              line-height: 36px;
              font-family: SimSun;
            }
          }
          /deep/ .ant-form-item-control {
            line-height: 34px;
          }
          /deep/ .ant-form-explain {
            margin-left: 90px;
          }
          /deep/ .ant-form-item-with-help {
            margin-bottom: 6px;
          }
        }
        .edit-box-content-item.total-width {
          width: 100%;
          .label-value {
            float: left;
            width: calc(100% - 97px);
          }
        }
        .table-header-btn {
          position: absolute;
          right: 0;
          top: -44px;
        }
        .custom-table {
          /deep/ .ant-table-placeholder{
            display: block!important;
          }
        }
      }
    }
  }
</style>
