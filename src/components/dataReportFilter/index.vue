<template>
    <div class="data-report-filter">
        <div class="w flex">
            <div class="input-lg">
                <span class="title">{{ storeName }}</span>
                <span class="toTop" v-if="showAreaShop"></span>
                <span class="toBottom" v-if="isShowIcon"></span>
            </div>
            <div class="input-sm" @click="selectCustom" v-if="showEmp">
                <span class="title">{{ filterData.scName }}</span>
                <span class="toTop" v-if="showCustom"></span>
                <span class="toBottom" v-else></span>
            </div>
        </div>
        <div class="w flex margin-top-10">
            <div class="input-lg" @click="selectCar">
                <span class="title">{{ filterData.carFactoryName + ' ' + filterData.carBrandName + ' ' + filterData.carSeriesName }}</span>
                <span class="toTop" v-if="showCarInfo"></span>
                <span class="toBottom" v-else></span>
            </div>
            <div class="input-sm">
                <span class="title">{{ filterData.nomValueName }}</span>
            </div>
        </div>
        <popup v-model="showAreaShop" position="bottom" class="w mint-datetime">
            <div class="picker-toolbar">
                <span class="mint-datetime-action mint-datetime-cancel" @click="hideAreaShop">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="commitAreaShop">确定</span>
            </div>
            <picker :slots="areaShopSlots" value-key="name" @change="onAreaShopChange">
            </picker>
        </popup>
        <popup v-model="showCustom" position="bottom" class="w mint-datetime">
            <div class="picker-toolbar">
                <span class="mint-datetime-action mint-datetime-cancel" @click="hideCustom">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="commitCustom">确定</span>
            </div>
            <picker :slots="customSlots" value-key="name" @change="onCustomChange">
            </picker>
        </popup>
        <popup v-model="showCarInfo" position="bottom" class="w mint-datetime">
            <div class="picker-toolbar">
                <span class="mint-datetime-action mint-datetime-cancel" @click="hideCar">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="commitCar">确定</span>
            </div>
            <picker :slots="carSlots" value-key="name" @change="onCarChange">
            </picker>
        </popup>
        <popup v-model="showNomValue" position="bottom" class="w mint-datetime">
            <div class="picker-toolbar">
                <span class="mint-datetime-action mint-datetime-cancel" @click="hideNomValue">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="commitNomValue">确定</span>
            </div>
            <picker :slots="nomValueSlots" value-key="name" @change="onNomValueChange">
            </picker>
        </popup>
    </div>
</template>

