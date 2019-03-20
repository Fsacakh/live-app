<template>
    <div>
        <page-header ref="header">
            <div slot="left">
                <div class="left-arrow" @click="callback"></div>
            </div>
            <div slot>热销方案</div>
        </page-header>
        <mt-swipe :auto="0" @change="handleChange">
            <mt-swipe-item class="mt-swipe-item" v-for="(list, index) in itemList" :key="index">
                <div class="hotPlan">
                    <div class="title">
                        <i></i>&ensp;交强险&ensp;<i></i>
                    </div>
                    <div class="press  p-lr-10 b-white p-t-10 p-b-10">
                        <div class="resetStyle"><span>保险公司:</span><span>{{ list.tciComapnyName }}</span></div>
                        <div class="containerTwo resetStyle">
                            <div class="time">12个月</div>
                            <div class="price">
                                <span>总价:</span><span>¥{{ list.tciPrice }}</span>
                            </div>
                        </div>
                        <div class="resetStyle"><span>车船税:</span><span>¥{{ list.carTax }}</span></div>
                    </div>
                    <div class="title">
                        <i></i>&ensp;商业险&ensp;<i></i>
                    </div>
                    <div class="business p-lr-10 b-white p-t-10 p-b-10">
                        <div class="resetStyle"><span>保险公司:</span><span>{{ list.vciCompanyName }}</span></div>
                        <div class="resetStyle"><span>投保期:</span><span>12个月</span></div>
                        <div class="containerTwo resetStyle">
                            <div class="businessprice">
                                <span>首年商业险:</span><span>¥{{ list.vciPrice }}</span>
                            </div>
                            <div class="price">
                                <!-- <span>总价:</span><span>¥{{ list.totalPrice }}</span> -->
                            </div>
                        </div>
                    </div>
                    <div class="tableShow hotplan">
                        <table>
                            <thead>
                                <tr>
                                    <th>险种</th>
                                    <th>保额(元)</th>
                                    <th>保费(元)</th>
                                    <th>不计免赔(元)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="(item, index) in list.insuranceVciInfoVo" v-if="item.insTypeRefDetailCode != 'strongInsurance'&& item.insTypeRefDetailCode != 'vehicleAndVesselTax'" :key="index">
                                    <td><span>{{ item.insTypeName }}</span></td>
                                    <td>{{ item.amountInForce }}</td>
                                    <td>{{ item.premium }}</td>
                                    <td>{{ item.sdewPrice }}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </mt-swipe-item>
        </mt-swipe>
        <div class="choosePlan max-width">
            <div @click="choosePlan"><i class="icon iconfont icon-xinzeng"></i>&nbsp;&nbsp;&nbsp;选择该方案</div>
        </div>
    </div>
</template>
<script>
    import PageHeader from "components/header/PageHeader"
    import Scroll from 'components/scroll/scroll'
    import api from 'common/api'
    import {
        Toast
    } from 'mint-ui'
    import {
        Swipe,
        SwipeItem
    } from 'mint-ui'
    import Vue from 'vue'
    Vue.component(Swipe.name, Swipe)
    Vue.component(SwipeItem.name, SwipeItem)
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
    export default {
        components: {
            PageHeader,
            Scroll
        },
        data() {
            return {
                isShowDetail: false,
                tempData: {},
                tempIndex: 0,
                itemList: [],
                orderNo: '',
                carCode: '',
                carBrandCode: '',
                carFactoryCode: '',
                carModelCode: '',
                carSeriesCode: ''
            }
        },
        computed: {
            ...mapState('order', [
                'orderInfo'
            ]),
            ...mapState('insurance', [
                'num',
                'tablelist'
            ])
        },
        methods: {
            ...mapActions('insurance', [
                'setHotPlanIndex',
                'setHotPlanList',
                'setTempJiao',
                'setTempBusi',
                'resetTablelist',
                'resetJiao',
                'resetBusi'
            ]),
            ...mapActions('newInsurance', [
                'changeInsurance'
            ]),
            // 索引改变时的参数
            handleChange(index) {
                const _this = this
                _this.tempIndex = index
            },
            callback() {
                const _this = this
                _this.$router.replace({
                    path: '/insurance',
                    query: {
                        orderNo: _this.orderNo,
                        carCode: _this.carCode
                    }
                })
            },
            choosePlan() {
                const _this = this
                const idx = _this.tempIndex
                _this.tempData = _this.itemList[idx]
                if(!_this.tempData) {
                  return
                }
                let tempJiao = {
                    valueJiao: _this.tempData.tciComapnyName,
                    timeLimit: '',
                    totalMoney: _this.tempData.tciPrice,
                    boatCarMoney: _this.tempData.carTax,
                    actMoney: _this.tempData.tciPrice,
                    valueCode: _this.tempData.tciComapnyCode,
                    isOrNo: false
                }
                let tempBusi = {
                    valueBusiness: _this.tempData.vciCompanyName,
                    timeLimit: '',
                    realMoney: _this.tempData.vciPrice,
                    total: _this.tempData.vciPrice,
                    valueCode: _this.tempData.vciCompanyCode,
                    isOrNo: false,
                    companyCode: _this.tempData.vciCompanyCode
                }
                let tempArray = []
                _this.tempData.insuranceVciInfoVo.forEach(element => {
                    if (element.insTypeRefDetailCode != 'strongInsurance' && element.insTypeRefDetailCode != 'vehicleAndVesselTax') {
                        let list = {
                            name: element.insTypeName,
                            limit: element.amountInForce,
                            money: element.premium,
                            no: element.sdewPrice,
                            acNo: element.sdewPrice,
                            insuranceTypeCode: element.insTypeRefDetailCode,
                            actMoney: (element.premium - 0) + (element.sdewPrice - 0),
                            companyCode: _this.tempData.vciCompanyCode
                        }
                        tempArray.push(list)
                    }
                });
                _this.setTempJiao(tempJiao)
                _this.setTempBusi(tempBusi)
                _this.resetTablelist(tempArray)
                _this.changeInsurance(true)
                _this.$router.replace({
                    path: '/insurance',
                    query: {
                        orderNo: _this.orderNo,
                        carCode: _this.carCode
                    }
                })
            },
            getOrderNo() {
                const _this = this
                _this.orderNo = _this.$route.query.orderNo
                _this.carCode = _this.$route.query.carCode
                let option = {
                    orderNo: _this.orderNo,
                    allSubOrderFlag: true,
                    ignoreDefault: 1
                }
                api.clearingsettlement.order.queryOrderInfoVosByCodeFromDB(option, function(res) {
                    if (res.data.code === 'success') {
                        _this.carCode = res.data.obj.carOrderInfoVoList[0].carOrderDetailInfoList[0].carCode
                        _this.carBrandCode = res.data.obj.carOrderInfoVoList[0].carOrderDetailInfoList[0].carBrandCode
                        _this.carFactoryCode = res.data.obj.carOrderInfoVoList[0].carOrderDetailInfoList[0].carFactoryCode
                        _this.carModelCode = res.data.obj.carOrderInfoVoList[0].carOrderDetailInfoList[0].carModelCode
                        _this.carSeriesCode = res.data.obj.carOrderInfoVoList[0].carOrderDetailInfoList[0].carSeriesCode
                        _this.gethotPlans()
                    }
                })
            },
            gethotPlans() {
                const _this = this
                let option = {
                    'carCode': _this.carCode,
                    'factoryCode': _this.carFactoryCode,
                    'brandCode': _this.carBrandCode,
                    'seriesCode': _this.carSeriesCode,
                    'modelCode': _this.carModelCode
                }
                api.insurance.getHotPlans(option, function(res) {
                    if (res.data.code === 'success') {
                        _this.itemList = res.data.obj
                    }
                })
            }
        },
        created() {
            const _this = this
            _this.getOrderNo()
        }
    }
