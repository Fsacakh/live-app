<template>
    <div>
        <page-header ref="header">
            <div slot>4S门店数据</div>
        </page-header>
        <div class="board-box b-white">
            <ul>
                <li class="board-title">
                    <span>品牌</span>
                    <span>车型</span>
                    <span>交车数</span>
                </li>
                <li class="board-item" v-for="(item, index) in quoteNumInfo" :key="index">
                    <span>{{item.carBandName}}</span>
                    <span>{{item.carModelName}}</span>
                    <span>{{item.num}}</span>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
import {mapActions, mapState} from 'vuex'
import pageHeader from '@/components/header/PageHeader'
export default {
    components: {
        pageHeader
    },
    data () {
        return {
            data: [
                {
                    brand: '奔驰',
                    model: 'E320L',
                    number: 3
                },
                {
                    brand: '奔驰',
                    model: 'E320L',
                    number: 3
                },
                {
                    brand: '奔驰',
                    model: 'E320L',
                    number: 3
                },
            ]
        }
    },
    computed: {
        ...mapState('databoard', [
            'quoteNumInfo',
            'orderNumInfo',
            'deliveryNumInfo',
        ])
    },
}
</script>

<style lang="scss">
    .board-box {
        padding-top: remp(3);
        .board-title {
            display: flex;
            padding: remp(5) 0;
            border-bottom: 1px solid #E4E4E4;
            span {
                flex: 1;
                text-align: center;
                font-size: remp(14);
                color: #4B4B4B;
                height: remp(30);
                line-height: remp(30);
            }
            span:nth-child(2) {
                border-left: 0.5px solid #E4E4E4;
                border-right: 0.5px solid #E4E4E4;
            }
        }
        .board-item {
            display: flex;
            border-bottom: 0.5px solid #D8D8D8;
            span {
                flex: 1;
                text-align: center;
                font-size: remp(14);
                color: #364C6A ;
                height: remp(40);
                line-height: remp(40);
            }
            span:nth-child(3) {
                color: #040404;
                font-weight: 600;
            }
        }
    }
</style>
