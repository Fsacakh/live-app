<template>
  <div>
    <!-- 导航头部 -->
    <page-header ref="header" :leftOptions="leftOptions" :rightOptions="rightOptions" @on-click-right="more">
      <div slot> {{ flag == config.homePageFlag ? '后市场': '报价单-后市场' }}</div>
    </page-header>
    <!-- 搜索框 -->
    <div class="search-warp">
      <div class="search w max-width" id="search">
        <input @change="searchSku" v-model="skuName" type="search" placeholder="搜索">
      </div>
    </div>
    <!-- 商品分类选择 -->
    <div class="search-warp-pjl">
      <div class="search-pjl pf max-width">
        <skuscreen ref="screen" @getValue="getValue" @cover="covershow"></skuscreen>
      </div>
    </div>
    <div class="boutiquelist-warp-pjl">
      <div v-if="dataInfo.length > 0" class="boutiquelist b-white">
        <irisScroll ref="scroll" :dropdown="dropdown">
          <ul class="list" slot="list">
            <!--商品列表-->
            <li v-for="(item, index) in dataInfo" @click="skudetailed(item)" :key="index" v-show="!item.hidden">
              <div class="pic">
                <img v-if="item.avatarPath" :src="item.avatarPath" width="100%" height="auto">
                <img v-else src="../../assets/imgage/netavailable.png" width="100%" height="auto">
              </div>
              <div class="tex">
                <p>{{ item.title }}</p>
                <p class="w flex">
                  <span class="w50">
                    {{ item.vender }}
                  </span>
                </p>
                <p class="w flex">
                  <span class="w50 red">
                    <span v-if="item.price != noprice && item.shopType != 'card'">￥</span>
                    <span>{{ item.price | money }}</span>
                  </span>
                  <span v-if="item.shopType === 'normal'">
                      <span class="w50" v-if="item.stock > 0">
                          {{ '库存：'+ item.stock }}
                      </span>
                      <span class="w50 red" v-else>
                          {{ '暂无库存' }}
                      </span>
                  </span>
                </p>
              </div>
              <div class="add-pjl" v-if="flag != config.homePageFlag">
                <span @click.stop="addSkuInfo(item)">加入</span>
              </div>
            </li>
          </ul>
        </irisScroll>
      </div>
      <div v-if="dataInfo.length == 0 && !loadingShow" class="no-sevice-pjl">
        <no-data title="暂无数据"></no-data>
      </div>
      <loading v-if="loadingShow" class="load-pjl"></loading>
    </div>
    <!-- 遮罩层 -->
    <div class="model-pjl w h pf max-width" @touchmove.prevent v-if="cover" @click="coverclick">
    </div>
  </div>
</template>

