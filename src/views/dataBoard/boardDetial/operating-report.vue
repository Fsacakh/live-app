<template>
    <div class="operate-report">
        <div class="data-report-filter">
            <div class="w flex">
                <div class="input-lg" @click="selectTypes">
                    <span class="title">{{ filterData.scOrCarFlagName }}</span>
                    <span class="toTop" v-if="showTypes"></span>
                    <span class="toBottom" v-else></span>
                </div>
                <div class="input-sm" @click="selectIsPercent">
                    <span class="title">{{ filterData.isPercentName }}</span>
                    <span class="toTop" v-if="showIsPercent"></span>
                    <span class="toBottom" v-else></span>
                </div>
            </div>
        </div>
        <div class="data-content">
            <div class="data-table" v-if="filterData.isPercent == 0">
                <div class="table-title">
                    <div v-for="(field, name) in noPercentFields" :key="name" @click="sortedFilter(name)">
                        <a>{{ field.label }}</a>
                    </div>
                </div>
                <div class="table-body">
                    <div class="table-item" v-for="(item, index) in salesOprateInfoList" :key="index">
                        <div>
                            {{ filterData.scOrCarFlag === 'sc' ? item.scName: item.brandSeries }}
                        </div>
                        <div>
                            {{ item.inStoreLead }}
                        </div>
                        <div>
                            {{ item.orderOfferPrice }}
                        </div>
                        <div>
                            {{ item.orderConstract }}
                        </div>
                        <div>
                            {{ item.orderInvoice }}
                        </div>
                        <div>
                            {{ item.finishCar }}
                        </div>
                    </div>
                </div>
            </div>
            <div class="data-table" v-if="filterData.isPercent == 1">
                <div class="table-title">
                    <div v-for="(field, name) in isPercentFields" :key="name" @click="sortedFilter(name)">
                        <a>{{ field.label }}</a>
                    </div>
                </div>
                <div class="table-body">
                    <div class="table-item" v-for="(item, index) in salesOprateRateInfoList" :key="index">
                        <div>
                            {{ filterData.scOrCarFlag === 'sc' ? item.scName: item.brandSeries }}
                        </div>
                        <div>
                            {{ item.orderLeadRate }}
                        </div>
                        <div>
                            {{ item.orderContractRate }}
                        </div>
                        <div>
                            {{ item.contractInvoiceRate }}
                        </div>
                        <div>
                            {{ item.constractLeadRate }}
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <popup v-model="showTypes" position="bottom" class="w mint-datetime">
            <div class="picker-toolbar">
                <span class="mint-datetime-action mint-datetime-cancel" @click="hideScOrCarFlag">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="commitScOrCarFlag">确定</span>
            </div>
            <picker :slots="scOrCarFlagSlots" value-key="name" @change="onScOrCarFlagChange">
            </picker>
        </popup>
        <popup v-model="showIsPercent" position="bottom" class="w mint-datetime">
            <div class="picker-toolbar">
                <span class="mint-datetime-action mint-datetime-cancel" @click="hideIsPercent">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="commitIsPercent">确定</span>
            </div>
            <picker :slots="isPercentSlots" value-key="name" @change="onIsPercentChange">
            </picker>
        </popup>
    </div>
</template>

