<template>
    <div class="serviceAndOther">
        <page-header @on-click-right="more">
            <div slot>报价单-服务费及其他</div>
            <div v-if="!judge&&serviceList.length!=0" slot="right">保存</div>
        </page-header>
        <div class="currentPrice p-l-10 p-r-10">
            <span>当前车辆销售价:</span>
            <span>¥<i>{{ price }}</i></span>
        </div>
        <div v-if="serviceList.length == 0" class="no-sevice">
            <div v-if="showLoading">
                <loading></loading>
            </div>
            <div v-else>
                <no-data :imgUrl="imgUrl" title="该订单暂无服务费及其他"></no-data>
            </div>
        </div>
        <div class="contentItems">
            <div class="itemContainer b-white" v-for="(item, index) in serviceList" :key="index">
                <div class="serviceup">
                    <div class="cell-item">
                        <cell :title="item.serviceName" class="serveFee">
                            <input class="service-color service-input" type="number" placeholder="金额" v-model="item.actualServiceFee" :readonly="judge">
                            <span class="service-color" slot="right">元</span>
                        </cell>
                    </div>
                    <div class="boxcheck clearfix">
                        <label class="mint-checklist-label">
                                <span class="mint-checkbox">
                                    <input type="checkbox" class="mint-checkbox-input" value="1" v-model="item.agentBusinessFlag" :disabled="judge">
                                    <span class="mint-checkbox-core"></span>
                                </span>
                                <span class="mint-checkbox-label">代付</span>
                            </label>
                    </div>
                    <div class="deleted-fee" @click="removeFee(index)">
                        <span>删除</span>
                    </div>
                </div>
                <cell :title="'账类'">
                    <input type="text" v-model="item.accountTypeName" @click="showselect(index)" readonly>
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
            <div class="remark flex" v-if="serviceList.length!='0'">
                <div class="p-l-10 p-t-10">备注</div>
                <div class="p-t-10">
                    <textarea placeholder="请输入客户意见（最多30字）" v-model="remark" :readonly="judge"></textarea>
                </div>
            </div>
        </div>
        <div v-if="!judge" class="saveBtn p-l-10 p-r-10 m-t-20">
            <div @click="showModellist()">
                <i class="icon iconfont icon-xinzeng"></i>&nbsp;添&nbsp;加&nbsp;费&nbsp;用
            </div>
        </div>
        <div class="listmodelfee" v-if="listmodelShow">
            <div class="modelContainer b-white">
                <div class="title p-l-10 p-r-10 text-right">
                    <div class="rightAngle" @click="cancel"><i class="icon iconfont icon-xinzeng"></i></div>
                </div>
                <ul>
                    <li v-for="(item, index) in temp" :class="{'hovers': item.isShow}" :key="index" @click.stop="chooseItem(item, index)">{{ item.text }}</li>
                </ul>
                <div class="serviceFeeBtn">
                    <div class="tc" @click="pitchon()">
                        确&ensp;定
                    </div>
                </div>
            </div>
        </div>
        <accountlist @closeSelect="closeSelect" @changeSelect="changeStatus" ref="getType" :listselectShow='listselectShow' :accountnum='accountnum' :dataInfo="dataInfo">
        </accountlist>
    </div>
