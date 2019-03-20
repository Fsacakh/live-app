
<template>
    <div class="popup-box" v-if="visible">
        <div class="popup">
            <div class="popup-arrow">
                <em></em>
                <i></i>
            </div>
            <ul>
                <li v-for="(item, index) in list" :key="index">
                    <div @click.stop="itemClick(item)">
                        <i class="iconfont popup-icon" :class="item.iconClass"></i>                
                        <a>{{item.name}}</a>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    export default {
        props: {
            list: {
                type: Array,
                default: () => []                 
            }
        },
        data() {
            return {
                visible: false
            }
        },
        methods: {
            toggle() {
                this.visible = !this.visible
            },
            show() {
                this.visible = true
            },
            hide() {
                this.visible = false
            },
            itemClick(item) {
                if(item.path) {
                    this.$router.push({
                        path: item.path
                    })
                    this.hide()
                }else {
                    this.$emit('itemClick', item)
                    this.hide()
                }
            }
        }
    }
</script>

<style lang="scss">
.popup-box {
    position: fixed;
    -webkit-transform: translateZ(0);
    top: rem(120);
    right: remp(10);
    z-index: 209;
    padding: remp(13) 0 remp(13) 0;
    background: #fff;    
    box-shadow: rgba(155, 155, 155, 0.5) 0px 0px 13px; 
    border-radius: 4px;
    .popup {
        .popup-icon {
            font-size: remp(16);
            color: #817F79;
        }
        .popup-arrow {
            width: 0;
            height: 0;
            font-size: 0;
            line-height: 0;
            display: block;
            position: absolute;
            top: -10px;
            right: 25px;
            margin-left: -5px;
            em, i{
                width: 2px;
                height: 0;
                font-size: 0;
                line-height: 0;
                display: block;
                position: absolute;
                border: 5px solid transparent;
                border-style: dashed dashed solid;
            }
            em {
                font-style: normal;
                color: #c00;
            }
            i {
                border-bottom-color: #fff;
                top: 0;
            }
        }
        ul li {
            border-bottom: 1px solid #DBDDDE;
            padding-bottom: remp(8);
            div{
                padding-right: remp(15);
                padding-left: remp(11);
            }            
            a {
                margin-left: remp(10);
            }
        }
        li:nth-child(2), li:nth-child(3) {
            padding-top: remp(10);            
        }
        li:nth-last-child(1) {
            padding-bottom: 0;                        
            border: none;           
        }
    }   
}
</style>
;