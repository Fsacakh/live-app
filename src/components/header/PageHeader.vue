<template>
  <div class="header-warp">
    <div class="header max-width" :style="styleIn">
      <div class="header-left">
        <slot name="overwrite-left">
          <transition :name="transition">
            <a class="header-back" v-show="_leftOptions.showBack" @click="onClickBack"></a>
          </transition>
          <transition :name="transition">
            <div class="left-arrow" @click="onClickBack" v-show="_leftOptions.showBack && leftOptions.icon == ''"></div>
          </transition>
        </slot>
        <a class="icon iconfont" :class="leftOptions.icon"  @click="$emit('on-click-left')"></a>
        <slot name="left"></slot>
      </div>
      <h1 class="header-title" @click="$emit('on-click-title')">
        <slot>
          <transition :name="transition">
            <span v-show="title">{{title}}</span>
          </transition>
        </slot>
      </h1>
      <div class="header-right"  @click="$emit('on-click-right')">
        <a class="icon iconfont" :class="rightOptions.icon"></a>
        <slot name="right" v-show="rightOptions.icon != ''"></slot>
        <slot name="couponpreserve"></slot>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'page-header',
    props: {
      leftOptions: {
        type: Object,
        default () {
          return {
            icon: ''
          }
        }
      },
      styleIn:'',
      title: String,
      transition: String,
      rightOptions: {
        type: Object,
        default () {
          return {
            icon: ''
          }
        }
      }
    },
    computed: {
      _leftOptions() {
        return Object.assign({
          showBack: true,
          preventGoBack: false
        }, this.leftOptions || {})
      }
    },
    methods: {
      onClickBack() {
        if (this._leftOptions.preventGoBack) {
          this.$emit('on-click-back',this.$route.query.from)
        } else {
          this.$router ? this.$router.back() : window.history.back()
        }
      }
    }
  }
</script>

<style lang="scss">
  .header {
    position: fixed;
    -webkit-transform: translateZ(0);
    top: 0;
    z-index: 1001;
    width: 100%;
    padding: rem(3) 0;
    box-sizing: border-box;
    background-image: $browser-default-image-blue;
  }
  .header .header-title,
  .header h1 {
    margin: 0 rem(88);
    line-height: rem(88);
    text-align: center;
    height: rem(88);
    font-size: rem(34);
    font-weight: 400;
    width: auto;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    color: $browser-default-color-white;
  }
  .header .header-title>span {
    display: inline-block;
  }
  .header .header-left,
  .header .header-right {
    position: absolute;
    top: rem(23);
    display: block;
    font-size: rem(28);
    line-height: rem(42);
    color: $browser-default-color-white;
  }
  .header .header-left a,
  .header .header-left button,
  .header .header-right a,
  .header .header-right button {
    float: left;
    margin-right: rem(32);
    color: $browser-default-color-white;
  }
  .header .header-left a:active,
  .header .header-left button:active,
  .header .header-right a:active,
  .header .header-right button:active {
    opacity: .5
  }
  .header .header-left {
    left: rem(32);
  }
  .header .header-left .header-back {
    padding-left: rem(32);
  }
  .header .header-left .left-arrow {
    position: absolute;
    width: rem(60);
    height: rem(60);
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
  .header .header-left .icon {
    font-size: rem(45);
  }
  .header .header-right {
    right: rem(30)
  }
  .header .header-right a,
  .header .header-right button {
    margin-left: 8px;
    margin-right: 0
  }
  .header .header-right .icon {
    font-size: rem(45) !important;
  }
  .header-fade-in-right-enter-active {
    animation: fadeinR .5s;
  }
  .header-fade-in-left-enter-active {
    animation: fadeinL .5s;
  }
  @keyframes fadeinR {
    0% {
      opacity: 0;
      transform: translateX(150px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
  @keyframes fadeinL {
    0% {
      opacity: 0;
      transform: translateX(-150px);
    }
    100% {
      opacity: 1;
      transform: translateX(0);
    }
  }
  .header-warp{
    height:  rem(88);
  }
</style>
