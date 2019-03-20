<template>
    <div>
        <div v-show="!showLoading">
            <cd-head></cd-head>
            <mainInfo></mainInfo>
            <div class="bottom-pjl">
                <tabs :tabList="tabList" :tabIndex="tabIndex" @changeTab="changeTab">
                    <component :is="currentContent">
                    </component>
                </tabs>
            </div>
        </div>
        <div v-show="showLoading" class="loading-container">
            <loading ></loading>
        </div>
    </div>
</template>
<script>
import config from 'common/config.js'
import Loading from 'components/loading/loading'
import CdHead from './cd-head'
import MainInfo from './mainInfo'
import tabs from "components/tabs/tabs"
import clueinfo from "./tabs/clueinfo"
import order from "./tabs/order"
import tailafter from "./tabs/tailafter"
import { mapActions, mapGetters, mapMutations } from "vuex"

export default {
    data() {
        return {
            recommendLeadCode: '',
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
            params: {},
            showLoading: true,
        }
    },
    computed: {
        routeParam() {
            return this.$route.params.leadCode
        },
        tabIndex() {
            return this.getCurrentTabIndex
        },
        currentContent() {
            return this.getCurrentTabContent
        },
        ...mapGetters('customer', [
            'getCurrentTabIndex',
            'getCurrentTabContent'
        ])
    },
    mounted() {
        let _arr
        if (this.$route.params.flag === config.passagerFlag) {
           this.changeTab(this.tabList[2])
        } else if (this.$route.params.flag === config.customerFlag) {
           this.changeTab(this.tabList[0])
        }
        this.params = {leadCode: this.$route.params.code}
        this.setCusLeadInfo(this.params)
        // 先把登录信息( 用于区分sc/sm)放到vuex中,页面拿到这个值之后再判断
        this.setLoginInfo(() => {
            this.showLoading = false
        })
    },
    methods: {
        check() {
            let _this = this
            return (_this.$route.params.flag === config.passagerFlag)
        },
        changeTab(tab) {
            this.setCurrentTabIndex(tab.index)
            this.setCurrentTabContent(tab.component)
            if(tab.index == 2) {
                let params = {leadCode: this.$route.params.code}
                this.setCusLeadInfo(params)
            }else if(tab.index == 0) {
                this.setLoginInfo(() => {})
            }
        },
        ...mapActions({
            setCusLeadInfo: "customer/setCusLeadInfo",
            setLoginInfo: "customer/setLoginInfo"
        }),
        ...mapMutations({
            setCurrentTabIndex: "customer/SET_CURRENT_TAB_INDEX",
            setCurrentTabContent: "customer/SET_CURRENT_TAB_CONTENT"
        })
    },
    components: {
        CdHead,
        MainInfo,
        Loading,
        tabs,
        clueinfo: clueinfo,
        order: order,
        tailafter: tailafter
    }
}
</script>

<style lang="scss" scoped>
.bottom-pjl {
  width: 100%;
  background-color: #fefefe;
  margin-top: rem(30);
}
.loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
}
</style>
