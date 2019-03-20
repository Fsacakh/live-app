<template>
    <div ref="profitReport" class="profit-report">
        <!--盈利报表选择时间-->
        <div class="profit-select-time">
            <div class="select-item-btn" @click="showPopUp('yearMonth')">{{headYearMonth}}</div>
            <div class="select-item-btn" @click="showPopUp('day')">{{headDay}}</div>
        </div>
        <!--盈利报表选择维度及数据类型-->
        <div ref="profitSelect" class="profit-select">
            <div class="select-item-btn" @click="showPopUp('dimensionality')">{{dimensionalityType}}</div>
            <div class="select-item-btn" @click="showPopUp('dataType')">{{ratioDataType}}</div>
        </div>
        <div class="profit-table">
            <Table class="table-item-last" @on-sort-change="sortData" :row-class-name="rowClassName" :height="tableHeight" border :columns="selectHeader" :data="tableData" size="small" ref="table"></Table>
        </div>
        <!--弹出选择框 弹出层内容通过 popupContentType判断 yearMonth: 年月选择, day: 具体哪一天, dimensionality: 维度选择, dataType: 数据类型-->
        <van-popup v-model="popupPickerShow" position="bottom">
            <van-datetime-picker v-model="currentDate" v-if="popupContentType === 'yearMonth'" @confirm="setYearMonth" @cancel="closePopup" type="year-month" :formatter="formatter" />
            <Day v-if="popupContentType === 'day'" :yearMonth="headYearMonth" @onConfirm="setDay" @onCancel="closePopup"></Day>
            <van-picker v-if="popupContentType === 'dimensionality'" show-toolbar :columns="columns1" @cancel="closePopup" @confirm="setDimensionalityType"/>
            <van-picker v-if="popupContentType === 'dataType'" show-toolbar :columns="columns2" @cancel="closePopup" @confirm="setDateType"/>
        </van-popup>
    </div>
</template>

<script>
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import { Popup, DatetimePicker, Picker } from 'vant';
import 'iview/dist/styles/iview.css';
import { Table } from 'iview';
import '@/assets/css/profitboard.css';
//common
import api from '@/common/api.js';
import { getRefMainInfo } from '@/common/com-api.js';
//lib
import Day from './lib/day.vue';
// import './lib/test.css';

