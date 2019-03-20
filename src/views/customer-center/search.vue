<template>
    <div>
        <div class="search-header-warp" ref="searchHeader">
            <div class="search-header">
                <div class="search">
                    <input type="search" placeholder="请输入手机号／客户姓名" @change="query" v-model="params.keyword" style="text-align: left;">
                    <!-- <div class="clear" @click="clear"></div> -->
                </div>
                <div class="cancel" @click="cancel">取消</div>
            </div>
        </div>
        <div class="detail-box" id="detail-box">
            <irisScroll ref="scroll" :dropdown="dropdown">
                <ul class="list" slot="list">
                    <div @click="tocustomdetail(item)" class="customer-list-box" v-for="(item,index) in dataList" :key="index">
                        <div class="customer-img">
                            <head-portrait :name="item.level" :badge='badge' :sex="item.sex"></head-portrait>
                        </div>
                        <div class="customer-info">
                            <div class="info-head">
                                <span>{{item.customName}}</span>
                                <span>{{item.phone}}</span>
                            </div>
                            <div class="info-con">
                                <div>
                                    <p class="main-info">{{item.car}}</p>
                                    <p class="date">更新于{{item.date}}</p>
                                </div>
                                <div class="btn-box">
                                    <div>{{item.status}}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </ul>
            </irisScroll>
        </div>
    </div>
</template>
<script>
    import CustomerList from 'components/customer-list/customer-list'
    import HeadPortrait from 'components/headportrait/headportrait'
    import api from '@/common/api.js'
    import config from '@/common/config.js'
    import Loading from 'components/loading/loading'
    import irisScroll from '@/components/iris-scroll/'
    import {
        mapState,
        mapGetters,
        mapActions,
        mapMutations
    } from 'vuex'
    export default {
        components: {
            CustomerList,
            HeadPortrait,
            Loading,
            irisScroll
        },
        computed: {
            ...mapState("customercenter", ['empCode', 'empName'])
        },
        data() {
            return {
                dataList: [],
                badge: null,
                loading: true,
                pages: 1,
                pageStart: 0,
                pageNums: 10,
                params: {
                    keyword: ""
                },
            }
        },
        methods: {
            clear() {
                this.params.keyword = '';
            },
            cancel() {
                this.$router.push({
                    path: '/customer-center'
                })
            },
            query() {
                this.dataList = []
                this.pageStart = 0
                this.params.pageNums = this.pageNums
                this.params.pageStart = this.pageStart
                this.params.scCode = this.empCode
                api.customercenter.querycustomercenter(this.params, (msg) => {
                    if (msg.data.message == 'success') {
                        this.dataList = []
                        let list = msg.data.obj.list
                        if (list.length == 0) {
                            this.dataList = list
                        } else {
                            this.handleData(list, 0)
                        }
                    }
                })
            },
            handleData(list, number) {
                if (list.length == 0) {
                    this.callback && this.callback('暂无更多数据')
                }
                for (let index = 0; index < list.length; index++) {
                    for (var iable in list[index]) {
                        var status;
                        if (list[index].defeatStatus < 0) {
                            // 战败
                            status = '准战败'
                            break;
                        } else if (list[index].salesLeadsStatusInfoVos && list[index].salesLeadsStatusInfoVos[0] && list[index].salesLeadsStatusInfoVos[0].tryDriveStatus > 0) {
                            // 试乘试驾
                            status = '试乘试驾'
                            break;
                        } else if (list[index].inStoreFlag > 0) {
                            // 到店
                            status = '到店'
                            break;
                        } else if (list[index].appointmentSubStatus > 0) {
                            // 已预约
                            status = '已预约'
                            break;
                        } else if (list[index].appointmentSubStatus <= 0) {
                            // 待跟进
                            status = '待跟进'
                            break;
                        }
                    }
                    this.$set(this.dataList, number + index, {
                        customName: list[index].customName,
                        level: list[index].intentionLevelName,
                        sex: list[index].customGender,
                        phone: list[index].mobilePhone,
                        car: list[index].intentionCarInfoVos && list[index].intentionCarInfoVos[0] && list[index].intentionCarInfoVos[0].carName,
                        date: list[index].updateTimeStr,
                        status: status,
                        leadCode: list[index].leadCode
                    })
                }
            },
            dropdown(callback) {
                this.callback = callback
                if (!(this.pageStart > this.pages)) {
                    return new Promise((resolve, reject) => {
                        this.pageStart++;
                        this.params.pageNums = this.pageNums
                        this.params.pageStart = this.pageStart
                        api.customercenter.querycustomercenter(this.params, (msg) => {
                            if (msg.data.message == 'success') {
                                let list = msg.data.obj.list
                                if (list.length == 0) {
                                    this.dataList = list
                                } else {
                                    this.handleData(list, this.dataList.length)
                                }
                            }
                        })
                        resolve()
                    })
                } else {
                    this.callback && this.callback('暂无更多数据')
                    return new Promise((resolve) => {
                        resolve()
                    })
                }
            },
            tocustomdetail(item) {
                // add by lwx on 2018/01/12
                this.setCurrentTabIndex(0)
                this.setCurrentTabContent('clueinfo')

                this.$router.push({
                    path: `/customer-detail/${item.leadCode}/${config.customerFlag}`
                })
            },
            // add by lwx on 2018/01/12
            ...mapMutations({
                setCurrentTabIndex: "customer/SET_CURRENT_TAB_INDEX",
                setCurrentTabContent: "customer/SET_CURRENT_TAB_CONTENT"
            })
        },
        mounted() {
            this.$nextTick(function() {
                document.getElementById('detail-box').style.height = document.getElementById('app').offsetHeight - this.$refs.searchHeader.offsetHeight + 'px'
            })
        }
    }
</script>
<style lang="scss" scoped>
    .search-header-warp {
        width: 100%;
        height: rem(88);
    }
    .search-header {
        display: -webkit-flex;
        position: fixed;
        -webkit-transform: translateZ(0);
        top: 0;
        z-index: 5;
        width: 100%;
        height: rem(88);
        background-image: $browser-default-color-blue;
        padding: rem(16) rem(20);
        box-sizing: border-box;
    }
    .search-header .search {
        position: relative;
        display: -webkit-flex;
        justify-content: space-between;
        align-items: center;
        width: rem(640);
        height: rem(56);
        border-radius: 3px;
    }
    input {
        text-align: left;
    }
    .search-header .search .clear {
        position: absolute;
        top: 50%;
        right: rem(20);
        width: rem(30);
        height: rem(30);
        margin-top: rem(-15);
        background-image: url(../../assets/imgage/clear.png);
        background-size: 100%;
    }
    .search-header .cancel {
        display: -webkit-flex;
        justify-content: center;
        align-items: center;
        width: rem(70);
        height: rem(56);
        font-size: rem(28);
        color: #fff;
    }
    .search-header .search input {
        width: 100%;
        height: rem(56);
        border: none;
        padding-left: rem(30)
    }
    input::-ms-input-placeholder {
        text-align: left !important;
    }
    input::-webkit-input-placeholder {
        text-align: left !important;
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
        width: rem(90); // height: rem(90);
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
    }
    .date {
        margin-top: rem(8);
        font-size: 12px;
        color: #7e8387;
    }
    .btn-box {
        display: -webkit-flex;
        align-items: center;
    }
    .btn-box>div {
        display: -webkit-flex;
        align-items: center;
        justify-content: center;
        background: #bdc7d1;
        border-radius: 3px;
        width: rem(120);
        height: rem(40);
        color: #fff;
        font-size: 12px;
    }
</style>

