<template>
    <div v-if="!active">
        <page-header>
            <div slot>车辆搜索</div>
        </page-header>
        <div class="m-t-10" @click="searchStore">
            <cell title="门店选择">
                <input class="changgeStoreInput" type="text" placeholder="请选择门店" :value="storeName" :disabled='disabled'>
                <span v-show="!isStore " slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
            </cell>
        </div>
        <div class="m-t-10">
            <cell title="车型车款">
                <input type="text" :value="car.displayName" @click="searchCar">
                <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
            </cell>
            <cell title="车架号">
                <input type="text" v-model="car.carVinNo" placeholder="请输入车架号">
            </cell>
            <cell title="外观">
                <input type="text" v-model="car.carAppertanceName" placeholder="请输入外观色">
            </cell>
            <cell title="内饰">
                <input type="text" v-model="car.carInteriorName" placeholder="请输入内饰色">
            </cell>
            <cell title="物流状态">
                <div class="flex">
                    <div class="selectItem" :class="{ 'active': carInfo.logisticsStatus == 1 }" @click="selectInRoad">
                        在途
                    </div>
                    <div class="selectItem" :class="{ 'active': carInfo.logisticsStatus == 2 }" @click="selectInStock">
                        在库
                    </div>
                </div>
            </cell>
            <div class="submit">
                <mt-button size="large" type="primary" @click="searchCarStockInfo">确定</mt-button>
                <div class="btn-clear" @click="clearCondition">
                    <i class="iconfont icon-qingchu"></i> 重置
                </div>
            </div>
        </div>
        <!-- popup -->
        <Popup v-model="showAreaShop" :closeOnClickModal="false" position="bottom" class="w mint-datetime">
            <div class="picker-toolbar">
                <span class="mint-datetime-action mint-datetime-cancel" @click="hideAreaShop">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="hideAreaShopyes">确定</span>
            </div>
            <picker :slots="areaShopSlots" value-key="name" @change="onAreaShopChange"></picker>
        </Popup>
    </div>
    <!-- 查询车辆信息组件 -->
    <div v-else>
        <likevehicleNew @revert="revert" :carInfo="carInfo" ensuredispaly="carbrand" title="库存查询" @confirm="confirm"></likevehicleNew>
    </div>
</template>

