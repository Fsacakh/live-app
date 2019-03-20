<template>
<div>
    <div class="listselect" @click="cancelselect" v-if="listselectShow">
        <div class="modelContainer">
            <div class="title p-l-10 p-r-10">
                <span @click="cancelselect">取消</span>
            </div>
            <ul>
                <li v-for="(item, index) in accountType" :key="index" @click="chooseItemOne(item, accountnum)">{{ item.text }}</li>
            </ul>
        </div>
    </div>
</div>
</template>
<script>
    import api from '../../common/api'
    import config from '../../common/config'
    import { mapState } from 'vuex'
    export default {
        props: {
            listselectShow: {
                type: Boolean,
                default: false
            },
            accountnum: {
                type: Number,
                default: 0,
            },
            dataInfo: {
                type: Function,
                default: function() {
                    return function() {}
                }
            },
            leadAddInfo: {
                type: Function,
                default: function() {
                    return function() {}
                }
            }
            // refCode: {
            //     type: String,
            //     default: ''
            // }
            //    chooseItemOne: {
            //        type: Function,
            //         default: function() {
            //             return function() {}
            //         }       
            //    },
        },
        data() {
            return {
                leadAddType: '',
                // listselectShow: false
            }
        },
        computed: {
            ...mapState('servicefee', [
                'accountType',
            ])
        },
        created() {
            // this.getAccountType()
        },
        methods: {
            chooseItemOne(val, num) {
                this.dataInfo(val, num)
                this.leadAddInfo(val, this.leadAddType)
            },
            //获取账类
            getAccountType: function (ref, type) {
                const $this = this
                this.leadAddType = type
                this.$store.dispatch('servicefee/getServiceType', {
                    poros: {refCode: ref},
                    callBack: function(msg) {
                        if(msg.data.code=="success") {
                            $this.$emit('changeSelect', true)
                        }
                    }
                })
            },
            //关闭select
            cancelselect() {
                this.$emit('closeSelect', false)
                // this.listmodelShowOne = false
            },
        },
    }
</script>
<style lang="scss">
.listselect {
    position: fixed;
    -webkit-transform: translateZ(0);
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0,0,0,.4);
    z-index: 100;
}
.listselect>.modelContainer {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: rem(350);
    background-color: #e7e7e7;
}
.listselect>.modelContainer .title {
    height: rem(80);
    line-height: rem(80);
    background-color: rgb(54, 172, 254);
    color: #fff;
}
.listselect>.modelContainer ul {
    height: rem(270);
    overflow-y: auto;
    background-color: #fff; 
}
.listselect>.modelContainer ul li {
    height: rem(70);
    line-height: rem(70);
    text-align: center;
    box-sizing: border-box;
    border-bottom: 1px solid #ccc;
    color: rgb(126, 131, 135); 
}
</style>
