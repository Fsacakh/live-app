<template>
    <div>
        <page-header>
            <div slot>
                新增公司
            </div>
        </page-header>
        <div>
            <cell title="*公司名称">
                <input v-model.trim="company.companyName" type="text" placeholder="请输入公司名称">
            </cell>
            <cell title="*社会信用代码">
                <input v-model.trim="company.companyFinanceInfoList[0].socialCreditCode" type="text" placeholder="请输入18位社会信用代码" maxlength="18" @change="checkSocialCreditCode">
            </cell>
            <cell title="*联系人">
                <input v-model.trim="company.companyContact" type="text" placeholder="请输入公司联系人">
            </cell>
            <cell title="*联系电话">
                <input v-model.trim="company.companyMobile" type="tel" placeholder="请输入公司联系电话">
            </cell>
            <cell-box class="m-t-10">
                <div class="w flex">
                    <cell class="w50 title-bold" title="更多信息">
                        <input type="text" placeholder="点击展开" readonly>
                    </cell>
                    <cell class="w50">
                        <span slot="right" :class="{ 'toTop': showAddModal, 'toBottom': !showAddModal }" @click="showAdd"></span>
                    </cell>
                </div>
            </cell-box>
            <div v-if="showAddModal">
                <cell title="注册资本">
                    <input v-model.number="company.registeredCapital" type="number" placeholder="请输入">
                </cell>
                <cell title="成立年份">
                    <input v-model.trim="company.yearEstablished" type="text" placeholder="请输入">
                </cell>
                <cell title="公司法人">
                    <input v-model.trim="company.legalRepresentative" type="text" placeholder="请输入">
                </cell>
                <cell title="公司地址">
                    <input v-model.trim="company.companyFinanceInfoList[0].companyAddress" type="text" placeholder="请输入">
                </cell>
                <cell title="公司电话">
                    <input v-model.number="company.companyFinanceInfoList[0].companyTel" type="number" placeholder="请输入">
                </cell>
                <cell title="纳税人识别号">
                    <input v-model.trim="company.taxpayerIdentificationNumber" type="text" placeholder="请输入">
                </cell>
                <cell title="开户银行">
                    <input v-model.trim="company.companyFinanceInfoList[0].openBankName" type="text" placeholder="请输入">
                </cell>
                <cell title="开户账号">
                    <input v-model.trim="company.companyFinanceInfoList[0].openBankAccount" type="text" placeholder="请输入">
                </cell>
            </div>
            <div class="submit">
                <mt-button size="large" @click="submit" type="primary">保存</mt-button>
            </div>
        </div>
    </div>
</template>
<script>
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
    import Vue from 'vue'
    import config from '../../common/config'
    import PageHeader from "components/header/PageHeader"
    import cellBox from '@/components/cell-box'
    import cell from 'components/cell'
    import api from '@/common/api'
    import {
        Toast,
        Button
    } from 'mint-ui'
    Vue.component(Button.name, Button)
    export default {
        mounted() {
            let _this = this
            api.ordinalInfo
                .getSequence(config.companySequence, (res) => {
                    if (res.data.code === 'success') {
                        _this.company.companyCode = res.data.obj
                        _this.company.companyFinanceInfoList[0].companyCode = res.data.obj
                    }
                })
        },
        data() {
            return {
                company: {
                    companyName: '',
                    companyContact: '',
                    companyMobile: '',
                    registeredCapital: '',
                    yearEstablished: '',
                    legalRepresentative: '',
                    socialCreditCode: '',
                    taxpayerIdentificationNumber: '',
                    companyFinanceInfoList: [{
                        companyAddress: '',
                        companyTel: '',
                        socialCreditCode: '',
                        taxpayerIdentificationNumber: '',
                        openBankAccount: '',
                        openBankName: ''
                    }]
                },
                showAddModal: false,
            }
        },
        methods: {
            goBack: function() {
                let _this = this
                _this.$router.go(-1)
            },
            showAdd: function() {
                let _this = this
                _this.showAddModal = !_this.showAddModal
            },
            checkSocialCreditCode: function() {
                let _this = this
                let result = true
                let reg = /^[0-9A-Z]{18}$/ 
                let socialCreditCode = _this.company.companyFinanceInfoList[0].socialCreditCode
                socialCreditCode = socialCreditCode.replace(/[IOSVZ]/g, "")
                if (!reg.test(socialCreditCode)) {
                    result = false
                    Toast('社会信用代码格式错误')
                }
                return result
            },
            checkValue: function() {
                let _this = this
                let result = true
                if (!_this.company.companyName) {
                    result = false
                }
                if (!_this.company.companyFinanceInfoList[0].socialCreditCode) {
                    result = false
                }
                if (!_this.company.companyContact) {
                    result = false
                }
                if (!_this.company.companyMobile) {
                    result = false
                }
                if (result) {
                   result = _this.checkSocialCreditCode()
                } else {
                    Toast('必填信息未填!!')
                }
                return result
            },
            submit: function() {
                let _this = this
                if (_this.checkValue()) {
                    api.company
                        .insertCompanyInfo(_this.$data.company, (res) => {
                            if (res.data.code === 'success') {
                                _this.$router.replace('/searchCompany/' + _this.$route.params.customCode + '/' + _this.company.companyCode)
                            }
                        })
                }
            }
        },
        components: {
            cell,
            cellBox,
            PageHeader
        }
    }
</script>
<style lang="scss" scoped>
    .more {
        margin-left: rem(30);
        text-align: bottom;
        padding-bottom: rem(20);
    }
    .toTop:before {
        width: 0;
        height: 0;
        border-left: rem(15) solid transparent;
        border-right: rem(15) solid transparent;
        border-bottom: rem(15) solid #008cee;
        font-size: 0;
        position: relative;
        bottom: rem(15);
        margin-right: rem(10);
        content: ' '
    }
    .toBottom:before {
        width: 0;
        height: 0;
        border-left: rem(15) solid transparent;
        border-right: rem(15) solid transparent;
        border-top: rem(15) solid #008cee;
        font-size: 0;
        margin-right: rem(10);
        content: ' '
    }
    .title-bold {
        font-weight: bold;
    }
    .submit {
        padding: 0 rem(20);
        margin-top: rem(65);
    }
</style>