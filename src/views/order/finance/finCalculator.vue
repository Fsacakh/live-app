<template>
    <div v-if="!active" class="containter">
        <page-header @on-click-right="clearFinanceProInfo">
            <div slot>金融</div>
            <div slot="right">清空</div>
        </page-header>
        <div class="finance-calc">
            <cell title="车型车款">
                <input type="text" v-model="car.displayName" @click="searchCar" placeholder="请选择" />
                <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
            </cell>
            <cell-box>
                <span class="margin-left-30 car-price-title">当前汽车销售价:</span>
                <span class="car-price-value" v-if="isHomePage">¥
                    <input type="number" v-model="actualSalesPrice" @change="checkActualSalesPrice"/>
                </span>
            </cell-box>
            <cell title="产品类型" class="margin-top-21">
                <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.financeTypeName" readonly @click="selectFinanceTypes">
                <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
            </cell>
            <cell title="金融机构">
                <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.financeOrgName" readonly @click="selectAuthorizationOrgs">
                <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
            </cell>
            <cell :pageType="'label'" title="首付金额">
                <input type="number" v-model="financeDetailInfo.financialOrderDetailInfo.downPaymentAmount" @change="checkDownPayment" @click="choseDownPaymentAmount" :readonly="hasFinanceDetail">
            </cell>
            <cell :pageType="'label'" title="尾款金额">
                <input type="number" v-model="financeDetailInfo.financialOrderDetailInfo.balancePaymentValue" @change="checkBalancePaymentValue" @click="choseBalancePaymentValue" :readonly="hasFinanceDetail">
            </cell>
            <cell :pageType="'label'" title="贷款金额">
                <input type="number" v-model="financeDetailInfo.financialOrderDetailInfo.valueOfLoan" :readonly="hasFinanceDetail">
            </cell>
            <cell :pageType="'label'" :title="(isInterest ? '实际利率': '实际费率')">
                <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.taxRate" @change="checkTaxRate" :readonly="hasFinanceDetail">
            </cell>
            <cell :pageType="'label'" title="期数">
                <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.cycleMonth" @change="checkCycleMonth" :readonly="hasFinanceDetail">
            </cell>
            <cell title="月供">
                <input type="number" v-model="financeDetailInfo.financialOrderDetailInfo.payForMonth" :readonly="hasFinanceDetail">
            </cell>
            <cell title="还款方式">
                <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.repaymentMethodName" @click="selectRepaymentMethods" :readonly="hasFinanceDetail">
                <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
            </cell>
            <cell :pageType="'label'" title="保证金">
                <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.cautionMoney" :readonly="hasFinanceDetail">
            </cell>
            <cell :pageType="'label'" title="机构贴息" v-show="isSubsidyInterest">
                <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.financeSubsidyInterest" :readonly="hasFinanceDetail">
            </cell>
            <cell :pageType="'label'" title="本店贴息" v-show="isSubsidyInterest">
                <input type="text" v-model="financeDetailInfo.financialOrderDetailInfo.storeSubsidyInterest" :readonly="hasFinanceDetail">
            </cell>
            <cell :pageType="'label'" title="期末里程数" v-show="isLease">
                <input type="number" v-model="financeDetailInfo.financialOrderDetailInfo.finalMileage" :readonly="hasFinanceDetail">
            </cell>
            <cell :pageType="'label'" title="期末保值数" v-show="isLease">
                <input type="number" v-model="financeDetailInfo.financialOrderDetailInfo.finalValue" :readonly="hasFinanceDetail">
            </cell>
            <remark style="height:1.3rem;" title="备注" class="m-t-10 m-b-20" v-model="financeDetailInfo.financialOrderDetailInfo.remark"></remark>
        </div>
        <div class="save">
            <div class="left">
                <div class="hot" @click="searchFinanceProList">
                    <span><i class="icon iconfont icon-rexiaofangan"></i></span>
                    <br />
                    <span>方案</span>
                </div>
                <div class="attache">
                </div>
            </div>
            <div class="center">
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
        <modal ref="downPaymentAmountModal" @submit="submitDownPaymentAmount" :title="'首付金额'" :submitText="'提交'" :confirmDisplay="true">
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
                    <input type="number" @change="checkDownPaymentAmountInput"  @focus="clearDownPaymentAmountActual" v-model="downPaymentAmount" :placeholder="(financeDetailInfo.financialOrderDetailInfo.downpaymentType == 0 ? '请填写实际金额': '请填写实际比例')" autofocus="autofocus" />
                    <span class="m-l-10 word" v-show="financeDetailInfo.financialOrderDetailInfo.downpaymentType == 1">%</span>
                </div>
                <div class="w flex input" v-if="financeDetailInfo.financialOrderDetailInfo.downpaymentType == 1">
                    <input type="number" @change="checkDownPaymentAmountActualInput" @focus="clearDownPaymentAmount" v-model="downPaymentAmountActual" placeholder="请填写实际金额" autofocus="autofocus" />
                </div>
            </div>
        </modal>
        <modal ref="balancePaymentValueModal" @submit="submitBalancePaymentValue" :title="'尾款金额'" :submitText="'提交'" :confirmDisplay="true">
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
                    <input type="number" @change="checkBalancePaymentValueInput" @focus="clearBalancePaymentActualValue" v-model="balancePaymentValue" :placeholder="(financeDetailInfo.financialOrderDetailInfo.bpIsPercent == 0 ? '请填写实际金额': '请填写实际比例')" autofocus="autofocus" />
                    <span class="m-l-10 word" v-show="financeDetailInfo.financialOrderDetailInfo.bpIsPercent == 1">%</span>
                </div>
                <div class="w flex input" v-if="financeDetailInfo.financialOrderDetailInfo.bpIsPercent == 1">
                    <input type="number" @change="checkBalancePaymentActualValueInput" @focus="clearBalancePaymentValue" v-model="balancePaymentValueActual" placeholder="请填写实际金额" autofocus="autofocus" />
                </div>
            </div>
        </modal>
    </div>
    <div v-else>
        <likevehicle @revert="revert" ensuredispaly="cartype" title="查找车型" @confirm="confirm"></likevehicle>
    </div>
