<!-- 流程图片 -->
<template>
  <div class="ImgOccur">
    <el-image class="img" v-for="item in imgTitle" :src="imgUrl[item]" :key="item"/>
  </div>
</template>

<script>
  const files = require.context('../../src/img/imgLine', false);
  const path = require('path');
  const allPngImg = {};
  files.keys().forEach(fileName => {
    const name = path.basename(fileName, '.png'); //只分割.png的后缀
    const content = files(fileName).default || files(fileName);
    allPngImg[name] = content
  })

  export default {
    name: 'ImgOccur',
    props: ['count', 'imgTitle'],
    data() {
      return {
        imgUrl: allPngImg,
        startImg: require('@/img/ArrOpc1.png'),
        otherImg: require('@/img/ArrOpc2.png'),
      }
    },
  }
</script>
<style scoped lang="scss">
@import "src/style/variables";
  .ImgOccur {
    height: 8vh;
    display: flex;
    justify-content: center;
    margin-top: 2vh;
    width: 100%;
    min-width: $containerMinW;
    .img {
      width: 5.5%;
      margin-right: 0.8%;
      &:last-child {
        margin-right: 0;
      }
    }
  }
</style>