<template>
<div class="history">
    <div class="h-title" v-show="hasTitle">
        <i></i>&ensp;{{title}}&ensp;<i></i>
    </div>
    <div class="scroll-box" v-show="items.length">
        <div class="list-box">
            <div class="scroll-content">
                <div class="item" v-for="(item, index) in items" :key="index" @click="itemClick(item)">
                    <div class="line-blue"></div>
                    <div class="round">{{item.navTitle == '订单修改' ? '修改' : item.navTitle}}</div>
                    <div class="item-title">
                        <p>{{item.title}}</p>
                        <p class="text-right">{{item.time}}</p>
                    </div>
                    <div class="item-detail" v-if="((orderApproveHistory && item.nodeType != 1) || !orderApproveHistory)">
                        <p>
                            <span v-if="item.nodeStatus === 0"><i class="iconfont icon-icon-bohuishijing"></i>&nbsp;</span>{{ item.scName }}
                        </p>
                        <!-- 是否显示GP公式 -->
                        <p>     
                            <!-- orderTypeCode为WorkFlowTypeOrderUpdate代表'订单修改'时的状态 -->
                            <span v-if="item.orderTypeCode !== 'WorkFlowTypeOrderUpdate' && item.showAapprovalCriteria === true">{{ '(' + item.postTypeName + ' ' + ((String(item.maxValue).length - String(item.maxValue).indexOf('.') - 1) > 2 ? (item.maxValue * 100).toFixed(2) : (item.maxValue * 100).toFixed(0)) + '%' + '>=' + item.GP + '>=' + ((String(item.minValue).length - String(item.minValue).indexOf('.') - 1) > 2 ? (item.minValue * 100).toFixed(2) : (item.minValue * 100).toFixed(0))  + '%' + ')' }}</span>
                        </p>
                        <p class="remark-text" v-if="((orderApproveHistory && item.nodeType != -1) || !orderApproveHistory)">
                             <span v-if="item.nodeStatus === -1">待审批</span>
                             <span v-if="item.nodeStatus === 1">通过</span>
                             <span v-if="item.nodeStatus === -2">撤回</span>
                             <span v-if="item.nodeStatus === 0">驳回: {{item.remark}}</span>
                             <span v-if="item.nodeStatus != 0 && item.remark != null">备注:{{item.remark}}</span>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="prompt-box" v-show="!items.length && loadingNoData">
        {{text}}
    </div>
    <div v-show="!items.length  && !loadingNoData" class="loading-box">
        <div class="loading-container">
            <loading></loading>
        </div>
    </div>
</div>
</template>
<script>
    import Loading from 'components/loading/loading'
    export default {
        props: {
            items: {
                type: Array,
                default: () => []
            },
            title: {
                type: String,
                default: '历史记录'
            },
            text: {
                type: String,
                default: '历史记录为空'
            },
            hasTitle: {
                type: Boolean,
                default: false
            },
            loadingNoData: {
                type: Boolean,
                default: false
            },
            orderApproveHistory: {
                type: Boolean,
                default: false
            }
        },
        methods: {
            itemClick(item) {
                this.$emit('itemClick', item)
            }
        },
        components: {
            Loading
        }
    };
</script>
<style lang="scss" scoped>
    .h-title {
        padding: rem(17);
        text-align: center;
        font-size: rem(22);
        background-color: #ededed;
    }
    .h-title i {
        display: inline-block;
        width: rem(8);
        height: rem(8);
        background-color: #bdc7d1;
        vertical-align: middle;
        border-radius: 50%;
        position: relative;
    }
    .h-title>i::after {
        position: absolute;
        content: "";
        height: rem(4);
        width: rem(60);
        background: linear-gradient(to right, #bdc7d1, transparent);
    }
    .h-title i:nth-child(1)::after {
        top: 50%;
        right: rem(20);
        transform: translate(0, -50%);
        background: linear-gradient(to left, #bdc7d1, transparent);
    }
    .h-title i:nth-child(2)::after {
        top: 50%;
        left: rem(20);
        transform: translate(0, -50%);
    }
    // create by lwx
    .prompt-box {
        padding: remp(10) remp(20);
        color: #8b8f8d;
    }
    .list-box {
        display: flex;
        width: 100%;
        padding: remp(15) remp(20);
        box-sizing: border-box;
        //   max-height: remp(350);    ( 谁TM乱加的, 找半天bug...)
        .line-box {
            width: remp(25);
            padding-top: remp(10);
        }
        .scroll-content {
            width: 100%;
            margin-left: remp(7);
            .item {
                position: relative;
                padding-bottom: remp(19);
                .line-blue {
                    position: absolute;
                    left: remp(-22);
                    width: remp(2);
                    height: 100%;
                    background-color: #00a2f8;
                }
                .round {
                    position: absolute;
                    top: 50%;
                    left: remp(-33);
                    margin-top: remp(-12.5);
                    width: remp(25);
                    height: remp(25);
                    border-radius: 50%;
                    background-color: #00a2f8;
                    color: #fff;
                    font-size: remp(9);
                    text-align: center;
                    line-height: remp(25);
                }
                .item-title {
                    display: flex;
                    padding: remp(5) 0;
                    p {
                        flex: 1;
                        font-size: remp(12);
                    }
                    p:nth-child(1) {
                        color: #343535;
                        font-weight: 900;
                    }
                    p:nth-child(2) {
                        color: #7c817f;
                    }
                }
                .item-detail {
                    // width: remp(298);
                    width: 100%;
                    background-color: #f0f2f4;
                    padding: remp(6) remp(20);
                    box-sizing: border-box;
                    p {
                        font-size: remp(10);
                        line-height: remp(14);
                        span {
                            i {
                                font-size: remp(8);
                                color: red;
                            }
                        }
                    }
                    p:nth-child(1) {
                        color: #343535;
                        font-weight: 900;
                        padding-bottom: remp(5);
                    }
                    p:nth-child(2) {
                        color: #343535;
                        font-weight: 900;
                        padding-bottom: remp(5);
                    }
                    p:nth-child(3) {
                        color: #7c817f;
                    }
                    .remark-text {
                        word-break: break-all;
                    }
                }
            }
        }
    }
    .text-right {
        text-align: right;
    }
    .loading-box {
        position: relative;
        background-color: #fff;
        height: remp(160);
    }
    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
    .scroll-box {
        padding-left: remp(16);
    }
</style>
