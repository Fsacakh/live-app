<template>
    <div class="w100">
        <page-header ref="header">
            <div slot>{{ orderTitle }}</div>
        </page-header>
        <!-- 订单详情界面 -->
        <div class="box">
            <div class="bg"></div>
            <div class="boxcontent boxShadow">
                <div class="flex">
                    <!-- <div class="flex-2 red">{{ order.carOrderInfoVoList[0].currentOrderWfTypeName }}</div> -->
                    <div class="flex-2 red">{{ editInfo.wfTypeName }}</div>
                    <div class="flex-3 tr">
                        <span class="m-r-10"><i class="iconfont blue icon-jingxiaodian"></i> {{ order.storeName }}</span>
                        <span><i class="iconfont blue icon-xiaoshouguwen"></i> {{ order.salesEmpName }}</span>
                    </div>
                </div>
                <div class="flex m-t-10 align-items">
                    <div class="w45 h45 m-r-10">
                        <head-portrait :name="level" :badge='badge' :sex="((order.customGender === null ? 1 : order.customGender) - 0)"></head-portrait>
                    </div>
                    <div class="flex-1">
                        <strong>{{order.custName}}</strong>
                        <p>{{order.custMobile}}</p>
                    </div>
                    <a href="#" @click.prevent="showMore">查看更多</a>
                </div>
                <!-- flex-flow: row || wrap; -->
                <div class="row m-t-10">
                    <p class="m-b-10  m-t-10" style="float: left; width:33.3333%" v-for="(item, index) in gpInfo" :key="index" v-if="item">
                        <span class="gpUptitle">{{item.refDetailName}}</span>
                        <br/>
                        <span>{{item.refDetailValue == 'SNPCODE' || item.refDetailValue.substring(item.refDetailValue.length-4) == 'rate'
                            ? (order[item.refDetailValue] ? ((order[item.refDetailValue] - 0) * 100).toFixed(2) + '%' : ' ')
                            :(item.refDetailValue == 'orderAddInfoCarSalesSubKind'
                            ? order.orderAddInfoSalesType
                            : (item.refDetailValue == 'orderAddInfoPlateType'
                            ? order.orderAddInfoPlateType
                            : (item.refDetailValue == 'OrderDerivateGpValue'
                            ? (orderDerivativeProfit && orderDerivativeProfit.orderProfitSum && orderDerivativeProfit.orderProfitSum.toFixed(2))
                            : (order[item.refDetailValue] - 0).toFixed(2)))) }}</span>
                    </p>
                </div>
                <p class="remark borderColor m-t-10" style="clear: both">备注：{{order.remark}}</p>
            </div>
        </div>
        <!-- 车辆相关信息 -->
        <div class="list-box">
            <div class="list">
                <div class="linkDetail p-t-10 p-l-10 p-b-10 p-r-10" @click="getCarInfo">
                    <div class="imghead">
                        <i class="iconfont icon-yixiangche"></i>
                    </div>
                    <div class="container">
                        <div><p>{{ order.carOrderInfoVoList[0].carOrderDetailInfoList[0].carName }}</p></div>
                        <div><p>颜色:<span>{{ carColor  }} </span></p></div>
                        <p v-show="!isIntentionOrder">车架号: <span>{{ order.carOrderInfoVoList[0].carOrderDetailInfoList[0].vinNo }}</span></p>
                        <p v-show="isIntentionOrder">意向车</p>
                    </div>
                    <div class="price">
                        <span>¥{{ orderNum }}</span>
                        <!-- 此处为解决safari价格不显示兼容问题 -->
                        <span class="price-hidden" style="visibility: hidden">¥{{ order.carOrderInfoVoList[0].totalActualSalesPrice.toFixed(2) }}</span>
                    </div>
                </div>
                <div class="itemsContainer p-t-10">
                    <div class="finance" @click="getFinance">
                        <cell title="金融" :icon="true">
                            <span slot="icon" class="hehe iconfont color129 icon-icon-jinrong"></span>
                            <input type="text" v-model="getFinanceName" readonly>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                        </cell>
                    </div>
                    <div class="insurance" @click="getInsurance">
                        <cell title="保险" :icon="true">
                            <span slot="icon" class="hehe iconfont color129 icon-icon-baoxian"></span>
                            <input type="text" v-model="getTotalInsurancePrice" readonly>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                        </cell>
                    </div>
                    <div class="aftermarket" @click="getAfterMarket">
                        <cell title="后市场" :icon="true">
                            <span slot="icon" class="hehe iconfont color129 icon-icon-houshichang"></span>
                            <input type="text" v-model="getskuOrderTotalActualSalesPrice" readonly>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                        </cell>
                    </div>
                    <div class="policyWidthCar" @click="getPolicyWidthCar">
                        <cell title="随车政策" :icon="true">
                            <span slot="icon" class="hehe iconfont icon-Shape"></span>
                            <input type="text" readonly>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                        </cell>
                    </div>
                    <div class="exchange" @click="routerTo('/replacement', order.orderNo)">
                        <cell title="置换" :icon="true">
                            <span slot="icon" class="hehe iconfont color129 icon-icon-zhihuan"></span>
                            <input type="text" readonly>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                        </cell>
                    </div>
                    <div class="service" @click="routerTo('/serviceAndOther', order.orderNo)">
                        <cell title="服务费及其他" :icon="true">
                            <span slot="icon" class="hehe iconfont color129 icon-icon-fuwufeijiqita"></span>
                            <input type="text" v-model="getTotalActualServiceFee" readonly>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                        </cell>
                    </div>
                </div>
                <div class="relativeOrder p-t-10">
                    <router-link :to="{ name: 'orderInfo', params: {code:orderNo}}">
                        <cell title="订单相关" :icon="true">
                            <span slot="icon" class="hehe iconfont color129 icon-icon-dingdanxiangguan"></span>
                            <span slot="right" class="iconfont color203 icon-icon-tiaozhuanjiantou"></span>
                            <input type="text" readonly>
                        </cell>
                    </router-link>
                    <router-link :to="{ name: 'payInfo', params: {orderNo:orderNo}}">
                        <cell title="支付信息" :icon="true">
                            <span slot="icon" class="hehe iconfont color129 icon-icon-zhifuxinxi"></span>
                            <span slot="right" class="iconfont color203 icon-icon-tiaozhuanjiantou"></span>
                            <input type="text" readonly>
                        </cell>
                    </router-link>
                    <!-- 轩宇定制化需求   报价单内选择电子抵扣券-->
                    <router-link :to="{ name: 'couponInfo', params: {orderNo:orderNo}}" v-show="GroupcustomizationValue === '000000'">
                        <cell title="优惠券" :icon="true">
                            <span slot="icon" class="hehe iconfont icon-youhuiquan"></span>
                            <span class="changeCouponName">{{queryCouponMoney}}</span>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                        </cell>
                    </router-link>
                </div>
            </div>
        </div>
        <div class="submitBtn">
            <div class="left flex">
                <div class="total">
                    合计: <span>¥{{ Number(order.actualTotalPrice).toFixed(2) }}</span>
                </div>
                <span class="histroy" @click="showHistory">
                    <i class="iconfont icon-icon-dingdanxiangguan"></i><br/>
                    <span>批复历史</span>
                </span>
            </div>
            <button class="tc white font14" :class="{ 'disable': (isPass || hasApproved || (wfStatus != 0)), 'right': ((!isPass && !hasApproved && (wfStatus == 0)) || (editInfo.wfTypeCode == 'WorkFlowTypeOrderUpdate' && editInfo.nodeStatus == -1))}" @click="createOrderInfo"> 审批</button>
        </div>
        <!-- 批复历史弹层 -->
        <modal ref="historyModal" :title="'批复历史'" :confirmDisplay="false">
            <div class="historybox">
                <history :items="historyData" :orderApproveHistory="true"></history>
            </div>
        </modal>
        <modal ref="modal" :title="proTitle" :submitText="'发送'" @submit="submit">
            <div class="modelContent" slot>
                <div class="flex">
                    <span class="w65">审批结果</span>
                    <p class="flex-1">
                        <span class="btn" v-show="disabled" :class="{cur:defaultSel}" @click="passOrNo(1)">通过</span>
                        <span class="btn fr" :class="{cur:!defaultSel}" @click="passOrNo(0)">驳回</span>
                    </p>
                </div>
                <div class="flex w67" v-if="editReason">
                    <span class="w65">修改原因</span>
                    <p class="flex-1">
                        <span>{{ editInfo.remark || '--' }}</span>
                    </p>
                </div>
                <div class="flex m-t-10">
                    <span class="w65">备注</span>
                    <span class="flex-1">
                        <textarea name="" placeholder="请输入客户意见（最多100字）" maxlength="100" v-model="remark" id="" cols="30" rows="10"></textarea>
                    </span>
                </div>
            </div>
        </modal>
    </div>
