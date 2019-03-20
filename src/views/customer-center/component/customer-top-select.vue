
<template>
  <div>
    <div class="customer-top-select">
      <!--渠道、意向级别、状态、意向车型 主菜单 注意：主菜单的icon传入的是class名 但样式可能需要微调-->
      <div :class="['tab-main', {'activate': item.tabActivateType}]" v-for="(item, index) in selectData" :key="index" @click="tabClick($event, index)">
        <h5 :class="['tab-title ' + item.tabIcon]">{{item.value === '' ? item.tabTitle : item.value}}</h5>
        <!--tab项内容  item.tabContentType这个标记用于判断展示不同的内容样式-->
        <div v-if="item.tabContentType === 'list'" :class="['list-warp', {'list-activate': item.tabActivateType}]">
          <ul class="tab-item-list">
            <li :class="['item', {'item-activate': tabItem.itemActivateType}]" v-for="(tabItem, itemIndex) in item.itemData" :key="itemIndex" @click="tabItemClick(index, itemIndex)">{{tabItem.itemTitle}}</li>
          </ul>
        </div>
        <!--另外一种内容展示结构-->
        <div v-else :class="['list-warp', {'list-activate': item.tabActivateType}]">
          <div :class="[item.tabContentClass]">
            <!--这是两栏类型的下拉内容-->
            <div class="left">
              <h5 class="item-title">{{item.itemDataLeftTitle}}</h5>
              <ul class="tab-item-affirm">
                <li :class="['item', {'item-activate': tabItem.itemActivateType}]" v-for="(tabItem, itemIndex) in item.itemDataLeft" :key="itemIndex" @click="doubleTabClick(index, itemIndex, 'itemDataLeft', item.tabContentClass === 'oneself-bar' ? 'doubleSelect' : '')">{{tabItem.itemTitle}}</li>
              </ul>
            </div>
            <!--这是两栏类型的下拉内容-->
            <div class="right">
              <h5 class="item-title">{{item.itemDataRightTitle}}</h5>
              <ul class="tab-item-affirm">
                <li :class="['item', {'item-activate': tabItem.itemActivateType}]" v-for="(tabItem, itemIndex) in item.itemDataRight" :key="itemIndex"  @click="doubleTabClick(index, itemIndex, 'itemDataRight')">{{tabItem.itemTitle}}</li>
              </ul>
            </div>
            <div class="button clearfix"><button class="mint-button mint-button--primary mint-button--small" @click="doubleBarAffirm(index)">确定</button></div>
          </div>
        </div>
      </div>
    </div>
    <!--全局遮罩-->
    <div v-show="popBlack" class="pop-black"></div>
  </div>
</template>

