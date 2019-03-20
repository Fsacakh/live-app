
<template>
    <!-- <transition name="fade"> -->
    <div>
        <div v-if="!showSelect">
            <page-header title="试乘试驾"></page-header>
            <div>
                <cell title="试驾车型" :triangle="true" @cellClick="show">
                    <input type="text" placeholder="请选择试驾车型" readonly v-model="driveModel">
                </cell>
                <cell title="开始试驾时间" :triangle="true" @cellClick="startClick">
                    <input type="text" placeholder="请选择开始时间" readonly v-model="startTime">
                </cell>
                <cell title="结束试驾时间" :triangle="true" @cellClick="endClick">
                    <input type="text" placeholder="请选择结束时间" readonly v-model="endTime">
                </cell>
                <remark title="备注" v-model="dRemark"></remark>
            </div>
            <div class="submit" v-show="showBtn">
            <!-- <div class="submit"> -->
                <mt-button size="large"
                    @click="save"
                    :type="showLoading ? 'default' : 'primary'"
                    :disabled="showLoading">保存</mt-button>
            </div>
            <!-- model -->
            <modal :title="modalTitle" submitText="确定" ref="modal" @submit="handOk">
                <div class="t-select-box">
                    <mt-picker :slots="slots" @change="onValuesChange" ></mt-picker>
                </div>
            </modal>
        </div>
        <div v-if="showSelect">
            <like-vehicle @revert="hide" ensuredispaly="carstyle" @confirm="confirmCar"></like-vehicle>
        </div>

        <div v-show="showLoading" class="loading-container">
            <loading title=""></loading>
        </div>
    </div>
    <!-- </transition> -->
</template>

