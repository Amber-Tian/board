<template>
  <div class="head">
    <div v-if="isShow" class="head_search">
      <el-input clearable size="mini" class="searchInput input" placeholder="请输入内容" v-model="searchValue">
        <el-button @click="turnPage" size="mini" slot="append" icon="el-icon-search"></el-button>
      </el-input>
    </div>
    <div class="lineContainer allCenter">
      <HeadLine />
    </div>
    <div class="head_right allCenter  flexCenter ">
      <Arrow count="10" />
      <div class="headTitle"><img src="@/img/logo.png" alt="LINVOL"> {{title}}</div>
      <Arrow count="10" />
    </div>
  </div>
</template>

<script>
  import Arrow from '@/components/Arrow'
  import HeadLine from '@/components/HeadLine'
  import { myApp } from "@/api/app";
  import { allAPI } from "@/api/apiValue";

  export default {
    name: 'Head',
    components: {
      Arrow, HeadLine
    },
    props: ['title', 'isShow', 'isIndex'],
    data() {
      return {
        searchValue: ''
      }
    },
    computed: {

    },
    mounted() {

    },
    created() {

    },
    methods: {
      turnPage() {
        if (this.isIndex) {  //首页
          if(this.searchValue){
            const routeData=this.$router.resolve({
            path:'/equipmentStatus',
            query:{
              searchValue:this.searchValue
            }
          })
          window.open(routeData.href,'_blank')
          }else{
            myApp.alert('请输入要查询的内容','error')
          }
        }else{  //设备交付状态查询
           this.$emit('handleSearch',this.searchValue)
        }
      }
    }
  }
</script>
<style scoped lang="scss">
  @import "src/style/variables";

  .head {
    position: relative;
    height: $headH;
    width: 100%;

    .head_search {
      height: 100%;
      line-height: $headH;
      display: inline-block;
      position: relative;
      z-index: 3;
      background-color: $bgColor;

      ::v-deep .searchInput .el-input-group__append {
        border: none;
        &:hover {
          -webkit-box-shadow: 0 0 0 0 transparent;
          box-shadow: 0 0 0 0 transparent;
        }
        .el-button {
          padding: 7px 0 7px 5px;
          .el-icon-search:hover {
            color: #409eff;
          }
        }
      }
    }

    .lineContainer {
      width: 100%;
      position: absolute;
      height: 100%;
      z-index: 0;
      height: 100%;
    }

    .head_right {
      height: 100%;
      z-index: 2;
      width: 100%;

      .headTitle {
        font-size: 1.5rem;
        padding: 0px $arrowBorder 0 $arrowBorder*2;
        letter-spacing: .1rem;
        font-weight: bold;
        background-color: $bgColor;

        img {
          position: relative;
          top: 2px;
          height: 20px;
        }
      }
    }
  }
</style>