<template>
    <div>
        <page-header>
            <div slot>报价单</div>
            <!-- <div slot="right">清空</div> -->
        </page-header>
        <div class="list-box">
            <div class="list">
                <div class="detailHead">
                    <i class="icon iconfont icon-tishi"></i>
                    <div>{{ workFlowStatus }}</div>
                    <div>{{ orderwfInfo.nodeName }}</div>
                    <div @click="showHistory" v-show="currentOrderWfTypeCode != null"><a href="javascript:;">查看详情</a></div>
                </div>
                <div class="linkDetail p-t-10 p-l-10 p-b-10 p-r-10" @click="getCarInfo">
                    <div class="imghead">
                        <i class="iconfont icon-yixiangche"></i>
                    </div>
                    <div class="container">
                        <p>{{ order.carOrderInfoVoList[0].carOrderDetailInfoList[0].carName }}</p>
                        <p>颜色: <span>{{ order.carOrderInfoVoList[0].carOrderDetailInfoList[0].carAppertanceName }}</span></p>
                        <p v-if="isIntentionOrder">意向车</p>
                        <p v-else>车架号: <span>{{ order.carOrderInfoVoList[0].carOrderDetailInfoList[0].vinNo }}</span></p>
                    </div>
                    <div class="price">
                        <span>¥{{order.carOrderInfoVoList[0].totalActualSalesPrice.toFixed(2)}}</span>
                    </div>
                </div>
                <div class="itemsContainer p-t-10">
                    <div class="finance" @click="getFinance">
                        <cell title="金融" :icon="true">
                            <span slot="icon" class="hehe iconfont icon-icon-jinrong"></span>
                            <input type="text" v-model="getFinanceName" readonly>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                        </cell>
                    </div>
                    <div class="insurance" @click="getInsurance">
                        <cell title="保险" :icon="true">
                            <span slot="icon" class="hehe iconfont icon-icon-baoxian"></span>
                            <input type="text" v-model="getTotalInsurancePrice" readonly>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                        </cell>
                    </div>
                    <div class="aftermarket" @click="getAfterMarket">
                        <cell title="后市场" :icon="true">
                            <span slot="icon" class="hehe iconfont icon-icon-houshichang"></span>
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
                            <span slot="icon" class="hehe iconfont icon-icon-zhihuan"></span>
                            <input type="text" readonly>
                            <span slot="left" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                        </cell>
                    </div>
                    <div class="service" @click="routerTo('/serviceAndOther', order.orderNo)">
                        <cell title="服务费及其他" :icon="true">
                            <span slot="icon" class="hehe iconfont icon-icon-fuwufeijiqita"></span>
                            <input type="text" v-model="getTotalActualServiceFee" readonly>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                        </cell>
                    </div>
                </div>
                <div class="relativeOrder p-t-10">
                    <div @click="routerTo('/orderInfo', order.orderNo)">
                        <cell title="订单相关" :icon="true">
                            <span slot="icon" class="hehe iconfont icon-icon-dingdanxiangguan"></span>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                            <!-- <input type="text" placeholder=""> -->
                        </cell>
                    </div>
                    <div @click="getPayInfo">
                        <cell title="支付信息" :icon="true">
                            <span slot="icon" class="hehe iconfont icon-icon-zhifuxinxi"></span>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                            <!-- <input type="text" placeholder=""> -->
                        </cell>
                    </div>
                    <!-- 轩宇定制化需求   报价单内选择电子抵扣券-->
                    <div @click="getCouponInfo" v-show="GroupcustomizationValue === '000000'">
                        <cell title="优惠券" :icon="true">
                            <span slot="icon" class="hehe iconfont icon-youhuiquan"></span>
                            <span class="changeCouponName">{{queryCouponMoney}}</span>
                            <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                        </cell>
                    </div>
                </div>
                <div class="car-total-price" v-show="closingFlag != 1">
                    <span class="title">合计:</span>
                    <span class="value">¥ {{ (order.actualTotalPrice).toFixed(2) }}</span>
                </div>
            </div>
        </div>
        <div class="submitBtn flex" v-show="(wfStatus == -1 && closingFlag != 1)">
            <div class="left flex">
                <div class="bargain p-l-10">
                    <input v-if="!isIntentionOrder" class="radio" type="radio" v-model="isContract" value="true" />
                    <span v-if="!isIntentionOrder" class="radioInput" @click="switchContractStatus"></span><span v-if="!isIntentionOrder">合同</span>
                </div>
            </div>
            <div class="right tc" @click="submitOrderInfo">
                {{ isContract ? '合同审批' :'订单审批' }}
            </div>
        </div>
        <!-- 轩宇定制化需求  退车相关代码 -->
        <div class="submitBtn flex" v-show="closingFlag == 1 && GroupcustomizationValue === '000000'">
            <div class="left"></div>
            <div v-show="wfStatus == -1 || (wfStatus == 1 && currentOrderWfTypeCode == 'NewCarContractWfType')" class="right tc" @click="returnCar">
                退车
            </div>
            <div v-show="wfStatus == 0" class="right-callback tc" @click="cancelReturnCar">
                撤回
            </div>
        </div>
        <div class="submitBtn flex" v-show="(wfStatus == 0 && closingFlag != 1)">
            <div class="left"></div>
            <div class="right-callback tc" @click="withdrawOrderInfo">
                撤回
            </div>
        </div>
        <div class="submitBtn flex" v-show="(currentOrderWfTypeCode == config.order.wfType.intentionOrder.code && wfStatus == 1 && closingFlag != 1)">
            <div class="left flex direction-row-reverse">
                <div class="withDraw" @click="withdrawOrderInfo">
                    修改
                </div>
                <div class="update" @click="updateOrderInfo">
                    退订
                </div>
            </div>
        </div>
        <div class="submitBtn flex" v-show="((currentOrderWfTypeCode == config.order.wfType.order.code && wfStatus == 1 && closingFlag != 1))">
            <div class="left flex direction-row-reverse">
                <div class="withDraw" @click="withdrawOrderInfo">
                    修改
                </div>
                <div class="update" @click="updateOrderInfo">
                    退订
                </div>
            </div>
            <div class="right tc" @click="submitOrderInfo">
                合同审批
            </div>
        </div>
        <div class="submitBtn flex" v-show="((currentOrderWfTypeCode == config.order.wfType.contract.code && wfStatus == 1 && closingFlag != 1))">
            <div class="left flex direction-row-reverse">
                <div class="withDraw" @click="withdrawOrderInfo">
                    修改
                </div>
                <div class="update" @click="updateOrderInfo">
                    退订
                </div>
            </div>
            <div class="right tc" @click="finishOrderInfo">
                交车
            </div>
        </div>
        <div class="submitBtn flex" v-show="(orderApproveHistory.length > 0 && orderApproveHistory[0].orderTypeCode == 'WorkFlowTypeOrderUpdate') && (orderApproveHistory[0].nodeType != 1) && (orderApproveHistory[0].nodeStatus != 0)">
           <div class="left"></div>
            <div class="right-callback tc" @click="withdrawOrderInfo1">
                撤回修改
            </div>
        </div>
        <div class="finishCar" v-show="(closingFlag == 1 && currentOrderWfTypeCode != 'CrosstownRefuseWfType')">
            <span class="title">交车完成</span><span class="time">{{ closingDate }}</span>
        </div>
        <!-- 轩宇定制化需求  退车相关代码 -->
        <div class="finishCar" v-show="(closingFlag == -1 && currentOrderWfTypeCode == 'CrosstownRefuseWfType' && wfStatus == 1)">
            <span class="title">交车后退车完成</span><span class="time">{{ order.carOrderInfoVoList[0].auditPassTime }}</span>
        </div>
        <modal ref="historyModal" :title="'跟踪记录'" :confirmDisplay="false">
            <div class="historybox">
                <history :items="orderApproveHistory" :orderApproveHistory="true"></history>
            </div>
        </modal>
        <!-- 审批增加修改原因弹层开始 -->
        <modal ref="modal" :title="'修改原因'" :submitText="'发送'" @submit="submit" :afterConfirmClose='afterConfirmClose'>
            <div class="modelContent" slot>

                <div class="flex m-t-12">
                    <span class="flex-1">
                        <textarea name="" placeholder="请输入客户意见（最多150字）" maxlength="150" v-model="remark" id="" cols="30" rows="10"></textarea>
                    </span>
                </div>
            </div>
        </modal>
        <!-- 审批增加修改原因弹层结束 -->

        <div class="listmodel" @click="cancelFinanceFailReasonTypes" v-if="showFinanceFailReasonTypes">
            <div class="modelContainer">
                <div class="title p-l-10 p-r-10">
                    <span @click="cancelFinanceFailReasonTypes" class="pull-left">取消</span>
                    金融战败原因
                </div>
                <ul>
                    <li v-for="(item, index) in financeFailReasonTypes" :key="index" @click="choseFinanceFailReasonTypeItem(index)">
                        {{ item.name }}
                    </li>
                </ul>
            </div>
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
    import cell from 'components/cell'
    import modal from 'components/modal'
    import history from 'components/history-list/history-list.vue'
    import historyModal from 'components/modal'
    import api from 'common/api'
    import {
        Toast,
        MessageBox
    } from 'mint-ui'
    export default {
        mounted() {
            let _this = this
            _this.clearCarInfo()
            _this.clearFinancialOrderInfo()
            _this.resetIsSc()
            _this.getUserPermissionsInfo()
            _this.queryWorkflowInfoFromDB()
            _this.queryOrderInfoVosByCodeFromDB({
                orderNo: _this.$route.params.orderNo,
                allSubOrderFlag: true,
                ignoreDefault: 1
            })
            _this.queryOrderWfDetailInfo({
                orderNo: _this.$route.params.orderNo
            })
            _this.queryOrderWfInfoByOrderNo({
                orderNoSet: [
                    _this.$route.params.orderNo
                ]
            })
            _this.getFinanceFailReasonTypes({
                callback: (detailList) => {
                    _this.financeFailReasonTypes = detailList
                }
            })
        },
        destroyed() {},
        data() {
            return {
                GroupcustomizationValue: '',
                isContract: false,
                wfStatus: -2,
                currentOrderWfTypeCode: '',
                financeName: '',
                closingFlag: 0,
                config: config,
                closingDate: '',
                hasReturn: false,
                showFinanceFailReasonTypes: false,
                financeFailReasonTypes: [],
                queryCouponMoney: '',
                num: 0,
                remark: '', //报价单修改原因
                afterConfirmClose: false,
                haveApproveFlow: false, //判断是否有审批流程
                financeDetailInfo: {
                    orderNo: '',
                    defeatStatus: 0,
                    scDefeatReason: '',
                    financialOrderDetailInfo: {
                        loanTypeCode: '',
                        loanTypeName: '',
                        orderNo: '',
                        financeDetailCode: '',
                        financeTypeCode: '',
                        financeTypeName: '',
                        financeOrgCode: '',
                        financeOrgName: '',
                        downpaymentType: 0,
                        downPaymentAmount: null,
                        downpaymentMin: 0,   //下限
                        downpaymentMax: 0,
                        evIsPercent: 0,
                        balancePaymentValue: null,
                        balancePaymentMinValue: 0,
                        balancePaymentMaxValue: 0,
                        valueOfLoan: null,
                        taxRate: null,
                        cycleMonth: '', // 期数
                        payForMonth: null,
                        repaymentMethod: '',
                        repaymentMethodName: '',
                        cautionMoney: null,
                        finalMileage: null,
                        endingValueType: 0,
                        finalValue: null,
                        storeInPercent: 0,
                        storeSubsidyInterest: null,
                        financeInPercent: 0,
                        financeSubsidyInterest: null,
                        remark: ''
                    }
                },
            }
        },
        computed: {
            ...mapState('order', [
                'isSc',
                'order',
                'orderwfInfo',
                'orderApproveHistory',
            ]),
            ...mapGetters('order', [
                'getskuOrderTotalActualSalesPrice',
                'getTotalActualServiceFee',
                'getTotalInsurancePrice',
                'getFinanceName',
                'isOrderCanEdit',
                'financeStatus'
            ]),
            canEdit: function() {
                let _this = this
                return (_this.isSc && _this.isOrderCanEdit)
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

            // currentOrderWfTypeCode: 审批的类型  NewCarIntentionOrderWfType意向单
                                             //  NewCarOrderWfType订单
                                            //   NewCarContractWfType 合作
                                            //   NewCarRefuseWfType 退订
                //    wfStatus:审批的状态   -1表示待审批  0:审批中  1:审批通过     
                // closingFlag: 是否交车  0表示未交车   1表示已交车
            workFlowStatus: function() {
                let _this = this
                if (_this.wfStatus == -1 && _this.currentOrderWfTypeCode == null) {
                    return '新车报价'
                } else if (_this.wfStatus == -1 && _this.currentOrderWfTypeCode == config.order.wfType.intentionOrder.code) {
                    return '意向单待提交'
                } else if (_this.wfStatus == 0 && _this.currentOrderWfTypeCode == config.order.wfType.intentionOrder.code) {
                    return '意向单审批中'
                } else if (_this.wfStatus == 1 && _this.currentOrderWfTypeCode == config.order.wfType.intentionOrder.code) {
                    return '意向单通过'
                } else if ((_this.orderApproveHistory.length > 0 && _this.orderApproveHistory[0].orderTypeCode == 'WorkFlowTypeOrderUpdate') && _this.orderApproveHistory[0].nodeType != 1) {
                    return '订单修改审批中'
                }
                else if (_this.wfStatus == -1 && _this.currentOrderWfTypeCode == config.order.wfType.order.code) {
                    return '订单待提交'
                } else if (_this.wfStatus == 0 && _this.currentOrderWfTypeCode == config.order.wfType.order.code) {
                    return '订单审批中'
                } else if (_this.wfStatus == 1 && _this.currentOrderWfTypeCode == config.order.wfType.order.code) {
                    return '订单通过'
                } else if (_this.wfStatus == -1 && _this.currentOrderWfTypeCode == config.order.wfType.contract.code) {
                    return '合同待提交'
                } else if (_this.wfStatus == 0 && _this.currentOrderWfTypeCode == config.order.wfType.contract.code) {
                    return '合同审批中'
                } else if (_this.wfStatus == 1 && _this.currentOrderWfTypeCode == config.order.wfType.contract.code && _this.closingFlag != 1) {
                    return '合同通过'
                } else if (_this.wfStatus == -1 && _this.currentOrderWfTypeCode == config.order.wfType.refuse.code) {
                    return '退订待提交'
                } else if (_this.wfStatus == 0 && _this.currentOrderWfTypeCode == config.order.wfType.refuse.code) {
                    return '退订审批中'
                } else if (_this.wfStatus == 1 && _this.currentOrderWfTypeCode == config.order.wfType.refuse.code) {
                    return '退订通过'
                } else if (_this.closingFlag == 1) {
                    if (_this.wfStatus == 0 && _this.currentOrderWfTypeCode == "CrosstownRefuseWfType") {
                        return '退车审批中'
                    } else {
                        return '交车完成'
                    }
                } else if (_this.closingFlag == -1) {
                    if (_this.wfStatus == 1 && _this.currentOrderWfTypeCode == "CrosstownRefuseWfType") {
                        return '退车通过'
                    }
                }
            }
        },
        methods: {
            ...mapActions('insurance', [
                'removeTableList',
                'resetJiao',
                'resetBusi',
            ]),
            //查询是否设置审批流
            queryWorkflowInfoFromDB(){
                let params = {"onOffFlag":"1","approvalCriteriaType":"0","wfTypeCode":"WorkFlowTypeOrderUpdate"}
                api.clearingsettlement.finance.queryWorkflowInfoFromDB(params, res =>{
                    if(res.data.code == 'success' && res.data.obj.list.length > 0){
                        this.haveApproveFlow = true
                    }
                })
            },
            //修改原因提交
            submit(){
                let _this = this
                if(!this.remark){
                    Toast('请填写修改原因')
                    return
                }
                if (_this.order.orderNo != undefined) {
                    //发送ajax请求,将修改原因发送给审核人员
                    _this.submitOrderInfoForNewCarSales({
                        orderNo: _this.order.orderNo,
                        wfTypeCode: 'WorkFlowTypeOrderUpdate',
                        updateReason: this.remark
                    })
                    
                    this.$refs.modal.close();
                }
            },
            // 退车撤销
            cancelReturnCar() {
                const _this = this
                api.returnCar.cancelReturnTicket({
                    orderNo: this.order.orderNo,
                    wfTypeCode: "CrosstownRefuseWfType"
                }, (res) => {
                    if (res.data.code === 'success') {
                        _this.hasReturn = false
                        _this.queryOrderInfoVosByCodeFromDB({
                            orderNo: _this.$route.params.orderNo,
                            allSubOrderFlag: true,
                            ignoreDefault: 1
                        })
                        _this.queryOrderWfDetailInfo({
                            orderNo: _this.$route.params.orderNo
                        })
                    }
                })
            },
            // 退车功能
            returnCar() {
                const _this = this
                api.returnCar.makeReturnTicket({
                    orderNo: this.order.orderNo,
                    wfTypeCode: "CrosstownRefuseWfType"
                }, (res) => {
                    if (res.data.code === 'success') {
                        _this.hasReturn = true
                        _this.queryOrderInfoVosByCodeFromDB({
                            orderNo: _this.$route.params.orderNo,
                            allSubOrderFlag: true,
                            ignoreDefault: 1
                        })
                        _this.queryOrderWfDetailInfo({
                            orderNo: _this.$route.params.orderNo
                        })
                    }
                })
            },
            routerTo(url, code) {
                this.$router.push({
                    path: url + '/' + code
                })
            },
            // 轩宇环境判断
            getDictionaryAboutCompany() {
                let _this = this;
                api.getDataDetails({
                    refDetailCode: config.configOfXuanyu.refDetailCode
                }).then((res) => {
                    if (res.data.code === 'success') {
                        this.GroupcustomizationValue = res.data.obj.refDetailValue
                        if (_this.GroupcustomizationValue === '000000') {
                            _this.queryCoupon(_this.$route.params.orderNo)
                        }
                    }
                })
            },
            switchContractStatus: function() {
                let _this = this
                _this.isContract = !_this.isContract
            },
            showHistory: function() {
                let _this = this
                _this.$refs.historyModal.open()
            },
            createOrderInfo: function() {
                let _this = this
                _this.insertOrderInfo(_this.$data.order)
            },
            submitOrderInfo: function() {
                let _this = this
                let wfTypeCode = ''
                if (_this.wfStatus == -1 && !_this.isContract && _this.isIntentionOrder) {
                    wfTypeCode = config.order.wfType.intentionOrder.code
                } else if (_this.wfStatus == -1 && !_this.isContract && !_this.isIntentionOrder) {
                    wfTypeCode = config.order.wfType.order.code
                } else if (_this.wfStatus == -1 && _this.isContract) {
                    wfTypeCode = config.order.wfType.contract.code
                } else if (_this.currentOrderWfTypeCode == config.order.wfType.order.code && _this.wfStatus == 1) {
                    wfTypeCode = config.order.wfType.contract.code
                }
                if (_this.order.orderAddInfoPlateType == undefined) {
                    Toast('订单相关：上牌类型为空!')
                    return
                }
                if (_this.order.orderAddInfoSalesType == undefined) {
                    Toast('订单相关：销售类型为空!')
                    return
                }
                if (wfTypeCode == config.order.wfType.contract.code && _this.order.bookingClosingDate == undefined) {
                    Toast('订单相关：预计交车日期为空!')
                    return
                }
                if (_this.financeStatus == 0) {
                    MessageBox.confirm('金融方案不能为空, 如客户为全款, 请选择金融战败原因', '提醒', {
                        confirmButtonText: '战败',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then((action) => {
                        if (action === 'confirm') {
                            _this.selectFinanceFailReasonTypes()
                        }
                    })
                    return
                } else if (_this.financeStatus == 1) {
                    MessageBox.confirm('您已经邀请金融专员协作报价, 请在金融专员报价后提交', '提醒', {
                        showConfirmButton: false,
                        cancelButtonText: '关闭',
                        type: 'warning'
                    }).then((action) => {
                    })
                    return
                }
                if (_this.order.orderNo != undefined && wfTypeCode != undefined) {
                    _this.submitOrderInfoForNewCarSales({
                        orderNo: _this.order.orderNo,
                        wfTypeCode: wfTypeCode
                    })
                }
            },
            updateOrderInfo: function() {
                let _this = this
                let wfTypeCode = config.order.wfType.refuse.code
                if (_this.order.orderNo != undefined && wfTypeCode != undefined) {
                    _this.submitOrderInfoForNewCarSales({
                        orderNo: _this.order.orderNo,
                        wfTypeCode: wfTypeCode
                    })
                }
            },
            withdrawOrderInfo1(){
                let _this = this
                if (_this.order.orderNo != undefined) {
                    _this.withdrawOrderInfoForNewCarSales({
                        orderNo: _this.order.orderNo,
                        wfTypeCode: _this.orderApproveHistory[0].orderTypeCode,
                        wfCode: _this.orderApproveHistory[0].wfCode
                    })
                }
            },
            withdrawOrderInfo: function() {
                let _this = this
                if(_this.haveApproveFlow){
                    if (((_this.currentOrderWfTypeCode == config.order.wfType.order.code) || (_this.currentOrderWfTypeCode == config.order.wfType.contract.code) ) && _this.wfStatus == 1 && _this.closingFlag != 1) {
                        this.$refs.modal.open();
                        this.remark = '';
                        return;
                    }
                }
                if (_this.order.orderNo != undefined) {
                    _this.withdrawOrderInfoForNewCarSales({
                        orderNo: _this.order.orderNo
                    })
                }
            },
            finishOrderInfo: function() {
                let _this = this
                if (_this.order.orderNo != undefined) {
                    _this.finishCar({
                        orderNo: _this.order.orderNo
                    })
                }
            },
            editFinancePro: function() {
                let _this = this
                if (_this.order.financialOrderInfoVoList.length > 0 && _this.order.financialOrderInfoVoList[0] != null && _this.order.orderNo != undefined) {
                    _this.updateFinancialOrderInfo({
                        financeDetailInfo: _this.$data.financeDetailInfo,
                        callback: () => {
                            _this.queryOrderInfoVosByCodeFromDB({
                                orderNo: _this.$route.params.orderNo,
                                allSubOrderFlag: true,
                                ignoreDefault: 1
                            })
                        }
                    })
                } else {
                    delete _this.$data.financeDetailInfo.financialOrderDetailInfo
                    // 新建订单后直接在报价单页面点击订单审批有关战败的请求
                    _this.newEditFinancialOrderInfo({
                        financeDetailInfo:  _this.$data.financeDetailInfo,
                        callback: () => {
                            _this.queryOrderInfoVosByCodeFromDB({
                                orderNo: _this.$route.params.orderNo,
                                allSubOrderFlag: true,
                                ignoreDefault: 1
                            })
                        }
                    })
                }
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
                            orderNo: _this.order.orderNo,
                            carCode: _this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].carCode
                        }
                    })
                }
            },
            getAfterMarket: function() {
                let _this = this
                if (_this.order.orderNo != undefined) {
                    if ((_this.order.skuOrderInfoVoList != null && _this.order.skuOrderInfoVoList.length > 0) || !_this.canEdit) {
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
            // 进入优惠券页面
            getCouponInfo: function() {
                let _this = this;
                if (_this.order.orderNo != undefined) {
                    _this.$router.push({
                        path: '/couponInfo/' + _this.order.orderNo
                    })
                }
            },
            // 优惠券一栏右侧提示信息
            queryCoupon: function(orderCode) {
                let _this = this;
                let testData = {
                    orderNo: orderCode,
                    currentPage: 1,
                    pageSize: 1000
                }
                api.getCouponInfo.getCoupon(testData, (res) => {
                    if (res.data.code === 'success') {
                        // _this.num = res.data.obj.totalAmount;
                        // 订单待提交
                        if (res.data.obj.wfStatus === '-1') {
                            if (res.data.obj.totalAmount === 0) {
                                _this.queryCouponMoney = '查看可用券';
                            } else {
                                _this.queryCouponMoney = '￥' + res.data.obj.totalAmount;
                            }
                        } else {
                            if (res.data.obj.totalAmount === 0) {
                                _this.queryCouponMoney = '';
                            } else {
                                _this.queryCouponMoney = '￥' + res.data.obj.totalAmount;
                            }
                        }
                    }
                })
            },
            selectFinanceFailReasonTypes: function() {
                let _this = this
                _this.showFinanceFailReasonTypes = true
            },
            cancelFinanceFailReasonTypes: function() {
                let _this = this
                _this.showFinanceFailReasonTypes = false
            },
            choseFinanceFailReasonTypeItem: function(index) {
                let _this = this
                let financeFailReasonTypeItem = _this.financeFailReasonTypes[index]
                _this.$data.financeDetailInfo.defeatStatus = 1
                _this.$data.financeDetailInfo.scDefeatReason = financeFailReasonTypeItem.value
                _this.$data.financeDetailInfo.orderNo = _this.$route.params.orderNo
                _this.editFinancePro()
            },
            ...mapActions('order', [
                'queryOrderInfoVosByCodeFromDB',
                'submitOrderInfoForNewCarSales',
                'withdrawOrderInfoForNewCarSales',
                'finishCar',
                'queryOrderWfDetailInfo',
                'queryOrderWfInfoByOrderNo',
                'resetIsSc',
                'getUserPermissionsInfo',
            ]),
            ...mapActions('carInfo', [
                'clearCarInfo'
            ]),
            ...mapActions('financePro', [
                'clearFinancialOrderInfo',
                'getFinanceFailReasonTypes',
                'insertFinancialOrderInfo',
                'newEditFinancialOrderInfo'
            ])
        },
        watch: {
            order: {
                handler(value) {
                    let _this = this
                    _this.$data.wfStatus = value.carOrderInfoVoList[0].wfStatus
                    _this.$data.currentOrderWfTypeCode = value.carOrderInfoVoList[0].currentOrderWfTypeCode
                    _this.$data.closingFlag = value.closingFlag
                    if (value.closingDate) {
                        _this.$data.closingDate = value.closingDate.split('.')[0]
                    }
                },
                deep: true
            }
        },
        components: {
            PageHeader,
            cell,
            modal,
            history,
            historyModal
        },
        created() {
            const _this = this
            _this.getDictionaryAboutCompany()
            _this.removeTableList()
            _this.resetJiao()
            _this.resetBusi()
        }
    }
</script>
<style lang="scss" scoped>
    .detailHead {
        height: rem(80);
        line-height: rem(80);
        width: 100%;
        display: flex;
        text-align: left;
        background-color: #ffffff;
    }
    .detailHead>.icon {
        font-family: PingFangSC-Regular;
        font-size: rem(34);
        color: rgb(0, 140, 238);
        margin-left: rem(20);
        margin-right: rem(12);
    }
    .detailHead>div {
        flex: 1;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: keep-all;
        white-space: nowrap;
        display: inline-block;
        text-align: left;
    }
    .detailHead>div a {
        color: #7e8387;
        text-decoration: underline !important;
    }
    .linkDetail {
        margin-top: rem(6);
        height: rem(162);
        box-sizing: border-box;
        background-color: #ffffff;
        display: flex;
        padding-top: rem(30);
        padding-left: rem(20);
    }
    .linkDetail .imghead {
        flex: 2;
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
        flex: 4;
        margin-left: rem(12);
        max-width: 55%;
    }
    .linkDetail .container p:first-child {
        height: rem(40);
        line-height: rem(40);
        font-size: rem(28);
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .linkDetail .container p:nth-child(2) {
        height: rem(33);
        line-height: rem(33);
        font-size: rem(24);
        color: #7e8387;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
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
        flex: 2;
        text-align: left;
        line-height: rem(122);
        font-size: rem(26);
        font-family: PingFangSC-Regular;
        color: rgb(51, 51, 51);
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .itemsContainer>div>div {
        border-top: 1px solid rgba(240, 242, 245, .5);
    }
    .submitBtn {
        position: fixed;
        -webkit-transform: translateZ(0);
        width: 100%;
        max-width: 750px;
        margin: 0 auto;
        bottom: 0;
        height: rem(90);
        line-height: rem(90);
        background-color: rgb(255, 255, 255);
        box-shadow: 0px 0px rem(4) #bbb;
    }
    .submitBtn>.right {
        flex: 3;
        background-image: linear-gradient(90deg, #008cee 0%, #36acfe 100%);
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
        flex: 1
    }
    .submitBtn>.left .total span {
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
        margin-top: rem(63);
        padding-left: rem(20);
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
        font-size: rem(40) !important;
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
            width: remp(260);
            height: remp(155);
            padding: remp(5) remp(10);
            box-sizing: border-box;
            border-radius: remp(4);
        }
    }
    .list-box {
        -webkit-transform: translateZ(0);
        .list {
            width: 100%;
            background-color: $browser-default-color !important;
            padding-bottom: rem(120);
        }
    }
    .changeCouponName {
        display: inline-block;
        text-align: right;
    }
    .listmodel {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .4)
    }
    .listmodel>.modelContainer {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: rem(500);
        background-color: #e7e7e7;
    }
    .listmodel>.modelContainer .title {
        height: rem(80);
        line-height: rem(80);
        background-color: rgb(54, 172, 254);
        color: #fff;
        text-align: center;
    }
    .listmodel>.modelContainer ul {
        height: rem(420);
        overflow-y: auto;
    }
    .listmodel>.modelContainer ul li {
        height: rem(70);
        line-height: rem(70);
        text-align: center;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
    }
</style>
