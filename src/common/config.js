/**
 *  common config
 */
import common from './common.js'
common.isVenderStart() //是否从厂家开始
common.getTransConstructionFlag() //获取是否转售后工单标志
export default {
  // 集团定制化配置 轩宇
  configOfXuanyu: {
    refDetailCode: 'SystemRelationGroup'
  },
  // SM / SC 权限控制
  root: {
    scPostTypeCode: 'positionTypeSC', // 销售类（销售顾问/销售专员）
    smPostTypeCode: 'positionTypeSM', // 销售主管
    positionTypeSalesManager: 'positionTypeSalesManager', //销售经理
    positionTypeStoreGeneralManager: "positionTypeStoreGeneralManager", //门店总经理
    positionTypeFinancialManager: "positionTypeFinancialManager",    //财务经理
    positionTypeAdmin:"PositionTypeAdmin",  //集团管理员
    positionTypeGroupBusinessVicePresident: 'positionTypeGroupBusinessVicePresident',     //集团业务副总
    positionTypeGroupChiefFinancialOfficer: 'positionTypeGroupChiefFinancialOfficer',     //集团财务总监
  },
  // APP工作入口配置
  // appPositionType: [{
  //   text: '今日接待',
  //   label: 'IconTypeTodayReception',
  //   isTrue: 0
  // },{
  //   text: '审批',
  //   label: 'IconTypeExamine',
  //   isTrue: 0
  // },{
  //   text: '金融计算器',
  //   label: 'IconTypeFinancialCal',
  //   isTrue: 0
  // },{
  //   text: '库存',
  //   label: 'IconTypeRessurvive',
  //   isTrue: 0
  // },{
  //   text: '线索分配',
  //   label: 'IconTypeAllocation',
  //   isTrue: 0
  // },{
  //   text: '数据看板',
  //   label: 'IconTypeDataBoard',
  //   isTrue: 0
  // },{
  //   text: '市场活动',
  //   label: 'IconTypeMarketActivity',
  //   isTrue: 0
  // },{
  //   text: '后市场',
  //   label: 'IconTypeBehindMarket',
  //   isTrue: 0
  // }],
  isFactoryStart: sessionStorage.getItem('showFactory'),
  factoryFlag: "factoryFlag",
  goToWorkOrder: sessionStorage.getItem('constructionFlag'),
  //登录页面的链接 暂时写死
  loginUrl: 'dev.iris.com/web/login/login.html',
  wsUrl:  common.getOrigin().replace('http', 'ws') + '/im-com/webSocket/empToken=',
  //登录token键值名
  empTokenKey: 'e_token',
  // 初始化pageNums
  pageNums: process.env.NODE_ENV === 'development' ? 10 : 15,
  pageNums: 10,
  // 最大分页数
  maxPageNums: 100,
  custom: {
    sales: "LeadsSalesStatus",
    canal: "LeadsChannel",
    like: "IntentionLevel",
    clue: "LeadsStatus"
  },
  //渠道
  canal: {
    initiative: 'leadsSourceClassifyActiveCollector',
    comeloose: "LeadsChannelCustomer",
    recommend: "LeadsChannelRecommend"
  },
  //来源
  source: {
    //展厅
    LeadsSourceClassifyExhibitionHall: "LeadsSourceClassifyExhibitionHall",
    //SC外拓
    LeadsSourceClassifySCExtension: 'LeadsSourceClassifySCExtension',
    //客户介绍
    LeadsSourceClassifyCustomerIntroduction: 'LeadsSourceClassifyCustomerIntroduction',
    //散客
    LeadsChannelCustomer: 'LeadsChannelCustomer',
    //推荐
    LeadsChannelRecommend: "LeadsChannelRecommend",
    //主动集客
    leadsSourceClassifyActiveCollector: 'leadsSourceClassifyActiveCollector'
  },
  //是否查询子订单
  qureySubOrderInfo: {
    yes: true,
    no: false
  },
  //数据字典主表code
  ref: {
    LoadType: 'LoadType',
    getServiceType: 'ServiceType',
    accountType: 'AccountType',
    salesType: 'SalesTaskType',
    plateType: 'PlateType',
    orderAddInfoType: 'OrderAddInfoType',
    idtype: 'CertificateType',
    //线索附加信息
    leadsAgeGroup: 'leadsAddInfoAgeGroup',
    leadsIndustry: 'leadsAddInfoIndustry',
    leadsCustPosition: 'leadsAddInfoCustPosition',
    leadsFocus: 'leadsAddInfoFocus',
    leadsAddInfo: 'leadsAddInfo',
    gpSortType: 'GPSortTypeCode',
    orderSubstitutionReason: 'orderSubstitutionReason',
    noSkuReason: 'noSkuReason',
    financeFailReason: 'FinanceFailReasonType',
    checkOrderRelevantPlate: 'orderRelevantPlateCheck',
    receptionSalesLeadObjective: 'ReceptionSalesLeadObjective'
  },
  normalSale: "normalSale",
  channelType: "OfflineStoreSales",
  slue: [{
    name: 'defeatStatus',
    code: 0
  }, {
    name: "tryDriveStatus",
    code: 1
  }, {
    name: "inStoreFlag",
    code: 2
  }, {
    name: "appointmentSubStatus",
    code: 3
  }],
  slueCode: {
    serverCode: 'LEADS',
  },
  hints: {
    loginInfo: '登录成功',
    changepassword: "密码修改成功",
    changepassworderror1: "原密码不正确，请更正",
    changepassworderror2: "新密码不一致，请更正"
  },
  order: {
    wfTypeCode: 'WorkFlowTypeOrderUpdate',    //订单修改字段
    gpconfig: 'ApprovalGPSNPDisplay',
    gpConverType: 'GpConverType',
    sequence: 'ORDERSEQ',
    snp: 'SNPCODE',
    gp1: 'GP1_value',
    gp1_rate: 'GP1_rate',
    gp15: 'GP1.5_value',
    gp2: 'GP2_value',
    gp2_rate: 'GP2_rate',
    gp3_rate: 'GP3_rate',
    gp4: 'GP4_value',
    gp4_rate: 'GP4_rate',
    gp45: 'GP4.5_value',
    gp45perc: 'GP4.5_rate',
    GP15_rate: 'GP1.5_rate',
    orderAddInfoPlateType: 'orderAddInfoPlateType',
    orderAddInfoSalesType: 'orderAddInfoCarSalesSubKind',
    noSkuReason: 'noSkuReason',
    plateType: {
      nonLocal: 'PlateTypeNonlocal',
      local: 'PlateTypeLocal'
    },
    orderChannelType: {
      refCode: 'ChannelCode',
      storeSale: 'OfflineStoreSales'
    },
    orderTypeCode: {
      refCode: 'TransactionNoteType',
      car: 'transactionNoteTypeNewCarSales'
    },
    paymentTypeCode: {
      refCode: 'OrderPaymentMode',
      cash: 'orderPaymentModeCashSettlement'
    },
    financePro: {
      financeType: {
        refCode: 'FinanceProType',
        refDetailFatherCode: '0',
        leaseFatherCode: 'financeProTypeLeasedProduct',
        interestFatherCode: 'financeProTypeDiscountProduct',
      },
      repaymentMethod: {
        refCode: 'RepaymentMethod',
        equalAmountOfInterest: 'RepaymentMethodEqualAmountOfInterest'
      },
      rateType: {
        interest: 'interestRate',
        rateDetail: 'rateDetail'
      }
    },
    carInfo: {
      carAppertanceName: {
        refCode: 'OrderCarAddInfoColor'
      },
      carInteriorName: {
        refCode: 'OrderCarAddInfoInterior'
      },
      skuAddInfos: {
        carAppertanceName: {
          refCode: 'carAppertanceName'
        },
        reportFactoryDate: {
          refCode: 'reportFactoryDate'
        },
        carInteriorName: {
          refCode: 'carInteriorName'
        },
        actualMSRPInclusiveTax: {
          refCode: 'actualMSRPInclusiveTax'
        },
        originalAddition: {
          refCode: 'originalAddition'
        },
        deceitCarAddCode: {
          refCode: 'deceitCarAddCode'
        }
      },
      skuType: 'goodsTypeCar',
      hideBandAndSeries: 'HIDEBANDANDSERIES',
    },
    wfType: {
      intentionOrder: {
        code: 'NewCarIntentionOrderWfType'
      },
      order: {
        code: 'NewCarOrderWfType'
      },
      contract: {
        code: 'NewCarContractWfType'
      },
      refuse: {
        code: 'NewCarRefuseWfType'
      }
    }
  },
  customSequence: "CUSTOM",
  companySequence: 'COMPANYSEQ',
  customType: 'customTypeIndividualCus',
  carSequence: "INTENTIONCAR",
  changepassword: "密码修改成功",
  // 保险订单
  insurancePlan: {
    main: 'ORDERINSSEQ',
    detail: 'ORDERINSDETAILSEQ',
    sequence: 'accountType'
  },
  alertInfo: {
    success: '操作成功',
    error: '操作失败',
    serveFee: '服务费不可为空',
    deletedFee: '确定删除此服务费？',
    SalesSub: '销售类型不能为空',
    PlateType: '上牌类型不能为空',
    BrandStatus: '车辆品牌不为空',
    CarStatus: '车型车款不为空',
    PriceStatus: '置换价格不为空',
    deleted: '确定删除置换信息',
    OrderAddInfoDeposit: '订金金额不可为空'
  },
  customerDetail: {
    taskRef: 'ScheduleTaskType',
    taskSeq: 'SCSCHEDULESEQ',
    intenLevelRef: 'IntentionLevel',
    tryDriveSeq: 'TRYDRIVE',
    receSeq: 'RECEPTION',
    tryDriveSeq: 'TRYDRIVE',
    defeatReason: 'DefeatReason'
  },
  // 政策类型
  businessaffairs: {
    businessaffairstype: "SalesPolicyTypeCode"
  },
  EXISTCAR: "EXISTCAR",
  //后市场
  aftermarket: {
    groupShop: "TC", //组合商品
    groupShopCP: "022297", //组合商品
    skuCatlogCode: 'JP', //精品商品
    skuCatlogCodeCP: '022267', //精品商品
    postponeSku: 'YB', //延保商品
    postponeSkuCP: '2000058', //延保商品
    card: '3000249', //卡商品
    cardCP: 'KA', //卡商品
    cardType: {
      storedValue: 'StoredValue' //储值卡
    },
    GoodsType: "goodsTypeGood"
  },
  newAftermarket:{
  	card:'010065',
  },
  //发票类型
  invoiceType: [{
    value: 0,
    text: '公司'
  }, {
    value: 1,
    text: '个人'
  }, ],
  // 前端提示文字
  text: {
    beginLoading: '正在载入...',
    noMoreData: '暂无更多数据',
  },
  //置换
  replacement: {
    accountTypeCode: 'normalSale'
  },
  //订单相关
  orderAddInfoSalesType: 'orderAddInfoCarSalesSubKind',
  orderAddInfoPlateType: 'orderAddInfoPlateType',
  //默认销售类型
  SalesTypeOrderName: '零售',
  SalesTypeOrder: 'REFD2000022',
  //默认上牌类型
  PlateTypeOrderName: '本地',
  PlateTypeOrder: 'REFD2000045',
  //开票类型Name
  orderAddInfoInvoiceTypeName: '公司',
  orderAddInfoInvoiceTypeName2: '个人',
  //管理层数据看板
  board: {
    NewCarOrderWfType: ['NewCarOrderWfType'],
    NewCarIntentionOrderWfType: ['NewCarIntentionOrderWfType'],
  },
  //金融工作台
  financeWorkbenchInfo: {
    sequence: 'FINWBSEQ',
    scTelFollowUpSeq: 'SCTELFOLLOWUPSEQ'
  },
  market: {
    seq: 'LISTRELATIONSEQ',
  },
  notification: {
      type: {
          workFlow: 'WORKFLOW'
      } 
  },
  treeArea: '000001',
  homePageFlag: 'homePage',
  orderFlag: 'order',
  passagerFlag: 'passenger',
  customerFlag: 'customer',
  notApprovedFlag: 'notApproved',
  hasApprovedFlag: 'hasApproved',
}