<script>
//common
import api from "@/common/api.js";
import config from "@/common/config.js";
export default {
  data() {
    return {
      //遮罩层的状态控制
      popBlack: false,
      selectData:[
        //渠道
        {
          tabTitle: '渠道', //菜单名称
          tabActivateType: false, //菜单的激活状态
          tabIcon: 'icon-arrows', //绑定icon对应的类名
          tabContentType: 'list', //内容层的格式
          value: '',
          itemData:[//tab下的内容数据
            {
              itemTitle:'全部',
              itemActivateType: true,
              value: ''
            }
          ]
        },
        //意向级别
        {
          tabTitle: '意向级别', //菜单名称
          tabActivateType: false, //菜单的激活状态
          tabIcon: 'icon-arrows', //绑定icon对应的类名
          tabContentType: 'list', //内容层的格式
          value: '',
          itemData:[ //tab下的内容数据
            {
              itemTitle:'全部',
              itemActivateType: true,
              value: ''
            }
          ]
        },
        /**由于该列表分为两段所以对应的itemData也会有两组 itemDataRight及itemDataLeft */
        //状态 
        {
          tabTitle: '状态', //菜单名称
          tabActivateType: false, //菜单的激活状态
          tabIcon: 'icon-menu', //绑定icon对应的类名
          tabContentClass: 'double-bar', //由于样式不一样所以多一个属性
          value: '',
          itemDataLeftTitle: '线索状态',
          itemDataRightTitle: '销售状态',
          itemDataLeft:[ //tab下的内容数据
            {
              itemTitle:'全部',
              itemActivateType: true,
              value: ''
            },
            {
              itemTitle:'已预约',
              itemActivateType: false,
              value: '1'
            },
            {
              itemTitle:'待跟进',
              itemActivateType: false,
              value: '2'
            },
            {
              itemTitle:'到店',
              itemActivateType: false,
              value: '4'
            },
            {
              itemTitle:'试乘试驾',
              itemActivateType: false,
              value: '8'
            },
            {
              itemTitle:'准战败',
              itemActivateType: false,
              value: '16'
            }
          ],
          itemDataRight:[ //tab下的内容数据
            {
              itemTitle:'全部',
              itemActivateType: true,
              value: ''
            },
            {
              itemTitle:'未报价',
              itemActivateType: false,
              value: '0'
            },
            {
              itemTitle:'报价',
              itemActivateType: false,
              value: '1'
            },
            {
              itemTitle:'订单',
              itemActivateType: false,
              value: '2'
            },
            {
              itemTitle:'合同',
              itemActivateType: false,
              value: '4'
            },
            {
              itemTitle:'开票',
              itemActivateType: false,
              value: '8'
            },
            {
              itemTitle:'交车',
              itemActivateType: false,
              value: '16'
            }
          ]
        },
        //意向车型
        {
          tabTitle: '意向车型', //菜单名称
          tabActivateType: false, //菜单的激活状态
          tabIcon: 'icon-select', //绑定icon对应的类名
          tabContentClass: 'oneself-bar', //由于样式不一样所以多一个属性
          value: '',
          itemDataLeftTitle: '品牌',
          itemDataRightTitle: '车系',
          itemDataLeft:[ //tab下的内容数据
            {
              itemTitle:'全部',
              itemActivateType: true,
              value: ''
            }
          ],
          itemDataRight:[]
        }
      ],
      cacheSelectData:{
        cacheData: []
      },
      //被选数据
      queryParams: {
        leadsStstusCode: '', //线索状态code
        leadsStstusName: '', //线索状态Name
        salesStstusCode: '', //销售状态code
        salesStstusName: '', //销售状态名称
        intentionLevelCode: '', //意向级别code
        intentionLevelName: '', //意向级别名称
        channelCode: '', //渠道code
        channelName: '', //渠道名称
        brandCode: '', //品牌code
        brandName: '', //品牌名称
        seriesCode: '', //车系code
        seriesName: '' //车系名称
      }
    }
  },
  mounted(){
    this.initPage();
  },
  watch:{
    //
    popBlack(val){
      if(val){
        this.cacheSelectData.cacheData = JSON.parse(JSON.stringify(this.selectData));
      }
    }
  },
  methods: {
    //初始化要做的事情
    initPage(){
      this.getChannelData();
      this.getIntentionData();
      this.getCarBrand();
    },
    /**
     * 获取各项菜单内容数据
     */
    //获取对应渠道数据
    getChannelData(){
      api.ref.getDataDictionary({refCode: config.custom.canal}, (res) => {
        if(res.data.code === "success"){
          let length = res.data.obj.referenceDetailInfos.length;
          for(let i = 0; i < length; i ++){
            this.selectData[0].itemData.push({
              itemTitle: res.data.obj.referenceDetailInfos[i].refDetailName,
              itemActivateType: false,
              value: res.data.obj.referenceDetailInfos[i].refDetailCode
            })
          }
        }
      });
    },
    //获取意向级别数据
    getIntentionData(){
      api.ref.getDataDictionary({refCode: config.custom.like}, (res) => {
        if(res.data.code === "success"){
          let length = res.data.obj.referenceDetailInfos.length;
          for(let i = 0; i < length; i ++){
            this.selectData[1].itemData.push({
              itemTitle: res.data.obj.referenceDetailInfos[i].refDetailName,
              itemActivateType: false,
              value: res.data.obj.referenceDetailInfos[i].refDetailCode
            })
          }
        }
      });
    },
    //获取意向车型 品牌
    getCarBrand(){
      api.car.queryCarInfoByCarSearch({code: '', level: 2}, (res) => {
        if(res.data.code === "success"){
          let length = res.data.obj.length;
          //回去意向车型的品牌数据
          for(let i = 0; i < length; i ++){
            this.selectData[3].itemDataLeft.push({
              itemTitle: res.data.obj[i].brandName, //品牌名称
              itemActivateType: false,
              value: res.data.obj[i].brandCode //品牌code
            })
          }
        }
      });
    },


    /**
     * 点击执行事件
     * 这里所有的方法都是在操作 this.selectData这个对象内的数据
    */
    //关闭内容层及遮罩层
    tabClose(index){
      this.selectData[index].tabActivateType = false;
      this.popBlack = false;
    },
    //通过接受索引拿到当前选择的是第几项，从而操作selectData中的tabActivateType属性展开对应的下拉内容
    tabClick(e, index){
      let curDom = e.target.parentNode.getAttribute('class');
      //判断当前的点击来自于tab-main
      if(curDom.indexOf('tab-main') >= 0){
        let length = this.selectData.length;
        for(let i = 0; i < length; i ++){
          if(i === index){
            this.selectData[i].tabActivateType = !this.selectData[i].tabActivateType;
            this.popBlack = this.selectData[i].tabActivateType ? true : false; //用于判断是否有下拉框是开启状态，从而关闭遮罩层
          }else{
            this.selectData[i].tabActivateType = false;
          }
        }
      }
    },
    //渠道、意向级别内容的点击事件 index: 表示点击了哪个菜单，itemIndex: 表示点击了对应菜单下的哪个内容
    tabItemClick(index, itemIndex){
      let length = this.selectData[index].itemData.length;
      for(let i = 0; i < length; i ++){
        if(i === itemIndex){
          this.selectData[index].itemData[i].itemActivateType = true;
        }else{
          this.selectData[index].itemData[i].itemActivateType = false;
        }
      }
      //渠道和意向级别的按钮状态切换采用公用，所以这里暂时根据数组的索引值来判断赋值
      if(index == 0){ //渠道
        this.queryParams.channelName = this.selectData[index].itemData[itemIndex].itemTitle;
        this.queryParams.channelCode = this.selectData[index].itemData[itemIndex].value;
      }else if(index == 1){ //意向级别
        this.queryParams.intentionLevelName = this.selectData[index].itemData[itemIndex].itemTitle;
        this.queryParams.intentionLevelCode = this.selectData[index].itemData[itemIndex].value;
      }
      //菜单上显示对应选择内容的名称
      this.selectData[index].value = this.selectData[index].itemData[itemIndex].value === '' ? '' : this.selectData[index].itemData[itemIndex].itemTitle;

      this.tabClose(index);
      this.$emit('getValue', this.queryParams);
    },
    /** 需要注意的是，由于交互不同，布局不同，所以状态及意向车型的内容数据也会不同。
     * 分为itemDataLeft及itemDataRight, 而在意向车型中，由于采用的是二级联动的选择，
     * 所以会调用另外一个方法 doubleSelect。doubleTabClick会根据clickType进行区分*/
    //状态、意向车型 index: 表示点击了哪个菜单，itemIndex: 表示点击了对应菜单下的哪个内容，dataName: 表示点击的对应内容是哪组数据，clickType: 标识触发二级联动方法 => doubleSelect()
    doubleTabClick(index, itemIndex, dataName, clickType){
      let length = this.selectData[index][dataName].length;
      for(let i = 0; i < length; i ++){
        if(i === itemIndex){
          this.selectData[index][dataName][i].itemActivateType = true;
        }else{
          this.selectData[index][dataName][i].itemActivateType = false;
        }
      }
      //状态及意向车型都为通一个点击方法，因此这里通过index 菜单的索引值来区分，那么由于状态及意向车型的选择按钮是两栏布局的，所以还要通过dataName来区分是填充那一边的值
      //这里故意使用else if，注意判断的值
      if(index === 2){ //状态
        if(dataName === 'itemDataLeft'){ //对应左边 线索状态
          this.queryParams.leadsStstusCode = this.selectData[index][dataName][itemIndex].value;
          this.queryParams.leadsStstusName = this.selectData[index][dataName][itemIndex].itemTitle;
        }else if(dataName === 'itemDataRight'){ //对应右边 销售状态
          this.queryParams.salesStstusCode = this.selectData[index][dataName][itemIndex].value;
          this.queryParams.salesStstusName = this.selectData[index][dataName][itemIndex].itemTitle;
        }
        //如果销售状态选择了 全部，那么就要获取 线索状态当前的值作为菜单上显示的名称
        if(this.queryParams.salesStstusCode !== '' && dataName === 'itemDataRight'){
          this.selectData[index].value = this.selectData[index][dataName][itemIndex].itemTitle;
        }else if(this.queryParams.salesStstusCode === '' && this.queryParams.leadsStstusCode !== ''){
          let result = this.selectData[index].itemDataLeft.filter((item) => {
            return item.itemActivateType ? item.itemActivateType : '';
          });
          this.selectData[index].value = result.value === '' ? '' : result[0].itemTitle;
        }else if(this.queryParams.leadsStstusCode === '' && this.queryParams.salesStstusCode === ''){
          this.selectData[index].value = '';
        }
      }else if(index === 3){ //意向车型
        
        if(dataName === 'itemDataLeft'){ //对应左边 品牌
          this.queryParams.brandCode = this.selectData[index][dataName][itemIndex].value;
          this.queryParams.brandName = this.selectData[index][dataName][itemIndex].itemTitle;
        }else if(dataName === 'itemDataRight'){ //对应右边 车系
          this.queryParams.seriesCode = this.selectData[index][dataName][itemIndex].value;
          this.queryParams.seriesName = this.selectData[index][dataName][itemIndex].itemTitle;
        }
        //菜单上显示对应选择内容的名称
        this.selectData[index].value = this.selectData[index][dataName][itemIndex].value === '' ? '' : this.selectData[index][dataName][itemIndex].itemTitle;

        //如果品牌code为空则说明选择全部
        if(!this.selectData[index][dataName][itemIndex].value){
          this.queryParams.seriesCode = '';
          this.queryParams.seriesName = '';
          this.queryParams.brandName = '';
        }
      }
      
      //============== 注意 ==================
      if(clickType === 'doubleSelect'){
        this.doubleSelect(index, itemIndex, dataName);
      }
    },
    //意向车型二级联动查询
    doubleSelect(index, itemIndex, dataName){
      let options = {
        code: this.selectData[index][dataName][itemIndex].value === '' ? 'all' : this.selectData[index][dataName][itemIndex].value,
        level: 4,
        type: 1
      }
      api.car.queryCarInfoByCarSearch(options, (res) => {
        if(res.data.code === "success"){
          let length = res.data.obj.length;
          this.selectData[3].itemDataRight = [];
          //回去意向车型的品牌数据
          for(let i = 0; i < length; i ++){
            this.selectData[3].itemDataRight.push({
              itemTitle: res.data.obj[i].seriesName, //品牌名称
              itemActivateType: false,
              value: res.data.obj[i].seriesCode //品牌code
            })
          }
        }
      });
    },
    //双栏确认
    doubleBarAffirm(index){
      this.tabClose(index);
      this.$emit('getValue', this.queryParams);
    }
  }
}
</script>