</template>

<script>
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '../../../common/config'
    import common from '../../../common/common'
    import pageHeader from '@/components/header/PageHeader'
    import cellBox from '@/components/cell-box'
    import cell from '@/components/cell-row'
    import modal from '@/components/modal'
    import likevehicle from '@/components/likevehicle/likevehicle'
    import remark from '@/components/input-remark'
    export default {
        mounted() {
            let _this = this
            let actualSalesPrice = _this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice
            _this.actualSalesPrice = actualSalesPrice ? actualSalesPrice : null
            _this.updateFinanceInfo()
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
                }
            })
            _this.updateCarInfo()
            common.fixedHeader()
        },
        data: function() {
            return {
                active: false,
                car: {
                    actualSalesPrice: null,
                    additionalFee: null,
                    discount: null,
                    afterDiscountPrice: null,
                    carFactoryCode: '',
                    carBrandCode: '',
                    carSeriesCode: '',
                    carModelCode: '',
                    carCode: '',
                    carDisplayName: '',
                    displayName: '',
                    skuCode: '',
                    pageNums: config.pageNums,
                    pageStart: 1
                },
                financeDetailInfo: {
                    orderNo: '',
                    financialOrderDetailInfo: {
                        orderNo: '',
                        financeCode: '',
                        financeTypeCode: '',
                        financeTypeName: '',
                        financeOrgCode: '',
                        financeOrgName: '',
                        downpaymentType: 0,
                        downPaymentAmount: null,
                        downpaymentMin: 0,
                        downpaymentMax: 0,
                        evIsPercent: 0,
                        balancePaymentValue: null,
                        balancePaymentMinValue: 0,
                        balancePaymentMaxValue: 0,
                        valueOfLoan: null,
                        taxRate: null,
                        cycleMonth: null,
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
                financeTypes: [],
                authorizationOrgs: [],
                repaymentMethods: [],
                actualSalesPrice: null,
                showFinanceTypes: false,
                showAuthorizationOrgs: false,
                showRepaymentMethods: false,
                downPaymentAmount: null,
                downPaymentAmountActual: null,
                balancePaymentValue: null,
                balancePaymentValueActual: null
            }
        },
        computed: {
            ...mapState('financePro', [
                'financeDetailCode',
                'financeProDetailInfo',
                'financeProDetailInfoList'
            ]),
            ...mapState('carInfo', [
                'carInfo',
                'msrp'
            ]),
            ...mapState('order', [
                'order'
            ]),
            isLease: function() {
                let _this = this
                return (_this.$data.financeDetailInfo.financialOrderDetailInfo.financeTypeCode == config.order.financePro.financeType.leaseFatherCode)
            },
            isHomePage: function() {
                let _this = this
                return _this.$route.params.id == 'homepage'
            },
            isSubsidyInterest: function() {
                let _this = this
                return (_this.$data.financeDetailInfo.financialOrderDetailInfo.financeTypeCode == config.order.financePro.financeType.interestFatherCode)
            },
            hasFinanceDetail: function() {
                let _this = this
                return _this.$data.financeDetailInfo.financialOrderDetailInfo.financeCode != ''
            },
            isInterest: function() {
                let _this = this
                let result = false
                if (_this.financeDetailInfo.financialOrderDetailInfo.rateType === config.order.financePro.rateType.interest) {
                    result = true
                } else {
                    result = false
                }
                return result
            }
        },
        methods: {
            searchCar: function() {
                let _this = this
                _this.$data.active = true
            },
            updateCarInfo: function() {
                let _this = this
                let val = _this.carInfo
                _this.car = {
                    orderNo: _this.order.orderNo,
                    carFactoryCode: val.carFactoryCode,
                    carFactoryName: val.carFactoryName,
                    carBrandCode: val.carBrandCode,
                    carBrandName: val.carBrandName,
                    carSeriesCode: val.carSeriesCode,
                    carSeriesName: val.carSeriesName,
                    carModelCode: val.carModelCode,
                    carModelName: val.carModelName,
                    carCode: val.carCode,
                    carDisplayName: val.carDisplayName,
                    displayName: val.displayName,
                    remark: val.remark,
                    channelType: config.channelType,
                    skuCode: val.skuCode ? val.skuCode : null,
                    carOrderNo: val.carOrderNo,
                    carOrderDetailCode: val.carOrderDetailCode,
                    additionalFee: val.additionalFee ? val.additionalFee : null,
                    originalSalesPrice: val.originalSalesPrice,
                    actualSalesPrice: _this.$data.actualSalesPrice ? _this.$data.actualSalesPrice : null,
                    discount: val.discount ? val.discount : null,
                    afterDiscountPrice: val.afterDiscountPrice ? val.afterDiscountPrice : null,
                    productionCode: val.productionCode,
                    carVinNo: val.carVinNo,
                    carAppertanceName: val.carAppertanceName,
                    carInteriorName: val.carInteriorName,
                    actualMSRPInclusiveTax: val.actualMSRPInclusiveTax,
                    originalAddition: val.originalAddition,
                    orderAddInfos: val.orderAddInfos
                }
                _this.$data.car.afterDiscountPrice = (parseFloat(_this.$data.car.actualSalesPrice) - parseFloat(_this.$data.car.additionalFee)).toFixed(2)
                _this.$data.car.discount = parseFloat(_this.$data.car.actualMSRPInclusiveTax) - parseFloat(_this.$data.car.afterDiscountPrice)
                _this.$data.car.displayName = _this.car.displayName ? _this.car.displayName : (`${_this.car.carFactoryName || ''} ${_this.car.carBrandName || ''} ${_this.car.carSeriesName || ''} ${_this.car.carModelName || ''}`)
                let order = {
                    orderInfo: {},
                    carOrderInfoVoList: [{
                        carOrderDetailInfoList: [
                            JSON.parse(JSON.stringify(_this.$data.car))
                        ]
                    }]
                }
                _this.setCarOrderInfo(order)
            },
            updateFinanceInfo: function() {
                let _this = this
                let financeDetailCode = _this.financeDetailCode
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
                            downPaymentAmount: financialOrderDetailInfo.downpaymentType == 0 ? financialOrderDetailInfo.downpaymentMin : (_this.$data.actualSalesPrice * financialOrderDetailInfo.downpaymentMin).toFixed(2),
                            downpaymentMin: _this.filterIsPercent(financialOrderDetailInfo.downpaymentType, financialOrderDetailInfo.downpaymentMin),
                            downpaymentMax: _this.filterIsPercent(financialOrderDetailInfo.downpaymentType, financialOrderDetailInfo.downpaymentMax),
                            bpIsPercent: financialOrderDetailInfo.bpIsPercent,
                            balancePaymentValue: financialOrderDetailInfo.bpIsPercent == 0 ? financialOrderDetailInfo.balancePaymentMinValue : (_this.$data.actualSalesPrice * financialOrderDetailInfo.balancePaymentMinValue).toFixed(2),
                            balancePaymentMinValue: _this.filterIsPercent(financialOrderDetailInfo.bpIsPercent, financialOrderDetailInfo.balancePaymentMinValue),
                            balancePaymentMaxValue: _this.filterIsPercent(financialOrderDetailInfo.bpIsPercent, financialOrderDetailInfo.balancePaymentMaxValue),
                            valueOfLoan: 0,
                            rateType: financialOrderDetailInfo.rateType,
                            taxRate: parseFloat(financialOrderDetailInfo.rates * 100).toFixed(2),
                            cycleMonth: financialOrderDetailInfo.cycleMonth,
                            payForMonth: 0,
                            repaymentMethod: '',
                            cautionMoney: financialOrderDetailInfo.dfInPercent == 0 ? financialOrderDetailInfo.depositFree : (_this.$data.actualSalesPrice * financialOrderDetailInfo.depositFree).toFixed(2),
                            finalMileage: financialOrderDetailInfo.finalMileage,
                            evIsPercent: financialOrderDetailInfo.evIsPercent,
                            finalValue: financialOrderDetailInfo.evIsPercent == 0 ? financialOrderDetailInfo.endingValue : (_this.$data.actualSalesPrice * financialOrderDetailInfo.endingValue).toFixed(2),
                            remark: ''
                        }
                        if (financialOrderDetailInfo.tDetailIntersubsidyInfoList != null && financialOrderDetailInfo.tDetailIntersubsidyInfoList.length > 0) {
                            _this.$data.financeDetailInfo.financialOrderDetailInfo.storeInPercent = financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].dealerInPercent
                            _this.$data.financeDetailInfo.financialOrderDetailInfo.storeSubsidyInterest = (financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].dealerInPercent == 0 ? financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].dealerIntersubsidyValue : (_this.$data.actualSalesPrice * financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].dealerIntersubsidyValue).toFixed(2))
                            _this.$data.financeDetailInfo.financialOrderDetailInfo.financeInPercent = financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].isPercent
                            _this.$data.financeDetailInfo.financialOrderDetailInfo.financeSubsidyInterest = (financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].isPercent == 0 ? financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].intersubsidyValue : (_this.$data.actualSalesPrice * financialOrderDetailInfo.tDetailIntersubsidyInfoList[0].intersubsidyValue).toFixed(2))
                        }
                        _this.financeDetailInfo.financialOrderDetailInfo.valueOfLoan = (_this.$data.actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount).toFixed(2)
                        if (_this.financeDetailInfo.financialOrderDetailInfo.taxRate >= 0 && _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth > 1) {
                            let rateMonth = parseFloat(_this.financeDetailInfo.financialOrderDetailInfo.taxRate / 100) / 12
                            let cycleMonth = _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth
                            let rateType = _this.financeDetailInfo.financialOrderDetailInfo.rateType
                            let valueOfLoan = (_this.$data.actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount - _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue).toFixed(2)
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
                                    return (val.value == _this.$data.financeDetailInfo.financialOrderDetailInfo.loanTypeCode)
                                })
                                if (index != -1) {
                                    _this.$data.financeDetailInfo.financialOrderDetailInfo.loanTypeName = item.children[index].text
                                }
                            })
                        }
                    }
                }
            },
            checkActualSalesPrice: function() {
                let _this = this
                _this.financeDetailInfo.financialOrderDetailInfo.valueOfLoan = _this.actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount
                _this.updateFinanceInfo()
                _this.updateCarInfo()
                return true
            },
            checkDownPayment: function() {
                let _this = this
                _this.financeDetailInfo.financialOrderDetailInfo.valueOfLoan = _this.actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount
                if (_this.financeDetailInfo.financialOrderDetailInfo.taxRate > 0 && _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth >= 1) {
                    let rateMonth = parseFloat(_this.financeDetailInfo.financialOrderDetailInfo.taxRate / 100) / 12
                    let cycleMonth = _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth
                    let rateType = _this.financeDetailInfo.financialOrderDetailInfo.rateType
                    let valueOfLoan = _this.actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount - _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue
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
                _this.financeDetailInfo.financialOrderDetailInfo.valueOfLoan = _this.actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount
                if (_this.financeDetailInfo.financialOrderDetailInfo.taxRate > 0 && _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth >= 1) {
                    let rateMonth = parseFloat(_this.financeDetailInfo.financialOrderDetailInfo.taxRate / 100) / 12
                    let cycleMonth = _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth
                    let rateType = _this.financeDetailInfo.financialOrderDetailInfo.rateType
                    let valueOfLoan = _this.actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount - _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue
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
                _this.financeDetailInfo.financialOrderDetailInfo.valueOfLoan = _this.actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount
                if (_this.financeDetailInfo.financialOrderDetailInfo.taxRate > 0 && _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth >= 1) {
                    let rateMonth = parseFloat(_this.financeDetailInfo.financialOrderDetailInfo.taxRate / 100) / 12
                    let cycleMonth = _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth
                    let rateType = _this.financeDetailInfo.financialOrderDetailInfo.rateType
                    let valueOfLoan = _this.actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount - _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue
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
                _this.financeDetailInfo.financialOrderDetailInfo.valueOfLoan = _this.actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount
                if (_this.financeDetailInfo.financialOrderDetailInfo.taxRate > 0 && _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth >= 1) {
                    let rateMonth = parseFloat(_this.financeDetailInfo.financialOrderDetailInfo.taxRate / 100) / 12
                    let cycleMonth = _this.financeDetailInfo.financialOrderDetailInfo.cycleMonth
                    let rateType = _this.financeDetailInfo.financialOrderDetailInfo.rateType
                    let valueOfLoan = _this.actualSalesPrice - _this.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount - _this.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue
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
                _this.$data.financeDetailInfo = {
                    orderNo: '',
                    financialOrderDetailInfo: {
                        orderNo: '',
                        financeCode: '',
                        financeTypeCode: '',
                        financeTypeName: '',
                        financeOrgCode: '',
                        financeOrgName: '',
                        downpaymentType: 0,
                        downPaymentAmount: null,
                        downpaymentMin: 0,
                        downpaymentMax: 0,
                        evIsPercent: 0,
                        balancePaymentValue: null,
                        balancePaymentMinValue: 0,
                        balancePaymentMaxValue: 0,
                        valueOfLoan: null,
                        taxRate: null,
                        cycleMonth: null,
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
                }
                _this.$data.actualSalesPrice = null
                _this.clearCarInfo()
                _this.clearFinancialOrderInfo()
            },
            searchFinanceProList: function() {
                let _this = this
                if (!_this.isHomePage) {
                    _this.$router.push('/financeList/search')
                }
            },
            selectFinanceTypes: function() {
                let _this = this
                if (!_this.hasFinanceDetail) {
                   _this.showFinanceTypes = true
                }
            },
            selectAuthorizationOrgs: function() {
                let _this = this
                if (!_this.hasFinanceDetail) {
                   _this.showAuthorizationOrgs = true
                }
            },
            selectRepaymentMethods: function() {
                let _this = this
                if (!_this.hasFinanceDetail) {
                   _this.showRepaymentMethods = true
                }
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
            goBack: function() {
                let _this = this
                _this.$router.push('/order/' + _this.order.orderNo)
            },
            revert: function() {
                let _this = this
                _this.$data.active = false
            },
            confirm: function(item) {
                let _this = this
                let factoryName = item.factorydata ? item.factorydata.factoryName : '',
                    brandName = item.carbranddata.brandName,
                    seriesName = item.cartraindata.seriesName,
                    modelName = item.cartypedata.modelName,
                    displayName = item.carstyledata.displayName
                _this.$data.car.carFactoryCode = item.factorydata ? item.factorydata.factoryCode : ''
                _this.$data.car.carBrandCode = item.carbranddata.brandCode
                _this.$data.car.carSeriesCode = item.cartraindata.seriesCode
                _this.$data.car.carModelCode = item.cartypedata.modelCode
                _this.$data.car.carCode = item.carstyledata.carCode
                _this.$data.car.displayName = `${factoryName || ''} ${brandName || ''} ${seriesName || ''} ${modelName || ''} ${displayName || ''}`
                _this.active = false
                _this.setCarInfo(_this.$data.car)
            },
            searchFinanceProList: function() {
                let _this = this
                _this.$router.push({
                    path: '/financeList/search'
                })
            },
            filterIsPercent: function(isPercent, value) {
                if (isPercent == 1) {
                    return (value * 100).toFixed(2)
                } else {
                    return value
                }
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
                let val = parseFloat(_this.$data.downPaymentAmount)
                let downpaymentMin = _this.$data.financeDetailInfo.financialOrderDetailInfo.downpaymentMin
                let downpaymentMax = _this.$data.financeDetailInfo.financialOrderDetailInfo.downpaymentMax
                if (val <= downpaymentMin) {
                    _this.$data.downPaymentAmount = downpaymentMin
                } else if (val >= downpaymentMax) {
                    _this.$data.downPaymentAmount = downpaymentMax
                }
            },
            checkDownPaymentAmountActualInput: function() {
                let _this = this
                let val = parseFloat(_this.$data.downPaymentAmountActual)
                let downpaymentMin = parseFloat(_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * _this.$data.financeDetailInfo.financialOrderDetailInfo.downpaymentMin/100).toFixed(2)
                let downpaymentMax = parseFloat(_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * _this.$data.financeDetailInfo.financialOrderDetailInfo.downpaymentMax/100).toFixed(2)
                if (val <= downpaymentMin) {
                    _this.$data.downPaymentAmountActual = downpaymentMin
                } else if (val >= downpaymentMax) {
                    _this.$data.downPaymentAmountActual = downpaymentMax
                }
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
                if (downpaymentType == 1 && _this.$data.downPaymentAmountActual) {
                    _this.$data.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount = _this.$data.downPaymentAmountActual
                } else {
                    _this.$data.financeDetailInfo.financialOrderDetailInfo.downPaymentAmount = (downpaymentType == 0 ? _this.$data.downPaymentAmount : (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * _this.$data.downPaymentAmount / 100).toFixed(2))
                }
                _this.checkDownPayment()
            },
            checkBalancePaymentValueInput: function() {
                let _this = this
                let val = parseFloat(_this.$data.balancePaymentValue)
                let balancePaymentMinValue = _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentMinValue
                let balancePaymentMaxValue = _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentMaxValue
                if (val < balancePaymentMinValue) {
                    _this.$data.balancePaymentValue = balancePaymentMinValue
                } else if (val > balancePaymentMaxValue) {
                    _this.$data.balancePaymentValue = balancePaymentMaxValue
                }
            },
            checkBalancePaymentActualValueInput: function() {
                let _this = this
                let val = parseFloat(_this.$data.balancePaymentValueActual)
                let balancePaymentMinValue = parseFloat(_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentMinValue/100).toFixed(2)
                let balancePaymentMaxValue = parseFloat(_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentMaxValue/100).toFixed(2)
                if (val < balancePaymentMinValue) {
                    _this.$data.balancePaymentValueActual = balancePaymentMinValue
                } else if (val > balancePaymentMaxValue) {
                    _this.$data.balancePaymentValueActual = balancePaymentMaxValue
                }
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
                if (bpIsPercent == 1 && _this.$data.balancePaymentValueActual) {
                   _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue = _this.$data.balancePaymentValueActual
                } else {
                   _this.$data.financeDetailInfo.financialOrderDetailInfo.balancePaymentValue = (bpIsPercent == 0 ? _this.$data.balancePaymentValue : (_this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice * _this.$data.balancePaymentValue / 100).toFixed(2))
                }
                _this.checkBalancePaymentValue()
            },
            ...mapActions('order', [
                'setCarOrderInfo'
            ]),
            ...mapActions('carInfo', [
                'setCarInfo',
                'clearCarInfo',
                'resetCarInfo'
            ]),
            ...mapActions('financePro', [
                'getFinanceTypes',
                'getAuthorizationOrgs',
                'getRepaymentMethods',
                'clearFinancialOrderInfo'
            ])
        },
        watch: {
            carInfo: {
                handler(value) {
                    let _this = this
                    _this.updateCarInfo()
                },
                deep: true
            },
        },
        components: {
            likevehicle,
            pageHeader,
            cellBox,
            modal,
            cell,
            remark
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
        width: 100%;
        >input {
            -webkit-text-fill-color: #333333;
            font-size: remp(14);
        }
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
        height: remp(50);
        padding-top: remp(5);
        padding-bottom: remp(5);
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
        margin-top: remp(5);
    }
    .left .hot {
        flex: 1;
        text-align: center;
        height: remp(40);
        border-right: 1px solid #D0D0D0;
    }
    .left .hot span {
        font-family: PingFangSC-Regular;
        font-size: remp(12);
        color: #818181;
        text-align: center;
    }
    .left .hot span:first-child {
        color: #818181;
        font-size: rem(35);
    }
    .left .attache {
        flex: 1;
        max-width: 50%;
        text-align: center;
    }
    .left .attache span {
        display: block;
        text-align: center
    }
    .left .attache span:first-child {
        font-size: rem(40)
    }
    .center {
        flex: 1
    }
    input {
        color: rgb(126, 131, 135) !important;
    }
    .iconfont {
        color: rgb(126, 131, 135) !important;
    }
    .listmodel {
        position: fixed;
        -webkit-transform: translateZ(0);
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
        line-height:rem(60);
        text-align: left;
    }
    .payment-content>.w>input::-webkit-input-placeholder {
        color: #6F7472;
        text-align: left;
    }
    .finance-calc {
        padding-left: remp(20);
        padding-right: remp(20);
        padding-top: remp(10);
        margin-bottom: remp(40);
        overflow: scroll;
        margin-top: remp(20);
    }
</style>
