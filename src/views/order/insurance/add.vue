<template>
    <div>
        <page-header  @on-click-left="back">
            <div slot>新增</div>
            <div slot="right" @click="remove" v-if="!argObj.index&&argObj.index!=0">清空</div>
            <div slot="right" @click="removeItem" v-if="argObj.index || argObj.index === 0">删除</div>
        </page-header>
        <div class="trafficInsurance p-lr-10 ft-md">
            <div class="itemList">
                <cell title="险种">
                    <input type="text" v-if="!argObj.index" v-model="company.companyName" readonly @click="listShow" placeholder="请选择商业险种">
                    <input type="text" v-if="argObj.index" v-model="company.companyName" readonly placeholder="请选择商业险种">
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
                </cell>
            </div>
        </div>
        <div class="trafficInsurance p-lr-10 ft-md border-s">
            <label class="itemList b-b">
                <cell title="保额">
                    <input type="text" v-model="company.companyLimit" placeholder="请输入首年保额" @blur="NumCheckPointOne">
                    <span slot="right">元</span>
                </cell>
            </label>
            <label class="itemList b-b">
                <cell title="保费">
                    <input type="text" v-model="company.companyMoney" placeholder="请输入首年保费金额" @blur="NumCheckPointTwo">
                    <span slot="right">元</span>
                </cell>
            </label>
            <label class="itemList">
                <cell title="不计免赔">
                    <input type="text" v-model="company.companyNo" placeholder="请输入不计免赔金额" @blur="NumCheckPointThree">
                    <span slot="right">元</span>
                </cell>
            </label>
            <label class="itemList">
                <cell title="实价">
                    <input type="text" v-model="company.actMoney" placeholder="请输入商业险实价" @blur="NumCheckPointFour">
                    <span slot="right">元</span>
                </cell>
            </label>
            <label class="itemList">
                <cell title="账类">
                    <input type="text" @click="listShowTwo" :value="company.account" readonly placeholder="请选择帐类">
                </cell>
            </label>
        </div>
        <div class="sure">
            <div v-if="(argObj.index == 0 || argObj.index)" @click="sureUpdate">
              确&nbsp;&nbsp;定
            </div>
            <div v-else @click="sure">
              确&nbsp;&nbsp;定
            </div>
        </div>
        <select-item
            :items="itemlist"
            ref="selectTwo"
            @handOk="chooseItemOne">
        </select-item>
    </div>
