<template>
    <div class="modal-warp pr max-width" @click.self="close" v-if="conceal">
        <div class="pa content">
            <div class="titleWarp">
                <div class="left" :class="{'active': !showTitle}" @click="leftClick">
                    <slot name="left"></slot>
                </div>
                <div class="title" @click="titleClick">
                    {{ title }}
                </div>
                <span v-if="closeShow" class="pa close-pjl"><i @click.self="close" class="iconfont icon-guanbi"></i></span> 
            </div>
            <div class="content-pjl">
                <div class="slotcontent">
                    <slot></slot>
                </div>
                <div class="footer">
                    <div v-if="confirmDisplay && displayTitle">
                        <mt-button @click="submit" size="large" type="primary">{{ submitText }}</mt-button>
                    </div>
                    <slot name="footer"></slot>
                </div>
            </div>
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
        props: {
            title: String,
            submitText: {
                type: String,
                default: '提交'
            },
            afterConfirmClose: {
                type: Boolean,
                default: true
            },
            showTitle: {
                type: Boolean,
                default: true 
            },
            confirmDisplay: {
                type: Boolean,
                default: true
            },
            closeShow: {
                type: Boolean,
                default: true
            }
        },
        data: function() {
            return {
                conceal: false,
                displayTitle: true
            }
        },
        methods: {
            submit() {
                this.$emit("submit");
                if (this.afterConfirmClose) {
                    this.close()
                }
            },
            leftClick() {
                this.displayTitle = !this.displayTitle
                this.$emit('on-click-left')
            },
            titleClick() {
                this.displayTitle = true
                this.$emit('on-click-title')
            },
            close() {
                this.conceal = false
            },
            open() {
                this.conceal = true
            }
        },
        watch: {
            showTitle: {
                handler(val) {
                    let _this = this
                    _this.displayTitle = val
                },
                deep: true
            }
        },
        components: {},
    }
</script>

<style lang="scss" scoped>
    .modal-warp {
        width: 100%;
        height: 100%;
        position: fixed;
        transform: translateZ(0);
        top: 0;
        background-color: rgba(0, 0, 0, .6);
        z-index: 4;
    }
    .content {
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        border-radius: rem(15);
        color: #ffffff;
        width: remp(320);
        height: 60%;
        background-color: white;
        display: flex;
        flex-direction: column;
    }
    .content .content-pjl {
        width: remp(320);
        height: 90%;
        display: flex;
        flex-direction: column;
    }
    .content .titleWarp {
        width: 100%;
        height: rem(88);
        background-image: linear-gradient(-90deg, rgb(0, 140, 238) 0%, rgb(54, 172, 254) 100%);
        box-sizing: border-box;
    }
    .content .titleWarp .left {
        height: rem(88);
        font-size: rem(28);
        line-height: rem(88);
        text-align: center;
        position: absolute;
        float: left;
        color: $browser-default-color-white;
        display: flex;
    }
    .content .titleWarp .active {
        padding-right: rem(10);
        background-image: linear-gradient(-90deg, rgb(21, 148, 240) 0%, rgb(21, 148, 240) 100%);
    }
    .content .titleWarp .left .iconfont {
        font-size: remp(40) !important;
    }
    .content .titleWarp .title {
        font-size: remp(17);
        line-height: rem(88);
        text-align: center;
        width: auto;
        height: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        color: $browser-default-color-white;
    }
    .content .content-pjl .slotcontent {
        box-sizing: border-box;
        padding: 10px;
        height: 85%;
        overflow-y: auto;
    }
    .content .footer {
        height: 15%;
        box-sizing: border-box;
        background-color: #fff;
        width: 100%;
    }
    .content .footer>div {
        width: 70%;
        margin: 0 auto;
    }
    .close-pjl {
        right: 0;
        transform: translate(30%, -160%);
    }
    .close-pjl i {
        font-size: remp(25);
    }
</style>
