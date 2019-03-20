<template>
    <div>
        <page-header ref="header">
            <div slot>报价单-随车政策信息</div>
            <div @click="edit" v-if="!showDelete && isSc && hasApprove" slot="right">编辑</div>
            <div @click="cancel" v-if="showDelete && isSc && hasApprove" slot="right">取消</div>
        </page-header>
        <div class="listContainer">
            <div class="item p-t-10 p-b-10 p-l-10 p-r-10 b-b" v-for="(item, index) in policyList" :key="index">
                <div class="title p-b-10">
                    {{ item.promotionName }}
                </div>
                <div class="container">
                    <p>
                        政策内容: <span>{{ item.importPolicyContent }}</span>
                    </p>
                    <p>
                        赠送条件: <span>{{ item.importPolicyCheckCondition }}</span>
                    </p>
                    <p v-if="(item.proStatus === 1 ? true: false)">
                        ¥&nbsp;<span>{{ item.importTotalMoney }}</span>
                    </p>
                    <p v-if="(item.proStatus ===0? true: false)">
                        ¥<span v-if="!showDelete">{{ item.businessSiValue }}</span>&nbsp;<input v-if="showDelete" type="number" v-model="item.businessSiValue" placeholder="" @keyup="NumCheck">
                    </p>
                </div>
                <div class="typeName">
                    {{ item.accountTypeName }}
                </div>
                <div v-if="showDelete" class="isChoose" @click="deletePolicy(item)">
                    删除
                </div>
                <div class="itemList">
                    <cell title="账类">
                        <input type="text" readonly v-model="item.accountTypeName">
                    </cell>
                </div>
            </div>
        </div>
        <div v-if="hasData" class="tempNone">
            暂无随车政策信息
        </div>
        <div v-show="showLoading" class="loading-container">
            <loading></loading>
        </div>
        <div v-if="!showDelete && isSc && hasApprove" class="choosePlan add p-l-10 p-r-10 p-t-10 p-b-10">
            <div @click="addPolicy">
                <i class="icon iconfont icon-icon-tianjia"></i> 添加随车政策
            </div>
        </div>
        <div v-if="showDelete" class="choosePlan add p-l-10 p-r-10 p-t-10 p-b-10">
            <div @click="finish">
                完成
            </div>
        </div>
    </div>
</template>
<script>
    import PageHeader from "components/header/PageHeader"
    import config from 'common/config'
    import SelectItem from 'components/select-item/select-item'
    import Loading from 'components/loading/loading'
    import {
        Toast
    } from 'mint-ui'
    import cell from 'components/cell'
    import api from 'common/api'
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
    export default {
        data() {
            return {
                //暂无随车政策信息是否显示，如果查不到数据则展示这段文案
                hasData: false,
                //判断随车政策项中删除按钮是否显示，随编辑按钮联动
                showDelete: false,
                //页面loading状态
                showLoading: true,
                //随车政策列表数据
                policyList: [],
                // editData: [],
                editDataArray: [],
                //报价单单号
                orderNo: '',
                //权限判断，用于显示隐藏部分按钮
                isSc: false,
                //判断当前报价单是否已审批
                hasApprove: false
            }
        },
        computed: {
            ...mapState('order', [
                'order'
            ])
        },
        components: {
            PageHeader,
            cell,
            Loading,
            SelectItem
        },
        methods: {
            //获取用户登录信息并且查询该订单是否已审批
            judgeIsSC() {
                const _this = this
                //获取用户登录信息 对应参数: 无
                api.login.getLoginInfo().then((res) => {
                    if (res.data.code === 'success') {
                        if (res.data.obj.postnTypes != undefined && res.data.obj.postnTypes != null) {
                            _this.isSc = false
                            let postnTypes = new Set(res.data.obj.postnTypes)
                            if (postnTypes.has(config.root.scPostTypeCode)) {
                                _this.isSc = true
                            } else if (postnTypes.has(config.root.smPostTypeCode)) {
                                _this.isSc = false
                            }
                        }
                    }
                })
                api.clearingsettlement.order.queryOrderInfoVosByCodeFromDB({
                    orderNo: _this.$route.params.orderNo,
                    allSubOrderFlag: true
                }, function(res) {
                    if (res.data.code === 'success') {
                        if (res.data.obj.closingFlag != 1 && res.data.obj.carOrderInfoVoList[0].wfStatus != 0 && res.data.obj.carOrderInfoVoList[0].currentOrderWfTypeCode != null) {
                            _this.hasApprove = true
                        }
                        if (res.data.obj.closingFlag != 1 && res.data.obj.carOrderInfoVoList[0].wfStatus == -1 && res.data.obj.carOrderInfoVoList[0].currentOrderWfTypeCode == null) {
                            _this.hasApprove = true
                        }
                    }
                })
            },
            //获取报价单随车政策
            getPolicyByOrder() {
                const _this = this
                let option = {
                    orderNo: _this.orderNo
                }
                api.policyWidthCar.queryPolicyInfo(option, function(res) {
                    if (res.data.code === 'success') {
                        _this.showLoading = false
                        _this.policyList = res.data.obj
                        if (_this.policyList.length === 0) {
                            _this.hasData = true
                        } else {
                            _this.hasData = false
                        }
                        _this.editDataArray = JSON.parse(JSON.stringify(_this.policyList))
                    }
                })
            },
            chooseItemOne(arg) {
                let _this = this
                let num = _this.index
                _this.policyList[num].accountTypeCode = arg.value
                _this.policyList[num].accountTypeName = arg.text
            },
            addPolicy() {
                const _this = this
                _this.$router.replace({
                    path: '/carwithpolicy/' + _this.orderNo
                })
            },
            // 编辑按钮
            edit() {
                const _this = this
                _this.showDelete = true
                _this.policyList.forEach((element) => {})
            },
            // 删除按钮
            deletePolicy(item) {
                const _this = this
                let option = {
                    orderNo: _this.orderNo,
                    orderPromotionCode: item.orderPromotionCode,
                    id: item.id,
                    promotionCode: item.promotionCode
                }
                api.policyWidthCar.removePolicy(option, function(res) {
                    if (res.data.code === 'success') {
                        Toast('删除成功')
                        _this.getPolicyByOrder()
                    }
                })
            },
            // 校验输入的值
            NumCheck() {
                const _this = this
                var tempArray = _this.policyList;
                tempArray.forEach(element => {
                    var re = /^\d*$/; //^匹配字符串开始位置   \d 匹配任意一个十进制数字，等价于[0-9]  * 匹配0次 1次或者多次前面的字符  $匹配字符串的结束位置  
                    if (!re.test(element.businessSiValue)) {
                        element.businessSiValue = 0;
                    }
                })
            },
            // 取消
            cancel() {
                const _this = this
                _this.showDelete = false
                _this.policyList = JSON.parse(JSON.stringify(_this.editDataArray))
            },
            finish() {
                const _this = this
                let list = []
                let comArray = _this.editDataArray
                let tempArray = _this.policyList
                let submitArray = []
                for (let i = 0, len = tempArray.length; i < len; i++) {
                    if ((tempArray[i].businessSiValue != comArray[i].businessSiValue) || (tempArray[i].accountTypeCode != comArray[i].accountTypeCode)) {
                        list.push(tempArray[i])
                    }
                }
                list.forEach(element => {
                    if (element.proStatus === 0) {
                        let obj = {
                            orderNo: _this.orderNo,
                            orderPromotionCode: element.orderPromotionCode,
                            orderPromotionDetailCode: element.promotionCode,
                            promotionCost: element.businessSiValue,
                            businessCost: element.businessSiValue,
                            accountTypeCode: element.accountTypeCode,
                            accountTypeName: element.accountTypeName
                        }
                        submitArray.push(obj)
                    } else {
                        let obj = {
                            orderNo: _this.orderNo,
                            orderPromotionCode: element.orderPromotionCode,
                            orderPromotionDetailCode: element.promotionCode,
                            accountTypeCode: element.accountTypeCode,
                            accountTypeName: element.accountTypeName
                        }
                        submitArray.push(obj)
                    }
                })
                if (submitArray.length > 0) {
                    api.policyWidthCar.editPolicy(submitArray, function(res) {
                        if (res.data.code === 'success') {
                            Toast('操作成功')
                            _this.getPolicyByOrder()
                            _this.showDelete = false
                        }
                    })
                } else {
                    _this.showDelete = false
                }
            },
            getOrderNo() {
                let _this = this
                _this.orderNo = _this.$route.params.orderNo
                _this.getPolicyByOrder()
            }
        },
        created() {
            let _this = this
            _this.getOrderNo()
            _this.judgeIsSC()
        }
    }
