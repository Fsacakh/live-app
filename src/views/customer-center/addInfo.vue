<template>
    <div class="b-white addInfo" v-if="showAddModal">
        <cell :title="addInfo.leadsAddInfoAgeGroup">
          <input type="text" placeholder="请选择客户年龄段" v-model="leadsAddInfoValue.leadsAddInfoAgeGroup" @click="showSelect(leadsAgeGroup, 'leadsAddInfoAgeGroup')" readonly/>
          <span @click="showSelect(leadsAgeGroup, 'leadsAddInfoAgeGroup')" slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
       </cell>
       <cell :title="addInfo.leadsAddInfoIndustry">
          <input type="text" placeholder="请选择从事行业" v-model="leadsAddInfoValue.leadsAddInfoIndustry" @click="showSelect(leadsIndustry, 'leadsAddInfoIndustry')" readonly/>
          <span @click="showSelect(leadsIndustry, 'leadsAddInfoIndustry')" slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
       </cell>
       <cell :title="addInfo.leadsAddInfoCustPosition">
          <input type="text" placeholder="请选择客户职位" v-model="leadsAddInfoValue.leadsAddInfoCustPosition" @click="showSelect(leadsCustPosition, 'leadsAddInfoCustPosition')" readonly/>
          <span @click="showSelect(leadsCustPosition, 'leadsAddInfoCustPosition')" slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
       </cell>
       <cell :title="addInfo.leadsAddInfoComBrand">
          <input type="text" placeholder="请输入竞争品牌" v-model="leadsAddInfoValue.leadsAddInfoComBrand"/>
       </cell>
       <cell :title="addInfo.leadsAddInfoComModel">
          <input type="text" placeholder="请输入竞争车型" v-model="leadsAddInfoValue.leadsAddInfoComModel"/>
       </cell>
       <cell :title="addInfo.leadsAddInfoFocus">
          <input type="text" placeholder="请选择购车关注点" v-model="leadsAddInfoValue.leadsAddInfoFocus" @click="showSelect(leadsFocus, 'leadsAddInfoFocus')" readonly/>
          <span @click="showSelect(leadsFocus, 'leadsAddInfoFocus')" slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
       </cell>
       <account-list @closeSelect="closeSelect"
                    @changeSelect="changeStatus"
                    ref="getType"
                    :listselectShow='listselectShow'
                    :accountnum='accountnum'
                    :leadAddInfo="dataInfo"
                    >
        </account-list>
    </div>
</template>
<script>
import accountList from '@/components/accounttypes'
import cell from '@/components/cell'
import config from 'common/config'
import api from 'common/api'
// import cellRow from '@/components/cellRow'
export default {
    components: {
        cell,
        accountList,
        // cellRow
    },
    data() {
        return {
            showAddModal: false,
            accountnum: 0,
            listselectShow: false,
            leadsAgeGroup: config.ref.leadsAgeGroup,
            leadsIndustry: config.ref.leadsIndustry,
            leadsCustPosition: config.ref.leadsCustPosition,
            leadsFocus: config.ref.leadsFocus,
            addInfo: [],
            leadsAddInfoValue: {
                leadsAddInfoAgeGroup: '',
                leadsAddInfoIndustry: '',
                leadsAddInfoCustPosition: '',
                leadsAddInfoComBrand: '',
                leadsAddInfoComModel: '',
                leadsAddInfoFocus: '',
            },
            leadsAddId: {
                leadsAddInfoAgeGroup: '',
                leadsAddInfoIndustry: '',
                leadsAddInfoCustPosition: '',
                leadsAddInfoComBrand: '',
                leadsAddInfoComModel: '',
                leadsAddInfoFocus: '',
            }

        }
    },
    methods: {
        setShowAddModal: function(leadCode, type) {
            if(type == 'add') {
               this.getAddInfo(res => {
                   this.queryLeadAddInfo(leadCode)

               })
            }
        },
        queryLeadAddInfo: function(code) {
            api.lead.queryLeadAddInfo({leadCode: code}, res => {
                if(res.data.code === 'success') {
                    this.showAddModal = !this.showAddModal
                    let data = res.data.obj ? res.data.obj : [];
                    data.forEach((item, index) => {
                        this.leadsAddInfoValue[item.addCode] = item.addValue
                        this.leadsAddId[item.addCode] = item.id
                    });
                }
            })
        },
        setAddData: function(leadCode) {
            let arr = []
            for(let i in this.addInfo) {
                let obj = {}
                obj.id = this.leadsAddId[i]
                obj.leadCode = leadCode
                obj.addCode = i
                obj.addName = this.addInfo[i]
                obj.addValue = this.leadsAddInfoValue[i]
                arr.push(obj)
            }
            this.$emit('leadsAddData', arr)
        },
        changeStatus: function(type) {
            this.listselectShow = type
        },
        closeSelect: function() {
            this.listselectShow = false
        },
        dataInfo: function(val, type) {
            // this.leadAddName[type] = val.text
            this.leadsAddInfoValue[type] = val.text
        },
        showSelect: function(refData, itemType) {
            this.$refs.getType.getAccountType(refData, itemType)
        },
        getAddInfo: function(sc) {
            const $this = this
            this.$store.dispatch('servicefee/getServiceType', {
                poros: {refCode: config.ref.leadsAddInfo},
                callBack: function(msg) {
                    if(msg.data.code=="success") {
                        let len = msg.data.obj.referenceDetailInfos
                        for (let i = 0; i < len.length; i++) {
                            $this.addInfo[len[i].refDetailCode] = len[i].refDetailName
                        }
                        $this.addData = msg.data.obj.referenceDetailInfos
                        sc()
                    }
                }
            })
        },
    },
}
</script>

<style lang="scss" @scope>
    .addInfo {
        margin-top: rem(30);
    }
</style>
