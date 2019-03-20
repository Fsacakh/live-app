<template>
    <div class="finance-item">
        <div class="finance-name">
            {{ financeInfo.financeName }}
        </div> 
        <div class="finance-content">
            <div class="w flex">
                <div class="w33">
                   <span>首付:</span>
                   {{financeInfo.downpaymentType | switchIsPercent(financeInfo.downpaymentMin) }}
                   ~
                   {{ financeInfo.downpaymentType | switchIsPercent(financeInfo.downpaymentMax) }}
                </div>
                <div class="w33">
                   <span>尾款:</span>  
                   {{ financeInfo.bpIsPercent | switchIsPercent(financeInfo.balancePaymentMinValue) }}
                   ~
                   {{ financeInfo.bpIsPercent | switchIsPercent(financeInfo.balancePaymentMaxValue) }}
                </div>
                <div class="w33">
                   <span>保证金:</span>
                    {{ financeInfo.dfInPercent == 0 ? '¥' +' ' + financeInfo.depositFree : financeInfo.dfInPercent | switchIsPercent(financeInfo.depositFree)}}
                </div>
            </div>
            <div class="w flex" v-show="isLease">
                <div class="w66">
                    <span>期末里程数:</span>
                    {{ financeInfo.finalMileage }}
                </div>
                <div class="w33">
                    <span>期末保值额:</span> 
                    {{ financeInfo.evIsPercent | switchIsPercent(financeInfo.endingValue)}}
                </div>
            </div>
            <div class="w flex red">
                <div class="w33">
                    <span>
                       <template v-if="isInterest"> 
                           利率:
                       </template> 
                       <template v-else>
                           费率:
                       </template> 
                    </span>
                    {{ parseFloat(financeInfo.rates * 100).toFixed(2) }}%
                </div>
                <div class="w33">
                    <span>期数:</span>
                    {{ financeInfo.cycleMonth }}
                </div>
                <div class="w33">
                    <div class="btn-select pull-right" @click.once="showDetail">
                        选择
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    import config from '../../common/config'
    export default {
        props: {
            financeInfo: {
                type: Object,
                default() {
                    return {  
                        name: '奔驰E级9月金融A101'
                    }
                }
            }
        },
        data: function() {
            return {
                 
            }
        },
        computed: {
            isLease: function() {
                let result = false
                if(this.financeInfo.financeType === config.order.financePro.financeType.leaseFatherCode) {
                   result = true 
                } else {
                   result = false  
                }
                return result
            },
            isInterest: function() {
                let result = false
                if (this.financeInfo.rateType === config.order.financePro.rateType.interest) {
                    result = true
                } else {
                    result = false  
                }
                return result
            }
        },
        methods: {
            showDetail: function() {
                let _this = this
                let financeDetailCode = _this.financeInfo.financeDetailCode
                _this.$emit('show-detail', financeDetailCode)
            }   
        },
        components: {

        }
    }
</script>

<style lang="scss" scoped>
    .finance-item {
        padding: rem(30) rem(50) rem(40) rem(30);
        display: flex;
        flex-direction: column;
        background: rgb(255, 255, 255); 
        color: rgb(51, 51, 51);
        margin-bottom: rem(5);
    }

    .finance-item > .finance-name {
        font-size: rem(24);
        font-family: PingFangSC-Semibold;
        line-height: rem(28);
    }

    .finance-item > .finance-content {
        font-size: rem(24);
        font-family: PingFangSC-Regular;
        line-height: rem(30);
    }

    .finance-item > .finance-content > .red {
        color: rgba(254, 56, 36, 0.9);
    }

    .btn-select {
        width: rem(120);
        height: rem(40);
        border-radius: rem(6);
        padding-top: rem(8);
        background: rgb(0, 140, 238);
        color: rgb(255, 255, 255);
        text-align: center;
    }
</style>