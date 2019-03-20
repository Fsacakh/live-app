<template>
    <div class="board-gain-box b-white">
        <div class="board-gain-head">
            <h5 @click="ToDetial">盈收</h5>
            <div class="ticketab">
                <span :class="{selactive: isSel}" @click="ticControl('ticket')">本月开票收入</span>
                <span :class="{selactive: !isSel}" @click="ticControl('unTicket')">未开票订单金额</span>
            </div>
        </div>
        <div class="board-gain-top" @click="ToDetial">
            <div class="top-right">
                <span class="money-icon">￥</span>
                <span class="money-amount" v-if="isSel">{{carBrandAndModelPriceInfoVos}}</span>
                <span class="money-amount" v-else>{{carBrandAndModelPriceInfoVosUnTicket}}</span>                
            </div>
        </div>
        <!-- GP显示 -->
        <div class="board-gain-bottom" v-show="isSel" @click="ToDetial">
            <template v-for="(gpGroup, index) in GPMap">
                <div class="bottom-up" :key="index">
                    <div class="up-left">
                        <span class="left-label">{{ gpGroup[0] ? gpGroup[0].title : '' }}</span>
                        <span class="left-data">{{ gpGroup[0] ? gpGroup[0].value : '' }}</span>
                    </div>
                    <div class="up-left">
                        <span class="left-label">{{ gpGroup[1] ? gpGroup[1].title : '' }}</span>
                        <span class="left-data">{{ gpGroup[1] ? gpGroup[1].value : '' }}</span>
                    </div>
                    <div class="up-left">
                        <span class="left-label">{{ gpGroup[2] ? gpGroup[2].title : '' }}</span>
                        <span class="left-data">{{ gpGroup[2] ? gpGroup[2].value : '' }}</span>
                    </div>
                </div>
            </template>
        </div>
        <div class="board-gain-bottom" v-show="!isSel">
            <template v-for="(gpGroup, i) in GPMapUnTicket">
                <div class="bottom-up" :key="i">
                    <div class="up-left">
                        <span class="left-label">{{ gpGroup[0] ? gpGroup[0].title : '' }}</span>
                        <span class="left-data">{{ gpGroup[0] ? gpGroup[0].value : '' }}</span>
                        <!-- <div><input v-model="gpGroup[0].value" readonly></input></div> -->
                    </div>
                    <div class="up-left">
                        <span class="left-label">{{ gpGroup[1] ? gpGroup[1].title : '' }}</span>
                        <span class="left-data">{{ gpGroup[1] ? gpGroup[1].value : '' }}</span>
                        <!-- <div><input v-model="gpGroup[1].value" readonly></input></div> -->
                    </div>
                    <div class="up-left">
                        <span class="left-label">{{ gpGroup[2] ? gpGroup[2].title : '' }}</span>
                        <span class="left-data">{{ gpGroup[2] ? gpGroup[2].value : '' }}</span>
                        <!-- <div><input v-model="gpGroup[2].value" readonly></input></div> -->
                    </div>
                </div>
            </template>
        </div>
    </div>
</template>

