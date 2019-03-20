<template>
    <div>
      <page-header @on-click-right="clearFinanceProInfo">
        <div slot>报价单-金融</div>
        <div slot="right" v-if="canEdit">清空</div>
      </page-header>
      <div>
        <cell-box>
            <span class="margin-left-30 car-price-title">当前汽车销售价:</span>
            <span class="car-price-value" v-if="isHomePage">¥
                <input type="text" v-model="actualSalePrice"/>
            </span>
            <span class="car-price-value" v-else>¥
                {{ order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice }}
            </span>
            <span class="finance-status pull-right" v-if="financeStatus != ''">{{ financeStatus }}</span>
        </cell-box>
        <cell-box class="margin-top-21">
            <div class="w flex">
                <div class="w50">
                    <cell title="产品类型">
                        <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.financeTypeName" readonly>
                        <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                    </cell>
                </div>
                <div class="w50">
                    <cell title="金融机构">
                        <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.financeOrgName" readonly>
                        <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                    </cell>
                </div>
            </div>
        </cell-box>
        <cell-box>
            <div class="w flex">
                <div class="w50">
                    <cell title="首付金额">
                        <input type="number" v-model="financeDetailInfo.financialOrderDetailInfo.downPaymentAmount" @change="checkDownPayment" @click="choseDownPaymentAmount" readonly>
                    </cell>
                </div>
                <div class="w50">
                    <cell title="尾款金额">
                        <input type="number" v-model="financeDetailInfo.financialOrderDetailInfo.balancePaymentValue" @change="checkBalancePaymentValue" @click="choseBalancePaymentValue" readonly>
                    </cell>
                </div>
            </div>
        </cell-box>
        <cell-box>
            <div class="w flex">
                <div class="w50">
                    <cell title="贷款类型" >
                        <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.loanTypeName" readonly>
                    </cell>
                </div>
                <div class="w50">
                    <cell title="贷款金额">
                        <input type="number" v-model="financeDetailInfo.financialOrderDetailInfo.valueOfLoan" readonly>
                        <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                    </cell>
                </div>
            </div>
        </cell-box>
        <cell-box>
            <div class="w flex">
                <div class="w50">
                    <cell :title="(isInterest ? '实际利率': '实际费率')">
                        <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.taxRate" @change="checkTaxRate" readonly>
                        <span slot="right">%</span>
                    </cell>
                </div>
                <div class="w50">
                    <cell title="期数">
                        <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.cycleMonth" @change="checkCycleMonth" readonly>
                    </cell>
                </div>
            </div>
        </cell-box>
        <cell-box>
            <div class="w flex">
                <div class="w50">
                    <cell title="月供">
                        <input type="number" v-model="financeDetailInfo.financialOrderDetailInfo.payForMonth" readonly>
                    </cell>
                </div>
                <div @click="selectRepaymentMethods" class="w50">
                    <cell title="还款方式">
                        <!-- <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.repaymentMethodName" readonly> -->
                        <input type="text" v-model="averageCapital" readonly>
                        <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                    </cell>
                </div>
            </div>
        </cell-box>
        <cell-box>
            <div class="w flex">
                <div class="w50">
                    <cell title="保证金">
                        <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.cautionMoney" readonly>
                    </cell>
                </div>
            </div>
        </cell-box>
        <cell-box v-show="isSubsidyInterest">
            <div class="w flex">
                <div class="w50">
                    <cell title="机构贴息">
                        <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.financeSubsidyInterest" readonly>
                    </cell>
                </div>
                <div class="w50">
                    <cell title="本店贴息">
                        <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.storeSubsidyInterest" readonly>
                    </cell>
                </div>
            </div>
        </cell-box>
        <cell-box v-show="isLease">
            <div class="w flex">
                <div class="w50">
                    <cell title="期末里程数">
                        <input type="number" v-model="financeDetailInfo.financialOrderDetailInfo.finalMileage" readonly>
                    </cell>
                </div>
                <div class="w50">
                    <cell title="期末保值数">
                        <input type="number" v-model="financeDetailInfo.financialOrderDetailInfo.finalValue" readonly>
                    </cell>
                </div>
            </div>
        </cell-box>
        <remark title="备注" class="m-t-10" v-model="financeDetailInfo.financialOrderDetailInfo.remark"></remark>
      </div>
      <div class="save" v-if="financeProDetailInfo.wfStatus != 5 && canEdit">
          <div class="left">
              <div class="hot" @click="searchFinanceProList" v-show="canEdit">
                  <span><i class="icon iconfont icon-rexiaofangan"></i></span>
                  <br />
                  <span>热销方案</span>
              </div>
              <div class="attache" @click="choseCanPushToAssist" v-if="isSc">
                  <span><i class="icon iconfont icon-jinrongzhuanyuan"></i></span>
                  <br />
                  <span>金融专员</span>
              </div>
          </div>
          <div class="center">
            <div v-if="verifyStatus == 0" class="defeat" @click="selectFinanceFailReasonTypes">
              战败
            </div>
          </div>
          <div :class="{'right-disabled': !hasFinanceDetail, 'right': hasFinanceDetail}" @click="editFinancePro" v-show="canEdit">
              保&nbsp;存
          </div>
      </div>
      <div class="listmodel" @click="cancelFinanceTypes" v-if="showFinanceTypes">
          <div class="modelContainer">
              <div class="title p-l-10 p-r-10">
                  <span @click="cancelFinanceTypes">取消</span>
              </div>
              <ul>
                  <li v-for="(item, index) in financeTypes" :key="index" @click="choseFinanceTypeItem(index)">
                      {{ item.name }}
                  </li>
              </ul>
          </div>
      </div>
      <div class="listmodel" @click="cancelAuthorizationOrgs" v-if="showAuthorizationOrgs">
          <div class="modelContainer">
              <div class="title p-l-10 p-r-10">
                  <span @click="cancelAuthorizationOrgs">取消</span>
              </div>
              <ul>
                  <li v-for="(item, index) in authorizationOrgs" :key="index" @click="choseAuthorizationOrgItem(index)">
                      {{ item.name }}
                  </li>
              </ul>
          </div>
      </div>
      <div class="listmodel" @click="cancelRepaymentMethods" v-if="showRepaymentMethods">
          <div class="modelContainer">
              <div class="title p-l-10 p-r-10">
                  <span @click="cancelRepaymentMethods">取消</span>
              </div>
              <ul>
                  <li v-for="(item, index) in repaymentMethods" :key="index" @click="choseRepaymentMethodItem(index)">
                      {{ item.name }}
                  </li>
              </ul>
          </div>
      </div>
      <div class="listmodel" @click="cancelFinanceFailReasonTypes" v-if="showFinanceFailReasonTypes">
          <div class="modelContainer">
              <div class="title p-l-10 p-r-10">
                <span @click="cancelFinanceFailReasonTypes" class="pull-left">取消</span>
                金融战败原因
              </div>
              <ul>
                  <li v-for="(item, index) in financeFailReasonTypes" :key="index" @click="choseFinanceFailReasonTypeItem(index)">
                      {{ item.name }}
                  </li>
              </ul>
          </div>
      </div>
      <modal ref="downPaymentAmountModal" @submit="submitDownPaymentAmount" :title="'首付金额'" :submitText="'提交'" :confirmDisplay="true" :afterConfirmClose="false">
          <div class="payment-content">
              <div class="w flex downPayment">
                  <div class="w50">
                      <span>下限:</span>
                      <span class="downPayment-content">
                          {{ financeDetailInfo.financialOrderDetailInfo.downpaymentMin }}
                          {{ financeDetailInfo.financialOrderDetailInfo.downpaymentType == 0 ? '': '%'}}
                      </span>
                  </div>
                  <div class="w50">
                      <span>上限:</span>
                      <span class="downPayment-content">
                          {{ financeDetailInfo.financialOrderDetailInfo.downpaymentMax }}
                          {{ financeDetailInfo.financialOrderDetailInfo.downpaymentType == 0 ? '': '%'}}
                      </span>
                  </div>
              </div>
              <div class="w flex input">
                  <input type="number" @focus="clearDownPaymentAmountActual" v-model="downPaymentAmount" :placeholder="(financeDetailInfo.financialOrderDetailInfo.downpaymentType == 0 ? '请填写实际金额': '请填写实际比例')" autofocus="autofocus" />
                  <span class="m-l-10 word" v-show="financeDetailInfo.financialOrderDetailInfo.downpaymentType == 1">%</span>
              </div>
              <div class="w flex input" v-if="financeDetailInfo.financialOrderDetailInfo.downpaymentType == 1">
                  <input type="number" @focus="clearDownPaymentAmount" v-model="downPaymentAmountActual" placeholder="请填写实际金额" autofocus="autofocus" />
              </div>
          </div>
      </modal>
      <modal ref="balancePaymentValueModal" @submit="submitBalancePaymentValue" :title="'尾款金额'" :submitText="'提交'" :confirmDisplay="true"  :afterConfirmClose="false">
          <div class="payment-content">
              <div class="w flex downPayment">
                  <div class="w50">
                      <span>下限:</span>
                      <span class="downPayment-content">
                          {{ financeDetailInfo.financialOrderDetailInfo.balancePaymentMinValue }}
                          {{ financeDetailInfo.financialOrderDetailInfo.bpIsPercent == 0 ? '': '%'}}
                      </span>
                  </div>
                  <div class="w50">
                      <span>上限:</span>
                      <span class="downPayment-content">
                          {{ financeDetailInfo.financialOrderDetailInfo.balancePaymentMaxValue }}
                          {{ financeDetailInfo.financialOrderDetailInfo.bpIsPercent == 0 ? '': '%'}}
                      </span>
                  </div>
              </div>
              <div class="w flex input">
                  <input type="number" @focus="clearBalancePaymentActualValue" v-model="balancePaymentValue" :placeholder="(financeDetailInfo.financialOrderDetailInfo.bpIsPercent == 0 ? '请填写实际金额': '请填写实际比例')" autofocus="autofocus" />
                  <span class="m-l-10 word" v-show="financeDetailInfo.financialOrderDetailInfo.bpIsPercent == 1">%</span>
              </div>
              <div class="w flex input" v-if="financeDetailInfo.financialOrderDetailInfo.bpIsPercent == 1">
                  <input type="number" @focus="clearBalancePaymentValue" v-model="balancePaymentValueActual" placeholder="请填写实际金额" autofocus="autofocus" />
              </div>
          </div>
      </modal>
      <modal ref="financialSpec" :confirmDisplay="false" :title="'提醒'">
          <div class="finance-content">
              <div class="w flex">
                  {{ hasFinanceDetail ? '是否保存当前方案, 并推送金融专员协助报价?': '是否推送金融专员协助报价?' }}
              </div>
          </div>
          <div slot="footer">
              <mt-button class="btn" plain @click="closeCanPushToAssistModal">取消</mt-button>
              <mt-button class="btn" type="primary" @click="pushFinanceWbInfo">确认</mt-button>
          </div>
      </modal>
    </div>
