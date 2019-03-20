
<template>
  <div class="hello">
    <div>
      <h6>dataReportFilter component created by licb</h6>
      <data-report-filter></data-report-filter>
    </div>
    <!-- <h5>所有写好的组件在这里写</h5> -->
    <div>
      <h6>screen组件 => by lwx</h6>
      <screen @getValue="getValue"></screen>
    </div>
    <!-- <div>
      <h6>header component created by licb</h6>
      <page-header :leftOptions="leftOptions" @on-click-left="add" :rightOptions="rightOptions" @on-click-right="more">
        <div slot>hello</div>
      </page-header>
    </div> -->
    <div>
      <h6>cell box component created by licb</h6>
      <cell-box>
        <div class="flex">
          <div class="w50">
            <span>外观</span>
            <span class="m-l-20">黑</span>
          </div>
          <div class="w50">
            <span>内饰</span>
            <span class="m-l-20">黑</span>
          </div>
        </div>
      </cell-box>
    </div>
    <div>
      <h6>carInfoItem component created by licb</h6>
      <car-info-item></car-info-item>
    </div> 
    <div>
      <h6>carStockInfoItem component created by licb</h6>
      <div>
        <car-stock-info-item></car-stock-info-item>
      </div>
    </div>
    <div>
      <h6>orderApproveItem component created by licb</h6>
      <order-approve-item></order-approve-item>
    </div>
    <div>
      <h6>group component created by licb</h6>
      <group :title="group.title">
        <!-- <cell title="试驾车型" :triangle="true">
           <input type="text" placeholder="请选择试驾车型">
           <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
              <span slot="right">元</span>
           </cell> -->
        <cell title="金融" :icon="true">
          <span slot="icon" class="hehe iconfont icon-icon-jinrong"></span>
          <input type="text" placeholder="金额">
          <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
        </cell>
      </group>
    </div>
    <div>
      <h6>financeItem component created by licb</h6>
      <finance-item></finance-item>
    </div>
    <div>
      <h6>customer-list组件 => by lwx</h6>
      <customer-list :data-list="dataList"></customer-list>
    </div>
    <!-- <div>
      <h6>tabs 组件 => by pjl</h6>
      <tabs :tabList="tabList" :tabIndex="tabIndex" @changeTab="changeTab">
        <component :is="currentContent">
        </component>
      </tabs>
    </div> -->
    <div>
      <h6>cell 组件 => by pjl</h6>
      <cell title="试驾车型">
        <input type="text" placeholder="请选择试驾车型">
        <span slot="right" class="iconfont icon-icon-tiaozhuanjiantou"></span>
        <!-- <span slot="right">元</span>         -->
      </cell>
    </div>
    <div>
      <h6>headportrait 组件 => by pjl</h6>
      <div class="header">
        <headportrait name="A级" :badge="2" :sex="1"></headportrait>
      </div>
    </div>
    <div>
      <h6>headportrait 组件 => by pjl</h6>
      <live-select></live-select>
    </div>
    <div>
      <h6 @click="hehe">modal 组件 => by pjl</h6>
      <modal ref="modal" title="请选择分配销售顾问" @submit="init"></modal>
    </div>
    <div>
      <h6>组件search</h6>
      <search
      ref="search"
      :hasCheck="required"
      :dataList="datalist"
      option="supplierName"
      @dataChange="querySelect"
      @itemValue="itemValue"
      @clickShowBack="firstLoad"
      @comScroll="comScroll"
      :disabled="isforbidden">
      </search>
    </div>
  </div>
</template>

