<template>
  <div class="footer-warp">
    <div class="footer">
      <!-- 首页 -->
      <div class="home-page" @click="homePage">
        <div v-show="!isSelectedHomePage"><img src="../../assets/imgage/homePage.png" alt=""></div>
        <div v-show="isSelectedHomePage"><img src="../../assets/imgage/selectedHomePage.png" alt=""></div>
        <div :class="{selectedHomePage: isSelectedHomePage}">首页</div>
      </div>
      <!-- 客户中心 -->
      <div class="customer-center" @click="customerCenter">
        <div v-show="!isSelectedCustomerCenter"><img src="../../assets/imgage/customerCenter.png" alt=""></div>
        <div v-show="isSelectedCustomerCenter"><img src="../../assets/imgage/selectedCustomerCenter.png" alt=""></div>
        <div :class="{selectedCustomerCenter: isSelectedCustomerCenter}">客户中心</div>
      </div>
      <!-- 消息 -->
      <div class="message" @click="message">
        <div v-show="!isSelectedMessage"><img src="../../assets/imgage/message.png" alt=""></div>
        <div v-show="isSelectedMessage"><img src="../../assets/imgage/selectedMessage.png" alt=""></div>
        <div :class="{selectedMessage: isSelectedMessage}">消息</div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'page-bottom',
    data() {
      return {
        isSelectedHomePage: true,
        isSelectedCustomerCenter: false,
        isSelectedMessage: false,
      }
    },
    methods: {
      // 点击首页按钮
      homePage() {
        this.isSelectedHomePage = true;
        this.isSelectedCustomerCenter = false;
        this.isSelectedMessage = false;
        this.$router.push('/homepage')   // 跳转到首页
      },
      // 点击客户中心按钮
      customerCenter() {
        this.isSelectedHomePage = false;
        this.isSelectedCustomerCenter = true;
        this.isSelectedMessage = false;
        this.$router.push('/customer-center')   // 跳转到客户中心界面
      },
      // 点击消息按钮
      message() {
        this.isSelectedHomePage = false;
        this.isSelectedCustomerCenter = false;
        this.isSelectedMessage = true;
        this.$router.push('/notification')   // 跳转到消息界面
      }
    }
  }
</script>

<style lang="scss">
.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 1001;
  box-sizing: border-box;
  background-color: white;
}
.selectedHomePage {
  color: #008CF0;
}
.selectedCustomerCenter {
  color: #008CF0;
}
.selectedMessage {
  color: #008CF0;
}
.footer-warp {
  background-color: white;
  .home-page {
    width: 33.3%;
    float: left;
    text-align: center;
    color: #C0C3C5;
    padding: remp(4) 0;
  }
  .customer-center {
    width: 33.3%;
    float: left;
    text-align: center;
    color: #C0C3C5;
    padding: remp(4) 0;
  }
  .message {
    width: 33.3%;
    float: left;
    text-align: center;
    color: #C0C3C5;
    padding: remp(4) 0;
  }
}
</style>


