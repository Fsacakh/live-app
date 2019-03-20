<template>
    <div>
        <page-header>
            <div slot>待邀约客户</div>
        </page-header>
        <div class="wait-screen-warp-pjl">
            <screen ref="screen" @getValue="getValue" @cover="covershow"></screen>
        </div>
        <div class="wait-box">
            <Scroll :data="list" class="waitlist" :pullup="true" @scrollToEnd="scrollToEnd">
                <ul>
                    <li class="wait-item" v-for="(item, index) in list" :key="index" @click="inputCustomerDetail(item)">
                        <div class="wait-head fl pa">
                            <headportrait class="wait-ma" :sex="item.customGender" :name="item.intentionLevelName"></headportrait>
                        </div>
                        <div class="wait-content">
                            <div class="wait-left">
                                <h5 class="wait-name">{{item.customName}}</h5>
                                <p class="wait-intentionmodel wait-text-hide">
                                    {{
                                        item.intentionCarInfoVos == false ? '' : (item.intentionCarInfoVos && item.intentionCarInfoVos[0].carName) 
                                    }}
                                </p>
                                <p class="wait-lastTime">更新于：{{item.updateTimeStr}}</p>
                            </div>
                            <div class="wait-right">
                                <p class="wait-mobilePhone">{{item.mobilePhone}}</p>
                                <p class="wait-inviteStatus">
                                    <!-- item.leadsStstusCode == '1' ? '已预约'
                                        : (item.leadsStstusCode == '2' ? '待跟进'
                                        : (item.leadsStstusCode == '4' ? '到店'
                                        : (item.leadsStstusCode == '8' ? '试乘试驾'
                                        : '准战败'))) -->
                                    {{
                                        getStatus(item)
                                    }}
                                </p>
                            </div>
                        </div>
                    </li>
                    <p class="loading-text" v-show="showLoading">{{lodingText()}}</p>
                </ul>
            </Scroll>
        </div>
        <div v-show="!list.length && loadingNoData" class="no-data">
            <no-data :title="'暂无待邀约客户信息'"></no-data>
        </div>

        <div v-show="!list.length  && !loadingNoData" class="loading-container">
            <loading></loading>
        </div>
        <!-- 遮罩层 -->
        <div class="model-wait w h pf max-width " @touchmove.prevent v-if="cover" @click="coverclick">
        </div>
    </div>
</template>

<script>
import { mapState, mapActions, mapGetters } from "vuex";
import pageHeader from '@/components/header/PageHeader'
import headportrait from '@/components/headportrait/headportrait'
import Screen from "components/screen/screen";
import config from "@/common/config.js";
import common from "@/common/common";
import Scroll from '../scroll'
import BScroll from 'better-scroll'
import NoData from 'components/no-data/no-data'
import Loading from 'components/loading/loading'

 // const GIVE_CAR = '1'