<style lang="scss" scoped>
  .customer-top-select{
    position: fixed;
    width: 100%;
    height: remp(40);
    display: flex;
    justify-content: space-around;
    align-items: center;
    border-bottom: 1px solid #dedede;
    background-color: #fff;
    z-index: 1001;
  }
  /*tab菜单 */
  .tab-main{
    //菜单标题
    .tab-title{
      position: relative;
      height: remp(40);
      line-height: remp(40);
      font-size: remp(14);
      font-weight: normal;
    }
  }
  /*tab内容项*/
  .list-warp{
    position: absolute;
    top: rem(82);
    left: 0;
    width: 100%;
    z-index: 1001;
    background-color: #fafafa;
    display: none;
  }
  //横向排列结构的内容
  .tab-item-list{
    flex-wrap: wrap;
    display: flex;
    .item{
      margin: .04rem;
      padding: .05rem .2rem;
      flex-shrink: 0;
      color: #b9bdc1;
      background-color: #f0f2f5;
      display:block;
    }
    //item项被激活
    .item-activate{
      color: #fff;
      background-color: #008cee;
    }
  }
  //状态选择样式
  .double-bar{
    width: 100%;
    overflow: hidden;
    padding: .17rem 0 .07rem;
    .left{
      width: 45%;
      float:left;
      padding-left: remp(10);
    }
    .right{
      width: 45%;
      float:right;
    }
    .item-title{
      margin-left: .23rem;
      margin-bottom: .08rem;
      color: #7e8387;
    }
    .button{
      padding-top: remp(10);
      margin-bottom: remp(10);
      text-align: center;
      clear: both;
    }
    //选择型样式
    .tab-item-affirm{
      width: 100%;
      display: flex;
      flex-wrap: wrap;
      .item{
        width: 35%;
        margin: .04rem .1rem .04rem .04rem;
        padding: 0.05rem;
        text-align: center;
        color: #b9bdc1;
        background-color: #f0f2f5;
        display:block;
      }
      //item项被激活
      .item-activate{
        color: #fff;
        background-color: #008cee;
      }
    }
  }
  //二级联动，意向车型样式
  .oneself-bar{
    padding: .17rem 0 .07rem;
    .left, .right{
      width: 49%;
      float:left;
    }
    .left{
      padding-left: remp(2);
    }
    .right{
      border-left: .015rem solid #f0f2f5;
    }
    .item-title{
      margin-left: .23rem;
      margin-bottom: .08rem;
      color: #7e8387;
    }
    .button{
      padding-top: remp(10);
      margin-bottom: remp(10);
      text-align: center;
      clear: both;
    }
    //二级联动样式
    .tab-item-affirm{
      height: 2rem;
      overflow-y: auto;
      .item{
        width: 90%;
        margin: .05rem 5%;
        padding: .05rem;
        box-sizing: border-box;
        text-align: center;
        color: #b9bdc1;
        background-color: #f0f2f5;
      }
      //item项被激活
      .item-activate{
        color: #fff;
        background-color: #008cee;
      }
    }
  }

  //tab内容项激活
  .list-activate{
    display: block;
  }


