<template>
    <div class="my-tabs">
        <div class="tabs-nav">
            <ul class="w h clearfix">
                <li :class="[tabIndex == tab.index ? 'tabs-active' : '']" v-for="tab in tabList" @click="changeTab(tab)">{{tab.name}}</li>
            </ul>
        </div>
        <div class="tab-content">
            <slot></slot>
        </div>
    </div>
</template>
<script>
    export default {
        props: {
            tabList: Array,
            tabIndex: Number
        },
        data() {
            return {}
        },
        methods: {
            changeTab: function(tab) {
                this.$emit('changeTab', tab)
            }
        }
    }
</script>
<style scoped lang="scss">
    .my-tabs {
        width: remp(375);
    }
    .tabs-nav {
        height: rem(88); // overflow: hidden;
    }
    .tabs-nav ul {
        border-bottom: rem(2) solid #36acfe;
        height: rem(88);
        // add by lwx on 2018/01/12
        //display: flex;
    }
    .tabs-nav li {
        // display: flex;
        // align-items: center;
        // justify-content: center;
        // flex: 1;
        width: rem(180);
        height: rem(87);
        float: left;
        text-align: center;
        line-height: rem(85);
        border-bottom: none;
        // border: rem(2) solid #fff;      
        // border-bottom: rem(2) solid #36acfe;          
        background-color: #fff;
    }
    // .tabs-nav li:hover {
    //     color: #36acfe; 
    // }
    .tabs-nav li.tabs-active {
        color: #36acfe;
        border: rem(2) solid #36acfe;
        border-bottom: rem(2) solid #fff;
    }
    .tab-content{
        width: remp(375);        
        margin-top: rem(3);
    }
</style>

