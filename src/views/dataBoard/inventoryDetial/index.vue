<template>
    <div class="inventory-detial">
        <page-header>
            <div slot>库存</div>
        </page-header>
        <div class="inventoryDetial b-white" >
            {{dateMage}}
        </div>
        <v-query @data-change="queryData" :showEmp="false" :storeCode='query.storeCode' :storeName="storeName" :isShowIcon="false"></v-query>
        <div class="inventory-content">
            <div class="inventory-table-up">
                <div class="table-title">
                    <div class="norm">指标</div>
                    <div class="actual">实际值</div>
                    <div class="bench">对标值</div>
                    <div class="ranking">排名</div>
                </div>
                <div class="table-body">
                    <div class="norm">{{'库存周转天数'}}</div>
                    <div class="actual">{{inventoryDays.actual}}</div>
                    <div class="bench">{{inventoryDays.bench}}</div>
                    <div class="ranking">{{inventoryDays.ranking}}</div>
                </div>
                <div class="table-body">
                    <div class="norm">{{'已订单库存'}}</div>
                    <div class="actual">{{stock_result.actual}}</div>
                    <div class="bench">{{stock_result.bench}}</div>
                    <div class="ranking"></div>
                </div>
            </div>
            <div class="inventory-table-down">
                <div class="table-title">
                    <div class="norm">指标</div>
                    <div class="actual">台数</div>
                    <div class="bench">占比</div>
                </div>
                <div class="table-body" v-for="(item, index) in reservoirAge" :key="index">
                    <div class="norm">{{item.name}}</div>
                    <div class="actual">
                        <a v-if="item.num" href="#" @click.prevent="showCarDetail(item)">{{item.num}}</a>
                        <span v-else>{{item.num}}</span>
                    </div>
                    <div class="bench">{{item.rate}}%</div>
                </div>
            </div>
        </div>
        <mt-datetime-picker
            ref="inventoryDetial"
            v-model="pickerVisible"
            type="date"
            year-format="{value} 年"
            month-format="{value} 月"
            @confirm="handleConfirm">
        </mt-datetime-picker>
    </div>
</template>

<script>
import {
    mapState,
    mapGetters,
    mapActions
} from 'vuex'
import Vue from 'vue'
import axios from 'axios'
import { DatetimePicker } from 'mint-ui'
import common from 'common/common'
import api from 'common/api'
import pageHeader from '@/components/header/PageHeader'
import VQuery from '@/components/dataReportFilter'
Vue.component(DatetimePicker.name, DatetimePicker)

export default {
    created() {
        this.dateMages = common.eleTimeFormatim1(new Date()).slice(0, 10)
        this.query.salesYear = this.dateMages.slice(0, 4)
        this.query.salesMonth = this.dateMages.slice(5, 7)
        this.dateMage = this.dateMages.slice(0, 4) + '年' + this.dateMages.slice(5, 7) + '月' + this.dateMages.slice(8, 10) + '日'
        this.query.stockCodes = [this.$route.query.storeCode]
        this.getInventoryData(this.query)
    },
    data: function() {
        return {
            pickerVisible: '',
            dateMage: '',
            reservoirAge: [],
            inventoryDays: {},
            stock_result: {},
            storeName: this.$route.query.storeName,
            query: {
                carBrandCode: '',
                carSeriesCode: '',
                scCode: '',
                stockCodes: [this.$route.query.storeCode],
                salesYear: '',
                salesMonth: ''
            }
        }
    },
    watch: {
        query: {
            handler: function(val) {
                this.getInventoryData(val)
            },
            deep: true
        }
    },
    methods: {
        queryData: function(val) {
            this.query.carBrandCode = val.carBrandCode
            this.query.carSeriesCode = val.carSeriesCode
            if (this.query.carBrandCode) {
                this.query.carBrandName = val.carBrandName
            }
            if (this.query.carSeriesCode) {
                this.query.carSeriesName = val.carSeriesName
            }
        },
        showPicker: function() {
            this.$refs.inventoryDetial.open()
        },
        handleConfirm: function() {
            this.dateMage = common.eleTimeFormatim1(this.pickerVisible).slice(0, 7)
            this.query.salesYear = this.dateMage.slice(0, 4)
            this.query.salesMonth = this.dateMage.slice(5, 7)
        },
        getInventoryData: function(val) {
            axios.all([this.queryReservoirAge(val), this.queryInventoryDays(val), this.orderInventory(val)])
                .then(axios.spread(function (acct, perms) {
                }))
        },
        queryReservoirAge: function(val) {
            let params = JSON.parse(JSON.stringify(this.query))
            api.board.queryReservoirAge(params, res => {
                if(res.data.code == 'success') {
                    this.reservoirAge = []
                    for(let i in res.data.obj) {
                        let obj = {
                            name: i,
                            num: res.data.obj[i].count,
                            rate: (Number(res.data.obj[i].count_rate)*100).toFixed(1),
                            cycleKey: res.data.obj[i].cycleKey
                        }
                        this.reservoirAge.push(obj)
                    }
                }
            })
        },
        orderInventory: function(val) {
            let params = JSON.parse(JSON.stringify(this.query))
            api.board.orderInventory(params, res => {
                if(res.data.code === 'success') {
                    if (res.data.obj) {
                        this.stock_result = {
                            name: '已订单库存',
                            actual: (Number(res.data.obj.stock_result.actual_rate)*100).toFixed(1) + '%',
                            bench: (Number(res.data.obj.stock_result.target_rate)*100).toFixed(1) + '%',
                            ranking: ''
                        }
                    } else {
                        this.stock_result = {
                            name: '已订单库存',
                            actual: '-',
                            bench: '-',
                            ranking: ''
                        }
                    }
                }
            })
        },
        queryInventoryDays: function(val) {
            let params = JSON.parse(JSON.stringify(this.query))
            api.board.inventoryDays(params, res => {
                if(res.data.code == 'success') {
                    if (res.data.obj) {
                        this.inventoryDays = {
                            name: '库存周转天数',
                            actual: res.data.obj.actual_count,
                            bench: res.data.obj.target_count,
                            ranking: res.data.obj.store_rank
                        }
                    } else {
                        this.inventoryDays = {
                            name: '库存周转天数',
                            actual: '-',
                            bench: '-',
                            ranking: '-'
                        }
                    }
                }
            })
        },
        showCarDetail: function(item) {
            let _this = this
            let car = {
                carBrandCode: _this.query.carBrandCode,
                carBrandName: _this.query.carBrandName, 
                carSeriesCode: _this.query.carSeriesCode,
                carSeriesName: _this.query.carSeriesName, 
                cycleKey: item.cycleKey,
                storeCode: this.$route.query.storeCode
            }
            _this.setCarInfo(car)
            _this.disabledSelectCarInfo()
            _this.hideBandAndSeriesCondition()
            _this.$router.push('/stockCarInfoList')
        },
        ...mapActions('carInfo', [
            'setCarInfo',
            'resetCarInfo',
            'hideBandAndSeriesCondition',
            'disabledSelectCarInfo'
        ])
    },
    components: {
        pageHeader,
        VQuery
    } 
}
</script>

