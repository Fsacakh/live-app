<template>
    <div>
        <select-item :items="itemlist" ref="select" :initValue="initData" @handOk="handOk">
        </select-item>
        <div class="headPosition">
            <page-header ref="header">
                <div slot>报价单-随车政策列表</div>
            </page-header>
            <div ref="typesWidthLimit" class="typesWidthLimit">
                <div class="policyType p-l-10 p-r-10 b-b">
                    <div @click="showModel">{{ typeValue }}<i></i></div>
                </div>
            </div>
        </div>
        <div class="occupationLimit">
            <div ref="listContainer" class="listContainer">
                <i-scroll :next="refresh" :dropdown="dropdown">
                    <ul class="list" slot="list">
                        <li class="item p-t-10 p-b-10 p-l-10 p-r-10 b-b" v-for="(item, index) in policyList" :key="index">
                            <div class="title p-b-10">
                                {{ item.policyName }}
                            </div>
                            <div class="container">
                                <p>
                                    政策内容: <span>{{ item.policyContent }}</span>
                                </p>
                                <p>
                                    赠送条件: <span>{{ item.policyCheckCondition }}</span>
                                </p>
                                <p>
                                    ¥{{ item.importTotalMoney }}
                                </p>
                            </div>
                            <div class="typeName">
                                {{ item.policyAscriptionName }}
                            </div>
                            <div class="isChoose" @click="skudetailed(item)">
                                选择
                            </div>
                        </li>
                    </ul>
                </i-scroll>
            </div>
        </div>
    </div>
</template>
<script>
    import PageHeader from "components/header/PageHeader"
    import SelectItem from 'components/select-item/select-item'
    import IScroll from 'components/iris-scroll'
    import config from 'common/config'
    import api from 'common/api'
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
    export default {
        created() {
            const _this = this
            _this.getPolicyTypes()
            _this.getOrderNo()
            if (_this.policyList.length === 0) {
                _this.getAllPolicy()
            }
        },
        mounted() {
            document.getElementsByClassName('listContainer')[0].style.height = window.screen.availHeight - this.$refs.header.$el.offsetHeight - document.getElementsByClassName('typesWidthLimit')[0].offsetHeight + 'px'
        },
        data() {
            return {
                policyShow: false,
                itemlist: [],
                typeValue: '全部',
                typeCode: 'all',
                policyList: [],
                page: 1,
                pages: 1,
                nums: 10,
                orderNo: '',
                initData: {
                    text: '全部',
                    value: 'all'
                },
                carCode: '',
                carFactoryCode: '',
                carBrandCode: '',
                carSeriesCode: '',
                carModelCode: '',
                ajaxFlag:true
            }
        },
        computed: {
            ...mapState('order', [
                'order'
            ])
        }, 
        methods: {
            ...mapActions('carpolicy', [
                'setPolicyList',
                'removePolicyList'
            ]),
            showModel() {
                let _this = this
                _this.$refs.select.open()
            },
            hideModel() {
                let _this = this
                _this.policyShow = false
            },
            skudetailed(item) {
                let _this = this
                let option = {
                    orderNo: _this.orderNo,
                    promotionCode: item.policyCode,
                    promotionName: item.policyName,
                    accountTypeCode: item.policyAscriptionCode,
                    promotionCost: item.importTotalCost,
                    businessCost: item.importTotalMoney,
                    proStatus: (item.importTotalCost > 0) || (item.importTotalMoney > 0) ? 1 : 0
                }
                api.policyWidthCar.addPolicywithCar(option, function(res) {
                    if (res.data.code === 'success') {
                        _this.$router.replace({
                            path: `/carwithpolicy-edit/${_this.orderNo}`
                        })
                    }
                })
            },
            dropdown(callback) {
                let _this = this;
                if (!(_this.page > _this.pages)) {
                    return new Promise((resolve, reject) => {
                        if(!_this.ajaxFlag){
                            return false;
                        }
                        _this.ajaxFlag = false;
                        _this.page ++
                        _this.scrollLoad()
                        resolve()
                    })
                } else {
                    return new Promise((resolve, reject) => {
                        resolve()
                        callback('暂无更多数据')
                    })
                }
            },
            refresh() {},
            getPolicyTypes() {
                let _this = this
                let option = {
                    refCode: config.businessaffairs.businessaffairstype
                }
                api.financePro.getProType(option, function(res) {
                    if (res.data.code === 'success') {
                        res.data.obj.referenceDetailInfos.forEach(element => {
                            let obj = {}
                            obj.text = element.refDetailName
                            obj.value = element.refDetailCode
                            _this.itemlist.push(obj)
                        })
                        let tempObj = {}
                        tempObj.text = '全部'
                        tempObj.value = 'all'
                        _this.itemlist.push(tempObj)
                    }
                })
            },
            handOk(value) {
                let _this = this
                _this.typeValue = value.text
                _this.typeCode = value.value
                _this.initData.value = value.value
                _this.initData.text = value.text
                _this.getPolicyBycondition()
            },
            getOrderNo() {
                let _this = this
                _this.orderNo = _this.$route.params.orderNo
            },
            // 获取所有的政策
            getAllPolicy() {
                const _this = this
                api.clearingsettlement.order.queryOrderInfoVosByCodeFromDB({
                    orderNo: _this.$route.params.orderNo,
                    allSubOrderFlag: true
                }, function(res) {
                    if (res.data.code === 'success') {
                        _this.carCode = res.data.obj.carOrderInfoVoList[0].carOrderDetailInfoList[0].carCode
                        _this.carFactoryCode = res.data.obj.carOrderInfoVoList[0].carOrderDetailInfoList[0].carFactoryCode
                        _this.carBrandCode = res.data.obj.carOrderInfoVoList[0].carOrderDetailInfoList[0].carBrandCode
                        _this.carSeriesCode = res.data.obj.carOrderInfoVoList[0].carOrderDetailInfoList[0].carSeriesCode
                        _this.carModelCode = res.data.obj.carOrderInfoVoList[0].carOrderDetailInfoList[0].carModelCode
                        _this.getPolicyBycondition()
                    }
                })
            },
            getPolicyBycondition() {
                const _this = this
                let option = {
                    policyAscriptionCode: _this.typeCode === 'all' ? '' : _this.typeCode,
                    carCode: _this.carCode,
                    carFactoryCode: _this.carFactoryCode,
                    carBrandCode: _this.carBrandCode,
                    carSeriesCode: _this.carSeriesCode,
                    carModelCode: _this.carModelCode,
                    policyStatus: 1,
                    pageStart: (_this.page - 1) * (_this.nums) + 1,
                    pageNums: _this.nums,
                    page: _this.page,
                    carFlag: 1
                }
                api.policyWidthCar.queryPolicyByPage(option, function(res) {
                    if (res.data.code === 'success') {
                        _this.policyList = res.data.obj.list
                        _this.pages = res.data.obj.pages
                    }
                })
            },
            // 滑动加载内容
            scrollLoad() {
                let _this = this
                let numTotal = _this.policyList.length
                let option = {
                    policyAscriptionCode: _this.typeCode === 'all' ? '' : _this.typeCode,
                    carCode: _this.carCode,
                    carFactoryCode: _this.carFactoryCode,
                    carBrandCode: _this.carBrandCode,
                    carSeriesCode: _this.carSeriesCode,
                    carModelCode: _this.carModelCode,
                    policyStatus: 1,
                    pageStart: _this.page,
                    pageNums: _this.nums,
                    page: _this.page,
                    carFlag: 1
                }
                api.policyWidthCar.queryPolicyByPage(option, function(res) {
                    if (res.data.code === 'success') {
                        let list = res.data.obj.list
                        _this.pages = res.data.obj.pages

                        list.forEach((element, index) => {
                            _this.$set(_this.policyList, numTotal + index, element)
                        })

                        _this.ajaxFlag = true
                    }
                })
            }
        },
        components: {
            PageHeader,
            SelectItem,
            IScroll
        }
    }
