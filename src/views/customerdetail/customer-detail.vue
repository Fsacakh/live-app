
<template>
    <div class="">
       <div class="pr">
            <page-header @on-click-right="rightClick">
                <div slot="right">
                    <i class="iconfont icon-icon-zhihuan"></i>
                </div>
            </page-header>
            <div class="lwx-box">
                <popup :list="list" :popupVisible="popupVisible" @showModal="showModal"></popup>
            </div>
       </div>
        <div class="oh">
            <div class="background-pjl">
            </div>
            <div class="card-warp-pjl pr">
                <div class="card-pjl pa">
                    <div class="detail-pjl clearfix">
                        <div class="headportrait-pjl pr fl">
                            <headportrait :name="getCusLeadInfo.intentionLevelName"
                                          :badge="2" :sex="getCusLeadInfo.customGender">
                            </headportrait>
                        </div>
                        <div class="name-pjl fl pr">
                            <div class="content-pjl pa">
                                <p>{{getCusLeadInfo.customName}}</p>
                                <p>{{getCusLeadInfo.mobilePhone | phoneFilter}}</p>
                            </div>
                        </div>
                        <div class="nav-pjl fl pr">
                            <div class="content-pjl pa tr">
                                <div class="button-pjl pr">
                                    <span class="bianji-pjl b-white pa"><i class="iconfont icon-icon-bianji"></i></span>
                                    <a class="white" href="/personaldata">查看个人资料</a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="toolbar-pjl clearfix">
                        <div class="pr" @click="toFollowUp">
                            <a href="JavaScript:;">
                                <div class="pa toolbarwarp-pjl tc">
                                    <i class="iconfont icon-icon-rili"></i>
                                    <p>新建跟进</p>
                                </div>
                            </a>
                        </div>
                        <div class="pr">
                            <a href="tel:13262239223">
                                <div class="pa toolbarwarp-pjl tc">
                                    <i class="iconfont icon-icon-dianhua"></i>
                                    <p>电话沟通</p>
                                </div>
                            </a>
                        </div>
                        <div class="pr">
                            <a href="sms:13262239223">
                                <div class="pa toolbarwarp-pjl tc">
                                    <i class="iconfont icon-icon-duanxin"></i>
                                    <p>发送短信</p>
                                </div>
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="bottom-pjl">
            <tabs :tabList="tabList" :tabIndex="tabIndex" @changeTab="changeTab">
                <component :is="currentContent">
                </component>
            </tabs>
        </div>
        <!-- sc - modal -->
        <modal title="进店时间表" ref="modal">
            <m-time></m-time>
        </modal>
        <!-- sm - modal -->
        <modal title="请选择分配销售顾问" ref="soltModal">
            <div class="sc-box clearfix">
                <div class="item-box" v-for="(item,index) in selectlist" :key="index">
                    <div>
                       {{item.scName}}(&nbsp;<span>{{item.num}}</span>人&nbsp;)
                    </div>
                </div>
            </div>
        </modal>
    </div>
</template>
<script>
import tabs from "components/tabs/tabs"
import headportrait from "components/headportrait/headportrait"
import clueinfo from "./clueinfo"
import order from "./order"
import tailafter from "./tailafter"
import PageHeader from "components/header/PageHeader"
import Popup from "components/popup/popup"
import Modal from 'components/modal/index'
import MTime from './m-time'
import api from "common/api"
import { mapActions, mapGetters } from "vuex"
export default {
    data() {
        return {
            tabIndex: 0,
            currentContent: "clueinfo",
            tabList: [
                {
                    index: 0,
                    name: "线索信息",
                    component: "clueinfo"
                },
                {
                    index: 1,
                    name: "订单",
                    component: "order"
                },
                {
                    index: 2,
                    name: "客户跟踪",
                    component: "tailafter"
                }
            ],
            sclist: [
                {
                    name: "推荐客户",
                    path: `/customer-addclue/${this.$route.params.code}`,
                    iconClass: "icon-icon-zhihuan"
                },
                {
                    name: "进店时间表",
                    iconClass: "icon-icon-yanbao"
                }
            ],
            smlist: [
                {
                    name: "线索重新分配",
                    iconClass: "icon-icon-zhihuan"
                }
            ],
            popupVisible: false,
            userName: 'sc',
            list: [],
            selectlist: [
                {
                    scName: '鲁汶祥',
                    num: '8'
                },
                {
                    scName: '鲁汶祥',
                    num: '8'
                },
                {
                    scName: '鲁汶祥',
                    num: '8'
                },
                {
                    scName: '鲁汶祥',
                    num: '8'
                },
                {
                    scName: '鲁汶祥',
                    num: '8'
                },
                {
                    scName: '鲁汶祥',
                    num: '8'
                },
                {
                    scName: '鲁汶祥',
                    num: '8'
                },
                {
                    scName: '鲁汶祥',
                    num: '8'
                },
            ]
        }
    },
    mounted() {
        let params = { leadCode: this.$route.params.code }
        this.setCusLeadInfo(params)
        // 先把登录信息( 用于区分sc/sm)放到vuex中,页面拿到这个值之后再判断
        this.setLoginInfo(() => {

        })
        this.userInfo()
    },
    computed: {
        ...mapGetters("customer", [
            "getCusLeadInfo",
            "getLoginInfo"
        ])
    },
    methods: {
        changeTab(tab) {
            this.tabIndex = tab.index
            this.currentContent = tab.component
        },
        rightClick() {
            this.popupVisible = !this.popupVisible
        },
        showModal() {
            if(this.userName === 'sc') {
                this.$refs.modal.open()
                this.popupVisible = false
            }else {
                this.$refs.soltModal.open()
                this.popupVisible = false
            }
        },
        userInfo() {
            if(this.userName === 'sc') {
                this.list = this.sclist
            }else {
                this.list = this.smlist
            }
        },
        toFollowUp() {
            this.$router.push({
                path: '/follow-up'
            })
        },
        ...mapActions({
            setCusLeadInfo: "customer/setCusLeadInfo",
            setLoginInfo: "customer/setLoginInfo"
        })
    },
    filters: {
        phoneFilter(val) {
            if (val) {
                return `${val.substring(0, 3)}****${val.substring(8, 11)}`;
            }
        }
    },
    components: {
        tabs,
        clueinfo: clueinfo,
        order: order,
        tailafter: tailafter,
        headportrait,
        PageHeader,
        Popup,
        Modal,
        MTime
    }
}
</script>

