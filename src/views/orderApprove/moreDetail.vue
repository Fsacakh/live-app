<template>
    <div class="w100">
        <page-header>
            <div slot>审批信息</div>
        </page-header>
        <div class="car-info-title">本车型库存情况</div>
        <div class="car-info">
            <div class="title">
                库龄最长的同外观内饰车型
            </div>
            <car-info-item v-if="sameAppertanceAndInteriorCar.skuCode" :carInfo="sameAppertanceAndInteriorCar"></car-info-item>
            <div v-else class="no-data-img">
                <img src="../../assets/imgage/same-apprance-car-icon.svg"/>
            </div>
        </div>
        <div class="car-info">
            <div class="title">
                库龄最长的同车型
            </div>
            <car-info-item v-if="sameAppertanceAndBrandCar.skuCode" :carInfo="sameAppertanceAndBrandCar"></car-info-item>
            <div v-else class="no-data-img">
                <img src="../../assets/imgage/same-apprance-car-icon.svg"/>
            </div>
        </div>
        <div class="car-info-title">GP表现</div>
        <div class="table-scrollable">
            <table class="table table-bordered">
                <thead>
                    <tr>
                        <th>
                            指标
                        </th>
                        <th>
                            本单
                        </th>
                        <th>
                            门店近一周
                        </th>
                        <th>
                            门店本月
                        </th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(gpName, index) in gpList" :key="index">
                        <td>
                            {{ gpName }}
                        </td>
                        <td v-for="(gpValue, newIndex) in gpApperance[gpName + 'List']" :key="newIndex">
                            {{ gpValue == 0 ? '-': parseFloat(gpValue*100).toFixed(2) + '%' }}

                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
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
    import api from '@/common/api'
    import PageHeader from "components/header/PageHeader"
    import carInfoItem from '@/components/carInfoItem'
    import cell from 'components/cell'
    import {
        Toast
    } from 'mint-ui'
    export default {
        mounted() {
            let _this = this
            _this.getCarOrderInfoByOrderNo({
                orderNo: _this.$route.params.orderNo,
                hideMrsp: true
            })
            _this.queryOrderInfoVosByCodeFromDB({
                orderNo: _this.$route.params.orderNo,
                allSubOrderFlag: true,
                ignoreDefault: 1
            })
        },
        destroyed() {
            let _this = this
            _this.resetCarInfo()
            _this.resetMsrp()
            _this.clearData()
        },
        data() {
            return {

            }
        },
        computed: {
            ...mapState('order', [
                'gpList'
            ]),
            ...mapState('carInfo', [
                'carInfo'
            ]),
            ...mapState('orderApprove', [
                'sameAppertanceAndInteriorCar',
                'sameAppertanceAndBrandCar'
            ]),
            ...mapGetters('order', [
                'gpApperance'
            ])
        },
        methods: {
            ...mapActions('carInfo', [
                'resetMsrp',
                'resetCarInfo',
                'getCarOrderInfoByOrderNo'
            ]),
            ...mapActions('order', [
                'getGpApperance',
                'queryOrderInfoVosByCodeFromDB'
            ]),
            ...mapActions('orderApprove', [
                'getSameAppertanceAndInteriorCar',
                'getSameAppertanceAndBrandCar',
                'clearData'
            ])
        },
        watch: {
            carInfo: {
                handler(car) {
                    let _this = this
                    if (_this.carInfo.skuCode != '') {
                        let reportFactoryDate = "";
                        if(_this.carInfo.skuInfo && _this.carInfo.skuInfo.skuAddInfoVoList) {
                            let list = _this.carInfo.skuInfo.skuAddInfoVoList
                            list.forEach(element => {
                                if(config.order.carInfo.skuAddInfos.reportFactoryDate.refCode === element.addCode) {
                                    reportFactoryDate = element.addValue ? element.addValue : ""
                                }
                            });
                        }
                        _this.getSameAppertanceAndInteriorCar({
                            skuCode: _this.carInfo.skuCode,
                            carFactoryCode: _this.carInfo.carFactoryCode,
                            carBrandCode: _this.carInfo.carBrandCode,
                            carSeriesCode: _this.carInfo.carSeriesCode,
                            carModelCode: _this.carInfo.carModelCode,
                            carCode: _this.carInfo.carCode,
                            carAppertanceName: _this.carInfo.carAppertanceName,
                            carInteriorName: _this.carInfo.carInteriorName,
                            carVinNo: _this.carInfo.carVinNo,
                            isDeceitedCar: _this.carInfo.isDeceitedCar,
                            reportFactoryDate: reportFactoryDate
                        })
                        _this.getSameAppertanceAndBrandCar({
                            skuCode: _this.carInfo.skuCode,
                            carFactoryCode: _this.carInfo.carFactoryCode,
                            carBrandCode: _this.carInfo.carBrandCode,
                            carSeriesCode: _this.carInfo.carSeriesCode,
                            carModelCode: _this.carInfo.carModelCode,
                            carCode: _this.carInfo.carCode,
                            carVinNo: _this.carInfo.carVinNo,
                            isDeceitedCar: _this.carInfo.isDeceitedCar,
                            reportFactoryDate: reportFactoryDate
                        })
                        _this.getGpApperance({
                            skuCode: _this.carInfo.skuCode,
                            carFactoryCode: _this.carInfo.carFactoryCode,
                            carBrandCode: _this.carInfo.carBrandCode,
                            carSeriesCode: _this.carInfo.carSeriesCode,
                            carModelCode: _this.carInfo.carModelCode,
                            carCode: _this.carInfo.carCode,
                            carAppertanceName: _this.carInfo.carAppertanceName,
                            carInteriorName: _this.carInfo.carInteriorName,
                            carVinNo: _this.carInfo.carVinNo,
                            isDeceitedCar: _this.carInfo.isDeceitedCar,
                        })
                    }
                }
            }
        },
        components: {
            carInfoItem,
            PageHeader,
            cell
        }
    }
</script>
<style lang="scss" scoped>
    .car-info-title {
        margin-left: remp(20);
        padding-top: remp(10);
        padding-bottom: remp(10);
        font-family: PingFangSC-Regular;
        font-size: remp(14);
        color: #7E8387;
    }
    .car-info {
        display: flex;
        flex-direction: column;
        background: #FFFFFF;
        box-shadow: 0 rem(7) rem(9) 0 rgba(228, 228, 228, 0.51);
        border-radius: rem(4);
        margin-left: remp(20);
        margin-right: remp(20);
        margin-bottom: remp(10);
    }
    .car-info>.title {
        font-family: PingFangSC-Regular;
        font-size: remp(14);
        padding-top: remp(10);
        padding-left: remp(10);
        padding-bottom: remp(10);
        border-bottom: remp(1) solid #D5D5DE;
        color: #7E8387;
    }
    .no-data-img {
        margin: remp(10) auto;
        img {
            width: remp(119);
            height: remp(82);
        }
    }
</style>
