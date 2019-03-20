<template>
    <div>
        <page-header>
            <div slot>{{this.$route.query.id ? '编辑' : '新增'}}</div>
            <div slot="right" @click="remove">{{removeText}}</div>
        </page-header>
        <!--险种添加 主体-->
        <div class="wrap-group">
            <div class="group-member">
                <cell title="险种">
                    <input type="text" v-model="kindInsuranceData.insTypeName" @click="showInsuranceSelectType = !showInsuranceSelectType" placeholder="请选择商业险种" readonly>
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
        </div>
        <!--商业险种-->
        <div class="wrap-group">
            <!--商业险种-->
            <div class="group-member">
                <cell title="保额">
                    <input type="text" v-model="kindInsuranceData.actualInsuranceLimit"  @blur="blurInput('actualInsuranceLimit')" step="0.01" placeholder="请输入首年保额">
                    <span slot="right">元</span>
                </cell>
            </div>
            <div class="group-member">
                <cell title="保费">
                    <input type="text" v-model="kindInsuranceData.firstInsurancePrice" @blur="blurInput('firstInsurancePrice')" step="0.01" placeholder="请输入首年保保费">
                    <span slot="right">元</span>
                </cell>
            </div>
            <div class="group-member">
                <cell title="不计免赔">
                    <input type="text" v-model="kindInsuranceData.actualSdewPrice" @blur="blurInput('actualSdewPrice')" step="0.01" placeholder="请输入不计免赔金额">
                    <span slot="right">元</span>
                </cell>
            </div>
            <div class="group-member">
                <cell title="实价">
                    <input type="text" v-model="kindInsuranceData.actualFirstInsurancePrice" @blur="blurInput('actualFirstInsurancePrice')" step="0.01" placeholder="请输入商业险实价">
                    <span slot="right">元</span>
                </cell>
            </div>
            <div class="group-member">
                <cell title="账类">
                    <input type="text" v-model="kindInsuranceData.account" step="0.01" placeholder="请选择账类" readonly>
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
        </div>
        <!--确定按钮-->
        <button class="btn" @click="confirmData">确&nbsp;定</button>
        <!--弹层  保险公司选择-->
        <popup position="bottom" v-model="showInsuranceSelectType">
            <picker
                ref="picker"
                show-toolbar
                :columns="insuranceOrgSelectOption"
                @confirm="onConfirm"
                @cancel="showInsuranceSelectType = !showInsuranceSelectType"/>
        </popup>
    </div>
