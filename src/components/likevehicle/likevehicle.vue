
<template>
    <div class="hello">
        <pageheader :leftOptions="leftOptions" @on-click-right="more">
            <div slot="left">
                <div class="left-arrow" @click="callback"></div>
            </div>
            <div slot>
                {{title}}
            </div>
            <div slot="right" v-if="ensureFlag">
                确定
            </div>
        </pageheader>
        <div class="carstyle-header">
            <ul class="clearfix">
                <li v-for="(item, index) in crumb" :key="index" @click="bread(item)"><i class="carname active">{{item.name}}</i><span class="iconfont icon-icon-tiaozhuanjiantou"></span></li>
                <li><i class="carname ">{{crumblastname}}</i></li>
            </ul>
        </div>
        <div class="carstyle-content">
            <ul>
                <li v-for="(item, index) in factorylist " :key="index" :class="{'active':item.active}" @click="selectfactory(item)"><i>{{item.factoryName}}</i></li>
                <li v-for="(item, index) in carbrandlist " :key="index" :class="{'active':item.active}" @click="selectbrand(item)"><i>{{item.brandName}}</i></li>
                <li v-for="(item, index) in cartrainlist " :key="index" :class="{'active':item.active}" @click="selecttrain(item)"><i>{{item.seriesName}}</i></li>
                <li v-for="(item, index) in cartypelist " :key="index" :class="{'active':item.active}" @click="selecttype(item)"><i>{{item.modelName}}</i></li>
                <li v-for="(item, index) in carstylelist " :key="index" :class="{'active':item.active}" @click="selectstyle(item)"><i>{{item.displayName}}</i></li>
            </ul>
        </div>
        <div class="next-pjl" v-if="nextshow">
            <mt-button size="large" @click="next" type="primary">下一步</mt-button>
        </div>
        <loading v-if="factorylist.length == 0 && carbrandlist.length == 0 && cartrainlist.length == 0 && cartypelist.length == 0 && carstylelist.length == 0 && !noData" class="likevehicle-pjl"></loading>
        <NoData v-if="noData" title="暂无数据"> </NoData>
    </div>
</template>

