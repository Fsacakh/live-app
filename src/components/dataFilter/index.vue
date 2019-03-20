<template>
  <div class="filterbar" :style="{'top': top + 'px'}">
    <div class="container">
      <div class="row">
        <div class="col" :class="{'selected': index == selectedIndexMenu}" @click="handleShowDialog(barMenu, index)" v-for="(barMenu, index) in barMenus" :key="index">
          {{barMenu.name}}
          <img v-if="index == selectedIndexMenu" src="../../assets/imgage/up.png">
          <img v-else src="../../assets/imgage/down.png">
        </div>
      </div>
      <pop :filterTop="top" :show-dialog="isShow" :hasTabHeader="hasTabHeader" :menu="selectedMenu" @changeTab="handleChangeTab" @changeMainItem="handleChangeMainItem" @changeSelect="changeSelect" @closeDialog="handleCloseDialog"></pop>
    </div>
  </div>
</template>
<script>
  import pop from './pop'
  export default {
    name: 'data-filter',
    props: {
      barMenus: {
        type: Array,
        required: true,
        validator: function(value) {
          //TODO:验证数据有效性
          return true;
        }
      },
      top: String
    },
    data() {
      return {
        isShow: false,
        hasTabHeader: false,
        selectedMenu: {},
        selectedIndexMenu: -1,
        selectedTabIndex: -1,
      }
    },
    methods: {
      handleShowDialog(menu, index) {
        this.isShow = true;
        this.selectedMenu = menu;
        this.selectedIndexMenu = index;
        this.selectedTabIndex = index;
        if (menu.showTabHeader) {
          this.hasTabHeader = true;
        } else {
          this.hasTabHeader = false;
        }
        let _menu = JSON.parse(JSON.stringify(menu));
        _menu.tabs = {};
        this.$emit('showDialog', _menu);
      },
      handleChangeTab(tab) {
        this.$emit('changeTab', tab.index);
      },
      handleChangeMainItem(mainItem) {
        let _this = this
        mainItem.i = _this.selectedTabIndex
        let _mainItem = JSON.parse(JSON.stringify(mainItem))
        this.$emit('changeMainItem', _mainItem);
      },
      handleCloseDialog() {
        this.isShow = false;
        this.selectedIndexMenu = -1;
        this.$emit('closeDialog');
      },
      changeSelect() {
        var selectData = [];
        this.barMenus.forEach(function(barMenu, index, arr) {
          let _selectBarData = {};
          // console.log("barMenu.name: " + barMenu.name);
          _selectBarData.name = barMenu.name;
          _selectBarData.value = barMenu.value;
          _selectBarData.tab = {};
          if (barMenu.selectIndex >= 0) {
            let tab = barMenu.tabs[barMenu.selectIndex];
            // console.log("tab.name: " + tab.name);
            _selectBarData.tab.name = tab.name;
            _selectBarData.tab.value = tab.value;
            if (tab.selectIndex >= 0) {
              let mainItem = tab.detailList[tab.selectIndex];
              _selectBarData.tab.mainItem = {}
              // console.log("mainItem.name: " + mainItem.name);
              _selectBarData.tab.mainItem.name = mainItem.name;
              _selectBarData.tab.mainItem.value = mainItem.vaule;
              let subItem = false;
              if (mainItem.list) {
                if (mainItem.selectIndex >= 0) {
                  subItem = mainItem.list[mainItem.selectIndex];
                  _selectBarData.tab.mainItem.subItem = {};
                  // console.log("subItem.name: " + subItem.name);
                  _selectBarData.tab.mainItem.subItem.name = subItem.name;
                  _selectBarData.tab.mainItem.subItem.value = subItem.value;
                }
              } else {
                _selectBarData.tab.mainItem.subItem = subItem;
              }
            }
            selectData.push(_selectBarData);
          }
        });
        this.$emit('changeSelect', selectData);
      }
    },
    components: {
      pop
    }
  }
</script>
<style lang="scss">
  .filterbar {
    width: 100%;
    background: #fff;
    position: fixed;
    //-webkit-transform: translateZ(0);
    top: rem(88);
    z-index: 100;
    max-width: 750px;
    .container {
      width: 100%;
      outline: 1px solid #DBDCDE;
      position: relative;
      .row {
        display: flex;
        display: -ms-flexbox;
        display: -moz-box;
        display: -webkit-box;
        display: -webkit-flex;
        flex-direction: row;
        -webkit-flex-direction: row;
        width: 90%;
        height: rem(88);
        margin: 0 auto;
        line-height: rem(88);
        .selected {
          color: rgb(0, 140, 238);
        }
        .col {
          img {
            margin-left: 5px;
            width: rem(16);
            height: rem(10);
            vertical-align: middle;
          }
          margin-right: rem(35);
        }
      }
    }
  }
</style>
