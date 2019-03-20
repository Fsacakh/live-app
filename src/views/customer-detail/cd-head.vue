<template>
    <div>
        <page-header @on-click-right="rightClick">
            <div slot="right" ref="right" class="top_right">
                <i class="iconfont icon-gengduo"></i>
            </div>
        </page-header>
        <popup-right :list="list" @itemClick="itemClick" ref="popup"></popup-right>
        <!-- SC - modal -->
        <modal title="进店时间表" ref="modal" :showTitle="showTitle" @submit="submitTime" @on-click-left="leftClick" @on-click-title="titleClick">
            <template slot="left">
                <span class="iconfont sousuo icon-icon-sousuo"></span>
                历史
            </template>
            <div v-if="showTitle">
               <m-time @getTime="getTime" :startTime="startTime" :endTime="endTime" :showPicker="showSubmit"></m-time>
               <input v-model="enterStoreObjectiveName" class="m-t-10" type="text" placeholder="请选择到店目的" readonly @click="selectSalesLeadObjective">
               <textarea v-model="remark" class="m-t-10" :placeholder="placeholder" :maxlength="20"></textarea>
            </div>
            <div v-else>
                <reception-history-list :items="recordList"></reception-history-list>
            </div>
        </modal>
        <!-- SM - modal -->
        <modal title="请选择分配销售顾问" ref="soltModal" @submit="confirmDistribution">
            <div class="sc-box clearfix">
                <div class="item-box" v-for="(item, index) in selectlist" :key="index" @click="select(item)">
                    <div :class="{'item-active' : isActive(item)}" ref="active">
                       {{ item.empCnName }}
                    </div>
                </div>
            </div>
        </modal>
        <div class="listmodel" @click="cancalSalesLeadObjective" v-if="showSalesLeadObjective">
          <div class="modelContainer">
              <div class="title p-l-10 p-r-10">
                  <span @click="cancalSalesLeadObjective">取消</span>
              </div>
              <ul>
                  <li v-for="(item, index) in salesLeadObjectiveList" :key="index" @click="choseSalesLeadObjective(index)">
                      {{ item.name }}
                  </li>
              </ul>
          </div>
        </div>
    </div>
