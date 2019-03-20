<template>
<div class="intentionCarBox">
    <div class="intentionCar w" @click="addCar">
        <span class="tl">意向车</span>
        <i class="iconfont" :class="{ 'icon-icon-tianjia' : isSc }"></i>
    </div>
    <div class="intentionCarList w" v-for="(item, index) in getCusLeadInfo.intentionCarInfoVos" :key="index" @click="itemClick(index)">
        <div class="imge tc">
            <i class="iconfont icon-yixiangche"></i>            
        </div>
        <div class="titletext w">
            <p class="car-name">{{item.carName}}</p>
            <p><span>颜色: &ensp;</span> {{item.colour}}</p>
            <p><span>内饰：&ensp;</span> {{item.interior}}</p>
        </div>
    </div>
</div>
</template>
<script>
    import config from 'common/config'
    import {mapMutations, mapGetters} from 'vuex'
    const SC_POST_TYPE_CODE = config.root.scPostTypeCode
    const SM_POST_TYPE_CODE = config.root.smPostTypeCode
    export default {
        data() {
            return {
                isSc: false
            }
        },
        computed: {
            ...mapGetters('customer', [
                'getCusLeadInfo',
                "getLoginInfo"
            ])
        },
        methods: {
            root() {
                const postnTypes = new Set(this.getLoginInfo.postnTypes)
                if(postnTypes.has(SC_POST_TYPE_CODE)) {              
                    this.isSc = true             
                }else if(postnTypes.has(SM_POST_TYPE_CODE)) {
                    this.isSc = false
                }
            },
            name(item) {
                // const _name = `${item.brandName} ${item.seriesName} ${item.modelName}`
                // return item.carName ? `${_name} ${item.displayName}` : `${_name}` 

                const joinCarName = `${item.brandName || ''} ${item.seriesName || ''} 
                                     ${item.modelName || ''} ${item.displayName || ''}`
                return joinCarName
            },
            // 跳转到新增意向车页面
            addCar() {
                if(!this.isSc) {
                    return
                }
                let obj = {
                    leadCode: this.getCusLeadInfo.leadCode,
                    brandCode: this.getCusLeadInfo.brandCode,
                    intentionLevelCode: this.getCusLeadInfo.intentionLevelCode
                }
                this.setIntentionCarInfo(obj)
                this.setIsInsert(true)
                this.$router.push({
                    path: '/addlikevehicle'
                })
            },
            // 跳转到订单前一页
            itemClick(i) {
                if(!this.isSc) {
                    return
                }
                this.setIsInsert(false)                
                this.setIntentionCarInfo(this.getCusLeadInfo.intentionCarInfoVos[i])
                this.$router.push({
                    path: '/addlikevehicle'
                })
            },
            ...mapMutations({
                setIntentionCarInfo: 'customer/SET_INTENTION_CAR_INFO',
                setIsInsert: 'customer/SET_IS_INSERT'
            })
        },
        watch: {
            getLoginInfo() {
                this.root()
            }
        }
    }
</script>
<style lang="scss">
    .intentionCarBox {
        padding-left: rem(30);
        border-bottom: 1px solid #F0F2F4;
    }
    .intentionCar {
        position: relative;
        box-sizing: border-box;
        height: rem(81);
        padding: rem(22) rem(63) rem(21) rem(0);
        display: table;
    }
    .intentionCar > span {
        display: table-cell;
        height: rem(37);
        color: #333;
        font-size: rem(26)
    }
    .intentionCar > i {
        font-size: rem(26);
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: rem(10);
        color: #CBC7C2;
        margin-right: remp(5);
    }
    .intentionCarList {
        position: relative;
        box-sizing: border-box;
        padding: rem(18) rem(0) rem(18) rem(132);
        height: rem(110);
        display: table;
        border-bottom: 1px solid #F0F2F4;
    }
    .intentionCarList:last-child {
        border-bottom: none;
    }
    .intentionCarList > div:first-child {
        position: absolute;
        display: table-cell;
    }
    .intentionCarList > div:last-child {
        display: table-cell;
        width: 100%;
    }
    .imge {
        top: rem(18);
        left: rem(0);
        width: remp(55);
        height: remp(36.8);
        background-color: #D2EDF3;
        text-align: center;
        line-height: remp(36.8);
        i {
            color: #fff;
            font-size: remp(14)
        }
    }
    .titletext > p:first-child {
        // width: 100%;
        height: rem(33);
        font-size: rem(24);
        color:#343535; 
        margin-bottom: rem(8);
    }
    .titletext > p:nth-child(2) {
        display: table-cell;
        width: 10%;
        height: rem(33);
        font-size: rem(24);
        color:#52524F;
        
    }
    .titletext > p:last-child {
        display: table-cell;
        width: 10%;
        height: rem(33);
        font-size: rem(24);
        color:#52524F;  
    }

    .car-name {
        overflow: hidden; 
        text-overflow: ellipsis; 
        -o-text-overflow: ellipsis;
        white-space:nowrap;
        width:remp(280);
    }
</style>