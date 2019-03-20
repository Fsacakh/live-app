<template>
<div>
    <!-- 头部导航跟进详情 -->
    <page-header :title="title">
    </page-header>
    <div>
        <cell title="客户姓名" :triangle="true">
            <input class="name" type="text" readonly v-model="getCusLeadInfo.customName">
        </cell>
        <cell title="任务类型" :triangle="true" @cellClick="selectType">
            <input type="text" placeholder="请选择类型" readonly v-model="taskType.text">
            <i class="iconfont icon-icon-tiaozhuanjiantou" slot="right"></i>
        </cell>
        <div v-show="taskType.text === '新车战败'">
            <cell title="战败原因" :triangle="true" @cellClick="selectDefeatReson">
                <input type="text" placeholder="请选择战败原因" readonly v-model="defeatReason.text">
                <i class="iconfont icon-icon-tiaozhuanjiantou" slot="right"></i>
            </cell>
        </div>
        <div v-show="showTime">
            <cell title="任务时间" :triangle="true" @cellClick="selectTime">
                <input type="text" placeholder="请选择任务时间" readonly v-model="taskTime">
                <i class="iconfont icon-icon-tiaozhuanjiantou" slot="right"></i>
            </cell>
        </div>
        <remark title="备注" v-model="taskRemark" :placeholder="remarkCondition.text" :maxlength="remarkCondition.length"></remark>
    </div>
    <div class="check-box" v-show="this.$route.params.id !== 'insert'" @click="toggle">
        <span class="check" :class="{ 'check-active': state}"></span>
        <span>已完成</span>
    </div>
    <!-- 提交 -->
    <div class="submit">
        <mt-button size="large"
            @click="save"
            :type="showLoading ? 'default' : 'primary'"
            :disabled="showLoading">{{saveText()}}
        </mt-button>
    </div>
    <!-- 电话沟通ICON -->
    <div class="clickPhone" @click="clickPhoneIcon">
        <img class="teleIcon" src="../../assets/imgage/telePhoneIcon.png" alt="">
    </div>
    <!-- 选择任务时间 -->
    <mt-datetime-picker
        ref="picker"
        type="datetime"
        :startDate="startDate"
        v-model="pickerValue"
        @confirm="confirmClick">
    </mt-datetime-picker>
    <!-- 选择任务类型 -->
    <select-item
        :initValue="taskType"
        :items="typelist"
        ref="typeSelect"
        @handOk="handOk">
    </select-item>
    <!-- 选择战败原因 -->
    <select-item
        :initValue="defeatReason"
        :items="defeatResonList"
        ref="reson"
        @handOk="handOkReson">
    </select-item>
    <!-- 加载图标 -->
    <div v-show="showLoading" class="loading-container">
        <loading title=""></loading>
    </div>