</template>

<script>
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
    import {
        row,
        Toast,
        Button
    } from 'mint-ui'
    import config from '../../../common/config'
    import pageHeader from '@/components/header/PageHeader'
    import cellBox from '@/components/cell-box'
    import cell from '@/components/cell-item'
    import modal from 'components/modal'
    import remark from '@/components/remark'
    import api from 'common/api'
    /**
     * 清空 所有字段为空 (期数之前是1，现改为 '', 其他所有字段也都改为 '')
     * -- > 修改的地方都添加了注释
     * update by lwx on 2018/01/13
     *
     */
    export default {
        mounted() {
            let _this = this
            let financeDetailCode = _this.financeDetailCode
            let orderNo = _this.$route.params.orderNo
            if (financeDetailCode != null && financeDetailCode != '' && financeDetailCode != -1 && financeDetailCode != 'homepage') {
                let index = _this.financeProDetailInfoList.findIndex((item) => {
                    return item.financeDetailCode == financeDetailCode
                })
                if (index != -1) {
                    let financialOrderDetailInfo = _this.financeProDetailInfoList[index]
                    _this.$data.financeDetailInfo.orderNo = _this.order.orderNo
                    _this.$data.financeDetailInfo.financialOrderNo = (_this.financeProDetailInfo.financialOrderNo ? _this.financeProDetailInfo.financialOrderNo : '')
                    _this.$data.financeDetailInfo.financialOrderDetailInfo = {
                        orderNo: _this.order.orderNo,
                        financialOrderNo: _this.financeProDetailInfo.financialOrderNo ? _this.financeProDetailInfo.financialOrderNo : '',
                        financialOrderDetailCode: _this.financeProDetailInfo.financialOrderDetailInfo != undefined ? _this.financeProDetailInfo.financialOrderDetailInfo.financialOrderDetailCode : '',
                        financeName: financialOrderDetailInfo.financeName,
                        financeCode: financialOrderDetailInfo.financeCode ? financialOrderDetailInfo.financeCode : '',
                        financeDetailCode: financialOrderDetailInfo.financeDetailCode ? financialOrderDetailInfo.financeDetailCode : '',
                        financeTypeCode: financialOrderDetailInfo.financeType,
                        financeTypeName: financialOrderDetailInfo.financeTypeName,
                        loanTypeCode: financialOrderDetailInfo.loanType,
                        loanTypeName: financialOrderDetailInfo.loanTypeName,
                        financeOrgCode: financialOrderDetailInfo.financeOrgCode,
                        financeOrgName: financialOrderDetailInfo.financeOrgName,
                        downpaymentType: financialOrderDetailInfo.downpaymentType,
                        downPaymentAmount: financialOrderDetailInfo.downpaymentType == 0 ? financialOrderDetailInfo.downpaymentMin : (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * financialOrderDetailInfo.downpaymentMin).toFixed(2),
                        downpaymentMin: _this.filterIsPercent(financialOrderDetailInfo.downpaymentType, financialOrderDetailInfo.downpaymentMin),
                        downpaymentMax: _this.filterIsPercent(financialOrderDetailInfo.downpaymentType, financialOrderDetailInfo.downpaymentMax),
                        bpIsPercent: financialOrderDetailInfo.bpIsPercent,
                        balancePaymentValue: financialOrderDetailInfo.bpIsPercent == 0 ? financialOrderDetailInfo.balancePaymentMinValue : (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * financialOrderDetailInfo.balancePaymentMinValue).toFixed(2),
                        balancePaymentMinValue: _this.filterIsPercent(financialOrderDetailInfo.bpIsPercent, financialOrderDetailInfo.balancePaymentMinValue),
                        balancePaymentMaxValue: _this.filterIsPercent(financialOrderDetailInfo.bpIsPercent, financialOrderDetailInfo.balancePaymentMaxValue),
                        valueOfLoan: 0,
                        rateType: financialOrderDetailInfo.rateType,
                        taxRate: parseFloat(financialOrderDetailInfo.rates * 100).toFixed(2),
                        cycleMonth: financialOrderDetailInfo.cycleMonth,
                        payForMonth: 0,
                        repaymentMethod: config.order.financePro.repaymentMethod.equalAmountOfInterest,
                        repaymentMethodName: '等额本息',
                        cautionMoney: financialOrderDetailInfo.dfInPercent == 0 ? financialOrderDetailInfo.depositFree : (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * financialOrderDetailInfo.depositFree).toFixed(2),
                        finalMileage: financialOrderDetailInfo.finalMileage,
                        evIsPercent: financialOrderDetailInfo.evIsPercent,
                        finalValue: financialOrderDetailInfo.evIsPercent == 0 ? financialOrderDetailInfo.endingValue : (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * financialOrderDetailInfo.endingValue).toFixed(2),
                        remark: ''
                    }
                    if (financialOrderDetailInfo.tDetailIntersubsidyInfoList != null && financialOrderDetailInfo.tDetailIntersubsidyInfoList.length > 0) {
                        _this.$data.financeDetailInfo.financialOrderDetailInfo.storeInPercent = financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].dealerInPercent
                        _this.$data.financeDetailInfo.financialOrderDetailInfo.storeSubsidyInterest = (financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].dealerInPercent == 0 ? financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].dealerIntersubsidyValue : (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].dealerIntersubsidyValue).toFixed(2))
                        _this.$data.financeDetailInfo.financialOrderDetailInfo.financeInPercent = financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].isPercent
                        _this.$data.financeDetailInfo.financialOrderDetailInfo.financeSubsidyInterest = (financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].isPercent == 0 ? financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].intersubsidyValue : (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].intersubsidyValue).toFixed(2))
                    }
                    _this.financeDetailInfo.financialOrderDetailInfo.valueOfLoan = (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount).toFixed(2)
                    if (_this.financeDetailInfo.financialOrderDetailInfo.taxRate >= 0 && _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth > 1) {
                        let rateMonth = parseFloat(_this.financeDetailInfo.financialOrderDetailInfo.taxRate / 100) / 12
                        let cycleMonth = _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth
                        let rateType = _this.financeDetailInfo.financialOrderDetailInfo.rateType
                        let valueOfLoan = (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount - _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue).toFixed(2)
                        if (rateMonth == 0 && rateType == config.order.financePro.rateType.interest) {
                            _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan / cycleMonth).toFixed(2)
                        } else if (rateMonth > 0 && rateType == config.order.financePro.rateType.interest) {
                            _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan * rateMonth * Math.pow((1 + rateMonth), cycleMonth) / (Math.pow((1 + rateMonth), cycleMonth) - 1) + _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue * rateMonth).toFixed(2)
                        } else {
                            _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan / cycleMonth + (valueOfLoan * rateMonth * 12 / cycleMonth)).toFixed(2)
                        }
                    }
                    if (_this.$data.financeTypes.length > 0 && _this.$data.financeDetailInfo.financialOrderDetailInfo.loanTypeCode != '') {
                        _this.$data.financeTypes.forEach((item) => {
                             let index = item.children.findIndex((val) => {
                                return  (val.value == _this.$data.financeDetailInfo.financialOrderDetailInfo.loanTypeCode)
                             })
                             if (index != -1) {
                                _this.$data.financeDetailInfo.financialOrderDetailInfo.loanTypeName = item.children[index].text
                             }
                        })
                    }
                }
            } else {
                if (orderNo != undefined && orderNo != null && orderNo != '' && orderNo != -1) {
                    _this.getFinancialOrderInfoByOrderNo({
                        orderNo: orderNo,
                        ignoreDefault: 1
                    })
                } else {
                    let carOrderInfoVoList = _this.order.carOrderInfoVoList
                    if (carOrderInfoVoList.length > 0) {
                        if (carOrderInfoVoList[0].carOrderDetailInfoList.length > 0) {
                            _this.$data.finacePro.factoryCode = carOrderInfoVoList[0].carOrderDetailInfoList[0].carFactoryCode
                            _this.$data.finacePro.brandCode = carOrderInfoVoList[0].carOrderDetailInfoList[0].carBrandCode
                            _this.$data.finacePro.seriesCode = carOrderInfoVoList[0].carOrderDetailInfoList[0].carSeriesCode
                            _this.$data.finacePro.modelCode = carOrderInfoVoList[0].carOrderDetailInfoList[0].carModelCode
                            _this.$data.finacePro.carCode = carOrderInfoVoList[0].carOrderDetailInfoList[0].carCode
                        }
                    }
                    _this.finacePro.orderNo = _this.order.orderNo
                    _this.financeDetailInfo.orderNo = _this.order.orderNo
                    _this.finacePro.actualSalesPrice = _this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice
                    if (_this.canEdit) {
                       _this.getFinanceProByPriorityLevel(_this.$data.finacePro)
                    }
                }
            }
            _this.getFinanceTypes({
                callback: (detailList) => {
                    _this.financeTypes = detailList
                }
            })
            _this.getAuthorizationOrgs({
                callback: (detailList) => {
                    _this.authorizationOrgs = detailList
                }
            })
            _this.getRepaymentMethods({
                callback: (detailList) => {
                    _this.repaymentMethods = detailList
                    _this.$data.financeDetailInfo.financialOrderDetailInfo.repaymentMethod = config.order.financePro.repaymentMethod.equalAmountOfInterest
                    _this.financeDetailInfo.financialOrderDetailInfo.repaymentMethodName = '等额本息'
                }
            })
            _this.getFinanceFailReasonTypes({
                callback: (detailList) => {
                    _this.financeFailReasonTypes = detailList
                }
            })
            _this.getUserPermissionsInfo()
        },
        data: function() {
            return {
                disabled: false,
                orderSubstitutionCode:'',
                averageCapital: '等额本息',
                listselectShow: false,
                accountnum: 0,
                financeDetailInfo: {
                    orderNo: '',
                    defeatStatus: 0,
                    scDefeatReason: '',
                    financialOrderDetailInfo: {
                        loanTypeCode: '',
                        loanTypeName: '',
                        orderNo: '',
                        financeDetailCode: '',
                        financeTypeCode: '',
                        financeTypeName: '',
                        financeOrgCode: '',
                        financeOrgName: '',
                        downpaymentType: 0,
                        downPaymentAmount: null,
                        downpaymentMin: 0,   //下限
                        downpaymentMax: 0,
                        evIsPercent: 0,
                        balancePaymentValue: null,
                        balancePaymentMinValue: 0,
                        balancePaymentMaxValue: 0,
                        valueOfLoan: null,
                        taxRate: null,
                        cycleMonth: '', // 期数
                        payForMonth: null,
                        repaymentMethod: '',
                        repaymentMethodName: '',
                        cautionMoney: null,
                        finalMileage: null,
                        endingValueType: 0,
                        finalValue: null,
                        storeInPercent: 0,
                        storeSubsidyInterest: null,
                        financeInPercent: 0,
                        financeSubsidyInterest: null,
                        remark: ''
                    }
                },
                finacePro: {
                    factoryCode: '',
                    brandCode: '',
                    seriesCode: '',
                    modelCode: '',
                    carCode: '',
                    financeType: '',
                    financeOrgCode: '',
                    orderNo: '',
                    actualSalesPrice: null,
                    pageNums: config.pageNums,
                    pageStart: 1
                },
                financeTypes: [],
                authorizationOrgs: [],
                repaymentMethods: [],
                financeFailReasonTypes: [],
                actualSalePrice: 0,
                showFinanceTypes: false,
                showAuthorizationOrgs: false,
                showRepaymentMethods: false,
                showFinanceFailReasonTypes: false,
                showDownPaymentAmount: false,
                downPaymentAmount: null,
                downPaymentAmountActual: null,
                showBalancePaymentValue: false,
                balancePaymentValue: null,
                balancePaymentValueActual: null,
                verifyStatus: 0
            }
        },
        computed: {
            ...mapState('financePro', [
                'financeDetailCode',
                'financeProDetailInfo',
                'financeProDetailInfoList'
            ]),
            ...mapState('order', [
                'isSc',
                'order'
            ]),
            ...mapGetters('financePro', [
                'financeStatus'
            ]),
            ...mapGetters('order', [
                'isOrderCanEdit'
            ]),
            canEdit: function() {
                let _this = this
                return (_this.isSc && _this.isOrderCanEdit)
            },
            isLease: function() {
                let _this = this
                return (_this.$data.financeDetailInfo.financialOrderDetailInfo.financeTypeCode == config.order.financePro.financeType.leaseFatherCode)
            },
            isHomePage: function() {
                let _this = this
                return _this.$route.params.orderNo == 'homepage'
            },
            isSubsidyInterest: function() {
                let _this = this
                return (_this.$data.financeDetailInfo.financialOrderDetailInfo.financeTypeCode == config.order.financePro.financeType.interestFatherCode)
            },
            hasFinanceDetail: function() {
                let _this = this
                return (_this.$data.financeDetailInfo.financialOrderDetailInfo.financeCode != '' && _this.$data.financeDetailInfo.financialOrderDetailInfo.financeCode != undefined && _this.$data.verifyStatus == 0)
            },
            isInterest: function() {
                let _this = this
                let result = false
                if (_this.$data.financeDetailInfo.financialOrderDetailInfo.rateType === config.order.financePro.rateType.interest) {
                    result = true
                } else {
                    result = false
                }
                return result
            }
        },
        methods: {
            getPaymentVerification() {
                let _this = this
                api.clearingsettlement
                    .order
                    .financialOrderInfo({
                      financialOrderNo: this.$data.financeDetailInfo.financialOrderNo,
                      orderNo: _this.order.orderNo
                    }, (res) => {
                        if(res.data.obj){
                          let verifyStatus = res.data.obj.verifyStatus
                          let verificationTotalAmount = res.data.obj.verificationTotalAmount
                          if (verifyStatus == 0 && verificationTotalAmount > 0) {
                            _this.$data.verifyStatus = 1
                          } else {
                            _this.$data.verifyStatus = verifyStatus
                          }
                        }
                    })
            },
            //金融子订单单款类型
            closeSelect: function() {
                this.listselectShow = false
            },
            changeStatus: function(type) {
                this.listselectShow = type
            },
            dataInfo(val, num) {
                this.financeDetailInfo.financialOrderDetailInfo.loanTypeCode = val.value
                this.financeDetailInfo.financialOrderDetailInfo.loanTypeName = val.text
            },
            showSelect: function() {
                this.$refs.getType.getAccountType(config.ref.LoadType)
            },
            editFinancePro: function() {
                let _this = this
                if (_this.hasFinanceDetail) {
                    _this.updateFinancialOrderInfo({
                        financeDetailInfo: _this.$data.financeDetailInfo,
                        callback: () => {
                            _this.goBack()
                        }
                    })
                }
            },
            defeatFinancePro: function() {
                let _this = this
                _this.updateFinancialOrderInfo({
                    financeDetailInfo: _this.$data.financeDetailInfo,
                    callback: () => {
                        _this.goBack()
                    }
                })
            },
            checkDownPayment: function() {
                let _this = this
                _this.financeDetailInfo.financialOrderDetailInfo.valueOfLoan = (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount).toFixed(2)
                if (_this.financeDetailInfo.financialOrderDetailInfo.taxRate >= 0 && _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth > 1) {
                    let rateMonth = parseFloat(_this.financeDetailInfo.financialOrderDetailInfo.taxRate / 100) / 12
                    let cycleMonth = _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth
                    let rateType = _this.financeDetailInfo.financialOrderDetailInfo.rateType
                    let valueOfLoan = (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount - _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue).toFixed(2)
                    if (rateMonth == 0 && rateType == config.order.financePro.rateType.interest) {
                        _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan / cycleMonth).toFixed(2)
                    } else if (rateMonth > 0 && rateType == config.order.financePro.rateType.interest) {
                        _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan * rateMonth * Math.pow((1 + rateMonth), cycleMonth) / (Math.pow((1 + rateMonth), cycleMonth) - 1) + _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue * rateMonth).toFixed(2)
                    } else {
                        _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan / cycleMonth + (valueOfLoan * rateMonth * 12 / cycleMonth)).toFixed(2)
                    }
                }
                return true
            },
            checkBalancePaymentValue: function() {
                let _this = this
                _this.financeDetailInfo.financialOrderDetailInfo.valueOfLoan = (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount).toFixed(2)
                if (_this.financeDetailInfo.financialOrderDetailInfo.taxRate >= 0 && _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth > 1) {
                    let rateMonth = parseFloat(_this.financeDetailInfo.financialOrderDetailInfo.taxRate / 100) / 12
                    let cycleMonth = _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth
                    let rateType = _this.financeDetailInfo.financialOrderDetailInfo.rateType
                    let valueOfLoan = (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount - _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue).toFixed(2)
                    if (rateMonth == 0 && rateType == config.order.financePro.rateType.interest) {
                        _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan / cycleMonth).toFixed(2)
                    } else if (rateMonth > 0 && rateType == config.order.financePro.rateType.interest) {
                        _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan * rateMonth * Math.pow((1 + rateMonth), cycleMonth) / (Math.pow((1 + rateMonth), cycleMonth) - 1) + _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue * rateMonth).toFixed(2)
                    } else {
                        _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan / cycleMonth + (valueOfLoan * rateMonth * 12 / cycleMonth)).toFixed(2)
                    }
                }
                return true
            },
            checkTaxRate: function() {
                let _this = this
                _this.financeDetailInfo.financialOrderDetailInfo.valueOfLoan = (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount).toFixed(2)
                if (_this.financeDetailInfo.financialOrderDetailInfo.taxRate >= 0 && _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth > 1) {
                    let rateMonth = parseFloat(_this.financeDetailInfo.financialOrderDetailInfo.taxRate / 100) / 12
                    let cycleMonth = _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth
                    let rateType = _this.financeDetailInfo.financialOrderDetailInfo.rateType
                    let valueOfLoan = (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount - _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue).toFixed(2)
                    if (rateMonth == 0 && rateType == config.order.financePro.rateType.interest) {
                        _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan / cycleMonth).toFixed(2)
                    } else if (rateMonth > 0 && rateType == config.order.financePro.rateType.interest) {
                        _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan * rateMonth * Math.pow((1 + rateMonth), cycleMonth) / (Math.pow((1 + rateMonth), cycleMonth) - 1) + _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue * rateMonth).toFixed(2)
                    } else {
                        _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan / cycleMonth + (valueOfLoan * rateMonth * 12 / cycleMonth)).toFixed(2)
                    }
                }
                return true
            },
            checkCycleMonth: function() {
                let _this = this
                _this.financeDetailInfo.financialOrderDetailInfo.valueOfLoan = (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount).toFixed(2)
                if (_this.financeDetailInfo.financialOrderDetailInfo.taxRate >= 0 && _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth > 1) {
                    let rateMonth = parseFloat(_this.financeDetailInfo.financialOrderDetailInfo.taxRate / 100) / 12
                    let cycleMonth = _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth
                    let rateType = _this.financeDetailInfo.financialOrderDetailInfo.rateType
                    let valueOfLoan = (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount - _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue).toFixed(2)
                    if (rateMonth == 0 && rateType == config.order.financePro.rateType.interest) {
                        _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan / cycleMonth).toFixed(2)
                    } else if (rateMonth > 0 && rateType == config.order.financePro.rateType.interest) {
                        _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan * rateMonth * Math.pow((1 + rateMonth), cycleMonth) / (Math.pow((1 + rateMonth), cycleMonth) - 1) + _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue * rateMonth).toFixed(2)
                    } else {
                        _this.financeDetailInfo.financialOrderDetailInfo.payForMonth = (valueOfLoan / cycleMonth + (valueOfLoan * rateMonth * 12 / cycleMonth)).toFixed(2)
                    }
                }
                return true
            },
            clearFinanceProInfo: function() {
                let _this = this
                if (_this.hasFinanceDetail) {
                    _this.$data.financeDetailInfo.financialOrderDetailInfo = {
                        orderNo: _this.order.orderNo,
                        financialOrderNo: _this.financeProDetailInfo.financialOrderNo,
                        financialOrderDetailCode: _this.financeProDetailInfo.financialOrderDetailInfo.financialOrderDetailCode,
                        // financeCode: _this.financeProDetailInfo.financialOrderDetailInfo.financeCode,
                        financeTypeCode: '',
                        financeTypeName: '',
                        loanTypeCode: '',
                        loanTypeName: '',
                        financeOrgCode: '',
                        financeOrgName: '',
                        downpaymentType: 0,
                        downPaymentAmount: '', // 首付金额
                        downpaymentMin: 0,
                        downpaymentMax: 0,
                        evIsPercent: 0,
                        balancePaymentValue: '', // 尾款金额
                        balancePaymentMinValue: 0,
                        balancePaymentMaxValue: 0,
                        valueOfLoan: '', // 贷款金额
                        taxRate: '', // 利率
                        cycleMonth: '', // 期数
                        payForMonth: '', // 月供
                        repaymentMethod: '',
                        cautionMoney: '', // 保证金
                        finalMileage: 0,
                        endingValueType: 0,
                        finalValue: 0,
                        storeInPercent: 0,
                        storeSubsidyInterest: 0,
                        financeInPercent: 0,
                        financeSubsidyInterest: 0,
                        remark: '',
                        // isDeleted: '1'
                    }
                    // _this.$data.financeDetailInfo.isDeleted = '1';
                }
                // this.editFinancePro();
            },
            searchFinanceProList: function() {
                let _this = this
                if (!_this.isHomePage && _this.$data.verifyStatus == 0) {
                    _this.$router.push({
                        path: '/financeList/search'
                    })
                }
            },
            selectFinanceTypes: function() {
                let _this = this
                _this.showFinanceTypes = true
            },
            selectAuthorizationOrgs: function() {
                let _this = this
                _this.showAuthorizationOrgs = true
            },
            selectRepaymentMethods: function() {
                let _this = this
                // _this.showRepaymentMethods = true
            },
            selectFinanceFailReasonTypes: function() {
                let _this = this
                _this.showFinanceFailReasonTypes = true
            },
            choseFinanceTypeItem: function(index) {
                let _this = this
                let financeTypeItem = _this.financeTypes[index]
                _this.showFinanceTypes = false
                _this.financeDetailInfo.financialOrderDetailInfo.financeTypeCode = financeTypeItem.value
                _this.financeDetailInfo.financialOrderDetailInfo.financeTypeName = financeTypeItem.name
            },
            choseAuthorizationOrgItem: function(index) {
                let _this = this
                let authorizationOrgItem = _this.authorizationOrgs[index]
                _this.showAuthorizationOrgs = false
                _this.financeDetailInfo.financialOrderDetailInfo.financeOrgCode = authorizationOrgItem.value
                _this.financeDetailInfo.financialOrderDetailInfo.financeOrgName = authorizationOrgItem.name
            },
            choseRepaymentMethodItem: function(index) {
                let _this = this
                let repaymentMethodItem = _this.repaymentMethods[index]
                _this.financeDetailInfo.financialOrderDetailInfo.repaymentMethodName = repaymentMethodItem.name
                _this.financeDetailInfo.financialOrderDetailInfo.repaymentMethod = repaymentMethodItem.value
                _this.showRepaymentMethods = false
            },
            choseFinanceFailReasonTypeItem: function(index) {
                let _this = this
                let financeFailReasonTypeItem = _this.financeFailReasonTypes[index]
                _this.$data.financeDetailInfo.defeatStatus = 1
                _this.$data.financeDetailInfo.scDefeatReason = financeFailReasonTypeItem.value
                _this.defeatFinancePro()
            },
            cancelFinanceTypes: function() {
                let _this = this
                _this.showFinanceTypes = false
            },
            cancelAuthorizationOrgs: function() {
                let _this = this
                _this.showAuthorizationOrgs = false
            },
            cancelRepaymentMethods: function() {
                let _this = this
                _this.showRepaymentMethods = false
            },
            cancelFinanceFailReasonTypes: function() {
                let _this = this
                _this.showFinanceFailReasonTypes = false
            },
            choseDownPaymentAmount: function() {
                let _this = this
                let downpaymentMin = _this.$data.financeDetailInfo.financialOrderDetailInfo.downpaymentMin
                let downpaymentMax = _this.$data.financeDetailInfo.financialOrderDetailInfo.downpaymentMax
                if (downpaymentMin != downpaymentMax) {
                    _this.$refs.downPaymentAmountModal.open()
                }
            },
            choseBalancePaymentValue: function() {
                let _this = this
                let balancePaymentMinValue = _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentMinValue
                let balancePaymentMaxValue = _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentMaxValue
                if (balancePaymentMinValue != balancePaymentMaxValue) {
                    _this.$refs.balancePaymentValueModal.open()
                }
            },
            checkDownPaymentAmountInput: function() {
                let _this = this
                let showDownPaymentAmount = false
                let val = parseFloat(_this.$data.downPaymentAmount)
                let downpaymentMin = _this.$data.financeDetailInfo.financialOrderDetailInfo.downpaymentMin
                let downpaymentMax = _this.$data.financeDetailInfo.financialOrderDetailInfo.downpaymentMax
                if (val < downpaymentMin) {
                    showDownPaymentAmount = true
                    Toast('保存失败, 首付金额超出下限')
                } else if (val > downpaymentMax) {
                    showDownPaymentAmount = true
                    Toast('保存失败, 首付金额超出上限')
                } else {
                    showDownPaymentAmount = false
                }
                return showDownPaymentAmount
            },
            checkDownPaymentAmountActualInput: function() {
                let _this = this
                let showDownPaymentAmount = false
                let val = parseFloat(_this.$data.downPaymentAmountActual)
                let downpaymentMin = parseFloat(_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * _this.$data.financeDetailInfo.financialOrderDetailInfo.downpaymentMin/100).toFixed(2)
                let downpaymentMax = parseFloat(_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * _this.$data.financeDetailInfo.financialOrderDetailInfo.downpaymentMax/100).toFixed(2)
                if (val < downpaymentMin) {
                    showDownPaymentAmount = true
                    Toast('保存失败, 首付金额超出下限')
                } else if (val > downpaymentMax) {
                    showDownPaymentAmount = true
                    Toast('保存失败, 首付金额超出上限')
                } else {
                    showDownPaymentAmount = false
                }
                return showDownPaymentAmount
            },
            clearDownPaymentAmountActual: function() {
                let _this = this
                _this.$data.downPaymentAmountActual = null
            },
            clearDownPaymentAmount: function() {
                let _this = this
                _this.$data.downPaymentAmount = null
            },
            submitDownPaymentAmount: function() {
                let _this = this
                let downpaymentType = _this.$data.financeDetailInfo.financialOrderDetailInfo.downpaymentType
                if (downpaymentType == 0 && (_this.$data.downPaymentAmount == null || _this.$data.downPaymentAmount == 0)) {
                    Toast('请填写首付金额或比例')
                    return
                }
                if (downpaymentType == 1 && !_this.$data.downPaymentAmountActual && (_this.$data.downPaymentAmount == null || _this.$data.downPaymentAmount == 0)) {
                    Toast('请填写首付金额或比例')
                    return
                }
                if (_this.$data.downPaymentAmountActual && _this.checkDownPaymentAmountActualInput()) {
                   return
                } else if (!_this.$data.downPaymentAmountActual && _this.checkDownPaymentAmountInput()) {
                   return
                }
                if (downpaymentType == 1 && _this.$data.downPaymentAmountActual) {
                    _this.$data.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount = _this.$data.downPaymentAmountActual
                } else {
                    _this.$data.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount = (downpaymentType == 0 ? _this.$data.downPaymentAmount : (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * _this.$data.downPaymentAmount / 100).toFixed(2))
                }
                _this.checkDownPayment()
                _this.$refs.downPaymentAmountModal.close()
            },
            checkBalancePaymentValueInput: function() {
                let _this = this
                let showBalancePaymentValue = false
                let val = parseFloat(_this.$data.balancePaymentValue)
                let balancePaymentMinValue = _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentMinValue
                let balancePaymentMaxValue = _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentMaxValue
                if (val < balancePaymentMinValue) {
                    showBalancePaymentValue = true
                    Toast('保存失败, 尾款金额超出下限')
                } else if (val > balancePaymentMaxValue) {
                    showBalancePaymentValue = true
                    Toast('保存失败, 尾款金额超出上限')
                } else {
                    showBalancePaymentValue = false
                }
                return showBalancePaymentValue
            },
            checkBalancePaymentActualValueInput: function() {
                let _this = this
                let showBalancePaymentValue = false
                let val = parseFloat(_this.$data.balancePaymentValueActual)
                let balancePaymentMinValue = parseFloat(_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentMinValue/100).toFixed(2)
                let balancePaymentMaxValue = parseFloat(_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentMaxValue/100).toFixed(2)
                if (val < balancePaymentMinValue) {
                    showBalancePaymentValue = true
                    Toast('保存失败, 尾款金额超出下限')
                } else if (val > balancePaymentMaxValue) {
                    showBalancePaymentValue = true
                    Toast('保存失败, 尾款金额超出上限')
                } else {
                    showBalancePaymentValue = false
                }
                return showBalancePaymentValue
            },
            clearBalancePaymentActualValue: function() {
                let _this = this
                _this.$data.balancePaymentValueActual = null
            },
            clearBalancePaymentValue: function() {
                let _this = this
                _this.$data.balancePaymentValue = null
            },
            submitBalancePaymentValue: function() {
                let _this = this
                let bpIsPercent = _this.$data.financeDetailInfo.financialOrderDetailInfo.bpIsPercent
                if (bpIsPercent == 0 && (_this.$data.balancePaymentValue == null || _this.$data.balancePaymentValue == 0)) {
                    Toast('请填写尾款金额或比例')
                    return
                }
                if (bpIsPercent == 1 && !_this.$data.balancePaymentValueActual && (_this.$data.balancePaymentValue == null || _this.$data.balancePaymentValue == 0)) {
                    Toast('请填写尾款金额或比例')
                    return
                }
                if (_this.$data.balancePaymentValueActual && _this.checkBalancePaymentActualValueInput()) {
                    return
                } else if (!_this.$data.balancePaymentValueActual && _this.checkBalancePaymentValueInput()) {
                    return
                }
                if (bpIsPercent == 1 && _this.$data.balancePaymentValueActual) {
                   _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue = _this.$data.balancePaymentValueActual
                } else {
                   _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue = (bpIsPercent == 0 ? _this.$data.balancePaymentValue : (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * _this.$data.balancePaymentValue / 100).toFixed(2))
                }
                _this.checkBalancePaymentValue()
                _this.$refs.balancePaymentValueModal.close()
            },
            choseCanPushToAssist: function() {
                let _this = this
                if (_this.$data.verifyStatus == 0) {
                    _this.$refs.financialSpec.open()
                }
            },
            // 取消
            closeCanPushToAssistModal: function() {
                let _this = this
                _this.$refs.financialSpec.close()
            },
            // 确认
            pushFinanceWbInfo: function() {
                let _this = this
                if (!_this.$data.disabled) {
                    _this.$data.disabled = true
                    _this.pushFinanceWorkbenchInfo({
                        financeWorkbenchInfo: _this.$data.financeDetailInfo,
                        callback: () => {
                            _this.$data.disabled = false
                            _this.$refs.financialSpec.close()
                            _this.goBack()
                        }
                    })
                }
            },
            filterIsPercent: function(isPercent, value) {
                if (isPercent == 1) {
                    return (value * 100).toFixed(2)
                } else {
                    return value
                }
            },
            goBack: function() {
                let _this = this
                _this.$router.replace({
                    path: '/order/' + _this.order.orderNo
                })
            },
            ...mapActions('financePro', [
                'insertFinancialOrderInfo',
                'updateFinancialOrderInfo',
                'getFinancialOrderInfoByOrderNo',
                'getFinanceTypes',
                'getAuthorizationOrgs',
                'getRepaymentMethods',
                'getFinanceFailReasonTypes',
                'getFinanceProByPriorityLevel',
                'pushFinanceWorkbenchInfo',
                'getFinanceWorkbenchInfo'
            ]),
            ...mapActions('order', [
                'setCarActualSalesPrice',
                'getUserPermissionsInfo'
            ])
        },
        watch: {
            financeProDetailInfo: {
                handler(value) {
                    let _this = this
                    let financialOrderDetailInfo = value.financialOrderDetailInfo
                    _this.$data.financeDetailInfo.orderNo = _this.order.orderNo
                    _this.$data.financeDetailInfo.financialOrderNo = value.financialOrderNo
                    _this.$data.financeDetailInfo.financialOrderDetailInfo = {
                        orderNo: _this.order.orderNo,
                        financialOrderNo: value.financialOrderNo,
                        financeDetailCode: financialOrderDetailInfo.financeDetailCode,
                        financialOrderDetailCode: financialOrderDetailInfo.financialOrderDetailCode,
                        financeName: financialOrderDetailInfo.financeName,
                        financeCode: financialOrderDetailInfo.financeCode,
                        financeTypeCode: financialOrderDetailInfo.financeTypeCode,
                        financeTypeName: financialOrderDetailInfo.financeTypeName,
                        loanTypeCode: financialOrderDetailInfo.loanTypeCode,
                        loanTypeName: financialOrderDetailInfo.loanTypeName,
                        financeOrgCode: financialOrderDetailInfo.financeOrgCode,
                        financeOrgName: financialOrderDetailInfo.financeOrgName,
                        downpaymentType: financialOrderDetailInfo.downpaymentType,
                        downPaymentAmount: financialOrderDetailInfo.downPaymentAmount,
                        downpaymentMin: financialOrderDetailInfo.downpaymentMin ? financialOrderDetailInfo.downpaymentMin : 0,
                        downpaymentMax: financialOrderDetailInfo.downpaymentMax ? financialOrderDetailInfo.downpaymentMax : 0,
                        evIsPercent: financialOrderDetailInfo.evIsPercent,
                        balancePaymentValue: financialOrderDetailInfo.balancePaymentValue,
                        balancePaymentMinValue: financialOrderDetailInfo.balancePaymentMinValue ? financialOrderDetailInfo.balancePaymentMinValue : 0,
                        balancePaymentMaxValue: financialOrderDetailInfo.balancePaymentMaxValue ? financialOrderDetailInfo.balancePaymentMaxValue : 0,
                        valueOfLoan: financialOrderDetailInfo.valueOfLoan,
                        rateType: financialOrderDetailInfo.rateType,
                        taxRate: financialOrderDetailInfo.taxRate,
                        cycleMonth: financialOrderDetailInfo.cycleMonth,
                        payForMonth: financialOrderDetailInfo.payForMonth,
                        repaymentMethod: config.order.financePro.repaymentMethod.equalAmountOfInterest,
                        repaymentMethodName: '等额本息',
                        cautionMoney: financialOrderDetailInfo.cautionMoney,
                        finalMileage: financialOrderDetailInfo.finalMileage,
                        endingValueType: financialOrderDetailInfo.endingValueType,
                        finalValue: financialOrderDetailInfo.finalValue,
                        storeSubsidyInterest: financialOrderDetailInfo.storeSubsidyInterest,
                        financeSubsidyInterest: financialOrderDetailInfo.financeSubsidyInterest,
                        remark: financialOrderDetailInfo.remark
                    }
                    if (_this.$data.financeDetailInfo.financialOrderDetailInfo.financialOrderNo != '' && _this.$data.financeDetailInfo.financialOrderDetailInfo.financialOrderNo != undefined) {
                        _this.getFinanceWorkbenchInfo({
                            orderNo: _this.order.orderNo,
                            isActive: 1
                        })
                        _this.getPaymentVerification()
                    }
                    if (_this.$data.financeTypes.length > 0 && _this.$data.financeDetailInfo.financialOrderDetailInfo.loanTypeCode != '') {
                        _this.$data.financeTypes.forEach((item) => {
                             let index = item.children.findIndex((val) => {
                                 return  (val.value == _this.$data.financeDetailInfo.financialOrderDetailInfo.loanTypeCode)
                             })
                             if (index != -1) {
                                 _this.$data.financeDetailInfo.financialOrderDetailInfo.loanTypeName = item.children[index].text
                             }
                        })
                    }
                },
                deep: true
            },
            actualSalePrice: {
                handler(value) {
                    let _this = this
                    _this.setCarActualSalesPrice({
                        actualSalePrice: _this.$data.actualSalePrice
                    })
                }
            },
            financeTypes: {
                handler(arr) {
                    let _this = this
                    if (arr.length > 0 && _this.$data.financeDetailInfo.financialOrderDetailInfo.loanTypeCode != '') {
                        arr.forEach((item) => {
                             let index = item.children.findIndex((val) => {
                                 return  (val.value == _this.$data.financeDetailInfo.financialOrderDetailInfo.loanTypeCode)
                             })
                             if (index != -1) {
                                 _this.$data.financeDetailInfo.financialOrderDetailInfo.loanTypeName = item.children[index].text
                             }
                        })
                    }
                },
                deep: true
            }
        },
        components: {
            pageHeader,
            cellBox,
            cell,
            modal,
            remark,
            Button
        }
    }
