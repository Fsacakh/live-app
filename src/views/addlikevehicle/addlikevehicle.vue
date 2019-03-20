
<template>
    <div class="addlike">
        <div v-show="!showSelect">
            <page-header title="意向车型" @on-click-right="rightClick">
                <div slot="right">{{ isInsert | rightText }}</div>
            </page-header>
            <div>
                <cell title="意向车型" :triangle="true" @cellClick="select" ref="intentionCar">
                    <input type="text" placeholder="选择意向车型" v-model="carInfo.displayName" readonly>
                </cell>
                <div class="clearfix carcolour">
                    <div class="fl ">
                        <cell title="颜色">
                            <input type="text" class="cell-input" placeholder="输入车型颜色" v-model="carInfo.colour" :readonly="!isInsert">
                        </cell>
                    </div>
                    <div class="fl">
                        <cell title="内饰">
                            <input type="text" class="cell-input" placeholder="输入内饰颜色" v-model="carInfo.interior" :readonly="!isInsert">
                        </cell>
                    </div>
                </div>
                <remark title="备注" v-model="carInfo.remark" :maxlength="maxlength" :placeholder="placeholder" :readonly="!isInsert"></remark>
            </div>
            <div class="submit" v-if="!this.isInsert">
                <mt-button size="large" 
                    :type="showLoading ? 'default' : 'primary'"
                    @click="createOrder"
                    :disabled="showLoading">创建订单</mt-button>
            </div>
        </div>
        <div v-show="showSelect">
            <like-vehicle @revert="hide" @confirm="confirmCar" ensuredispaly="carstyle"></like-vehicle>
        </div>
        <div v-show="showLoading" class="loading-container"> 
            <loading title=""></loading>
        </div>
    </div>
</template>

