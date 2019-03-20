<template>
    <div class="board">
        <page-header ref="header" @on-click-right="selectAreaShop">
            <div slot class="isStore" style="width: 250px; text-align: center; overflow: hidden;white-space: nowrap;text-overflow: ellipsis;">{{storeName}}</div>
            <p slot="right" v-if="!isStore" style="padding-top: 3px; ">切换</p>
        </page-header>
        <div class="board-tabs b-white">
            <div class="board-item w25" @click="selectTab(0)" :class="{'active': (tabActiveIndex == 0) }">
                概览
            </div>
            <div class="board-item w25" @click="selectTab(1)" :class="{'active': (tabActiveIndex == 1) }">
                运营报表
            </div>
            <div class="board-item w25" @click="selectTab(2)" :class="{'active': (tabActiveIndex == 2) }">
                利润报表
            </div>
            <div class="board-item w25" :class="{'active': (tabActiveIndex == 3) }">
                周月报
            </div>
        </div>
        <div v-if="tabActiveIndex === 0 || tabActiveIndex === 1" class="board-time b-white">
            <span @click="showPicker">
                {{ dateMage }}
            </span>
            &nbsp;&nbsp;&nbsp;&nbsp;
            <span @click="showDatePicker" v-if="tabActiveIndex != 0">
                {{ date }}
            </span>
        </div>
        <div class="board-detial-box" v-show="tabActiveIndex == 0">
            <b-sell ref="sell" :dateMage="dateMage"></b-sell>
            <b-gain ref="gain" :time="dateMage" @isSel="getIsSel"></b-gain>
            <b-inventory ref="inventory"></b-inventory>
        </div>
        <oper-report v-if="tabActiveIndex == 1" :date="date"></oper-report>
        <profit-report  v-if="tabActiveIndex == 2" :date="date"></profit-report>
        <datetime-picker
            type="date"
            ref="picker"
            v-model="pickerVisible"
            year-format="{value} 年"
            month-format="{value} 月"
            date-format="{value} 日"
            @confirm="handleConfirm">
        </datetime-picker>
        <Popup v-model="showAreaShop" :closeOnClickModal="false" position="bottom" class="w mint-datetime">
            <div class="picker-toolbar">
                <span class="mint-datetime-action mint-datetime-cancel" @click="hideAreaShop">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="hideAreaShopyes">确定</span>
            </div>
            <picker :slots="areaShopSlots" value-key="name" @change="onAreaShopChange"></picker>
        </Popup>
        <Popup v-model="showDate" :closeOnClickModal="false" position="bottom" class="w mint-datetime">
            <div class="picker-toolbar">
                <span class="mint-datetime-action mint-datetime-cancel" @click="hideDate">取消</span>
                <span class="mint-datetime-action mint-datetime-confirm" @click="hideDateYes">确定</span>
            </div>
            <picker :slots="dateSlots" @change="onDateChange"></picker>
        </Popup>
    </div>
</template>

