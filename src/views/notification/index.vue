<template>
    <div>
        <page-header :leftOptions="leftOptions">
            <div slot>消息通知</div>
        </page-header>
        <div class="list-box">
            <scroll class="list" :pullup="true" :data="noticeItems" @scrollToEnd="scrollToEnd">
                <div class="box">
                    <div v-for="(noticeItem, index) in noticeItems" :key='index' @click="showDetail(index)">
                        <span class="notice-time">{{ noticeItem.createTimeStr | formatTime }}</span>
                        <div class="notice-item">
                            <div class="w">
                                <span class="notice-title">{{ noticeItem.title }}</span>
                            </div>
                            <div class="w flex m-t-10">
                                <img v-if="noticeItem.customData && noticeItem.customData.type == 'WORKFLOW'" class="notice-logo" src="../../assets/imgage/orderApproved.png" />
                                <img v-else-if="noticeItem.customData && noticeItem.customData.type == 'LEAD'" class="notice-logo" src="../../assets/imgage/lead.png" />
                                <img v-else class="notice-logo" src="../../assets/imgage/netavailable.png" />
                                <span v-if="!noticeItem.isRead" class="isRead"></span>
                                <span class="notice-content">
                                    {{ noticeItem.content }}
                                </span>
                            </div>
                        </div>
                    </div>
                    <p class="loading-text">{{ lodingText() }}</p>
                </div>
            </scroll>
        </div>
        <div v-show="noticeItems.length && loadingNoData" class="no-data-box">
            <no-data title="暂无消息"></no-data>
        </div>
        <div v-show="!noticeItems.length && !loadingNoData" class="loading-container">
            <loading></loading>
        </div>
    </div>
</template>

