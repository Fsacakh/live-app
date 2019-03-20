<template>
    <div>
        <page-header @on-click-right="more">
            <div slot="left">
                <div class="left-arrow" @click="callback"></div>
            </div>
            <div slot>修改密码</div>
        </page-header>
        <!-- <div class="verify tc" v-if="verify">{{hintinfo}}</div> -->
        <div class="cententbox b-white">
            <div class="oldpassword">
                <label for="oldpass">旧密码: </label>
                <input id="oldpass" class="tl" type="password" v-model="oldLoginPassword" placeholder="请输入密码">
            </div>
            <div class="newpassword">
                <label for="newpass">新密码：</label>
                <input id="newpass" class="tl" type="password" v-model="loginPwd" placeholder="请输入新密码">
            </div>
            <div class="confirmpassword">
                <label for="confirmpass">确认密码：</label>
                <input id="confirmpass" class="tl" type="password" v-model="surepassword" placeholder="请确认密码">
            </div>
        </div>
        <div class="subbtn">
            <p class="tc" @click="submitpass">提交</p>
        </div>
    </div>
</template>
<script>
    import {Toast} from 'mint-ui'
    import api from '../../common/api'
    import config from '../../common/config'
    import PageHeader from 'components/header/PageHeader'
    export default {
        components: {
          PageHeader  
        },
        data() {
            return {
                oldLoginPassword: "",
                loginPwd: "",
                surepassword: "",
            }
        },
        methods: {
            callback: function () {
                const _this = this
                _this.$router.push({
                    path: `/homepage`
                })
                wst.showToast('1') 
            },
            more() {},
            submitpass: function() {
                if(this.oldLoginPassword == '') {
                    Toast({
                        message: config.hints.changepassworderror1,
                        position: 'top'
                    })
                } else if (this.loginPwd != this.surepassword) {
                    Toast({
                        message: config.hints.changepassworderror2,
                        position: 'top'
                    })
                } else {
                    let params = {
                        'loginPasswd': this.loginPwd,
                        'oldLoginPassword': this.oldLoginPassword,
                    }
                    api.resetpassword.reset(params, (res) => {
                        if(res.data.code=='success') {
                            Toast({
                                message: config.hints.changepassword,
                                position: 'top'
                            })
                            setTimeout(function() {
                                wst.loginOut()
                            }, 500)
                        }
                    })
                }
            }
        }
    }
</script>
<style lang="scss">
    .verify {
        height: remp(36);
        line-height: remp(36);
        background-color: rgba(254, 56, 36, 0.9);
        color: #fff;
    }
    .subbtn {
        padding: remp(0) remp(10);
        padding-top: remp(70); 
    }.subbtn p {
        height: remp(44);
        line-height: remp(44);
        color: #fff;
        border-radius: remp(4);
        background: -webkit-linear-gradient(left, rgb(0, 140, 238), rgb(54, 172, 254));
        background: -o-linear-gradient(right, rgb(0, 140, 238), rgb(54, 172, 254));
        background: -moz-linear-gradient(right, rgb(0, 140, 238), rgb(54, 172, 254));
        background: linear-gradient(right, rgb(0, 140, 238), rgb(54, 172, 254));
    }
    .cententbox .confirmpassword label{
        width: remp(64.5)
    }
    .cententbox .oldpassword label {
        width: remp(51.5);
    }
    .cententbox .newpassword label {
        width: remp(51.5);
    }
    .cententbox .newpassword {
        border-bottom: remp(1) solid rgb(245, 245, 249);
    }
    .cententbox .oldpassword {
        box-sizing: border-box;
        border-bottom: remp(5.5) solid rgb(245, 245, 249);
    }
    .cententbox > div label {
        height: remp(18.5);
        line-height: remp(18.5);
        font-size: remp(13);
        color: rgb(51, 51, 51);
    }
    .cententbox > div {
        padding: remp(11) remp(0) remp(10.5) remp(15);
    }
    .cententbox input {
        display: inline-block;
        height: remp(18.8);
        line-height: remp(18.5);
        background:none !important;  
        outline:none;  
        border:0px;
        font-size: remp(13);
        color: rgb(51, 51, 51);
        padding: remp(4) 0;
        padding-left: remp(3);
    }
    .cententbox input::-webkit-input-placeholder {
       /* placeholder颜色  */
        color: rgb(189, 199, 200);
       /* placeholder字体大小  */
        font-size: remp(13);
         /* placeholder位置  */
        text-align: left;
    }
</style>