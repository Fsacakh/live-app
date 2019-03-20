
<template>
    <div>
        <div class="popup-pjl pa popup-pjl " v-if="popupVisible">
            <span class="iconfont pa triangle-pjl icon-xiaosanjiao"></span>
            <p v-for="item in list"  @click="itemClick(item)">
                <i class="iconfont" :class="item.iconClass"></i>                
                <a href="javascript:;">{{item.name}}</a>
            </p>
        </div>
    </div>
</template>

<script>
    export default {
        props:{
            popupVisible:{
                type: Boolean,
                default: true
            },
            list:{
                type: Array,
                default: []                
            }
        },
        data() {
            return {
            }
        },
        methods: {
            itemClick(item) {
                if(item.path) {
                    this.$router.push({
                        path: item.path
                    })
                }else {
                    this.$emit('showModal',item)
                }
            }
        },
        mounted() {},
        components: {}
    }
</script>

<style lang="scss">
    .popup-pjl {
        bottom: remp(-80);
        left: remp(10);
        z-index: 2001;
        background-color: #fff;
        box-shadow: rgba(155, 155, 155, 0.5) 0px 0px 13px;
        padding: 0 remp(15) 0 remp(15);
    }
    .popup-pjl p {
        padding: remp(10) 0 remp(10) 0;
    }
    .popup-pjl p:nth-child(2) {
        border-bottom: solid remp(.5) #ccc;
    }
    .triangle-pjl {
        color: #fff;
        font-size: remp(14);
        top: remp(-8);
        left: remp(8);
    }
    p>a {
        color: #000 !important;
    }
</style>
