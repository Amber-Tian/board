<template>
  <div class="rank  boxSizing">
    <!--    表格头-->
    <ul class="item itemTitle">
      <div v-if="noShowTableHead" class="commonTitle" style="font-size: 16px;font-weight: bold" v-text="title"></div>
      <li style="opacity: 0.7;color: #fff">
        <template v-for="(item,index) in thead">
          <span style="display:inline-block;width: 20%;text-align: center;">{{item.name}}</span>
        </template>
      </li>
    </ul>
    <!--    表格内容-->
    <!-- <vue-seamless-scroll :class-option="classOption" :data="tableData" class="seamless-warp"> -->
    <ul class="item ">
      <!-- <span :class="{rankT:true,first:index==0,second:index==1,third:index==2}">{{index+1}} </span>
          <span style="width: 20%;" v-text="item"></span> -->
      <template v-for="(item,index) in tableData">
        <template v-for="(headItem,headIndex) in thead">
          <span class="value" style="display:inline-block;width: 20%;text-align: center;">{{item[headItem.id]}}</span>

        </template>
      </template>

      </li>
    </ul>
    <!-- </vue-seamless-scroll> -->
  </div>
</template>

<script>
  import config from '@/api/config'
  import { myApp } from '@/api/app'
  import commonMethod from '@/api/commonMethod'
  import moment from 'moment'

  export default {
    name: 'CommonTable',
    props: ['personRank', 'activeSearch', 'projectYear', 'tableData', 'thead', "noShowTableHead"],
    data() {
      return {
        title: '',
        classOption: {
          step: 0.1, // 数值越大速度滚动越快
          limitMoveNum: 9, // 开始无缝滚动的数据量 this.dataList.length
          hoverStop: true, // 是否开启鼠标悬停stop
          direction: 1, // 0向下 1向上 2向左 3向右
          openWatch: true, // 开启数据实时监控刷新dom
          singleHeight: 0, // 单步运动停止的高度(默认值0是无缝不停止的滚动) direction => 0/1
          singleWidth: 0, // 单步运动停止的宽度(默认值0是无缝不停止的滚动) direction => 2/3
          waitTime: 1000 // 单步运动停止的时间(默认值1000ms)
        }
      }
    },
    watch: {
      activeSearch() {
        this.initTitle()
      }
    },
    computed: {
      rankList() {
        return this.personRank
      }
    },
    mounted() {
      this.initTitle()
    },
    methods: {

      initTitle() {
        const projectYear = this.projectYear
        const activeSearch = this.activeSearch
        let title = ''
        if (activeSearch && activeSearch == 'year') {
          title = moment(projectYear).format('YYYY') + '年' + title
        } else if (activeSearch && activeSearch == 'month') {
          title = moment(projectYear).format('YYYY-MM') + '月' + title
        }
        this.title = title + '签约转化率'
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "src/style/variable";

  .rank {
    position: relative;
    z-index: 9999;
    height: $tableH;

    .seamless-warp {
      position: relative;
      height: calc(#{$tableH} - #{$tableTitle});
      overflow: hidden;
    }

    .itemTitle {
      height: $tableTitle;
      border-bottom: 1px solid #27c1de;
      line-height: 1.5;
    }

    .item {
      padding: 0px;
      margin: 0px;
      color: #f7f210;
      text-align: center;
      font-size: 0.9rem;
    }

    ul {
      list-style: none;

      li {
        padding: 5px 0px;

        &:nth-child(2n) {
          color: #fff;
        }
      }
    }

    .rankT {
      display: inline-block;
      width: 10%;
    }

    .name {
      width: 25%;
      display: inline-block;
    }

    .count {
      width: 20%;
      display: inline-block;
    }

    .company {
      width: 25%;
      display: inline-block;
    }

    .area {
      width: 20%;
      display: inline-block;
    }
  }

  .value {
    padding-top: 6px;
  }
</style>