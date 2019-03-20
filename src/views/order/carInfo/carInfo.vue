<template>
    <div v-if="!active">
        <page-header @on-click-back="goBack" @on-click-right="editCarOrder" :leftOptions="leftOptions">
            <div slot>车辆信息</div>
            <div slot="right" v-if="canEdit">保存</div>
        </page-header>
        <cell title="车型车款" :triangle="true">
            <input type="text" v-model="car.displayName" @click="searchCar" />
        </cell>
        <cell-box>
            <div class="flex margin-left-30">
                <div class="w50">
                    <span>外观</span>
                    <span class="m-l-20">
                        {{ car.carAppertanceName }}
                    </span>
                </div>
                <div class="w50">
                    <span>内饰</span>
                    <span class="m-l-20">
                        {{ car.carInteriorName }}
                    </span>
                </div>
            </div>
        </cell-box>
        <cell title="MSRP">
            <input type="number" v-model="car.actualMSRPInclusiveTax" readonly/>
        </cell>
        <cell title="现金折扣">
            <input type="number" v-model="car.discount" @change="checkDiscount" />
        </cell>
        <cell title="车辆折后价">
            <input type="number" v-model="car.afterDiscountPrice" @change="checkAfterDiscountPrice"/>
        </cell>
        <cell title="消费税及附加">
            <input type="number" v-model="car.additionalFee" @change="checkAdditionalFee" />
        </cell>
        <cell title="车辆销售价">
            <input type="number" v-model="car.actualSalesPrice" readonly/>
        </cell>
        <div class="submit">
            <mt-button size="large" type="primary" @click="searchCarStockInfo"><i class="iconfont icon-Search m-r-10"></i>查找车辆</mt-button>
            <div class="btn-clear" @click="reset" v-show="showDetail">
                <i class="iconfont icon-qingchu"></i> 删除该车辆
            </div>
        </div>
        <cell title="生产号" v-show="showDetail">
            <input type="text" :value="carInfo.productionCode" readonly/>
        </cell>
        <cell title="车架号" v-show="showDetail">
            <input type="text" :value="carInfo.carVinNo" readonly/>
        </cell>
        <cell title="加配配置" v-show="showDetail">
            <input type="text" :value="carInfo.originalAddition" readonly/>
        </cell>
        <cell title="物流状态" v-show="showDetail">
            <input class="tax" type="text" :value="getLogisticsStatus" readonly/>
        </cell>
        <remark title="备注" v-model="car.remark"></remark>
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
    import pageHeader from '@/components/header/PageHeader'
    import cell from '@/components/cell'
    import cellBox from '@/components/cell-box'
    import remark from '@/components/remark'
    import likevehicle from '@/components/likevehicle/likevehicle'
    import {
        Toast,
        Button
    } from 'mint-ui'
    export default {
        mounted() {
            let _this = this
            if (!_this.showDetail) {
                let orderNo = _this.$route.params.orderNo
                if (orderNo != '*') {
                    _this.getCarOrderInfoByOrderNo({
                        orderNo: _this.$route.params.orderNo,
                        order: _this.order
                    })
                } else {
                    if (!_this.isUpdate) {
                        _this.setCarOrderInfo()
                        _this.getMsrp({
                            carFactoryCode: _this.car.carFactoryCode,
                            carBrandCode: _this.car.carBrandCode,
                            carModelCode: _this.car.carModelCode,
                            carSeriesCode: _this.car.carSeriesCode,
                            carCode: _this.car.carCode,
                            skuCode: _this.car.skuCode
                        })
                        _this.setCarInfo(_this.$data.car)
                    }
                }
            } else {
                _this.updateCarInfo()
            }
            _this.getUserPermissionsInfo()
        },
        destroyed() {
            let _this = this
            _this.resetMsrp()
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
                leftOptions: {
                    showBack: true,
                    preventGoBack: true,
                    icon: ''
                }
            }
        },
        computed: {
            ...mapState('order', [
                'isSc',
                'order'
            ]),
            ...mapState('carInfo', [
                'carInfo',
                'msrp'
            ]),
            ...mapState('customer', [
                'cusLeadInfo',
                'modelInfo'
            ]),
            ...mapGetters('carInfo', [
                'getLogisticsStatus'
            ]),
            ...mapGetters('order', [
                'isOrderCanEdit'
            ]),
            canEdit: function() {
                let _this = this
                return (_this.isSc && _this.isOrderCanEdit)
            },
            showDetail: function() {
                let _this = this
                return (_this.carInfo.skuCode != undefined && _this.carInfo.skuCode != '' && _this.carInfo.skuCode != 0)
            },
            isUpdate: function() {
                let _this = this
                return (_this.carInfo.carOrderNo != undefined && _this.carInfo.carOrderNo != '')
            }
        },
        methods: {
            searchCar: function() {
                let _this = this
                _this.$data.active = true
            },
            searchCarStockInfo: function() {
                let _this = this
                _this.car.carVinNo = ''
                _this.setCarInfo(_this.$data.car)
                if (_this.isUpdate) {
                    _this.$router.push({
                        path: '/stockCarInfoList'
                    })
                } else {
                    _this.$router.push({
                        path: '/stockCarInfoList'
                    })
                }
            },
            revert: function() {
                let _this = this
                _this.$data.active = false
            },
            confirm: function(item) {
                let _this = this
                _this.reset()
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
                _this.getMsrp(_this.$data.car)
            },
            reset: function() {
                let _this = this
                _this.car = {
                    carFactoryCode: '',
                    carBrandCode: '',
                    carSeriesCode: '',
                    carModelCode: '',
                    carCode: '',
                    displayName: '',
                    orderNo: _this.order.orderNo,
                    carOrderNo: _this.carInfo.carOrderNo,
                    carOrderDetailCode: _this.carInfo.carOrderDetailCode,
                    skuCode: '',
                    pageNums: config.pageNums,
                    pageStart: 1
                }
                _this.setCarInfo(JSON.parse(JSON.stringify(_this.$data.car)))
                _this.resetMsrp()
            },
            setCarOrderInfo: function() {
                let _this = this
                let val = {}
                if (_this.order.carOrderDetailInfoList != null && _this.order.carOrderDetailInfoList.length > 0) {
                    val = _this.order.carOrderDetailInfoList[0]
                }
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
                    remark: null,
                    channelType: config.channelType,
                    skuCode: val.skuCode,
                    carOrderNo: val.carOrderNo,
                    carOrderDetailCode: val.carOrderDetailCode,
                    additionalFee: val.additionalFee ? val.additionalFee : null,
                    originalSalesPrice: val.originalSalesPrice,
                    actualSalesPrice: val.actualSalesPrice ? val.actualSalesPrice : null,
                    discount: null,
                    afterDiscountPrice: null,
                    productionCode: val.productionCode,
                    carVinNo: val.carVinNo,
                    carAppertanceName: val.carAppertanceName,
                    carInteriorName: val.carInteriorName,
                    actualMSRPInclusiveTax: _this.msrp,
                    originalAddition: val.originalAddition,
                    orderAddInfos: val.orderAddInfos
                }
                _this.$data.car.displayName = _this.car.displayName ? _this.car.displayName : (`${_this.car.carFactoryName || ''} ${_this.car.carBrandName || ''} ${_this.car.carSeriesName || ''} ${_this.car.carModelName || ''}`)
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
                    actualSalesPrice: val.actualSalesPrice ? val.actualSalesPrice : null,
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
            },
            editCarOrder: function() {
                let _this = this
                if (_this.$data.car.carBrandCode == '' || _this.$data.car.carSeriesCode == '' || _this.$data.car.carModelCode == '' || _this.$data.car.carCode == '') {
                    Toast('请选择车型车款')
                } else if (_this.$data.car.actualSalesPrice == null) {
                    Toast('请填写车辆销售价')
                } else {
                    if (_this.isUpdate) {
                        if (_this.$data.car.additionalFee == null) {
                            _this.$data.car.additionalFee = 0
                        }
                        _this.updateCarOrder()
                    } else {
                        _this.addCarOrder()
                    }
                }
            },
            addCarOrder: function() {
                let _this = this
                let order = {
                    orderInfo: _this.order.orderInfo,
                    carOrderDetailInfoList: [
                        _this.$data.car
                    ]
                }
                _this.insertOrderInfo({
                    order: order,
                    sc: (orderNo) => {
                        _this.goToOrder()
                    },
                    fc: () => {}
                })
            },
            updateCarOrder: function() {
                let _this = this
                let carInfo = _this.$data.car
                if (carInfo.skuCode == undefined || carInfo.skuCode == null || carInfo.skuCode == '') {
                    carInfo.skuCode = null
                }
                let params = {
                    orderNo: _this.carInfo.orderNo,
                    carOrderNo: _this.carInfo.carOrderNo,
                    carOrderDetailInfoList: [
                        carInfo
                    ]
                }
                _this.updateCarOrderInfo({
                    carInfo: params,
                    callback: () => {
                        _this.goToOrder()
                    }
                })
            },
            goToOrder: function() {
                let _this = this
                _this.$router.replace({
                    path: '/order/' + _this.order.orderNo
                })
            },
            goBack: function() {
                let _this = this
                _this.$router.go(-1)
            },
            checkDiscount: function() {
                let _this = this
                _this.$data.car.afterDiscountPrice = (parseFloat(_this.$data.car.actualMSRPInclusiveTax) - parseFloat(_this.$data.car.discount)).toFixed(2)
                _this.$data.car.actualSalesPrice = _this.$data.car.afterDiscountPrice
            },
            checkAfterDiscountPrice: function() {
                let _this = this
                _this.$data.car.discount = (parseFloat(_this.$data.car.actualMSRPInclusiveTax) - parseFloat(_this.$data.car.afterDiscountPrice)).toFixed(2)
                _this.$data.car.actualSalesPrice = _this.$data.car.afterDiscountPrice
            },
            checkAdditionalFee: function() {
                let _this = this
                _this.$data.car.actualSalesPrice = (parseFloat(_this.$data.car.afterDiscountPrice) + parseFloat(_this.$data.car.additionalFee)).toFixed(2)
            },
            ...mapActions('carInfo', [
                'getMsrp',
                'resetMsrp',
                'setCarInfo',
                'resetCarInfo',
                'insertCarOrderInfo',
                'updateCarOrderInfo',
                'getCarOrderInfoByOrderNo'
            ]),
            ...mapActions('order', [
                'getUserPermissionsInfo',
                'insertOrderInfo'
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
            msrp: {
                handler(value) {
                    let _this = this
                    _this.car.actualMSRPInclusiveTax = value
                    if (_this.$data.car.additionalFee == null) {
                        _this.$data.car.afterDiscountPrice = _this.$data.car.actualSalesPrice
                    }
                    _this.$data.car.discount = (parseFloat(_this.$data.car.actualMSRPInclusiveTax) - parseFloat(_this.$data.car.afterDiscountPrice)).toFixed(2)
                }
            }
        },
        components: {
            pageHeader,
            cell,
            cellBox,
            remark,
            likevehicle
        }
    }
</script>

<style lang="scss">
    .margin-left-30 {
        margin-left: rem(30);
    }
    .submit {
        padding: 0 rem(20);
        margin-top: rem(12);
        margin-bottom: rem(12);
    }
    .submit>.btn-clear {
        margin-top: rem(30);
        color: rgba(254, 56, 36, 0.9);
        font-size: rem(24);
    }
    .submit>.btn-clear>.iconfont {
        margin-left: rem(8);
    }
    .tax {
        color: rgb(0, 140, 238);
    }
</style>
