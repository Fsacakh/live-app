<template>
    <div class="car-info-item">
       <div class="car-info-title">
           {{ carInfo.logisticsStatus == 1 ? '在途': (carInfo.logisticsStatus == 2 ?  '在库': '') }} . {{ carInfo.lockStatus == 1  ? '锁定': '可售' }}
           <i v-if="carInfo.isDeceitedCar" class="iconfont icon-qizilanse"></i>
       </div>
       <div class="car-info-content">
           <span class="car-model">{{ carInfo | carName }}</span>
           <p class="hr"/>
           <div class="w flex vinNo">
               <div class="w50">
                   <label class="label">车架号:</label>
                   <p>{{ carInfo.carVinNo }}</p>
               </div>
               <div class="w50">
                   <label class="label">MSRP:</label>
                   <p :class="{ 'red': carInfo.lockStatus != 1 }">¥{{ carInfo.actualMSRPInclusiveTax }}</p>
               </div>
           </div> 
           <p class="hr"/>
           <div class="w flex">
               <div class="w50">
                   <label class="label">外观:</label>
                   <p>{{ carInfo.carAppertanceName }}</p> 
               </div>
               <div class="w50">
                   <label class="label">内饰:</label>
                   <p>{{ carInfo.carInteriorName }}</p>
               </div>
           </div>
           <p class="hr"/>
           <div class="w">
               <label class="label">库龄:</label>
               {{ carInfo[carInfo.refDetailValue] != null ? carInfo[carInfo.refDetailValue] + '天': 'null' }} 
           </div>
           <p class="hr"/>
           <div class="w">
               <label class="label">原厂加配:</label>
               {{ carInfo.originalAddition }}
           </div>

       </div>
    </div>
</template>

<script>
    export default {
        name: 'car-info-item',
        props: {
            carInfo: {
                type: Object,
                default () {
                    return {
                       logisticsStatus: 2,
                       status: '可售',
                       skuName: 'C180K',
                    }
                }
            }
        },
        data: function() {
            return {
            }
        },
        methods: {

        },
        components: {

        }
    }
</script>

<style lang="scss" scoped>
    .car-info-item {
        display: flex;
        flex-direction: column;
        background-color: rgb(255, 255, 255);
        margin-bottom: rem(20);
        padding-bottom: rem(17);
        border-radius: rem(5);
        box-shadow: inset 0 rem(2) rem(4) 0 rgba(155,155,155,0.50);
    }
    .car-info-item >.car-info-title {
        padding: remp(5) remp(20) !important;
        font-family: PingFangSC-Regular;
        font-size: remp(14);
        color: #7E8387;
    }
    .car-info-item >.car-info-title>.iconfont {
        margin-left: remp(10);
        color: #008cee;
    }
    .car-info-item >.car-info-content {
        background-color: $browser-default-color-white;
        padding: remp(5) remp(20) !important;
        font-family: PingFangSC-Regular;
        font-size: remp(14);
        color: #333333;
        .red {
            color: rgba(254, 56, 36, 0.9) !important;
        }
        &.locked {
            color: #7e8387 !important;
        }
    }
    .car-info-item >.car-info-content >.car-model {
        font-family:  PingFangSC-Semibold;;
        font-size: rem(28) !important;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: keep-all; 
        white-space: nowrap;
        display: inline-block;
    }
    .car-info-item >.car-info-content>.vinNo{
        display: flex;
    }
    .car-info-item >.car-info-content>.vinNo>div:first-child{
        flex: 1.6;
    }
    .car-info-item >.car-info-content>.vinNo>div:last-child{
        flex: 1;
    }
    .hr {
        height: remp(1);
        background-color: #F0F2F5;
        margin-top: remp(5);
        margin-bottom: remp(5);
    }
    .label {
        font-family: PingFangSC-Regular;
        font-size: remp(14);
        color: #7E8387;
        margin-top: remp(5);
    }
</style>
