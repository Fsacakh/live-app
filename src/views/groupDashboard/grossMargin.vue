<template>
    <div class="profit-table">
        <Table class="table-item-last" @on-sort-change="sortData" width='100%'  :height="tableHeight" border :columns="selectHeader" :data="grossTable" size="small" ref="table"></Table>
    </div>
</template>
<script>
import Vue from 'vue'
import 'iview/dist/styles/iview.css';
import { Table } from 'iview';
export default {
    data () {
        return {
            isAsc: false,
            grossTable:[]
        }
    },
    props:{
        selectHeader:{
            type:Array,
            default:function () {
                return []
            }
        },
        tableData: {
            type: Array,
            default: function () {
                return []
            }
        },
        tableHeight: {
            type: Number,
            default: 400
        }
    },
    created(){
        this.grossTable = this.comTableData
    },
    computed: {
        comTableData() {

            let obj = {
                store_code: '',
                store_name: '总计'
            }
            this.selectHeader.forEach(item =>{
                (item.key != 'store_name') && (obj[item.key] = 0);
                this.tableData.forEach(v =>{
                    (item.key != 'store_name') && (obj[item.key] += Number(v[item.key] ? v[item.key] : 0));
                })
            })
            this.tableData[0] = obj
            this.tableData[0].invocieTarget = this.tableData[0].invocieTarget
            //过滤对象中数据

            this.tableData.forEach(v =>{
                Object.keys(v).forEach(item =>{
                    if (item == 'store_code' || item == 'store_name') return;
                    v[item] = this.toThousand(v[item]) || 0
                })
            })

            return this.tableData

        }
    },
    methods:{

         toThousand(val){
            var value = 0;
            (Number(val) < 10000 || Number(val) > -10000) &&  (value = (Number(val).toFixed()));
            (Number(val) >= 10000 || Number(val) <= -10000) && (value = (Number(val) / 1000).toFixed() + 'k');
            return value
        },
        //表格排序的方法
        sortData(colum){

            let keyData = colum.key;
            let storageArr = this.comTableData.slice(1)
            if(this. isAsc === true) {

                storageArr = storageArr.sort(this.ascData(keyData))

            } else {
                storageArr = storageArr.sort(this.descData(keyData))
            }
            storageArr.unshift(this.tableData[0])
            this.grossTable = storageArr
        },

        // 排序 从小到大
        ascData(data){
            this.isAsc = false;
            return function(obj1,obj2){
                var a = obj1[data];
                var b = obj2[data];
                return a - b;
            }
        },
        // 排序 从大到小
        descData(data){
            this.isAsc = true;
            return function(obj1,obj2){
                var a = obj1[data];
                var b = obj2[data];
                return b - a;
            }
        },

    },
    watch: {
        comTableData(val) {
            this.grossTable = val
        },
        deep: true
    },
    components:{
        Table
    }
}
</script>
<style lang="scss" scoped>
.profit-table{
    position: relative;
    .table-item-first{
        position: absolute;
        left: 0;
        // top: -remp(20);
        top: 0;
        z-index:999;
        width: 100%;
    }
}
</style>
