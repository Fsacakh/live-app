<template>
  <div class="warp clearfix">
    <div v-for="item in selectData" class="optionwarp clearfix">
      <label class="label-pjl" @click="checked(item.value)">  
                      <input class="radio-pjl" :checked="checkedVl==item.value" type="radio" name="sex">  
                      <span class="radioInput-pjl"></span>{{item.text}}
                  </label>
    </div>
  </div>
</template>
<script>
  export default {
    model: {
      prop: 'checkedVl',
      event: 'change'
    },
    props: {
      checkedVl: {
        type: Number,
      },
      selectData: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    data() {
      return {};
    },
    methods: {
      checked(value) {
        this.$emit('change', value)
      }
    }
  };
</script>
<style lang="scss">
  .warp {
    height: rem(80);
    padding: rem(22) 0; // padding-right: rem(40);
    box-sizing: border-box;
  }
  .optionwarp {
    float: right;
    margin-right: rem(30);
  }
  .optionicon {
    width: rem(28);
    height: rem(28);
    vertical-align: middle;
  }
  .optionname {
    line-height: rem(28);
    color: #7e8387;
    margin-left: rem(20);
    font-size: rem(26);
  }
  .optionwarp>div {
    float: left;
  }
  .label-pjl {
    display: inline-block;
  }
  .radio-pjl {
    display: none;
  }
  .radioInput-pjl {
    background-color: #fff;
    border: 1px solid #00a1e9;
    border-radius: 100%;
    display: inline-block;
    position: relative;
    height: remp(18);
    margin-right: remp(5);
    margin-top: remp(-.5);
    vertical-align: middle;
    width: remp(18);
    text-align: center;
  }
  .radio-pjl:checked+.radioInput-pjl:after {
    background-color: #00a1e9;
    border-radius: 100%;
    content: "";
    display: inline-block;
    height: remp(13);
    width: remp(13);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
