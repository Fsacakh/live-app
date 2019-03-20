<template>
    <div class="h-content pa headimg">
        <img v-if="sex===0" class="w h" src="../../assets/imgage/women.png" />
        <img v-if="sex===1" class="w h" src="../../assets/imgage/icon-male.png" />
        <p class="white w">{{name}}</p>
        <div v-if="badge" class="badge">
            <span class="white">{{badge}}</span>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            name: String,
            sex: Number,
            badge: Number
        },
        data() {
            return {}
        },
        methods: {},
    }
</script>
<style scoped lang="scss">
    .h-content {
        position: relative;
        width: rem(90);
        height: rem(90);
    }
    .headimg p {
        position: absolute;
        bottom: 0;
        text-align: center;
        font-size: rem(16);
        height: rem(26);
        line-height: rem(26);
    }
    .badge {
        position: absolute;
        top: 0;
        right: 0;
    }
    .badge span{
        display: block;
        width: rem(27);
        height: rem(27);
        line-height: rem(27);
        text-align: center;
        font-size: rem(16);
        background-color:rgba(254,56,36,0.90);
        border-radius: 50%;
        transform: translate(30%,-30%);
    }
</style>

