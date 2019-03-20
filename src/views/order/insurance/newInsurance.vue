<template>
    <div class="container">
        <page-header>
            <div slot>报价单-保险</div>
            <div slot="right" v-if="canEdit" @click="deleteInsuranceByOrder">清空</div>
        </page-header>
        <!--交强险-->
        <div class="wrap-group">
            <div class="wrap-title clearfix"><label class="fl">交强险</label>
                <div class="fr">
                    <van-checkbox class="check-lable" v-model="fieldObj.strongInsurance.agentBusinessFlag">代收</van-checkbox>
                </div>
            </div>
            <!--交强险保险公司-->
            <div class="group-member">
                <cell title="保险公司">
                    <input type="text" v-model="fieldObj.strongInsurance.insuranceOrgName" @click="showInsuranceSelect('strongInsurance')" placeholder="请选择交强险保险公司" readonly>
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
            <div class="group-member">
                <cell title="投保期数">
                    <input type="text" v-model="fieldObj.strongInsurance.insuranceMonth" :readonly="!canEdit" placeholder="请输入交强险投保期数">
                    <span slot="right">个月</span>
                </cell>
            </div>
            <div class="group-member">
                <cell title="总价">
                    <input type="text" step="0.01" v-model="fieldObj.strongInsurance.firstInsurancePrice" :readonly="!canEdit" placeholder="总价金额">
                    <span slot="right">元</span>
                </cell>
            </div>
            <div class="group-member">
                <cell title="实价">
                    <input type="text" step="0.01" v-model="fieldObj.strongInsurance.actualFirstInsurancePrice" :readonly="!canEdit" placeholder="实价金额">
                    <span slot="right">元</span>
                </cell>
            </div>
            <div class="group-member">
                <cell title="车船税总价">
                    <input type="text" step="0.01" v-model="fieldObj.vehicleAndVesselTax.actualFirstInsurancePrice" :readonly="!canEdit" placeholder="请输入车船税总价">
                    <span slot="right">元</span>
                </cell>
            </div>
        </div>
        <!--商业险-->
        <div class="wrap-group">
            <div class="wrap-title clearfix"><label class="fl">商业险</label>
                <div class="fr">
                    <van-checkbox class="check-lable" v-model="fieldObj.business.agentBusinessFlag">代收</van-checkbox>
                </div>
            </div>
            <!--商业险保险公司-->
            <div class="group-member">
                <cell title="保险公司">
                    <input type="text" v-model="fieldObj.business.insuranceOrgName" @click="showInsuranceSelect('business')" placeholder="请选择商业险保险公司" readonly>
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
            <div class="group-member">
                <cell title="投保期数">
                    <input type="text" v-model="fieldObj.business.insuranceMonth" :readonly="!canEdit" placeholder="请输入商业险投保期数">
                    <span slot="right">个月</span>
                </cell>
            </div>
            <!--总价  详细切换  tabType用于判断当前切换至总价还是详细，另用于隐藏和显示下面的总价个实价-->
            <div class="group-member flex">
                <div class="tab-main">
                    <a :class="['tab-item', {'cur': businessPriceModelType === 1}]" href="javascript:;" @click="switchModalType">总价</a>
                    <a :class="['tab-item', {'cur': businessPriceModelType === 0}]" href="javascript:;" @click="switchModalType">详细</a>
                </div>
                <!--tabType === ture展示实价-->
                <label v-if="businessPriceModelType === 0" class="text-main"><span class="pl05">实价</span><span class="price-text pr05">{{reducerBusinessTotalPrice()}}</span><span class="pr1" slot="right">元</span></label>
                <label v-else class="text-main"><span>预估总价</span><input type="text" step="0.01" v-model="fieldObj.business.actualFirstInsurancePrice" @blur="blurInput()" :readonly="!canEdit" placeholder="预估总价"><span slot="right">元</span></label>
            </div>
        </div>
        <!--险种明细表格-->
        <div class="insurance-detail-wrap">
            <table class="insurance-detail-table">
                <thead>
                    <tr>
                        <th>险种</th>
                        <th>保额(元)</th>
                        <th>保费(元)</th>
                        <th>不计免赔(元)</th>
                    </tr>
                </thead>
                <tbody v-if="insuranceDetailTableData.length > 0">
                    <tr v-for="(item, index) in insuranceDetailTableData" :key="index">
                        <td>
                            <!--编辑险种 businessPriceModelType === 0为详细模式 businessPriceModelType === 1为总价模式，总价模式下不可编辑明细及添加明细-->
                            <a v-if="businessPriceModelType === 0 && canEdit" @click="addKindInsurance(item)" href="javascript:;">{{item.insuranceTypeName}}</a>
                            <span v-else href="javascript:;">{{item.insuranceTypeName}}</span>
                        </td>
                        <td>{{item.actualInsuranceLimit.toFixed(2)}}</td>
                        <td>{{item.firstInsurancePrice.toFixed(2)}}</td>
                        <td>{{item.actualSdewPrice.toFixed(2)}}</td>
                    </tr>
                </tbody>
            </table>
            <!--添加险种 businessPriceModelType === 0为详细模式 businessPriceModelType === 1为总价模式，总价模式下不可编辑明细及添加明细-->
            <a v-if="businessPriceModelType === 0 && canEdit" class="add-btn" @click="addKindInsurance('')" href="javascript:;"><i class="icon iconfont icon-icon-tianjia"></i>&nbsp;添加详细险种</a>
            <span v-else class="add-btn" href="javascript:;"><i class="icon iconfont icon-icon-tianjia"></i>&nbsp;添加详细险种</span>
        </div>
        <!--热销方案、保险专员、保存-->
        <div class="bottom-control">
            <!--热销方案\保险专员-->
            <div class="program-wrap">
                <div v-if="canEdit" class="item" @click="hotPlan"><i class="icon iconfont icon-rexiaofangan"></i>
                    <p>热销方案</p>
                </div>
                <div v-if="isSc" class="item" @click="choseCanPushToAssist"><i class="icon iconfont icon-jinrongzhuanyuan"></i>
                    <p>保险专员</p>
                </div>
            </div>
            <!--报价状态 保险专员报价: wfStatus === 1; 销售顾问报价: wfStatus === 0; 待报价: hasSubmited === false; -->
            <div class="offer-type">
                <div class="item"><label>报价状态:</label>
                    <p>{{ hasSubmited ? (wfStatus == 1 ? '保险专员报价': '销售顾问报价') : '待报价' }}</p>
                </div>
            </div>
            <div :class="{ 'page-info-save': canEdit, 'page-info-save-disabled': !canEdit }" @click="submitPageInfo" href="javascript:;">保存</div>
        </div>
        <!--弹层  保险公司选择-->
        <van-popup position="bottom" v-model="showInsuranceSelectType">
            <van-picker show-toolbar :columns="insuranceOrgSelectOption" @confirm="onConfirm" @cancel="showInsuranceSelectType = !showInsuranceSelectType" />
        </van-popup>
        <!--弹层 推送专员-->
        <modal ref="insuranceSpec" :confirmDisplay="false" :title="'提醒'">
            <div class="insurance-content">
                <div class="w flex dialogText">
                    是否推送保险专员协助报价?
                </div>
            </div>
            <div class="insurance-footer" slot="footer">
                <a class="close" @click="closeCanPushToAssistModal">取消</a>
                <a @click="pushInsuranceWbInfo">确认</a>
            </div>
        </modal>
    </div>
