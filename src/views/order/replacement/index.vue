<template>
    <div>
        <div class="replacement" v-if="!showSelect">
            <page-header title="报价单-置换" @on-click-right="more">
                <div slot="right" v-if="edit&&!judgeStatus" v-show="verifyStatus == 0">删除</div>
            </page-header>
            <div>
                <cell title="车辆品牌">
                    <input type="text" placeholder="请输入车辆品牌" v-model="dataInfo.carBrandName" :readonly="judge || judgeStatus">
                </cell>
                <cell title="车型车款">
                    <input type="text" placeholder="请输入车型车款" v-model="dataInfo.carName" :readonly="judge || judgeStatus">
                </cell>
                <cell title="车架号">
                    <input type="text" placeholder="请输入车架号" v-model="dataInfo.vinNo" :readonly="judge || judgeStatus">
                </cell>
                <cell title="车牌号">
                    <input type="text" placeholder="请输入车牌号" v-model="dataInfo.carPlates" :readonly="judge || judgeStatus">
                </cell>
                <cell title="置换价格">
                    <input type="number" placeholder="请输入置换价格" v-model="dataInfo.actualSalesPrice" :readonly="judge || judgeStatus">
                </cell>
                <cell title="期望价格">
                    <input type="number" placeholder="请输入期望价格" v-model="dataInfo.expectedPrice" :readonly="judge || judgeStatus">
                </cell>
                <cell title="不评估原因" class="assessment">
                    <input @click="clickidtype" onfocus="this.blur();" v-model="dataInfo.noRemarkReason" type="text" placeholder="请选择不评估原因">
                </cell>
                <cell title="请输入原因" v-show="dataInfo.noRemarkReason === '其他'" style="height:50px">
                    <textarea style="resize:none;height:42px;width:170px;margin-top:6px;border: none;" placeholder="请输入原因" type="text" v-model="dataInfo.remark" :readonly="judge || judgeStatus"></textarea>
                </cell>
            </div>
            <div v-if="!(order.closingFlag==1) && !judgeStatus" v-show="verifyStatus == 0" class="saveBtn p-l-10 p-r-10 m-t-20">
                <div @click="saveData()">
                    保&ensp;存
                </div>
            </div>
        </div>
        <div class="listmodel" v-if="pickershow" @click="cancel">
            <div class="picker-pjl" @click="stopBubble">
                <mt-picker :showToolbar="true" :slots="slots" valueKey="name" @change="onValuesChange">
                    <div class="clearfix picker-top-pjl">
                        <mt-button @click.stop="pickerconfirm(0)" class="fl" size="small" type="primary">取消</mt-button>
                        <mt-button @click.stop="pickerconfirm(1)" class="fr" size="small" type="primary">确认</mt-button>
                    </div>
                </mt-picker>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {
        mapState
    } from 'vuex'
    import remark from '@/components/input-remark'
    import {
        Toast,
        MessageBox,
        Button,
        Picker
    } from 'mint-ui'
    import api from '../../../common/api'
    import config from '../../../common/config'
    import PageHeader from "components/header/PageHeader"
    import cell from 'components/cell'
    Vue.component(Button.name, Button);
    Vue.component(Picker.name, Picker);
    export default {
        components: {
            cell,
            remark,
            PageHeader
        },
        data() {
            return {
                pickershow: false,
                pickerValue: null,
                judge: true,
                showSelect: false,
                edit: false,
                dataInfo: {
                    orderSubstitutionCode: '',
                    orderNo: '',
                    accountTypeCode: config.replacement.accountTypeCode,
                    carName: '',
                    vinNo: '',
                    carPlates: '',
                    actualSalesPrice: '',
                    carBrandName: '',
                    expectedPrice: '', //期望价格
                    noRemarkReason: '', //不评估原因
                    remark: ''
                },
                slots: [{
                    flex: 1,
                    values: [],
                    className: 'slot',
                    textAlign: 'center'
                }],
                idType: [],
                judgeStatus: false,
                refDetailCode: '', //不评估原因code
                idtypename: '',
                idtypecode: '',
                verifyStatus:''
            }
        },
        computed: {
            //计算
            ...mapState('servicefee', []),
            ...mapState('order', [
                'order',
                'orderInfo'
            ]),
            ...mapState('homepage', [
                'loginInfo'
            ])
        },
        created() {
            this.getOrderInfo()
            this.getLoginInfo()
            this.getJudgeInfo()
            this.getVerificationstart()
        },
        mounted() {
            this.slots[0].values = this.idType
        },
        methods: {
            getVerificationstart(){
            },
            clickidtype() {
                this.getDataDictionary(config.ref.orderSubstitutionReason, this.idType)
                this.pickershow = true
            },
            pickerconfirm(type) {
                if (type) {
                    //确认
                    this.pickershow = false
                    if (this.pickerValue) {
                        this.slots[0].value = this.pickerValue
                        this.dataInfo.noRemarkReason = this.pickerValue.name
                    }
                } else {
                    //取消
                    this.pickershow = false
                }
            },
            onValuesChange(picker, value) {
                this.pickerValue = value[0]
            },
            cancel() {
                this.pickershow = false
            },
            stopBubble(e) {
                if (e && e.stopPropagation) {
                    e.stopPropagation(); //w3c
                } else {
                    window.event.cancelBubble = true; //IE
                }
            },
            getDataDictionary(code, obj, callback) {
                api.ref.getDataDictionary({
                    refCode: code
                }, msg => {
                    let data = msg.data.obj.referenceDetailInfos;
                    for (let index = 0; index < data.length; index++) {
                        this.$set(obj, index, {
                            code: data[index].refDetailCode,
                            name: data[index].refDetailName,
                            type: code
                        });
                    }
                })
            },
            differences() {
                return this.dataInfo.actualSalesPrice - this.dataInfo.expectedPrice
            },
            getLoginInfo: function() {
                const $this = this
                this.$store.dispatch('homepage/getLoginInfo', (res) => {
                    if (res.data.code == "success") {
                        this.loginData = this.loginInfo
                        $this.loginInfo.postnTypes.forEach((i) => {
                            if (i == config.root.scPostTypeCode) {
                                $this.judge = false
                            }
                        })
                    }
                })
            },
            //查询订单相关
            getOrderInfo: function() {
                const $this = this
                this.$store.dispatch('order/getOrderInfo', {
                    poros: {
                        orderNo: $this.$route.params.code,
                        allSubOrderFlag: config.qureySubOrderInfo.yes
                    },
                    callBack: function(msg) {
                        if (msg.data.code == "success") {
                            let data = msg.data.obj.orderSubstitutionInfoVoList[0]
                            if (msg.data.obj.orderSubstitutionInfoVoList.length != 0) {
                                $this.dataInfo.orderSubstitutionCode = data.orderSubstitutionCode
                                api.clearingsettlement
                                   .order
                                   .queryPaymentVerification({
                                       orderSubstitutionCode: data.orderSubstitutionCode,
                                       orderNo: $this.$route.params.code
                                    }, (res) => {
                                        if(res.data.obj){
                                            let verifyStatus = res.data.obj.verifyStatus
                                            let verificationTotalAmount = res.data.obj.verificationTotalAmount
                                            if (verifyStatus == 0 && verificationTotalAmount > 0) {
                                                $this.verifyStatus = 1
                                            } else {
                                                $this.verifyStatus = verifyStatus
                                            }
                                        }
                                    })
                                $this.dataInfo.actualSalesPrice = data.actualSalesPrice
                                $this.dataInfo.carBrandName = data.carBrandName
                                $this.dataInfo.carName = data.carName
                                $this.dataInfo.vinNo = data.vinNo
                                $this.dataInfo.carPlates = data.carPlates
                                $this.dataInfo.orderNo = data.orderNo
                                $this.dataInfo.expectedPrice = data.expectedPrice
                                $this.dataInfo.noRemarkReason = data.noRemarkReason
                                $this.dataInfo.remark = data.remark
                                $this.edit = $this.dataInfo.orderSubstitutionCode != '' ? true : false
                            }
                        }
                    }
                })
            },
            more() {
                if (this.judge) {
                    return
                }
                this.saveData('deleted')
            },
            saveData: function(type) {
                const $this = this
                if (this.judge) {
                    return
                }
                let params = {
                    orderNo: $this.$route.params.code,
                    accountTypeCode: "normalSale",
                    orderSubstitutionCode: $this.dataInfo.orderSubstitutionCode,
                    carName: $this.dataInfo.carName,
                    carBrandName: $this.dataInfo.carBrandName,
                    vinNo: $this.dataInfo.vinNo,
                    carPlates: $this.dataInfo.carPlates,
                    actualSalesPrice: $this.dataInfo.actualSalesPrice,
                    expectedPrice: $this.dataInfo.expectedPrice,
                    noRemarkReason: $this.dataInfo.noRemarkReason,
                    remark: $this.dataInfo.remark
                }
                if (params.carBrandName == '') {
                    Toast({
                        message: config.alertInfo.BrandStatus,
                        position: 'top'
                    })
                    return
                } else if (params.carName == '') {
                    Toast({
                        message: config.alertInfo.CarStatus,
                        position: 'top'
                    })
                    return
                } else if (params.actualSalesPrice == null) {
                    Toast({
                        message: config.alertInfo.PriceStatus,
                        position: 'top'
                    })
                    return
                }
                if ($this.edit == true) {
                    if (type == 'deleted') {
                        params.isDeleted = '1'
                        MessageBox.confirm(config.alertInfo.deleted).then(action => {
                            $this.editData(params)
                        })
                    } else {
                        $this.editData(params)
                    }
                } else {
                    $this.$store.dispatch('servicefee/addreplacement', {
                        poros: params,
                        callBack: function(msg) {
                            if (msg.data.code == 'success') {
                                let data = msg.data.obj;
                                for (let i in $this.dataInfo) {
                                    $this.dataInfo[i] = data[i]
                                }
                                Toast({
                                    message: config.alertInfo.success,
                                    position: 'top'
                                })
                                $this.$router.replace({
                                    path: `/order/${$this.order.orderNo}`
                                })
                            }
                        }
                    })
                }
            },
            editData: function(params) {
                const $this = this
                this.$store.dispatch('servicefee/editreplacement', {
                    poros: params,
                    callBack: function(msg) {
                        if (msg.data.code == 'success') {
                            let data = msg.data.obj;
                            for (let i in $this.dataInfo) {
                                $this.dataInfo[i] = data[i]
                            }
                            Toast({
                                message: config.alertInfo.success,
                                position: 'top'
                            })
                            $this.$router.replace({
                                path: `/order/${$this.order.orderNo}`
                            })
                        }
                    }
                })
            },
            getJudgeInfo() {
                const _this = this
                api.clearingsettlement.order.queryOrderInfoVosByCodeFromDB({
                    orderNo: _this.$route.params.code,
                    allSubOrderFlag: true,
                    ignoreDefault: 1
                }, function(res) {
                    if (res.data.code === 'success') {
                        if (res.data.obj.carOrderInfoVoList[0].wfStatus === -1) {
                            _this.judgeStatus = false
                        } else {
                            _this.judgeStatus = true
                        }
                    }
                })
            }
        }
    }
