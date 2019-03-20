<template>
    <div class="content">
        <pageheader>
            <div slot>
                个人资料
            </div>
        </pageheader>
        <div class="tost" v-if="tost">
            {{tost}}
        </div>
        <div>
            <cell title="姓名">
                <input v-model="params.customName" type="text" placeholder="请输入客户姓名">
            </cell>
            <live-select v-model="params.customGender" :selectData="selectData"></live-select>
            <cell title="联系手机" :triangle="true">
                <input readonly v-model="params.mobilePhone" type="tel" placeholder="请输入联系电话">
            </cell>
            <cell title="证件类型" :triangle="true" :cpType="'rests'">
                <input @click="clickidtype" onfocus="this.blur();" v-model="idtypename" type="text" placeholder="请选择证件类型">
            </cell>
            <cell title="证件号" :triangle="true">
                <input v-model="params.idNo" type="text" placeholder="请输入证件号">
            </cell>
            <div class="flex">
	            <cell title="所在城市" :triangle="true">
	                <input v-model="params.cityName" type="text" placeholder="填写城市">
	            </cell>
	            <cell title="所在区域" :triangle="true">
	                <input v-model="params.districtName" type="text" placeholder="填写区县/区域" class="m-l-20">
	            </cell>
            </div>
            <cell title="联系地址" :triangle="true">
                <input v-model="params.address" type="text" placeholder="请输入联系地址">
            </cell>
            <cell title="邮政编码" :triangle="true">
                <input v-model="params.postCode" type="text" placeholder="请输入邮政编码">
            </cell>
            <div class="car">
                <cell :border="false" title="现有车辆">
                    <input v-model="params.displayname" type="text" placeholder="请输入现有车辆">
                </cell>
            </div>
            <div class="w flex">
               <cell title="公司客户" :triangle="true" class="w66">
                   <input type="text" v-model="companyInfo.companyName" placeholder="请选择公司" readonly @click="searchCompany">
               </cell>
               <cell title="" :triangle="true" class="w33" @click.native="searchCompany">
                    <span class="wfStatus">
                        {{ companyWfStatus }}
                    </span>
                    <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
               </cell>
            </div>
        </div>
        <br/>
        <a href="javascript:;" class="more" @click="showAdd"><span v-if="!showAddModal" class="toBottom"/><span v-else class="toTop"/>更多</a>
        <v-addinfo ref="addModal" @leadsAddData="setLeadAdd"></v-addinfo>
        <div class="submit">
            <mt-button size="large" @click="submit" type="primary">保存</mt-button>
        </div>
        <div class="picker-pjl" v-if="pickershow" @click="stopBubble">
            <mt-picker :showToolbar="true" :slots="slots" valueKey="name" @change="onValuesChange">
                <div class="clearfix picker-top-pjl">
                    <mt-button @click.stop="pickerconfirm(0)" class="fl" size="small" type="primary">取消</mt-button>
                    <mt-button @click.stop="pickerconfirm(1)" class="fr" size="small" type="primary">确认</mt-button>
                </div>
            </mt-picker>
        </div>
    </div>
</template>