</template>
<script>
    import {
        mapState,
        mapGetters,
        mapActions,
        mapMutations
    } from 'vuex'
    import config from '../../common/config'
    import api from '@/common/api.js'
    import PageHeader from "components/header/PageHeader"
    import cell from 'components/cell'
    import HeadPortrait from 'components/headportrait/headportrait-1'
    import modal from 'components/modal'
    import historyModal from 'components/modal'
    import history from 'components/history-list/history-list.vue'
    import {
        Toast
    } from 'mint-ui'
    export default {
        mounted() {
            window.vue = this
            let _this = this
            this.orderNo = this.$route.params.orderNo;
            _this.getGPConfig({
                poros: {refCode: config.order.gpconfig},
                callBack: (res) => {
                    _this.queryOrderInfoVosByCodeFromDB({
                        orderNo: _this.$route.params.orderNo,
                        allSubOrderFlag: true,
                        ignoreDefault: 1
                    })
                }
            })
            _this.queryOrderInfoVosByCode({
                orderNoSet: [_this.$route.params.orderNo]
            })
            _this.clearCarInfo()
            _this.clearFinancialOrderInfo()
            _this.resetIsSc()
            _this.getUserPermissionsInfo()
            _this.getOrderDerivativeProfit({orderNo:_this.$route.params.orderNo})
            _this.queryOrderWfInfo()
        },
        created() {
            const _this = this;
            _this.getDictionaryAboutCompany();
        },
        computed: {
            carColor(){
                return this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].carAppertanceName
            },
            orderNum(){
                return this.order.carOrderInfoVoList[0].totalActualSalesPrice.toFixed(2)
            },
            isIntentionOrder: function() {
                let _this = this
                let result = false
                let skuCode = _this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].skuCode
                if (skuCode == undefined || skuCode == null || skuCode == '') {
                    result = true
                }
                return result
            },
            hasApproved: function() {
                let _this = this
                return (_this.$route.params.flag === config.hasApprovedFlag)
            },
            ...mapState('order', [
                'gpInfo',
                'order',
                'orderAddInfos',
                'getCouponName'
            ]),
            ...mapGetters('order', [
                'getskuOrderTotalActualSalesPrice',
                'getTotalActualServiceFee',
                'getTotalInsurancePrice',
                'getFinanceName',
                'wfStatus',
            ]),
            ...mapState('orderApprove', [
                'orderApproveInfo',
                'orderDerivativeProfit'
            ]),
            name: function(){
                if(this.isSc){    //销售顾问登录
                    if(this.getCouponName == 0){
                        return '查看可用券'
                    }else{
                        return '￥' + this.getCouponName
                    }
                }else{            //销售经理登录
                    if(this.getCouponName == 0){
                        return ''
                    }else{
                        return '￥' + this.getCouponName
                    }
                }
            },
        },
        data() {
            return {
                disabled: true,
                level: "A级",
                sex: 1,
                badge: null,
                orderDetailInfo: {
                    carOrderInfoVoList: [{
                        currentOrderWfTypeName: ''
                    }]
                },
                orderNo: '',
                remark: '',
                defaultSel: 1,
                allInfo: {},
                isPass: false,
                historyData: [],
                insuranceMoney: 0,
                afterMarketMoney: null,
                withCarMoney: 0,
                totalMoney: 0,
                playType: '',
                genderType: 1,
                custType: '',
                types: {
                    orderAddInfoCarSalesSubKind: '新车销售',
                    orderAddInfoPlateType: '本地上牌'
                },
                GroupcustomizationValue:'',   //轩宇环境判断
                num: 0,
                queryCouponMoney: '',    //优惠券一栏右侧展示信息
                orderTitle: '',          //页面标题控制
                proTitle: '审批',        //弹窗标题控制
                editReason: false,        //修改原因显隐
                editInfo: {}              //订单修改信息
            }
        },
        methods: {
            ...mapMutations('order', [
                'SET_TYPES'
            ]),
            getDictionaryAboutCompany(){
                let _this = this;
                api.getDataDetails({ refDetailCode: config.configOfXuanyu.refDetailCode }).then((res) => {
                    if(res.data.code === 'success') {
                        _this.GroupcustomizationValue= res.data.obj.refDetailValue;
                        if(_this.GroupcustomizationValue === '000000'){
                            _this.queryCoupon(_this.$route.params.orderNo)
                        }
                    }
                })
            },
            // 进入优惠券页面
            getCouponInfo:function(){
                let _this = this;
                if(_this.order.orderNo != undefined){
                    _this.$router.push({path:'/couponInfo/' + _this.order.orderNo})
                }
            },
            // 优惠券一栏右侧提示信息
            queryCoupon: function(orderCode){
                let _this = this;
                let testData = {
                    orderNo: orderCode,
                    currentPage: 1,
                    pageSize: 1000
                }
                api.getCouponInfo.getCoupon( testData ,(res) => {
                    if(res.data.code === 'success'){
                        // _this.num = res.data.obj.totalAmount;
                        // 订单待提交
                        if(res.data.obj.wfStatus === '-1'){
                            if(res.data.obj.totalAmount === 0){
                                _this.queryCouponMoney = '查看可用券';
                            }else{
                                _this.queryCouponMoney = '￥' + res.data.obj.totalAmount;
                            }
                        }else{
                            if(res.data.obj.totalAmount === 0){
                                _this.queryCouponMoney = '';
                            }else{
                                _this.queryCouponMoney = '￥' + res.data.obj.totalAmount;
                            }
                        }
                    }
                })
            },
            passOrNo(type) {
                this.defaultSel = type;
            },
            createOrderInfo() {
                if(!this.orderApproveInfo.orderTaskInfoVo){
                    if (this.isPass || this.hasApproved || (this.wfStatus != 0)) return;
                    this.disabled = true
                    this.$refs.modal.open();
                }else{
                    let taskStatus = this.orderApproveInfo.orderTaskInfoVo.taskStatus
                        // //执行中
                    if(taskStatus == 1 ){
                        Toast('正在执行库存和成本计算，请稍后再审批');
                    }
                    //失败
                    else if(taskStatus == -1 || taskStatus ==3 || taskStatus==0){
                        Toast('很抱歉，该订单数据有误，请联系SC重新提交审批')
                        this.disabled = false;
                        this.defaultSel = 0;
                        this.$refs.modal.open();
                    }
                    // //成功
                    else if(taskStatus == 2){
                        if(this.editInfo.wfTypeCode == config.order.wfTypeCode){
                            if(this.editInfo.nodeStatus == -1){
                                this.disabled = true
                                this.$refs.modal.open();
                            }
                        }else{
                            if (this.isPass || this.hasApproved || (this.wfStatus != 0)) return;
                            this.disabled = true
                            this.$refs.modal.open();
                        }
                    }
                }

            },
            approvePassOrRefuse() {
                let $this = this, params = {}
                if(this.editInfo.wfTypeCode == config.order.wfTypeCode){
                    params = {
                        orderNo: this.orderNo,
                        custCode: this.order.custCode,
                        remark: this.remark,                //审批时的备注
                        wfCode: this.editInfo.wfCode,
                        wfTypeCode: this.editInfo.wfTypeCode
                    }
                }else{
                    params = {
                        orderNo: this.orderNo,
                        custCode: this.order.custCode,
                        remark: this.remark
                    }
                }
                if (this.defaultSel) {
                    api.orderApprove.approvePass(params, function(res) {
                        if (res.data.code == 'success') {
                            $this.isPass = true;
                            $this.editInfo.nodeStatus = 1
                            Toast('审批通过');
                        }
                    });
                } else {
                    api.orderApprove.refuseOrderInfo(params, function(res) {
                        if (res.data.code == 'success') {
                            $this.isPass = true;
                            $this.editInfo.nodeStatus = 0
                            Toast('审批拒绝通过');
                        }
                    });
                }
            },
            // 执行批复历史弹出弹层
            showHistory() {
                this.queryOrderWfDetailInfo(this.$refs.historyModal.open);
            },
            showMore() {
                let _this = this
                if (_this.order.orderNo != undefined) {
                    _this.$router.push({
                        path: '/orderApproveMoreDetail/' + _this.order.orderNo
                    })
                }
            },
            // 调用批复历史弹层接口
            queryOrderWfDetailInfo(fn) {
                var $this = this;
                $this.historyData.length = 0;
                api.orderApprove.queryOrderWfDetailInfo({
                    orderNo: this.orderNo
                }, function(res) {
                    if (res.data.code == 'success' && res.data.obj.length > 0) {
                        var data = res.data.obj;
                        for (var i = 0, len = data.length; i < len; i++) {
                            var key = {
                                navTitle: data[i].orderTypeName,
                                title: data[i].nodeName,
                                time: data[i].updateTimeStr,
                                scName: data[i].operatorName,
                                GP: data[i].approvalCriteriaTypeValue,  //GP%
                                postTypeName: data[i].postTypeName,
                                maxValue: data[i].maxValue,   //GP最大值
                                minValue: data[i].minValue,   //GP最小值
                                remark: data[i].remark,
                                nodeStatus: data[i].nodeStatus, //审批状态
                                nodeType: data[i].nodeType,  //工作流节点类型
                                showAapprovalCriteria: data[i].showAapprovalCriteria,  //判断是否显示GP公式的字段
                                orderTypeCode: data[i].orderTypeCode
                            }
                            $this.historyData.push(key);
                        }
                        fn();
                    }
                });
            },
            //发送审批
            submit() {
                if (!this.orderNo) return;
                this.approvePassOrRefuse();
            },
            getPayInfo: function() {
                let _this = this
                if (_this.order.orderNo != undefined) {
                    _this.$router.push({
                        path: '/payInfo/' + _this.order.orderNo
                    })
                }
            },
            getCarInfo: function() {
                let _this = this
                _this.clearCarInfo()
                if (_this.order.orderNo != undefined) {
                    _this.$router.push({
                        path: '/carInfo/' + _this.order.orderNo
                    })
                }
            },
            getFinance: function() {
                let _this = this
                if (_this.order.financialOrderInfoVoList.length > 0 && _this.order.financialOrderInfoVoList[0] != null && _this.order.orderNo != undefined) {
                    _this.$router.push({
                        path: '/finance/' + _this.order.orderNo
                    })
                } else {
                    _this.$router.push({
                        path: '/finance/-1'
                    })
                }
            },
            getInsurance: function() {
                let _this = this
                if (_this.order.orderNo != undefined) {
                    _this.$router.push({
                        path: '/insurance',
                        query: {
                            // order: _this.order.orderNo,
                            orderNo: _this.order.orderNo,
                            carCode: _this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].carCode
                        }
                    })
                }
            },
            getAfterMarket: function() {
                let _this = this
                if (_this.order.orderNo != undefined) {
                    if (_this.order.skuOrderInfoVoList != null && _this.order.skuOrderInfoVoList.length > 0) {
                        _this.$router.push({
                            path: '/aftermarketshopcar/' + _this.order.orderNo
                        })
                    } else {
                        _this.$router.push({
                            path: '/aftermarket/' + _this.order.orderNo + '/' + config.orderFlag
                        })
                    }
                }
            },
            getPolicyWidthCar: function() {
                let _this = this
                if (_this.order.orderNo != undefined) {
                    _this.$router.push({
                        path: '/carwithpolicy-edit/' + _this.order.orderNo
                    })
                }
            },
            routerTo(url, code) {
                this.$router.push({
                    path: url + '/' + code
                })
            },
            ...mapActions('order', [
                'queryOrderInfoVosByCodeFromDB',
                'resetIsSc',
                'getGPConfig',
                'getUserPermissionsInfo'
            ]),
            ...mapActions('carInfo', [
                'clearCarInfo'
            ]),
            ...mapActions('orderApprove', [
                'queryOrderInfoVosByCode'
            ]),
            // /v1/report/order/getOrderDerivativeProfit
            ...mapActions('orderApprove', [
                'getOrderDerivativeProfit'
            ]),
            ...mapActions('financePro', [
                'clearFinancialOrderInfo'
            ]),
            // 进入优惠券页面
            getCouponInfo:function(){
                let _this = this;
                if(_this.order.orderNo != undefined){
                    _this.$router.push({path:'/couponInfo/' + _this.order.orderNo})
                }
            },
            // 获取订单修改的修改原因等信息
            queryOrderWfInfo(){
                let _this = this
                api.orderApprove.queryOrderWfInfo({ orderNo: _this.$route.params.orderNo }, res => {
                    if(res.data.code === 'success'){
                        this.editInfo = res.data.obj[0]
                        this.orderTitle = this.editInfo.wfTypeCode == config.order.wfTypeCode ? '订单修改申请' : '订单审批'  //页面标题
                        this.proTitle = this.editInfo.wfTypeCode == config.order.wfTypeCode ? '订单修改申请' : '审批'     //弹窗标题
                        this.editReason = this.editInfo.wfTypeCode == config.order.wfTypeCode ? true : false     //订单修改原因显隐
                        if(this.editInfo.wfTypeCode == config.order.wfTypeCode && this.editInfo.nodeStatus == -1){
                            this.$refs.modal.open()
                        }

                    }
                })
            }

        },
        components: {
            PageHeader,
            HeadPortrait,
            cell,
            modal,
            history,
            historyModal
        }
    }