</script>
<style lang="scss" scoped>
    .listContainer {
        font-size: remp(12);
        overflow-y: auto;
        padding-bottom: remp(70);
    }
    .listContainer .item {
        position: relative;
        background-color: #ffffff;
    }
    .listContainer .item .title {
        color: rgb(51, 51, 51);
        font-weight: bolder;
        width: 60%;
        box-sizing: border-box;
        color: rgb(51, 51, 51);
        font-weight: bolder;
    }
    .listContainer .item .container p:first-child {
        padding-bottom: remp(5);
    }
    .listContainer .item .container p:nth-child(2) {
        padding-bottom: remp(9);
    }
    .listContainer .item .container p:last-child {
        color: rgba(254, 56, 36, 0.9);
        padding: remp(5) 0;
    }
    .listContainer .item .container p input {
        text-align: left;
        color: rgba(254, 56, 36, 0.9);
        outline: none;
        border: none;
    }
    .listContainer .item .typeName {
        position: absolute;
        right: remp(25);
        top: remp(10);
        color: rgb(126, 131, 135);
    }
    .listContainer .item .isChoose {
        position: absolute;
        right: remp(25);
        bottom: remp(60);
        width: remp(60);
        height: remp(20);
        box-sizing: border-box;
        border: remp(1) solid rgba(254, 56, 36, 0.9);
        color: rgba(254, 56, 36, 0.9);
        text-align: center;
        line-height: remp(20);
        border-radius: remp(3);
    }
    .add {
        position: fixed;
        -webkit-transform: translateZ(0);
        left: 0;
        bottom: 0;
        width: 100%;
        box-sizing: border-box;
    }
    .add>div {
        height: remp(40);
        background-image: linear-gradient(to right, rgb(54, 172, 254), rgb(0, 140, 238));
        font-size: remp(14);
        text-align: center;
        line-height: remp(40);
        border-radius: remp(3);
        color: #ffffff;
    }
    .tempNone {
        position: fixed;
        -webkit-transform: translateZ(0);
        top: 50%; // right: 50%;
        right: 0;
        width: 100%; // transform: translate(-50%,-50%);
        text-align: center;
    }
    .listmodel {
        position: fixed;
        -webkit-transform: translateZ(0);
        left: 0;
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
        height: rem(380);
        background-color: #e7e7e7;
    }
    .listmodel>.modelContainer .title {
        height: rem(80);
        line-height: rem(80);
        background-color: rgb(54, 172, 254)
    }
    .listmodel>.modelContainer ul {
        height: rem(300);
        overflow-y: auto;
    }
    .listmodel>.modelContainer ul li {
        height: rem(70);
        line-height: rem(70);
        text-align: center;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
    }
</style>
