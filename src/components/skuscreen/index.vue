<template>
    <div class="screen-box">
        <div class="screen-top">
            <div :class="{'topactive': item.flag}" @click="topClick(item, index)" v-for="(item, index) in topList" class="top-item-box">
                <div class="name-box">
                    <span>{{item.name}}</span>
                </div>
                <div class="img-box">
                    <div class="screen-img-box" v-show="!item.check">
                        <img src="../../assets/imgage/down.png">
                    </div>
                    <div class="screen-img-box" v-show="item.check">
                        <img src="../../assets/imgage/up.png">
                    </div>
                </div>
            </div>
        </div>
        <div class="layer" v-show="showCon">
            <div class="screen-con">
                <ul class="clearfix">
                    <li :class="{'active': item.flag}" v-for="item in itemList" @click="itemClick(item)">
                        <a href="javascript:;">{{item.name}}</a>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>
<script>
    /**
     * @name   screen
     * @author lwx
     * @event  getValue(topList) 对外抛出一个数组, 数组对象中的name字段就是最终选择的值
     * @see    注意: 暂时这些数据都是我写死的, 后续如果业务需要可以写的灵活一点
     *
     */
    import api from "@/common/api.js";
    import config from "@/common/config.js";
    export default {
        data() {
            return {
                topList: [{
                        title: "skutype",
                        name: "商品类型",
                        check: false,
                        flag: false
                    },
                    {
                        title: "skuclassify",
                        name: "商品分类",
                        check: false,
                        flag: false
                    },
                ],
                itemList: [],
                showCon: false,
                topIndex: "",
                skutype: [],
                skuclassify: []
            }
        },
        methods: {
            topClick(item, index) {
                this.showCon = !this.showCon
                this.topIndex = index
                if (item.title == 'skutype') {
                    this.itemList = this.skutype
                } else if (item.title == 'skuclassify') {
                    this.itemList = this.skuclassify
                }
            },
            itemClick(item) {
                this.resetting(this.skuclassify) //干掉所有                
                this.resetting(this.skutype) //干掉所有
                item.flag = true //复活自己
                this.topList[this.topIndex].name = item.name; //把选中值赋值给上面
                this.resetting(this.topList) //干掉所有
                this.topList[this.topIndex].flag = true //复活自己
                this.$emit("getValue", [item]);
                if (item.level == 0) {
                    this.topList[1].name = "商品分类";
                    api.aftermarket.queryskucatlog({
                        'catlogCode': item.code,
                    }, (msg) => {
                        if (msg.data.message == 'success') {
                            let data = msg.data.obj.skuCatLogSubInfo || []
                            this.skuclassify = []
                            for (let i = 0; i < data.length; i++) {
                                if ((item.code === config.aftermarket.groupShop)||(item.code === config.aftermarket.groupShopCP)) {
                                    this.$set(this.skuclassify, i, {
                                        name: data[i].catlogName,
                                        code: data[i].catlogCode,
                                        flag: false,
                                        level: 1,
                                        skutype: "gropshop"
                                    })
                                } else if ((item.code === config.aftermarket.skuCatlogCode) || (item.code === config.aftermarket.skuCatlogCodeCP)) {
                                    this.$set(this.skuclassify, i, {
                                        name: data[i].catlogName,
                                        code: data[i].catlogCode,
                                        flag: false,
                                        level: 1,
                                        skutype: "normal"
                                    })
                                } else if ((item.code === config.aftermarket.postponeSku)||(item.code === config.aftermarket.postponeSkuCP)) {
                                    this.$set(this.skuclassify, i, {
                                        name: data[i].catlogName,
                                        code: data[i].catlogCode,
                                        flag: false,
                                        level: 1,
                                        skutype: "postponeSku"
                                    })
                                } else if ((item.code === config.aftermarket.card)||(item.code === config.aftermarket.cardCP)) {
                                    this.$set(this.skuclassify, i, {
                                        name: data[i].catlogName,
                                        code: data[i].catlogCode,
                                        flag: false,
                                        level: 1,
                                        skutype: "card"
                                    })
                                }
                            }
                        }
                    })
                }
                this.showCon = false
            },
            resetting(array) {
                for (let index = 0; index < array.length; index++) {
                    array[index].flag = false
                }
            },
            showConclose() {
                this.showCon = false
            }
        },
        mounted() {
            api.aftermarket.queryskucatlog({
                'catlogCode': '022261'
            }, (msg) => {
                if (msg.data.message == 'success') {
                    let data = msg.data.obj.skuCatLogSubInfo
                    for (let i = 0; i < data.length; i++) {
                        if (data[i].catlogCode === config.aftermarket.skuCatlogCode || data[i].catlogCode === config.aftermarket.skuCatlogCodeCP) {
                            this.$set(this.skutype, i, {
                                name: data[i].catlogName,
                                code: data[i].catlogCode,
                                flag: true,
                                level: 0
                            })
                            this.topIndex = 0
                            this.itemClick(this.skutype[i])
                        } else {
                            this.$set(this.skutype, i, {
                                name: data[i].catlogName,
                                code: data[i].catlogCode,
                                flag: false,
                                level: 0
                            })
                        }
                    }
                }
            })
        },
        watch: {
            showCon: function() {
                this.$emit('cover', this.showCon)
            }
        }
    };
