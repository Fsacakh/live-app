<template>
    <div class="profit-table">
        <Table @on-sort-change="sortData"  width='100%'  :height="tableHeight" border :columns="selectHeader" :data="copytableData" size="small" ref="table"></Table>
    </div>
</template>
<script>
import Vue from 'vue'
import 'iview/dist/styles/iview.css';
import { Table, Button } from 'iview';
import '@/assets/css/profitboard.css';
export default {
    data () {
        return{
            isAsc: true,
            selectHeader:[
                {
                    title:'门店',
                    key: 'store_name',
                    width: 100,
                    fixed: 'left',
                    align: 'center',
                    className: 'table-info-column',
                    render: (h, params) => {
                        return h('div', [h('div', {
                            style: {
                                marginRight: '5px'
                            },
                            on: {
                                click: () => {
                                    this.route(params)
                                }
                            }
                            }, `${params.row.store_name}`)])}
                },
                {
                    title:'总库存数',
                    key: 'totalCycleSkuNum',
                    width: 100,
                    align: 'center',
                    "sortable": "custom"
                },
                {
                    title:'未订单虚报库存',
                    key: 'deceitCarSkuNum',
                    width: 100,
                    align: 'center',
                    "sortable": "custom"
                },
                {
                    title:'超180天',
                    key: '181dayUpLibraryAgeKpi',
                    width: 100,
                    align: 'center',
                    "sortable": "custom"
                },
                {
                    title:'90-180天',
                    key: '91-180dayLibraryAgeKpi',
                    width: 100,
                    align: 'center',
                    "sortable": "custom"
                },
                {
                    title:'61-90天',
                    key: '61-90dayLibraryAgeKpi',
                    width: 100,
                    align: 'center',
                    "sortable": "custom"
                },
                {
                    title:'31-60天',
                    key: '31-60dayLibraryAgeKpi',
                    width: 100,
                    align: 'center',
                    "sortable": "custom"
                },
                {
                    title:'0-30天',
                    key: '0-30dayLibraryAgeKpi',
                    width: 100,
                    align: 'center',
                    "sortable": "custom"
                }
            ],
            copytableData:[]
        }
    },
    props:{
        tableData:{
            type: Array,
            default: function (){
                return []
            },
        },
        tableHeight: {
            type: Number,
            default: 400
        }
    },
    mounted(){
        this.copytableData = this.tableData
    },
    methods:{
        route(params){

            if (params.row.store_code == '') {
                return;
            }
            this.$router.push({
                path: '/inventoryDetial',
                query: {
                    storeCode: params.row.store_code,
                    storeName: params.row.store_name
                }
            })
        },

        //表格排序的方法
        sortData(colum){
            let keyData = colum.key;
            let storageArr = this.tableData.slice(1)
            if(this. isAsc === true) {

                storageArr = storageArr.sort(this.ascData(keyData))

            } else {
                storageArr = storageArr.sort(this.descData(keyData))
            }
            storageArr.unshift(this.tableData[0])
            // this.tableData = storageArr
            this.copytableData = JSON.parse(JSON.stringify(storageArr))
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
        computedTotalNum(obj, keys){
            let total = 0
            obj.forEach(v =>{
                total += v[keys]
            })
            return total
        }
    },
    watch: {
        tableData(value){
            this.copytableData = value
        },
        deep: true
    },
    components: {
        Table,
        Button
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
    .ivu-table td.table-info-column{
        background-color: #2db7f5;
        color: #fff;
    }
}

</style>