<script>
    import {
        mapState,
        mapActions
    } from 'vuex'
    import {
        Popup,
        Picker
    } from 'mint-ui';
    import api from '@/common/api.js'
    export default {
        mounted() {
            let _this = this
            _this.getSalesOprateInfo()
        },
        props: {
            date: {
                type: String,
                default: 'all'
            }
        },
        data: function() {
            return {
                filterData: {
                    scOrCarFlag: 'car',
                    scOrCarFlagName: '按车系维度汇总',
                    startTime: '',
                    endTime: '',
                    storeCode: '',
                    isPercent: 0,
                    isPercentName: '销售数据',
                },
                scOrCarFlagData: {
                    scOrCarFlag: '',
                    scOrCarFlagName: '销售顾问维度'
                },
                isPercentData: {
                    isPercent: 0,
                    isPercentName: '销售数据'
                },
                noPercentFields: {
                    scName: {
                        label: '销售顾问',
                        sorted: false,
                    },
                    inStoreLead: {
                        label: '进店线索数',
                        sorted: false,
                    },
                    orderOfferPrice: {
                        label: '报价数',
                        sorted: false,
                    },
                    orderConstract: {
                        label: '订单合同数',
                        sorted: false,
                    },
                    orderInvoice: {
                        label: '开票数',
                        sorted: false,
                    },
                    finishCar: {
                        label: '交车数',
                        sorted: false,
                    }
                },
                isPercentFields: {
                    scName: {
                        label: '销售顾问',
                        sorted: false,
                    },
                    orderLeadRate: {
                        label: '进店线索报价率',
                        sorted: false,
                    },
                    orderContractRate: {
                        label: '报价订单率',
                        sorted: false,
                    },
                    contractInvoiceRate: {
                        label: '订单开票率',
                        sorted: false,
                    },
                    constractLeadRate: {
                        label: '进店线索订单率',
                        sorted: false,
                    }
                },
                scOrCarFlagSlots: [{
                    flex: 1,
                    values: [{
                        code: 'sc',
                        name: '销售顾问维度汇总'
                    }, {
                        code: 'car',
                        name: '按车系维度汇总'
                    }],
                    className: 'slot1',
                    textAlign: 'center'
                }],
                isPercentSlots: [{
                    flex: 1,
                    values: [{
                        code: 0,
                        name: '数值'
                    }, {
                        code: 1,
                        name: '比例'
                    }],
                    className: 'slot1',
                    textAlign: 'center'
                }],
                showTypes: false,
                showIsPercent: false,
                salesOprateInfoList: [],
                salesOprateRateInfoList: []
            }
        },
        computed: {
            ...mapState('databoard', [
                'time',
                'store'
            ])
        },
        methods: {
            selectTypes: function() {
                let _this = this
                _this.$data.showTypes = true
            },
            selectIsPercent: function() {
                let _this = this
                if (_this.date == 'All') {
                    _this.$data.showIsPercent = true
                }
            },
            hideScOrCarFlag: function() {
                let _this = this
                _this.$data.showTypes = false
            },
            hideIsPercent: function() {
                let _this = this
                _this.$data.showIsPercent = false
            },
            commitScOrCarFlag: function() {
                let _this = this
                _this.$data.filterData.scOrCarFlagName = _this.$data.scOrCarFlagData.scOrCarFlagName
                _this.$data.filterData.scOrCarFlag = _this.$data.scOrCarFlagData.scOrCarFlag
                _this.$data.showTypes = false
            },
            onScOrCarFlagChange: function(picker, values) {
                let _this = this
                if (values != null && values.length > 0 && values[0] != undefined) {
                    _this.$data.scOrCarFlagData.scOrCarFlagName = values[0].name
                    _this.$data.scOrCarFlagData.scOrCarFlag = values[0].code
                    if (_this.$data.scOrCarFlagData.scOrCarFlag === 'sc') {
                        _this.$data.noPercentFields.scName.label = '销售顾问'
                        _this.$data.isPercentFields.scName.label = '销售顾问'
                    } else if (_this.$data.scOrCarFlagData.scOrCarFlag === 'car') {
                        _this.$data.noPercentFields.scName.label = '品牌车系'
                        _this.$data.isPercentFields.scName.label = '品牌车系'
                    }
                }
            },
            onIsPercentChange: function(picker, values) {
                let _this = this
                if (values != null && values.length > 0 && values[0] != undefined) {
                    _this.$data.isPercentData.isPercentName = values[0].name
                    _this.$data.isPercentData.isPercent = values[0].code
                }
            },
            commitIsPercent: function() {
                let _this = this
                _this.$data.filterData.isPercentName = _this.$data.isPercentData.isPercentName
                _this.$data.filterData.isPercent = _this.$data.isPercentData.isPercent
                _this.$data.showIsPercent = false
            },
            sortedFilter: function(name) {
                let _this = this
                if (_this.filterData.isPercent == 0) {
                    let sorted = _this.$data.noPercentFields[name].sorted
                    if (!sorted) {
                        _this.$data.salesOprateInfoList.sort((a, b) => {
                            return (a[name] - b[name])
                        })
                        _this.$data.noPercentFields[name].sorted = true
                    } else {
                        _this.$data.salesOprateInfoList.sort((a, b) => {
                            return (b[name] - a[name])
                        })
                        _this.$data.noPercentFields[name].sorted = false
                    }
                } else if (_this.filterData.isPercent == 1) {
                    let sorted = _this.$data.isPercentFields[name].sorted
                    if (!sorted) {
                        _this.$data.salesOprateRateInfoList.sort((a, b) => {
                            return (parseFloat(parseFloat(a[name].replace('%', '')) / 100) - parseFloat(parseFloat(b[name].replace('%', '')) / 100))
                        })
                        _this.$data.isPercentFields[name].sorted = true
                    } else {
                        _this.$data.salesOprateRateInfoList.sort((a, b) => {
                            return (parseFloat(parseFloat(b[name].replace('%', '')) / 100) - parseFloat(parseFloat(a[name].replace('%', '')) / 100))
                        })
                        _this.$data.isPercentFields[name].sorted = false
                    }
                }
            },
            getSalesOprateInfo: function() {
                let _this = this
                _this.$data.filterData.startTime = _this.time.startDate
                _this.$data.filterData.endTime = _this.time.endDate
                _this.$data.filterData.storeCode = _this.store.code
                api.board
                    .querySalesOprateInfoByScOrCarInfo(_this.$data.filterData, (res) => {
                        if (res.data.code === 'success') {
                            _this.$data.salesOprateInfoList = res.data.obj ? res.data.obj.salesOprateData : []
                            _this.$data.salesOprateRateInfoList = []
                            if (_this.$data.salesOprateInfoList.length > 0) {
                                _this.$data.salesOprateInfoList.unshift({
                                    scName: '总计',
                                    brandSeries: '总计',
                                    inStoreLead: res.data.obj.totalInStoreLead,
                                    orderOfferPrice: res.data.obj.totalOrderOfferPrice,
                                    orderConstract: res.data.obj.totalOrderConstract,
                                    orderInvoice: res.data.obj.totalOrderInvoice,
                                    finishCar: res.data.obj.totalFinishCar
                                })
                            }
                            _this.$data.salesOprateInfoList.forEach((item) => {
                                _this.$data.salesOprateRateInfoList.push({
                                    scName: item.scName,
                                    brandSeries: item.brandSeries,
                                    orderLeadRate: (item.inStoreLead > 0 ? parseFloat((item.orderOfferPrice / item.inStoreLead) * 100).toFixed(2) : 0.00.toFixed(2)) + '%',
                                    orderContractRate: (item.orderOfferPrice > 0 ? parseFloat((item.orderConstract / item.orderOfferPrice) * 100).toFixed(2) : 0.00.toFixed(2)) + '%',
                                    contractInvoiceRate: (item.orderConstract > 0 ? parseFloat((item.orderInvoice / item.orderConstract) * 100).toFixed(2) : 0.00.toFixed(2)) + '%',
                                    constractLeadRate: (item.inStoreLead > 0 ? parseFloat((item.orderConstract / item.inStoreLead) * 100).toFixed(2) : 0.00.toFixed(2)) + '%',
                                })
                            })
                        }
                    })
            }
        },
        watch: {
            filterData: {
                handler(val) {
                    let _this = this
                    _this.getSalesOprateInfo()
                },
                deep: true
            },
            time: {
                handler(val) {
                    let _this = this
                    _this.getSalesOprateInfo()
                },
                deep: true
            },
            store: {
                handler(val) {
                    let _this = this
                    _this.getSalesOprateInfo()
                },
                deep: true
            },
            date: {
                handler(val) {
                    let _this = this
                    if (val != 'All') {
                        _this.$data.filterData.isPercent = 0
                        _this.$data.filterData.isPercentName = '销售数据'
                        _this.$data.showIsPercent = false
                    }
                },
                deep: true
            }
        },
        components: {
            Popup,
            Picker
        }
    }