Vue.use(DatetimePicker).use(Popup).use(Picker);
export default {
    data() {
        return {
            pageFlag: true,
            popupPickerShow: false, //时间组件弹层隐藏显示状态
            popupContentType: 'yearMonth', //判断当前弹出层内的内容是哪个
            /*时间选择 */
            //头部选择的时间展示
            currentDate: new Date(), //当前时间
            headYearMonth: '', //头部时间选择
            headDay: 'All', //头部天数选择
            //维度与数据类型展示
            dimensionalityType:'车系维度汇总',
            ratioDataType:'销售数据',
            //维度与数据类型及编码
            dimensionalityTypeCode:'car',
            ratioDataTypeCode: 0,
            columns1:['按车系维度汇总','销售顾问维度汇总'],
            columns2:['数值','比例'],
            dimensionalityCode:['car','sc'],
            dataCode:[0,1],
            /**
             * 表格用的数据
             */
            tableHeight: 0,
            selectHeader: [],  //表头切换选择(数值型还是比例型)
            //数值表头
            numberHeader: [
                {
                    "title": "开票台数",
                    "key": "invoiceCount",
                    "width": 120,
                    "sortable": "custom",
                    "align": "center"
                },
                {
                    "title": "金融台数",
                    "key": "financialOrderInCount",
                    "width": 120,
                    "sortable": "custom",
                    "align": "center"
                },
                {
                    "title": "保险台数",
                    "key": "insuranceOrderInCount",
                    "width": 120,
                    "sortable": "custom",
                    "align": "center"
                },
                {
                    "title": "精品台数",
                    "key": "skuInCount",
                    "width": 120,
                    "sortable": "custom",
                    "align": "center"
                },
                {
                    "title": "延保台数",
                    "key": "extensionInCount",
                    "width": 120,
                    "sortable": "custom",
                    "align": "center"
                }
            ],
            //比例表头
            numberHeaderRate: [
                {
                    "title": "金融渗透率",
                    "key": "financialOrderNoReat",
                    "width": 100,
                    "align": "center"
                },
                {
                    "title": "保险渗透率",
                    "key": "insuranceOrderNoReat",
                    "width": 100,
                    "align": "center"
                },
                {
                    "title": "精品渗透率",
                    "key": "skuReat",
                    "width": 100,
                    "align": "center"
                },
                {
                    "title": "延保渗透率",
                    "key": "extensionReat",
                    "width": 100,
                    "align": "center"
                }
            ],
            options:{                   //请求传参
                salesMonthStart: '2018/07/01 00:00:00',//开始时间
                salesMonthEnd: '2018/07/31 23:59:59', //结束时间
                isPercent: 0,                           //销售数据类型，0: 数值 1: 比例
                isPercentName: '销售数据',
                scOrCarFlag: 'car',                       //销售维度编码
                scOrCarFlagName: '按车系维度汇总',         //销售维度名称
                storeCode: this.$route.query.storeCode //门店编码
            },
            tableData: [], //表格数据填充
            isAsc: true,   //判断升序或降序  true：升序  false：降序
            newtotalObj: {    //总计
                "scName": '总计',
                "invoiceCount": 0,
                "financialOrderInCount": 0,
                "insuranceOrderInCount": 0,
                "skuInCount": 0,
                "extensionInCount": 0
            },
        }
    },
    watch: {
        options:{
            handler(newVal,oldVal){
                //初始化页面时防止重复请求
                if(this.pageFlag){
                    return false;
                }
                // 要先判断数据类型，因为两个表头的维度不可变，变完表头数据类型，再改变维度
                // 判断数据类型
                if(newVal.isPercent == 0){    //数值型
                    this.selectHeader = this.numberHeader
                }else{                         //比例型
                    this.selectHeader = this.numberHeaderRate
                }
                // 判断销售维度
                if(newVal.scOrCarFlag === 'sc'){        //销售顾问维度
                    this.selectHeader[0].key = 'scName'
                    this.selectHeader[0].title = '销售顾问'
                }else{                                  //品牌车系维度
                    this.selectHeader[0].key = 'carSeriesName'
                    this.selectHeader[0].title = '品牌车系'
                }
                this.selectHeader[0].fixed = 'left';
                this.tableData = [];        //清空表格数据
                this.getAllProfitData();     //再次请求数据
            },
            deep:true,
            immediate:true
        },
        storeCode:function(val){
            this.options.storeCode = this.store.code;
        }
    },
    mounted() {
        this.options.storeCode = this.store.code;
        this.initPage();
    },
    computed: {
        ...mapState('databoard', [
            'store',
        ]),
        storeCode:function(){
            return this.store.code;
        }
    },
    methods: {
        //初始化页面
        initPage(){
            //获取当前时间展示于头部
            this.headYearMonth = this.getCurrentTime();
            //设置表格高度
            this.setTableHeight();
            // 获取页面初始时间用于渲染页面
            this.setYearMonth();
            //获取数据字典中的GP值，并且对它进行格式化处理，用于设置表格头
            this.getGpTableTitle().then((res) => {
                if(res && res.length > 0){
                    this.forMatterGpInfo(res, () => {
                        this.pageFlag = false;
                        //获取利润数据
                        this.getAllProfitData();
                    });
                }
            });

        },
        //处理页面高度问题
        setTableHeight(){
            let headerHeight = this.$refs.profitReport.parentElement.firstChild.clientHeight, //previousElementSibling
                tabHeight = this.$refs.profitReport.previousElementSibling.clientHeight,
                dateSelectHeight = this.$refs.profitReport.firstChild.clientHeight,
                profitSelect = this.$refs.profitSelect.clientHeight;
            this.tableHeight = document.body.clientHeight - (headerHeight + tabHeight + dateSelectHeight + profitSelect) - 8;
        },
        /**
         * 页面主要数据请求从这里开始
         * 首先执行getGpTableTitle，来获取数据字典中配置了哪些GP值，用于设置表格头
         * 处理表头
         * 之后获取利润数据
         * 再获取GP数据
         * 最后对数据进行填充处理
         */
        //获取数据字典中的GP值, 用于设置表格头
        getGpTableTitle(){
            return new Promise((resolve,reject) => {
                getRefMainInfo('GpConverType', (res) => {
                    if(res && res.length > 0){
                        resolve(res)
                    }else{
                        reject(res)
                    }
                });
            })
        },

        // 获取利润数据和GP数据
        getAllProfitData(){
            //获取利润数据
            let queryProfitInfo = new Promise((resolve,reject) => {
                api.board.queryProfitInfo(this.options,(res) => {
                    if(res.data.code === 'success'){
                        resolve(res)
                    }else{
                        reject(res)
                    }
                })
            })
            // 获取利润数据GP值
            let queryProfitInfoGP = new Promise((resolve,reject) => {
                api.board.queryProfitInfoGP(this.options, (res) => {
                    if(res.data.code === 'success'){
                        resolve(res)
                    }else{
                        reject(res)
                    }
                })
            })

            Promise.all([queryProfitInfo,queryProfitInfoGP]).then((res) => {
                // result返回一个数组，对应all括号中数组的各个元素即各个函数执行得到的结果
                this.profitDataPush(res[0].data.obj,res[1].data.obj)
            }).catch((err) => {
                console.log(err)
            })

        },
        // 数据填充与渲染  参数分别为利润数据和GP数据
        profitDataPush(profitInfoData, profitInfoGpData){
            let result = profitInfoData.list;    //先将利润数据放进result
            // 格式化数据
            for(let i = 0; i < result.length; i ++){
                // 给GP值补0
                for(let j = 0; j < this.selectHeader.length; j ++){
                    if(this.selectHeader[j].title.indexOf("GP") >= 0){
                        result[i][this.selectHeader[j].title] = 0;
                        result[i][this.selectHeader[j].title] = result[i][this.selectHeader[j].title].toFixed(1)
                        if(this.options.isPercent === 1){   //比例类型
                            result[i][this.selectHeader[j].title] = result[i][this.selectHeader[j].title] + '%';
                        }
                    }
                }

                if(this.options.isPercent === 1){   // 将比例类型的利润数据加个%
                    for(let item in result[i]){
                        if(item.indexOf("Reat") >= 0){
                            result[i][item] = Number(result[i][item]).toFixed(1) + '%';
                        }
                    }
                }else{     //数值类型
                    for(let item in result[i]){
                        if(item.indexOf("Count") >= 0){
                            result[i][item] = Number(result[i][item]).toFixed(1);
                        }
                    }
                }
            }

            //GP赋值:将GP值继续放到result中
            for(let m = 0; m < result.length; m ++){
                // 销售顾问类型
                if(this.dimensionalityTypeCode === 'sc'){
                    for(let key in profitInfoGpData["scGP"]){
                        if(result[m].scCode === key){
                            for(let GPkey in profitInfoGpData["scGP"][key]){
                                   //将比例类型转化为百分比形式
                                result[m][GPkey] = GPkey.indexOf("%") >= 0 ? this.toPercent(profitInfoGpData["scGP"][key][GPkey]) : profitInfoGpData["scGP"][key][GPkey].toFixed(1);
                            }
                        }
                    }
                }else{
                    // 品牌车系类型
                    for(let key in profitInfoGpData["carGP"]){
                        if(result[m].carBrandCode + result[m].carSeriesCode === key){
                            for(let GPkey in profitInfoGpData["carGP"][key]){
                                result[m][GPkey] = GPkey.indexOf("%") >= 0 ? this.toPercent(profitInfoGpData["carGP"][key][GPkey]) : profitInfoGpData["carGP"][key][GPkey].toFixed(1);
                            }
                        }
                    }
                }
            }
            // 总计数据
            // 判断维度
            if(this.selectHeader[0].key === "scName"){     //销售顾问维度
                let testab = this.newtotalObj
                delete testab["carSeriesName"]
                testab["scName"] = "总计"
                this.newtotalObj = testab
            }else{                                          //品牌车系维度
                let testaa = this.newtotalObj
                delete testaa["scName"]
                testaa["carSeriesName"] = "总计"
                this.newtotalObj = testaa
            }
            // 添加利润的总计数据
            let totalObjDemo = this.newtotalObj
            totalObjDemo["invoiceCount"] = profitInfoData["invoiceSum"]          //开票
            totalObjDemo["extensionInCount"] = profitInfoData["extensionSum"]    //延保
            totalObjDemo["financialOrderInCount"] = profitInfoData["financialSum"]   //金融
            totalObjDemo["insuranceOrderInCount"] = profitInfoData["insuranceOrderNoSum"]  //保险
            totalObjDemo["skuInCount"] = profitInfoData["skuSum"]    //精品
            // 添加GP的总计数据
            let totalGpData = profitInfoGpData.scSumGP
            for(let item in totalGpData){
                for(let itemTotal in totalObjDemo){
                    if(itemTotal == item){
                            totalObjDemo[itemTotal] = totalGpData[item]
                    }
                }
            }
            // 格式化总计数据(保留小数点后一位)
            for(let aitemTotal in totalObjDemo){
                if(typeof(totalObjDemo[aitemTotal]) == 'number'){
                    totalObjDemo[aitemTotal] = (totalObjDemo[aitemTotal]*100/100).toFixed(1)
                }
            }
            this.newtotalObj = totalObjDemo
            // 添加总计(在数据类型下)
            if(this.options.isPercent === 0){
            //     // 插入总计这条数据
                result.unshift(this.newtotalObj)
            }
            this.tableData =  result;
        },

        //格式化GP值，将百分比与数值区分
        forMatterGpInfo(data, callBack){
            let newtotalTem = this.newtotalObj;
            data.map((item,i) => {
                newtotalTem[item.refDetailName] = 0;
            })
            this.newtotalObj = newtotalTem;       // 设置总计头
            let length = data.length,
            gpNumberTitle = [], //数值类型
            gpNumberRate = []; //百分比类型
            //区分百分比和数值的标题
            while(length --){
                // 插入GP头
                this.numberHeader.unshift({
                    "title": data[length].refDetailName,
                    "key": data[length].refDetailName,
                    "width": 110,
                    "align": "center",
                    "sortable": "custom"
                });
                this.numberHeaderRate.unshift({
                    "title": data[length].refDetailName + '%',
                    "key": data[length].refDetailName + '%',
                    "width": 100,
                    "align": "center"
                });
            }
            // 页面第一次渲染时，表头就应该是全的，不然手动切换数据类型的时候再添加，不能添加完整
            this.numberHeader.unshift({
                "title": "品牌车系",
                "key": "carSeriesName",
                "fixed": "left",
                "width": 120,
                "align": 'center'
            })
            this.numberHeaderRate.unshift({
                "title": "品牌车系",
                "key": "carSeriesName",
                "fixed": "left",
                "width": 100,
                "align": 'center'
            })
            // 插入维度头
            if(this.ratioDataTypeCode === 0){    //数据为数值类型
                this.selectHeader = this.numberHeader
            }else{
                this.selectHeader = this.numberHeaderRate
            }
            this.selectHeader[0].fixed = 'left';
            if(callBack){
                callBack();
            }
        },
        //格式化选中时间
        getCurrentTime(time){    //无参数时代表第一次渲染页面，所以获取的是当前时间
            let date = time == undefined ? new Date() : new Date(time),
                year = date.getFullYear(),
                month = date.getMonth() + 1;
            if (month < 10) { month = '0' + month}
            return year + '/' + month;        //格式：2018/10
        },
        //获取当月天数
        getDayNumber(date){
            if(date == undefined){
                let yearMonthFmt = this.getCurrentTime().split('/'),
                day = new Date(yearMonthFmt[0], yearMonthFmt[1], 0);
                return day.getDate();
            }else{
                let yearMonthFmt = this.headYearMonth.split('/'),
                day = new Date(yearMonthFmt[0], yearMonthFmt[1], 0);
                return day.getDate();
            }
        },
        //格式化时间
        formatter(type, value) {
            if (type === 'year') {
                return `${value}年`;
            } else if (type === 'month') {
                return `${value}月`
            }
            return value;
        },
        //点击组件获取年月或获取当前时间用于渲染第一次打开时的页面
        setYearMonth(date){
            if(date == undefined){
                this.headYearMonth = this.getCurrentTime();
                this.getTimeForm();
            }else{
                this.headYearMonth = this.getCurrentTime(date);
                this.setTimeForm(this.headYearMonth);
                this.closePopup();
            }
        },
        //点击组件获取日:点击确认后就获取新数据并更新
        setDay(date){
            this.headDay = date.toString();
            // 格式化时间参数
            this.setTimeForm(date.toString());
            this.closePopup();
        },
        // 首次渲染页面获取传参年月  无参数时代表第一次渲染页面，所以获取的是当前时间
        getTimeForm(){     //默认日期选择all
            this.options.salesMonthStart = this.headYearMonth + '/' + 1 + ' ' + '00:00:00';
            this.options.salesMonthEnd = this.headYearMonth + '/' + this.getDayNumber() + ' ' + '23:59:59';
        },
        // 传参时间日期参数格式化
        setTimeForm(date){
            if(date.indexOf('/') >= 0){     //选择不同年月
                if(this.headDay === 'All'){
                    this.options.salesMonthStart = this.headYearMonth + '/' + 1 + ' ' + '00:00:00';
                    this.options.salesMonthEnd = this.headYearMonth + '/' + this.getDayNumber(date) + ' ' + '23:59:59';
                }else{
                    this.options.salesMonthStart = this.headYearMonth + '/' + this.headDay + ' ' + '00:00:00';
                    this.options.salesMonthEnd = this.headYearMonth + '/' + this.headDay + ' ' + '23:59:59';
                }
            }else{                          //选择不同日
                if(this.headDay === 'All'){
                    this.options.salesMonthStart = this.headYearMonth + '/' + 1 + ' ' + '00:00:00';
                    this.options.salesMonthEnd = this.headYearMonth + '/' + this.getDayNumber(this.headYearMonth) + ' ' + '23:59:59';
                }else{
                    this.options.salesMonthStart = this.headYearMonth + '/' + date + ' ' + '00:00:00';
                    this.options.salesMonthEnd = this.headYearMonth + '/' + date + ' ' + '23:59:59';
                }
            }
        },
        // 设置维度类型
        setDimensionalityType(value, index) {
            this.dimensionalityType = value;
            for(let i=0; i < this.columns1.length;i++){
                if(value == this.columns1[i]){
                    this.dimensionalityTypeCode = this.dimensionalityCode[i]
                    this.options.scOrCarFlag = this.dimensionalityCode[i]
                }
            }
            this.closePopup();
        },
        // 设置数据类型
        setDateType(value, index) {
            this.ratioDataType = value;
            for(let i=0; i < this.columns2.length;i++){
                if(value == this.columns2[i]){
                    this.ratioDataTypeCode = this.dataCode[i];
                    this.options.isPercent = this.dataCode[i];
                }
            }
            this.closePopup();
        },
        //弹出层展示
        showPopUp(type){
            this.popupPickerShow = true;
            this.popupContentType = type;
        },
        //关闭弹出层
        closePopup(){
            this.popupPickerShow = false;
        },
        // 转化小数为百分比形式
        toPercent(a){
            let b = (a*100).toFixed(1) + '%'
            // a = Math.round(Number(a*1000))/10 + '%';
            return b
        },
        // 给表格数据排序
        sortData(column){
            let keyData = column.key;
            // 去掉总计的数据
            let storageArr = this.tableData.slice(1);

            if(this.isAsc === true){   //升序
                storageArr = storageArr.sort(this.ascData(keyData))

            }else{                      //降序
                storageArr = storageArr.sort(this.descData(keyData))
            };

            // 将总计加给排好序的数据并重新给tableData赋值
            storageArr.unshift(this.tableData[0])
            this.tableData = storageArr
        },
        // 排序 从小到大
        ascData(data){
            this.isAsc = false;
            return function(obj1,obj2){
                var a = obj1[data];
                var b = obj2[data];
                return a - b;
            }
        },
        // 排序 从大到小
        descData(data){
            this.isAsc = true;
            return function(obj1,obj2){
                var a = obj1[data];
                var b = obj2[data];
                return b - a;
            }
        },
        // 给总计添加背景色
        rowClassName (row, index) {
            if(this.options.isPercent === 0){   //判断是否为数据类型
                if (index === 0) {
                    return 'demo-table-info-row';
                }
                return '';
            }
        }
    },
    components: {
        Table,
        Day
        //Popup
    }
}
</script>

