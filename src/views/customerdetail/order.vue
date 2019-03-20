
<template>
    <div class="">
        <div class="orderTicket status">
            <ul>
                <li class="p-l-20 p-r-20">
                    <div>
                        <p>
                            <span>报价单号</span>
                            <span>20176474721</span>
                        </p>
                        <p>
                            2018-10-11 10:23
                        </p>
                    </div>
                    <div>
                        <p>
                            <span>C180K</span>
                        </p>
                        <p>
                            <span>新车报价</span>
                        </p>
                    </div>
                </li>
                <li class="p-l-20 p-r-20" v-for="(item,index) in orderlist" :key="index">
                    <div>
                        <p>
                            <span>报价单号</span>
                            <span>{{item.orderNo}}</span>
                        </p>
                        <p>
                            2018-10-11 10:23
                        </p>
                    </div>
                    <div>
                        <p>
                            <span>{{item.carDisplayName}}</span>
                        </p>
                        <p>
                            <span>新车报价</span>
                        </p>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {mapGetters} from 'vuex'
    import api from 'common/api'
    import config from 'common/config'
    const PAGE_START = 1
    const PAGE_NUMS = config.pageNums

    export default {
        data() {
            return {
                orderlist: []
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
            query() {
                let params = {
                    leadCode: this.getCusLeadInfo.leadCode,
                    customCode: this.getCusLeadInfo.customCode,
                    pageStart: PAGE_START,
                    pageNums: PAGE_NUMS
                }
                api.clearingsettlement.order.queryOrderInfoVos(params, (res) => {
                    if(res.data.code === 'success') {
                        this.orderlist = res.data.obj.list
                    }
                })
            }
        }
    };
</script>

<style lang="scss">
    .orderTicket {
        padding-right: rem(0) !important;
    }
    .orderTicket ul li {
        background-color: #ffffff !important;
        border-bottom: rem(2) solid #f0f2f5 !important;
    }
    .orderTicket ul li div {
        // flex: 1
        padding-top: rem(15);
        padding-bottom: rem(15);
        display: flex;
    }
    .orderTicket ul li div p {
        flex: 1;
    }
    .orderTicket ul li div:nth-child(1) p:nth-child(2) {
        text-align: right;
    }
    .orderTicket ul li div:nth-child(2) p:nth-child(2) {
        text-align: right;
    }
    .orderTicket ul li div:nth-child(2) p:nth-child(2) span {
        display: inline-block;
        height: rem(40);
        width: rem(120);
        background-color: red;
        line-height: rem(40);
        text-align: center;
        color: #ffffff;
        border-radius: rem(5);
    }
</style>
