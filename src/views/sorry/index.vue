
<template>
    <div class="w h sorry-conent-pjl">
        <div>
            <page-header ref="header">
                <div slot>出错了</div>
            </page-header>
        </div>
        <div class="earth-pjl">
            <img :src="urlImg" alt="">
        </div>
        <div class="error-text-pjl">
            <p>Sorry · 暂时找不到该页面</p>
            <p>请稍后重试</p>
        </div>
    </div>
</template>

<script>
    const base = process.env.NODE_ENV === 'development' ? '' : '/liveapp/'
    import pageHeader from '@/components/header/PageHeader.vue'
    export default {
        components: {
            pageHeader
        },
        data() {
            return {
                urlImg: base + "/static/img/sorry.png"
            }
        },
        methods: {},
        mounted() {}
    }
</script>

<style lang="scss">
    .sorry-conent-pjl {
        height: 100%;
        width: 100%;
        padding-top: 40%;
        box-sizing: border-box;
        color: #BDC7D1;
    }
    .earth-pjl {
        margin: 0 auto;
        width: remp(90);
        height: remp(90);
    }
    .earth-pjl img {
        width: 100%;
    }
    .error-text-pjl {
        margin-top: remp(10);
        text-align: center;
    }
    .error-text-pjl p {
        margin-top: remp(10);
    }
</style>
