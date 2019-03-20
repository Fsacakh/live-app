<template>
<div>
    <div class="w b-white list-h" v-show="items.length">
        <ul>
            <li v-for="(item, index) in items" @click="itemClick(item, index)">
                <p>{{item.time}}</p>
                <p>{{item.type}}</p>
                <p class="remark-text">备注: {{item.remark}}</p>
                <button :class="[butStyle, item.state == '1' ? butDef : butRed]">
                    {{item.state == '1' ? '待办' : '逾期'}}
                </button>
            </li>
        </ul>
    </div>
    <div class="title-box" v-show="!items.length && loadingNoData">
        {{text}}
    </div>
    <div v-show="!items.length  && !loadingNoData" class="track-loading-box">
        <div class="track-loading-container">
            <loading></loading>            
        </div>
    </div>
</div>    
</template>

<script>
import Loading from 'components/loading/loading'
    export default {
        props: {
            items: {
                type: Array,
                default: () => []
            },
            text: {
               type: String,
               default: '暂无待办事项'
            },
            loadingNoData: Boolean
        },
        data() {
            return {
                butStyle: 'button_2',
                butDef: 'button-def',
                butRed: 'button-red',
            }
        },
        methods: {
            itemClick(item, index) {
                // console.log(item)
                this.$emit('itemClick', item, index)
            }
        },
        components: {
            Loading
        }
    }
</script>

<style lang="scss" scoped>
    .list-h > ul > li {
        position: relative;
        // height: rem(112);
        border-bottom: 1px solid #ccc;
        padding: rem(30) rem(40) rem(30) rem(50);
    }
    .list-h > ul > li > P:first-child {
        font-size: rem(24);
        color:#333333;
        line-height: rem(28);
        text-align:left;
    }
    .list-h > ul > li > P:nth-child(2) {
        font-weight: 900;
        font-size: rem(24);
        color:#333333;
        line-height: rem(30);
        margin-top: rem(14)
    }
    .list-h > ul > li > P:nth-child(3) {
        font-size: rem(24);
        color:#7e8387;
        width: 100%;
        line-height: rem(28);
        max-height: rem(140);
        text-align: left;
        margin-top: rem(12)
        
    }
    .button_2 {
        border-style: none;
        border-radius: rem(6);
        width: rem(120);
        /* height: rem(40); */
        font-size: rem(24);
        color: #fff;
        position: absolute;
        top: rem(30);
        right: rem(40);
        padding: rem(8) rem(10);
    }
    .button-red {
        background:rgba(254,56,36,0.90);
    }
    .button-def {
        background: #bdc7d1;
    }
    .list-h > ul > li:last-child {
        border-bottom: none;
    }

    .title-box {
        padding: remp(10) remp(20);
        color: #8b8f8d;
        height: remp(60);
    }
    .track-loading-box {
        position: relative;
        background-color: #fff;
        height: remp(160);
    }
    .track-loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
    .remark-text {
        // word-break: break-all;
        // text-overflow: ellipsis;
        // display: -webkit-box;          /** 对象作为伸缩盒子模型显示 **/
        // -webkit-box-orient: vertical;  /** 设置或检索伸缩盒对象的子元素的排列方式 **/
        // -webkit-line-clamp: 2;         /** 显示的行数 **/
        // overflow: hidden;              /** 隐藏超出的内容 **/

        // white-space: nowrap;
        // overflow: hidden;
        // max-height: remp();
        // text-overflow: ellipsis;
    }
</style>