<template>
    <div class="wrap-myh">
        <page-header ref="header">
            <div slot>4S门店数据</div>
        </page-header>
        <div class="board-box">
            <img :src="imgUrl" alt="">
        </div>
    </div>
</template>
<script>
    import pageHeader from '@/components/header/PageHeader'
    const base = process.env.NODE_ENV === 'development' ? '' : '/liveapp/'
    export default {
        components: {
            pageHeader
        },
        data() {
            return {
                imgUrl: base + '/static/databoard2.jpg'
            }
        }
    }
</script>

<style lang="scss">
    .board-box {
        width: 100%; // height: 100%;
        overflow: hidden;
        img {
            position: relative;
            width: 100%;
            height: auto;
        }
    }
    .wrap-myh {
        width: 100%;
        height: 100%;
    }
</style>
