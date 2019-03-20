<template>
    <div>
        <page-header @on-click-right="editCompany">
            <div slot>
                选择公司
            </div>
            <div slot="right">
                新增
            </div>
        </page-header>
        <div class="search-warp">
            <div class="search w max-width" id="search">
                <input type="search" placeholder="模糊匹配关键字" v-model="companyName" @change="getCompanyList">
            </div>
        </div>
        <div class="list-box">
            <scroll class="list" :pullup="true" :data="companyList" @scrollToEnd="dropdown">
                <div class="box">
                    <div class="company-item" v-for="(company, index) in companyList" :class="{ 'active': company.active }" @click="setSelected(index)">
                        <div class="flex w">
                            <span>
                                {{ company.companyName }}  
                            </span>
                        </div>
                    </div>
                    <div class="company-item" v-if="!companyList.length && loadingNoData">
                        <div class="flex w">
                            <span>
                                {{ '无匹配结果' }}  
                            </span>
                        </div>
                    </div>
                    <p class="loading-text">{{ showText }}</p>
                </div>
            </scroll>
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
    import PageHeader from "@/components/header/PageHeader"
    import Scroll from '@/components/scroll/scroll'
    import NoData from '@/components/no-data/no-data'
    import cell from '@/components/cell'
    import api from '@/common/api'
    import {
        Toast,
        Button
    } from 'mint-ui'
    Vue.component(Button.name, Button)
    export default {
        mounted() {
            let _this = this
            if (_this.$route.params.companyCode != '0' && _this.$route.params.companyCode) {
                    api.company
                        .queryCompanyInfoNoPage({
                            companyCode: _this.$route.params.companyCode
                        }, (res) => {
                            if (res.data.code === "success") {
                                _this.$data.companyList = res.data.obj
                                if (_this.$data.companyList.length === 0) {
                                    _this.$data.loadingNoData = true
                                }
                                _this.$data.companyList.forEach((company, index) => {
                                    if (company.companyCode == _this.$route.params.companyCode) {
                                        _this.$set(_this.$data.companyList[index], 'active', true)
                                        _this.$data.companyCode = _this.$route.params.companyCode
                                        _this.companyName = _this.$data.companyList[index].companyName
                                    }
                                })
                            }
                        })
            }
        },
        data() {
            return {
                showText: '',
                companyName: '',
                companyCode: '',
                companyList: [],
                loadingNoData: false
            }
        },
        methods: {
            goBack: function() {
                let _this = this
                _this.$router.go(-1)
            },
            dropdown: function() {
                let _this = this
            },
            getCompanyList: function() {
                let _this = this
                _this.$data.loadingNoData = false
                api.company
                    .queryCompanyInfoNoPage({
                        companyName: _this.companyName
                    }, (res) => {
                        if (res.data.code === "success") {
                            _this.$data.companyList = res.data.obj
                            _this.$data.companyCode = ''
                            if (_this.$data.companyList.length === 0) {
                                _this.$data.loadingNoData = true
                            }
                        }
                    })
            },
            editCompany: function() {
                let _this = this
                _this.$router.replace('/editCompany/' + _this.$route.params.customCode)
            },
            setSelected: function(num) {
                let _this = this
                let active = _this.companyList[num].active
                active = !active
                _this.$set(_this.companyList[num], 'active', active)
                if (active) {
                   _this.companyCode = _this.companyList[num].companyCode
                } else {
                   _this.companyCode = ''  
                }
                _this.companyList.forEach((company, index) => {
                    if (company.active && index != num) {
                        _this.$set(_this.companyList[index], 'active', false)
                    }
                })
            },
            submit: function() {
                let _this = this
                let params = {
                    companyCode: _this.$data.companyCode,
                    customCode: _this.$route.params.customCode
                }
                if (_this.$data.companyCode) {
                    api.customer
                        .insertCustomCompanyInfo(params, (res) => {
                            if (res.data.code === 'success') {
                                _this.submitWf()
                            }
                        })
                } else {
                    Toast('未选择公司!!')
                }
            },
            submitWf: function() {
                let _this = this
                let params = {
                    customCode: _this.$route.params.customCode
                }
                api.customer
                    .submitCustomCompanyInfo(params, (res) => {
                        if (res.data.code === 'success') {
                            _this.goBack()
                        }
                    })
            }
        },
        components: {
            cell,
            NoData,
            Scroll,
            PageHeader
        }
    }
</script>
<style lang="scss" scoped>
    .search-warp {
        height: remp(44);
    }
    .search {
        box-sizing: border-box;
        height: remp(44);
        padding: remp(10) remp(10);
        background-color: #eceef3;
        position: fixed;
        -webkit-transform: translateZ(0);
        z-index: 3;
        top: remp(47);
    }
    .search input {
        border: none;
        box-sizing: border-box;
        display: block;
        width: 100%;
        height: 100%;
        color: rgb(126, 131, 135);
        text-align: left;
        font-size: remp(12);
        padding: remp(8) remp(10);
    }
    .search input::-webkit-input-placeholder {
        color: rgb(126, 131, 135);
        font-size: remp(12);
        text-align: center;
    }
    .list-box {
        position: fixed;
        -webkit-transform: translateZ(0);
        top: remp(88);
        width: 3.75rem;
        bottom: 0;
        .list {
            width: 100%;
            height: 80%;
            background-color: rgb(245, 245, 249);
            overflow: hidden;
        }
        .no-data-box { 
            width: 100%;
            height: 47.6%;
        }    
    }
    .company-item {
        padding: rem(20) rem(50) rem(20) rem(30);
        display: flex;
        flex-direction: column;
        background: rgb(255, 255, 255);
        color: rgb(51, 51, 51);
        margin-bottom: rem(5);
    }
    .active {
        background: #ccc !important;
    }
    .submit {
        padding: 0 rem(20);
        margin-top: rem(65);
    }
</style>
