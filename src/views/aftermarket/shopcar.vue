<template>
  <div class="shopcarbox">
    <!-- 导航头部 -->
    <page-header :rightOptions="rightOptions" @on-click-right="more">
      <div slot>购物车</div>
      <div v-if="hasApprove && editable" slot="right">{{ typetitle }}</div>
    </page-header>
    <div class="shopcarlist" v-show="type">
      <ul>
        <li v-for="(item, index) in dataInfo" class="shopcar-pjl b-white" :key="index">
          <div class="textinfo">
            <div class="pic">
              <img v-if="item.avatarPath" :src="item.avatarPath" width="100%" height="auto">
              <img v-else src="../../assets/imgage/netavailable.png" width="100%" height="auto">
            </div>
            <div class="tex">
              <p class="w flex">
                <span class="w50">{{item.title}}</span>
                <span class="w50" v-show="goToWorkOrder && item.skuTypeCode != 'StoredValue'">
                    <span class="goToOrder">
                        <span class="label">
                            {{ item.constructionFlag == null ? '': (item.constructionFlag == 0 ? '需转施工': (item.constructionFlag == 1 ? '已转施工': (item.constructionFlag == 2 ? '施工完成': '')))}}
                        </span>
                    </span>
                </span>
              </p>
              <p>{{item.vender}}</p>
              <p class="w flex">
                <!--carMsrpFlag如果为1  价格置为0-->
                <span class="flex" :class="{ 'w': item.skuTypeCode == 'StoredValue', 'w8': item.skuTypeCode != 'StoredValue' }">
                    <span v-if="item.carMsrpFlag == 1" class="w50 red">
                        {{ '￥' + 0 }}
                    </span>
                    <span v-else class="w50 red">
                        {{ '￥' + Number(item.price).toFixed(2) }}
                    </span>
                    <span class="w50 small" :style="smallobj">
                        {{ item.skuTypeCode == 'StoredValue' ? '充值金额: ' + item.cardCouponOrderInfo.rechargeAmount : '原售价: ' + item.oldPrice }}
                    </span>
                </span>
                <span v-if="item.detailStatus === 0" class="w2 red">
                    <span class="pull-right prepare-sku">
                        缺货
                    </span>
                </span>
              </p>
            </div>
          </div>
          <!-- 账类 -->
          <div>
            <cell class="shopcar" :title="'账类'">
              <input disabled type="text" v-model="item.accountTypeName">
              <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
            </cell>
          </div>
        </li>
      </ul>
    </div>
    <div class="shopcarlist" v-show="!type">
      <ul>
        <li v-for="(item, index) in dataInfo" class="shopcar-pjl b-white" :key="index">
          <div class="textinfo">
            <div class="pic">
              <img v-if="item.avatarPath" :src="item.avatarPath" width="100%" height="auto">
              <img v-else src="../../assets/imgage/netavailable.png" width="100%" height="auto">
            </div>
            <!--如果item.preinstalledFlag === 1 那么为不可编辑-->
            <div class="tex">
              <p class="w flex">
                <span class="w50">{{item.title}}</span>
                <span class="w50" v-if="goToWorkOrder && item.skuTypeCode != 'StoredValue'">
                    <span v-if="item.preinstalledFlag === 0" class="goToOrder">
                        <span @click="goToOrder(index)" :class="[{ 'current': (item.constructionFlag != null) }, {'hasChoosed': (item.constructionFlag != null) }]">
                        <input type="radio" v-if="item.constructionFlag == null">
                        <b v-else><i class="icon iconfont icon-icon-gouxuan"></i></b>
                        </span>&nbsp;
                        <span class="label">
                            需转施工
                        </span>
                    </span>
                </span>
              </p>
              <p>{{item.vender}}</p>
              <p>
                <!--如果item.preinstalledFlag === 1 那么为不可编辑-->
                <span v-if="item.preinstalledFlag === 0"><input :readonly="!(item.accountTypeCode == normalSale || item.refDetailRemark == 1) || item.skuTypeCode == 'StoredValue' || envalue == '000000'" type="text" v-model="item.price" @change="priceChange(item)"></span>
                <!--carMsrpFlag如果为1  价格置为0-->
                <span v-else-if="item.carMsrpFlag == 1">&yen; 0</span>
                <span v-else>&yen; {{item.price}}</span>
                <span class="num">
                  <!--如果item.preinstalledFlag === 1 那么为不可编辑-->
                  <button v-if="item.preinstalledFlag === 0" @click="remove(item)">删除</button>
                </span>
              </p>
            </div>
          </div>
          <!-- 账类 -->
          <div>
            <cell :title="'账类'">
              <!--如果item.preinstalledFlag === 1 那么为不可编辑-->
              <input v-if="item.preinstalledFlag === 0" readonly type="text" v-model="item.accountTypeName" @click.stop="showselect(item)">
              <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
            </cell>
          </div>
        </li>
      </ul>
    </div>
    <div class="w remark">
      <remark v-if="dataInfo.length" class="shopcar-textarea" title="备注" :readonly="type" v-model="dRemark"></remark>
      <cell v-else :title="'不精品原因'">
        <input type="text" v-model="noSkuReason" readonly @click="showNoSkuReason">
        <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
      </cell>
    </div>
    <div v-if="hasApprove && editable" class="addproduct w b-white max-width">
      <div @click='submit' class="btn-primary">
        <i v-if="buttonText=='添加商品'" class="icon iconfont icon-xinzeng"></i> &ensp;{{buttonText}}
      </div>
    </div>
    <div v-if="!hasApprove && (hasApprove != null) && hasSkuPrepared" class="addproduct w b-white max-width">
      <div class="btn-default" @click="prepareOrderSku">
        {{ '备货' }}
      </div>
    </div>
    <div class="picker-pjl" v-if="pickershow">
      <mt-picker :showToolbar="true" :slots="slots" valueKey="text" @change="onValuesChange">
        <div class="clearfix picker-top-pjl">
          <mt-button @click.stop="pickerconfirm(0)" class="fl" size="small" type="primary">取消</mt-button>
          <mt-button @click.stop="pickerconfirm(1)" class="fr" size="small" type="primary">确认</mt-button>
        </div>
      </mt-picker>
    </div>
    <div class="picker-pjl" v-if="noSkuReasonShow">
      <mt-picker :showToolbar="true" :slots="noSkuReasonSlots" valueKey="text" @change="onNoSkuRessonChange">
        <div class="clearfix picker-top-pjl">
          <mt-button @click.stop="hideNoSkuReason" class="fl" size="small" type="primary">取消</mt-button>
          <mt-button @click.stop="selectNoSkuReason" class="fr" size="small" type="primary">确认</mt-button>
        </div>
      </mt-picker>
    </div>
  </div>
