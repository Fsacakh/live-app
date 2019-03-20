<template>
    <div class="gain-detial">
        <page-header>
            <div slot>盈收</div>
        </page-header>
        <div class="gainDetial b-white" @click="showPicker">
            {{dateMage}}
            &nbsp;<img src="../../../assets/imgage/down.png">
        </div>
        <v-query @data-change="queryData" :storeCode='query.storeCode' :storeName="storeName" :isShowIcon="false"></v-query>
        <div class="gain-content">
            <div class="gain-table">
                <div class="table-title">
                    <div class="norm" @click="getGpConfig">指标</div>
                    <div class="actual">实际值</div>
                    <div class="bench">对标值</div>
                    <div class="ranking">排名</div>
                </div>
                <div class="table-body" v-for="(item, index) in gainList" :key="index">
                    <div class="norm">{{item.norm}}</div>
                    <div class="actual">{{item.actual}}</div>
                    <div class="bench">{{item.bench}}</div>
                    <div class="ranking">{{item.ranking}}</div>
                </div>
            </div>
        </div>
        <mt-datetime-picker
            ref="gainDetial"
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
import { mapState } from 'vuex'
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
    computed: {
        ...mapState('databoard', [
            'time'
        ])
    },
    data: function() {
        return {
            gpConfig: [],
            pickerVisible: new Date(),
            carSeriesCode: '',
            dateMage: '',
            gainList: [],
            storeName: this.$route.query.storeName,
            query: {
                carBrandCode: '',
                scCode: '',
                storeCode: this.$route.query.storeCode,
                salesYear: '',
                salesMonth: '',
            },

        }
    },
    created() {
        
        //要求将数据看板中头部选择的日期带入,该改动对应BUG IRIS-7737
        this.dateMage = this.time.startDate.split('/')[0] + '/' + this.time.startDate.split('/')[1];
        //this.query.salesYear = this.dateMage[0];
        //this.query.salesMonth = this.dateMage[1];
        console.log(this.dateMage);
        //以下为老逻辑
        //this.dateMage = this.$route.query.time
        this.query.salesYear = this.dateMage.slice(0, 4)
        this.query.salesMonth = this.dateMage.slice(5, 7)
    },
    watch: {
        query: {
            handler(val) {
                if (this.query.storeCode) {
                    this.getGpConfig(this.query)
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
            this.$refs.gainDetial.open()
        },
        handleConfirm: function() {
            this.dateMage = common.eleTimeFormatim1(this.pickerVisible).slice(0, 7)
            this.query.salesYear = this.dateMage.slice(0, 4)
            this.query.salesMonth = this.dateMage.slice(5, 7)
            this.getGpConfig(this.query)
        },
        getGpConfig: function(val) {
            //GpConverType
            api.ref.getDataDictionary({refCode: 'GpConverType'}, res => {
                if(res.data.code === 'success') {
                    this.gpConfig = []
                    let gprate = []
                    res.data.obj.referenceDetailInfos.forEach((item, index) => {
                        gprate.push(item.refDetailName)
                        this.gpConfig.push(item.refDetailName+'%')
                    })
                    gprate.forEach(item => {
                        this.gpConfig.push(item)
                    })
                    this.queryGainDetial(val)
                }
            })
            this.queryGainDetial(this.query)

        },
        queryGainDetial: function(val) {
            api.board.queryGainDetial(val, res => {
                if(res.data.code == 'success') {
                    let gpdata = {}
                    this.gpConfig.forEach((item, index) => {
                        gpdata[item] = {norm: item}
                    })
                    this.gainList = []
                    let data = res.data.obj ? res.data.obj : []
                    if(res.data.obj) {
                        data.forEach((item, index) => {
                            for(let i in gpdata) {
                                if(item.gp_code==i) {
                                    gpdata[i].norm = i; 
                                    gpdata[i].actual = i.substring(i.length-1) == '%'
                                                        ?(item.gp_value_avg*100).toFixed(1) + '%' 
                                                        : item.gp_value_avg.toFixed(1);
                                    gpdata[i].bench = i.substring(i.length-1) == '%'
                                                        ?(item.gp_target_avg*100).toFixed(1) + '%' 
                                                        : item.gp_target_avg.toFixed(1);
                                    gpdata[i].ranking = item.store_rank
                                } 
                            }
                            
                        });
                    } else {
                        this.gpConfig.forEach((item, index) => {
                            gpdata[item].norm = item; 
                            gpdata[item].actual = '-';
                            gpdata[item].bench = '-';
                            gpdata[item].ranking = '-'
                        })
                    }
                    for(let i in gpdata) {
                        this.gainList.push(gpdata[i])
                    }
                }
            })
        }
    }
}
</script>

<style lang="scss">
.gain-detial {
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
    .gain-content {
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
            .gain-store {
                width: remp(177);
            }
            .gain-sc {
                width: remp(108);
            }
            .gain-brand {
                width: remp(177);
            }
            .gain-benchmarking {
                width: remp(108);
            }
        }
        .gain-table {
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
.gainDetial {
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