</script>
<style lang="scss" scoped>
    .hotPlan {
        padding-bottom: rem(90);
    }
    .title {
        padding: rem(17);
        text-align: center;
        font-size: rem(22);
    }
    .title i {
        display: inline-block;
        width: rem(8);
        height: rem(8);
        background-color: #bdc7d1;
        vertical-align: middle;
        border-radius: 50%;
        position: relative;
    }
    .title>i::after {
        position: absolute;
        content: '';
        height: rem(4);
        width: rem(60);
        background: linear-gradient(to right, #bdc7d1, transparent);
    }
    .title i:nth-child(1)::after {
        top: 50%;
        right: rem(20);
        transform: translate(0, -50%);
        background: linear-gradient(to left, #bdc7d1, transparent);
    }
    .title i:nth-child(2)::after {
        top: 50%;
        left: rem(20);
        transform: translate(0, -50%);
    }
    .resetStyle {
        padding: rem(13) rem(0)
    }
    .containerTwo {
        display: flex;
    }
    .containerTwo>div {
        flex: 1
    }
    .tableShow.hotplan table {
        width: 100%;
        background-color: #ffffff;
    }
    .tableShow.hotplan table thead tr {
        background-color: #7e8387;
        text-align: left;
    }
    .tableShow.hotplan table tr {
        height: rem(80)
    }
    .tableShow.hotplan table tr td {
        text-indent: rem(18);
    }
    .tableShow.hotplan table tr td:first-child {
        position: relative;
        width: 33%;
        height: rem(80);
        padding: 0 rem(3);
    }
    .tableShow.hotplan table tr td span {
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: 90%;
        text-indent: 0;
    }
    .tableShow.hotplan table tr th {
        text-indent: rem(18);
        color: #ffffff;
        font-weight: normal;
    }
    .choosePlan {
        position: fixed;
        -webkit-transform: translateZ(0); // left: rem(0);
        bottom: (0);
        width: 100%;
        box-sizing: border-box;
        padding: rem(6) rem(21)
    }
    .choosePlan>div {
        height: rem(78);
        background-image: linear-gradient(90deg, #008cee 0%, #36acfe 100%);
        text-align: center;
        line-height: rem(78);
        font-size: rem(28);
        color: #ffffff;
        border-radius: rem(5)
    }
    .orderlist {
        ul {
            li {
                height: remp(40);
                width: 100%;
                box-sizing: border-box;
                padding: remp(5) remp(10);
                div {
                    height: remp(30);
                    line-height: remp(30);
                    text-align: center;
                    background-color: #999;
                    border-radius: remp(5);
                    font-size: remp(16);
                    color: #ffffff;
                    box-shadow: 0 1px 5px 1px #222;
                }
            }
        }
    }
    .mint-swipe {
        height: remp(580) !important;
        overflow-y: auto !important;
    }
    .mint-swipe-indicators {
        position: fixed !important;
        -webkit-transform: translateZ(0);
        bottom: none !important;
        top: remp(30) !important; // left: 50%;
    }
    .mt-swipe-item {
        overflow: auto !important;
    } // .mint-swipe-items-wrap {
    // }
</style>