</script>
<style lang="scss" scoped>
    .headPosition {
        position: fixed;
        -webkit-transform: translateZ(0);
        z-index: 9999;
        width: 100%;
    }
    .typesWidthLimit {
        width: 100%;
        background-color: rgb(240, 242, 245)
    }
    .policyType {
        box-shadow: 0 1px 1px 0px #999;
    }
    .policyType>div {
        display: inline-block;
        height: remp(44);
        line-height: remp(44);
        position: relative;
        font-size: remp(15);
    }
    .policyType>div>i {
        position: absolute;
        right: remp(-20);
        top: 50%;
        transform: translate(0, -25%);
        border-top: remp(8) solid rgb(126, 131, 135);
        border-bottom: remp(8) solid transparent;
        border-right: remp(8) solid transparent;
        border-left: remp(8) solid transparent;
    }
    .policyType>i.choose {
        border-top: remp(8) solid transparent;
        border-bottom: remp(8) solid rgb(126, 131, 135);
        border-right: remp(8) solid transparent;
        border-left: remp(8) solid transparent;
    }
    .policyTypeModel {
        position: fixed;
        -webkit-transform: translateZ(0);
        left: 0;
        top: 0;
        z-index: 99999;
        height: 100%;
        width: 100%;
        background-color: rgba(0, 0, 0, .4);
        padding-top: remp(64);
    }
    .policyTypeModel .modelContainer {
        height: remp(67);
        background-color: #ffffff;
    }
    .policyTypeModel .modelContainer ul {
        display: flex;
        height: rem(67);
    }
    .policyTypeModel .modelContainer ul li {
        text-align: center;
        flex: 1;
        height: remp(67);
        padding-top: remp(20);
        box-sizing: border-box;
    }
    .policyTypeModel .modelContainer ul li span {
        display: inline-block;
        font-size: remp(12);
        width: remp(80);
        height: remp(30);
        line-height: remp(30);
        background-color: rgb(240, 242, 245);
        color: rgb(126, 131, 135);
    }
    .occupationLimit {
        padding-top: remp(90);
    }
    .listContainer {
        font-size: remp(12);
        height: remp(490);
    }
    .listContainer .item {
        position: relative;
    }
    .listContainer .item .title {
        color: rgb(51, 51, 51);
        font-weight: bolder;
        width: 60%;
        box-sizing: border-box;
    }
    .listContainer .item .container p:first-child {
        padding-bottom: remp(5);
    }
    .listContainer .item .container p:nth-child(2) {
        padding-bottom: remp(9);
    }
    .listContainer .item .container p:last-child {
        color: rgba(254, 56, 36, 0.9);
        padding: remp(5) 0;
    }
    .listContainer .item .typeName {
        position: absolute;
        right: remp(25);
        top: remp(10);
        color: rgb(126, 131, 135);
    }
    .listContainer .item .isChoose {
        position: absolute;
        right: remp(25);
        bottom: remp(15);
        width: remp(60);
        height: remp(20);
        box-sizing: border-box;
        border: remp(1) solid rgba(0, 140, 238, 0.6);
        color: rgba(0, 140, 238, 0.6);
        text-align: center;
        line-height: remp(20);
        border-radius: remp(3);
    }
    .tempNo {
        text-align: center;
    }
</style>
