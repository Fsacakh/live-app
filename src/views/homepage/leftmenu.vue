<template lang="html">
    <div class="contentleft b-white" @click.stop="hideMenu(0)">
        <!-- <span class="iris"  @click="hideMenu(1)">
            <i class="icon iconfont icon-icon-zhihuan pull-left"></i>
        </span> -->
        <div class="picture">
            <div class="img">
                <img src="../../assets/imgage/user.png" width="100%" height="100%"> 
            </div>
        </div>
        <div class="detail">
            <div class="people">
                <div class="name tc">{{ loginInfo.empVo.empCnName }}</div>
                <div class="post tc">{{ loginInfo.inChargePostnVo.postName }}</div>
            </div>
            <div class="title7">{{ loginInfo.inCharegSubOrgVo.orgName }}</div>
            <div class="cipher tr" @click="changepassword()"><i class="icon iconfont icon-icon-xiugaimima pull-left"></i>修改密码</div>
            <div v-if="orgList.length>1" class="changepost tr" :class="{'hoverpost': accordion}" @click="selesk()"><i class="icon iconfont icon-icon-qiehuan pull-left"></i>切换组织</div>
            <div class="accordion b-white" v-if="accordion">
                <ul>
                    <li v-for="(item, index) in orgList" :key="index" @click="sureAndChange(item)">
                        <p class="titlepost tc">{{ item.orgName }}</p>
                        <p class="pext tc">{{ item.orgTypeName }}</p>
                    </li>
                </ul>
            </div>
        </div>
        <div class="footdown">
            <div class="foottext tr" @click="outlogin"><i class="icon iconfont icon-icon-tuichu pull-left"></i>退出登录</div>
        </div>
    </div>
</template>
<script>
    import { MessageBox, Toast } from 'mint-ui'
    import api from 'common/api'
    import { mapState } from 'vuex'
    export default {
        props: {
            refresh: {
                type: Function,
                default: function() {

                }
            }
        },
        data() {
            return {
                accordion: false,
                userInfo: {},
                orgList: [],
                loginData: ''
            }
        },
        computed: {
            ...mapState('homepage', [
                'loginInfo'
            ])
        },
        methods: {
            hideMenu: function (val) {
                if(val=='1') {
                    this.$emit('hideLeft', false)
                } else {
                    return
                }
            },
            outlogin: function() {
                MessageBox.confirm('确定退出?').then(action => {
                    wst.loginOut()   
                }, action => {

                })
            },
            changepassword: function () {
                this.$router.push({
                    path: '/changepassword'
                })
            },
            selesk() {
                this.accordion = !this.accordion
            },
            getUserInfo() {
                api.getUserInfo.getUserAvailableInfo(function(res) {
                    console.log(res)
                })
            },
            getLoginInfo: function () {
                this.$store.dispatch('homepage/getLoginInfo', () =>{
                    this.loginData = this.loginInfo
                    console.log(this.loginData)
                })
            },
            // getUserInfo() {
            //     const _this = this
            //     api.homepage.queryUpcomingInfo({callback:function(res) {
            //         if(res.data.code === 'success') {
            //             _this.userInfo = res.data.obj
            //         }
            //     }})
            // }
            getOrgs() {
                const _this = this
                api.getUserInfo.getOrgs(function(res) {
                    // console.log(res)
                    if(res.data.code === 'success') {
                        _this.orgList = res.data.obj
                    }
                })
            },
            sureAndChange(item) {
                const _this = this
                let option = {
                    orgCode: item.orgCode
                }
                api.resetLogin.changeLogin(option, function(res){
                    if(res.data.code === 'success') {
                        Toast('切换成功')
                        _this.hideMenu('1')
                        // _this.$router.push({
                        //     path: `/homepage`
                        // })
                        _this.getLoginInfo()
                        _this.refresh()
                    }
                })
            }
        },
        created() {
            const _this = this
            _this.getLoginInfo()
            // _this.getOrgs()
            // _this.getUserInfo()
            _this.getOrgs()
            // console.log(_this.loginInfo)
        }
    }