</template>
<script>
    import PageHeader from "components/header/PageHeader"
    import PopupRight from 'components/popup-right/popup-right'
    import Modal from 'components/modal/index'
    import receptionHistoryList from 'components/reception-history-list'
    import {
        Toast
    } from 'mint-ui'
    import {
        mapGetters
    } from 'vuex'
    import MTime from './m-time'
    import api from 'common/api'
    import config from 'common/config'
    const SC_POPUP_FIRST = '推荐客户'
    const SC_POPUP_SECOND = '进店时间表'
    const SM_POPUP = '线索重新分配'
    const TIME_ALERT_INFO = '离店时间必须大于进店时间'
    const SALES_CONSULTANT = config.root.scPostTypeCode
    const SALES_DIRECTOR = config.root.smPostTypeCode
    const SALES_MANAGER = config.root.positionTypeSalesManager
    const STORE_MANAGER = config.root.positionTypeStoreGeneralManager
    export default {
        data() {
            return {
                sclist: [{
                        name: SC_POPUP_FIRST,
                        path: `/customer-addclue/${this.$route.params.code}`,
                        iconClass: "icon-tuijiankehu"
                    },
                    {
                        name: SC_POPUP_SECOND,
                        iconClass: "icon-jindianshijianbiao"
                    }
                ],
                smlist: [{
                    name: SM_POPUP,
                    iconClass: "icon-icon-zhihuan"
                }],
                scAndSmList: [{
                        name: SC_POPUP_FIRST,
                        path: `/customer-addclue/${this.$route.params.code}`,
                        iconClass: "icon-tuijiankehu"
                    },
                    {
                        name: SC_POPUP_SECOND,
                        iconClass: "icon-jindianshijianbiao"
                    },
                    {
                        name: SM_POPUP,
                        iconClass: "icon-icon-zhihuan"
                    }
                ],
                list: [],
                selectlist: [],
                selectItem: {},
                timelist: [],
                recordList: [],
                salesLeadObjectiveList: [],
                showSubmit: true,
                showTitle: true,
                showSalesLeadObjective: false,
                enterStoreObjectiveName: '',
                enterStoreObjective: '',
                startTime: '00:99',
                endTime: '00:00',
                receptionObj: {},
                placeholder: '备注(最多20字)',
                remark: ''
            }
        },
        mounted() {
            document.addEventListener('click', (e) => {
                const _right = this.$refs.right
                if (_right && !_right.contains(e.target)) this.$refs.popup.hide()
            })
            this.getRecordList()
            this.getSalesLeadObjectiveList()
        },
        computed: {
            ...mapGetters("customer", [
                "getCusLeadInfo",
                "getLoginInfo"
            ])
        },
        methods: {
            rightClick() {
                this.$refs.popup.toggle()
            },
            leftClick() {
                this.showTitle = !this.showTitle
            },
            titleClick() {
                this.showTitle = true
            },
            root() {
                const postnTypes = new Set(this.getLoginInfo.postnTypes)
                if (postnTypes.has(SALES_CONSULTANT)) {
                    this.list = this.sclist
                } else if (postnTypes.has(SALES_MANAGER) || postnTypes.has(SALES_DIRECTOR) || postnTypes.has(STORE_MANAGER)) {
                    this.list = this.smlist
                } else if (postnTypes.has(SALES_CONSULTANT) && postnTypes.has(SALES_MANAGER)) {
                    this.list = this.scAndSmList
                }
            },
            itemClick(item) {
                if (item.name === SC_POPUP_SECOND) {
                    this.hasSubmit(() => {
                        this.$refs.modal.open()
                    })
                } else if (item.name === SM_POPUP) {
                    this.$refs.soltModal.open()
                }
                this.titleClick()
            },
            // SM => 线索重新分配
            getScList() {
                this.getUserInfo().then((storeInfoVo) => {
                    const params = {
                        orgCode: storeInfoVo.orgCode,
                        storeCode: storeInfoVo.storeCode,
                        postnTypeCode: config.root.scPostTypeCode
                    }
                    api.customer.queryScList(params).then(res => {
                        if (res.data.code === 'success') {
                            this.selectlist = res.data.obj
                        }
                    })
                })
            },
            getUserInfo() {
                return new Promise((resolve, reject) => {
                    api.getUserInfo.getUserAvailableInfo((res) => {
                        if (res.data.code === 'success') {
                            const storeInfoVo = res.data.obj.storeInfoVo
                            resolve(storeInfoVo)
                        }
                    })
                })
            },
            isActive(item) {
                return item.empCode === this.getCusLeadInfo.scCode ? true : false
            },
            select(item) {
                const arr = this.$refs.active
                arr.forEach(divList => {
                    if (item.empCode !== this.getCusLeadInfo.scCode) {
                        divList.className = ''
                    }
                })
                this.selectItem = item
            },
            confirmDistribution() {
                let params = {
                    id: this.getCusLeadInfo.id,
                    scCode: this.selectItem.empCode, // 修改的scCode
                }
                api.customer.updateLead(params).then(res => {
                    if (res.data.code === 'success') {
                        Toast(config.alertInfo.success)
                    }
                })
            },
            // SC - 设置进店时间, 离店时间
            getTime(list) {
                this.timelist = list
            },
            submitTime() {
                if (this.showSubmit) {
                    const st = this.timelist[0].time
                    const et = this.timelist[1].time
                    if (!this.compareTime(st, et)) {
                        Toast(TIME_ALERT_INFO)
                        return
                    }
                    this.getSequence(config.customerDetail.receSeq, (result) => {
                        let params = {
                            receptionCode: result,
                            storeCode: this.getCusLeadInfo.storeCode,
                            scCode: this.getCusLeadInfo.scCode,
                            leadCode: this.getCusLeadInfo.leadCode,
                            customCode: this.getCusLeadInfo.customCode,
                            mobilePhone: this.getCusLeadInfo.mobilePhone,
                            receptionType: '1', // 客流类型, 1 ( 非前台推送 )
                            receptionStartTime: `${this.getCurrentDate()} ${this.timelist[0].time}`,
                            receptionEndTime: `${this.getCurrentDate()} ${this.timelist[1].time}`,
                            remark: this.remark,
                            enterStoreObjective: this.enterStoreObjective,
                            enterStoreObjectiveName: this.enterStoreObjectiveName
                        }
                        api.customer.startReception(params).then(res => {
                            if (res.data.code === 'success') {
                                Toast(config.alertInfo.success)
                                this.showSubmit = false;
                                this.getRecordList()
                            }
                        })
                    })
                } else {
                    api.lead.editCustomerEnterStoreObjective({
                        leadCode: this.getCusLeadInfo.leadCode,
                        enterStoreObjective: this.enterStoreObjective,
                        remark: this.remark
                    }, (res) => {
                        if (res.data.code === 'success') {
                            this.hasSubmit(() => {})
                            this.getRecordList()
                        }
                    }) 
                }
            },
            hasSubmit(callback) {
                let params = {
                    "leadCode": this.getCusLeadInfo.leadCode,
                    "storeCode": this.getCusLeadInfo.storeCode
                }
                api.passenger.queryPassenger(params, (res) => {
                    if (res.data.code === 'success') {
                        let list = res.data.obj.list
                        if (list.length > 0) {
                            this.showSubmit = false
                            this.startTime = this._substring(list[0].receptionStartTime)
                            this.endTime = this._substring(list[0].receptionEndTime)
                            this.remark = list[0].remark
                            this.enterStoreObjective = list[0].enterStoreObjective
                            this.enterStoreObjectiveName = list[0].enterStoreObjectiveViewName
                            if (this.salesLeadObjectiveList.length && this.enterStoreObjective) {
                               this.enterStoreObjectiveName = this.salesLeadObjectiveList.find((item) => {
                                  return item.value == this.enterStoreObjective
                               }).name
                            }
                        } else {
                            this.showSubmit = true
                        }
                        callback()
                    }
                })
            },
            _substring(str) {
                return str ? str.substring(11, 16) : '无'
            },
            getSequence(code, result) {
                api.ordinalInfo.getSequence(code, (res) => {
                    if (res.data.code === 'success') {
                        result(res.data.obj)
                    }
                })
            },
            getCurrentDate() {
                let date = new Date()
                let y = date.getFullYear();
                let m = date.getMonth() + 1;
                m = m < 10 ? `0${m}` : m;
                let d = date.getDate();
                d = d < 10 ? `0${d}` : d;
                return `${y}-${m}-${d}`
            },
            compareTime(startTime, endTime) {
                let st = startTime.split(':').join('')
                let et = endTime.split(':').join('')
                return st >= et ? false : true
            },
            selectSalesLeadObjective() {
                this.showSalesLeadObjective = true
            },
            cancalSalesLeadObjective() {
                this.showSalesLeadObjective = false
            },
            choseSalesLeadObjective(index) {
                let _this = this
                this.enterStoreObjectiveName = this.salesLeadObjectiveList[index].name
                this.enterStoreObjective = this.salesLeadObjectiveList[index].value
            },
            getRecordList() {
                let _this = this
                api.lead
                    .queryRecordListInfoByPage({
                        leadCode: this.$route.params.code,
                        pageNums: config.maxPageNums,
                        pageStart: 1
                    }, (res) => {
                        if (res.data.code === 'success') {
                            _this.recordList = res.data.obj.list
                        }
                    })
            },
            getSalesLeadObjectiveList() {
                let _this = this
                let newParams = {
                    'refCode': config.ref.receptionSalesLeadObjective
                }
                api.ref.getDataDictionary(newParams, (res) => {
                    if (res.data.code === 'success') {
                        let detailList = []
                        let index = 0
                        let arr = res.data.obj.referenceDetailInfos
                        arr.forEach((item, index) => {
                            detailList.push({
                                name: item.refDetailName,
                                icon: '',
                                value: item.refDetailCode,
                                selectIndex: index
                            })
                        })
                        _this.salesLeadObjectiveList = detailList
                        if(_this.enterStoreObjective) {
                           _this.enterStoreObjectiveName = detailList.find((item) => {
                               return item.value == _this.enterStoreObjective
                           }).name
                        }
                    }
                })
            }
        },
        watch: {
            getLoginInfo() {
                this.root()
            },
            list(val) {
                if (val[0].name === SM_POPUP) {
                    this.getScList()
                }
            }
        },
        components: {
            Modal,
            MTime,
            PopupRight,
            PageHeader,
            receptionHistoryList
        }
    }
