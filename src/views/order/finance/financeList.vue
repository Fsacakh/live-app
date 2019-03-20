<template>
    <div class="page">
        <page-header>
            <div slot>热销方案</div>
        </page-header>
        <data-filter :bar-menus="menus" @changeMainItem="searchFinanceDetail"></data-filter>
        <div class="list-box" v-show="financeProDetailInfoList.length > 0">
            <scroll class="list" :pullup="true" :data="financeProDetailInfoList" @scrollToEnd="dropdown">
               <div class="box"> 
                  <finance-item v-for="financeProDetailInfo in financeProDetailInfoList" :key="financeProDetailInfo.financeCode" :financeInfo="financeProDetailInfo" @show-detail="showDetail"></finance-item>
                  <p class="loading-text">{{ showText }}</p>
               </div>
            </scroll>
        </div>
        <div class="no-data-box" v-show="!financeProDetailInfoList.length && loadingNoData">
            <no-data title="暂无数据"></no-data>
        </div>
        <div v-show="!financeProDetailInfoList.length && !loadingNoData" class="loading-container">
            <loading></loading>
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
    import dataFilter from '@/components/dataFilter'
    import financeItem from '@/components/financeItem'
    import Loading from '@/components/loading/loading'
    import Scroll from '@/components/scroll/scroll'
    import NoData from '@/components/no-data/no-data'
    export default {
        mounted() {
            let _this = this
            _this.getFinanceTypes({
                hasAll: true,
                callback: (detailList) => {
                    _this.$data.menus[0].tabs[0].detailList = detailList
                }
            })
            _this.getAuthorizationOrgs({
                hasAll: true,
                callback: (detailList) => {
                    _this.$data.menus[1].tabs[0].detailList = detailList
                }
            })
            _this.resetFinanceProList()
            _this.searchFinanceDetail({
                v: {
                    value: ''
                }
            })
        },
        data: function() {
            return {
                menus: [{
                    name: '产品类型',
                    icon: '',
                    value: '',
                    showTabHeader: false,
                    defaultIcon: '',
                    selectIcon: '',
                    selectIndex: -1,
                    tabs: [{
                        icon: '',
                        name: '',
                        selectIndex: -1,
                        detailList: []
                    }]
                },
                {
                    name: '金融机构',
                    icon: '',
                    value: '',
                    showTabHeader: false,
                    defaultIcon: '',
                    selectIcon: '',
                    selectIndex: -1,
                    tabs: [{
                        icon: '',
                        name: '',
                        selectIndex: -1,
                        detailList: []
                    }]
                }],
                finacePro: {
                    factoryCode: '',
                    brandCode: '',
                    seriesCode: '',
                    modelCode: '',
                    carCode: '',
                    financeType: '',
                    financeOrgCode: '',
                    pageNums: config.pageNums,
                    pageStart: 1 
                },
                showText: ''
            }
        },
        computed: {
           ...mapState('financePro', [
               'financeProDetailInfoList',
               'pager',
               'loadingShow',
               'loadingNoData'
           ]),
           ...mapState('order', [
               'order'
           ])
        },
        methods: {
            searchFinanceDetail: function(item) {
                let _this = this
                let carOrderInfoVoList = _this.order.carOrderInfoVoList
                if (carOrderInfoVoList.length > 0) {
                    if (carOrderInfoVoList[0].carOrderDetailInfoList.length > 0) {
                       _this.$data.finacePro.factoryCode = carOrderInfoVoList[0].carOrderDetailInfoList[0].carFactoryCode  
                       _this.$data.finacePro.brandCode = carOrderInfoVoList[0].carOrderDetailInfoList[0].carBrandCode
                       _this.$data.finacePro.seriesCode = carOrderInfoVoList[0].carOrderDetailInfoList[0].carSeriesCode
                       _this.$data.finacePro.modelCode = carOrderInfoVoList[0].carOrderDetailInfoList[0].carModelCode
                       _this.$data.finacePro.carCode = carOrderInfoVoList[0].carOrderDetailInfoList[0].carCode
                    }
                }
                if (item.i == 0) {
                   _this.$data.finacePro.financeType = item.v.value
                } else if (item.i == 1) {
                   _this.$data.finacePro.financeOrgCode = item.v.value
                }
                _this.resetFinanceProList()
                _this.getFinanceProList(_this.$data.finacePro)
            },
            showDetail: function(financeDetailCode) {
                let _this = this
                _this.setFinanceDetailCode(financeDetailCode)
                _this.$router.go(-1)
            },
            dropdown: function() {
                let _this = this
                if (_this.pager.pageNo < _this.pager.totalPages) {
                    _this.$data.finacePro.pageStart = _this.pager.pageNo + 1
                    _this.getFinanceProList(_this.$data.finacePro)
                } else {
                    _this.$data.showText = config.text.noMoreData
                }
            },    
            ...mapActions('financePro', [
                'getFinanceTypes',
                'getFinanceProList',
                'getAuthorizationOrgs',
                'resetFinanceProList',
                'setFinanceDetailCode'  
            ])
        },
        components: {
            pageHeader,
            dataFilter,
            financeItem,
            Loading,
            Scroll,
            NoData
        }
    }
</script>
<style lang="scss" scoped>
    .list-box {
        position: fixed;
        -webkit-transform: translateZ(0);
        top: remp(88);
        width: 3.75rem;
        bottom: 0;
        .list {
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
</style>