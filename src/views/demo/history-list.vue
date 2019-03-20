<template>
<div class="demo-box">
    <scroll :data="items" ref="history" class="scroll">
        <history-list :items="items" @itemClick="itemClick"></history-list>
    </scroll>
</div>
</template>
<script>
import Scroll from 'components/scroll/scroll'
import HistoryList from 'components/history-list/history-list'
export default {
    data() {
        return {
            items: [
                {
                    navTitle: '预约',
                    title: "预约到店",
                    time: "2017/11/08 15:59",
                    scName: "强哥",
                    remark: "闪电发货就开始"
                },
                {
                    navTitle: '预约',
                    title: "预约到店",
                    time: "2017/11/08 15:59",
                    scName: "强哥",
                    remark: "闪电发货就开始"
                },
                {
                    navTitle: '预约',
                    title: "预约到店",
                    time: "2017/11/08 15:59",
                    scName: "强哥",
                    remark: "闪电发货就开始"
                },
                {
                    navTitle: '预约',
                    title: "预约到店",
                    time: "2017/11/08 15:59",
                    scName: "强哥",
                    remark: "闪电发货就开始"
                },
                {
                    navTitle: '预约',
                    title: "预约到店",
                    time: "2017/11/08 15:59",
                    scName: "强哥",
                    remark: "闪电发货就开始"
                },
                {
                    navTitle: '预约',
                    title: "预约到店",
                    time: "2017/11/08 15:59",
                    scName: "强哥",
                    remark: "闪电发货就开始"
                },
                {
                    navTitle: '预约',
                    title: "预约到店",
                    time: "2017/11/08 15:59",
                    scName: "强哥",
                    remark: "闪电发货就开始"
                },
                {
                    navTitle: '预约',
                    title: "预约到店",
                    time: "2017/11/08 15:59",
                    scName: "强哥",
                    remark: "闪电发货就开始"
                },
                {
                    navTitle: '预约',
                    title: "预约到店",
                    time: "2017/11/08 15:59",
                    scName: "强哥",
                    remark: "闪电发货就开始"
                },
                {
                    navTitle: '预约',
                    title: "预约到店",
                    time: "2017/11/08 15:59",
                    scName: "强哥",
                    remark: "闪电发货就开始"
                },
            ],
            // 测试数组为空
            // items: []
        }
    }, 
    methods: {
        itemClick(item) {
            console.log(item)
        }
    },
    components: {
       HistoryList,
       Scroll
    }
}
</script>
<style lang="scss" scoped>
.demo-box {
    position: fixed;
    -webkit-transform: translateZ(0);
    top: remp(40);
    width: 100%;
    bottom: 0;
    .scroll {
        background-color: #fff;
        height: 100%;
        overflow: hidden;
    }
}

</style>