</template>
<script>
  import Vue from "vue";
  import PageHeader from "components/header/PageHeader";
  import remark from "@/components/remark";
  import api from "@/common/api";
  import config from "@/common/config";
  import cell from "components/cell";
  import accountlist from "components/accounttypes";
  import {
    MessageBox,
    Toast,
    Button,
    Picker
  } from "mint-ui";
  import {
    mapState,
    mapGetters,
    mapActions
  } from 'vuex';
  Vue.component(Button.name, Button);
  Vue.component(Picker.name, Picker);
  export default {
    components: {
      PageHeader,
      remark,
      cell,
      accountlist
    },
    data() {
      return {
        smallobj:{
          // color:"pink"
        },
        GroupcustomizationValue: '',
        envalue: '',
        typetitle: "编辑",
        buttonText: "添加商品",
        type: true,
        rightOptions: {
          icon: ""
        },
        dataInfo: [],
        temDataInfo: [],
        dRemark: "",
        noSkuReason: "",
        noSkuReasonCode: "",
        orderNo: null,
        pickershow: false,
        noSkuReasonShow: false,
        hasSkuPrepared: false,
        slots: [{
          flex: 1,
          values: [],
          className: "slot",
          textAlign: "center"
        }],
        noSkuReasonSlots: [{
          flex: 1,
          values: [],
          className: "slot",
          textAlign: "center"
        }],
        pickerValue: null,     //已选择的账类
        noSkuReasonValue: null,
        accountType: null,
        editable: null,
        hasApprove: null,
        normalSale: config.normalSale,
        checkCodeTest: []
      };
    },
    computed: {
      goToWorkOrder: function() {
        return (sessionStorage.getItem('constructionFlag') === 'true' ? true: false)
      },
      ...mapState('order', [
        'order'
      ]),
      ...mapGetters('order', [
        'hasNoSkuResson'
      ])
    },
    created(){
      this.getDictionaryAboutCompany()
    },
    methods: {
      // 轩宇环境判断
      getDictionaryAboutCompany() {
        let _this = this;
        api.getDataDetails({ refDetailCode: config.configOfXuanyu.refDetailCode }).then((res) => {
            if (res.data.code === 'success') {
                this.envalue = res.data.obj.refDetailValue
            }
        })
      },
      // 可编辑时不可为0
      priceChange(data){
        if( data.price == 0 || data.price == ''){ Toast('如果商品要以0元售卖，请更换为随车赠送类账类') }
      },
      more() {
        if (this.editable) {
          if (this.type) {
            if (this.dataInfo.length >= 0) {
              if (this.hasApprove) {
                //点击编辑
                this.typetitle = "取消";
                this.buttonText = "保存";
                this.type = false;
                this.temDataInfo = [];
                this.temDataInfo = JSON.parse(JSON.stringify(this.dataInfo));
                 this.dataInfo.map((item,index)=>{
                    this.checkCodeTest.forEach((tem,i)=>{
                      if(tem.accountTypeCode == item.accountTypeCode){
                          if(tem.refDetailRemark == "1"){
                              item.refDetailRemark = 1
                          }else{
                              item.refDetailRemark = 0
                          }
                      }
                      
                    })
                  })


              }
            }
          } else {
            // 点击取消
            this.typetitle = "编辑";
            this.buttonText = "添加商品";
            this.type = true;
            this.dataInfo = this.temDataInfo
          }
        } else {
          Toast("SM不可操作");
        }
      },
      remove(item) {
        let combinationDetailCode = ''
        combinationDetailCode = item.catlogNameLevel3 === '组合商品' ? item.combinationDetailCode : ''
        MessageBox.confirm("确定执行此操作?").then(
          action => {
            // 点击确认
            api.aftermarket.deleteshopcar(
              [{
                skuOrderDetailCode: item.skuOrderDetailCode,
                orderNo: this.$route.params.orderNo,
                skuCode: item.skuCode,
                skuOrderNo: item.skuOrderNo,
                actualSalesPrice: item.price || 0,
                skuTypeCode: item.skuTypeCode,
                combinationDetailCode: item.combinationDetailCod,
                catlogCodeLevel3: item.catlogCodeLevel3,
                catlogNameLevel3: item.catlogNameLevel3,
                combinationDetailCode: combinationDetailCode
              }],
              msg => {
                if (msg.data.message == "success") {
                  Toast("删除成功");
                  for (let i = 0; i < this.dataInfo.length; i++) {
                    if (this.dataInfo[i] == item) {
                      this.dataInfo.splice(i, 1);
                      if (this.dataInfo.length === 0) {
                        this.dRemark = "";
                        this.buttonText = "添加商品";
                        this.type = true;
                        this.typetitle = "编辑";
                      }
                    }
                  }
                } else {
                  Toast("删除失败");
                }
              }
            );
          },
          action => {
            // 点击取消
          }
        );
      },
      submit() {
        if (this.type) {
          //跳转
          this.$router.push({
            path: `/aftermarket/${this.orderNo}/${config.orderFlag}`
          });
        } else {
          let params = [];
          let noSkuReasonParams = {}
          for (let i = 0; i < this.dataInfo.length; i++) {
            params.push({
              rechargeAmount: this.dataInfo[i].cardCouponOrderInfo ? this.dataInfo[i].cardCouponOrderInfo.rechargeAmount: 0,
              actualSalesPrice: this.dataInfo[i].price || 0,
              skuOrderNo: this.dataInfo[i].skuOrderNo,
              orderNo: this.$route.params.orderNo,
              skuOrderDetailCode: this.dataInfo[i].skuOrderDetailCode,
              skuCode: this.dataInfo[i].skuCode,
              skuTypeCode: this.dataInfo[i].skuTypeCode,
              accountTypeCode: this.dataInfo[i].accountTypeCode,
              remark: this.dRemark,
              combinationDetailCode: this.dataInfo[i].combinationDetailCode,
              combinationCode: this.dataInfo[i].combinationCode,
              refDetailRemark: this.dataInfo[i].refDetailRemark
            });
          }
          if (params.length > 0) {

              let test = true
              params.map((item,index) => {
                if(Number(item.actualSalesPrice) == 0){
                  if(item.refDetailRemark == 1 || item.accountTypeCode == 'normalSale'){
                      Toast('如果商品要以0元售卖，请更换为随车赠送类账类')
                      test = false
                  }
                }
                    
              })
             
              if(test){
                api.aftermarket.updatashopcar(params, msg => {
                  if (msg.data.message == "success") {
                    Toast("保存成功");
                    this.typetitle = "编辑";
                    this.buttonText = "添加商品";
                    this.type = true;
                    if (this.hasNoSkuResson) {
                      noSkuReasonParams = {
                        id: this.order.noSkuReasonId,
                        sourceOrderNo: this.$route.params.orderNo,
                        addCode: 'noSkuReason',
                        addValue:  this.noSkuReasonCode,
                        isDeleted: '1'
                      }
                      api.clearingsettlement
                        .order
                        .editOrderAddInfoVo(noSkuReasonParams, (res) => {
                          if (res.data.code === 'success') {
                            this.queryOrderInfoVosByCodeFromDB({
                              orderNo: this.$route.params.orderNo,
                              allSubOrderFlag: true
                            })
                          }
                        })
                    }
                  } else {
                    Toast("保存失败");
                  }
                })

              }
            
          } else if (params.length == 0 && this.noSkuReason) {
            if (this.hasNoSkuResson) {
              noSkuReasonParams = {
                id: this.order.noSkuReasonId,
                sourceOrderNo: this.$route.params.orderNo,
                addCode: 'noSkuReason',
                addValue:  this.noSkuReasonCode
              }
            } else {
              noSkuReasonParams = {
                sourceOrderNo: this.$route.params.orderNo,
                addCode: 'noSkuReason',
                addValue:  this.noSkuReasonCode
              }
            }
            api.clearingsettlement
              .order
              .editOrderAddInfoVo(noSkuReasonParams, (res) => {
                if (res.data.code === 'success') {
                  Toast("保存成功");
                  this.typetitle = "编辑";
                  this.buttonText = "添加商品";
                  this.type = true;
                  this.queryOrderInfoVosByCodeFromDB({
                    orderNo: this.$route.params.orderNo,
                    allSubOrderFlag: true
                  })
                }
              })
          }
        }
      },
      // 账类弹窗的滚动选择事件
      onValuesChange(picker, value) {
        this.pickerValue = value[0];
      },
      // 点击确认账类选择
      pickerconfirm(type) {
        if (type) {
          //确认
          if (this.pickerValue) {
            if (!(this.pickerValue.cleanPrice == '1')) {
              //非正常销售账类
              this.accountType.price = 0;
            } else {
              this.accountType.price = this.accountType.oldPrice || 0;
            }
            this.accountType.accountTypeCode = this.pickerValue.value;
            this.accountType.accountTypeName = this.pickerValue.text;
            this.accountType.refDetailRemark = this.pickerValue.refDetailRemark;
          }
          this.pickershow = false;
        } else {
          //取消
          this.pickershow = false;
        }
      },
      showselect(item) {
        let array = this.slots[0].values;    //从数据字典中请求到的已整合过的账类数据
        for (let i = 0; i < array.length; i++) {
          if (array[i].value == item.accountTypeCode) {
            this.slots[0].value = array[i];
            this.slots[0].defaultIndex = i;
            item.refDetailRemark = array[i].refDetailRemark
            this.pickershow = true;
          }
        }
        this.accountType = item;
      },
      onNoSkuRessonChange(picker, value) {
        this.noSkuReasonValue = value[0];
      },
      showNoSkuReason() {
        let _this = this
        if (_this.editable && !_this.type) {
          _this.$data.noSkuReasonShow = true
        }
      },
      hideNoSkuReason() {
        let _this = this
        _this.$data.noSkuReasonShow = false
      },
      selectNoSkuReason() {
        let _this = this
        _this.noSkuReason = _this.noSkuReasonValue.text
        _this.noSkuReasonCode = _this.noSkuReasonValue.value
        _this.$data.noSkuReasonShow = false
      },
      queryshopcar() {
        let skuCodeSet = []
        let _this = this
        api.aftermarket.queryshopcar({
            pageSize: "",
            pageNums: 100,
            orderNo: this.orderNo
          },
          msg => {
            if (msg.data.message == "success") {
              let data = msg.data.obj.list;
              for (let i = 0; i < data.length; i++) {
                this.dRemark = data[i].remark;
                if (data[i].combinationCode && data[i].combinationCode != '') {
                  let list = data[i].list
                  let detailStatus = 1
                  list.forEach((item) => {
                    if (item.detailStatus === 0) {
                      detailStatus = 0
                    }
                  })
                  data[i].detailStatus = detailStatus
                } else if (data[i].cardCouponOrderInfoVo) {
                  skuCodeSet.push({
                    businessType: 'front',
                    relationCode: data[i].skuCode
                  })
                } else {
                  skuCodeSet.push({
                    relationCode: data[i].skuCode
                  })
                }
                if (data[i].detailStatus === 0) {
                  this.hasSkuPrepared = true
                }
                this.$set(this.dataInfo, i, {
                  id: data[i].id,
                  skuOrderNo: data[i].skuOrderNo,
                  skuOrderDetailCode: data[i].skuOrderDetailCode,
                  skuCode: data[i].skuCode,
                  skuTypeCode: data[i].skuTypeCode,
                  combinationCode: data[i].combinationCode,
                  title: data[i].combinationName || data[i].skuName,
                  vender: data[i].brandName,
                  price: data[i].actualSalesPrice || 0,
                  list: data[i].list,
                  accountTypeName: data[i].accountTypeName,
                  accountTypeCode: data[i].accountTypeCode,
                  combinationDetailCode: data[i].combinationDetailCode,
                  oldPrice: data[i].originalSalesPrice,
                  detailStatus: data[i].detailStatus,
                  constructionFlag: data[i].constructionFlag,
                  carMsrpFlag: data[i].carMsrpFlag, //判断是否是计入Msrp 用于价格变动 如果为1  价格置为0
                  preinstalledFlag: data[i].preinstalledFlag ? data[i].preinstalledFlag: 0, //新增属性，用于判断该精品商品是不是预装的 0 为是 1为不是，值为1时不可编辑
                  cardCouponOrderInfo: data[i].cardCouponOrderInfoVo,
                  catlogCodeLevel3: data[i].catlogCodeLevel3,
                  catlogNameLevel3: data[i].catlogNameLevel3
                });
              }
              if (skuCodeSet.length > 0) {
                api.file
                  .selectFileInfoByRelationCodesBatch(skuCodeSet, (res) => {
                    if (res.data.code === 'success') {
                      let fileInfos = res.data.obj
                      for (let i = 0; i < _this.dataInfo.length; i++) {
                        let index = fileInfos.findIndex((fileInfo) => {
                          return (fileInfo.relationCode === _this.dataInfo[i].skuCode)
                        })
                        if (index >= 0) {
                          this.$set(this.dataInfo, i, {
                            id: data[i].id,
                            skuOrderNo: data[i].skuOrderNo,
                            skuOrderDetailCode: data[i].skuOrderDetailCode,
                            skuCode: data[i].skuCode,
                            skuTypeCode: data[i].skuTypeCode,
                            combinationCode: data[i].combinationCode,
                            title: data[i].combinationName || data[i].skuName,
                            vender: data[i].brandName,
                            price: data[i].actualSalesPrice || 0,
                            list: data[i].list,
                            accountTypeName: data[i].accountTypeName,
                            accountTypeCode: data[i].accountTypeCode,
                            combinationDetailCode: data[i].combinationDetailCode,
                            oldPrice: data[i].originalSalesPrice,
                            detailStatus: data[i].detailStatus,
                            constructionFlag: data[i].constructionFlag,
                            preinstalledFlag: data[i].preinstalledFlag ? data[i].preinstalledFlag: 0, //新增属性，用于判断该精品商品是不是预装的 0 为是 1为不是，值为1时不可编辑
                            carMsrpFlag: data[i].carMsrpFlag, //判断是否是计入Msrp 用于价格变动 如果为1  价格置为0
                            avatarPath: fileInfos[index].fileRelativePath,
                            cardCouponOrderInfo: data[i].cardCouponOrderInfoVo,
                            catlogCodeLevel3: data[i].catlogCodeLevel3,
                            catlogNameLevel3: data[i].catlogNameLevel3
                          });
                         
                        } else {
                          this.$set(this.dataInfo, i, {
                            id: data[i].id,
                            skuOrderNo: data[i].skuOrderNo,
                            skuOrderDetailCode: data[i].skuOrderDetailCode,
                            skuCode: data[i].skuCode,
                            skuTypeCode: data[i].skuTypeCode,
                            combinationCode: data[i].combinationCode,
                            title: data[i].combinationName || data[i].skuName,
                            vender: data[i].brandName,
                            price: data[i].actualSalesPrice || 0,
                            list: data[i].list,
                            accountTypeName: data[i].accountTypeName,
                            accountTypeCode: data[i].accountTypeCode,
                            combinationDetailCode: data[i].combinationDetailCode,
                            oldPrice: data[i].originalSalesPrice,
                            detailStatus: data[i].detailStatus,
                            constructionFlag: data[i].constructionFlag,
                            preinstalledFlag: data[i].preinstalledFlag ? data[i].preinstalledFlag: 0, //新增属性，用于判断该精品商品是不是预装的 0 为是 1为不是，值为1时不可编辑
                            carMsrpFlag: data[i].carMsrpFlag, //判断是否是计入Msrp 用于价格变动 如果为1  价格置为0
                            avatarPath: '',
                            cardCouponOrderInfo: data[i].cardCouponOrderInfoVo,
                            catlogCodeLevel3: data[i].catlogCodeLevel3,
                            catlogNameLevel3: data[i].catlogNameLevel3
                          });
                          
                        }
                      }
                      


                    }
                  })
              }
            }
          }
        );
      },
      prepareOrderSku() {
        let _this = this
        api.clearingsettlement
          .ordersku
          .prepareOrderSkuByOrderNo({
            orderNo: _this.orderNo
          }, (res) => {
            if (res.data.code == "success") {
              Toast(res.data.message)
              _this.hasSkuPrepared = false
              _this.queryshopcar()
            }
          })
      },
      goToOrder(index) {
        let _this = this
        if (_this.dataInfo[index].constructionFlag == null) {
          let skuInfo =  _this.dataInfo[index]
          let skuOrderIds = []
          if (skuInfo.combinationCode && skuInfo.combinationCode != '') {
              skuInfo.list.forEach((item) => {
                  skuOrderIds.push({
                      skuOrderId: item.id
                  })
              })
          } else {
              skuOrderIds.push({
                  skuOrderId: skuInfo.id
              })
          }
          api.clearingsettlement
            .skuBookOrder
            .insert(skuOrderIds, (res) => {
              if (res.data.code === 'success') {
                _this.queryshopcar()
              }
            })
        }
      },
      ...mapActions('order', [
        'queryOrderInfoVosByCodeFromDB'
      ])
    },
    mounted() {
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
      api.clearingsettlement.order.queryOrderInfoVosByCodeFromDB({
          orderNo: this.$route.params.orderNo,
          allSubOrderFlag: true
        },
        res => {
          if (res.data.code === "success") {
            if (res.data.obj.carOrderInfoVoList[0].wfStatus == -1) {
              this.hasApprove = true;
            } else {
              this.hasApprove = false
            }
          }
        }
      );
      this.orderNo = this.$route.params.orderNo;
      this.queryshopcar();
      this.$nextTick(function() {
        document.addEventListener("click", () => {
          this.pickershow = false;
        });
      });
      api.ref.getDataDictionary({
          refCode: config.ref.accountType
        },
        res => {
          if (res.data.code == "success") {
            let data = (res.data.obj && res.data.obj.referenceDetailInfos) || [];
            for (let i = 0; i < data.length; i++) {
              this.checkCodeTest.push({
                refDetailRemark: data[i].refDetailRemark,
                accountTypeCode: data[i].refDetailCode
              })
              
              this.$set(this.slots[0].values, i, {
                text: data[i].refDetailName,
                value: data[i].refDetailCode,
                cleanPrice: JSON.parse(data[i].refDetailValue).cleanPrice,
                refDetailRemark: Number(data[i].refDetailRemark)
              });
            }
           
          }
        }
      );
      api.ref.getDataDictionary({
          refCode: config.ref.noSkuReason
        },
        res => {
          if (res.data.code == "success") {
            let data = (res.data.obj && res.data.obj.referenceDetailInfos) || [];
            for (let i = 0; i < data.length; i++) {
              this.$set(this.noSkuReasonSlots[0].values, i, {
                text: data[i].refDetailName,
                value: data[i].refDetailCode
              });
            }
          }
        }
      );
      if (this.hasNoSkuResson) {
        this.noSkuReason = this.order.noSkuReasonName
        this.noSkuReasonCode = this.order.noSkuReasonCode
      }
    }
  };
