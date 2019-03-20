<template>
    <div class="addbox w b-white">
        <div class="changenum" v-if="false">
            <div class="title">
                数量
            </div>
            <div class="ressel">
                <div @click="reduce">
                    <i></i>
                </div>
                <div>{{val}}</div>
                <div @click="add">
                    <i class="icon iconfont icon-icon-tianjia"></i>
                </div>
            </div>
        </div>
        <div>
            <mt-button size="large" @click="routerto()" type="primary">加入</mt-button>
        </div>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {
        Button,
    } from 'mint-ui'
    Vue.component(Button.name, Button);
    export default {
        model: {
            prop: 'value',
            event: 'numberchange'
        },
        props: {
            value: Number
        },
        data() {
            return {
                val: this.value
            }
        },
        methods: {
            routerto: function() {
                this.$emit('routerto')
            },
            reduce() {
                this.val--;
                this.$emit('numberchange', this.val)
            },
            add() {
                this.val++;
                this.$emit('numberchange', this.val)
            }
        }
    }
</script>
<style lang="scss">
    .addbox {
        height: remp(45);
    }
    .addbox .changenum {
        float: left;
        height: remap(45);
        padding: remp(12.5) remp(0) remp(12.5) remp(25);
    }
    .changenum .title {
        display: inline-block;
        float: left;
        height: remp(20); // width: remp(24);
        font-size: remp(12);
        line-height: remp(20);
        color: rgb(51, 51, 51);
        margin-right: remp(15);
    }
    .changenum .ressel {
        float: left;
    }
    .ressel div:first-child {
        float: left;
        height: remp(20);
        width: remp(20);
        line-height: remp(9);
        text-align: center;
        border: 1px solid rgb(189, 199, 200);
        position: relative;
    }
    .ressel div:first-child>i {
        display: inline-block;
        width: remp(12);
        border: 1px solid rgb(189, 199, 200);
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
    }
    .ressel div:nth-child(2) {
        float: left;
        height: remp(20);
        width: remp(60);
        font-size: remp(10);
        line-height: remp(20);
        text-align: center;
        border: 1px solid rgb(189, 199, 200);
        margin: 0 remp(10)
    }
    .ressel div:last-child {
        float: left;
        height: remp(20);
        width: remp(20);
        text-align: center;
        line-height: remp(20);
        border: 1px solid rgb(189, 199, 200);
    }
    .ressel div:last-child>i {
        font-size: remp(12);
        color: rgb(189, 199, 200);
    }
    .addbox .addbtn {
        float: right;
        display: inline-block;
        width: remp(101);
        height: remp(45);
        line-height: remp(45);
        font-size: remp(14);
        color: #fff;
        text-align: center;
        background-color: rgb( 54, 172, 254)
    }
</style>
