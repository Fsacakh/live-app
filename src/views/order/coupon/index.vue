    <template>
    <div>
        <page-header ref="header">
            报价单-优惠券
            <span slot="couponpreserve" v-show="isPreserve" @click="onClickPreserve" class="preserve">保存</span>
        </page-header>
        <!-- 优惠券列表 -->
        <div class="couponlist_box">
            <!-- 有数据 -->
            <div class="list" ref="list" v-show="couponlist.length">
                <scroll class="couponlist" :data="couponlist" :pullup="true" @scrollToEnd="scrollToEnd">
                    <ul ref="listu">
                        <li class="couponInfo" :class="{ backBlue: testArr[index] == 0, backGray: testArr[index] == 1, seledBlue: activeSeledBlue}" v-for="(item,index) in couponlist" :key="index"  @click="isSelected(index)">
                            <div class="couponInfo_top">
                                <div class="couponInfo_left">
                                    <p>
                                        <span>￥</span>
                                        <span class="coupon_price">{{ Number(item.price).toFixed(0) }}</span>
                                    </p>
                                    <span>{{item.couponTypeCode}}</span>
                                </div>
                                <div class="couponInfo_right">
                                    <p>
                                        <span class="coupon_title">{{item.couponName}}</span>
                                    </p>
                                    <p class="coupon_deathtime" :class="{white: testArr[index] == 1}">
                                        <span>有效期：</span>
                                        <span>{{item.time}}</span>
                                    </p>
                                    <span class="isgroup">{{item.isReapt}}</span>
                                </div>
                            </div>
                            <div class="couponInfo_bottom" :class="{colora: isGray, colorb: isWhite}">
                                <div class="coupon_code">
                                    <span>卡券码：</span>
                                    <span>{{item.couponNo}}</span>
                                </div>
                                <div class="coupon_pnglock" v-if="wfStatus === '-1'">

                                    <span class="locked" v-if="couponlist[index].isLock == '1' && couponlist[index].isSelect == 0">已锁定</span>  
                                    <span class="lockpng" v-else :class="{unSelImg: pushNoLockArr[index].isSelect == 0, seledImg: pushNoLockArr[index].isSelect == 1}"></span>

                                </div>
                            </div>
                        </li>
                        <p class="loading_text" v-show="isloading">{{loadingText()}}</p>
                    </ul>
                </scroll>
            </div>
            <!-- 暂无数据 -->
            <div v-show="isloading && couponlist.length == 0" class="nodata">
                <!-- <no-data title="暂无数据"></no-data> -->
                    暂无可用优惠券
            </div>  
            <!-- <div v-show="!orderlist.length && loadingNoData" class="no-data">
                <no-data></no-data>
            </div>  

            <div v-show="!orderlist.length  && !loadingNoData" class="loading-container">
                <loading></loading>
            </div> -->

        </div>

    </div>