<script>
    import Vue from 'vue'
    import {
        mapState,
        mapGetters,
        mapActions
    } from 'vuex'
    import cell from '@/components/cell'
    import liveSelect from '@/components/select'
    import pageheader from '@/components//header/PageHeader'
    import api from '@/common/api'
    import config from '@/common/config'
    import common from '@/common/common'
    import VAddinfo from '@/views/customer-center/addInfo'
    import {
        Button,
        Picker,
        Toast,
        MessageBox
    } from 'mint-ui'
    Vue.component(Button.name, Button);
    Vue.component(Picker.name, Picker);
    export default {
        data() {
            return {
                menulist: [],
                tost: "",
                selectData: [{
                    value: 0,
                    text: "女"
                }, {
                    value: 1,
                    text: "男"
                }],
                params: {
                    customGender: 1,
                    customName: "",
                    mobilePhone: "",
                    cityName:'',
                    districtName:'',
                    address: "",
                    leadsAddInfoVos: null,
                    displayname: ''
                },
                pickershow: false,
                showAddModal: false,
                idType: [],
                slots: [{
                    flex: 1,
                    values: [],
                    className: 'slot',
                    textAlign: 'center'
                }],
                pickerValue: null,
                idtypename: "",
                displayname: "", //现有车辆
                companyInfo: {
                    companyCode: '0',
                    companyName: '',
                }
            }
        },
        computed: {
            companyWfStatus: function() {
                let _this = this
                let result = ''
                if (_this.companyInfo.wfStatus == -1) {
                    result = '待审批'
                } else if (_this.companyInfo.wfStatus == 0) {
                    result = '审批中'
                }
                return result
            },
            ...mapState('customer', [
              'personInfo',
              'displayName'
            ])
        },
        methods: {
            stopBubble(e) {
                if (e && e.stopPropagation) {
                    e.stopPropagation(); //w3c
                } else {
                    window.event.cancelBubble = true; //IE
                }
            },
            pickerconfirm(type) {
                if (type) {
                    //确认
                    this.pickershow = false
                    if (this.pickerValue) {
                        this.params.idTypeCode = this.pickerValue.code
                        this.slots[0].value = this.pickerValue
                        this.idtypename = this.pickerValue.name
                        this.params.idTypeName = this.idtypename
                    }
                } else {
                    //取消
                    this.pickershow = false
                }
            },
            onValuesChange(picker, value) {
                this.pickerValue = value[0]
            },
            getDataDictionary(code, obj, callback) {
                api.ref.getDataDictionary({
                        refCode: code
                    },
                    msg => {
                        if (msg.data.message == "success") {
                            let data = msg.data.obj.referenceDetailInfos;
                            for (let index = 0; index < data.length; index++) {
                                this.$set(obj, index, {
                                    code: data[index].refDetailCode,
                                    name: data[index].refDetailName,
                                    type: code
                                });
                            }
                        }
                    }
                );
            },
            clickidtype() {
                this.pickershow = true
            },
            setLeadAdd: function(val) {
                this.params.leadsAddInfoVos = val
            },
            showAdd: function() {
                this.showAddModal = !this.showAddModal
                this.$refs.addModal.setShowAddModal(this.params.leadCode, 'add')
            },
            submit() {
                this.$refs.addModal.setAddData(this.params.leadCode);
                if (!this.params.customName) {
                    Toast('客户姓名不能为空');
                    return
                }
                if (!this.params.mobilePhone) {
                    Toast('联系手机不能为空');
                    return
                } else {
                    if (!common.isTel(this.params.mobilePhone)) {
                        Toast('联系手机填写错误');
                        return
                    }
                }
                api.clue.addclue(this.params, (msg) => {
                    if (msg.data.message == 'success') {
                        if (this.existCarCode) {
                            api.clue.addExistCarInfo([{
                                leadCode: this.params.leadCode,
                                displayName: this.params.displayname,
                                existCarCode: this.existCarCode,
                                id: this.displayid
                            }], (msg) => {
                                if (msg.data.message == 'success') {
                                    Toast('操作成功');
                                    this.$router.go(-1)
                                }
                            })
                        } else {
                            api.ordinalInfo.getSequence(config.EXISTCAR, (msg) => {
                                api.clue.addExistCarInfo([{
                                    leadCode: this.params.leadCode,
                                    displayName: this.params.displayname,
                                    existCarCode: msg.data.obj
                                }], (msg) => {
                                    if (msg.data.message == 'success') {
                                        Toast('操作成功');
                                        setTimeout(() => {
                                            this.$router.go(-1)
                                        }, 500)
                                    }
                                })
                            })
                        }
                    }
                })
            },
            searchCompany: function() {
                let _this = this
                if (_this.companyInfo.wfStatus == 0) {
                   MessageBox.confirm('该信息处于审批状态, 是否撤回?', '审批中', {
                    confirmButtonText: '撤回',
                    cancelButtonText: '取消',
                    type: 'warning',
                   }).then((action) => {
                       if (action === 'confirm') {
                            api.customer
                              .withdrawCustomCompanyInfo({
                                customCode: _this.companyInfo.customCode
                              }, (res) => {
                                if (res.data.code === 'success') {
                                    _this.getCompany()
                                }
                              })
                       }
                    })
                } else {
                   _this.setPersonInfo(_this.$data.params)
                  _this.setDisplayName(_this.$data.displayname)  //现有车辆储存在vueX中

                   _this.$router.push('/searchCompany/' + _this.$data.params.customCode + '/' + _this.companyInfo.companyCode)
                }
            },
            getCompany: function() {
                let _this = this
                api.customer.queryCustomCompanyInfoNoPage({
                       customCode: _this.params.customCode
                   }, (res) => {
                       if (res.data.code === 'success') {
                        let companyInfo = res.data.obj[0]
                        _this.$data.companyInfo =  companyInfo ? companyInfo: {
                            companyCode: '0'
                        }
                       }
                   })
            },
            ...mapActions('customer', [
               'setPersonInfo','setDisplayName'
            ])
        },
        mounted() {
            this.leadCode = this.$route.params.leadCode
            this.getDataDictionary(config.ref.idtype, this.idType);
            this.slots[0].values = this.idType
            api.clue.querydetailclue({
                leadCode: this.leadCode
            }, (msg) => {
                if (msg.data.message == 'success') {
                    let data = msg.data.obj || {}
                    let existCarInfoVos = (data.existCarInfoVos && data.existCarInfoVos[0]) || {}
                    this.displayname = existCarInfoVos.displayName
                    if (this.personInfo.id) {
                       this.params = JSON.parse(JSON.stringify(this.personInfo))
                       this.idtypename = this.params.idtypename
                       this.displayname = this.displayName 
                    } else {
                       this.params.customName = data.customName
                       this.params.customCode = data.customCode
                       this.params.customGender = data.customGender
                       this.params.mobilePhone = data.mobilePhone
                       this.params.idNo = data.idNo
                       this.params.cityName = data.cityName
                       this.params.districtName = data.districtName
                       this.params.address = data.address
                       this.params.postCode = data.postCode
                       this.params.channelCode = data.channelCode
                       this.params.idTypeCode = data.idTypeCode
                       this.params.id = data.id
                       this.params.displayname = data.displayname = this.displayname
                       this.params.leadCode = data.leadCode
                       this.params.idTypeName = this.idtypename = data.idTypeName
                    }
                    this.displayid = existCarInfoVos.id
                    this.existCarCode = existCarInfoVos.existCarCoded
                    this.getCompany()
                }
            })
        },
        components: {
            cell,
            liveSelect,
            pageheader,
            VAddinfo
        }
    }
</script>

<style lang="scss" scoped>
    .content{
        position: fixed;
        width: 100%;
        height:100%;
        overflow-y: auto;
    }
    .wfStatus {
        color: #ccc;
    }
    .submit {
        padding: 0 rem(20);
        margin-top: rem(65);
    }
    .car {
        margin-top: rem(10);
    }
    .tost {
        width: 100%;
        height: rem(72);
        text-align: center;
        color: #ffffff;
        background: rgba(254, 56, 36, 0.90);
        line-height: rem(72);
    }
    .picker-pjl {
        position: fixed;
        -webkit-transform: translateZ(0);
        width: 100%;
        height: remp(200);
        overflow: hidden;
        bottom: 0; // transform: translateY(50%);
        left: 0;
        background-color: #fff;
    }
    .picker-top-pjl {
        background-color: #26a2ff;
    }
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
</style>