</template>
<script>
import PageHeader from "components/header/PageHeader"
import cell from 'components/cell'
import { Toast } from 'mint-ui'
import api from 'common/api'
import config from 'common/config'
import SelectItem from 'components/select-item/select-item'
import {
    mapState,
    mapGetters,
    mapActions
} from 'vuex'
export default {
  components: {
    cell,
    PageHeader,
    SelectItem
  },
  computed: {
      ...mapState('insurance', [
          'companyList',
          'tablelist',
          'tempBusi',
          'accountTypes',
          'backData',
          'saveInfo',
          'orderNo',
          'carCode'
      ])
  },
  data() {
    return {
        leftOptions: {
            icon: "icon-icon-fanhui"
        },
        company: {
            code: '',
            companyName: '',
            companyLimit: '',
            companyMoney: '',
            companyNo: '',
            companyCode: '',
            insuranceTypeCode: '',
            //实价
            actMoney: '',
            account: '正常销售',
            accountCode: ''
        },
        itemlist: [],
        listmodelShowOne: false,
        argObj: {},
        tempCode: '',
        tempIndex: ''
    }
  },
  methods: {
    ...mapActions('insurance', [
        'setTableList',
        'setAccountTypes',
        'deleteOne',
        'editUnsaveData',
        'resetTablelist',
        'saveInsuranceInfo',
        'setBackData'
    ]),
    // 编辑更新
    sureUpdate() {
        const _this = this
        const isJudge = _this.saveInfo.detailList
        if (!_this.company.companyName || !_this.company.insuranceTypeCode) {
           Toast('请完善商业险数据')
           return
        }
        if(isJudge) {
            let option = JSON.parse(JSON.stringify(_this.saveInfo))
            let tempArr = JSON.parse(JSON.stringify(_this.backData))
            option.insuranceOrderNo = _this.backData.insuranceOrderNo
            option.detailList.forEach(function(element) {
                tempArr.detailList.forEach(function(value) {
                    if(element.insuranceTypeCode === value.insuranceTypeCode) {
                        element.insuranceOrderDetailCode = value.insuranceOrderDetailCode
                        element.insuranceOrderNo = value.insuranceOrderNo
                    }
                })
            })
            option.detailList.forEach(element => {
                if(element.insuranceTypeCode === _this.tempCode) {
                    element.insuranceTypeCode = _this.company.insuranceTypeCode
                    element.actualFirstInsurancePrice = _this.company.actMoney
                    element.actualInsuranceLimit = _this.company.companyLimit
                    element.firstInsurancePrice = _this.company.companyMoney
                    element.sdewPrice = _this.company.companyNo
                    element.actualSdewPrice = _this.company.companyNo
                    element.insuranceOrgCode = _this.company.companyCode
                    element.insuranceOrgName = _this.company.insuranceOrgName
                }
            })
            api.insurance.changeInsurance(option, function(res){
                if(res.data.code === 'success') {
                    _this.saveInsuranceInfo(option)
                    _this.setBackData(res.data.obj)
                    let tempArray = JSON.parse(JSON.stringify(res.data.obj.detailList))
                    for(let i = 0; i< tempArray.length; i++) {
                        if(tempArray[i].insuranceTypeCode === "vehicleAndVesselTax") {
                            tempArray.splice(i, 1)
                            break
                        }
                    }
                    for(let j = 0; j< tempArray.length; j++) {
                        if(tempArray[j].insuranceTypeCode === 'strongInsurance') {
                            tempArray.splice(j, 1)
                            break
                        }
                    }
                    let tempArrayTwo = []
                    tempArray.forEach(function(element, index){
                        tempArrayTwo.push({
                            name: element.insuranceTypeName,
                            limit: element.actualInsuranceLimit,
                            money: element.firstInsurancePrice,
                            no: element.sdewPrice,
                            acNo: element.actualSdewPrice,
                            insuranceTypeCode: element.insuranceTypeCode,
                            actMoney: element.actualFirstInsurancePrice || (_this.company.companyNo + _this.company.companyMoney) - 0,
                            companyCode: _this.tempBusi.valueCode
                        })
                    })
                    _this.resetTablelist(tempArrayTwo)
                    _this.$router.replace({
                        path: '/insurance',
                        query: {
                            order: _this.argObj.orderNo,
                            carCode: _this.carCode
                        }
                    })
                }
            })
        } else {
            let unsaveData = JSON.parse(JSON.stringify(_this.tablelist))
            let Tindex = _this.tempIndex
            let objTemp = unsaveData[Tindex]
            objTemp.name = _this.company.companyName
            objTemp.limit = _this.company.companyLimit
            objTemp.money= _this.company.companyMoney
            objTemp.no= _this.company.companyNo
            objTemp.insuranceTypeCode= _this.company.insuranceTypeCode
            objTemp.actMoney= _this.company.actMoney
            objTemp.companyCode = _this.tempBusi.valueCode
            let tempOption = {
                'index': Tindex,
                'tempArray': objTemp
            }
            _this.editUnsaveData(tempOption)
            _this.$router.replace({
                path: '/insurance',
                query: {
                    order: _this.argObj.orderNo,
                    carCode: _this.carCode
                }
            })
        }
    },
    // 编辑删除
    removeItem() {
        const _this = this
        const index = _this.argObj.index
        const isJudge = _this.saveInfo.detailList
        if(isJudge) {
            //_this.saveInfo 来自于insurance.vue 中保存最终提交结果的信息
            let option = JSON.parse(JSON.stringify(_this.saveInfo))
            //this.backData来自于api.insurance.getInfomationsByOrder接口，查询保险单信息
            let tempArr = JSON.parse(JSON.stringify(_this.backData))

            option.insuranceOrderNo = _this.backData.insuranceOrderNo
            option.insuranceIds = []
            //填充商业险明细CODE
            option.detailList.forEach(function(element) {
                tempArr.detailList.forEach(function(value) {
                    if(element.insuranceTypeCode === value.insuranceTypeCode) {
                        element.insuranceOrderDetailCode = value.insuranceOrderDetailCode
                        element.insuranceOrderNo = value.insuranceOrderNo
                    }
                })
            })
            //
            let tempItem = _this.tablelist[index].insuranceTypeCode
            tempArr.detailList.forEach(function(element){
                if(element.insuranceTypeCode === tempItem) {
                    option.insuranceIds.push(element.insuranceOrderDetailCode)
                }
            })
            //对页面显示数据及提交数据进行清除 提交时必须将已删除的商业险从提交数据中移除
            for(let i =0;i<option.detailList.length; i++) {
                if(option.detailList[i].insuranceTypeCode === tempItem){
                    option.detailList.splice(i, 1)
                }
            }
            // 更新险种
            api.insurance.changeInsurance(option, function(res){
                 if(res.data.code === 'success') {
                    _this.saveInsuranceInfo(option)
                    _this.setBackData(JSON.parse(JSON.stringify(res.data.obj)))
                    let tempArray = []
                    let tempArr = res.data.obj.detailList
                    for(let i = 0,len = tempArr.length; i<len; i++) {
                        // console.log(tempArray[i].insuranceTypeCode)

                        //判断如果不是交强险，或者车船税，那么就组装 其实就是添加商业险
                        if(tempArr[i].insuranceTypeCode != "vehicleAndVesselTax" || tempArr[i].insuranceTypeCode != 'strongInsurance') {
                            // tempArray.splice(i, 1)
                            // i--
                            tempArray.push(tempArr[i])
                        }
                    }
                    let tempArrayTwo = []
                    tempArray.forEach(function(element, index){
                        let list = {
                                name: element.insuranceTypeName,
                                limit: element.actualInsuranceLimit,
                                money: element.firstInsurancePrice,
                                no: element.sdewPrice,
                                acNo: element.actualSdewPrice,
                                // code: _this.company.detailCode,
                                insuranceTypeCode: element.insuranceTypeCode,
                                actMoney: element.actualFirstInsurancePrice || (_this.company.companyNo + _this.company.companyMoney) - 0,
                                companyCode: _this.tempBusi.valueCode
                            }
                            tempArrayTwo.push(list)
                    })
                    _this.resetTablelist(tempArrayTwo)
                    _this.$router.replace({
                        path: '/insurance',
                        query: {
                            // order: _this.order.orderNo,
                            order: _this.argObj.orderNo,
                            carCode: _this.carCode
                        }
                    })
                 }
            })
        }else {
            _this.deleteOne(index)
            _this.remove()
            _this.$router.replace({
                path: '/insurance',
                query: {
                    // order: _this.order.orderNo,
                    order: _this.argObj.orderNo,
                    carCode: _this.carCode
                }
            })
        }
    },
    // 设置model的方法
    cancel() {
        const _this = this
        _this.listmodelShowOne = false
        _this.listmodelShowTwo = false
    },
    chooseItemOne(arg) {
        const _this = this
        _this.company.companyName = arg.text
        _this.company.insuranceTypeCode = arg.value
    },
    // 验证小数点
    NumCheckPointOne() {
        const _this = this
        var num = _this.company.companyLimit - 0;
        if(num) {
            _this.company.companyLimit = num.toFixed(2)
        }else {
            _this.company.companyLimit = ''
        }
    },
    NumCheckPointTwo() {
        const _this = this
        var num = _this.company.companyMoney - 0;
        if(num) {
            _this.company.companyMoney = num.toFixed(2)
        }else {
            _this.company.companyMoney = ''
        }
    },
    NumCheckPointThree() {
        const _this = this
        var num = _this.company.companyNo - 0;
        if(num) {
            _this.company.companyNo = num.toFixed(2)
        }else {
            _this.company.companyNo = ''
        }
    },
    NumCheckPointFour() {
        const _this = this
        var num = _this.company.actMoney - 0;
        if(num) {
            _this.company.actMoney = num.toFixed(2)
        }else {
            _this.company.actMoney = ''
        }
    },
    // 获取险种信息
    listShow() {
        const _this = this
        _this.getKindsOfBusiness()
        _this.listmodelShowOne = true
    },
    listShowTwo() {
        const _this = this
        _this.listmodelShowTwo = true
    },
    remove() {
        const _this = this
        _this.company.companyName = ''
        _this.company.companyLimit = ''
        _this.company.companyMoney = ''
        _this.company.companyNo = ''
        // _this.company.detailCode = ''
        _this.company.insuranceTypeCode = ''
        _this.company.actMoney = ''
    },
    // 新增险种的确定   区分保险订单提交状态和未提交状态
    sure() {
        const _this = this
        let companyName = ''
        let option = {
            orderNo: _this.argObj.orderNo
        }
        if (!_this.company.companyName || !_this.company.insuranceTypeCode) {
           Toast('请完善商业险数据')
           return
        }
        //查询保险订单 check险种是否存在
        api.insurance.getInfomationsByOrder(option, function(res) {
            if(res.data.code === 'success') {
                if(res.data.obj != null) {
                    let option = JSON.parse(JSON.stringify(res.data.obj))
                    let tempArray = JSON.parse(JSON.stringify(option.detailList))
                    for(let i = 0; i<tempArray.length; i++) {
                        if(tempArray[i].insuranceTypeCode === 'strongInsurance') {
                            tempArray.splice(i, 1)
                            i--
                        }
                    }
                    for(let j = 0; j<tempArray.length; j++) {
                        if(tempArray[j].insuranceTypeCode === 'vehicleAndVesselTax') {
                            tempArray.splice(j, 1)
                            j--
                        }
                    }
                    let index = _this.companyList.findIndex((item) => {
                        return (item.value === _this.tempBusi.valueCode)
                    })
                    if (index >= 0) {
                        companyName = _this.companyList[index].text
                    }
                    let tempObj = {}
                        tempObj.insuranceTypeCode = _this.company.insuranceTypeCode
                        tempObj.actualFirstInsurancePrice = _this.company.actMoney ? _this.company.actMoney : (_this.company.companyMoney - 0) + (_this.company.companyNo - 0)
                        tempObj.actualInsuranceLimit = _this.company.companyLimit
                        tempObj.firstInsurancePrice = _this.company.companyMoney
                        tempObj.sdewPrice = _this.company.companyNo
                        tempObj.actualSdewPrice = _this.company.companyNo
                        tempObj.orderNo = option.orderNo
                        tempObj.insuranceOrderNo = option.insuranceOrderNo
                        tempObj.insuranceOrgCode = _this.tempBusi.valueCode
                        tempObj.insuranceOrgName = companyName
                        // tempObj.createOrgCode = '0'
                    let isRepeat = false
                    delete option.insuranceIds
                    tempArray.forEach(function(value){
                        if(value.insuranceTypeCode === tempObj.insuranceTypeCode) {
                            isRepeat = true
                            value.insuranceTypeCode = tempObj.insuranceTypeCode
                            value.actualFirstInsurancePrice = tempObj.actualFirstInsurancePrice
                            value.actualInsuranceLimit = tempObj.actualInsuranceLimit
                            value.firstInsurancePrice = tempObj.firstInsurancePrice
                            value.sdewPrice = tempObj.sdewPrice
                            value.actualSdewPrice = tempObj.sdewPrice
                            value.orderNo = tempObj.orderNo
                            value.insuranceOrgCode = tempObj.insuranceOrgCode
                            value.insuranceOrgName = tempObj.insuranceOrgName
                            value.insuranceOrderNo = tempObj.insuranceOrderNo
                        }
                    })
                    option.detailList.forEach(function(element) {
                        if(element.insuranceTypeCode === 'strongInsurance' || element.insuranceTypeCode === 'vehicleAndVesselTax') {
                            tempArray.unshift(element)
                        }
                    })
                    option.detailList = tempArray
                    if(isRepeat) {
                        // 如果添加险种存在   则视为修改险种
                        api.insurance.changeInsurance(option, function(res){
                            if(res.data.code === 'success') {
                                _this.saveInsuranceInfo(option)
                                _this.setBackData(res.data.obj)
                                let tempArray = JSON.parse(JSON.stringify(res.data.obj.detailList))
                                for(let i = 0; i<tempArray.length; i++) {
                                    if(tempArray[i].insuranceTypeCode === 'vehicleAndVesselTax') {
                                        tempArray.splice(i, 1)
                                        break
                                    }
                                }
                                for(let j = 0;j<tempArray.length; j++) {
                                    if(tempArray[j].insuranceTypeCode === 'strongInsurance') {
                                        tempArray.splice(j, 1)
                                        break
                                    }
                                }
                                let tempArrayTwo = []
                                tempArray.forEach(function(element, index){
                                    let list = {
                                            name: element.insuranceTypeName,
                                            limit: element.actualInsuranceLimit,
                                            money: element.firstInsurancePrice,
                                            no: element.sdewPrice,
                                            acNo: element.actualSdewPrice,
                                            // code: _this.company.detailCode,
                                            insuranceTypeCode: element.insuranceTypeCode,
                                            actMoney: element.actualFirstInsurancePrice || (_this.company.companyNo + _this.company.companyMoney)-0,
                                            companyCode: _this.tempBusi.valueCode
                                        }
                                        tempArrayTwo.push(list)
                                })

                                _this.resetTablelist(tempArrayTwo)
                                Toast('操作成功')
                                _this.$router.replace({
                                    path: '/insurance',
                                    query: {
                                        // order: _this.order.orderNo,
                                        order: _this.argObj.orderNo,
                                        carCode: _this.carCode
                                    }
                                })
                            }
                        })
                    } else {
                        // 如果添加险种不存在   则视为新增
                        option.detailList.push(tempObj)
                        api.insurance.changeInsurance(option, function(res){
                            if(res.data.code === 'success') {
                                let tempArray = JSON.parse(JSON.stringify(res.data.obj.detailList))
                                _this.saveInsuranceInfo(option)
                                _this.setBackData(res.data.obj)
                                for(let i = 0; i<tempArray.length; i++) {
                                    if(tempArray[i].insuranceTypeCode === 'vehicleAndVesselTax') {
                                        tempArray.splice(i, 1)
                                        break
                                    }
                                }
                                for(let j = 0;j<tempArray.length; j++) {
                                    if(tempArray[j].insuranceTypeCode === 'strongInsurance') {
                                        tempArray.splice(j, 1)
                                        break
                                    }
                                }
                                let tempArrayTwo = []
                                tempArray.forEach(function(element, index){
                                    let list = {
                                            name: element.insuranceTypeName,
                                            limit: element.actualInsuranceLimit,
                                            money: element.firstInsurancePrice,
                                            no: element.sdewPrice,
                                            acNo: element.actualSdewPrice,
                                            // code: _this.company.detailCode,
                                            insuranceTypeCode: element.insuranceTypeCode,
                                            actMoney: element.actualFirstInsurancePrice || (_this.company.companyNo + _this.company.companyMoney)-0,
                                            companyCode: _this.tempBusi.valueCode
                                        }
                                        tempArrayTwo.push(list)
                                })
                                _this.resetTablelist(tempArrayTwo)
                                Toast('操作成功')
                                _this.$router.replace({
                                    path: '/insurance',
                                    query: {
                                        // order: _this.order.orderNo,
                                        order: _this.argObj.orderNo,
                                        carCode: _this.carCode
                                    }
                                })
                            }
                        })
                    }
                } else {
                    let list = {
                        name: _this.company.companyName,
                        limit: _this.company.companyLimit,
                        money: _this.company.companyMoney,
                        no: _this.company.companyNo,
                        acNo: _this.company.companyNo,
                        insuranceTypeCode: _this.company.insuranceTypeCode,
                        actMoney: _this.company.actMoney ? _this.company.actMoney : (_this.company.companyNo - 0) + (_this.company.companyMoney- 0),
                        companyCode: _this.tempBusi.valueCode
                    }
                    list.actMoney = list.actMoney != '' ? list.actMoney : Number(_this.company.companyNo) + Number(_this.company.companyMoney)
                    if(list.name&&list.limit&&list.money&&list.insuranceTypeCode&&list.actMoney&&list.companyCode) {
                        _this.setTableList(list)
                        _this.$router.replace({
                            path: '/insurance',
                            query: {
                                order: _this.argObj.orderNo,
                                carCode: _this.carCode
                            }
                        })
                    } else {
                        Toast('请完善数据')
                    }
                }
            }
        })
    },
    back() {
        const _this = this
        _this.$router.replace({
            path: '/insurance',
            query: {
                order: _this.argObj.orderNo,
                carCode: _this.carCode
            }
        })
    },
    // 通过coCode 获得保险公司的商业险险种
    getKindsOfBusiness() {
        const _this = this
        const option = {
            'coCode': _this.tempBusi.valueCode
        }
        api.insurance.getKindsofInsurance(option, function(res) {
            if(res.data.code === 'success') {
                _this.itemlist = []
                if(res.data.obj) {
                    res.data.obj.forEach(element => {
                        if(element.insTypeCode !='strongInsurance' && element.insTypeCode != 'vehicleAndVesselTax') {
                            let obj = {
                                text: element.insTypeName,
                                // 临时改变  调整后改回来
                                value: element.insTypeRefDetailCode
                            }
                            _this.itemlist.push(obj)
                        }
                    })
                }
            }
        })
        _this.$refs.selectTwo.open()
    },
    // 获取帐类
    getAccountTypes() {
        const _this = this
        const option = {
            'refCode': config.insurancePlan.sequence,
            'pageNums': 100
        }
        api.ref.queryDictionaryDetails(option, function(res){
            if(res.data.code === 'success') {
                const array = res.data.obj.list
                let typeList = []
                for(var i = 0; i<array.length; i++) {
                    let obj = {}
                    obj.text = array[i].refDetailName
                    obj.value = array[i].refDetailCode
                    typeList.push(obj)
                }
                _this.setAccountTypes(typeList)
            }
        })
    },
    // 获取险种信息
    getXianType() {
        const _this = this
        _this.argObj = _this.$route.query
        _this.tempIndex = _this.argObj.index - 0
    },
    // 获取数据编辑信息
    getEditData() {
        const _this = this
        const index = _this.argObj.index - 0
        _this.company.companyName = _this.tablelist[index].name
        _this.company.companyLimit = _this.tablelist[index].limit
        _this.company.companyMoney = _this.tablelist[index].money
        _this.company.companyNo = _this.tablelist[index].acNo
        _this.company.companyCode = _this.tablelist[index].companyCode
        _this.company.insuranceTypeCode = _this.tablelist[index].insuranceTypeCode
        _this.company.actMoney = _this.tablelist[index].actMoney
        _this.tempCode = _this.tablelist[index].insuranceTypeCode
        _this.company.insuranceOrgName = _this.tablelist[index].companyName
    }
  },
  mounted() {
        const _this = this
        _this.getXianType()
        if(_this.argObj.index === 0 || _this.argObj.index) {
            _this.getEditData()
        }
  }
};
</script>
<style lang="scss" scoped>
    .listmodel {
        position: fixed;
        -webkit-transform: translateZ(0);
        // left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0,0,0,.4)
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
    .trafficInsurance {
        background-color: #ffffff
    }
    .trafficTitle {
        display: flex
    }
    .trafficTitle>div {
        flex: 1
    }
    .trafficTitle>div i {
        display: inline-block;
        width: .05rem;
        height: .1rem;
        background-color: red
    }
    .trafficTitle>div:nth-child(2) {
        text-align: right
    }
    .trafficTitle>div:nth-child(2) i {
        width: .1rem;
        border-radius: 50%;
    }
    .itemList>div:nth-child(1) {
        border-top: none;
        display:block;
    }
    .border-s {
        border-top: .07rem solid #e9e9e9
    }
    .save {
        position: fixed;
        -webkit-transform: translateZ(0);
        // left: 0px;
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
        border-right: rem(1) solid #e9e9e9
    }
    .left .hot span {
        display: block;
        text-align: center;
    }
    .left .hot span:first-child {
        font-size: rem(40)
    }
    .left .attache {
        flex: 1
    }
    .left .attache span {
        display: block;
        text-align: center
    }
    .left .attache span:first-child {
        font-size: rem(40)
    }
    .center {
        flex: 1
    }
    .sure {
      padding-top: rem(60);
      padding-left: rem(20);
      padding-right: rem(20);
    }
    .sure>div {
      height: rem(88);
      line-height: rem(88);
      background-image: linear-gradient(90deg, #008cee 0%, #36acfe 100%);
      color: #fff;
      font-size: rem(36);
      text-align: center;
      border-radius: rem(10)
    }
</style>
