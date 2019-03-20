// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import common from '@/common/common.js'
import api from 'common/api'
import config from 'common/config'
import fastclick from 'fastclick'
import 'iview/dist/styles/iview.css';
import '@/assets/css/reset.scss'
import '@/assets/css/common.scss'
import '@/assets/css/animate.css'
import '@/assets/icon/iconfont.css'
import 'mint-ui/lib/style.css'

fastclick.attach(document.body)

Vue.config.productionTip = false
Vue.filter('money', function (value) {
  var isNum = parseFloat(value);
  var isNum = !isNum ? 0 : isNum.toFixed(2);
  if (!isNum) {
    return value;
  } else {
    var str = isNum.toString();
    var arr = str.split('.');
    var b = arr[0]
    arr[1] = arr[1] && arr[1].toString().substring(0, 2)
    var len = b.length;
    if (len <= 3) {
      return b + (arr[1] ? '.' + arr[1] : "");
    }
    var r = len % 3;
    return r > 0 ? b.slice(0, r) + "," + b.slice(r, len).match(/\d{3}/g).join(",") + (arr[1] ? '.' + arr[1] : "") : b.slice(r, len).match(/\d{3}/g).join(",") + (arr[1] ? '.' + arr[1] : "");
  }
})

Vue.filter('carName', function (item) {
  return (item.carFactoryName == null ? '' : item.carFactoryName) + ' ' + (item.carBrandName == null ? '' : item.carBrandName) + ' ' + (item.carSeriesName == null ? '' : item.carSeriesName) + ' ' + (item.carModelName == null ? '' : item.carModelName) + ' ' + (item.carDisplayName == null ? '' : item.carDisplayName)
})

Vue.filter('switchIsPercent', function (isPercent, value) {
  if (isPercent === 0) {
    return value
  } else if (isPercent === 1) {
    return parseFloat(value * 100).toFixed(2) + '%'
  }
})

Vue.filter('formatTime', function (value) {
  return common.eleTimeFormatim2(value)
})

Vue.filter('formatTime2', function (value) {
  return common.eleTimeFormatim4(value)
})

Vue.filter('formatTime3', function (value) {
  return common.eleTimeFormatim5(value)
})

//微信或者企业微信
let isMicroMessenger = navigator.userAgent.indexOf('MicroMessenger') == -1 ? false:true;

let one = {
  'code':common.getQueryString('code'),
  'state':common.getQueryString('state')
}
if(isMicroMessenger){
  api.getUserInfo.weixinLogin(one, (res) => {
    new Vue({
      el: '#app',
      store,
      router,
      template: '<App/>',
      components: {
        App
      }
    })

    if(res.data.code == 'weixinlogin' && window.location.href.indexOf('/login') == -1){
      //如果没有绑定，则跳转到登录页面
      window.location.href ='/liveapp/login'
    }
  });
}else{
  new Vue({
    el: '#app',
    store,
    router,
    template: '<App/>',
    components: {
      App
    }
  })
}

window.getUserInfo = function (arg1, arg2) {
  let option = {
    'loginName': arg1,
    'loginPasswd': arg2
  }
  api.login.login(option, (res) => {
    if (res.data.code === 'success') {
      log.loginSuc()
    } else {
      // 原生调用h5方法  重新登录
      wst.loginOut()
    }
  })
}

common.getfontsize()
common.getNotification()

// console.log('main.js - time :' + new Date().getTime())
