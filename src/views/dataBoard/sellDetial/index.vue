<template>
    <div class="sell-detial">
        <page-header>
            <div slot>销售数据</div>
        </page-header>
        <div class="sellDetial b-white" @click="showPicker">
            {{dateMage}}
            &nbsp;<img src="../../../assets/imgage/down.png">
        </div>
        <v-query @data-change="queryData" :storeCode='query.storeCode' :storeName="storeName" :isShowIcon="false"></v-query>
        <div class="sell-content">
            <div class="sell-table">
                <div class="table-title">
                    <div class="norm">指标</div>
                    <div class="actual">实际值</div>
                    <div class="bench">对标值</div>
                    <div class="ranking">排名</div>
                </div>
                <div class="table-body" v-for="(item, index) in sellDetialList" :key="index">
                    <div class="norm">{{salesType[item.salesType]}}</div>
                    <div class="actual">
                        {{
                            item.salesType=='2'||item.salesType=='3'||item.salesType=='4'||item.salesType=='5'||item.salesType=='6'||item.salesType=='7'
                            ? (item.actualInfo == null ? 0.0 : item.actualInfo)
                            : (item.actualInfo == null ? 0.0 + '%' : (Number(item.actualInfo)*100).toFixed(1) + '%')
                        }}
                    </div>
                    <div class="bench">
                        {{
                            item.salesType=='2'||item.salesType=='3'||item.salesType=='4'||item.salesType=='5'||item.salesType=='6'||item.salesType=='7'
                            ? (item.benchmarkInfo == null ? 0.0 : Number(item.benchmarkInfo).toFixed(1))
                            : (item.benchmarkInfo == null ? 0.0 + '%' : (Number(item.benchmarkInfo)*100).toFixed(1) + '%')
                        }}
                    </div>
                    <div class="ranking">{{item.rankingInfo}}</div>
                </div>
            </div>
        </div>
        <mt-datetime-picker
            ref="sellDetial"
            v-model="pickerVisible"
            type="date"
            year-format="{value} 年"
            month-format="{value} 月"
            @confirm="handleConfirm"
            >
        </mt-datetime-picker>
    </div>
</template>

<script>
import Vue from 'vue'
import { DatetimePicker } from 'mint-ui'
import common from 'common/common'
import api from 'common/api'
import pageHeader from '@/components/header/PageHeader'
import VQuery from '@/components/dataReportFilter'

Vue.component(DatetimePicker.name, DatetimePicker)

export default {
    components: {
        pageHeader,
        VQuery
    },
    data: function() {
        return {
            pickerVisible: new Date(),
            dateMage: '',
            salesType: {
                '0': '厂家目标完成率',
                '1': '集团目标完成率',
                '2': '进店线索数',
                '3': '本月新增订单数',
                '4': '订单审批数',
                '5': '新增开票数',
                '6': '退票数',
                '7': '交车数',
                '8': '进店线索订单率',
                '9': '订单开票率',
                '10': '本地上牌率',
                '11': '金融渗透率',
                '12': '保险渗透率',
                '13': '延保渗透率',
                '14': '精品渗透率',
            },
            sellDetialList: [],
            storeName: this.$route.query.storeName,
            query: {
                carBrandCode: '',
                carSeriesCode: '',
                scCode: '',
                storeCode: this.$route.query.storeCode,
                yearStr: '',
                monthStr: '',
            }
        }
    },
    created() {
        this.dateMage = this.$route.query.time
        this.query.yearStr = this.dateMage.slice(0, 4)
        this.query.monthStr = this.dateMage.slice(5, 7)
    },
    watch: {
        query: {
            handler(val) {
                if (this.query.storeCode) {
                    this.querySellDetial(this.query)
                }
            },
            deep: true
        }
    },
    methods: {
        queryData: function(val) {
            this.query.scCode = val.scCode
            this.query.carBrandCode = val.carBrandCode
            this.query.carSeriesCode = val.carSeriesCode
        },
        showPicker: function() {
            this.$refs.sellDetial.open()
        },
        handleConfirm: function() {
            this.dateMage = common.eleTimeFormatim1(this.pickerVisible).slice(0, 7)
            this.query.yearStr = this.dateMage.slice(0, 4)
            this.query.monthStr = this.dateMage.slice(5, 7)
            this.querySellDetial(this.query)
        },
        querySellDetial: function(val) {
            api.board.querySellDetial(val, res => {
                 if(res.data.code == "success") {
                     this.sellDetialList = res.data.obj
                     console.log(this.sellDetialList)
                 }
             })
        },
    }
}
</script>

<style lang="scss">
.sell-detial {
    // background: #F7F7F7;
    .mint-popup {
        .picker {
            .picker-items {
                .picker-slot:nth-child(3) {
                    display: none !important;
                }
            }
        }
    }
    .sell-content {
        padding: 0 remp(20);
        padding-top: remp(10);
        .queryDetial {
            width: remp(335);
            display: -webkit-flex; /* Safari */
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            div {
                padding: 0 remp(10);
                margin-bottom: remp(10);
                height: remp(40);
                line-height: remp(40);
                border-radius: remp(4);
                color: #7E8387;
                font-size: remp(14);
                display: -webkit-flex; /* Safari */
                display: flex;
                justify-content: space-between;
                align-items: center;
                img {
                    width: remp(8);
                    height: remp(5);
                }
            }
            .sell-store {
                width: remp(177);
            }
            .sell-sc {
                width: remp(108);
            }
            .sell-brand {
                width: remp(177);
            }
            .sell-benchmarking {
                width: remp(108);
            }
        }
        .sell-table {
            margin-top: remp(10); 
            .table-title {
                width: remp(335);
                height: remp(50);
                border-bottom: remp(1) solid #d5d5de;
                background-color: #f7f7f7;
                display: -webkit-flex;
                display: flex;
                div {
                    height: remp(50);
                    color: #333;
                    font-size: remp(14);
                    display: -webkit-flex;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 1
                }
                .norm {
                    flex: 2
                }
            }
            .table-body {
                width: remp(335);
                height: remp(40);
                border-bottom: remp(1) solid #d5d5de;
                background-color: #fff;
                display: -webkit-flex;
                display: flex;
                div {
                    height: remp(40);
                    color: #333;
                    font-size: remp(12);
                    display: -webkit-flex;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex: 1
                }
                .norm {
                    flex: 2
                }
            }
        }
    }
}
.sellDetial {
    height: remp(50);
    text-align: center;
    line-height: remp(50);
    font-size: remp(13);
    color: #333;
    img {
        width: remp(10);
        height: remp(6);
    }
}
</style>
