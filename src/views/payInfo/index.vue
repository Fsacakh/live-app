<template>
    <div>
        <page-header ref="header">
            <div slot> 报价单-支付信息</div>
        </page-header>
        <div class="bigContainer">
            <div class="container">
                <div class="titleLeft p-l-10">
                    <i></i>
                    <span>
                        收款相关
                    </span>
                </div>
                <div v-if="!(dataList.length > 0)" class="p-l-10">
                    暂无支付信息
                </div>
                <div class="payList">
                    <ul>
                        <template v-for="(item, index) in dataList">
                            <li>
                                <div class="p-l-20">
                                    <div class="yishou" :class="[{'payalready': item.payStatus === 1},{'tuialready': item.payStatus === -1}]">
                                        {{ item.payStatus === 1 ? item.paymentTypeName : '退款' }}
                                    </div>
                                    <div class="money">
                                        {{ item.payStatus === 1 ? '已收' : '已退' }}: ¥ {{ item.moneyPrice.toFixed(2) }}
                                    </div>
                                    <div class="time">
                                        {{ item.createTimeStr.substring(0, 16) }}
                                    </div>
                                </div>
                                <div class="p-l-20" v-if="GroupcustomizationValue === '000000'">
                                    <div class="time">
                                        收款内容: {{ item.remark }}
                                    </div>
                                </div>
                            </li>
                        </template>
                    </ul>
                </div>
            </div>
            <div v-if="dataList.length > 0" class="totalMoney m-t-20 p-l-20">
                总计: {{ totalMoney.toFixed(2) }}
            </div>
            <div class="container m-t-20">
                <div class="titleLeft p-l-10">
                    <i></i>
                    <span>
                        发票相关
                    </span>
                </div>
                <div v-if="!(ticketList.length > 0)" class="p-l-10">
                    暂无发票信息
                </div>
                <div class="ticketList">
                    <ul>
                        <li class="b-t p-l-10 p-r-10" v-for="(list, idx) in ticketList" :key="idx">
                            <div class="ticketName">
                                <!-- <span>{{ list.sourceSubOrderNo }}</span> -->
                                <span>{{ list.sourceSubOrderTypeName }}</span>
                                <span>发票总金额: {{ list.invoicePrice.toFixed(2) }}</span>
                            </div>
                            <div class="ticketNo">
                                发票号: <span>{{ list.invoiceNo }}</span>
                            </div>
                            <div v-if="list.refundInvoiceNo" class="backTicket">
                                已退票
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import config from '@/common/config.js'
    import PageHeader from "components/header/PageHeader"
    import api from 'common/api'
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
    export default {
        components: {
            PageHeader
        },
        data() {
            return {
                GroupcustomizationValue: '',
                tempObj: '',
                dataList: [],
                totalMoney: 0,
                ticketList: []
            }
        },
        computed: {
            ...mapState('order', [
                'order'
            ])
        },
        methods: {
            getData() {
                const _this = this
                let option = {
                    // 这里先写死   如果要根据订单查    可以直接把_this.tempObj 放进来
                    // 也就是说注释的交易单放开
                    sourceOrderNo: _this.order.orderNo,
                    isDeleted: '0',
                    pageNums: 100,
                    pageStart: 1
                }
                api.payInfo.queryPayInfo(option, function(res) {
                    if (res.data.code === 'success') {
                        _this.dataList = res.data.obj.list
                        _this.dataList.forEach(function(element) {
                            if (element.payStatus === 1) {
                                _this.totalMoney += element.moneyPrice
                            } else {
                                _this.totalMoney -= element.moneyPrice
                            }
                        })
                    }
                })
                api.payInfo.queryTicket(option, function(res) {
                    if (res.data.code === 'success') {
                        _this.ticketList = res.data.obj.list
                    }
                })
            },
            getDictionaryAboutCompany() {
                api.getDataDetails({
                    refDetailCode: config.configOfXuanyu.refDetailCode
                }).then((res) => {
                    if(res.data.code === 'success') {
                        this.GroupcustomizationValue = res.data.obj.refDetailValue
                    }
                })
            }
        },
        created() {
            const _this = this
            _this.getData()
            _this.getDictionaryAboutCompany()
        }
    }
</script>
<style lang="scss">
    .titleLeft {
        height: remp(33);
        line-height: remp(33);
    }
    .titleLeft i {
        display: inline-block;
        width: .05rem;
        height: .1rem;
        background-color: red;
    }
    .container {
        background-color: #fff;
    }
    .payList {
        ul {
            li {
                border-bottom: remp(1) solid rgb(240, 242, 245);
                div {
                    height: remp(40);
                    line-height: remp(40);
                    display: flex;
                    .yishou {
                        flex: 2;
                        overflow: hidden;
                    }
                    ;
                    .way {
                        flex: 2;
                        overflow: hidden;
                    }
                    ;
                    .money {
                        flex: 3;
                        overflow: hidden;
                    }
                    ;
                    .time {
                        flex: 3
                    }
                }
            }
        }
    }
    .totalMoney {
        background-color: #fff;
        height: remp(40);
        line-height: remp(40); // text-align: right;
    }
    .payalready {
        color: rgb(0, 140, 238)
    }
    .tuialready {
        color: rgb(126, 131, 135)
    }
    .bigContainer {
        overflow-y: auto;
    }
    .ticketList ul li {
        position: relative;
        height: remp(70);
    }
    .ticketList ul li div {
        height: remp(35);
        line-height: remp(35);
        font-size: remp(13);
        font-weight: normal !important;
        color: #585753;
    }
    .ticketList ul li div:first-child {
        display: flex;
    }
    .ticketList ul li div:first-child span:first-child {
        flex: 1
    }
    .ticketList ul li div:first-child span:last-child {
        flex: 2
    }
    .ticketList ul li div.backTicket {
        position: absolute;
        bottom: 0;
        right: remp(20); // transform: translate(0, -50%);
        color: rgba(254, 56, 36, 0.9);
        font-weight: bolder;
    }
</style>
