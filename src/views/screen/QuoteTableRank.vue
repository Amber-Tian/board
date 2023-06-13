<template>
  <div class="rank  boxSizing">
    <!--    表格头-->
    <ul :class="{itemTitleScroll:hasScroll,ul:true, itemTitle:true}">
      <div class="jianju" v-show="hasScroll"></div>
      <li style="opacity: 0.7;color: #fff;height: 100%">
        <span v-for="item in tableColumn" :key="item.prop" :style="{width:((100/tableColumn.length)+'%')}" class="title">{{item.label}}</span>
      </li>
    </ul>
    <!--    表格内容-->
    <div class="scrollContainer" ref="scrollContainerRef" @mouseenter="hoverTable(true)" @mouseleave="hoverTable(false)">
      <div id="seamless-warp" ref="vueSeamlessRef" class="myScroll">
        <ul class="ul body_content" ref="tbodyUl">
          <li :class="{lastLi:index==tableData.length-1, hoverClass: trHoverColor}" v-for="(item,index) in tableData" :key="'person'+index" @click="rowClickHandle(index)">
            <span :style="{width:(100/tableColumn.length)+'%'}" class="content" v-for="column in tableColumn" :key="column.prop+index">
              <span class="content_content" :title="item[column.prop]">{{item[column.prop]}}</span>
            </span>
          </li>
        </ul>
      </div>
      <div v-if="tableData.length === 0 && !hideEmpty" class="empty"><slot>暂无数据</slot></div>
    </div>
  </div>
</template>

<script>
  import config from '@/api/config'
  import { myApp } from '@/api/app'
  import commonMethod from '@/api/commonMethod'
  import moment from 'moment'

  export default {
    name: 'CountPage',
    props: ['tableData', 'tableColumn', 'autoScroll', 'preventBrank', 'trHoverColor', 'highlightCurrentRow', 'hideEmpty'],
    data() {
      return {
        hasScroll: false,  //是否有滚动条
        classOption: {
          step: 5, // 数值越小速度滚动越快,不建议太大，太大会发生卡顿 
          distance: 1 // 单次滚动距离
        },
        timer: null,
      }
    },
    watch: {
      // 监听父组件是否勾选了允许表格自动滚动
      autoScroll(val) {
        val ? this.startMove() : this.stopMove()
      },

      // window.onresize后出现滚动条
      hasScroll(val) {
        val ? this.startMove() : this.stopMove()
      },

      tableData() {
        this.$nextTick(() => {
          this.hasScroll = this.$refs.scrollContainerRef.offsetHeight < this.$refs.vueSeamlessRef.offsetHeight
        })
      }
    },
    computed: {

    },
    mounted() {
      window.addEventListener('resize', () => this.hasScroll = this.$refs.scrollContainerRef.offsetHeight < this.$refs.vueSeamlessRef.offsetHeight)
    },
    methods: {
      // 鼠标移到表格
      hoverTable(val) {
        val ? this.stopMove() : this.startMove()
      },
      
      startMove() {
        if(this.hasScroll && this.autoScroll) {
          const _this = this
          this.stopMove()
          this.timer = setInterval(() => {
            if(_this.$refs.scrollContainerRef.scrollTop >= _this.$refs.vueSeamlessRef.offsetHeight-_this.$refs.scrollContainerRef.offsetHeight) {
              !(this.$parent.loadNext && this.$parent.loadNext()) && (_this.$refs.scrollContainerRef.scrollTop = 0)
            }
            _this.$refs.scrollContainerRef.scrollTop += _this.classOption.distance
          }, _this.classOption.step * 10)
        }
      },

      stopMove() {
        this.timer && clearInterval(this.timer)
      },

      rowClickHandle(index) {
        if(this.highlightCurrentRow) {
          const preRow = document.querySelector('.highlight-current-row')
          const currentRow = this.$refs.tbodyUl.querySelectorAll('li')[index]
          preRow?.classList.remove('highlight-current-row')
          currentRow.classList.add('highlight-current-row')
        }
        this.$emit('rowClick', index)
      }
    },
  }
</script>

<style lang="scss" scoped>
  @import "src/style/variables";
  $tableTitle: 2.2rem;

  .rank {
    position: relative;
    z-index: 9999;
    height: 100%;
    box-sizing: border-box;
    color: #fff;


    .itemTitle {
      position: relative;
      height: $tableTitle;
      line-height: $tableTitle;
      background-image: linear-gradient(transparent, $borderColor 99%);
      width: 100%; //有滚动条时的宽度

      .jianju {
        position: absolute;
        right: -$scrollW;
        width: $scrollW;
        height: 100%;
        overflow: hidden;
        border: 1px solid $borderColor;
        background-image: linear-gradient(transparent, $borderColor 99%);
        box-sizing: border-box;
      }

      span {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      li,
      .title {
        height: 100%;
      }

      .title {
        border: 1px solid $borderColor;
        border-left: none;
      }
    }

    .itemTitleScroll {
      width:calc(100% - #{$scrollW}); //有滚动条时的宽度 

      li .title:first-child {
        border-left: 1px solid $borderColor;
      }
    }

    .ul {
      padding: 0px;
      margin: 0px;
      text-align: center;
      font-size: 0.9rem;

      .hoverClass:hover {
        background-color: $trHoverColor;
        transition: background-color .8s;
      }

      .highlight-current-row {
        background-color: $highlightCurrentRow;
      }
    }

    ul,
    li {
      list-style: none;
    }

    .scrollContainer {
      position: relative;
      height: calc(100% - #{$tableTitle});
      overflow: hidden;
      overflow-y: auto;
      /* width: calc(100% + 15px) !important; */
      .empty {
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        width: 100%;
        height: 20%;
        border: 1px solid $borderColor;
        color: #909399;
      }
    }

    #seamless-warp {
      transform: translate(0px, 0px);
      position: absolute;
      width: 100%;
      left: 0px;
      top: 0px;
      overflow: hidden;
      width: 100%;
    }



    .title,
    .content {
      box-sizing: border-box;
      display: inline-block;
    }

    .content {
      padding: 5px 0px;
      height: 100%;
      border-bottom: 1px solid $borderColor;
      border-right: 1px solid $borderColor;

      &:first-child {
        border-left: 1px solid $borderColor;
      }

      span {
        display: inline-block;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        width: 100%;
        text-align: center;
        padding: 0px 2px;
        height: 19px;
      }
    }

  }
</style>