<template>
  <div class="no-data">
    <div class="no-data-img">
        <img :src="imgUrl" alt="" />
    </div>
    <p class="no-data-text">{{title}}</p>
  </div>
</template>

<script>

  const base = process.env.NODE_ENV === 'development' ? '' : '/liveapp/'
  export default {
    props: {
      title: {
        type: String,
        default: '暂时还没有创建订单'
      },
      imgUrl: {
         type: String,
         default: base + '/static/no-data (2).png'
      }
    }
  }
</script>

<style scoped lang="scss" >

    .no-data {
        text-align: center;
        .no-data-img {
            margin: 0 auto;
            img {
                width: remp(215);
                height: remp(130);
            }
        }  
        .no-data-text {
            margin-top: remp(21);
            font-size: remp(13);
            color: #BFC8CC;
        } 
    }
    
</style>