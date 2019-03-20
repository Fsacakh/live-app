<template>
<div>
    <div class="customer-list-box" v-for="(item,index) in dataList" :key="index">
        <!-- <div class="customer-img">
            <div v-if="item.sex === '男'">
                 <img src="../../assets/imgage/icon-male.png" >
            </div>
            <div v-if="item.sex === '女'">
                 <img src="../../assets/imgage/women.png" >
            </div>
            <img src="../../assets/imgage/icon-male.png" > -->
            <div class="level">
                {{item.level}}
            </div>
        </div> -->
        <div class="customer-img">
            <head-portrait :name="level" :badge='badge' :sex="sex"></head-portrait>
        </div>
        <div class="customer-info">
            <div class="info-head">
                <span>{{item.customerName}}</span>
                <span>{{item.phone}}</span>
            </div>
            <div class="info-con">
                <div>
                    <p class="main-info">{{item.car}}</p>
                    <p class="date">更新于{{item.date}}</p>
                </div>
                <div class="btn-box">
                    <div>{{item.status}}</div>
                </div>
            </div>
        </div>
    </div>
</div>
</template>
<script>
/**
 * @name   customer-list
 * @author lwx
 * @prop   dataList
 * @event
 * @see
 *
 */

import HeadPortrait from 'components/headportrait/headportrait'
export default {
    components: {
        HeadPortrait
    },
    props: {
        dataList: [Array],
        level: {
            type: [String],
            default: 'A级'
        },
        sex: {
            type: [Number],
            default: 1
        },
        badge: {
            type: [Number],
            default: null
        },
    },
    data() {
        return {

        }
    }
}
</script>
<style lang="scss" scoped>
.customer-list-box {
    display: -webkit-flex;
    // width: 100%;
    // height: rem(176);
    background-color: #fff;
    padding: rem(28) rem(40);
    border: 1px solid #f0f2f5;
}
.customer-img {
    position: relative;
    display: -webkit-flex;
    align-items: center;
    width: rem(90);
    // height: rem(90);
}
.level {
    position: absolute;
    left: -2px;
    bottom: 2px;
    width: rem(90);
    height: rem(28);
    font-size: 9px;
    text-align: center;
    line-height: 9px;
    color:#ffffff;
}
.customer-img img{
    width: rem(90);
    height: rem(90);
}
.customer-info {
    flex: 1;
    padding-left: rem(40);
}
.info-head {
    display: -webkit-flex;
    justify-content: space-between;
    font-family: PingFangSC-Medium;
    font-size: 14px;
    color: #333333;
    letter-spacing: -0.36px;
    line-height: rem(30);
    padding-bottom: rem(10);
}
.info-con {
    display: -webkit-flex;
    justify-content: space-between;
    height: rem(70);
}
.main-info {
    font-size: 14px;
}
.date {
    margin-top: rem(8);
    font-size: 12px;
    color:#7e8387;
}
.btn-box {
    display: -webkit-flex;
    align-items: center;
}
.btn-box > div {
    display: -webkit-flex;
    align-items: center;
    justify-content: center;
    background:#bdc7d1;
    border-radius: 3px;
    width: rem(120);
    height: rem(40);
    color: #fff;
    font-size: 12px;
}
</style>