</template>
<script>
    import Vue from 'vue'
    import {
        Toast,
        MessageBox
    } from 'mint-ui'
    import {
        mapState
    } from 'vuex'
    import api from '../../../common/api'
    import config from '../../../common/config'
    import PageHeader from "components/header/PageHeader"
    import cell from 'components/cell'
    import accountlist from 'components/accounttypes'
    import NoData from 'components/no-data/no-data'
    import loading from '@/components/loading/loading.vue'
    const base = process.env.NODE_ENV === 'development' ? '' : '/liveapp/'
    if (/Android [4-6]/.test(navigator.appVersion)) {
        window.addEventListener("resize", function() {
            if (document.activeElement.tagName == "INPUT" || document.activeElement.tagName == "TEXTAREA") {
                window.setTimeout(function() {
                    document.activeElement.scrollIntoViewIfNeeded();
                }, 0);
            }
        })
    }
    export default {
        components: {
            PageHeader,
            cell,
            accountlist,
            NoData,
            loading
        },
        data() {
            return {
                judge: true,
                showLoading: true,
                price: '',
                type: 'add',
                value: '',
                listselectShow: false,
                listmodelShow: false,
                listmodelShowOne: false,
                savesbtn: false,
                editBtn: false,
                serviceList: [],
                resetType: [],
                temp: [],
                bridge: {},
                accountnum: 0,
                imgUrl: base + '/static/no-sevice.png',
                loginData: '',
                remark: ''
            }
        },
        computed: {
            ...mapState('servicefee', [
                'serviceType',
                'accountType',
                'orderServiceFeeCode'
            ]),
            ...mapState('order', [
                'order',
                'orderInfo',
                'orderNo'
            ]),
            ...mapState('homepage', [
                'loginInfo'
            ])
        },
        created() {
            this.price = this.order.carOrderInfoVoList[0].carOrderDetailInfoList[0].actualSalesPrice
            this.getOrderInfo()
            this.getLoginInfo()
        },
        methods: {
            getLoginInfo: function() {
                const $this = this
                this.$store.dispatch('homepage/getLoginInfo', (res) => {
                    if (res.data.code == "success") {
                        this.loginData = this.loginInfo
                        $this.loginInfo.postnTypes.forEach((i) => {
                            if (i == config.root.scPostTypeCode) {
                                $this.judge = false
                            }
                        })
                    }
                })
            },
            //查询订单相关
            getOrderInfo: function() {
                const $this = this
                this.$store.dispatch('order/getOrderInfo', {
                    poros: {
                        orderNo: $this.$route.params.code,
                        allSubOrderFlag: config.qureySubOrderInfo.yes
                    },
                    callBack: function(msg) {
                        if (msg.data.code == "success") {
                            let data = msg.data.obj.orderServiceFeeInfoVoList
                            data.forEach(function(value, index) {
                                let obj = {};
                                let remark = JSON.parse(value.remark)
                                $this.remark = remark.remark;
                                obj.orderServiceFeeCode = value.orderServiceFeeCode
                                obj.serviceCode = value.serviceFeeTypeCode
                                obj.serviceName = value.serviceFeeTypeName
                                obj.orderNo = value.orderNo;
                                obj.accountTypeCode = value.accountTypeCode;
                                obj.accountTypeName = remark.accountTypeName;
                                obj.actualServiceFee = value.actualServiceFee;
                                obj._actualServiceFee = value.actualServiceFee;
                                obj.isDeleted = value.isDeleted
                                obj.agentBusinessFlag = value.agentBusinessFlag == '1' ? true : false;
                                $this.serviceList.push(obj);
                            })           
                            $this.showLoading = false;
                        }
                    }
                })
            },
            //账类相关
            //显示select
            showselect(num) {
                if (this.judge) {
                    return
                }
                if (!this.editBtn) {
                    this.accountnum = num
                    this.$refs.getType.getAccountType(config.ref.accountType)
                }
            },
            changeStatus: function(type) {

                this.listselectShow = type
            },
            //选中的账类值
            dataInfo(val, num) {
                //add by wangjingliang  
                let valValue = JSON.parse(val.val);
                if(val.val && valValue.cleanPrice === '0'){
                    this.serviceList[num].actualServiceFee = 0;
                }else{
                     this.serviceList[num].actualServiceFee = this.serviceList[num]._actualServiceFee
                }
                
                this.serviceList[num].accountTypeCode = val.value;
                this.serviceList[num].accountTypeName = val.text;


                
            },
            //关闭账类下拉框
            closeSelect() {
                this.listselectShow = false
            },
            //关闭select
            cancelselect() {
                this.listmodelShowOne = false
            },
            more() {
                if (this.judge) {
                    return
                }
                this.submit()
            },
            //关闭modal
            cancel() {
                this.listmodelShow = false
            },
            submit: function() {
                if (this.type == "add") {
                    this.saveData()
                } else(
                    this.saveData()
                )
            },
            //编辑服务费
            removeFee: function(num) {
                if (this.judge) {
                    return
                }
                const $this = this
                let params = []
                let obj = JSON.parse(JSON.stringify($this.serviceList[num]))
                MessageBox.confirm(config.alertInfo.deletedFee).then(action => {
                    if (obj.isDeleted == '0') {
                        obj.isDeleted = '1'
                        obj.agentBusinessFlag = obj.agentBusinessFlag == true ? '1' : '0';
                        params.push(obj)
                        this.$store.dispatch('servicefee/addServiceFee', {
                            poros: params,
                            callBack: function(msg) {
                                if (msg.data.code == 'success') {
                                    let len = $this.serviceList.length
                                    $this.serviceList.splice(num, 1);
                                    if (len - 1 == $this.serviceList.length) {
                                        Toast({
                                            message: config.alertInfo.success,
                                            position: 'top'
                                        })
                                    }
                                }
                            }
                        })
                    } else {
                        let len = $this.serviceList.length
                        $this.serviceList.splice(num, 1);
                        if (len - 1 == $this.serviceList.length) {
                            Toast({
                                message: config.alertInfo.success,
                                position: 'top'
                            })
                        }
                    }
                })
            },
            //保存服务费
            saveData: function() {
                const $this = this;
                let params = [];
                let flag = true;
                let la = 1
                $this.serviceList.forEach(function(value, index) {
                    if (!value.actualServiceFee && value.actualServiceFee != 0) {
                        flag = false
                    }
                    let obj = {};
                    obj.orderServiceFeeCode = value.orderServiceFeeCode
                    obj.serviceFeeTypeCode = value.serviceCode
                    obj.serviceFeeTypeName = value.serviceName
                    obj.accountTypeCode = value.accountTypeCode;
                    obj.orderNo = value.orderNo;
                    obj.actualServiceFee = value.actualServiceFee;
                    obj.businessCost = value.costPrice;
                    obj.taxRate = value.taxRate;
                    obj.agentBusinessFlag = value.agentBusinessFlag == true ? '1' : '0';
                    let remark = {
                        serviceName: value.serviceName,
                        accountTypeName: value.accountTypeName,
                        remark: $this.remark,
                    }
                    obj.remark = JSON.stringify(remark)
                    params.push(obj)
                })
                if (flag) {
                    this.$store.dispatch('servicefee/addServiceFee', {
                        poros: params,
                        callBack: function(msg) {
                            if (msg.data.code == 'success') {
                                $this.serviceList = [];
                                let data = msg.data.obj
                                data.forEach(function(value, index) {
                                    let obj = {};
                                    let remark = JSON.parse(value.remark)
                                    obj.serviceName = remark.serviceName;
                                    obj.orderNo = value.orderNo;
                                    obj.accountTypeCode = value.accountTypeCode;
                                    obj.accountTypeName = remark.accountTypeName;
                                    obj.actualServiceFee = value.actualServiceFee;
                                    obj.agentBusinessFlag = value.agentBusinessFlag == '1' ? true : false;
                                    $this.serviceList.push(obj);
                                })
                                $this.editBtn = true;
                                $this.savesbtn = false;
                                Toast({
                                    message: config.alertInfo.success,
                                    position: 'top'
                                })
                                $this.$router.replace({
                                    path: `/order/${$this.order.orderNo}`
                                })
                            }
                        }
                    })
                } else {
                    Toast({
                        message: config.alertInfo.serveFee,
                        position: 'top'
                    })
                }
            },
            //显示madal
            showModellist() {
                if (this.judge) {
                    return
                }
                const $this = this
                $this.bridge = {}
                $this.serviceList.forEach(function(item, index) {
                    $this.bridge[item.serviceCode] = true
                })
                this.$store.dispatch('servicefee/getServiceType', {
                    poros: {
                        refCode: config.ref.getServiceType
                    },
                    callBack: function(msg) {
                        $this.temp = [];
                        let typeInfo = JSON.parse(JSON.stringify($this.serviceType));
                        typeInfo.forEach(function(value, index) {
                            if (!$this.bridge[value.value]) {
                                $this.temp.push(value)
                            }
                        })
                        $this.listmodelShow = true
                    }
                })
            },
            //选中服务费类型
            chooseItem(val, num) {               
                this.temp[num].isShow = !this.temp[num].isShow
            },
            //确定选中的服务费
            pitchon: function() {
                const $this = this
                $this.resetType = [];

                $this.temp.forEach(function(value, index) {                   
                    if (value.isShow == true) {
                        let num = value.val.indexOf(',')
                        let num2 = value.val.indexOf(',', num + 1)

                        let obj = {};
                        obj.orderServiceFeeCode = '';
                        obj.serviceCode = value.value;
                        obj.serviceName = value.text;
                        obj.orderNo = $this.$route.params.code;
                        obj.accountTypeCode = 'normalSale';
                        obj.accountTypeName = '正常销售';
                        obj.agentBusinessFlag = true;
                        if(num < 0) {

                        } else {
                            if(num2 < 0) {
                                obj.actualServiceFee = value.val.slice(num + 1, value.val.length);
                                obj._actualServiceFee = value.val.slice(num + 1, value.val.length);
                            }else {
                                obj.actualServiceFee = value.val.slice(num + 1, num2);
                                obj._actualServiceFee = value.val.slice(num + 1, num2);
                            }
                        }
                        
                        obj.businessCost = value.val.slice(0, num);
                        // obj.taxRate = value.val.slice(num2 + 1, num2 + 5);
                        $this.resetType.push(obj);
                    }
                })
                this.cancel()
                this.serviceList = this.serviceList.concat($this.resetType)
                let storeParams = {
                    serviceCodes: [],
                    onOffFlag: 1,
                }


                if(this.serviceList.length > 0) {
                    this.serviceList.forEach(element => {
                        storeParams.serviceCodes.push(element.serviceCode)
                    })
                    api.clearingsettlement.servicefee.getServiceFeeManage(storeParams, (res) => {
                        if(res.data.code === 'success') {
                            let tempArr = res.data.obj
                            for(let i = 0; i< tempArr.length; i++) {
                                for(let j = 0; j< this.serviceList.length; j++) {
                                    if(tempArr[i].serviceCode === this.serviceList[j].serviceCode && this.serviceList[j].accountTypeCode =='normalSale') {
                                        //下面一行注释掉 不知做啥的，临时解决方案  add by wangjingliang
                                        $this.$set(this.serviceList[j], 'actualServiceFee', tempArr[i].salePrice)
                                         $this.$set(this.serviceList[j], '_actualServiceFee', tempArr[i].salePrice)
                                        // this.serviceList[j].taxRate = tempArr[i].taxRate
                                    }
                                }
                            }
                        }



                    })
                }
                if (this.serviceList.length != '0') {
                    $this.savesbtn = true;
                }
            },
        },
    }
