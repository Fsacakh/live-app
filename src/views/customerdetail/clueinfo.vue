
<template>
    <div>
        <sales-status title="线索状态"></sales-status>
        <div class="clear"></div>
        <intention-level></intention-level>
        <intention-car></intention-car>
        <experience-car></experience-car>
        <!-- <maket-activity :dataInfo="activityList"></maket-activity> -->
    </div>
</template>
<script>
    import SalesStatus from 'components/salesStatus'
    import IntentionLevel from 'components/intentionLevel/index'
    import IntentionCar from 'components/intentionCar'
    import ExperienceCar from 'components/experienceCar'
    import MaketActivity from 'components/maketActivity'
    // import config from 'common/config'
    // import {mapGetters} from 'vuex'
    export default {
        components: {
            SalesStatus,  
            IntentionLevel,
            IntentionCar,
            ExperienceCar,
            MaketActivity
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
    
<style lang="scss">
    .status {
        box-sizing: border-box;
        position: relative;
        top: rem(2);
        width: 100%;
        height: rem(83);
        background: #fff;
        padding: rem(23) rem(30) rem(21) rem(0);
        border-bottom: 1px solid #ccc;
    }
    .status > p {
        width: rem(206);
        font-size:rem(26);
        color:#333333;
        text-align:left;
    }
    .btn-status {
        box-sizing: border-box;
        border-style: none;
        background: #bdc7d1;
        border-radius: rem(6);
        width: rem(120);
        font-size: rem(24);
        color: #fff;
        position: absolute;
        top: 50%;
        right: rem(30);
        transform: translateY(-50%);
        padding: rem(8) rem(10);
    }
    .ditchSource {
        display: table;
        width: 100%;
        padding: rem(24) rem(0) rem(22) rem(0)
    }
    .ditchSource > div {
        display: table-cell;
        width: 50%;
        height: rem(37);
        color: #333;
    }
    .ditch > div {
        display: table-cell;
        width: 10%;
        font-size:26px;
        font-size: rem(26);
    }
    .ditch > p {
        display: table-cell;
        width: 15%;
        font-size: rem(26);
        color: #7e8387;
    }
    .source > div {
        display: table-cell;
        width: 10%;
        font-size: rem(26);
    }
    .source > p {
        display: table-cell;
        width: 15%;
        font-size: rem(26);
        color: #7e8387;
    }
    .clear {
        height: rem(10);
        background-color: #efefef;
    }

</style>
