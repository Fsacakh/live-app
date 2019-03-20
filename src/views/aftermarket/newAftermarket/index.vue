<template>
  <div>
    <div class="aftermarket" v-show="!showCarSelect">
      <page-header ref="header">
        <div slot> 后市场 </div>
        <div slot="right">
            <p class="right-text" v-show="carShow" @click="selecCarType()">选择车型</p>
            <p class="right-text" v-show="!carShow" @click="clearCarType()">清空车型</p>
        </div>
      </page-header>
      <div class="inquireHeader">
        <!--搜索-->
          <div class="search-warp">
            <div class="search-content positionContainer">
              <div class="search-icon" v-show="showSearch">
                <i class="iconfont sousuo icon-icon-sousuo"></i>
                <span>搜索</span>
              </div>
              <input type="text" v-model="searchName"  @focus="searchBy" @change="searchSku"/>
              <div class="delete-icon"  v-show="!showSearch" @click="delet">
                <i class="iconfont icon-guanbi"></i>
              </div>
            </div>
          </div>
          <!-- 已选车型 -->
          <div class="seleCarType" v-show="!carShow">
              <div class="carType">
                <div class="carIconPic">
                    <img src="../../../assets/imgage/carIcon.png" width="20px" height="14.6px">
                </div>
                <div class="rightArea">
                  <div title="rightTitle">{{ this.selectCar.displayName}}</div>
                </div>
              </div>
          </div>
          <!--选择分类-->
          <div class="select-sort">
            <div class="content">
              <skuscreen ref="screen" @getValue="getValue" @cover="shade.show = !shade.show"></skuscreen>
            </div>
          </div>
      </div>
      <div class="car-list" v-show="!carShow"></div>
      <!--产品列表-->
      <div class="product-listwrap" >
        <div class="product-list" v-if="skuList.length > 0">
            <irisScroll ref="scroll" :dropdown="scrollToEnd">
              <ul class="list" slot="list">
                  <!-- 商品列表 -->
                  <li class="productLists" v-for="(item,index) in skuList" :key="index" @click="gotoDetail(item)" v-show="(item.skuType != 'card' && item.standardCost != null) || item.skuType == 'card'">
                    <div class="pic">
                      <img v-if="item.imgPath" :src="item.imgPath" width="100%" height="auto">
                      <img v-else src="../../../assets/imgage/netavailable.png" width="100%" height="auto">
                    </div>
                    <div class="infos">
                      <p class="">{{item.name}}</p>      
                      <p>{{item.brandName}}</p>
                      <span class="priceDate">
                        <span class="red" v-if="isCard">¥{{item.standardCost  | money}}</span>
                        <span class="saveDate" v-if="item.skuType === 'normal'">
                          <span class="w50" v-if="item.stock > 0">
                            {{ '库存：'+ item.stock }}
                          </span>
                          <span class="w50 red" v-else>
                              {{ '暂无库存' }}
                          </span>
                        </span>
                      </span>
                    </div>
                  </li>
              </ul>
            </irisScroll>
        </div>
        <div v-show="skuList.length == 0 && !isShowLoading" class="no-sevice-pjl">
          <no-data title="暂无数据"></no-data>
        </div>
      </div>
      <loading  class="load-pjl" v-if="isShowLoading"></loading>
      <!-- 遮罩层 -->
      <div class="model-pjl max-width" @touchmove.prevent @click="coverclick" v-show="shade.show">
      </div>
    </div>
    <!-- 查找车型组件 -->
    <div v-show="showCarSelect">
      <likevehicle  ref="likevehicle" ensuredispaly="carbrand" title="查找车型" @revert="back" @confirm="confirm"></likevehicle>
    </div>
  </div>
</template>

