<template>
    <div>
        <page-header @on-click-right="more">
            <div slot>报价单</div>
            <!-- <div slot="right">清空</div> -->
        </page-header>
        <div class="detailHead">
            <div>订单待审批</div>
            <div>二级审批: <span>罗志强</span></div>
            <div><a href="javascript:;" @click="showDetail">查看详情</a></div>
        </div>
        <div class="linkDetail p-t-10 p-l-10 p-b-10 p-r-10">
            <div class="imghead"></div>
            <div class="container">
                <p>北京奔驰</p>
                <p>颜色: <span>宝蓝色</span></p>
                <p>车架号: <span>9483948439438</span></p>
            </div>
            <div class="price">
                <span>¥5732489174382</span>
            </div>
        </div>
        <div class="itemsContainer p-t-10">
            <div class="finance">
                <cell title="金融" :icon="true">
                    <span slot="icon" class="hehe iconfont icon-icon-jinrong"></span>                    
                    <input type="text" placeholder="金额">
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
            <div class="insurance"  @click="jumpInsurance">
                <cell title="保险" :icon="true">
                    <span slot="icon" class="hehe iconfont icon-icon-baoxian"></span> 
                    <input type="text" placeholder="金额">
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
            <div class="aftermarket">
                <cell title="后市场" :icon="true">
                    <span slot="icon" class="hehe iconfont icon-icon-houshichang"></span> 
                    <input type="text" placeholder="金额">
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
            <div class="continue">
                <cell title="延保" :icon="true">
                    <span slot="icon" class="hehe iconfont icon-icon-yanbao"></span> 
                    <input type="text" placeholder="金额">
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
            <div class="exchange">
                <cell title="置换" :icon="true">
                    <span slot="icon" class="hehe iconfont icon-icon-zhihuan"></span> 
                    <!-- <input type="text" placeholder=""> -->
                    <span slot="left" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
            <div class="service" @click="servicefee()">
                <cell title="服务费及其他" :icon="true">
                    <span slot="icon" class="hehe iconfont icon-icon-fuwufeijiqita"></span> 
                    <!-- <input type="text" placeholder=""> -->
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
        </div>
        <div class="relativeOrder p-t-10">
            <cell title="相关订单" :icon="true">
                <span slot="icon" class="hehe iconfont icon-icon-dingdanxiangguan"></span> 
                <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                <!-- <input type="text" placeholder=""> -->
            </cell>
            <cell title="支付信息" :icon="true">
                <span slot="icon" class="hehe iconfont icon-icon-zhifuxinxi"></span> 
                <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                <!-- <input type="text" placeholder=""> -->
            </cell>
        </div>
        <div class="submitBtn flex">
            <div class="left flex">
                <div class="bargain p-l-10">
                    <i></i> 合同
                </div>
                <div class="total">
                    合计: <span>¥57329174382</span>
                </div>
            </div>
            <div class="right tc">
                提交
            </div>
        </div>
    </div>
</template>
<script>
    import PageHeader from "components/header/PageHeader"
    import cell from 'components/cell'
    export default {
        components: {
            PageHeader,
            cell
        },
        data(){
            return {
                
            }
        },
        methods: {
            more() {

            },
            showDetail() {

            },
            jumpInsurance() {
                const _this = this
                _this.$router.push({
                    path: '/insurance'
                })
            }
        }
    }
</script>
<style lang="scss">
    .detailHead {
        height: rem(80);
        line-height: rem(80);
        width: 100%;
        display: flex;
        text-align: center;
        background-color: #ffffff;
    }
    .detailHead>div {
        flex: 1;
    }
    .detailHead>div a {
        color: #7e8387;
        text-decoration: underline !important;
    }
    .linkDetail {
        margin-top: rem(40);
        height: rem(162);
        box-sizing: border-box;
        background-color: #ffffff;
        display: flex;
    }
    .linkDetail .imghead {
        flex: 2
    }
    .linkDetail .container {
        flex: 4
    }
    .linkDetail .container p:first-child {
        height: rem(40);
        line-height: rem(40);
        font-size: rem(28);
    }
    .linkDetail .container p:nth-child(2) {
        height: rem(33);
        line-height: rem(33);
        font-size: rem(24);
        color: #7e8387;
    }
    .linkDetail .container p:nth-child(3) {
        height: rem(33);
        line-height: rem(33);
        font-size: rem(24);
        color: #7e8387;
    }
    .linkDetail .price {
        flex: 3;
        text-align: center;
        line-height: rem(122)
    }
    .itemsContainer>div>div {
        border-top: none !important;
        border-bottom: rem(1) solid #ccc !important
    }
    .submitBtn {
        position: fixed;
        -webkit-transform: translateZ(0);
        left: 0;
        bottom: 0;
        width: 100%;
        height: rem(90);
        line-height: rem(90);
    }
    .submitBtn>.right {
        flex: 3;
        background-image: linear-gradient(90deg, #008cee 0%, #36acfe 100%);
    }
    .submitBtn>.left {
        flex: 7;
    }
    .submitBtn>.left .bargain {
        box-sizing: border-box;
        flex: 1
    }
    .submitBtn>.left .bargain i {
        display: inline-block;
        width: rem(21);
        height: rem(21);
        border-radius: 50%;
        background-color: red;
    }
    .submitBtn>.left .total {
        flex: 1
    }
    .submitBtn>.left .total span {
        color: #008cee;
    }
    .hehe{
        font-size: rem(40);
    }
    .service>.border {
        border-bottom: none !important;
    }
    .relativeOrder>.border:nth-child(1) {
        border-bottom: 1px solid #ccc !important;
    }
    .relativeOrder>.border {
        border-top: none !important;
    }
</style>