const BEING_LOADING = '正在载入...'
const NO_MORE_DATA = '暂无更多数据'
export default {
    components: {
        pageHeader,
        headportrait,
        Screen,
        Scroll,
        NoData,
        Loading,
    },
    data() {
        return {
            query: {
                // marketName: '',
                marketCode: '',
                invitationStatus: '',
                relationTypeCode: 'ListRelationTypeMarket',
                pageNums: 10,
                pageStart: 1
            },
            pulldown: true,
            list: [],
            isLastPage: false,
            showLoading: false,
            loadingNoData: false,
            cover: false
        }
    },
    computed: {
        ...mapState('marketactivity', [
            'invitelList',
            'relationInfo'
        ])
    },
    mounted() {
        this.$nextTick(function() {
            document.getElementsByClassName("wait-screen-warp-pjl")[0].offsetHeight +
            "px";
        });
    },
    created() {
        // this.query.marketName = this.$route.query.marketName,
        this.query.marketCode = this.$route.query.marketCode,
        this.query.invitationStatus = this.$route.query.invitationStatus,
        this.queryDataInfo(1, res => {})
    },
    methods: {
        ...mapActions('marketactivity', [
            'queryInviteList',
            'custRelMarket'
        ]),
        getStatus(item) {
            if (item.defeatStatus == -1) {
                return '准战败'
            } else if (item.salesLeadsStatusInfoVos[0].tryDriveStatus > 0) {
                return '试乘试驾'
            } else if (item.inStoreFlag == 1) {
                return '到店'
            } else if (item.appointmentSubStatus > 0) {
                return '已预约'
            } else if (item.appointmentSubStatus <= 0) {
                return '待跟进'
            } else {
                return ''
            }
        },
        getValue(data) {
            if (data.length != 0) {
                let code = data[0].refCode;
                if (code == 1 || code == 3) {
                // 已预约
                for (let i = 0; i < data.length; i++) {
                    if (data[i].refCode == 1) {
                    this.query.leadsStstusCode = data[i].code;
                    } else if (data[i].refCode == 3) {
                    this.query.salesStstusCode = data[i].code;
                    }
                }
                } else if (code == 2) {
                // 意向车型
                this.query.brandCode = "";
                this.query.seriesCode = "";
                if (data[0].brandFlag) {
                    this.query.brandCode = data[0].code;
                } else {
                    this.query.seriesCode = data[0].code;
                }
                } else if (code == config.custom.like) {
                // 意向级别
                    this.query.intentionLevelCode = data[0].code;
                } else if (code == config.custom.canal) {
                // 渠道
                    this.query.channelCode = data[0].code;
                }
                this.queryDataInfo(1, res => {})
            }
        },
        covershow(cover) {
            this.cover = cover;
        },
        coverclick() {
            this.$refs.screen.showConclose();
        },
        queryDataInfo: function(start, callBack) {
            this.query.pageStart = start
            this.queryInviteList({
                poros: this.query,
                callBack: res => {
                    if(res.data.obj.list) {
                        this.loadingNoData = true
                    }
                    if (this.query.pageStart) {
                        this.list = []
                        let data = this.invitelList
                        this.list.push(...data)
                    } else {
                        callBack(res.data.obj)
                    }
                }
            })
        },
        lodingText() {
            if(this.showLoading && !this.noMore) {
                return BEING_LOADING
            }else if(this.showLoading && this.noMore) {
                return NO_MORE_DATA
            }
        },
        scrollToEnd: function() {
            this.showLoading = true
            if(!this.isLastPage) {
                let pageStart = 1;
                pageStart ++
                this.queryDataInfo(pageStart, (obj) => {
                    this.isLastPage = obj.isLastPage
                    this.list = this.list.concat(obj.list)
                })
            } else {
                this.noMore = true
            }
        },
        inputCustomerDetail: function(val) {
            let params = {
                    customCode: val.customCode,
                    mobilePhone: val.mobilePhone,
                    ownerSc: val.scCode,
                    storeCode: val.storeCode,
                    leadCode: val.leadCode,
                }
            this.custRelMarket({
                poros: params,
                callBack: res => {
                    this.$router.push({
                        path: `/customer-detail/${val.leadCode}/${config.customerFlag}`
                    })
                }
            })

        }
    }
}
</script>

<style lang="scss">
    .model-wait {
        top: 0;
        background: rgba(0, 0, 0, 0.4);
    }
    .wait-screen-warp-pjl {
        height: rem(80);
    }
    .wait-box {
        .loading-text {
            text-align: center;
            padding: remp(10) 0;
            color: #817F79;
        }
        .wait-item {
            position: relative;
            padding: remp(10) 0;
            padding-left: remp(65);
            border-bottom: 1px solid #ccc;
            overflow: hidden;
            .wait-head {
                width: remp(30) !important;
                height: remp(30) !important;
                left: remp(10);
                top: 40%;
                transform: translateY(-50%);
                .wait-ma.headimg p {
                    height: remp(7.8) !important;
                    font-size: remp(6) !important;
                    line-height: remp(7.8)!important;
                }
            }
            .wait-left {
                width: 60%;
                float: left;
                .wait-name {
                    font-size: remp(14);
                    padding-bottom: remp(10);
                }
                .wait-intentionmodel {
                    font-size: remp(14);
                    padding-bottom: remp(5);
                    color: #666;
                    width: 80%;
                    overflow: hidden;
                    text-overflow:ellipsis;
                    white-space: nowrap;
                }
                .wait-lastTime {
                    font-size: remp(12);
                    color: #999;
                }
            }
            .wait-right {
                position: relative;
                width: 40%;
                float: right;
                .wait-mobilePhone {
                    padding-bottom: remp(10)
                }
                .wait-inviteStatus {
                    display: inline-block;
                    white-space: nowrap;
                    position: absolute;
                    left: 50%;
                    transform: translateX(-50%);
                    padding: remp(3) remp(6);
                    border-radius: remp(3);
                    background-color: rgb(189, 199, 209);
                    color: #fff;
                }
            }
        }
        .wait-item:nth-last-child(1)  {
            border: none;
        }
    }

</style>