</template>
<script>
    import Vue from 'vue';
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex';
    import {
        Picker,
        Popup,
        Checkbox,
        Toast
    } from 'vant';
    //common
    import api from 'common/api';
    import config from 'common/config';
    import {
        getRefDetail
    } from 'common/com-api';
    //components
    import modal from 'components/modal';
    import cell from 'components/cell';
    import PageHeader from "components/header/PageHeader";
    //针对当前页面的依赖拆分
    import lib from './lib/lib';
    //USE
    Vue.use(Checkbox).use(Popup).use(Picker);
    //获取当前岗位类型
    const SC_POST_TYPE_CODE = config.root.scPostTypeCode
    const SM_POST_TYPE_CODE = config.root.smPostTypeCode
    export default {
        components: {
            cell,
            modal,
            PageHeader
        },
        data() {
            return {
                /**
                 * 组件用数据
                 */
                wfStatus: '', //保险报价状态
                hasSubmited: false, //待报价其实就是新建的订单
                confirmDisplay: false, //推送专员弹层状态
                tabType: true, //tab切换
                showInsuranceSelectType: false, //选择保险公司弹层
                showInsuranceSelectFlag: '', //选择保险公司弹层标识，用于区分是交强险的保险公司还是商业险的
                insuranceOrgSelectOption: [], //保险公司数据
                businessPriceModelType: 0, //商业险总价及明细类型 总价: 1, 详细: 0
                businessInsuranceTypeCode: '', //总价模式时商业险种名称
                businessInsuranceTypeName: '', //总价模式时商业险种CODE
                businessTotalPrice: '', //商业险明细累加总和，仅用户展示
                /**
                 * 页面级数据
                 */
                /*页面公用属性 */
                insuranceOrderNo: '', //当前保险订单号
                orderNo: '', //订单号
                carCode: '', //车型code
                isOrderEditType: true, //判断当前保险单是否可编辑
                //页面保险数据，仅用于展示,由于该数据主体内容分交强险及商业险两块，基本公用，所以其余部分由computed进行组合
                fieldObj: {
                    strongInsurance: { //交强险
                        actualFirstInsurancePrice: '', //实价
                        firstInsurancePrice: '', //总价
                        insuranceMonth: '', //投保期数
                        insuranceOrgCode: '', //保险公司code
                        insuranceOrgName: '', //保险公司名称
                        agentBusinessFlag: 0, //代收标识
                        orderNo: this.$route.query.orderNo,
                        insuranceOrderDetailCode: '',
                        insuranceTypeCode: 'strongInsurance', //险种类型
                    },
                    vehicleAndVesselTax: { //车船税
                        actualFirstInsurancePrice: '', //实价
                        firstInsurancePrice: '', //总价
                        insuranceMonth: '', //投保期数
                        insuranceOrgCode: '', //保险公司code
                        insuranceOrgName: '', //保险公司名称
                        agentBusinessFlag: 0, //代收标识
                        orderNo: this.$route.query.orderNo,
                        insuranceOrderDetailCode: '', //
                        insuranceTypeCode: 'vehicleAndVesselTax', //险种类型
                    },
                    business: { //商业险
                        actualFirstInsurancePrice: '', //实价
                        insuranceOrderDetailCode: '', //商业险CODE
                        insuranceMonth: '', //投保期数
                        insuranceOrgCode: '', //保险公司code
                        insuranceOrgName: '', //保险公司名称
                        agentBusinessFlag: 0, //代收标识
                        orderNo: this.$route.query.orderNo,
                        insuranceTypeCode: '', //险种类型
                    }
                },
                //险种明细表格数据
                insuranceDetailTableData: [],
                //
            }
        },
        watch: {
            businessPriceModelType(val, oldVal) {
                if (val === 1) {
                    this.fieldObj.business.insuranceTypeCode = 'commercialAllInsurance';
                }
            },
            fieldObj: {
                handler: function(val, oldVal) {
                    this.fieldObj.vehicleAndVesselTax.firstInsurancePrice = val.vehicleAndVesselTax.actualFirstInsurancePrice;
                    this.fieldObj.vehicleAndVesselTax.insuranceMonth = val.strongInsurance.insuranceMonth;
                },
                deep: true
            }
        },
        computed: {
            //这个值是为了添加热选保险方案时用的
            ...mapState('order', [
                'isSc'
            ]),
            ...mapState('insurance', [
                'tempJiao',
                'tempBusi',
                'tablelist'
            ]),
            ...mapState('newInsurance', [
                'orderType',
                'orderData',
                'changeInsurancePlanStatus'
            ]),
            ...mapGetters('order', [
                'isOrderCanEdit'
            ]),
            canEdit: function() {
                let _this = this
                return (_this.isSc && _this.isOrderCanEdit)
            }
        },
        mounted() {
            this.initPage();
        },
        methods: {
            ...mapActions('order', [
                'getUserPermissionsInfo'
            ]),
            ...mapActions('newInsurance', [
                'changeInsurance',
                'setOrderData',
                'setOrderType' //判断当前是否是新建的保险单（该状态用于在页面保存保险单时判断执行 ’新增‘ 还是 ’更新‘ 方法）
            ]),
            //初始化页面
            initPage() {
                //初始化时候需要从路由携带这两个值，用于后续的请求，如果这两个值不存在则不能进行下去
                if (this.$route.query.carCode && this.$route.query.orderNo) {
                    this.carCode = this.$route.query.carCode; //车型code
                    this.orderNo = this.$route.query.orderNo; //订单号
                } else {
                    Toast('订单号或车型CODE未找到');
                    return false;
                }
                //获取保险公司
                this.queryCompanyInfoByCodesAndPagination();
                //验证订单是否可以编辑
                this.checkOrderInfoeidtType();
                //获取当前保险订单信息
                this.getOrderInfo();
                //获取登录权限
                this.getUserPermissionsInfo()
                getRefDetail('commercialAllInsurance', (res) => {
                    this.businessInsuranceTypeCode = 'commercialAllInsurance';
                    this.businessInsuranceTypeName = res.refDetailName;
                })
            },
            //初始化检查VUE内的缓存信息，用于热销方案选择后跳回本页面时使用
            initDataForVuex() {
                //交强险
                if (this.tempJiao.actMoney !== undefined) {
                    this.fieldObj.strongInsurance.insuranceMonth = 12;
                    this.fieldObj.strongInsurance.actualFirstInsurancePrice = this.tempJiao.actMoney;
                    this.fieldObj.strongInsurance.firstInsurancePrice = this.tempJiao.totalMoney; //总价
                    this.fieldObj.strongInsurance.insuranceOrgCode = this.fieldObj.vehicleAndVesselTax.insuranceOrgCode = this.tempJiao.valueCode; //保险公司code
                    this.fieldObj.strongInsurance.insuranceOrgName = this.fieldObj.vehicleAndVesselTax.insuranceOrgName = this.tempJiao.valueJiao; //保险公司名称
                }
                this.fieldObj.vehicleAndVesselTax.actualFirstInsurancePrice = this.tempJiao.boatCarMoney
                //商业险
                if (this.tempBusi.realMoney !== undefined) {
                    this.fieldObj.business.insuranceMonth = 12;
                    this.fieldObj.business.insuranceOrgCode = this.tempBusi.valueCode; //保险公司code
                    this.fieldObj.business.insuranceOrgName = this.tempBusi.valueBusiness; //保险公司名称
                    //this.fieldObj.business.actualFirstInsurancePrice = this.tempBusi.total; //商业险总价
                }
                //商业险明细添加
                if (this.tablelist.length > 0) {
                    let result = [],
                        length = this.tablelist.length;
                    for (let i = 0; i < length; i++) {
                        result.push({
                            actualFirstInsurancePrice: this.tablelist[i].money + this.tablelist[i].no, //保费 + 不计免赔
                            insuranceTypeName: this.tablelist[i].name, //险种名称
                            actualInsuranceLimit: this.tablelist[i].limit, //保额
                            firstInsurancePrice: this.tablelist[i].money, //保费
                            actualSdewPrice: this.tablelist[i].no, //不计免赔
                            insuranceTypeCode: this.tablelist[i].insuranceTypeCode, //险种code
                            insuranceOrgCode: this.tempBusi.valueCode, //对应险种的保险公司code
                            insuranceOrgName: this.tempBusi.valueBusiness, //对应险种的保险公司name
                            insuranceMonth: 12, //对应商业险整体的一个投保时间，这里虽然插在了每个险种明细里，但是商业险的整体投保日期是统一的
                            orderNo: this.orderNo //当前这张保单的订单号
                        });
                    }
                    this.insuranceDetailTableData = result;
                }
            },
            /**
             * 页面初始化时需要执行的请求
             */
            //获取保险公司
            queryCompanyInfoByCodesAndPagination() {
                let option = {
                    pageStart: 1,
                    pageNums: 1000,
                    onOffFlag: '0'
                };
                api.insurance.getInsuranceCompany(option, (res) => {
                    if (res.data.code === 'success') {
                        let length = res.data.obj.list.length;
                        for (let i = 0; i < length; i++) {
                            this.insuranceOrgSelectOption.push({
                                text: res.data.obj.list[i].coName, //保险公司名称
                                value: res.data.obj.list[i].coCode,
                                coType: res.data.obj.list[i].coType
                            })
                        }
                    }
                })
            },
            //验证订单是否可以编辑
            checkOrderInfoeidtType() {
                api.clearingsettlement.order.queryOrderInfoVosByCodeFromDB({
                    orderNo: this.orderNo,
                    allSubOrderFlag: true,
                    ignoreDefault: 1
                }, (res) => {
                    if (res.data.code === 'success') {
                        if (res.data.obj.carOrderInfoVoList[0].wfStatus === -1) {
                            this.isOrderEditType = true
                        } else {
                            this.isOrderEditType = false
                        }
                    }
                })
            },
            //获取当前保险订单信息
            getOrderInfo() {
                // debugger
                if (this.changeInsurancePlanStatus) {
                    this.initDataForVuex()
                    this.changeInsurance(false)
                    api.insurance.getInfomationsByOrder({
                        orderNo: this.orderNo
                    }, (res) => {
                        if (res.data.code === 'success' && res.data.obj !== null) {
                            this.insuranceOrderNo = this.fieldObj.insuranceOrderNo = res.data.obj.insuranceOrderNo;
                            this.setOrderType(true);
                        } else {
                            this.setOrderType(false);
                        }
                    })
                } else {
                    api.insurance.getInfomationsByOrder({
                        orderNo: this.orderNo
                    }, (res) => {
                        if (res.data.code === 'success' && res.data.obj !== null) { //此处判断当前保险单是否已存在
                            // 此处判断当前保险单是否已存在
                            let length = res.data.obj.detailList.length;
                            this.hasSubmited = true;
                            this.wfStatus = res.data.obj.wfStatus; //保险报价状态
                            this.insuranceOrderNo = this.fieldObj.insuranceOrderNo = res.data.obj.insuranceOrderNo; //保险主单号
                            this.businessPriceModelType = res.data.obj.businessPriceModelType; //当前商业险模式是总价还是详细 详细: 0, 总价: 1
                            for (let i = 0; i < length; i++) {
                                //填充交强险
                                if (res.data.obj.detailList[i].insuranceTypeCode === 'strongInsurance') {
                                    this.fieldObj.strongInsurance.actualFirstInsurancePrice = res.data.obj.detailList[i].actualFirstInsurancePrice.toFixed(2);
                                    this.fieldObj.strongInsurance.firstInsurancePrice = res.data.obj.detailList[i].firstInsurancePrice ? res.data.obj.detailList[i].firstInsurancePrice.toFixed(2) : ''; //总价
                                    this.fieldObj.strongInsurance.insuranceMonth = this.fieldObj.vehicleAndVesselTax.insuranceMonth = res.data.obj.detailList[i].insuranceMonth; //投保期数
                                    this.fieldObj.strongInsurance.insuranceOrgCode = this.fieldObj.vehicleAndVesselTax.insuranceOrgCode = res.data.obj.detailList[i].insuranceOrgCode; //保险公司code
                                    this.fieldObj.strongInsurance.insuranceOrgName = this.fieldObj.vehicleAndVesselTax.insuranceOrgName = res.data.obj.detailList[i].insuranceOrgName; //保险公司名称
                                    this.fieldObj.strongInsurance.insuranceOrderNo = this.fieldObj.vehicleAndVesselTax.insuranceOrderNo = res.data.obj.insuranceOrderNo; // 保险单号
                                    this.fieldObj.strongInsurance.insuranceOrderDetailCode = res.data.obj.detailList[i].insuranceOrderDetailCode; //业务组件CODE
                                    this.fieldObj.strongInsurance.agentBusinessFlag = (res.data.obj.detailList[i].agentBusinessFlag == 1 ? true : false)
                                }
                                //填充车船税
                                if (res.data.obj.detailList[i].insuranceTypeCode === 'vehicleAndVesselTax') {
                                    this.fieldObj.vehicleAndVesselTax.actualFirstInsurancePrice = res.data.obj.detailList[i].actualFirstInsurancePrice.toFixed(2);
                                    this.fieldObj.vehicleAndVesselTax.insuranceOrderDetailCode = res.data.obj.detailList[i].insuranceOrderDetailCode; //业务组件CODE
                                }
                            }
                            //提取商业险数据
                            this.getBusinessData(res.data.obj.detailList);
                            //setOrderType ==========> VUEX 设置当前保险单状态 类型：boolean, 更新状态: true, 新增状态: false
                            //对应 orderType =========> store
                            this.setOrderType(true);
                        } else if (res.data.obj === null) { //说明保险单信息不存在
                            //setOrderType ==========> VUEX 设置当前保险单状态 类型：boolean, 更新状态: true, 新增状态: false
                            //对应 orderType =========> store
                            this.setOrderType(false);
                            //检查vuex中是否存在保险热销方案的值
                            this.initDataForVuex();
                        }
                    })
                }
            },
            //获取商业险的数据 公司来源信息this.fieldObj.business 商业险明细insuranceDetailTableData
            getBusinessData(data) {
                let result = [],
                    length = data.length;
                //提取商业险明细
                for (let i = 0; i < length; i++) {
                    if (data[i].insuranceTypeCode !== 'strongInsurance' && data[i].insuranceTypeCode !== 'vehicleAndVesselTax') {
                        this.fieldObj.business.insuranceMonth = data[i].insuranceMonth; //投保期数
                        this.fieldObj.business.insuranceOrgCode = data[i].insuranceOrgCode; //保险公司code
                        this.fieldObj.business.insuranceOrgName = data[i].insuranceOrgName; //保险公司名称
                        this.fieldObj.business.agentBusinessFlag = (data[i].agentBusinessFlag == 1 ? true : false) //代收标识
                    }
                    //预估总价
                    if (data[i].insuranceTypeCode === 'commercialAllInsurance') {
                        this.fieldObj.business.actualFirstInsurancePrice = data[i].actualFirstInsurancePrice.toFixed(2);
                        this.fieldObj.business.insuranceOrderDetailTotalCode = data[i].insuranceOrderDetailCode; //商业险总价code
                    }
                    //隔离商业险总价\隔离车船税\交强险
                    if (data[i].insuranceTypeCode !== 'commercialAllInsurance' && data[i].insuranceTypeCode !== 'vehicleAndVesselTax' && data[i].insuranceTypeCode !== 'strongInsurance') {
                        this.fieldObj.business.insuranceOrderDetailCode = data[i].insuranceOrderDetailCode; //商业险code
                        result.push(data[i]);
                    }
                }
                this.insuranceDetailTableData = result;
            },
            /**
             * 保存，提交，更新数据
             */
            //保存数据
            submitPageInfo() {
                if (!this.canEdit) {
                    return
                }
                let checkStrongInsurance = this.checkPageInfo('strongInsurance'), //校验交强险
                    checkbusiness = this.checkPageInfo('business'); //校验商业险
                //校验页面数据填写
                if (checkStrongInsurance.result) {
                    Toast('请完善交强险数据');
                    return false;
                }
                if (checkbusiness.result) {
                    Toast('请完善商业险数据');
                    return false;
                }
                if (checkStrongInsurance.type && checkbusiness.type) {
                    Toast('请添加交强险及商业险信息');
                    return false;
                }
                //共有参数
                let options = {
                    detailList: [],
                    businessPriceModelType: this.businessPriceModelType, //
                    insuranceOrderNo: (this.insuranceOrderNo ? this.insuranceOrderNo: this.orderData.fieldObj.insuranceOrderNo), //保险单号，一般新建保险单时为空
                    orderNo: this.orderNo
                };
                options.detailList = this.formatArguments(checkStrongInsurance.type, checkbusiness.type);
                //对应 orderType =========> store 当前保险单状态 类型：boolean 更新状态: true, 新增状态: false
                if (this.orderType) { //更新
                    this.updataInsuranceOrder(options);
                } else { //新增
                    this.newInsuranceOrder(options);
                }
            },
            //保险专员推送
            pushInsuranceWbInfo() {
                let options = {
                    detailList: [],
                    businessPriceModelType: this.businessPriceModelType,
                    insuranceOrderNo: this.insuranceOrderNo,
                    orderNo: this.orderNo
                };
                //判断条件依次为 如果保险明细为空，交强险没有选择保险公司，车船税没有保险公司，商业险没有保险公司，那么就是空推送
                if (this.insuranceDetailTableData.length === 0 && this.fieldObj.strongInsurance.insuranceOrgCode === '' && this.fieldObj.vehicleAndVesselTax.insuranceOrgCode === '' && this.fieldObj.business.insuranceOrgCode === '') {
                    options.detailList = [];
                } else {
                    options.detailList = this.formatArguments(false, false);
                }
                api.clearingsettlement.insurance.pushInsuranceOrderToWorkbench(options, (res) => {
                    if (res.data.code === 'success') {
                        Toast('推送成功');
                        this.$refs.insuranceSpec.close();
                        this.initPage()
                    }
                })
            },
            //新增保单订单
            newInsuranceOrder(options) {
                api.clearingsettlement.insurance.addInsurancePlan(options, (res) => {
                    if (res.data.code === 'success') {
                        this.$router.replace({
                            path: '/order/' + this.$route.query.orderNo
                        });
                    }
                })
            },
            //更新保单订单信息
            updataInsuranceOrder(options) {
                api.insurance.changeInsurance(options, (res) => {
                    if (res.data.code === 'success') {
                        this.$router.replace({
                            path: '/order/' + this.$route.query.orderNo
                        });
                    }
                });
            },
            //删除保单信息
            deleteInsuranceByOrder() {
                let options = {
                    orderNo: this.orderNo,
                    insuranceOrderNo: this.insuranceOrderNo
                }
                if (this.orderType) {
                    api.insurance.deleteInsuranceByOrder(options, (res) => {
                        if (res.data.code === 'success') {
                            Toast('删除成功')
                            this.$router.replace({
                                path: '/order/' + this.$route.query.orderNo
                            });
                        }
                    })
                } else {
                    this.goBack()
                }
            },
            //将数据整合成提交时需要的格式 strongInsuranceDataType: 是否需要组装交强险数据
            formatArguments(checkStrongInsurance, checkbusiness) {
                let result = [];
                //添加交强险
                if (!checkStrongInsurance) {
                    this.fieldObj.strongInsurance.agentBusinessFlag = this.fieldObj.strongInsurance.agentBusinessFlag ? 1 : 0;
                    this.fieldObj.strongInsurance.insuranceOrderNo = this.insuranceOrderNo;
                    result.push(this.fieldObj.strongInsurance);
                }
                if (this.fieldObj.vehicleAndVesselTax.actualFirstInsurancePrice !== '') {
                    this.fieldObj.vehicleAndVesselTax.agentBusinessFlag = this.fieldObj.strongInsurance.agentBusinessFlag ? 1 : 0;
                    this.fieldObj.vehicleAndVesselTax.insuranceOrderNo = this.insuranceOrderNo;
                    result.push(this.fieldObj.vehicleAndVesselTax);
                }
                //添加商业险
                if (!checkbusiness) {
                    //商业险总价及明细类型 总价: 1, 详细: 0
                    if (this.insuranceDetailTableData.length > 0) { //如果商业险明细存在
                        let length = this.insuranceDetailTableData.length;
                        //商业险明细添加
                        for (let i = 0; i < length; i++) {
                            this.$set(this.insuranceDetailTableData[i], 'insuranceOrgName', this.fieldObj.business.insuranceOrgName)
                            this.$set(this.insuranceDetailTableData[i], 'insuranceOrgCode', this.fieldObj.business.insuranceOrgCode)
                            this.$set(this.insuranceDetailTableData[i], 'insuranceMonth', this.fieldObj.business.insuranceMonth)
                            this.$set(this.insuranceDetailTableData[i], 'agentBusinessFlag', (this.fieldObj.business.agentBusinessFlag ? 1 : 0))
                            result.push(this.insuranceDetailTableData[i]);
                        }
                    }
                    if (this.businessPriceModelType === 1) { //总价提交
                        result.push({
                            insuranceTypeCode: this.businessInsuranceTypeCode,
                            insuranceTypeName: this.businessInsuranceTypeName,
                            actualFirstInsurancePrice: this.fieldObj.business.actualFirstInsurancePrice,
                            insuranceOrgName: this.fieldObj.business.insuranceOrgName,
                            insuranceOrgCode: this.fieldObj.business.insuranceOrgCode,
                            orderNo: this.orderNo,
                            agentBusinessFlag: (this.fieldObj.business.agentBusinessFlag ? 1 : 0),
                            insuranceMonth: this.fieldObj.business.insuranceMonth,
                            insuranceOrderNo: this.insuranceOrderNo,
                            insuranceOrderDetailCode: this.fieldObj.business.insuranceOrderDetailTotalCode //商业险总价CODE
                        })
                    }
                }
                return result;
            },
            //清除页面数据 这是一个清空页面数据的方法，暂时没有被调用，可能后续会用到因此暂时保留
            removeInfo() {
                this.fieldObj.strongInsurance.actualFirstInsurancePrice = ''; //实价
                this.fieldObj.strongInsurance.firstInsurancePrice = ''; //总价
                this.fieldObj.strongInsurance.insuranceMonth = ''; //投保期数
                this.fieldObj.strongInsurance.insuranceOrgCode = ''; //保险公司code
                this.fieldObj.strongInsurance.insuranceOrgName = ''; //保险公司名称
                this.fieldObj.strongInsurance.agentBusinessFlag = false; //代收标识
                this.fieldObj.strongInsurance.orderNo = this.$route.query.orderNo;
                this.fieldObj.strongInsurance.insuranceOrderDetailCode = '';
                this.fieldObj.strongInsurance.insuranceTypeCode = 'strongInsurance'; //险种类型
                this.fieldObj.vehicleAndVesselTax.actualFirstInsurancePrice = ''; //实价
                this.fieldObj.vehicleAndVesselTax.firstInsurancePrice = ''; //总价
                this.fieldObj.vehicleAndVesselTax.insuranceMonth = ''; //投保期数
                this.fieldObj.vehicleAndVesselTax.insuranceOrgCode = ''; //保险公司code
                this.fieldObj.vehicleAndVesselTax.insuranceOrgName = ''; //保险公司名称
                this.fieldObj.vehicleAndVesselTax.agentBusinessFlag = false; //代收标识
                this.fieldObj.vehicleAndVesselTax.orderNo = this.$route.query.orderNo;
                this.fieldObj.vehicleAndVesselTax.insuranceOrderDetailCode = '';
                this.fieldObj.vehicleAndVesselTax.insuranceTypeCode = 'vehicleAndVesselTax'; //险种类型
                this.fieldObj.business.actualFirstInsurancePrice = ''; //实价
                this.fieldObj.business.insuranceOrderDetailCode = ''; //商业险CODE
                this.fieldObj.business.insuranceMonth = ''; //投保期数
                this.fieldObj.business.insuranceOrgCode = ''; //保险公司code
                this.fieldObj.business.insuranceOrgName = ''; //保险公司名称
                this.fieldObj.business.agentBusinessFlag = false; //代收标识
                this.fieldObj.business.orderNo = this.$route.query.orderNo;
                this.fieldObj.business.insuranceTypeCode = ''; //险种类型
                //险种明细表格数据
                this.insuranceDetailTableData = [];
            },
            /**
             * 组件控制
             */
            //校验页面数据
            checkPageInfo(objName) {
                let result = false,
                    resultData = [],
                    length = 0;
                for (let item in this.fieldObj[objName]) {
                    //是商业险，那么需要校验商业险的明细
                    if (objName === 'business') {
                        if (this.businessPriceModelType === 1) { //如果是总价模式
                            if (item !== 'agentBusinessFlag' && item !== 'orderNo' && item !== 'insuranceTypeCode' && item !== 'insuranceOrderDetailCode') {
                                if (this.fieldObj[objName][item] !== '') {
                                    resultData.push(this.fieldObj[objName][item]);
                                }
                                length++;
                            }
                        } else { //详细模式
                            if (item !== 'agentBusinessFlag' && item !== 'orderNo' && item !== 'insuranceTypeCode' && item !== 'insuranceOrderDetailCode' && item !== 'actualFirstInsurancePrice') {
                                if (this.fieldObj[objName][item] !== '') {
                                    resultData.push(this.fieldObj[objName][item]);
                                }
                                length++;
                            }
                        }
                    } else {
                        if (item !== 'agentBusinessFlag' && item !== 'orderNo' && item !== 'insuranceTypeCode' && item !== 'insuranceOrderDetailCode' && item !== 'insuranceOrderNo') {
                            if (this.fieldObj[objName][item] !== '') {
                                resultData.push(this.fieldObj[objName][item]);
                            }
                            length++;
                        }
                    }
                }
                //校验基本数据是否已经全部填写
                if (resultData.length !== 0 && resultData.length < length) {
                    result = true;
                }
                //假如是商业险，那么需要校验商业险的明细 this.businessPriceModelType 是总价模式
                if (objName === 'business' && resultData.length !== 0 && this.businessPriceModelType === 0) {
                    if (this.insuranceDetailTableData.length === 0) {
                        result = true;
                    }
                }
                return {
                    result: result,
                    type: resultData.length === 0 ? true : false //如果没有填写任何数据 为 false
                };
            },
            //添加险种
            addKindInsurance(data) {
                if (this.fieldObj.business.insuranceOrgCode === '' || this.fieldObj.business.insuranceOrgCode === undefined) {
                    Toast('请选择商业险公司');
                } else if (this.fieldObj.business.insuranceMonth === 0 || this.fieldObj.business.insuranceMonth === '') {
                    Toast('请选择商业险的投保期数');
                } else {
                    //setOrderData ==========> VUEX 存档当前的订单信息
                    this.setOrderData({
                        fieldObj: this.fieldObj,
                        insuranceDetailTableData: this.insuranceDetailTableData,
                        currentInsuranceData: data
                    });
                    //存入SessionStorage
                    sessionStorage.setItem('businessDetail', JSON.stringify(data));
                    this.$router.push({
                        path: `/insurance-add`,
                        query: {
                            orderNo: this.orderNo,
                            carCode: this.carCode,
                            insuranceOrgCode: this.fieldObj.business.insuranceOrgCode,
                            insuranceOrderNo: this.insuranceOrderNo,
                            id: data.id === '' ? '' : data.id
                        }
                    })
                }
            },
            //跳转热销方案页面
            hotPlan() {
                //setOrderData ==========> VUEX 存档当前的订单信息
                this.setOrderData({
                    fieldObj: this.fieldObj
                });
                this.$router.replace({
                    path: '/hotsalesplan-insurance',
                    query: {
                        orderNo: this.orderNo,
                        carCode: this.carCode
                    }
                })
            },
            //保险专员按钮
            choseCanPushToAssist: function() {
                this.$refs.insuranceSpec.open();
            },
            //保险专员取消
            closeCanPushToAssistModal: function() {
                this.$refs.insuranceSpec.close();
            },
            //选择保险公司 picker: van-picker组件选择对应的数据，类型: Object
            onConfirm(picker) {
                if (picker.value != this.fieldObj.business.insuranceOrgCode && this.showInsuranceSelectFlag != 'strongInsurance') {
                    this.insuranceDetailTableData = []
                }
                this.fieldObj[this.showInsuranceSelectFlag].insuranceOrgCode = picker.value;
                this.fieldObj[this.showInsuranceSelectFlag].insuranceOrgName = picker.text;
                if (this.showInsuranceSelectFlag === 'strongInsurance') {
                    this.fieldObj.vehicleAndVesselTax.insuranceOrgCode = picker.value;
                    this.fieldObj.vehicleAndVesselTax.insuranceOrgName = picker.text;
                }
                this.showInsuranceSelectType = false;
            },
            //隐藏显示选择保险公司弹层
            showInsuranceSelect(type) {
                if (this.canEdit) {
                    this.showInsuranceSelectFlag = type;
                    this.showInsuranceSelectType = !this.showInsuranceSelectType;
                }
            },
            //实价金额累加
            reducerBusinessTotalPrice() {
                let result = 0,
                    length = this.insuranceDetailTableData.length;
                for (let i = 0; i < length; i++) {
                    result += this.insuranceDetailTableData[i].actualFirstInsurancePrice;
                }
                return result.toFixed(2);
            },
            //预估总价小数点处理
            blurInput() {
                let result = (this.fieldObj.business.actualFirstInsurancePrice * 1).toFixed(2);
                this.fieldObj.business.actualFirstInsurancePrice = result;
            },
            switchModalType() {
                let _this = this
                if (_this.businessPriceModelType === 1 && _this.canEdit) {
                    _this.businessPriceModelType = 0
                } else if (_this.businessPriceModelType === 0 && _this.canEdit) {
                    _this.businessPriceModelType = 1
                }
            },
            goBack() {
                this.$router.go(-1)
            }
        }
    }