<script>
import { Popup, Picker, DatetimePicker } from 'mint-ui';
import { mapState, mapActions } from 'vuex'
import pageHeader from '@/components/header/PageHeader'
import BSell from './board-sell'
import BGain from './board-gain'
import BInventory from './board-inventory'
import operReport from './operating-report'
import profitReport from './profit-report1'
import common from 'common/common'
import config from 'common/config'
import api from '@/common/api.js'
export default {
    components: {
        DatetimePicker,
        pageHeader,
        operReport,
        profitReport,
        BInventory,
        BSell,
        BGain,
        Popup,
        Picker
    },
    data() {
        return {
            storeName: '请选择门店',
            dateInfo: {
                startDate: '',
                endDate: ''
            },
            filterData: {
                storeCode: '',
                storeName: '',
                salesName: '',
                salesCode: '',
                date: ''
            },
            tabActiveIndex: 0,
            showAreaShop: false,
            areaShopSlots: [
                {
                    flex: 1,
                    values: [],
                    className: 'slot1',
                    textAlign: 'center'
                }, {
                    flex: 1,
                    values: [],
                    className: 'slot2',
                    textAlign: 'center'
                }],
            customSlots: [{
                flex: 1,
                values: [],
                className: 'slot1',
                textAlign: 'center'
            }],
            showDate: false,
            dateSlots: [{
                flex: 1,
                values: [],
                className: 'slot1',
                textAlign: 'center'
            }],
            pickerVisible: new Date(),
            dateMage: '',
            date: 'All',
            isSel: true
        }
    },
    computed: {
        ...mapState('databoard', [
            'isStore',
            'store',
            'time'
        ])
    },
    created() {
        this.dateMage = common.eleTimeFormatim1(new Date()).slice(0, 7) + '/01' + ' ' + '00:00:00'
        let date = this.dateFormat(common.eleTimeFormatim1(new Date()).slice(0, 7) + '/01' + ' ' + '00:00:00')
        this.setTime(date)
        let val = {
            startDate: date.startDate,
            endDate: date.endDate
        }
        this.dateInfo = val
    },
    mounted() {
        // 
        let _this = this
        let date = this.dateFormat(common.eleTimeFormatim1(new Date()).slice(0, 7) + '/01' + ' ' + '00:00:00')
        this.setTime(date)
        let val = {
            startDate: date.startDate.slice(0, 7) + '/01' + ' ' + '00:00:00',
            endDate: date.endDate.slice(0, 7) + '/01' + ' ' + '00:00:00'
        }
        if(this.time !== '') {
            this.dateMage = this.time.startDate.slice(0, 7)
            this.dateInfo = this.time
        } else {
            this.dateInfo = val
        }
        //集团看板路由跳转判断
        let route = this.$route.query
        if (route.storeCode) {
            this.$data.showAreaShop = false
            route.tableIndex == 1 && (this.tabActiveIndex = 1);
            route.tableIndex == 2 && (this.tabActiveIndex = 2);
            this.setStore({code: route.storeCode , name: route.storeName })
            this.storeName = route.storeName

        } else {
             api.getUserInfo.getUserAvailableInfo((res) => {
              if (res.data.code === 'success') {
                  let availableType = res.data.obj.availableType
                  if (availableType === '0') {      //对应的员工类型。0对应实体4s门店，1对应虚拟店，2对应集团用户，无门店信息
                      _this.$data.showAreaShop = false
                      let storeInfo = res.data.obj.storeInfoVo
                      _this.mommitIsStore(true)
                      _this.$data.isStore = true
                      _this.$data.areaShopSlots[0].values = [{
                          code: storeInfo.salesCode,
                          name: storeInfo.salesName
                      }]
                      _this.$data.areaShopSlots[1].values = [{
                          code: storeInfo.storeCode,
                          name: storeInfo.storeName
                      }]
                      _this.storeName = storeInfo.storeName
                      _this.filterData.storeCode = storeInfo.storeCode
                      _this.filterData.storeName = storeInfo.storeName
                      // 改变store的状态
                      _this.setStore({code: storeInfo.storeCode, name: storeInfo.storeName })
                      _this.$refs.sell.getSellData(this.time, storeInfo.storeCode, storeInfo.storeName)

                      if(this.isSel){
                          _this.$refs.gain.getGainData(this.time, storeInfo.storeCode, storeInfo.storeName)
                      }else{
                          _this.$refs.gain.getGainUnTicketData(this.time, storeInfo.storeCode, storeInfo.storeName)
                      }

                      _this.$refs.inventory.getData(this.time, storeInfo.storeCode, storeInfo.storeName)
                  } else {
                      this.$data.showAreaShop = (_this.store !== '' ? false :  true)
                      _this.mommitIsStore(false)
                      _this.$data.isStore = false
                      if (this.store !== '') {
                          this.storeName = this.store.name;
                          this.$refs.sell.getSellData(this.dateInfo, this.store.code, this.store.name)

                          if(this.isSel){
                              this.$refs.gain.getGainData(this.dateInfo, this.store.code, this.store.name)
                          }else{
                              this.$refs.gain.getGainUnTicketData(this.dateInfo, this.store.code, this.store.name)
                          }
                          this.$refs.inventory.getData(this.dateInfo, this.store.code, this.store.name)
                      }
                      api.area.getSalesAreaInfoByAreaCode({
                              areaCode: config.treeArea
                          }, (res) => {
                              if (res.data.code === 'success') {
                                  let salesAreaSubInfo = res.data.obj.salesAreaSubInfo
                                  _this.$data.areaShopSlots[0].values = []
                                  _this.$data.areaShopSlots[1].values = []
                                  if (salesAreaSubInfo != null && salesAreaSubInfo.length > 0) {
                                      salesAreaSubInfo.forEach((salesAreaInfo) => {
                                          _this.$data.areaShopSlots[0].values.push({
                                              code: salesAreaInfo.areaCode,
                                              name: salesAreaInfo.areaName
                                          })
                                      })
                                  }
                              }
                          })
                  }
              }
          })
    }
        },

       
    methods: {
        ...mapActions('databoard',[
            'mommitIsStore',
            'setStore',
            'setTime'
        ]),
        getIsSel(data){
            this.isSel = data
        },
        selectAreaShop: function() {
            let _this = this
            if (!_this.isStore) {
                _this.$data.showAreaShop = true
            }
        },
        hideAreaShop: function() {
            let _this = this
            this.$router.push({
                path: '/homepage'
            })
            _this.$data.showAreaShop = false
        },
        hideAreaShopyes: function() {
            let _this = this
            _this.$data.showAreaShop = false
            this.storeName = this.filterData.storeName
            _this.setStore({code: this.filterData.storeCode, name: this.filterData.storeName })

            if(this.isSel){
                _this.$refs.gain.getGainData(this.dateInfo, this.filterData.storeCode, this.filterData.storeName)
            }else{
                _this.$refs.gain.getGainUnTicketData(this.dateInfo, this.filterData.storeCode, this.filterData.storeName)
            }

            _this.$refs.sell.getSellData(this.dateInfo, this.filterData.storeCode, this.filterData.storeName)
            _this.$refs.inventory.getData(this.dateInfo, this.filterData.storeCode, this.filterData.storeName)
        },
        showPicker: function() {
            this.$refs.picker.open()
        },
        onAreaShopChange: function(picker, values) {
            console.log(picker)
            let _this = this
            if (picker.getSlotValue(0) && picker.getSlotValue(0).code != _this.$data.filterData.salesCode) {
                _this.$data.filterData.salesCode = picker.getSlotValue(0).code
                _this.$data.filterData.salesName = picker.getSlotValue(0).name
                api.area
                    .getShopInfoByAreaCode({
                        salesAreaCodes: [picker.getSlotValue(0).code],
                        needPageFlag: "0"
                    }, (res) => {
                        if (res.data.code === 'success') {
                            let shopInfos = res.data.obj
                            _this.$data.areaShopSlots[1].values = []
                            if (shopInfos != null && shopInfos.length > 0) {
                                _this.areaShopSlots[1].values = []
                                shopInfos.forEach(item => {
                                    _this.areaShopSlots[1].values.push({
                                        code: item.storeCode,
                                        name: item.storeName
                                    })
                                })
                            }
                        }
                    })
            }
            if (values[1] && values[1].code != _this.$data.filterData.storeCode) {
                _this.filterData.storeCode = picker.getSlotValue(1) ? picker.getSlotValue(1).code : ''
                _this.filterData.storeName = picker.getSlotValue(1) ? picker.getSlotValue(1).name : ''
            }
            if (_this.filterData.storeCode != '') {
                api.customer.queryScList({
                    storeCode: _this.$data.filterData.storeCode,
                    postnTypeCode: config.root.scPostTypeCode
                }).then((res) => {
                    if (res.data.code === 'success') {
                        let emps = res.data.obj
                        _this.customSlots[0].values = []
                        _this.customSlots[0].values = [{
                            code: '',
                            name: '全部顾问'
                        }]
                        if (emps != null) {
                            emps.forEach((emp) => {
                                _this.customSlots[0].values.push({
                                    code: emp.empCode,
                                    name: emp.empCnName
                                })
                            })
                        }
                    }
                })
            }
        },
        showDatePicker: function() {
            this.$data.showDate = true
        },
        hideDate: function() {
            this.$data.showDate = false
        },
        hideDateYes: function() {
            let _this = this
            let val = {}
            this.date = this.filterData.date
            let oldYear = this.time.startDate.slice(0, 4)
            let oldMonth = this.time.startDate.slice(5, 7)
            if (this.date != 'All') {
                val = {
                    startDate: `${oldYear}/${oldMonth}/${this.date} 00:00:00`,
                    endDate: `${oldYear}/${oldMonth}/${this.date} 00:00:00`
                }
            } else {
                val = this.dateFormat(this.time.startDate.slice(0, 7) + '/01')
            }
            this.setTime(val)
            if (this.tabActiveIndex == 0) {
                console.log(val)
                console.log(this.store.name)
                this.$refs.sell.getSellData(val, this.store.code, this.store.name)
                this.$refs.inventory.getData(val, this.store.code, this.store.name)

                if(this.isSel){
                    this.$refs.gain.getGainData(val, this.store.code, this.store.name)
                }else{
                    this.$refs.gain.getGainUnTicketData(val, this.store.code, this.store.name)
                }
            }
            this.$data.showDate = false
        },
        onDateChange: function(picker, values) {
            if (values != null && values.length > 0 && values[0] != undefined) {
                this.filterData.date = values[0]
            }
        },
        dateFormat: function(dateInfo) {
            this.dateMage = dateInfo.slice(0, 7)
            let oldYear = dateInfo.slice(0, 4)
            let oldMonth = dateInfo.slice(5, 7)
            let endDay = new Date(oldYear, oldMonth, 0).getDate()
            let lastDay = (endDay< 10 ? "0" + endDay : endDay.toString())
            let val = {
                startDate: dateInfo,
                endDate: `${oldYear}/${oldMonth}/${lastDay} 23:59:59`
            }
            this.date = 'All'
            this.getMonthDays(oldYear, oldMonth)
            return val
        },
        handleConfirm: function(data) {

            const time = common.eleTimeFormatim1(data).slice(0, 7) + '/01' + ' ' + '00:00:00'
            let date = this.dateFormat(time)
            this.setTime(date)

            if(this.isSel){
                this.$refs.gain.getGainData(date, this.store.code, this.store.name)
            }else{
                this.$refs.gain.getGainUnTicketData(date, this.store.code, this.store.name)
            }

            this.$refs.sell.getSellData(date, this.store.code, this.store.name)
            this.$refs.inventory.getData(date, this.store.code, this.store.name)
        },
        selectTab: function(index) {
            let _this = this
            _this.$data.tabActiveIndex = index
            if (_this.$data.tabActiveIndex == 0) {
                this.date =  'All'
                let time = this.dateFormat(common.eleTimeFormatim1(this.time.startDate).slice(0, 7) + '/01' + ' ' + '00:00:00')
                this.setTime(time)
            }
        },
        getMonthDays: function(year, month) {
            let _this = this
            let endDay = new Date(year, month, 0).getDate()
            this.dateSlots[0].values = ['All']
            for (let i = 1;  i <= endDay; i++) {
                this.dateSlots[0].values.push(
                    i< 10 ? "0" + i : i.toString()
                )
            }
        }
    }
}
</script>