<script>
    import {
        Popup,
        Picker
    } from 'mint-ui';
    import config from '../../common/config'
    import api from '@/common/api.js'
    export default {
        mounted() {
            let _this = this
            api.getUserInfo
                .getUserAvailableInfo((res) => {
                    if (res.data.code === 'success') {
                        let availableType = res.data.obj.availableType
                        this.availableType = res.data.obj.availableType;
                        if (availableType == '0') {
                            let storeInfo = res.data.obj.storeInfoVo
                            _this.$data.isStore = true
                            
                            _this.$data.areaShopSlots[0].values = [{
                                code: storeInfo.salesCode,
                                name: storeInfo.salesName
                            }]
                            _this.$data.areaShopSlots[1].values = [{
                                code: storeInfo.storeCode,
                                name: storeInfo.storeName
                            }]
                            _this.filterData.salesName = storeInfo.salesName
                            _this.filterData.salesCode = storeInfo.salesCode
                            _this.filterData.storeName = storeInfo.storeName
                            _this.filterData.storeCode = storeInfo.storeCode
                            _this.$emit('data-change', _this.filterData)
                        } else {
                            api.area
                                .getSalesAreaInfoByAreaCode({
                                    areaCode: config.treeArea
                                }, (res) => {
                                    if (res.data.code === 'success') {
                                        let salesAreaSubInfo = res.data.obj.salesAreaSubInfo
                                        _this.$data.areaShopSlots[0].values = []
                                        _this.$data.areaShopSlots[1].values = []
                                        if (salesAreaSubInfo != null && salesAreaSubInfo.length > 0) {
                                            salesAreaSubInfo.forEach((salesAreaInfo) => {
                                                _this.$data.areaShopSlots[0].values.push({
                                                    code: salesAreaInfo.areaCode,
                                                    name: salesAreaInfo.areaName
                                                })
                                            })
                                        }
                                    }
                                })
                        }
                    }
                })
            api.car.queryCarInfoByCarSearch({
                    code: "",
                    level: 2,
                    //厂家编码
                    carFactoryCode: _this.isFactoryStart ? null : _this.filterData.carFactoryCode,
                    // 品牌编码
                    carBrandCode: '',
                    storeCode: this.$route.query.storeCode
                },
                (res) => {
                    if (res.data.code === "success") {
                        let carBrands = res.data.obj
                        if (carBrands != null && carBrands.length > 0) {
                            _this.$data.carSlots[0].values = [{
                                name: '全部品牌',
                                code: ''
                            }]
                            carBrands.forEach((carBrand) => {
                                _this.$data.carSlots[0].values.push({
                                    name: carBrand.brandName,
                                    code: carBrand.brandCode,
                                })
                            })
                        }
                    }
                }
            );
        },
        name: 'data-report-filter',
        props: {
            showEmp: {
                type: Boolean,
                default: true
            },
            storeName: {
                type: String,
                default: ''
            },
            storeCode: {
                type: String,
                default: ''
            },
            isShowIcon: {
                type: Boolean,
                default: ''
            }
        },
        data() {
            return {
                availableType: '', //获取用户权限
                filterData: {
                    storeCode: '',
                    storeName: '',
                    salesName: '',
                    salesCode: '',
                    carFactoryCode: '',
                    carFactoryName: '',
                    carBrandCode: '',
                    carBrandName: '',
                    carSeriesCode: '',
                    carSeriesName: '',
                    scName: '全部顾问',
                    scCode: '',
                    nomValueName: '对标集团',
                    nomValueCode: 0
                },
                isStore: false,
                showAreaShop: false,
                showCustom: false,
                showCarInfo: false,
                showNomValue: false,
                areaShopData: {
                    storeCode: '',
                    storeName: '',
                    salesName: '',
                    salesCode: '',
                },
                customData: {
                    scName: '全部顾问',
                    scCode: '',
                },
                carData: {
                    carFactoryCode: '',
                    carFactoryName: '',
                    carBrandCode: '',
                    carBrandName: '',
                    carSeriesCode: '',
                    carSeriesName: '',
                },
                nomValueData: {
                    nomValueName: '对标集团',
                    nomValueCode: 0
                },
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
                carSlots: [{
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }],
                nomValueSlots: [{
                    flex: 1,
                    values: [{
                        code: 0,
                        name: '对标集团'
                    }, {
                        code: 1,
                        name: '对标品牌'
                    }, ],
                    className: 'slot1',
                    textAlign: 'center'
                }],
                isFactoryStart: (config.isFactoryStart === "false" ? false : true)
            }
        },
        methods: {
            selectAreaShop: function() {
                let _this = this
                if (!_this.isStore) {
                    _this.$data.showAreaShop = true
                }
            },
            hideAreaShop: function() {
                let _this = this
                _this.$data.showAreaShop = false
            },
            commitAreaShop: function() {
                let _this = this
                _this.$data.filterData.salesCode = _this.$data.areaShopData.salesCode
                _this.$data.filterData.salesName = _this.$data.areaShopData.salesName
                _this.$data.filterData.storeCode = _this.$data.areaShopData.storeCode
                _this.$data.filterData.storeName = _this.$data.areaShopData.storeName
                _this.$emit('data-change', _this.filterData)
                _this.$data.showAreaShop = false
            },
            selectCustom: function() {
                let _this = this
                _this.showCustom = true
            },
            hideCustom: function() {
                let _this = this
                _this.$data.showCustom = false
            },
            commitCustom: function() {
                let _this = this
                _this.$data.filterData.scName = _this.$data.customData.scName
                _this.$data.filterData.scCode = _this.$data.customData.scCode
                _this.$emit('data-change', _this.filterData)
                _this.$data.showCustom = false
            },
            selectCar: function() {
                let _this = this
                _this.showCarInfo = true
            },
            hideCar: function() {
                let _this = this
                _this.$data.showCarInfo = false
            },
            commitCar: function() {
                let _this = this
                _this.$data.filterData.carBrandCode = _this.carData.carBrandCode
                _this.$data.filterData.carBrandName = _this.carData.carBrandName
                if (_this.filterData.carBrandCode != '') {
                    _this.$data.filterData.nomValueName = '对标品牌'
                    _this.$data.filterData.nomValueCode = 1
                } else {
                     _this.$data.filterData.nomValueName = '对标集团'
                    _this.$data.filterData.nomValueCode = 0
                }
                _this.$emit('data-change', _this.filterData)
                _this.$data.showCarInfo = false
            },
            selectNomValue: function() {
                let _this = this
                _this.showNomValue = true
            },
            hideNomValue: function() {
                let _this = this
                _this.showNomValue = false
            },
            commitNomValue: function() {
                let _this = this
                _this.$data.filterData.nomValueName = _this.$data.nomValueData.nomValueName
                _this.$data.filterData.nomValueCode = _this.$data.nomValueData.nomValueCode
                _this.$emit('data-change', _this.filterData)
                _this.showNomValue = false
            },
            onAreaShopChange: function(picker, values) {
                let _this = this
                if (picker.getSlotValue(0) && picker.getSlotValue(0).code != _this.$data.filterData.salesCode) {
                    _this.$data.areaShopData.salesCode = picker.getSlotValue(0).code
                    _this.$data.areaShopData.salesName = picker.getSlotValue(0).name
                    api.area
                        .getShopInfoByAreaCode({
                            salesAreaCodes: [picker.getSlotValue(0).code],
                            needPageFlag: "0"
                        }, (res) => {
                            if (res.data.code === 'success') {
                                let shopInfos = res.data.obj

                                if (shopInfos != null && shopInfos.length > 0) {
                                    _this.$data.areaShopSlots[1].values = []
                                    shopInfos.forEach((shopInfo) => {
                                        _this.$data.areaShopSlots[1].values.push({
                                            code: shopInfo.storeCode,
                                            name: shopInfo.storeName
                                        })
                                    })
                                }
                            }
                        })
                }
                if (_this.$data.filterData.salesCode ===  '') {
                    _this.commitAreaShop()
                }
                if (values[1] && values[1].code != _this.$data.filterData.storeCode) {
                    _this.areaShopData.storeCode = picker.getSlotValue(1).code
                    _this.areaShopData.storeName = picker.getSlotValue(1).name
                }
                if (_this.$data.filterData.storeCode ===  '') {
                    _this.commitAreaShop()
                }
                if (_this.filterData.storeCode != '') {
                    //添加判断，如果是用户权限为门店则强制获取路由上的storeCode
                    if(_this.availableType == 0 || _this.availableType == 2){
                        _this.filterData.storeCode = _this.$route.query.storeCode;
                    }
                    api.customer.queryScList({
                        storeCode: _this.filterData.storeCode,
                        postnTypeCode: config.root.scPostTypeCode
                    }).then((res) => {
                        if (res.data.code === 'success') {
                            let emps = res.data.obj
                            _this.customSlots[0].values = []
                            _this.customSlots[0].values = [{
                                code: '',
                                name: '全部顾问'
                            }]
                            if (emps != null) {
                                emps.forEach((emp) => {
                                    _this.customSlots[0].values.push({
                                        code: emp.empCode,
                                        name: emp.empCnName
                                    })
                                })
                            }
                        }
                    })
                }
            },
            onCustomChange: function(picker, values) {
                let _this = this
                if (values != null && values.length > 0 && values[0] != undefined) {
                    _this.$data.customData.scName = values[0].name
                    _this.$data.customData.scCode = values[0].code
                }
                if (_this.$data.customData.scCode === '') {
                   _this.commitCustom()
                }
            },
            onCarChange: function(picker, values) {
                let _this = this
                if (picker.getSlotValue(0) && _this.filterData.carBrandCode != picker.getSlotValue(0)) {
                    _this.carData.carBrandCode = picker.getSlotValue(0).code
                    _this.carData.carBrandName = picker.getSlotValue(0).name
                }
                if (_this.carData.carBrandCode === '') {
                    _this.commitCar()
                }
            },
            onNomValueChange: function(picker, values) {
                let _this = this
                if (values != null && values.length > 0 && values[0] != undefined) {
                    _this.$data.nomValueData.nomValueName = values[0].name
                    _this.$data.nomValueData.nomValueCode = values[0].code
                }
            },
        },
        components: {
            Popup,
            Picker
        }
    }
