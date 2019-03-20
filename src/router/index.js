import Vue from 'vue'
import Router from 'vue-router'
import api from 'common/api'

Vue.use(Router)

var base = process.env.NODE_ENV === 'development' ? '/' : '/liveapp/';

var router = new Router({
  mode: 'history',
  base: base,
  routes: [{
      path: '/',
      name: 'menulist',
      redirect: 'homepage',
      meta: {
        name: '首页'
      },
    },
    {
      path: '/menulist',
      name: 'menulist',
      meta: {
        name: '引导页'
      },
      component: resolve => require(['views/menulist/index.vue'], resolve)
    },
    {
      path: '/likevehicle',
      name: 'likevehicle',
      meta: {
        name: '意向车型'
      },
      component: resolve => require(['components/likevehicle/likevehicle.vue'], resolve)
    },
    {
      path: '/demo',
      name: 'demo',
      meta: {
        name: '组件中心'
      },
      component: resolve => require(['views/demo/index.vue'], resolve)
    },
    {
      path: '/finCalculator/:id',
      name: 'finCalculator',
      meta: {
        name: '金融计算器'
      },
      component: resolve => require(['views/order/finance/finCalculator.vue'], resolve)
    },
    {
      path: '/customer-detail/:code/:flag',
      name: 'customer-detail',
      meta: {
        name: '客户详情'
      },
      component: resolve => require(['views/customer-detail/customer-detail.vue'], resolve)
    }, {
      path: '/customerdetail',
      name: 'customer-detail',
      meta: {
        name: '客户详情2'
      },
      component: resolve => require(['views/customer-detail/customer-detail.vue'], resolve)
    }, {
      path: '/personaldata/:leadCode',
      name: 'personaldata',
      meta: {
        name: '客户个人资料'
      },
      component: resolve => require(['views/personaldata/personaldata.vue'], resolve)
    },
    {
      path: '/addattempt',
      name: 'addattempt',
      meta: {
        name: '新增试驾'
      },
      component: resolve => require(['views/addattempt/addattempt.vue'], resolve)
    },
    {
      path: '/addlikevehicle',
      name: 'addlikevehicle',
      meta: {
        name: '新增意向车型'
      },
      component: resolve => require(['views/addlikevehicle/addlikevehicle.vue'], resolve)
    },
    {
      path: '/addmission',
      name: 'addmission',
      meta: {
        name: '新增任务事项'
      },
      component: resolve => require(['views/addmission/addmission.vue'], resolve)
    },
    {
      path: '/customer-center',
      name: 'customer-center',
      meta: {
        name: '客户中心'
      },
      component: resolve => require(['views/customer-center/index'], resolve)
    },
    {
      path: '/customer-addclue/:leadCode',
      name: 'customer-addclue',
      meta: {
        name: '自增线索'
      },
      component: resolve => require(['views/customer-center/personaldata'], resolve)
    },
    {
      path: '/search-detail',
      name: 'search-detail',
      meta: {
        name: '搜索详情'
      },
      component: resolve => require(['views/customer-center/search'], resolve)
    },
    {
      path: '/new-aftermarket',
      name: 'newAftermarket',
      meta: {
        name: '后市场'
      },
      component: resolve => require(['views/aftermarket/newAftermarket/index'], resolve)
    },
    {
      path: '/aftermarket/:orderNo/:flag',
      name: 'aftermarket',
      meta: {
        name: '后市场'
      },
      component: resolve => require(['views/aftermarket/index'], resolve)
    },
    {
      path: '/aftermarketdetailpage/:skucode/:orderNo/:shopType/:flag',
      name: 'aftermarketdetailpage',
      meta: {
        name: '后市场商品详情'
      },
      component: resolve => require(['views/aftermarket/detailpage'], resolve)
    },
    {
      path: '/aftermarketshopcar/:orderNo',
      name: 'aftermarketshopcar',
      meta: {
        name: '购物车'
      },
      component: resolve => require(['views/aftermarket/shopcar'], resolve)
    },
    {
      path: '/insurance',
      query: {
        order: '',
        carCode: ''
      },
      name: 'insurance',
      meta: {
        name: '保险'
      },
      component: resolve => require(['views/order/insurance/newInsurance.vue'], resolve)
    },
    {
      path: '/insurance-add',
      query: {
        orderNo: '',
        index: '',
        carCode: ''
      },
      name: 'insurance-add',
      meta: {
        name: '保险新增'
      },
      component: resolve => require(['views/order/insurance/lib/addKindInsurance.vue'], resolve)
    },
    {
      path: '/insurance-edit',
      query: {
        orderNo: '',
        index: '',
        carCode: ''
      },
      name: 'insurance-edit',
      meta: {
        name: '险种修改'
      },
      component: resolve => require(['views/order/insurance/lib/addKindInsurance.vue'], resolve)
    },
    {
      path: '/hotsalesplan-insurance',
      query: {
        order: '',
        carCode: ''
      },
      name: 'hotsalesplan-insurance',
      meta: {
        name: '保险-热销方案'
      },
      component: resolve => require(['views/order/insurance/hotsalesplan.vue'], resolve)
    },
    {
      path: '/order/:orderNo',
      name: 'order',
      meta: {
        name: '报价单'
      },
      component: resolve => require(['views/order/index.vue'], resolve)
    },
    {
      path: '/serviceAndOther/:code',
      name: 'serviceAndOther',
      meta: {
        name: '服务费及其他'
      },
      component: resolve => require(['views/order/service/serviceAndOther.vue'], resolve)
    },
    {
      path: '/carInfoDetail',
      name: 'carInfoDetail',
      meta: {
        name: '车辆信息详情'
      },
      component: resolve => require(['views/order/carInfo/carInfoDetail'], resolve)
    },
    {
      path: '/carInfo/:orderNo',
      name: 'carInfo',
      meta: {
        name: '车辆信息'
      },
      component: resolve => require(['views/order/carInfo/carInfo'], resolve)
    },
    {
      path: '/carInfoList',
      name: 'carInfoList',
      meta: {
        name: '车辆信息列表'
      },
      component: resolve => require(['views/order/carInfo/carInfoList'], resolve)
    },
    {
      path: '/stockCarInfoList',
      name: 'stockCarInfoList',
      meta: {
        name: '车辆库存信息列表'
      },
      component: resolve => require(['views/order/carInfo/stockCarInfoList'], resolve)
    },
    {
      path: '/orderApprove/:id',
      name: 'orderApprove',
      meta: {
        name: '订单审批'
      },
      component: resolve => require(['views/orderApprove'], resolve)
    },
    {
      path: '/orderApprovedetail/:orderNo/:flag',
      name: 'orderApprovedetail',
      meta: {
        name: '订单审批详情'
      },
      component: resolve => require(['views/orderApprove/detail'], resolve)
    },
    {
      path: '/orderApproveMoreDetail/:orderNo',
      name: 'orderApprovedetail',
      meta: {
        name: '审批信息'
      },
      component: resolve => require(['views/orderApprove/moreDetail'], resolve)
    },
    {
      path: '/searchCar/:id',
      name: 'searchCar',
      meta: {
        name: '查询汽车'
      },
      component: resolve => require(['views/order/carInfo/searchCar'], resolve)
    },
    {
      path: '/finance/:orderNo',
      name: 'finance',
      meta: {
        name: '金融'
      },
      component: resolve => require(['views/order/finance/finance'], resolve)
    },
    {
      path: '/financeList/:id',
      name: 'financeList',
      meta: {
        name: '金融热销方案'
      },
      component: resolve => require(['views/order/finance/financeList'], resolve)
    },
    {
      path: '/orderInfo/:code',
      name: 'orderInfo',
      meta: {
        name: '订单相关'
      },
      component: resolve => require(['views/order/orderInfo'], resolve)
    },
    {
      path: '/searchCompany/:customCode/:companyCode',
      name: 'searchCompany',
      meta: {
        name: '搜索公司'
      },
      component: resolve => require(['views/personaldata/searchCompany'], resolve)
    },
    {
      path: '/editCompany/:customCode',
      name: 'editCompany',
      meta: {
        name: '新建公司'
      },
      component: resolve => require(['views/personaldata/editCompany'], resolve)
    },
    {
      path: '/homepage',
      name: 'homepage',
      meta: {
        name: '首页'
      },
      component: resolve => require(['views/homepage/index'], resolve)
    },
    {
      path: '/login',
      name: 'login',
      meta: {
        name: '登录'
      },
      component: resolve => require(['views/login'], resolve)
    },
    {
      path: '/changepassword',
      name: 'changepassword',
      meta: {
        name: '修改密码'
      },
      component: resolve => require(['views/changepassword'], resolve)
    },
    {
      path: '/replacement/:code',
      name: 'replacement',
      meta: {
        name: '置换'
      },
      component: resolve => require(['views/order/replacement'], resolve)
    },
    {
      path: '/carwithpolicy/:orderNo',
      name: 'carwithpolicy',
      meta: {
        name: '随车政策列表'
      },
      component: resolve => require(['views/carWithPolicy'], resolve)
    },
    {
      path: '/carwithpolicy-edit/:orderNo',
      name: 'carwithpolicy-edit',
      meta: {
        name: '随车政策信息'
      },
      component: resolve => require(['views/carWithPolicy/addAndEdit'], resolve)
    },
    {
      path: '/carwithpolicy-choose/:index',
      name: 'carwithpolicy-choose',
      meta: {
        name: '选择随车政策'
      },
      component: resolve => require(['views/carWithPolicy/choosePolicy'], resolve)
    },
    {
      path: '/payInfo/:orderNo',
      name: 'payInfo',
      meta: {
        name: '支付信息'
      },
      component: resolve => require(['views/payInfo'], resolve)
    },
    {
      path:'/couponInfo/:code',
      // path:'/couponInfo/:orderNo',
      name:'couponInfo',
      meta:{
        name: '优惠券'
      },
      component: resolve => require(['views/order/coupon'],resolve)
    },
    {
      path: '/follow-up/:id',
      name: 'follow-up',
      meta: {
        name: '新增任务事项'
      },
      component: resolve => require(['views/follow-up/follow-up.vue'], resolve)
    },
    {
      path: '/history-list',
      name: 'history-list',
      meta: {
        name: '历史记录列表demo'
      },
      component: resolve => require(['views/demo/history-list'], resolve)
    },
    {
      path: '/passenger/:id',
      name: 'passenger',
      meta: {
        name: '今日接待列表'
      },
      component: resolve => require(['views/passenger/index.vue'], resolve)
    },
    {
      path: '/reapportion-search',
      name: 'reapportion-search',
      meta: {
        name: '线索重新分配搜索'
      },
      component: resolve => require(['views/reapportion/search.vue'], resolve)
    },
    {
      path: '/reapportion',
      name: 'reapportion',
      meta: {
        name: '线索重新分配'
      },
      component: resolve => require(['views/reapportion/index.vue'], resolve)
    },
    {
      path: '/storedata',
      name: 'storedata',
      meta: {
        name: '4S门店数据'
      },
      component: resolve => require(['views/storedata/index.vue'], resolve)
    },
    //市场活动
    {
      path: '/marketlist',
      name: 'marketlist',
      meta: {
        name: '市场活动'
      },
      component: resolve => require(['views/marketActivity/marketmodule/activity-list.vue'], resolve)
    },
    {
      path: '/databoard',
      name: 'databoard',
      meta: {
        name: '数据看板'
      },
      component: resolve => require(['views/dataBoard/index.vue'], resolve)
    },
    {
      path: '/groupDashboard',
      name: 'groupDashboard',
      meta: {
        name: '集团数据看板'
      },
      component: resolve => require(['views/groupDashboard/index.vue'], resolve)
    },
    {
      path: '/boardlist',
      name: 'boardlist',
      meta: {
        name: '数据看板列表'
      },
      component: resolve => require(['views/dataBoard/board-list.vue'], resolve)
    },
    {
      path: '/boarddetial',
      name: 'boaeddetial',
      meta: {
        name: '数据看板详情'
      },
      component: resolve => require(['views/dataBoard/boardDetial/board-detial.vue'], resolve)
    },
    //待邀约客户
    {
      path: '/waitinvitecustomer',
      name: 'waitinvitecustomer',
      meta: {
        name: '待邀约客户'
      },
      component: resolve => require(['views/marketActivity/waitinvitecustomer/customer-list.vue'], resolve)
    },
    //看板销售详情
    {
      path: '/sellDetial',
      name: 'sellDetial',
      meta: {
        name: '销售数据'
      },
      component: resolve => require(['views/dataBoard/sellDetial'], resolve)
    },
    //看板库存详情
    {
      path: '/gainDetial',
      name: 'gainDetial',
      meta: {
        name: '盈收'
      },
      component: resolve => require(['views/dataBoard/gainDetial'], resolve)
    },
    //看板库存详情
    {
      path: '/inventoryDetial',
      name: 'inventoryDetial',
      meta: {
        name: '库存'
      },
      component: resolve => require(['views/dataBoard/inventoryDetial'], resolve)
    },
    //消息推送
    {
      path: '/notification',
      name: 'notification',
      meta: {
        name: '消息推送'
      },
      component: resolve => require(['views/notification'], resolve)
    },
    //直播
    {
      path: '/chatRoom',
      name: 'chatRoom',
      meta: {
        name: '库存'
      },
      component: resolve => require(['views/chatRoom/index.vue'], resolve)
    },
    {
      path: '/*',
      name: 'sorry',
      meta: {
        name: '404'
      },
      component: resolve => require(['views/sorry/index.vue'], resolve)
    }
  ]

})

//配置基础模块连接 当连接为 html的时候  页面进行跳转
router.beforeEach((to, from, next) => {
  next();
})

export default router
