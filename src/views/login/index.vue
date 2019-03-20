<template>
    <div class="containerwrap">
        <div class="container">
            <h5>Hello!</h5>
            <p class="title">{{title}}</p>
            <div class="imgWrap"><img :src="imgUrl" alt=""></div>
            <div class="loginWrap">
                <div class="username">
                    <label class="namelabel">用户名</label>
                    <input type="text" v-model="username" placeholder="请输入账号"/>
                    <img v-if="namefocus" :src="delimg" @click="delname" alt="">
                </div>
                <div class="password">
                    <label class="wordlabel">密码</label>
                    <input type="password" v-model="password" placeholder="请输入密码"/>
                    <img v-if="passfocus" :src="delimg" @click="delpass" alt="">
                </div>
            </div>
            <div class="loginbtn" @click="login()">
                登&ensp;录
            </div>
            <p class="company"> ©2017润雅信息技术(上海)有限公司 版权所有</p>
        </div>
    </div>
</template>
<script>
    import api from '../../common/api'
    import config from '../../common/config'
    import {Toast} from 'mint-ui'
    export default {
        components: {

        },
        data() {
            return {
                username: '',
                password: '',
                title: '欢迎回到LiVE汽车零售管理平台',
                namefocus: false,
                passfocus: false,
                imgUrl: require('../../assets/imgage/iris.png'),
                delimg: require('../../assets/imgage/del.png'),
            }
        },
        methods: {
            login: function() {
                let params = {
                    'loginName': this.username,
                    'loginPasswd': this.password,
                }
                api.login.login(params, (res) => {
                    if(res.data.code=='success') {
                        Toast({
                            message: config.hints.loginInfo,
                            position: 'top'
                        })
                        this.$router.push({
                            path: '/'
                        })
                    }
                })
            },
            delname(){
                this.namefocus = false
                this.username = ''
            },
            delpass(){
                this.passfocus = false
                this.password = ''
            }
        },
        watch: {
            username: {
                handler(val){
                    this.namefocus = val === '' ? false : true
                },
                deep: true
            },
            password: {
                handler(val){
                    this.passfocus = val === '' ? false : true
                },
                deep: true
            }
        }
    }
</script>
<style lang="scss" src="../../assets/css/common.scss"></style>
<style lang="scss" scoped>
    .containerwrap{
        width: 100%;
        height: 100%;
    }
    .container{
        position: relative;
        box-sizing: border-box;
        width: 100%;
        height: 100%;
        background: #ffffff;
        padding: remp(0) remp(25);
        h5{
            width: remp(160);
            height: remp(40);
            padding-top: remp(30);
            font-size: remp(30);
            color: #008CEE; 
            line-height: remp(40);
            font-weight: normal;
        }
        .title{
            height: remp(32);
            font-family: Helvetica;
            font-size: remp(16);
            line-height: remp(32);
            color: #333333;
        }
        .imgWrap{
            width: 100%;
            height: 20%;
            margin-bottom: 6.7%;
            display: flex;
            justify-content: center;
            align-items: center;
            img{
                display: block;
                width: 20%;
                height: auto;
            }
        }
        .loginWrap{
            width: 100%;
            div{
                width: 100%;
                height: remp(50);
                border-bottom: 1px solid #BDC7D1;
                position: relative;
                label{
                    display: inline-block;
                    width: remp(60); 
                    font-size: remp(16);
                    color: #333333;
                    letter-spacing: -0.18px;
                    line-height: remp(50);
                    text-align: left;
                    padding-left: remp(10);
                }
                input{
                    width: remp(220);
                    height: remp(47);
                    border: none;
                    text-align: left;
                    font-size: remp(14);
                }
                input::-webkit-input-placeholder {
                    color: #BDC7D1;
                    font-size: remp(12);
                    text-align: left;
                }
                img{
                    position: absolute;
                    right: remp(5);
                    top: remp(17);
                    display: block;
                    width: remp(16);
                    height: remp(16);
                    
                }
            }
        }
        .loginbtn{
            box-sizing: border-box;
            text-align: center;
            margin-top: remp(40);
            padding: 0;
            height: remp(55);
            line-height: remp(55);
            color: #FFFFFF;
            font-size: remp(18);
            background-image: linear-gradient(90deg, #008CEE 0%, #36ACFE 100%);
            box-shadow: 0 remp(4) remp(4) 0 rgba(0,0,0,0.20);
            border-radius: remp(8);
        }
        .company{
            position: absolute;
            bottom: remp(40);
            left: remp(0);
            width: 100%;
            height: remp(20);
            text-align: center;
            color: #003539;
            font-size: remp(12);
            line-height: remp(20);
        }
    }
</style>