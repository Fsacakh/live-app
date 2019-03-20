<template>
    <div class="experienceCarBox">
        <div class="experienceCar w" @click="addTryDrive">
            <span class="tl">试乘试驾</span>
            <i class="iconfont" :class="{ 'icon-icon-tianjia' : isSc }"></i>
        </div>
        <div class="experienceCarList w" v-for="item in list">
            <div class="imgeCar tc">
                <i class="iconfont icon-shichengshijia"></i>            
            </div>
            <div class="titletextCar w">
                <p class="car-name">{{name(item)}}</p>
                <p><span>试乘试驾时间: &ensp;</span> {{item.experienceTime}}</p>
            </div>
        </div>
    </div>
</template>
<script>
    import {mapGetters} from 'vuex'
    import config from 'common/config'
    const SC_POST_TYPE_CODE = config.root.scPostTypeCode
    const SM_POST_TYPE_CODE = config.root.smPostTypeCode
    export default {
        data() {
            return {
                list: [],
                isSc: false
            }
        },
        mounted() {
            if(this.$route.name === 'customer-detail') {
                this.getDriveCarList(this.getCusLeadInfo.trialDriveListInfoVos)               
            }
        },
        computed: {
            ...mapGetters("customer", [
                "getCusLeadInfo",
                "getLoginInfo"
            ])
        },
        methods: {
            root() {
                const postnTypes = new Set(this.getLoginInfo.postnTypes)
                if(postnTypes.has(SC_POST_TYPE_CODE)) {              
                    this.isSc = true             
                }else if(postnTypes.has(SM_POST_TYPE_CODE)) {
                    this.isSc = false
                }
            },
            name(item) {
                // const _name = `${item.brandName} ${item.seriesName} ${item.modelName}`
                // return item.carName ? `${_name} ${item.displayName}` : `${_name}`
                
                const joinCarName = `${item.brandName || ''} ${item.seriesName || ''} 
                                     ${item.modelName || ''} ${item.displayName || ''}`
                return joinCarName
            },
            addTryDrive() {
                if(!this.isSc) {
                   return
                }
                this.$router.push({
                    path: '/addattempt',
                    query:{
                    	leadCode:this.$route.params.code
                    }
                   
                })
            },
            getDriveCarList(val) {
                if(!val) {
                    this.list = []                    
                    return
                }
                this.list = []
                val.forEach(item => {
                    let data = {
                        // models: item.modelName,
                        brandName: item.brandName,
                        seriesName: item.seriesName,
                        modelName: item.modelName,
                        carName: item.carName,
                        experienceTime: this.format(item)
                    }
                    this.list.push(data)
                })
            },
            // creat by lwx  2017/11/30
            // return time format => "2017/10/18 12:00-13:30"
            format(item) {
                if(item.actualTryTimeBegin && item.actualTryTimeEnd) {
                    let date = item.actualTryTimeBegin.substring(0, 10).replace(/-/g, '/')
                    let timeStart = item.actualTryTimeBegin.substring(11, 16)
                    let timeEnd = item.actualTryTimeEnd.substring(11, 16)
                    return `${date} ${timeStart}-${timeEnd}`
                }else {
                    return ''
                }
            }
        },
        watch: {
            getCusLeadInfo(val) {
                this.getDriveCarList(val.trialDriveListInfoVos)
            },
            getLoginInfo() {
                this.root()
            }
        }
    }
</script>
<style lang="scss">
    .experienceCarBox {
        padding-left: rem(30);
        border-bottom: 1px solid #F0F2F4;
    }
    .experienceCar {
        position: relative;
        box-sizing: border-box;
        height: rem(81);
        padding: rem(22) rem(63) rem(21) rem(0);
        display: table;
    }
    .experienceCar > span {
        display: table-cell;
        height: rem(37);
        color: #333;
        font-size: rem(26)
    }
    .experienceCar > i {
        font-size: rem(26);
        position: absolute;
        top: 50%;
        transform: translateY(-50%);
        right: rem(10);
        color: #CBC7C2;
        margin-right: remp(5);
    }
    .experienceCarList {
        position: relative;
        box-sizing: border-box;
        padding: rem(18) rem(0) rem(18) rem(132);
        height: rem(110);
        display: table;
        border-bottom: 1px solid #F0F2F4;
    }
    .experienceCarList:last-child {
        border-bottom: none;
    }
    .experienceCarList > div:first-child {
        position: absolute;
        display: table-cell;
    }
    .experienceCarList > div:last-child {
        display: table-cell;
        width: 100%;
    }
    .imgeCar {
        top: rem(18);
        left: rem(0);
        width: remp(55);
        height: remp(36.8);
        background-color: #D2EDF3;
        text-align: center;
        line-height: remp(36.8);
        i {
            color: #fff;
            font-size: remp(26)
        }
    }
    .titletextCar > p:first-child {
        // width: 100%;
        height: rem(33);
        font-size: rem(24);
        color:#343535;  
        margin-bottom: rem(8);
    }
    .titletextCar > p:last-child {
        display: table-cell;
        width: 100%;
        height: rem(33);
        font-size: rem(24);
        color:#52524F;
    }

    .car-name {
        overflow: hidden; 
        text-overflow: ellipsis; 
        -o-text-overflow: ellipsis;
        white-space:nowrap;
        width:remp(280);
    }
</style>