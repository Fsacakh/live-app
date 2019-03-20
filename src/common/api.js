import axios from 'axios'
import common from "./common.js";
import apiUrl from "./api-url.js";
import {
  Toast,
  Indicator
} from 'mint-ui'
axios.defaults.headers.post['Content-Type'] = 'application/json'; //请求头
axios.defaults.headers.Accept = 'application/json'; //请求头
axios.defaults.baseURL = '/';
axios.defaults.withCredentials = true;


// 统一处理重复请求
let pending = [] // 声明一个数组用于存储每个ajax请求的取消函数和ajax标识
let cancelToken = axios.CancelToken
let removePending = (config) => {
    for (let p in pending) {
        if (pending[p].u === config.url + '&' + config.method + '&' + config.data) { // 当前请求在数组中存在时执行函数体
            pending[p].f() // 执行取消操作
            pending.splice(p, 1) // 把这条记录从数组中移除
        }
    }
}


// post传参序列化
axios.interceptors.request.use((config) => {
  removePending(config) // 在一个ajax发送前执行一下取消操作
  config.cancelToken = new cancelToken((c)=>{
      pending.push({ u: config.url + '&' + config.method, f: c }) 
  })

  if(config.url !== '/api/v1/leads/checkAndEditLeadsInfo.htm'){
    Indicator.open('加载中...');
  }
  return config;
}, (error) => {
  console.log("错误的传参", 'fail');
  return Promise.reject(error);
});

//返回状态判断
axios.interceptors.response.use((res) => {
  removePending(res.config)
  Indicator.close();
  if (!res.data) {
    return Promise.reject(res);
  }
  if (res.data.code === 'login') {
    // window.location.href = "http://dev.iris.com/web/login/login.html";
    // 当提示为login 重新登录状态 判断是在app端还是浏览器端  分别调不同的方法重新登录
    if(wst){
      wst.loginOut()
    } else {
      window.location.href = "http://dev.iris.com/web/login/login.html"
    }
  } else if (res.data.code === 'fail') {
    Toast(res.data.message)
  }

  return res;
}, (error) => {
  Toast('网络错误')
  Indicator.close();
  return Promise.reject(error);
});

var setParams = function (params, type) {
  var params = common.parseData(params);
  var pm = common.parseData(params.body) || params;
  var type = type == 'GET' ? 'GET' : 'POST';
  return pm;
}

