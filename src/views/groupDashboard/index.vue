<template>
    <div ref="groupDsahboard" class="groupDsahboard">
        <div class="fixedHeight">
            <page-header ref="header" @on-click-left="goback">
                <p slot="left" style="padding-top: 3px; "></p>
                <div slot class="isStore" style="width: 320px; text-align: center; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{storeName}}</div>
            </page-header>
            <!-- tab栏 -->
            <div class="board-tabs b-white">
                <div class="board-item w33" @click="selectTab(0)" :class="{'active': (tabActiveIndex == 0) }">
                    整车库存
                </div>
                <div class="board-item w33" @click="selectTab(1)" :class="{'active': (tabActiveIndex == 1) }">
                    运营报表
                </div>
                <div class="board-item w33" @click="selectTab(2)" :class="{'active': (tabActiveIndex == 2) }">
                    利润报表
                </div>
            </div>
            <!-- 时间筛选 -->
            <div v-show="tabActiveIndex == 0" class="board-time b-white">
                <span>
                    {{ dateMage }}
                </span>
            </div>
            <div v-show="tabActiveIndex == 1 || tabActiveIndex == 2" class="board-time b-white">
                <span class="DataPicker" @click="showPopUp('time')">
                    {{ selectDate }}
                </span>
                <span class="selectData">
                    <span @click="clickDataTab('MTD')" :class="{'active':(clickIndex == 'MTD')}">MTD</span>
                    <span @click="clickDataTab('DTH')" :class="{'active':(clickIndex == 'DTH')}">DTH</span>
                    <span @click="clickDataTab('YTD')" :class="{'active':(clickIndex == 'YTD')}">YTD</span>
                </span>
            </div>
        
            <!-- 搜选框 -->

            <div class="data-report-filte" v-if="true">
                <div class="w flex" style="height:100%">
                    <div class="input-l" @click="showPopUp('brand')">
                        <span class="title">{{ brandName }}</span>
                        <span class="toBottom"></span>
                    </div>
                    <div class="input-s" @click="showPopUp('area')">
                        <span class="title">{{ areaName }}</span>
                        <span class="toBottom"></span>
                    </div>
                </div>
            </div>
        </div>
        <div v-show="tabActiveIndex == 0">
            <tables :tableHeight="tableHeight" :tableData="inventoryData"></tables>
        </div>
        <div v-show="tabActiveIndex == 1">
            <funnelTab :tableHeight="tableHeight" :tableData="FunnelData"></funnelTab>
        </div>
        <div v-show="tabActiveIndex == 2">
            <grossMargin :tableHeight="tableHeight" :tableData="tableData" :selectHeader="selectHeader" ></grossMargin>
        </div>
        <!-- 一下部分为公共模块 -->
        <van-popup v-model="popupPickerShow" position="bottom">
            <van-datetime-picker v-if="(showPopUpType == 'time') && (clickIndex == 'MTD')" v-model="currentDate"  @confirm="setYearMonth" @cancel="closePopup" type="year-month" :formatter="formatter" />
            <van-datetime-picker v-if="(showPopUpType == 'time') && (clickIndex == 'DTH')" v-model="currentDate"  @confirm="setYearMonth" @cancel="closePopup" type="date" :formatter="formatter" />
            <van-picker v-if="(showPopUpType == 'time') && (clickIndex == 'YTD')" show-toolbar :columns="columns3"  @confirm="setYearMonth" @cancel="closePopup" />

            <!-- <Day v-if="popupContentType === 'day'" :yearMonth="headYearMonth" @onConfirm="setDay" @onCancel="closePopup"></Day> -->
            <van-picker v-if="showPopUpType === 'brand'" show-toolbar :columns="columns1" @cancel="closePopup" @confirm="setSearchBrand"/>
            <van-picker v-if="showPopUpType === 'area'" show-toolbar :columns="columns2" @cancel="closePopup" @confirm="setSearchArea"/>
        </van-popup>
    </div>
</template>
<script>
import Vue from 'vue'
import common from 'common/common'
import config from 'common/config'
import api from '@/common/api.js'
import { Popup, DatetimePicker, Picker } from 'vant';

