<template>
    <div class="board-inventory-box b-white"  @click="ToDetial">
        <!--   -->
        <h5>库存</h5>
        <div class="board-inventory-top">
            <div class="top-left">
                <span class="left-label">库存数</span>
                <span class="left-data">{{ invenall}}</span>
            </div>
            <div class="top-right">
                <b-chart ref="inventory" :ID="chartId" :chartData="inventoryChartData"></b-chart>
                <div class="chart-explain">
                    <div class="explain-up">
                        <span class="explain-icon">
                            <div></div>
                        </span>
                        <span class="explain-content">已订单库存</span>
                        <span class="explain-value">{{(Number((lockedInfo*100)).toFixed(0))}}%</span>
                    </div>
                    <div class="explain-down">
                        <span class="explain-icon">
                            <div></div>
                        </span>
                        <span class="explain-content">其他库存</span>
                        <span class="explain-value">{{(100-Number((lockedInfo*100)).toFixed(0))}}%</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="board-inventory-bottom">
            <div class="bottom-left">
                <div class="period">平均库存周期</div>
                <div class="amount">{{Number(invenDays).toFixed(0)}}{{'天'}}</div>
            </div>
            <div class="bottom-right">
                <div class="overdue">60天以上库存</div>
                <div class="amount">{{inven60}}</div>
            </div>
        </div>
    </div>
</template>

<script>
    import {mapActions, mapState, mapGetters} from 'vuex'
    import axios from 'axios'
    import BChart from './board-chart'
    export default {
        components: {
            BChart
        },
        data() {
           return {
               chartId: 'inventoryId',
               customerAmount: 23838,
               inventoryParams: {
                   storeCode: this.$route.query.storeCode,
                   storeName: ''
               },
               inventoryChartData: [
                    {bgcolor:'#FE691F',value:0},
                    {bgcolor:'#4D33EF',value:100},
               ]
           }
        },
        computed: {
            ...mapState('databoard', [
               'inventoryInfo',
               'inven60',
               'invenall',
               'lockedInfo',
               'invenDays',
               'isStore',
               'store',
               'time'
            ]),
            ...mapGetters('databoard', [
                'totalInStockNum',
                'outSixtyDayBussinesStockNum',
                'totalSalesOrderStockNum'
            ]),
        },
        mounted() {
            if (this.store && this.time) {
                this.getData(this.time, this.store.code, this.store.name)
            }
        },
        methods: {
            ...mapActions('carInfo', [
                'setStore'
            ]),
            ...mapActions('databoard', [
                'getInventoryInfo',
                'inventoryDays',
                'stockLockedInfo',
                'statistics',
                'queryPureStockInfoNums' 
            ]),
            ToDetial: function() {
                this.$router.push({
                    path: '/inventoryDetial',
                    query: {
                        storeCode: this.inventoryParams.storeCode,
                        storeName: this.inventoryParams.storeName
                    }
                })
            },
            getData: function(val, storeCode, storeName) {
                this.inventoryParams.storeCode = storeCode
                this.inventoryParams.startDate = val.startDate
                this.inventoryParams.endDate = val.endDate
                this.inventoryParams.storeName = storeName
                this.setStore({
                    code: storeCode,
                    name: storeName
                })
                axios.all([
                        this.inventoryDays({poros: {stockCodes:[storeCode]},
                            callBack: res => {
                                // console.log(this.invenDays)
                            }}),
                        this.stockLockedInfo({poros: {stockCodes:[storeCode]},
                            callBack: res => {
                                // console.log(this.lockedInfo)
                            }}),
                            // 新增
                        this.queryPureStockInfoNums({poros: {storeCode:storeCode,minLifeCycle: -1},
                        callBack: res => {

                        }}),
                        this.statistics({poros: {stockCodes:[storeCode],minLifeCycle: -1},
                            callBack: res => {
                                this.statistics({poros: {stockCodes:[storeCode],minLifeCycle: 61},
                                    callBack: res => {
                                        this.inventoryChartData[0].value = Number((this.lockedInfo*100)).toFixed(0)
                                        this.inventoryChartData[1].value = 100 - Number((this.lockedInfo*100)).toFixed(0)
                                    }})
                            }})
                    ])
                .then(axios.spread(function (acct, perms) {
                }))
            },
        },
    }
</script>

<style lang="scss" scoped>
    .board-inventory-box {
        width: 94.7%;
        height: remp(134);
        margin-top: remp(10);
        border-radius: remp(8);
        padding: remp(10);
        box-sizing: content-box;
        h5 {
            height: remp(22);
            line-height: remp(22);
            font-size: remp(16);
            color: #32383D;
        }
        .board-inventory-top {
            height: remp(56);
            padding: remp(5) 0;
            padding-bottom: remp(10);
            display: flex;
            border-bottom: 1px solid #E1E7F8;
            div {
                flex: 1;
            }
            .top-left {
                border-right: 0.5px solid #E6EAF0;
                display: flex;
                .left-label {
                    flex: 2;
                    color: #B1B1BD;
                    font-size: remp(14);
                    line-height: remp(42);
                }
                .left-data {
                    flex: 3;
                    height: remp(42);
                    color: #7396FF;
                    font-size: remp(30);
                    line-height: remp(42);
                }
            }
            .top-right {
                display:flex;
                padding-left: remp(10);
                .chart-explain {
                    flex:3;
                    align-self: center;
                    .explain-up{
                        margin-bottom:remp(5);
                    }
                    .explain-up, .explain-down{
                        overflow: hidden;
                        display:flex;
                        position: relative;
                        .explain-icon {
                            width: remp(8);
                            height: remp(8);
                            margin-right:remp(5);
                            align-self: center;
                            border-radius: remp(4);
                            background-color: #FE691F;
                        }
                        .explain-content {
                            font-size: remp(8);
                            color: #94969A;
                            align-self: center;
                            margin-right:remp(10)
                        }
                        .explain-value {
                            position: absolute;
                            right:0;
                            font-size: remp(8);
                            color: #FE691F;
                        }
                    }
                    .explain-down{
                        .explain-icon {
                            background-color: #4D33EF;
                        }
                        .explain-content {
                            color: #94969A;
                        }
                        .explain-value {
                            color: #4D33EF;
                        }
                    }
                }
            }
        }
        .board-inventory-bottom {
            display: flex;
            padding: remp(10);
            background-color: #FBFDFF;
            div {
                flex: 1;
                padding-left: remp(20);
                .period,.overdue {
                    color: #B6B6C2;
                    font-size: remp(12);
                    padding: 0;
                }
                .amount {
                    width: remp(104);
                    height: remp(20);
                    font-size: remp(14);
                    color: #5E7CD7;
                    background-color: #F6F8FE;
                    border-radius: remp(10);
                    padding: 0;
                }
            }
        }
    }
</style>