export default {
  /**
   * 新改版页面API定义
   */
  //首页 后市场
  newAftermarket:{
    //分页查询匹配车型商品
    querySkuInfoAdapterCar: function (params, sc) {
      axios.post(common.isdev() + apiUrl.newAftermarket.querySkuInfoAdapterCar, params)
        .then((r) => {
          sc(r)
        })
    },
    //分页查询匹配车型商品新接口
    querySkuInfoByAdapterCar: function (params, sc) {
      axios.post(common.isdev() + apiUrl.newAftermarket.querySkuInfoByAdapterCar, params)
        .then((r) => {
          sc(r)
        })
    },
    //批量获取商品价格
    querySkuPriceInfoBySkuCodeSet: function (params, sc) {
      axios.post(common.isdev() + apiUrl.newAftermarket.querySkuPriceInfoBySkuCodeSet, params)
        .then((r) => {
          sc(r)
        })
    },
    //根据仓库编码预计商品编码set查询库存信息
    queryBatchStockInfoVosMapByWhCode: function (params, sc) {
      axios.post(common.isdev() + apiUrl.newAftermarket.queryBatchStockInfoVosMapByWhCode, params)
        .then((r) => {
          sc(r)
        })
    },
    //批量-根据relationCode查询fileInfo
    selectFileInfoByRelationCodesBatch: function (params, sc) {
      return axios.post(common.isdev() + apiUrl.newAftermarket.selectFileInfoByRelationCodesBatch, params)
        .then((r) => {
          sc(r)
        })
    },
    //查询组合商品
    queryGroupShopCar: function (params, sc) {
      return axios.post(common.isdev() + apiUrl.newAftermarket.queryGroupShopCar, params)
        .then((r) => {
          sc(r)
        })
    },
  },
  //根据refCode以及refDetailCode查询数据字典信息
  getDataDetails(params) {
    var params = setParams(params)
    return axios.post(common.isdev() + '/v1/sys/refDetail/get.htm', params)
  },
  //文件信息
  file: {
    selectFileInfoByRelationCodesBatch: function (params, sc) {
      return axios.post(common.isdev() + '/v1/fileSys/file/selectFileInfoByRelationCodesBatch.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    selectByRelationCode: function (params, sc) {
      return axios.post(common.isdev() + '/v1/fileSys/file/selectByRelationCode.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  //业务信息
  ordinalInfo: {
    insert: function (params) {
      return axios.post(common.isdev() + '/v1/sys/seq/insertSequenceInfo.htm', params)
    },
    search: function (params) {
      return axios.post(common.isdev() + '/v1/sys/seq/querySequenceInfo.htm', params)
    },
    edit: function (params) {
      return axios.post(common.isdev() + '/v1/sys/seq/updateSequenceInfo.htm', params)
    },
    //根据应用编码获得相关的应用序列
    getSequence: function (params, sc) {
      return axios.post(common.isdev() + '/v1/sys/seq/getSequence.htm', {
        serviceCode: params
      }).then((r) => {
        sc(r)
      })
    },
    //根据应用编码获得相关的应用序列List
    getSequenceList: function (params, sc) {
      return axios.post(common.isdev() + '/v1/sys/seq/getSequenceList.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //数据同步
    dataSync: function (params) {
      return axios.post(common.isdev() + '/v1/sys/seq/initSequenceToCache.htm', params)
    }
  },
  // 获取用户信息
  getUserInfo: {
    getUserAvailableInfo: function (sc) {
      axios.post(common.isdev() + '/v1/getUserAvailableInfo.htm')
        .then((r) => {
          sc(r)
        })
    },
    getOrgs: function (sc) {
      axios.post(common.isdev() + '/v1/login/getOrg.htm')
        .then((r) => {
          sc(r)
        })
    },
    getLoginInfo: function (sc) {
      axios.post(common.isdev() + '/v1/getLoginInfo.htm')
        .then((r) => {
          sc(r)
        })
    },
    weixinLogin: function (params, sc) {
      axios.post(common.isdev() + '/v1/weixinLogin.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryPostUsableGroupResourceInfo: function (params, sc) {
      axios.post(common.isdev() + '/v2/systemfoundation/grouppost/queryPostUsableGroupResourceInfo.htm', params).then((r) => {
        sc(r)
      })
    }
  },
  area: {
    getSalesAreaInfoByAreaCode: function (params, sc) {
      axios.post(common.isdev() + '/v1/sys/salesArea/getSalesAreaInfoByAreaCode.htm', params).then((r) => {
        sc(r)
      })
    },
    getShopInfoByAreaCode: function (params, sc) {
      axios.post(common.isdev() + '/v1/sys/store/queryStoreInfoBySalesCode.htm', params).then((r) => {
        sc(r)
      })
    }
  },
  checkAndEditLeadsInfo: function (params, sc) {
    axios.post(common.isdev() + '/v1/leads/checkAndEditLeadsInfo.htm', params).then((r) => {
      sc(r)
    })
  },
  checkMobile: function (params, sc) {
    axios.post(common.isdev() + '/v1/leads/validateSalesLeadsByMobilePhone.htm', params).then((r) => {
      sc(r)
    })
  },
  // 根据区域和门店获取保险公司的信息
  insurance: {
    // 获取保险公司信息
    getInsuranceCompany: function (params, sc) {
      axios.post(common.isdev() + '/v1/insurance/companyInfo/queryCompanyInfoByCodesAndPagination.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 通过coCode获取险种信息
    getKindsofInsurance: function (params, sc) {
      axios.post(common.isdev() + '/v1/insurance/insuranceTypesInfo/queryInsuranceTypesInfoVosByCoCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //根据主订单号查询保险订单信息 POST /v1/clearingSettlement/insuranceOrder/queryInsuranceInfoByOrderNo
    getInfomationsByOrder: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/insuranceOrder/queryInsuranceInfoByOrderNo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 更新保险订单信息POST /v1/clearingSettlement/insuranceOrder/updateInsuranceOrderInfoVo
    changeInsurance: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/insuranceOrder/updateInsuranceOrderInfoVo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 获取热销方案
    getHotPlans: function (params, sc) {
      axios.post(common.isdev() + '/v1/insurance/insuranceInfo/queryInsuranceInfoVosByStoreCodeAndCarCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 删除保险订单 POST /v1/clearingSettlement/insuranceOrder/deleteInsuranceInfoByOrderNoAndInsuranceNo
    deleteInsuranceByOrder: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/insuranceOrder/deleteInsuranceInfoByOrderNoAndInsuranceNo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //删除商业险明细
    deleteInsuranceInfoByOrderNoAndInsuranceOrderDetail: function (params, sc) {
      axios.post(common.isdev() + apiUrl.insurance.deleteInsuranceInfoByOrderNoAndInsuranceOrderDetail, params)
        .then((r) => {
          sc(r)
        })
    }
  },
  // 轩宇退车以及取消退车接口
  returnCar: {
    makeReturnTicket: function(params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/order/submitOrderInfoForNewCarSales.htm', params)
      .then((r) => {
        sc(r)
      })
    },
    throwApprove: function(params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/order/approvePassOrderInfoForNewCarSales.htm', params)
      .then((r) => {
        sc(r)
      })
    },
    backApprove: function(params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/order/refuseOrderInfoForNewCarSales.htm', params)
      .then((r) => {
        sc(r)
      })
    },
    cancelReturnTicket: function(params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/order/withdrawOrderInfoForNewCarSales.htm', params)
      .then((r) => {
        sc(r)
      })
    }
  },
  // 金融产品
  financePro: {
    //查询列表信息
    getQueryInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/prod/financesSearch.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //新增或者修改
    insertOrUpdata: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/prod/editFinanace.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //获取金融产品类型
    getProType: function (params, sc) {
      axios.post(common.isdev() + '/v1/sys/ref/get.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //分页查询金融产品
    queryFinancesInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/prod/queryFinancesInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //新增或编辑金融产品
    editFinanace: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/prod/editFinanace.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //查询金融产品详情
    detailFinance: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/prod/detailFinance.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //批量新增或更新金融方案
    addOrUpdateDetailInfoBatch: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/product/addOrUpdateDetailInfoBatch.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //精确查询金融方案
    queryDetailInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/product/queryDetailInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //分页查询金融方案
    queryDetailInfoList: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/product/queryDetailInfoList.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //金融机构下拉框查询
    getAuthorizationOrgs: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/org/getAuthorizationOrgs.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 分页查询产品方案
    queryDetailInfoList: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/product/queryDetailInfoList.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 查询金融方案详情
    queryDetailInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/product/queryDetailInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 批量新增或更新金融方案
    addOrUpdateDetailInfoBatch: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/product/addOrUpdateDetailInfoBatch.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 新增更新金融产品适用范围
    addOrUpdateUseRangeInfoBatch: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/product/addOrUpdateUseRangeInfoBatch.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 查询金融产品适用范围
    queryUseRangeInfoList: function (params, sc) {
      axios.post(common.isdev() + '/v1/finance/product/queryUseRangeInfoList.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  // 商品信息 /v1/sku/skuInfo/querySkuInfoList
  skuInfo: {
    query: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuInfo/querySkuInfoList.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    querySkuInfoVosWithNoPage: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuInfo/querySkuInfoVosWithNoPage.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    insert: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuInfo/insert.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    update: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuInfo/update.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    get: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuInfo/get.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //附加信息部分
    editAddSkuInfoVo: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuInfo/editAddSkuInfoVo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //锁定查询
    querylockinfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/produceLock/querySkuLockInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //锁定/解锁
    editlock: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/produceLock/editProduceLockInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  // 库存信息
  stockInfo: {
    queryBatchStockInfoVos: function (params, sc) {
      axios.post(common.isdev() + '/v1/supplyChain/stockInfo/queryBatchStockInfoVos.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryBatchStockInfoVosByWhCode: function (params, sc) {
      axios.post(common.isdev() + '/v1/supplyChain/stockInfo/queryBatchStockInfoVosByWhCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryCarStockOrderByStockAge: function (params, sc) {
      axios.post(common.isdev() + '/v1/report/stock/queryCarStockOrderByStockAge.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 查询精品库存
    queryBatchStockInfoVosMapByWhCode: function (params, sc) {
      axios.post(common.isdev() + '/v1/supplyChain/stockInfo/queryBatchStockInfoVosMapByWhCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
  },
  ref: {
    // 拿数据字典明细
    getDictionaryDetails(params) {
        return axios.post(common.isdev() + '/v1/sys/refDetail/get.htm', params)
    },
    //从数据字典获取类型数据接口
    queryDictionaryDetails(params, sc) {
      return axios.post(common.isdev() + '/v1/sys/refDetail/query.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //从数据字典获取主表信息
    getDataDictionary(params, sc) {
      return axios.post(common.isdev() + '/v1/sys/ref/get.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  //登录
  login: {
    login(params, sc) {
      axios.post(common.isdev() + '/v1/login.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    loginOut(sc) {
      axios.post(common.isdev() + '/v1/logout.htm')
        .then((r) => {
          sc(r)
        })
    },
    // 获取登录信息
    getLoginInfo(params) {
      return axios.post(`${common.isdev()}/v1/getLoginInfo.htm`, params);
    }
  },
  //修改密码
  resetpassword: {
    reset(params, sc) {
      axios.post(common.isdev() + '/v1/sys/emp/userUpdatePassword.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  // 切换组织
  resetLogin: {
    changeLogin: function (params, sc) {
      axios.post(common.isdev() + '/v1/login/changeLoginInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  car: {
    queryCarInfoByCarSearch: function (params, sc) {
      axios.post(common.isdev() + '/v1/sys/car/queryCarInfoByCarSearch.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  // 个人资料模块
  mainInfo: {
    // 新增通话纪录
    newIncreaseTelRecord: function (params, callBack) {
      axios.post(common.isdev() + '/v1/sales/appointment/insertSalesAdviserCluePhone.htm', params)
        .then(res => {
          if (callBack) {
            callBack(res);
          }
        })
    },
    querySalesLeadIntentionCarInfoList: function (params, callBack) {
      axios.post(common.isdev() + '/v1/car/querySalesLeadIntentionCarInfoList.htm', params)
        .then(res => {
          if (callBack) {
            callBack(res);
          }
        })
    },
  },
  // 清算模块
  clearingsettlement: {
    // 订单头信息
    order: {
      //根据置换订单查询核销状态
      queryPaymentVerification: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/orderSubstitution/queryPaymentVerification.htm', params)
          .then((r) => {
            sc(r)
          })
      },

      //根据金融订单查询核销状态
      financialOrderInfo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlementdb/financialOrderInfo/queryPaymentVerification.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      insertOrder: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/carOrderInfo/insertOrder.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      queryOrderInfoVos: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/order/queryOrderInfoVos.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      queryOrderInfoVosByCodeFromDB: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/order/queryOrderInfoVosByCodeFromDB.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      updateOrderInfoVo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/order/updateOrderInfoVo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      addservicefeeAdd: function (params, sc) {
        axios.post(common.isdev() + '/v1/sys/emp/userUpdatePassword.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      submitOrderInfoForNewCarSales: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/order/submitOrderInfoForNewCarSales.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      updateWfForNewCarSales: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/order/updateWfForNewCarSales.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      withdrawOrderInfoForNewCarSales: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/order/withdrawOrderInfoForNewCarSales.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      approvePassOrderInfoForNewCarSales: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/order/approvePassOrderInfoForNewCarSales.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      finishCar: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/order/finishCar.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      queryOrderWfInfoByOrderNo: function (params, sc) {
        axios.post(common.isdev() + '/v1/workFlow/orderwf/queryOrderWfInfoByOrderNo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      queryGpApperanceBeforeOneWeek: function (params, sc) {
        axios.post(common.isdev() + '/v1/report/clearingSettlement/order/queryGpApperanceBeforeOneWeek.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      queryGpApperanceCurrentMonth: function (params, sc) {
        axios.post(common.isdev() + '/v1/report/clearingSettlement/order/queryGpApperanceCurrentMonth.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      editOrderAddInfoVo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/order/editOrderAddInfoVo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
    },
    // 整车订单
    carOrderInfo: {
      getCarOrderInfo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/carOrderInfo/getCarOrderInfo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      getCarOrderInfoByOrderNo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/carOrderInfo/getCarOrderInfoByOrderNo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      insertOrder: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/carOrderInfo/insertOrder.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      insertCarOrderInfo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/carOrderInfo/insertCarOrderInfo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      queryCarOrderInfo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/carOrderInfo/queryCarOrderInfo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      updateCarOrderInfo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/carOrderInfo/updateCarOrderInfo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      updateCarOrderWfStatus: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/carOrderInfo/updateCarOrderWfStatus.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      getMsrp: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/carOrderInfo/getMsrp.htm', params)
          .then((r) => {
            sc(r)
          })
      }
    },
    // 金融
    finance: {
      //金融机构下拉框查询
      getAuthorizationOrgs: function (params, sc) {
        axios.post(common.isdev() + '/v1/finance/org/getAuthorizationOrgs.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      queryDetailInfoByCarInfo: function (params, sc) {
        axios.post(common.isdev() + '/v1/finance/product/queryDetailInfoByCarInfo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      getFinancialOrderInfo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlementdb/financialOrderInfo/getFinancialOrderInfo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      getFinancialOrderInfoByOrderNo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlementdb/financialOrderInfo/getFinancialOrderInfoByOrderNo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      insertFinancialOrderInfo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlementdb/financialOrderInfo/editFinancialOrderInfoVo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      // 新建订单后直接在报价单页面点击订单审批有关战败的请求
      newEditFinancialOrderInfo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlementdb/financialOrderInfo/saveDefeatFinancialOrderInfoVo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      queryFinancialOrderInfo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlementdb/financialOrderInfo/queryFinancialOrderInfo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      // 金融保存接口
      editFinancialOrderInfoVo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlementdb/financialOrderInfo/editFinancialOrderInfoVo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      updateFinancialOrderWfStatus: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlementdb/financialOrderInfo/updateFinancialOrderWfStatus.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      // 查询是否设置审批流
      queryWorkflowInfoFromDB: function(params, sc) {
        axios.post(common.isdev() + '/v1/workFlow/wf/queryWorkflowInfoFromDB.htm', params)
          .then((r) => {
            sc(r)
          })
      }
    },
    // 新增保险订单
    insurance: {
      addInsurancePlan: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/insuranceOrder/insertInsuranceOrderInfoVo.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      pushInsuranceOrderToWorkbench: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/insuranceOrder/pushInsuranceOrderToWorkbench.htm', params)
          .then((r) => {
            sc(r)
          })
      }
    },
    // 后市场精品/组合商品
    ordersku: {
      prepareOrderSkuByOrderNo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/ordersku/prepareOrderSkuByOrderNo.htm', params)
          .then((r) => {
            sc(r)
          })
      }
    },
    //订单服务费
    servicefee: {
      queryServiceFee: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/orderServiceFee/query.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      addServiceFee: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/orderServiceFee/editOrderServiceFeeInfoList.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      getServiceFeeManage: function (params, sc) {
        axios.post(common.isdev() + '/v1/sys/servicefeemanage/getServiceFeeManageList.htm', params)
          .then((r) => {
            sc(r)
          })
      }
    },
    //订单置换
    replacement: {
      addreplacement: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/orderSubstitution/insert.htm', params)
          .then((r) => {
            sc(r)
          })
      },
      editreplacement: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/orderSubstitution/update.htm', params)
          .then((r) => {
            sc(r)
          })
      },
    },
    //订单相关
    correlation: {
      //根据编码查询订单信息
      getOrderInfo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/order/queryOrderInfoVosByCodeFromDB.htm', params).then((r) => {
          sc(r)
        })
      },
      //创建订单相关
      insertOrderInfo: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingSettlement/order/updateOrderInfoVo.htm', params).then((r) => {
          sc(r)
        })
      },
    },
    //转售后施工
    skuBookOrder: {
      insert: function (params, sc) {
        axios.post(common.isdev() + '/v1/clearingsettlement/skuBookOrder/insert.htm', params).then((r) => {
          sc(r)
        })
      }
    }
  },
  customercenter: {
    // querycustomercenter: function (params, sc) {
    //   axios.post(common.isdev() + '/v1/leads/queryScSalesLeadsInfoList.htm', params)
    //     .then((r) => {
    //       sc(r)
    //     })
    // },
    querycustomercenter: function (params, sc) {
      axios.post(common.isdev() + '/v1/leads/queryScSalesLeadsInfoListForApp.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  orderApprove: {
    //查找所有审批单 POST
    query: function (params, sc) {
      axios.post(common.isdev() + '/v1/workFlow/orderwf/queryOrderWfInfoByPostnCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryOrderWfInfoByPostnCode: function (params, sc) {
      axios.post(common.isdev() + '/v1/workFlow/orderwf/queryOrderWfInfoByPostnCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryOrderWfInfoByPostnCodeAndNodeStatus: function (params, sc) {
      axios.post(common.isdev() + '/v1/workFlow/orderwf/queryOrderWfInfoByPostnCodeAndNodeStatus.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //根据编码查Set询订单审批信息
    queryOrderInfoVosByCode: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/order/queryOrderInfoVosByCodeFromDBForApprovel.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //审批通过
    approvePass: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/order/approvePassOrderInfoForNewCarSales.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //审批拒绝
    refuseOrderInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/order/refuseOrderInfoForNewCarSales.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //根据订单号查询审批履历信息
    queryOrderWfDetailInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/workFlow/orderwf/queryOrderWfDetailInfoByOrderNo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryOrderWfInfoAndCountByPostnCode: function (params, sc) {
      axios.post(common.isdev() + '/v1/workFlow/orderwf/queryOrderWfInfoAndCountByPostnCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryOrderInfoApprovalByKeywords: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/order/queryOrderInfoApprovalByKeywords.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    getOrderDerivativeProfit: function (params, sc) {
      axios.post(common.isdev() + '/v1/report/order/getOrderDerivativeProfit.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 获取订单修改的修改原因等信息
    queryOrderWfInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/workFlow/orderwf/queryOrderWfInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
  },
  clue: {
    addclue: function (params, sc) {
      axios.post(common.isdev() + '/v1/leads/editScSalesLeadsInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    querydetailclue: function (params, sc) {
      axios.post(common.isdev() + '/v1/leads/getScSalesLeadsInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    addExistCarInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/car/editSalesLeadExistCarInfoBatch.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  //添加意向车型
  likevehicle: function (params, sc) {
    axios.post(common.isdev() + '/v1/car/editSalesLeadIntentionCarInfoBatch.htm', params)
      .then((r) => {
        sc(r)
      })
  },
  // 客户 - 详情
  customer: {
    queryAllInfo(params) {
      return axios.post(`${common.isdev()}/v1/sys/seq/initSequenceToCache.htm`, params)
    },
    // 新增更新意向车型
    editIntentionCar(params) {
      return axios.post(`${common.isdev()}/v1/car/editSalesLeadIntentionCarInfoBatch.htm`, params)
    },
    // 新增试乘试驾
    insertTryDrive(params) {
      return axios.post(`${common.isdev()}/v1/car/editTrialDriveListInfoBatch.htm`, params)
    },
    // 开始接待
    startReception(params) {
      return axios.post(`${common.isdev()}/v1/sales/reception/startReceptionListInfo.htm`, params)
    },
    // 查询该门店所有员工
    queryScList(params) {
      return axios.post(`${common.isdev()}/v1/sys/emp/queryEmpByStoreCode.htm`, params)
    },
    // 修改线索 => sm - 线索重新分配
    updateLead(params) {
      return axios.post(`${common.isdev()}/v1/leads/redistributeLeads.htm`, params)
    },
    // 查询待办历史记录
    queryHistoryList(params) {
      return axios.post(`${common.isdev()}/v1/schedule/queryScheduleInfoList.htm`, params)
    },
    insertCustomCompanyInfo: function(params, sc) {
      axios.post(common.isdev() + '/v2/custom/company/insertCustomCompanyInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    updateCustomCompanyInfo: function(params, sc) {
      axios.post(common.isdev() + '/v2/custom/company/updateCustomCompanyInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryCustomCompanyInfoNoPage: function(params, sc) {
      axios.post(common.isdev() + '/v2/custom/company/queryCustomCompanyInfoNoPage.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryCustomCompanyInfos: function(params, sc) {
      axios.post(common.isdev() + '/v2/custom/company/queryCustomCompanyInfos.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    submitCustomCompanyInfo: function(params, sc) {
      axios.post(common.isdev() + '/v2/custom/company/submitCustomCompanyInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    withdrawCustomCompanyInfo: function(params, sc) {
      axios.post(common.isdev() + '/v2/custom/company/withdrawCustomCompanyInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
  },
  // 公司
  company: {
    insertCompanyInfo: function(params, sc) {
      axios.post(common.isdev() + '/v2/custom/company/insertCompanyInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryCompanyInfoNoPage: async function(params, sc) {
      await axios.post(common.isdev() + '/v2/custom/company/queryCompanyInfoNoPage.htm', params)
        .then((r) => {
          sc(r)
        })
    },
  },
  // 随车政策
  policyWidthCar: {
    // 根据订单号查询随车政策POST /v1/clearingSettlement/orderPromotion/getOrderPromotionInfo
    queryPolicyInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/orderPromotion/getOrderPromotionInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 根据政策类型获取随车政策POST /v1/sales/policy/queryPolicyInfo
    queryPolicyByPage: function (params, sc) {
      axios.post(common.isdev() + '/v1/sales/policy/queryPolicyInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 新增随车订单 POST /v1/clearingSettlement/orderPromotion/insertOrderPromotionInfoVo
    addPolicywithCar: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/orderPromotion/insertOrderPromotionInfoVo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 删除政策 POST /v1/clearingSettlement/orderPromotion/deleteOrderPromotionInfo
    removePolicy: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/orderPromotion/deleteOrderPromotionInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 修改政策 POST /v1/clearingSettlement/orderPromotion/updateOrderPromotionInfoVo
    editPolicy: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/orderPromotion/updateOrderPromotionInfoVo.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  //线索分配
  reapportion: {
    queryReapportion: function (params, sc) {
      axios.post(common.isdev() + '/v1/leads/querySalesLeadsListReassign.htm', params)
        .then((r) => {
          sc(r)
        })
    },
  },
  payInfo: {
    queryPayInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/orderPayment/queryOrderPaymentInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryTicket: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/orderInvoice/queryOrderInvoiceInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  // 代办任务
  task: {
    query(params) {
      return axios.post(`${common.isdev()}/v1/schedule/queryScheduleInfoList.htm`, params)
    },
    // 查询当前sc 今日代办事项
    queryBySc(params) {
      return axios.post(`${common.isdev()}/v1/schedule/queryScheduleBySc.htm`, params)
    },
    // 批量新增或修改
    edit(params) {
      return axios.post(`${common.isdev()}/v1/schedule/editScheduleBatch.htm`, params)
    },
    // 修改意向级别
    updateLead(params) {
      return axios.post(`${common.isdev()}/v1/leads/updateSalesLeads.htm`, params)
    }
  },
  // 线索
  lead: {
    queryLeadDetail(params) {
      return axios.post(`${common.isdev()}/v1/leads/getSalesLeadsInfo.htm`, params)
    },
    //查询线索附加信息
    queryLeadAddInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/sales/leads/querySalesLeadsAddInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryRecordListInfoByPage: function (params, sc) {
      axios.post(common.isdev() + '/v1/sales/reception/queryRecordListInfoByPage.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    editCustomerEnterStoreObjective: function (params, sc) {
      axios.post(common.isdev() + '/v1/sales/reception/editCustomerEnterStoreObjective.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  // 后市场 查询商品
  aftermarket: {
    queryPrice: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuPriceInfo/get.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryskucatlog: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/catlog/getSkuCatLogInfoByCatlogCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryskuInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuInfo/query.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    querystockInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/supplyChain/stockInfo/queryBatchStockInfoVosByWhCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryskuprice: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuPriceInfo/querySkuPriceInfoBySkuCodeSet.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryskudetailed: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuInfo/get.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    addSkuInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/ordersku/addOrderSkuInfo.htm', params)
        .then((r) => {
          sc(r)
        })

    },
    queryshopcar: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/ordersku/querySkuOrderInfoVosPage.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    deleteshopcar: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/ordersku/deleteSkuOrderDetail.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    updatashopcar: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/ordersku/updateSkuDetailOrder.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryshoppric: function (params, sc) {
      axios.post(common.isdev() + '/v1/fileSys/file/selectFileInfoByRelationCodesBatch.htm', params)
        .then((r) => {
          sc(r)
        })
    },
  },
  homepage: {
    //查询今日代办
    queryUpcomingInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/schedule/queryScheduleBySc.htm', params)
        .then((r) => {
          sc(r)
        })
    },
  },
  passenger: {
    queryPassenger: function (params, sc) {
      axios.post(common.isdev() + '/v1/sales/reception/queryReceptionListInfoByDayAndSc.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  // 后市场 查询商品
  aftermarket: {
    queryPrice: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuPriceInfo/get.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryskucatlog: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/catlog/getSkuCatLogInfoByCatlogCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryskuInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuInfo/query.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    querySkuInfoAdapterCar: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuInfo/querySkuInfoAdapterCar.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    querystockInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/supplyChain/stockInfo/queryBatchStockInfoVosByWhCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryskuprice: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuPriceInfo/querySkuPriceInfoBySkuCodeSet.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryskudetailed: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/skuInfo/get.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    addSkuInfo: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/ordersku/addOrderSkuInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryshopcar: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/ordersku/querySkuOrderInfoVosPage.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    deleteshopcar: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/ordersku/deleteSkuOrderDetail.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    updatashopcar: function (params, sc) {
      axios.post(common.isdev() + '/v1/clearingSettlement/ordersku/updateSkuDetailOrder.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    querygroupshopcar: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/comb/queryCanUseCombinationList.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    querygroupshopprice: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/comb/getCombinationPriceInfoBatch.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    querygroupshopdetail: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/comb/getCombinationDetailInfoByCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    querygroupshopdetailpice: function (params, sc) {
      axios.post(common.isdev() + '/v1/sku/comb/getCombinationPriceInfoBatch.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryshoppic: function (params, sc) {
      axios.post(common.isdev() + '/v1/fileSys/file/selectFileInfoByRelationCodesBatch.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryByCardTemplateInfos: function (params, sc) {
      axios.post(common.isdev() + '/v2/cardcoupons/template/queryByCardTemplateInfos.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    getCardTemplateInfoByCode: function (params, sc) {
      axios.post(common.isdev() + '/v2/cardcoupons/template/getCardTemplateInfoByCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
  },
  //市场活动
  market: {
    //根据relationCode查询文件信息 /v1/fileSys/file/selectByRelationCode
    getFileInfo: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/fileSys/file/selectByRelationCode.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //获取市场活动列表
    queryMarketActivity: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/market/active/getValidMarketActivity.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    getMarketActivityDetails: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/market/active/getMarketActivityDetail.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //查询名单参加的市场活动信息
    custRelMarket: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/salesdb/listRelationInfo/querylistRelationInfosByCostom.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //新增名单关联信息
    relationMarket: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/salesdb/listRelationInfo/insertListRelationInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //更新
    updataRelationMarket: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/salesdb/listRelationInfo/updateListRelationInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  //数据看板
  board: {
    //销售目标
    getSaleswInfo: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/clearingSettlement/storeMange/queryStoreManageSalesOrderInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //客流
    getFlowInfo: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/sales/storeMange/queryInStoreRepListInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //销售
    getSellInfo: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/sales/queryOrderReportStatistics.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //盈收信息
    getGainInfo: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/clearingSettlement/storeMange/queryStoreManageOrderAndGpInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 未开票订单金额
    getGainInfoUnTicket: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/clearingSettlement/queryTotalSalesPriceNonInvoiced.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //GP
    getGPInfo: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/clearingSettlement/queryGpCollectionInfoNoRank.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 未开票订单GP
    getGPInfoUnTicket: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/clearingSettlement/queryNoInvoiceGP.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //库存信息
    getInventoryInfo: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/clearingSettlement/storeMange/queryStoreManageStockVoInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //库龄查询
    queryReservoirAge: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/supplyChain/stockInfo/queryCarStockLifeCycleInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //库存周转天数
    inventoryDays: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/supplyChain/stockInfo/queryStockTargetCompareInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //已订单库存
    orderInventory: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/supplyChain/stockInfo/queryStockLockedInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //销售数据看板
    querySellDetial: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/salesTarget/querySalesTargetInfoByCondition.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //GP盈收
    queryGainDetial: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/clearingSettlement/queryGpCollectionInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    querySalesOprateInfoByScOrCarInfo: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/sales/querySalesOprateInfoByScOrCarInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //利润报表
    queryProfitInfo: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/queryProfitInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //利润比例
    queryProfitInfoGP: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/queryProfitInfoGP.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    queryGP: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/sys/ref/get.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    statistics: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/supplyChain/stockInfo/queryCarStockLifeCycleInfoSum.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 新增
    queryPureStockInfoNums: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/queryPureStockInfoNums.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    stockLockedInfo: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/supplyChain/stockInfo/queryStockLockedInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //销售主数据
    saleMainData: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/report/sales/querySalesManageOrderReports.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  // 金融工作台
  finWorkbench: {
    pushFinanceWorkbenchInfo: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/clearingsettlementdb/financialOrderInfo/pushSaveFinancialOrderToWbInfoVo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    getFinanceWorkbenchInfo: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/finWorkbench/getFinanceWorkbenchInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    },
  },
  messageService: {
    updateMessageStatus: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/messageService/updateMessageStatus.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    getMessageList: function (params, sc) {
      axios
        .post(common.isdev() + '/v1/messageService/getMessageList.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  },
  //获取当前系统时间
  getCurrentTime:{
  	query: function (params, sc) {
      axios.post(common.isdev() + '/v2/system/getCurrentTime.htm', params)
        .then((r) => {
          sc(r)
        })
    },
  },
  // 轩宇定制-优惠券
  getCouponInfo:{
    //获取可选优惠券数据、已选优惠券数据、已选优惠券金额等
    getCoupon: function (params, sc) {
      axios.post(common.isdev() + '/v1/web/yongyou/coupon/queryCoupon.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //保存优惠券
    saveCoupon: function (params, sc) {
      axios.post(common.isdev() + '/v1/web/yongyou/coupon/saveCoupon.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 获取已选优惠券总金额
    getSelectCouponMoney: function (params, sc) {
      axios.post(common.isdev() + '/v1/web/yongyou/coupon/queryCouponAmount.htm', params)
        .then((r) => {
          sc(r)
        })
    },
  },
  groupDashboard:{
    //查询库存板块
    queryStockModule(params, sc) {
      axios.post(common.isdev() + '/v1/report/app/queryStockModule.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 漏斗管理板块query
    queryFunnelInfoModule(params, sc) {
      axios.post(common.isdev() + '/v1/report/app/queryFunnelInfoModule.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    // 销售毛利板块query
    querySalesGpModule(params, sc) {
      axios.post(common.isdev() + '/v1/report/app/querySalesGpModule.htm', params)
        .then((r) => {
          sc(r)
        })
    },
    //query开票目标以及TGP目标
    queryMaoriTargetInfo(params, sc) {
      axios.post(common.isdev() + '/v1/report/app/queryMaoriTargetInfo.htm', params)
        .then((r) => {
          sc(r)
        })
    }
  }
}
