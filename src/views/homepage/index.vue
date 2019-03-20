<template>
    <div v-if="loginData!=''">
        <page-header :leftOptions="leftOptions">
            <div slot="left" @click="back">
                <div class="home-warp clearfix">
                    <div class="home-left-homepage fl oh">
                        <img width="100%" src="../../assets/imgage/user.png" alt="">
                    </div>
                    <div class="home-right-homepage fl">
                        {{loginData.empVo.empCnName}}
                    </div>
                </div>
            </div>
            <p slot="right">
                {{loginData.inCharegSubOrgVo.orgName}}
            </p>
        </page-header>
        <div>
            <p class="hometitle">
                今日待办&ensp;(<i class="number">{{listNum}}</i>)
            </p>
            <div class="wait">
                <div class="wait-container-homepage">
                    <div class="clearfix" v-if="loginData.inChargePostnVo.postTypeCode===scPostTypeCode" v-for="(item, index) in upcomingList" :key="index" @click="headRouterTo(item.leadCode, item.orderNo)">
                        <div class="left fl container-list-today-first">
                            <span class="color-scName">{{item.scName!=null?item.scName:'-'}}</span>
                            <i class="fr color-custName">{{item.scheduleTime != null?item.scheduleTime.slice(11, 16):'-'}}</i>
                        </div>
                        <div class="home-right fr container-list-today">
                            <span class="fl color-scName">{{item.scheduleTypeName!=null?item.scheduleTypeName:'-'}}</span>
                            <div class="custom fr pr">
                                <div class="head fl pa">
                                    <headportrait class="homehead-ma" :name="item.intentionLevelName" :sex="item.customGender"></headportrait>
                                </div>
                                <span class="username color-custName" style="text-align: right;">{{item.customerName!=null?item.customerName:'-'}}</span>
                            </div>
                        </div>
                    </div>
                    <!-- <scroll v-else :pullup="true" :data="orderApproveItems" @scrollToEnd="scrollToEnd"> -->
                        <!-- <div> -->
                    <div v-if="loginData.inChargePostnVo.postTypeCode!==scPostTypeCode" class="clearfix" v-for="(item, index) in orderApproveItems" :key="index" @click.prevent="approveRouterTo(item.orderNo)">
                        <div class="left fl container-list-today-first">
                            <span class="color-scName">{{item.salesEmpName!=null?item.salesEmpName:'-'}}</span>
                            <i class="fr color-custName">{{item.updateTimeStr != null?item.updateTimeStr.slice(11, 16):'-'}}</i>
                        </div>
                        <div class="home-right fr container-list-today">
                            <span class="fl color-scName">{{item.currentOrderWfTypeName!=null?item.currentOrderWfTypeName:'-'}}</span>
                            <div class="custom fr pr">
                                <div class="head fl pa">
                                    <headportrait class="homehead-ma" :sex="item.customGender"></headportrait>
                                </div>
                                <span class="username color-custName" style="text-align: right;">{{item.custName!=null?item.custName:'-'}}</span>
                            </div>
                        </div>
                    </div>
                        <!-- </div> -->
                    <!-- </scroll> -->
                    <div class="hint tc" v-if="noneInfo">
                        <div v-if="showLoading">
                            <loading></loading>
                        </div>
                        <div v-else>暂时无待办事项</div>
                    </div>
                </div>
            </div>
            <p class="hometitle">
                日常工作
            </p>
            <div class="everyday w">
                <div class="clearfix float-container-homepage">
                    <!-- <div v-if="todayReception"> -->
                    <div v-if="appPositionType.has('todayReception')">
                        <div class="icon" @click.prevent="routerTo('passenger', 'homepage')">
                            <img src="../../assets/imgage/today.png" alt="">
                        </div>
                        <p>今日接待</p>
                    </div>

                    <!-- <div v-if="examine || availableType != 0"> -->
                    <div v-if="appPositionType.has('orderApprove')">
                        <div class="icon-alert" @click.prevent="routerTo('orderApprove', 'homepage')">
                            <img src="../../assets/imgage/approved.png" alt="">
                            <span class="alert" v-if="pendingOrderNum">{{ pendingOrderNum }}</span>
                        </div>
                        <p class="icon-label">审批</p>
                    </div>

                    <!-- <div v-if="financialcal"> -->
                    <div v-if="appPositionType.has('finCalculator')">
                        <div class="icon" @click.prevent="routerTo('finCalculator', 'homepage')">
                            <img src="../../assets/imgage/calculator.png" alt="">
                        </div>
                        <p>金融计算器</p>
                    </div>

                    <!-- <div v-if="ressurvive"> -->
                    <div v-if="appPositionType.has('searchCar')">
                        <div class="icon" @click.prevent="routerTo('searchCar', 'homepage')">
                            <img src="../../assets/imgage/stock.png" alt="">
                        </div>
                        <p>库存</p>
                    </div>

                    <!-- <div v-if="allocation"> -->
                    <div v-if="appPositionType.has('reapportion')">
                        <div class="icon" @click.prevent="routerTo('reapportion', '')">
                            <img src="../../assets/imgage/clue.png" alt="">
                        </div>
                        <p>线索分配</p>
                    </div>

                    <!-- <div v-if="loginData.inChargePostnVo.postTypeCode!=scPostTypeCode || databoard || availableType != 0"> -->
                    <div v-if="appPositionType.has('dataBoard')">
                       <div class="icon" @click.prevent="routeBoardTo('boarddetial')">
                            <img src="../../assets/imgage/Kanban.png" alt="">
                        </div>
                        <p>数据看板</p>
                    </div>
                    

                    <!-- 集团看板 -->
                    <div v-if="appPositionType.has('groupDashboard')">
                       <div style="background:red" class="icon" @click.prevent="routeBoardTo('groupDashboard')">
                            <img src="../../assets/imgage/jituan.png" alt="">
                        </div>
                        <p>集团看板</p>
                    </div>


                    <!-- <div v-if="marketactivity"> -->
                    <div v-if="appPositionType.has('marketActivity')">
                        <div class="icon" @click.prevent="routerTo('marketlist', '')">
                            <img src="../../assets/imgage/maket.png" alt="">
                        </div>
                        <p>市场活动</p>
                    </div>

                    <!-- <div v-if="availableType == 0 || behindmarket"> -->
                    <div v-if="appPositionType.has('aftermarket')">
                        <div class="icon" @click.prevent="routerTo('new-aftermarket')">
                            <img src="../../assets/imgage/sku.png" alt="">
                        </div>
                        <p>后市场</p>
                    </div>

                    <div v-if="GroupcustomizationValue === '000000'">
                        <div class="icon" @click.prevent="linkTo">
                            <img src="../../assets/imgage/im.png" alt="">
                        </div>
                        <p>客户直连</p>
                    </div>
                </div>
            </div>
        </div>
        <div v-if="leftmenu" class="leftmenu w" @click="hideLeft(false)">
            <leftmenu @hideLeft="hideLeft" :refresh="getLoginInfo"></leftmenu>
        </div>
        <!-- 底部栏 -->
        <div v-show="userAgents">
          <page-bottom></page-bottom>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
    import config from 'common/config.js'
    import common from '@/common/common.js'
    import VueNativeSock from 'vue-native-websocket'
    import PageHeader from 'components/header/PageHeader'
     import PageBottom from 'components/bottom/PageBottom'
    import headportrait from '@/components/headportrait/headportrait'
    import leftmenu from './leftmenu'
    import loading from '@/components/loading/loading.vue'
    import Scroll from 'components/scroll/scroll'
    import api from '@/common/api.js'
    import {
       Toast,
       MessageBox
    } from 'mint-ui'
    const BEING_LOADING = '正在载入...'
    const NO_MORE_DATA = '暂无更多数据'
    Vue.use(VueNativeSock, config.wsUrl + common.getCookie('e_token'), {
        reconnection: true,
        reconnectionDelay: 3000
    })
    export default {
        created() {
            window.initData = this.initData;
        },
        mounted() {
            this.initData();
            this.userAgent();
        },
        data() {
            return {
                menuContent: false,
                userAgents: false,
                appPositionType: new Set(),    //APP工作入口配置
                GroupcustomizationValue: '',
                scPostTypeCode: config.root.scPostTypeCode, // 销售类（销售顾问/销售专员）
                smPostTypeCode: config.root.smPostTypeCode, // 管理类（销售主管）
                showLoading: true,
                leftOptions: {
                    showBack: false
                },
                leftmenu: false,
                upcomingList: [],
                loginData: '',
                orderApproveItems: [],
                lastPage: 1,
                pageStart: 1,
                orderList: {
                    orderNoSet: [],
                    custName: '',
                    custMobile: ''
                },
                config: config,
                listNum: '0',
                pendingOrderNum: null,
                availableType:'0',
                storeCode: ''   //门店编码
            }
        },
        computed: {
            ...mapState('homepage', [
                'loginInfo'
            ]),
            noneInfo: function() {
                if(this.loginData.inChargePostnVo.postTypeCode==this.scPostTypeCode) {
                    if(this.upcomingList === null) {
                        return true
                    } else if(this.upcomingList.length===0) {
                        return true
                    } else {
                        this.listNum = this.upcomingList.length
                        return false
                    }
                } else {
                    if(this.orderApproveItems.length===0) {
                        return true
                    } else {
                        this.listNum = this.orderApproveItems.length
                        return false
                    }
                }
            },
            isOldVersion: function() {
                let appInfo = window.navigator.userAgent
                return (appInfo.indexOf('iris_1.0') > -1)
            }
        },
        methods: {
            // 判断是否APP客户端还是页面
            userAgent() {
              var userAgent = window.navigator.userAgent;
              if(userAgent.indexOf('iris') != -1) {
                this.userAgents = false;
                this.menuContent = false;
              } else {
                this.userAgents = true;
                this.menuContent = true;
              }
            },
            initData() {
                this.$parent.loading = false
                this.$socket.onmessage = this.handleSocketMessage;
                this.resetData()
                this.getLoginInfo()
                this.getUserAvailableInfo()
                this.getOrderWfInfoAndCountByPostnCode()
                this.getDictionaryAboutCompany()
                this.checkVersion()
                this.clearCarInfo()
                this.clearOrderInfo()
                this.clearFinancialOrderInfo()
            },
            linkTo(){
        		this.$router.push({
                    name:'chatRoom',
                    query: {
                        chatUrl: `https://xyscrmm.bzmaster.cn/chat?id=${this.loginData.empVo.empCode}`
                    }
        		})
            },
            checkVersion() {
                let _this = this
                if (_this.isOldVersion) {
                    MessageBox.confirm('当前版本太旧, 请更新到最新版本，三秒后将自动跳到登录界面', '提醒', {
                        showConfirmButton: false,
                        showCancelButton: false,
                        type: 'warning'
                    }).then((action) => {
                    })
                    setTimeout(() => {
                        wst.loginOut()
                    }, 3*1000)
                }
            },
            lodingText() {
                if (this.showLoading && !this.noMore) {
                    return BEING_LOADING
                } else if (this.showLoading && this.noMore) {
                    return NO_MORE_DATA
                }
            },
            headRouterTo(lead, order) {
                let permissions = this.loginInfo.inChargePostnVo.postTypeCode
                if (permissions == config.root.smPostTypeCode) {
                    this.$router.push({
                        path: 'orderApprovedetail/' + order + '/' + config.notApprovedFlag
                    })
                } else {
                    this.$router.push({
                        path: 'customer-detail/' + lead + '/' + config.passagerFlag
                    })
                }
            },
            approveRouterTo(order) {
                this.$router.push({
                    path: 'orderApprovedetail/' + order + '/' + config.notApprovedFlag
                })
            },
            routeBoardTo: function(url) {
                this.$router.push({
                    path: url,
                    query: {
                        storeCode: this.storeCode['0']
                    }
                })
            },
            getUserAvailableInfo: function() {
                api.getUserInfo.getUserAvailableInfo(res => {
                    if(res.data.code == 'success') {
                        this.availableType = res.data.obj.availableType;
                        this.storeCode = res.data.obj.availableStoreCodes;
                        common.setCookie('storeCode', this.storeCode);
                    }
                })
            },
            routerTo: function(url, code = '') {
                let permissions = this.loginInfo.inChargePostnVo.postTypeCode
                if (permissions == config.root.smPostTypeCode) {
                    this.$router.push({
                        path: url + '/' + code,
                        query: {
                            storeCode: this.storeCode['0']
                        }
                    })
                } else {
                    this.$router.push({
                        path: url + '/' + code,
                        query: {
                            storeCode: this.storeCode['0']
                        }
                    })
                }
            },
            getLoginInfo: function() {
                const $this = this
                this.$store.dispatch('homepage/getLoginInfo', () => {
                    this.loginData = this.loginInfo
                    if($this.loginData.inChargePostnVo.postTypeCode==$this.scPostTypeCode) {
                        this.queryUpcomingInfo()
                    }
                    else {
                        $this.queryOrderWfInfoByPostnCode($this.queryOrderInfoVosByCode);
                    }
                    //权限
                    const groupCode = this.loginData.inCharegOrgVo.groupCode
                    const postCodes = this.loginData.postnCodes
                    const orgCode = this.loginData.inCharegSubOrgVo.orgCode
                    const params = { groupCode, postCodes, orgCode, resourceChannelCode: 'MenuAPP' }
                    api.getUserInfo.queryPostUsableGroupResourceInfo(params, res =>{
                        if (res.data.code == 'success' && res.data.obj && res.data.obj.menu){
                            let appPositionType = new Set(this.appPositionType)
                               res.data.obj.menu.forEach( value=>{
                                   appPositionType.add(value.resourceCode.slice(2))
                               })
                              this.appPositionType = appPositionType
                        }
                    })
                })
            },
            back() {
                this.hideLeft(true)
            },
            hideLeft: function(val) {
                this.leftmenu = val
                // 调用原生方法
                if (!this.userAgents) {
                    if (val) {
                       wst.showToast('2')
                    } else {
                       wst.showToast('1')
                    }
                }
            },
            //查询今日代办(SM)
            scrollToEnd() {
                var $this = this;
                if ($this.lastPage <= $this.pageStart) {
                    return;
                }
                $this.pageStart++;
                this.queryOrderWfInfoByPostnCode(this.queryOrderInfoVosByCode);
            },
            queryOrderWfInfoByPostnCode(fn) {
                var $this = this;
                api.orderApprove.query({
                    pageNums: config.maxPageNums,
                    pageStart: this.pageStart
                    }, function(res) {
                    if (res.data.code == 'success' && res.data.obj) {
                        var data = res.data.obj.list;
                        if (!data.length) {
                            $this.showLoading = false;
                            $this.orderApproveItems = []
                        } else {
                            $this.lastPage = res.data.obj.lastPage;
                            $this.orderList.orderNoSet.length = 0;
                            for (var i = 0, len = data.length; i < len; i++) {
                                $this.orderList.orderNoSet.push(data[i].orderNo);
                            }
                            fn($this.orderList);
                        }
                    }
                });
            },
            queryOrderInfoVosByCode(params) {
                var $this = this;
                api.orderApprove.queryOrderInfoVosByCode(params, function(res) {
                    if(res != undefined) {
                        if (res.data.code == 'success' && res.data.obj) {
                            let data = res.data.obj;
                            $this.setData(data);
                        }
                    } else {
                        Toast('订单信息不存在')
                    }
                })
            },
            setData(data) {
                var $this = this,
                obj = {};
                for (var i = 0, len = data.length; i < len; i++) {
                    var key = {
                        orderNo: data[i].orderNo,
                        updateTimeStr: data[i].updateTimeStr,
                        carName: data[i].carOrderInfoVoList[0].carOrderDetailInfoList[0].carName,
                        custMobile: data[i].custMobile,
                        storeName: data[i].storeName,
                        salesEmpName: data[i].salesEmpName,
                        custName: data[i].custName,
                        customGender: data[i].customGender,
                        salesEmpName: data[i].salesEmpName,
                        //orderType:'', //orderType为True 订单，false 为意向订单
                        // currentOrderWfTypeName: data[i].carOrderInfoVoList[0].currentOrderWfTypeName
                        currentOrderWfTypeName: data[i].orderWorkflowInfoVo.wfTypeName || ''
                    }
                    $this.orderApproveItems.push(key);
                    obj[data[i].orderNo] = data[i];
                }
                //数据放到vuex 详情页面获取
                this.$store.dispatch('orderApprove/insertOrderInfo', obj);
            },
            //查询今日待办(SC)
            queryUpcomingInfo: function() {
                const $this = this
                let params = {
                    scCode: $this.loginData.empVo.empCode,
                    // storeCode: $this.loginData.inChargePostnVo.postCode
                }
                this.$store.dispatch('homepage/queryUpcomingInfo', {
                    poros: params,
                    callBack: function(msg) {
                        $this.upcomingList = msg.data.obj
                        $this.showLoading = false;
                        //    console.log($this.upcomingList)
                    }
                })
            },
            getOrderWfInfoAndCountByPostnCode: function() {
                let _this = this
                api.orderApprove
                   .queryOrderWfInfoAndCountByPostnCode({}, (res) => {
                       if (res.data.code === 'success') {
                           let pending = parseFloat(res.data.obj.countAuditOrder[0].pending)
                           _this.$data.pendingOrderNum = (pending > 99 ? pending + '+': pending)
                       }
                   })
            },
            handleSocketMessage: function(data) {
                let _this = this
                if (data.data.indexOf("value") >= 0) {
                   _this.$data.pendingOrderNum = parseInt(JSON.parse(data.data).value)
                }
            },
            getDictionaryAboutCompany() {
                api.getDataDetails({
                    refDetailCode: config.configOfXuanyu.refDetailCode
                }).then((res) => {
                    if(res.data.code === 'success') {
                        this.GroupcustomizationValue= res.data.obj.refDetailValue
                    }
                })
            },
            resetData(){
                Object.assign(this.$data, {
                        appPositionType: new Set(),    //APP工作入口配置
                        GroupcustomizationValue: '',
                        scPostTypeCode: config.root.scPostTypeCode, // 销售类（销售顾问/销售专员）
                        smPostTypeCode: config.root.smPostTypeCode, // 管理类（销售主管）
                        showLoading: true,
                        leftOptions: {
                            showBack: false
                        },
                        leftmenu: false,
                        upcomingList: [],
                        loginData: '',
                        orderApproveItems: [],
                        lastPage: 1,
                        pageStart: 1,
                        orderList: {
                            orderNoSet: [],
                            custName: '',
                            custMobile: ''
                        },
                        config: config,
                        listNum: '0',
                        pendingOrderNum: null,
                        availableType:'0',
                        storeCode: ''      //门店编码
                    })
            },
            ...mapActions('carInfo',  [
                'clearCarInfo'
            ]),
            ...mapActions('financePro', [
                'clearFinancialOrderInfo'
            ]),
            ...mapActions('order', [
                'clearOrderInfo'
            ])
        },
        components: {
            PageHeader,
            headportrait,
            leftmenu,
            loading,
            Scroll,
            PageBottom
        }
    }
