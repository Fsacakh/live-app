<template>
    <div>
        <page-header>
            <div slot>选择随车政策</div>
            <!-- <div slot="right">编辑</div>  -->
        </page-header>
        <div class="listContainer">
            <div class="item p-t-10 p-b-10 p-l-10 p-r-10 b-b">
                 <div class="title p-b-10">
                     {{ tempObj.policyName }}
                 </div>
                 <div class="container">
                    <p>
                        政策内容: <span>{{ tempObj.policyContent }}</span>
                    </p>
                    <p>
                        赠送条件: <span>{{ tempObj.policyCheckCondition }}</span>
                    </p>
                    <p>
                        ¥{{ tempObj.importTotalMoney }}
                    </p>
                 </div>
                <div class="typeName">
                    {{ tempObj.policyAscriptionName }}
                </div>
                <div class="isChoose">
                    <span @click="cut">-</span>
                    <input type="number" v-model="num">
                    <span @click="plus">+</span>
                </div>
             </div>
        </div>
        <div class="remark p-l-10 p-r-10 m-t-10">
            <span>
                备注:
            </span>
            <textarea v-model="content" name="" id="" cols="42" rows="10" placeholder="请输入备注内容（100个字以内）"></textarea>
        </div>
        <div class="add p-l-10 p-r-10 p-t-10 p-b-10">
            <div @click="finish">
                <i class="icon iconfont icon-icon-xuanzhong"></i>
                完成
            </div>
        </div>
    </div>
</template>
<script>
import PageHeader from "components/header/PageHeader"
import api from 'common/api'
import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
export default {
    computed: {
        ...mapState('carpolicy', [
            'policyList'
        ]),
        ...mapState('order', [
            'order'
        ])
    },
    data() {
        return {
            num: 1,
            argObj: '',
            tempIndex: '',
            tempObj: {},
            content:''
        }
    },
    components: {
        PageHeader
    },
    methods: {
        plus() {
            const _this = this
            _this.num++
        },
        cut() {
            const _this = this
            if(_this.num === 0) {
                return;
            }
            _this.num--
        },
        getIndex() {
            const _this = this
            _this.argObj = _this.$route.params  
            _this.tempIndex = _this.argObj.index - 0
            let num = _this.argObj.index - 0
            _this.tempObj = JSON.parse(JSON.stringify(_this.policyList[num]))
            console.log(_this.tempObj)
        },
        finish() {
            const _this = this
            // let list = []
            // let obj = {
            //     // remark: _this.
            // }
            let option = {
                orderNo: 'wzh-test-0001',
                promotionCode: _this.tempObj.policyCode,
                accountTypeCode: 'normalSale'
                // OrderPromotionDetailInfoVo: list
            }
            api.policyWidthCar.addPolicywithCar(option, function(res){
                if(res.data.code === 'success') {
                    _this.$router.push({
                        path: `/carwithpolicy-edit`
                    })
                }
            })
        }
    },
    created() {
        const _this = this
        _this.getIndex()
    }
}
</script>
<style lang="scss" scoped>
    .listContainer {
        font-size: remp(12);
        background-color: #ffffff;
        color: rgb(120, 131, 135);
    }
    .listContainer .item {
        position: relative;
    }
    .listContainer .item .title {
        color: rgb(51, 51, 51);
        width: 60%;
        font-weight: bolder;
        box-sizing: border-box;
    }
    .listContainer .item .container p:first-child {
        padding-bottom: remp(5);
    }
    .listContainer .item .container p:nth-child(2) {
        padding-bottom: remp(9);
    }
    .listContainer .item .container p:last-child {
        color: rgba(254, 56, 36, 0.9);
        padding: remp(5) 0;
    }
    .listContainer .item .typeName {
        position: absolute;
        right: remp(25);
        top: remp(10);
        color: rgb(126, 131, 135);
    }
    .listContainer .item .isChoose {
        position: absolute;
        right: remp(25);
        bottom: remp(15);
        width: remp(140);
        height: remp(25);
        box-sizing: border-box;
        text-align: center;
        line-height: remp(20);
    }
    .listContainer .item .isChoose span {
        display: inline-block;
        height: remp(20);
        line-height: remp(16);
        width: remp(20);
        font-size: remp(15);
        box-sizing: border-box;
        border: remp(1) solid rgb(189, 199, 209);
        border-radius: remp(3);
    }
    .listContainer .item .isChoose input {
        width: remp(45);
        height: remp(20);
        outline: none;
        box-sizing: border-box;
        vertical-align: top;
        text-align: center;
        border: remp(1) solid rgb(189, 199, 209);
    }
    .add {
        position: fixed;
        -webkit-transform: translateZ(0);
        left: 0;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
    }
    .add>div {
        height: remp(40);
        background-image: linear-gradient(to right,rgb(54, 172, 254), rgb(0, 140, 238));
        font-size: remp(14);
        text-align: center;
        line-height: remp(40);
        border-radius: remp(3);
        color: #ffffff;
    }
    .remark {
        background-color: #ffffff;
    }
    .remark textarea {
        vertical-align: top;
        outline: none;
        border: none;
        // padding-top: remp(3);
    }
</style>
