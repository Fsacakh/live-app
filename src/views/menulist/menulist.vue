<template>
    <div class="index">
        <mt-header title="标题过长会隐藏后面的内容啊哈哈哈哈">
            <mt-button v-link="'/'" icon="back" slot="left">返回</mt-button>
            <mt-button icon="more" slot="right"></mt-button>
        </mt-header>
        <ul class="tc mt20">
            <router-link v-for="item in listData" :to="item.path" :key="item.id">
                <li>{{item.label}}</li>
            </router-link>
        </ul>
    </div>
</template>
<style>
    html {
        font-size: 50px;
    }
</style>
<script>
    import Vue from 'vue'
    import {
        Button,
    } from 'mint-ui'
    Vue.component(Button.name, Button);
    import Vue from 'vue'
    import {
        Button,
    } from 'mint-ui'
    Vue.component(Button.name, Button);
    import router from '@/router/index.js'
    export default {
        data() {
            return {
                listData: [],
            }
        },
        methods: {},
        mounted() {
            // console.log(router.options.routes)
            this.listData = router.options.routes;
        },
    }
</script>
<style>
    .index ul li {
        cursor: pointer
    }
</style>