<template>
    <div class="order-approve-item">
        <router-link v-bind:to="{ name: 'orderApprovedetail', params: { orderNo:orderApproveInfo.orderNo, flag: flag}}">
            <div class="title flex">
                <div class="flex-2">
                    <span class="pull-left">
                        报价单号:{{orderApproveInfo.orderNo}}
                    </span>
                </div>
                <div class="flex-1">
                    <span class="pull-right">{{orderApproveInfo.updateTimeStr | timeSub}}</span>
                </div>
            </div>
            <div class="content">
                <div class="w">
                  <span class="car-model">
                     {{orderApproveInfo.carName}}
                  </span>
                  <span class="order-type pull-right" v-show="orderApproveInfo.currentOrderWfTypeName">
                     {{orderApproveInfo.currentOrderWfTypeName}}
                  </span>
                </div>
                <div class="w flex m-t-10">
                   <div class="w50 customer">
                       <span class="name">客户姓名</span>
                       <div class="w">
                           {{orderApproveInfo.custName || '-'}}
                       </div>
                   </div>
                   <div class="w50 mobile">
                       <span class="name">手机号</span>
                       <div class="w">
                           {{orderApproveInfo.custMobile || '-'}}
                       </div>
                   </div>
                </div>
                <div class="w m-t-10">
                    <span class="org examine-overflow">
                       <i class="iconfont icon-jingxiaodian"></i>
                       {{orderApproveInfo.storeName || '-'}}
                    </span>
                    <span class="people">
                       <i class="iconfont icon-xiaoshouguwen"></i>
                       {{orderApproveInfo.salesEmpName || '-'}}
                    </span>
                </div>
            </div>
        </router-link>

    </div>
</template>

<script>
    export default {
        name: 'order-approve-item',
        props: {
            orderApproveInfo: {
                type: Object,
                default() {
                    return {
                    }
                }
            },
            flag: {
                type: String,
                default: ''
            }
        },

        data: function() {
            return {
            }
        },

        components: {

        },
        filters: {
            timeSub(val) {
                return val.substring(0, 16)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .examine-overflow {
        overflow: hidden;
        text-overflow:ellipsis;
        white-space: nowrap;
    }
    .order-approve-item {
        background-color: $browser-default-color-white;
        margin-bottom: rem(16);
        display: flex;
        flex-direction: column;
    }

    .order-approve-item .title {
        display: flex;
        flex-direction: row;
        background-color: $browser-default-color-light-gray;
        padding: rem(16) rem(20) rem(14) rem(40);
        font-family: PingFangSC-Regular;
        font-size: rem(24);
        color: $browser-default-color-gary;
    }

    .order-approve-item .content {
        padding: rem(20) rem(40);
        display: flex;
        flex-direction: column;
        width: 100%!important;
        box-sizing: border-box;
    }

    .order-approve-item .content .car-model {
        font-family: PingFangSC-Regular;
        font-size: rem(28);
        color: rgb(51, 51, 51);
    }

    .order-approve-item .content .order-type {
        width: rem(120);
        height: rem(40);
        border-radius: rem(6);
        font-family: PingFangSC-Semibold;
        font-size: rem(24);
        line-height: rem(40);
        text-align: center;
        background: rgb(189, 199, 209);
        color: #fff;
    }

    .order-approve-item .content .customer {
        font-family: PingFangSC-Regular;
        font-size: rem(26);
        color: rgb(51, 51, 51);
    }

    .order-approve-item .content .customer .name {
        font-family: PingFangSC-Regular;
        font-size: rem(22);
        color: rgb(189, 199, 209);
    }

    .order-approve-item .content .mobile {
        font-family: PingFangSC-Regular;
        font-size: rem(26);
        color: rgb(51, 51, 51);
    }

    .order-approve-item .content .mobile .name {
        font-family: PingFangSC-Regular;
        font-size: rem(22);
        color: rgb(189, 199, 209);
    }

    .order-approve-item .content .org {
        display: inline-block;
        font-family: PingFangSC-Regular;
        font-size: rem(22);
        color: rgb(0, 140, 238);
        width: remp(100);
        overflow: hidden;
    }

    .order-approve-item .content .org .iconfont {
        margin-right: rem(10);
    }

    .order-approve-item .content .people {
        font-family: PingFangSC-Regular;
        font-size: rem(22);
        color: rgb(0, 140, 238);
        margin-left: rem(40);
    }

    .order-approve-item .content .people .iconfont {
        margin-right: rem(10);
    }
</style>
