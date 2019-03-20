<template>
    <div>
        <page-header>
            <div slot>车辆信息</div>
            <div slot="right">保存</div>
        </page-header>
        <cell title="车型车款" :triangle="true">
            <input type="text" value="C180K" />
        </cell>
        <cell-box>
            <div class="flex margin-left-30">
                <div class="w50">
                    <span>外观</span>
                    <span class="m-l-20">黑</span>
                </div>
                <div class="w50">
                    <span>内饰</span>
                    <span class="m-l-20">黑</span>
                </div>
            </div>
        </cell-box>
        <cell title="MSRP">
            <input type="text" value="¥1600,000" />
        </cell>
        <cell title="现金折扣">
            <input type="text" value="¥1600,000" />
        </cell>
        <cell title="车辆折后价">
            <input type="text" value="¥200,000" />
        </cell>
        <cell title="消费税及附加">
            <input type="text" value="" placeholder="¥0" />
        </cell>
        <cell title="车辆销售价">
            <input type="text" value="¥200,000" placeholder="" />
        </cell>
        <div class="submit">
            <mt-button size="large" type="primary">提交</mt-button>
        </div>
        <remark title="备注"></remark>
    </div>
</template>

<script>
    import pageHeader from '@/components/header/PageHeader'
    import cell from '@/components/cell'
    import cellBox from '@/components/cell-box'
    import remark from '@/components/remark'
    import Vue from 'vue'
    import {
        Button,
    } from 'mint-ui'
    Vue.component(Button.name, Button);
    export default {
        data: function() {
            return {
            }
        },
        methods: {
        },
        components: {
            pageHeader,
            cell,
            cellBox,
            remark
        }
    }
</script>

<style lang="scss">
    .margin-left-30 {
        margin-left: rem(30);
    }
    .submit {
        padding: 0 rem(20);
        margin-top: rem(12);
        margin-bottom: rem(12);
    }
</style>