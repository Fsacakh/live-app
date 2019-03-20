<template>
    <div>
      <div class="car-stock-info-item">
        <div class="car-info-title">
            <span class="leftIcon" :class="{ 'locked': carStockInfo.lockStatus == 1 }"></span>
            <div class="stockFlag" :class="{ 'flag-locked': carStockInfo.lockStatus == 1 }" v-if="filter(carStockInfo.skuAddInfoVoList)"></div>
            {{ carStockInfo.logisticsStatus == 1 ? '在途': (carStockInfo.logisticsStatus == 2 ?  '在库': '') }} . {{ carStockInfo.lockStatus == 1  ? '锁定': '可售' }}
            <span class="carVinNo carInfoTitle" v-if="carVinNoShow">车架号: </span>
            <span>{{ carStockInfo.carVinNo.length > 17 ? (carStockInfo.carVinNo.slice(0,17) + '...') : carStockInfo.carVinNo }}</span>
        </div>
        <div class="car-info-content" :class="{ 'locked': carStockInfo.lockStatus == 1 }">
            <span class="car-model">{{ carStockInfo | carName }}</span>
            <div class="w flex">
                <div class="w50">
                    <span class="carInfoTitle">MSRP:</span>
                    <span :class="{ 'red': carStockInfo.lockStatus != 1 }">¥{{ carStockInfo.actualMSRPInclusiveTax }}</span>
                </div>
                <div class="w50">
                  <span class="carInfoTitle">库龄: </span>
                  <span>{{ carStockInfo.inStockCycle ? carStockInfo.inStockCycle + '天' : '' }}</span>
                </div>
            </div>
            <div class="w flex">
                <div class="w50">
                    <span class="carInfoTitle">外观:</span>
                    {{ carStockInfo.carAppertanceName }}
                </div>
                <div class="w50">
                    <span class="carInfoTitle">内饰:</span>
                    {{ carStockInfo.carInteriorName }}
                </div>
            </div>
            <hr style="background: #f2f2f2;height: 1px;border: none;">
            <div class="w">
              <span class="carInfoTitle">仓库：</span>
              {{ carStockInfo.whName }}
            </div>
            <div class="w">
                <span class="carInfoTitle">原厂加配:</span>
                {{ carStockInfo.originalAddition }}
            </div>
            <div v-if="carStockInfo.isPreinstalled === 1" class="w">
                <span class="carInfoTitle">门店加配:</span>
                {{ preinstalledCarDetailListFilter(carStockInfo) }}
            </div>
        </div>
      </div>
    </div>
</template>

<script>
import { getRefDetail } from '@/common/com-api';
    export default {
        name: 'car-stock-info-item',
        props: {
            carStockInfo: {
                type: Object,
                default () {
                    return {
                       locked: false,
                       status: '可售',
                       skuName: 'C180K'
                    }
                }
            },
            inStockSource: String
        },
        data() {
            return {
                //预装配件
                preinstalledCarDetail:'',
                carVinNoShow: true //用于判断是否显示车架号
            }
        },
        mounted(){
            //判断当前的用户是哪个集团，科达集团: 000001
            getRefDetail('SystemRelationGroup', (res) => {
                if(res.refDetailValue === '000001'){
                    this.carVinNoShow = false;
                }
            });
        },
        methods: {
            //获取当前的集团
            kuling: function(val) {
                let value;
                if (val.inStockSourceInvoiceBusinessCycle) {
                    value
                }
            },
            filter: function(val) {
                let status = false
                for(let i = 0, len =val.length; i<len; i++) {
                    if(val[i].addCode == 'deceitCarAddCode') {
                        status = true
                    }
                }
                return status
            },
            preinstalledCarDetailListFilter(data){
                if(data.isPreinstalled === 1){
                    let text = '';
                    if(data.preinstalledCarDetailList.length > 0){
                        for(let i = 0; i < data.preinstalledCarDetailList.length; i++){
                            text += data.preinstalledCarDetailList[i].skuName;
                        }
                    }
                    return text;
                }
            }
        },
        components: {

        }
    }
</script>

<style lang="scss" scoped>
.car-stock-info-item {
    display: flex;
    flex-direction: column;
    background-color: rgb(255, 255, 255);
    margin-left: rem(20);
    margin-right: rem(20);
    margin-bottom: rem(20);
    padding-bottom: rem(17);
    border-radius: rem(5);
    box-shadow: inset 0 rem(2) rem(4) 0 rgba(155,155,155,0.50);
    color: #333333;
}
.carInfoTitle {
  color: #7E8387;
}
.car-stock-info-item >.car-info-title {
    height: remp(40);
    line-height: remp(40);
    font-size: rem(26);
    text-align: left;
    padding-left: rem(18);
    position: relative;
    border: 1px solid #f2f2f2;
    .stockFlag {
        width: remp(22);
        height: remp(18);
        position: absolute;
        top: remp(12);
        left: remp(86);
        background-image: url(../../assets/imgage/shapeIcon.png);
        background-size: remp(20) remp(26.9);
        background-position: 50% 50%;
        background-repeat: no-repeat;
    }
    .leftIcon {
      position: absolute;
      top: remp(7);
      left: 0;
      display: inline-block;
      width: remp(5);
      height: 60%;
      background: linear-gradient(-180deg, #008cee 0%, #36acfe 100%);
    }
    .locked {
      background: #7e8387 !important;
    }
    .flag-locked {
       background-image: url(../../assets/imgage/grayShapeIcon.png);
    }
    .carVinNo {
      margin-left: remp(60);
    }
}
.car-stock-info-item >.car-info-content {
    background-color: $browser-default-color-white;
    padding: rem(16) rem(10) rem(17) rem(10) !important;
    font-family: PingFangSC-Regular;
    font-size: rem(24);
    color: #333333;
    .red {
        color: rgba(254, 56, 36, 0.9) !important;
    }
    &.locked {
        color: #7e8387 !important;
    }
}
.car-stock-info-item >.car-info-content >.car-model {
    font-family: Helvetica-Bold !important;
    font-size: rem(28) !important;
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    word-break: keep-all;
    white-space: nowrap;
    display: inline-block;
}
</style>