</script>

<style lang="scss" @scope>
    .data-report-filter {
        background: #F7F7F7;
        max-width: 750px;
        display: flex;
        flex-direction: column;
        padding-left: remp(20);
        padding-right: remp(20);
        padding-top: remp(10);
        padding-bottom: remp(10);
    }
    .input-lg {
        width: 48%;
        display: flex;
        flex-direction: row;
        background-color: #ffffff;
        color: #7E8387;
        font-family: PingFangSC-Regular;
        font-size: remp(14);
        padding: remp(15) remp(10);
        box-shadow: 0 remp(7) remp(9) 0 rgba(228, 228, 228, 0.51);
        border-radius: remp(4);
        vertical-align: middle;
    }
    .input-lg>.title {
        width: 90%;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: keep-all;
        white-space: nowrap;
    }
    .input-sm {
        width: 38.2%;
        display: flex;
        flex-direction: row;
        background-color: #ffffff;
        color: #7E8387;
        font-family: PingFangSC-Regular;
        font-size: remp(14);
        padding: remp(15) remp(10);
        margin-left: remp(10);
        box-shadow: 0 remp(7) remp(9) 0 rgba(228, 228, 228, 0.51);
        border-radius: remp(4);
        vertical-align: middle;
    }
    .input-sm>.title {
        width: 85%;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: keep-all;
        white-space: nowrap;
    }
    .margin-top-10 {
        margin-top: remp(10);
    }
    .toTop:before {
        width: 0;
        height: 0;
        border-left: remp(8) solid transparent;
        border-right: remp(8) solid transparent;
        border-bottom: remp(8) solid #7E8387;
        font-size: 0;
        float: right;
        margin-top: remp(7);
        content: ' '
    }
    .toBottom:before {
        width: 0;
        height: 0;
        border-left: remp(8) solid transparent;
        border-right: remp(8) solid transparent;
        border-top: remp(8) solid #7E8387;
        font-size: 0;
        float: right;
        margin-top: remp(7);
        content: ' '
    }
</style>


