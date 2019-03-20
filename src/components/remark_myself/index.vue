<template>
    <div class="w cell clearfix pr" :class="{
    border:border
    }">
        <div class="fl title">
            <span>{{title}}</span>
        </div>
        <div class="fr input">
        <!-- 在这里 msg已经拿到 外面v-model传进来的值 直接：value赋值dom上面 -->
            <textarea :value="msg" @input="textareachange" placeholder="请输入客户意见（最多30字）">g}}}</textarea>
        <!-- input事件当数据发生改变触发事件 -->
        </div>
        <div v-if="triangle" class="triangle pa">
            <span class="iconfont icon-icon-rili"></span>
        </div>
    </div>
</template>

<script>
export default {
  model: {
    prop: "msg", //接受v-model的值 并且指定给props里面的msg属性
    event: "textacrea" //事件名 当内部数据发生改变的时候emit这个事件 把值传给外面v-model的属性
  },
  props: {
    title: String,
    triangle: Boolean,
    border: {
      type: Boolean,
      default: true
    },
    msg: ""
  },
  data() {
    return {};
  },
  methods: {
    textareachange(event) {
      // event.target.value 拿到文本域的值 emit textacrea事件 把值传递给外部 v-model 绑定的属性
      this.$emit("textacrea", event.target.value);
    }
  },
  mounted() {}
};
</script>

<style lang="scss" scoped>
.cell {
  height: rem(150);
  background: #fff;
  padding-top: rem(22);
}
.border {
  border-top: 1px solid #ccc;
} // .input,
.triangle {
  top: 50%;
  transform: translateY(-50%);
} // .title{
// top: 20%;
// transform: translateY(-90%);
// }
.title > span {
  margin-left: rem(30);
}
.input {
  right: rem(80);
}
input {
  font-size: rem(22);
  border: none;
}
input::-webkit-input-placeholder {
  /* WebKit browsers*/
  color: #bdc7d1;
}
input:-moz-placeholder {
  /* Mozilla Firefox 4 to 18*/
  color: #bdc7d1;
}
input::-moz-placeholder {
  /* Mozilla Firefox 19+*/
  color: #bdc7d1;
}
input:-ms-input-placeholder {
  /* Internet Explorer 10+*/
  color: #bdc7d1;
}
.triangle {
  display: inline-block;
  right: rem(10);
}
textarea {
  outline: none;
  resize: none;
  border: none;
  width: rem(600);
  height: rem(120);
}
</style>