</script>

<style lang="scss" scoped>
    .margin-left-30 {
        margin-left: rem(30);
    }
    .margin-top-21 {
        margin-top: rem(21);
    }
    .car-price-title {
        font-family: PingFangSC-Medium;
        font-size: rem(28);
        color: rgb(51, 51, 51)
    }
    .car-price-value {
        font-family: PingFangSC-Semibold;
        font-size: rem(30);
        color: rgb(0, 140, 238);
    }
    .finance-status {
        padding: rem(8) rem(12);
        border-radius: rem(6);
        font-family: PingFangSC-Semibold;
        font-size: rem(24);
        text-align: center;
        background: rgb(189, 199, 209);
        color: #fff;
        margin-right: rem(30);
    }
    .save {
        position: fixed;
        bottom: 0px;
        width: 100%;
        max-width: 750px;
        height: rem(90);
        display: flex;
        background-color: #fff;
        box-shadow: 0px 0px rem(4) #bbb;
    }
    .right {
        flex: 1;
        text-align: center;
        line-height: rem(90);
        font-size: rem(28);
        color: #fff;
        background-image: linear-gradient(90deg, #008cee 0%, #36acfe 100%)
    }
    .right-disabled {
        flex: 1;
        text-align: center;
        line-height: rem(90);
        font-size: rem(28);
        color: #fff;
        background-color: rgb(155, 155, 155);
    }
    .left {
        flex: 1;
        display: flex;
    }
    .left .hot {
        flex: 1;
        text-align: center;
        border-right: rem(1) solid #e9e9e9
    }
    .left .hot span {
        color: rgb(129, 129, 129);
        text-align: center;
    }
    .left .hot span:first-child {
        color: rgb(129, 129, 129);
        font-size: rem(35)
    }
    .left .attache {
        flex: 1;
        max-width: 50%;
        text-align: center;
    }
    .left .attache span {
        color: rgb(129, 129, 129);
        text-align: center
    }
    .left .attache span:first-child {
        color: rgb(129, 129, 129);
        font-size: rem(35)
    }
    .center {
        flex: 1
    }
    .center .defeat {
        width: rem(120);
        border: rem(2) solid rgb(126, 131, 135);
        border-radius: rem(4);
        color: rgb(126, 131, 135);
        font-size: rem(24);
        text-align: center;
        padding-top: rem(14);
        padding-bottom: rem(15);
        line-height: rem(25);
        margin-top: rem(18);
        margin-bottom: rem(18);
        margin-right: rem(20);
        float: right;
    }
    input {
        color: rgb(126, 131, 135) !important;
    }
    .iconfont {
        color: rgb(203, 203, 203) !important;
    }
    .listmodel {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .4)
    }
    .listmodel>.modelContainer {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: rem(500);
        background-color: #e7e7e7;
    }
    .listmodel>.modelContainer .title {
        height: rem(80);
        line-height: rem(80);
        background-color: rgb(54, 172, 254);
        color: #fff;
        text-align: center;
    }
    .listmodel>.modelContainer>.title>.center {
        margin: 0 auto;
    }
    .listmodel>.modelContainer ul {
        height: rem(420);
        overflow-y: auto;
    }
    .listmodel>.modelContainer ul li {
        height: rem(70);
        line-height: rem(70);
        text-align: center;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
    }
    .payment-content {
        max-height: remp(600);
        padding-top: 30%;
        padding-left: rem(60);
        padding-right: rem(60);
        overflow: scroll;
        text-align: center;
        display: flex;
        flex-direction: column;
        color: rgb(51, 51, 51);
        text-align: left;
        font-family: PingFangSC-Medium;
        font-size: rem(30);
        color: rgb(51, 51, 51);
        vertical-align: middle;
    }
    .payment-content>.w>.word {
        vertical-align: middle;
    }
    .payment-content>.w>.w50>.downPayment-content {
        margin-left: rem(20);
    }
    .payment-content>.downPayment {
        margin-bottom: rem(50);
    }
    .payment-content>.input {
        margin-bottom: rem(30);
    }
    .payment-content>.w>input {
        font-size: remp(14);
        color: #6F7472;
        border: 1px #555 solid;
        width: 100%;
        height: rem(60);
        text-align: left;
    }
    .payment-content>.w>input::-webkit-input-placeholder {
        color: #6F7472;
        text-align: left;
    }
    .finance-content {
        padding-top: 30%;
        padding-left: rem(60);
        padding-right: rem(60);
        overflow: scroll;
        vertical-align: middle;
        text-align: center;
        display: flex;
        flex-direction: column;
        color: rgb(51, 51, 51);
        text-align: left;
        font-family: PingFangSC-Medium;
        font-size: rem(40);
        color: rgb(51, 51, 51);
    }
    .btn {
        width: 49%;
    }
</style>