<script>
    import Loading from 'components/loading/loading'
    import Cell from 'components/cell'
    import LiveSelect from 'components/select'
    import Remark from 'components/remark'
    import PageHeader from "components/header/PageHeader"
    import LikeVehicle from 'components/likevehicle/likevehicle'
    import Vue from 'vue'
    import {
        Button,
    } from 'mint-ui'
    Vue.component(Button.name, Button);
    import {
        Toast
    } from 'mint-ui'
    import {
        mapState,
        mapGetters,
        mapMutations,
        mapActions
    } from 'vuex'
    import api from 'common/api'
    import config from 'common/config'
    export default {
        components: {
            Cell,
            LiveSelect,
            Remark,
            PageHeader,
            LikeVehicle,
            Loading
        },
        data() {
            return {
                maxlength: 100,
                placeholder: '请输入客户意见(最多100字)',
                carInfo: {
                    displayName: '',
                    colour: '',
                    interior: '',
                    remark: ''
                },
                intentionCarCode: '',
                showSelect: false,
                orderParams: {},
                hasChange: false,
                showLoading: false
            }
        },
        computed: {
            ...mapGetters('customer', [
                'getIntentionCarInfo',
                'isInsert'
            ]),
            ...mapState('customer', [
                'cusLeadInfo',
                'modelInfo'
            ])
        },
        mounted() {
            this.hasSequence()
            this.$refs.intentionCar.$el.childNodes[4].style = `width: 66% !important;`
            if(!this.isInsert) {
                const item = this.getIntentionCarInfo
                this.carInfo.displayName = `${item.factoryName || ''} ${item.brandName || ''} ${item.seriesName || ''} ${item.modelName || ''} ${item.displayName || ''}`  
            }
        },
        methods: {
            show() {
                this.showSelect = true
            },
            hide() {
                this.showSelect = false
            },
            confirmCar(item) {
                // console.log(this.$refs)
                this.orderParams = item
                let factoryName = item.factorydata ? item.factorydata.factoryName: '',
                    brandName = item.carbranddata.brandName,
                    seriesName = item.cartraindata.seriesName,
                    modelName = item.cartypedata.modelName,
                    displayName = item.carstyledata.displayName;
                this.carInfo.displayName = `${factoryName} ${brandName} ${seriesName} ${modelName} ${displayName}`
                this.hide()
            },
            select() {
                if (this.isInsert) {
                    this.show()
                }
            },
            rightClick() {
                if (this.isInsert) {
                    // 根据备注信息来判断是新增还是修改
                    this.getIntentionCarInfo.id ? this.update() : this.insert()
                    this.setIsInsert(false)
                } else {
                    this.setIsInsert(true)
                }
            },
            createOrder() {
                this.showLoading = true
                let _this = this
                this.orderParams = {
                    carCode: this.orderParams.carbranddata ? this.orderParams.carstyledata.carCode : this.getIntentionCarInfo.carCode,
                    factoryCode: this.orderParams.factorydata ? this.orderParams.factorydata.factoryCode : this.getIntentionCarInfo.factoryCode,
                    factoryName: this.orderParams.factorydata ? this.orderParams.factorydata.factoryName : this.getIntentionCarInfo.factoryName,
                    brandCode: this.orderParams.carbranddata ? this.orderParams.carbranddata.brandCode : this.getIntentionCarInfo.brandCode,
                    brandName: this.orderParams.carbranddata ? this.orderParams.carbranddata.brandName : this.getIntentionCarInfo.brandName,
                    modelCode: this.orderParams.cartypedata ? this.orderParams.cartypedata.modelCode : this.getIntentionCarInfo.modelCode,
                    modelName: this.orderParams.cartypedata ? this.orderParams.cartypedata.modelName : this.getIntentionCarInfo.modelName,
                    seriesCode: this.orderParams.cartraindata ? this.orderParams.cartraindata.seriesCode : this.getIntentionCarInfo.seriesCode,
                    seriesName: this.orderParams.cartraindata ? this.orderParams.cartraindata.seriesName : this.getIntentionCarInfo.seriesName,
                    displayName: this.carInfo.displayName,
                    colour: this.carInfo.colour,
                    interior: this.carInfo.interior,
                    remark: this.carInfo.remark
                }
                this.setModelInfo(this.orderParams)
                // 这里是不是被人改过了 ?
                let order = {
                    orderInfo: {
                        orderNo: '',
                        orderChannelType: _this.cusLeadInfo.channelCode,
                        orderTypeCode: config.order.orderTypeCode.car,
                        paymentTypeCode: config.order.paymentTypeCode.cash,
                        custCode: _this.cusLeadInfo.customCode,
                        leadCode: _this.cusLeadInfo.leadCode
                    },
                    carOrderDetailInfoList: [{
                        carFactoryCode: _this.modelInfo.factoryCode,
                        carFactoryName: _this.modelInfo.factoryName,
                        carBrandCode: _this.modelInfo.brandCode,
                        carBrandName: _this.modelInfo.brandName,
                        carSeriesCode: _this.modelInfo.seriesCode,
                        carSeriesName: _this.modelInfo.seriesName,
                        carModelCode: _this.modelInfo.modelCode,
                        carModelName: _this.modelInfo.modelName,
                        carCode: _this.modelInfo.carCode,
                        carDisplayName: _this.modelInfo.displayName,
                        orderAddInfos: [{
                                addCode: config.order.carInfo.carAppertanceName.refCode,
                                addName: 'carAppertanceName',
                                addValue: _this.orderParams.colour
                            },
                            {
                                addCode: config.order.carInfo.carInteriorName.refCode,
                                addName: 'carInteriorName',
                                addValue: _this.orderParams.interior
                            }
                        ],
                        remark: this.orderParams.remark,
                        actualSalesPrice: 0,
                        accountTypeCode: '',
                        orderNo: ''
                    }],
                }
                this.setOrderInfo(order)
                this.$router.replace({ path: '/carInfo/*' })
            },
            insert() {
                if (this.orderParams.carbranddata === undefined) {
                    Toast('意向车型必填')
                    return
                }
                let params = [{
                    intentionCarCode: this.intentionCarCode,
                    leadCode: this.getIntentionCarInfo.leadCode,
                    carCode: this.orderParams.carstyledata ? this.orderParams.carstyledata.carCode : this.getIntentionCarInfo.carCode,   
                    factoryCode: this.orderParams.factorydata ? this.orderParams.factorydata.factoryCode : this.getIntentionCarInfo.factoryCode,                  
                    brandCode: this.orderParams.carbranddata ? this.orderParams.carbranddata.brandCode : this.getIntentionCarInfo.brandCode,
                    modelCode: this.orderParams.cartypedata ? this.orderParams.cartypedata.modelCode : this.getIntentionCarInfo.modelCode,
                    seriesCode: this.orderParams.cartraindata ? this.orderParams.cartraindata.seriesCode : this.getIntentionCarInfo.seriesCode,
                    displayName: this.carInfo.displayName,
                    colour: this.carInfo.colour,
                    interior: this.carInfo.interior,
                    remark: this.carInfo.remark,
                    intentionLevelCode: this.getIntentionCarInfo.intentionLevelCode
                }]
                this.edit(params)
            },
            update() {
                let params = [{
                    id: this.getIntentionCarInfo.id,
                    intentionCarCode: this.getIntentionCarInfo.intentionCarCode,
                    leadCode: this.getIntentionCarInfo.leadCode,
                    carCode: this.orderParams.carbranddata ? this.orderParams.carstyledata.carCode : this.getIntentionCarInfo.carCode,
                    factoryCode: this.orderParams.factorydata ? this.orderParams.factorydata.factoryCode : this.getIntentionCarInfo.factoryCode,
                    brandCode: this.orderParams.carbranddata ? this.orderParams.carbranddata.brandCode : this.getIntentionCarInfo.brandCode,
                    modelCode: this.orderParams.cartypedata ? this.orderParams.cartypedata.modelCode : this.getIntentionCarInfo.modelCode,
                    seriesCode: this.orderParams.cartraindata ? this.orderParams.cartraindata.seriesCode : this.getIntentionCarInfo.seriesCode,
                    displayName: this.carInfo.displayName,
                    colour: this.carInfo.colour,
                    interior: this.carInfo.interior,
                    remark: this.carInfo.remark
                }]
                this.edit(params)
            },
            // 新增 / 修改意向车型
            edit(params) {
                api.customer.editIntentionCar(params).then(res => {
                    if (res.data.code === 'success') {
                        Toast(config.alertInfo.success)
                        this.setIsInsert(false)
                    }
                })
            },
            getSequence(code, result) {
                api.ordinalInfo.getSequence(code, (res) => {
                    if (res.data.code === 'success') {
                        result(res.data.obj)
                    }
                })
            },
            hasSequence() {
                if (!this.isInsert) {
                    this.carInfo = {
                        displayName: this.getIntentionCarInfo.displayName,
                        colour: this.getIntentionCarInfo.colour,
                        interior: this.getIntentionCarInfo.interior,
                        remark: this.getIntentionCarInfo.remark
                    }
                } else {
                    this.carInfo = {
                        displayName: '',
                        colour: '',
                        interior: '',
                        remark: ''
                    }
                    this.getSequence(config.carSequence, res => {
                        this.intentionCarCode = res
                    })
                }
            },
            ...mapMutations({
                setIsInsert: 'customer/SET_IS_INSERT',
                setModelInfo: 'customer/SET_MODEL_INFO'
            }),
            ...mapActions('order', [
                'setOrderInfo'
            ])
        },
        filters: {
            rightText(val) {
                if (val) {
                    return '保存'
                } else {
                    return '编辑'
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .submit {
        padding: 0 rem(20);
        margin-top: rem(65);
    }
    .car {
        margin-top: rem(10);
    }
    .tost {
        width: 100%;
        height: rem(72);
        text-align: center;
        colour: #ffffff;
        background: rgba(254, 56, 36, 0.90);
        line-height: rem(72);
    }
    .carcolour>div {
        width: 50%;
    }
    .cell-input {
        text-align: left !important;
    }
    .addlike input.input {
        width: 50%;
    }
    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