<style lang="scss" @scoped>
.board {
    .isStore {
        text-align: center;
        position: absolute;
        left: 50%;
        transform: translateX(-50%)
    }
    .mint-popup {
        .picker {
            .picker-items {
                .picker-slot:nth-child(3) {
                    display: none !important;
                }
            }
        }

    }
}

.board-time {
    position: relative;
    top: remp(49);
    margin: 0 auto;
    width: 100%;
    max-width: 750px;
    height: remp(41);
    text-align: center;
    line-height: remp(41);
    font-size: remp(13);
    color: #333;
    img {
        width: remp(10);
        height: remp(6);
    }
}
.board-detial-box {
    position: relative;
    top: remp(55);
    margin: 0 auto;
    width: 100%;
    max-width: 750px;
    padding: remp(5) remp(10) remp(10) remp(10);
    box-sizing: border-box;
    overflow: scroll;
}
.board-tabs {
    position: fixed;
    top: remp(48);
    margin: 0 auto;
    width: 100%;
    max-width: 750px;
    display: flex;
    flex-direction: row;
    margin-bottom: remp(11);
    z-index: 100;
    .board-item {
        text-align: center;
        padding-top: remp(12);
        padding-bottom: remp(12);
        font-family: PingFangSC-Regular;
        font-size: remp(12);
        color: #A5A5B5;
    }
    >.active {
        font-family: PingFangSC-Semibold;
        font-size: remp(12);
        color: #333333;
        border-bottom: remp(2) solid #36ACFE;
    }
}
</style>
