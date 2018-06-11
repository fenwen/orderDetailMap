<template>
  <div class="topLeft">
    <div class="inner">
      <div class="pic">
        <img :src="msg.imgUrl" alt="">
      </div>
      <ul class="text">
        <li class="top"><p class="title">{{msg.title}}</p></li>
        <li class="bottom"><i class="num">{{msg.number}}</i><i class="unit">{{msg.unit}}</i></li>
      </ul>
    </div>
  </div>
</template>

<script>
  export default {
    name: "TopModel",
    props:["msg"],
    data() {
      return {

      }
    },
    components: {}
  }
</script>

<style scoped>
  .topLeft {
    display: inline-block;
    float:left;
    margin: .10rem;
    position: relative;
    width: 3.20rem;
    height: 1.00rem;
    background: #fff;
  }

  .topLeft .inner {
    position: absolute;
    width: 2.1rem;
    height: .60rem;
    margin: -.3rem 0 0 -1.05rem;
    top: 50%;
    left: 50%;
  }

  .topLeft .pic {
    width: .50rem;
    height: .50rem;
    display: inline-block;
    margin-right: .2rem;
    float: left;
  }

  .topLeft .pic img {
    display: block;
    width: .50rem;
    height: .50rem;
    margin: 0.05rem 0 0;
  }

  .topLeft .text {
    display: inline-block;
    font-size: .14rem;
    margin-right: .20rem;
    color: #9ca1b2;
    font-weight: bold;
    float: left;
  }

  .topLeft .text .title {
    color: #9ca1b2;
    margin:0;
  }

  .text .bottom .num{
    font-size:.28rem;
    color:#333333;
    font-weight: bold;
    margin-right:.05rem;
  }

</style>
