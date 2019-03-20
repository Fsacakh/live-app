<template>
    <div class="screen-box max-width">
        <div class="screen-top">
            <div :class="{ 'topactive': item.flag }" @click="topClick(item, index)" v-for="(item, index) in topList" class="top-item-box" :key="index">
                <div class="name-box">
                    <span>{{ item.name }}</span>
                </div>
                <div class="img-box">
                    <div class="screen-img-box">
                        <img src="../../assets/imgage/down.png">
                    </div>
                </div>
            </div>
        </div>
        <div class="layer" v-show="showCon">
            <div class="screen-con" v-if="specialflag === 1">
                <ul class="clearfix">
                    <li :class="{ 'active': (title == 'channel' && item.code == params.channelCode) || (title == 'level' && item.code == params.intentionLevelCode) }" v-for="(item, index) in itemList" @click="itemClick(item)" :key="index">
                        <a href="javascript:;">{{ item.name }}</a>
                    </li>
                </ul>
            </div>
            <div class="screen-warp clearfix" v-else-if="specialflag === 2">
                <div class="clearfix">
                    <div class="fl clue">
                        <h1>线索状态</h1>
                        <ul class="clearfix">
                            <li :class="{ 'active': (item.code == params.leadsStstusCode) }" v-for="(item, index) in clueList" @click="clueclick(item)" :key="index">
                                <a href="javascript:;">{{item.name}}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="fl sales">
                        <h1>销售状态</h1>
                        <ul class="clearfix">
                            <li @click="salesclick(item)" :class="{ 'active': (item.code == params.salesStstusCode) }" v-for="(item, index) in salesList" :key="index">
                                <a href="javascript:;">{{item.name}}</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="button">
                    <mt-button @click="confirmstatus" size="small" type="primary">确认</mt-button>
                </div>
            </div>
            <div class="screen-warp " v-else-if="specialflag === 3">
                <div class="clearfix">
                    <div class="fl carbrand">
                        <h1>品牌</h1>
                        <ul class="clearfix">
                            <li :class="{ 'active': (item.code == params.brandCode) }" v-for="(item, index) in carList" @click="brandclick(item)" :key="index">
                                <a href="javascript:;">{{ item.name }}</a>
                            </li>
                        </ul>
                    </div>
                    <div class="fl cartrain">
                        <h1>车系</h1>
                        <ul class="clearfix">
                            <li @click="cartrainclick(item)" :class="{ 'active': (item.code == params.seriesCode) }" v-for="(item, index) in cartrainlist" :key="index">
                                <a href="javascript:;">{{ item.name }}</a>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="button">
                    <mt-button @click="confirmcar" size="small" type="primary">确认</mt-button>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
/**
 * @name   screen
 * @author lwx
 * @event  getValue(topList) 对外抛出一个数组, 数组对象中的name字段就是最终选择的值
 * @see    注意: 暂时这些数据都是我写死的, 后续如果业务需要可以写的灵活一点
 *
 */
