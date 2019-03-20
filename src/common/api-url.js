/**
 *  create by zbq on 2018/08/24
 *
 *  此文件用于存放每个模块的新增, 编辑等权限接口url
 *    => 用来控制按钮权限
 *
 */

export default {
    //首页 后市场
    newAftermarket: {
        //分页查询匹配车型商品
        querySkuInfoAdapterCar: '/v1/sku/skuInfo/querySkuInfoAdapterCar.htm',
        // 分页查询匹配车型商品新接口
        querySkuInfoByAdapterCar: '/v1/sku/skuInfo/querySkuInfoByAdapterCar.htm',
        //批量获取商品价格
        querySkuPriceInfoBySkuCodeSet: '/v1/sku/skuPriceInfo/querySkuPriceInfoBySkuCodeSet.htm',
        //根据仓库编码预计商品编码set查询库存信息
        queryBatchStockInfoVosMapByWhCode: '/v1/supplyChain/stockInfo/queryBatchStockInfoVosMapByWhCode.htm',
        //批量-根据relationCode查询fileInfo
        selectFileInfoByRelationCodesBatch: '/v1/fileSys/file/selectFileInfoByRelationCodesBatch.htm',
        //查询组合商品
        queryGroupShopCar:'/v1/sku/comb/queryCanUseCombinationList.htm',
    },
    insurance:{
    	//保险险种明细删除
    	deleteInsuranceInfoByOrderNoAndInsuranceOrderDetail: '/v1/clearingSettlement/insuranceOrder/deleteInsuranceInfoByOrderNoAndInsuranceOrderDetail.htm'
    }
}
