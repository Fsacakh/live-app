<template>
  <div class="detailpagebox b-white">
    <page-header :rightOptions="rightOptions" @on-click-right="more">
      <div slot>详情</div>
    </page-header>
    <div class="imgBox w b-white">
      <swipe :auto="0">
        <template v-for="avatarPath in imgUrls">
          <swipe-item>
            <img v-if="avatarPath" :src="avatarPath">
            <img v-else :src="imgUrl">
          </swipe-item>
        </template>
      </swipe>
    </div>
    <div class="texInfo b-white">
      <div class="sellInfo">
        <div class="sell">
          <p>{{skuData.skuName}}</p>
          <p>{{skuData.brandName}} &nbsp; &nbsp; {{skuData.useType}}</p>
          <p><span v-if="skuData.price!=noprice">￥</span>{{skuData.price ? skuData.price.toFixed(2): parseFloat(0).toFixed(2)}}</p>
          <p v-if="(Number.isFinite(skuData.stock))">库存：{{skuData.stock}}</p>
        </div>
      </div>
      <div class="productInfo b-white">
        <p>商品信息</p>
        <div v-if="skuData.cardDescription" class="text">
          <p v-for="(item, index) in newText(skuData.cardDescription)" :key="index">
            {{item}}
          </p>
        </div>
        <p v-else-if="skuData.remark">{{ skuData.remark }}</p>
        <p v-else>暂无内容</p>
      </div>
      <div class="productInfo b-white" v-if="shopType == 'card'">
        <p>免责条款</p>
        <div v-if="skuData.rules" class="text">
          <p v-for="(item, index) in newText(skuData.rules)" :key="index">
            {{item}}
          </p>
        </div>
        <p v-else>暂无内容</p>
      </div>
      <div class="productInfo b-white" v-if="shopType == 'card'">
         <p><label class="title">金额</label><input v-model.number="skuData.price" class="input" type="number" @change="checkPrice"/></p>
      </div>
    </div>
    <div class="detailFoot w max-width" v-if="!isHomePage">
      <add-cart v-model="number" @routerto="routerto">加入</add-cart>
    </div>
  </div>
