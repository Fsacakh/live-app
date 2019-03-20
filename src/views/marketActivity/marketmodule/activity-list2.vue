<template>
    <div class="market">
        <page-header>
            <div slot>{{$route.query.leadCode?'新增市场活动':'市场活动'}}</div>
        </page-header>
        <scroll ref="scroll"
              :data="items"
              :scrollbar="scrollbarObj"
              :pullUpLoad="pullUpLoadObj"
              :startY="parseInt(startY)"
              @pullingDown="onPullingDown"
              @click="clickItem"
      >
      </scroll>
    </div>
</template>

<script>
import Vue from 'vue'
import pageHeader from '@/components/header/PageHeader'
import scroll from '../component/scroll'
export default {
    components: {
        pageHeader,
        scroll
    },
    data() {
        return {
            scrollbar: true,
            scrollbarFade: true,
            pullUpLoad: true,
            pullUpLoadThreshold: 0,
            pullUpLoadMoreTxt: '大坏蛋',
            pullUpLoadNoMoreTxt: '小坏蛋',
            startY: 0,
            items: ['1','2',3,4,5,6,7,8,9,0,1,2,3,4,5,6,7],
        }
    },
    computed: {
      scrollbarObj: function () {
        return this.scrollbar ? {fade: this.scrollbarFade} : false
      },
      pullUpLoadObj: function () {
        return this.pullUpLoad ? {
          threshold: parseInt(this.pullUpLoadThreshold),
          txt: {more: this.pullUpLoadMoreTxt, noMore: this.pullUpLoadNoMoreTxt}
        } : false
      }
    },
    methods:{
        onPullingDown() {
            // 模拟更新数据
            console.log('pulling down and load data')
            setTimeout(() => {
                if (this._isDestroyed) {
                    return
                }
                if (Math.random() > 0.5) {
                    // 如果有新数据
                    this.items.unshift('11111' + +new Date())
                } else {
                // 如果没有新数据
                    this.$refs.scroll.forceUpdate()
                }
            }, 2000)
        },
        clickItem() {

        },
    }
}
</script>
<style lang="scss" scoped>
    .market{
        height:100%;
        .header-warp{
            position: fixed;
            top:0;
            z-index: 100;
        }
    }
</style>