</template>
<script>
    import PageHeader from "components/header/PageHeader"
    import NoData from 'components/no-data/no-data'
    import Loading from 'components/loading/loading'
    import Scroll from 'components/scroll/scroll'
    import api from 'common/api'
    import config from 'common/config'
    import { Toast } from "mint-ui";

    const PAGE_START = 1     //请求优惠券数据的页数参数
    const PAGE_NUMS = config.pageNums    //获取页面数量
    const BEING_LOADING = '正在加载'
    const NO_MORE_DATA = '暂无更多数据'
    export default {
        data(){
            return{
                couponlist: [],         //优惠券数据
                isloading: false,       //判断是否正在加载  默认为false
                moreCoupon: true,       //判断是否有更多的数据  默认为true
                isSelect: false,        //判断优惠券是否已选择   默认为false
                isShow: false,          //由岗位决定是否显示选择按钮 
                isSw: true,             //是否锁定（未锁定则显示选择按钮）
                isHavegray: false,      //已锁定优惠券灰色背景
                isSatisfy: true,        //是否满足保存条件
                testArr: [],            //控制已锁定优惠券的显示
                showArr: [],            //已锁定字样或选择按钮显示判断
                isGray: false,          //销售顾问登录卡券码颜色控制
                isWhite: false,         //销售经理登录卡券码颜色控制
                isPreserve: false,      //右上角保存按钮是否出现
                pushNoLockArr: [],      //未锁定优惠券数据
                wfStatus: 2,            //订单状态
                // 列表滚动相关参数
                lastPage: 0,      //判断是否下拉到最后一页
                PageStart: 1,           //初始页为第一页
                activeBlue: false,      //背景图片控制
                activeGray: false,
                activeSeledBlue: false,   //优惠券只作展示时的背景图样式类名控制
            }
        },
        components: {
            PageHeader,
            NoData,
            Scroll
        },
        created(){
            this.initPage();
        },
        mounted(){
        },
        computed: {
        },
        methods:{
            //页面初始渲染
            initPage(){
                let _this = this;
                // 列表高度
                this.$nextTick(function(){
                    this.$refs.list.style.height = document.body.clientHeight -
                        this.$refs.header.$el.clientHeight + 'px';
                })
                // 获取优惠券数据
                this.getCouponData(this.PageStart);
                
            },
            // 列表末尾的加载提示语句
            loadingText(){
                if(this.isloading && !this.moreCoupon){  // 没有更多数据
                    return NO_MORE_DATA;
                }else if(this.isloading && this.moreCoupon){   //正在加载
                    return BEING_LOADING;
                }
            },
            // 点击选中优惠券
            isSelected(index){
                // this.pushNoLockArr：未锁定优惠券数据
                let checkList = this.pushNoLockArr;
                checkList[index].isSelect = checkList[index].isSelect == 0 ?  1 : 0;
                this.pushNoLockArr = checkList;
            },
            // 列表下拉
            scrollToEnd(){
             this.isloading = true;
                if(this.lastPage >= this.PageStart){   //并未拉到最后一页，可继续增加页数并加载数据
                    this.PageStart++;
                    this.getCouponData(this.PageStart);
                }else{                  //已经拉到最后一页
                    this.moreCoupon = false;    //没有更多数据了
                }
            },
            // 获取优惠券数据
            getCouponData(pagestart){
                let _this = this;
                let aparams = {
                    orderNo: this.$route.params.code || this.$route.params.orderNo,
                    pageSize: 1000,
                    currentPage: pagestart
                }
                api.getCouponInfo.getCoupon( aparams , (res) => {
                    if(res.data.code === 'success') {
                        if(!res.data.obj.quotationCouponVoPage.result.length) {      //没有数据
                            _this.isloading = true;
                        }
                        
                        if(res.data.obj.wfStatus === '-1'){ // 订单待提交
                            res.data.obj.quotationCouponVoPage.result.forEach(item => {
                                item.isReapt = item.isSuperposition === '1' ? '可叠加' : '不可叠加';
                                item.couponTypeCode = item.couponType === '4' ? '整车券' : '精品券';
                                const startTime = item.startDate.split(' ')[0].replace('-','.').replace('-','.')
                                const endTime = item.endDate.split(' ')[0].replace('-','.').replace('-','.')
                                item.time = startTime + ' - ' + endTime
                            });
                            // obj.list = res.data.obj.quotationCouponVoPage.result;
                            _this.isShow = true;
                            _this.isGray = true;
                            _this.isWhite = false;
                            _this.isPreserve = true;
                            _this.activeSeledBlue = false;

                            let clist = _this.couponlist.concat(res.data.obj.quotationCouponVoPage.result), pushArr0 = [], pushArr1 = [], aaaArr = [], bbbArr = [];
                             clist.map((item,i) => {
                                
                                if(item.isLock === '1' && item.isSelect === 0){    //优惠券已锁定
                                    pushArr1.push(item)
                                }else{
                                    item.isLock = '0'
                                    pushArr0.push(item)     
                                }
                            })
                            _this.pushNoLockArr = pushArr0;      //未被锁定的优惠券
                            clist = pushArr0.concat(pushArr1);   //将已锁定的优惠券都放在后面
                           
                            clist.map((item,i)=>{
                                if(item.isLock === '1' && item.isSelect === 0){     //已锁定
                                    aaaArr.push(1)
                                }else{
                                    aaaArr.push(0)
                                }
                            })
                            _this.testArr = aaaArr;      //优惠券背景图的显示控制
                            _this.couponlist = clist;
                        }else{   
                            let testsel = [];
                            res.data.obj.quotationCouponVoPage.result.forEach(item => {
                                testsel.push({isSelect: 0});    //在未提交时会用到isSelect，所以这里也要加入这个属性，不然会报错
                                item.isReapt = item.isSuperposition === '1' ? '可叠加' : '不可叠加';
                                item.couponTypeCode = item.couponType === '4' ? '整车券' : '精品券';
                                const startTime = item.startDate.split(' ')[0].replace('-','.').replace('-','.')
                                const endTime = item.endDate.split(' ')[0].replace('-','.').replace('-','.')
                                item.time = startTime + ' - ' + endTime

                            });
                            _this.pushNoLockArr = testsel;
                            // obj.list = res.data.obj.quotationCouponVoPage.result;
                            _this.isShow = false;
                            _this.isGray = false;
                            _this.isWhite = true;
                            _this.isPreserve = false;
                            _this.activeSeledBlue = true;
                            _this.couponlist = _this.couponlist.concat(res.data.obj.quotationCouponVoPage.result);
                        }
                        _this.wfStatus = res.data.obj.wfStatus;
                        _this.lastPage = res.data.obj.quotationCouponVoPage.lastPage;
                    }
                })
                    
            },
            //点击右上角保存选中的优惠券
            onClickPreserve(){
               
                let selecteData = [];     //传给后台的选中优惠券数据
                this.pushNoLockArr.map((item)=> {
                    if(item.isSelect === 1){   //获取已选择优惠券
                        selecteData.push(item)
                    }
                })

                let orderNo = this.$route.params.code || this.$route.params.orderNo
                api.getCouponInfo.saveCoupon({ orderNo: orderNo, quotationCouponVoList: selecteData }, (res) => {
                    if(res.data.code === 'success') {
                        Toast('保存成功');
                    }else{
                        // window.location.reload();
                    }
                })

            },
        }
    }
