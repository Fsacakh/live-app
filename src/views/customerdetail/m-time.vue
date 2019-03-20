<template>
<div class="t-box">
    <div class="t-nav">
        <div :class="{'t-active' : item.active}" v-for="(item,index) in timelist" :key="index" @click="itemClick(item)">
            <div class="t-con-box">
                <p>{{item.time}}</p>
            </div>
            <div class="t-con-box">
                <span>{{item.name}}</span>
            </div>
        </div>
    </div>
    <div class="t-nav-center"></div>
    <div class="t-select-box">
        <mt-picker :slots="slots" @change="onValuesChange"></mt-picker>
    </div>
</div>
</template>
<script>
import { Picker } from 'mint-ui'
const hour = () => {
    let h = []
    for(let i = 0; i < 24; i++) {
       if(i < 10) {
           h.push(`0${i}`)
       }else {
           h.push(i)
       }
    }
    return h
}
const minute = () => {
    let m = []
    for(let i = 0; i < 60; i++) {
       if(i < 10) {
           m.push(`0${i}`)
       }else {
           m.push(i)
       }
    }
    return m
}
/**
 * creat by lwx 2017/11/30
 * @name m-time
 *
 *
 *
 *
*/
export default {
    components: {
        Picker
    },
    data() {
        return {
            timelist: [
                {
                    active: true,
                    time: '13:00',
                    name: '进店时间'
                },
                {
                    active: false,
                    time: '15:00',
                    name: '离店时间'
                }
            ],
            slots: [
                {
                    flex: 1,
                    values: hour(),
                    className: 'slot1',
                    textAlign: 'right'
                },
                {
                    divider: true,
                    content: ':',
                    className: 'slot2'
                },
                {
                    flex: 1,
                    values: minute(),
                    className: 'slot3',
                    textAlign: 'left'
                }
            ]
        }
    },
    methods: {
        itemClick(item) {
            for(let i = 0, len = this.timelist.length; i< len; i ++) {
                if(item.name === this.timelist[i].name) {
                    this.timelist[i].active = true
                }else {
                    this.timelist[i].active = false
                }
            }
        },
        onValuesChange(picker, val) {
            if(val[0] === undefined || val[1] === undefined) {
                return
            }else if(this.timelist[0].active) {
                this.timelist[0].time = `${val[0]}:${val[1]}`
            }else if(this.timelist[1].active) {
                this.timelist[1].time = `${val[0]}:${val[1]}`
            }
        }
    }
}
</script>
<style lang="scss">
.t-box {
    position: relative;
    color: #000;
    height: rem(450);
}
.t-active {
    border-bottom: 2px solid #36acfe;
    .t-con-box {
       color: #000;
       font-weight: 1;
    }
}
.t-nav {
    height: rem(101);
    display: flex;
    padding-top: rem(10)
}
.t-nav > div {
    flex: 1;
}
.t-nav-center {
    position: absolute;
    top: remp(28);
    left: 50%;
    margin-left: remp(-10);
    width: remp(20);
    height: remp(1);
    border-top: 2px solid #ccc;
}
.t-con-box {
    display: flex;
    justify-content: center;
    align-items: center;
    p {
        font-size: remp(16)
    }
    color: RGB(126,131,135);
    font-size: remp(11);
}

.t-select-box {
    border-top: 1px solid #ccc;
    border-bottom: 1px solid #ccc;
    height: rem(330);
    overflow: hidden;
    .picker-slot {
        font-size: remp(28) !important;
    }
}

</style>