import Vue from "vue";
import { Button } from "mint-ui";
Vue.component(Button.name, Button);
import api from "@/common/api.js";
import config from "@/common/config.js";
import common from "@/common/common.js";
export default {
  props: {
      value: {
          type: Object,
          default: function() {
              return {
              }
          }
      }
  },
  data() {
    return {
      topList: [
        {
          title: "channel",
          name: "渠道",
          check: false,
          flag: false
        },
        {
          title: "level",
          name: "意向级别",
          check: false,
          flag: false
        },
        {
          title: "state",
          name: "状态",
          check: false,
          flag: false
        },
        {
          title: "car",
          name: "意向车型",
          check: false,
          flag: false
        }
      ],
      itemList: [],
      channelList: [], //渠道
      levelList: [], //意向级别
      clueList: [
        {
          name: "全部",
          code: "",
          flag: true,
          refCode: 1
        },
        {
          name: "已预约",
          code: "1",
          flag: false,
          refCode: 1
        },
        {
          name: "待跟进 ",
          code: "2",
          flag: false,
          refCode: 1
        },
        {
          name: "到店",
          code: "4",
          flag: false,
          refCode: 1
        },
        {
          name: "试乘试驾",
          code: "8",
          flag: false,
          refCode: 1
        },
        {
          name: "准战败",
          code: "16",
          flag: false,
          refCode: 1
        }
      ], //线索状态
      salesList: [
        {
          name: "全部",
          code: "",
          flag: true,
          refCode: 3
        },
        {
          name: "未报价",
          code: "0",
          flag: false,
          refCode: 3
        },
        {
          name: "报价",
          code: "1",
          flag: false,
          refCode: 3
        },
        {
          name: "订单 ",
          code: "2",
          flag: false,
          refCode: 3
        },
        {
          name: "合同",
          code: "4",
          flag: false,
          refCode: 3
        },
        {
          name: "开票",
          code: "8",
          flag: false,
          refCode: 3
        },
        {
          name: "交车",
          code: "16",
          flag: false,
          refCode: 3
        }
      ], //销售状态
      carList: [], //意向车型
      showCon: false,
      title: '',
      topIndex: "",
      specialflag: 1,
      clueclickFlag: false,
      cartrainlist: [],
      params: {
        leadsStstusCode: '',
        leadsStstusName: '',
        salesStstusCode: '',
        salesStstusName: '',
        intentionLevelCode: '',
        intentionLevelName: '',
        channelCode: '',
        channelName: '',
        brandCode: '',
        brandName: '',
        seriesCode: '',
        seriesName: '',
      }
    };
  },
  methods: {
    topClick(item, index) {
      console.log(item.title);
      let title = item.title;
      this.title = title
      this.topIndex = index; //当前下标
      if (title === "channel") {
        this.itemList = this.channelList;
        this.specialflag = 1;
      } else if (title === "level") {
        this.specialflag = 1;
        this.itemList = this.levelList;
      } else if (title === "state") {
        this.specialflag = 2;  // 已预约
      } else if (title === "car") {
        this.specialflag = 3;
      }
      this.topList[index].check = !this.topList[index].check; //当前箭头状态切换
      this.showCon = this.topList[index].check; //显示下面
      for (let i = 0, len = this.topList.length; i < len; i++) {
        if (title !== this.topList[i].title) {
          this.topList[i].check = false;
        }
      }
    },
    itemClick(item) {
      let _this = this
      if (!item.code == "") {
        this.topList[this.topIndex].name = item.name; 
      } else {
        if (item.refCode == config.custom.canal) {
          this.topList[this.topIndex].name = "渠道";
        } else if (item.refCode == config.custom.like) {
          this.topList[this.topIndex].name = "意向级别";
        } else if (item.refCode == 2) {
          this.topList[this.topIndex].name = "意向车型";
        }
      }
      if (this.title == 'channel') {
        _this.params.channelCode = item.code;
        _this.params.channelName = item.name; 
      } else if (this.title == 'level') {
        _this.params.intentionLevelCode = item.code;
        _this.params.intentionLevelName = item.name; 
      }
      this.$emit('input', this.params);
      this.$emit('getValue', this.params);
      this.showCon = false;
    },
    getDataDictionary(code, obj) {
      api.ref.getDataDictionary(
        {
          refCode: code
        },
        msg => {
          if (msg.data.message == "success") {
            let data = msg.data.obj.referenceDetailInfos;
            for (let index = 0; index < data.length; index++) {
              if (index == 0) {
                this.$set(obj, 0, {
                  code: "",
                  name: "全部",
                  flag: true,
                  refCode: data[index].refCode
                });
              }
              this.$set(obj, index + 1, {
                code: data[index].refDetailCode,
                name: data[index].refDetailName,
                flag: false,
                refCode: data[index].refCode
              });
            }
          }
        }
      );
    },
    clueclick(item) {
      if (item.name !== "全部") {
        if (!this.clueclickFlag) {
          this.topList[this.topIndex].name = item.name;
        }
      } else {
        this.topList[this.topIndex].name = "状态";
      }
      this.params.leadsStstusCode = item.code;
      this.params.leadsStstusName = item.name;
    },
    salesclick(item) {
      if (item.name !== "全部") {
        this.clueclickFlag = true;
        this.topList[this.topIndex].name = item.name;
      } else {
        this.clueclickFlag = false;
        this.topList[this.topIndex].name = "状态";
      }
      this.params.salesStstusCode = item.code;
      this.params.salesStstusName = item.name;
    },
    confirmstatus(item) {
      this.$emit('input', this.params);
      this.$emit('getValue', this.params);
      this.showCon = false;
    },
    showConclose() {
      this.showCon = false;
    },
    brandclick(item) {
      this.cartrainlist = [];
      if (item.name !== "全部") {
        if (!this.clueclickFlag) {
          this.topList[this.topIndex].name = item.name;
        }
      } else {
        this.topList[this.topIndex].name = "意向车型";
        this.params.seriesCode = "";
        this.params.seriesName = "";
      }
      this.params.brandCode = item.code;
      this.params.brandName = item.name;
      this.getcartrain(item.code);
    },
    cartrainclick(item) {
      this.topList[this.topIndex].name = item.name;
      this.params.seriesCode = item.code;
      this.params.seriesName = item.name;
    },
    confirmcar() {
      for (let i = 0; i < this.carList.length; i++) {
        if (this.carList[i].flag) {
          this.carList[i].brandFlag = 1;
          this.$emit('input', this.params);
          this.$emit('getValue', this.params);
        }
      }
      for (let i = 0; i < this.cartrainlist.length; i++) {
        if (this.cartrainlist[i].flag) {
          this.cartrainlist[i].brandFlag = 0;
          this.$emit('input', this.params);
          this.$emit('getValue', this.params);
        }
      }
      this.showCon = false;
    },
    getcartrain(code) {
      api.car.queryCarInfoByCarSearch(
        {
          code: code,
          level: 4,
          type: 1
        },
        msg => {
          if (msg.data.code === "success") {
            let data = msg.data.obj || [];
            for (let index = 0; index < data.length; index++) {
              this.$set(this.cartrainlist, index, {
                code: data[index].seriesCode,
                name: data[index].seriesName,
                refCode: 2,
                flag: false
              });
            }
          }
        }
      );
    }
  },
  mounted() {
    //获取车系
    this.getcartrain("");
    // 获取渠道
    this.getDataDictionary(config.custom.canal, this.channelList);
    // 获取意向级别
    api.ref.getDataDictionary(
      {
        refCode: config.custom.like
      },
      msg => {
        if (msg.data.message == "success") {
          let data = msg.data.obj.referenceDetailInfos;
          for (let index = 0; index < data.length; index++) {
            if (index == 0) {
              this.$set(this.levelList, 0, {
                code: "",
                name: "全部",
                flag: true,
                refCode: data[index].refCode
              });
            }
            this.$set(this.levelList, index + 1, {
              code: data[index].refDetailCode,
              name: data[index].refDetailName,
              flag: false,
              refCode: data[index].refCode,
              charCode: data[index].refDetailName.substring(0, 1).charCodeAt()
            });
          }
          this.levelList.sort(common._sort("charCode"));
        }
      }
    );
    // 意向车型
    api.car.queryCarInfoByCarSearch(
      {
        code: "",
        level: 2
      },
      msg => {
        if (msg.data.code === "success") {
          let data = msg.data.obj || [];
          for (let index = 0; index < data.length; index++) {
            if (index == 0) {
              this.$set(this.carList, 0, {
                code: "",
                name: "全部",
                refCode: 2,
                flag: true
              });
            }
            this.$set(this.carList, index + 1, {
              code: data[index].brandCode,
              name: data[index].brandName,
              refCode: 2,
              flag: false
            });
          }
        }
      }
    );
  },
  watch: {
    showCon: function() {
        this.$emit("cover", this.showCon);
    },
    value: {
        handler(val) {
            let _this = this
            _this.params = val
            if (_this.params.channelName && _this.params.channelName != "") {
                if (_this.params.channelName != "全部") {
                  _this.topList[0].name = _this.params.channelName
                } else {
                   _this.topList[0].name = '渠道'
                }
            }
            if (_this.params.intentionLevelName && _this.params.intentionLevelName != "") {
                if (_this.params.intentionLevelName != "全部") {
                  _this.topList[1].name = _this.params.intentionLevelName
                } else {
                  _this.topList[1].name = '意向级别' 
                }
            } 
            if (_this.params.salesStstusName && _this.params.salesStstusName != "") {
              if (_this.params.salesStstusName != "全部") {
                _this.topList[2].name = _this.params.salesStstusName
              } else {
                _this.topList[2].name = '状态'   
              }   
            } 
            if (_this.params.salesStstusName == "" && _this.params.leadsStstusName && _this.params.leadsStstusName != "") {
                if (_this.params.leadsStstusName != "全部") {
                  _this.topList[2].name = _this.params.leadsStstusName
                } else {
                  _this.topList[2].name = '状态' 
                }
            }
            if (_this.params.seriesName && _this.params.seriesName != "") {
               _this.topList[3].name = _this.params.seriesName
            }
            if (_this.params.seriesName == "" && _this.params.brandName && _this.params.brandName != "") {
              if (_this.params.brandName != "全部") {
                _this.topList[3].name = _this.params.brandName
              } else {
                _this.topList[3].name = '意向车型'
              }  
            }
        },
        deep: true
    }
  }
};
</script>
<style lang="scss" scoped>
.screen-box {
  position: relative;
  width: 100%;
  background-color: #fafafa;
}
.screen-top {
  display: flex;
  height: rem(88);
  padding: rem(8) rem(24);
  box-sizing: border-box;
  font-size: rem(30);
  border-bottom: 1px solid #ccc;
}
.screen-top > div {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
}
.screen-top > div.topactive {
  color: #008cee !important;
}
.top-item-box {
  // position: relative;
  display: -webkit-flex;
}
.name-box {
  flex: 1;
  text-align: center;
}
.img-box {
  width: rem(16);
  display: flex;
  align-items: baseline;
}
.screen-img-box {
  // position: absolute;
  // top: 25%;
  // right: 0;
}
.screen-img-box img {
  width: rem(16);
  height: rem(10);
}
.screen-con {
  position: absolute;
  font-size: rem(24);
  //padding: rem(34) rem(4) rem(14) rem(40);
  box-sizing: border-box;
  background-color: #fafafa;
  z-index: 100;
  width: 100%;
}
.screen-con > ul{
  display:flex;
  flex-wrap: wrap;
  padding:0 rem(5)
}
.screen-warp ul {
  width: 100%;
  height: 100%;
}
.screen-con > ul > li{
  margin: rem(10);
  padding: rem(10) rem(40);
  text-align: center;
  background-color: #f0f2f5;
}
.screen-warp ul > li {
  width: 20%;
  box-sizing: border-box;
  float: left;
  padding: rem(10);
  margin: rem(10) 2%;
  text-align: center;
  background-color: #f0f2f5;
}
.screen-warp ul > li {
  width: 40%;
  margin: rem(10) 5%;
}
.screen-con > ul > li > a,
.screen-warp ul > li > a {
  color: #b9bdc1;
}
.screen-warp {
  position: absolute;
  font-size: rem(24);
  padding: rem(34) 0 rem(14) 0;
  box-sizing: border-box;
  background-color: #fafafa;
  z-index: 100;
  width: 100%;
}
.screen-warp .clue,
.screen-warp .sales {
  width: 49%;
}
.screen-warp .carbrand,
.screen-warp .cartrain {
  width: 49%;
}
.screen-warp .carbrand ul,
.screen-warp .cartrain ul {
  height: remp(200);
  overflow-y: auto;
}
.screen-warp .carbrand ul li,
.screen-warp .cartrain ul li {
  width: 90%;
  margin: rem(10) 5%;
}
.screen-warp .cartrain {
  border-left: rem(3) solid #f0f2f5;
}
.screen-warp div h1 {
  margin-left: remp(23);
  margin-bottom: remp(8);
  color: #7e8387;
}
.active {
  background-color: #008cee !important;
}
.active a {
  color: #fff !important;
}
.layer {
  position: absolute;
  width: 100%;
  z-index: 50;
  background: rgba(0, 0, 0, 0.4);
}
.button {
  overflow: hidden;
  margin: 0 auto;
  padding-top: rem(20);
  width: rem(120) !important;
}
.screen-box {
  position: fixed;
  -webkit-transform: translateZ(0);
  top: rem(88);
  z-index: 3;
}
//居中布局
.flex-center{
  justify-content:space-between;
}
</style>
