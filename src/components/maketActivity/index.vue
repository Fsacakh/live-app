<template>
    <div class="maketActivityBox">
        <div class="maketActivity w" @click="inputActivityList">
            <span class="tl">市场活动</span>
                <i class="iconfont icon-icon-tianjia"></i>
        </div>
        <div class="maketActivityList w" v-for="(item, index) in relationMarketList" :key="index"  @click="showmodal(item)">
            <div class="imgeMac tc">
                <button>
                    {{
                        item.attendFlag == '1' ? '已出席': (item.invitationStatus == '0' ? '待邀约' : (item.invitationStatus == '1' ? '已达成预约' : '未达成预约'))
                    }}
                </button>
            </div>
            <div class="titletextMac w">
                <p>{{item.relationName}}</p>
                <p><span>活动日期: &ensp;</span> {{item.startTime.slice(0, 10) + ' ~ ' + item.endTime.slice(0, 10)}}</p>
            </div>
        </div>
        <v-modal ref="marketmodal"></v-modal>
    </div>
</template>
<script>
    import {mapActions, mapState} from 'vuex'
    import VModal from './marketStatusModal'
    import api from 'common/api'
    export default {
        props: {
            dataInfo: {
                type: Array,
                default: function () {
                    return []
                }
            }
        },
        components: {
            VModal,
        },
        data() {
            return {
                maCodeSet: []
            }
        },
        computed: {
            ...mapState('customer', [
                'cusLeadInfo'
            ]),
            ...mapState('marketactivity', [
                'relationMarketList',
            ]),
        },
        mounted() {
            this.getMartketlist()
        },
        methods: {
            ...mapActions('marketactivity', [
                'custRelMarket',
                'getMartketDetail'
            ]),
            ...mapActions('customer', [
                'setCusLeadMarketInfo',
                // 'queryRecommendSalesLeadsAddInfo'
            ]),
            getMartketlist: function(val) {
                
                this.setCusLeadMarketInfo({
                    poros: {leadCode: this.$route.params.code},
                    callBack: res => {
                        let params = {
                            leadCode: this.$route.params.code,
                            customCode: res.customCode,
                            mobilePhone: res.mobilePhone,
                            ownerSc: res.scCode,
                            storeCode: res.storeCode,
                        }
                        this.custRelMarket({
                            poros: params,
                            callBack: res => {
                            }
                        })
                    }
                })
                
            },
            showmodal(item) {
                let relMarket = {
                        customCode: this.cusLeadInfo.customCode,
                        mobilePhone: this.cusLeadInfo.mobilePhone,
                        ownerSc: this.cusLeadInfo.scCode,
                        storeCode: this.cusLeadInfo.storeCode,
                        leadCode: this.cusLeadInfo.leadCode,
                    }
                this.getMartketDetail({
                        poros: {maCode: item.relationCode},
                        callBack: res => {
                            api.market.getFileInfo({relationCode: res.data.obj.maCode, businessType: 'haibao'}, res => {
                                if(res.data.code == 'success') {
                                    // console.log(res.data.obj)
                                    // return
                                    let imgInfo = res.data.obj?res.data.obj[0]: false
                                    if(imgInfo) {
                                        this.$refs.marketmodal.showPopup(item, relMarket, imgInfo.filePath)
                                    } else {
                                        this.$refs.marketmodal.showPopup(item, relMarket, '')
                                        
                                    }
                                }
                            })
                        }
                    })
            },
            inputActivityList: function() {
                this.relationMarketList.forEach(item => {
                    this.maCodeSet.push(item.relationCode)
                });
                this.$router.push({
                    path: '/marketlist',
                    query: {
                        leadCode: this.cusLeadInfo.leadCode,
                        customCode: this.cusLeadInfo.customCode,
                        mobilePhone: this.cusLeadInfo.mobilePhone,
                        storeCode: this.cusLeadInfo.storeCode,
                        ownerSc: this.cusLeadInfo.scCode,
                        maCodeSet: this.maCodeSet
                    }
                })
            }
        }
    }
</script>
<style lang="scss">

    .maketActivityBox {
        padding-left: rem(30);
        border-bottom: 1px solid #ccc;
    }
    .maketActivity {
        position: relative;
        box-sizing: border-box;
        height: rem(60);
        padding: rem(22) rem(63) rem(21) rem(0);
        display: table;
    }
    .maketActivity > span {
        display: table-cell;
        height: rem(37);
        color: #333;
        font-size: rem(26)
    }
    .maketActivity i {
        font-size: rem(26);
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: rem(10);
        color: #CBC7C2;
        margin-right: remp(5);
    }

    .maketActivityList {
        position: relative;
        box-sizing: border-box;
        padding: rem(18) rem(0) rem(18) rem(0);
        height: rem(110);
        display: table;
        border-bottom: 1px solid #ccc;
    }
    .maketActivityList:last-child {
        border-bottom: none;
    }
    .maketActivityList > div:first-child {
        position: absolute;
        width: rem(140);
        display: table-cell;
    }
    .maketActivityList > div:last-child {
        display: table-cell;
        width: 100%;
    }
    .imgeMac {
        top: 50%;
        transform: translateY(-50%);
        right: rem(30);
        width: rem(140);
    }
    .imgeMac > button {
        border-style: none;
        width: rem(140);
        background-color: #bdc7d1;
        padding: rem(8) rem(10);
        border-radius: rem(6);
        font-size: rem(24);
        color: #fff;
        vertical-align: middle;
    }
    .titletextMac > p:first-child {
        width: 100%;
        height: rem(33);
        font-size: rem(24);
        color:#333333;  
        margin-bottom: rem(8);
    }
    .titletextMac > p:last-child {
        display: table-cell;
        width: 100%;
        height: rem(33);
        font-size: rem(24);
        color:#333333;  
    }
</style>