<template>
  <!--
  leadType判断源自于路由，新增线索的入口有3个地方
  1.从首页今日接待进入，今日接待列表
  2.从客户中心内的新增线索
  3.从客户详情内左上方的推荐客户
  -->
  <div>
    <div v-if="!active">
      <pageheader @on-click-back="goBack" :leftOptions="leftOptions">
        <div slot>
          个人资料
        </div>
      </pageheader>
      <transition name="fade">
        <div class="tost animated" :class="{bounceInDown:tost}" v-if="tost">
          {{tost}}
        </div>
      </transition>
      <div>
        <cell title="姓名">
          <input type="text" v-model="params.customName" placeholder="请输入客户姓名">
        </cell>
        <live-select v-model="params.customGender" :selectData="selectData"></live-select>
        <cell title="联系电话" :triangle="true">
          <input type="tel" maxlength="11" v-model="params.mobilePhone" @blur="checkMobile(params.mobilePhone)" placeholder="请输入联系电话">
        </cell>
        <cell title="意向级别">
          <input type="text" onfocus="this.blur();" v-model="levename" @click.stop="clickpickershow" placeholder="请选择意向级别">
          <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
        </cell>
        <cell title="意向车">
          <input @click="tourl" onfocus="this.blur();" v-model="carName" type="text" placeholder="请选择意向车">
          <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
        </cell>
      </div>
      <div class="submit">
        <mt-button size="large" @click="submit" type="primary">保存</mt-button>
      </div>
      <div class="picker-alternate-pjl"></div>
      <div class="listmodel" v-if="pickershow">
        <div class="picker-pjl">
          <mt-picker :showToolbar="true" :slots="slots" valueKey="name" @change="onValuesChange">
            <div class="clearfix picker-top-pjl">
              <mt-button @click.stop="pickerconfirm(0)" class="fl" size="small" type="primary">取消</mt-button>
              <mt-button @click.stop="pickerconfirm(1)" class="fr" size="small" type="primary">确认</mt-button>
            </div>
          </mt-picker>
        </div>
      </div>
    </div>
    <div v-if="active">
      <likevehicle @revert="revert" ensuredispaly="carstyle" title="意向车型" @confirm="confirm"></likevehicle>
    </div>
  </div>
</template>