</script>
<style lang="scss" scoped>
    .screen-box {
        position: relative;
        width: 100%;
        background-color: #F4F4F4;
    }
    .screen-top {
        display: flex;
        height: rem(70);
        padding: rem(8) rem(24);
        box-sizing: border-box;
        font-size: rem(30);
        border-bottom: 1px solid #ccc;
    }
    .screen-top>div {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .screen-top>div.topactive {
        color: #008cee !important;
    }
    .top-item-box {
        // position: relative;
        display: -webkit-flex;
    }
    .name-box {
        flex: 1;
        text-align: center;
    }
    .img-box {
        width: rem(16);
        display: flex;
        align-items: baseline;
    }
    .screen-img-box {
        // position: absolute;
        // top: 25%;
        // right: 0;
    }
    .screen-img-box img {
        width: rem(16);
        height: rem(10);
    }
    .screen-con {
        position: absolute;
        font-size: rem(24);
        padding: rem(34) rem(4) rem(14) rem(40);
        box-sizing: border-box;
        background-color: #fafafa;
        z-index: 100;
        width: 100%;
    }
    .screen-con>ul,
    .screen-warp ul {
        width: 100%;
        height: 100%;
    }
    .screen-con>ul>li,
    .screen-warp ul>li {
        width: 20%;
        box-sizing: border-box;
        float: left;
        padding: rem(10);
        margin: rem(10) 2%;
        text-align: center;
        background-color: #f0f2f5;
    }
    .screen-warp ul>li {
        width: 40%;
        margin: rem(10) 5%;
    }
    .screen-con>ul>li>a,
    .screen-warp ul>li>a {
        color: #b9bdc1;
    }
    .screen-warp {
        position: absolute;
        font-size: rem(24);
        padding: rem(34) 0 rem(14) 0;
        box-sizing: border-box;
        background-color: #fafafa;
        z-index: 100;
        width: 100%;
    }
    .screen-warp>div {
        width: 49%;
    }
    .screen-warp>div:nth-child(2) {
        border-left: rem(3) solid #f0f2f5;
    }
    .screen-warp>div>h1 {
        margin-left: remp(23);
        margin-bottom: remp(8);
        color: #7e8387;
    }
    .active {
        background-color: #008CEE !important;
    }
    .active a {
        color: #fff !important;
    }
    .layer {
        position: absolute;
        width: 100%;
        z-index: 50;
        background: rgba(0, 0, 0, 0.4);
    }
    .button {
        overflow: hidden;
        margin: 0 auto;
        padding-top: rem(20);
        width: rem(180) !important;
    }
</style>
