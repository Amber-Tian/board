<!-- 箭头样式 -->
<template> 
     <div class="line "></div> 
</template>

<script>
  export default {
    name: 'HeadLine',
    props: [''],
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

 .line{
  width: 100%; 
  height:.3rem;
  background-color: $arrowColor;
  position: absolute;
  left:0px;
  top:50%;
  transform:translateY(-50%)
  
 }
</style>