<script>
    import {
        mapActions,
        mapState,
        mapGetters
    } from 'vuex'
    import common from 'common/common'
    import filters from 'common/filters'
    export default {
        data() {
            return {
                customerAmount: 12787089.56,
                paramsGain: {
                    storeCode: this.$route.query.storeCode,
                    storeName: '',
                    startDate: "2017-11-01 00:00:00",
                    endDate: "2018-03-01 00:00:00"
                },
                isSel: true
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
                'gainInfo',
                'store',
                'time'
            ]),
            ...mapGetters('databoard', [
                'carBrandAndModelPriceInfoVos',
                'GPMap',
                'carBrandAndModelPriceInfoVosUnTicket',
                'GPMapUnTicket'
            ]),
            customer: function() {
                return filters.toThousands(this.customerAmount)
            }
        },
        mounted() {
            if (this.store && this.time) {
                this.getGainData(this.time, this.store.code, this.store.name)
            }
        },
        methods: {
            ...mapActions('databoard', [
                'getGainInfo',
                'getGPInfo',
                'getGainInfoUnTicket',
                'getGPInfoUnTicket'
            ]),
            ToDetial: function() {
                if(this.isSel){
                    this.$router.push({
                        path: '/gainDetial',
                        query: {
                            storeCode: this.paramsGain.storeCode,
                            storeName: this.paramsGain.storeName,
                            time: this.dateMage
                        }
                    })
                }
            },
            getGainData: function(val, storeCode, storeName) {
                this.paramsGain.storeCode = storeCode
                this.paramsGain.storeName = storeName
                this.paramsGain.startDate = val.startDate
                this.paramsGain.endDate = val.endDate
                this.getGainInfo({
                    poros: this.paramsGain,
                    callBack: res => {
                        // console.log(res)
                    }
                })
                let params = {
                    salesMonth: val.startDate.slice(5, 7),
                    storeCode: storeCode,
                    salesYear: val.startDate.slice(0, 4),
                }
                this.getGPInfo({
                    poros: params,
                    callBack: res => {
                        // console.log(res)
                    }
                })
            },
            getGainUnTicketData: function(val, storeCode, storeName) {
                // this.paramsGain.storeCode = storeCode
                let params = {
                    salesMonthStart: val.startDate,
                    salesMonthEnd: val.endDate,
                    storeCode: storeCode,
                }
                this.getGainInfoUnTicket({
                    poros: params,
                    callBack: res => {
                        // console.log(res)
                    }
                })
            
                this.getGPInfoUnTicket({
                    poros: params,
                    callBack: res => {
                        // console.log(res)
                    }
                })

            },
            ticControl(data){
                this.isSel = data == 'ticket' ? true : false
                this.$emit('isSel',this.isSel)
                if(data == 'ticket'){     //本月开票订单收入 
                    if (this.store && this.time) {
                        this.getGainData(this.time, this.store.code, this.store.name)
                    }
                }else{                    //未开票订单金额
                    if (this.store) {
                        this.getGainUnTicketData(this.time, this.store.code, this.store.name)
                    }
                }
            }
        },
    }
</script>

<style lang="scss">
    .board-gain-box {
        width: 94.7%;
        max-height: remp(165);
        margin-top: remp(10);
        border-radius: remp(8);
        padding: remp(10);
        box-sizing: content-box;
        .board-gain-head{
            height: remp(24);
            margin-bottom: remp(10);
            position: relative;
            h5 {
                height: remp(24);
                line-height: remp(24);
                padding-bottom: remp(22);
                font-size: remp(16);
                color: #32383D;
                width: 20%;
            }
            .ticketab{
                position: absolute;
                right: 0;
                top: 0;
                width: 70%;
                height: remp(24);
                background: #EAEAEA;
                border-radius: remp(3);
                display: flex;
                span{
                    flex: 1;
                    display: inline-block;
                    height: remp(24);
                    text-align: center;
                    line-height: remp(25);
                    font-size: remp(12);
                }
                .selactive{
                    border-radius: remp(3);
                    background: #1B9CFF;
                    color: #ffffff;
                }
            }
        }
        .board-gain-top {
            padding-bottom: remp(10);
            .top-right {
                padding: remp(7) remp(10);
                background-color: #F6F8FE;
                border-radius: remp(8);
                .money-icon {
                    padding-right: remp(10);
                    width: remp(15);
                    height: remp(32);
                    line-height: remp(32);
                    font-size: remp(24);
                    color: #5F7AD8;
                }
                .money-amount {
                    height: remp(32);
                    line-height: remp(32);
                    font-size: remp(24);
                    color: #63637E;
                }
            }
        }
        .board-gain-bottom {
            padding: remp(5) 0;
            overflow: hidden;
            max-height: remp(54);
            .bottom-up {
                display: flex;
                border-bottom: remp(1) solid #E1E7F8;
                overflow: hidden;
                .up-left {
                    width: 33%;
                    display: flex;
                    span {
                        padding-bottom: remp(5);
                    }
                    .left-label {
                        flex: 2;
                        padding-left: remp(10);
                        padding-right: remp(10);
                        font-size: remp(12);
                        color: #666680;
                    }
                    .left-data {
                        flex: 3;
                        font-size: remp(12);
                        padding-right: remp(10);
                        color: #6682DA;
                    }
                }
                .up-left {
                    border-right: remp(1) solid #E1E7F8;
                }
                .up-left:last-child {
                    border-right: 0;
                }
               
            }
            .bottom-up:last-child {
                border-bottom: 0;
            }
            
            .bottom-down {
                display: flex;
                div {
                    width: 33%;
                    display: flex;
                    span {
                        padding-top: remp(6);
                    }
                    .left-label {
                        flex: 2;
                        padding-left: remp(10);
                        font-size: remp(12);
                        color: #666680;
                    }
                    .left-data {
                        flex: 3;
                        font-size: remp(12);
                        color: #6682DA;
                        text-align: center;
                    }
                }
                .up-center {
                    border-left: remp(1) solid #E1E7F8;
                    border-right: remp(1) solid #E1E7F8;
                }
            }
        }
    }
</style>