<style lang="scss" scoped>
/* 下拉弹出组件的定位 */
.pop-picker{
    position:fixed;
    z-index: 1001;
    width: 100%;
    bottom: 0;
}
.profit-report{
    padding-top: remp(48);
}
.profit-select-time{
    height: remp(40);
    color: #000;
    background-color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    .select-item-btn:first-child{
        margin-right: remp(20);
    }
}
.profit-select{
    color: #7e8387;
    background-color: #f7f7f7;
    display: flex;
    justify-content: center;
    align-items: center;
    padding:remp(10) remp(25);
    .select-item-btn{
        background-color: #fff;
        color: #7e8387;
        font-family: PingFangSC-Regular;
        font-size: .14rem;
        padding: remp(10) .1rem;
        box-shadow: 0 0.07rem 0.09rem 0 hsla(0,0%,89%,.51);
        border-radius: .04rem;
        vertical-align: middle;
        flex-grow: 1;
    }
    .select-item-btn:first-child{
        flex-grow: 2;
        margin-right: remp(15);
    }
}
.profit-table{
    position: relative;
    .table-item-first{
        position: absolute;
        left: 0;
        // top: -remp(20);
        top: 0;
        z-index:999;
        width: 100%;
    }
}
.ivu-table .demo-table-info-row td{
    background-color: #f8f8f9;
    color: #515a6e;
}
.ivu-icon .ivu-icon-md-arrow-dropdown{
    color: red;
}
</style>