</script>
<style lang="scss" scope>
    .contentleft {
        box-sizing: border-box;
        position: relative;
        width: remp(245);
        height: 100%;
        // height: 100%;
    }
    .contentleft .iris {
        position: absolute;
        top: remp(10);
        right: remp(10);
        font-size: remp(20)
    }
    .accordion ul {
        height: remp(170);
        overflow-y: auto;
    }
    .accordion li > .pext {
        height: remp(18.5);
        line-height: remp(18.5);
        font-size: remp(13);
        color: rgb(51, 51, 51)
    }
    .accordion li > .titlepost {
        margin-bottom: remp(1);
        height: remp(21);
        line-height: remp(21);
        font-size: remp(15);
        color: rgb(51, 51, 51);
        font-weight: 600
    }
    .accordion li {
        padding: remp(7) 0;
        padding-right: remp(20);
        border-bottom: remp(1) solid rgb(240, 242, 245)
    }
    .accordion li:last-child {
        border-bottom: none; 
    }
    .accordion {
        margin-right: remp(-20);
    }
    .footdown .foottext {
        height: remp(21);
        line-height: remp(21);
        font-size: remp(15);
        color: red;
    }
    .footdown {
        position: absolute;
        bottom: 0;
        box-sizing: border-box;
        width: remp(245);
        height: remp(48.5);
        border-top: 1px solid #ccc;
        padding: remp(13.5) remp(100) remp(14) remp(45)
    }
    .detail .changepost {
        box-sizing: border-box;
        padding-right: remp(80);
        padding-left: remp(45);
        height: remp(55);
        line-height: remp(55);
        font-size: remp(15);
        color: rgb(51, 51, 51)
    }
    .detail .cipher {
        box-sizing: border-box;
        height: remp(55);
        padding-right: remp(80);
        padding-left: remp(45);
        line-height: remp(55);
        font-size: remp(15);
        color: rgb(51, 51, 51)
    }
    .detail .hoverpost {
        background: -webkit-linear-gradient(left, rgba(0, 140, 238, 0.3), rgba(255, 255, 255, 0));
        background: -o-linear-gradient(right, rgba(0, 140, 238, 0.3), rgba(255, 255, 255, 0));
        background: -moz-linear-gradient(right, rgba(0, 140, 238, 0.3), rgba(255, 255, 255, 0));
        background: linear-gradient(left, rgba(0, 140, 238, 0.3), rgba(255, 255, 255, 0));
        border-left: remp(5) solid rgb(0, 140, 238) 
    }
    .detail .title7 {
        // width: remp(156);
        height: remp(18.5);
        line-height: remp(18.5);
        text-align: center;
        font-size: remp(13);
        color: rgb(51, 51, 51);
        padding: remp(0) remp(25.5) remp(15) remp(32);
    }
    .people {
        display: flex;
    }
    .people .post {
        flex: 1;
        width: remp(60);
        height: remp(20);
        line-height: remp(20);
        border-radius: remp(3);
        background-color: rgb(189, 199, 209);
        font-size: remp(12);
        color: white;
    }
    .people .name {
        flex: 1;
        display: inline-block;
        // width: remp(81);
        height: remp(20);
        text-align: center;
        line-height: remp(20);
        overflow: hidden;
        vertical-align: middle;
        font-size: remp(14);
        color: rgb(51, 51, 51);
    }
    .detail .people {
        padding-bottom: remp(5);
        // padding-right: remp(25);
    }
    .padding-45 {
        padding: 0 remp(45);
    }
    .contentleft .detail {
        padding-top: remp(19.3);
        padding-right: remp(20);
    }
    .contentleft .picture {
        box-sizing: border-box;
        padding: remp(60) remp(82) remp(0) remp(82);
    }
    .picture .img {
        width: remp(73.5);
        height: remp(73.5);
        box-sizing: border-box;
        background-color: #008cee;
        padding: remp(3.8) remp(3.5) remp(3.7) remp(3.9);
        border-radius: 50%;
    }
</style>