//全局的遮罩
.pop-black{
  position: fixed;
  z-index: 1000;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  margin: auto;
  background-color: #000;
  opacity: 0.5;
}
/*素材*/
  //素材箭头
  .icon-arrows{
    padding-left: 0.08rem;
    padding-right: 0.08rem;
  }
  .icon-arrows:before{
    content: '';
    position: absolute;
    top: 42%;
    right: -0.06rem;
    width: .08rem;
    height: .05rem;
    display:block;
    background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAPCAYAAAD+pA/bAAAAAXNSR0IArs4c6QAAAWVJREFUOBG1ks9Kw0AQxmc2SR/AgyjeBA+efAHBUkHxBbzpMwgFk0pSglWa9lSfwfcQFU+CB0+iIIJFBBER8dSarPMdVmLaSJS4l/n3zW92NuFwP1rXCR1o0lNU5mF6VMxbdqJ1T7jlwnFRTdMJ6Z5i4usyL55mga0ccjaJ+S5dKMUXJtjK9+t9ZemaTLsvBSwQsMAEmw00bLdnk5hO5e1mTO5PlunB0dZSEGzfov9rAIJWtzs3HMQn+ECIf33w56hKNdyp35jebwOQbHU68x8DfSy/7aQRFbHyLE92hauB616l9SodwIeAlbUsDc/ZWl4MLXqycOhHNjCQ3ShaiId0JJtMmNw4K/AXy6Fa0/Mux9VHNjAiNFi2XhHAq8llLWrQ5MGhzx2AYrPRuGDmVVnzDXH6IIcaNOl81v9xAMSh754LaE2A76YZPnKomVyeFW2xE+5Fi5roEGpp2gh976xY5z+rPgFWaWlZIkSmdAAAAABJRU5ErkJggg==') no-repeat;
    background-size: 100% 100%;
  }
  //素材箭头激活样式
  .activate{
    .icon-arrows{
      color: #008cee;
    }
    .icon-arrows:before{
      background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABgAAAAPCAYAAAD+pA/bAAAAAXNSR0IArs4c6QAAAUVJREFUOBG1kz9Lw1AUxc99QSgOturqB5DODg51FHRzcBAcdVSQ0sXvEN/gIBQUVwcFFxcddXQWP4GbSbRFHEyu96ZDYpo0oZgDgffnnN95jySEqrLBCiK+iu2GdtBtPVeJUhUT3M9lIHwCeHHkp3fA6aA391qWN2UGnH4tgX7uE7gmpEjXdK9Ek29gPxYQhY/CaBdwXmCcNXSbXsE+im/Q51lweDcBrsx27FFvgfIL+jyDgX8NxmpBLllWz9C/gWZyNF7ATBgGl+LdzPHnLzE24oxmMxovsIEF827GVz7VjGYz+ltw4h0L/CjjqT7VrDJSSq5kgz1E0Xlqb/qhMfvyI14oYFTg+lsykpfKzvTUVJIolA9kG735W4LrdWTrQZ5GyvIfw2+BrBs5+VkNcD1gQ9n6kls6q0lNKaADgb/VUCBMOvwFAZBijwRJ2CQAAAAASUVORK5CYII=') no-repeat;
      background-size: 100% 100%;
    }
  }

  //状态素材
  .icon-menu{
    padding-left: 0.08rem;
    padding-right: 0.08rem;
  }
  .icon-menu:before{
    content: '';
    position: absolute;
    top: 40%;
    right: -0.06rem;
    width: remp(10);
    height: remp(8);
    display:block;
    background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAYCAYAAADtaU2/AAAAAXNSR0IArs4c6QAAAoNJREFUSA3tVkFIlEEUfm92102KDQ1JqSARtQLrEGShRQZdorPRsQ4tBEEutmG7LpO27a6RhYcuUcc6Vhfr1B5aUsuig5FGFFFdOniwWHPdndc35r/uJcLl30s4MLw375/5vjfvn3nzWMev7TYmf5eYtqLfGIj0pWi5xeKJHiXcZ4hqYcqiQy2zifiJuYqMvFce7wmODSYmAbXXgVOs2nX04ouBZHJPflHeOHaX5SsFL1pKQbGlZjs2hhtL7a7q4FQs9KgIyvxD+Shtx1W0/hkTfy9+c1FRJA95ZGTEPzuXPSdEW5g9d3TkwpTDoa9eb6HCwnlhdYCEPsJe/j8mCQhxI7N6sCmwLuZwrMn/NwJstzY4NNRcyJmGhrqasWAwuOhsV6fTXhp/eYRFtpHIV8dejkR+8Bgp7BSfJ63D4ddIIMkgk9zCqVYAnFCtTYd0d3fOkprM+FPYDpZD9Lc12KnB6T6roOhlUju3nT58OmYVfj5xFMJVUotruSwnUrFAX2ls/ozFyPyK1XXNKNBHkTYLFpqZM/V1NaNLNJ37M8z0xHVKcLGS/qXDpROJ7VRQ9dSxb1J3deUdMhHhy6lUB77tIpZZx16WVEqZgmnC4/BYR8KVenzKcm1tUWUiwMPDw9Vz2VyPkNhn8Xbpj0cV0mbyFMKNb8MpfIvSqHjwVu2OUC3ubSuu0Wig2tfP+kriHoBPWiCA//Sxf0c0GvoWj9/cvCC/ZpAqN66a5B8LcIXvK0N83JkHjzbkaPGwHedlvrMSpBbbcqIKkWk7cBoS9ozVRfkQWhRGFWiI7Dvl9fEpYI8hzl/wTIRQYdqqk/Sl3mkUZGegfl5ywDrhQkc2nPJ46fRvm0HqMa5QGOEAAAAASUVORK5CYII=') no-repeat;
    background-size: 100% 100%;
  }
  //状态素材激活样式
  .activate{
    .icon-menu{
      color: #008cee;
    }
    .icon-menu:before{
      background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAYCAYAAADtaU2/AAAAAXNSR0IArs4c6QAAAltJREFUSA3tVjtoVEEUPXfeIx8/uy82KlFRJPEDUdEiiB9UsBFrxVILA4LorjaCiq3gbqKFjWippdpEK7cwEJQYUyQYLQR/jcV+kqCSvJ3xzMT3zBYiu75tJA/mzZ0zM/fMvXPnzggGitsQyj0I1gDSjwvBdURfvpQhdglaryD0jUVHXXXXxrRCpAVQ7+Dr44IbpRHA7IoVKa8X2fRL5ErbYcxYjCcqyCtF0u4anbra5doGG2rwRBumW9H8xwt0TqO1teDabd5zuvnrgr4ERXkkuEXfz1XO0vJO+P5dnFs+HjPkpuiN8DyM7Cb2nqXxPRaToh56UR6iJX015lgU/lsPiLPsZqULRq9GezCMPpmLrS0YH68rh1DFWkb/5xhvRBB4EL2FegrIBKOCXLmPieI2o5pnGi+wrmM/jsksLOlo+Rn79jXC8+c5okl+RtHSa79I7dhefCwfcZPGpg4nT2o100ByMoHAOKLoR3he1N8jqAm1pnvlMk2vOuWCISwNBp28Ixjiop4mTmq5RK7MB1d/aT20WoWdqREclDAmM4YxML0Hnt5KrBjjjQgKCiE2QpknyHQ06fJpZGGLc5rlAUHetEPbJ47qhGfu1Gx8vtgD42V5G/ZwARMsvwOv/hXx+WQ28WochAoY1bnifZ7cE06PYAbSthnZJV8wMLMS4exb4un6Of4yQ/DApouj8TCDZdA/Drh2NdzLOnlSq5ycNoFMOqLop5S10ma2CR702qwWjfnXWuQNj7V/knqGmaU+QUkW2YCvTn4XU5Pcj9Mk/+AWYBeRRIGMQ/xTPwFyJMDAp4pfJwAAAABJRU5ErkJggg==') no-repeat;
      background-size: 100% 100%;
    }
  }

  //意向车型图标
  .icon-select{
    padding-left: 0.08rem;
    padding-right: 0.08rem;
  }
  .icon-select:before{
    content: '';
    position: absolute;
    top: 38%;
    right: -0.06rem;
    width: remp(9);
    height: remp(10);
    display:block;
    background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAAAXNSR0IArs4c6QAAAoVJREFUSA3tVk1oE1EQnnldTbEVJAihKh68iIIHEaIgqGn04qVUxIsg9mKOasTEoonb2tDNpYJQPEZRkF60gjebJhYR9OSh4EEQBKO0hyr1h8Q0GWc2WZtkazZpyEHIQHgzb775vjeTt8miPmZEiWiYALqhTYYAWUQc14jgcjuF5PzCz5+gQgVTbWqoihaBpjTY5rmEmYX9PEqvZBHwm+ZS3kgo9L4K3USgT0720tfl1zy1vSYn4hvc7rmo9KGhLG7AQVb5IgkC2pLPFZ/G4/HNTfBXQWnpe8ISEl7hFx0lKD0c/qxAnQLEXKmK9vz6XXzI3fJ325zxhQvxgU+bVcwnvMIvcZdFlZ6d+XTUdyLDvQ2U93bPzb1U6VQyZWGc1pFY3F8EuMc4swleLoxEws+sur9isvEiNfP2mP+4m92DEhPikf5+/3x6NvlO4nqmG8ZOKsBzruoVHCLcGY1cG6+sKZ9gdQsPH7rCyKS5w2MsAN4fNYx9qwi7pycS3cU8PebxbTWzXG/y1EBtYrrPt6I2bTzDJ/tgYol6Cis0rU9MSMdrGmUW7nLigCSlTuqFpxZsExOAHgwuIWoDfDt+SMw3axf9zD0Qv9ait4wAX6Tzsi94qZP6WpzEa4pJQr9+dV4hnOOj8sPPggAnY7HbfeJXGgtEzZhxgpe6ynyl/08xAd28MfyEZRatgrzKuizfWvnh6Cn5tFjCWxn7WlfMDm9tpyPW2vzK1Z0xdsZYdwKOFwSp9HNVl6XBpKMY87wyuRA+9rnd/Oe6fnMUwx2es6pLDSqX5g0EAvn1SwFoTsXyosKYaSdcI3nHzhohaRTzv4mRjLkha7kzfi8c43/rZX6TfuSk+AewMMaZ4ZdrEgAAAABJRU5ErkJggg==') no-repeat;
    background-size: 100% 100%;
  }

  //意向车型激活样式
  .activate{
    .icon-select{
      color: #008cee;
    }
    .icon-select:before{
      background:url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABsAAAAeCAYAAADdGWXmAAAAAXNSR0IArs4c6QAAAjNJREFUSA3tVr1rFFEQ/826xOAZbhNtbCzsFGwUrhWxs1AiaiOIVsFCD3Ig2AQE0cY7iSBWEsRASKHGPyCFjahgZycIFiqk2H0RJdFcbpx5u7e77H3smuMK4QZ2d+a938fNvOXuCI1gDi2+BWBcrmHFJhy6R6gHAZi9YbmkdNcdgJdTC8NMlwkLPA7fvJbuKtaJyMB1KqiWP+3Y+RHvxUbwTvhHIs33mPJOOLhKmxgbmwbhu93QkTa3X+EJT+zYbMMsJEaiq/riI2OUuF76Buw6B6LftmYchjGL0i3Z+l9u981NOZrzlmL1RNfqA6GZ7tTKb6W7a7Eu8xk0zO24LpLUzSkQ342hqqe6UXR+8nowLx3dsPtEDNAF1LznbULP57x/EE36INz9EfchapPVND7prL16zKvJOFdtqWPk1lM0/KPt7a5Pfcm26EXKaBWqk4lOs5PUBDkXxfBzhC2BaQWN9akMNyl981jO6bhdUJ7yVScTnWYKmC37cN2zcoY/LZ75EHj7WYYblnUzIx1dsYXilaf8LtHdTIHViY/S3WW55NwkGKfx4NcBm6dv3JqzpeIUr7we0dtMCbOTL+W+lnD/7E7yOCtF2VqEjzeySX+zLHrAemQ24ABD+miMozH2nUD+C8Icfl31lSm2mW8GehNK0Rfs8b4Wk+2Oyjfb512SH9BplNwKZmiru0yxVTcXpn+IgJVcXAFAfmcFRIpC/jMzsmMu1NzgnRHfkb8PP8RtKc/xL2QjmVkT1NMAAAAAAElFTkSuQmCC') no-repeat;
      background-size: 100% 100%;
    }
  }
</style>