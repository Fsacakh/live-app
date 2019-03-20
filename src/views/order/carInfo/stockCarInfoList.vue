<template>
    <div class="page">
        <page-header :rightOptions="rightOptions" :leftOptions="{preventGoBack:true,showBack:true,icon:''}" @on-click-back="back"  @on-click-right="goSearch">
            <div slot>车辆信息</div>
        </page-header>
        <div class="list-box" v-show="stockCarInfoList.length > 0">
            <!-- 车辆信息头部 -->
            <div>
              <div class="carHeaderInfo">
                <div class="leftCarInfo" @click="testClick()">
                  {{ carInfo.displayName }}
                </div>
                <div class="rightCarUnit">
                  <span class="rightCarNum">{{ pager.total }}</span>
                  <span>台</span>
                </div>
              </div>
            </div>
            <scroll class="list" :pullup="true" :data="stockCarInfoList" @scrollToEnd="dropdown">
                <div class="box">
                    <car-stock-info-item v-for="(item, index) in stockCarInfoList" :carStockInfo="item" :key="index" @click.native="selectCarInfoItem(index)">
                    </car-stock-info-item>
                    <p class="loading-text">{{ showText }}</p>
                </div>
            </scroll>
        </div>
        <div class="no-data-box" v-show="!stockCarInfoList.length && loadingNoData">
            <no-data title="暂无数据"></no-data>
        </div>
        <div class="loading-container">
            <loading v-show="!stockCarInfoList.length && !loadingNoData"></loading>
        </div>
    </div>
</template>

<script>
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
    import config from '../../../common/config'
    import pageHeader from '@/components/header/PageHeader'
    import Loading from '@/components/loading/loading'
    import Scroll from '@/components/scroll/scroll'
    import NoData from 'components/no-data/no-data'
    import carStockInfoItem from '@/components/carStockInfoItem'
    export default {
        mounted() {
            let _this = this
            _this.getSkuInfoList({
                pageNums: config.pageNums,
                pageStart: 1
            })
        },
        destroyed() {
            let _this = this
            _this.resetStockCarInfoList()
            _this.enableSelectCarInfo()
        },
        data: function() {
            return {
                stockInfoList: [{
                        locked: false,
                        status: '可售',
                        carModel: 'C180K'
                    },
                    {
                        locked: true,
                        status: '锁定',
                        carModel: 'C180K'
                    },
                    {
                        locked: false,
                        status: '可售',
                        carModel: 'C180K'
                    }
                ],
                rightOptions: {
                    icon: 'icon-icon-shaixuan'
                },
                showText: '',
                isCanPull:true
            }
        },
        computed: {
            ...mapState('carInfo', [
                'loadingNoData',
                'carInfo',
                'loadingShow',
                'showBandAndSeries',
                'stockCarInfoList',
                'enableSelectCar',
                'pager'
            ]),
            ...mapState('order', [
                'order'
            ])
        },
        methods: {
            testClick() {
              console.log(this.carInfo,11)
            },
            back(data){
                if (data == 'homepage') {
                    this.$router.replace('/searchCar/homepage');
                } else {
                    this.$router ? this.$router.back() : window.history.back()
                }
            },
            goSearch: function() {
                let _this = this
                if (_this.enableSelectCar) {
                   _this.$router.push('/searchCar/stockCarInfoList')
                } else if (!_this.showBandAndSeries) {
                   _this.$router.push('/searchCar/inventory')
                } else {
                   _this.$router.replace('/searchCar/homepage')
                }
            },
            selectCarInfoItem: function(index) {
                let _this = this
                let item = _this.stockCarInfoList[index]
                if (_this.enableSelectCar && item.lockStatus != 1) {
                    _this.selectCarInfo(index)
                    if (_this.order.orderNo == undefined || _this.order.orderNo == null || _this.order.orderNo == '') {
                        _this.$router.go(-1)
                    } else {
                        _this.$router.go(-1)
                    }
                }
            },
            dropdown: function() {
                let _this = this
                if (_this.pager.pageNo < _this.pager.totalPages && _this.isCanPull) {
                    _this.isCanPull = false;
                    _this.getSkuInfoList({
                        pageNums: config.pageNums,
                        pageStart: _this.pager.pageNo + 1,
                        callback:function(){
                             _this.isCanPull = true;
                        }
                    })
                } else {
                    _this.$data.showText = config.text.noMoreData
                    _this.$refs.scroll.dropDownValue = '';
                }
            },
            ...mapActions('carInfo', [
                'getSkuInfoList',
                'selectCarInfo',
                'enableSelectCarInfo',
                'resetStockCarInfoList'
            ])
        },
        components: {
            NoData,
            Scroll,
            Loading,
            pageHeader,
            carStockInfoItem,
        }
    }
</script>
<style lang="scss" scoped>
.carHeaderInfo {
  flex-direction: column;
  background-color: rgb(255, 255, 255);
  margin-left: rem(20);
  margin-right: rem(20);
  margin-bottom: rem(12);
  padding: 0.04rem 0.04rem;
  height: remp(36);
  line-height: remp(36);
  border-radius: rem(5);
  margin-top: rem(20);
  box-shadow: inset 0 rem(2) rem(4) 0 rgba(155,155,155,0.50);
  .leftCarInfo {
    width: 80%;
    white-space: nowrap;
    float: left;
    overflow: hidden;
    overflow-x: scroll;
    margin-left: remp(10);
    border-right: 1px solid #f2f2f2;
    box-sizing: border-box;
  }
  .rightCarUnit {
    width: 14%;
    float: right;
    text-align: center;
    .rightCarNum {
      color: #008CEE;
    }
  }
}
.list-box {
    position: fixed;
    -webkit-transform: translateZ(0);
    top: remp(47);
    width: 3.75rem;
    bottom: 0;
    .list {
        margin-top: rem(20);
        width: 100%;
        height: 100%;
        background-color: rgb(245, 245, 249);
        overflow: hidden;
    }
}
.no-data-box {
    margin-top: 50%;
}
.loading-text {
    text-align: center;
    padding: remp(10) 0;
    color: #817F79;
}
.loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
}
.page .header-right .icon-icon-shaixuan{
    font-size: rem(20);
}
</style>