<script>
  import PageHeader from "components/header/PageHeader";
  import skuscreen from "components/skuscreen/";
  import api from "@/common/api";
  import config from "@/common/config";
  import irisScroll from "@/components/iris-scroll";
  import Loading from "components/loading/loading";
  import NoData from "components/no-data/no-data";
  import {
    Toast
  } from "mint-ui";
  import {
    mapState,
    mapGetters,
    mapActions
  } from "vuex";
  const BEING_LOADING = '正在载入...'
  const NO_MORE_DATA = '暂无更多数据'
  export default {
    created() {
      let _this = this
      this.orderNo = this.$route.params.orderNo;
      this.flag = this.$route.params.flag;
      api.login.getLoginInfo().then(msg => {
        this.getLoginInfo = msg.data.obj || {};
        let type = this.getLoginInfo.postnTypes;
        let postnTypes = new Set(type || []);
        if (
          postnTypes.has(config.root.scPostTypeCode) &&
          postnTypes.has(config.root.smPostTypeCode)
        ) {
          //即是销售
          this.editable = true;
        } else if (postnTypes.has(config.root.scPostTypeCode)) {
          //销售
          this.editable = true;
        } else if (postnTypes.has(config.root.smPostTypeCode)) {
          //管理
          this.editable = false;
        }
      });
      if (this.flag != config.homePageFlag) {
        let carInfo = this.order.carOrderInfoVoList[0].carOrderDetailInfoList;
        api.clearingsettlement.order.queryOrderInfoVosByCodeFromDB({
            orderNo: this.$route.params.orderNo,
            allSubOrderFlag: true
          },
          res => {
            if (res.data.code === "success") {
              if (
                res.data.obj.closingFlag != 1 &&
                res.data.obj.carOrderInfoVoList[0].wfStatus != 0 &&
                res.data.obj.carOrderInfoVoList[0].currentOrderWfTypeCode != null
              ) {
                this.hasApprove = true;
              }
              if (
                res.data.obj.closingFlag != 1 &&
                res.data.obj.carOrderInfoVoList[0].wfStatus == -1 &&
                res.data.obj.carOrderInfoVoList[0].currentOrderWfTypeCode == null
              ) {
                this.hasApprove = true;
              }
            }
          }
        );
        for (let i = 0; i < carInfo.length; i++) {
          this.CarRelationInfo.push({
            carCode: carInfo[i].carCode,
            brandCode: carInfo[i].carBrandCode,
            seriesCode: carInfo[i].carSeriesCode,
            modelCode: carInfo[i].carModelCode,
            factoryCode: carInfo[i].carFactoryCode
          });
        }
      } else {
        _this.rightOptions.icon = ''
      }
    },
    mounted() {
      this.$nextTick(function() {
        document.getElementsByClassName("boutiquelist-warp-pjl")[0].style.height =
          document.getElementById("app").offsetHeight -
          this.$refs.header.$el.offsetHeight -
          document.getElementsByClassName("search-warp-pjl")[0].offsetHeight -
          document.getElementById("search").offsetHeight +
          "px";
          
      });
      
    },
    data() {
      return {
        config: config,
        leftOptions: {
          icon: ""
        },
        rightOptions: {
          icon: "icon-gouwuche"
        },
        dataInfo: [],
        pageStart: 1,
        lastPage: 1,
        flag: '',
        cover: false,
        loading: true,
        orderNo: null,
        noprice: "暂不销售",
        shopType: "normal",
        ksle: null,
        catlogcode: null,
        cardTypeCode: config.aftermarket.cardType.storedValue,
        loadingShow: true,
        isRequestData: false,
        skuName: "",
        categoryCodes: "",
        CarRelationInfo: []
      }
    },
    computed: {
      ...mapState("order", [
        "order"
      ]),
      ...mapGetters('order', [
        'hasNoSkuResson'
      ])
    },
    methods: {
      more() {
        if (this.flag != config.homePageFlag) {
          this.$router.push({
            path: `/aftermarketshopcar/${this.orderNo}`
          });
        }
      },
      getValue(data) {
        this.dataInfo = [];
        this.pageStart = 1;
        this.loadingShow = true;
        //如果选择的是精品商品
        if (data[0].level == 0) {
          //如果是第一层
          if (
            data[0].code == config.aftermarket.groupShop ||
            data[0].code == config.aftermarket.groupShopCP
          ) {
            //是组合商品
            this.shopType = "groupShop";
            this.categoryCode = ""; //分类查询条件清空
            this.catlogcode = data[0].code;
            this.groupgoods(0);
          } else if (
            data[0].code == config.aftermarket.skuCatlogCode ||
            data[0].code == config.aftermarket.skuCatlogCodeCP
          ) {
            //是精品商品
            this.categoryCode = ""; //分类查询条件清空
            this.shopType = "normal";
            this.catlogcode = data[0].code;
            this.querydata(0);
          } else if (
            data[0].code == config.aftermarket.postponeSku ||
            data[0].code == config.aftermarket.postponeSkuCP
          ) {
            //是延保商品
            this.categoryCode = ""; //分类查询条件清空
            this.shopType = "normal";
            this.catlogcode = data[0].code;
            this.querydata(0);
          } else if (   //config.newAftermarket.card  为 010065
            data[0].code == config.newAftermarket.card ||
            data[0].code == config.aftermarket.cardCP
          ) {

             //是卡商品
            this.shopType = "card";
            this.categoryCode = "";
            this.catlogcode = data[0].code;
            this.cardgoods(0);
          }
        } else if (data[0].level == 1) { //如果是商品分类
          if (data[0].skutype == "gropshop") {
            //组合商品
            this.categoryCode = data[0].code;
            this.shopType = "groupShop";
            this.groupgoods(0);
          } else if (data[0].skutype == "normal") {
            //精品商品
            this.categoryCode = data[0].code;
            this.shopType = "normal";
            this.querydata(0);
          } else if (data[0].skutype == "postponeSku") {
            //精品商品
            this.categoryCode = data[0].code;
            this.shopType = "normal";
            this.querydata(0);
          } else if (data[0].skutype == "card") {
            //卡商品
            this.categoryCode = data[0].code;
            this.shopType = "card";
            this.cardgoods(0);
          }
        }
      },
      querydata(length, isSearch) {
        let _this = this
        let obj = {}
        if (isSearch) {
          //带搜索框查询条件
          obj = {
            skuType: config.aftermarket.GoodsType,
            pageStart: this.pageStart,
            pageNums: config.pageNums,
            skuName: this.skuName,
            onOffFlag: 1,
            catlogCode: this.catlogcode,
            skuCarRelationInfoVos: this.CarRelationInfo
          };
        } else {
          //不带搜索框查询条件
          obj = {
            skuType: config.aftermarket.GoodsType,
            catlogCode: this.catlogcode,
            pageStart: this.pageStart,
            categoryCode: this.categoryCode,
            pageNums: config.pageNums,
            skuName: this.skuName,
            onOffFlag: 1,
            skuCarRelationInfoVos: this.CarRelationInfo
          };
        }
        api.aftermarket.querySkuInfoAdapterCar(obj, msg => {
          this.isRequestData = false;
          if (msg.data.message == "success") {
            _this.loadingShow = false;
            _this.lastPage = msg.data.obj.lastPage
            let data = msg.data.obj.list || [];
            if (data.length == 0) {
              // 没数据了
              this.NoData = true;
              this.$refs.scroll && this.$refs.scroll.dropDownText("暂无更多数据");
            }
            this.pages = msg.data.obj.pages;
            let skuCodeSet = []; //存skucodelist
            for (let i = 0; i < data.length; i++) {
              skuCodeSet.push(data[i].skuCode);
              //页面list组件
              this.$set(this.dataInfo, length + i, {
                title: data[i].skuName,
                vender: data[i].brandName,
                price: this.noprice,
                skuCode: data[i].skuCode,
                skuType: data[i].skuType,
                shopType: "normal",
                stock: 0,
                catlogCodeLevel3: data[i].catlogCodeLevel3,    //精品的三级目录信息
                catlogNameLevel3: data[i].catlogNameLevel3
              });
            }
            if (skuCodeSet && skuCodeSet.length !== 0) {
              let arr = [];
              for (let i = 0; i < data.length; i++) {
                arr.push({
                  relationCode: skuCodeSet[i]
                });
              }
              //获取精品商品价格
              api.aftermarket.queryskuprice({
                  storeCode: _this.order.storeCode,
                  skuCodeSet: skuCodeSet,
                  channelType: config.channelType,
                  pageNums: 100
                },
                msg => {
                  if (msg.data.message == "success") {
                    let data = msg.data.obj || [];
                    for (let i = length; i < this.dataInfo.length; i++) {
                      if (data[this.dataInfo[i].skuCode]) {
                        //根据skucode去map里面取商品价格
                        this.$set(this.dataInfo, i, {
                          title: this.dataInfo[i].title,
                          vender: this.dataInfo[i].vender,
                          price: data[this.dataInfo[i].skuCode].skuPrice,
                          skuCode: this.dataInfo[i].skuCode,
                          skuType: this.dataInfo[i].skuType,
                          shopType: this.dataInfo[i].shopType,
                          stock: this.dataInfo[i].stock,
                          avatarPath: this.dataInfo[i].avatarPath,
                          hidden: false,
                          catlogCodeLevel3: this.dataInfo[i].catlogCodeLevel3,    //精品的三级目录信息
                          catlogNameLevel3: this.dataInfo[i].catlogNameLevel3
                        });
                      } else {
                        //没取到的隐藏价格dom
                        this.$set(this.dataInfo, i, {
                          title: this.dataInfo[i].title,
                          vender: this.dataInfo[i].vender,
                          price: this.dataInfo[i].price,
                          skuCode: this.dataInfo[i].skuCode,
                          skuType: this.dataInfo[i].skuType,
                          shopType: this.dataInfo[i].shopType,
                          stock: this.dataInfo[i].stock,
                          avatarPath: this.dataInfo[i].avatarPath,
                          hidden: true,
                          catlogCodeLevel3: this.dataInfo[i].catlogCodeLevel3,    //精品的三级目录信息
                          catlogNameLevel3: this.dataInfo[i].catlogNameLevel3
                        });
                      }
                    }
                  }
                }
              );
              //获取库存
              api.stockInfo.queryBatchStockInfoVosMapByWhCode({
                  storeCode: _this.order.storeCode, 
                  skuCodeSet: skuCodeSet,
                  skuTypeCode: config.aftermarket.GoodsType
                },
                msg => {
                  if (msg.data.message == "success") {
                    let data = msg.data.obj || [];
                    for (let i = 0; i < this.dataInfo.length; i++) {
                      //根据skucode去map取数据 并且有可用库存availableNums
                      if (data[this.dataInfo[i].skuCode]) {
                        this.dataInfo[i].stock = data[this.dataInfo[i].skuCode] || 0
                        //给页面list赋值库存可用数量如果没有0
                      }
                    }
                  }
                }
              );
              if (skuCodeSet.length > 0) {
                api.file
                  .selectFileInfoByRelationCodesBatch(arr, (res) => {
                    if (res.data.code === 'success') {
                      let fileInfos = res.data.obj
                      for (let i = length; i < _this.dataInfo.length; i++) {
                        let index = fileInfos.findIndex((fileInfo) => {
                          return (fileInfo.relationCode === _this.dataInfo[i].skuCode)
                        })
                        if (index >= 0) {
                          _this.$set(_this.dataInfo, i, {
                            title: _this.dataInfo[i].title,
                            vender: _this.dataInfo[i].vender,
                            price: _this.dataInfo[i].price,
                            skuCode: _this.dataInfo[i].skuCode,
                            skuType: _this.dataInfo[i].skuType,
                            shopType: _this.dataInfo[i].shopType,
                            stock: _this.dataInfo[i].stock,
                            avatarPath: fileInfos[index].fileRelativePath,
                            hidden: _this.dataInfo[i].hidden,
                            catlogCodeLevel3: this.dataInfo[i].catlogCodeLevel3,    //精品的三级目录信息
                            catlogNameLevel3: this.dataInfo[i].catlogNameLevel3
                          })
                        } else {
                          _this.$set(_this.dataInfo, i, {
                            title: _this.dataInfo[i].title,
                            vender: _this.dataInfo[i].vender,
                            price: _this.dataInfo[i].price,
                            skuCode: _this.dataInfo[i].skuCode,
                            skuType: _this.dataInfo[i].skuType,
                            shopType: _this.dataInfo[i].shopType,
                            stock: _this.dataInfo[i].stock,
                            avatarPath: '',
                            hidden: _this.dataInfo[i].hidden,
                            catlogCodeLevel3: this.dataInfo[i].catlogCodeLevel3,    //精品的三级目录信息
                            catlogNameLevel3: this.dataInfo[i].catlogNameLevel3
                          })
                        }
                      }
                    }
                  })
              }
            }
          } else {
            this.loadingShow = false;
            this.NoData = true;
          }
        });
      },
      covershow(cover) {
        //显示遮罩层
        this.cover = cover;
      },
      coverclick() {
        //点击遮罩层关闭筛选
        this.$refs.screen.showConclose();
      },
      //添加购物车
      addSkuInfo(item) {
        console.log(item)
        if (this.editable && this.hasApprove && this.flag != config.homePageFlag) {
          if (item.price === this.noprice) {
            Toast("该商品暂不销售");
          } else if (item.shopType == "card") {
            Toast("卡商品金额不能为0");
          } else {
            let obj = null;
            if (item.shopType == "groupShop") {
              //组合商品
              obj = {
                orderNo: this.orderNo,
                actualSalesPrice: item.price == this.noprice ? 0 : item.price,
                combinationCode: item.skuCode,
                skuCode: "",
                channelType: config.channelType
              };
            } else if (item.shopType == "card") {
              obj = {
                orderNo: this.orderNo,
                actualSalesPrice: 0,
                giftAmount: 0,
                skuCode: item.skuCode,
                combinationCode: '',
                channelType: config.channelType,
                skuTypeCode: 'StoredValue'
              };
            } else {
              //普通商品
              obj = {
                orderNo: this.orderNo,
                actualSalesPrice: item.price == this.noprice ? 0 : item.price,
                skuCode: item.skuCode,
                combinationCode: "",
                channelType: config.channelType,
                catlogCodeLevel3: item.catlogCodeLevel3,
                catlogNameLevel3: item.catlogNameLevel3
              };
            }
            api.aftermarket.addSkuInfo([obj], msg => {
              if (msg.data.message == "success") {
                Toast("添加购物车成功");
                if (this.hasNoSkuResson) {
                  api.clearingsettlement
                    .order
                    .editOrderAddInfoVo({
                      id: this.order.noSkuReasonId,
                      sourceOrderNo: this.$route.params.orderNo,
                      addCode: 'noSkuReason',
                      isDeleted: '1'
                    }, (res) => {

                    })
                }
              } else {
                Toast("添加购物车失败");
              }
            });
          }
        } else if (this.flag != config.homePageFlag) {
          Toast("SM或订单审批中不可操作");
        }
      },
      //跳转商品详情
      skudetailed(item) {
        this.$router.push({
          path: `/aftermarketdetailpage/${item.skuCode}/${this.orderNo}/${item.shopType}/${this.flag}`
        });
      },
      //下拉加载触发
      dropdown() {
        return new Promise((resolve, reject) => {
          if (this.lastPage < this.pageStart) {
            this.isRequestData = true;
            this.$refs.scroll.dropDownText("暂无更多数据");
            resolve();
            return;
          }
          if (this.isRequestData === true) {
            resolve();
            return;
          }
          this.isRequestData = true;
          if (this.shopType == "groupShop") {
            this.pageStart++;
            this.groupgoods(this.dataInfo.length);
          } else if (this.shopType == "card") {
            this.pageStart++;
            this.cardgoods(this.dataInfo.length);
          } else {
            this.pageStart++;
            this.querydata(this.dataInfo.length);
          }
          resolve();
        });
      },
      // 列表搜索
      searchSku() {
        this.dataInfo = [];
        this.loadingShow = true;
        this.pageStart = 1
        if (this.shopType == "groupShop") {
          this.groupgoods(0, true);
        } else if (this.shopType == "card") {
          this.cardgoods(0, true);
        } else {
          this.querydata(0, true);
        }
      },
      //获取组合商品
      groupgoods(length, isSearch) {
        let obj = {}
        if (isSearch) {
          //带搜索条件查询
          obj = {
            pageStart: this.pageStart,
            pageNums: config.pageNums,
            combinationName: this.skuName,
            catlogCode: this.catlogcode,
          };
        } else {
          //不带搜索条件查询
          obj = {
            pageStart: this.pageStart,
            pageNums: config.pageNums,
            combinationName: this.skuName,
            catlogCode: this.catlogcode,
            categoryCode: this.categoryCode
          };
        }
        api.aftermarket.querygroupshopcar(obj, msg => {
          this.isRequestData = false;
          if (msg.data.message == "success") {
            this.loadingShow = false;
            this.lastPage = msg.data.obj.lastPage
            let data = msg.data.obj.list || [];
            if (data.length == 0) {
              this.$refs.scroll && this.$refs.scroll.dropDownText("暂无更多数据");
            }
            //分页信息
            this.pages = msg.data.obj.pages;
            let skuCodeSet = [];
            for (let i = 0; i < data.length; i++) {
              skuCodeSet.push({
                combinationCode: data[i].combinationCode,
                channelType: config.channelType
              });
              //页面list组件
              this.$set(this.dataInfo, length + i, {
                title: data[i].combinationName,
                vender: data[i].brandName,
                price: this.noprice,
                skuCode: data[i].combinationCode,
                shopType: "groupShop"
              });
            }
            if (skuCodeSet && skuCodeSet.length !== 0) {
              //获取组合商品价格
              api.aftermarket.querygroupshopprice(skuCodeSet, msg => {
                if (msg.data.message == "success") {
                  let data = msg.data.obj || [];
                  let obj = {};
                  for (let i = 0; i < data.length; i++) {
                    obj[data[i].combinationCode] = data[i];
                  }
                  for (let i = length; i < this.dataInfo.length; i++) {
                    if (obj[this.dataInfo[i].skuCode]) {
                      //有价格
                      this.$set(this.dataInfo, i, {
                        title: this.dataInfo[i].title,
                        vender: this.dataInfo[i].vender,
                        price: obj[this.dataInfo[i].skuCode].combinationPrice,
                        skuCode: this.dataInfo[i].skuCode,
                        shopType: this.dataInfo[i].shopType,
                        hidden: false //价格dom显示
                      });
                    } else {
                      //无价格
                      this.$set(this.dataInfo, i, {
                        title: this.dataInfo[i].title,
                        vender: this.dataInfo[i].vender,
                        price: this.dataInfo[i].price,
                        skuCode: this.dataInfo[i].skuCode,
                        shopType: this.dataInfo[i].shopType,
                        hidden: true //价格dom显示
                      });
                    }
                  }
                }
              });
            }
          }
        });
      },
      //获取卡商品
      cardgoods(length, isSearch) {
        let _this = this
        let obj = {}
        let skuCodeSet = []
        if (isSearch) {
          //带搜索条件查询
          obj = {
            pageStart: this.pageStart,
            pageNums: config.pageNums,
            cardTemplateName: this.skuName,
            cardTypeCode: this.cardTypeCode,
            isElectronicAccount: "1"
          }
        } else {
          //不带搜索条件查询
          obj = {
            pageStart: this.pageStart,
            pageNums: config.pageNums,
            cardTemplateName: this.skuName,
            cardTypeCode: this.cardTypeCode,
            isElectronicAccount:'1'// 只有电子账户

          }
        }
        api.aftermarket.queryByCardTemplateInfos(obj, (res) => {
          this.isRequestData = false;
          if (res.data.code === 'success') {
            this.loadingShow = false;
            this.lastPage = res.data.obj.lastPage
            let data = res.data.obj.list || [];
            if (data.length == 0) {
              this.NoData = true;
              this.$refs.scroll && this.$refs.scroll.dropDownText("暂无更多数据");
            }
            this.pages = res.data.obj.pages;
            for (let i = 0; i < data.length; i ++) {
                _this.$set(this.dataInfo, length + i, {
                  title: data[i].cardTemplateName,
                  vender: data[i].applyOrgName,
                  skuCode: data[i].cardTemplateCode,
                  shopType: "card"
                })
                skuCodeSet.push({
                  businessType: 'front',
                  relationCode: data[i].cardTemplateCode
                })
            }
            if (skuCodeSet.length > 0) {
                api.file
                  .selectFileInfoByRelationCodesBatch(skuCodeSet, (res) => {
                    if (res.data.code === 'success') {
                      let fileInfos = res.data.obj
                      for (let i = length; i < _this.dataInfo.length; i++) {
                        let index = fileInfos.findIndex((fileInfo) => {
                          return (fileInfo.relationCode === _this.dataInfo[i].skuCode)
                        })
                        if (index >= 0) {
                          _this.$set(_this.dataInfo, i, {
                            title: _this.dataInfo[i].title,
                            vender: _this.dataInfo[i].vender,
                            price: _this.dataInfo[i].price,
                            skuCode: _this.dataInfo[i].skuCode,
                            skuType: _this.dataInfo[i].skuType,
                            shopType: _this.dataInfo[i].shopType,
                            stock: _this.dataInfo[i].stock,
                            avatarPath: fileInfos[index].fileRelativePath
                          })
                        } else {
                          _this.$set(_this.dataInfo, i, {
                            title: _this.dataInfo[i].title,
                            vender: _this.dataInfo[i].vender,
                            price: _this.dataInfo[i].price,
                            skuCode: _this.dataInfo[i].skuCode,
                            skuType: _this.dataInfo[i].skuType,
                            shopType: _this.dataInfo[i].shopType,
                            stock: _this.dataInfo[i].stock,
                            avatarPath: ''
                          })
                        }
                      }
                    }
                  })
              }

          } else {
            this.loadingShow = false;
            this.NoData = true;
          }
        })
      }
    },
    components: {
      PageHeader,
      skuscreen,
      irisScroll,
      Loading,
      NoData
    }
  };