<script>
import {Toast} from "mint-ui";
import PageHeader from "components/header/PageHeader";
import skuscreen from "components/skuscreen/";
import config from "@/common/config";
import api from "@/common/api";
import Loading from "components/loading/loading";
import NoData from "components/no-data/no-data";
import likevehicle from '@/components/likevehicle/likevehicle1';
import Scroll from 'components/scroll/scroll'
import irisScroll from "@/components/iris-scroll";
  const BEING_LOADING = '正在载入...'
  const NO_MORE_DATA = '暂无更多数据'
  export default {
    components: {
    	PageHeader,
    	skuscreen,
    	Loading,
    	NoData,
      Scroll,
      likevehicle,
      irisScroll
    },
    data() {
      return {
        carShow: true,
      	skuList:[],//列表数据
      	showSearch:true,
      	cover:false,//遮罩显示
      	searchName:'',
      	shade:{
      		show:false,
      	},
      	query:{
      		"pageNums":10,
 			    "cardTypeCode":this.catlogCode,
      	},
      	showLoading: false,
      	isShowLoading:false,//加载数据显示
      	catlogCode:'022267',
      	lastPage: 1,
        pageStart: 1,
        isCard: true,
        skuName: '',
        showCarSelect: false,
        selectCar: {  // 选择车型
          factoryCode: '',
          brandCode: '',
          seriesCode: '',
          modelCode: '',
          carCode: '',
          displayName: ''
        },
        isRequestData: false,
        loadingNoData: false,
        itemCurrent:''
      }
    },
    mounted() {
      this.$nextTick(function() {
        document.getElementsByClassName("product-listwrap")[0].style.height =
          document.getElementById("app").offsetHeight -
          this.$refs.header.$el.offsetHeight -
          document.getElementsByClassName("inquireHeader")[0].offsetHeight + "px";
      });
    },
    computed: {
       /*加载显示文字*/
      lodingText() {
        if (this.showLoading == true && this.noMore == false) {
            return BEING_LOADING;
          }
        if (this.showLoading == true && this.noMore == true) {
            return NO_MORE_DATA;
          }
      },
    },
    methods: {
      getSave(arr) {
        let skuCodeSet = []
        arr.forEach((item) => {
          skuCodeSet.push(item.skuCode)
        })
        //获取库存
        api.stockInfo.queryBatchStockInfoVosMapByWhCode({
            skuCodeSet: skuCodeSet,
            skuTypeCode: config.aftermarket.GoodsType
          },
          msg => {
            if (msg.data.message == "success") {
              let data = msg.data.obj || [];
              for (let i = 0; i < this.skuList.length; i++) {
                //根据skucode去map取数据 并且有可用库存availableNums
                if (data[this.skuList[i].skuCode]) {
                  //给页面list赋值库存可用数量如果没有0
                  //this.skuList[i].stock = data[this.skuList[i].skuCode] || 0
                  this.$set(this.skuList[i], 'stock', data[this.skuList[i].skuCode] || 0);
                }
              }
            }
          }
        );
      },
      // 点击遮罩层
      coverclick() {
        this.shade.show = !this.shade.show;
      },
      //跳转至详情页面
      gotoDetail(item){
        this.$router.push({
          path: `/aftermarketdetailpage/${item.skuCode}/0/${item.skuType}/${config.homePageFlag}`
        });
      },
      /*点击搜索关闭按钮*/
      delet(){
        this.searchName = '';
        this.showSearch = true
      },
      // 选择车型
      selecCarType() {
        //显示查询车型界面
        this.$refs.likevehicle.clearData();
        this.$data.showCarSelect = true;
        this.clearCarData();
      },
      // 清除车型
      clearCarType() {
        this.carShow = true;  //返回原先界面
        this.$refs.likevehicle.clearData();  //清空已选择车型数据
        // 清空车型数据
      	this.clearCarData();
        //this.querySku(this.itemCurrent[0].level,this.itemCurrent[0].code);
        this.getValue(this.itemCurrent)
        //this.querySku();   //调用查询函数
      },
      //清空数据
      clearCarData(){
      	for(let k of Object.keys(this.selectCar)){
      		this.selectCar[k]= '';
      	}
      },
      // 返回主页面
      back() {
        this.showCarSelect = false;
      },
      //数据传递
      confirm(item) {
        let factoryName = item.factorydata ? item.factorydata.factoryName: '',
            brandName = item.carbranddata.brandName,
            seriesName = item.cartraindata.seriesName,
            modelName = item.cartypedata.modelName,
            displayName = item.carstyledata.displayName
            this.selectCar.factoryCode = item.factorydata ? item.factorydata.factoryCode: ''
            this.selectCar.brandCode = item.carbranddata.brandCode
            this.selectCar.seriesCode = item.cartraindata.seriesCode
            this.selectCar.modelCode = item.cartypedata.modelCode
            this.selectCar.carCode = item.carstyledata.carCode
            this.selectCar.displayName = `${factoryName || ''} ${brandName || ''} ${seriesName || ''} ${modelName || ''} ${displayName || ''}`
            this.showCarSelect = false;
            this.carShow = false;
        // 调用查询函数
        //querySku(num = 1,catlogCode ='022267',categoryCode = '')
        //this.querySku(this.itemCurrent[0].level,this.itemCurrent[0].code);
        this.getValue(this.itemCurrent)
      },
      //点击搜索按钮
      searchBy(){
        this.showSearch = false;
      },
      //搜索sku
      searchSku(em,num = 1){
        var isQuery = this.catlogCode == config.aftermarket.postponeSkuCP || this.catlogCode == config.aftermarket.skuCatlogCodeCP;
        var isGroup = this.catlogCode == config.aftermarket.groupShopCP
        this.noMore = false
        if (isQuery){
          this.querySku(num,this.catlogCode)
        } else if(isGroup){
          this.queryGroup(num,this.catlogCode);
        } else {
          this.queryByCardTemplateInfos(num,this.catlogCode)
        }

      },
      //点击值之后的方法
      getValue(item){        
        this.itemCurrent = item;
        console.info(this.itemCurrent)
        /*点击之后根据item,加载值*/
        var isQuery = item[0].code == config.aftermarket.postponeSkuCP || item[0].code == config.aftermarket.skuCatlogCodeCP || item[0].code == config.aftermarket.skuCatlogCode || item[0].code == config.aftermarket.postponeSku;
        var isGroup = item[0].code == config.aftermarket.groupShopCP || item[0].code == config.aftermarket.groupShop;
        var isCard = item[0].code == config.newAftermarket.card || item[0].code == config.aftermarket.cardCP;

        // 如果选择的是精品商品(选择的是第一层)
        if(item[0].level == 0){
          if(isQuery){//查精品、延保商品
            this.catlogCode = item[0].code
            this.querySku(1, item[0].code);
          }
          if(isGroup){//查组合商品
            this.catlogCode = item[0].code
            this.queryGroup(1,item[0].code);
          }
          if(isCard){//查卡商品
            this.catlogCode = item[0].code
            this.queryByCardTemplateInfos(1,item[0].code)
          }
        } else if(item[0].level == 1){
          //如果是商品分类(选择的是第二层)
          if(item[0].skutype == 'normal' || item[0].skutype == "postponeSku"){//查精品、延保商品
            this.querySku(1, this.catlogCode, item[0].code);
          } else if(item[0].skutype == 'gropshop'){
            //组合商品
            this.queryGroup(1, this.catlogCode, item[0].code);
          } else if (item[0].skutype == 'card'){  //查卡商品下的分类
            this.queryByCardTemplateInfos(1, this.catlogCode, item[0].code)
          }
        }
      },
      //下拉滚动
      scrollToEnd(){
        this.showLoading = true;
        if (this.lastPage < this.pageStart) {
          this.noMore = true
          this.showLoading = true
        }else{
          this.noMore = false
        }
        this.pageStart++;
        this.searchSku({},this.pageStart)
      },
      //查询列表的公共接口，查询精品商品和延保商品
      querySku(num = 1,catlogCode ='022267',categoryCode = ''){
        this.catlogCode = catlogCode;
      	var obj = {
            ...this.query,
            "skuType":'goodsTypeGood',
            "pageStart":num,
            "categoryCode":categoryCode,
            "skuName":this.searchName,
            "onOffFlag":1,
            "skuCarRelationInfoVos":[this.selectCar],
            "catlogCode": this.catlogCode
          };
        if(this.selectCar.brandCode == ''){
        		obj.skuCarRelationInfoVos = [];
        }
        this.querySkuCar(obj)
      },
      //公共查询接口
      querySkuCar(obj){
          //调用查询接口
          api.newAftermarket.querySkuInfoByAdapterCar(obj,res => {
            if(res.data.code == 'success'){
              if(obj.pageStart == 1){
                this.skuList = [];
              } else {
                res.data.message = ' ';
              }
              this.isCard = true;
              var arr  = res.data.obj.list;
              if(arr != ''){
                this.lastPage = res.data.obj.lastPage;
                this.pageStart = res.data.obj.pageNum;
                /*查询商品价格*/
                this.skuPriceQuery(arr);
                // 调用库存接口
                this.getSave(arr);
                /*查询图片*/
                var imgCode = [];
                arr.forEach(item=>{
                    imgCode.push({
                      relationCode:item.skuCode
                    })
                    item.name = item.skuName;
                })
                this.PicData(imgCode);
              } else{
                this.$refs.scroll && this.$refs.scroll.dropDownText("暂无更多数据");
              }
              let skuCodeSet = []; //存skucodelist
              for(let i = 0; i < obj.length; i ++) {
                skuCodeSet.push(data[i].skuCode);
              }
              if(skuCodeSet && skuCodeSet.length !== 0) {
                let arr = [];
                for (let i = 0; i < obj.length; i++) {
                  arr.push({
                    relationCode: skuCodeSet[i]
                  });
                }
              }
            }
          })
      },
      //查询商品价格接口参数配置
      skuPriceQuery(arr){
        if(arr.length){
          this.loadingNoData = false
          var skuCode = [];
          arr.forEach(item => {
            item.skuType = 'normal'
            this.skuList.push(item);
            skuCode.push(item.skuCode)
          })
          var option = {
            skuCodeSet: skuCode,
            channelType: config.channelType,
            pageNums: 100
          }
          this.queryskuprice(option);
        }else{
          this.loadingNoData = true
        }
      },
      //查询组合商品
      queryGroup(num = 1,catlogCode = '022297',categoryCode =''){
        // debugger
        this.catlogCode = catlogCode
        var obj = {
          ...this.query,
          "pageStart":num,
          "categoryCode":categoryCode,
          'combinationName':this.searchName,
          'catlogCode': this.catlogCode,
          }
        var skuCodeSet = [];
        api.newAftermarket.queryGroupShopCar(obj,res => {
          if(res.data.code == 'success'){
            if(obj.pageStart == 1){
              this.skuList = [];
            }
            this.isCard = true
            /*下拉加载数据push*/
            res.data.obj.list.forEach(item => {
              item.skuType = 'groupShop'
              this.skuList.push(item);
              this.skuList.forEach((item, In) => {
              item.skuCode =  item.combinationCode;
              if(obj[item.skuCode]){
                if(obj[item.skuCode].skuPrice >= 0) {
                  this.$set(this.skuList[In],'standardCost',obj[item.skuCode].skuPrice)
                }
              }
            })
              item.name = item.combinationName
              skuCodeSet.push({
                combinationCode:item.combinationCode,
                channelType: config.channelType
              });
            })
            if(skuCodeSet != ''){
              this.lastPage = res.data.obj.lastPage;
              this.pageStart = res.data.obj.pageNum;
              /*调用价格*/
              if(this.skuList.length){
                this.querygroupshopprice(skuCodeSet)
              }
            }else{
              this.$refs.scroll && this.$refs.scroll.dropDownText("暂无更多数据");
            }
          }
        })
      },
      //组合价格查询
      querygroupshopprice(obj){
        var This = this;
        api.aftermarket.querygroupshopprice(obj,res=>{
          if(res.data.code == 'success'){
            let priceMap = {}
            let list = res.data.obj;
            for (let i = 0; i < list.length; i++) {
              priceMap[list[i].combinationCode] = list[i];
            }
            if(obj.length >= 0) {
              obj.forEach((item, In) => {
                if(priceMap[item.combinationCode].combinationPrice >= 0) {
                  This.$set(This.skuList[In], 'standardCost', priceMap[item.combinationCode].combinationPrice);
                }
              })
            }
          }
        })
      },
      //查询卡商品
      queryByCardTemplateInfos(num = 1,catlogCode,categoryCode = ''){
        this.catlogCode = catlogCode
        var obj = {
          ...this.query,
          "pageStart": num,
          'categoryCode': categoryCode,
          'cardTemplateName': this.searchName,
          cardTypeCode: "StoredValue",
          isElectronicAccount: "1"
          }
        var skuCodeSet = [];
        api.aftermarket.queryByCardTemplateInfos(obj,res => {
          if(res.data.code == 'success'){
            if(obj.pageStart == 1){
              this.skuList = [];
            }
            this.isCard = false;
            res.data.obj.list.forEach((item,In) => {
              item.skuType = 'card'
              this.skuList.push(item)
              this.skuList.forEach((item,In) => {
                item.name = item.cardTemplateName;
                item.brandName = item.applyOrgName;
                item.skuCode =  item.cardTemplateCode;
                if(obj[item.skuCode]){
                  this.$set(this.skuList[In], 'standardCost', obj[item.skuCode].skuPrice)
                }
            })
              /*获取图片的接口参数*/
              skuCodeSet.push({
                  businessType: 'front',
                  relationCode: item.cardTemplateCode
            	})
            })
            this.lastPage = res.data.obj.lastPage;
            this.pageStart = res.data.obj.pageNum;
            /*卡商品图片*/
            this.PicData(skuCodeSet);
          }
        })
      },
      //查询精品商品的价格
      queryskuprice(obj){
        let _this = this
        api.aftermarket.queryskuprice(obj, res => {
          if(res.data.code == 'success'){
            let obj = res.data.obj
            _this.skuList.forEach((item,In) => {
              if(obj[item.skuCode]){
                if(obj[item.skuCode].skuPrice >= 0) {
                  _this.$set(_this.skuList[In],'standardCost',obj[item.skuCode].skuPrice)
                }
              }
            })
          }
        })
      },
      // 获取图片LOGO
      PicData(arr) {
      	 var _this = this;
      	 if(this.skuList.length && arr.length){
      	 		  api.file.selectFileInfoByRelationCodesBatch(arr,res => {
			         	if(res.data.code == 'success'){
			         		var imgs = res.data.obj;
			         		let index = -1;
			         		_this.skuList.forEach((item, num)=>{
			         			if(!_this.isCard){ //查卡商品图片
			         				 index = imgs.findIndex(v => v.relationCode == item.cardTemplateCode );
			         			}else{//查精品商品图片
			         				 index = imgs.findIndex(v => v.relationCode == item.skuCode );
			         			}
			         			if(index != -1){
			         				_this.$set(_this.skuList[num], 'imgPath', imgs[index].fileRelativePath);
			         			}
			         		})
			         	}
		         	})
      	 }
      }
  },
};
</script>

