
<template>
    <div class="">
        <div class="popup-warp-pjl  pr">
            <page-header ref="header" :leftOptions="leftOptions" :rightOptions="rightOptions" title="客户中心" @on-click-right="more">
                <div slot="left" class="header-left-pjl">
                    <div v-if="addclue">
                        <span class="iconfont add-pjl icon-icon-tianjia" @click.stop="add"></span>
                    </div>
                    <div v-if="queryscshow && !empName">
                        <span class="iconfont shaixuan  icon-icon-shaixuan" @click="querysc"></span>
                    </div>
                    <div v-if="empName" @click="querysc">
                        {{empName}}
                        <i class="iconfont xialashouqi icon-icon-xialashouqi"></i>
                    </div>
                </div>
                <div slot="right">
                    <span class="iconfont sousuo icon-icon-sousuo"></span>
                </div>
            </page-header>
            <popup :list="list" :popupVisible="popupVisible"></popup>
        </div>
        <!-- 这个div是   头部导航栏  导航层  显示几条信息 -->
        <div class="screen-warp-pjl">

            <customer-top-select @getValue="getValue"></customer-top-select>
            <!-- <screen ref="screen" @getValue="getValue" @cover="covershow" v-model="params"></screen> -->

            <div class="pages-total">共有:&nbsp;&nbsp;{{pagesTotal}}人</div>
        </div>
        <div id="customer-center-list">
          <!-- 这里是列表  列表的 dataList 数据是根据各种数据请求拼装而成的   下面的 v-if="(dataList.length == 0)意思
          是如果这里dataList 的数据为空就显示暂无数据-->
            <irisScroll v-if="dataList.length > 0" ref="scroll" :dropdown="dropdown">
                <ul class="list" slot="list">
                  <!-- 这里渲染列表数据,  列表数据是可以点击的  点击就会把当前的点击的item对象全部传入到一个方法里
                        并且跳转到令一个页面  把当前item传入过去 -->
                    <div @click="tocustomdetail(item)" class="customer-list-box" v-for="(item, index) in dataList" :key="index">
                        <div class="customer-img">
                            <head-portrait :name="item.intentionLevelName" :badge='badge' :sex="item.sex"></head-portrait>
                        </div>
                        <div class="customer-info">
                            <div class="info-head">
                                <span>{{item.customName}}</span>
                                <span>{{item.phone | hideMobile}}</span>
                            </div>
                            <div class="info-con">
                                <div class="content-joly">
                                    <p class="main-info">{{item.displayName}}</p>
                                    <p class="date">更新于{{item.date}}</p>
                                </div>
                                <div class="btn-box">
                                    <div>{{item.status}}</div>  
                                </div>
                            </div>
                        </div>
                    </div>
                </ul>
            </irisScroll>
            <div v-if="(dataList.length == 0) && loadingNoData" class="no-sevice-pjl">
                <no-data title="暂无数据"></no-data>
            </div>
        </div>
        <!-- 遮罩层点击右上角会出现的弹框 -->
        <div class="model-pjl w h pf max-width " @touchmove.prevent v-if="cover" @click="coverclick">
        </div>
        <modal title="sc销售" submitText="确定" ref="modal" @submit="handOk">
            <div class="sclist-joly">
                <ul class="sclist-pjl clearfix" v-if="scList.length >1">
                    <li v-for="(item, index) in scList" :key="index"><a :class="{focus:item.checkflag}" @click="selectSc(item)" href="javascript:;">{{item.name}}</a></li>
                </ul>
                <div class="nonedata-joly" v-if="!(scList.length >1)">
                    暂无sc销售
                </div>
            </div>
        </modal>
    </div>
</template>