import pageHeader from '@/components/header/PageHeader'
import tables from './Vehicleinventory'
import funnelTab from './funnelTab'
import grossMargin from './grossMargin'
Vue.use(DatetimePicker).use(Popup).use(Picker);
export default {
    data () {
        return {
            tableHeight: 0,
            userInfoFlag: 0, //依据岗位判断区域是否可选
            storeName: '集团数据看板',
            dateMage: '', //时间选择
            selectDate: '',
            popupPickerShow: false, //单天弹层设置
            tabActiveIndex: '',
            clickIndex: 'MTD',
            currentDate: new Date(),
            showPopUpType: '',
            columns1: [],  //品牌
            columns2: [],  //门店集合
            columns3: [],
            areaName: '全区域',
            brandName: '全品牌',
            query: {
                startTime: '',
                endTime: '',
                carBrandCode: '',
                storeCodeSet: []
            },
            inventoryData: [],
            FunnelData: [],
            selectHeader:[],
            tableData:[],
        }
    },
    created(){
        //
        for (let i=0;i<=20;i++) {
            this.columns3.push({
                text: (2009+i) + '年',
                code: (2009+i)
            })
        }
        let time = new Date()
        this.dateMage = time.getFullYear() + '年' + (time.getMonth()+1) + '月' + (time.getDate()).toString().padStart(2, '0') + '日'
        this.selectDate = time.getFullYear() + '年' + (time.getMonth()+1) + '月'
        this.query.startTime = time.getFullYear() + '-' + (time.getMonth()+1) + '-' + '01'
        this.query.endTime = common.eleTimeFormatim3(new Date()).slice(0, 10)
        //获取员工信息
        const promise = new Promise((resolve, reject) =>{
            api.getUserInfo
                .getUserAvailableInfo((res) => {

                    if (res.data.code == 'success') {
                        let obj = res.data.obj.storeInfoVo
                        const userInfo = {}
                        userInfo.storeCode = obj && obj.storeCode
                        userInfo.storeName = obj && obj.storeName
                        this.userInfoFlag = userInfo.flag = res.data.obj.availableType
                        resolve(userInfo)
                    }
                })
        })
        //查询门店所有品牌
        promise.then((data)=>{
            api.car.queryCarInfoByCarSearch({
                code: "",
                level: 2,
                storeCode: data.storeCode
            }, (res) =>{
                if (res.data.code == 'success') {

                    let obj = res.data.obj
                    this.columns1[0]={
                        code: '',
                        text: '全部品牌'
                    }
                    obj.forEach(item =>{
                        this.columns1.push({
                            code: item.brandCode,
                            text: item.brandName
                        })
                    })
                }
            })
            if (data.flag == '0') {
                this.areaName = data.storeName
                this.query.storeCodeSet = [data.storeCode]
            } else {
                var params = {
                    areaCode: config.treeArea
                }
                api.area.getSalesAreaInfoByAreaCode(params, res=>{
                    if (res.data.code == 'success') {
                        this.columns2 = []
                        let obj = res.data.obj.salesAreaSubInfo
                        this.columns2[0] = {
                            text: '全部区域',
                            code: '000001'
                        }
                        obj.forEach(item =>{
                            this.columns2.push({
                            text: item.areaName,
                            code: item.areaCode
                            })
                        })
                    }
                })
            }
            this.queryStockModule()
            this.querySalesGpModule()
            this.queryFunnelInfo()
            this.setTableHeight()
        })
    },
    mounted(){
        //库存查询接口
        
    },
 
    methods:{
        

        //设置页面高度
        setTableHeight(){
            
            this.tableHeight = document.body.clientHeight - 172;
        },

        init () {
            this.queryStockModule()
            this.querySalesGpModule()
            this.queryFunnelInfo()
        },
        //弹框的类型
        showPopUp(type) {
            if (this.userInfoFlag == 0 && type == 'area') {
                this.popupPickerShow = false
                return;
            }
            this.popupPickerShow = true
            this.showPopUpType = type

        },

        setSearchBrand(value) {

            this.brandName = value.text
            this.query.carBrandCode = value.code
            this.popupPickerShow = false
            this.queryStockModule()
            this.queryFunnelInfo()
            this.querySalesGpModule()
        },
        setSearchArea(value) {
            this.onIsAreaChange(value)
            this.areaName = value.text
            this.popupPickerShow = false
            
        },
        //头部返回按钮
        goback(){
            this.$router.back(-1)
        },
        // 根据不同的选择时间类型,传入不同的查询时间

        setYearMonth(value) {
            let currentY = new Date().getFullYear()
            let currentM = new Date().getMonth() + 1
            let currentD = new Date().getDate()
            if (this.clickIndex == 'YTD') {
                if (value.code < currentY) {
                    this.selectDate = value.code + '年'
                    this.query.startTime = value.code + '-' + '01' + '-' + '01'
                    this.query.endTime = value.code+ '-' + '12' + '-' + '31'
                } else {
                    this.selectDate = value.code + '年'
                    this.query.startTime = value.code + '-' + '01' + '-' + '01'
                    this.query.endTime = value.code+ '-' + currentM  + '-' + currentD
                }
            } 
            if (this.clickIndex == 'MTD' || this.clickIndex == 'DTH') {
                this.getTime(this.clickIndex, value)
            }
            
            this.querySalesGpModule()
            this.queryFunnelInfo()
            this.popupPickerShow = false

        },

        closePopup() {
            this.popupPickerShow = false
        },

        getTime(type, val) {
            let time = new Date()
            let selectY = val.getFullYear()
            let selectM = (val.getMonth()+1).toString().padStart(2, '0')
            let selectD = val.getDate().toString().padStart(2, '0')
            let currentY = time.getFullYear()
            let currentM = (time.getMonth()+1).toString().padStart(2, '0')
            let currentD = time.getDate().toString().padStart(2, '0')
            
            if (type == 'MTD') {
                if (selectY < currentY) {
                    this.selectDate = selectY + '年' + selectM + '月'
                    this.query.startTime = selectY + '-' + selectM + '-' + '01'
                    this.query.endTime = selectY+ '-' + selectM + '-' + common.getMonthDays(val)
                } else {

                    this.selectDate = selectY + '年' + selectM + '月'
                    this.query.startTime = selectY + '-' + selectM + '-' + '01'
                    this.query.endTime = selectY+ '-' + selectM + '-' + currentD
                }
            }
            if (type == 'DTH') {
                    this.selectDate = selectY + '年 ' + selectM + '/' + selectD
                    this.query.startTime = selectY + '-' + selectM + '-' + selectD
                    this.query.endTime = selectY + '-' + selectM + '-' + selectD

            }
        },
        //格式化时间
        formatter(type, value) {

            if (type === 'year') {
                return `${value}年`;
            }
             else if (type === 'month') {
                return `${value}月`
            }
            return value;
        },

        //tab栏点击方法
        selectTab(num){
            this.tabActiveIndex = num
        },
        //时间栏方法
        clickDataTab(type){
            this.clickIndex = type
            let time = new Date()
            //月维度
            if (type == 'MTD') {
                this.selectDate = (time.getFullYear() + '年 ' + (time.getMonth() + 1).toString().padStart(2,'0') + '月')
                this.query.startTime = time.getFullYear() +'-' + (time.getMonth() + 1).toString().padStart(2,'0') + '01'
                this.query.endTime = time.getFullYear() + '-' + (time.getMonth() + 1).toString().padStart(2,'0') + time.getDate().toString().padStart(2,'0')
            }
            //天维度
            if (type == 'DTH') {
                this.selectDate = (time.getFullYear() + '年 ' + (time.getMonth() + 1) + '/') + time.getDate()
                this.query.startTime = time.getFullYear() + '-' + (time.getMonth() + 1).toString().padStart(2,'0') + '-' + time.getDate().toString().padStart(2,'0')
                this.query.endTime = time.getFullYear() + '-' + (time.getMonth() + 1).toString().padStart(2,'0') + '-' + time.getDate().toString().padStart(2,'0')
            }
            //年维度
            if (type == 'YTD') {
                this.selectDate = time.getFullYear() + '年'
                this.query.startTime = time.getFullYear() + '-' + '01' + '-' + '01'
                this.query.endTime = (time.getFullYear()) + '-' + (time.getMonth() +1).toString().padStart(2,'0') + '-' + time.getDate().toString().padStart(2,'0')
            }
        },
    
        //依据选择的区域查询该区域所有门店
        onIsAreaChange(data){
            api.area.getShopInfoByAreaCode({
                salesAreaCodes: [data.code],
                needPageFlag: "0"
            }, (res) =>{
                if (res.data.code == 'success') {
                    this.query.storeCodeSet = []
                    let obj = res.data.obj
                    if (obj.length > 0) {
                        obj.forEach(v =>{
                            this.query.storeCodeSet.push(v.storeCode)
                        })
                    } else {
                        this.query.storeCodeSet.push('WMDCD') //虚拟大区无门店为区分查询所有门店
                    }
                }
                this.queryStockModule()
                this.queryFunnelInfo()
                this.querySalesGpModule()
            })
        },

        //库存查询接口
        queryStockModule() {
            let params = {}
            let time = new Date()
            params.carBrandCode = this.query.carBrandCode
            params.storeCodeSet = this.query.storeCodeSet
            params.startTime = time.getFullYear() + '-' + (time.getMonth() +1 ) + '-' + (time.getDate()).toString().padStart(2, '0')
            params.endTime = time.getFullYear() + '-' + (time.getMonth() +1 ) + '-' + (time.getDate()).toString().padStart(2, '0')
            api.groupDashboard.queryStockModule(params, res=>{
                if (res.data.code == 'success' && res.data.obj.length > 0) {
                    this.inventoryData = []
                    const obj = res.data.obj
                    const inventoryTotal = {}
                    inventoryTotal.deceitCarSkuNum = 0
                    inventoryTotal.totalCycleSkuNum = 0
                    inventoryTotal['181dayUpLibraryAgeKpi'] = 0
                    inventoryTotal['91-180dayLibraryAgeKpi'] = 0
                    inventoryTotal['61-90dayLibraryAgeKpi'] = 0
                    inventoryTotal['31-60dayLibraryAgeKpi'] = 0
                    inventoryTotal['0-30dayLibraryAgeKpi'] = 0
                    obj.forEach(v =>{
                        this.inventoryData.push(v)
                        inventoryTotal.store_name = '总计'
                        inventoryTotal.store_code = ''
                        inventoryTotal['deceitCarSkuNum'] += v['deceitCarSkuNum']
                        inventoryTotal['totalCycleSkuNum'] += v['totalCycleSkuNum']
                        inventoryTotal['181dayUpLibraryAgeKpi'] += v['181dayUpLibraryAgeKpi']
                        inventoryTotal['91-180dayLibraryAgeKpi'] += v['91-180dayLibraryAgeKpi']
                        inventoryTotal['61-90dayLibraryAgeKpi'] += v['61-90dayLibraryAgeKpi']
                        inventoryTotal['31-60dayLibraryAgeKpi'] += v['31-60dayLibraryAgeKpi']
                        inventoryTotal['0-30dayLibraryAgeKpi'] += v['0-30dayLibraryAgeKpi']
                    })
                    this.inventoryData.unshift(inventoryTotal)
                }
            })
        },
        //运营模块
        // 后台分两个接口给的数据
        // 先获取前四个数据,再依据返回的数据处理后一个接口返回的数据
        // 合并成一组数据
        queryFunnelInfo() {
            let promise = new Promise((resolve, reject) =>{
                api.groupDashboard.queryFunnelInfoModule(this.query, res=>{
                    
                    if (res.data.code == 'success') {
                        this.FunnelData = []
                        const obj = res.data.obj
                        const FunnelTotal = {}
                        FunnelTotal.inStoreLead = 0
                        FunnelTotal.orderAddCount = 0
                        FunnelTotal.orderInvocie = 0
                        FunnelTotal.orderOfferPrice = 0
                        obj.forEach(v =>{
                            this.FunnelData.push(v)
                            FunnelTotal.store_name = '总计'
                            FunnelTotal.store_code = ''
                            FunnelTotal['inStoreLead'] += v['inStoreLead']
                            FunnelTotal['orderAddCount'] += v['orderAddCount']
                            FunnelTotal['orderInvocie'] += v['orderInvocie']
                            FunnelTotal['orderOfferPrice'] += v['orderOfferPrice']
                        })
                        this.FunnelData.unshift(FunnelTotal)
                        resolve(this.FunnelData)
                    }
                })
            })
            promise.then(res =>{
                let _this = this
                let options = JSON.parse(JSON.stringify(this.query))
                options.addCode = 'MaoriExhibitionHallRetailTarget' //此参数是为了区分开票目标和TGP目标
                //运营模块开票目标
                api.groupDashboard.queryMaoriTargetInfo(options, sc =>{
                    if (sc.data.code == 'success') {
                        let obj = sc.data.obj
                        // this.invocieTarget = obj
                        var invocieTarget = 0
                        obj.forEach(item =>{
                            // 获取开票目标总计
                            invocieTarget += (item ?item['invocieTarget']:0)

                            res.forEach( (v, index) =>{
                                if ((item && item.store_code) == v.store_code) {
                                    _this.$set(res[index],'invocieTarget',item['invocieTarget'])
                                }
                            })
                        })
                        this.$set(res[0],'invocieTarget',invocieTarget)
                        this.FunnelData = res
                    }
                })
            })
        },
        

        //利润报表
        // 首先查询集团可见GP
        // 依据集团可见GP数量处理数据
        querySalesGpModule() {
            let promise =  new Promise( (resolve, reject) =>{
                let params = {"refCode":"GpConverType","refDetailCode":"","refDetailName":"","pageNums":15,"pageStart":1,"isDeleted":""}
                api.ref.queryDictionaryDetails(params, res =>{
                    if (res.data.code == 'success') {
                        let obj = res.data.obj.list
                        let len = (obj.filter( (v)=>{return v.isDeleted == 0})).length
                        resolve(len)
                    }
                })
            })
            promise.then((len)=>{
                 api.groupDashboard.querySalesGpModule(this.query, res=>{
                    this.tableData = []
                    if (res.data.code == 'success' && res.data.obj && res.data.obj.length > 0) {
                        
                        let data = res.data.obj

                        const selectHeader = [{
                            title:'门店',
                            key: 'store_name',
                            align: 'center',
                            width: 100,
                            fixed: 'left',
                            render: (h, params) => {
                                return h('div', [h('div', {
                                    style: {
                                        marginRight: '5px'
                                    },
                                    on: {
                                        click: () => {
                                            this.route(params)
                                        }
                                    }
                                    }, `${params.row.store_name}`)]
                                )}
                            },
                        ]
                        const tableData = [{
                            store_name: '总计',
                            store_code: ''
                        }]
                        if (len >= 4) {
                            // this.filter(data,selectHeader,tableData,len)
                            for (let i=1;i <= 4; i++) {
                                selectHeader[i] = {}
                                selectHeader[i].key = data[i-1]['add_code']
                                selectHeader[i].title = data[i-1]['add_code'].slice(0,-6)
                                selectHeader[i].center = 'align'
                                selectHeader[i].sortable = 'custom',
                                selectHeader[i].width = 100

                            }
                            for (let i = 1;i<=data.length / 4;i++) {
                                tableData[i] = {}
                                tableData[i].store_name = data[4*i-4]['store_name']
                                tableData[i].store_code = data[4*i-4]['store_code']
                                tableData[i][data[4*i-4]['add_code']] = data[4*i-4]['add_value'].toFixed(0)
                                tableData[i][data[4*i-3]['add_code']] = data[4*i-3]['add_value'].toFixed(0)
                                tableData[i][data[4*i-2]['add_code']] = data[4*i-2]['add_value'].toFixed(0)
                                tableData[i][data[4*i-1]['add_code']] = data[4*i-1]['add_value'].toFixed(0)

                            }
                            
                        }

                        if (len == 3) {
                            for (let i=1;i <= 3; i++) {
                                selectHeader[i] = {}
                                selectHeader[i].key = data[i-1]['add_code']
                                selectHeader[i].title = data[i-1]['add_code'].slice(0,-6)
                                selectHeader[i].center = 'align'
                                selectHeader[i].sortable = 'custom',
                                selectHeader[i].width = 100

                            }
                            for (let i = 1;i<=data.length / 3;i++) {
                                tableData[i] = {}
                                tableData[i].store_name = data[3*i-3]['store_name']
                                tableData[i].store_code = data[3*i-3]['store_code']
                                tableData[i][data[3*i-3]['add_code']] = data[3*i-3]['add_value'].toFixed(0)
                                tableData[i][data[3*i-2]['add_code']] = data[3*i-2]['add_value'].toFixed(0)
                                tableData[i][data[3*i-1]['add_code']] = data[3*i-1]['add_value'].toFixed(0)

                            }
                        }

                        if (len == 2) {
                            for (let i=1;i <= 2; i++) {
                                selectHeader[i] = {}
                                selectHeader[i].key = data[i-1]['add_code']
                                selectHeader[i].title = data[i-1]['add_code'].slice(0,-6)
                                selectHeader[i].center = 'align'
                                selectHeader[i].sortable = 'custom',
                                selectHeader[i].width = 100

                            }
                            for (let i = 1;i<=data.length / 2;i++) {
                                tableData[i] = {}
                                tableData[i].store_name = data[2*i-2]['store_name']
                                tableData[i].store_code = data[2*i-2]['store_code']
                                tableData[i][data[2*i-2]['add_code']] = data[2*i-2]['add_value'].toFixed(0)
                                tableData[i][data[2*i-1]['add_code']] = data[2*i-1]['add_value'].toFixed(0)

                            }
                        }

                        if (len == 1) {
                                selectHeader[1] = {}
                                selectHeader[1].key = data[0]['add_code']
                                selectHeader[1].title = data[0]['add_code'].slice(0,-6)
                                selectHeader[1].center = 'align'
                                selectHeader[1].sortable = 'custom',
                                selectHeader[1].width = 100
                            for (let i = 1;i<=data.length;i++) {
                                tableData[i] = {}
                                tableData[i].store_name = data[i-1]['store_name']
                                tableData[i].store_code = data[i-1]['store_code']
                                tableData[i][data[i-1]['add_code']] = data[i-1]['add_value'].toFixed(0)
                            }
                        }



                        let options = JSON.parse(JSON.stringify(this.query))
                        options.addCode = 'MaoriTGPTotalTarget' //此参数是为了区分开票目标和TGP目标

                        api.groupDashboard.queryMaoriTargetInfo(options, res=>{
                            if (res.data.code == 'success' && res.data.obj.length > 0) {
                                selectHeader.push({
                                    key: 'invocieTarget',
                                    title: 'T.GP目标',
                                    center: 'align',
                                    "sortable": "custom",
                                    width: 110
                                })
                                let data = res.data.obj

                                data.forEach((v, index) =>{
                                    let findIndex = tableData.findIndex(item =>{
                                        return item.store_code == (v && v.store_code)
                                    })
                                    if (findIndex >= 0) {
                                        tableData[findIndex].invocieTarget = (v && v.invocieTarget.toFixed(0))
                                    } else {
                                        if (v){
                                            tableData.push(v)
                                        }
                                    } 
                                })
                                this.selectHeader = selectHeader
                                this.tableData = tableData

                            }
                            
                        })
                    }
                    
                })
            })
        },
        //路由跳转
        route(params){
            if (params.row.store_code == '') {
                return;
            }

            this.$router.push(`/boarddetial?storeCode=${params.row.store_code}&storeName=${params.row.store_name}&tableIndex=2`)
        },
        // 数据过大用k表示
    

        // filter(data,selectHeader,tableData,len){
        //     for (let i=1;i <= len; i++) {
        //         selectHeader[i] = {}
        //         selectHeader[i].key = data[(data.length / len)*i-i-1]['add_code']
        //         selectHeader[i].title = data[(data.length / len)*i-i-1]['add_code'].slice(0,-6)
        //         selectHeader[i].center = 'align'

        //     }
        //     for (let i = 1;i<=data.length / len;i++) {

        //         tableData[i] = {}
        //         tableData[i].store_name = data[len*i-len]['store_name']
        //         tableData[i].store_code = data[len*i-len]['store_code']
        //         for (let j=len;j<1;j--) {

        //             tableData[i][data[len*i-j]['add_code']] = data[len*i-j]['add_value']

        //         }

        //     }
        // }
    },
    components:{
        pageHeader,
        Picker,
        Popup,
        DatetimePicker,
        tables,
        funnelTab,
        grossMargin
    }
}
</script>
<style lang="scss" scoped>

