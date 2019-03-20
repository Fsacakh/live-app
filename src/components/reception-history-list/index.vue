<template>
<div class="history">
    <div class="scroll-box" v-show="items.length">
        <div class="list-box">
            <div class="scroll-content">
                <div class="item" v-for="(item, index) in items" :key="index" @click="itemClick(item)">
                    <div class="item-title">
                        {{ item.remark }}
                    </div>
                    <div class="item-detail">
                        <span>{{item.enterStoreObjectiveViewName}}</span><span class="time">{{ item.receptionStartTime | formatTime2 }} - {{ item.receptionEndTime | formatTime3 }}</span> 
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
            loadingNoData: {
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
    }
</script>
<style lang="scss" scoped>
    .prompt-box {
        padding: remp(10) remp(20);
        color: #8b8f8d;
    }
    .list-box {
        display: flex;
        width: 100%;
        padding: remp(15) remp(20);
        box-sizing: border-box;
        .line-box {
            width: remp(25);
            padding-top: remp(10);
        }
        .scroll-content {
            width: 100%;
            .item {
                position: relative;
                padding-bottom: remp(19);
                display: flex;
                flex-direction: column;
                .item-title {
                    display: flex;
                    padding: remp(5) 0;
                    font-size: remp(16);
                    color: black;
                }
                .item-detail {
                    width: 100%;
                    margin-top: remp(10);
                    box-sizing: border-box;
                    display: flex;
                    flex-direction: row;
                    justify-content: space-between;
                    color: black;
                    border-bottom: solid rgb(9, 105, 248) rem(2);
                    .time {
                        float: right;
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
</style>