</template>
<script>
import Vue from 'vue';
import { mapState, mapActions } from 'vuex';
import { Picker, Popup, Toast } from 'vant';
//common
import api from 'common/api';
import config from 'common/config';
//components
import cell from 'components/cell';
import PageHeader from "components/header/PageHeader";
export default {
  components: {
    cell,
    Popup,
    Picker,
    PageHeader
  },
  data() {
    return {
        /**
         * 组件数据
         */
        showInsuranceSelectType: false, //选择保险公司弹层
        showInsuranceSelectFlag: '',  //选择保险公司弹层标识，用于区分是交强险的保险公司还是商业险的
        insuranceOrgSelectOption: [],   //保险公司数据
        removeText: '',
        /**
         * 页面级数据
         */
        kindInsuranceData: { //商业险险种新增，编辑用页面级数据
            actualInsuranceLimit: '', //保额
            firstInsurancePrice: '', //保费
            actualSdewPrice: '', //不计免赔
            actualFirstInsurancePrice: '', //实价
            insTypeName:'', //险种名称
            insTypeRefDetailCode: '', //险种组件code
            insuranceTypeCode: '', //险种code
            account: '正常销售', //账类名称
            insuranceMonth: '', //投保期数
            // accountCode: '' //账类code
        }
    }
  },
  computed: {
    ...mapState('newInsurance', [
        'orderData',
        'orderType'
    ])
  },
  mounted() {
    this.initPage();
  },
  methods: {
    initPage(){
        this.getKindsOfBusiness();
        this.getBusinessDetail(); //获取当前险种信息
        if(!this.$route.query.id){
            this.removeText = '清空'
        }else{
            this.removeText = '删除'
        }
    },
    // 通过coCode 获得保险公司的商业险险种
    getKindsOfBusiness() {
        let option = {
            pageNums:1000,
            pageStart:1,
            coCode: this.$route.query.insuranceOrgCode
        }
        api.insurance.getKindsofInsurance(option, (res) => {
            if(res.data.code === 'success') {
                let length = res.data.obj.length;
                for(let i = 0; i < length; i ++){
                    this.insuranceOrgSelectOption.push({
                        text: res.data.obj[i].insTypeName,
                        insTypeRefDetailCode: res.data.obj[i].insTypeRefDetailCode
                    })
                }
            }
        })
    },
    //获取当前险种信息
    getBusinessDetail(){
        //this.orderData =======> store 当前保险单信息
        //这里判断是否是新增，如果id为空，那么就是新增
        if(this.orderData.currentInsuranceData.insuranceTypeCode !== undefined){
            this.kindInsuranceData.actualInsuranceLimit = this.orderData.currentInsuranceData.actualInsuranceLimit.toFixed(2);//保额
            this.kindInsuranceData.firstInsurancePrice = this.orderData.currentInsuranceData.firstInsurancePrice.toFixed(2);//保费
            this.kindInsuranceData.actualSdewPrice = this.orderData.currentInsuranceData.actualSdewPrice.toFixed(2);//不计免赔
            if(this.orderData.currentInsuranceData.actualFirstInsurancePrice !== ''){ //如果保险明细的实价存在那么直接 赋值
                this.kindInsuranceData.actualFirstInsurancePrice = this.orderData.currentInsuranceData.actualFirstInsurancePrice.toFixed(2);
            }else if(this.kindInsuranceData.firstInsurancePrice !== '' && this.kindInsuranceData.actualSdewPrice !== ''){ //如果保费和不计免赔的值存在则相加等于实价
                this.kindInsuranceData.actualFirstInsurancePrice = (this.orderData.currentInsuranceData.firstInsurancePrice + this.orderData.currentInsuranceData.actualSdewPrice).toFixed(2);//实价
            }else{
                this.kindInsuranceData.actualFirstInsurancePrice = '';
            }
            this.kindInsuranceData.insTypeName = this.orderData.currentInsuranceData.insuranceTypeName;//险种名称
            this.kindInsuranceData.insTypeRefDetailCode = this.orderData.currentInsuranceData.insuranceOrderDetailCode;//险种code
            this.kindInsuranceData.insuranceTypeCode = this.orderData.currentInsuranceData.insuranceTypeCode;
            //this.kindInsuranceData.account = this.orderData.currentInsuranceData.accountTypeName;//账类名称
        }
        this.kindInsuranceData.insuranceMonth = this.orderData.fieldObj.business.insuranceMonth; //投保期数
    },
    //确认提交
    confirmData(){
        let orderData = JSON.parse(JSON.stringify(this.orderData)), //来自于VUEX
            options = {
                businessPriceModelType: 0,
                orderNo: this.$route.query.orderNo,
                insuranceOrderNo: this.$route.query.insuranceOrderNo,
                detailList: []
            };
         console.log(orderData);
        //添加商业险明细
        if(this.orderData.insuranceDetailTableData.length > 0){
            for(let i = 0; i < this.orderData.insuranceDetailTableData.length; i ++){
                if(this.orderData.insuranceDetailTableData[i].insuranceTypeCode !== this.kindInsuranceData.insuranceTypeCode){
                    orderData.insuranceDetailTableData[i].insuranceOrgName = orderData.fieldObj.business.insuranceOrgName
                    orderData.insuranceDetailTableData[i].insuranceOrgCode = orderData.fieldObj.business.insuranceOrgCode
                    orderData.insuranceDetailTableData[i].insuranceMonth = orderData.fieldObj.business.insuranceMonth
                    orderData.insuranceDetailTableData[i].agentBusinessFlag = (orderData.insuranceDetailTableData[i].agentBusinessFlag ? 1: 0)
                    options.detailList.push(orderData.insuranceDetailTableData[i]);
                }
            }
        }
        //添加交强险
        if(this.orderData.fieldObj.strongInsurance.insuranceOrgCode !== ''){
            orderData.fieldObj.strongInsurance.agentBusinessFlag = (orderData.fieldObj.strongInsurance.agentBusinessFlag ? 1: 0)
            options.detailList.push(orderData.fieldObj.strongInsurance);
        }
        //添加车船税
        if(this.orderData.fieldObj.vehicleAndVesselTax.insuranceOrgCode !== ''){
            options.detailList.push(orderData.fieldObj.vehicleAndVesselTax);
        }
        //格式化参数
        options.detailList.push({
            actualInsuranceLimit: this.kindInsuranceData.actualInsuranceLimit, //保额
            firstInsurancePrice: this.kindInsuranceData.firstInsurancePrice, //保费
            actualSdewPrice: this.kindInsuranceData.actualSdewPrice, //不计免赔
            actualFirstInsurancePrice: this.kindInsuranceData.actualFirstInsurancePrice, //实价
            insuranceTypeName: this.kindInsuranceData.insTypeName, //险种名称
            insuranceTypeCode: this.kindInsuranceData.insuranceTypeCode, //险种code insTypeRefDetailCode
            insuranceOrderDetailCode: this.kindInsuranceData.insTypeRefDetailCode,
            insuranceOrgCode: orderData.fieldObj.business.insuranceOrgCode, //投保公司code
            insuranceOrgName: orderData.fieldObj.business.insuranceOrgName, //投保公司name
            insuranceOrderNo: this.$route.query.insuranceOrderNo,
            agentBusinessFlag: (orderData.fieldObj.business.agentBusinessFlag ? 1: 0),
            orderNo: this.$route.query.orderNo,
            insuranceMonth: orderData.fieldObj.business.insuranceMonth, //投保期数
            account: '正常销售', //账类名称
        });

        if(this.orderData.fieldObj.hasOwnProperty('business')){ //确认当前存在商业险 (为防止用户在本页直接刷新，导致vuex中的值被清除)
            if(this.checkData()){
                this.subMitData(options);
            }else{
                Toast('请完善信息');
            }
        }else{
            Toast('获取商业险信息失败，请返回上一个，然后点击添加险种再试');
        }
    },
    //提交当前数据
    subMitData(options){
        //对应 orderType =========> store 当前保险单状态 类型：boolean 更新状态: true, 新增状态: false
        if(this.orderType){ //更新
            api.insurance.changeInsurance(options, (res) => {
                if(res.data.code === 'success'){
                    this.$router.go(-1)
                }
            });
        }else{ //新增
            api.clearingsettlement.insurance.addInsurancePlan(options, (res) => {
                if(res.data.code === 'success'){
                    this.$router.go(-1)
                }
            })
        }
    },
    //清空删除所选
    remove(){
        //对应 orderType =========> store 当前保险单状态 类型：boolean 更新状态: true, 新增状态: false
        //更新既是删除状态
        if(this.$route.query.id && this.$route.query.id !== ''){ //是否是删除
            let options = {
                insuranceOrderDetailCode: this.kindInsuranceData.insTypeRefDetailCode,
                orderNo: this.$route.query.orderNo
            }
            api.insurance.deleteInsuranceInfoByOrderNoAndInsuranceOrderDetail(options, (res) => {
            	if(res.data.code === 'success'){
            		this.$router.go(-1)
            	}
            });
        }else{
            this.reseatInfo();
        }
    },
    //清楚填写的值
    reseatInfo(){
        this.kindInsuranceData.actualInsuranceLimit = '';
        this.kindInsuranceData.firstInsurancePrice = '';
        this.kindInsuranceData.actualSdewPrice = '';
        this.kindInsuranceData.actualFirstInsurancePrice = '';
        this.kindInsuranceData.insTypeName = '';
        this.kindInsuranceData.insTypeRefDetailCode = '';
        this.$refs.picker.setColumnIndex(0, this.insuranceOrgSelectOption[0]);
    },
    //选择保险公司 picker: van-picker组件选择对应的数据，类型: Object
    onConfirm(picker){
        this.kindInsuranceData.insTypeName = picker.text; //险种名称
        this.kindInsuranceData.insuranceTypeCode = picker.insTypeRefDetailCode;// 险种CODE
        this.showInsuranceSelectType = false;
    },
    //检查数据完整性
    checkData(){
        let result = true;
        for(let item in this.kindInsuranceData){
            if(this.kindInsuranceData[item] === '' && item !== 'insTypeRefDetailCode'){
                result = false;
            }
        }
        return result;
    },
    //失焦后处理,加上小数点 name对应需要处理的属性名
    blurInput(name){
        if(this.kindInsuranceData[name] === ''){
            return;
        }
        let result = this.kindInsuranceData[name] * 1;
        this.kindInsuranceData[name] = result.toFixed(2);
        //如果当前不是手动输入实价，并且保费与不计免赔金额不为空，那么自动计算实价
        if(name !== 'actualFirstInsurancePrice' && this.kindInsuranceData.actualSdewPrice !== '' && this.kindInsuranceData.firstInsurancePrice !== ''){
            this.kindInsuranceData.actualFirstInsurancePrice = ((this.kindInsuranceData.actualSdewPrice * 1) + (this.kindInsuranceData.firstInsurancePrice * 1)).toFixed(2);
        }
    }
  }
};
</script>
<style lang="scss" scoped>
    /*修正vant组件样式 */
    /*复选框*/
    .van-picker{
        .van-picker__cancel, .van-picker__confirm{
            font-size: remp(16);
            font-weight: normal;
        }
    }
    .btn{
        width: 95%;
        height: remp(44);
        line-height: remp(44);
        margin: remp(15) auto;
        display: block;
        font-size: remp(18);
        text-align: center;
        border-radius: remp(5);
        color: #fff;
        background-image: linear-gradient(90deg,#008cee,#36acfe);
        background-image: -webkit-gradient(linear,left top,right top,from(#008cee),to(#36acfe));
    }
</style>