</script>
<style lang="scss" scoped>
  .picker-pjl {
    position: fixed;
    -webkit-transform: translateZ(0);
    width: 100%;
    height: remp(200);
    overflow: hidden;
    bottom: 0;
    left: 0;
    background-color: #fff;
  }
  .shopcarbox {
    padding-bottom: remp(45);
  }
  .editshopcar {
    height: remp(59);
    position: relative;
    padding: remp(13.5) remp(0) remp(15.5) remp(0);
  }
  .editshopcar .rado {
    float: left;
    width: remp(43);
    height: remp(59);
    position: relative;
  }
  .editshopcar .rado input {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .editshopcar .pic {
    float: left;
    width: remp(60);
    height: remp(59);
    margin-right: remp(10);
    overflow: hidden;
  }
  .editshopcar .editbtn {
    float: left;
    padding: remp(4) remp(0) remp(3) remp(0);
  }
  .editshopcar .editbtn p {
    width: remp(200);
    height: remp(20);
    font-size: remp(10);
    text-align: center;
    line-height: remp(20);
    color: rgb(51, 51, 51);
    border: 1px solid rgb(189, 199, 200);
    margin-bottom: remp(12);
  }
  .editshopcar .editbtn .ressel div:first-child {
    float: left;
    height: remp(20);
    width: remp(20);
    line-height: remp(9);
    text-align: center;
    border: 1px solid rgb(189, 199, 200);
    position: relative;
  }
  .ressel div:first-child>i {
    display: inline-block;
    width: remp(12);
    border: 1px solid rgb(189, 199, 200);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  .ressel div:nth-child(2) {
    float: left;
    height: remp(20);
    width: remp(140);
    font-size: remp(10);
    line-height: remp(20);
    text-align: center;
    border: 1px solid rgb(189, 199, 200);
    margin: 0 remp(10);
  }
  .ressel div:last-child {
    float: left;
    height: remp(20);
    width: remp(20);
    text-align: center;
    line-height: remp(20);
    border: 1px solid rgb(189, 199, 200);
    position: relative;
  }
  .ressel div:last-child>i {
    font-size: remp(12);
    color: rgb(189, 199, 200);
  }
  .remark {
    border-bottom: remp(10) solid #efefef;
  }
  .shopcarlist>ul>li>.textinfo {
    padding: remp(13.5) remp(0) remp(15.5) remp(86.5);
    position: relative;
    border-bottom: 1px solid #efefef;
  }
  .shopcarlist>ul>li:last-child {
    border: none;
  }
  .shopcarlist .pic {
    position: absolute;
    top: remp(13.5);
    left: remp(16.5);
    width: remp(60);
    height: remp(59);
  }
  .shopcarlist .tex {
    height: remp(59);
  }
  .shopcarlist .tex>p:first-child {
    height: remp(15);
    line-height: remp(15);
    font-size: remp(13);
    color: rgb(51, 51, 51);
    font-weight: 600;
    span:first-child {
      overflow: hidden;
      text-overflow:ellipsis;
      white-space: nowrap;
    }
  }
  .shopcarlist .tex>p:nth-child(2) {
    height: remp(14);
    line-height: remp(12);
    color: rgb(51, 51, 51);
    font-size: remp(12);
    margin: remp(4.5) remp(0) remp(10) remp(0);
  }
  .shopcarlist .tex>p:nth-child(3) {
    height: remp(14);
    line-height: remp(14);
    font-size: remp(9);
    color: rgb(126, 131, 135);
  }
  .shopcarlist .tex>p:nth-child(3)>span {
    margin-right: remp(10);
    font-size: remp(15);
  }
  .small {
    font-size: remp(10) !important;
  }
  .shopcarlist .tex>p:nth-child(3)>span>input {
    background-color: #f0f2f5;
    width: remp(100);
    text-align: center;
  }
  .shopcarlist .tex>p:nth-child(3) .num {
    display: inline-block;
    width: remp(60);
    height: remp(22);
    font-size: remp(12);
    color: rgb(51, 51, 51);
    float: right;
  }
  .addproduct {
    position: fixed;
    -webkit-transform: translateZ(0);
    bottom: 0;
    padding: remp(3) 0;
  }
  .addproduct .btn-primary {
    height: remp(39);
    font-size: remp(14);
    font-weight: 600;
    line-height: remp(39);
    text-align: center;
    color: #fff;
    margin-right: remp(9.5);
    margin-left: remp(10.5);
    border-radius: remp(6);
    background-color: rgb(54, 172, 254);
  }
  .addproduct .btn-default {
    height: remp(39);
    font-size: remp(14);
    font-weight: 600;
    line-height: remp(39);
    text-align: center;
    color: #333;
    margin-right: remp(9.5);
    margin-left: remp(10.5);
    border-radius: remp(6);
    border: solid 1px #333;
  }
  .num>button {
    position: absolute;
    right: 0.2rem;
    bottom: 0.19rem;
    border-style: none;
    background-color: #fff;
    width: 0.6rem;
    height: 0.22rem;
    line-height: 0.2rem;
    font-size: 0.12rem;
    font-weight: 600;
    color: rgba(254, 56, 36, 0.9);
    border: 1px solid rgba(254, 56, 36, 0.9);
  }
  .shopcar-pjl {
    margin-bottom: remp(10);
  }
  .shopcar input {
    background-color: #fff;
  }
  .picker-top-pjl {
    background-color: #26a2ff;
  }
  .shopcarlist input {
    background-color: #fff;
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
  .shopcar-textarea textarea {
    width: 3rem;
  }
  .red {
    color: rgba(254, 56, 36, 0.9);
    margin-right: 0.1rem;
  }
  .prepare-sku {
    margin-right: rem(20);
  }
  .goToOrder {
    margin-right: 0.2rem;
    float: right;
  }
  .goToOrder .label {
    color: #008cee;
    line-height: remp(16);
    font-size: remp(15);
  }
  .current i {
    color: rgb(54, 172, 254) !important;
  }
</style>
