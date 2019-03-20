<template>
  <div ref="container" class="vue-pull-refresh-pjl" @scroll="scrollBottom">
    <div class="vue-pull-refresh-msg-pjl">
      <div v-if="loading">
        正在加载...
      </div>
      <div v-else>
        {{msg}}
      </div>
    </div>
    <slot name="list"></slot>
    <div class="loading-pjl">
      <img v-if="imgShow" src="../../assets/imgage/Loading1.gif" alt=""> <span>{{dropDownValue}}</span>
    </div>
  </div>
  </div>
</template>
<script>
  export default {
    props: {
      next: {
        // 刷新函数
        type: Function,
        default: null
      },
      dropdown: {
        // 上拉加载
        type: Function,
        default: null
      },
      refurbish: {
        // 是否有下拉刷新
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        msg: "",
        flag: 0, // 表示是否达到刷新条件
        loading: 0, // 表示是否正在刷新中
        touchStart: 0, // 手指触摸屏幕的起点
        distance: 0, // 手指滑动的距离
        dropDownValue: "", //下拉加载显示文字
        dropDownFlag: 0, //表示是否可以下拉加载
        imgShow: false, //loading图片显示否
        isAndroid: false
      };
    },
    methods: {
      dropDownText(text) {
        if (text) {
          text || this.dropDownValue;
          this.dropDownValue = text;
          this.imgShow = false; //关闭loading图片
        } else {
          this.dropDownValue = "正在加载...";
          this.imgShow = true; //开启loading图片
        }
      },
      scrollBottom(event) {
        var h = event.target.offsetHeight; //div可视区域的高度
        var sh = event.target.scrollHeight; //滚动的高度，$(this)指代jQuery对象，而$(this)[0]指代的是dom节点
        var st = event.target.scrollTop; //滚动条的高度，即滚动条的当前位置到div顶部的距离
        if (h + st >= sh) {
          //上面的代码是判断滚动条滑到底部的代码
          this.dropDownValue = "正在加载...";
          if (this.isAndroid) {
            this.Android()
          }
          this.dropdown &&
            this.dropdown(this.dropDownText).then(() => {
              //重置数据
              this.dropDownFlag = 0;
            });
        }
      },
      Android() {
        const container = this.$refs.container;
        var containerHeight = container.offsetHeight; //获取内容的高度
        const son = container.getElementsByClassName("list")[0];
        container.addEventListener("touchstart", e => {
          containerHeight = container.offsetHeight; //每回手指碰触都去获取一下为了保险上个套子
          // 如果loading为true就代表刷新函数正在进行，此时阻止下拉操作，返回
          if (this.loading) {
            e.preventDefault();
            return;
          }
          // 取第一个手指的触摸点作为起始点
          this.touchStart = e.targetTouches[0].clientY;
        });
        container.addEventListener("touchmove", e => {
          // 如果没有触摸起始点，返回
          if (!this.touchStart) {
            return;
          }
          if (this.loading) {
            // 如果loading为true就代表刷新函数正在进行，此时阻止下拉操作，返回
            e.preventDefault();
            return;
          }
          const touch = e.targetTouches[0]; //获取当前DOM第一个触摸点的位置
          const scrollTop = container.scrollTop; //获取距离顶部的值
          //获取手指滑动的距离
          this.distance = touch.clientY - this.touchStart;
          //距离顶部距离不为0  往下滑就不可能为0了
          if (this.distance < 0) {
            //下滑的话滚动距离是负数,进入这里说明就是下滑咯
            if (+scrollTop > son.offsetHeight - containerHeight) {
              if (Math.abs(this.distance) < 80) {
                container.style.transform = "translate3D(0px, " + this.distance + "px, 0px)"; //让最外部div 跟着手指滑动起来
              }
            }
          }
        });
        container.addEventListener("touchend", e => {
          container.style.transform = "translate3D(0px, " + 0 + "px, 0px)"; //让最外部div 跟着手指滑动起来
        })
      }
    },
    mounted() {
      var u = navigator.userAgent;
      this.isAndroid = u.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
      // this.isiOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      // const container = this.$refs.container;
      // const son = container.getElementsByClassName("list")[0];
      // var containerHeight = container.offsetHeight; //获取内容的高度
      // container.addEventListener("touchstart", e => {
      //   containerHeight = container.offsetHeight; //每回手指碰触都去获取一下为了保险上个套子
      //   // 如果loading为true就代表刷新函数正在进行，此时阻止下拉操作，返回
      //   if (this.loading) {
      //     e.preventDefault();
      //     return;
      //   }
      //   // 取第一个手指的触摸点作为起始点
      //   this.touchStart = e.targetTouches[0].clientY;
      // });
      // container.addEventListener("touchmove", e => {
      //   // 如果没有触摸起始点，返回
      //   if (!this.touchStart) {
      //     return;
      //   }
      //   if (this.loading) {
      //     // 如果loading为true就代表刷新函数正在进行，此时阻止下拉操作，返回
      //     e.preventDefault();
      //     return;
      //   }
      //   const touch = e.targetTouches[0]; //获取当前DOM第一个触摸点的位置
      //   const scrollTop = container.scrollTop; //获取距离顶部的值
      //   //获取手指滑动的距离
      //   this.distance = touch.clientY - this.touchStart;
      //   if (this.refurbish) {
      //     //如果距离顶部的值等于0
      //     if (scrollTop === 0) {
      //       if (this.distance > 0) {
      //         //先阻止一个默认事件
      //         e.preventDefault();
      //         if (this.distance < 80) {
      //           //当手指滑动距离小于80的时候
      //           container.style.overflow = "inherit"; //让上面的字显示出来
      //           if (this.isiOS) {
      //             container.style.transform =
      //               "translate3D(0px, " + 0 + "px, 0px)"; //让最外部div 跟着手指滑动起来
      //           } else {
      //             container.style.transform =
      //               "translate3D(0px, " + this.distance + "px, 0px)"; //让最外部div 跟着手指滑动起来
      //           }
      //           if (this.distance > 55) {
      //             //当小于80并且大于55的时候就确定了用户不是手欠滑错了
      //             this.msg = "释放刷新"; //上面的字显示出来
      //             this.flag = 1; // 表示是否达到刷新条件
      //           } else {
      //             this.msg = "下拉刷新"; //不大于55说明不满足刷新条件 那就显示一个下拉刷新为了以防有这种情况出现被用户看到了释放刷新变成bug
      //           }
      //         }
      //       }
      //     }
      //   }
      //   //距离顶部距离不为0  往下滑就不可能为0了
      //   if (this.distance < 0) {
      //     //下滑的话滚动距离是负数,进入这里说明就是下滑咯
      //     if (+scrollTop > son.offsetHeight - containerHeight) {
      //       if (Math.abs(this.distance) < 80) {
      //         if (this.isiOS) {
      //           container.style.transform = "translate3D(0px, " + 0 + "px, 0px)"; //让最外部div 跟着手指滑动起来
      //         } else {
      //           container.style.transform =
      //             "translate3D(0px, " + this.distance + "px, 0px)"; //让最外部div 跟着手指滑动起来
      //         }
      //         if (Math.abs(this.distance) > 55) {
      //           this.dropDownValue = "释放刷新";
      //           //插到底了
      //           this.dropDownFlag = 1;
      //         } else {
      //           this.dropDownValue = "上拉刷新";
      //         }
      //       }
      //     }
      //   }
      // });
      // container.addEventListener("touchend", e => {
      //   if (this.distance === 0) {
      //     //滑动距离等于0那就直接返回了
      //     return;
      //   }
      //   if (this.loading) {
      //     //如果正在刷新那也直接返回
      //     e.preventDefault();
      //     return;
      //   }
      //   //满足刷新条件了
      //   if (this.dropDownFlag) {
      //     container.style.transform = "translate3D(0px, 0px, 0px)"; //外部div回到初始位置
      //     this.dropDownValue = "加载中...";
      //     setTimeout(() => {
      //       this.dropdown &&
      //         this.dropdown(this.dropDownText).then(() => {
      //           //重置数据
      //           this.dropDownFlag = 0;
      //         });
      //     }, 500);
      //   }
      //   // flag不为0并且滑动距离大于0的话就满足刷新条件
      //   if (this.refurbish) {
      //     if (this.flag && this.distance > 0) {
      //       //让外部div弹回去
      //       container.style.transform = "translate3D(0px, 0px, 0px)"; //外部div回到初始位置
      //       //给个flag表示正在刷新
      //       this.loading = 1;
      //       this.next &&
      //         this.next().then(() => {
      //           //刷新完了就重置一下数据
      //           this.flag = 0; //flag为0说明不满足刷新条件
      //           this.loading = 0; //没有刷新中
      //           container.scrollTop = 0; //把滚动条拉倒顶部
      //           container.style.overflow = "auto"; //外部div外部的东西隐藏掉 ，显示出来滚动条
      //           container.style.transform = "translate3D(0px, 0px, 0px)"; //外部div回到初始位置
      //         });
      //       return;
      //     }
      //   }
      //   // 不满足刷新条件也要重置下数据
      //   this.flag = 0; //flag为0说明不满足刷新条件
      //   container.style.overflow = "auto"; //外部div外部的东西隐藏掉 ，显示出来滚动条
      //   container.style.transform = "translate3D(0px, 0px, 0px)"; //外部div回到初始位置
      // });
    }
  };
</script>
<style lang="scss">
  .vue-pull-refresh-pjl {
    height: 100%;
    overflow-y: auto;
    transition: 330ms;
    -webkit-overflow-scrolling: touch;
    position: relative;
  }
  .vue-pull-refresh-msg-pjl {
    margin-top: -50px;
    height: 50px;
    text-align: center;
    line-height: 50px;
    color: #666;
    border-bottom: 1px solid #eee;
  }
  .loading-pjl {
    text-align: center;
    padding: remp(10) 0;
  }
  .loading-pjl>img {
    width: remp(30);
    height: remp(30);
    vertical-align: middle;
  }
  .list {
    background-color: #fff;
  }
</style>