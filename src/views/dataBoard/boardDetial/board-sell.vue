<template>
    <div class="board-sell-box b-white"  @click="ToDetial">
        <h5>销售</h5>
        <div class="board-sell-top">
            <div class="top-left">
                <span class="left-label">客流数</span>
                <span class="left-data">{{totalInStoreNum}}</span>
            </div>
            <div class="top-right">
                <b-chart ref="sell"  :ID="chartId" :chartData="sellChartData"></b-chart>
                <div class="chart-explain">
                    <div class="explain-up">
                        <span class="explain-icon">
                            <div></div>
                        </span>
                        <span class="explain-content">首次客流</span>
                        <span class="explain-value">{{(totalFistInStoreNum?totalFistInStoreNum:0)}}%</span>
                    </div>
                    <div class="explain-down">
                        <span class="explain-icon">
                            <div></div>
                        </span>
                        <span class="explain-content">再次客流</span>
                        <span class="explain-value">{{(100-(totalFistInStoreNum?totalFistInStoreNum:0))}}%</span>
                    </div>
                </div>
            </div>
        </div>
        <div class="board-sell-middle">
            <div class="middle-left">
                <span class="middle-label">报价数</span>
                <span class="middle-data">{{quoteNumInfo}}</span>
            </div>
            <div class="middle-center">
                <span class="middle-label">订单数</span>
                <span class="middle-data">{{orderNumInfo}}</span>
            </div>
            <div class="middle-right">
                <span class="middle-label">交车数</span>
                <span class="middle-data">{{deliveryNumInfo}}</span>
            </div>
        </div>
        <div class="board-sell-bottom">
            <div class="bottom-left">
                <span class="left-label">销售目标完成率</span>
                <span class="left-data" :style="{'color': planColor}">{{salesTargetPlanRate}}%</span>
            </div>
            <div class="bottom-right">
                <div class="right-plan">
                    <div class="plan-shade" :style="{ 'width': planValue + 'px', 'backgroundColor': planColor }"></div>
                </div>
                <div class="start-end">
                    <span class="left">{{'0%'}}</span>
                    <span class="right">{{'100%'}}</span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import {mapActions, mapState, mapGetters} from 'vuex'
