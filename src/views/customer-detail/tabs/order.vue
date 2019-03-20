
<template>
<div class="order-box">
    <div class="order" v-show="orderlist.length">
        <scroll :data="orderlist" class="orderlist" :pullup="true" @scrollToEnd="scrollToEnd">
            <ul>
                <li class="p-l-20 p-r-20" v-for="(item, index) in orderlist" :key="index" @click="toOrder(item)">
                    <div class="item">
                        <p class="p1">
                            <span>报价单号 :&nbsp;</span>
                            <span>{{item.orderNo}}</span>
                        </p>
                        <p class="p2">
                            {{item.updateTimeStr | timeSubstring}}
                        </p>
                    </div>
                    <div class="item">
                        <p class="car-info">
                            <strong>
                                {{item.carOrderInfoVoList[0].carOrderDetailInfoList[0].carName}}
                            </strong>
                        </p>
                        <p class="order-status">
                            <span>{{orderStatus(item)}}</span>
                        </p>
                    </div>
                </li>
                <p class="loading-text" v-show="showLoading">{{lodingText()}}</p>
            </ul>
        </scroll>
    </div>
    <div v-show="!orderlist.length && loadingNoData" class="no-data">
        <no-data></no-data>
    </div>  

    <div v-show="!orderlist.length  && !loadingNoData" class="loading-container">
        <loading></loading>
    </div>

</div>
</template>

<script>
    import Loading from 'components/loading/loading'
    import Scroll from 'components/scroll/scroll'
    import NoData from 'components/no-data/no-data'
    import {mapGetters, mapMutations} from 'vuex'
    import api from 'common/api'
    import config from 'common/config'

    const PAGE_START = 1
    const PAGE_NUMS = config.pageNums
    const INTENTION_ORDER = 'NewCarIntentionOrderWfType'
    const ORDER = 'NewCarOrderWfType'
    const CONTRACT = 'NewCarContractWfType'  
    const UNSUBSCRIBE = 'NewCarRefuseWfType'
    // const GIVE_CAR = '1'
    const BEING_LOADING = '正在载入...'
    const NO_MORE_DATA = '暂无更多数据'
    export default {
        data() {
            return {
                orderlist: [],
                list: [],
                start: 1,
                isLastPage: false,
                // imgUrl: '/static/no-data.png',
                showLoading: false,
                noMore: false,
                loadingNoData: false
            }
        },
        mounted() {
            this.query()
        },
        computed: {
            ...mapGetters('customer', [
                'getCusLeadInfo'
            ])
        },       
        methods: { 
            orderStatus(item) {
                if(item.closingFlag === 1) {
                    return '交车'
                }else if(item.closingFlag === -1){
                    return '退车'
                }
                else if(item.carOrderInfoVoList[0].wfStatus === -1) {
                    return '待提交'
                }else if (item.carOrderInfoVoList[0].wfStatus === 0) {
                    return '审批中'
                }else if(item.carOrderInfoVoList[0].wfStatus === 1) {
                    if(item.carOrderInfoVoList[0].currentOrderWfTypeCode === INTENTION_ORDER) {
                        return '意向单'
                    }else if(item.carOrderInfoVoList[0].currentOrderWfTypeCode === ORDER) {
                        return '订单'
                    }else if(item.carOrderInfoVoList[0].currentOrderWfTypeCode === CONTRACT) {
                        return '合同'
                    }else if(item.carOrderInfoVoList[0].currentOrderWfTypeCode === UNSUBSCRIBE) {
                        return '退订'
                    }
                }
            },
            query() {
                this._getOrderList(PAGE_START, (obj) => {
                    if(!obj.list.length) {
                        this.loadingNoData = true
                    }
                    this.orderlist = obj.list
                    this.isLastPage = obj.isLastPage
                })
            },
            scrollToEnd() {
                this.showLoading = true
                if(!this.isLastPage) {
                    this.start++
                    this._getOrderList(this.start, (obj) => {
                        this.isLastPage = obj.isLastPage
                        let list = obj.list
                        this.orderlist = this.orderlist.concat(list)
                    })
                }else {
                    this.noMore = true
                }
            },
            lodingText() {
                if(this.showLoading && !this.noMore) {
                    return BEING_LOADING
                }else if(this.showLoading && this.noMore) {
                    return NO_MORE_DATA
                }
            },
            _getOrderList(start, success) {
                let params = {
                    leadCode: this.getCusLeadInfo.leadCode,
                    customCode: this.getCusLeadInfo.customCode,
                    pageStart: start,
                    pageNums: PAGE_NUMS
                }
                api.clearingsettlement.order.queryOrderInfoVos(params, (res) => {
                    if(res.data.code === 'success') {
                        success(res.data.obj)
                    }
                })
            },
            toOrder(item) {
                this.setModelInfo(item)
                this.$router.push({ name: 'order', params: { orderNo: item.orderNo }})
                // this.$router.push({
                //     path: `/order/${item.orderNo}`
                // })
                // console.info(this.$router)
            },
            ...mapMutations({
                setModelInfo: 'customer/SET_MODEL_INFO'
            })
        },
        filters: {
            timeSubstring(val) {
                 return val.substring(0, 16)
            }
        },
        components: {
            Scroll,
            NoData,
            Loading
        }
    };
</script>

<style lang="scss" scoped>
.order-box {
    position: relative;
    background-color: #EDEEF1;
    padding-top: remp(80);
    width: remp(375);
    height: 100%;
    .no-data {
        margin: 0 auto;
        width: remp(215);
        // height: remp(140);
        .img {
            width: remp(215);
            height: remp(130);
            background-image: url('/static/no-data.png');
            background-size: 100%;
        }
        p {
            font-size: remp(13);
            color: #BFC8CC;
            text-align: center;
            margin-top: remp(21);
        }
    }
}
    .order {
        position: fixed;
        -webkit-transform: translateZ(0);
        width: remp(375);
        top: remp(238);
        bottom: 0;
        .orderlist {
            height: 100%;
            overflow: hidden;
            padding-right: 0 !important;
            .loading-text {
                text-align: center;
                padding: remp(10) 0;
                color: #817F79;
            }
            ul li {
                background-color: #ffffff !important;
                border-bottom: remp(2) solid #F0F2F4 !important;
                padding: remp(16) remp(20);
                .item {
                    display: flex;
                    padding-bottom: remp(8);
                    color: #7C817F;
                    font-size: remp(12);
                    .p1 {
                        flex: 2;
                    }
                    .p2 {
                        flex: 1;
                    }
                }
                .item {
                    .car-info {
                        flex: 2;
                        font-size: remp(14);
                        color: #343535;
                        word-break: break-all;
                    }
                    .order-status {
                        flex: 1
                    }
                }
                div:nth-child(2) p:nth-child(2) span {
                    display: inline-block;
                    height: rem(40);
                    width: rem(120);
                    background-color: #BFC8CD;
                    line-height: rem(40);
                    text-align: center;
                    color: #fff;
                    border-radius: remp(3);
                    font-size: remp(12);
                }
            }
        }
    }
    .orderlist ul li div:nth-child(1) p:nth-child(2) {
        text-align: right;
    }
    .orderlist ul li div:nth-child(2) p:nth-child(2) {
        text-align: right;
    }

    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
