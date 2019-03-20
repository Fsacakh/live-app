<template>
  <div>
    <page-header :leftOptions="leftOptions" :rightOptions="rightOptions" @on-click-right="switchNodeStatus">
      <div slot>订单审批</div>
      <div slot="right">
          <p class="right-text">{{ hasApproved ? '待审批': '已审批'}}</p>
      </div>
    </page-header>
    <div class="searchInput p-l-10 p-r-10">
      <div class="positionContainer">
        <div class="search-icon" @click="searchByCondition">
          <i class="iconfont sousuo icon-icon-sousuo"></i>
        </div>
        <input type="text" v-model="condition" placeholder="请输入手机号/客户姓名">
        <div class="delete-icon" @click="removeCondition">
          <i class="iconfont icon-guanbi"></i>
        </div>
      </div>
    </div>
    <div class="list-box" v-show="orderApproveItems.length">
      <scroll class="list" :pullup="true" :data="orderApproveItems" @scrollToEnd="scrollToEnd">
        <div class="box">
          <order-approve-item v-for="(item, index) in orderApproveItems" :orderApproveInfo="item" :flag="flag" :key="index">
          </order-approve-item>
         <p class="loading-text" v-show="showLoading">{{lodingText()}}</p>
        </div>
      </scroll>
    </div>
    <div v-show="!orderApproveItems.length && loadingNoData" class="no-data-box">
      <no-data title="暂无审批"></no-data>
    </div>
    <div v-show="!orderApproveItems.length && !loadingNoData" class="loading-container">
      <loading></loading>
    </div>
  </div>
</template>