import config from 'common/config'
import common from 'common/common'
import BChart from './board-chart'
import filters from 'common/filters'
export default {
    components: {
        BChart
    },
    data() {
        return {
            planValue: 0,
            salesTargetPlanRate: 0,
            chartId: 'sellChart',
            sellParams: {
                storeCode: this.$route.query.storeCode,
                storeName: '',
                startDate: '2017-11-01 00:00:00',
                endDate: '2018-03-01 00:00:00',
                // orderTypeCodes: ['NewCarOrderWfType'],
            },
            sellChartData: [
                {bgcolor:'#FE691F',value: 0},
                {bgcolor:'#4D33EF',value: 100},
            ]
        }
    },
    props: {
        dateMage: {
            type: String,
            default: common.eleTimeFormatim1(new Date()).slice(0, 7)
        }
    },
    computed: {
        ...mapState('databoard', [
            'sellInfo',
            'saleInfo',
            'isStore',
            'store',
            'time'
        ]),
        ...mapGetters('databoard', [
            'totalInStoreNum',
            'totalFistInStoreNum',
            'quoteNumInfo',
            'orderNumInfo',
            'deliveryNumInfo',
            'invoiceNumInfo'
        ]),
        planColor: function () {
            let grouter50 = '#64D0BB';
            let lessThan50 = '#DE1031';
            return this.salesTargetPlanRate >= 50 ? grouter50 : lessThan50
        },
    },
    mounted() {
        if (this.store && this.time) {
            this.getSellData(this.time, this.store.code, this.store.name)
        }
    },
    methods: {
        ...mapActions('databoard', [
            'getSellInfo',
            'getFlowInfo',
            'getSales',
            'saleMainData'
        ]),
        ToDetial: function() {
            this.$router.push({
                path: '/sellDetial',
                query: {
                    storeCode: this.sellParams.storeCode,
                    storeName: this.sellParams.storeName,
                    time: this.dateMage
                }
            })
        },
        routerTo: function(url, code) {
            this.$router.push({
                path: url + '/' + code
            })
        },
        flowData: function(val, storeCode) {
            let params = {
                storeCode: storeCode,
                startDate: this.sellParams.startDate,
                endDate: this.sellParams.endDate,
            }
            params.startDate = val.startDate
            params.endDate = val.endDate
            this.getFlowInfo({
                poros: params,
                callBack: res => {
                    this.$nextTick(cd => {
                        this.sellChartData[0].value = Number(this.totalFistInStoreNum).toFixed(0)
                        this.sellChartData[1].value = 100-Number(this.totalFistInStoreNum).toFixed(0)
                    })
                }
            })
        },
        getSalesInfo: function(val, storeCode) {
            let params = {
                storeCode: storeCode,
                startDate: this.sellParams.startDate,
                endDate: this.sellParams.endDate,
                orderTypeCodes: ['NewCarOrderWfType']
            }
            params.startDate = val.startDate
            params.endDate = val.endDate
            this.getSales({
                poros: params,
                callBack: res => {
                    let num = res.data.obj.salesTargetPlan
                    let val = (num == 0 ? 0 : (num == null ? 100 : (this.invoiceNumInfo/num * 100)))
                    this.salesTargetPlanRate = val.toFixed(0)
                    this.planValue = 136 * Number(this.salesTargetPlanRate)/100 <= 136 ? 136 * Number(this.salesTargetPlanRate)/100 : 136
                }
            })
        },
        orderNum: function(val, storeCode) {
            let _this = this
            let params = {
                monthStr: val.startDate.slice(5, 7),
                storeCodes: [storeCode],
                yearStr: val.startDate.slice(0, 4),
                postType: 1
            }
            this.getSellInfo({
                poros: params,
                callBack: res => {
                    _this.getSalesInfo(val, storeCode)
                }
            })
        },
        mainInfo: function(val, storeCode) {
            let params = {
                salesMonths: [val.startDate.slice(5, 7)],
                storeCode: storeCode,
                salesYear: val.startDate.slice(0, 4),
            }
            this.saleMainData({
                poros: params,
                callBack: res => {
                }
            })
        },
        getSellData: function(val, storeCode, storeName) {
            this.sellParams.storeCode = storeCode
            this.sellParams.storeName = storeName
            axios.all([this.flowData(val, storeCode), this.orderNum(val, storeCode), this.mainInfo(val, storeCode)])
            .then(axios.spread(function (acct, perms) {
                // console.log(this.salesTargetPlanRate)
            }))
        }
    },
    watch: {
       
    }
}
</script>

<style lang="scss" scoped>
.board-sell-box {
    width: 94.7%;
    height: remp(163);
    border-radius: remp(8);
    padding: remp(10);
    box-sizing: content-box;
    h5 {
        height: remp(22);
        line-height: remp(22);
        font-size: remp(16);
        color: #32383D;
    }
    .board-sell-top {
        display: flex;
        padding: remp(5) 0;
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
    .board-sell-middle {
        display: flex;
        padding: remp(5) 0;
        border-bottom: 1px solid #E1E7F8;
        div {
            flex: 1;
            display: flex;
            height: remp(30);
            span {
                flex: 1;
                text-align: center;
                font-size: remp(12);
                line-height: remp(30);
                color: #A5A5B5;
            }
            .middle-data {
                color: #000000;
            }
        }
        .middle-center {
            border-left: 0.5px solid #E6EAF0;
            border-right: 0.5px solid #E6EAF0;
        }
    }
    .board-sell-bottom {
        padding-top: remp(15);
        display: flex;
        div {
            flex: 1
        }
        .bottom-left {
            display: flex;
            .left-label {
                flex: 3;
                font-size: remp(14);
                color: #373844;
                height: remp(25);
                line-height: remp(25);
                font-weight: 600;
            }
            .left-data {
                flex: 2;
                height: remp(25);
                line-height: remp(25);
                font-size: remp(18);
                text-align: center;
                font-weight: 600;
            }
        }
        .bottom-right {
            .right-plan {
                width: 136px;
                height: remp(6);
                background-color: #f0f1f5;
                border-radius: remp(3);
                transform: translate(10%, 130%);
                .plan-shade {
                    // width: remp(30);
                    height: remp(6);
                    border-radius: remp(3);
                }
            }
            .start-end {
                display: flex;
                .left {
                    flex: 1;
                    color: #A5A5B5;
                    font-size: remp(8);
                    padding-left: remp(5);
                    transform: translateY(55%);
                }
                .right {
                    flex: 1;
                    text-align: right;
                    color: #A5A5B5;
                    font-size: remp(8);
                    transform: translateY(55%);
                    padding-right: remp(5);

                }
            }
        }

    }
}
</style>
