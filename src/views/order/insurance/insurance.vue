<template>
    <div class="contentContainer">
        <page-header>
            <div slot>报价单-保险</div>
            <div slot="right" @click="remove" v-if="isSc && isScTwo">清空</div>
        </page-header>
        <!--交强险-->
        <div class="trafficInsurance p-lr-10 ft-md">
            <div class="trafficTitle p-t-10 p-b-10">
                <div class="titleLeft">
                    <i></i>
                    <span>
                        交强险
                    </span>
                </div>
                <div class="collection">
                    <span @click="chooseJiao" :class="[{ 'current': judgeThree }, {'hasChoosed': judgeThree}]">
                        <b v-if="judgeThree"><i class="icon iconfont icon-icon-gouxuan"></i></b>
                        <input type="radio" v-if="!judgeThree">
                        </span>&nbsp;
                    <span @click="chooseJiao">
                        代收
                    </span>
                </div>
            </div>
            <div class="itemList b-b">
                <cell title="保险公司">
                    <input @click="showModelOne" v-model="jiaoObj.valueJiao" type="text" readonly placeholder="请选择交强险保险公司">
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
            <label for="jiaoDate" class="itemList b-b">
                <cell title="投保期">
                    <input id="jiaoDate" type="text" v-model="jiaoObj.timeLimit" placeholder="请输入交强险期数" @keyup="NumCheck" :readonly="!isSc && !isScTwo">
                    <span slot="right">个月</span>
                </cell>
            </label>
            <label for="jiaoTotal" class="itemList b-b">
                <cell title="总价">
                    <input id="jiaoTotal" type="text" v-model="jiaoObj.totalMoney" @blur="NumCheckPointOne" placeholder="请输入交强险总金额" :readonly="!isSc && !isScTwo">
                    <span slot="right">元</span>
                </cell>
            </label>
            <label for="jiaoReality" class="itemList b-b">
                <cell title="实价">
                    <input id="jiaoReality" type="text" v-model="jiaoObj.actMoney" @blur="NumCheckPointFive" placeholder="请输入交强险实际金额" :readonly="!isSc && !isScTwo">
                    <span slot="right">元</span>
                </cell>
            </label>
            <label for="jiaoTax" class="itemList">
                <cell title="车船税总价">
                    <input id="jiaoTax" type="text" v-model="jiaoObj.boatCarMoney" @blur="NumCheckPointTwo" placeholder="请输入车船税总金额" :readonly="!isSc && !isScTwo">
                    <span slot="right">元</span>
                </cell>
            </label>
        </div>
        <!--商业险-->
        <div class="trafficInsurance p-lr-10 ft-md border-s">
            <div class="trafficTitle p-t-10 p-b-10">
                <div class="titleLeft">
                    <i></i>
                    <span>
                        商业险
                    </span>
                </div>
                <div class="collection">
                    <span @click="chooseShang" :class="[{ 'current': judgeFour }, {'hasChoosed': judgeFour}]">
                        <b v-if="judgeFour"><i class="icon iconfont icon-icon-gouxuan"></i></b>
                        <input type="radio" v-if="!judgeFour">
                    </span>&nbsp;
                    <span @click="chooseShang">
                        代收
                    </span>
                </div>
            </div>
            <div class="itemList b-b">
                <cell title="保险公司">
                    <input type="text" @click="showModelTwo" v-model="businessObj.valueBusiness" readonly placeholder="请选择商业险保险公司">
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
            <label for="businessDate" class="itemList">
                <cell title="投保期">
                    <input id="businessDate" type="text" v-model="businessObj.timeLimit" placeholder="请输入商业险期数" @keyup="NumCheckOne" :readonly="!isSc && !isScTwo">
                    <span slot="right">个月</span>
                </cell>
            </label>
            <div class="itemList">
                <cell title="总价">
                    <input type="text" step="0.01" :value="businessObj.total" placeholder="总价金额" readonly>
                    <span slot="right">元</span>
                </cell>
            </div>
            <div class="itemList b-b">
                <cell title="实价">
                    <input type="text" step="0.01" :value="businessObj.realMoney" placeholder="实价金额" readonly>
                    <span slot="right">元</span>
                </cell>
            </div>
        </div>
        <div v-if="tableShow" class="tableShow">
            <table>
                <thead>
                    <tr>
                        <th>险种</th>
                        <th>保额(元)</th>
                        <th>保费(元)</th>
                        <th>不计免赔(元)</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(item, index) in tablelist" :key="index">
                        <td><span><a href="javascript:;" @click="removeItem(index)">{{ item.name }}</a></span></td>
                        <td class="center">{{ item.limit ? item.limit: 0 }}</td>
                        <td class="center">{{ item.money ? item.money: 0 }}</td>
                        <td class="center">{{ item.acNo ? item.acNo: 0 }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="addDetail" v-if="isSc && isScTwo">
            <span>
                <a @click="add" href="javascript:;"><p class="icon iconfont icon-icon-tianjia"></p> 添加详细险种</a>
            </span>
        </div>
        <div class="save max-width">
            <div class="left">
                <div class="hot" @click="hotPlan" v-show="isSc && isScTwo">
                    <span><p class="icon iconfont icon-rexiaofangan"></p></span>
                    <br />
                    <span>热销方案</span>
                </div>
                <div class="attache" @click="choseCanPushToAssist" v-if="isSc">
                    <span><p class="icon iconfont icon-jinrongzhuanyuan"></p></span>
                    <br />
                    <span>保险专员</span>
                </div>
            </div>
            <div class="bottomTextGrey">
                报价状态: <br />
                {{ hasSubmited ? (saveInfo.wfStatus == 1 ? '保险专员报价': '销售顾问报价') : '待报价' }}
            </div>
            <div class="right" @click="save" v-if="isSc && isScTwo">
                保&nbsp;存
            </div>
        </div>
        <select-item :items="companyList" ref="selectOne" @handOk="handOkOne">
        </select-item>
        <select-item :items="companyList" ref="selectTwo" @handOk="handOkTwo">
        </select-item>
        <modal ref="insuranceSpec" :confirmDisplay="false" :title="'提醒'">
            <div class="insurance-content">
                <div class="w flex dialogText">
                    是否推送保险专员协助报价?
                </div>
            </div>
            <div slot="footer">
                <mt-button class="btn" plain @click="closeCanPushToAssistModal">取消</mt-button>
                <mt-button class="btn" type="primary" @click="pushInsuranceWbInfo">确认</mt-button>
            </div>
        </modal>
    </div>
</template>
<script>
    import PageHeader from "components/header/PageHeader"
    import {
        Toast,
        Button
    } from 'mint-ui'
    import cell from 'components/cell'
    import api from 'common/api'
    import config from 'common/config'
    import modal from 'components/modal'
    import SelectItem from 'components/select-item/select-item'
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
    const SC_POST_TYPE_CODE = config.root.scPostTypeCode
    const SM_POST_TYPE_CODE = config.root.smPostTypeCode
    export default {
        components: {
            PageHeader,
            cell,
            modal,
            Button,
            SelectItem
        },
        computed: {
            ...mapState('insurance', [
                'tablelist', //商业险种数据明细
                'tempJiao',  //交强险缓存，用于展示数据及数据组装
                'tempBusi',  //商业险数据，用于展示数据及数据组装
                'saveInfo',  //缓存提交的数据
                'insuranceNo'
            ]),
            ...mapState('order', [
                'order'
            ])
        },
        data() {
            return {
                pushInsuranceWbInfoFlag: true,
                //交强险数据
                jiaoObj: {
                    valueJiao: '',
                    timeLimit: '',
                    totalMoney: '',
                    boatCarMoney: '',
                    actMoney: '',
                    valueCode: '',
                    isOrNo: false
                },
                //商业险数据
                businessObj: {
                    valueBusiness: '',
                    timeLimit: '',
                    realMoney: '',
                    total: '',
                    valueCode: '',
                    isOrNo: false,
                    companyCode: ''
                },
                list: [1, 2, 3, 4, 5, 6, 7, 8, 9],
                //保险公司数据来源
                companyList: [],
                //交强险代收标记
                judgeThree: false,
                //商业险代收标记
                judgeFour: false,
                //对应商业险保险公司code
                companyCode: '',
                //新增标记
                isAdd: false,
                approveShow: false,
                orderNo: '',
                carCode: '',
                tableShow: false,
                //判断是否是销售专员的标记，用于控制页面保险操作
                isSc: false,
                //判断订单状态是否可编辑
                isScTwo: true,
                //报价状态
                hasSubmited: false,
                //保险订单号
                insuranceOrderNo: '',
                //缓存详情对象
                tempDetailObj: []
            }
        },
        methods: {
            ...mapActions('insurance', [
                'setTableShow',
                'setTempJiao',
                'setTempBusi',
                'setTableList',
                'getCompanyList',
                'removeTableList',
                'setInsuranceNo',
                'setBackData',
                'saveInsuranceInfo',
                'setHotPlanList',
                'resetTablelist',
                'setMainOrder',
                'setCarCode',
                'resetJiao',
                'resetBusi',
                'pushInsuranceOrderToWorkbench'
            ]),
            // 返回报下单页面
            callback() {
                const _this = this
                _this.removeTableList()
                _this.$router.replace({
                    path: '/order/' + _this.orderNo
                })
            },
            // 删除险种 或编辑险种
            removeItem(index) {
                const _this = this
                _this.$router.replace({
                    path: `/insurance-edit`,
                    query: {
                        index: index,
                        orderNo: _this.orderNo,
                        carCode: _this.carCode
                    }
                })
            },
            // 保存提交
            save() {
                let _this = this
                let list = []
                if (!this.isSc) {
                    return
                }
                if (_this.jiaoObj.timeLimit != '' || _this.jiaoObj.valueJiao != '' || _this.jiaoObj.totalMoney != '' || _this.jiaoObj.actMoney != '') {
                    if (_this.jiaoObj.timeLimit === '' || _this.jiaoObj.valueJiao === '' || _this.jiaoObj.totalMoney === '' || _this.jiaoObj.actMoney === '') {
                        Toast('请完善交强险数据')
                        return
                    }
                }
                if (_this.businessObj.total != '') {
                    if (_this.businessObj.timeLimit === '' || _this.businessObj.timeLimit === 0) {
                        Toast('请填写商业险保险期数')
                        return
                    }
                }
                _this.setTempJiao(_this.jiaoObj)
                _this.setTempBusi(_this.businessObj)
                // 组装商业险险种list
                _this.tablelist.forEach(element => {
                    let obj = {}
                    obj.insuranceTypeCode = element.insuranceTypeCode
                    obj.insuranceOrgCode = element.companyCode
                    obj.actualFirstInsurancePrice = element.actMoney
                    obj.actualInsuranceLimit = element.limit
                    obj.firstInsurancePrice = element.money
                    obj.sdewPrice = element.no
                    obj.actualSdewPrice = element.acNo
                    obj.orderNo = _this.orderNo
                    obj.insuranceMonth = _this.businessObj.timeLimit
                    obj.agentBusinessFlag = _this.judgeFour === true ? 1 : 0
                    obj.insuranceOrgName = _this.tempBusi.valueBusiness
                    list.push(obj)
                })
                // 此处组织交强险
                let tempObjOne = {
                    orderNo: _this.orderNo,
                    insuranceOrgCode: _this.tempJiao.valueCode,
                    insuranceTypeCode: 'strongInsurance',
                    insuranceMonth: _this.tempJiao.timeLimit,
                    agentBusinessFlag: _this.judgeThree === true ? 1 : 0,
                    actualFirstInsurancePrice: _this.tempJiao.actMoney,
                    firstInsurancePrice: _this.tempJiao.totalMoney,
                    insuranceOrgName: _this.tempJiao.valueJiao
                }
                // 组装车船税
                let tempObjTwo = {
                    orderNo: _this.orderNo,
                    insuranceOrgCode: _this.tempJiao.valueCode,
                    insuranceTypeCode: 'vehicleAndVesselTax',
                    insuranceMonth: _this.tempJiao.timeLimit,
                    agentBusinessFlag: _this.judgeThree === true ? 1 : 0,
                    actualFirstInsurancePrice: _this.tempJiao.actMoney,
                    firstInsurancePrice: _this.tempJiao.boatCarMoney,
                    insuranceOrgName: _this.tempJiao.valueJiao
                }
                if (!_this.isAdd) {
                    tempObjOne.actualFirstInsurancePrice = _this.jiaoObj.actMoney
                    tempObjOne.firstInsurancePrice = _this.jiaoObj.totalMoney
                    tempObjTwo.actualFirstInsurancePrice = _this.jiaoObj.boatCarMoney
                    tempObjTwo.firstInsurancePrice = _this.jiaoObj.boatCarMoney
                }
                list.push(tempObjOne)
                list.push(tempObjTwo)
                for(let k = 0; k<list.length; k++) {
                    if(!list[k].insuranceOrgCode) {
                        list.splice(k, 1)
                        k--
                    }
                }
                if(list.length === 0) {
                    Toast('请完善保险订单信息')
                    return
                }
                let option = {
                    orderNo: _this.orderNo,
                    detailList: list
                }
                _this.saveInsuranceInfo(option)
                if (_this.hasSubmited) {
                    option.insuranceOrderNo = _this.insuranceOrderNo
                    option.detailList.forEach((element, index) => {
                        for (let i = 0; i < _this.tempDetailObj.length; i++) {
                            if (element.insuranceTypeCode === _this.tempDetailObj[i].insuranceTypeCode) {
                                element.insuranceOrderDetailCode = _this.tempDetailObj[i].insuranceOrderDetailCode
                            }
                        }
                    })
                    api.insurance.changeInsurance(option, function(res) {
                        if (res.data.code === 'success') {
                            Toast('保存成功')
                            _this.$router.replace({
                                path: `/order/${_this.orderNo}`
                            })
                        }
                    })
                } else {
                    api.clearingsettlement.insurance.addInsurancePlan(option, function(res) {
                        if (res.data.code === 'success') {
                            Toast('保存成功')
                            _this.setBackData(res.data.obj)
                            _this.$router.replace({
                                path: `/order/${_this.orderNo}`
                            })
                            _this.removeTableList()
                            _this.resetJiao()
                            _this.resetBusi()
                        }
                    })
                }
            },
            //跳转热销方案页面
            hotPlan() {
                const _this = this
                _this.$router.replace({
                    path: '/hotsalesplan-insurance',
                    query: {
                        orderNo: _this.orderNo,
                        carCode: _this.carCode
                    }
                })
            },
            //添加商业险险种
            add() {
                const _this = this
                _this.isAdd = true
                _this.setTempJiao(_this.jiaoObj)
                _this.setTempBusi(_this.businessObj)
                if (_this.businessObj.valueCode === '') {
                    Toast('请选择商业险公司')
                } else {
                    _this.setTableShow()
                    _this.setMainOrder(_this.orderNo)
                    _this.$router.push({
                        path: `/insurance-add`,
                        query: {
                            orderNo: _this.orderNo,
                            carCode: _this.carCode
                        }
                    })
                }
            },
            //交强险代收
            chooseJiao() {
                // add by lwx
                if (!this.isSc) {
                    return
                }
                const _this = this
                _this.judgeThree = !_this.judgeThree
                _this.jiaoObj.isOrNo = _this.judgeThree
            },
            //商业险代收
            chooseShang() {
                if (!this.isSc) {
                    return
                }
                const _this = this
                _this.judgeFour = !_this.judgeFour
                _this.businessObj.isOrNo = _this.judgeFour
            },
            //交强险选择
            handOkOne(arg) {
                const _this = this
                _this.jiaoObj.valueCode = arg.value
                _this.jiaoObj.valueJiao = arg.text
            },
            //商业险选择
            handOkTwo(arg) {
                const _this = this
                _this.businessObj.valueCode = arg.value
                _this.businessObj.valueBusiness = arg.text
            },
            //交强险选择保险公司弹层控制
            showModelOne() {
                if (!this.isSc) {
                    return
                }
                const _this = this
                _this.$refs.selectOne.open()
            },
            //商业险选择保险公司弹层控制
            showModelTwo() {
                if (!this.isSc) {
                    return
                }
                const _this = this
                _this.$refs.selectTwo.open()
            },
            // 获取保险公司信息
            getCompanyInfo() {
                const _this = this
                api.getUserInfo.getUserAvailableInfo(function(res) {
                    if (res.data.code === 'success') {
                        const option = {
                            "chinaAreaCodes": [],
                            "companyInfoVo": {
                                "coName": ""
                            },
                            "pageStart": 1,
                            "pageNums": 1000,
                            "salesAreaCodes": [],
                            "storeCodes": []
                        }
                        api.insurance.getInsuranceCompany(option, function(res) {
                            if (res.data.code === 'success') {
                                let list = res.data.obj.list
                                list.forEach(element => {
                                    let obj = {
                                        text: element.coName,
                                        value: element.coCode
                                    }
                                    _this.companyList.push(obj)
                                })
                                _this.getCompanyList(_this.companyList)
                            }
                        })
                    }
                })
            },
            // 验证   只能输入正整数
            NumCheck() {
                const _this = this
                var num = _this.jiaoObj.timeLimit;
                var re = /^\d*$/; //^匹配字符串开始位置   \d 匹配任意一个十进制数字，等价于[0-9]  * 匹配0次 1次或者多次前面的字符  $匹配字符串的结束位置
                if (!re.test(num)) {
                    _this.jiaoObj.timeLimit = '';
                }
            },
            NumCheckOne() {
                const _this = this
                var num = _this.businessObj.timeLimit;
                var re = /^\d*$/; //^匹配字符串开始位置   \d 匹配任意一个十进制数字，等价于[0-9]  * 匹配0次 1次或者多次前面的字符  $匹配字符串的结束位置
                if (!re.test(num)) {
                    _this.businessObj.timeLimit = '';
                }
            },
            // 验证   只能是大于零并且精确到小数点后两位
            NumCheckPointOne() {
                const _this = this
                const num = _this.jiaoObj.totalMoney - 0;
                if (num) {
                    _this.jiaoObj.totalMoney = num.toFixed(2)
                } else {
                    _this.jiaoObj.totalMoney = ''
                }
            },
            NumCheckPointFive() {
                const _this = this
                const num = _this.jiaoObj.actMoney - 0;
                if (num) {
                    _this.jiaoObj.actMoney = num.toFixed(2)
                } else {
                    _this.jiaoObj.actMoney = ''
                }
            },
            NumCheckPointTwo() {
                const _this = this
                const num = _this.jiaoObj.boatCarMoney - 0;
                if (num) {
                    _this.jiaoObj.boatCarMoney = num.toFixed(2)
                } else {
                    _this.jiaoObj.boatCarMoney = ''
                }
            },
            // 清空数据
            remove() {
                const _this = this
                _this.jiaoObj = {}
                _this.businessObj = {}
                _this.judgeThree = true
                _this.judgeFour = true
                _this.resetJiao()
                _this.resetBusi()
                api.clearingsettlement.order.queryOrderInfoVosByCodeFromDB({
                    orderNo: _this.orderNo,
                    allSubOrderFlag: true,
                    ignoreDefault: 1
                }, function(res) {
                    if (res.data.code === 'success') {
                        if (res.data.obj.insuranceOrderInfoVoList[0] === null) {
                            _this.removeTableList()
                        } else {
                            let option = {
                                orderNo: _this.orderNo,
                                insuranceOrderNo: _this.insuranceOrderNo
                            }
                            api.insurance.deleteInsuranceByOrder(option, function(res) {
                                if (res.data.code === 'success') {
                                    Toast('删除成功')
                                    _this.$router.replace({
                                        path: `/order/${_this.orderNo}`
                                    })
                                    _this.removeTableList()
                                    _this.resetJiao()
                                    _this.resetBusi()
                                }
                            })
                        }
                    }
                })
            },
            // 计算总价和实价金额
            calculatePrice() {
                const _this = this
                _this.businessObj.realMoney = 0
                _this.businessObj.total = 0
                let numTotal = 0
                let numReal = 0
                _this.tablelist.forEach(element => {
                    numTotal += ((element.money - 0) + (element.acNo - 0))
                    numReal += (element.actMoney - 0)
                })
                _this.businessObj.realMoney = numReal.toFixed(2)
                _this.businessObj.total = numTotal.toFixed(2)
                if (_this.businessObj.realMoney === 0) {
                    _this.businessObj.realMoney = ''
                }
                if (_this.businessObj.total === 0) {
                    _this.businessObj.total = ''
                }
            },
            // 初始化页面数据
            getMainOrderNo() {
                const _this = this
                _this.orderNo = _this.$route.query.order
                _this.carCode = _this.$route.query.carCode
                _this.setCarCode(_this.carCode)
                let option = {
                    orderNo: _this.orderNo
                }
                let boatTemp
                let strongTemp
                api.login.getLoginInfo().then(res => {
                    if (res.data.code === 'success') {
                        _this.tableShow = true
                        const postnTypes = new Set(res.data.obj.postnTypes)
                        if (postnTypes.has(SC_POST_TYPE_CODE)) {
                            this.isSc = true
                        } else if (postnTypes.has(SM_POST_TYPE_CODE)) {
                            this.isSc = false
                        }
                    }
                })
                // 验证订单是否可以编辑
                api.clearingsettlement.order.queryOrderInfoVosByCodeFromDB({
                    orderNo: _this.orderNo,
                    allSubOrderFlag: true,
                    ignoreDefault: 1
                }, function(res) {
                    if (res.data.code === 'success') {
                        if (res.data.obj.carOrderInfoVoList[0].wfStatus === -1) {
                            _this.isScTwo = true
                        } else {
                            _this.isScTwo = false
                        }
                    }
                })
                //获取订单信息
                api.insurance.getInfomationsByOrder(option, function(res) {
                    if (res.data.code === 'success' && res.data.obj != null) {
                        _this.setBackData(res.data.obj)
                        _this.saveInsuranceInfo(res.data.obj)
                        _this.hasSubmited = true
                        _this.insuranceOrderNo = res.data.obj.insuranceOrderNo
                        let tempArray = JSON.parse(JSON.stringify(res.data.obj.detailList))
                        _this.tempDetailObj = JSON.parse(JSON.stringify(res.data.obj.detailList))
                        for (let i = 0; i < tempArray.length; i++) {
                            if (tempArray[i].insuranceTypeCode === 'vehicleAndVesselTax') {
                                boatTemp = JSON.parse(JSON.stringify(tempArray[i]))
                                _this.jiaoObj.boatCarMoney = boatTemp.actualFirstInsurancePrice
                                tempArray.splice(i, 1)
                                break
                            }
                        }
                        for (let j = 0; j < tempArray.length; j++) {
                            if (tempArray[j].insuranceTypeCode === 'strongInsurance') {
                                strongTemp = JSON.parse(JSON.stringify(tempArray[j]))
                                _this.jiaoObj.valueJiao = strongTemp.insuranceOrgName
                                _this.jiaoObj.timeLimit = strongTemp.insuranceMonth
                                _this.jiaoObj.actMoney = strongTemp.actualFirstInsurancePrice
                                _this.jiaoObj.valueCode = strongTemp.insuranceOrgCode
                                _this.jiaoObj.totalMoney = strongTemp.firstInsurancePrice
                                _this.judgeThree = strongTemp.agentBusinessFlag === 1 ? true : false
                                tempArray.splice(j, 1)
                                break
                            }
                        }
                        let tempArrayTwo = []
                        tempArray.forEach(function(element, index) {
                            let list = {
                                name: element.insuranceTypeName,
                                limit: element.actualInsuranceLimit,
                                money: element.firstInsurancePrice,
                                no: element.sdewPrice,
                                acNo: element.actualSdewPrice,
                                insuranceTypeCode: element.insuranceTypeCode,
                                actMoney: element.actualFirstInsurancePrice,
                                companyCode: element.insuranceOrgCode,
                                companyName: element.insuranceOrgName,
                                isOrNo: element.agentBusinessFlag
                            }
                            tempArrayTwo.push(list)
                        })
                        _this.resetTablelist(tempArrayTwo)
                        if (tempArrayTwo.length > 0) {
                            _this.businessObj.valueBusiness = tempArray[0].insuranceOrgName
                            _this.businessObj.timeLimit = tempArray[0].insuranceMonth
                            _this.businessObj.valueCode = tempArrayTwo[0].companyCode
                            _this.businessObj.companyCode = tempArray[0].insuranceOrgCode
                            _this.judgeFour = tempArrayTwo[0].isOrNo === 1 ? true : false
                            for (let k = 0; k < tempArrayTwo.length; k++) {
                                _this.businessObj.total += tempArrayTwo[k].money
                                _this.businessObj.realMoney += tempArrayTwo[k].actMoney
                            }
                            _this.businessObj.realMoney = (_this.businessObj.realMoney - 0).toFixed(2) - 0
                            _this.businessObj.total = (_this.businessObj.total - 0).toFixed(2) - 0
                        }
                        _this.calculatePrice()
                    } else if (res.data.obj === null) {
                        _this.hasSubmited = false
                        _this.calculatePrice()
                    }
                })
            },
            //保险专员按钮
            choseCanPushToAssist: function() {
                let _this = this
                _this.$refs.insuranceSpec.open()
            },
            //保险专员取消
            closeCanPushToAssistModal: function() {
                let _this = this
                _this.$refs.insuranceSpec.close()
            },
            //保险专员确认推荐
            pushInsuranceWbInfo: function() {

                let _this = this
                let detailList = null
                let params = {
                    orderNo: _this.orderNo,
                    insuranceOrderNo: _this.insuranceOrderNo,
                    detailList: detailList,
                    callback: () => {
                        _this.closeCanPushToAssistModal()
                        _this.pushInsuranceWbInfoFlag = true;
                    }
                }
                if(!_this.pushInsuranceWbInfoFlag){
                    return false;
                }
                _this.pushInsuranceWbInfoFlag = false;
                _this.setTempJiao(_this.jiaoObj)
                _this.setTempBusi(_this.businessObj)
                if (_this.$data.insuranceOrderNo != '') {
                    params.detailList = []
                }
                if (_this.$data.insuranceOrderNo != '' && _this.jiaoObj.timeLimit != '' && _this.jiaoObj.valueJiao != '' && _this.jiaoObj.totalMoney != '' && _this.jiaoObj.actMoney != '') {
                    params.detailList.push({
                        orderNo: _this.orderNo,
                        insuranceOrgCode: _this.tempJiao.valueCode,
                        insuranceTypeCode: 'strongInsurance',
                        insuranceMonth: _this.tempJiao.timeLimit,
                        agentBusinessFlag: (_this.judgeThree ? 1 : 0),
                        actualFirstInsurancePrice: _this.tempJiao.actMoney,
                        firstInsurancePrice: _this.tempJiao.totalMoney,
                        insuranceOrgName: _this.tempJiao.valueJiao
                    })
                    params.detailList.push({
                        orderNo: _this.orderNo,
                        insuranceOrgCode: _this.tempJiao.valueCode,
                        insuranceTypeCode: 'vehicleAndVesselTax',
                        insuranceMonth: _this.tempJiao.timeLimit,
                        agentBusinessFlag: _this.judgeThree === true ? 1 : 0,
                        actualFirstInsurancePrice: _this.tempJiao.actMoney,
                        firstInsurancePrice: _this.tempJiao.boatCarMoney,
                        insuranceOrgName: _this.tempJiao.valueJiao
                    })
                    if (!_this.isAdd) {
                        params.detailList[0].actualFirstInsurancePrice = _this.jiaoObj.actMoney
                        params.detailList[0].firstInsurancePrice = _this.jiaoObj.totalMoney
                        params.detailList[1].actualFirstInsurancePrice = _this.jiaoObj.boatCarMoney
                        params.detailList[1].firstInsurancePrice = _this.jiaoObj.boatCarMoney
                    }
                }
                if (_this.$data.insuranceOrderNo != '' && _this.businessObj.total != '' && _this.businessObj.timeLimit != '' && _this.businessObj.timeLimit != 0) {
                    _this.tablelist.forEach((element) => {
                        params.detailList.push({
                            insuranceTypeCode: element.insuranceTypeCode,
                            insuranceOrgCode: element.companyCode,
                            actualFirstInsurancePrice: element.actMoney,
                            actualInsuranceLimit: element.limit,
                            firstInsurancePrice: element.money,
                            sdewPrice: element.no,
                            actualSdewPrice: element.acNo,
                            orderNo: _this.orderNo,
                            insuranceMonth: _this.businessObj.timeLimit,
                            agentBusinessFlag: (_this.judgeFour ? 1 : 0),
                            insuranceOrgName: _this.businessObj.valueBusiness
                        })
                    })
                }
                if (_this.$data.insuranceOrderNo != '') {
                    params.detailList.forEach(element => {
                        for (let i = 0; i < _this.tempDetailObj.length; i++) {
                            if (element.insuranceTypeCode === _this.tempDetailObj[i].insuranceTypeCode) {
                                element.insuranceOrderDetailCode = _this.tempDetailObj[i].insuranceOrderDetailCode
                            }
                        }
                    })
                }
                _this.pushInsuranceOrderToWorkbench(params)
            }
        },
        mounted() {
            let _this = this
            //判断保险公司是否存在
            if (_this.tempJiao.valueJiao) {
                _this.jiaoObj = JSON.parse(JSON.stringify(_this.tempJiao))
            }
            //判断商业险保险公司是否存在
            if (_this.tempBusi.valueBusiness) {
                _this.businessObj = JSON.parse(JSON.stringify(_this.tempBusi))
            }
            _this.getMainOrderNo()
            _this.getCompanyInfo()
            if (_this.tablelist && _this.tablelist.length >= 0) {
                _this.setTableShow()
            }
        }
    }
</script>
<style lang="scss" scoped>
    .contentContainer {
        height: remp(600);
        overflow-y: auto;
    }
    .listmodel {
        position: fixed;
        -webkit-transform: translateZ(0); // left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .4)
    }
    .listmodel>.modelContainer {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: rem(500);
        background-color: #e7e7e7;
    }
    .listmodel>.modelContainer .title {
        height: rem(80);
        line-height: rem(80);
        background-color: rgb(54, 172, 254)
    }
    .listmodel>.modelContainer ul {
        height: rem(420);
        overflow-y: auto;
    }
    .listmodel>.modelContainer ul li {
        height: rem(70);
        line-height: rem(70);
        text-align: center;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
    }
    .contentContainer {
        padding-bottom: remp(44);
    }
    .trafficInsurance {
        background-color: #ffffff
    }
    .trafficTitle {
        height: remp(20);
        display: flex
    }
    .trafficTitle>div {
        flex: 1
    }
    .trafficTitle>div:nth-child(1) i {
        display: inline-block;
        width: .05rem;
        height: .1rem;
        background-color: red;
    }
    .trafficTitle>div:nth-child(2) {
        text-align: right;
    }
    .trafficTitle>div:nth-child(2)>span:nth-child(1) {
        display: inline-block;
        width: remp(15);
        height: remp(15);
        line-height: remp(15);
        text-align: center;
        border-radius: 50%;
        box-sizing: border-box; // border: remp(2) solid #777;
        vertical-align: middle; // background-color: rgb(54, 172, 254);
    }
    .trafficTitle>div:nth-child(2)>span:nth-child(1) input {
        background-color: #fff;
        height: remp(15);
        width: remp(15);
        border-radius: 50%;
    }
    .current i {
        // background-color: #ffffff;
        color: rgb(54, 172, 254) !important; // color: rgb(54, 172, 254) !important;
    }
    .trafficTitle>div:nth-child(2)>span:nth-child(1) i {
        font-size: remp(14); // color: #ffffff;
        color: transparent;
    }
    .trafficTitle>div:nth-child(2)>span:nth-child(1) b {
        display: inline-block;
        box-sizing: border-box;
        width: remp(15);
        height: remp(15);
    }
    .itemList {
        position: relative;
        display:block
    }
    .itemList>div:nth-child(1) {
        border-top: none
    }
    .border-s {
        border-top: .07rem solid #e9e9e9
    }
    .save {
        position: fixed;
        -webkit-transform: translateZ(0); // left: 0px;
        bottom: 0px;
        width: 100%;
        height: rem(90);
        display: flex;
        background-color: #fff
    }
    .right {
        flex: 1;
        text-align: center;
        line-height: rem(90);
        font-size: rem(28);
        color: #fff;
        background-image: linear-gradient(90deg, #008cee 0%, #36acfe 100%)
    }
    .left {
        flex: 1;
        display: flex;
    }
    .left .hot {
        flex: 1;
        text-align: center;
        border-right: rem(1) solid #e9e9e9
    }
    .left .hot span {
        color: rgb(129, 129, 129);
        text-align: center;
    }
    .left .hot span:first-child {
        color: rgb(129, 129, 129);
        font-size: rem(35)
    }
    .left .attache {
        flex: 1;
        max-width: 50%;
        text-align: center;
    }
    .left .attache span {
        color: rgb(129, 129, 129);
        text-align: center
    }
    .left .attache span:first-child {
        color: rgb(129, 129, 129);
        font-size: rem(35)
    }
    .center {
        flex: 1;
        text-align: center;
    }
    .specialType {
        height: rem(80);
        line-height: rem(80);
        padding-left: rem(30);
        display: flex;
    }
    .specialType .type {
        flex: 2
    }
    .specialType .chooseBox {
        flex: 1;
        display: flex;
    }
    .chooseBox .total {
        flex: 1;
    }
    .chooseBox .total span:first-child {
        display: inline-block;
        width: remp(10);
        height: remp(10);
        line-height: remp(10);
        text-align: center;
        border-radius: 50%;
        background-color: rgb(54, 172, 254);
    }
    .chooseBox>.total>span:first-child>i {
        font-size: remp(11);
        color: rgb(54, 172, 254);
    }
    .chooseBox .detail {
        flex: 1;
    }
    .chooseBox>.detail>span:first-child {
        display: inline-block;
        width: remp(10);
        height: remp(10);
        line-height: remp(10);
        text-align: center;
        border-radius: 50%;
        background-color: rgb(54, 172, 254);
    }
    .chooseBox>.detail>span:first-child>i {
        font-size: remp(11);
        color: rgb(54, 172, 254);
    }
    .tableShow table {
        width: 100%;
        background-color: #ffffff;
    }
    .tableShow table thead tr {
        background-color: #7e8387;
        text-align: left;
    }
    .tableShow table tr {
        height: rem(80)
    }
    .tableShow table tr td:first-child {
        position: relative;
        width: 33%;
    }
    .tableShow table tr td:first-child span {
        position: absolute;
        left: 50%;
        top: 50%;
        width: 90%;
        transform: translate(-50%, -50%)
    }
    .tableShow table tr th {
        text-indent: rem(18);
        color: #ffffff;
        font-weight: normal;
    }
    .addDetail {
        height: remp(40);
        line-height: remp(40);
        text-align: center;
    }
    .addDetail>span>a {
        color: rgb(0, 140, 238);
        text-decoration: underline !important;
    }
    .addDetail>span>a>i {
        font-size: remp(12)
    }
    .center {
        text-align: center !important;
    }
    .collection span:last-child {
        color: red;
    }
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
    .btn {
        width: 49%;
    }
    .insuranceState {
        font-size: rem(20);
    }
    .bottomText {
        line-height: rem(45);
    }
    .dialogText {
        font-size: rem(38)
    }
    .bottomTextGrey {
        flex: 1;
        box-sizing: border-box;
        padding-top: 10px;
        padding-right: 10px;
        text-align: center;
        color: rgb(126, 126, 126);
    }
</style>