.fixedHeight {
    height: remp(172)
}
.board-time {
    // position: relative;
    margin: 0 auto;
    width: 100%;
    max-width: 750px;
    height: remp(41);
    text-align: center;
    line-height: remp(41);
    font-size: remp(13);
    color: #333;
    img {
        width: remp(10);
        height: remp(6);
    }
}

.DataPicker {
    float: left;
    width: 50%;
    height: 100%;
    border-right: 1px solid #E6E7EB;
    box-sizing: border-box;
}
.selectData {
    display: block;
    float: right;
    width: 50%;
    height: 100%;
    line-height: 100%;
    padding: remp(10);
    // font-size: 13px;
    span {
        display: inline-block;
        width: 30%;
        height: remp(20);
        line-height: remp(20);
        font-size: 12px;
        color: #000000;
    }
    >.active {
            background: #5F7AD8;
            border-radius: remp(10);
            height: remp(20);
            line-height: remp(20);
            color: white;
        }
}

.board-tabs {
    margin: 0 auto;
    width: 100%;
    max-width: 750px;
    display: flex;
    flex-direction: row;
    z-index: 100;
    border-bottom: 1px solid #eee;
    .board-item {
        text-align: center;
        padding-top: remp(12);
        padding-bottom: remp(12);
        font-family: PingFangSC-Regular;
        font-size: remp(12);
        color: #A5A5B5;
    }
    >.active {
        font-family: PingFangSC-Semibold;
        font-size: remp(12);
        color: #333333;
        border-bottom: remp(2) solid #36ACFE;
    }
}
.data-report-filte {
    background: #F7F7F7;
    max-width: 750px;
    display: flex;
    flex-direction: column;
    height: remp(40);
    border-top: 1px solid #E6E7EB;
}
.input-l {
    width: 50%;
    height: 100%;
    line-height: 100%;
    display: flex;
    flex-direction: row;
    background-color: #ffffff;
    color: #7E8387;
    font-family: PingFangSC-Regular;
    font-size: remp(14);
    padding-left: remp(20);
    padding-top: remp(10);
    vertical-align: middle;
    border-right: 1px solid #E6E7EB;
    .title {
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: keep-all;
        white-space: nowrap;
    }
}
.input-s {
    width: 50%;
    height: 100%;
    line-height: 100%;
    display: flex;
    flex-direction: row;
    background-color: #ffffff;
    color: #7E8387;
    font-family: PingFangSC-Regular;
    font-size: remp(14);
    padding-left: remp(20);
    padding-top: remp(10);
    vertical-align: middle;
    .title {
        width: 80%;
        overflow: hidden;
        text-overflow: ellipsis;
        word-break: keep-all;
        white-space: nowrap;
    }
}
.toTop:before {
    width: 0;
    height: 0;
    border-left: remp(8) solid transparent;
    border-right: remp(8) solid transparent;
    border-bottom: remp(8) solid #7E8387;
    font-size: 0;
    float: right;
    content: ' '
}
.toBottom:before {
    width: 0;
    height: 0;
    border-left: remp(8) solid transparent;
    border-right: remp(8) solid transparent;
    border-top: remp(8) solid #7E8387;
    font-size: 0;
    float: right;
    content: ' '
}
</style>