</div>
</template>
<script>
    import Vue from 'vue'
    import Loading from 'components/loading/loading'
    import PageHeader from "components/header/PageHeader"
    import Cell from 'components/cell'
    import Remark from 'components/remark'
    import SelectItem from 'components/select-item/select-item'
    import { mapGetters, mapActions } from 'vuex'
    import { DatetimePicker, Toast, Button } from 'mint-ui'
    Vue.component(Button.name, Button);
    Vue.component(DatetimePicker.name, DatetimePicker);
    import config from 'common/config'
    import api from 'common/api'
    const REF_CODE = config.customerDetail.taskRef,
          REF_RESON_CODE = config.customerDetail.defeatReason,
          SUCCESS = config.alertInfo.success,
          TIME_ALERT_INFO = '任务时间必填',
          RESON_ALERT_INFO = '战败原因必填',
          INVITE_STORE = "邀约到店",
          TELEPHONE_FOLLOW = "电话跟进",
          CONTACT_RECORD = "联系记录",
          NEW_CAR_DEFEAT = "新车战败",
          OTHER = "其他",
          TASK_TYPE_ALERT_INFO = '请选择任务类型',
          OVERDUE_TIME_ALERT_INFO = '请重新选择任务时间'
    const parserDate = function (date) {
        let t = Date.parse(date);
        if (!isNaN(t)) {
            return new Date(Date.parse(date.replace(/-/g, "/")));
        } else {
            return new Date();
        }
    }
    export default {
        data() {
            return {
                taskType: {
                    text: '',
                    value: ''
                },
                remarkCondition: {
                    text: '请输入客户意见(最多50字)',
                    length: 50 //Number.POSITIVE_INFINITY
                },
                taskTime: '',
                taskRemark: '',
                pickerValue: new Date(new Date().getTime() + 120000),
                typelist: [],
                defeatReason: {
                    text: '',
                    value: ''
                },
                defeatResonList: [] ,
                state: false,
                showLoading: false
            }
        },
        computed: {
            // 拨打电话
            call() {
                return `tel:${this.getCusLeadInfo.mobilePhone}`
            },
            send() {
                return `sms:${this.getCusLeadInfo.mobilePhone}`
            },
            startDate() {
                return new Date(new Date().getTime() + 120000)
            },
            showTime() {
                if(this.taskType.text === INVITE_STORE || this.taskType.text === TELEPHONE_FOLLOW || this.taskType.text === OTHER) {
                    return true
                }else {
                    return false
                }
            },
            title() {
                return this.$route.params.id === 'insert' ? '新建事项' : '跟进详情'
            },
            routerParams() {
                return this.$route.params.id
            },
            ...mapGetters('customer', [
                'getCusLeadInfo',
                'getFollowItem',
                "getLoginInfo"
            ])
        },
        created() {
            this.getTaskType()
            this.getDefeatReson()
        },
        mounted() {
            let _this = this
            _this.setPersonInfo({});
            if(this.$route.params.id === 'insert') {
                this.taskType.text = ''
                this.taskType.value = ''
                this.taskRemark = ''
                this.taskTime = ''
            }else {
                this.taskType = {
                    text: this.getFollowItem.scheduleTypeName || '',
                    value: this.getFollowItem.scheduleTypeCode || ''
                }
                this.taskRemark = this.getFollowItem.remark || ''
                this.taskTime = this.getTime(this.getFollowItem)
            }
        },
        methods: {
            clickPhoneIcon(event) {
                // 调用原生方法
                let appInfo = window.navigator.userAgent
                var obj = {
                    'telPhone' : this.getCusLeadInfo.mobilePhone,
                    'scName': this.getCusLeadInfo.scName,
                    'scCode': this.getCusLeadInfo.scCode,
                    'leadCode': this.getCusLeadInfo.leadCode,
                    'scheduleCode': this.$route.query.scheduleCode
                }
                wst.takeACall(JSON.stringify(obj))
            },
            ...mapActions('customer',  [
                'setPersonInfo'
            ]),
            // 点击按钮切换
            toggle() {
                this.state = !this.state
            },
            // 按钮状态切换
            saveText() {
                return this.state ? '完成跟进' : '保存'
            },
            selectType() {
                this.$refs.typeSelect.open()
            },
            selectDefeatReson() {
                this.$refs.reson.open()
            },
            handOkReson(item) {
                this.defeatReason = item
            },
            handOk(item) {
                this.taskType = item
            },
            selectTime() {
                this.$refs.picker.open();
            },
            confirmClick() {
                this.taskTime = this.formatDate(this.pickerValue)
            },
            formatDate(date) {
                if(typeof date === 'object') {
                    let y = date.getFullYear();
                    let m = date.getMonth() + 1;
                    m = m < 10 ? `0${m}` : m;
                    let d = date.getDate();
                    d = d < 10 ? `0${d}` : d;
                    let h = date.getHours();
                    h = h < 10 ? `0${h}` : h;
                    let min = date.getMinutes();
                    min = min < 10 ? `0${min}` : min;
                    return `${y}-${m}-${d} ${h}:${min}`
                } else if(typeof date === 'string' && date) {
                    return parserDate(date)
                }
            },
            // 获取战败原因
            getDefeatReson() {
                let params = {refCode: REF_RESON_CODE}
                api.ref.getDataDictionary(params, (res) => {
                    let items = res.data.obj.referenceDetailInfos
                    if(res.data.code === 'success' && items !== null) {
                        this.defeatResonList = []
                        items.forEach(item => {
                            let data = {
                                text: item.refDetailName,
                                value: item.refDetailCode
                            }
                            this.defeatResonList.push(data)
                        })
                    }
                })
            },
            // 获取任务类型
            getTaskType() {
                let params = {refCode: REF_CODE}
                api.ref.getDataDictionary(params, (res) => {
                    let items = res.data.obj.referenceDetailInfos
                    if(res.data.code === 'success' && items !== null) {
                        items.forEach(item => {
                            let data = {
                                text: item.refDetailName,
                                value: item.refDetailCode
                            }
                            this.typelist.push(data)
                        })
                    }
                })
            },
            save() {
                if (!this.taskType.text) {
                    Toast(TASK_TYPE_ALERT_INFO)
                    return
                } else if (!this.taskTime) {
                    if (this.taskType.text == INVITE_STORE || this.taskType.text == TELEPHONE_FOLLOW || this.taskType.text == OTHER) {
                        Toast(TIME_ALERT_INFO)
                        return
                    }
                }
                if (this.taskType.text === NEW_CAR_DEFEAT) {
                    if (!this.defeatReason.value) {
                        Toast(RESON_ALERT_INFO)
                        return
                    }
                }
                this.showLoading = true;
                // bug => 校验不通过还去拿了Seqence
                if (this.$route.params.id === 'insert') {
                    this.getSequence(config.customerDetail.taskSeq, res => {
                        // 新增  seq
                        let data = {
                            sequence: res
                        }
                        this.edit(data)
                    })
                } else {
                    // 逾期任务更新
                    const currentDate = new Date().getTime(),
                        _taskTime = this.formatDate(this.taskTime).getTime(),
                        flag = parseInt(this.routerParams.split('-')[1])
                    if (!flag && currentDate > _taskTime && !this.state && (this.taskType.text === INVITE_STORE || this.taskType.text === TELEPHONE_FOLLOW || this.taskType.text === OTHER)) {
                        Toast(OVERDUE_TIME_ALERT_INFO)
                        this.showLoading = false
                        return
                    }
                    // 编辑  id, seq
                    let data = {
                        sequence: this.getFollowItem.scheduleCode,
                        id: this.getFollowItem.id
                    }
                    this.state ? data.scheduleStatus = 1 : delete data.scheduleStatus
                    this.edit(data)
                }
            },
            edit(data) {
                // 逾期完成时间去当前时间
                const _currentTime = this.formatDate(new Date()),
                    _flag = parseInt(this.routerParams.split('-')[1])
                let params = [{
                    "leadCode": this.getCusLeadInfo.leadCode,
                    "scCode": this.getCusLeadInfo.scCode,        // 文档上scCode非必填, 后续通过scCode查询不到
                    "scheduleCode": data.sequence,
                    "scheduleTypeCode": this.taskType.value,
                    "scheduleSourceCode": 'appointSourceTypeScAppoint',          // 代办来源 => SC 自建来源
                    "scheduleTime": _flag || this.routerParams === 'insert' ? `${this.taskTime}:00` : `${_currentTime}:00`,
                    "remark": this.taskRemark,
                    "id": data.id || null,
                    "scheduleStatus": data.scheduleStatus || 0
                }]
                if (this.taskType.text === TELEPHONE_FOLLOW) {
                    delete params[0].arrivalTime
                    params[0].telephoneFollowUpTime = _flag || this.routerParams === 'insert' ? `${this.taskTime}:00` : `${_currentTime}:00`
                } else if (this.taskType.text === INVITE_STORE) {
                    delete params[0].telephoneFollowUpTime
                    params[0].arrivalTime = _flag || this.routerParams === 'insert' ? `${this.taskTime}:00` : `${_currentTime}:00`
                } else if (this.taskType.text === OTHER) {
                    delete params[0].arrivalTime
                    delete params[0].telephoneFollowUpTime
                    params[0].scheduleTime = _flag || this.routerParams === 'insert' ? `${this.taskTime}:00` : `${_currentTime}:00`
                } else if (this.taskType.text === NEW_CAR_DEFEAT) {
                    delete params[0].scheduleTime
                    delete params[0].arrivalTime
                    delete params[0].telephoneFollowUpTime
                    params[0].scheduleFailName = this.defeatReason.text
                } else {
                    delete params[0].scheduleTime
                    delete params[0].arrivalTime
                    delete params[0].telephoneFollowUpTime
                }
                api.task.edit(params).then(res => {
                    if (res.data.code === 'success') {
                        this.showLoading = false
                        Toast(SUCCESS)
                        this.$router.push({
                            path: `/customer-detail/${this.getCusLeadInfo.leadCode}-lll`
                        })
                        this.$router.go(-2)
                    } else {
                        this.showLoading = false
                    }
                })
            },
            getSequence(code, result) {
                api.ordinalInfo.getSequence(code, (res) => {
                    if (res.data.code === 'success') {
                        result(res.data.obj)
                    }
                })
            },
            getTime(item) {
                if(!item) {
                    return
                }
                if (item.scheduleTypeName === INVITE_STORE) {
                    return item.arrivalTime.substring(0, 16);
                } else if (item.scheduleTypeName === TELEPHONE_FOLLOW) {
                    return item.telephoneFollowUpTime.substring(0, 16);
                } else if (item.scheduleTypeName === OTHER) {
                    return item.scheduleTime.substring(0, 16);
                }
            },
            // 回头干掉
            require() {
                if(!this.taskTime) {
                    Toast(TIME_ALERT_INFO)
                    return
                }
            }
        },
        //  这里监听无效 => 为什么
        watch: {
            getFollowItem: {
                handler(val) {
                    this.taskType.text = val.type
                    this.taskRemark = val.remark
                },
                deep: true
            },
            state(val) {
                if (val) {

                } else {

                }
            }
        },
        components: {
            Cell,
            PageHeader,
            Remark,
            SelectItem,
            Toast,
            Loading
        }
    }
    // 原生调用方法
    window.callTelEnd = function (telinfo){
      /**
       * dialogTime : 拨号时间 conntedTime:接通时间
       * endTime : 结束时间 durationTime: 持续时间
       * phoneNumber : 电话号码 isConnected: 1 接通 0 未接通
       */
      let telObject
      if (typeof(telinfo) === 'object'){
        telObject = telinfo
      }
      if (typeof (telinfo) === 'string'){
        telObject = JSON.parse(telinfo)
      }
      let newParams = config.financeWorkbenchInfo.scTelFollowUpSeq
      api.ordinalInfo.getSequence(newParams, (res)=>{
          if (res.data.code === 'success'){
              let scTelFollowUpCode = res.data.obj;
              var params = {
                  'telBeginTime':telObject['dialogTime'],
                  'telConnectBeginTime':telObject['conntedTime'],
                  'telEndTime': telObject['endTime'],
                  'telHoldTime':telObject['durationTime'],
                  'telNumber': telObject['phoneNumber'],
                  'isConnected': telObject['isConnected'],
                  'scName' : telObject['scName'],
                  'scCode': telObject['scCode'],
                  'leadCode': telObject['leadCode'],
                  'followUpCode': scTelFollowUpCode
              }
              if (telObject['isConnected']){
                  params.isConnected = 1
              } else {
                  params.isConnected = 0
              }
              api.mainInfo.newIncreaseTelRecord(params, function(res){
              if (res.data.code === 'success' ){
                  Toast('数据上传成功');
              } else {
                  Toast('数据上传失败');
              }
            })
        }
      })
    }