<script>
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '../../../common/config'
    import api from '../../../common/api.js'
    import pageHeader from '@/components/header/PageHeader'
    import group from '@/components/group'
    import cell from '@/components/cell'
    import cellBox from '@/components/cell-box'
    import likevehicleNew from '@/components/likevehicle/likevehicle-new'
    import {
        Button,
        Popup,
        Picker
    } from 'mint-ui'
    export default {
        mounted() {
            let _this = this
            if (_this.$route.params.id == 'homepage') {
                _this.disabledSelectCarInfo()
            } else if (_this.$route.params.id == 'stockCarInfoList') {
                _this.enableSelectCarInfo()
            }
            _this.updateCarInfo()
            _this.getUserAvailableInfo()
        },
        data: function() {
            return {
                active: false,
                disabled: true,
                storeName: '',
                filterData: {
                    storeCode: '',
                    storeName: '',
                    salesName: '',
                    salesCode: '',
                },
                car: {
                    actualSalesPrice: 0,
                    carFactoryCode: '',
                    carFactoryNums: null,
                    carBrandCode: '',
                    carBrandNums: null,
                    carSeriesCode: '',
                    carSeriesNums: null,
                    carModelCode: '',
                    carModelNums: null,
                    carstyleNums: null,
                    carCode: '',
                    displayName: '',
                    skuCode: '',
                    carAppertanceName: '',
                    carInteriorName: '',
                    logisticsStatus: null,
                    carVinNo: '',
                    pageNums: config.pageNums,
                    pageStart: 1,
                    storeCode: '',
                    storeName: '',
                },
                showAreaShop: false,
                areaCode: '', // 存放门店区域编码
                areaShopSlots: [{
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }, {
                    flex: 1,
                    values: [],
                    className: 'slot2',
                    textAlign: 'center'
                }],
                customSlots: [{
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }],
            }
        },
        computed: {
            ...mapState('order', [
                'order'
            ]),
            ...mapState('carInfo', [
                'carInfo',
                'showBandAndSeries',
                'store',
                'isStore',
            ])
        },
        methods: {
            // 查询车辆库存信息
            searchCar: function() {
                let _this = this
                _this.$data.active = true
            },
            // 切换门店查询门店相关的信息
            searchStore() {
                const that = this;
                if (!that.isStore) {
                    that.$data.showAreaShop = true
                }
            },
            getUserAvailableInfo() {
                // 先获取登录用户的信息
                api.getUserInfo.getUserAvailableInfo(res => {
                    const _this = this;
                    if (res.data.code === 'success') {
                        let availableType = res.data.obj.availableType;
                        if (availableType == '0') {
                            _this.showAreaShop = false
                            let storeInfo = res.data.obj.storeInfoVo
                            _this.mommitIsStore(true)
                            _this.$data.isStore = true
                            if (storeInfo != null) {
                                _this.areaShopSlots[0].values = [{
                                    code: storeInfo.salesCode,
                                    name: storeInfo.salesName
                                }]
                                _this.$data.areaShopSlots[1].values = [{
                                    code: storeInfo.storeCode,
                                    name: storeInfo.storeName
                                }]
                                _this.storeName = storeInfo.storeName
                                _this.filterData.storeCode = storeInfo.storeCode
                                _this.filterData.storeName = storeInfo.storeName
                                // 改变store的状态
                                _this.setStore({
                                    code: storeInfo.storeCode,
                                    name: storeInfo.storeName
                                })
                                this.$router.replace({
                                    path: _this.$route.path,
                                    query: {
                                        storeCode: storeInfo.storeCode
                                    }
                                })
                            }
                        } else {
                            this.showAreaShop = (_this.store !== '' ? false : true)
                            this.mommitIsStore(false)
                            _this.$data.isStore = false
                            if (_this.store != '') {
                                _this.storeName = _this.store.name;
                                this.$router.replace({
                                    path: _this.$route.path,
                                    query: {
                                        storeCode: _this.store.code
                                    }
                                })
                            }
                            _this.getSalesAreaInfoByAreaCode(); // 获取门店区域的相关信息
                        }
                    }
                })
            },
            // 获取门店区域信息
            getSalesAreaInfoByAreaCode() {
                const that = this;
                api.area.getSalesAreaInfoByAreaCode({
                    areaCode: config.treeArea
                }, res => {
                    if (res.data.code === 'success') {
                        let salesAreaSubInfo = res.data.obj.salesAreaSubInfo
                        that.areaShopSlots[0].values = []
                        that.areaShopSlots[1].values = []
                        if (salesAreaSubInfo != null && salesAreaSubInfo.length > 0) {
                            salesAreaSubInfo.forEach(item => {
                                that.areaShopSlots[0].values.push({
                                    code: item.areaCode,
                                    name: item.areaName
                                })
                            })
                        }
                    }
                })
            },
            // 切换门店区域
            onAreaShopChange(picker, values) {
                const that = this;
                if (picker.getSlotValue(0) && picker.getSlotValue(0).code) {
                    that.filterData.salesCode = picker.getSlotValue(0).code
                    that.filterData.salesName = picker.getSlotValue(0).name
                    api.area.getShopInfoByAreaCode({
                        salesAreaCodes: [picker.getSlotValue(0).code],
                        needPageFlag: "0"
                    }, (res) => {
                        that.areaShopSlots[1].values = []
                        if (res.data.code === 'success') {
                            let shopInfos = res.data.obj
                            if (shopInfos != null && shopInfos.length > 0) {
                                that.areaShopSlots[1].values = []
                                shopInfos.forEach((shopInfo) => {
                                    that.areaShopSlots[1].values.push({
                                        code: shopInfo.storeCode,
                                        name: shopInfo.storeName
                                    })
                                })
                            }
                        }
                    })
                }
                if (values[1] && values[1].code != that.filterData.storeCode) {
                    that.filterData.storeCode = picker.getSlotValue(1) ? picker.getSlotValue(1).code : ''
                    that.filterData.storeName = picker.getSlotValue(1) ? picker.getSlotValue(1).name : ''
                }
                if (that.filterData.storeCode != '') {
                    that.car.storeCode = that.filterData.storeCode;
                    that.storeCode({
                        code: that.car.code
                    });
                    api.customer.queryScList({
                        storeCode: that.filterData.storeCode,
                        postnTypeCode: config.root.scPostTypeCode
                    }).then((res) => {
                        if (res.data.code === 'success') {
                            let emps = res.data.obj
                            that.customSlots[0].values = []
                            that.customSlots[0].values = [{
                                code: '',
                                name: '全部顾问'
                            }]
                            if (emps != null) {
                                emps.forEach((emp) => {
                                    that.customSlots[0].values.push({
                                        code: emp.empCode,
                                        name: emp.empCnName
                                    })
                                })
                            }
                        }
                    })
                }
            },
            // 弹出框取消按钮
            hideAreaShop: function() {
                this.$router.push({
                    path: '/homepage'
                })
                this.showAreaShop = false // 关闭弹层
            },
            // 弹出框确定按钮
            hideAreaShopyes() {
                let _this = this
                this.showAreaShop = false
                this.storeName = this.filterData.storeName
                this.setStore({code: this.filterData.storeCode, name: this.filterData.storeName })
                this.$router.replace({
                    path: _this.$route.path,
                    query: {
                        storeCode: _this.filterData.storeCode == '' ? _this.store.code : _this.filterData.storeCode
                    }
                })
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
                _this.car.carFactoryNums = item.factorydata == null ? 0 : item.factorydata.nums;
                _this.$data.car.carBrandNums = item.carbranddata.nums
                _this.$data.car.carSeriesNums = item.cartraindata.nums
                _this.$data.car.carModelNums = item.cartypedata.nums
                _this.$data.car.carstyleNums = item.carstyledata.nums
                _this.$data.car.carSeriesCode = item.cartraindata.seriesCode
                _this.$data.car.carModelCode = item.cartypedata.modelCode
                _this.$data.car.carCode = item.carstyledata.carCode
                _this.$data.car.displayName = `${factoryName || ''} ${brandName || ''} ${seriesName || ''} ${modelName || ''} ${displayName || ''}`
                _this.active = false
                _this.setCarInfo(_this.$data.car)
            },
            clearCondition: function() {
                let _this = this
                if (_this.showBandAndSeries) {
                    _this.clearCarInfo()
                } else {
                    _this.clearCarInfo({
                        condition: config.order.carInfo.hideBandAndSeries,
                        storeCode: _this.car.storeCode
                    })
                }
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
                    channelType: 'REFD022414',
                    skuCode: val.skuCode,
                    carOrderNo: val.carOrderNo,
                    carOrderDetailCode: val.carOrderDetailCode,
                    additionalFee: val.additionalFee ? val.additionalFee : null,
                    originalSalesPrice: val.originalSalesPrice,
                    actualSalesPrice: val.actualSalesPrice ? val.actualSalesPrice : null,
                    discount: val.discount ? val.discount : null,
                    afterDiscountPrice: val.afterDiscountPrice ? val.afterDiscountPrice : null,
                    logisticsStatus: val.logisticsStatus,
                    productionCode: val.productionCode,
                    carVinNo: val.carVinNo,
                    carAppertanceName: val.carAppertanceName,
                    carInteriorName: val.carInteriorName,
                    actualMSRPInclusiveTax: val.actualMSRPInclusiveTax,
                    originalAddition: val.originalAddition,
                    cycleKey: val.cycleKey,
                    orderAddInfos: val.orderAddInfos
                }
                _this.$data.car.displayName = _this.car.displayName ? _this.car.displayName : (`${_this.car.carFactoryName || ''} ${_this.car.carBrandName || ''} ${_this.car.carSeriesName || ''} ${_this.car.carModelName || ''}`)
            },
            selectInRoad: function() {
                let _this = this
                if (_this.$data.car.logisticsStatus == null || _this.$data.car.logisticsStatus == 2) {
                    _this.$data.car.logisticsStatus = 1
                } else if (_this.$data.car.logisticsStatus == 1) {
                    _this.$data.car.logisticsStatus = null
                }
                _this.setCarInfo(_this.$data.car)
            },
            selectInStock: function() {
                let _this = this
                if (_this.$data.car.logisticsStatus == null || _this.$data.car.logisticsStatus == 1) {
                    _this.$data.car.logisticsStatus = 2
                } else if (_this.$data.car.logisticsStatus == 2) {
                    _this.$data.car.logisticsStatus = null
                }
                _this.setCarInfo(_this.$data.car)
            },
            searchCarStockInfo: function() {
                let _this = this
                _this.setCarInfo(_this.$data.car)
                if (_this.$route.params.id == 'homepage') {
                    _this.disabledSelectCarInfo()
                    _this.$router.replace({
                        path: '/stockCarInfoList?from=homepage'
                    })
                } else {
                    _this.$router.go(-1)
                }
            },
            ...mapActions('carInfo', [
                'setCarInfo',
                'clearCarInfo',
                'disabledSelectCarInfo',
                'enableSelectCarInfo',
                'setStore',
                'storeCode',
                'mommitIsStore'
            ])
        },
        watch: {
            carInfo: {
                handler(val) {
                    let _this = this
                    _this.updateCarInfo()
                },
                deep: true
            }
        },
        components: {
            pageHeader,
            group,
            cell,
            cellBox,
            likevehicleNew,
            Popup,
            Picker
        }
    }
</script>

<style lang="scss" scoped>
    .changgeStoreInput {
        background-color: white;
        color: black;
    }
    .selectItem {
        width: rem(124);
        background: rgb(238, 239, 242);
        font-family: PingFangSC-Regular;
        font-size: rem(26);
        line-height: rem(26);
        color: rgb(126, 131, 135);
        text-align: center;
        margin-top: rem(15);
        margin-bottom: rem(15);
        margin-right: rem(48);
        padding: rem(12) 0;
        &.active {
            background: linear-gradient(-180deg, #008cee 0%, #36acfe 100%) !important;
            color: rgb(255, 255, 255) !important;
        }
    }
    .submit {
        padding: 0 rem(20);
        margin-top: rem(62);
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
    .searchbox .input-joly {
        width: 65% !important;
    }
    .flex {
        margin-left: 14%;
    }
    .showAreaShop {
        width: 100px;
        text-align: center;
        overflow: hidden;
    }
    .areaPopup {
        width: 100%;
    }
</style>