</script>
<style lang="scss" scoped>
    .operate-report {
        position: fixed;
        top: remp(137);
        margin: 0 auto;
        width: 100%;
        max-width: 750px;
    }
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
    .data-content {
        display: flex;
        flex-direction: column;
    }
    .data-content>.data-table {
        margin-top: remp(10);
        padding-left: remp(10);
        padding-right: remp(10);
        max-width: 750px;
    }
    .data-content>.data-table>.table-title {
        height: remp(50);
        border-bottom: remp(1) solid #d5d5de;
        background-color: #f7f7f7;
        display: flex;
        div {
            height: remp(50);
            color: #333;
            font-size: remp(14);
            display: flex;
            justify-content: center;
            align-items: center;
            text-align: center;
            flex: 1;
            padding-left: rem(16);
            padding-right: rem(16);
            >a {
                text-decoration: underline !important;
            }
        }
    }
    .data-content>.data-table>.table-body {
        position: fixed;
        top: remp(270);
        width: 100%;
        height: 100%;
        max-width: 3.55rem;
        max-height: calc(100% - 2.7rem);
        overflow-y: scroll;
        >.table-item {
            height: remp(40);
            border-bottom: remp(1) solid #d5d5de;
            background-color: #fff;
            display: flex;
            div {
                color: #333;
                font-size: remp(12);
                display: flex;
                justify-content: center;
                align-items: center;
                text-align: center;
                flex: 1
            }
        }
    }
</style>