<script>
import customerTopSelect from './component/customer-top-select.vue';
import PageHeader from "components/header/PageHeader";
import Screen from "components/screen/screen";
import CustomerList from "components/customer-list/customer-list";
import api from "@/common/api.js";
import config from "@/common/config.js";
import common from "@/common/common";
import HeadPortrait from "components/headportrait/headportrait";
import popup from "@/components/popup/popup";
import irisScroll from "@/components/iris-scroll/";
import Modal from "@/components/modal/";
import NoData from "components/no-data/no-data";
import {Toast} from 'mint-ui'
import { mapState, mapGetters, mapActions, mapMutations } from "vuex";
export default {
  components: {
    PageHeader,
    Screen,
    CustomerList,
    HeadPortrait,
    popup,
    irisScroll,
    Modal,
    NoData,
    customerTopSelect
  },
  computed: {
    ...mapState("customercenter", [
      "empCode",
      "empName",
      "customParams"
    ])
  },
  data() {
    return {
      pagesTotal: 0,//所有线索数量
      rightOptions: {
        showMore: true
      },
      // 现在的问题dataList是怎么拼装过来的？
      dataList: [],
      params: {
        scCode: null,
        leadsStstusCode: '',
        salesStstusCode: '',
        intentionLevelCode: '',
        channelCode: '',
        brandCode: '',
        seriesCode: '',
        pageNums: config.pageNums,
        pageStart: 1
      },
      level: "A级",
      badge: null,
      loading: true,
      pages: 1,
      leftOptions: {
        icon: "",
        showBack: false
      },
      popupVisible: false,
      list: [
        {
          name: "未进店客户",
          path: `/customer-addclue/${0}`
        },
        {
          name: "非前台推送客户",
          path: `/customer-addclue/${1}`
        }
      ],
      cover: false,
      getLoginInfo: null,
      storeCode: null,
      scList: [],
      selectScData: null,
      queryscshow: false,
      addclue: false,
      loadingNoData: false,
      ajaxFlag: true
    };
  },
  methods: {
    initData() {
      this.resetData();
      //先获取dom  再把这里的宽高计算出来
      this.$parent.loading = false;
      this.params = JSON.parse(JSON.stringify(this.customParams))
      this.$nextTick(function() {
        document.getElementById("customer-center-list").style.height =
          document.body.clientHeight -
          this.$refs.header.$el.offsetHeight -
          document.getElementsByClassName("screen-warp-pjl")[0].offsetHeight +
          "px";
        document.addEventListener("click", () => {
          this.popupVisible = false;
        });
      });
      this.dataList = [];
      this.loaddata();
      api.login.getLoginInfo().then(msg => {
        this.getLoginInfo = msg.data.obj || {};
        let type = this.getLoginInfo.postnTypes;
        let postnTypes = new Set(type || []);
        if (
          postnTypes.has(config.root.scPostTypeCode) &&
          postnTypes.has(config.root.smPostTypeCode)
        ) {
          //即是销售
          this.addclue = true;
          this.queryscshow = true;
        } else if (postnTypes.has(config.root.scPostTypeCode)) {
          //销售
          this.addclue = true;
          this.queryscshow = false;
        } else if (
          postnTypes.has(config.root.smPostTypeCode) ||
          postnTypes.has(config.root.positionTypeSalesManager) ||
          postnTypes.has(config.root.positionTypeStoreGeneralManager) ||
          postnTypes.has(config.root.positionTypeFinancialManager)
        ) {
          //管理
          this.queryscshow = true;
          this.addclue = false;
          api.getUserInfo.getUserAvailableInfo(msg => {
            if (msg.data.message == "success") {
              this.storeCode =
                msg.data.obj.storeInfoVo && msg.data.obj.storeInfoVo.storeCode;
              api.customer.queryScList({
                  orgCode: this.getLoginInfo.inChargePostnVo.orgCode,
                  storeCode: this.storeCode,
                  postnTypeCode:'positionTypeSC'
                })
                .then(msg => {
                  if (msg.data.message == "success") {
                    let data = msg.data.obj || [];
                    for (let i = 0; i < data.length; i++) {
                      this.$set(this.scList, i, {
                        name: data[i].empCnName,
                        empCode: data[i].empCode,
                        checkflag: this.empCode === data[i].empCode ? true : false
                      });
                    }
                  }
                });
            }
          });
        }
      });
    },
    ...mapActions("customercenter", [
        "setParams",
        "screeningconditionsEMP"
    ]),
    more() {
      this.$router.push({
        path: `/search-detail`
      });
    },
    //这个方法会在右上角选中菜单  和顶部菜单选择时执行
    query() {
      let _this = this
      this.dataList = [];
      this.params.pageStart = 1;  //从第几页开始
      this.params.scCode = this.empCode;    //  这里传入的是我点击的是哪一个sc销售类别
      this.loadingNoData = false,
      //这里的逻辑:   去请求接口  接口的回调函数把当前的params入参传入   msg回调  我把当前
      // 点击的销售类别  在接口中查询并且储存再datalist中  如果这个请求成功在list中储存
      api.customercenter.querycustomercenter(this.params, (msg) => {
        if (msg.data.message == "success") {
          let list = msg.data.obj.list;
          this.pagesTotal = msg.data.obj.total;
          if (list.length == 0) {
            this.dataList = list;
            _this.loadingNoData = true
          } else {
            this.pages = msg.data.obj.pages;
            let list = msg.data.obj.list;
            this.handleData(list, 0);
          }
        }
      });
    },
    add() {
      this.popupVisible = !this.popupVisible;
    },
    getValue(queryParams) {
        let _this = this
        //_this.setParams(_this.$data.params)
        _this.params = queryParams;
        _this.params.pageNums = config.pageNums;
        _this.params.pageStart = 1;
        _this.setParams(_this.$data.params);
        _this.query();
    },
    querysc() {
      this.popupVisible = false;
      this.$refs.modal.open();
    },
    tocustomdetail(item) {
      this.setCurrentTabIndex(0);
      this.setCurrentTabContent("clueinfo");
      this.$router.push({
        path: `/customer-detail/${item.leadCode}/${config.customerFlag}`
      });
    },
    loaddata() {
      let number = this.dataList.length;
      this.params.scCode = this.empCode;
      this.loadingNoData = false,
      api.customercenter.querycustomercenter(this.params, msg => {
        if (msg.data.message == "success") {
          this.pages = msg.data.obj.pages;
          this.pagesTotal = msg.data.obj.total;
          let list = msg.data.obj.list;
          if (list.length == 0) {
            this.loadingNoData = true
            this.callback && this.callback("暂无更多数据");
          }
          this.handleData(list, number);
        }
      });
    },
    //判断列表右下角的状态 '待跟进'，'准战败'之类的状态
    handleData(list, number) {
      for (let index = 0; index < list.length; index++) {
        for (var iable in list[index]) {
          var status;
          if (list[index].defeatStatus < 0) {
            // 战败
            status = "准战败";
            break;
          } else if (
            list[index].salesLeadsStatusInfoVos && 
            list[index].salesLeadsStatusInfoVos[0] &&
            list[index].salesLeadsStatusInfoVos[0].tryDriveStatus > 0
          ) {
            // 试乘试驾
            status = "试乘试驾";
            break;
          } else if (list[index].inStoreFlag > 0) {
            // 到店
            status = "到店";
            break;
          } else if (list[index].appointmentSubStatus > 0) {
            // 已预约
            status = "已预约";
            break;
          } else if (list[index].appointmentSubStatus <= 0) {
            // 待跟进
            status = "待跟进";
            break;
          }
        }
        this.$set(this.dataList, number + index, {
          customName: list[index].customName,
          customCode: list[index].customCode,
          mobilePhone: list[index].mobilePhone,
          scCode: list[index].scCode,
          storeCode: list[index].storeCode,
          level: list[index].intentionLevelName,
          sex: list[index].customGender,
          phone: list[index].mobilePhone,
          car: list[index].displayName,
          date: list[index].updateTimeStr,
          status: status,
          leadCode: list[index].leadCode,
          intentionLevelName: list[index].intentionLevelName,
          displayName:
            list[index].intentionCarInfoVos && list[index].intentionCarInfoVos[0] &&
            list[index].intentionCarInfoVos[0].carName
        });
      }
      this.ajaxFlag = true;
    },
    covershow(cover) {
      this.cover = cover;
    },
    coverclick() {
      this.$refs.screen.showConclose();
    },
    dropdown(callback) {
      this.callback = callback;
      if (!(this.params.pageStart > this.pages)) {
        return new Promise((resolve, reject) => {
          if(!this.ajaxFlag){
            return false;
          }
          this.ajaxFlag = false;
          this.params.pageStart++;
          this.loaddata();
          resolve();
        });
      } else {
        this.callback && this.callback("暂无更多数据");
        return new Promise(resolve => {
          resolve();
        });
      }
    },
    selectSc(item) {
      this.selectScData = item;
      for (let i = 0; i < this.scList.length; i++) {
        this.scList[i].checkflag = false;
      }
      item.checkflag = true;
    },
    //遮罩层选择完之后点击确定会调用的方法
    handOk() {
      this.screeningconditionsEMP({
        empCode: this.selectScData.empCode,
        empName: this.selectScData.name
      });
      this.params.scCode = this.empCode;
      this.query();
    },
    // 移动端使用
    resetData(){
      Object.assign(this.$data,{
        pagesTotal: 0,//所有线索数量
        rightOptions: {
          showMore: true
        },
        // 现在的问题dataList是怎么拼装过来的？
        dataList: [],
        params: {
          scCode: null,
          leadsStstusCode: '',
          salesStstusCode: '',
          intentionLevelCode: '',
          channelCode: '',
          brandCode: '',
          seriesCode: '',
          pageNums: config.pageNums,
          pageStart: 1
        },
        level: "A级",
        badge: null,
        loading: true,
        pages: 1,
        leftOptions: {
          icon: "",
          showBack: false
        },
        popupVisible: false,
        list: [
          {
            name: "未进店客户",
            path: `/customer-addclue/${0}`
          },
          {
            name: "非前台推送客户",
            path: `/customer-addclue/${1}`
          }
        ],
        cover: false,
        getLoginInfo: null,
        storeCode: null,
        scList: [],
        selectScData: null,
        queryscshow: false,
        addclue: false,
        loadingNoData: false,
        ajaxFlag: true
      })
      //this.$data = ;
    },
    // add by lwx on 2018/01/12
    ...mapMutations({
      setCurrentTabIndex: "customer/SET_CURRENT_TAB_INDEX",
      setCurrentTabContent: "customer/SET_CURRENT_TAB_CONTENT"
    })
  },
  created() {
    window.initData = this.initData
  },
  mounted() {

    this.initData();
  },
  filters: {
    hideMobile: function(value) {
      if(!value) return ''
      let valueArr = value.split('')
      valueArr[3] = '*'
      valueArr[4] = '*'
      valueArr[5] = '*'
      valueArr[6] = '*'
      return valueArr.join('')
    }
  }
};
</script>

