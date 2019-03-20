
<template>
    <div class="">
        <div class="popup-warp-pjl  pr">
            <page-header ref="header" :leftOptions="leftOptions" :rightOptions="rightOptions" title="线索分配" @on-click-right="more">
                <div slot="right">
                    <span class="iconfont sousuo icon-icon-sousuo"></span>
                </div>
            </page-header>
        </div>
        <div id="customer-center-list">
            <irisScroll v-if="!(dataList.length==0)" ref="scroll" :dropdown="dropdown">
                <ul class="list" slot="list">
                    <div @click="tocustomdetail(item)" class="customer-list-box" v-for="item in dataList">
                        <div class="customer-img">
                            <head-portrait :name="item.intentionLevelName" :badge='badge' :sex="item.sex"></head-portrait>
                        </div>
                        <div class="customer-info">
                            <div class="info-head">
                                <span>{{item.customName}}</span>
                                <span>{{item.phone}}</span>
                            </div>
                            <div class="info-con">
                                <div class="content-joly">
                                    <p class="main-info">{{item.displayName}}</p>
                                    <p class="date">备注：{{item.date}}</p>
                                </div>
                                <div class="btn-box">
                                    <div>{{item.status}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ul>
            </irisScroll>
            <div v-if="(dataList.length==0)" class="no-sevice-pjl">
                <no-data title="暂无数据"></no-data>
            </div>
        </div>
        <!-- 遮罩层 -->
        <div class="model-pjl w h pf max-width " @touchmove.prevent v-if="cover" @click="coverclick">
        </div>
    </div>
</template>

<script>
    import PageHeader from 'components/header/PageHeader'
    import Screen from 'components/screen/screen'
    import CustomerList from 'components/customer-list/customer-list'
    import api from '@/common/api.js'
    import config from '@/common/config.js'
    import common from '@/common/common'
    import HeadPortrait from 'components/headportrait/headportrait'
    import irisScroll from '@/components/iris-scroll/'
    import NoData from 'components/no-data/no-data'
    import {
        mapState,
        mapGetters,
        mapActions,
        mapMutations
    } from 'vuex'
    export default {
        components: {
            PageHeader,
            Screen,
            CustomerList,
            HeadPortrait,
            irisScroll,
            NoData
        },
        computed: {
        },
        data() {
            return {
                rightOptions: {
                    showMore: true
                },
                dataList: [],
                params: {
                    pageNums: config.pageNums,
                    pageStart: 1,
                },
                level: "A级",
                badge: null,
                loading: true,
                pages: 1,
                leftOptions: {
                    icon: '',
                },
                cover: false,
                getLoginInfo: null,
                storeCode: null,
            }
        },
        methods: {
            ...mapActions('customercenter', [
                'screeningconditionsEMP'
            ]),
            more() {
                this.$router.push({
                    path: `/reapportion-search`
                })
            },
            query() {
                this.dataList = []
                this.params.pageStart = 1
                this.params.scCode = this.empCode
                api.customercenter.querycustomercenter(this.params, (msg) => {
                    if (msg.data.message == 'success') {
                        let list = msg.data.obj.list
                        if (list.length == 0) {
                            this.dataList = list
                        } else {
                            this.pages = msg.data.obj.pages
                            let list = msg.data.obj.list
                            this.handleData(list, 0)
                        }
                    }
                })
            },
            tocustomdetail(item) {
                // add by lwx on 2018/01/12
                this.setCurrentTabIndex(0)
                this.setCurrentTabContent('clueinfo')

                this.$router.push({
                    path: `/customer-detail/${item.leadCode}/${config.customerFlag}`
                })
            },
            loaddata() {
                let number = this.dataList.length
                this.params.scCode = this.empCode
                api.reapportion.queryReapportion(this.params, (msg) => {
                    if (msg.data.message == 'success') {
                        this.pages = msg.data.obj.pages
                        let list = msg.data.obj.list
                        if (list.length == 0) {
                            this.callback && this.callback('暂无更多数据')
                        }
                        this.handleData(list, number)
                    }
                })
            },
            handleData(list, number) {
                for (let index = 0; index < list.length; index++) {
                    this.$set(this.dataList, number + index, {
                        customName: list[index].customName,
                        level: list[index].intentionLevelName,
                        sex: list[index].customGender,
                        phone: list[index].mobilePhone,
                        date: list[index].remark,
                        status: 'CRM分配',
                        leadCode: list[index].leadCode,
                        intentionLevelName: list[index].intentionLevelName,
                        displayName: list[index].intentionCarInfoVos[0] && list[index].intentionCarInfoVos[0].carName
                    })
                }
            },
            coverclick() {
                this.$refs.screen.showConclose()
            },
            dropdown(callback) {
                this.callback = callback
                if (!(this.params.pageStart > this.pages)) {
                    return new Promise((resolve, reject) => {
                        this.params.pageStart++;
                        this.loaddata()
                        resolve()
                    })
                } else {
                    this.callback && this.callback('暂无更多数据')
                    return new Promise((resolve) => {
                        resolve()
                    })
                }
            },
            // add by lwx on 2018/01/12
            ...mapMutations({
                setCurrentTabIndex: "customer/SET_CURRENT_TAB_INDEX",
                setCurrentTabContent: "customer/SET_CURRENT_TAB_CONTENT"
            })
        },
        mounted() {
            this.$parent.loading = false
            this.$nextTick(function() {
                document.getElementById('customer-center-list').style.height = document.getElementById('app').offsetHeight - this.$refs.header.$el.offsetHeight + 'px'
                document.addEventListener('click', () => {
                    this.popupVisible = false
                })
            })
            this.loaddata()
        }
    }
</script>

<style lang="scss">
    .sousuo {
        font-size: remp(50);
    }
    .customer-list-box {
        display: -webkit-flex; // width: 100%;
        // height: rem(176);
        background-color: #fff;
        padding: rem(28) rem(40);
        border: 1px solid #f0f2f5;
    }
    .customer-img {
        position: relative;
        display: -webkit-flex;
        align-items: center;
        width: rem(90);
        height: rem(90);
    }
    .level {
        position: absolute;
        left: -2px;
        bottom: 2px;
        width: rem(90);
        height: rem(28);
        font-size: 9px;
        text-align: center;
        line-height: 9px;
        color: #ffffff;
    }
    .customer-img img {
        width: rem(90);
        height: rem(90);
    }
    .customer-info {
        flex: 1;
        padding-left: rem(40);
    }
    .info-head {
        display: -webkit-flex;
        justify-content: space-between;
        font-family: PingFangSC-Medium;
        font-size: 14px;
        color: #333333;
        letter-spacing: -0.36px;
        line-height: rem(30);
        padding-bottom: rem(10);
    }
    .info-con {
        display: -webkit-flex;
        justify-content: space-between;
    }
    .main-info {
        font-size: 12px;
        color: #7e8387;
        width: 100%;
    }
    .date {
        margin-top: rem(8);
        font-size: 12px;
        color: #7e8387;
    }
    .content-joly {
        width: 75%;
    }
    .btn-box {
        display: -webkit-flex;
        width: 25%;
        align-items: center;
    }
    .btn-box>div {
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
        background: #bdc7d1;
        border-radius: 3px;
        width: rem(130);
        height: rem(40);
        color: #fff;
        font-size: 12px;
    }
    .triangle-pjl {
        color: #fff;
        font-size: remp(14);
        top: remp(-8);
        left: remp(8);
    }
    p>a {
        color: #000 !important;
    }
    .popup-pjl {
        bottom: remp(-90) !important;
        left: remp(10) !important;
    }
    .triangle-pjl {
        top: remp(-8) !important;
        left: remp(8) !important;
    }
    .model-pjl {
        top: 0;
        background: rgba(0, 0, 0, 0.4);
    }
    .add-pjl {
        font-size: remp(30);
    }
    .shaixuan {
        font-size: remp(30);
    }
    .load-pjl {
        margin-top: remp(100);
    }
    .no-sevice-pjl {
        padding-top: 100px;
        box-sizing: border-box;
    }
    .xialashouqi {
        margin-left: 10px;
        font-size: rem(.2);
    }
</style>