<template>
    <div class="market">
        <page-header>
            <div slot>{{$route.query.leadCode?'新增市场活动':'市场活动'}}</div>
        </page-header>
        <div class="market-box b-white">
            <scroll :data="list" class="marketlist" :pullup="true" @scrollToEnd="scrollToEnd">
                <ul>
                    <li v-for="(item, index) in list" :key="index" @click="showmodal(item.id)">
                        <h5 class="market-title">{{item.maName}}</h5>
                        <p class="market-time">
                            <span class="market-label">活动日期：</span>
                            <span class="market-content">{{item.startTime?item.startTime.slice(0, 10) + '~' : ''}}{{item.endTime ? item.endTime.slice(0, 10) : ''}}</span>
                        </p>
                    </li>
                    <p class="loading-text" v-show="showLoading">{{lodingText()}}</p>
                </ul>
            </scroll>
        </div>
        <div v-show="!list.length && loadingNoData" class="no-data">
            <no-data :title="'暂无市场活动信息'"></no-data>
        </div>
        <div v-show="!list.length  && !loadingNoData" class="loading-container">
            <loading></loading>
        </div>
        <v-marketmodale ref="marketmodal"></v-marketmodale>
    </div>
</template>

<script>
import Vue from "vue";
import { mapActions, mapGetters, mapState } from "vuex";
import pageHeader from "@/components/header/PageHeader";
import VMarketmodale from "./marketModal";
import config from "common/config";
import api from "common/api";
import Scroll from "components/scroll/scroll";
import NoData from "components/no-data/no-data";
import Loading from "components/loading/loading";
// const GIVE_CAR = '1'
const BEING_LOADING = "正在载入...";
const NO_MORE_DATA = "暂无更多数据";
export default {
  components: {
    pageHeader,
    VMarketmodale,
    Scroll,
    NoData,
    Loading
  },
  data() {
    return {
      popupVisible: false,
      query: {
        maCodeSet: this.$route.query.maCodeSet,
        onOffFlag: "0",
        pageNums: config.pageNums,
        pageStart: 1
      },
      list: [],
      isLastPage: false,
      showLoading: false,
      loadingNoData: false,
      noMore: false,
      lastPage: 1,
      pageStart: 1
    };
  },
  computed: {
    ...mapState("marketactivity", ["marketlist"])
  },
  created() {
    this.getListInfo(1, res => {});
  },
  methods: {
    ...mapActions("marketactivity", ["queryMarketList", "getMartketDetail"]),
    lodingText() {
      if (this.showLoading && !this.noMore) {
        return config.text.beginLoading;
      } else if (this.showLoading && this.noMore) {
        return config.text.noMoreData;
      }
    },
    scrollToEnd: function() {
      this.showLoading = true;
      
      this.pageStart++;
        this.getListInfo(this.pageStart, obj => {
          this.isLastPage = obj.isLastPage;
          this.list = this.list.concat(obj.list);
        });
        if (this.lastPage < this.pageStart) {
        // let pageStart = 1;
        this.noMore = true;
        this.showLoading = true;
      } else {
        this.noMore = false;
      }
    },
    getListInfo: function(start, callBack) {
      this.query.pageStart = start;
      this.queryMarketList({
        poros: this.query,
        callBack: res => {
          if (res.data.obj.list) {
            this.loadingNoData = true;
          }
          if (this.query.pageStart == "1") {
            let data = this.marketlist;
            this.list.push(...data);
          }
          callBack(res.data.obj);
        }
      });
    },
    showmodal(val) {
      this.getMartketDetail({
        poros: { id: val },
        callBack: res => {
          api.market.getFileInfo(
            { relationCode: res.data.obj.maCode, businessType: "haibao" },
            res => {
              if (res.data.code == "success") {
                let imgInfo = res.data.obj ? res.data.obj[0] : false;
                if (imgInfo) {
                  this.$refs.marketmodal.showPopup(
                    val,
                    this.$route.query,
                    imgInfo.filePath
                  );
                } else {
                  this.$refs.marketmodal.showPopup(val, this.$route.query, "");
                }
              }
            }
          );
        }
      });
    }
  }
};
</script>
<style lang="scss">
body {
  height: 100%;
}
.market {
  height: 100%;
}
.market .no-data {
  margin: 0 auto;
  width: remp(215);
  padding-top: remp(70); 
  // height: remp(140);
  .img {
    display: block;
    width: remp(215);
    height: remp(130);
    background-image: url("/static/no-data.png");
    background-size: 100%;
  }
  p {
    font-size: remp(13);
    color: #bfc8cc;
    text-align: center;
    margin-top: remp(21);
  }
}
.market .loading-container {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
}
.market-box {
  // height: 100%;
  padding-left: remp(15);
  .marketlist {
    height: 100%;
    overflow: hidden;
    padding-right: 0 !important;
    .loading-text {
      text-align: center;
      padding: remp(10) 0;
      color: #817f79;
    }
    ul > li {
      border-bottom: 1px solid #f0f2f5;
      padding: remp(15) 0;
      .market-title {
        margin-bottom: remp(10);
        color: rgb(51, 51, 51);
      }
      .market-content {
        color: rgb(126, 131, 135);
      }
    }
    ul > li:nth-last-child(1) {
        border: none;
    }
    
  }
}
</style>
