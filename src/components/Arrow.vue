<!-- 箭头样式 -->
<template>
  <div class="myarrow">
    <template v-for="item in count">
      <div :class="{myarrow_arrow:true,imgArrow:imgArrow}"></div>
    </template>

  </div>
</template>

<script>
  export default {
    name: 'Arrow',
    props: ['count','imgArrow'],
    data() {
      return {

      }
    },
    computed: {

    },
    mounted() {

    },
    created() {

    },
    methods: {

    }
  }
</script>
<style scoped lang="scss">
  @import "src/style/variables";

  .myarrow {
    background-color: $bgColor;
   
    display: flex; 
    .myarrow_arrow {
      width: $arrowW;
      height: $arrowW;
      border-width: $arrowBorder $arrowBorder 0px 0px;
      border-style: solid;
      border-color: $arrowColor;
      transform: rotate(45deg);
      // margin-left:-$arrowBorder;
    }
  }
 
</style>