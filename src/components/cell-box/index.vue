<template>
    <div class="w cell-box clearfix pr" :class="{ border: border }">
        <div class="pa input">
            <slot></slot>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            border: {
                type: Boolean,
                default: true
            }
        },
        data: function() {
            return {}
        },
        methods: {
        },
        components: {
        }
    }
</script>

<style lang="scss" scoped>
    .cell-box {
        min-height: rem(80);
        background: #fff;
    }
    .border {
        border-top: 1px solid rgba(240, 242, 245,.5);
    }
    .input {
        top: 50%;
        transform: translateY(-50%);
    }
    .input {
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
</style>