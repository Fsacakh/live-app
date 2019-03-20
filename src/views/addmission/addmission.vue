
<template>
    <div>
        <div>
            <cell title="姓名">
                <input type="text" placeholder="蔡思成">
            </cell>
            <cell title="事件类型" :triangle="true">
                <input type="text" placeholder="请选择类型">
            </cell>
            <cell title="任务时间" :triangle="true">
                <input type="text" placeholder="请选择任务时间">
            </cell>
            <remark title="备注"></remark>
        </div>
        <div class="submit">
            <mt-button size="large" type="primary">提交</mt-button>
        </div>
    </div>
</template>

<script>
   import Vue from 'vue'
    import {
        Button,
    } from 'mint-ui'
    Vue.component(Button.name, Button);
    import cell from '@/components/cell'
    import liveSelect from '@/components/select'
    import remark from '@/components/remark'    
    export default {
        data() {
            return {
            }
        },
        methods: {},
        mounted() {},
        components: {
            cell,
            liveSelect,
            remark
        }
    }
</script>

<style lang="scss">
    .submit {
        padding: 0 rem(20);
        margin-top: rem(65);
    }
    .car {
        margin-top: rem(10);
    }
    .tost {
        width: 100%;
        height: rem(72);
        text-align: center;
        color: #ffffff;
        background: rgba(254, 56, 36, 0.90);
        line-height: rem(72);
    }
</style>
