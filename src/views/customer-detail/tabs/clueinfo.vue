
<template>
<div class="lead-box"> 
    <!-- <scroll  class="lead-scroll"> -->
        <!-- <div class="lead-con"> -->
            <sales-status title="线索状态"></sales-status>
            <div class="clear"></div>
            <intention-level></intention-level>
            <intention-car></intention-car>
            <experience-car></experience-car>
            <maket-activity :dataInfo='activityList'></maket-activity>
        <!-- </div> -->
    <!-- </scroll> -->
</div>
</template>
<script>
    import SalesStatus from 'components/salesStatus'
    import IntentionLevel from 'components/intentionLevel/index'
    import IntentionCar from 'components/intentionCar'
    import ExperienceCar from 'components/experienceCar'
    import MaketActivity from 'components/maketActivity'
    import Scroll from 'components/scroll/scroll'

    export default {
        components: {
            SalesStatus,  
            IntentionLevel,
            IntentionCar,
            ExperienceCar,
            MaketActivity,
            Scroll
        },
        data() {
            return {
                activityList: [
                    {
                        activityName: '国庆节促销',
                        activityDate: "2017/10/18 12:00-13:30"
                    },
                    {
                        activityName: '国庆节促销',
                        activityDate: "2017/10/18 12:00-13:30"
                    }
                ]
            }
        }
    }
</script>
    
<style lang="scss" scoped>
    .clear {
        height: rem(10);
        background-color: #efefef;
    }
    
    .lead-box {
        // position: fixed;//
        // width: remp(375);
        // top: remp(238);//
        // bottom: 0;
        // // 滚动去掉
        // background-color: #fff;
        // .lead-scroll {
        //     height: 100%;
        //     overflow: hidden;
        //     .lead-con {
        //         background-color: #fff;
        //     }
        // }
    }
</style>