<script>
  import pageHeader from '@/components/header/PageHeader'
  import orderApproveItem from '@/components/orderApproveItem'
  import api from '@/common/api.js'
  import config from '@/common/config.js'
  import common from '@/common/common'
  import Scroll from 'components/scroll/scroll'
  import NoData from 'components/no-data/no-data'
  import Loading from 'components/loading/loading'
  import { Toast } from 'mint-ui'
  import {
    mapState,
    mapGetters,
    mapActions
  } from 'vuex';
  const BEING_LOADING = '正在载入...'
  const NO_MORE_DATA = '暂无更多数据'
  export default {
    data: function() {
      return {
        orderList: {
          orderNoSet: [],
          custName: '',
          custMobile: ''
        },
        orderApproveItems: [
        ],
        orderNoSet: [],
        flag: config.notApprovedFlag,
        nodeStatus: -1,
        lastPage: 1,
        pageStart: 1,
        showLoading: false,
        loadingNoData: false,
        noMore: false,
        condition: '',
        leftOptions: {
            icon: "",
            showBack: true
        },
        rightOptions: {
            icon: "icon-icon-shenpiqiehuan",
            showMore: false
        }
      }
    },
    mounted() {
      if (!this.hasApproved) {
          this.flag = config.notApprovedFlag
          this.$data.nodeStatus = -1
          this.queryOrderWfInfoByPostnCode();
      } else {
          this.flag = config.hasApprovedFlag
          this.$data.nodeStatus = 1
          this.queryOrderWfInfoByPostnCode()
      }
    },
    computed: {
        ...mapState('orderApprove', [
            'hasApproved'
        ])
    },
    methods: {
      lodingText() {
        if (this.showLoading && !this.noMore) {
          return BEING_LOADING
        } else if (this.showLoading && this.noMore) {
          return NO_MORE_DATA
        }
      },
      switchNodeStatus() {
        let _this = this
        _this.pageStart = 1;
        _this.orderApproveItems = []
        if (!_this.hasApproved) {
           _this.setApproved()
           _this.$data.nodeStatus = 1
           _this.flag = config.hasApprovedFlag
           _this.queryOrderWfInfoByPostnCode()
        } else {
           _this.resetApproved() 
           _this.$data.nodeStatus = -1
           _this.flag = config.notApprovedFlag 
           _this.queryOrderWfInfoByPostnCode()
        }
      },
      searchByCondition () {
        const _this = this
        if(_this.condition != '') {
          _this.orderApproveItems = []
          _this.pageStart = 1
          _this.queryOrderWfInfoByPostnCode()
        }else {
          // Toast('请输入搜索条件')
        }
      },
      queryOrderWfInfoByPostnCode() {
        var $this = this;
        api.orderApprove.queryOrderInfoApprovalByKeywords({
          custName: this.orderList.custName,
          custMobile: this.orderList.custMobile,
          nodeStatus: this.nodeStatus,
          pageNums: config.pageNums,
          pageStart: this.pageStart
        }, function(res) {
          if (res.data.code == 'success' && res.data.obj) {
            var data = res.data.obj.list;
            $this.showLoading = false
            if (!data.length) {
              $this.loadingNoData = true
              Toast('订单信息不存在')
            } else {
              $this.lastPage = res.data.obj.lastPage;
              let list = res.data.obj.list;
              $this.setData(list);
            }
          }
        });
      },
      setData(data) {
        var $this = this,
          obj = {};
        //$this.orderApproveItems.length = 0;
        for (var i = 0, len = data.length; i < len; i++) {
          var key = {
            orderNo: data[i].orderNo,
            updateTimeStr: data[i].updateTimeStr,
            carName: data[i].carOrderInfoVoList[0].carOrderDetailInfoList[0].carName,
            custMobile: data[i].custMobile,
            storeName: data[i].storeName,
            salesEmpName: data[i].salesEmpName,
            custName: data[i].custName,
            //orderType:'', //orderType为True 订单，false 为意向订单
            // currentOrderWfTypeName: data[i].carOrderInfoVoList[0].currentOrderWfTypeName
            currentOrderWfTypeName: data[i].orderWorkflowInfoVo.wfTypeName
          }
          $this.orderApproveItems.push(key);
          obj[data[i].orderNo] = data[i];
        }
        //数据放到vuex 详情页面获取
        this.$store.dispatch('orderApprove/insertOrderInfo', obj);
      },
      scrollToEnd() {
        this.showLoading = true
        var $this = this;
        if ($this.lastPage <= $this.pageStart) {
          this.noMore = true
          return;
        }
        $this.pageStart++;
        this.queryOrderWfInfoByPostnCode();
      },
      removeCondition() {
        const _this = this
        _this.condition = ""
        // _this.queryOrderWfInfoByPostnCode(_this.orderList)
      },
      ...mapActions('orderApprove', [
          'setApproved',
          'resetApproved'
      ])
    },
    watch: {
      'condition':function(value1, value2) {
        if(value1 != '') {
          let judgeValue = value1 - 0
          if(judgeValue) {
            this.orderList.custMobile = value1
          }else {
            this.orderList.custName = value1
          }
        }else {
          this.orderList.custName = ''
          this.orderList.custMobile = ''
        }
      }
    },
    components: {
      pageHeader,
      orderApproveItem,
      Scroll,
      NoData,
      Loading
    }
  }
</script>
<style lang="scss" scoped>
  .searchInput {
    height: remp(43);
    padding-top: remp(10);
    padding-bottom: remp(3);
    .positionContainer {
      position: relative;
      .search-icon {
        position: absolute;
        top: 50%;
        left: remp(5);
        transform: translate(0, -50%);
        // font-size: remp(15);
        i {
          font-size: remp(25);
        }
      }
      .delete-icon {
        position: absolute;
        top: 50%;
        right: remp(5);
        transform: translate(0, -50%);
        // font-size: remp(15);
        i {
          font-size: remp(12);
          color: #777;
        }
      }
      input {
        height: remp(30);
        width: 100%;
        box-sizing: border-box;
        padding-left: remp(30);
        border-radius: remp(5);
        text-align: left;
      }
      input::-webkit-input-placeholder {
        text-align: left;
      }
    }  
  }
  .list-box {
    position: fixed;
    -webkit-transform: translateZ(0);
    top: remp(90);
    width: 3.75rem;
    bottom: 0;
    .list {
      background-color: #fff;
      height: 100%;
      overflow: hidden;
    }
  }
  .no-data-box {
    margin-top: 50%;
  }
  .loading-text {
    text-align: center;
    padding: remp(10) 0;
    color: #817F79;
  }
  .loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
  .header .header-right .icon {
     font-size: remp(20) !important;
     text-align: center;
  }
  .right-text {
    font-family: PingFangSC-Regular;
    font-size: remp(10) !important;
    line-height: remp(12) !important; 
    color: #FFFFFF;
  }
</style>
