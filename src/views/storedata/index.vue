
<template>
    <div>
        <page-header>
            <div slot>4S门店数据</div>
        </page-header>
        <div>
            <div class="top-time-choose tc">
                <span @click="openStartPicker">{{startTime}}</span>-<span @click="openEndPicker">{{endTime}}</span>
            </div>
            <div class="total-contracts">
                <div class="triangle-topleft"></div>
                <div class="first-row">
                    <div class="store-data-icon">
                      <img  src="/static/sell.png" alt="">
                        <span>
                          销售
                        </span>
                    </div>
                    <div>       
                      <h3 class="first-row-title">总合同数</h3>
                    </div>
                    <div class="car-total">
                        <i>78</i>台
                    </div>                    
                </div>
                <div class="line"> </div>
                <div class="second-row">
                    <div>
                        <p class="title">总交车数</p>
                        <p><i>61</i> 台</p>                        
                    </div>
                    <div class="tail"></div>
                    <div>
                        <p class="title">总交车数</p>
                        <p><i>2,000</i> 万元</p>      
                    </div>
                    <div class="tail"></div>                    
                    <div>
                       <p class="title">销售综合毛利</p>
                        <p><i>114</i>万元</p>      
                    </div>
                </div>
            </div>
            <div class="total-contracts">
                <div class="triangle-topleft"></div>
                <div class="first-row">
                    <div class="store-data-icon" >
                      <img src="/static/customer-service.png" alt="">
                        <span>售后</span>
                    </div>
                    <div>       
                      <h3 class="first-row-title">在库库存</h3>
                    </div>
                    <div class="car-total">
                        <i>156</i>次
                    </div>                    
                </div>
                <div class="line"> </div>
                <div class="second-row">
                    <div>
                        <p class="title">60天以上库龄</p>
                        <p><i>13</i>台</p>                        
                    </div>
                    <div class="tail"></div>
                    <div>
                        <p class="title">已订单库存</p>
                        <p><i>10</i>台</p>      
                    </div>
                    <div class="tail"></div>                    
                    <div>
                       <p class="title">在途库存</p>
                        <p><i>15</i>台</p>      
                    </div>
                </div>
            </div>
            <div class="customer-service">
                <div class="triangle-topleft"></div>
                  <div class="first-row">
                    <div class="store-data-icon">
                      <img  src="/static/customer-service1.png" alt="">                      
                        <span>售后</span>
                    </div>
                </div>
                <div class="await">
                    敬请期待
                </div>
            </div>
        </div>
          <mt-datetime-picker
          ref="picker"
          v-model="pickerVisible"
          type="date"
          year-format="{value} 年"
          month-format="{value} 月"
          date-format="{value} 日"
          @confirm="confirmDate">
          </mt-datetime-picker>
    </div>
    
</template>

<script>
import Vue from "vue";
import PageHeader from "components/header/PageHeader";
import { DatetimePicker } from "mint-ui";
Vue.component(DatetimePicker.name, DatetimePicker);
export default {
  components: {
    PageHeader
  },
  data() {
    return {
      rightOptions: {
        icon: ""
      },
      pickerVisible: "",
      startTime: "2008/01/01",
      endTime: "2028/12/31",
      startORend: true
    };
  },
  methods: {
    openStartPicker() {
      this.$refs.picker.open();
      this.startORend = true;
    },
    openEndPicker() {
      this.$refs.picker.open();
      this.startORend = false;
    },
    format(date) {
      var o = {
        y: date.getFullYear(), //年份
        M: date.getMonth() + 1, //月份
        d: date.getDate() //日
      };
      return o;
    },
    confirmDate(date) {
      let dateformat = this.format(date);
      let str = `${dateformat.y}/${
        dateformat.M < 10 ? "0" + dateformat.M : dateformat.M
      }/${dateformat.d < 10 ? "0" + dateformat.d : dateformat.d}`;
      if (this.startORend) {
        this.startTime = str;
      } else {
        this.endTime = str;
      }
    }
  },
  mounted() {}
};
</script>

<style lang="scss">
.top-time-choose {
  padding: remp(10) 0;
  background-color: #fff;
  font-size: remp(16);
}
.total-contracts,
.customer-service {
  position: relative;
  height: remp(162);
  background-color: #fff;
  margin: 0 remp(10);
  margin-top: remp(21);
  box-shadow: 0 remp(2) remp(4) 0 rgba(15, 5, 7, 0.3);
  .triangle-topleft {
    position: absolute;
    left: 0;
    top: 0;
    width: 0;
    height: 0;
    border-top: remp(80) solid #f2f2f2;
    border-right: remp(150) solid transparent;
  }
  .first-row {
    display: flex;
    position: relative;
    z-index: 1;
    flex-direction: row;
    justify-content: space-between;
    margin: 0 remp(20);
    height: remp(50);
    align-items: center;
    .first-row-title {
      font-size: remp(15);
    }
    .car-total i {
      color: #008cee;
      margin-right: remp(5);
    }
  }
  .line {
    width: remp(240);
    height: 1px;
    background-color: #e6e6e6;
    margin-top: remp(20);
    margin-left: remp(100);
    margin-bottom: remp(20);
  }
  .second-row {
    display: flex;
    height: remp(50);
    flex-direction: row;
    justify-content: space-between;
    margin-left: remp(40);
    margin-right: remp(20);
    div {
      .title {
        margin-bottom: remp(10);
      }
      p {
        text-align: center;
      }
      p i {
        color: #008cee;
        margin-right: remp(5);
        font-size: remp(12);
      }
    }
    .tail {
      width: 1px;
      background-color: #e6e6e6;
      height: remp(45);
      margin-top: remp(10);
    }
  }
}
.customer-service {
  background-color: #bcbcbc;
  .triangle-topleft {
    border-top: remp(80) solid #b3b3b3;
  }
  .await {
    text-align: center;
    color: #fff;
    font-size: remp(20);
  }
}
.store-data-icon span{
  color:#666666;
}
.store-data-icon img{
  display: block;
  width: remp(25);
  margin-bottom: remp(3);
  margin-top: remp(8);  
}
</style>
