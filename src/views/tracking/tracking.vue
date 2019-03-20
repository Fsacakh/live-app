<template>
    <div class="row commission todo-list">
        <scroll :data="items" ref="history" class="scroll" @scrollToEnd="scrollToEnd" :pullup="true">
            <div class="commissionTitle">
                <div class="h-title">
                    <i></i>&ensp;待办事项&ensp;<i></i>
                </div>
                <!-- 待办事项列表 -->
                <trackList :items="todoList" @itemClick="itemClick" :loadingNoData="trackLoading"></trackList>
                <!-- 历史记录列表 -->
                <history-list :items="items" :hasTitle="true" :loadingNoData="historyLoading"></history-list>
            </div>
        </scroll>
    </div>
</template>

<script>
import Scroll from "components/scroll/scroll";
import trackList from "components/trackList/trackList";
import HistoryList from 'components/history-list/history-list'
import api from "common/api";
import { mapGetters, mapMutations } from "vuex";

const INVITE_STORE = "邀约到店";
const TELEPHONE_FOLLOW = "电话跟进";
const CONTACT_RECORD = "联系记录";
const NEW_CAR_DEFEAT = "新车战败";
const OTHER = "其他";
const PAGE_NUMS = 100;

export default {
  data() {
    return {
        todoList: [],
        items: [],
        resList: [],
        trackLoading: false,
        historyLoading: false,
        // scrollList: []
    };
  },
  computed: {
    ...mapGetters("customer", [
        "getCusLeadInfo"
    ])
  },
  mounted() {
    // 待办事项列表必须先加载, 否则better - scroll 高度计算错误 => ( bug - 滚不到底 )
    // 必须确保 拿到 getCusLeadInfo 之后才能发请求  => watch
    // if(this.getCusLeadInfo) {
    //   this.getList(() => {
    //       this.getHistoryList()
    //   });
    // }
  },
  methods: {
    itemClick(item, index) {
      console.log(item)
        this.setFollowItem(this.resList[index])
        const flag = item.state == '1' ? 1 : 0
        this.$router.push({
            path: `/follow-up/update-${flag}`,
            query: {
              scheduleCode: item.scheduleCode
            }
        })
    },
    getList(success) {
      let _this = this
      let params = {
        leadCode: _this.getCusLeadInfo.leadCode,
        scCode: _this.getCusLeadInfo.scCode,
        storeCode: _this.getCusLeadInfo.storeCode,
        ignoreTime: true
      }
      api.task.queryBySc(params).then(res => {
        if (res.data.code === "success") {
          this.resList = res.data.obj
          if(!this.resList || !this.resList.length) {
            this.trackLoading = true
            success()
          }else {
              let  arr = [];
              this.resList.forEach(item => {
                let data = {
                  time: this.formatTime(item, false),
                  currentDate: item.currentDate,
                  type: item.scheduleTypeName,
                  remark: item.remark,
                  state: item.scheduleStatus,
                  scheduleCode: item.scheduleCode
                };
                arr.push(data);
              });
              this.todoList = []   // add
              arr.forEach(item => {
                let obj = {
                  time: item.time,
                  currentDate: item.currentDate,
                  type: item.type,
                  remark: item.remark,
                  state: this.compare(item),
                  scheduleCode: item.scheduleCode
                };
                this.todoList.push(obj);
              });
              success()
          }
        }
      });
    },
    // 当前时间大于任务时间, 并且状态为未完成  ( 0 )
    // currentDate  2017-11-08 12:16:08
    // taskDate     2017-12-07 23:52:00
    // 0 ( 逾期 )  1 ( 待办 )
    compare(item) {
      let currentDate = item.currentDate;
      let taskDate = item.time;
      if(!currentDate || !taskDate) {
        return
      }
      if (item.state == "0") {
        if (this.year(currentDate) - this.year(taskDate) > 0) {
          return "0";
        } else if (this.year(currentDate) == this.year(taskDate)) {
          if (this.month(currentDate) - this.month(taskDate) > 0) {
            return "0";
          } else if (this.month(currentDate) == this.month(taskDate)) {
            if (this.day(currentDate) - this.day(taskDate) > 0) {
              return "0";
            } else if (this.day(currentDate) == this.day(taskDate)) {
              if (this.hours(currentDate) - this.hours(taskDate) > 0) {
                return "0";
              } else if (this.hours(currentDate) == this.hours(taskDate)) {
                if (this.minute(currentDate) - this.minute(taskDate) > 0) {
                  return "0";
                } else if (this.minute(currentDate) == this.minute(taskDate)) {
                  console.log("当前时间和工作时间相等");
                  return '1'
                } else {
                  return "1";
                }
              } else {
                return "1";
              }
            } else {
              return "1";
            }
          } else {
            return "1";
          }
        } else {
          return "1";
        }
      } else {
        return "1";
      }
    },
    year(date) {
      return date.substring(0, 4);
    },
    month(date) {
      return date.substring(5, 7);
    },
    day(date) {
      return date.substring(8, 10);
    },
    hours(date) {
      return date.substring(11, 13);
    },
    minute(date) {
      return date.substring(14, 16);
    },
    // 历史记录列表
    getHistoryList(s = 1) {
        let params = {
            leadCode: this.getCusLeadInfo.leadCode,
            scheduleStatus: 1,       // 已完成
            pageStart: s,
            pageNums: PAGE_NUMS
        }
        api.customer.queryHistoryList(params).then(res => {
            let obj = res.data.obj
            if(!obj.list.length) {
              this.historyLoading = true
            }
            if(res.data.code === 'success' && obj.list) {
                this.items = []  // add
                obj.list.forEach(item => {
                    let data = {
                        navTitle: this.getNavTitle(item),
                        title: item.scheduleTypeName,
                        // time: this.formatTime(item),
                        time: item.updateTimeStr.substring(0, 16),
                        scName: item.updateBy,
                        remark: item.remark
                    }
                    this.items.push(data)
                })
                // this.scrollList = this.items.concat(this.todoList)
            }
        })
    },
    scrollToEnd() {
      // 滚动加载
    },
    getNavTitle(item) {
        let name = item.scheduleTypeName
        // 后续优化  swich case
        if(name === TELEPHONE_FOLLOW) {
            return '电话'
        }else if(name === INVITE_STORE) {
            return '预约'
        }else if(name === CONTACT_RECORD) {
            return '联系'
        }else if(name === NEW_CAR_DEFEAT) {
            return '战败'
        }else if(name === OTHER) {
            return '其他'
        }
    },
    formatTime(item, flag = true) {
      if (item.scheduleTypeName === INVITE_STORE && item.arrivalTime) {
        return flag ? item.arrivalTime.substring(0, 16).replace(/-/g, '/') : item.arrivalTime.substring(0, 16);
      } else if (item.scheduleTypeName === TELEPHONE_FOLLOW && item.telephoneFollowUpTime) {
          return flag ? item.telephoneFollowUpTime.substring(0, 16).replace(/-/g, '/') : item.telephoneFollowUpTime.substring(0, 16);
      } else if (item.scheduleTypeName === OTHER && item.scheduleTime) {
        return flag ? item.scheduleTime.substring(0, 16).replace(/-/g, '/') : item.scheduleTime.substring(0, 16);
      }
    },
    ...mapMutations({
        setFollowItem: 'customer/SET_FOLLOW_ITEM'
    })
  },
  watch: {
    getCusLeadInfo() {
      this.getList(() => {
          this.getHistoryList()
      });
    }
  },
  components: {
    trackList,
    Scroll,
    HistoryList
  }
};
</script>

<style lang="scss" scoped>
.commission {
  margin-top: rem(2);
}
.h-title {
  padding: rem(17);
  text-align: center;
  font-size: rem(22);
  background-color: #ededed;
}
.h-title i {
  display: inline-block;
  width: rem(8);
  height: rem(8);
  background-color: #bdc7d1;
  vertical-align: middle;
  border-radius: 50%;
  position: relative;
}
.h-title > i::after {
  position: absolute;
  content: "";
  height: rem(4);
  width: rem(60);
  background: linear-gradient(to right, #bdc7d1, transparent);
}
.h-title i:nth-child(1)::after {
  top: 50%;
  right: rem(20);
  transform: translate(0, -50%);
  background: linear-gradient(to left, #bdc7d1, transparent);
}
.h-title i:nth-child(2)::after {
  top: 50%;
  left: rem(20);
  transform: translate(0, -50%);
}

// creat by lwx
.todo-list {
    position: fixed;
    -webkit-transform: translateZ(0);
    width: remp(375);
    top: remp(238);
    bottom: 0;
    .scroll {
        height: 100%;
        overflow: hidden;
        background-color: #fff;
        .commissionTitle {

        }
    }
}
.content {
    width: remp(298) !important;
}

</style>
