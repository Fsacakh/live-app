
<template>
<div class="w cell clearfix pr" :class="{ border : border }">
    <div class="fl title">
        <span>{{title}}</span>
    </div>
    <div class="fr input">
        <textarea :placeholder="placeholder" :value="value" @input="changeValue" :readonly="readonly" :maxlength="maxlength"></textarea>
    </div>
    <div v-if="triangle" class="triangle pa">
        <span class="iconfont icon-icon-rili"></span>
    </div>
</div>
</template>

<script>
    export default {
        model: {
            prop: 'value',
            event: 'textarea'
        },
        props: {
            title: String,
            triangle: Boolean,
            border: {
                type: Boolean,
                default: true,
            },
            value: '',
            readonly: {
                type: Boolean,
                default: false
            },
            placeholder: {
                type: String,
                default: '请输入客户意见（最多30字）'
            },
            maxlength: {
                type: Number,
                default: 30
            }
        },
        methods: {
            changeValue(event) {
                this.$emit('textarea', event.target.value)
            }
        }
    }
</script>

<style lang="scss" scoped>
    .cell {
        height: rem(150);
        background: #fff;
        padding-top: rem(22);
    }
    .border {
        border-top: 1px solid #ccc;
    } 
    .triangle {
        top: 50%;
        transform: translateY(-50%);
    } 
    .title>span {
        margin-left: rem(30);
        font-size: remp(13);
        color: #343535;
    }
    .input {
        right: rem(80);
    }
    input {
        font-size: remp(13);
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
        right: rem(10);
    }
    textarea {
        outline: none;
        resize: none;
        border: none;
        width: rem(600);
        height: rem(120);
        color: #BFC8CD;  
        font-size: remp(13);              
    }
</style>