<script>
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '../../common/config'
    import PageHeader from "components/header/PageHeader"
    import Scroll from 'components/scroll/scroll'
    import NoData from 'components/no-data/no-data'
    import Loading from 'components/loading/loading'
    import api from '@/common/api.js'
    import common from '@/common/common'
    import {
        Toast
    } from 'mint-ui'
    const BEING_LOADING = '正在载入...'
    const NO_MORE_DATA = '暂无更多数据'
    export default {
        created() {
            window.initData = this.initData;
        },
        mounted() {
            this.initData();
        },
        data: function() {
            return {
                showLoading: false,
                loadingNoData: false,
                noMore: false,
                leftOptions: {
                    showBack: false
                },
                pager: {
                    pageNo: 0,
                    pageSize: 15,
                    total: 0,
                    totalPages: 1
                },
                lastPage: 0,
                noticeItems: []
            }
        },
        computed: {
            ...mapState('order', [
                'isSc'
            ])
        },
        methods: {
            initData() {
                let _this = this
                _this.resetData()
                _this.queryNotificationList()
                _this.getUserPermissionsInfo()
            },
            lodingText: function() {
                if (this.showLoading && !this.noMore) {
                    return BEING_LOADING
                } else if (this.showLoading && this.noMore) {
                    return NO_MORE_DATA
                }
            },
            scrollToEnd: function() {
                let _this = this
                _this.$data.showLoading = true
                if (_this.lastPage <= _this.pager.pageNo) {
                    _this.noMore = true
                    return;
                }
                _this.queryNotificationList()
            },
            queryNotificationList: function() {
                let _this = this
                _this.$data.loadingNoData = false
                if (_this.pager.pageNo <= _this.pager.totalPages) {
                    api.messageService
                        .getMessageList({
                            empToken: common.getCookie('e_token'),
                            pageNums: config.pageNums,
                            pageStart: _this.pager.pageNo + 1
                        }, (res) => {
                            if (res.data.code === 'success') {
                                let list = res.data.obj.list
                                _this.$data.showLoading = false
                                if (list.length <= 0) {
                                    _this.$data.loadingNoData = true
                                } else {
                                    _this.lastPage = res.data.obj.lastPage;
                                }
                                list.forEach((item) => {
                                    item.customData = JSON.parse(item.customData)
                                    item.isRead = parseInt(item.isRead)
                                })
                                _this.$data.noticeItems = _this.$data.noticeItems.concat(list)
                                _this.$data.pager = {
                                    pageNo: res.data.obj.pageNum,
                                    pageSize: res.data.obj.pageSize,
                                    total: res.data.obj.total,
                                    totalPages: res.data.obj.pages
                                }
                            }
                        })
                }
            },
            showDetail: function(index) {
                let _this = this
                let noticeItem = JSON.parse(JSON.stringify(_this.$data.noticeItems[index]))
                switch (noticeItem.customData.type) {
                    case 'WORKFLOW':
                        if (_this.isSc) {
                            this.$router.push('/order/' + noticeItem.customData.orderNo)
                        } else {
                            this.$router.push('/orderApprovedetail/' + noticeItem.customData.orderNo + '/' + config.notApprovedFlag)
                        }
                        break
                    case 'LEAD':
                        switch (noticeItem.customData.leadType) {
                            case 'PHONECALL':
                                this.$router.push({
                                    path: '/customer-detail/' + noticeItem.customData.leadCode + '/passenger'
                                })
                                break
                            case 'CUSTCOMING':
                                this.$router.push({
                                    path: '/customer-detail/' + noticeItem.customData.leadCode + '/passenger'
                                })
                                break
                            case 'REDISPATCHMGR':
                                this.$router.push({
                                    path: '/customer-detail/' + noticeItem.customData.leadCode + '/customer'
                                })
                                break
                            case 'CUSTINSTORE':
                                this.$router.push({
                                    path: '/passenger/homepage'
                                })
                                break
                            case 'REDISPATCHCRM':
                                if (!_this.isSc) {
                                    this.$router.push({
                                        path: '/reapportion/'
                                    })
                                }
                                break
                        }
                        break
                    case 'CHAT':
                        this.$router.push({
                            name: 'chatRoom',
                            query: {
                                chatUrl: noticeItem.customData.chatUrl
                            }
                        })
                        break
                }
                noticeItem.isRead = '1'
                noticeItem.customData = JSON.stringify(noticeItem.customData)
                api.messageService
                    .updateMessageStatus(noticeItem, (res) => {})
            },
            resetData() {
                Object.assign(this.$data, {
                    showLoading: false,
                    loadingNoData: false,
                    noMore: false,
                    leftOptions: {
                        showBack: false
                    },
                    pager: {
                        pageNo: 0,
                        pageSize: 15,
                        total: 0,
                        totalPages: 1
                    },
                    lastPage: 0,
                    noticeItems: []
                })
            },
            ...mapActions('order', [
                'getUserPermissionsInfo'
            ])
        },
        components: {
            NoData,
            Scroll,
            Loading,
            PageHeader
        }
    }
</script>
<style lang="scss" scoped>
    .list-box {
        position: fixed;
        -webkit-transform: translateZ(0);
        top: rem(88);
        width: 3.75rem;
        bottom: 0;
        .list {
            padding-top: rem(20);
            padding-left: rem(30);
            padding-right: rem(30);
            height: 100%;
            overflow: hidden;
        }
    }
    .notice-time {
        font-family: PingFangSC-Regular;
        font-size: rem(24);
        color: #FFFFFF;
        letter-spacing: 0;
        text-align: center;
        display: table;
        vertical-align: middle;
        background: #CECECE;
        border-radius: rem(8);
        padding: rem(4) rem(4);
        margin: rem(20) auto;
    }
    .notice-item {
        background-color: #FFFFFF;
        border-radius: rem(8);
        margin-top: rem(20);
        padding: rem(20) rem(20);
    }
    .notice-title {
        font-family: PingFangSC-Regular;
        font-size: rem(28);
        color: #243742;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    .notice-logo {
        width: rem(100);
        height: rem(100);
        margin-right: rem(20);
    }
    .notice-content {
        font-family: PingFangSC-Regular;
        font-size: rem(26);
        color: #8392A0;
        letter-spacing: 0;
        max-height: rem(108);
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .isRead {
        min-width: rem(20);
        height: rem(20);
        border-radius: 50%;
        background-color: #FF0000;
        text-align: center;
        transform: translate(rem(-22), rem(-15));
    }
    .loading-text {
        text-align: center;
        padding: remp(10) 0;
        color: #817F79;
    }
    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