</script>
<style lang="scss" scoped>
    .top_right i {
        font-size: remp(4.5) !important;
    }
    .sc-box {
        color: #7C817F;
        padding: remp(14) 0;
        padding-bottom: remp(20);
        .item-box {
            float: left;
            width: 28%;
            padding: remp(6);
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
    .item-active {
        background-color: #008BEC !important;
        color: #fff;
        span {
            color: #fff;
        }
    }
    input {
        outline: none;
        resize: none;
        border: none;
        width: rem(600);
        font-size: remp(14);
        text-align: left;
        border: #7C817F solid rem(2);
        padding: rem(5) 0;
    }
    textarea {
        outline: none;
        resize: none;
        border: none;
        width: rem(600);
        height: rem(200);
        color: black;
        font-size: remp(13);
        border: #7C817F solid rem(2);
    }
    input::-webkit-input-placeholder {
        color: #6F7472;
        text-align: left;
        font-size: remp(16);
    }
    .listmodel {
        position: fixed;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, .4);
        z-index: 100;
    }
    .listmodel>.modelContainer {
        position: absolute;
        left: 0;
        bottom: 0;
        width: 100%;
        height: rem(500);
        background-color: #e7e7e7;
    }
    .listmodel>.modelContainer .title {
        height: rem(80);
        line-height: rem(80);
        background-color: rgb(54, 172, 254);
        color: #fff;
        text-align: center;
    }
    .listmodel>.modelContainer>.title>.center {
        margin: 0 auto;
    }
    .listmodel>.modelContainer ul {
        height: rem(420);
        overflow-y: auto;
    }
    .listmodel>.modelContainer ul li {
        height: rem(70);
        line-height: rem(70);
        text-align: center;
        box-sizing: border-box;
        border-bottom: 1px solid #ccc;
    }
</style>