</template>
<script>
  import PageHeader from "components/header/PageHeader";
  import addCart from "components/addcart/addcart";
  import api from "@/common/api";
  import config from "@/common/config";
  import {
    Toast,
    Swipe,
    SwipeItem
  } from "mint-ui";
  import {
    mapState,
    mapGetters,
    mapActions
  } from "vuex";
  const base = process.env.NODE_ENV === 'development' ? '' : '/liveapp'
  export default {
    components: {
      PageHeader,
      addCart,
      Swipe,
      SwipeItem
    },
    data() {
      return {
        rightOptions: {
          icon: "icon-gouwuche"
        },
        skuData: {
          skuName: "", //商品名字
          price: null,
          stock: null
        },
        flag: '',
        avatarPath: '',
        number: 1,
        noprice: "暂不销售",
        hasApprove: null,
        editable: null,
        imgUrl: base + '/static/no-resources.png',
        imgUrls: [0]
      };
    },
    computed: {
      ...mapState("order", [
        "order"
      ]),
      isHomePage: function() {
        let _this = this
        return (_this.$route.params.flag === config.homePageFlag)
      },
      shopType: function() {
        let _this = this
        return (_this.$route.params.shopType)
      }
    },
    methods: {
      newText(rules) {
        return rules.split("\n")
      },
      callback() {
        this.$router.push({
          path: `/aftermarket/${this.orderNo}`
        });
      },
      more() {
        this.$router.push({
          path: `/aftermarketshopcar/${this.$route.params.orderNo}`
        });
      },
      routerto() {
        if (this.editable && this.hasApprove) {
          if (this.skuData.price == this.noprice) {
            Toast("该商品暂不销售");
          } else if (this.$route.params.shopType == "card" && this.skuData.price <= 0) {
            Toast("卡商品金额不能为0");
          } else {
            let obj;
            if (this.$route.params.shopType == "normal") {
              obj = {
                orderNo: this.$route.params.orderNo,
                actualSalesPrice: this.skuData.price == this.noprice ? 0 : this.skuData.price,
                skuCode: this.skuData.skuCode,
                channelType: config.channelType,
                skuType: this.skuData.skuType,
                catlogCodeLevel3: this.skuData.catlogCodeLevel3,
                catlogNameLevel3: this.skuData.catlogNameLevel3
              };
            } else if (this.$route.params.shopType == "card") {
              obj = {
                orderNo: this.$route.params.orderNo,
                actualSalesPrice: this.skuData.price == this.noprice ? 0 : this.skuData.price,
                originalSalesPrice: this.skuData.price == this.noprice ? 0 : this.skuData.price,
                giftAmount: 0,
                skuCode: this.skuData.skuCode,
                skuName: this.skuData.skuName,
                brandName: this.skuData.brandName,
                combinationCode: '',
                channelType: config.channelType,
                skuTypeCode: this.skuData.skuTypeCode
              };
            } else {
              obj = {
                orderNo: this.$route.params.orderNo,
                actualSalesPrice: this.skuData.price == this.noprice ? 0 : this.skuData.price,
                combinationCode: this.skuData.skuCode,
                channelType: config.channelType
              };
            }
            api.aftermarket.addSkuInfo([obj], msg => {
              if (msg.data.message == "success") {
                Toast("添加购物车成功");
              }
            });
          }
        } else {
          Toast("SM或订单审批中不可操作");
        }
      },
      checkPrice() {
         let _this = this
         if (_this.$data.skuData.price < 0) {
             _this.$data.skuData.price = 0
         }
      }
    },
    mounted() {
      let _this = this
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
      if (_this.$route.params.flag != config.homePageFlag) {
        api.clearingsettlement.order.queryOrderInfoVosByCodeFromDB({
            orderNo: this.$route.params.orderNo === 'undefined' ? '' : this.$route.params.orderNo,
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
      } else {
        _this.rightOptions.icon =""
      }
      if (this.$route.params.shopType == "normal") {
        api.skuInfo.get({
            skuCode: this.$route.params.skucode,
            skuType: config.aftermarket.GoodsType
          },
          msg => {
            if (msg.data.message == "success") {
              this.skuData.skuName = msg.data.obj.skuName;
              this.skuData.brandName = msg.data.obj.brandName;
              this.skuData.skuCode = msg.data.obj.skuCode;
              this.skuData.skuType = msg.data.obj.skuType;
              this.skuData.remark = msg.data.obj.remark;
              this.skuData.catlogCodeLevel3 = msg.data.obj.catlogCodeLevel3;
              this.skuData.catlogNameLevel3 = msg.data.obj.catlogNameLevel3;
            }
            api.aftermarket.queryskuprice({
                storeCode: _this.order.storeCode,
                skuCodeSet: [this.$route.params.skucode],
                channelType: config.channelType
              },
              msg => {
                if (msg.data.message == "success") {
                  let data = msg.data.obj || {};
                  this.skuData.price =
                    data[this.skuData.skuCode] &&
                    data[this.skuData.skuCode].skuPrice ?
                    data[this.skuData.skuCode].skuPrice :
                    this.noprice;
                }
              }
            );
            api.newAftermarket.queryBatchStockInfoVosMapByWhCode({
                storeCode: _this.order.storeCode,
                skuCodeSet: [this.$route.params.skucode],
                skuTypeCode: config.aftermarket.GoodsType
              },
              msg => {
                if (msg.data.message == "success") {
                  let data = msg.data.obj || [];
                  this.skuData.stock =
                    (data[this.skuData.skuCode] &&
                      data[this.skuData.skuCode]) ||
                    0;
                }
              }
            );
            api.file.selectByRelationCode({
              relationCode: this.$route.params.skucode
            }, (res) => {
              if (res.data.code === 'success') {
                if (res.data.obj.length > 0) {
                  let fileInfo = res.data.obj[0]
                  _this.imgUrls = []
                  _this.imgUrls[0] = fileInfo.fileRelativePath
                }
              }
            })
          }
        );
      } else if (this.$route.params.shopType == "card") {
        api.aftermarket.getCardTemplateInfoByCode({
          cardTemplateCode: this.$route.params.skucode
        }, (res) => {
            if (res.data.code === 'success') {
              let cardInfo = res.data.obj
              this.skuData.skuName = cardInfo.cardTemplateName
              this.skuData.brandName = cardInfo.applyOrgName
              this.skuData.useType = cardInfo.cardUseTypeName
              this.skuData.skuCode = cardInfo.cardTemplateCode
              this.skuData.skuTypeCode = 'StoredValue'
              this.skuData.price = 0
              this.skuData.cardDescription = cardInfo.cardDescription
              this.skuData.rules = cardInfo.cardRules
              _this.imgUrls = []
              if (cardInfo.cardPic1) {
                _this.imgUrls.push(cardInfo.cardPic1)
              }
              if (cardInfo.cardPic2) {
                _this.imgUrls.push(cardInfo.cardPic2)
              }
              if (cardInfo.cardPic3) {
                _this.imgUrls.push(cardInfo.cardPic3)
              }
              if (cardInfo.cardPic4) {
                _this.imgUrls.push(cardInfo.cardPic4)
              }
              if (cardInfo.cardPic5) {
                _this.imgUrls.push(cardInfo.cardPic5)
              }
            }
        })
      } else {
        //组合商品
        api.aftermarket.querygroupshopdetail({
            combinationCode: this.$route.params.skucode
          },
          msg => {
            if (msg.data.message == "success") {
              this.skuData.skuName = msg.data.obj.combinationName;
              this.skuData.brandName = msg.data.obj.brandName;
              this.skuData.skuCode = msg.data.obj.combinationCode;
              this.skuData.remark = msg.data.obj.remark;
            }
            api.aftermarket.querygroupshopdetailpice(
              [{
                combinationCode: this.$route.params.skucode,
                channelType: config.channelType
              }],
              msg => {
                if (msg.data.message == "success") {
                  let data = msg.data.obj || {};
                  this.skuData.price =
                    data[0] && data[0].combinationPrice ?
                    data[0].combinationPrice :
                    this.noprice;
                }
              }
            );
          }
        );
      }
    }
  };
</script>
<style lang="scss" scoped>
  .sell {
    position: relative;
  }
  .detailpagebox {
    padding-bottom: remp(45);
  }
  .imgBox .mint-swipe {
      width: 100%;
      height: remp(230);
  }
  .mint-swipe-item{
    overflow: hidden;
  }
  .mint-swipe-item img {
    width: 100%;
    height: auto;
  }
  .texInfo .sellInfo {
    position: relative;
    padding: remp(15) remp(0) remp(0) remp(16.5);
  }
  .texInfo .productInfo {
    padding: remp(10) remp(010) remp(0) remp(25);
  }
  .productInfo p:first-child {
    font-size: remp(11);
    color: rgb(126, 131, 135);
    font-weight: 600;
    margin-bottom: remp(7);
  }
  .productInfo p:last-child {
    font-size: remp(12);
    color: rgb(51, 51, 51);
    padding: rem(30) remp(25) rem(30) 0;
    max-height: rem(200);
    overflow-y: scroll;
  }
  .productInfo .title {
    font-size: remp(11);
    color: rgb(126, 131, 135);
    font-weight: 600;
  }
  .productInfo .text {
    font-size: remp(12);
    color: rgb(51, 51, 51);
    padding: rem(30) remp(25) rem(30) 0;
    max-height: rem(200);
    overflow-y: scroll;
  }
  .productInfo .input {
     margin: 0 rem(20);
     width: 80%;
     height: rem(50);
     font-size: remp(13);
     color: rgb(51, 51, 51);
     text-align: center;
     background-color: #eee;
  }
  .texInfo .recommend {
    border-top: remp(10) solid #efefef;
    border-bottom: remp(10) solid #efefef;
    position: relative;
    padding: remp(10) remp(0) remp(11) remp(25.5);
  }
  .texInfo .recommend p:first-child {
    font-size: remp(11);
    color: rgb(126, 131, 135);
    font-weight: 600;
    margin-bottom: remp(7);
  }
  .texInfo .recommend p:first-child {
    line-height: remp(15);
    font-size: remp(12);
    color: rgb(126, 131, 135);
    font-weight: 600;
    margin-bottom: remp(7);
  }
  .recommend ul li {
    float: left;
    margin-right: remp(20);
  }
  .recommend ul li div {
    width: remp(65);
    height: remp(45);
  }
  .recommend ul li p {
    height: remp(15);
    line-height: remp(15);
    font-size: remp(12);
    text-align: center;
    color: rgb(51, 51, 51);
    font-weight: 600;
    margin-top: remp(5);
  }
  .sellInfo .sell {
    padding: remp(0) remp(0) remp(15.5) remp(8.5);
    border-bottom: 1px solid #ccc;
  }
  .sellInfo .time {
    padding: remp(5) remp(0) remp(4.5) remp(8.5);
  }
  .sellInfo .time i {
    float: left;
    font-size: remp(20);
    margin-right: remp(5);
    color: rgb(0, 140, 238);
  }
  .sellInfo .time p {
    height: remp(20);
    line-height: remp(20);
    font-size: remp(12);
    color: rgb(51, 51, 51);
  }
  .sell>p:nth-child(1) {
    font-size: remp(14);
    color: rgb(51, 51, 51);
    font-weight: 600;
  }
  .sell>p:nth-child(2) {
    height: remp(15);
    line-height: remp(15);
    font-size: remp(12);
    color: rgb(126, 131, 135);
    font-weight: 600;
    margin: remp(5) remp(0) remp(10) remp(0);
  }
  .sell>del {
    height: remp(14);
    line-height: remp(14);
    font-size: remp(10);
    color: rgb(189, 199, 209);
  }
  .sell>p:nth-child(3) {
    font-size: remp(15);
    color: rgba(254, 56, 36, 0.9);
    font-weight: 600;
    margin-top: remp(3);
  }
  .sell>p:nth-child(4) {
    position: absolute;
    bottom: 20%;
    right: 2%;
  }
  .sell>p:nth-child(5) {
    position: absolute;
    top: remp(77.5);
    right: remp(24.5);
    font-size: remp(10);
    color: rgb(126, 131, 135);
  }
  .detailFoot {
    position: fixed;
    bottom: 0;
    height: remp(45);
    transform: translateZ(0);
    z-index: 999;
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