</script>
<style lang="scss" scoped>
.submit {
    padding: 0 rem(20);
    margin-top: rem(65);
}
.name {
    color: #6F7472;
    font-size: remp(13);
}
.check-box {
    display: flex;
    align-items: center;
    padding-left: remp(10);
    width: remp(375);
    height: remp(40);
    background-color: #fff;
    margin-top: remp(10);
    box-sizing: border-box;
}
.check {
    display: inline-block;
    background-color: #fff;
    border-radius: 100%;
    border: 1px solid #ccc;
    width: 20px;
    height: 20px;
    position: relative;
    margin-right: remp(10);
}
.clickPhone {
    text-align: center;
    margin-top: remp(90);
}
.teleIcon {
    width: remp(75);
    height: remp(75);
    margin-left: 0 !important;
}
.teleIcon {
    margin-left: 20px;
}
.check::after {
    border: 2px solid transparent;
    border-left: 0;
    border-top: 0;
    content: " ";
    top: 3px;
    left: 6px;
    position: absolute;
    width: 4px;
    height: 8px;
    -webkit-transform: rotate(45deg) scale(0);
    transform: rotate(45deg) scale(0);
    -webkit-transition: -webkit-transform .2s;
    transition: -webkit-transform .2s;
    transition: transform .2s;
    transition: transform .2s, -webkit-transform .2s;
    border-color: #fff;
    -webkit-transform: rotate(45deg) scale(1);
    transform: rotate(45deg) scale(1);
}
.check-active {
    background-color: #26a2ff;
    border-color: #26a2ff;
}
.loading-container {
    position: absolute;
    width: 100%;
    top: 50%;
    transform: translateY(-50%);
}
</style>

