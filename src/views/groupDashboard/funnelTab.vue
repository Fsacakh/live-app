<template>
    <div class="profit-table">
        <Table class="table-item-last"  @on-sort-change="sortData" width='100%'  :height="tableHeight" border :columns="selectHeader" :data="copytableData" size="small" ref="table"></Table>
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
            copytableData: [],
            selectHeader:[
                {
                    title:'门店',
                    key: 'store_name',
                    width: 100,
                    fixed: 'left',
                    align: 'center',
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
                    title:'进店线索数',
                    key: 'inStoreLead',
                    width: 120,
                    align: 'center',
                    "sortable": "custom"
                },
                {
                    title:'报价数',
                    key: 'orderInvocie',
                    width: 120,
                    align: 'center',
                    "sortable": "custom"
                },
                {
                    title:'新增订单',
                    key: 'orderAddCount',
                    width: 120,
                    align: 'center',
                    "sortable": "custom"
                },
                {
                    title:'开票数',
                    key: 'orderOfferPrice',
                    width: 120,
                    align: 'center',
                    "sortable": "custom"
                },
                {
                    title:'开票目标',
                    key: 'invocieTarget',
                    width: 120,
                    align: 'center',
                    "sortable": "custom"
                }
            ],
        }
    },
    props:{
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
    mounted(){

        this.copytableData = this.tableData
    },
    methods:{

        route(params){
            if (params.row.store_code == '') {
                return;
            }
            this.$router.push(`/boarddetial?storeCode=${params.row.store_code}&tableIndex=1&storeName=${params.row.store_name}`)
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
            this.copytableData = storageArr
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
        top: 0;
        z-index:999;
        width: 100%;
    }
}
</style>