<style lang="scss" scoped>
.inventory-detial {
    .mint-popup {
        .picker {
            .picker-items {
                .picker-slot:nth-child(3) {
                    display: none !important;
                }
            }
        }
    }
    .inventory-content {
        padding: 0 remp(20);
        padding-top: remp(10);
        .queryDetial {
            width: remp(335);
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            div {
                padding: 0 remp(10);
                margin-bottom: remp(10);
                height: remp(40);
                line-height: remp(40);
                border-radius: remp(4);
                color: #7E8387;
                font-size: remp(14);
                display: flex;
                justify-content: space-between;
                align-items: center;
                img {
                    width: remp(8);
                    height: remp(5);
                }
            }
            .inventory-store {
                width: remp(177);
            }
            .inventory-sc {
                width: remp(108);
            }
            .inventory-brand {
                width: remp(177);
            }
            .inventory-benchmarking {
                width: remp(108);
            }
        }
        .inventory-table-up {
            margin-top: remp(10); 
            .table-title {
                width: remp(335);
                height: remp(50);
                border-bottom: remp(1) solid #d5d5de;
                background-color: #f7f7f7;
                display: -webkit-flex;
                display: flex;
                div {
                    height: remp(50);
                    color: #333;
                    font-size: remp(14);
                    display: -webkit-flex;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 1
                }
                .norm {
                    flex: 2
                }
            }
            .table-body {
                width: remp(335);
                height: remp(40);
                border-bottom: remp(1) solid #d5d5de;
                background-color: #fff;
                display: -webkit-flex;
                display: flex;
                div {
                    height: remp(40);
                    color: #333;
                    font-size: remp(12);
                    display: -webkit-flex;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 1
                }
                .norm {
                    flex: 2
                }
            }
        }
        .inventory-table-down {
            margin-top: remp(10); 
            .table-title {
                width: remp(335);
                height: remp(50);
                border-bottom: remp(1) solid #d5d5de;
                background-color: #f7f7f7;
                display: -webkit-flex;
                display: flex;
                div {
                    height: remp(50);
                    color: #333;
                    font-size: remp(14);
                    display: -webkit-flex;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 1
                }
            }
            .table-body {
                width: remp(335);
                height: remp(40);
                border-bottom: remp(1) solid #d5d5de;
                background-color: #fff;
                display: flex;
                div {
                    height: remp(40);
                    color: #333;
                    font-size: remp(12);
                    display: -webkit-flex;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 1;
                    >a {
                        text-decoration: underline !important;
                    }
                }
            }
        }
    }
}
.inventoryDetial {
    height: remp(50);
    text-align: center;
    line-height: remp(50);
    font-size: remp(13);
    color: #333;
    img {
        width: remp(10);
        height: remp(6);
    }
}
</style>
