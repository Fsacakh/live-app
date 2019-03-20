<template>
    <div>
        <div class="cell-box">
            <cell title="意向级别" :triangle="true" @cellClick="showSelect">
                <input type="text" placeholder="请选择客户意向级别" readonly v-model="intenLevel.text">
                <i class="iconfont " :class="{ 'icon-icon-tiaozhuanjiantou' : isSc }" slot="right"></i>
            </cell>
        </div>
        <select-item
           :initValue="intenLevel" 
           :items="list"
           ref="select"
           @handOk="handOk">
        </select-item>
        <div v-show="showLoading" class="loading-container">
            <loading title=""></loading>
        </div>
    </div>
</template>
<script>
    import Loading from 'components/loading/loading'
    import Cell from 'components/cell'
    import SelectItem from 'components/select-item/select-item'
    import {mapGetters, mapActions} from 'vuex'
    import api from 'common/api'
    import config from 'common/config'
    import common from 'common/common'
    import {Toast} from 'mint-ui'
    const REF_CODE = config.customerDetail.intenLevelRef
    const SC_POST_TYPE_CODE = config.root.scPostTypeCode
    const SM_POST_TYPE_CODE = config.root.smPostTypeCode
    export default { 
        data() {
            return {
                list: [],
                intenLevel: { 
                    text: '',
                    value: ''
                },
                showLoading: false,
                isSc: false
            }
        },
        mounted() {
            if(this.$route.name === 'customer-detail') {
                this.intenLevel.text = this.getCusLeadInfo.intentionLevelName                
            }
            this.getList()
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
            showSelect() {
                if(this.isSc) this.$refs.select.open()
            },
            handOk(item) {
                this.showLoading = true
                this.intenLevel.text = item.text
                let params = {
                    id: this.getCusLeadInfo.id,
                    leadCode: this.getCusLeadInfo.leadCode,
                    storeCode: this.getCusLeadInfo.storeCode,
                    customCode: this.getCusLeadInfo.customCode,
                    customName: this.getCusLeadInfo.customName,
                    mobilePhone: this.getCusLeadInfo.mobilePhone,
                    channelCode: this.getCusLeadInfo.channelCode,
                    sourceCode: this.getCusLeadInfo.sourceCode,
                    intentionLevelCode: item.value,                    
                }
                this.updateLead(params).then(() => {
                    const _params = { leadCode: this.$route.params.code.split('-')[0] }
                    this.setCusLeadInfo(_params) 
                })
            },
            getList() {
                let params = {refCode: REF_CODE}
                api.ref.getDataDictionary(params, (res) => {
                    if(!res.data.obj) {
                        return
                    }
                    let items = res.data.obj.referenceDetailInfos
                    if(res.data.code === 'success' && items !== null) {
                        items.forEach(item => {
                            let data = {
                                text: item.refDetailName,
                                value: item.refDetailCode,
                                charCode: item.refDetailName.substring(0, 1).charCodeAt()
                                // sort: item.refDetailCode.substring(5, 11),
                            }
                            this.list.push(data)
                        })
                        // this.list.sort(this.compare('sort'))       方法一
                        // this.list.sort(common.compare('text'))     方法二
                        this.list.sort(common._sort('charCode'))   // 方法三
                        // this.list.sort((a, b) => {
                        //     return a.charCode - b.charCode
                        // })                        
                    }
                })
            },
            updateLead(params) {
                return new Promise((resolve, reject) => {
                    api.task.updateLead(params).then(res => {
                        this.showLoading = false                        
                        if(res.data.code === 'success') {
                            Toast(config.alertInfo.success)
                            resolve()
                        }
                    })
                })
            },
            ...mapActions({
                setCusLeadInfo: "customer/setCusLeadInfo"
            })
        },
        watch: {
            getCusLeadInfo(val) {
                this.intenLevel.text = val.intentionLevelName
            },
            getLoginInfo() {
                this.root()
            }
        },
        components: {
            Cell,
            SelectItem,
            Loading
        }
    }
</script>
<style lang="scss">
    .cell-box {
        border-bottom: 1px solid #F0F2F4; 
        input {
            text-align: right;
        }
        // i {
        //    color: #CFCBC6;
        // }
    }
    .loading-container {
        position: absolute;
        width: 100%;
        top: 50%;
        transform: translateY(-50%);
    }
</style>
    