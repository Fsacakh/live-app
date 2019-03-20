<template>
    <!-- <div class="board-chart-box">
        <div class="top-right"> -->
            <div id="board-chart-box">
                <canvas class="board-chart-canvas" :id="ID">Your browser does not support the HTML5 canvas tag.</canvas>
            </div>
        <!-- </div>
    </div> -->
</template>

<script>
    export default {
        props: {
            chartData: {
                type: Array,
                default: function() {
                    return []
                }
            },
            ID: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                option: {
                    coordinate: {x:16,y:16},
                    radius: 15,
                },
            //     msg: [
            //         {bgcolor:'#4D33EF',value:30},
            //         {bgcolor:'#FE691F',value:70},
            //     //     {bgcolor:'yellow',value:40}
            //    ]
            }
        },
        created() {

        },
        mounted() {
            // console.log(document.getElementById(this.ID))
            // console.log(this.chartData)
            let clientWidth = document.documentElement.clientWidth;
            let canvasWidth = Math.floor(clientWidth * 85 / 750);
            let boardChart = document.getElementById(this.ID);
                boardChart.setAttribute('width',canvasWidth+'px');
                boardChart.setAttribute('height',canvasWidth+'px');
                this.option.radius = Math.floor(canvasWidth * 85 / 175);
                this.option.coordinate.x = Math.floor(canvasWidth / 2);
                this.option.coordinate.y = Math.floor(canvasWidth / 1.9);
            let chartBody = boardChart.getContext('2d');
            this.chartMethods(chartBody, this.chartData, this.option)
        
        },
        methods: {
            chartMethods: function(ctx, data, option) {
                let cood = option.coordinate;
                let radius=option.radius;
                let lastpos=pos=0;
                let pos = 0;
                for(let i=0;i<data.length;i++) {
                    ctx.beginPath();
                    ctx.moveTo(cood.x,cood.y);
                    ctx.fillStyle = data[i].bgcolor;
                    pos=lastpos+Math.PI*2*data[i].value/100;
                    ctx.arc(cood.x,cood.y,radius,lastpos,pos,false);
                    ctx.fill();
                    lastpos=pos;
                }
                ctx.beginPath();
                ctx.fillStyle ="white";
                radius*=0.7;
                ctx.arc(cood.x,cood.y,radius,0,Math.PI*2 ,false);
                ctx.fill();               
            }
        },
        watch: {
            chartData: {
                handler(val) {
                    // console.log(val)
                    let boardChart = document.getElementById(this.ID);
                    let chartBody = boardChart.getContext('2d');
                    this.chartMethods(chartBody, this.chartData, this.option)
                },
                deep: true
            }
        }
    }
</script>

<style lang="scss">
#board-chart-box{
    margin-left:remp(4);
    margin-right:remp(6)
}
    .board-chart-canvas{
        align-self: center;
    }
</style>