<style lang="scss" scoped>
  .inquireHeader {
    position: fixed;
  }
  // 已选车型
  .seleCarType {
    width: 100%;
    font-size: remp(12);
		z-index: 1001;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: red;
    margin-top: rem(24);
    margin-bottom: rem(10);
  }
  .red {
    color: rgba(254, 56, 36, 0.9);
  }
  .inquireHeader {
    background: #ffffff;
    z-index: 1001;
  }
  .carType {
    height: remp(30);
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background-color: #E1F6FF;
    z-index: 1001;
  }
  .carIconPic {
    margin-left: remp(20);
    margin-right: remp(10);
    margin-top: remp(2);
  }
  .productLists {
    position: relative;
  }
  .saveDate {
    position: absolute;
    left: 60%;
    top: 65%
  }
  .leftTitle {
    padding: 0;
    margin: 0;
    flex: 1;
  }
  .no-sevice-pjl {
    padding-top: 40%;
    box-sizing: border-box;
  }
  .rightArea {
    width: 100%;
    flex: 4;
    margin-right: 12px;
    height: 30px;
    white-space: nowrap;
    overflow-x: auto;
    display: flex;
    justify-content: right;
    align-items: center;
  }
  .rightTitle {
    padding: 0;
    margin: 0;
    width: 100%;
    // height: remp(20);
  }
  .car-list {
    width: 100%;
    height: rem(30);
  }
  .board-inventory-top {
    height: auto !important;
  }
 	.aftermarket{
	 	background: #F5F5F9;
	 	font-size: remp(12);
	 	/*搜索样式*/
	 	.search-warp{
       position:relative;
	 		height:remp(50);
	 		.search-content{
	 			display: flex;
	 			justify-content: center;
		 		align-items: center;
		 		width:remp(750/2);
	 			background:#fff;
		 		height: remp(49);
		 		z-index: 1001;
		 		input::-webkit-input-placeholder{
		 			text-align: left;
		 		}
	 		}
	    .positionContainer {
	      .search-icon {
	        position: absolute;
	        top: 50%;
	        transform: translate(0, -50%);
	        color: #7E8387;
	        i {
	          font-size: remp(30);
	        }
	        span{
	        	vertical-align: super;
            font-size: remp(15);
	        }
	      }
	      .delete-icon {
	        position: absolute;
	        top: 50%;
	        right: remp(18);
	        transform: translate(0, -50%);
	        i {
	          font-size: remp(12);
	          color: #7E8387;
	        }
	      }
	      input {
	       	width: remp(345);
		 			height: remp(35);
		 			background: #F5F5F9;
					border: 1px solid #F3F3F3;
					border-radius: 5px;
					text-align: left;
					padding-left: remp(10);
					border: 1px solid #F3F3F3;
					color: #7E8387;
          font-size: remp(15);
	      }
	      input::-webkit-input-placeholder {
	        text-align: left;
	      }
	    }
	 	}
	 	/*点击切换*/
	 	.select-sort{
	 		height: remp(36);
	 		box-shadow: 0 7px 9px 0 rgba(228,228,228,0.51);
	 		background: #FFF;
      border-bottom: 1px solid #ccc;
	 		.content{
        height: remp(36);
				display: flex;
		 		width:remp(750/2);
		 		background: #fff;
		 		justify-content: center;
		 		align-items: center;
		 		z-index: 1001;
		 		.screen-box{
					background: #FFF;
          & /deep/ .screen-top {
          height: remp(40);
          border-bottom: 0px solid white;
			 		}
		 		}
	 		}
	 	}
    .product-listwrap{
      box-sizing: border-box;
      .product-list{
         height: 100%;
         margin-top: 80px;
         z-index: -1;
      }
    }
	 	 .list{
	 	 		background: none;
	 	 		margin-top: remp(50);
	 	 		li{
	 	 			width:remp(340);
	 	 			height:remp(80);
	 	 			margin:0 auto;
	 	 			box-sizing:border-box;
	 	 			margin-bottom: remp(10);
	 	 			.pic{
	 	 				img{
	 	 					width:remp(57.6);
	 	 					height:remp(57.6);
	 	 				}
	 	 			}
	 	 			display: flex;
	 	 			align-items: center;
	 	 			background: #FFF;
	 	 			border-radius: remp(4);
	 	 			box-shadow: 0 7px 9px 0 rgba(228,228,228,0.51);
	 	 			padding: 0 remp(5);
	 	 			.infos{
	  				margin-left: remp(10);
	  				padding: remp(5) remp(3);
	  				p{
	  					height:remp(20);
	  					line-height:remp(20);
	  				}
	  				p:nth-child(1){
	  					color: #333333;
              overflow: hidden;
	  				}
						p:nth-child(2){
	  					color: #7E8387;
	  				}
						p:nth-child(3){
	  					color: #FE4B39;
	  					span{
	  						font-size: 12px;
								color: #7E8387;
	  					}
	  				}
	 	 			}
	 	 		}
	 	 }

 }
 	.model-pjl{
	 	top: 0;
	    z-index: 1000;
	    background: rgba(0, 0, 0, 0.4);
	    width: 100%;
	    height: 100%;
	    position:absolute;
	 	}
</style>