</script>

<style lang="scss" scoped>
  .search-warp {
    height: remp(44);
  }
  .search {
    box-sizing: border-box;
    height: remp(44);
    padding: remp(10) remp(10);
    background-color: #eceef3;
    position: fixed;
    -webkit-transform: translateZ(0);
    z-index: 3;
    top: remp(47);
  }
  .search input {
    border: none;
    box-sizing: border-box;
    display: block;
    width: 100%;
    height: 100%;
    color: rgb(126, 131, 135);
    text-align: left;
    font-size: remp(12);
    padding: remp(8) remp(10);
  }
  .search input::-webkit-input-placeholder {
    /* placeholder颜色  */
    color: rgb(126, 131, 135);
    /* placeholder字体大小  */
    font-size: remp(12);
    /* placeholder位置  */
    text-align: center;
  }
  .boutiquelist {
    height: 100%;
  }
  .boutiquelist ul>li {
    padding: remp(13.5) remp(0) remp(15.5) remp(13.5);
  }
  .boutiquelist {}
  .boutiquelist ul>li>div {
    display: inline-block;
    vertical-align: middle;
  }
  .boutiquelist .pic {
    width: 18%;
    height: remp(59);
    overflow: hidden;
  }
  .boutiquelist .tex {
    height: remp(59);
    width: 60%;
  }
  .boutiquelist .tex>p:first-child {
    height: remp(15);
    line-height: remp(15);
    font-size: remp(13);
    color: rgb(51, 51, 51);
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .boutiquelist .tex>p:nth-child(2) {
    height: remp(14);
    line-height: remp(12);
    color: rgb(126, 131, 135);
    font-size: remp(12);
    margin: remp(8) remp(0) remp(8) remp(0);
  }
  .boutiquelist .tex>p:nth-child(3) {
    height: remp(14);
    line-height: remp(14);
    font-size: remp(9);
    color: rgb(126, 131, 135);
  }
  .boutiquelist .tex>p:nth-child(3)>span {
    font-size: remp(14);
  }
  .red {
    color: rgba(254, 56, 36, 0.9);
  }
  .boutiquelist .add-pjl {
    vertical-align: bottom;
  }
  .boutiquelist .add-pjl>span {
    display: inline-block;
    border-radius: remp(4);
    width: remp(60);
    height: remp(22);
    line-height: remp(22);
    font-size: remp(12); // font-weight: 600;
    color: rgb(0, 140, 238);
    text-align: center;
    border: 2px solid rgba(0, 140, 238, 0.6);
  }
  .boutiquelist-warp-pjl {
    box-sizing: border-box; // height: 500px;
  }
  .model-pjl {
    top: 0;
    z-index: 2;
    background: rgba(0, 0, 0, 0.4);
  }
  .search-pjl {
    width: 100%; // top: rem(170);
    z-index: 200;
  }
  .search-warp-pjl {
    // height: rem(90);
    height: rem(70);
    background-color: #eceef3;
  }
  .load-pjl {
    margin-top: remp(100);
  }
  .no-sevice-pjl {
    padding-top: 100px;
    box-sizing: border-box;
  }
  .boutiquelist ul li {
    border-bottom: remp(1) solid #f0f2f5;
  }
  #search {
    background-color: #f4f4f4;
  }
  .search-warp-pjl {
    border-top: remp(1) solid rgba(240, 242, 245, 0.3);
  }
  .left-arrow {
    position: absolute;
    width: rem(32);
    height: rem(32);
    &:before {
      content: "";
      position: absolute;
      width: rem(34);
      height: rem(34);
      border: rem(20) solid $browser-default-color-white;
      border-width: rem(3) 0 0 rem(3);
      transform: rotate(315deg);
      top: rem(4);
    }
  }
</style>