</script>
<style lang="scss" scoped>
    .replacement .cell:first-child {
        border-top: none
    }
    .replacement .cell:last-child {
        border-top: remp(5) solid rgba(240, 242, 245, 1);
    }
    .saveBtn {
        box-sizing: border-box;
        position: fixed;
        -webkit-transform: translateZ(0);
        bottom: 0;
        width: remp(375);
        padding: remp(0) remp(10);
        padding-bottom: remp(10)
    }
    .saveBtn>div {
        height: remp(50);
        line-height: remp(50);
        text-align: center;
        border-radius: remp(5);
        background-image: linear-gradient(90deg, #008cee 0%, #36acfe 100%);
        color: #ffffff;
        font-size: remp(18);
    }
    .assessment {
        margin-top: remp(40);
    }
    .listmodel {
        position: fixed;
        transform: translateZ(0);
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.4);
    }
    .picker-pjl {
        position: fixed;
        transform: translateZ(0);
        width: 100%;
        height: remp(200);
        overflow: hidden;
        bottom: 0;
        left: 0;
        background-color: #fff;
    }
    .picker-top-pjl {
        background-color: #26a2ff;
    }
    textarea::-webkit-input-placeholder {
        /*WebKit browsers*/
        line-height: 38px;
        text-align: center;
    }
    textarea::-moz-input-placeholder {
        /*Mozilla Firefox*/
        line-height: 38px;
        text-align: center;
    }
    textarea::-ms-input-placeholder {
        /*Internet Explorer*/
        line-height: 38px;
        text-align: center;
    }
</style>