</script>
<style lang="scss" scoped>
    .service-color {
        color: rgb(51, 51, 51);
    }
    .cell-item .input-joly {
        width: 25%;
    }
    .service-input::-webkit-input-placeholder {
        /* placeholder颜色  */
        color: rgba(189, 199, 209, 0.5);
        /* placeholder字体大小  */
        font-size: remp(13);
        /* placeholder位置  */
        text-align: right;
    }
    .no-sevice {
        margin-top: 30%;
    }
    .contentItems {
        position: relative;
        overflow: hidden;
        padding-bottom: .8rem;
    }
    .contentItems .itemContainer {
        position: relative;
        box-sizing: border-box;
        border-bottom: remp(5) solid #efefef;
    }
    .contentItems .itemContainer:first-child {
        border-top: remp(10) solid #efefef;
        border-bottom: remp(5) solid #efefef;
    }
    .contentItems .remark {
        border-top: remp(5) solid #efefef !important;
    }
    .contentItems .itemContainer .serviceup {
        position: relative;
        height: remp(40);
    }
    .contentItems .deleted-fee {
        text-align: center;
        border: 1px solid rgba(254, 56, 36, 0.9);
        border-radius: remp(4);
        color: rgba(254, 56, 36, 0.9);
        position: absolute;
        right: 5%;
        top: 50%;
        transform: translateY(-50%);
        width: 12%;
        padding: remp(3) 0;
    }
    .contentItems .serviceup .boxcheck {
        box-sizing: border-box;
        text-align: center;
        position: absolute;
        right: 25%;
        top: 50%;
        transform: translateY(-50%);
        width: 23%;
    }
    .contentItems .cell-item {
        width: 50%;
        float: left;
    }
    .contentItems .cell-item .cell {
        border: none !important;
    }
    .contentItems .cell-item .cell .title {
        position: absolute;
        z-index: 9;
        transform: translateY(-50%);
    }
    .mint-radiolist {
        float: right;
    }
    .mint-radiolist div,
    a {
        border: none !important;
        background-size: 0 !important;
        font-size: remp(13) !important;
        padding: 0 !important;
    }
    .mint-radiolist .mint-cell {
        display: inline-block !important;
    }
    .hovers {
        background-color: rgb(0, 140, 238) !important;
        color: #fff !important;
    }
    .listmodelfee {
        position: fixed;
        -webkit-transform: translateZ(0);
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .4);
        z-index: 100;
    }
    .listmodelfee>.modelContainer {
        box-sizing: border-box;
        position: absolute;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        width: remp(320);
        border-radius: remp(8);
        overflow: hidden;
        z-index: 9999;
    }
    .listmodelfee>.modelContainer .title {
        position: relative;
        box-sizing: border-box;
        width: remp(320);
        height: remp(44);
        line-height: remp(44);
        background-color: rgb(54, 172, 254)
    }
    .rightAngle {
        width: remp(22.5);
        height: remp(22);
        border-radius: 50%;
        position: absolute;
        top: 0;
        right: 0;
        background-color: rgb(255, 255, 255);
        transform: rotate(45deg);
        text-align: center;
        line-height: remp(22);
        z-index: 9999;
    }
    .rightAngle>i {
        font-size: remp(15);
        color: rgba(0, 0, 0, 0.1);
    }
    .listmodelfee>.modelContainer ul {
        box-sizing: border-box;
        height: remp(206);
        padding: remp(15) remp(22);
        overflow-y: auto;
    }
    .listmodelfee>.modelContainer ul li {
        width: remp(125);
        height: remp(31);
        line-height: remp(31);
        text-align: center;
        box-sizing: border-box;
        color: rgb(126, 131, 135);
        margin-bottom: remp(10);
        background-color: rgb(240, 242, 245)
    }
    .listmodelfee>.modelContainer ul li:nth-child(2n+1) {
        float: left;
    }
    .listmodelfee>.modelContainer ul li:nth-child(2n) {
        float: right;
    }
    .listmodelfee>.modelContainer .serviceFeeBtn {
        padding: remp(0) remp(22);
        padding-bottom: remp(15);
    }
    .listmodelfee>.modelContainer .serviceFeeBtn>div {
        width: remp(275);
        height: remp(39);
        line-height: remp(39);
        border-radius: remp(4);
        font-size: remp(14);
        color: #fff;
        background: -webkit-linear-gradient(left, rgb(0, 140, 238), rgb(54, 172, 254));
        background: -o-linear-gradient(right, rgb(0, 140, 238), rgb(54, 172, 254));
        background: -moz-linear-gradient(right, rgb(0, 140, 238), rgb(54, 172, 254));
        background: linear-gradient(right, rgb(0, 140, 238), rgb(54, 172, 254));
    }
    .currentPrice {
        width: 100%;
        height: remp(40);
        line-height: remp(40);
        box-sizing: border-box;
        background-color: rgb(255, 255, 255)
    }
    .currentPrice span:last-child {
        color: rgb(0, 140, 238)
    }
    .itemContainer>.border {
        border-top: none !important;
        border-bottom: 1px solid #ccc;
    }
    .itemContainer>div:last-child {
        border-bottom: none !important;
    }
    .remark {
        background-color: #ffffff;
        height: remp(80);
    }
    .remark>div:first-child {
        flex: 1;
        box-sizing: border-box;
    }
    .remark>div:last-child {
        flex: 3;
    }
    .remark>div:last-child input {
        width: 100%;
        text-align: left;
    }
    .remark>div:last-child textarea {
        width: 100%;
        height: remp(60);
        border: none;
    }
    .saveBtn {
        box-sizing: border-box;
        position: fixed;
        bottom: 0; // -webkit-transform: translate(-50% ,0);
        // transform: translate(-50%, 0);
        width: remp(375);
        padding: remp(0) remp(10);
        padding-bottom: remp(10);
    }
    .saveBtn>div {
        height: remp(50);
        line-height: remp(50);
        text-align: center;
        border-radius: remp(5);
        background-image: linear-gradient(90deg, #008cee 0%, #36acfe 100%);
        color: #ffffff;
        font-size: remp(18);
    }
    /deep/.serviceup>.cell-item>label>.title-joly>span{
        margin-left: remp(10); 
    }
    /deep/.serviceup>.cell-item>label>.input-joly{
        width: remp(50);
    }
</style>
