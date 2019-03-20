<template>
    <div>
        <mt-popup
            v-model="popupVisible"
            popup-transition="popup-fade"
            :closeOnClickModal="true"
            >
            <div class="market-modalbox b-white">
                <div class="market-modalX" style="background-color: #fff" @click="hidePopup()"></div>
                <div class="modal-header">
                    {{marketDetail.maName}}
                </div>
                <div class="modal-swipe">
                    <mt-swipe :auto="4000">
                        <mt-swipe-item>
                            <div class="modal-swipe-item">
                                <img class="imgInfo" :src="imgPath" alt="暂无活动海报" width="100%" height="auto">    
                            </div>
                        </mt-swipe-item>
                    </mt-swipe>
                </div>
                <div class="modal-content">
                    <div class="activity-time">
                        日期 &emsp; &emsp; <span>{{ marketDetail.startTime?marketDetail.startTime.slice(0, 10) + ' ~ ' : '' }}{{marketDetail.endTime ? marketDetail.endTime.slice(0, 10) : ''}}</span>
                    </div>
                    <div class="activity-words">
                        <div class="words-title">活动话术</div>
                        <p>{{wordsValue}}</p>
                    </div>
                </div>
                <div v-if="!leadInfo.leadCode" class="modal-button">
                    <div class="m-btn" @click="inputList">
                        查看待邀约列表
                    </div>
                </div>
                <div v-else class="modal-button">
                    <div class="adopt-btn" @click="setMarketRelation(1)">接受</div>
                    <div class="repulse-btn"  @click="setMarketRelation(-1)">拒绝</div>
                </div>
            </div>
        </mt-popup>
    </div>
</template>

<script>
import Vue from 'vue'
import config from 'common/config'
import {mapActions, mapGetters, mapState} from 'vuex'
import { Popup, Swipe, SwipeItem } from 'mint-ui'

Vue.component(Popup.name, Popup)
Vue.component(Swipe.name, Swipe);
Vue.component(SwipeItem.name, SwipeItem);
export default {
    data() {
        return {
            imgPath: '',
            popupVisible: false,
            params: {
                listRelationCode: '',
            },
            leadInfo: {},
        }
    },
    computed: {
        ...mapState('marketactivity', [
            'marketDetail',
            'listRelationCode'
        ]),
        wordsValue: function() {
            let wordsInfo = this.marketDetail.marketActivityWordList?this.marketDetail.marketActivityWordList[0]:false
            return wordsInfo?wordsInfo.wordsValue:''
        }
    },
    created() {
        
    },
    methods: {
        ...mapActions('marketactivity', [
            'relationMarket',
            'getListRelationCode',
            'custRelMarket'
        ]),
        inputList: function() {
            this.$router.push({
                path: '/waitinvitecustomer',
                query: {
                    // marketName: this.marketDetail.maName,
                    marketCode: this.marketDetail.maCode,
                    invitationStatus: '0',
                }
            })
        },
        showPopup: function(val, leadInfo, path) {
            this.imgPath = path?path:''
            this.leadInfo = leadInfo
            this.popupVisible = true
        },
        hidePopup: function() {
            this.popupVisible = false
        },
        setMarketRelation: function(status) {
            this.getListRelationCode({
                poros: config.market.seq,
                callBack: res => {
                    let params = {
                            listRelationCode: this.listRelationCode,
                            relationTypeCode: 'ListRelationTypeMarket',
                            relationCode: this.marketDetail.maCode,
                            relationName: this.marketDetail.maName,
                            leadCode: this.leadInfo.leadCode,
                            customCode: this.leadInfo.customCode,
                            mobilePhone: this.leadInfo.mobilePhone,
                            storeCode: this.leadInfo.storeCode,
                            ownerSc: this.leadInfo.ownerSc,
                            invitationStatus: status
                        }
                    this.relationMarket({
                        poros: params,
                        callBack: res => {
                            this.popupVisible = false
                            this.custRelMarket({
                                poros: this.leadInfo,
                                callBack: res => {
                                    this.$router.push({
                                        path: `/customer-detail/${this.leadInfo.leadCode}/${config.customerFlag}`
                                    
                                    })
                                }
                            })

                        }
                    })
                }
            })
            
        }
    },
}
</script>

<style lang="scss">
    .market-modalbox {
        position: relative;
        width: rem(640);
        height: rem(860);
        border-radius: rem(16);
        // padding: remp(10);
        // display: flex;
        // flex-direction: column;
        .market-modalX {
            position: absolute;
            top: rem(-18);
            right: rem(-18);
            width: rem(44);
            height: rem(44);
            border-radius: 50%;
            background-color: #CCCCCC;
            background: url(../../../assets/imgage/clear.png) no-repeat 50% 50%;
        }
        .modal-header {
            width: rem(640);
            height: rem(88);
            background: -webkit-linear-gradient(left top, #36ACFE  , #008CEE);
            text-align: center;
            line-height: rem(88);
            color: #fff;
            font-size: rem(34);
        }
        .modal-swipe {
            width: rem(640);
            height: rem(350);
            background-color: #F0F2F5;
            .modal-swipe-item {
                width: rem(640);
                height: rem(350);
            }
        }
        .modal-content {
            padding-left: rem(30);
            .activity-time {
                height: rem(80);
                line-height: rem(80);
                font-size: rem(26);
                color: #333;
                border-bottom: rem(1) solid #f1f2f5;
                span {
                    color: #666;
                }
            }
            .activity-words {
                .words-title {
                    height: rem(80);
                    line-height: rem(80);
                    font-size: rem(26);
                    color: #333;
                }
                p {
                    overflow: auto;
                    width: rem(580);
                    word-wrap:break-word;
                    height: rem(111);
                    padding-right: rem(35);
                    padding-bottom: rem(23);
                    font-size: rem(26);
                    line-height: rem(37);
                    color: #666;
                    border-bottom: rem(1) solid #f1f2f5;
                }
            }
        }
        .modal-button {
            display: flex;
            padding: 0 rem(30);
            padding-top: rem(23);
            .m-btn {
                // flex: 1;
                // position: absolute;
                // left: 50%;
                // transform: translateX(-50%);
                margin: 0 auto;
                width: rem(550);
                height: rem(78);
                font-size: rem(28);
                color: #fff;
                text-align: center;
                line-height: rem(78);
                border-radius: rem(8);
                background: -webkit-linear-gradient(left top, #36ACFE  , #008CEE);
            }
            .adopt-btn {
                flex: 1;
                width: rem(270);
                height: rem(78);
                text-align: center;
                line-height: rem(78);
                border: rem(2) solid #FE3824;
                border-radius: rem(8);
                color: #7E8387;
            }
            .repulse-btn {
                flex: 1;
                width: rem(270);
                height: rem(78);
                text-align: center;
                line-height: rem(78);
                border: rem(2) solid #7E8387;
                margin-left: rem(49);
                border-radius: rem(8);
                color: #7E8387;
            }
        }
    }
</style>