</script>
<style lang="scss" scoped>
    .fl {
        float: left;
    }
    .fr {
        float: right;
    }
    .flex {
        display: flex;
    }
    .pl05 {
        padding-left: remp(5);
    }
    .pr05 {
        padding-right: remp(5);
    }
    .pr1 {
        padding-right: remp(8);
    }
    /*修正vant组件样式 */
    /*复选框*/
    .check-lable {
        .van-checkbox__icon {
            margin-top: 2px;
        }
        .van-checkbox__label {
            color: #ff0000;
            margin-left: remp(5);
        }
    }
    .van-picker {
        .van-picker__cancel,
        .van-picker__confirm {
            font-size: remp(16);
            font-weight: normal;
        }
    }
    /*内容开始*/
    .container {
        position: fixed;
        width: 100%;
        height: 100%;
        overflow-y: auto;
    } //行包裹
    .wrap-group {
        padding: 0 remp(10);
        background-color: #fff;
        .wrap-title {
            padding: remp(10) remp(10) remp(10) 0;
            height: remp(25);
            overflow: hidden;
            label {
                padding-left: remp(5);
                height: remp(20);
                line-height: remp(20);
                border-left: remp(5) solid #ff0000;
            }
        }
        .group-member {
            border-bottom: .01rem solid #e7e7e7;
            color: #696969;
            .price-text {
                flex-grow: 1;
                text-align: right;
            }
        }
    }
    .wrap-group:nth-child(3) {
        border-top: remp(7) solid #e9e9e9;
    } //总价实价btn
    .tab-main {
        width: 49%;
        height: remp(40);
        line-height: remp(40);
        background-color: #d7d7d7;
        display: flex;
        align-items: center;
        justify-content: space-around;
        .tab-item {
            color: #000;
            padding: remp(5) remp(15);
            height: remp(20);
            line-height: remp(20);
        }
        .cur {
            width: rem(100);
            background-color: #fff;
            text-align: center;
        }
    } //总价实价
    .text-main {
        width: 50%;
        display: flex;
        align-items: center;
        justify-content: space-around;
        input {
            width: rem(200);
        }
    }
    /*保险险种明细表格包裹*/
    .insurance-detail-wrap {
        padding-bottom: remp(50);
    }
    /*保险险种明细表格*/
    .insurance-detail-table {
        width: 100%;
        background-color: #fff;
        &>thead {
            color: #fff;
            background-color: #7e8387;
        }
        & th,
        td {
            height: remp(40);
        }
        & td {
            padding: 0 remp(10);
        }
    }
    /*增加险种按钮*/
    .add-btn {
        width: remp(120);
        height: remp(60);
        line-height: remp(60);
        margin: 0 auto;
        display: block;
    } //底部保存 热销方案
    .bottom-control {
        position: fixed;
        width: 100%;
        bottom: 0;
        height: remp(45);
        background-color: #fff;
        border-top: 1px solid #e9e9e9;
        display: flex;
        align-items: center;
    } //方案包裹
    .program-wrap {
        height: 100%;
        display: flex;
        align-items: center;
        color: #818181;
        .item {
            padding: 0 remp(10);
            text-align: center;
            border-right: 1px solid #e9e9e9;
        }
        .item:last-child {
            border: 0;
        }
    } //报价状态
    .offer-type {
        flex-grow: 2;
        color: #818181;
        display: flex;
        justify-content: center;
    } //保存按钮
    .page-info-save {
        flex-grow: 2;
        height: 100%;
        line-height: remp(45);
        display: block;
        color: #fff;
        font-size: remp(14);
        text-align: center;
        background-image: -webkit-gradient(linear, left top, right top, from(#008cee), to(#36acfe));
        background-image: linear-gradient(90deg, #008cee, #36acfe);
    }
    .page-info-save-disabled {
        flex-grow: 2;
        height: 100%;
        line-height: remp(45);
        display: block;
        color: #fff;
        font-size: remp(14);
        text-align: center;
        background: rgb(155, 155, 155);
    } //保险推送
    .insurance-content {
        padding-top: 30%;
        padding-left: rem(60);
        padding-right: rem(60);
        overflow: scroll;
        vertical-align: middle;
        text-align: center;
        display: flex;
        flex-direction: column;
        color: rgb(51, 51, 51);
        text-align: left;
        font-family: PingFangSC-Medium;
        font-size: rem(40);
        color: rgb(51, 51, 51);
    }
    .insurance-footer {
        width: 100%;
        display: flex;
        justify-content: space-around;
        a {
            width: remp(100);
            height: remp(38);
            line-height: remp(38);
            display: block;
            background-color: #26a2ff;
            color: #fff;
            text-align: center;
            font-size: remp(16);
            border-radius: 5px;
        }
        .close {
            width: remp(99);
            height: remp(37);
            line-height: remp(37);
            border: 1px solid #5a5a5a;
            background-color: #fff;
            color: #5a5a5a;
        }
    }
</style>
