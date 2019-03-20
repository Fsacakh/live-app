
<template>
    <div class="box">
        <div class="status">
            <p>{{title}}</p>
            <button class="btn-status">{{obj.leadStatus}}</button>
        </div>
        <div class="ditchSource">
            <div class="ditch">
                <label>渠道:</label>&nbsp;<p>{{obj.channelName}}</p>
            </div>
            <div class="source">
                <label>来源:</label>&nbsp;<a v-if="this.customName !== ''" class="skip" href="javascript:void(0)" @click="skip">{{this.customName}}</a><span v-else>{{obj.sourceName}}</span>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex'
    import config from 'common/config' 
    import api from 'common/api'
    export default {
        props: {
            data: {
                type: Object,
                default: () => {}
            },
            title: {
                type: String,
                default: '销售状态'
            }
        },
        data() {
            return {
                obj: {},
                recommendLeadCode: '',  //推荐人code
                customName: ''  //来源显示人名
                
            }
        },
        computed: {
            ...mapGetters("customer", [
                "getCusLeadInfo"
            ])
        },
        mounted() {
            if(this.$route.name === 'customer-detail') {
                this.obj = {
                    leadStatus: this.handleData(),     
                    channelName: this.getCusLeadInfo.channelName,
                    sourceName: this.getCusLeadInfo.sourceName
                }
            }
        },
        methods: {
            //来源 推荐人
            recommend(leadCode) {
                let data = {leadCode: leadCode};
                api.lead.queryLeadDetail(data).then(res => {
                    if(res.data.code === 'success' && res.data.obj.length > 0) {
                        this.customName = res.data.obj[0].customName;
                    }
                })
            },
            ...mapActions({
                setCusLeadInfo: "customer/setCusLeadInfo"
            }),
            skip() {
                if(this.recommendLeadCode) {
                    this.$router.push({path: `/customer-detail/${this.recommendLeadCode}/customer`});
                }
            },
            // 线索状态
            handleData() {
                const leadInfo = this.getCusLeadInfo
                if(leadInfo.defeatStatus < 0) {
                    return '准战败'
                }else if(leadInfo.salesLeadsStatusInfoVos && leadInfo.salesLeadsStatusInfoVos[0] && leadInfo.salesLeadsStatusInfoVos[0].tryDriveStatus > 0) {
                    return '试乘试驾'
                }else if(leadInfo.inStoreFlag > 0) {
                    return '到店'
                }else if(leadInfo.appointmentSubStatus > 0) {
                    return '已预约'
                }else if(leadInfo.appointmentSubStatus <= 0) {
                    return '待跟进'
                }
            }
        },
        watch: {
            getCusLeadInfo(val) {
                this.obj = {
                    leadStatus: this.handleData(),     
                    channelName: val.channelName,
                    sourceName: val.sourceName
                }
                if(val.recommendLeadCode) {
                    this.recommendLeadCode = val.recommendLeadCode;
                    this.recommend(val.recommendLeadCode);
                }else {
                    this.customName = '';
                    // this.customName = val.sourceName;
                }
            },
            $route (to, from) {
                let params = {leadCode: this.$route.params.code};
                this.recommendLeadCode = '';
                this.customName = '';
                this.setCusLeadInfo(params);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .box {
        padding-left: rem(30)
    }
    .status {
        box-sizing: border-box;
        position: relative;
        top: rem(2);
        width: 100%;
        height: rem(83);
        background: #fff;
        padding: rem(23) rem(30) rem(21) rem(0);
        border-bottom: 1px solid #F0F2F4;
    }
    .status > p {
        width: rem(206);
        font-size:rem(26);
        color:#333333;
        text-align:left;
    }
    .btn-status {
        box-sizing: border-box;
        border-style: none;
        background: #bdc7d1;
        border-radius: rem(6);
        width: rem(120);
        font-size: rem(24);
        color: #fff;
        position: absolute;
        top: 50%;
        right: rem(30);
        transform: translateY(-50%);
        padding: rem(8) rem(10);
    }
    .ditchSource {
        width: 100%;
        display: flex;
        padding: rem(24) rem(0) rem(22) rem(0);
        justify-content: space-around;
    }
    .ditchSource > div{
        flex-grow: 1;
    }
    .ditchSource p{
        display: inline-block;
    }
    .skip {
        text-decoration: underline!important;
        color: #008cee!important;
    }

</style>
    