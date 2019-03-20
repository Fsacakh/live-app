<template>
    <div v-if="cpType == 'rests'" class="w cell-joly clearfix pr" :class="{'border-joly':border}" @click="cellClick">
        <div class="fl pa icon-joly-pan">
            <slot name="icon"></slot>
        </div>
        <div class="fl pa title-joly" :class="{'iconhave-joly':icon}">
            <span>{{title}}</span>
        </div>
        <div class="fr pa input-joly">
            <slot></slot>
        </div>
        <div class="triangle-joly pa">
            <slot name="right"></slot>
        </div>
    </div>
    <label v-else class="w cell-joly clearfix pr" :class="{'border-joly':border}" @click="cellClick">
        <div class="fl pa icon-joly-pan">
            <slot name="icon"></slot>
        </div>
        <div class="fl pa title-joly" :class="{'iconhave-joly':icon}">
            <span>{{title}}</span>
        </div>
        <div class="fr pa input-joly">
            <slot></slot>
        </div>
        <div class="triangle-joly pa">
            <slot name="right"></slot>
        </div>
    </label>
</template>
<script>
    export default {
        props: {
            cpType: String,
            title: String,
            border: {
                type: Boolean,
                default: true,
            },
            icon: Boolean,
            name: String,
        },
        data() {
            return {};
        },
        methods: {
            cellClick() {
                this.$emit('cellClick')
            }
        },
        mounted() {},
    };
</script>

<style lang="scss">
    .cell-joly { 
        min-height: rem(80);
        background: #fff;
        display:block;
    }
    .border-joly {
        border-top: 1px solid rgba(240, 242, 245, .3);
    }
    .title-joly,
    .input-joly,
    .triangle-joly {
        top: 50%;
        transform: translateY(-50%);
        color: rgb(51, 51, 51);
    }
    .iconhave-joly {
        left: rem(60);
    }
    .title-joly>span {
        margin-left: rem(30);
        font-size: remp(13); // color: rgb(51, 51, 51);
    }
    .input-joly {
        width: 45%;
        right: rem(75);
    }
    .input-joly>* {
        width: 100%;
    }
    input {
        font-size: remp(13);
        border: none;
        color: #6F7472
    }
    input::-webkit-input-placeholder {
        /* WebKit browsers*/
        color: #cbcbcb;
    }
    input:-moz-placeholder {
        /* Mozilla Firefox 4 to 18*/
        color: #cbcbcb;
    }
    input::-moz-placeholder {
        /* Mozilla Firefox 19+*/
        color: #cbcbcb;
    }
    input:-ms-input-placeholder {
        /* Internet Explorer 10+*/
        color: #cbcbcb;
    }
    .triangle-joly {
        display: inline-block;
        right: rem(20);
    }
    .triangle-joly>* {
        color:#696969;
    }
    .icon-joly-pan {
        top: 50%;
        transform: translateY(-50%);
        color: rgb(51, 51, 51);
    }
    .icon-joly-pan>* {
        margin-left: rem(30);
        font-size: remp(13);
        color: rgb(129, 129, 129);
    }
</style>