<style lang="scss">
.background-pjl {
  height: rem(100);
  background-image: linear-gradient(-180deg, #36acfe 0, #36acfe 100%);
}
.card-warp-pjl {
  height: rem(167);
}
.card-pjl {
  height: rem(267);
  width: 90%;
  background-color: #fff;
  border-radius: rem(6);
  box-shadow: 0 2px 4px 0 rgba(155, 155, 155, 0.5);
  transform: translateX(-50%);
  top: rem(-100);
  left: 50%;
}
.detail-pjl {
  height: rem(180);
}
.headportrait-pjl {
  width: 20%;
  height: 100%;
}
.name-pjl {
  width: 40%;
  height: 100%;
}
.name-pjl .content-pjl {
  top: 50%;
  transform: translateY(-50%);
}
.name-pjl p {
  font-size: rem(28);
}
.name-pjl p:nth-child(1) {
  font-family: PingFangSC-Medium;
  margin-bottom: rem(5);
}
.name-pjl p:nth-child(2) {
  font-family: PingFangSC-Regular;
}
.nav-pjl {
  width: 40%;
  height: 100%;
}
.nav-pjl .content-pjl {
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.button-pjl {
  width: rem(247);
  height: rem(60);
  background: rgba(54, 172, 254, 0.8);
  line-height: rem(60);
  border-radius: rem(30) 0 0 rem(30);
}
.button-pjl a {
  margin-right: rem(25);
}
.toolbar-pjl {
  height: rem(96);
}
.toolbar-pjl > div {
  width: 33.33%;
  height: 100%;
  float: left;
}
.toolbarwarp-pjl {
  left: 50%;
  transform: translateX(-50%);
  width: rem(90);
  /* height: rem(90); */
  font-size: rem(20);
}
.toolbarwarp-pjl p {
  margin-top: 0.05rem;
}
.bottom-pjl {
  width: 100%;
  /* height: rem(300); */
  background-color: #fefefe;
  margin-top: rem(30);
}
a {
  color: #333;
}
.bianji-pjl {
  display: inline-block;
  width: rem(30);
  height: rem(30);
  border-radius: 50%;
  top: 50%;
  left: rem(20);
  transform: translateY(-50%);
  line-height: rem(30);
  text-align: center;
}

.lwx-box .popup-pjl {
  bottom: remp(-86) !important;
  left: remp(252) !important;
}
.lwx-box .triangle-pjl {
  top: remp(-10) !important;
  left: remp(70) !important;
}
.sc-box {
    color: #7C817F;
    padding: remp(15) 0;
    padding-bottom: remp(20);
    .item-box {
        float: left;
        width: 30%;
        padding: remp(5);
        div {
            height: remp(31);
            background-color: #F0F2F4;
            display: flex;
            justify-content: center;
            align-items: center;
            border-radius: 2px;
            span {
                color: rgba(54, 172, 254, 0.8);
            }
        }
        div:hover {
            background-color: #008BEC;
            color: #fff;
            span {
                color: #fff;
            }
        }
    }
}

</style>
