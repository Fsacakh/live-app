<template>
    <div>
        <page-header @on-click-right="more">
            <div slot>今日接待列表</div>
        </page-header>
        <div class="body">
            <div class="waits" v-if="passengerList.length!=0">
                <ul>
                    <li class="clearfix" v-for="(item, index) in passengerList" :key="index" @click="routerTo(item.leadCode, item.receptionCode)">
                        <div class="left fl">
                            <span class="color-scName">{{item.createByName!=null?item.createByName:'-'}}</span>
                            <i class="fr color-custName">{{item.receptionStartTime != null?item.receptionStartTime.slice(11, 16):'-'}}</i>
                        </div>
                        <div class="right fr">
                            <span class="fl color-scName">{{receptionType}}</span>
                            <div class="custom fl pr">
                                <div class="head fl">
                                    <headportrait :name="item.intentionLevelName" :sex="item.customGender"></headportrait>
                                </div>
                                <span class="username color-custName">{{item.customName != null?item.customName:'-'}}</span>
                            </div>
                        </div>
                    </li>
                    <!-- <li class="hint tc" v-if="passengerList.length == '0'">暂无接待信息</li> -->
                </ul>
            </div>
            <div v-if="passengerList.length == 0" class="no-sevice">
                <div v-if="showLoading">
                    <loading></loading>
                </div>
                <div v-else>
                    <no-data :imgUrl="imgUrl" title="暂无接待信息"></no-data>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import { mapState } from 'vuex'
    import api from "common/api.js"
    import config from 'common/config.js'
    import common from 'common/common.js'
    import PageHeader from "components/header/PageHeader"
    import headportrait from '@/components/headportrait/headportrait'
    import NoData from 'components/no-data/no-data'
    import loading from '@/components/loading/loading.vue'
    import Scroll from 'components/scroll/scroll'

    const base = process.env.NODE_ENV === 'development' ? '' : '/liveapp/'
    export default {
        components: {
            PageHeader,
            headportrait,
            NoData,
            loading,
            Scroll
        },
        data() {
            return {
                showLoading: true,
                passengerList: [],
                imgUrl: base + '/static/no-data (2).png',
                receptionType: "散客接待"
            }
        },
        created() {
            this.queryPassenger('', '')
        },
        computed: {
            ...mapState('homepage', [
                'loginInfo'
            ])
        },
        methods: {
            more: function() {},
            routerTo: function(leadCode, receptionCode) {
                // console.log(leadCode)
                if (!leadCode) {
                    this.$router.push({
                        path: '/customer-addclue'+'/normal:' + receptionCode
                    })
                } else {
                    this.$router.push({
                        path: '/customer-detail/' + leadCode + "/" + config.passagerFlag
                    })
                }
            },
            queryPassenger: function(pagestart, Fun) {
                const $this = this
                this.$store.dispatch('homepage/getLoginInfo', () =>{
                    // console.log($this.loginInfo)
                    let params = {
                        pageStart: pagestart,
                        pageNums: config.maxPageNums,
                        scCode: $this.loginInfo.empVo.empCode,
                        storeCode: $this.loginInfo.empVo.storeCode
                    }
                    api.passenger.queryPassenger(params, (res) => {
                        if(res.data.code=='success') {
                            let dataList = res.data.obj.list;
                            $this.passengerList = dataList
                            $this.showLoading = false;
                            // Fun(dataList)
                        }
                    })
                })
            },
        },
    }
</script>
<style lang="scss">
    .no-sevice {
        margin-top: 40%;
    }
    .waits li {
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: remp(45);
        line-height: remp(45);
        background: #fff;
        border-top: remp(1) solid #f0f2f5;
        padding: 0 remp(13);
    }
    .waits li>div {
        display: inline-block;
        width: 50%;
        height: 100%;
    }
    .waits li .left>* {
        display: inline-block;
        width: 49%;
    }
    .waits li .left>i {
        font-size: remp(13);
        color: #C0C3C5;
    }
    .head > .headimg{
        width: remp(27) !important;
        height: remp(27) !important;
    }
    .waits li .right>* {
        width: 45%;
        height: 100%;
    }
    .head {
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
    }
    .waits .hint {
        height: remp(48.5);
        line-height: remp(48.5);
        font-size: remp(13);
        color: rgb(126, 131, 135);
    }
    .username {
        display: inline-block;
        margin-left: remp(35);
        width: remp(70);
        overflow: hidden; 
        white-space: nowrap; 
        text-overflow: ellipsis;
    }
     .color-custName {
        color: rgb(126, 131, 135)
    }
    .color-scName {
        color: rgb(51, 51, 51)
    }
</style>