</script>

<style lang="scss" scoped>
    .container-list-today-first {
        width: 35%;
    }
    .container-list-today {
        width: 45%;
    }
    .float-container-homepage {
      padding-bottom: remp(70);
    }
    .float-container-homepage > div {
        float: left;
        width: 33.33%;
        padding-top: remp(15);
        padding-bottom: remp(15);
    }
    .header-right p {
        height: remp(26);
        line-height: remp(26);
        font-size: remp(13);
    }
    .leftmenu {
        box-sizing: border-box;
        width: remp(375);
        height: 100%;
        overflow: hidden;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 999;
        background-color: rgba(0, 0, 0, 0.4);
    }
    .homehead-ma.content {
        width: remp(27) !important;
        height: remp(27) !important;
    }
    .homehead-ma.headimg p {
        height: remp(7.8) !important;
        font-size: remp(6) !important;
        line-height: remp(7.8)!important;
    }
    .home-warp {
        height: remp(25);
        position: relative;
    }
    .home-warp .home-left-homepage {
        width: remp(25);
        height: remp(25);
        border-radius: 50%;
        box-sizing: border-box;
    }
    .home-warp .home-right-homepage {
        margin-left: remp(5);
        height: remp(25);
        line-height: remp(25);
    }
    .hometitle {
        box-sizing: border-box !important;
        height: remp(30);
        line-height: remp(32);
        background-color: #F5F5F9;
        padding-left: remp(12.5);
        color: rgb(126, 131, 135)
    }
    .hometitle:first-child {
        margin-top: remp(3);
    }
    .number {
        color: #FD4A38;
    }
    .wait {
        max-height: remp(225);
        overflow: auto;
        overflow-x: hidden;
    }
    .wait .hint {
        height: remp(48.5);
        line-height: remp(48.5);
        font-size: remp(13);
        color: rgb(126, 131, 135);
    }
    .wait>.wait-container-homepage>div {
        box-sizing: border-box;
        width: 100%;
        height: remp(45);
        line-height: remp(45);
        background: #fff;
        border-top: remp(1) solid #f0f2f5;
        padding: 0 remp(13);
    }
    .wait li>div {
        display: inline-block;
        width: 50%;
        height: 100%;
    }
    .wait li .left>* {
        display: inline-block;
        width: 49%;
    }
    .wait li .left>i {
        font-size: remp(13);
        color: #C0C3C5;
    }
    .head {
        width: remp(27);
        height: remp(27);
    }
    .wait li .home-right>* {
        width: 50%;
        height: 100%;
    }
    .head {
        top: 50%;
        transform: translateY(-50%);
    }
    .username {
        margin-left: remp(35);
        white-space: nowrap;
        overflow: hidden;
        display: block;
        width: remp(50);
        text-overflow: ellipsis;
    }
    .everyday {
        width: 100%;
        background-color: #fff;
    }
    .everyday ul li {
        float: left;
        width: 33.333%;
        height: remp(90);
        box-sizing: border-box;
        padding-top: remp(15);
        font-size: remp(12);
    }
    .everyday .icon {
        width: remp(41);
        height: remp(41);
        margin: 0 auto;
        overflow: hidden;
        border-radius: remp(4)
    }
    .everyday .icon img {
        width: 100%;
        height: auto;
    }
    .everyday .icon-alert {
        width: remp(41);
        height: remp(41);
        margin: 0 auto;
        display: flex;
        border-radius: remp(4);
    }
    .everyday .icon-alert img {
        min-width: remp(41);
        min-height: remp(41);
    }
    .everyday .icon-alert .alert {
        color: white;
        background: red;
        min-width: rem(50);
        height: rem(50);
        border-radius: 50%;
        line-height: rem(50);
        text-align: center;
        transform: translate(rem(-27), rem(-8));
    }
    .everyday p {
        margin-top: remp(6);
        text-align: center;
    }
    .head>.headimg {
        width: 0.27rem !important;
        height: 0.27rem !important;
    }
    .color-custName {
        color: rgb(126, 131, 135)
    }
    .color-scName {
        color: rgb(51, 51, 51);
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .homeloading-text {
        text-align: center;
        padding: remp(10) 0;
        color: #817F79;
    }

</style>