<script>
  import cell from "@/components/cell";
  import liveSelect from "@/components/select";
  import pageheader from "@/components//header/PageHeader";
  import likevehicle from '@/components/likevehicle/likevehicle';
  import api from "@/common/api.js";
  import config from "@/common/config.js";
  import common from "@/common/common.js";
  import Vue from "vue";
  import SelectItem from "components/select-item/select-item";
  import VAddinfo from './addInfo'
  import {
    Button,
    Picker,
    Toast
  } from "mint-ui";
  Vue.component(Button.name, Button);
  Vue.component(Picker.name, Picker);
  import {
    mapMutations
  } from "vuex";
  export default {
    data() {
      return {
        leftOptions: {
          showBack: true,
          preventGoBack: true,
          icon: ""
        },
        id: '',
        menulist: [],
        tost: "",
        params: {
          customName: "",
          mobilePhone: "",
          intentionLevelCode: "",
          leadCode: "",
          channelCode: "",
          customCode: "",
          customGender: 1,
          recommendLeadCode: "",
          leadType: 1 //原1
        },
        slots: [{
          flex: 1,
          values: [],
          className: "slot",
          textAlign: "center"
        }],
        levelList: [],
        pickershow: false,
        levename: "",
        active: false,
        carName: "",
        carInfo: null,
        selectData: [{
            value: 0,
            text: "女"
          },
          {
            value: 1,
            text: "男"
          }
        ],
        idtype: [],
        idtypename: "",
        level: [],
        pickerValue: null,
        apiSeekHelp: {},
        empCode: "",
        availablePhoneNumber: false,
        oldCarInfo: null,
        // carInfo: {
        //   carbranddata: {},
        //   cartraindata: {},
        //   cartypedata: {},
        //   carstyledata: {}
        // },
        isSelectCar: false,
      };
    },
    created() {
      this.initPage()
    },
    methods: {
      goBack() {
        setTimeout(() => {
          this.$router ? this.$router.back() : window.history.back()
        }, 500);
      },
      initPage() {
        const receptionCode = this.$route.params.leadCode.split(':')[1]
        const params = {
          receptionCode
        }
        if (!receptionCode) return
        api.mainInfo.querySalesLeadIntentionCarInfoList(params, res => {
          if (res && res.data.code == 'success') {
            const list = res.data.obj || []
            if (list != '') {
              this.carName = list[0].carName
              this.id = list[0].id
              this.carInfo.carbranddata.brandCode = list[0].brandCode
              this.carInfo.cartraindata.seriesCode = list[0].seriesCode
              this.carInfo.cartypedata.modelCode = list[0].modelCode
              this.carInfo.carstyledata.carCode = list[0].carCode
              this.isSelectCar = true
            }
          }
        })
      },
      checkMobile(val) {
        if (!val) return
        if (common.validatePhone(val)) {
          api.checkAndEditLeadsInfo({
              mobilePhone: this.params.mobilePhone,
              storeCode: this.apiSeekHelp.storeCode,
              receptionCode: this.params.receptionCode
            },
            msg => {
              if (msg.data.message == "success") {
                let data = msg.data.obj;
                if (data.salesLeadsInfoVo) {
                  if (data.salesLeadsInfoVo.defeatStatus == 1) {
                    this.params.customName = data.salesLeadsInfoVo.customName;
                    this.availablePhoneNumber = true;
                    this.params.customCode = data.salesLeadsInfoVo.customCode;
                  } else {
                    if (this.empCode == data.salesLeadsInfoVo.scCode) {
                      Toast(`该联系电话已存在线索`);
                      setTimeout(() => {
                        this.$router.push({
                          path: `/customer-detail/${data.salesLeadsInfoVo.leadCode}/${config.customerFlag}`
                        });
                      }, 500);
                    } else {
                      if (data.salesLeadsInfoVo.scCode) {
                        this.params.customName = data.salesLeadsInfoVo.customName;
                        Toast(
                          `该客户在${data.salesLeadsInfoVo.scName}名下，请线下联系`
                        );
                      } else {
                        this.params.customName = data.salesLeadsInfoVo.customName;
                        this.params.leadCode = data.salesLeadsInfoVo.leadCode;
                        this.availablePhoneNumber = true;
                        this.params.id = data.salesLeadsInfoVo.id;
                        this.params.channelCode = data.salesLeadsInfoVo.channelCode;
                        this.params.sourceCode = data.salesLeadsInfoVo.sourceCode;
                        this.params.intentionLevelCode = data.salesLeadsInfoVo.intentionLevelCode;
                        this.params.customCode = data.salesLeadsInfoVo.customCode;
                        this.params.recommendLeadCode = data.salesLeadsInfoVo.recommendLeadCode;
                        let carInfo = data.salesLeadsInfoVo.intentionCarInfoVos[0] || {}
                        this.levename = data.salesLeadsInfoVo.intentionLevelName
                        this.carName = (data.salesLeadsInfoVo.intentionCarInfoVos[0] ? data.salesLeadsInfoVo.intentionCarInfoVos[0].carName : '')
                        this.oldCarInfo = [{
                          intentionCarCode: carInfo.intentionCarCode,
                          id: carInfo.id,
                          leadCode: this.params.leadCode,
                          brandCode: carInfo.brandCode,
                          seriesCode: carInfo.seriesCode,
                          modelCode: carInfo.modelCode,
                          carCode: carInfo.carCode,
                          factoryCode: carInfo.factoryCode
                        }]
                      }
                    }
                  }
                } else if (data.customInfoVo) {
                  this.params.customName = data.customInfoVo.customName;
                  this.availablePhoneNumber = true;
                  this.params.customCode = data.customInfoVo.customCode;
                } else {
                  this.availablePhoneNumber = true;
                  this.params.customCode = ''
                }
              }
            }
          );
        } else {
          Toast('联系电话填写错误');
        }
      },
      submit() {
        // 意向车为必填项
        // 姓名 电话 意向级别 都为空时 => redirectTo 客户详情
        // 姓名 电话 意向级别 都不为空 => redirectTo 今日接待列表
        // 否则 => 提示信息补全
        const isEmpty = this.params.customName || this.params.mobilePhone || this.levename
        const isAll = this.params.customName && this.params.mobilePhone && this.levename
        const receptionCode = this.$route.params.leadCode.split(':')[1]
        if (this.params.mobilePhone && !common.isTel(this.params.mobilePhone)) {
          Toast("联系电话填写错误");
          return;
        }
        if (!this.params.customName && !receptionCode) {
          Toast('请补全姓名')
          return
        }
        if (!this.params.mobilePhone && !receptionCode) {
          Toast('请补全联系电话')
          return
        }
        if (!this.levename && !receptionCode) {
          Toast('请补全意向级别')
          return
        }
        if (isEmpty && !isAll && receptionCode) {
          Toast("请补全信息")
          return
        }
        if (!this.isSelectCar && !this.oldCarInfo) {
          Toast("意向车不能为空");
          return;
        }
        if (!isEmpty) {
          api.ordinalInfo.getSequence(config.carSequence, msg => {
            if (msg && msg.data.code == 'success' && this.carInfo) {
              const params = [{
                intentionCarCode: msg.data.obj,
                leadCode: this.params.leadCode,
                brandCode: this.carInfo.carbranddata.brandCode,
                seriesCode: this.carInfo.cartraindata.seriesCode,
                modelCode: this.carInfo.cartypedata.modelCode,
                carCode: this.carInfo.carstyledata.carCode,
                factoryCode: (this.carInfo.factorydata ? this.carInfo.factorydata.factoryCode : ''),
                receptionCode: this.$route.params.leadCode.split(':')[1]
              }]
              if (this.id) params[0].id = this.id
              api.likevehicle(params, res => {
                if (res && res.data.code == 'success') {
                  this.$router.push({
                    path: '/passenger/homepage'
                  })
                }
              })
            }
          })
          return
        }
        if (isAll && this.availablePhoneNumber) {
          //leadType等于2时为推荐客户，从推荐客户入口进入
          //leadType判断源自于路由，新增线索的入口有3个地方
          //1.从首页今日接待进入，今日接待列表
          //2.从客户中心内的新增线索
          //3.从客户详情内左上方的推荐客户
          if (this.$route.params.leadCode.length > 1 && this.$route.params.leadCode.indexOf('normal') < 0) {
            this.params.leadType = 2;
          }
          api.clue.addclue(this.params, msg => {
            if (msg.data.message == "success") {
              let carcode = this.carCode;
              api.ordinalInfo.getSequence(config.carSequence, msg => {
                if (msg.data.message == "success") {
                  if (this.carInfo) {
                    api.likevehicle(
                      [{
                        intentionCarCode: msg.data.obj,
                        leadCode: this.params.leadCode,
                        brandCode: this.carInfo.carbranddata.brandCode,
                        seriesCode: this.carInfo.cartraindata.seriesCode,
                        modelCode: this.carInfo.cartypedata.modelCode,
                        carCode: this.carInfo.carstyledata.carCode,
                        factoryCode: (this.carInfo.factorydata ? this.carInfo.factorydata.factoryCode : '')
                      }],
                      msg => {
                        if (msg.data.message == "success") {
                          Toast("操作成功");
                          setTimeout(() => {
                            // add by lwx on 2018/01/12
                            this.setCurrentTabIndex(0);
                            this.setCurrentTabContent("clueinfo");
                            this.$router.push({
                              path: `/customer-detail/${this.params.leadCode}/${config.customerFlag}`
                            });
                          }, 500);
                        }
                      }
                    );
                  } else if (this.oldCarInfo) {
                    api.likevehicle(this.oldCarInfo,
                      msg => {
                        if (msg.data.message == "success") {
                          Toast("操作成功");
                          setTimeout(() => {
                            // add by lwx on 2018/01/12
                            this.setCurrentTabIndex(0);
                            this.setCurrentTabContent("clueinfo");
                            this.$router.push({
                              path: `/customer-detail/${this.params.leadCode}/${config.customerFlag}`
                            });
                          }, 500);
                        }
                      }
                    );
                  }
                }
              });
            }
          });
        }
      },
      onValuesChange(picker, value) {
        this.pickerValue = value[0];
      },
      getDataDictionary(code, obj, callback) {
        api.ref.getDataDictionary({
            refCode: code
          },
          msg => {
            if (msg.data.message == "success") {
              let data = msg.data.obj.referenceDetailInfos;
              for (let index = 0; index < data.length; index++) {
                this.$set(obj, index, {
                  code: data[index].refDetailCode,
                  name: data[index].refDetailName,
                  type: code
                });
              }
            }
          }
        );
      },
      tourl() {
        this.active = true;
      },
      revert() {
        this.active = false;
      },
      confirm(item) {
        this.carInfo = item;
        this.isSelectCar = true
        this.carName =
          item.carbranddata.brandName +
          "  " +
          item.cartraindata.seriesName +
          "  " +
          item.cartypedata.modelName +
          "  " +
          item.carstyledata.unionName;
        this.active = false;
      },
      pickerconfirm(type) {
        if (type) {
          //确认
          if (this.pickerValue) {
            if (this.pickerValue.type === config.custom.like) {
              //意向级别
              this.params.intentionLevelCode = this.pickerValue.code;
              this.slots[0].value = this.pickerValue;
              this.levename = this.pickerValue.name;
            }
          }
          this.pickershow = false;
        } else {
          //取消
          this.pickershow = false;
        }
      },
      clickpickershow() {
        this.slots[0].values = this.level;
        this.pickershow = true;
      },
      // add by lwx on 2018/01/12
      ...mapMutations({
        setCurrentTabIndex: "customer/SET_CURRENT_TAB_INDEX",
        setCurrentTabContent: "customer/SET_CURRENT_TAB_CONTENT"
      })
    },
    mounted() {
      api.getUserInfo.getLoginInfo(msg => {
        if (msg.data.message == "success") {
          this.empCode = msg.data.obj.empVo.empCode;
        }
      });
      api.ref.getDataDictionary({
          refCode: config.custom.like
        },
        msg => {
          if (msg.data.message == "success") {
            let data = msg.data.obj.referenceDetailInfos;
            for (let index = 0; index < data.length; index++) {
              this.$set(this.level, index, {
                code: data[index].refDetailCode,
                name: data[index].refDetailName,
                type: config.custom.like,
                charCode: data[index].refDetailName.substring(0, 1).charCodeAt()
              });
            }
            this.level.sort(common._sort("charCode"));
          }
        }
      );
      api.getUserInfo.getUserAvailableInfo(msg => {
        if (msg.data.message == "success") {
          let data = msg.data.obj.storeInfoVo;
          this.apiSeekHelp.storeCode = data.storeCode;
        }
      });
      api.ordinalInfo.getSequence(config.slueCode.serverCode, msg => {
        if (msg.data.message == "success") {
          this.params.leadCode = msg.data.obj;
        }
      });
      api.ordinalInfo.getSequence(config.customSequence, msg => {
        if (msg.data.message == "success") {
          this.params.customCode = msg.data.obj;
        }
      });
      this.params.customType = config.customType;
      this.$nextTick(function() {
        document.addEventListener("click", () => {
          this.pickershow = false;
        });
      });
      if (this.$route.params.leadCode == 0) {
        //主动集客
        this.params.scCustomerType = this.$route.params.leadCode;
        this.params.channelCode = config.canal.initiative;
        this.params.sourceCode = config.source.LeadsSourceClassifySCExtension;
      } else if (this.$route.params.leadCode == 1) {
        this.params.scCustomerType = this.$route.params.leadCode;
        this.params.sourceCode = config.source.LeadsSourceClassifyExhibitionHall;
        this.params.channelCode = config.canal.comeloose;
      } else if (this.$route.params.leadCode.indexOf("normal") >= 0) {
        //散客
        this.params.receptionCode =
          this.$route.params.leadCode.split(":")[1] || "";
        this.params.channelCode = config.canal.comeloose;
        this.params.sourceCode = config.source.LeadsSourceClassifyExhibitionHall;
        this.params.inStoreFlag = 1;
      } else {
        this.params.channelCode = config.canal.recommend;
        this.params.recommendLeadCode = this.$route.params.leadCode;
        this.params.sourceCode = config.source.LeadsChannelRecommend;
      }
    },
    components: {
      cell,
      liveSelect,
      pageheader,
      likevehicle,
      SelectItem,
      VAddinfo
    }
  };
</script>

<style lang="scss">
  .submit {
    padding: 0 rem(20);
    margin-top: rem(65);
  }
  .car {
    margin-top: rem(10);
  }
  .tost {
    width: 100%;
    height: rem(72);
    text-align: center;
    color: #ffffff;
    background: rgba(254, 56, 36, 0.9);
    line-height: rem(72);
  }
  .picker-alternate-pjl {
    height: remp(150);
  }
  .listmodel {
    position: fixed;
    transform: translateZ(0);
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.4);
  }
  .picker-pjl {
    position: fixed;
    transform: translateZ(0);
    width: 100%;
    height: remp(200);
    overflow: hidden;
    bottom: 0;
    left: 0;
    background-color: #fff;
  }
  .header .header-left .left-arrow {
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
  .picker-top-pjl {
    background-color: #26a2ff;
  }
</style>