<script>
    import Loading from 'components/loading/loading'
    import Cell from 'components/cell'
    import LiveSelect from 'components/select'
    import Remark from 'components/remark'
    import PageHeader from "components/header/PageHeader"
    import Modal from 'components/modal/index'
    import LikeVehicle from 'components/likevehicle/likevehicle'
    import api from 'common/api'
    import config from 'common/config'
    import common from 'common/common'
    import Vue from 'vue'
    import {Toast, Button, Picker} from 'mint-ui'
    import {mapGetters,mapActions} from 'vuex'
    Vue.component(Picker.name, Picker);
    Vue.component(Button.name, Button);
    const hour = () => {
        let h = []
        for (let i = 0; i < 24; i++) {
            if (i < 10) {
                h.push(parseInt(`0${i}`))
            } else {
                h.push(i)
            }
        }
        return h
    }
    const minute = () => {
        let m = []
        for (let i = 0; i < 60; i++) {
            if (i < 10) {
                m.push(parseInt(`0${i}`))
            } else {
                m.push(i)
            }
        }
        return m
    }
    const _defaultIndex = (arr, current) => arr.findIndex((a) => a >= current)
    const REQUIRED_INFO = '试驾车型必填'
    const START_TITLE = '开始试驾时间'
    const END_TITLE = '结束试驾时间'
    const TIME_ALERT_INFO = '结束试驾时间必须大于开始试驾时间'
    const SAVE_SUCCESS = '保存成功'
    const OVER_TIME_ALERT = '试驾结束时间晚于当前时间，请重新填写'
    const FIRSTIN_STORE_TIME = '开始时间需要晚于记录当日的进店时间'
    const END_TIME = '试驾结束时间需早于接待结束时间'

    export default {
        components: {
            Cell,
            LiveSelect,
            Remark,
            PageHeader,
            Modal,
            LikeVehicle,
            Loading
        },
        data() {
            return {
                showSelect: false,
                driveModel: '',
                modalTitle: '',
                slots: [
                    {
                        flex: 1,
                        values: hour(),
                        className: 'slot1',
                        textAlign: 'right',
                        defaultIndex: _defaultIndex(hour(), this.currentHours()),
                        value: _defaultIndex(hour(), this.currentHours())
                    },
                    {
                        divider: true,
                        content: ':',
                        className: 'slot2'
                    },
                    {
                        flex: 1,
                        values: minute(),
                        className: 'slot3',
                        textAlign: 'left',
                        defaultIndex: _defaultIndex(minute(), this.currentMinutes()),
                        value: _defaultIndex(minute(), this.currentMinutes())
                    }
                ],
                startTime: '',
                endTime: '',
                selectedStartTime: '',
                selectedEndTime: '',
                dRemark: '',
                tryDriveParams: {},
                showLoading: false,
                currentTime:'',
                currenDate:'',
                showBtn:false,

                // 接待时间
                receptionStartTime: '',
                receptionEndTime: '',

                // 滚动时间
                changeHour: '',
                changeMinute: '',

                // 确定时间
                selectHour: '',
                selectMinute: '',
                //当日进店时间
                todayInStoreTime: ''
            }
        },
        mounted() {
           this.getCurrentTime();
           this.getReceptionTime()
	    },
        computed: {
            ...mapGetters('customer', [
                'getCusLeadInfo'
            ])
        },
        methods: {
    	   	...mapActions({
	            setCusLeadInfo: "customer/setCusLeadInfo",
	        }),
        	//获取当前系统时间
        	getCurrentTime(){
        		api.getCurrentTime.query({},res => {
                    this.currenTime = res.data.substring(11, 16)
                    //当前时间
        			this.currentDate = res.data.substring(0, 10)
                    // let firstInStoreTime = this.getCusLeadInfo.firstInStoreTime
                    // 客流进店时间为 null || 不是当天时间 || 试驾一结束，隐藏保存按钮
                    //获取客流信息
                    //判断线索数是否大于0,如果存在线索数遍历数组判断数组里是否存在当天进店线索数
                        let receptionListInfoVosList = this.getCusLeadInfo.receptionListInfoVos
                        if( receptionListInfoVosList !=null && receptionListInfoVosList.length > 0 ){
                        receptionListInfoVosList.forEach((v)=>{
                            if(v.receptionStartTime.substring(0, 10) == this.currentDate){
                                this.showBtn = true
                                //将进店时间保存,以便选取时间比较
                                this.todayInStoreTime = v.receptionStartTime
                                this.receptionStartTime = v.receptionStartTime && v.receptionStartTime.substring(11, 16)
                                this.receptionEndTime = v.receptionEndTime && v.receptionEndTime.substring(11, 16)
                            }
                        })
                        }
                    // if((firstInStoreTime == null) || (this.currentDate !== firstInStoreTime.substring(0, 10))) {
                    //     this.showBtn = false
                    // }
        		})
            },
            getReceptionTime() {
                const params = { leadCode: this.$route.query.leadCode }
                api.lead.queryLeadDetail(params).then(res => {
                    if (res && res.data.code == 'success') {
                        if (res.data.obj && res.data.obj[0] && res.data.obj[0].receptionListInfoVos && res.data.obj[0].receptionListInfoVos[0]) {
                            // const Vo = res.data.obj[0].receptionListInfoVos[0]
                            // this.receptionStartTime = Vo.receptionStartTime && Vo.receptionStartTime.substring(11, 16)
                            // this.receptionEndTime = Vo.receptionEndTime && Vo.receptionEndTime.substring(11, 16)
                            //由上脚进入试乘试驾页面,显示保存按钮
                            this.showBtn = true
                        }
                    }
                })
            },
            show() {
                this.showSelect = true
            },
            hide() {
                this.showSelect = false
            },
            confirmCar(item) {
                this.tryDriveParams = item
                let brandName = item.carbranddata.brandName,
                    seriesName = item.cartraindata.seriesName,
                    modelName = item.cartypedata.modelName,
                    unionName = item.carstyledata.unionName;
                this.driveModel = `${brandName}  ${seriesName}  ${modelName}  ${unionName}`
                this.hide()
            },
            startClick() {
                this.modalTitle = START_TITLE
                this.$refs.modal.open()
            },
            endClick() {
                this.modalTitle = END_TITLE
                this.$refs.modal.open()
            },
            onValuesChange(el, val) {
                this.slots[0].defaultIndex = _defaultIndex(hour(), this.currentHours())
                this.slots[0].value = _defaultIndex(hour(), this.currentHours())
                this.slots[2].defaultIndex = _defaultIndex(minute(), this.currentMinutes())
                this.slots[2].value = _defaultIndex(minute(), this.currentMinutes())

                const _hours = this._time(val[0], this.currentHours()),
                      _minute = this._time(val[1], this.currentMinutes());

                this.changeHour = _hours
                this.changeMinute = _minute

                this.modalTitle === START_TITLE
                    ? this.selectedStartTime = `${_hours}:${_minute}`
                    : this.selectedEndTime = `${_hours}:${_minute}`
            },
            _time(t, current) {
                if(t == undefined) {
                    return current < 10 ? `0${current}` : current
                }else {
                    return t < 10 ? `0${t}` : t
                }
            },
            currentHours() {
                if (this.selectHour) {
                    return this.selectHour
                } else {
                    let h = new Date().getHours()
                    return h < 10 ? `0${h}` : h
                }
            },
            currentMinutes() {
                if (this.selectMinute) {
                    return this.selectMinute
                } else {
                    let m = new Date().getMinutes()
                    return m < 10 ? `0${m}` : m
                }
            },
            handOk() {
                this.startTime = this.selectedStartTime
                this.endTime = this.selectedEndTime
                this.selectHour = this.changeHour
                this.selectMinute = this.changeMinute
            },
            save() {

            	let currTime = '';
            	const firstInStoreTime = this.todayInStoreTime
            	const firstInStoreStr = firstInStoreTime.substring(11,16)
               
                /*不是当天时间或是客流进店时间为null，隐藏保存按钮*/
                if (this.tryDriveParams.carbranddata == undefined) {
                    Toast(REQUIRED_INFO)
                    return
                }
                
                if (!this.compareTime(this.startTime, this.endTime)) {
                    Toast(TIME_ALERT_INFO)
                    return
                }

                /*开始试驾与进店时间逻辑*/
                if(!this.compareTime(firstInStoreStr, this.startTime)){
                	Toast(FIRSTIN_STORE_TIME)
                	return
                }

                /*点击保存的时候在拿一次当前时间，与结束时间对比*/
            	api.getCurrentTime.query({},res => {
                    currTime = res.data.substring(11,16)

                    // 开始时间 不能早于 接待时间
                    if (this.startTime < this.receptionStartTime) {
                        Toast(FIRSTIN_STORE_TIME)
                        return
                    }

                    // 结束时间不能晚于接待时间
                    if (this.receptionEndTime && this.endTime > this.receptionEndTime ) {
                        Toast(END_TIME)
                        return
                    }

                    // 结束时间不能晚于当前时间
              	    if(this.compareTime(currTime, this.endTime)) {
                        Toast(OVER_TIME_ALERT)
                	    return
                    }

                    this.showLoading = true

                    this.getSequence(config.customerDetail.tryDriveSeq, res => {
                        let params = [{
                            actualTrialDriveCode: res,
                            leadCode: this.getCusLeadInfo.leadCode,
                            customCode: this.getCusLeadInfo.customCode,
                            brandCode: this.tryDriveParams.carbranddata.brandCode,
                            modelCode: this.tryDriveParams.cartypedata.modelCode,
                            seriesCode: this.tryDriveParams.cartraindata.seriesCode,
                            actualTryTimeBegin: `${this.getCurrentDate()} ${this.startTime}`,
                            actualTryTimeEnd: `${this.getCurrentDate()} ${this.endTime}`,
                            remark: this.dRemark
                        }]
                        api.customer.insertTryDrive(params).then(res => {
                            this.showLoading = false
                            if (res.data.code === 'success') {
                                Toast(SAVE_SUCCESS)
                                this.$router.go(-1)
                            } else {
                                Toast(res.data.message)
                            }
                        })
                    })
                })
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
            }
        }
    }
</script>

<style lang="scss">
    // .fade-enter-active, .fade-leave-active {
    //     transition: all 1s ease
    // }
    // .fade-enter, .fade-leave-to {
    //     transform: translate3d(100%, 0, 0)
    // }
    .submit {
        padding: 0 rem(20);
        margin-top: rem(65);
    }
    .car {
        margin-top: rem(10);
    }
    .tost {
        width: 100%;
        height: rem(72);
        text-align: center;
        color: #ffffff;
        background: rgba(254, 56, 36, 0.90);
        line-height: rem(72);
    }

    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