</script>
<style lang="scss" scoped>
    
    .couponlist_box{
         .nodata{
            height: 100%;
            text-align: center;
            padding-top: remp(200);
         }
        .list{
            transform: translateZ(0);
            width: remp(375);
            .couponlist{
                height: 100%;
                overflow: hidden;
            }
        }
    }
    ul li{
        width: remp(335);
        height: remp(106);
        border-radius: remp(4);
        margin: 0 auto;
        margin-bottom: remp(10);
        margin-top: remp(10); 
        .couponInfo_top{
            color: #ffffff;
            width: 100%;
            height: remp(73);
            display: flex;
            position: relative;
            .couponInfo_left{
                flex: 1;
                font-size: remp(14);
                text-align: center;
                padding: remp(14) 0 0 remp(4);
                .coupon_price{
                    font-size: remp(20);
                    line-height: remp(28);
                }
            }
            .couponInfo_right{
                flex: 3;
                font-size: remp(14);
                position: relative;
                padding: remp(15) 0 0 remp(10); 
                .coupon_deathtime{
                    color: #D5EEFF;
                    font-size: remp(12); 
                }
                .white{  
                    color: #ffffff;  
                }
                .coupon_title{
                    display: inline-block;
                    width: remp(150);
                    height: remp(25);
                    text-overflow: ellipsis ;
                    font-size: remp(18);
                    line-height: remp(25);
                    font-weight: 500;
                    overflow:hidden;
                    text-overflow:ellipsis;
                    white-space:nowrap;
                }
                .isgroup{
                    display: inline-block;
                    width: remp(62);
                    height: remp(18);
                    text-align: center;
                    line-height: remp(18);
                    border: 1px solid #ffffff;
                    border-radius: remp(3);
                    font-size: remp(12);
                    position: absolute;
                    top: remp(17);
                    right: remp(20);
                }
            }
            .half_circle{
                position: absolute;
                bottom: remp(-0.5);
                left: remp(0);
                width: 100%;
                height: remp(4);
                overflow: hidden;
                padding-left: remp(2); 
                span{
                    display: inline-block;
                    width: remp(8);
                    height: remp(4);
                    border-radius: remp(8) remp(8) 0 0;
                    background: #ffffff;
                    color: #ffffff;
                    font-size: remp(2);
                    margin-right: remp(0.5);
                }
            }
        }
        .couponInfo_bottom{
            width: 100%;
            height: remp(33); 
            border-bottom-right-radius: remp(4) remp(4);
            border-bottom-left-radius: remp(4) remp(4);
            font-size: remp(14);
            position: relative;
            .coupon_code{
                padding-left: remp(20);
                line-height: remp(30);
            }
            .coupon_pnglock{
                position: absolute;
                top: remp(0);
                right: remp(25); 
                .lockpng{
                    display: inline-block;  
                    width: remp(19);
                    height: remp(19);
                    margin-top: remp(5);  
                }
                .unSelImg{
                    background-image: url('../../../assets/imgage/unlocked2.png');
                    background-size: 100%;
                }
                .seledImg{
                    background-image: url('../../../assets/imgage/locked2.png');
                    background-size: 100%;
                }
                .locked{
                    display: inline-block;
                    font-size: remp(12);
                    line-height: remp(33);
                    text-align: center;
                    color: #A4A4A4;
                }
            }
        }
        .colora{   
            color: #333333;
        }
        .colorb{  
            color: #ffffff;
        }
    }
    .backBlue{
        background-image: url('../../../assets/imgage/couponUnlockBack2.png');
        background-size: 100%;
    }
    .backGray{
        background-image: url('../../../assets/imgage/couponLockBack2.png');
        background-size: 100%;
    }
    .seledBlue{
        background-image: url('../../../assets/imgage/allback2x.png');
        background-size: 100%;
    }
    .loading_text{
        text-align: center;
    }
    
</style>


