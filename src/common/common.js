import api from "./api"
import router from "../router"
export default {
  getfontsize: function () {
    var docEl = document.documentElement // 获取document
    var resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize'

    function recalc() {
      //计算fontsize值
      var clientWidth = docEl.clientWidth; //获取屏幕宽度
      if (!clientWidth) {
        return
      } //没有获取到就退出

      if (clientWidth > 750) {
        docEl.style.fontSize = 200 + 'px'
      } else {
        docEl.style.fontSize = 100 * (clientWidth / 375) + 'px'
      }
    };

    if (!document.addEventListener) {
      return
    } //没有addEventlistener就直接退出
    window.addEventListener(resizeEvt, recalc, false) //当屏幕旋转或者resize的时候重新计算fontsize
    window.addEventListener('DOMContentLoaded', recalc, false) // HTML文档加载完以后计算fontsize
  },
  getNotification: function () {
    let _this = this
    window.setNotification = function (data) {
      let noticeData = {}
      if (typeof (data) === 'object') {
        noticeData = data
      } else if (typeof (data) === 'string') {
        noticeData = JSON.parse(data)
      }
      switch (noticeData.type) {
        case 'WORKFLOW':
          _this.getUserPermissionsInfo((isSc) => {
            if (isSc) {
              router.push({ path: '/order/' + noticeData.orderNo })
            } else {
              router.push({ path: '/orderApprovedetail/' + noticeData.orderNo + '/notApproved' })
            }
          })
          _this.updateMessageStatus(noticeData)
          break
        case 'CHAT':
          router.push({
            name: 'chatRoom', query: {
              chatUrl: noticeData.chatUrl
            }
          })
          _this.updateMessageStatus(noticeData)
          break
        case 'LEAD':
          switch (noticeData.leadType) {
            case 'PHONECALL':
              router.push({ path: '/customer-detail/' + noticeData.leadCode + '/passenger' })
              break;
            case 'CUSTCOMING':
              router.push({ path: '/customer-detail/' + noticeData.leadCode + '/passenger' })
              break;
            case 'REDISPATCHMGR':
              router.push({ path: '/customer-detail/' + noticeData.leadCode + '/customer' })
              break;
            case 'CUSTINSTORE':
              router.push({ path: '/passenger/homepage' })
              break;
            case 'REDISPATCHCRM':
              _this.getUserPermissionsInfo((isSc) => {
                if (!isSc) {
                  router.push({ path: '/reapportion/' })
                }
              })
              break;
          }
          _this.updateMessageStatus(noticeData)
          break
      }
    }
  },
  resizeBody: function () {
    let _this = this
    var callback = function () {
      document.querySelector('.header').style.position = 'absolute'
      document.querySelector('.header').style.top = document.body.scrollTop + 'px';
    }
    document.body.addEventListener('focusin', () => {
      if (/iphone|ipad/i.test(navigator.userAgent.toLowerCase())) {
        window.addEventListener('touchmove', callback)
        window.addEventListener('scroll', callback)
      }
    })
    document.body.addEventListener('focusout', () => {
      if (/iphone|ipad/i.test(navigator.userAgent.toLowerCase())) {
        window.removeEventListener('touchmove', callback)
        window.removeEventListener('scroll', callback)
        document.querySelector('.header').style.position = 'fixed'
        document.querySelector('.header').style.top = 0;
      }
    })
  },
  isdev: function (env) {
    var env = process.env.NODE_ENV;
    return env === 'development' ? '/cxb/api' : '/api';
  },
  isweb: function (env) {
    var env = process.env.NODE_ENV;
    return env === 'development' ? '' : '/web';
  },
  /* 设置cookie函数 */
  setCookie: (key, value, day) => {
    var date = new Date();
    date.setDate(date.getDate() + day);
    document.cookie = key + '=' + escape(value) + ';expires=' + date;
  },
  /* 获取cookie函数 */
  getCookie: (key) => {
    var coo = unescape(document.cookie); //解码
    var arr1 = coo.split('; '); //第一次分解后是数组
    for (var i = 0; i < arr1.length; i++) { //第二次循环拆分数组
      var arr2 = arr1[i].split('=');
      if (arr2[0] == key) {
        return arr2[1];
      }
    }
  },
  parseData: function (data) {
    var _data;
    if (!data) return data;
    try {
      _data = JSON.parse(data);
    } catch (e) {
      _data = data;
    }
    return _data;
  },
  /* 删除cookie */
  removeCookie: (key) => {
    setCookie(key, '', -1);
  },
  // 验证是否是11位数字,有值校验，无值不校验
  isTel: function (value) {
    if (value.length > 0) {
      if (/^.{11}$/.test(value)) {
        // 11 位判断
        return /^\d{11}$/.test(value)
      } else {
        return false
      }
    } else {
      return true
    }
  },
  // 校验联系电话 8~11 位数字
  validatePhone(val) {
    const reg = /^\d{8,11}$/
    if (val && reg.test(val)) {
      return true
    } else {
      return false
    }
  },
  // 意向级别字母排序
  compare(name, minor) {
    return function (o, p) {
      var a, b;
      if (o && p && typeof o === 'object' && typeof p === 'object') {
        a = o[name];
        b = p[name];
        if (a === b) {
          return typeof minor === 'function' ? minor(o, p) : 0;
        }
        if (typeof a === typeof b) {
          return a < b ? -1 : 1;
        }
        return typeof a < typeof b ? -1 : 1;
      } else {
        thro("error");
      }
    }
  },
  // 根据charCode 来排序   by lwx  ( 形参name表示数组对象中的自定义属性, 截取字母再调用charCodeAt方法 )
  _sort(name) {
    return (a, b) => a[name] - b[name]
  },
  userAgent() {
    var userAgent = window.navigator.userAgent;
    if(userAgent.indexOf('iris') != -1) {
      return true
    } else {
      return false
    }
  },
  fixedHeader() {
    let _this = this
    window.onscroll = function() {
      document.querySelector('.header').style.position = 'absolute'
      document.querySelector('.header').style.top = _this.getScrollTop() + 'px';
    }
  },
  getScrollTop() {
    var scrollTop = 0;
    if (document.documentElement && document.documentElement.scrollTop) {
      scrollTop = document.documentElement.scrollTop;
    } else if (document.body) {
      scrollTop = document.body.scrollTop;
    }
    return scrollTop;
  },
  getOrigin() {
    let origin = window.location.origin,
      env = process.env.NODE_ENV
    if (env == 'development') {
      return 'http://dev.iris.com'
    } else {
      return window.location.origin
    }
  },
  isVenderStart() {
    const param = { refDetailCode: 'factoryFlag' }
    api.getDataDetails(param).then(res => {
      if (res.data.code === 'success') {
        let value = res.data.obj.refDetailValue
        sessionStorage.setItem('showFactory', value)
      }
    })
  },
  getTransConstructionFlag() {
    const param = { refDetailCode: 'TransConstructionFlag' }
    api.getDataDetails(param).then(res => {
      if (res.data.code === 'success') {
        let value = res.data.obj.refDetailValue
        sessionStorage.setItem('constructionFlag', value)
      }
    })
  },
  getUserPermissionsInfo(sc) {
    api.login
      .getLoginInfo()
      .then((res) => {
        if (res.data.code === 'success') {
          if (res.data.obj.inChargePostnVo != undefined && res.data.obj.inChargePostnVo != null) {
            let isSc = false
            let postnType = res.data.obj.inChargePostnVo.postTypeCode
            if (postnType == 'positionTypeSC') {
              isSc = true
            } else {
              isSc = false
            }
            sc(isSc)
          }
        }
      })
  },
  updateMessageStatus(noticeData) {
    let _this = this
    noticeData.isRead = '1'
    api.messageService
      .updateMessageStatus(noticeData, (res) => {
      })
  },
  filterIsPercent: function (isPercent, value) {
    if (isPercent == 1) {
      return (parseFloat(value * 100)).toFixed(2)
    } else {
      return parseFloat(value)
    }
  },
  eleTimeFormatim2: function (str) {
    //if(typeof str != 'object')return;
    var obj = new Date(`${str.replace(/-/g, '/')}`),
      y = obj.getFullYear(),
      m = obj.getMonth() + 1,
      d = obj.getDate(),
      h = obj.getHours(),
      min = obj.getMinutes(),
      sec = obj.getSeconds();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    h = h < 10 ? '0' + h : h;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;
    return y + '-' + m + '-' + d + ' ' + h + ':' + min + ':' + sec;
  },
  eleTimeFormatim1: function (str) {
    //if(typeof str != 'object')return;
    var obj = new Date(str),
      y = obj.getFullYear(),
      m = obj.getMonth() + 1,
      d = obj.getDate(),
      h = obj.getHours(),
      min = obj.getMinutes(),
      sec = obj.getSeconds();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    h = h < 10 ? '0' + h : h;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;
    return y + '/' + m + '/' + d + ' ' + h + ':' + min + ':' + sec;
  },
  eleTimeFormatim3: function (str) {
    //if(typeof str != 'object')return;
    var obj = new Date(str),
      y = obj.getFullYear(),
      m = obj.getMonth() + 1,
      d = obj.getDate(),
      m = m < 10 ? '0' + m : m;
      d = d < 10 ? '0' + d : d;
    return y + '-' + m + '-' + d;
  },
  eleTimeFormatim4: function (str) {
    //if(typeof str != 'object')return;
    var obj = new Date(str),
      y = obj.getFullYear(),
      m = obj.getMonth() + 1,
      d = obj.getDate(),
      h = obj.getHours(),
      min = obj.getMinutes(),
      sec = obj.getSeconds();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    h = h < 10 ? '0' + h : h;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;
    return y + '/' + m + '/' + d + ' ' + h + ':' + min;
  },
  eleTimeFormatim5: function (str) {
    if(!str) return '无';
    var obj = new Date(str),
      y = obj.getFullYear(),
      m = obj.getMonth() + 1,
      d = obj.getDate(),
      h = obj.getHours(),
      min = obj.getMinutes(),
      sec = obj.getSeconds();
    m = m < 10 ? '0' + m : m;
    d = d < 10 ? '0' + d : d;
    h = h < 10 ? '0' + h : h;
    min = min < 10 ? '0' + min : min;
    sec = sec < 10 ? '0' + sec : sec;
    return h + ':' + min;
  },
  getQueryString: function(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
    var r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]); return null;
  },
  //获取月份的天数
  getMonthDays(val) {
    var d = val;
    var days = new Date(d.getFullYear(), d.getMonth() + 1, 0);
    return days.getDate();
},
}