<style lang="scss" scoped>
.sousuo {
  font-size: remp(50);
}
.customer-list-box {
  display: -webkit-flex; // width: 100%;
  // height: rem(176);
  background-color: #fff;
  padding: rem(28) rem(40);
  border: 1px solid #f0f2f5;
}
.customer-img {
  position: relative;
  display: -webkit-flex;
  align-items: center;
  width: rem(90);
  height: rem(90);
}
.level {
  position: absolute;
  left: -2px;
  bottom: 2px;
  width: rem(90);
  height: rem(28);
  font-size: 9px;
  text-align: center;
  line-height: 9px;
  color: #ffffff;
}
.customer-img img {
  width: rem(90);
  height: rem(90);
}
.customer-info {
  flex: 1;
  padding-left: rem(40);
}
.info-head {
  display: -webkit-flex;
  justify-content: space-between;
  font-family: PingFangSC-Medium;
  font-size: 14px;
  color: #333333;
  letter-spacing: -0.36px;
  line-height: rem(30);
  padding-bottom: rem(10);
}
.info-con {
  display: -webkit-flex;
  justify-content: space-between;
}
.main-info {
  font-size: 12px;
  color: #7e8387;
  width: 100%;
}
.date {
  margin-top: rem(8);
  font-size: 12px;
  color: #7e8387;
}
.content-joly {
  width: 75%;
}
.btn-box {
  display: -webkit-flex;
  width: 25%;
  align-items: center;
}
.btn-box > div {
  display: -webkit-flex;
  align-items: center;
  justify-content: center;
  background: #bdc7d1;
  border-radius: 3px;
  width: rem(130);
  height: rem(40);
  color: #fff;
  font-size: 12px;
}
.triangle-pjl {
  color: #fff;
  font-size: remp(14);
  top: remp(-8);
  left: remp(8);
}
p > a {
  color: #000 !important;
}
.popup-pjl {
  bottom: remp(-90) !important;
  left: remp(10) !important;
}
.triangle-pjl {
  top: remp(-8) !important;
  left: remp(8) !important;
}
.screen-warp-pjl {
  height: rem(130);
  .pages-total{
    width:100%;
    padding: 0.02rem 0;
    position:fixed;
    top: remp(85);
    z-index: 2;
    text-align: center;
    background-color: #eceef3;
  }
}
.model-pjl {
  top: 0;
  background: rgba(0, 0, 0, 0.4);
}
.add-pjl {
  font-size: remp(30);
}
.header-left-pjl {
  display: flex;
}
.header-left-pjl > div {
  flex: 1;
}
.shaixuan {
  font-size: remp(30);
}
.sclist-pjl {
  padding: remp(10);
  width: 100%;
  box-sizing: border-box;
}
.sclist-pjl li {
  text-align: center;
  width: 50%;
  float: left;
  padding: remp(10);
  box-sizing: border-box;
}
.sclist-pjl li a {
  display: block;
  padding: remp(8);
  background-color: #f0f2f5;
  color: #7e8387;
}
.sclist-pjl li a.focus {
  background-color: #008cee !important;
  color: #fff;
}
.load-pjl {
  margin-top: remp(100);
}
.no-sevice-pjl {
  padding-top: 100px;
  box-sizing: border-box;
}
.nonedata-joly {
  text-align: center;
  font-size: rem(36);
  margin: remp(20) 0;
  color: #bfc8cc;
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%);
}
.xialashouqi {
  margin-left: 10px;
  font-size: rem(0.2);
} // .sclist-joly {
// height: remp(356);
// overflow-y: auto;
// }
</style>
