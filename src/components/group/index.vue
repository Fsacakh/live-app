<template>
   <div class="group">
       <div class="title">
           <i class="icon-left"></i>
           <span class="title-content">{{ title }}</span>
       </div>
       <label class="content">
           <div class="w">
               <slot></slot>
           </div>
       </label>
   </div>    
</template>

<script>
    export default {
        name: 'group',
        props: {
            title: {
                type: String,
                default: ''
            }
        },
        data: function() {
            return {
            }
        },
        methods: {

        },
        components: {

        }
    }
</script>

<style lang="scss" scoped>
    .group {
        background: #fff;
        display: flex;
        flex-direction: column;
        padding-left: rem(30); 
        margin-bottom: rem(19);
    } 
    .group >.title {
        padding-top: rem(12);
        padding-bottom: rem(12);
        font-family: PingFangSC-Regular;
        font-size: rem(24);
        line-height: rem(30);
        color: #7e8387;
        border-bottom: rem(1) #f0f2f5 solid;
        display:block;
    }
    .group >.title > .title-content {
        vertical-align: super;
    }
    .group >.title > .icon-left {
        display: inline-block;
        width: rem(6);
        height: rem(32);
        background: $browser-default-image-blue;
        margin-left: rem(8);
    }
    .group >.content {
        display: flex;
        flex-direction: column;
    }
</style>