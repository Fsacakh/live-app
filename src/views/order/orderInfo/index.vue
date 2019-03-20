<template>
    <div>
        <page-header>
            <div slot>报价单-订单相关</div>
        </page-header>
        <div v-if="addData != ''">
            <cell :title="addInfo.orderAddInfoCarSalesSubKind">
                <input type="text" v-if="judgeStatus" placeholder="请选择销售类型" v-model="SalesTypeName" readonly/>
                <input type="text" v-else placeholder="请选择销售类型" @click="showSelect('sales')" v-model="SalesTypeName" readonly/>
                <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
            </cell>
            <cell :title="addInfo.orderAddInfoPlateType">
                <input type="text" v-if="judgeStatus" placeholder="请选择上牌类型" v-model="PlateTypeName" readonly/>
                <input type="text" v-else placeholder="请选择上牌类型" @click="showSelect('no')" v-model="PlateTypeName" readonly/>
                <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
            </cell>
            <cell title="上牌地点" v-if="OrderAddInfoVo.orderAddInfoPlateType == config.order.plateType.nonLocal">
                <input type="text" placeholder="请输入外地上牌地点" v-model="OrderAddInfoVo.orderAddPlateAddress"/>
            </cell>
            <cell title="上牌方式" v-if="OrderAddInfoVo.orderAddInfoPlateType == config.order.plateType.nonLocal">
                <input type="text" @click.prevent="showPlateModeSelect" v-model="OrderAddInfoVo.orderAddPlateModeName" readonly/>
            </cell>
            <cell title="选号方式" v-if="OrderAddInfoVo.orderAddInfoPlateType == config.order.plateType.local">
                <input type="text" @click.prevent="showPickWaySelect" v-model="OrderAddInfoVo.orderAddPickWayName" readonly/>
            </cell>
            <cell title="客户姓名" class="m-t-10">
                <input type="text" v-model="edit.custName" readonly/>
            </cell>
            <cell title="证件类型" :triangle="true" :cpType="'rests'">
                <input style="background: #fff" @click="clickidtype" onfocus="this.blur();" :disabled="idtypenameDisabled" v-model="idtypename" type="text" placeholder="请选择证件类型">
            </cell>
            <cell title="客户证件号">
                <input type="text" v-model="edit.custIdNo" :readonly="custIdNoDisabled" />
            </cell>
            <cell title="订金金额">
                <input type="number" placeholder="请填写订金金额" v-model="OrderAddInfoVo.OrderAddInfoDeposit" @change="checkAddInfoDeposit" />
            </cell>
            <cell :title="addInfo.orderAddInfoBookingInvoiceDate">
                <input type="text" v-if="judgeStatus" placeholder="请选择开票日期" readonly v-model="OrderAddInfoVo.orderAddInfoBookingInvoiceDate" />
                <input type="text" v-else placeholder="请选择开票日期" @click="openPicker('invoice')" readonly v-model="OrderAddInfoVo.orderAddInfoBookingInvoiceDate" />
                <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
            </cell>
            <cell title="预计交车日期">
                <input type="text" v-if="judgeStatus" placeholder="请选择交车日期" v-model="edit.bookingClosingDate" readonly/>
                <input type="text" v-else placeholder="请选择交车日期" v-model="edit.bookingClosingDate" @click="openPicker('no')" readonly/>
                <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
            </cell>
            <cell :title="addInfo.orderAddInfoInvoiceType">
                <live-select v-model="params" :selectData="selectData" :disabled="judge"></live-select>
            </cell>
            <!--开票名称-->
            <cell :title="params === 1 ? '开票人' : '企业名称'">
                <input type="text" :placeholder="params === 1 ? '请输入开票人' : '请输入企业名称'" v-model="OrderAddInfoVo.orderAddInfoInvoiceTitle" :readonly="judge || judgeStatus" />
            </cell>
            <!--开票人证件号-->
            <cell :title="params === 1 ? '证件号' : '企业税号'">
                <input type="text" value="" :placeholder="params === 1 ? '请输入证件号' : '请输入企业税号'" v-model="OrderAddInfoVo.orderAddInfoInvoiceCusId" :readonly="judge || judgeStatus" />
            </cell>
            <!--开票人联系方式-->
            <cell :title="addInfo.orderAddInfoInvoiceCusMobile">
                <input type="number" placeholder="请输入开票人联系方式" v-model="OrderAddInfoVo.orderAddInfoInvoiceCusMobile" :readonly="judge || judgeStatus" />
            </cell>
            <remark title="备注" class="m-t-10" @textarea="remarkInfo" v-model="edit.remark" :placeholder="placeholder" :maxlength="100"  :readonly="judge || judgeStatus"></remark>
            <div class="submit">
                <mt-button v-if="!(order.closingFlag == 1) && !judgeStatus" size="large" type="primary" @click="addOrderInfo">保存</mt-button>
            </div>
            <account-list @closeSelect="closeSelect" @changeSelect="changeStatus" ref="getType" :listselectShow='listselectShow' :accountnum='accountnum' :dataInfo="dataInfo">
            </account-list>
            <mt-datetime-picker v-model="time" ref="picker" type="date" :startDate="new Date()" year-format="{value} 年" month-format="{value} 月" date-format="{value} 日" @confirm="handleConfirm">
            </mt-datetime-picker>
        </div>
        <div class="orderinfoLoad" v-if="showLoading">
            <loading></loading>
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
        <div class="listmodel" @click="cancelPlateModes" v-if="showPlateMode">
            <div class="modelContainer">
                <div class="title p-l-10 p-r-10">
                    <span @click="cancelPlateModes">取消</span>
                </div>
                <ul>
                    <li v-for="(item, index) in plateModes" :key="index" @click="chosePlateModeItem(index)">
                        {{ item.name }}
                    </li>
                </ul>
            </div>
        </div>
        <div class="listmodel" @click="cancelPickWays" v-if="showPickWay">
            <div class="modelContainer">
                <div class="title p-l-10 p-r-10">
                    <span @click="cancelPickWays">取消</span>
                </div>
                <ul>
                    <li v-for="(item, index) in pickWays" :key="index" @click="chosePickWayItem(index)">
                        {{ item.name }}
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    import Vue from "vue"
    import {
        DatetimePicker,
        Toast,
        Button,
        Picker
    } from 'mint-ui'
    import {
        mapState
    } from 'vuex'
    import config from 'common/config'
    import pageHeader from '@/components/header/PageHeader'
    import cell from '@/components/cell'
    import cellBox from '@/components/cell-box'
    import remark from '@/components/remark'
    import accountList from '@/components/accounttypes'
    import liveSelect from '@/components/select'
    import loading from '@/components/loading/loading.vue'
    import api from 'common/api'
    import common from 'common/common'
    Vue.component(Button.name, Button);
    Vue.component(DatetimePicker.name, DatetimePicker);
    Vue.component(Picker.name, Picker);
    export default {
        created() {
            this.getAddInfo()
            this.getLoginInfo()
            this.getJudgeInfo()
            this.setDefaultTime()
            this.getOrderRelevantPlateFlag()
            this.getDictionaryAboutCompany()
        },
        mounted() {
            let _this = this;
            this.getDataDictionary(config.ref.idtype, this.idType)
            this.slots[0].values = this.idType
            common.fixedHeader()
        },
        data: function() {
            return {
                placeholder: '请输入客户意见（最多100字)',
                config: config,
                invoiceLabel: {
                    identityCardNum: '证件号',
                    dutyNum: '税号',
                    idPlaceholder: '请输入开票人证件号',
                    dutyPlaceholder: '请输入开票人税号'
                },
                GroupcustomizationValue: '',
                judge: true,
                showLoading: true,
                params: 1,
                selectData: config.invoiceType,
                time: '',
                type: 'invoice',
                salesType: '',
                listselectShow: false,
                accountnum: 0,
                SalesTypeName: '',
                PlateTypeName: '',
                edit: {
                    custIdNo: '',
                    orderNo: '',
                    orderChannelType: '',
                    orderTypeCode: '',
                    paymentTypeCode: '',
                    custName: '',
                    custCode: '',
                    bookingClosingDate: '',
                    remark: '',
                    orderAddInfos: []
                },
                OrderAddInfoVo: {
                    OrderAddInfoDeposit: null,
                    orderAddInfoCarSalesSubKind: '',
                    orderAddInfoPlateType: '',
                    orderAddInfoBookingInvoiceDate: '',
                    orderAddInfoInvoiceType: '',
                    orderAddInfoInvoiceTitle: '',
                    orderAddInfoInvoiceCusId: '',
                    orderAddInfoInvoiceCusMobile: '',
                    orderAddPlateAddress: '',
                    orderAddPlateMode: -1,
                    orderAddPlateModeName: '',
                    orderAddPickWay: -1,
                    orderAddPickWayName: '',
                    remark: ''
                },
                OrderAddInfoDeposit: null,
                orderAddCode: {},
                addInfo: {},
                addData: '',
                loginData: '',
                judgeStatus: false,
                custIdNoDisabled: false,
                idtypenameDisabled: false,
                idType: [],
                slots: [{
                    flex: 1,
                    values: [],
                    className: 'slot',
                    textAlign: 'center'
                }],
                plateModes: [
                    {
                       name: '人车不去',
                       code: 0
                    },
                    {
                       name: '人车要去',
                       code: 1
                    },
                    {
                       name: '车去人不去',
                       code: 2
                    }
                ],
                pickWays: [
                    {
                       name: '乙方到场',
                       code: 0
                    },
                    {
                       name: '全权委托甲方',
                       code: 1
                    },
                    {
                       name: '甲方选号时电话通知乙方',
                       code: 2
                    }
                ],
                pickerValue: null,
                pickershow: false,
                showPlateMode: false,
                showPickWay: false,
                checkOrderRelevantPlate: false,
                idtypename: '',
                idtypecode: ''
            }
        },
        computed: {
            ...mapState('order', [
                'orderInfo',
                'order'
            ]),
            ...mapState('homepage', [
                'loginInfo'
            ])
        },
        methods: {
            stopBubble(e) {
                if (e && e.stopPropagation) {
                    e.stopPropagation(); //w3c
                } else {
                    window.event.cancelBubble = true; //IE
                }
            },
            clickidtype() {
                this.pickershow = true
            },
            cancel() {
                this.pickershow = false
            },
            pickerconfirm(type) {
                if (type) {
                    //确认
                    this.pickershow = false
                    if (this.pickerValue) {
                        this.slots[0].value = this.pickerValue
                        this.idtypecode = this.pickerValue.code
                        this.idtypename = this.pickerValue.name
                    }
                } else {
                    //取消
                    this.pickershow = false
                }
            },
            onValuesChange(picker, value) {
                this.pickerValue = value[0]
            },
            getDataDictionary(code, obj, callback) {
                api.ref.getDataDictionary({
                        refCode: code
                    },
                    msg => {
                        if (msg.data.message == "success") {
                            let data = msg.data.obj.referenceDetailInfos;
                            for (let index = 0; index < data.length; index++) {
                                this.$set(obj, index, {
                                    code: data[index].refDetailCode,
                                    name: data[index].refDetailName,
                                    type: code
                                })
                            }
                        }
                    }
                );
            },
            setDefaultTime() {
                let currentDay = new Date()
                let year = currentDay.getFullYear();
                let month = parseInt(currentDay.getMonth() + 1) < 10 ? '0' + (currentDay.getMonth() + 1) : (currentDay.getMonth() + 1);
                let day = parseInt(currentDay.getDate()) < 10 ? '0' + currentDay.getDate() : currentDay.getDate()
                let date = year + '-' + month + '-' + day;
                this.edit.bookingClosingDate = date
            },
            getDictionaryAboutCompany() {
                api.getDataDetails({
                    refDetailCode: config.configOfXuanyu.refDetailCode
                }).then((res) => {
                    if (res.data.code === 'success') {
                        this.GroupcustomizationValue = res.data.obj.refDetailValue
                    }
                    this.getOrderInfo()
                })
            },
            getOrderRelevantPlateFlag: function() {
                let _this = this
                api.getDataDetails({
                    refDetailCode: config.ref.checkOrderRelevantPlate
                }).then((res) => {
                    if (res.data.code === 'success') {
                        _this.$data.checkOrderRelevantPlate = (res.data.obj.refDetailValue == 'true')
                    }
                })
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
            remarkInfo: function(val) {
                this.edit.remark = val
            },
            getAddInfo: function() {
                const $this = this
                this.$store.dispatch('servicefee/getServiceType', {
                    poros: {
                        refCode: config.ref.orderAddInfoType
                    },
                    callBack: function(msg) {
                        if (msg.data.code == "success") {
                            let len = msg.data.obj.referenceDetailInfos
                            for (let i = 0; i < len.length; i++) {
                                $this.addInfo[len[i].refDetailCode] = len[i].refDetailName
                            }
                            $this.addData = msg.data.obj.referenceDetailInfos
                            $this.showLoading = false
                        }
                    }
                })
            },
            handleConfirm(val) {
                let year = val.getFullYear();
                let month = parseInt(val.getMonth() + 1) < 10 ? '0' + (val.getMonth() + 1) : (val.getMonth() + 1);
                let day = parseInt(val.getDate()) < 10 ? '0' + val.getDate() : val.getDate()
                let date = year + '-' + month + '-' + day;
                if (this.type == 'invoice') {
                    this.OrderAddInfoVo.orderAddInfoBookingInvoiceDate = date
                } else {
                    this.edit.bookingClosingDate = date
                }
            },
            openPicker(type) {
                this.time = new Date()
                if (this.judge) {
                    return
                }
                this.type = type
                this.$refs.picker.open();
            },
            addOrderInfo: function() {
                const $this = this
                let addList = [];
                if (this.judge) {
                    return
                }
                if (this.OrderAddInfoVo.orderAddInfoCarSalesSubKind == '') {
                    Toast({
                        message: config.alertInfo.SalesSub,
                        position: 'top'
                    })
                    return
                } else if (this.OrderAddInfoVo.orderAddInfoPlateType == '') {
                    Toast({
                        message: config.alertInfo.PlateType,
                        position: 'top'
                    })
                    return
                } else if (this.OrderAddInfoVo.OrderAddInfoDeposit == null || this.OrderAddInfoVo.OrderAddInfoDeposit == undefined) {
                    Toast({
                        message: config.alertInfo.OrderAddInfoDeposit,
                        position: 'top'
                    })
                    return
                }
                if (this.edit.custName == '') {
                    Toast({
                        message: '客户姓名不能为空',
                        position: 'top'
                    })
                    return
                }
                if (this.idtypecode == '') {
                    Toast({
                        message: '证件类型不能为空',
                        position: 'top'
                    })
                    return
                }
                //验证客户证件号是否为空
                if (this.edit.custIdNo == '') {
                    Toast({
                        message: '客户证件号不能为空',
                        position: 'top'
                    })
                    return
                }
                //验证订单金额是否为空
                if (this.OrderAddInfoVo.OrderAddInfoDeposit == '') {
                    Toast({
                        message: '订单金额不能为空',
                        position: 'top'
                    })
                    return
                }
                if (this.OrderAddInfoVo.orderAddInfoPlateType === config.order.plateType.nonLocal && this.checkOrderRelevantPlate) {
                    if (!this.OrderAddInfoVo.orderAddPlateAddress) {
                        Toast({
                            message: '上牌地点不能为空',
                            position: 'top'
                        })
                        return
                    }
                    if (this.OrderAddInfoVo.orderAddPlateMode < 0) {
                        Toast({
                            message: '上牌方式不能为空',
                            position: 'top'
                        })
                        return
                    }
                }
                if (this.OrderAddInfoVo.orderAddInfoPlateType === config.order.plateType.local && this.checkOrderRelevantPlate) {
                    if (this.OrderAddInfoVo.orderAddPickWay < 0) {
                        Toast({
                            message: '选号方式不能为空',
                            position: 'top'
                        })
                        return
                    }
                }
                $this.edit.orderNo = $this.orderInfo.orderNo
                $this.OrderAddInfoVo.orderAddInfoInvoiceType = $this.params === 0 ? '公司' : '个人'
                for (let i in this.addInfo) {
                    addList.push({
                        addCode: i,
                        addValue: $this.OrderAddInfoVo[i],
                        orderAddCode: $this.orderAddCode[i]
                    })
                }
                $this.edit['custIdTypeCode'] = this.idtypecode
                $this.edit['custIdNo'] = this.edit.custIdNo
                $this.edit.orderAddInfos = addList
                this.$store.dispatch('order/addOrderInfo', {
                    poros: $this.edit,
                    callBack: (msg) => {
                        if (msg.data.code == "success") {
                            Toast({
                                message: config.alertInfo.success,
                                position: 'top'
                            })
                            $this.$router.replace({
                                path: `/order/${$this.orderInfo.orderNo}`
                            })
                        }
                    }
                })
            },
            changeStatus: function(type) {
                this.listselectShow = type
            },
            showSelect: function(type) {
                if (this.judge) {
                    return
                }
                this.salesType = type
                if (type == 'sales') {
                    this.$refs.getType.getAccountType(config.ref.salesType)
                } else {
                    this.$refs.getType.getAccountType(config.ref.plateType)
                }
            },
            showPlateModeSelect: function() {
                let _this = this
                _this.$data.showPlateMode = true
            },
            showPickWaySelect: function() {
                let _this = this
                _this.$data.showPickWay = true
            },
            checkAddInfoDeposit: function() {
                let _this = this
                if (_this.GroupcustomizationValue === '000000') {
                } else {
                    if (_this.$data.OrderAddInfoVo.OrderAddInfoDeposit < 0) {
                        _this.$data.OrderAddInfoVo.OrderAddInfoDeposit = 0
                    }
                }
            },
            dataInfo(val, num) {
                if (this.salesType == "sales") {
                    this.OrderAddInfoVo.orderAddInfoCarSalesSubKind = val.value
                    this.SalesTypeName = val.text
                } else {
                    this.OrderAddInfoVo.orderAddInfoPlateType = val.value
                    this.PlateTypeName = val.text
                    if (this.OrderAddInfoVo.orderAddInfoPlateType == config.order.plateType.local) {
                        this.OrderAddInfoVo.orderAddPlateAddress = ''
                        this.OrderAddInfoVo.orderAddPlateMode = -1
                        this.OrderAddInfoVo.orderAddPlateModeName = ''
                    } else if (this.OrderAddInfoVo.orderAddInfoPlateType == config.order.plateType.nonLocal) {
                        this.OrderAddInfoVo.orderAddPickWay = -1
                        this.OrderAddInfoVo.orderAddPickWayName = ''
                    }
                }
            },
            closeSelect() {
                this.listselectShow = false
            },
            cancelPlateModes: function() {
                let _this = this
                _this.$data.showPlateMode = false
            },
            chosePlateModeItem: function(index) {
                let _this = this
                if (index >= 0) {
                    _this.$data.OrderAddInfoVo.orderAddPlateMode = _this.$data.plateModes[parseInt(index)].code
                    _this.$data.OrderAddInfoVo.orderAddPlateModeName = _this.$data.plateModes[parseInt(index)].name
                }
                _this.$data.showPlateMode = false
            },
            cancelPickWays: function() {
                let _this = this
                _this.$data.showPickWay = false
            },
            chosePickWayItem: function(index) {
                let _this = this
                if (index >= 0) {
                    _this.$data.OrderAddInfoVo.orderAddPickWay = _this.$data.pickWays[parseInt(index)].code
                    _this.$data.OrderAddInfoVo.orderAddPickWayName = _this.$data.pickWays[parseInt(index)].name
                }
                _this.$data.showPickWay = false
            },
            getOrderInfo: function() {
                const $this = this
                this.$store.dispatch('order/getOrderInfo', {
                    poros: {
                        orderNo: $this.$route.params.code,
                        allSubOrderFlag: config.qureySubOrderInfo.yes
                    },
                    callBack: function(msg) {
                        if (msg.data.code == "success") {
                            $this.edit.custName = $this.orderInfo.custName;
                            $this.edit.custCode = $this.orderInfo.custCode;
                            $this.edit.orderNo = $this.orderInfo.orderNo;
                            $this.edit.orderChannelType = $this.orderInfo.orderChannelType;
                            $this.edit.orderTypeCode = $this.orderInfo.orderTypeCode;
                            $this.edit.paymentTypeCode = $this.orderInfo.paymentTypeCode;
                            $this.edit.custIdNo = $this.orderInfo.custIdNo;
                            $this.custIdNoDisabled = $this.orderInfo.custIdNo ? true : false
                            $this.edit.remark = $this.orderInfo.remark;
                            $this.idtypename = $this.orderInfo.custIdTypeName
                            $this.idtypenameDisabled = $this.orderInfo.custIdTypeName ? true : false
                            $this.idtypecode = $this.orderInfo.custIdTypeCode
                            if ($this.GroupcustomizationValue === '000000') {
                                $this.edit.bookingClosingDate = $this.orderInfo.bookingClosingDate ? $this.orderInfo.bookingClosingDate.slice(0, 10) : $this.edit.bookingClosingDate;
                            } else {
                                $this.edit.bookingClosingDate = $this.orderInfo.bookingClosingDate ? $this.orderInfo.bookingClosingDate.slice(0, 10) : '';
                            }
                            let addInfo = $this.orderInfo.orderAddInfos
                            addInfo.forEach(function(item, index) {
                                $this.OrderAddInfoVo[item.addCode] = item.addValue;
                                $this.orderAddCode[item.addCode] = item.orderAddCode;
                                if (item.addCode == config.orderAddInfoPlateType) {
                                    $this.PlateTypeName = item.addValueName
                                } else if (item.addCode == config.orderAddInfoSalesType) {
                                    $this.SalesTypeName = item.addValueName
                                }
                                if (item.addValue == config.orderAddInfoInvoiceTypeName) {
                                    $this.params = 0
                                } else if (item.addValue == config.orderAddInfoInvoiceTypeName2) {
                                    $this.params = 1
                                }
                            });
                            $this.$data.OrderAddInfoVo.OrderAddInfoDeposit = $this.$data.OrderAddInfoVo.OrderAddInfoDeposit && Number($this.$data.OrderAddInfoVo.OrderAddInfoDeposit).toFixed(2);
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
        },
        watch: {
            OrderAddInfoVo: {
                handler(val) {
                    let _this = this
                    if (_this.$data.OrderAddInfoVo.orderAddPlateMode >= 0) {
                        let index = _this.$data.plateModes.findIndex((item) => {
                            return (item.code == _this.$data.OrderAddInfoVo.orderAddPlateMode)
                        })
                        if (index >= 0) {
                            _this.$data.OrderAddInfoVo.orderAddPlateModeName = _this.$data.plateModes[index].name
                        }
                    }
                    if (_this.$data.OrderAddInfoVo.orderAddPickWay >= 0) {
                        let index = _this.$data.pickWays.findIndex((item) => {
                            return (item.code == _this.$data.OrderAddInfoVo.orderAddPickWay)
                        })
                        if (index >= 0) {
                            _this.$data.OrderAddInfoVo.orderAddPickWayName = _this.$data.pickWays[index].name
                        }
                    }
                },
                deep: true
            }
        },
        components: {
            cell,
            remark,
            cellBox,
            pageHeader,
            liveSelect,
            accountList,
            loading
        }
    }
</script>

<style lang="scss" scoped>
    .header {
        position: static!important;
    }
    .orderinfoLoad {
        margin-top: 50%;
    }
    .submit {
        padding: 0 rem(20);
        padding-bottom: remp(10);
        margin-top: rem(60);
        margin-bottom: rem(12);
    }
    .margin-left-30 {
        margin-left: rem(30);
    }
    .margin-right-30 {
        margin-right: rem(30);
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
    .listmodel>.modelContainer>.title>.center {
        margin: 0 auto;
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
