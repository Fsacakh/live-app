<template>
<div>
    <div class="bg"></div>
    <div class="toolbar-box">
        <div class="custom-info-box">
            <div class="portrait">
                <headportrait :name="getCusLeadInfo.intentionLevelName"
                              :sex="getCusLeadInfo.customGender">
                </headportrait>
            </div>
            <div class="text">
                <p>
                    <strong>{{getCusLeadInfo.customName}}</strong>
                </p>
                <span>{{getCusLeadInfo.mobilePhone | phoneFilter}}</span>
            </div>
            <div class="look-box">
                <div class="icon-box">
                    <i class="iconfont icon-icon-bianji"></i>
                </div>
                <a class="white" href="javascript:;" @click="toData">编辑个人资料</a>
            </div>
        </div>
        <div class="nav-box">
            <div class="nav-item" @click="toFollowUp">
                <a href="JavaScript:;">
                    <div class="icon-box">
                        <i class="iconfont icon-icon-rili"></i>
                    </div>
                    <span>新建跟进</span>
                </a>
            </div>
            <div class="nav-item" @click="takeACall">
                <a>
                    <div class="icon-box">
                        <i class="iconfont icon-icon-dianhua"></i>
                    </div>
                    <span>电话沟通</span>
                </a>
            </div>
            <div class="nav-item">
                <a :href="send">
                    <div class="icon-box">
                        <i class="iconfont icon-icon-duanxin"></i>
                    </div>
                    <span>发送短信</span>
                </a>
            </div>
        </div>
    </div>
</div>
</template>
<script>
import headportrait from "components/headportrait/headportrait";
import { mapGetters, mapActions } from "vuex";
import {Toast} from 'mint-ui';
import api from '../../common/api'
import config from '../../common/config'

export default {
  mounted() {
    let _this = this
    _this.setPersonInfo({})
  },
  data() {
    return {
      isDisable: true
    };
  },
  computed: {
    call() {
      return `tel:${this.getCusLeadInfo.mobilePhone}`
    },
    send() {
      return `sms:${this.getCusLeadInfo.mobilePhone}`
    },
    ...mapGetters("customer", [
      "getCusLeadInfo",
      "getLoginInfo"
    ])
  },
  methods: {
    toData() {
      this.$router.push({
        path: `/personaldata/${this.getCusLeadInfo.leadCode}`
      });
    },
    toFollowUp() {
      this.$router.push({
        path: "/follow-up/insert"
      });
    },
    // 调用原生
    takeACall: function (){
       let _this = this
        if(this.isDisable){
          this.isDisable = false
          let appInfo = window.navigator.userAgent
          var obj = {'telPhone' : this.getCusLeadInfo.mobilePhone,
              'scName': this.getCusLeadInfo.scName,
              'scCode': this.getCusLeadInfo.scCode,
              'leadCode': this.getCusLeadInfo.leadCode
          }
          if(window.wst){ window.wst.takeACall(JSON.stringify(obj)) } 
          setTimeout(function(){  _this.isDisable = true }, 1000)
        }
    },
    ...mapActions('customer',  [
      'setPersonInfo'
    ])
  },
  filters: {
    phoneFilter(val) {
      if (val) {
        return `${val.substring(0, 3)}****${val.substring(8, 11)}`;
      }
    }
  },
  components: {
    headportrait
  }
};

// 原生调用的方法

window.callTelEnd = function (telinfo){
    /**
     * dialogTime : 拨号时间 conntedTime:接通时间
     * endTime : 结束时间 durationTime: 持续时间
     * phoneNumber : 电话号码 isConnected: 1 接通 0 未接通
     */

    let telObject
    if (typeof(telinfo) === 'object'){
      telObject = telinfo
    }
    if (typeof (telinfo) === 'string'){
      telObject = JSON.parse(telinfo)
    }
    let newParams = config.financeWorkbenchInfo.scTelFollowUpSeq
    api.ordinalInfo.getSequence(newParams, (res)=>{
        if(res.data.code === 'success'){
          let scTelFollowUpCode = res.data.obj;
          var params = {
            'telBeginTime':telObject['dialogTime'],
            'telConnectBeginTime':telObject['conntedTime'],
            'telEndTime': telObject['endTime'],
            'telHoldTime':telObject['durationTime'],
            'telNumber': telObject['phoneNumber'],
            'isConnected': telObject['isConnected'],
            'scName' : telObject['scName'],
            'scCode': telObject['scCode'],
            'leadCode': telObject['leadCode'],
            'followUpCode': scTelFollowUpCode
          }
          if(telObject['isConnected']){
            params.isConnected = 1
          }else {
            params.isConnected = 0
          }
          api.mainInfo.newIncreaseTelRecord(params, function(res){
            if(res.data.code === 'success' ){
              Toast('数据上传成功');
            }else{
              Toast('数据上传失败');
            }
          })
        }
      })
}
</script>
<style lang="scss" scoped>
// create by lwx 2017-12-08
.bg {
  position: fixed;
  -webkit-transform: translateZ(0);
  top: remp(44);
  width: remp(375);
  height: remp(53.5);
  background-image: linear-gradient(-180deg, #36acfe 0, #36acfe 100%);
  z-index: -10;
}
.toolbar-box {
  width: remp(355);
  height: remp(133.5);
  background-color: #fff;
  border-radius: remp(3);
  margin: 0 auto;
  box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.5);
  .custom-info-box {
    position: relative;
    display: flex;
    width: 100%;
    height: remp(85.5);
    padding: remp(25) 0 remp(15.5) remp(15);
    box-sizing: border-box;
    // .portrait {
    //    padding-top: remp(25)
    // }
    .text {
      padding: remp(2.5) remp(20);
      font-size: remp(14);
      p {
        font-weight: 580;
        margin-bottom: rem(6.5);
      }
    }
    .look-box {
      position: absolute;
      right: 0;
      top: remp(32.5);
      background: #ccc;
      display: flex;
      justify-content: center;
      align-items: center;
      width: remp(118.5);
      height: remp(30);
      background-color: #00c0ff;
      border-bottom-left-radius: remp(18);
      border-top-left-radius: remp(18);
      .icon-box {
        width: remp(14);
        height: remp(14);
        border-radius: 50%;
        background-color: #fff;
        text-align: center;
        line-height: remp(14);
        color: #00c0ff;
        margin-right: remp(12);
      }
    }
  }
  .nav-box {
    display: flex;
    width: 100%;
    height: remp(48);
    .nav-item {
      flex: 1;
      display: flex;
      justify-content: center;
      .icon-box {
        text-align: center;
        i {
          font-size: remp(20);
          color: #817f79;
        }
      }
      span {
        font-size: remp(10);
        color: #8b8f8d;
      }
    }
  }
}
</style>
