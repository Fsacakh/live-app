<template>
    <label v-if="pageType === 'label'" class="w cell clearfix pr" :class="{
            border:border
        }" @click="cellClick">
        <div class="fl pa title">
            <slot name="icon"></slot>
        </div>
        <div class="fl pa title" :class="{'iconhave':icon}">
            <span>{{title}}</span>
        </div>
        <div class="fr pa input">
            <slot></slot>
        </div>
        <div class="triangle pa">
            <slot name="right"></slot>
        </div>
    </label>
    <div v-else class="w cell clearfix pr" :class="{
            border:border
        }" @click="cellClick">
        <div class="fl pa title">
            <slot name="icon"></slot>
        </div>
        <div class="fl pa title" :class="{'iconhave':icon}">
            <span>{{title}}</span>
        </div>
        <div class="fr pa input">
            <slot></slot>
        </div>
        <div class="triangle pa">
            <slot name="right"></slot>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            title: String,
            border: {
                type: Boolean,
                default: true,
            },
            pageType: String,
            icon: Boolean
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

<style lang="scss" scoped>
    .cell {
        min-height: rem(80);
        background: #fff;
        display: block;
    }
    .border{
        border-top: 1px solid rgba(240, 242, 245, 1);

    }
    .title,
    .input,
    .triangle {
        top: 50%;
        transform: translateY(-50%);
        color: rgb(51, 51, 51);
    }
    .iconhave {
        left: rem(60);
    }
    .title>span {
        margin-left: rem(30);
    }
    .input {
        width: 40%;
        right: rem(52);
    }
    .input>* {
        width: 100%;
    }
    input {
        font-size: rem(22);
        border: none;
    }
    input::-webkit-input-placeholder {
        /* WebKit browsers*/
        color: #bdc7d1;
    }
    input:-moz-placeholder {
        /* Mozilla Firefox 4 to 18*/
        color: #bdc7d1;
    }
    input::-moz-placeholder {
        /* Mozilla Firefox 19+*/
        color: #bdc7d1;
    }
    input:-ms-input-placeholder {
        /* Internet Explorer 10+*/
        color: #bdc7d1;
    }
    .triangle {
        display: inline-block;
        right: rem(20);
    }
</style>
