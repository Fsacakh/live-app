<template>
    <div class="day-wrap">
        <van-picker show-toolbar :columns="columns" @cancel="onCancel" @confirm="onConfirm"/>
    </div>
</template>

<script>
import Vue from 'vue';
import { Picker } from 'vant';
Vue.use(Picker)
export default {
    data() {
        return {
            columns: ['All']
        }
    },
    props:{
        yearMonth: String
    },
    created(){
        this.getDay();
    },
    methods: {
        getDay(){
            //获取当月天数
            let yearMonthFmt = this.yearMonth.split('/'),
                day = new Date(yearMonthFmt[0], yearMonthFmt[1], 0);
            for(let i = 0; i < day.getDate(); i ++){
                this.columns.push(i < 9 ? '0' + (i + 1) : (i + 1));
            }
        },
        onConfirm(picker, value, index) {
            this.$emit('onConfirm', picker, value, index);
        },
        onCancel(){
            this.$emit('onCancel');
        }
    }
}
</script>

<style lang="scss" @scoped>

</style>