<script>
import Vue from "vue";
import { Button } from "mint-ui";
Vue.component(Button.name, Button);
import pageheader from "@/components//header/PageHeader";
import api from "@/common/api.js";
import config from "@/common/config.js";
import Loading from "components/loading/loading";
import NoData from "components/no-data/no-data";
export default {
  props: {
    title: String,
    ensuredispaly: String
  },
  data() {
    return {
      crumb: [], //厂家数据
      crumblastname: "选择品牌", //面包屑name
      cartrainlist: [], //车系列表
      carbrandlist: [], //品牌列表
      cartypelist: [], //车型列表
      factorylist: [], //厂家
      carstylelist: [], //车款列表
      carbranddata: {}, //品牌
      cartraindata: {}, //车系
      cartypedata: {}, //车型
      carstyledata: {}, //车款
      crumblast: { //头部面包屑title数据源
        cartype: "选择车型",
        cartrain: "选择车系",
        carstyle: "选择车款",
        carbrand: "选择品牌",
        factory: "选择厂家"
      },
      ensure: false, //确定按钮显示状态
      leftOptions: { //头部左侧按钮配置
        icon: "",
        showBack: false
      },
      //flag: false,
      nextshow: false, //是否显示下一步按钮
      nextobj: {//用于下一步时判断调用哪个方法
        nextName: null,
        nextFun: null
      },
      loadingShow: true, //loading显示状态
      ensureFlag: false, //确定按钮显示状态
      noData: true, //用于展示暂无数据DOM控制
      // isFactoryStart: true
      isFactoryStart: (sessionStorage.getItem('showFactory') === "false" ? false : true) //是否从厂家开始的判断
    }
  },
  methods: {
    //选择厂家
    selectfactory(item) {
      this.dryoutall("factorylist");
      this.$set(item, "active", true);
      this.factorydata = item;
      this.getCarBrand(msg => {
        this.factorylist = [];
        this.carbrandlist = msg.data.obj || [];
        this.crumblastname = this.crumblast.carbrand;
        this.$set(this.crumb, 0, {
          name: item.factoryName,
          code: item.factoryCode,
          type: 0
        });
      });
    },
    //选择品牌
    selectbrand(item) {
      this.dryoutall("carbrandlist");
      this.$set(item, "active", true);
      if (this.ensuredispaly == "carbrand") {
        this.ensure = true;
      }
      this.carbranddata = item;
      this.getCartrain(msg => {
        this.carbrandlist = [];
        this.cartrainlist = msg.data.obj || [];
        this.crumblastname = this.crumblast.cartrain;
        this.$set(this.crumb, this.isFactoryStart ? 0 : 0 + 1, {
          name: item.brandName,
          code: item.brandCode,
          type: 1
        });
        this.nextshow = true;
      });
    },
    //选择车系
    selecttrain(item) {
      this.dryoutall("cartrainlist");
      this.$set(item, "active", true);
      //判断确认按钮是否可以显示
      if (
        this.ensuredispaly == "carbrand" ||
        this.ensuredispaly == "cartrain"
      ) {
        this.ensure = true;
      }
      //存储选择的数据
      this.cartraindata = item;
      //面包屑最后一位显示的字
      this.nextobj.nextName = "getCarType";
      this.nextobj.nextFun = msg => {
        this.crumblastname = this.crumblast.cartype;
        this.carbrandlist = [];
        this.cartrainlist = [];
        this.cartypelist = msg.data.obj || [];
        this.$set(this.crumb, this.isFactoryStart ? 1 : 2, {
          name: item.seriesName,
          code: item.seriesCode,
          type: 2
        });
      };
    },
    //选择车型
    selecttype(item) {
      this.dryoutall("cartypelist");
      this.$set(item, "active", true);
      item.hover = true;
      if (
        this.ensuredispaly == "carbrand" ||
        this.ensuredispaly == "cartrain" ||
        this.ensuredispaly == "cartype"
      ) {
        this.ensure = true;
      }
      this.cartypedata = item;
      this.nextobj.nextName = "getCarStyle";
      this.nextobj.nextFun = msg => {
        this.carbrandlist = [];
        this.cartrainlist = [];
        this.cartypelist = [];
        this.carstylelist = msg.data.obj || [];
        this.nextshow = false;
        this.ensure = true;
        this.crumblastname = this.crumblast.carstyle;
        this.$set(this.crumb, this.isFactoryStart ? 2 : 3, {
          name: item.modelName,
          code: item.modelCode,
          type: 3
        });
      };
    },
    //选择车款
    selectstyle(item) {
      if (
        this.ensuredispaly == "carbrand" ||
        this.ensuredispaly == "cartrain" ||
        this.ensuredispaly == "cartype" ||
        this.ensuredispaly == "carstyle"
      ) {
        this.ensureFlag = true;
      } else {
        this.ensureFlag = false;
      }
      this.dryoutall("carstylelist");
      this.$set(item, "active", true);
      this.carstyledata = item;
    },
    //面包屑上的点击方法
    bread(item) {
      //点击面包屑触发
      this.ensure = false; //确定按钮消失
      if (item.type === 0) {
        this.crumblastname = this.crumblast.factory; //请选择品牌
        this.getFactory(msg => {
          //清空面包屑和所有list
          this.crumb = [];
          this.carbrandlist = [];
          this.cartrainlist = [];
          this.cartypelist = [];
          this.carstylelist = [];
          this.factorylist = msg.data.obj || [];
          //清空已选择的数据
          this.factorydata = {};
          this.carbranddata = {};
          this.cartraindata = {};
          this.cartypedata = {};
          this.carstyledata = {};
          this.nextshow = false;
        });
      } else if (item.type === 1) {
        //拉取品牌的数据
        this.crumblastname = this.crumblast.carbrand; //请选择品牌
        if (!this.ensuredispaly == "carbrand") {
          this.ensureFlag = true;
        } else {
          this.ensureFlag = false;
        }
        this.getCarBrand(msg => {
          //清空面包屑和所有list
          this.crumb = this.crumb.slice(0, this.isFactoryStart ? 0 : 1);
          this.cartrainlist = [];
          this.cartypelist = [];
          this.carstylelist = [];
          this.carbrandlist = msg.data.obj || [];
          //清空已选择的数据
          this.carbranddata = {};
          this.cartraindata = {};
          this.cartypedata = {};
          this.carstyledata = {};
          this.nextshow = false;
        });
      } else if (item.type === 2) {
        //拉取车系数据
        this.crumblastname = this.crumblast.cartrain; // 请选择车系
        if (
          this.ensuredispaly == "carbrand" ||
          this.ensuredispaly == "cartrain"
        ) {
          this.ensureFlag = true;
        } else {
          this.ensureFlag = false;
        }
        this.getCartrain(msg => {
          //设置面包屑
          this.crumb = this.crumb.slice(0, this.isFactoryStart ? 1 : 2);

          //清空所有list
          this.carbrandlist = [];
          this.cartypelist = [];
          this.carstylelist = [];
          this.cartrainlist = msg.data.obj || [];
          //清空已选择数据
          this.cartraindata = {};
          this.cartypedata = {};
          this.carstyledata = {};
          this.nextshow = true;
        });
      } else if (item.type === 3) {
        this.crumblastname = this.crumblast.cartype; //请选择车型
        //设置面包屑
        if (
          this.ensuredispaly == "carbrand" ||
          this.ensuredispaly == "cartrain" ||
          this.ensuredispaly == "cartype"
        ) {
          this.ensureFlag = true;
        } else {
          this.ensureFlag = false;
        }
        this.getCarType(msg => {
          this.crumb = this.crumb.slice(0, this.isFactoryStart ? 2 : 3);
          //清空list
          this.carbrandlist = [];
          this.carstylelist = [];
          this.cartrainlist = [];
          this.cartypelist = msg.data.obj || [];
          //清空数据
          this.cartypedata = {};
          this.carstyledata = {};
          this.nextshow = true;
        });
      } else {
        if (
          this.ensuredispaly == "carbrand" ||
          this.ensuredispaly == "cartrain" ||
          this.ensuredispaly == "cartype" ||
          this.ensuredispaly == "carstyle"
        ) {
          this.ensureFlag = true;
        } else {
          this.ensureFlag = false;
        }
      }
    },
    more() {
      //点击确定的时候触发
      let obj = {
        carbranddata: this.carbranddata,
        cartraindata: this.cartraindata,
        cartypedata: this.cartypedata,
        carstyledata: this.carstyledata,
        factorydata: this.isFactoryStart ? null : this.factorydata
      };
      this.$emit("confirm", obj);
    },
    callback() {
      //点击返回按钮触发
      this.$emit("revert");
    },
    next() {
      //点击下一步的时候触发
      this.nextobj.nextName &&
        this[this.nextobj.nextName](this.nextobj.nextFun);
      this.nextobj.nextName = null;
      this.nextobj.nextFun = null;
      this.ensureFlag = this.ensure;
    },
    //获取厂家
    getFactory(callback) {
      this.crumblastname = this.crumblast.factory;
      api.car.queryCarInfoByCarSearch(
        {
          code: "",
          level: 1
        },
        msg => {
          if (msg.data.code === "success") {
            if (msg.data.obj.length == 0) {
              this.noData = true;
            } else {
              this.noData = false;
            }
            callback && callback(msg);
          }
        }
      );
    },
    //获取品牌
    getCarBrand(callback) {
      this.crumblastname = this.crumblast.carbrand;
      api.car.queryCarInfoByCarSearch(
        {
          code: "",
          level: 2,
          //厂家编码
          carFactoryCode:this.isFactoryStart ? null : this.factorydata.factoryCode,
          // 品牌编码
          carBrandCode:this.carbranddata.brandCode,

        },
        msg => {
          if (msg.data.code === "success") {
            if (msg.data.obj.length == 0) {
              this.noData = true;
            } else {
              this.noData = false;
            }
            callback && callback(msg);
          }
        }
      );
    },
    //获取车系
    getCartrain(callback) {
      api.car.queryCarInfoByCarSearch(
        {
          code: this.carbranddata.brandCode,
          level: 4,
          type: 1,
          //厂家编码
          carFactoryCode:this.isFactoryStart ? null : this.factorydata.factoryCode,
          // 品牌编码
          carBrandCode:this.carbranddata.brandCode,

        },
        msg => {
          if (msg.data.code === "success") {
            if (msg.data.obj.length == 0) {
              this.noData = true;
            } else {
              this.noData = false;
            }
            callback && callback(msg);
          }
        }
      );
    },
    //获取车型
    getCarType(callback) {
      api.car.queryCarInfoByCarSearch(
        {
          code: this.cartraindata.seriesCode,
          level: 8,
          type: 2,
          //厂家编码
          carFactoryCode:this.isFactoryStart ? null : this.factorydata.factoryCode,
          // 品牌编码
          carBrandCode:this.carbranddata.brandCode,
           // 车系编码
          carSeriesCode:this.cartraindata.seriesCode,

        },
        msg => {
          if (msg.data.code === "success") {
            if (msg.data.obj.length == 0) {
              this.noData = true;
            } else {
              this.noData = false;
            }
            callback && callback(msg);
          }
        }
      );
    },
    //获取车款
    getCarStyle(callback) {
      // 获取数据
      api.car.queryCarInfoByCarSearch(
        {
          code: this.cartypedata.modelCode,
          level: 64,
          type: 3,
          //厂家编码
          carFactoryCode:this.isFactoryStart ? null : this.factorydata.factoryCode,
          //品牌编码
          carBrandCode:this.carbranddata.brandCode,
           // 车系编码
          carSeriesCode:this.cartraindata.seriesCode,
           // 车型编码
          carModelCode:this.cartypedata.modelCode
        },
        msg => {
          if (msg.data.code === "success") {
            if (msg.data.obj.length == 0) {
              this.noData = true;
            } else {
              this.noData = false;
            }
            callback && callback(msg);
          }
        }
      );
    },
    //选中效果
    dryoutall(type) {
      for (let i = 0; i < this[type].length; i++) {
        this.$set(this[type][i], "active", false);
      }
    }
  },
  mounted() {
    //是否从厂家开始
    if (!this.isFactoryStart) {
      this.getFactory(msg => {
        this.factorylist = msg.data.obj || [];
      });
    } else {
      //页面初始化拉取车辆品牌信息
      this.getCarBrand(msg => {
        this.carbrandlist = msg.data.obj || [];
      });
    }
  },
  components: {
    pageheader,
    Loading,
    NoData
  }
};
</script>

<style lang="scss">
.carstyle-header {
  width: 100%;
  color: #333333;
  background-color: #e5f4fe;
}
.carstyle-header ul {
  padding-top: remp(10);
  padding-bottom: remp(10);
  padding-left: remp(5);
}
.carstyle-header ul li {
  float: left;
}
.carstyle-content ul li {
  box-sizing: border-box;
  width: 100%;
  line-height: rem(80);
  background-color: #fff;
  border-bottom: 1px solid #e5f4fe;
  padding-left: rem(19);
  padding-right: rem(19);
  font-size: rem(26);
  min-height: rem(80);
}
.carstyle-content ul li span {
  margin-right: rem(10);
  color: #333;
  display: inline-block;
  width: rem(60);
  height: 100%;
  padding: rem(10) 0;
  box-sizing: border-box;
}
.carstyle-content ul li i {
  display: inline-block;
  vertical-align: top;
} // .carstyle-content ul li.active {
//     color: #008cee;
// }
.active {
  color: #008cee;
}
.carname {
  padding: rem(10);
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
.next-pjl {
  padding: 0 rem(20);
  margin-top: rem(65);
}
.likevehicle-pjl {
  margin-top: rem(220);
}
</style>