</script>
<style lang="scss" scoped>
    .gpUptitle {
        display: inline-block;
        width: 85%;
        white-space: nowrap;
        text-overflow:ellipsis;
        overflow:hidden;
    }
    .histroy {
        line-height: 1.1!important;
        text-align: center;
        font-size: remp(10);
        color: rgba(129, 129, 129, 1);
        padding: remp(6) remp(14) 0 0;
        i {
            font-size: remp(20)!important;
        }
    }
    .historybox {
        padding: 0;
        max-height: remp(600);
        overflow: hidden;
    }
    .modelContent {
        color: #000!important;
        padding: remp(20);
        font-size: remp(13);
        .btn {
            width: remp(90);
            height: remp(30);
            line-height: remp(30);
            font-size: remp(12);
            display: inline-block;
            text-align: center;
            background-color: rgb(240, 242, 245);
            color: rgb(126, 131, 135);
            border-radius: remp(4);
        }
        .btn.cur {
            background-color: rgb(0, 140, 238);
            color: #fff;
        }
        .w65 {
            display: inline-block;
            width: remp(65)!important;
        }
        textarea {
            border: 1px solid rgb(189, 199, 209);
            width: remp(215);
            height: remp(115);
            padding: remp(5) remp(10);
            box-sizing: border-box;
            border-radius: remp(4);
        }
    }
    .w100 {
        width: remp(375);
        overflow: auto;
    }
    .bg {
        background: #36acfe;
        position: fixed;
        transform: translateZ(0);
        top: remp(44);
        height: remp(54);
        width: rem(750);
        z-index: -1;
    }
    .list-box {
        transform: translateZ(0);
        width: 3.75rem;
        box-sizing: border-box;
        padding-bottom: rem(135);
        .list {
            width: 100%;
        }
    }
    .boxcontent {
        width: remp(355);
        padding: remp(12) remp(10);
        background: #fff;
        margin: 0 auto 0;
        border-radius: remp(8);
        box-sizing: border-box;
        .row {
            font-size: remp(12);
            color: rgb(126, 131, 135);
            span {
                color: rgb(51, 51, 51);
            }
        }
        .remark {
            color: rgb(126, 131, 135);
            border-top: 1px solid #ccc;
            padding-top: remp(5);
            margin-bottom: remp(20);
        }
    }
    // .detailHead {
    //     height: rem(80);
    //     line-height: rem(80);
    //     width: 100%;
    //     // display: flex;
    //     text-align: center;
    //     background-color: #ffffff;
    // }
    // .detailHead>div {
    //     // flex: 1;
    // }
    // .detailHead>div a {
    //     color: #7e8387;
    //     text-decoration: underline !important;
    // }
    .linkDetail {
        margin-top: rem(6);
        height: rem(162);
        box-sizing: border-box;
        background-color: #ffffff;
        // display: flex;
        padding-top: rem(30);
        padding-left: rem(20);
    }
    .linkDetail .imghead {
        // flex: 2;
        width: 20%;
        float:left;
        width: rem(152);
        height: rem(102);
        background-color: #D2EDF3;
        text-align: center;
    }
    .linkDetail .imghead .iconfont {
        color: #fff;
        font-size: rem(30);
        line-height: remp(50);
    }
    .linkDetail .container {
        // flex: 4;
        width: 50%;
        float:left;
        margin-left: rem(12);
        div{
            height: rem(40);
            line-height: rem(40);
        }
    }
    .linkDetail .container p:first-child {
        height: rem(40);
        line-height: rem(40);
        font-size: rem(28);
        overflow: hidden;
        text-overflow: ellipsis;
        position:absolute
    }
    .linkDetail .container p:nth-child(2) {
        height: rem(33);
        line-height: rem(33);
        font-size: remp(13);
        color: #7e8387;
        overflow: hidden;
        text-overflow: ellipsis;
        position:absolute
    }
    .linkDetail .container p:nth-child(3) {
        height: rem(33);
        line-height: rem(33);
        font-size: remp(9);
        color: #7e8387;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
    }
    .linkDetail .price {
        // flex: 2;
        width: 25%;
        float:left;
        text-align: left;
        line-height: rem(122);
        font-size: rem(26);
        font-family: PingFangSC-Regular;
        color: rgb(51, 51, 51);
        overflow: hidden;
        text-overflow: ellipsis;
        .price-hidden{
          display: block;
          width: 0px;
          height: 0px;
        }
    }
    .itemsContainer>div>div {
        border-top: 1px solid rgba(240, 242, 245, .5);
    }
    .submitBtn {
        position: fixed;
        bottom: 0px;
        width: 100%;
        height: rem(90);
        display: flex;
        background-color: #fff
    }
    .submitBtn>.right {
        flex: 3;
        background-image: linear-gradient(90deg, #008cee 0%, #36acfe 100%);
        color: rgb(255, 255, 255);
        font-family: PingFangSC-Regular;
        font-size: rem(28);
    }
    .submitBtn>.disable {
        flex: 3;
        background-color: rgb(155, 155, 155) !important;
        color: rgb(255, 255, 255);
        font-family: PingFangSC-Regular;
        font-size: rem(28);
    }
    .submitBtn>.right-callback {
        flex: 3;
        background-color: rgb(155, 155, 155);
        color: rgb(255, 255, 255);
        font-family: PingFangSC-Regular;
        font-size: rem(28);
    }
    .submitBtn>.left {
        flex: 7;
    }
    .submitBtn>.left .bargain {
        box-sizing: border-box;
        flex: 1
    }
    .submitBtn>.left .bargain i {
        display: inline-block;
        width: rem(21);
        height: rem(21);
        border-radius: 50%;
        background-color: red;
    }
    .submitBtn>.left>.bargain>.radio {
        display: none;
    }
    .submitBtn>.left>.bargain>.radioInput {
        background-color: #fff;
        border: 1px solid #00a1e9;
        border-radius: 100%;
        display: inline-block;
        height: remp(18);
        margin-right: remp(5);
        margin-top: remp(-.5);
        vertical-align: middle;
        width: remp(18);
        line-height: remp(.5);
    }
    .radio:checked+.radioInput:after {
        background-color: #00a1e9;
        border-radius: 100%;
        content: "";
        display: inline-block;
        height: remp(13);
        margin-left: remp(2.5);
        margin-top: remp(2.5);
        width: remp(13);
    }
    .submitBtn>.left .total {
        flex: 1;
        padding-left: rem(20);
        line-height: rem(90);
    }
    .submitBtn>.left .total span {
        padding-left: rem(10);
        color: #008cee;
    }
    .submitBtn>.left>.withDraw {
        width: rem(120);
        border: rem(2) solid rgb(126, 131, 135);
        border-radius: rem(4);
        color: rgb(126, 131, 135);
        font-size: rem(24);
        text-align: center;
        padding-top: rem(14);
        padding-bottom: rem(15);
        line-height: rem(25);
        margin-top: rem(18);
        margin-bottom: rem(18);
        margin-right: rem(20);
    }
    .submitBtn>.left>.update {
        width: rem(120);
        border: rem(2) solid rgba(254, 56, 36, 0.9);
        border-radius: rem(4);
        color: rgba(254, 56, 36, 0.9);
        font-size: rem(24);
        text-align: center;
        padding-top: rem(15);
        padding-bottom: rem(15);
        line-height: rem(24);
        margin-top: rem(18);
        margin-bottom: rem(18);
        margin-right: rem(20);
    }
    .car-total-price {
        display: flex;
        padding-left: rem(20);
        position: fixed;
        transform: translateZ(0);
        bottom: rem(100);
    }
    .car-total-price>.title {
        font-size: rem(30);
        font-family: PingFangSC-Semibold;
        color: rgb(126, 131, 135);
    }
    .car-total-price>.value {
        font-size: rem(30);
        font-family: PingFangSC-Semibold;
        color: rgb(0, 140, 236);
        margin-left: rem(10);
    }
    .finishCar {
        text-align: center;
        padding-top: rem(40);
        font-family: PingFangSC-Regular;
        color: rgb(126, 131, 135);
        font-size: rem(30);
    }
    .finishCar>.time {
        margin-left: rem(20);
    }
    .hehe {
        font-size: rem(38) !important;
    }
    .service>.border {
        border-bottom: none !important;
    }
    .relativeOrder>.border:nth-child(1) {
        border-bottom: 1px solid #ccc !important;
    }
    .relativeOrder>.border {
        border-top: none !important;
    }
    .relativeOrder .changeCouponName{
        display: inline-block;
        text-align: right;
    }
    .histroy {
        line-height: 1.1!important;
        text-align: center;
        font-size: remp(10);
        color: rgba(129, 129, 129, 1);
        padding: remp(6) remp(14) 0 0;
        i {
            font-size: remp(20)!important;
        }
    }
    .historybox {
        padding: 0;
        max-height: remp(600);
        overflow: scroll;
    }
    .modelContent {
        color: #000!important;
        padding: remp(20);
        font-size: remp(13);
        .btn {
            width: remp(90);
            height: remp(30);
            line-height: remp(30);
            font-size: remp(12);
            display: inline-block;
            text-align: center;
            background-color: rgb(240, 242, 245);
            color: rgb(126, 131, 135);
            border-radius: remp(4);
        }
        .btn.cur {
            background-color: rgb(0, 140, 238);
            color: #fff;
        }
        .w65 {
            display: inline-block;
            width: remp(65)!important;
        }
        textarea {
            border: 1px solid rgb(189, 199, 209);
            width: remp(215);
            height: remp(115);
            padding: remp(5) remp(10);
            box-sizing: border-box;
            border-radius: remp(4);
        }
        .w67{
            margin-top: remp(15);
        }

    }
</style>