<script>
  import {
    mapState,
    mapGetters,
    mapActions
  } from 'vuex'
  import route from '@/router/index.js'
  import Screen from 'components/screen/screen'
  import PageHeader from 'components/header/PageHeader'
  import CustomerList from 'components/customer-list/customer-list'
  // import tabs from 'components/tabs/tabs'
  // import clueinfo from '@/views/customdetail/clueinfo'
  // import order from '@/views/customdetail/order'
  // import tailafter from '@/views/customdetail/tailafter'
  import cell from 'components/cell'
  import headportrait from '@/components/headportrait/headportrait'
  import liveSelect from '@/components/select'
  import carInfoItem from '@/components/carInfoItem'
  import cellBox from '@/components/cell-box'
  import carStockInfoItem from '@/components/carStockInfoItem'
  import orderApproveItem from '@/components/orderApproveItem'
  import group from '@/components/group'
  import modal from '@/components/modal'
  import financeItem from '@/components/financeItem'
  import search from '@/components/search'
  import dataReportFilter from '@/components/dataReportFilter'
  export default {
    components: {
      Screen,
      PageHeader,
      CustomerList,
      // tabs,
      // 'clueinfo': clueinfo,
      // 'order': order,
      // 'tailafter': tailafter,
      cell,
      headportrait,
      liveSelect,
      carInfoItem,
      cellBox,
      carStockInfoItem,
      orderApproveItem,
      group,
      modal,
      search,
      financeItem,
      dataReportFilter
    },
    data() {
      return {
        required: true,
        datalist: [],
        isforbidden: false,
        display: true,
        leftOptions: {
          icon: 'icon-icon-tianjia',
          showBack: false
        },
        rightOptions: {
          icon: 'icon-Search'
        },
        dataList: [
          {
            customerName: '杨过',
            level: 'C级',
            sex: '男',
            phone: '138****5678',
            car: 'C180 Grand Edition',
            date: '2017-10-16 10:23',
            status: '已预约'
          },
          {
            customerName: '小龙女',
            level: 'A级',
            sex: '女',
            phone: '138****5678',
            car: 'C180 Grand Edition',
            date: '2017-10-16 10:23',
            status: '已预约'
          },
        ],
        tabList: [{
            index: 0,
            name: '线索信息',
            component: 'clueinfo'
          },
          {
            index: 1,
            name: '订单',
            component: 'order'
          },
          {
            index: 2,
            name: '客户跟踪',
            component: 'tailafter'
          }
        ],
        tabIndex: 0,
        currentContent: 'clueinfo',
        group: {
          title: '车型'
        },
        myFilters: [],
        optGroups: [{
            value: 'user',
            label: 'User'
          },
          {
            value: 'item',
            label: 'Purchased Item'
          }
        ]
      }
    },
    computed: {
      columns() {
        return [{
          name: 'id',
          displayName: '#',
          dataType: 'number',
          optGroup: 'user'
        }, {
          name: 'email',
          displayName: 'Email',
          dataType: 'string',
          optGroup: 'user'
        }, {
          name: 'first_name',
          displayName: 'First Name',
          dataType: 'string',
          optGroup: 'user'
        }, {
          name: 'last_name',
          displayName: 'Last Name',
          dataType: 'string',
          optGroup: 'user'
        }, {
          name: 'role_id',
          displayName: 'Role',
          dataType: 'choice',
          options: [{
              key: 1,
              value: 'Admin'
            },
            {
              key: 2,
              value: 'Owner'
            },
            {
              key: 3,
              value: 'Quality Control'
            }
          ],
          hidden: true,
          optGroup: 'user'
        }, {
          name: 'music_id',
          displayName: 'Favourite Music',
          dataType: 'choice',
          options: [{
              key: 0,
              value: 'Classical'
            },
            {
              key: 1,
              value: 'Funk'
            },
            {
              key: 2,
              value: 'Jazz'
            },
            {
              key: 3,
              value: 'Pop'
            },
            {
              key: 4,
              value: 'Ska'
            }
          ],
          maxItems: 3,
          hidden: true,
          optGroup: 'user'
        }, {
          name: 'roleTitle',
          displayName: 'Role',
          dataType: 'string',
          notFilterable: true
        }, {
          name: 'joined',
          displayName: 'Joined',
          dataType: 'date',
          optGroup: 'user'
        }, {
          name: 'last_login',
          displayName: 'Last logged in',
          dataType: 'datetime',
          optGroup: 'user'
        }, {
          name: 'notes',
          displayName: 'Notes',
          dataType: 'string',
          dataFormat: 'paragraph',
          expandable: true,
          expandableFrom: 20,
          optGroup: 'user'
        }, {
          name: 'id',
          displayName: '#',
          dataType: 'number',
          optGroup: 'item'
        }, {
          name: 'name',
          displayName: 'Name',
          dataType: 'string',
          optGroup: 'item'
        }, {
          name: 'price',
          displayName: 'Price',
          dataType: 'number',
          optGroup: 'item'
        }]
      }
    },
    methods: {
      hehe() {
        console.log(1)
        this.$refs.modal.open()
        // this.$refs.modal.close()
      },
      init() {
        this.$refs.modal.close()
        //   route
      },
      // header 左侧按钮点击回调
      add() {
        console.info('add...')
      },
      // header 右侧按钮点击回调
      more() {
        console.info('more...')
      },
      getValue(data) {
        //  console.log(data)
      },
      changeTab: function(tab) {
        this.tabIndex = tab.index
        this.currentContent = tab.component
      },
      querySelect() {

      },
      itemValue() {

      },
      firstLoad() {

      },
      comScroll() {

      },
      refreshData (e) {
         alert('filter-changed event fired. Data passed:\n' + JSON.stringify(e))
      },
      ...mapActions('menu', [
        'setUpdateModal'
      ])
    },
    mounted() {
      this.setUpdateModal()
    }
  }
</script>

<style lang="scss">
  h6 {
    color: red;
  }
  .header {
    height: rem(90);
    width: rem(90);
  }
</style>
